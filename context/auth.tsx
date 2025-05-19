// If you are reading this file, as you can see it's makeshift and not made to last. I am following an auth tutorial if you are wondering about the cleanliness of my code :)
//I made a LOT of errors in this file, camelCase is so annoying. This the reason it took 6 hours for just Auth lol
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // I'm not the best at Auth and backend so I like to follow tutorials for it, no need to remind me about it

type Userdata = {
    email: string;
    displayName: string;
    craetedAt: Date;

}

type AuthContextType = {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
}; // Basic info while sign up for now REMINDER to add more later

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    signIn: async () => {},
    signUp: async () => {},
    logout: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
}