# Echoepost

Letters from a parallel universe, unlocked by your steps.

An iOS app built with React Native and Expo. Walk enough, and a letter from another version of you arrives — with words and photos from a different life. No progress bars, no social features. Just echoes.

## How It Works

1. You walk. Your iPhone tracks steps via HealthKit in the background.
2. When your total steps reach a hidden threshold, a letter from a parallel-universe you is delivered.
3. A local notification tells you: a letter has arrived.
4. Open the app to read the letter and view its photos, full-screen.

You never know when the next letter will come. There is no progress indicator, no step goal displayed, no hint of what threshold remains. The only thing you see is the number of steps you have taken — and the letters that have found you.

## Tech Stack

- React Native (Expo SDK 54)
- TypeScript
- HealthKit (step data source)
- AsyncStorage (local persistence)
- expo-notifications (local push)

## Architecture

```
Screen (View) --> Custom Hook (ViewModel) --> Service (Data Access) --> Data Source
```

- `hooks/useJourney.ts` — Core business logic, owns all state
- `services/stepService.ts` — Step data (currently mock, future HealthKit)
- `services/letterService.ts` — Letter storage and unlock logic
- `data/seedLetters.ts` — Seed letter content
- `components/` — UI components (NewLetterModal, LetterDetail, PermissionDenied)

## Project Status

Prototype complete. Tested on iPhone 14 Pro via Expo Go. Mock step data for now; real HealthKit integration requires a Mac for development build.

## Development

```
npm install
npx expo start
```

Scan the QR code with Expo Go on your iPhone to preview.
