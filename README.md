# The Atlas of VB

A personal travel journal built as a web app — beautifully documenting vacations with full itineraries and granular budget breakdowns. Each destination gets its own page, its own story, and its own data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, SSG + Client Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design system |
| UI Components | shadcn/ui |
| Charts | Recharts |
| CSV Parsing | PapaParse |
| Icons | Lucide React |
| Fonts | Playfair Display (display) · Inter (body) |

---

## Project Structure

```
vacations-project/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, design tokens, metadata
│   ├── globals.css                 # Global styles & Atlas CSS variable definitions
│   ├── page.tsx                    # Landing page — all vacations
│   ├── not-found.tsx               # Global 404
│   └── [vacation]/                 # Dynamic routes per vacation
│       ├── layout.tsx              # Vacation layout (generateStaticParams)
│       ├── page.tsx                # Vacation overview
│       ├── itinerary/
│       │   └── page.tsx            # Day-by-day itinerary viewer
│       └── budget/
│           └── page.tsx            # Budget breakdown + charts
│
├── components/
│   ├── ui/                         # shadcn base components
│   ├── shared/                     # App-wide reusables
│   │   ├── CategoryBadge.tsx
│   │   ├── RatingStars.tsx
│   │   └── LoadingSpinner.tsx
│   ├── landing/
│   │   ├── VacationCard.tsx        # Card on homepage grid
│   │   └── VacationGrid.tsx        # Sorted grid of all vacations
│   ├── vacation/
│   │   └── NavigationCards.tsx     # Itinerary + Budget nav cards
│   ├── itinerary/
│   │   ├── DayTabs.tsx             # Mobile sticky day selector
│   │   ├── DaySidebar.tsx          # Desktop day list sidebar
│   │   ├── DayView.tsx             # Day content (activities + highlights)
│   │   ├── ActivityCard.tsx        # Single timeline entry
│   │   └── HighlightCard.tsx       # Accented highlight card
│   └── budget/
│       ├── BudgetToggle.tsx        # Per-person / Total toggle
│       ├── CurrencyToggle.tsx      # Native / converted toggle
│       ├── ViewModeSelector.tsx    # Categories / By Day / All Items
│       ├── KeyMetricsRow.tsx       # Key metrics summary
│       ├── SpendDonutChart.tsx     # Recharts donut chart
│       ├── SpendByDayBarChart.tsx  # Recharts bar chart by day
│       ├── CategoryBreakdownCard.tsx # 3-level expandable: category → subcategory → line items
│       ├── BudgetDayView.tsx       # Day-level spend breakdown
│       └── FixedCostsSection.tsx   # Pre-trip fixed costs
│
├── hooks/
│   ├── useVacations.ts             # All vacations from CSV
│   ├── useVacation.ts              # Single vacation by ID
│   ├── useItinerary.ts             # Itinerary days + highlights
│   ├── useBudget.ts                # Budget entries + computeMetrics()
│   ├── useFixedCosts.ts            # Fixed cost entries
│   └── useCategories.ts            # Category + subcategory taxonomy
│
├── lib/
│   ├── csv-fetcher.ts              # fetchCSV<T>() and fetchJSON<T>() with caching
│   ├── cache-manager.ts            # In-memory singleton cache (5 min TTL)
│   ├── constants.ts                # Data paths + cache TTL
│   ├── currency-utils.ts           # Formatting, abbreviation, conversion
│   ├── date-utils.ts               # formatDate, formatDateRange, formatTime
│   └── utils.ts                    # clsx + tailwind-merge
│
├── types/
│   ├── vacation.ts                 # Vacation interface
│   ├── budget.ts                   # BudgetEntry, FixedCostEntry, BudgetMetrics, etc.
│   ├── itinerary.ts                # ItineraryEntry, ItineraryDay
│   └── category.ts                 # Category, SubCategory
│
└── public/data/
    ├── vacations.csv               # All vacation metadata
    ├── lookup/
    │   ├── categories.csv          # Spending categories
    │   └── category_breakdown.csv  # Subcategory taxonomy
    └── vacations/
        └── [vacation-id]/
            ├── budget.csv          # Daily expenses
            ├── fixed_costs.csv     # Pre-trip expenses (flights, hotels, etc.)
            └── itinerary.csv       # Day-by-day activities
```

