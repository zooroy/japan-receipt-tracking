## ADDED Requirements

### Requirement: Daily Exchange Rate Fetch

The system SHALL fetch the JPY to TWD exchange rate from ExchangeRate-API once per day and cache the result. The exchange rate SHALL be stored in the `exchange_rate_cache` table keyed by date (YYYY-MM-DD).

#### Scenario: First request of the day fetches from API

- **WHEN** a receipt is being saved and no cached rate exists for today's date
- **THEN** the system SHALL call ExchangeRate-API, store the result in `exchange_rate_cache`, and use the fetched rate

#### Scenario: Subsequent requests on the same day use cache

- **WHEN** a receipt is being saved and a cached rate exists for today's date
- **THEN** the system SHALL use the cached rate without calling ExchangeRate-API

#### Scenario: ExchangeRate-API call fails

- **WHEN** ExchangeRate-API returns an error or is unreachable
- **THEN** the system SHALL use the most recent available cached rate and log a warning. If no cached rate exists, the system SHALL set `exchange_rate` to `null` and `total_amount_twd` to `null`

##### Example: caching behavior

- **GIVEN** today is 2025-05-03 and no cache entry exists for 2025-05-03
- **WHEN** the first receipt of the day is saved
- **THEN** the system SHALL fetch rate from API, store `{ date: "2025-05-03", rate: 0.218 }`, and use `0.218` for conversion

### Requirement: TWD Amount Calculation

The system SHALL calculate `total_amount_twd` by multiplying `total_amount` (JPY) by the exchange rate fetched at save time. The exchange rate used SHALL be stored alongside the receipt record.

#### Scenario: TWD amount calculated correctly

- **WHEN** a receipt with `total_amount = 1200` JPY is saved with `exchange_rate = 0.218`
- **THEN** `total_amount_twd` SHALL be stored as `262` (1200 × 0.218 = 261.6, rounded to nearest integer)

##### Example: conversion rounding

| total_amount (JPY) | exchange_rate | total_amount_twd (TWD) |
|---|---|---|
| 1200 | 0.218 | 262 |
| 430 | 0.218 | 94 |
| 3800 | 0.218 | 829 |

### Requirement: Exchange Rate Display on Dashboard

The system SHALL display the current day's JPY to TWD exchange rate on the dashboard. If today's rate is not yet cached, the system SHALL display the most recently cached rate with a note indicating the date.

#### Scenario: Today's rate displayed

- **WHEN** the user views the dashboard on a day with a cached rate
- **THEN** the system SHALL display "1¥ = NT$X.XXX" where X.XXX is today's rate
