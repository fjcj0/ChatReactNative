export interface InputProps {
    placeholder: string;
    text: string | null;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}
export interface ButtonProps {
    text: string;
    onPress: () => Promise<void> | void;
    isLoading: boolean;
}