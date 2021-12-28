import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase-config";
import {User} from '@firebase/auth-types';
import Loading from "../components/Loading/Loading";

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
        return <Loading />;
    }
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};