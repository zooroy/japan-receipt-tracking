## ADDED Requirements

### Requirement: Delete Travel

The system SHALL allow the user to delete any travel, including the currently active one.
Deleting a travel SHALL also delete all receipts associated with it, in a single transaction.
Before deletion, the system SHALL display a confirmation dialog showing the travel name and a warning that the operation cannot be undone.

#### Scenario: Delete non-active travel

- **WHEN** user clicks the delete button on a travel that is not active
- **THEN** system shows a confirmation dialog with the travel name

#### Scenario: Delete active travel

- **WHEN** user clicks the delete button on the currently active travel
- **THEN** system shows a confirmation dialog with the travel name and warning

#### Scenario: Confirm deletion

- **WHEN** user confirms deletion in the dialog
- **THEN** system deletes the travel and all its receipts in a single transaction
- **THEN** the travel no longer appears in the travel list

#### Scenario: Cancel deletion

- **WHEN** user cancels the confirmation dialog
- **THEN** system makes no changes and closes the dialog

#### Scenario: Travel not found

- **WHEN** DELETE request is made for a travel ID that does not exist
- **THEN** system returns HTTP 404
