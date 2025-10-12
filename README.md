# B2B Credit Building SaaS Platform

A comprehensive Next.js-based SaaS platform designed to simplify business funding and credit building. This platform streamlines the onboarding process for businesses seeking capital and provides robust tools for managing leads and applications.

## Features

### For Clients
- **Simple Registration**: Quick and easy account creation
- **Application Management**: Streamlined funding application process
- **Real-time Status Tracking**: Monitor application progress
- **Secure Dashboard**: Personal dashboard to manage applications

### For Administrators
- **Lead Management**: Track and manage incoming leads
- **Application Review**: Review and process funding applications
- **Analytics Dashboard**: View key metrics and statistics
- **User Management**: Manage staff and client accounts

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL)
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd b2bcredit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes the following models:

- **User**: Stores user accounts with role-based access (CLIENT, STAFF, ADMIN)
- **Lead**: Manages business leads before conversion
- **Application**: Handles business funding applications
- **Document**: Stores application-related documents

## Project Structure

```
b2bcredit/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── applications/ # Application CRUD
│   │   ├── leads/        # Lead management
│   │   └── admin/        # Admin endpoints
│   ├── dashboard/        # Client dashboard
│   ├── application/      # Application flow
│   ├── admin/           # Admin dashboard
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Landing page
├── components/           # Reusable React components
├── lib/                 # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   └── prisma.ts       # Prisma client
├── prisma/             # Database schema
└── public/             # Static assets
```

## User Roles

### CLIENT
- Create and manage their own application
- View application status
- Access personal dashboard

### STAFF
- View all applications and leads
- Access admin dashboard
- Process applications

### ADMIN
- Full access to all features
- User management
- System configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Applications
- `GET /api/applications` - Get user's application
- `POST /api/applications` - Create application
- `PATCH /api/applications` - Update application
- `POST /api/applications/submit` - Submit application

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/admin/leads` - Get all leads (admin only)

### Admin
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/leads` - Get all leads

## Creating Your First Admin User

### Option 1: Use Seed Script (Recommended)

Run the seed script to create sample users and data:

```bash
npm run db:seed
```

This creates:
- **Admin User**: admin@b2bcredit.com (password: admin123)
- **Client User**: client@example.com (password: client123)
- Sample application and leads

### Option 2: Manual Setup

1. Register a user through the UI at `/register`
2. Update the user's role in the database:

```bash
npx prisma studio
```

3. Find the user and change their `role` from `CLIENT` to `ADMIN`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database for Production

For production, switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env` with PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Security Considerations

- All passwords are hashed using bcrypt
- Authentication handled by NextAuth.js
- Protected routes use middleware
- API routes validate user sessions
- Input validation with Zod
- SQL injection prevention via Prisma

## Customization

### Styling
- Update colors in `tailwind.config.ts`
- Modify global styles in `app/globals.css`

### Business Logic
- Application validation: `app/api/applications/route.ts`
- User roles: `lib/auth.ts`

### Email Notifications
Consider integrating:
- SendGrid
- Postmark
- AWS SES

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## License

This project is proprietary software. All rights reserved.

## Contributing

Please contact the project owner for contribution guidelines.

---

Built with ❤️ using Next.js and Prisma
