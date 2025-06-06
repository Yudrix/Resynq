import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { auth } from '../utils/firebase';

export function FirebaseInitializer({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializer = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                if (auth) {
                    console.log("Firebase Auth is initialized succesfully");
                    setIsReady(true);
                } else {
                    setError("Auth is not functioning");
                }
            } catch (error: any) {
                console.error("Firebase initialization error:", error);
                console.error("Error code:", error.code);
                console.error("Error message:", error.message);
                setError(error.message || "Unknown error");
            }
        };
        initializer();
    }, []);
     
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ color: 'red' }}>Firebase error</Text>
            </View>
        );
    }

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color=" #0000ff" />
                <Text>Loading</Text>
            </View>
        )
    }

    return <>{children}</>
}