# eCare Residential

Despite the name, this is a **child welfare / foster-care residential facility management system**, not elder care — a digital replacement for paper clinical/compliance forms at licensed group homes housing children in state custody (see `models/Client.js` fields like `childMeta_cpsNumber`, `childMeta_caseWorker`, `childMeta_medicaidNumber`). It's a monolithic MERN-adjacent app: a single Express 4 + Mongoose 5 API at the repo root, and a Create React App 5 (React 16, class components) client in `client/`. Multi-tenant across physical facilities via a `homeId` string carried on nearly every record and route.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Server | Express 4 |
| Database | MongoDB Atlas via Mongoose 5 (DB name: `RCS`) |
| Frontend | React 16 (class components) |
| UI | React Bootstrap + Reactstrap |
| HTTP client | Axios |
| Auth | Custom cookie-based (no JWT/Passport/sessions) |
| Email | Nodemailer + Gmail SMTP |
| File upload | Multer → local `/uploads` directory |
| Payments | Coinbase Commerce |
| Signatures | react-signature-canvas (stored as Array in Mongo) |

`react-router-dom` and `recharts` are listed as dependencies but are **not actually used** anywhere in the codebase (grep confirms no `<Route>`/`<Switch>`/`useHistory`, and no chart usage) — don't assume they're wired up.

## Dev setup

```bash
npm install                    # root — API deps
npm install --prefix client    # client — CRA/React deps
npm run dev                    # runs API (nodemon, port 3001) + CRA dev server (port 3000) via concurrently
```

CRA's `client/src/setupProxy.js` proxies `/api/*` to `http://localhost:3001` in dev (uses `http-proxy-middleware`, not the `package.json` `"proxy"` field). In production, `app.js` serves the built client itself via `express.static("client/build")` plus catch-all `sendFile` routes for `/` and `/reports` — one Node process serves both API and static assets, no separate frontend host.

## Repository layout

```
app.js                   Monolithic bootstrap: ~35 route requires, CORS, mongoose.connect, static serving
bin/www                  HTTP server entry point (PORT env, default 3001)
config/keys.js           MongoDB Atlas URI — hardcoded, committed (no dotenv)
models/                  Flat Mongoose schemas, one per entity/form, string IDs (no ObjectId refs)
routes/api/              ~35 route files, mostly one per model, largely copy-pasted CRUD
uploads/                 Multer local-disk file storage
views/                   Express-generator leftover (Jade/Pug) — unused by the SPA, ignore
client/src/App.js        1,400+ line class component — owns nearly all cross-cutting state; the "router"
client/src/setupProxy.js Dev-only /api proxy to localhost:3001
client/src/components/   Forms/, Clients/, MessageBoard/, DirectMessageBoard/, Documents/,
                         UserManagement/, ManageTraining/, Reports/, Modals/, NavBar/
client/src/utils/        AdminReportingRoles.js, DoDeleteRecord.js, FetchHomeData.js, etc.
client/src/context/      FormCountContext — the only React Context in the app
.github/workflows/       dev-deploy.yml / prod-deploy.yml — Azure Web App deploys
```

### API routes (`routes/api/`), all mounted under `/api/`

| Mount path | File | Domain |
|---|---|---|
| `/api/users` | `users.js` | Auth, user CRUD |
| `/api/client` | `client.js` | Client (resident) demographics |
| `/api/home` | `home.js` | Residential home/facility management |
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
| `/api/medication` | `medicationRouter.js` | Medication administration logs (contains a live `migrateOldLogTable()` schema-migration shim run on every read — a standing workaround, not a one-time fix) |
| `/api/orientationTraining(Mod)` | `orientationTraining.js` / `orientationTrainingMod.js` | Staff orientation records / module mgmt |
| `/api/preServiceTraining(Mod)` | `preServiceTraining.js` / `preServiceTrainingMod.js` | Pre-service training records / module mgmt |
| `/api/firstAidCprTraining(Mod)` | `firstAidCprTraining.js` / `firstAidCprTrainingMod.js` | First Aid/CPR certification / module mgmt |
| `/api/annualTraining(Mod)` | `AnnualTraining.js` / `AnnualTrainingMod.js` | Annual training records / module mgmt |
| `/api/directMessages` | `directMessages.js` | Direct user messaging + email notify |
| `/api/discussionMessages` | `discussionMessages.js` | Per-home dashboard announcement board |
| `/api/fosterChecklist` | `fosterChecklist.js` | Foster checklist uploads — **`GET` has no `homeId` filter, leaks every home's checklists (line ~71)** |
| `/api/uploadDocument` | `uploadDocument.js` | File upload (Multer) |
| `/api/forms` | `allFormRoutes.js` | Aggregated form approval counts across ~10 form models |
| `/api/email` | `email.js` | Contact form emails |
| `/api/coinbase` | `coinbase.js` | Payment processing |
| `/uploads` | static | Serve uploaded files |

