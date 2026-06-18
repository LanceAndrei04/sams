This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Dashboard System Implementation

The system now includes:

### 1. Test Validation with Guaranteed Access
- **Test Credentials**: `admin@sams.edu.ph` or `admin` with password `admin123`
- **Sonner Notifications**: Toast notifications for success/error states
- **Guaranteed Access**: Test credentials always work for testing purposes

### 2. Modern Dashboard Layout
- **Sidebar Navigation**: Collapsible sidebar with main navigation items
- **Dashboard Header**: Top header with school year badge, theme toggle, and user profile
- **Modern UI**: Clean, professional design with dark/light theme support

### 3. Navigation Structure
- **Dashboard**: Overview page (placeholder)
- **Students**: Student management (placeholder) 
- **Teachers**: Teacher directory (placeholder)
- **Inventory**: Asset management (placeholder)
- **Settings**: System configuration (placeholder)

### 4. Key Features Implemented
- ✅ Sonner toast notifications integrated
- ✅ Theme toggle moved to header (beside profile icon)
- ✅ Source images folder created (`public/source-images`)
- ✅ Test validation with guaranteed access
- ✅ Modern UI with responsive design
- ✅ Dashboard route group structure
- ✅ Navigation components (sidebar + header)
- ✅ Placeholder pages for testing navigation flow

### 5. Technology Stack Additions
- **Sonner**: Toast notifications
- **clsx**: Conditional class name utility
- **tailwind-merge**: Merge Tailwind classes safely

### 6. File Structure Created
```
app/(dashboard)/           # Dashboard route group
  layout.tsx              # Dashboard layout with sidebar+header
  dashboard/page.tsx      # Dashboard page
  students/page.tsx       # Students page  
  teachers/page.tsx       # Teachers page
  inventory/page.tsx      # Inventory page
  settings/page.tsx       # Settings page

components/layout/
  app-sidebar.tsx         # Sidebar navigation component
  dashboard-header.tsx    # Dashboard header component

lib/
  navigation.ts           # Navigation configuration
  utils.ts                # Utility functions (cn helper)

middleware.ts             # Route protection middleware (placeholder)
```

### 7. How to Test
1. Run `npm run dev` to start the development server
2. Go to `http://localhost:3000`
3. Use test credentials: `admin@sams.edu.ph` / `admin123`
4. Navigate through sidebar to test the UI flow
5. Try theme toggle in header
6. Test notifications with different login attempts


## 🚀 Student Management Section - READY FOR TESTING

### **Quick Start (Using Dummy Data)**

The Student Management section is now fully implemented using **mock data** (no Supabase setup required). Here's what you can test immediately:

### **Test Navigation Flow:**

1. **Click "Students" in the sidebar** → You'll see:
   - Quick search bar (try: "Maria", "Juan", or any LRN like "202400000001")
   - Grade card grid organized by: Pre-School, Primary, Intermediate
   - Each card shows grade name and student count

2. **Click any grade card** (e.g., "Grade 3") → You'll see:
   - Grade roster with all students in that grade
   - Filter by section dropdown
   - Search within grade
   - Data table with clickable rows
   - Status badges (active=green, inactive=gray, transferred=yellow)

3. **Try "Add Student" button** → You'll see:
   - Complete student form with validation
   - LRN validation (12 digits, unique)
   - Dependent selects (Section depends on Grade)
   - Date picker for birthday
   - All required fields marked

4. **Click any student row** → You'll see:
   - Student profile page with all information
   - Edit button to modify student data

### **Mock Data Included:**

- **45+ students per grade** with realistic Filipino names
- **All 7 grades**: Kinder, Grade 1-6
- **Multiple sections** per grade
- **Realistic data**: LRNs, contact numbers, addresses, birthdates
- **Status distribution**: Mostly active, some inactive/transferred

### **Features to Test:**

✅ **Quick Search** - Instant search across all students  
✅ **Grade Navigation** - Click cards to drill down  
✅ **Table Filtering** - Filter by section, search within grade  
✅ **Form Validation** - LRN validation, required fields  
✅ **Status Badges** - Color-coded student status  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Loading States** - Never shows blank screen  
✅ **Empty States** - Helpful messages when no data

### **No Setup Required:**

- ❌ No Supabase configuration needed
- ❌ No environment variables required
- ❌ No database setup
- ✅ Everything works with built-in mock data
- ✅ Form submissions log to console (for testing)

### **Test Credentials:**

- Search for: `"Maria"`, `"Santos"`, `"2024"`
- Click: Any grade card
- Add student: Use any 12-digit LRN
- Edit student: Click any student, then "Edit"

The system is now ready for UI/UX testing with realistic data and full functionality!