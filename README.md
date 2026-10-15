# 🌱 Murulogi

A small web app for tracking lawn mowing around our apartment building (6 apartments).
It shows when the lawn was last mowed and by which apartment, keeps a history, and lets
you add or edit entries. The interface is in Estonian.

## Tech

- React 19 + Vite
- Supabase (Postgres) for storage
- Hosted on Vercel, deployed automatically from GitHub

## Run locally

```bash
npm install
npm run dev
```

Create a `.env.local` file in the project root (it is git-ignored):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Database

Table `mowing_entries`:

| column        | type        | notes                  |
| ------------- | ----------- | ---------------------- |
| `id`          | primary key |                        |
| `apartment`   | integer     | 1-6                    |
| `mowing_date` | date        |                        |
| `created_at`  | timestamptz | defaults to `now()`    |

## Project structure

```
src/
  App.jsx               data loading/saving and page layout
  components/           MowingCard, MowingForm, HistoryList
  lib/dates.js          date helpers and formatting
  lib/apartment.js      remembers the apartment chosen on this device
  supabaseClient.js     Supabase client
  index.css             all styles
```

## Deploy

```bash
git add .
git commit -m "Describe change"
git push
```