### Mongoose models (`models/`)

Common fields on almost every form model: `homeId` (tenant isolation), `createdBy`/`createdByName`, `createDate`/`lastEditDate`, `formType`, `approved` (+ `approvedBy`/`approvedByName`/`approvedByDate`/`approvedSig` array), `status`.

- **User** (`User.js`) — `firstName/middleName/lastName/jobTitle/homeId`, `email`, `password` (**plaintext**), `isAdmin` (Bool, drives admin UI gating), `isActive`, `newUser`, `lastLogIn`, `signature` (array).
- **Client** (`Client.js`) — resident record: `childMeta_*` fields (name, photo, gender, dob, admissionDate, `medicaidNum`, `cpsNum`, `ssn` (Number, no protection), `caseWorker`, region/county/address), `placeOfBirth_*`, `allergies`, `drugAllergies`, `chronicHealthConditions`, `homeId`, `active`.
- **Home** (`Home.js`) — `name`, `homeId`, `twoSignatures` (Bool — requires two signatures on forms for that facility).
- **TreatmentPlan72** (`TreatmentPlan72.js`) — 400+ fields: client/family metadata, medical/dental/optical history, 5 medication slots, behavioral/social/educational assessments, 4 visitor slots, goals, signatures. Backing component (`client/src/components/Forms/TreatmentPlan72.js`) is ~4,600 lines — a maintainability outlier, avoid growing it further without cause.
- **IncidentReport / SeriousIncidentReport** — nature of incident, child metadata, staff involved, up to 2 staff + 2 client witnesses, explanation, follow-up, notifications.
- **AwakeNightStaffSignoff** — 48 `ts{n}Approval` + 48 `ts{n}YouthStatus` fields, one per half-hour slot across a 24-hour shift.
- **Medication** (`Medication.js`) — `child`, `monthYear`, prescriber/pharmacy info, nested `medications[]` (dosage/strength/frequency + `logTable.days[].doses[]`), `caregivers[]` (signature/initials/date).
- **DiscussionMessage** / **DirectMessage** — link to `homeId` and users by name/email string, not ObjectId refs (no `populate` anywhere in the model layer).

## Conventions & patterns

- **Navigation is NOT react-router**, despite `react-router-dom` being a listed dependency — it's unused. `App.js` holds a screen-name string in state (`doDisplay`), and `toggleDisplay(name)` sets it. Two switch-on-string functions in `App.js` — `ToggleScreen({name})` (main pane) and `DisplayExtra({name})` (sidebar) — render based on that string. Adding a new screen means editing **three unsynchronized places** with the exact same literal: `NavBar/bsNavBar.js` (the button), `ToggleScreen`, and `DisplayExtra`. A typo in any one silently renders a blank pane — there's no enum/registry to catch it. `Reports` is a special case rendered outside `ToggleScreen` since it needs a full-width layout.
- **Auth flow**: user submits email+password in `LogInContainer` → frontend does `GET /api/users/{email}/{password}` → backend matches against the plaintext `password` field and returns the raw user doc → frontend stores it via `universal-cookie` and sets `userObj`/`loggedIn` in `App.js` state → on reload, cookies restore the session. `isAdminUser()` checks `userObj.isAdmin` / `jobTitle` client-side to gate admin UI. No token is ever issued.
- **Multi-tenancy via `homeId`** — nearly every model, route, and component prop carries a `homeId` string; data is scoped with `Model.find({homeId})` by convention only, not enforced by any middleware. Any client can query any home's data by changing the param. New routes/components must filter by `homeId` deliberately.
- **Admin gating is UI-only**: always use `isAdminUser(userObj)` from `client/src/utils/AdminReportingRoles.js` (a `jobTitle` allowlist: Admin, Owner/CEO, Executive/Director, Administrator, Case/Manager, Supervisor, Administrative/Assistant, Therapist, Medical/Coordinator) for admin UI. It is never re-verified server-side — do not treat it as a security boundary.
- **Confirm-delete pattern**: reuse `client/src/utils/DoDeleteRecord.js` (`window.confirm` → `Axios.delete` → callback) instead of hand-rolling delete confirmations.
- **State is lifted to `App.js`**, passed down as `appState={this.state}` — no Redux/Zustand. The sole Context (`FormCountContext`) exists only for a sidebar badge count. Individual Forms components keep their own local class state plus inline Axios calls — expect a hybrid pattern, not one source of truth. Newer files (`ManageUsers.js`, `HandleFieldInputDate.js`) use hooks instead of classes — the codebase is mid-migration, both styles coexist.
- **Approval workflow**: forms have an `approved` Boolean + `approvedBy*` fields; admins approve pending forms. `FormCountContext` tracks unapproved-form counts for badges; `GET /api/forms` (`allFormRoutes.js`) aggregates counts across ~10 form models.
- **Don't replicate the pagination anti-pattern** in `MessageBoard/MessageBoard.js`, which both refetches per page from the server *and* does a redundant client-side `.slice()`; `Pagination.js` also has a dead prop-reassignment bug (`currentPage` param mutation does nothing). Pick server- or client-side pagination, not both.
- Import casing for axios is inconsistent (`Axios` vs `axios`) across files for the same package; there's no shared API client/interceptor layer — errors are handled ad hoc per component (`try/catch` + `alert`).
- Dead dependencies present in `client/package.json` but unused: `react-router-dom`, `recharts`, `styled-components`. Don't assume they're wired up just because they're installed.

