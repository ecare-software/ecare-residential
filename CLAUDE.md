# eCare Residential — CLAUDE.md

Residential care facility management system (Node/Express + React monolith). Staff use it to submit forms, track client health, log incidents, manage training, and send messages across multiple residential homes.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Server | Express 4 |
| Database | MongoDB Atlas via Mongoose 5 (DB name: `RCS`) |
| Frontend | React 16 (class components), React Router DOM v5 |
| UI | React Bootstrap + Reactstrap |
| HTTP client | Axios |
| Auth | Custom cookie-based (no JWT/Passport/sessions) |
| Email | Nodemailer + Gmail SMTP |
| File upload | Multer → local `/uploads` directory |
| Payments | Coinbase Commerce |
| Signatures | react-signature-canvas (stored as Array in Mongo) |
| Charts | Recharts |

---

## Entry Points

- **Server:** `bin/www` → starts HTTP server on port 3001 (`process.env.PORT`)
- **App config:** `app.js` — mounts all routes, connects Mongoose, serves React build in production
- **DB credentials:** `config/keys.js` (hardcoded — do not commit new secrets here)
- **Frontend:** `client/src/App.js` — class component, owns top-level state

---

## Running Locally

```bash
# Both servers concurrently (backend :3001, frontend :3000)
npm run dev

# Backend only
npm start

# Frontend only
npm run client

# Production build
cd client && npm run build
```

Dev proxy: all `/api/*` requests from the React dev server (`:3000`) are proxied to `http://localhost:3001` via `client/src/setupProxy.js`.

In production, Express serves the React build (`client/build/`) and handles SPA fallback from `/`.

---

## Backend Structure

```
app.js                  # Express app, Mongoose connect, route mounts
bin/www                 # HTTP server bootstrap
config/keys.js          # DB connection URI (hardcoded)
routes/api/             # All API route files
models/                 # All Mongoose models
uploads/                # Multer upload destination
```

### API Routes (`routes/api/`)

All routes are mounted under `/api/`.

| Mount path | File | Domain |
|---|---|---|
| `/api/users` | `users.js` | Auth, user CRUD |
| `/api/client` | `client.js` | Client demographics |
| `/api/home` | `home.js` | Residential home management |
| `/api/treatmentPlans72` | `treatmentPlans72.js` | 72-hour treatment plans |
| `/api/incidentReport` | `incidentReport.js` | Incident reports |
| `/api/seriousIncidentReport` | `SeriousIncidentReport.js` | Serious incident escalations |
| `/api/restraintReport` | `restraintReport.js` | Restraint documentation |
| `/api/dailyProgressAndActivity` | `dailyProgressAndActivity.js` | Daily progress notes |
| `/api/dailyProgressNoteTwo` | `dailyProgressNoteTwo.js` | Alt daily progress format |
| `/api/admissionAssessment` | `admissionAssessment.js` | Admission assessments |
| `/api/bodyCheck` | `bodyCheck.js` | Physical body checks |
| `/api/illnessInjury` | `illnessInjury.js` | Illness/injury records |
| `/api/awakeNightStaffSignoff` | `awakeNightStaffSignoff.js` | Night staff sign-off (48 time slots) |
| `/api/nightMonitoring` | `nightMonitoring.js` | Night youth monitoring logs |
| `/api/medication` | `medicationRouter.js` | Medication administration logs |
| `/api/orientationTraining` | `orientationTraining.js` | Staff orientation records |
| `/api/orientationTrainingMod` | `orientationTrainingMod.js` | Orientation module management |
| `/api/preServiceTraining` | `preServiceTraining.js` | Pre-service training records |
| `/api/preServiceTrainingMod` | `preServiceTrainingMod.js` | Pre-service module management |
| `/api/firstAidCprTraining` | `firstAidCprTraining.js` | First Aid/CPR certification |
| `/api/firstAidCprTrainingMod` | `firstAidCprTrainingMod.js` | First Aid/CPR module management |
| `/api/annualTraining` | `AnnualTraining.js` | Annual training records |
| `/api/annualTrainingMod` | `AnnualTrainingMod.js` | Annual training module management |
| `/api/directMessages` | `directMessages.js` | Direct user messaging + email notify |
| `/api/discussionMessages` | `discussionMessages.js` | Per-home discussion board |
| `/api/uploadDocument` | `uploadDocument.js` | File upload (Multer) |
| `/api/forms` | `allFormRoutes.js` | Aggregated form approval counts |
| `/api/email` | `email.js` | Contact form emails |
| `/api/coinbase` | `coinbase.js` | Payment processing |
| `/uploads` | static | Serve uploaded files |

---

## Mongoose Models (`models/`)

Common fields shared by almost every form model:
- `homeId` — multi-tenant isolation, every record scoped to a home
- `createdBy`, `createdByName` — user who created the record
- `createDate`, `lastEditDate`
- `formType` — string tag identifying the form
- `approved` (Boolean), `approvedBy`, `approvedByName`, `approvedByDate`
- `approvedSig` (Array) — canvas signature data
- `status`

