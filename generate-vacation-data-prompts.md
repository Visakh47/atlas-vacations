# LLM Prompts for CSV Data Generation

## What is this file?

Adding a new vacation to The Atlas of VB involves populating up to four CSV/JSON data files: `itinerary.csv`, `budget.csv`, `fixed_costs.csv`, and `vacations.csv`. Writing these by hand from raw travel notes is tedious and error-prone.

This file contains copy-paste prompts designed to be used with any capable LLM (Claude, GPT-4, etc.). You dump your raw notes into the prompt and get back correctly formatted CSV rows that match the exact schema this project expects — ready to paste straight into the data files.

**Typical workflow:**
1. Take photos of receipts, export your Notes app, or just type a rough day-by-day list.
2. Pick the relevant prompt below.
3. Fill in the bracketed placeholders and paste your raw input.
4. Copy the output directly into the corresponding CSV file under `public/data/vacations/[id]/`.

---

## Prompt 1 — Itinerary CSV Generator

Use this to convert raw day notes (bullet points, photos captions, diary entries) into `itinerary.csv` rows.

```
You are a travel data formatter. Convert the raw day notes below into itinerary.csv rows.

SCHEMA (header row):
day_number,date,time,place_name,category,sub_category,description,cost_amount,cost_currency,rating,notes,highlight

RULES:
- day_number: integer from the DAY label
- date: use format YYYY-MM-DD derived from vacation start date + (day_number - 1)
- time: use HH:MM format (24h). If a range like "4:30-5" is given, use start time "04:30"
- place_name: extract the name of the place or activity (be concise, 3–6 words)
- category: use exactly one of: food, transport, accommodation, activities, shopping, wellness, sightseeing, nightlife, other
- sub_category: a more specific tag from the options below, or invent a short lowercase one if none fit
  food: coffee, meals, snacks, drinks
  transport: taxi, scooter, ferry, flight, train, bus, fuel
  accommodation: villa, hotel, hostel, apartment
  activities: atv, rafting, trekking, beach, temple, sightseeing, entertainment, snorkelling, diving, cycling
  shopping: clothing, souvenirs, pharmacy, electronics, minimart
  wellness: spa, massage, gym
  sightseeing: temple, viewpoint, museum, market, nature
  nightlife: bar, club, entertainment
  other: misc
- description: write a vivid 1–2 sentence description of what this activity/place involves
- cost_amount: 0 if not mentioned or if cost is in fixed_costs
- cost_currency: use the currency code provided (e.g. IDR, SGD, JPY)
- rating: 0 (unrated) unless explicitly specified
- notes: any parenthetical or extra context from the raw input (e.g. "Accommodation in fixed costs")
- highlight: true if this is a memorable/flagship experience (sunset viewpoint, famous restaurant, unique activity, iconic landmark); false otherwise

OUTPUT: Only the CSV rows, no explanation. Include the header row first.

VACATION START DATE: [USER PROVIDES e.g. 2024-07-15]
CURRENCY: [USER PROVIDES e.g. IDR]

RAW INPUT:
[PASTE RAW DAY NOTES HERE]
```

---

## Prompt 2 — Budget CSV Generator

Use this to convert a list of expenses (receipts, memory, bank statement) into `budget.csv` rows.

```
You are a travel expense formatter. Convert the raw expense list below into budget.csv rows.

SCHEMA (header row):
day_number,date,item_name,category_id,sub_category_id,amount_total,currency,notes

CATEGORY + SUB_CATEGORY OPTIONS:
food:         coffee, meals, snacks, drinks
transport:    taxi, scooter, ferry, flight, train, bus, fuel
accommodation: villa, hotel, hostel, apartment
activities:   atv, rafting, trekking, beach, temple, sightseeing, entertainment, snorkelling, diving
shopping:     clothing, souvenirs, pharmacy, electronics, minimart
wellness:     spa, massage, gym
misc:         tips, parking, entry_fee, misc

RULES:
- day_number: integer from DAY label
- date: compute from vacation start date + (day_number - 1) — format YYYY-MM-DD
- item_name: clean up the raw item name (proper case, expand abbreviations)
- category_id + sub_category_id: pick the best match from the options above; sub_category_id must belong to the chosen category
- amount_total: always the TOTAL paid (for all people combined). Convert shorthand: 35K = 35000, 1.5M = 1500000
- currency: use the currency code provided
- notes: leave empty unless there is important context (e.g. currency conversion, what's included)

OUTPUT: Only the CSV rows, no explanation. Include the header row first.

VACATION START DATE: [USER PROVIDES e.g. 2024-07-15]
CURRENCY: [USER PROVIDES e.g. IDR]
NUMBER OF PEOPLE: [USER PROVIDES e.g. 2]

RAW INPUT:
[PASTE RAW EXPENSE LIST HERE]
```