## File uploads & email

- Uploads: `POST /api/uploadDocument`, Multer disk storage to `/uploads`, accepted types `.docx/.doc/.csv/.jpeg/.png/.pdf/.ppt/.pptx`, 25MB limit (Express body-parser), served statically at `/uploads/{filename}`.
- Email: Nodemailer + Gmail SMTP, used in `routes/api/directMessages.js` (notify recipient of new DM) and `routes/api/email.js` (contact form). Credentials are hardcoded in both route files (see gotchas below).

## Known gotchas / tech debt

- **Plaintext passwords + credentials-in-URL login** — the top risk given this app handles children's PHI/PII. Login is `GET /api/users/:email/:password` (`routes/api/users.js:30`) — credentials travel as URL path segments (server logs, browser history, proxy logs) and are matched against a plaintext `password` field in `models/User.js` (no bcrypt anywhere). **There is no JWT, no session store, no auth middleware** — every "protected" route just trusts whatever `homeId`/`email` the client sends.
- **Committed secrets**: `config/keys.js` has a live MongoDB Atlas URI with credentials; a hardcoded Gmail app password (`"eCare2020?"`) is duplicated in `routes/api/directMessages.js` and `routes/api/email.js`. No `.env`/dotenv anywhere. Do not add new secrets to source — flag this pattern rather than extend it.
- **Wide-open CORS**: `app.js:53` uses `cors({ origin: true, credentials: true })`, which reflects any request origin — effectively no origin restriction. Combined with the two points above, this is an unusually risky combination for an app holding minors' PHI/PII.
- **`routes/api/fosterChecklist.js:71`** — `FosterChecklist.find()` with no filter, returns every checklist across every home (a `homeId` scoping bug).
- **`client/src/utils/HandleFieldInputDate.js`** — a hooks-based function component whose handler still references `this.state[...]`, a copy-paste artifact from a class version. Likely broken/dead; confirm it's not wired into a live form before relying on it.
- **`.remove()`** is used for Mongoose deletes (deprecated in Mongoose 5+); error handling is inconsistent (`.catch` swallowed as `(e) => {e;}` in `client.js`, missing `.catch` entirely in `discussionMessages.js`); response shapes vary across routes (raw arrays vs. raw docs vs. `{success, error}`) — check the specific route before assuming a shape.
- **Node version drift**: `.github/workflows/dev-deploy.yml` uses Node 16.x, `prod-deploy.yml` uses Node 18.x.
- `package.json`'s `build:dev` script is byte-identical to `build` — no real dev/prod differentiation despite the name.
- Testing is essentially absent — `App.test.js`/`setupTests.js` are stock CRA boilerplate; no per-component tests exist despite the app's size.

## Branches

`dev` and `master` are both active. Push to `dev` → `dev-deploy.yml` (Node 16.x) deploys to Azure Web App `ecare-residential-dev` (`REACT_APP_API_BASE_URL=https://ecare-residential-dev.azurewebsites.net`). Push to `master` → `prod-deploy.yml` (Node 18.x) deploys to `ecare-residential-prod` at `https://ecare-residential.com`, using `npm ci` and stripping `client/node_modules` before packaging. Both build with `CI=false` (suppresses CRA's lint-warnings-as-errors). `dev` has branch protection requiring PRs — it's bypassable but should not be bypassed by default; open a PR rather than pushing directly.