### Core Models

**User** (`User.js`)
- `firstName`, `middleName`, `lastName`, `jobTitle`, `homeId`
- `email`, `password` (plaintext — known issue)
- `isAdmin` (Boolean) — controls admin access throughout app
- `isActive` (Boolean), `newUser` (Boolean)
- `lastLogIn`, `createDate`
- `signature` (Array)

**Client** (`Client.js`)
- `childMeta_*` fields: name, photo, gender, dob, age, religion, ethnicity, admissionDate, medicaidNum, cpsNum, ssn, caseWorker, region, county, address, state, city, zip
- `placeOfBirth_*` fields
- `allergies`, `drugAllergies`, `chronicHealthConditions`
- `homeId`, `active`, `createdBy`, `createDate`, `lastEditDate`

**Home** (`Home.js`)
- `name`, `homeId`, `twoSignatures` (Boolean — requires two signatures on forms)

**TreatmentPlan72** (`TreatmentPlan72.js`)
- 400+ fields covering: client metadata, parents/family info, medical/dental/optical history, 5 medication slots, behavioral/emotional/social/family/educational assessments, 4 visitor slots, long/short-range goals, admin + treatment director signatures

**IncidentReport / SeriousIncidentReport** (`IncidentReport.js`, `SeriousIncidentReport.js`)
- Nature of incident, child metadata, staff involved, witnesses (staff + client up to 2 each), incident explanation, follow-up, notifications

**AwakeNightStaffSignoff** (`AwakeNightStaffSignoff.js`)
- 48 `ts{n}Approval` fields + 48 `ts{n}YouthStatus` fields (one per half-hour slot in a 24-hour shift)

**Medication** (`Medication.js`)
- `child` (childId + name), `monthYear`, prescriber/pharmacy info
- `medications` array: each entry has dosage, strength, frequency, log table
- `caregivers` array: each entry has signature, initials, date

---

## Frontend Structure (`client/src/`)

```
App.js                        # Root class component — owns auth state, current view, messages
index.js                      # ReactDOM.render entry
setupProxy.js                 # Dev proxy → :3001
context/FormCountContext/      # Context for form approval badge counts
utils/AdminReportingRoles.js   # isAdminUser() helper
components/
  Header/
  NavBar/
  LogInContainer/              # Login + signup modals
  Forms/                       # All 20+ form submission components
  FormMods/                    # Form module management (training modules)
  Reports/                     # Analytics/reporting views (Recharts)
  UserManagement/              # Admin user CRUD
  ManageAccount/               # Self-service account settings
  ManageTraining/              # Training record management
  Clients/                     # Client list + profile management
  Documents/                   # File upload + document list
  MessageBoard/                # Per-home discussion board
  DirectMessageBoard/          # User-to-user DMs
  Modals/
  PrintContainer/              # Print-optimized form layouts
```

### Navigation Model

`App.js` uses a `doDisplay` state string to swap views (no URL-based routing for authenticated views — routing is purely client-side state). React Router is used minimally (mainly for the `/reports` path).

### Auth Flow

1. User submits email + password in `LogInContainer`
2. Frontend GET `api/users/{email}/{password}`
3. Backend returns user object
4. Frontend saves to cookies via `universal-cookie`, sets `loggedIn: true` and `userObj` in App state
5. On reload, cookies are read to restore session
6. `isAdminUser()` checks `userObj.isAdmin` to gate admin features

**Known security issues (pre-existing, do not make worse):**
- Passwords stored plaintext
- Credentials in GET URL
- DB credentials hardcoded in `config/keys.js`
- Email SMTP credentials hardcoded in route files

---

## Multi-Tenancy

Every record is scoped to a `homeId`. Users belong to one home (`User.homeId`). All queries filter by `homeId` to prevent cross-home data leakage. The `Home` model tracks the list of homes and whether two-signature mode is enabled.

## Approval Workflow

Forms have an `approved` Boolean and associated `approvedBy*` fields. Admin users can approve pending forms. `FormCountContext` tracks counts of unapproved forms for badge display. The `/api/forms` route aggregates counts across form types filtered by approval status.

---

## File Uploads

- Route: `POST /api/uploadDocument`
- Engine: Multer, disk storage to `/uploads`
- Accepted types: `.docx`, `.doc`, `.csv`, `.jpeg`, `.png`, `.pdf`, `.ppt`, `.pptx`
- Size limit: 25MB (set on Express body-parser)
- Files served statically at `/uploads/{filename}`
- Metadata also stored in `Image` model (with `img` Buffer field for some uploads)

---

## Email

Nodemailer + Gmail SMTP. Used in:
- `routes/api/directMessages.js` — notify recipient of new DM
- `routes/api/email.js` — contact form

Credentials hardcoded in route files (pre-existing issue).