---

## Architecture

### Data Flow

All data lives as CSV and JSON files under `public/data/`. There is no database, no API, no backend. Everything is flat files.

```
public/data/*.csv
       │
       ▼
lib/csv-fetcher.ts  ──→  PapaParse  ──→  lib/cache-manager.ts
                                                │
                                                ▼
                                         hooks/use*.ts
                                                │
                                                ▼
                                         Page Components
```

**Server-side** (at build time):
- `app/page.tsx` reads `vacations.csv` with Node's `fs.readFileSync` + PapaParse
- `app/[vacation]/page.tsx` does the same to validate the vacation exists and is published

**Client-side** (in the browser):
- Itinerary and Budget pages are Client Components
- They call hooks (`useItinerary`, `useBudget`, etc.) which call `fetchCSV()` via HTTP
- Results are cached in memory for 5 minutes per URL

### Static Generation

`app/[vacation]/layout.tsx` exports `generateStaticParams()` which reads `vacations.csv` and returns all `published` vacation IDs. Every vacation page is pre-rendered at build time — no server needed at runtime.

### Budget Computation

`useBudget()` calls `computeMetrics(entries, fixedCosts, categories, subCategories, peopleCount)` which:

1. Iterates all daily `BudgetEntry[]` and `FixedCostEntry[]` through a shared `addToMaps()` helper
2. Builds three maps in one pass: `catMap` (category → total), `subCatMap` (category → subcategory → total), `subCatItemsMap` (category → subcategory → line items)
3. Computes percentages relative to `grand_total` (daily + fixed combined)
4. Returns a `BudgetMetrics` object with `categories_summary[]`, `days_summary[]`, per-person amounts, highest-spend day, top category, and more

### Currency Handling

All monetary values in CSV files are stored in the **vacation's native currency** (e.g. IDR for Bali). Any amounts paid in a foreign currency are pre-converted before being saved to the CSV.

The `CurrencyToggle` lets the viewer flip the display to a home currency (INR). Conversion is applied at render time via `currency-utils.ts`. Conversion rates live in `CURRENCY_CONVERSIONS` in that file.

---

## Design System: Atlas

All styling uses a custom set of CSS custom properties defined in `app/layout.tsx` (the canonical source) and mirrored in `app/globals.css`. Every component references these — never hardcoded hex values.

### Parchment Palette (current)

```css
--a-bg:       #FDFAF5   /* Page background — warm ivory          */
--a-surface:  #F7F2EA   /* Card / panel surface                  */
--a-raised:   #EEE5D5   /* Elevated element / hover state        */
--a-border:   #DDD4C0   /* Default border                        */
--a-border2:  #C4B49A   /* Active / focus border                 */
--a-accent:   #B45309   /* Amber accent — use sparingly          */
--a-accent2:  #D97706   /* Softer amber                          */
--a-text:     #1C1410   /* Primary text — warm near-black        */
--a-muted:    #7C6D5A   /* Secondary / supporting text           */
--a-dim:      #C4B49A   /* Very muted text / placeholders        */
```

To change the palette sitewide, update the `designTokens` string in `app/layout.tsx` **and** the matching `:root` block in `app/globals.css`.

### Typography

- **Display** — `Playfair Display` (serif) — destination names, page titles, hero text. Use via `.font-display` class or `fontFamily: 'var(--font-display)'`.
- **Body** — `Inter` (sans-serif) — all UI, labels, metadata, body copy. Default on `<body>`.

