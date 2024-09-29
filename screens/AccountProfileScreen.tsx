import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
    Home: undefined;
    AccountProfile: undefined;
};

type AccountProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "AccountProfile"
>;

const AccountProfileScreen = () => {
    const navigation = useNavigation<AccountProfileScreenNavigationProp>();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "Huyền Trinh",
        email: "huyen.trinh@example.com",
        phone: "+84 123 456 789",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        avatarURL: "https://example.com/profile-picture.jpg",
    });

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.error("User is not authenticated");
            return;
        }

        const userDocRef = doc(db, "users", userId);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUserInfo({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    avatarURL: data.avatarURL || userInfo.avatarURL,
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSave = async () => {
        if (
            !userInfo.name ||
            !userInfo.email ||
            !userInfo.phone ||
            !userInfo.address
        ) {
            Alert.alert("Validation Error", "All fields are required.");
            return;
        }

        try {
            setLoading(true);
            const userId = auth.currentUser?.uid;
            if (!userId) {
                throw new Error("User is not authenticated");
            }
            const userDocRef = doc(db, "users", userId);

            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                await updateDoc(userDocRef, {
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    address: userInfo.address,
                    avatarURL: userInfo.avatarURL,
                });
            } else {
                await setDoc(userDocRef, {
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    address: userInfo.address,
                    avatarURL: userInfo.avatarURL,
                });
            }

            Alert.alert("Success", "Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile: ", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: () => {
                        auth.signOut().then(() => {
                            navigation.navigate("Home");
                        });
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setUserInfo({ ...userInfo, avatarURL: result.assets[0].uri });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FF6B6B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Profile</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Ionicons
                        name={isEditing ? "save-outline" : "create-outline"}
                        size={24}
                        color="#FF6B6B"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: userInfo.avatarURL }}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Name</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={userInfo.name}
                                onChangeText={(text) =>
                                    setUserInfo({ ...userInfo, name: text })
                                }
                            />
                        ) : (
                            <Text style={styles.value}>{userInfo.name}</Text>
                        )}
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Email</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={userInfo.email}
                                onChangeText={(text) =>
                                    setUserInfo({ ...userInfo, email: text })
                                }
                                keyboardType="email-address"
                            />
                        ) : (
                            <Text style={styles.value}>{userInfo.email}</Text>
                        )}
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Phone</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={userInfo.phone}
                                onChangeText={(text) =>
                                    setUserInfo({ ...userInfo, phone: text })
                                }
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.value}>{userInfo.phone}</Text>
                        )}
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Address</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={userInfo.address}
                                onChangeText={(text) =>
                                    setUserInfo({ ...userInfo, address: text })
                                }
                                multiline
                            />
                        ) : (
                            <Text style={styles.value}>{userInfo.address}</Text>
                        )}
                    </View>
                </View>

                {isEditing && !loading && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
                {loading && <Text style={styles.loadingText}>Saving...</Text>}
                {!isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
                        <Text style={styles.saveButtonText}>Logout</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    content: {
        padding: 20,
    },
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    changePhotoButton: {
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    changePhotoText: {
        color: "white",
        fontWeight: "bold",
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
    },
    saveButton: {
        backgroundColor: "#FF6B6B",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#666",
    },
});

export default AccountProfileScreen;
