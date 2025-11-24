# LearnTogether

A collaborative learning mobile app built with React Native and Expo, featuring peer matching, study groups with real-time chat, and material sharing.

## Features

### Core Functionality
- **Authentication**: Login/registration with DummyJSON API (JWT tokens)
- **Study Materials**: Browse, rate, search, and pin educational content
- **Peer Matching**: Find study partners based on shared interests
- **Study Groups**: Create/join groups with real-time chat functionality
- **Group Chat**: Share images, documents, reactions, and Q&A with voting
- **Dark Mode**: System-aware theme switching

### Advanced Features
- Material rating and view tracking
- Pin favorite materials and groups
- Image and document uploads
- Message reactions and Q&A voting
- Search functionality across materials
- User profile management
- Book search with Open Library API integration

## Tech Stack

- **React Native** (0.76.5) with Expo SDK 52
- **DummyJSON API**: Authentication and test data
- **Open Library API**: Book search and details
- **Redux Toolkit**: Global state management
- **React Navigation**: Drawer, stack, and tab navigation
- **Formik + Yup**: Form handling and validation
- **AsyncStorage**: Local persistence and token storage

## Quick Start

### Prerequisites
- Node.js (v16+)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Clone repository
git clone <repository-url>
cd mobile-app-development

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running the App
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go on your device

### Test Credentials
Use these DummyJSON credentials to login (use username, not email):

| Username | Password | Name |
|----------|----------|------|
| `emilys` | `emilyspass` | Emily Johnson |
| `michaelw` | `michaelwpass` | Michael Williams |
| `oliviaw` | `oliviawpass` | Olivia Wilson |

More users at: https://dummyjson.com/users

## Project Structure

```
src/
├── screens/
│   ├── auth/              # Login, Register
│   ├── main/              # Home, Profile, Settings, etc.
│   └── SplashScreen.js    # App splash with feature badges
├── navigation/            # Navigation configuration
├── store/                 # Redux store and slices
├── services/              # API services (DummyJSON, Open Library)
│   ├── authService.js     # Authentication with DummyJSON
│   └── apiService.js      # Data fetching and book search
├── hooks/                 # Custom React hooks (useForm, etc.)
├── components/            # Reusable UI components (Button, Input, Card, etc.)
├── constants/             # Colors, themes, sizes
└── utils/                 # Validation schemas, helpers
```

## Key Screens

- **HomeScreen**: Browse and search study materials
- **StudyGroupsScreen**: Manage and join study groups
- **GroupChatScreen**: Real-time chat with media sharing
- **PeerMatchScreen**: Discover study partners
- **ProfileScreen**: User profile and statistics
- **SettingsScreen**: App preferences and account management

## API Configuration

The app uses **DummyJSON API** for authentication and mock data:

- **Authentication**: `POST https://dummyjson.com/auth/login`
- **User Data**: `GET https://dummyjson.com/auth/me`
- **Study Materials**: `GET https://dummyjson.com/posts` (transformed to study materials)
- **Peer Matching**: `GET https://dummyjson.com/users`
- **Book Search**: Open Library API (`https://openlibrary.org`)

No environment variables or API keys required - works out of the box!

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

## Recent Updates

- Enhanced splash screen with feature badges
- Study group material rating system
- View count tracking for materials
- Pin functionality for groups and materials
- Q&A voting system in group chats
- Image and document upload with reactions
- Peer connections and real-time chat

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT
