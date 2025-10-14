import Input from '@/components/Input';
import { colors, messages } from '@/constant';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState<string>('');
    const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);

    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setMedia({
                uri: result.assets[0].uri,
                type: result.assets[0].type === 'video' ? 'video' : 'image',
            });
        }
    };

    const removeMedia = () => setMedia(null);

    const sendMessage = () => {
        console.log('Message:', message);
        console.log('Media:', media);
        setMessage('');
        setMedia(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity
                    style={styles.buttonHeaderStyle}
                    onPress={() => console.log('Back pressed')}>
                    <MaterialCommunityIcons name='arrow-left' size={20} color="#fff" />
                </TouchableOpacity>
                {user?.profilePicture && (
                    <Image
                        source={{ uri: user.profilePicture }}
                        style={{ width: 60, height: 60, borderRadius: 50 }}
                    />
                )}
            </View>

            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ paddingVertical: 10 }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg, index) => {
                    const isMe = msg.role === 'me';
                    return (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                isMe ? styles.messageRight : styles.messageLeft,
                            ]}
                        >
                            {!isMe && msg.image && (
                                <Image
                                    source={msg.image}
                                    style={styles.senderProfileImage}
                                />
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    isMe ? styles.bubbleMe : styles.bubbleSender,
                                ]}
                            >
                                {msg.message && (
                                    <Text style={isMe ? styles.textMe : styles.textSender}>
                                        {msg.message}
                                    </Text>
                                )}
                                {msg.image && (
                                    <Image
                                        source={msg.image}
                                        style={styles.messageImage}
                                    />
                                )}
                                {msg.time && (
                                    <Text style={styles.timeText}>{msg.time}</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {media && (
                <View style={styles.mediaPreview}>
                    <View style={styles.mediaWrapper}>
                        <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                        <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
                            <MaterialCommunityIcons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={styles.containerFooter}>
                <Input
                    text={message}
                    onChangeText={setMessage}
                    placeholder={'Message'}
                    secureTextEntry={false}
                />
                <TouchableOpacity onPress={pickMedia}>
                    <MaterialCommunityIcons name='image' size={25} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage}>
                    <MaterialCommunityIcons name='send' size={25} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
    },
    containerHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 10,
    },
    buttonHeaderStyle: {
        width: 40,
        height: 40,
        backgroundColor: colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        columnGap: 5,
    },
    mediaPreview: {
        marginVertical: 8,
        width: '100%',
        alignItems: 'flex-start',
    },
    mediaWrapper: {
        position: 'relative',
        width: 150,
        height: 150,
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        padding: 2,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
        paddingHorizontal: 10,
    },
    messageLeft: {
        justifyContent: 'flex-start',
    },
    messageRight: {
        justifyContent: 'flex-end',
    },
    senderProfileImage: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 15,
    },
    bubbleMe: {
        backgroundColor: colors.primary,
        borderTopRightRadius: 0,
    },
    bubbleSender: {
        backgroundColor: '#e5e5ea',
        borderTopLeftRadius: 0,
    },
    textMe: {
        color: 'white',
        fontSize: 16,
    },
    textSender: {
        color: 'black',
        fontSize: 16,
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 5,
    },
    timeText: {
        fontSize: 12,
        marginTop: 8,
        alignSelf: 'flex-end',
        fontWeight: 'bold'
    },

});