Fluid type sizing uses `clamp()` — e.g. `fontSize: 'clamp(4.5rem, 12vw, 11rem)'` for the destination name on vacation pages.

---

## Data Schemas

### `public/data/vacations.csv`

| Column | Type | Description |
|---|---|---|
| `id` | string | Unique slug — matches the folder name under `public/data/vacations/` |
| `name` | string | Destination name |
| `country` | string | Country name |
| `flag_emoji` | string | Flag emoji |
| `start_date` | YYYY-MM-DD | Trip start |
| `end_date` | YYYY-MM-DD | Trip end |
| `days_count` | number | Total days |
| `people_count` | number | Number of travellers |
| `tagline` | string | Short descriptor shown on cards |
| `status` | `published` \| `draft` \| `view_only` \| `upcoming` | Only `published` vacations have accessible routes. `view_only` shows a full card with no link. `upcoming` appears in a separate section with no dates. |
| `currency_code` | string | ISO code (e.g. `IDR`) |
| `currency_symbol` | string | Display symbol (e.g. `Rp`) |
| `summary` | string | Long paragraph shown on the vacation overview page |

### `public/data/lookup/categories.csv`

| Column | Type | Description |
|---|---|---|
| `category_id` | string | Unique key (e.g. `food`, `flights`) |
| `category_name` | string | Display name |
| `emoji` | string | Category emoji |
| `hex_color` | string | Color used in charts and badges |

### `public/data/lookup/category_breakdown.csv`

| Column | Type | Description |
|---|---|---|
| `parent_category_id` | string | References `categories.csv` |
| `sub_category_id` | string | Unique subcategory key |
| `sub_category_name` | string | Display name |
| `emoji` | string | Subcategory emoji |

### `vacations/[id]/budget.csv`

| Column | Type | Description |
|---|---|---|
| `day_number` | number | Day of trip (1-indexed) |
| `date` | YYYY-MM-DD | Calendar date |
| `item_name` | string | Expense description |
| `category_id` | string | References `categories.csv` |
| `sub_category_id` | string | References `category_breakdown.csv` |
| `amount_total` | number | Amount in vacation's native currency |
| `currency` | string | Should match `currency_code` in `vacations.csv` |
| `notes` | string | Optional note |

### `vacations/[id]/fixed_costs.csv`

Pre-trip expenses (flights, accommodation, visa, insurance) — same shape as `budget.csv` but without `day_number` and `date`.

| Column | Type | Description |
|---|---|---|
| `item_name` | string | Expense description |
| `category_id` | string | e.g. `flights`, `accommodation`, `visa`, `insurance` |
| `sub_category_id` | string | e.g. `international`, `villa`, `visa_on_arrival` |
| `amount_total` | number | Amount in vacation's native currency |
| `currency` | string | Currency code |
| `notes` | string | Optional note |

### `vacations/[id]/itinerary.csv`

| Column | Type | Description |
|---|---|---|
| `day_number` | number | Day of trip (1-indexed) |
| `date` | YYYY-MM-DD | Calendar date |
| `time` | HH:MM | 24-hour time |
| `place_name` | string | Location or activity name |
| `category` | string | Category ID for emoji/color lookup |
| `sub_category` | string | Descriptive tag (e.g. `temple`, `waterfall`) |
| `description` | string | Narrative description of the activity |
| `cost_amount` | number | Cost in `cost_currency` (0 if free) |
| `cost_currency` | string | Currency code |
| `rating` | number | 0–5 stars |
| `notes` | string | Optional extra notes |
| `highlight` | `true` \| `false` | Whether this is a trip highlight (shown prominently) |

---

## How to Add a New Vacation

### 1. Add a row to `vacations.csv`

```csv
tokyo-2027,Tokyo,Japan,🇯🇵,2027-03-10,2027-03-20,10,2,Neon lights and ramen at midnight,draft,JPY,¥,10 days in Tokyo...
```

