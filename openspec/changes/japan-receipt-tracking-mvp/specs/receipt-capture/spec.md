## ADDED Requirements

### Requirement: Receipt Image Input

The system SHALL provide two separate image input buttons on the receipt capture page:
1. **Camera button**: opens the device's rear camera directly using `<input type="file" accept="image/*" capture="environment">`
2. **Gallery button**: opens the device's file/photo picker without forcing camera using `<input type="file" accept="image/*">` (no `capture` attribute)

Both buttons MUST work on mobile browsers (iOS Safari, Android Chrome). Using a single input with `capture="environment"` is explicitly forbidden as it bypasses the gallery on iOS Safari.

#### Scenario: User opens camera on mobile

- **WHEN** the user taps the camera button on a mobile device
- **THEN** the system SHALL open the device's rear camera directly (environment-facing)

#### Scenario: User uploads an existing image

- **WHEN** the user taps the gallery button
- **THEN** the system SHALL open the photo library picker, allowing the user to select an existing image

### Requirement: AI Receipt Analysis via Gemini

The system SHALL send the receipt image as base64 to the Gemini 2.0 Flash API. The API Route SHALL extract the following fields from the receipt:

- `store_name`: original store name (Japanese)
- `store_name_zh`: store name translated to Traditional Chinese
- `date`: transaction date (YYYY-MM-DD format, infer from receipt or use current date)
- `total_amount`: total amount in JPY (integer, yen)
- `tax_type`: one of `reduced_8` (軽減税率 8%), `standard_10` (標準税率 10%), `tax_free` (免税), `unknown`
- `category`: inferred spending category — one of `food`, `shopping`, `transport`, `accommodation`, `sightseeing`, `other`
- `items`: array of `{ name: string, name_zh: string, price: number }` representing line items

The image SHALL NOT be stored anywhere after analysis.

#### Scenario: Successful receipt analysis

- **WHEN** the user submits a clear receipt image
- **THEN** the system SHALL return structured JSON with all required fields populated

#### Scenario: Ambiguous or missing total amount

- **WHEN** Gemini cannot confidently determine the total amount
- **THEN** the system SHALL return `total_amount: 0` and the user MUST manually enter the correct amount on the confirmation page

#### Scenario: Non-receipt image submitted

- **WHEN** the user submits an image that is not a receipt
- **THEN** the system SHALL return an error message instructing the user to submit a valid receipt image

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
- **THEN** the system SHALL save the receipt to the database and redirect to the dashboard or receipt list

#### Scenario: User edits a field before saving

- **WHEN** the user modifies any extracted field on the confirmation screen
- **THEN** the system SHALL save the corrected value, not the original AI output

#### Scenario: User cancels confirmation

- **WHEN** the user taps "Cancel" on the confirmation screen
- **THEN** the system SHALL discard the extracted data and return to the capture page without saving

### Requirement: Receipt Saved to Database

The system SHALL save confirmed receipt data to the `receipts` table in Supabase PostgreSQL with the authenticated user's ID. The TWD amount SHALL be calculated using the exchange rate fetched at the time of saving.

#### Scenario: Receipt saved successfully

- **WHEN** the user confirms the receipt
- **THEN** the system SHALL insert a row into the `receipts` table and display a success notification
