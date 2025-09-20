# Admin Dashboard Setup Guide

## Overview

The Crit-Fumble admin dashboard provides a comprehensive interface for managing user accounts and controlling API access. This system requires manual database setup for initial admin privileges to ensure security.

## 🔐 Security Model

**Admin privileges are controlled exclusively by the database `admin` flag**. This prevents privilege escalation and ensures only manually designated users can access administrative functions.

### Key Security Features:
- ✅ Admin status stored in database only (cannot be spoofed)
- ✅ Complete separation from Discord permissions
- ✅ Middleware protection on all admin routes
- ✅ API-level validation for all operations
- ✅ Self-protection (admins cannot delete themselves)

## 📋 Features

### User Management
- **List Users**: Paginated table with search and filtering
- **Create Users**: Full user creation with validation
- **Edit Users**: Update any user properties
- **Delete Users**: Remove users (with safety checks)
- **JSON Data Editor**: Edit user data fields with syntax highlighting
- **Autocomplete**: Smart user search and suggestions

### Admin Interface
- **Responsive Design**: Works on desktop and mobile
- **Real-time Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages
- **Audit Trails**: All operations are logged

## 🚀 Setup Instructions

### 1. Initial Admin Setup

Since admin privileges must be set manually in the database, you need to update a user record directly:

#### Option A: Using Database CLI (PostgreSQL)
```sql
-- Connect to your database
psql $DATABASE_URL

-- Find your user ID (replace with your email/discord_id)
SELECT id, name, email, admin FROM "User" WHERE email = 'your-email@example.com';

-- Set admin flag to true
UPDATE "User" SET admin = true WHERE id = 'your-user-id';

-- Verify the change
SELECT id, name, email, admin FROM "User" WHERE admin = true;
```

#### Option B: Using Prisma Studio
```bash
# In your project directory
cd packages/core
npx prisma studio

# Navigate to User table
# Find your user record
# Set admin field to true
# Save changes
```

#### Option C: Using a Migration Script
```typescript
// Create a one-time script: scripts/set-initial-admin.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setInitialAdmin() {
  const email = 'your-email@example.com'; // Replace with your email
  
  const user = await prisma.user.findFirst({
    where: { email }
  });
  
  if (!user) {
    console.error('User not found with email:', email);
    return;
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: { admin: true }
  });
  
  console.log('Admin privileges granted to:', user.name || user.email);
}

setInitialAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 2. Access the Admin Dashboard

1. **Sign in** to your account normally
2. **Navigate** to `/dashboard`
3. **Look for** the "Admin Dashboard" button (only visible to admins)
4. **Click** to access the admin interface

### 3. Create Additional Admins

Once you have admin access, you can:
1. Use the admin dashboard to edit existing users
2. Check the "Admin User" checkbox
3. Save changes

## 🔧 API Endpoints

### Admin Authentication
- **Middleware**: `withAdminAuth()` protects all admin routes
- **Validation**: Checks database `admin` flag on every request
- **Session**: Uses existing session system with admin flag

### User Management API
- `GET /api/admin/users` - List users with filtering
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user by ID
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/users/suggestions` - Autocomplete suggestions

### Request Examples

#### List Users
```javascript
const response = await fetch('/api/admin/users?search=john&admin=true&limit=25');
const { users, total, hasMore } = await response.json();
```

#### Create User
```javascript
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    admin: false,
    data: { preferences: { theme: 'dark' } }
  })
});
```

#### Update User
```javascript
const response = await fetch('/api/admin/users/user-123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    admin: true,
    data: { updated: new Date() }
  })
});
```

## 🛡️ Security Considerations

### Admin Access Control
- Admin status comes **only** from database `admin` field
- Discord admin permissions **never** grant site admin access
- Session includes admin flag for client-side UI decisions
- All admin operations require server-side validation

### Data Protection
- Email uniqueness validation
- Slug uniqueness validation
- JSON data validation
- XSS protection in all inputs
- SQL injection prevention via Prisma

### Audit and Monitoring
- All admin operations are logged
- Failed auth attempts are tracked
- Security boundaries are enforced
- Permission violations are detected

## 🚧 Troubleshooting

### Cannot Access Admin Dashboard
1. **Check admin flag**: Verify `admin = true` in database
2. **Clear session**: Sign out and sign back in
3. **Check browser**: Try incognito/private browsing
4. **Verify URL**: Ensure you're accessing `/admin` correctly

### API Errors
- **401 Unauthorized**: Not signed in - go to `/` and sign in
- **403 Forbidden**: Not admin - check database `admin` flag
- **404 Not Found**: Check URL and route configuration
- **500 Server Error**: Check server logs for details

### Database Issues
```bash
# Check user table structure
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset

# Run migrations
npx prisma db push
```

## 📈 Usage Patterns

### Managing API Access
1. **Review Users**: Filter by integration (Discord/WorldAnvil)
2. **Check Activity**: Sort by creation/update dates
3. **Grant Access**: Update user permissions as needed
4. **Audit Changes**: Monitor admin operations

### Bulk Operations
1. **Export Data**: Use API to get user lists
2. **Batch Updates**: Prepare JSON data for multiple users
3. **Import Users**: Create multiple accounts via API
4. **Data Migration**: Move between environments safely

## 🔮 Future Enhancements

### Planned Features
- [ ] Bulk user operations
- [ ] Advanced filtering and search
- [ ] User activity monitoring
- [ ] Role-based permissions (beyond admin/user)
- [ ] API key management
- [ ] Audit log viewer
- [ ] Data export/import tools

### Security Enhancements
- [ ] Multi-factor authentication for admin
- [ ] Time-limited admin sessions
- [ ] IP restrictions for admin access
- [ ] Advanced audit logging
- [ ] Automated security monitoring

---

**Remember**: Admin privileges should be granted sparingly and only to trusted users who need to manage the platform. Always verify admin access is working in a development environment before deploying to production.