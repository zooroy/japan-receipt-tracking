## ADDED Requirements

### Requirement: Receipt List Display

The system SHALL display all receipts belonging to the currently active travel in reverse chronological order (most recent first). Each list item SHALL show: store name in Traditional Chinese, total JPY amount, category, tax type, and date. Receipts from other travels SHALL NOT appear in the list.

#### Scenario: Receipts displayed for active travel only

- **WHEN** the user navigates to the receipt list page
- **THEN** the system SHALL display only receipts whose `travel_id` matches the active travel, ordered most recent first

#### Scenario: Empty receipt list

- **WHEN** the active travel has no receipts
- **THEN** the system SHALL display an empty state message with a link to the receipt capture page

### Requirement: Keyword Search

The receipt list SHALL provide a keyword search input. The system SHALL filter receipts where the store name (Japanese or Traditional Chinese) or any item name (Japanese or Traditional Chinese) contains the search term (case-insensitive).

#### Scenario: User searches by store name

- **WHEN** the user enters a keyword in the search input
- **THEN** the system SHALL display only receipts where the store name or item names contain the keyword

#### Scenario: No matching receipts

- **WHEN** the search term matches no receipts
- **THEN** the system SHALL display an empty state indicating no results found

##### Example: search matching

| Search Term | Matched Field | Result |
|---|---|---|
| "拉麵" | store_name_zh contains "拉麵" | shown |
| "一蘭" | store_name contains "一蘭" | shown |
| "コンビニ" | item name_zh contains match | shown |
| "xyz123" | no match in any field | empty state |

### Requirement: Receipt Expandable Row

Each receipt row in the list SHALL be expandable in-place. When expanded, the row SHALL reveal: items list (Japanese and Traditional Chinese name with price), total TWD amount, exchange rate used at time of saving, and notes. No separate detail page is required.

#### Scenario: User expands a receipt row

- **WHEN** the user taps a receipt row
- **THEN** the row SHALL expand inline to show items list, TWD amount, exchange rate, and notes without navigating away from the list

#### Scenario: User collapses an expanded row

- **WHEN** the user taps an already-expanded receipt row
- **THEN** the row SHALL collapse back to its summary view

### Requirement: Receipt Total Summary

The receipt list page SHALL display a summary bar showing the total JPY and TWD amounts of the currently filtered/searched receipts and the count of displayed receipts.

#### Scenario: Summary updates with search

- **WHEN** the user applies a keyword search
- **THEN** the summary bar SHALL update to reflect the totals of the currently visible receipts only
