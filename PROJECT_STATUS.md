# 🌱 Murulogi - Project Status

## Purpose

Murulogi is a simple shared web application for a 6-apartment building.

The goal is to answer:

1. Who mowed the lawn last?
2. When was it mowed?
3. How many days ago was it mowed?

No scheduling, rotation logic, reminders, or fairness calculations are included.

---

## Tech Stack

Frontend:
- React
- Vite
- JavaScript

Backend:
- Supabase

Development:
- VS Code

---

## Current Features

### ✅ Latest Mowing Card

Displays:

- Apartment number
- Exact mowing date
- Automatically calculated days since mowing

Example:

Korter 3

3 päeva tagasi

20.09.2026

---

### ✅ Add Mowing Entry

Form fields:

- Korter (1-6)
- Kuupäev

Buttons:

- Salvesta
- Tühista

Data is saved to Supabase.

---

### ✅ History List

Displays mowing history ordered by:

1. mowing_date descending
2. created_at descending

Example:

20.09.2026  Korter 3
04.09.2026  Korter 2
16.08.2026  Korter 1

---

### ✅ Automatic Days Ago Calculation

Rules:

- Today => "Täna"
- 1 day => "1 päev tagasi"
- Multiple days => "X päeva tagasi"

---

### ✅ Shared Cloud Database

Using Supabase.

Table:

mowing_entries

Columns:

- id
- apartment
- mowing_date
- created_at

Example row:

{
  "id": 1,
  "apartment": 3,
  "mowing_date": "2026-09-23",
  "created_at": "2026-09-23T09:00:00Z"
}

---

## Confirmed Working

✅ React app runs locally

✅ Supabase connection works

✅ Entries can be saved

✅ Entries reload after refresh

✅ Data appears in Supabase Table Editor

✅ Latest mowing card updates automatically

✅ History loads from database

---

## Not Yet Implemented

### Edit Existing Entry

Status:

Not implemented

Planned:

- Muuda button
-