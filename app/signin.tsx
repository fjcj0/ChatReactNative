import Button from '@/components/Button';
import Input from '@/components/Input';
import { appIcon } from '@/constant';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signIn } = useAuth();
    const onRoute = () => {
        router.replace('/signup');
    };
    const onSubmit = async () => {
        if (!email || !password) return;
        setIsLoading(true);
        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (error) {
            error instanceof Error ? console.log(error.message) : console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerImage}>
                <Image source={appIcon} style={styles.imageStyle} />
            </View>
            <View style={styles.containerForm}>
                <Input
                    placeholder="Email"
                    text={email}
                    onChangeText={setEmail}
                />
                <Input
                    placeholder="Password"
                    text={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <Button text={'Sign In'} onPress={onSubmit} isLoading={isLoading} />
                <View style={styles.containerFooter}>
                    <TouchableOpacity onPress={onRoute}>
                        <Text>{"You don't have an account? sign up"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    containerForm: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 5,
        width: '100%',
    },
    containerFooter: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: 7,
    },
});
export default SignIn;