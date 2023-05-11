import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase/firebase.init';
export const AuthContext = createContext(null);

const auth = getAuth(app);
const AuthProviders = ({ children }) => {
    const [loader, setLoader] = useState(true);
    const [user, setUser] = useState(null);
    // * Register 
    const createUser = (email, password) => {
        setLoader(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // * Login 
    const login = (email, password) => {
        setLoader(true);
        return signInWithEmailAndPassword(auth, email, password);
    }




    //  * Make a observer for user login or logout 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , user => {
            setUser(user);
            setLoader(false);
        })
        return () => unsubscribe();
    }, [])
    // console.log(user)
    const conValue = { createUser, user, loader , login , setLoader };
    return (
        <AuthContext.Provider value={conValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProviders;