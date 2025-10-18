# Admin Panel Access Guide

This guide explains how to access and use the admin features of the B2B Credit SaaS application.

## Current Admin Features

The application currently provides **API-only admin access** with these capabilities:

### Admin API Endpoints

1. **User Management** (`/api/admin/users`)
   - List all users with pagination and search
   - View individual user details
   - Update user information
   - Delete users
   - Manage user roles (CLIENT, STAFF, ADMIN)

2. **Application Management** (`/api/admin/applications`)
   - View all credit applications
   - Update application status
   - Review application details
   - Approve/reject applications
   - View attached documents

3. **Lead Management** (`/api/admin/leads`)
   - View all leads from contact forms
   - Update lead status
   - Assign leads to staff
   - Delete leads

4. **Blog/CMS Management** (`/api/admin/blog`)
   - Create, edit, delete blog posts
   - Manage post status (DRAFT, PUBLISHED, SCHEDULED)
   - Set featured images and metadata
   - Manage categories and tags
   - Schedule posts for future publication

5. **Newsletter Management** (`/api/admin/newsletter`)
   - View all newsletter subscribers
   - Manage subscription status
   - Export subscriber lists
   - View subscription sources

---

## How to Create an Admin User

### Option 1: Using the Automated Script (Easiest)

```bash
# Run the admin creation script
./scripts/create-admin-user.sh

# Follow the prompts to enter:
# - Admin email
# - Admin password
# - Admin name
```

The script will:
- Generate a secure password hash
- Create the admin user in the database
- Verify creation
- Show you how to test login

### Option 2: Manual Database Access

If you prefer to do it manually:

1. **Connect to your database:**

```bash
# For local Docker
docker exec -it b2b_credit_db psql -U postgres -d b2b_credit_db

# For AWS RDS
psql -h YOUR_RDS_ENDPOINT -U postgres -d b2b_credit_db
```

2. **Generate a password hash:**

