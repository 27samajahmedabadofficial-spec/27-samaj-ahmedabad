# Login Functionality Implementation Guide

Your login functionality is now fully integrated with the **27_samaj_app** database! Here's what has been set up:

## Architecture Overview

### 1. **Authentication Flow**
- **Supabase Auth**: Handles user authentication (email/password)
- **Auth Context**: Manages user session and profile state across the app
- **Protected Routes**: Ensures only authenticated users can access protected pages
- **Database Profiles**: Stores user profile information

### 2. **Database Schema**

Your `profiles` table structure:
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY (references auth.users.id),
  full_name TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### 3. **Components & Services**

#### AuthContext (`src/contexts/AuthContext.tsx`)
Manages:
- `user`: Current authenticated user from Supabase
- `profile`: User profile data from the `profiles` table
- `session`: Supabase session object
- `loading`: Loading state
- `signIn()`: Login with email/password
- `signUp()`: Register with email/password/full_name
- `signOut()`: Logout user

#### Profile Service (`src/services/profileService.ts`)
Database operations:
- `getProfile(userId)`: Fetch user profile
- `updateProfile(userId, updates)`: Update profile fields
- `updateProfileField(userId, field, value)`: Update single field
- `createProfile(userId, fullName)`: Create new profile (backup if trigger fails)
- `profileExists(userId)`: Check if profile exists

#### Auth Page (`src/pages/Auth.tsx`)
- Login/Signup form with validation
- Password visibility toggle
- Error handling and toast notifications
- Form validation using Zod schema

#### Protected Route (`src/components/auth/ProtectedRoute.tsx`)
- Redirects unauthenticated users to `/auth`
- Shows loading state while checking authentication
- Wraps all protected pages

### 4. **Complete Login Flow**

1. User navigates to `/auth`
2. User enters email and password
3. AuthContext's `signIn()` calls Supabase Auth
4. On success:
   - Session is established
   - Auth state change triggers profile fetch
   - User is redirected to home page
5. Profile data is loaded and available via `useAuth()` hook
6. User can access protected routes

### 5. **Using the Auth Hook**

In any component, access auth data:

```tsx
import { useAuth } from "@/contexts/AuthContext";

export const MyComponent = () => {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {profile?.full_name || user.email}!</p>
      <p>City: {profile?.city}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
```

### 6. **Updating User Profile**

```tsx
import { profileService } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";

const UpdateProfile = () => {
  const { user } = useAuth();

  const handleUpdate = async () => {
    if (!user) return;
    
    const updated = await profileService.updateProfile(user.id, {
      full_name: "New Name",
      city: "Ahmedabad",
      phone: "+91-XXXXXXXXXX"
    });

    if (updated) {
      console.log("Profile updated:", updated);
    }
  };

  return <button onClick={handleUpdate}>Update Profile</button>;
};
```

## Testing the Login

### Manual Testing Steps:

1. **Test Sign Up:**
   - Go to `http://localhost:5173/auth`
   - Click "Create Account"
   - Fill in email, password (min 6 chars), and full name
   - Click "Create Account"
   - Check database - profile should be created automatically

2. **Test Sign In:**
   - Click "Log In" tab
   - Enter email and password
   - Click "Log In"
   - Should be redirected to home page (`/`)
   - User profile should load from database

3. **Test Protected Routes:**
   - Try accessing `/wall`, `/directory`, etc. while logged out
   - Should redirect to `/auth`
   - After login, all routes should be accessible

4. **Test Profile Loading:**
   - In browser console: `useAuth()` in component
   - Check `profile` object contains data from database

## Environment Variables

Your `.env` file has:
```
VITE_SUPABASE_PROJECT_ID="lmawablxhakfrmckdhoj"
VITE_SUPABASE_URL="https://lmawablxhakfrmckdhoj.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_key_here"
```

These are already configured and connected to your **27_samaj_app** database.

## Database Automation

### Automatic Profile Creation
When a new user signs up:
1. Supabase Auth creates user in `auth.users`
2. Database trigger `on_auth_user_created` automatically creates profile entry
3. `full_name` is populated from sign-up form

### Automatic Timestamp Updates
- `created_at`: Set when profile is created
- `updated_at`: Automatically updated on any profile change

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state & logic
├── services/
│   └── profileService.ts        # Database operations
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx   # Route protection
├── pages/
│   ├── Auth.tsx                 # Login/Signup page
│   ├── Index.tsx                # Protected home
│   └── ...other pages
└── App.tsx                       # App routing setup
```

## Next Steps (Optional Enhancements)

1. **Email Verification:**
   - Add email confirmation before login
   - Check Supabase email templates

2. **Password Reset:**
   - Implement "Forgot Password" functionality
   - Use Supabase's password recovery

3. **Social Login:**
   - Add Google/GitHub login via Supabase

4. **Profile Completion:**
   - Redirect new users to complete their profile
   - Add phone, city, avatar fields

5. **User Roles/Permissions:**
   - Add role column to profiles table
   - Implement role-based access control

## Troubleshooting

### "Invalid login credentials"
- Check email and password are correct
- Make sure user exists in database
- Verify auth credentials in `.env`

### Profile not loading
- Check user has entry in `profiles` table
- Verify Row Level Security policies
- Check browser console for errors

### Can't access protected routes when logged in
- Check if session is persisted
- Clear localStorage and login again
- Verify `ProtectedRoute` component is working

## Support

For issues with:
- **Supabase Auth:** Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- **Profile Schema:** See [migrations/20251230132103...sql](../../supabase/migrations/)
- **React Context:** Check [React Context Docs](https://react.dev/reference/react/useContext)
