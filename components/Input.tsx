import { InputProps } from '@/global';
import React, { useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
const Input: React.FC<InputProps> = ({ placeholder, text, onChangeText, secureTextEntry }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const labelPosition = useState(new Animated.Value(text ? 1 : 0))[0];
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(labelPosition, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };
    const handleBlur = () => {
        setIsFocused(false);
        if (!text) {
            Animated.timing(labelPosition, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    };
    const labelStyle = {
        position: 'absolute' as const,
        left: 10,
        top: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [16, -10],
        }),
        fontSize: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: isFocused ? 'coral' : '#888',
        backgroundColor: 'white',
        paddingHorizontal: 4,
        zIndex: 2,
        elevation: 2,
        pointerEvents: 'none' as const,
    };
    return (
        <View style={styles.container}>
            <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
            <TextInput
                value={text ?? ''}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[
                    styles.input,
                    { borderColor: isFocused ? 'coral' : '#ccc' },
                ]}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 300,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 12,
        height: 50,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: 'white',
    },
});
export default Input;