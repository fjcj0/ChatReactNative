import { colors } from '@/constant';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
const Button = ({ text }: { text: string }) => {
    return (
        <TouchableOpacity style={styles.buttonStyle}>
            <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
    );
}
export default Button;
const styles = StyleSheet.create({
    buttonStyle: {
        width: 150,
        height: 50,
        padding: 5,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textStyle: {
        fontWeight: 'bold',
        color: 'white'
    }
});