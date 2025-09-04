# Database Setup Instructions

## Supabase Database Setup

### 1. Run the Schema
1. Go to your Supabase dashboard: https://ctnuaatlttgriwhhlrry.supabase.co
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "RUN" to execute the schema

### 2. Verify Tables
After running the schema, you should see these tables in your database:
- `profiles` - User profile information
- `builds` - Saved AR15 configurations

### 3. Test Authentication
- The schema includes automatic profile creation on user signup
- Row Level Security (RLS) is enabled for data protection
- Users can only access their own data

## Database Schema Overview

### `profiles` table
- Stores user profile information
- Automatically created when user signs up
- Links to Supabase auth.users table

### `builds` table
- Stores AR15 configurations as JSON
- Each build belongs to a user
- Supports public sharing and templates
- Includes metadata like name, description, timestamps

## Environment Variables
Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://ctnuaatlttgriwhhlrry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Features Enabled
- ✅ User registration/login
- ✅ Profile management
- ✅ Build saving/loading
- ✅ Public build sharing
- ✅ Template builds
- ✅ Row Level Security