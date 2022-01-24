import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase-config";
import {User} from '@firebase/auth-types';
import LoadingCircularProgress from "../components/LoadingCircularProgress/LoadingCircularProgress";

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser as User);
            setLoading(false);
        });

        return unsubscribe;
    }, []);
    if (loading) {
        return <LoadingCircularProgress />;
    }
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};