---

## Prompt 3 — Fixed Costs CSV Generator

Use this for pre-trip expenses that don't belong to a specific day: flights, accommodation bookings, visas, travel insurance.

```
You are a travel expense formatter. Convert the pre-trip fixed costs below into fixed_costs.csv rows.

SCHEMA (header row):
item_name,category_id,sub_category_id,amount_total,currency,notes

CATEGORY + SUB_CATEGORY OPTIONS:
flights:       international, domestic
visa:          visa_on_arrival, e_visa, visa
accommodation: villa, hotel, hostel, apartment
transport:     transfer, taxi, train
insurance:     travel
misc:          misc

RULES:
- item_name: clean, descriptive name (e.g. "Return Flights - Mumbai to Bali", "Bali Visa on Arrival (x2)", "Travel Insurance (x2)")
- category_id: use "flights" for all flight costs, "visa" for entry fees, "insurance" for travel insurance
- sub_category_id: pick from the options above; must belong to the chosen category
- amount_total: always the TOTAL for all people combined. Convert shorthand: 35K = 35000, 1.5M = 1500000
- currency: use the currency code provided
- notes: any relevant detail (e.g. "per person: 500,000 IDR", "valid 30 days", "includes medical cover", currency conversion used)

OUTPUT: Only the CSV rows, no explanation. Include the header row first.

CURRENCY: [USER PROVIDES e.g. IDR]
NUMBER OF PEOPLE: [USER PROVIDES e.g. 2]

RAW INPUT:
[PASTE FIXED COST ITEMS HERE, e.g.:
Flights: 2 x ₹22,250 = ₹44,500 total
Visa on arrival: 2 x 500,000 IDR = 1,000,000 IDR
Travel insurance: ₹500 each = ₹1,000 total
]
```

---

## Prompt 4 — New Vacation Row Generator

Use this to generate the `vacations.csv` row for a brand new vacation.

```
You are a travel data formatter. Given the vacation details below, generate a single vacations.csv row (no header).

SCHEMA (output row only, no header):
id,name,country,flag_emoji,start_date,end_date,days_count,people_count,tagline,status,currency_code,currency_symbol,summary

RULES:
- id: lowercase hyphenated slug with year suffix (e.g. "tokyo-2027", "bali-2026")
- start_date / end_date: YYYY-MM-DD format; leave empty ("") for upcoming trips with no dates yet
- days_count / people_count: use 0 for upcoming trips with unknown values
- tagline: evocative 4–8 word phrase capturing the destination's essence (no personal names)
- status: always "draft" — change to "published" manually when ready; use "upcoming" for trips with no dates yet
- summary: 1–2 sentences about what makes this destination special; leave empty ("") for upcoming trips
- currency_symbol: the display symbol (e.g. "Rp" for IDR, "¥" for JPY, "€" for EUR, "S$" for SGD)

OUTPUT: The CSV row only, no explanation.

VACATION DETAILS:
Destination: [e.g. Tokyo, Japan]
Travel dates: [e.g. March 10–20, 2027 — or "TBD" for upcoming]
Number of people: [e.g. 2]
Currency: [e.g. JPY / Japanese Yen / ¥]
Brief description: [e.g. City trip — Shinjuku, Shibuya, day trip to Kyoto]
```

---

## Tips

- **Currency conversions**: If you paid in a different currency (e.g. paid in INR for something in Bali), convert to the vacation's native currency before saving, and add a note like `Converted from ₹1315 INR`.
- **Amounts**: All `amount_total` values represent the **total paid by the group**, not per-person. The app divides by `people_count` when the per-person toggle is active.
- **Itinerary vs Budget**: An activity can appear in both files — the itinerary entry captures the experience narrative, the budget entry captures the cost. Use `cost_amount: 0` in the itinerary if the cost is tracked in the budget separately.
- **Fixed vs Daily costs**: Use `fixed_costs.csv` for anything booked and paid before the trip (flights, hotels, visas, insurance). Use `budget.csv` for anything paid during the trip.
