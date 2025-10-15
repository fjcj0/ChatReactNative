import Input from '@/components/Input';
import { database } from '@/config/firebase';
import { colors } from '@/constant';
import { useAuth } from '@/context/AuthContext';
import { PUBLIC_EXPO_CLOUDINARY_UPLOAD_PRESET, PUBLIC_EXPO_URL_CLOUDAINRY } from '@/local.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type MessageType = {
    id: string;
    senderId: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    createdAt?: any;
};
const uploadToCloudinary = async (uri: string) => {
    try {
        const formData = new FormData();
        formData.append("file", {
            uri,
            type: uri.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
            name: uri.split("/").pop(),
        } as any);
        formData.append("upload_preset", PUBLIC_EXPO_CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(PUBLIC_EXPO_URL_CLOUDAINRY, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.secure_url;
    } catch (error: any) {
        console.error("Cloudinary upload error:", error.response?.data || error.message);
        throw new Error("Failed to upload media to Cloudinary");
    }
};
const Chat = () => {
    const { user: currentUser } = useAuth();
    const params = useLocalSearchParams();
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);
    const otherUserId = params.uid as string;
    const otherUserName = params.name as string;
    const otherUserProfile = params.profilePicture as string;
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isSending, setIsSending] = useState(false);
    const chatId =
        currentUser && otherUserId
            ? [currentUser.uid, otherUserId].sort().join('_')
            : null;
    useEffect(() => {
        if (!chatId) return;
        const q = query(
            collection(database, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as MessageType[];
            setMessages(msgs);
            scrollRef.current?.scrollToEnd({ animated: true });
        });

        return () => unsubscribe();
    }, [chatId]);
    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
            setMedia({
                uri: result.assets[0].uri,
                type: result.assets[0].type === 'video' ? 'video' : 'image',
            });
        }
    };
    const removeMedia = () => setMedia(null);
    const sendMessage = async () => {
        if (!chatId || (!message && !media)) return;
        setIsSending(true);
        try {
            let uploadedUrl: string | null = null;
            let mediaType: 'image' | 'video' | undefined = undefined;
            if (media) {
                uploadedUrl = await uploadToCloudinary(media.uri);
                mediaType = media.type;
            }
            await addDoc(collection(database, 'chats', chatId, 'messages'), {
                senderId: currentUser?.uid,
                text: message || '',
                mediaUrl: uploadedUrl || null,
                mediaType,
                createdAt: serverTimestamp(),
            });
            setMessage('');
            setMedia(null);
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.containerHeader}>
                    <TouchableOpacity
                        style={styles.buttonHeaderStyle}
                        onPress={() => router.back()}
                    >
                        <MaterialCommunityIcons name='arrow-left' size={20} color="#fff" />
                    </TouchableOpacity>
                    {otherUserProfile && (
                        <Image
                            source={{ uri: otherUserProfile }}
                            style={{ width: 60, height: 60, borderRadius: 50 }}
                        />
                    )}
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{otherUserName}</Text>
                </View>
                <ScrollView
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    ref={scrollRef}
                >
                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.uid;
                        return (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageContainer,
                                    isMe ? styles.messageRight : styles.messageLeft,
                                ]}
                            >
                                {!isMe && otherUserProfile && (
                                    <Image
                                        source={{ uri: otherUserProfile }}
                                        style={styles.senderProfileImage}
                                    />
                                )}
                                <View
                                    style={[
                                        styles.messageBubble,
                                        isMe ? styles.bubbleMe : styles.bubbleSender,
                                    ]}
                                >
                                    {msg.text && (
                                        <Text style={isMe ? styles.textMe : styles.textSender}>
                                            {msg.text}
                                        </Text>
                                    )}
                                    {msg.mediaUrl && (
                                        msg.mediaType === 'video' ? (
                                            <Video
                                                source={{ uri: msg.mediaUrl }}
                                                style={styles.messageVideo}
                                                useNativeControls
                                                resizeMode={ResizeMode.CONTAIN}
                                            />
                                        ) : (
                                            <Image
                                                source={{ uri: msg.mediaUrl }}
                                                style={styles.messageImage}
                                            />
                                        )
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                {media && (
                    <View style={styles.mediaPreview}>
                        <View style={styles.mediaWrapper}>
                            {media.type === 'video' ? (
                                <Video
                                    source={{ uri: media.uri }}
                                    style={styles.mediaImage}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                />
                            ) : (
                                <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                            )}
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
                        placeholder='Message'
                        secureTextEntry={false}
                    />
                    <TouchableOpacity onPress={pickMedia} disabled={isSending}>
                        <MaterialCommunityIcons name='image' size={25} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sendMessage} disabled={isSending || (!message && !media)}>
                        {isSending ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : (
                            <MaterialCommunityIcons name='send' size={25} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
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
    messageLeft: { justifyContent: 'flex-start' },
    messageRight: { justifyContent: 'flex-end' },
    senderProfileImage: { width: 35, height: 35, borderRadius: 18, marginRight: 8 },
    messageBubble: { maxWidth: '70%', padding: 10, borderRadius: 15 },
    bubbleMe: { backgroundColor: colors.primary, borderTopRightRadius: 0 },
    bubbleSender: { backgroundColor: '#e5e5ea', borderTopLeftRadius: 0 },
    textMe: { color: 'white', fontSize: 16 },
    textSender: { color: 'black', fontSize: 16 },
    messageImage: { width: 150, height: 150, borderRadius: 10, marginTop: 5 },
    messageVideo: { width: 200, height: 200, borderRadius: 10, marginTop: 5 },
});