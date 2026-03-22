# FinX Multi-Tenant SaaS Backend — Walkthrough

## What Was Built

A complete **Node.js + Express.js** multi-tenant SaaS backend for the FinX cooperative management platform. The system serves multiple cooperatives (tenants) with **full data isolation** — each cooperative gets its own dedicated PostgreSQL database, while platform-level data lives in a central main database.

### Phase 5: SuperAdmin Module, Support, and Notifications
- Implemented `/api/v1/super-admin/organization` for tenant platform settings (name, logo, etc.).
- Implemented `/api/v1/super-admin/users` for creating and managing cross-branch tenant users like Admins and BranchAdmins.
- Implemented `/api/v1/notifications/send` for broadcasting targeted Email/SMS to branch members.
- Implemented `/api/v1/support` for managing intra-tenant support tickets.

### Phase 6 & 7: Transaction & Reports APIs
- Added `/api/v1/transactions` for handling standalone journal/branch-level receipts and contra entries outside of loans.
- Added `/api/v1/reports/dashboard` for BranchAdmins and Admins to view key metrics (active loans, collections, total members).

### Phase 8: Route Assignment
- Added `/api/v1/collections/assign` allowing BranchAdmins to assign specific loans to a FieldCollector for routing.

### Phase 9: Authentication & Security
- **OTP Password Reset**: Built `forgot-password`, `verify-otp`, and `reset-password` endpoints allowing users to reset credentials securely via short-lived tokens.
- **Tenant Impersonation**: Added `POST /api/v1/auth/impersonate` allowing `SuperAdmin` to log in as an `Admin` or `BranchAdmin` without needing their password.
- **Device & Session Tracking**: Introduced `UserSession` database model. Logins now generate explicit `jti` attributes embedded into the JWT payload, allowing active devices to be persistently tracked and revoked (`GET /api/v1/auth/sessions` and `DELETE /api/v1/auth/sessions/:id`).

### DB Fixes
- Consolidated inline `unique: true` columns in Tenant, SystemUser, and Plan models into explicitly named model-level `indexes` to prevent PostgreSQL `ALTER TABLE` crashes during startup.

### Next Steps
- Write robust unit tests for these endpoints.
- Work on frontend integration.

---

## Project Structure

```
backend/
├── .env                          ← Configuration (update DB credentials)
├── package.json
└── src/
    ├── server.js                 ← Entry point (boot + seed)
    ├── app.js                    ← Express setup (CORS, rate limit, routes)
    ├── config/
    │   ├── index.js              ← Centralized env config
    │   ├── mainDb.js             ← Platform DB Sequelize instance
    │   └── tenantDb.js           ← Dynamic per-tenant DB factory (cached)
    ├── models/
    │   ├── main/                 ← Platform DB models
    │   │   ├── Tenant.js         ← Each cooperative record + db_name
    │   │   ├── Plan.js           ← Trial / Basic / Premium
    │   │   ├── Subscription.js   ← Billing cycles, expiry tracking
    │   │   ├── SystemUser.js     ← SystemAdmin / Support accounts
    │   │   ├── ApiKey.js         ← Hashed API keys with scopes
    │   │   └── AuditLog.js       ← Immutable platform audit trail
    │   └── tenant/               ← Per-cooperative DB models
    │       ├── index.js          ← Factory + associations (cached)
    │       ├── User.js           ← SuperAdmin/Admin/BranchAdmin/FieldCollector
    │       ├── Branch.js, Member.js, KycDocument.js
    │       ├── DepositAccount.js, DepositTransaction.js
    │       ├── LoanApplication.js, LoanAccount.js, EmiPayment.js
    │       ├── Transaction.js, LedgerEntry.js
    │       ├── Notification.js, SupportTicket.js
    ├── middleware/
    │   ├── authMiddleware.js     ← JWT verify → req.user
    │   ├── tenantResolver.js     ← Main DB lookup → connect tenant DB → req.db
    │   ├── rbacMiddleware.js     ← requireRole() + branchScopeGuard()
    │   ├── subscriptionGuard.js  ← Plan expiry + feature gate
    │   ├── auditLogger.js        ← Non-blocking post-response audit write
    │   └── validate.js           ← express-validator runner
    ├── services/
    │   ├── tenantProvisioner.js  ← CREATE DATABASE + schema sync + SuperAdmin seed
    │   ├── jwtService.js         ← signPlatformToken / signTenantToken
    │   └── notificationService.js ← Email (Nodemailer) + SMS
    ├── modules/
    │   ├── auth/                 ← Platform login, Tenant login, Refresh token
    │   ├── systemAdmin/
    │   │   ├── tenant/           ← Full cooperative lifecycle (CRUD, provision, status)
    │   │   └── billing/          ← Plans, subscriptions, platform analytics
    │   ├── branch/               ← Branch CRUD, manager assignment, user creation
    │   ├── member/               ← Member registration, KYC, status management
    │   ├── deposit/              ← Deposit accounts, deposits, withdrawals, statements
    │   ├── loan/                 ← Application → approval → disbursement + EMI schedule
    │   ├── collection/           ← FieldCollector EMI collection, daily summary
    │   └── ledger/               ← GL entries, trial balance, journal posting
    ├── routes/index.js           ← Central route assembly
    └── utils/
        ├── logger.js, response.js, helpers.js
```

---

## Request Pipeline (Every API Call)

