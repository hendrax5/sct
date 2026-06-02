# 📦 VERSIONING STRATEGY

## Semantic Versioning (SemVer)
Kami menggunakan format: **MAJOR.MINOR.PATCH**

```
v1.0.0
 ↑ ↑ ↑
 │ │ └─ PATCH: bug fixes, hotfixes, security patches (0.0.x)
 │ └───── MINOR: new features (backward compatible) (0.x.0)
 └─────── MAJOR: breaking changes (1.0.0 → 2.0.0)
```

---

## Version Phases

### Alpha Versions (v0.1.x - v0.9.x)
- **Status:** Internal testing, unstable
- **Usage:** Development team only
- **Format:** `v0.1.0-alpha.1`, `v0.2.0-alpha.2`
- **Stability:** No guarantees, frequent breaking changes
- **Release cadence:** Weekly or as needed

**Example:**
```
v0.1.0-alpha.1  (Week 1: basic auth + products)
v0.1.1-alpha.2  (Week 1: bug fixes)
v0.2.0-alpha.1  (Week 2: cart + checkout)
v0.3.0-alpha.1  (Week 3: admin dashboard)
```

### Beta Versions (v1.0.0-beta.x)
- **Status:** Feature complete, pre-production testing
- **Usage:** Staging environment, selected users/UMKM
- **Format:** `v1.0.0-beta.1`, `v1.0.0-beta.2`
- **Stability:** High, minor bugs expected
- **Release cadence:** Every 2-3 days during final phase

**Example:**
```
v1.0.0-beta.1   (Week 6: feature freeze)
v1.0.0-beta.2   (Week 7: security hardening)
v1.0.0-beta.3   (Week 8: performance optimization)
```

### Release Candidate (v1.0.0-rc.x)
- **Status:** Ready for production, final testing
- **Usage:** Staging + limited production rollout
- **Format:** `v1.0.0-rc.1`, `v1.0.0-rc.2`
- **Stability:** Production-ready
- **Release cadence:** Every 1-2 days

**Example:**
```
v1.0.0-rc.1     (Week 8: UAT passed)
v1.0.0-rc.2     (Week 8: final bug fixes)
```

### Production Releases (v1.0.0, v1.1.0, v1.2.0, v2.0.0)
- **Status:** Stable, public release
- **Usage:** All users
- **Format:** `v1.0.0`, `v1.0.1`, `v1.1.0`
- **Stability:** Production-grade (99.5% uptime SLA)
- **Support:** Bug fixes + security patches for 12 months

---

## Branching Strategy (Git Flow)

```
main (production)
  ↑
  ├─ v1.0.0 (tag)
  ├─ v1.0.1 (tag)
  └─ v1.1.0 (tag)

release/v1.0.0 (temporary)
  ├─ feature/auth
  ├─ feature/products
  └─ bugfix/checkout-issue

develop (staging/pre-release)
  ├─ feature/wishlist
  ├─ feature/analytics
  └─ bugfix/email-validation
```

### Branch Naming Rules
```
feature/*           — New features
  feature/user-wishlist
  feature/admin-analytics

bugfix/*            — Bug fixes (develop branch)
  bugfix/cart-calculation
  bugfix/email-encoding

hotfix/*            — Production bugs (from main)
  hotfix/payment-webhook-failed
  hotfix/inventory-sync-issue

release/*           — Release preparation
  release/v1.0.0
  release/v1.0.1
```

---

## Release Timeline & Schedule

| Phase | Version | Branch | Duration | Target Date |
|-------|---------|--------|----------|-------------|
| MVP Foundation | v0.1.x - v0.3.x | develop | 3 weeks | Week 3 |
| Feature Complete | v0.4.x - v0.9.x | develop | 3 weeks | Week 6 |
| Beta Testing | v1.0.0-beta.x | release/v1.0.0 | 1 week | Week 7 |
| Release Candidate | v1.0.0-rc.x | release/v1.0.0 | 1 week | Week 8 |
| **Public Launch** | **v1.0.0** | **main** | — | **End Week 8** |
| QoL Improvements | v1.1.0 | develop | 2 weeks | Week 12 |
| Advanced Features | v1.2.0 | develop | 3 weeks | Week 16 |

---

## How to Version Code & Commits

### Version File: `package.json`
```json
{
  "name": "ecommerce-umkm",
  "version": "1.0.0",
  "description": "Platform ecommerce modern untuk UMKM",
  "homepage": "https://ecommerce.example.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/org/ecommerce-umkm.git"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### Version File: `app/version.ts` (Code Reference)
```typescript
export const APP_VERSION = "1.0.0"
export const BUILD_DATE = "2026-03-20"
export const GIT_COMMIT = "abc123def456"

export function getVersion() {
  return `${APP_VERSION} (build: ${BUILD_DATE}, commit: ${GIT_COMMIT})`
}
```

### API Version Header
```
GET /api/v1/products
  X-API-Version: 1.0.0
  X-App-Version: 1.0.0
```

---

## Commit Message Convention

Kami menggunakan **Conventional Commits** untuk automated changelog generation.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat** — New feature (minor version bump)
- **fix** — Bug fix (patch version bump)
- **perf** — Performance improvement
- **refactor** — Code refactor (no behavior change)
- **test** — Add/update tests
- **docs** — Documentation
- **chore** — Build, deps, config
- **BREAKING CHANGE** — Major version bump

### Examples

```
feat(auth): add 2FA support for admin accounts

