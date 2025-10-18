# B2B Credit SaaS - API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)

## Authentication

All protected endpoints require authentication via NextAuth session cookies. Include the session cookie in your requests.

## Authorization

The API uses role-based access control (RBAC) with three roles:
- **CLIENT**: Standard users who can manage their own data
- **STAFF**: Can view and manage leads and applications
- **ADMIN**: Full access to all resources

## Error Handling

All errors follow a standard format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2025-10-17T00:00:00.000Z"
}
```

Error codes:
- `UNAUTHORIZED`: 401 - Authentication required
- `FORBIDDEN`: 403 - Insufficient permissions
- `NOT_FOUND`: 404 - Resource not found
- `BAD_REQUEST`: 400 - Invalid request
- `VALIDATION_ERROR`: 400 - Validation failed
- `CONFLICT`: 409 - Resource already exists
- `INTERNAL_ERROR`: 500 - Server error
- `DATABASE_ERROR`: 500 - Database operation failed
- `RATE_LIMIT_EXCEEDED`: 429 - Too many requests

## Pagination

List endpoints support pagination via query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response format:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Rate Limiting

Rate limits are enforced per IP address or authenticated user:
- Public endpoints: 30 requests/minute
- Authenticated endpoints: 60 requests/minute
- Admin endpoints: 120 requests/minute

## API Endpoints

### Health & Status

#### GET /api/health
Check API health status (public)

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-17T00:00:00.000Z",
  "services": {
    "database": "up",
    "api": "up"
  },
  "version": "1.0.0",
  "environment": "production",
  "responseTime": "50ms"
}
```

#### GET /api/status
Get detailed system statistics (admin only)

**Response:**
```json
{
  "status": "operational",
  "statistics": {
    "total": {
      "users": 100,
      "leads": 50,
      "applications": 30
    }
  }
}
```

---

### Authentication

#### POST /api/auth/register
Register a new user

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST /api/auth/[...nextauth]
NextAuth endpoints for login/logout

---

### Users (Admin Only)

#### GET /api/admin/users
List all users

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by email or name
- `role`: Filter by role (CLIENT, STAFF, ADMIN)

#### GET /api/admin/users/[id]
Get user by ID

#### PATCH /api/admin/users/[id]
Update user

**Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "STAFF",
  "password": "newpassword123"
}
```

#### DELETE /api/admin/users/[id]
Delete user (cannot have related data)

---

### Leads

#### POST /api/leads
Create a lead (public)

**Body:**
```json
{
  "businessName": "Acme Corp",
  "contactName": "John Doe",
  "email": "john@acme.com",
  "phone": "555-1234",
  "industry": "Technology",
  "yearsInBusiness": 5,
  "annualRevenue": 1000000
}
```

#### GET /api/admin/leads
List all leads (admin/staff only)

#### GET /api/admin/leads/[id]
Get lead by ID (admin/staff only)

#### PATCH /api/admin/leads/[id]
Update lead (admin/staff only)

**Body:**
```json
{
  "status": "QUALIFIED",
  "assignedToId": "user_id",
  "notes": "Follow up next week"
}
```

#### DELETE /api/admin/leads/[id]
Delete lead (admin/staff only, cannot have application)

---

### Applications

#### GET /api/applications
Get current user's application

#### POST /api/applications
Create application for current user

**Body:**
```json
{
  "businessName": "Acme Corp",
  "businessType": "LLC",
  "ein": "12-3456789",
  "annualRevenue": 1000000,
  "fundingAmount": 50000,
  "fundingPurpose": "Equipment purchase"
}
```

#### PATCH /api/applications
Update application for current user

#### POST /api/applications/submit
Submit application for review

#### GET /api/admin/applications
List all applications (admin/staff only)

#### GET /api/admin/applications/[id]
Get application by ID (admin/staff only)

#### PATCH /api/admin/applications/[id]
Update application (admin/staff only)

**Body:**
```json
{
  "status": "APPROVED",
  "reviewedAt": "2025-10-17T00:00:00.000Z",
  "approvedAt": "2025-10-17T00:00:00.000Z"
}
```

#### DELETE /api/admin/applications/[id]
Delete application (admin/staff only)

---

### Documents

#### GET /api/documents?applicationId=[id]
List documents for an application

#### POST /api/documents
Upload a document

**Body:**
```json
{
  "applicationId": "app_id",
  "name": "Tax Return 2024",
  "type": "tax_return",
  "url": "https://storage.example.com/doc.pdf"
}
```

#### GET /api/documents/[id]
Get document by ID

#### PATCH /api/documents/[id]
Update document metadata

#### DELETE /api/documents/[id]
Delete document

---

### Blog Posts

#### GET /api/blog
List published blog posts (public)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by title/content
- `categoryId`: Filter by category
- `tag`: Filter by tag

#### GET /api/blog/[slug]
Get blog post by slug (public)

#### GET /api/blog/[slug]/related
Get related blog posts (public)

#### GET /api/admin/blog
List all blog posts including drafts (admin only)

#### POST /api/admin/blog
Create blog post (admin only)

**Body:**
```json
{
  "title": "How to Build Business Credit",
  "excerpt": "Learn the fundamentals...",
  "content": "Full article content...",
  "categoryId": "category_id",
  "tags": ["business", "credit"],
  "status": "PUBLISHED",
  "featuredImage": "https://example.com/image.jpg"
}
```

#### GET /api/admin/blog/[id]
Get blog post by ID (admin only)

#### PATCH /api/admin/blog/[id]
Update blog post (admin only)

#### DELETE /api/admin/blog/[id]
Delete blog post (admin only)

---

### Categories

#### GET /api/blog/categories
List all categories (public)

#### POST /api/blog/categories
Create category (admin only)

**Body:**
```json
{
  "name": "Business Credit",
  "description": "Articles about building business credit",
  "metaTitle": "Business Credit Tips",
  "metaDescription": "Expert advice on business credit"
}
```

#### GET /api/blog/categories/[id]
Get category by ID (public)

#### PATCH /api/blog/categories/[id]
Update category (admin only)

#### DELETE /api/blog/categories/[id]
Delete category (admin only, cannot have posts)

---

### Newsletter

#### POST /api/newsletter/subscribe
Subscribe to newsletter (public)

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "interests": ["business-credit", "funding"]
}
```

#### GET /api/newsletter/subscribe?email=[email]
Check subscription status (public)

#### POST /api/newsletter/unsubscribe
Unsubscribe from newsletter (public)

**Body:**
```json
{
  "email": "user@example.com"
}
```

#### GET /api/admin/newsletter
List all subscribers (admin only)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by email/name
- `isActive`: Filter by active status

#### GET /api/admin/newsletter/[id]
Get subscriber by ID (admin only)

#### PATCH /api/admin/newsletter/[id]
Update subscriber (admin only)

#### DELETE /api/admin/newsletter/[id]
Delete subscriber (admin only)

---

### Onboarding

#### GET /api/onboarding/progress
Get onboarding progress for current user

#### POST /api/onboarding/progress
Update onboarding progress

**Body:**
```json
{
  "currentStep": "step-2",
  "completionPercentage": 50,
  "businessType": "LLC",
  "yearsInOperation": "2-5"
}
```

---

## Enterprise Features

### Audit Logging
All sensitive operations are logged with:
- User ID
- Action (CREATE, READ, UPDATE, DELETE)
- Resource type and ID
- Timestamp
- IP address
- User agent

### Input Validation
All inputs are validated using Zod schemas with:
- Type checking
- Format validation
- Range validation
- Custom business rules

### Error Recovery
- Automatic retry for transient database errors
- Transaction rollback on failures
- Graceful degradation for non-critical services

### Security
- CSRF protection via NextAuth
- SQL injection prevention via Prisma
- XSS prevention via input sanitization
- Password hashing with bcrypt
- Role-based access control
- Rate limiting per IP/user

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-10-17T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2025-10-17T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
