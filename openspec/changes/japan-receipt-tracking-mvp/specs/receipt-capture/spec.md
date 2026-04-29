## ADDED Requirements

### Requirement: Receipt Image Input

The system SHALL provide two separate image input buttons on the receipt capture dialog:
1. **Camera button**: opens the device's rear camera directly using `<input type="file" accept="image/*" capture="environment">`
2. **Gallery button**: opens the device's file/photo picker without forcing camera using `<input type="file" accept="image/*">` (no `capture` attribute)

Both buttons MUST work on mobile browsers (iOS Safari, Android Chrome). Using a single input with `capture="environment"` is explicitly forbidden as it bypasses the gallery on iOS Safari.

### Requirement: Receipt Capture Dialog

The system SHALL present the receipt capture flow as a Dialog modal (`NewReceiptDialog`) rather than a separate page navigation. The dialog SHALL be triggerable from the Navbar and from the dashboard empty state. The dialog behavior SHALL vary by state:

- **idle**: clicking outside the dialog SHALL close it; the X close button SHALL be visible
- **analyzing**: clicking outside or pressing Escape SHALL NOT close the dialog; the X close button SHALL be hidden
- **confirm**: clicking outside SHALL NOT close the dialog (`disablePointerDismissal`); pressing Escape or clicking X SHALL close it

#### Scenario: Dialog cannot be dismissed during analysis

- **WHEN** the user has submitted an image and Gemini analysis is in progress
- **THEN** clicking outside the dialog, pressing Escape, or any other dismiss action SHALL have no effect

#### Scenario: Dialog closes on successful save

- **WHEN** the user confirms and saves a receipt in the dialog
- **THEN** the dialog SHALL close and all dashboard React Query data (`queryKey: ["receipts"]`) SHALL be invalidated and re-fetched

### Requirement: Duplicate Receipt Detection

Before calling the Gemini API, the system SHALL compute a SHA-256 hash of the uploaded image buffer on the server. The hash SHALL be compared against the `image_hash` column in the `receipts` table (unique index). If a match is found, the system SHALL return HTTP 409 without calling Gemini, and the client SHALL display an error message identifying the duplicate.

#### Scenario: Duplicate image detected

- **WHEN** the user uploads an image whose SHA-256 hash matches an existing receipt's `image_hash`
- **THEN** the system SHALL return HTTP 409 with `{ store_name_zh, date, travel_name }` of the existing receipt, and the client SHALL display: "此收據已重複：{store_name_zh}（{date}）收錄於「{travel_name}」"

#### Scenario: New image passes deduplication

- **WHEN** the uploaded image hash does not match any existing receipt
- **THEN** the system SHALL proceed with Gemini analysis and include `image_hash` in the response JSON

#### Scenario: Hash stored on save

- **WHEN** the user confirms and saves the receipt
- **THEN** `image_hash` SHALL be persisted in the `receipts` table alongside the receipt data

### Requirement: AI Receipt Analysis via Gemini

The system SHALL send the receipt image as base64 to the Gemini AI API. The API Route SHALL extract the following fields:

- `store_name`: original store name (Japanese)
- `store_name_zh`: store name translated to Traditional Chinese
- `date`: transaction date (YYYY-MM-DD format)
- `total_amount`: total amount in JPY (integer, yen)
- `tax_type`: one of `reduced_8`, `standard_10`, `tax_free`, `unknown`
- `category`: one of `food`, `shopping`, `transport`, `accommodation`, `sightseeing`, `other`
- `items`: array of `{ name: string, name_zh: string, price: number }`

The image SHALL NOT be stored anywhere after analysis.

##### Example: tax type extraction

| Receipt Text | Expected tax_type |
|---|---|
| 軽減税率 8% / 食料品 | reduced_8 |
| 消費税 10% | standard_10 |
| 免税 / TAX FREE | tax_free |
| No tax information | unknown |

### Requirement: User Confirmation Before Saving

The system SHALL display a confirmation screen after AI analysis, showing all extracted fields. The user MUST be able to edit any field before saving.

#### Scenario: User confirms extracted data

- **WHEN** the user reviews the pre-filled form and taps "Save"
- **THEN** the system SHALL save the receipt with `image_hash` and close the dialog

#### Scenario: User cancels confirmation

- **WHEN** the user taps "Cancel" on the confirmation screen
- **THEN** the system SHALL discard the extracted data and return to the capture (idle) state without saving

### Requirement: Receipt Saved to Database

The system SHALL save confirmed receipt data to the `receipts` table. The TWD amount SHALL be calculated using the exchange rate fetched at the time of saving. After a successful save, the system SHALL invalidate all React Query caches with `queryKey: ["receipts"]` so the dashboard reflects the new data immediately.

#### Scenario: Receipt saved successfully

- **WHEN** the user confirms the receipt
- **THEN** the system SHALL insert a row into `receipts` (including `image_hash`) and the dashboard SHALL update without a full page reload
