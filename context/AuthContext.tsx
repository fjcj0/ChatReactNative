import { auth, database } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
type UserType = {
    uid: string;
    email: string | null;
    firstName: string;
    lastName: string;
    profilePicture: string;
} | null;
type AuthContextType = {
    user: UserType;
    loading: boolean;
    signUp: (email: string, password: string, firstName: string, lastName: string, profilePicture: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docRef = doc(database, "users", firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data() as UserType);
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        firstName: firebaseUser.displayName?.split(" ")[0] || "",
                        lastName: firebaseUser.displayName?.split(" ")[1] || "",
                        profilePicture: firebaseUser.photoURL || "",
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const signUp = async (email: string, password: string, firstName: string, lastName: string, profilePicture: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, {
                displayName: `${firstName} ${lastName}`,
                photoURL: profilePicture,
            });
            await setDoc(doc(database, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                firstName,
                lastName,
                profilePicture,
                createdAt: new Date().toISOString(),
            });
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                firstName,
                lastName,
                profilePicture,
            });
            return firebaseUser.uid;
        } catch (error: any) {
            console.error("Error signing up:", error.message);
            return null;
        }
    };
    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const docRef = doc(database, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUser(docSnap.data() as UserType);
            } else {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    firstName: firebaseUser.displayName?.split(" ")[0] || "",
                    lastName: firebaseUser.displayName?.split(" ")[1] || "",
                    profilePicture: firebaseUser.photoURL || "",
                });
            }
            return firebaseUser.uid;
        } catch (error: any) {
            console.error("Error signing in:", error.message);
            return null;
        }
    };
    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider!");
    return context;
};