```
HTTP Request + JWT Bearer Token
        │
        ▼
authMiddleware        → decode JWT → attach req.user {id, role, tenantId, type}
        │
        ▼
tenantResolver        → query Main DB for db_name
                      → check tenant status (blocks suspended/expired)
                      → connect tenant DB → attach req.db (all models)
        │
        ▼
rbacMiddleware        → requireRole(...) — 403 if role not permitted
        │
        ▼
branchScopeGuard      → BranchAdmin/FieldCollector auto-filtered to their branch
        │
        ▼
subscriptionGuard     → check expiry + feature flags
        │
        ▼
Controller            → business logic using req.db.ModelName
        │
        ▼
auditLogger           → async write to Main DB after response sent
        │
        ▼
JSON Response
```

---

## API Endpoints Summary

| Group | Method | Path | Allowed Roles |
|-------|--------|------|---------------|
| Auth | POST | `/api/v1/auth/platform/login` | Public |
| Auth | POST | `/api/v1/auth/login` | Public (tenant_slug required) |
| Auth | POST | `/api/v1/auth/refresh` | Public |
| SystemAdmin | GET/POST | `/api/v1/system/tenants` | SystemAdmin, Support |
| SystemAdmin | PATCH | `/api/v1/system/tenants/:id/status` | SystemAdmin |
| Billing | GET/POST | `/api/v1/system/billing/plans` | SystemAdmin |
| Billing | POST | `/api/v1/system/billing/subscriptions/assign` | SystemAdmin |
| Billing | GET | `/api/v1/system/billing/analytics` | SystemAdmin, Support |
| Audit | GET | `/api/v1/system/audit` | SystemAdmin, Support |
| Branches | CRUD | `/api/v1/branches` | Admin+ |
| Members | CRUD | `/api/v1/members` | All tenant roles |
| Members | PATCH | `/api/v1/members/:id/kyc` | Admin, BranchAdmin |
| Deposits | GET | `/api/v1/deposits/accounts` | All tenant roles |
| Deposits | POST | `/api/v1/deposits/deposit` | All tenant roles |
| Deposits | POST | `/api/v1/deposits/withdraw` | Admin, BranchAdmin |
| Loans | POST | `/api/v1/loans/applications` | All tenant roles |
| Loans | PATCH | `/api/v1/loans/applications/:id/review` | Admin, BranchAdmin |
| Loans | POST | `/api/v1/loans/applications/:id/disburse` | Admin, BranchAdmin |
| Collections | POST | `/api/v1/collections/emi` | FieldCollector+ |
| Collections | GET | `/api/v1/collections/my-collections` | FieldCollector+ |
| Collections | GET | `/api/v1/collections/daily-summary` | FieldCollector+ |
| Ledger | GET | `/api/v1/ledger/entries` | Admin, BranchAdmin |
| Ledger | GET | `/api/v1/ledger/trial-balance` | Admin, BranchAdmin |
| Ledger | POST | `/api/v1/ledger/journal` | Admin, BranchAdmin |

---

## How to Run

### 1. Configure environment
Edit [d:\FinX\backend\.env](file:///d:/FinX/backend/.env):
```
MAIN_DB_PASS=your_postgres_password
TENANT_DB_PASS=your_postgres_password
```

### 2. Create the main database in PostgreSQL
```sql
CREATE DATABASE finx_main_db;
```

### 3. Start the server
```bash
cd d:\FinX\backend
npm run dev
```

The server will:
- Auto-create all Main DB tables (Sequelize sync)
- Seed 3 default plans (Trial, Basic, Premium)
- Seed a default SystemAdmin: `admin@finx.com` / `Admin@123456`

### 4. Create your first cooperative
```http
POST /api/v1/auth/platform/login
{ "email": "admin@finx.com", "password": "Admin@123456" }

POST /api/v1/system/tenants  (with SystemAdmin Bearer token)
{
  "name": "Sunrise Cooperative",
  "slug": "sunrise-coop",
  "email": "contact@sunrise.np",
  "plan_id": "<Trial plan UUID>",
  "super_admin_name": "Ram Sharma",
  "super_admin_email": "ram@sunrise.np",
  "super_admin_password": "SecurePass@123"
}
```

This auto-creates: `coop_<tenantId>_db` PostgreSQL database, all tables, and the SuperAdmin account.

### 5. Login as tenant user
```http
POST /api/v1/auth/login
{
  "email": "ram@sunrise.np",
  "password": "SecurePass@123",
  "tenant_slug": "sunrise-coop"
}
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Separate DB per tenant** | True data isolation — no cross-tenant queries possible |
| **Tenant DB connection cache** | `Map<db_name, Sequelize>` prevents reconnect overhead per request |
| **JWT embeds tenant_id** | No extra DB round-trip to identify the tenant per request |
| **Audit logged post-response** | Non-blocking via `setImmediate` — never slows down API |
| **ENUM roles in token** | Role checked straight from JWT, no extra user fetch for RBAC |
| **Branch scope auto-applied** | [branchScopeGuard](file:///d:/FinX/backend/src/middleware/rbacMiddleware.js#28-63) appends `branch_id` to every query automatically |
| **EMI auto-generated on disburse** | Reducing balance calculation, full schedule created at disbursement |
| **Double-entry ledger validation** | Journal postings rejected if debit ≠ credit |

---

> [!IMPORTANT]
> Change the default SystemAdmin password (`Admin@123456`) immediately after first login. Update [.env](file:///d:/FinX/backend/.env) with your production PostgreSQL credentials and a strong `JWT_SECRET` before deploying.
