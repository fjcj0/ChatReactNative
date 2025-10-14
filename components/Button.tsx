import { colors } from '@/constant';
import { ButtonProps } from '@/global';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
const Button = ({ text, onPress, isLoading }: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.buttonStyle, isLoading && styles.disabledButton]}
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.textStyle}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    buttonStyle: {
        width: 150,
        height: 50,
        padding: 5,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
});