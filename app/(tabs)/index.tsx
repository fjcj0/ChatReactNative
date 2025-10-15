import { colors } from '@/constant';
import { useChats } from '@/context/ChatsContext';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const Chats = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const { users, loading } = useChats();
    useEffect(() => {
        inputRef.current?.focus();
        setIsFocused(true);
    }, []);
    const onChangeText = (text: string) => {
        setSearchText(text);
    };
    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchText.toLowerCase())
    );
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading users...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerSearch}>
                <TextInput
                    ref={inputRef}
                    style={[
                        styles.input,
                        { borderColor: isFocused ? colors.primary : '#ccc' },
                    ]}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
            <ScrollView style={styles.chatList} contentContainerStyle={styles.chatContent}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <TouchableOpacity key={user.uid} style={styles.viewChatStyle}>
                            <Image source={{ uri: user.profilePicture }} style={styles.imageStyle} />
                            <View>
                                <Text style={styles.textChat}>{`${user.firstName} ${user.lastName}`}</Text>
                                <Text style={{ marginTop: 4, color: 'gray' }}>
                                    Joined At: {new Date(user.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                        No users found
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};
export default Chats;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    containerSearch: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    },
    chatList: {
        flex: 1,
        marginBottom: 10,
    },
    chatContent: {
        paddingVertical: 5,
        rowGap: 20,
    },
    viewChatStyle: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    imageStyle: {
        width: 60,
        height: 60,
        borderRadius: 500,
    },
    textChat: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black',
    },
});