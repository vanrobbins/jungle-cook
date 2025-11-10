// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration via Vite env
export const firebaseConfig = {
	apiKey: import.meta.env.VITE_PUBLIC_API_KEY,
	authDomain: import.meta.env.VITE_PUBLIC_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID,
	storageBucket: import.meta.env.VITE_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_PUBLIC_MSG_SENDER_ID,
	appId: import.meta.env.VITE_PUBLIC_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
