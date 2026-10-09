import { createClient } from "@/lib/supabase/server";

export type Item = {
  id: string; name: string; item_code: string | null; category: string; unit: string | null;
  opening_stock: number; stock_received: number; stock_issued: number; current_balance: number;
  minimum_stock_level: number; expiry_date: string | null; supplier_id: string | null;
  unit_price: number | null; stock_location: string | null; created_at: string;
};
export type Request = { id: string; item_id: string | null; requestor: string; department: string | null; quantity: number; status: string; notes: string | null; created_at: string; items?: { name: string } | null };

async function unwrap<T>(result: { data: T | null; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}
export async function getItems() { const db = await createClient(); return unwrap<Item[]>(await db.from("items").select("*").order("name")); }
export async function getItem(id: string) { const db = await createClient(); return unwrap<Item | null>(await db.from("items").select("*").eq("id", id).maybeSingle()); }
export async function getTransactions(itemId: string) { const db = await createClient(); return unwrap<any[]>(await db.from("stock_transactions").select("*").eq("item_id", itemId).order("transaction_date", { ascending: false })); }
export async function getSuppliers() { const db = await createClient(); return unwrap<any[]>(await db.from("suppliers").select("*").order("name")); }
export async function getDepartments() { const db = await createClient(); return unwrap<any[]>(await db.from("departments").select("*").order("name")); }
export async function getRequests() { const db = await createClient(); return unwrap<Request[]>(await db.from("requests").select("*, items(name)").order("created_at", { ascending: false })); }