- Implement TOTP-based 2FA
- Add QR code generation
- Store secrets encrypted in DB
- Add recovery codes for account recovery

Refs #123
```

```
fix(checkout): prevent double-submission on payment form

Validated form state before allowing second submit.
Added loading state to submit button.

Fixes #456
```

```
perf(search): optimize product search query with indexing

Added composite index on (category_id, is_active, created_at).
Reduced search latency from 800ms to 150ms.
```

---

## Tag Strategy

### Production Tags
```bash
# Full release
git tag v1.0.0 -m "Release v1.0.0 — MVP launch"
git tag v1.0.1 -m "Release v1.0.1 — Hotfix: payment webhook"
git tag v1.1.0 -m "Release v1.1.0 — QoL improvements"

# Patch release (hotfix)
git tag v1.0.2 -m "Release v1.0.2 — Security patch"
```

### Pre-release Tags
```bash
# Alpha
git tag v0.1.0-alpha.1 -m "Alpha: Auth + Products"

# Beta
git tag v1.0.0-beta.1 -m "Beta: Feature complete"

# Release Candidate
git tag v1.0.0-rc.1 -m "Release Candidate"
```

### Docker Image Tags
```dockerfile
# From Dockerfile or CI/CD
ghcr.io/org/ecommerce-umkm:v1.0.0           (latest release)
ghcr.io/org/ecommerce-umkm:v1.0.0-beta.1    (beta)
ghcr.io/org/ecommerce-umkm:latest           (latest)
ghcr.io/org/ecommerce-umkm:staging          (development)
```

---

## Backward Compatibility Policy

### MINOR Versions (e.g., v1.0.0 → v1.1.0)
- ✅ Must maintain backward compatibility
- ✅ Existing API endpoints must work
- ✅ Database schema: migrations provided
- ✅ Old clients can still use the API

### MAJOR Versions (e.g., v1.0.0 → v2.0.0)
- ❌ Can break backward compatibility
- ✅ Must provide migration guide
- ✅ Old API endpoints might be deprecated
- ✅ Deprecation warning given 1 version ahead

### Example: Deprecation Path
```
v1.3.0: Deprecate /api/v1/products endpoint
  → Return warning header: X-API-Warning: "Endpoint deprecated, use /api/v2"

v1.4.0: Keep both /api/v1 and /api/v2 working

v2.0.0: Remove /api/v1, only /api/v2 available
```

---

## Security & Hotfix Releases

### Critical Security Issues
- **Response time:** <24 hours
- **Release type:** PATCH version bump (v1.0.1)
- **Process:** hotfix/* branch from main, direct merge
- **Communication:** Email to users, GitHub security advisory

**Example:**
```
v1.0.0 (normal release)
  ↓
v1.0.1 (security hotfix: SQL injection in search)
  ↓
v1.0.2 (security hotfix: XSS in product name)
  ↓
v1.1.0 (regular feature release)
```

### Supported Versions for Security Updates
```
v1.0.x  — Security patches for 12 months (until v1.2.0)
v1.1.x  — Security patches for 12 months (until v2.0.0)
v2.0.x  — Security patches for 12 months (until v2.2.0)
```

---

## Version Communication

### Release Notes Format
```markdown
# v1.0.0 — MVP Launch 🚀

**Release Date:** 2026-03-20

## ✨ New Features
- [x] Product catalog with 5k+ SKU
- [x] Shopping cart and checkout
- [x] Multiple payment methods (Xendit + manual transfer)
- [x] Admin dashboard with analytics

## 🐛 Bug Fixes
- Fixed cart calculation rounding error
- Fixed email notification for order status

## ⚡ Performance
- Reduced search latency from 800ms to 150ms
- Optimized product listing pagination

## 🔒 Security
- Enforced HTTPS everywhere
- Added rate limiting on login endpoint
- Fixed SQL injection vulnerability in search

## 📚 Documentation
- Added API documentation (OpenAPI)
- Created deployment guide
- Added troubleshooting guide

## ⚠️ Known Issues
- Email notifications delayed by 1-5 minutes (Sendgrid SLA)
- Wishlist sync occasionally slow (Redis cache refresh)

## 🙏 Thanks
Special thanks to beta testers for feedback!

## 🔗 Links
- [GitHub Release](https://github.com/org/ecommerce-umkm/releases/tag/v1.0.0)
- [Deployment Guide](./DEPLOYMENT.md)
- [Changelog](./CHANGELOG.md)
```

---

## Version Checking in CI/CD

### GitHub Actions: Validate Version
```yaml
name: Validate Version
on: [pull_request]
jobs:
  check-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check SemVer compliance
        run: |
          VERSION=$(grep '"version"' package.json | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
          if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version: $VERSION"
            exit 1
          fi
          echo "✓ Version $VERSION is valid SemVer"
```

### Database Migration Versioning
```
migrations/
├── 001_init_users.sql
├── 002_init_products.sql
├── 003_add_wishlist.sql
└── 004_optimize_search_index.sql
```

Each migration must have UP and DOWN scripts:
```sql
-- UP
CREATE TABLE wishlist (...);

-- DOWN
DROP TABLE wishlist;
```

