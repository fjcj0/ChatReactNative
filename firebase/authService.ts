import { auth, database } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const signUpUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    profilePicture: string
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
            photoURL: profilePicture,
        });
        await setDoc(doc(database, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            firstName,
            lastName,
            profilePicture,
            createdAt: new Date().toISOString(),
        });
        return user;
    } catch (error: any) {
        console.error("Error signing up:", error.message);
        throw error;
    }
};

export const signInUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error("Error signing in:", error.message);
        throw error;
    }
};

export const signOutUser = async () => {
    await signOut(auth);
};

export const checkUserLogin = async (): Promise<null | {
    uid: string;
    email: string | null;
    firstName: string;
    lastName: string;
    profilePicture: string;
}> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(database, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    resolve(docSnap.data() as any);
                } else {
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        firstName: user.displayName?.split(" ")[0] || "",
                        lastName: user.displayName?.split(" ")[1] || "",
                        profilePicture: user.photoURL || "",
                    });
                }
            } else {
                resolve(null);
            }
        });
    });
};