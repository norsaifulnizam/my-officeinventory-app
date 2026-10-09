"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const text = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const n = (v: FormDataEntryValue | null, fallback = 0) => { const x = Number(v); return Number.isFinite(x) ? x : fallback; };
function refresh() { ["/inventory", "/reorder", "/requests", "/departments", "/suppliers"].forEach(revalidatePath); }
function fail(path: string, message: string): never { redirect(`${path}?error=${encodeURIComponent(message)}`); }

export async function saveItem(form: FormData) {
  const db = await createClient(); const id = text(form.get("id")); const opening = n(form.get("opening_stock"));
  const payload = { name: text(form.get("name")), item_code: text(form.get("item_code")) || null, category: text(form.get("category")) || "Stationery", unit: text(form.get("unit")) || null, opening_stock: opening, stock_received: n(form.get("stock_received")), stock_issued: n(form.get("stock_issued")), current_balance: opening + n(form.get("stock_received")) - n(form.get("stock_issued")), minimum_stock_level: n(form.get("minimum_stock_level")), expiry_date: text(form.get("expiry_date")) || null, supplier_id: text(form.get("supplier_id")) || null, unit_price: text(form.get("unit_price")) ? n(form.get("unit_price")) : null, stock_location: text(form.get("stock_location")) || null };
  if (!payload.name) fail(id ? `/inventory/${id}` : "/inventory", "Item name is required.");
  const result = id ? await db.from("items").update(payload).eq("id", id) : await db.from("items").insert(payload);
  if (result.error) fail(id ? `/inventory/${id}` : "/inventory", result.error.message); refresh(); redirect(id ? `/inventory/${id}` : "/inventory");
}
export async function deleteItem(form: FormData) { const db = await createClient(); const id = text(form.get("id")); const { count } = await db.from("stock_transactions").select("id", { count: "exact", head: true }).eq("item_id", id); if (count) fail(`/inventory/${id}`, "Items with transaction history cannot be deleted."); const { error } = await db.from("items").delete().eq("id", id); if (error) fail(`/inventory/${id}`, error.message); refresh(); redirect("/inventory"); }
export async function moveStock(form: FormData) {
  const db = await createClient(); const itemId = text(form.get("item_id")); const type = text(form.get("type")); const quantity = n(form.get("quantity")); const back = `/inventory/${itemId}`;
  if (quantity <= 0 || !["received", "issued"].includes(type)) fail(back, "Enter a valid quantity.");
  const { data: item, error: itemError } = await db.from("items").select("*").eq("id", itemId).single(); if (itemError) fail(back, itemError.message);
  if (type === "issued" && quantity > item.current_balance) fail(back, `Cannot issue more than available stock (${item.current_balance}).`);
  const received = item.stock_received + (type === "received" ? quantity : 0); const issued = item.stock_issued + (type === "issued" ? quantity : 0);
  const { error: updateError } = await db.from("items").update({ stock_received: received, stock_issued: issued, current_balance: item.opening_stock + received - issued }).eq("id", itemId);
  if (updateError) fail(back, updateError.message);
  const { error } = await db.from("stock_transactions").insert({ item_id: itemId, type, quantity, requestor: text(form.get("requestor")) || null, department: text(form.get("department")) || null, transaction_date: text(form.get("transaction_date")) || new Date().toISOString().slice(0, 10), notes: text(form.get("notes")) || null });
  if (error) fail(back, error.message); refresh(); redirect(back);
}
export async function submitRequest(form: FormData) { const db = await createClient(); const item_id = text(form.get("item_id")); const requestor = text(form.get("requestor")); const quantity = n(form.get("quantity")); if (!item_id || !requestor || quantity <= 0) fail("/requests", "Item, requestor, and a positive quantity are required."); const { error } = await db.from("requests").insert({ item_id, requestor, department: text(form.get("department")) || null, quantity, notes: text(form.get("notes")) || null }); if (error) fail("/requests", error.message); refresh(); redirect("/requests"); }
export async function setRequestStatus(form: FormData) { const db = await createClient(); const id = text(form.get("id")); const status = text(form.get("status")); const { error } = await db.from("requests").update({ status }).eq("id", id); if (error) fail("/requests", error.message); refresh(); redirect("/requests"); }
export async function fulfilRequest(form: FormData) { const db = await createClient(); const id = text(form.get("id")); const { data: request, error } = await db.from("requests").select("*").eq("id", id).single(); if (error || !request.item_id) fail("/requests", error?.message || "This request has no inventory item."); const { data: item, error: itemError } = await db.from("items").select("*").eq("id", request.item_id).single(); if (itemError) fail("/requests", itemError.message); if (item.current_balance < request.quantity) fail("/requests", `Cannot fulfil: only ${item.current_balance} available.`); const { error: updateError } = await db.from("items").update({ stock_issued: item.stock_issued + request.quantity, current_balance: item.current_balance - request.quantity }).eq("id", item.id); if (updateError) fail("/requests", updateError.message); const { error: txError } = await db.from("stock_transactions").insert({ item_id: item.id, type: "issued", quantity: request.quantity, requestor: request.requestor, department: request.department, notes: `Fulfilled request ${id}` }); if (txError) fail("/requests", txError.message); const { error: requestError } = await db.from("requests").update({ status: "fulfilled" }).eq("id", id); if (requestError) fail("/requests", requestError.message); refresh(); redirect("/requests"); }
export async function addReference(form: FormData) { const db = await createClient(); const table = text(form.get("table")); const name = text(form.get("name")); if (!name || !["departments", "suppliers"].includes(table)) fail(`/${table}`, "A name is required."); const { error } = await db.from(table).insert(table === "suppliers" ? { name, contact: text(form.get("contact")) || null } : { name }); if (error) fail(`/${table}`, error.message); refresh(); redirect(`/${table}`); }
