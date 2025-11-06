# LearnTogether - Peer Learning & Study Match App

## Overview
An app that connects students taking similar courses or learning similar skills so they can form study groups or share notes.

## Key Features
- 🤝 Match with peers based on subjects or goals
- 📚 Shared study boards (upload notes, quizzes, flashcards)
- 🧩 Study group chats & meet scheduling
- 🏆 Rewards or badges for active participation

## Tech Stack
- **Frontend**: React Native with Expo
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore & Authentication)
- **Navigation**: React Navigation
- **Icons**: Feather Icons
- **Styling**: React Native StyleSheet

## Project Structure
```
LearnTogether/
├── src/
│   ├── components/        # Reusable components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── store/           # Redux store and slices
│   ├── services/        # Firebase and API services
│   ├── utils/           # Helper functions
│   ├── hooks/           # Custom React hooks
│   ├── constants/       # Constants and theme
│   └── types/           # TypeScript types
├── assets/              # Images, fonts, etc.
└── firebase/            # Firebase configuration
```

## Development Branches
Each feature will be developed in a separate branch:
- `main` - Production-ready code
- `develop` - Development branch
- `feature/project-setup` - Initial setup
- `feature/authentication` - Login/Register
- `feature/navigation` - Navigation structure
- `feature/home-screen` - Home screen with item list
- `feature/state-management` - Redux Toolkit setup
- `feature/item-details` - Details screen
- `feature/favourites` - Favourites functionality
- `feature/peer-matching` - Peer matching system
- `feature/study-boards` - Shared study boards
- `feature/group-chats` - Chat and scheduling
- `feature/rewards` - Rewards/badges system
- `feature/styling` - UI/UX improvements
- `feature/dark-mode` - Dark mode toggle

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Enable Firebase Authentication (Email/Password)
4. Add your Firebase config to `.env` file

## Best Practices
- Feature-based commits
- Proper input validations
- Decoupled, testable, and reusable code
- Following React Native and Firebase best practices

## License
MIT
