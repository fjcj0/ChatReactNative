import { auth, database } from "@/config/firebase";
import { PUBLIC_EXPO_CLOUDINARY_UPLOAD_PRESET, PUBLIC_EXPO_URL_CLOUDAINRY } from "@/local.config";
import axios from "axios";
import { useRouter } from "expo-router";
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
    updateProfilePicture: (newProfileUrl: string) => Promise<void>;
    updateDisplayName: (firstName: string, lastName: string) => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
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
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, firstName, lastName, profilePicture });
            return firebaseUser.uid;
        } catch (error: any) {
            console.log("Error signing up:", error.message);
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
            console.log("Error signing in:", error.message);
            return null;
        }
    };
    const signOut = async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };
    const uploadToCloudinary = async (uri: string) => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "image/jpeg",
                name: uri.split("/").pop(),
            } as any);
            formData.append("upload_preset", PUBLIC_EXPO_CLOUDINARY_UPLOAD_PRESET);
            const response = await axios.post(PUBLIC_EXPO_URL_CLOUDAINRY, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.secure_url;
        } catch (error: any) {
            console.error("Cloudinary upload error:", error.response?.data || error.message);
            throw new Error("Failed to upload image to Cloudinary");
        }
    };
    const updateProfilePicture = async (newProfileUri: string) => {
        if (!user) return;
        try {
            const cloudinaryUrl = await uploadToCloudinary(newProfileUri);
            await updateProfile(auth.currentUser!, { photoURL: cloudinaryUrl });
            const userRef = doc(database, "users", user.uid);
            await setDoc(
                userRef,
                { profilePicture: cloudinaryUrl, updatedAt: new Date().toISOString() },
                { merge: true }
            );
            setUser(prev => (prev ? { ...prev, profilePicture: cloudinaryUrl } : prev));
            console.log("Profile picture updated successfully!");
        } catch (error: any) {
            console.log("Error updating profile picture:", error.message);
            throw new Error(error.message);
        }
    };
    const updateDisplayName = async (firstName: string, lastName: string) => {
        if (!auth.currentUser || !user) return;
        try {
            const displayName = `${firstName} ${lastName}`;
            await updateProfile(auth.currentUser, { displayName });
            const userRef = doc(database, "users", user.uid);
            await setDoc(userRef, { firstName, lastName, updatedAt: new Date().toISOString() }, { merge: true });
            setUser(prev => prev ? { ...prev, firstName, lastName } : prev);
            console.log("Display name updated successfully!");
        } catch (error: any) {
            console.log("Error updating display name:", error.message);
        }
    };
    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfilePicture, updateDisplayName }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider!");
    return context;
};