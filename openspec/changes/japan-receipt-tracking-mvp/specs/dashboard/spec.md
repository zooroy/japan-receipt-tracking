## ADDED Requirements

### Requirement: Spending Overview Cards

The dashboard SHALL display summary cards scoped to the currently active travel, showing:
- Total spending for the active travel in JPY (formatted as ¥X,XXX)
- Total spending for the active travel in TWD (formatted as NT$X,XXX)
- Total number of receipts in the active travel
- Today's JPY to TWD exchange rate

#### Scenario: Dashboard loads with active travel data

- **WHEN** an authenticated user navigates to the dashboard
- **THEN** the system SHALL display spending totals and receipt count for the currently active travel only

#### Scenario: No receipts in active travel

- **WHEN** the active travel has no receipts
- **THEN** the system SHALL display ¥0 / NT$0 / 0 receipts with an empty state message

### Requirement: Daily Spending Trend Chart

The dashboard SHALL display a bar chart showing daily spending in JPY for each day that has receipts in the active travel. Days with no spending SHALL show a bar of height 0.

#### Scenario: Daily chart renders correctly

- **WHEN** the user has receipts on multiple days in the active travel
- **THEN** the system SHALL render a bar for each calendar day within the active travel's date span, with bar height proportional to total JPY spending that day

##### Example: daily chart data

- **GIVEN** active travel has receipts on 2025-05-03 totaling ¥2,400 and on 2025-05-05 totaling ¥5,800
- **WHEN** the user views the dashboard
- **THEN** 2025-05-03 bar shows ¥2,400, 2025-05-04 bar shows ¥0, 2025-05-05 bar shows ¥5,800

### Requirement: Category Breakdown Donut Chart

The dashboard SHALL display a donut chart showing the percentage breakdown of total JPY spending by category. Categories: `food` (食事), `shopping` (購物), `transport` (交通), `accommodation` (住宿), `sightseeing` (觀光), `other` (其他).

#### Scenario: Category chart shows proportional breakdown

- **WHEN** the user has receipts across multiple categories
- **THEN** each category segment SHALL be proportional to its share of total spending, with a legend showing category name and JPY total

### Requirement: Tax Type Summary

The dashboard SHALL display a summary panel showing the breakdown of total spending by tax type: `standard_10` (10% 標準稅率), `reduced_8` (8% 軽減稅率), `tax_free` (免稅), `unknown`.

#### Scenario: Tax summary displays totals

- **WHEN** the user has receipts with different tax types
- **THEN** the system SHALL display the total JPY amount for each tax type present

### Requirement: Recent Receipts List on Dashboard

The dashboard SHALL display the 5 most recent receipts, showing store name (Traditional Chinese), total JPY amount, category, and date for each.

#### Scenario: Recent receipts shown

- **WHEN** the user has at least one receipt
- **THEN** the system SHALL display up to 5 receipts ordered by date descending, each linking to the receipt list page

#### Scenario: Empty state

- **WHEN** the user has no receipts
- **THEN** the system SHALL display an empty state with a call-to-action button linking to the receipt capture page

### Requirement: Trip-Scoped Dashboard

All dashboard data (overview cards, charts, tax summary, recent receipts) SHALL be scoped to the currently active travel. Switching the active travel via the TravelSwitcher SHALL reload all dashboard data for the newly active travel.

#### Scenario: User switches travel from dashboard

- **WHEN** the user selects a different travel from the TravelSwitcher in the navigation bar
- **THEN** all dashboard statistics and charts SHALL update to reflect only the receipts belonging to the newly active travel
