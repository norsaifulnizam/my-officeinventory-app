# Intelligence Layer

## Messy inputs
- WhatsApp/verbal requests pasted as free text ("3 reams A4 for Sales, 2 coffee jars to pantry").
- Manual stock notes with inconsistent units.

## Auto-structure schema (JSON example)
```json
{
  "raw": "3 reams A4 for Sales dept",
  "items": [{"item_code":"A4","name":"A4 Paper","quantity":3,"unit":"ream","department":"Sales","action":"issue"}],
  "confidence": 0.82,
  "source": "request-parser",
  "review_status": "unreviewed"
}
```

## Events to track
- stock_received, stock_issued, request_submitted, request_approved, low_stock_hit, expiry_soon.

## Scoring rules (v1, rule-based numbers)
- **Reorder urgency** = (minimum_stock_level - current_balance) when <= min; rank desc by shortfall.
- **Expiry risk** = days_to_expiry; <=14 days = high, <=30 = medium.
- **Usage trend (later)** = avg issues/week vs stock on hand.

## What gets ranked
- Reorder list sorted by urgency then shortfall qty.
- Expiring-soon pantry list sorted by days to expiry.

## v1 vs later
- v1: rule-based reorder + expiry flags.
- Later: AI request parsing, usage forecasting, auto-draft reorder suggestions.
