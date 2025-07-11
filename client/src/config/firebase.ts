import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  // Your Firebase config object
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

export const initializeFirebase = () => {
  return initializeApp(firebaseConfig);
}; 