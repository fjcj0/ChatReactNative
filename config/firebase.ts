import { PUBLIC_EXPO_API_KEY, PUBLIC_EXPO_APP_ID, PUBLIC_EXPO_AUTH_DOMAIN, PUBLIC_EXPO_MEASUREMENT_ID, PUBLIC_EXPO_MESSAGING_SENDER_ID, PUBLIC_EXPO_PROJECT_ID, PUBLIC_EXPO_STORAGE_BUCKET } from "@/local.config";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: PUBLIC_EXPO_API_KEY,
    authDomain: PUBLIC_EXPO_AUTH_DOMAIN,
    projectId: PUBLIC_EXPO_PROJECT_ID,
    storageBucket: PUBLIC_EXPO_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_EXPO_MESSAGING_SENDER_ID,
    appId: PUBLIC_EXPO_APP_ID,
    measurementId: PUBLIC_EXPO_MEASUREMENT_ID
};
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();