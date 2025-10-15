import Button from '@/components/Button';
import Input from '@/components/Input';
import { colors } from '@/constant';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
const Profile = () => {
    const { user, updateDisplayName, updateProfilePicture, signOut } = useAuth();
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newProfile, setNewProfile] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to change your profile picture!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setNewProfile(uri);
            setIsLoading(true);
            try {
                await updateProfilePicture(uri);
                Alert.alert('Success', 'Profile picture updated!');
            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Error', 'Failed to update profile picture.');
            } finally {
                setIsLoading(false);
            }
        }
    };
    const onEditData = async () => {
        if (!newFirstName && !newLastName) return;
        setIsLoading(true);
        try {
            await updateDisplayName(
                newFirstName || user?.firstName || '',
                newLastName || user?.lastName || ''
            );
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating display name:', error);
            Alert.alert('Error', 'Failed to update name.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleLogout = async () => {
        await signOut();
    };
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: newProfile || user?.profilePicture }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <TouchableOpacity style={styles.buttonEditPicture} onPress={pickImage}>
                    <MaterialCommunityIcons name="image-edit" color="white" size={22} />
                </TouchableOpacity>
            </View>
            <View style={styles.containerInformation}>
                <Input
                    placeholder={user?.firstName || 'New First Name'}
                    text={newFirstName}
                    secureTextEntry={false}
                    onChangeText={setNewFirstName}
                />
                <Input
                    placeholder={user?.lastName || 'New Last Name'}
                    text={newLastName}
                    secureTextEntry={false}
                    onChangeText={setNewLastName}
                />
                <View style={styles.containerButton}>
                    <Button text="Edit" onPress={onEditData} isLoading={isLoading} />
                    <Button
                        text="Logout"
                        onPress={handleLogout}
                        isLoading={false}
                    />
                </View>
            </View>
        </View>
    );
};
export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        rowGap: 10,
        backgroundColor: 'white',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    buttonEditPicture: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 30,
        height: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    containerInformation: {
        flexDirection: 'column',
        rowGap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerButton: {
        flexDirection: 'row',
        columnGap: 5,
    }
});