## ADDED Requirements

### Requirement: Password Login

The system SHALL provide a password login page at `/login`. The user SHALL enter a single password that is validated against the `APP_PASSWORD` environment variable. No account system or third-party OAuth is required. Upon successful validation, the system SHALL write a signed httpOnly cookie and redirect to the dashboard.

#### Scenario: Correct password entered

- **WHEN** the user submits the correct password on the login page
- **THEN** the system SHALL set a signed httpOnly cookie and redirect to `/`

#### Scenario: Incorrect password entered

- **WHEN** the user submits an incorrect password
- **THEN** the system SHALL display an inline error message and remain on the login page

#### Scenario: Empty password submitted

- **WHEN** the user submits an empty password field
- **THEN** the system SHALL display a validation error without calling the API

### Requirement: Middleware Cookie Protection

The system SHALL use Next.js middleware to verify the auth cookie on every request. All routes except `/login` and `/api/auth/login` SHALL be protected. The middleware SHALL NOT use Supabase Auth.

#### Scenario: Request with valid cookie

- **WHEN** a request arrives with a valid auth cookie
- **THEN** the middleware SHALL allow the request to proceed

#### Scenario: Request without valid cookie

- **WHEN** a request arrives without a valid auth cookie or with an expired cookie
- **THEN** the middleware SHALL redirect to `/login`

### Requirement: Sign Out

The system SHALL provide a sign-out action that clears the auth cookie and redirects to `/login`.

#### Scenario: User signs out

- **WHEN** the user clicks the sign-out button
- **THEN** the system SHALL delete the auth cookie and redirect to `/login`