Set `status` to `draft` while building it out — it appears on the landing page with a "Coming soon" badge but its routes won't be accessible.

### 2. Create the data directory

```
public/data/vacations/tokyo-2027/
├── budget.csv
├── fixed_costs.csv
└── itinerary.csv
```

### 3. Add the currency (if new)

In `lib/currency-utils.ts`, add to `CURRENCY_CONVERSIONS`:

```ts
JPY: { code: 'INR', symbol: '₹', rate: 1 / 1.9 },
```

Add to `NO_DECIMALS` if it shouldn't show decimal places.

### 4. Add new categories if needed

Append to `public/data/lookup/categories.csv`:

```csv
nightlife,Nightlife,🍸,#6C5CE7
```

And any subcategories to `category_breakdown.csv`:

```csv
nightlife,bar,Bar,🍻
nightlife,club,Club,🎵
```

### 5. Fill in `budget.csv`

One row per expense. All amounts in the vacation's native currency:

```csv
1,2027-03-10,Narita Express to Shinjuku,transport,train,3070,JPY,
1,2027-03-10,Ichiran Ramen - Shibuya,food,meals,980,JPY,Solo ramen booth experience
```

### 6. Fill in `fixed_costs.csv`

Pre-trip expenses that don't belong to a specific day:

```csv
Return Flights - India to Tokyo (x2),flights,international,180000,INR,
Hotel - Shinjuku 8 nights,accommodation,hotel,95000,INR,
Japan Visa (x2),visa,visa_on_arrival,6000,INR,
Travel Insurance (x2),insurance,travel,2000,INR,
```

If your vacation currency differs from what you paid in, convert to the vacation currency before saving.

### 7. Fill in `itinerary.csv`

One row per activity, ordered by day and time:

```csv
1,2027-03-10,14:00,Narita International Airport,transport,arrival,"Landed in Tokyo after a long flight.",3070,JPY,0,,false
1,2027-03-10,18:30,Shinjuku Golden Gai,food,bar,"Tiny bars from a different era. Whisky sour and new friends.",500,JPY,5,,true
```

### 8. Publish

Change `status` from `draft` to `published` in `vacations.csv`. The vacation will be fully accessible on the next build.

---

## Generating Data with an LLM

Populating the CSV files from raw travel notes by hand is tedious. [`generate-vacation-data-prompts.md`](./generate-vacation-data-prompts.md) contains four copy-paste prompts — one per data file — that you can drop into any capable LLM (Claude, GPT-4, etc.) to convert rough notes into correctly-formatted CSV rows in one pass.

| Prompt | Output |
|---|---|
| Prompt 1 — Itinerary Generator | `itinerary.csv` rows from day notes |
| Prompt 2 — Budget Generator | `budget.csv` rows from expense lists |
| Prompt 3 — Fixed Costs Generator | `fixed_costs.csv` rows from pre-trip bookings |
| Prompt 4 — Vacation Row Generator | `vacations.csv` row for a new destination |

---

## Running Locally

```bash
npm install
npm run dev        # → http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

---

## Key Design Decisions

**Why flat CSV files?**
No backend, no database, no auth. The data is personal, small, and append-only. CSVs are easy to edit in any spreadsheet app, diff in git, and deploy anywhere.

**Why store all amounts in the vacation currency?**
Keeps the data layer single-currency and clean. Conversion to a home currency is a display-time concern handled by `currency-utils.ts`. Pre-convert any amounts paid in other currencies before saving.

**Why are design tokens in both `layout.tsx` and `globals.css`?**
`layout.tsx` injects tokens via an inline `<style>` tag with `precedence="high"` — this ensures tokens are available immediately, before the CSS file hydrates. `globals.css` mirrors the same values for completeness. **When changing the palette, update both.**

**Why `transpilePackages: ['papaparse']`?**
PapaParse ships as CommonJS. Without this setting, importing it into a Next.js Server Component (which runs in ESM mode) throws `require is not defined`.
