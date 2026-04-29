## ADDED Requirements

### Requirement: Create Travel

The system SHALL allow the authenticated user to create a new travel via a shadcn/ui Dialog (modal) opened from the travel list page. The form SHALL include a name field (required) and optional start and end dates. No separate page route is needed for travel creation. Upon creation, if no other active travel exists, the new travel SHALL automatically be set as active.

#### Scenario: User creates first travel

- **WHEN** the user submits the Create Travel dialog with a name and no active travel exists
- **THEN** the system SHALL create the travel with `is_active = true`, close the dialog, and redirect to the dashboard

#### Scenario: User creates additional travel

- **WHEN** the user submits the Create Travel dialog and another travel is already active
- **THEN** the system SHALL create the new travel with `is_active = false`, close the dialog, and refresh the travel list

#### Scenario: Travel name is required

- **WHEN** the user submits the Create Travel dialog without a name
- **THEN** the system SHALL display an inline validation error and keep the dialog open

### Requirement: Travel List

The system SHALL display all travels in reverse chronological order (most recently created first), showing name, start date, end date, and whether it is the active travel. Each travel card SHALL be clickable.

#### Scenario: Clicking active travel card

- **WHEN** the user clicks the card of the currently active travel
- **THEN** the system SHALL navigate to the dashboard (`/`)

#### Scenario: Clicking inactive travel card

- **WHEN** the user clicks the card of an inactive travel
- **THEN** the system SHALL switch that travel to active and navigate to the dashboard (`/`)

#### Scenario: No travels exist

- **WHEN** the user has no travels
- **THEN** the system SHALL display an empty state with a prompt to create the first travel

### Requirement: Switch Active Travel

The system SHALL allow the user to switch the active travel. When a travel is set as active, the previous active travel SHALL be deactivated in the same database transaction. The dashboard and receipt list SHALL immediately reflect the newly active travel's data.

#### Scenario: Only one travel is active at a time

- **WHEN** travel B is set as active while travel A is active
- **THEN** travel A SHALL have `is_active = false` and travel B SHALL have `is_active = true` after the operation

##### Example: active travel switch

- **GIVEN** travels: Tokyo (`is_active = true`), Osaka (`is_active = false`)
- **WHEN** user switches to Osaka
- **THEN** Tokyo becomes `is_active = false` and Osaka becomes `is_active = true` in a single transaction

### Requirement: Delete Travel

The system SHALL allow the user to delete any travel that is NOT currently active. Deleting a travel SHALL cascade-delete all associated receipts. The currently active travel SHALL NOT be deletable.

#### Scenario: Delete non-active travel

- **WHEN** the user clicks the delete button on a non-active travel and confirms the dialog
- **THEN** the system SHALL delete the travel and all its receipts in a single transaction and refresh the list

#### Scenario: Attempt to delete active travel

- **WHEN** a DELETE request is sent for the currently active travel
- **THEN** the API SHALL return HTTP 400 with an error message stating the travel is in use

#### Scenario: Confirmation dialog shown before deletion

- **WHEN** the user taps the delete icon on a non-active travel
- **THEN** the system SHALL show a confirmation dialog displaying the travel name and a warning that all receipts will also be deleted

### Requirement: Travel Switcher in Navigation

The system SHALL display a TravelSwitcher component in the navigation bar showing the current active travel name. Tapping it SHALL open a dropdown listing all travels, allowing the user to switch or navigate to the travel management page.

### Requirement: Travel Management Navigation Link

The system SHALL display a navigation link (MapPin icon button) in the Navbar, positioned to the right of the app logo, that navigates to the travel list page (`/travels`).

#### Scenario: MapPin icon visible on all protected pages

- **WHEN** the authenticated user views any page with the Navbar
- **THEN** the MapPin icon button SHALL be visible and navigate to `/travels` when clicked

### Requirement: Receipt Association with Active Travel

Every receipt SHALL be associated with the active travel at the time it is saved. The `travel_id` field on a receipt is non-nullable. If no active travel exists when the user attempts to add a receipt, the system SHALL redirect the user to create a travel first.

#### Scenario: No active travel when adding receipt

- **WHEN** the user navigates to the receipt capture page with no active travel
- **THEN** the system SHALL redirect to `/travels` with the Create Travel dialog automatically opened