```bash
# Install bcryptjs if needed
npm install -g bcryptjs

# Generate hash (replace 'your-password')
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

3. **Create the admin user:**

```sql
INSERT INTO users (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@yourdomain.com',
  '$2a$10$YOUR_GENERATED_HASH_HERE',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

4. **Verify creation:**

```sql
SELECT id, email, name, role, "createdAt" FROM users WHERE email = 'admin@yourdomain.com';
```

---

## How to Login and Get Session Token

### Step 1: Login via API

```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your-password"
  }' \
  -c cookies.txt \
  -v
```

This will:
- Authenticate your credentials
- Create a session
- Store the session cookie in `cookies.txt`

### Step 2: Use Session Token for Admin Requests

Once logged in, include the cookie in your requests:

```bash
# Get all users
curl http://localhost:3000/api/admin/users \
  -b cookies.txt

# Get specific user
curl http://localhost:3000/api/admin/users/USER_ID \
  -b cookies.txt

# Update user role
curl -X PATCH http://localhost:3000/api/admin/users/USER_ID \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "role": "STAFF"
  }'
```

---

## Admin API Examples

### User Management

#### List All Users (with pagination)

```bash
curl "http://localhost:3000/api/admin/users?page=1&limit=20" \
  -b cookies.txt
```

**Response:**
```json
{
  "data": [
    {
      "id": "user-123",
      "email": "client@example.com",
      "name": "John Doe",
      "role": "CLIENT",
      "serviceType": "funding",
      "createdAt": "2025-10-18T00:00:00Z",
      "emailVerified": "2025-10-18T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 98,
    "hasMore": true
  }
}
```

#### Update User Role

```bash
curl -X PATCH http://localhost:3000/api/admin/users/user-123 \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "role": "STAFF",
    "name": "John Doe (Staff)"
  }'
```

### Application Management

#### List All Applications

```bash
curl "http://localhost:3000/api/admin/applications?page=1&limit=20&status=SUBMITTED" \
  -b cookies.txt
```

#### Update Application Status

```bash
curl -X PATCH http://localhost:3000/api/admin/applications/app-123 \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "status": "APPROVED",
    "approvedAt": "2025-10-18T12:00:00Z"
  }'
```

### Blog Management

#### Create New Blog Post

```bash
curl -X POST http://localhost:3000/api/admin/blog \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "title": "How to Build Business Credit",
    "excerpt": "Learn the fundamentals of building strong business credit...",
    "content": "<h2>Introduction</h2><p>Building business credit is essential...</p>",
    "status": "PUBLISHED",
    "categoryId": "cat-123",
    "tags": ["credit", "business", "financing"],
    "featuredImage": "https://example.com/image.jpg",
    "metaTitle": "How to Build Business Credit - Complete Guide",
    "metaDescription": "Comprehensive guide to building business credit..."
  }'
```

#### List All Blog Posts

```bash
curl "http://localhost:3000/api/admin/blog?page=1&limit=20&status=PUBLISHED" \
  -b cookies.txt
```

#### Update Blog Post

```bash
curl -X PATCH http://localhost:3000/api/admin/blog/post-123 \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "title": "Updated Title",
    "status": "DRAFT"
  }'
```

#### Delete Blog Post

```bash
curl -X DELETE http://localhost:3000/api/admin/blog/post-123 \
  -b cookies.txt
```

### Newsletter Management

#### List All Subscribers

```bash
curl "http://localhost:3000/api/admin/newsletter?page=1&limit=20&status=ACTIVE" \
  -b cookies.txt
```

#### Update Subscriber Status

```bash
curl -X PATCH http://localhost:3000/api/admin/newsletter/sub-123 \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{
    "status": "UNSUBSCRIBED"
  }'
```

---

## Using Postman or Insomnia

For easier testing, you can use Postman or Insomnia:

### Setup in Postman

1. **Import the OpenAPI spec:**
   - File → Import → http://localhost:3000/openapi.json

2. **Create environment variables:**
   - `baseUrl`: `http://localhost:3000` (or your production URL)

3. **Login:**
   - POST `{{baseUrl}}/api/auth/callback/credentials`
   - Body: `{"email":"admin@example.com","password":"your-password"}`
   - Postman will automatically save cookies

4. **Make admin requests:**
   - All subsequent requests will include the session cookie
   - GET `{{baseUrl}}/api/admin/users`

### Setup in Insomnia

1. **Create new request collection**

2. **Login request:**
   - POST http://localhost:3000/api/auth/callback/credentials
   - JSON body: `{"email":"admin@example.com","password":"your-password"}`
   - Enable "Send cookies automatically"

3. **Admin requests:**
   - Cookies are automatically included
   - GET http://localhost:3000/api/admin/users

---

## Building an Admin UI (Future Enhancement)

The current setup is API-only. If you want to build an admin UI, you can:

### Option 1: Use Existing Dashboard Route

The app has a dashboard route at `/dashboard` that could be enhanced:

1. **Add admin-only sections:**
   - Edit `app/dashboard/page.tsx`
   - Add conditional rendering based on user role
   - Create separate admin views

2. **Create admin pages:**
   ```
   app/dashboard/
   ├── page.tsx           # Client dashboard
   ├── admin/
   │   ├── page.tsx       # Admin overview
   │   ├── users/
   │   │   └── page.tsx   # User management UI
   │   ├── applications/
   │   │   └── page.tsx   # Application management UI
   │   ├── blog/
   │   │   └── page.tsx   # Blog CMS UI
   │   └── leads/
   │       └── page.tsx   # Lead management UI
   ```

### Option 2: Use Admin Dashboard Template

Popular options:
- [shadcn/ui Admin Template](https://ui.shadcn.com/)
- [Refine](https://refine.dev/) - React admin framework
- [React Admin](https://marmelab.com/react-admin/)
- [AdminJS](https://adminjs.co/)

### Option 3: Use Existing Admin Panel Solutions

- [Retool](https://retool.com/) - Connect to your API
- [Appsmith](https://www.appsmith.com/) - Open source, self-hosted
- [Forest Admin](https://www.forestadmin.com/) - Auto-generate admin panel

---

## Security Best Practices

### 1. Strong Passwords

Always use strong passwords for admin accounts:
```bash
# Generate secure password
openssl rand -base64 32
```

### 2. Limit Admin Access

Only create admin accounts for trusted users:
- Keep admin count minimal
- Use STAFF role for regular employees
- CLIENT role for customers

### 3. Monitor Admin Activity

All admin actions are logged in the `audit_logs` table:

```sql
-- View recent admin actions
SELECT
  al."userId",
  u.email,
  al.action,
  al.resource,
  al."resourceId",
  al."createdAt"
FROM audit_logs al
JOIN users u ON al."userId" = u.id
WHERE u.role = 'ADMIN'
ORDER BY al."createdAt" DESC
LIMIT 50;
```

### 4. IP Whitelisting (Production)

For production, consider:
- VPN-only access to admin endpoints
- IP whitelisting in AWS security groups
- WAF rules in CloudFront

---

## Troubleshooting

### Can't Login

**Check credentials:**
```sql
SELECT id, email, name, role FROM users WHERE email = 'admin@example.com';
```

**Verify password hash:**
```bash
# Test password hash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.compareSync('your-password', 'HASH_FROM_DB'));"
```

### Session Expires Quickly

Default session length is 30 days. To check:
```typescript
// lib/auth.ts
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### Unauthorized Errors

**Check user role:**
```bash
curl http://localhost:3000/api/status \
  -b cookies.txt
```

Should return user info with role. If not logged in, you'll get "Unauthorized".

---

## Quick Reference

### Admin User Script
```bash
./scripts/create-admin-user.sh
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"your-password"}' \
  -c cookies.txt
```

### Test Admin Access
```bash
curl http://localhost:3000/api/admin/users \
  -b cookies.txt
```

### View API Docs
```
http://localhost:3000/api-docs
```

### Check Auth Status
```bash
curl http://localhost:3000/api/status \
  -b cookies.txt
```

---

## Next Steps

1. **Create your first admin user:**
   ```bash
   ./scripts/create-admin-user.sh
   ```

2. **Test login and access:**
   - Use curl commands above
   - Or visit http://localhost:3000/api-docs
   - Use "Try it out" feature

3. **Optional: Build admin UI:**
   - Choose a template (shadcn/ui, Refine, etc.)
   - Connect to existing admin API endpoints
   - Deploy alongside main app

4. **Set up monitoring:**
   - Monitor audit logs
   - Set up alerts for admin actions
   - Review access regularly

---

**Last Updated:** 2025-10-18
**Maintained By:** Development Team
