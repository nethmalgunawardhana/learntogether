# LearnTogether - Complete Setup Guide

## Phase 1: Initial Setup (COMPLETED)

### What's Done:
✅ Git repository initialized
✅ Project structure created
✅ Firebase configuration set up
✅ Redux Toolkit configured with slices:
   - authSlice (authentication)
   - materialsSlice (study materials)
   - favouritesSlice (favourites)
   - themeSlice (dark mode)
✅ Services layer created:
   - authService.js (Firebase Auth)
   - firestoreService.js (Firestore operations)
✅ Navigation structure:
   - AppNavigator (root)
   - AuthNavigator (login/register)
   - MainNavigator (bottom tabs)
✅ Utilities:
   - validation.js (Yup schemas)
   - helpers.js (utility functions)
✅ Constants and theme configuration
✅ LoginScreen created

## Next Steps to Complete the App

### Step 1: Complete Authentication Screens

Create `RegisterScreen.js` in `src/screens/auth/`

### Step 2: Create Main Screens

1. **HomeScreen.js** - Display study materials from Firestore
2. **DetailsScreen.js** - Show material details
3. **PeerMatchScreen.js** - Match with study peers
4. **StudyGroupsScreen.js** - View and create study groups
5. **FavouritesScreen.js** - Show favourited items
6. **ProfileScreen.js** - User profile with theme toggle

### Step 3: Create Reusable Components

Create in `src/components/`:
- **MaterialCard.js** - Card for study materials
- **PeerCard.js** - Card for peer profiles
- **Button.js** - Reusable button
- **Input.js** - Reusable input field
- **Badge.js** - Badge component
- **LoadingSpinner.js** - Loading indicator
- **EmptyState.js** - Empty state component

### Step 4: Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Add security rules
5. Copy config to `.env` file

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Run the App

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Firebase Firestore Structure

### Collections:

**users**
```javascript
{
  uid: string,
  email: string,
  username: string,
  displayName: string,
  createdAt: timestamp,
  subjects: array,
  learningGoals: array,
  level: string,
  bio: string,
  badges: array,
  studyStreak: number,
  notesShared: number,
  helpfulCount: number
}
```

**studyMaterials**
```javascript
{
  id: string,
  title: string,
  description: string,
  subject: string,
  type: string, // 'notes', 'quiz', 'flashcard', 'assignment'
  createdBy: string,
  createdAt: timestamp,
  likes: number,
  downloads: number,
  content: string,
  tags: array,
  isPublic: boolean
}
```

**studyGroups**
```javascript
{
  id: string,
  name: string,
  description: string,
  subject: string,
  createdBy: string,
  createdAt: timestamp,
  members: array,
  maxMembers: number,
  isActive: boolean,
  meetSchedule: array
}
```

## Git Branch Strategy

- `main` - Production ready code
- `develop` - Development branch
- `feature/project-setup` - Initial setup ✅ CURRENT
- `feature/authentication` - Login/Register
- `feature/navigation` - Navigation
- `feature/home-screen` - Home screen
- `feature/state-management` - Redux
- `feature/item-details` - Details screen
- `feature/favourites` - Favourites
- `feature/peer-matching` - Peer matching
- `feature/study-boards` - Study boards
- `feature/group-chats` - Group chats
- `feature/rewards` - Rewards system
- `feature/styling` - Styling
- `feature/dark-mode` - Dark mode

## Commit Message Format

```
feat: Add user authentication with Firebase
fix: Resolve navigation issue in HomeScreen
refactor: Update Redux store structure
style: Apply consistent styling to components
docs: Update README with setup instructions
```

## Testing Plan

1. Authentication flow (login/register/logout)
2. Data fetching from Firestore
3. Favourites persistence
4. Dark mode toggle
5. Navigation between screens
6. Form validations
7. Error handling

## Current Branch: feature/project-setup

### Ready to Commit:
All base configuration files, services, navigation structure, Redux store, and LoginScreen.

### Next Action:
1. Commit current changes
2. Create remaining screens
3. Test authentication flow
4. Merge to develop
