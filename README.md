# LearnTogether - Mobile Learning App

A collaborative learning mobile application built with React Native and Expo, featuring user authentication, study materials sharing, peer matching, and study groups.

## Features

- **User Authentication**: Login and registration using DummyJSON API
- **Study Materials**: Browse and share educational content (posts from DummyJSON)
- **Peer Matching**: Find study partners based on shared interests
- **Study Groups**: Create and join study groups
- **Dark Mode**: Toggle between light and dark themes
- **Settings Screen**: Manage account preferences and app settings

## Technology Stack

- **React Native** with Expo SDK 52
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **DummyJSON API** for authentication and data
- **AsyncStorage** for local data persistence
- **Yup** for form validation
- **Custom React Hooks** for form management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobile-app-development
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan the QR code with Expo Go app on your phone

## Authentication with DummyJSON

This app uses [DummyJSON](https://dummyjson.com) for authentication instead of Firebase. This provides a free, easy-to-use REST API for testing and prototyping.

### Test Credentials

Use these credentials to login (enter the **username** in the email field):

| Username | Password | Role | Full Name |
|----------|----------|------|-----------|
| `emilys` | `emilyspass` | admin | Emily Johnson |
| `michaelw` | `michaelwpass` | admin | Michael Williams |
| `oliviaw` | `oliviawpass` | moderator | Olivia Wilson |
| `averyp` | `averyppass` | user | Avery Perez |

**Example Login:**
- Email/Username: `emilys`
- Password: `emilyspass`

For more users, visit: https://dummyjson.com/users

### API Endpoints Used

- **Authentication**: `POST https://dummyjson.com/auth/login`
- **User Data**: `GET https://dummyjson.com/auth/me`
- **Study Materials** (Posts): `GET https://dummyjson.com/posts`
- **Peer Matching** (Users): `GET https://dummyjson.com/users`

For complete documentation, see [DUMMY_API_USAGE.md](./DUMMY_API_USAGE.md)

## Project Structure

```
mobile-app-development/
├── src/
│   ├── screens/          # Screen components
│   │   ├── auth/        # Login, Register screens
│   │   └── main/        # Home, Profile, Settings screens
│   ├── navigation/       # Navigation configuration
│   ├── store/           # Redux store and slices
│   │   └── slices/      # Auth, theme, materials slices
│   ├── services/        # API services
│   │   ├── authService.js    # Authentication with DummyJSON
│   │   └── apiService.js     # Data fetching with DummyJSON
│   ├── hooks/           # Custom React hooks
│   │   ├── useForm.js        # Form management hook
│   │   └── useFirestoreRealtime.js  # Real-time data hook
│   ├── utils/           # Utility functions
│   │   └── validationSchemas.js  # Yup validation schemas
│   ├── components/      # Reusable components
│   └── constants/       # Colors, sizes, themes
├── App.js              # App entry point
└── package.json        # Dependencies
```

## Key Features Implementation

### Form Validation with React Hooks and Yup

The app uses custom React hooks with Yup validation for robust form handling:

**Custom `useForm` Hook** (`src/hooks/useForm.js`):
- Manages form state (values, errors, touched fields)
- Handles field changes and blur events
- Validates individual fields and entire forms
- Integrates with Yup validation schemas

**Validation Schemas** (`src/utils/validationSchemas.js`):
- `loginSchema`: Email/username and password validation
- `registerSchema`: Username, email, password, and confirm password validation with pattern matching
- `profileSchema`: User profile updates
- `studyMaterialSchema`: Study material creation
- `studyGroupSchema`: Study group creation

**Example Usage**:
```javascript
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
} = useForm(
  { email: '', password: '' },
  loginSchema,
  async (values) => {
    // Handle form submission
  }
);
```

### Authentication Flow

1. User enters username and password in validated form
2. Yup validates form inputs
3. App sends POST request to DummyJSON API
4. Receives JWT access token and user data
5. Stores token in AsyncStorage
6. Uses token for authenticated requests

### Data Fetching

- **Study Materials**: Fetched from DummyJSON posts endpoint
- **Peers**: Fetched from DummyJSON users endpoint
- **Study Groups**: Simulated with in-memory cache
- **Real-time Updates**: Simulated with polling every 30 seconds

### State Management

Redux Toolkit is used for global state:
- `authSlice`: User authentication state
- `themeSlice`: Dark/light mode
- `materialsSlice`: Study materials data

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
API_BASE_URL=https://dummyjson.com

# Test Credentials
# Username: emilys, Password: emilyspass
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Notes

- **Registration**: Since DummyJSON doesn't support real user registration, the app simulates it with mock data
- **Data Persistence**: Write operations (create/update/delete) are simulated with in-memory cache
- **Production Ready**: For a production app, replace DummyJSON with a real backend API

## Alternative APIs

If you need different types of data, consider these free APIs:

1. **JSONPlaceholder**: https://jsonplaceholder.typicode.com
2. **ReqRes**: https://reqres.in
3. **Free Test API**: https://freetestapi.com
4. **Random User Generator**: https://randomuser.me

Browse more at: https://free-apis.github.io

## Documentation

- [DummyJSON API Documentation](https://dummyjson.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## License

MIT
