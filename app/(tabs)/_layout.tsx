import { colors } from '@/constant';
import { useAuth } from '@/context/AuthContext';
import { ChatsProvider } from '@/context/ChatsContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading]);

    if (loading) return null;
    return <>{children}</>;
};
const TabsLayout = () => {
    return (
        <ChatsProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarActiveTintColor: colors.primary,
                        tabBarInactiveTintColor: 'gray',
                        tabBarStyle: styles.barContainer,
                        tabBarItemStyle: styles.barsStyle,
                        tabBarIcon: ({ color, size, focused }) => {
                            let iconName;
                            if (route.name === 'index') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            else if (route.name === 'profile') iconName = focused ? 'person' : 'person-outline';
                            return <Ionicons name={iconName as any} size={size} color={color} />;
                        },
                    })}
                >
                    <Tabs.Screen name="index" options={{ title: 'Chats' }} />
                    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
                </Tabs>
            </SafeAreaView>
        </ChatsProvider>
    );
};
export default TabsLayout;
const styles = StyleSheet.create({
    barContainer: {
        width: '90%',
        height: 60,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 'auto',
        borderRadius: 25,
    },
    barsStyle: {
        marginTop: 5,
    }
});