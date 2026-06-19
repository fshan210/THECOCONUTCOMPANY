"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebasePublicConfig, isFirebasePublicConfigured } from "@/lib/firebase/config";

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseClientApp(): FirebaseApp {
  if (!isFirebasePublicConfigured()) {
    throw new Error("Firebase public configuration is missing.");
  }

  return getApps().length ? getApp() : initializeApp(firebasePublicConfig);
}

export function getFirebaseClientAuth(): Auth {
  const auth = getAuth(getFirebaseClientApp());
  void setPersistence(auth, browserLocalPersistence);
  return auth;
}

export function getFirebaseClientDb(): Firestore {
  return getFirestore(getFirebaseClientApp());
}

export function getFirebaseClientStorage(): FirebaseStorage {
  return getStorage(getFirebaseClientApp());
}

export function getGoogleAuthProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export function getFirebaseAnalyticsClient() {
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) => (supported ? getAnalytics(getFirebaseClientApp()) : null));
  }
  return analyticsPromise;
}
