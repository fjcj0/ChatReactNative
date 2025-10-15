import { database } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type UserType = {
    uid: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    createdAt: string;
};

type ChatsContextType = {
    users: UserType[];
    loading: boolean;
};

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

export const ChatsProvider = ({ children }: { children: React.ReactNode }) => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(database, "users");
                const snapshot = await getDocs(usersCollection);
                const allUsers: UserType[] = snapshot.docs
                    .map(doc => doc.data() as UserType)
                    .filter(u => u.uid !== currentUser?.uid);
                setUsers(allUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) fetchUsers();
    }, [currentUser]); // re-run when currentUser changes

    return (
        <ChatsContext.Provider value={{ users, loading }}>
            {children}
        </ChatsContext.Provider>
    );
};

export const useChats = () => {
    const context = useContext(ChatsContext);
    if (!context) throw new Error("useChats must be used within a ChatsProvider!");
    return context;
};
