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

The system SHALL display all of the authenticated user's travels in reverse chronological order (most recently created first), showing name, start date, end date, and whether it is the active travel.

#### Scenario: Travel list displays correctly

- **WHEN** the user navigates to the travel list page
- **THEN** the system SHALL display all travels with the active travel visually highlighted

#### Scenario: No travels exist

- **WHEN** the user has no travels
- **THEN** the system SHALL display an empty state with a prompt to create the first travel

### Requirement: Switch Active Travel

The system SHALL allow the user to switch the active travel. When a travel is set as active, the previous active travel SHALL be deactivated in the same database transaction. The dashboard and receipt list SHALL immediately reflect the newly active travel's data.

#### Scenario: User switches active travel

- **WHEN** the user selects a different travel from the TravelSwitcher
- **THEN** the system SHALL set the selected travel as active, deactivate the previous one, and reload the dashboard with the new travel's data

#### Scenario: Only one travel is active at a time

- **WHEN** travel B is set as active while travel A is active
- **THEN** travel A SHALL have `is_active = false` and travel B SHALL have `is_active = true` after the operation

##### Example: active travel switch

- **GIVEN** travels: Tokyo (`is_active = true`), Osaka (`is_active = false`)
- **WHEN** user switches to Osaka
- **THEN** Tokyo becomes `is_active = false` and Osaka becomes `is_active = true` in a single transaction

### Requirement: Travel Switcher in Navigation

The system SHALL display a TravelSwitcher component in the navigation bar showing the current active travel name. Tapping it SHALL open a dropdown listing all travels, allowing the user to switch or navigate to the travel management page.

#### Scenario: TravelSwitcher shows active travel name

- **WHEN** the user views any page with the navigation bar
- **THEN** the TravelSwitcher SHALL display the name of the currently active travel

#### Scenario: No active travel

- **WHEN** the user has no active travel (e.g., immediately after first login with no travels created)
- **THEN** the TravelSwitcher SHALL display a prompt to create a travel and block access to dashboard and receipt capture until one is created

### Requirement: Receipt Association with Active Travel

Every receipt SHALL be associated with the active travel at the time it is saved. The `travel_id` field on a receipt is non-nullable. If no active travel exists when the user attempts to add a receipt, the system SHALL redirect the user to create a travel first.

#### Scenario: Receipt saved to active travel

- **WHEN** the user confirms and saves a receipt
- **THEN** the receipt SHALL be inserted with the current active travel's `travel_id`

#### Scenario: No active travel when adding receipt

- **WHEN** the user navigates to the receipt capture page with no active travel
- **THEN** the system SHALL redirect to the travel list page (`/travels`) with an explanatory message, where the Create Travel dialog SHALL be automatically opened
