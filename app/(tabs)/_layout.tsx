import { colors } from '@/constant';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const TabsLayout = () => {
    return (
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
                        if (route.name === 'index') {
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                        } else if (route.name === 'profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }
                        return <Ionicons name={iconName as any} size={size} color={color} />;
                    },
                })}
            >
                <Tabs.Screen name="index" options={{ title: 'Chats' }}
                />
                <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            </Tabs>
        </SafeAreaView>
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