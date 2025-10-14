export interface InputProps {
    placeholder: string;
    text: string | null;
    onChangeText: (text: string) => void;
}