## ADDED Requirements

### Requirement: Spending Overview Cards

The dashboard SHALL display summary cards scoped to the currently active travel, showing total JPY, total TWD, receipt count, and today's exchange rate.

#### Scenario: No receipts in active travel

- **WHEN** the active travel has no receipts
- **THEN** the system SHALL display ¥0 / NT$0 / 0 receipts

### Requirement: Dashboard Empty State

When the active travel has zero receipts, the dashboard SHALL display only a centered empty state instead of the full chart layout.

#### Scenario: Empty state shown when no receipts exist

- **WHEN** the authenticated user's active travel has no receipts
- **THEN** the dashboard SHALL display: the text "還沒有收據", a subtitle "拍攝第一張收據開始記帳吧！", and a single large "+ 新增收據" button that opens the receipt capture dialog
- **THEN** the spending overview cards, daily chart, category chart, tax type summary, and recent receipts list SHALL NOT be rendered

#### Scenario: Full dashboard shown once receipts exist

- **WHEN** the active travel has at least one receipt
- **THEN** the dashboard SHALL render the full chart layout (SpendingOverview, DailyChart, CategoryChart, TaxTypeSummary, RecentReceipts)

### Requirement: Daily Spending Trend Chart

The dashboard SHALL display a bar chart showing daily spending in JPY for each day that has receipts in the active travel.

#### Scenario: Chart renders per-day bars

- **WHEN** the active travel has receipts on multiple days
- **THEN** each day SHALL be represented as a bar with height proportional to that day's total JPY spending

##### Example: daily chart data

- **GIVEN** active travel has receipts on 2025-05-03 totaling ¥2,400 and on 2025-05-05 totaling ¥5,800
- **WHEN** the user views the dashboard
- **THEN** 2025-05-03 bar shows ¥2,400, 2025-05-04 bar shows ¥0, 2025-05-05 bar shows ¥5,800

### Requirement: Category Breakdown Donut Chart

The dashboard SHALL display a donut chart showing the percentage breakdown of total JPY spending by category.

#### Scenario: Chart shows category slices

- **WHEN** the active travel has receipts with at least two different categories
- **THEN** the donut chart SHALL display one slice per category, with each slice sized proportionally to that category's total JPY amount

### Requirement: Tax Type Summary

The dashboard SHALL display a summary panel showing the breakdown of total spending by tax type.

#### Scenario: Summary shows each tax type present

- **WHEN** the active travel has receipts with different tax types
- **THEN** the panel SHALL display a row for each tax type present, showing the label and total JPY amount

### Requirement: Recent Receipts List on Dashboard

The dashboard SHALL display the 5 most recent receipts.

#### Scenario: Recent receipts shown

- **WHEN** the user has at least one receipt
- **THEN** the system SHALL display up to 5 receipts ordered by date descending

### Requirement: Trip-Scoped Dashboard

All dashboard data SHALL be scoped to the currently active travel. Switching the active travel via the TravelSwitcher SHALL reload all dashboard data for the newly active travel.

#### Scenario: User switches travel from dashboard

- **WHEN** the user selects a different travel from the TravelSwitcher
- **THEN** all dashboard statistics and charts SHALL update to reflect only the receipts belonging to the newly active travel
