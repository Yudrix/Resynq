import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { auth } from '../utils/firebase';

export function FirebaseInitializer({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const intializer = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                if (auth) {
                    console.log("Firebase Auth is initialized succesfully");
                    setIsReady(true);
                } else {}
            }
        }
    })
}