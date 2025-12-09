export const ENV_CONFIG = {
    // Toggle between 'mock' and 'firebase' via environment variable
    DATA_MODE: process.env.NEXT_PUBLIC_KAITE_DATA_MODE || 'mock',

    // Firebase config (only used when DATA_MODE === 'firebase')
    FIREBASE_CONFIG: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    },

    // MVP Feature Flags
    FEATURES: {
        enableLeaderboard: true,
        enableQuests: true,
        enableStreakProtection: false,  // Deferred to post-MVP
        enableSecretBadges: false,      // Deferred to post-MVP
        enableMultiScopeLeaderboards: false  // Deferred to post-MVP
    }
};
