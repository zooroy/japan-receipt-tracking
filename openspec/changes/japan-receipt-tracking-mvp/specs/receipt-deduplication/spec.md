## ADDED Requirements

### Requirement: Duplicate Receipt Detection

Before sending a receipt image to the AI analysis pipeline, the system SHALL compute a SHA-256 hash of the image bytes and compare it against hashes stored in the database.
If a matching hash is found, the system SHALL return HTTP 409 with the store name, date, and travel name of the existing receipt, and SHALL NOT proceed with AI analysis.
The system SHALL store the image hash alongside each saved receipt to enable future duplicate checks.

#### Scenario: Duplicate image uploaded

- **WHEN** user uploads an image whose SHA-256 hash already exists in the database
- **THEN** system returns HTTP 409 without calling the AI API
- **THEN** system includes the existing receipt's store name, date, and travel name in the response

#### Scenario: New image uploaded

- **WHEN** user uploads an image whose SHA-256 hash does not exist in the database
- **THEN** system proceeds with AI receipt analysis normally

#### Scenario: Hash stored on save

- **WHEN** user confirms and saves a receipt
- **THEN** the image hash SHALL be persisted in the `image_hash` column of the receipts table
- **THEN** subsequent uploads of the same image SHALL trigger HTTP 409

#### Scenario: Duplicate warning displayed to user

- **WHEN** the API returns HTTP 409
- **THEN** the UI SHALL display an error message showing the store name, date, and travel name of the duplicate receipt
- **THEN** the user SHALL NOT be able to proceed with saving
