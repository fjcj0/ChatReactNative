import Button from '@/components/Button';
import Input from '@/components/Input';
import { appIcon } from '@/constant';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const onRoute = () => {
        router.replace('/signup');
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
                />
                <Button text={'Sign In'} />
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