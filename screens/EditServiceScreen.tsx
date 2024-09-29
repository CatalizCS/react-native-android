import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

type RootStackParamList = {
  ServiceDetail: {
    service: {
      id: string;
      name: string;
      price: number;
      description: string;
      duration: number;
      category: string;
    };
  };
};

type Props = StackScreenProps<RootStackParamList, "ServiceDetail">;

const EditServiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;

  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price.toString());
  const [description, setDescription] = useState(service.description);
  const [duration, setDuration] = useState(service.duration.toString());
  const [category, setCategory] = useState(service.category);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price || !description || !duration || !category) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const updatedPrice = parseFloat(price);
    const updatedDuration = parseInt(duration, 10);

    if (isNaN(updatedPrice) || isNaN(updatedDuration)) {
      Alert.alert(
        "Validation Error",
        "Price and Duration must be valid numbers."
      );
      return;
    }

    try {
      setLoading(true);

      const serviceRef = doc(db, "services", service.id);

      await updateDoc(serviceRef, {
        name,
        price: updatedPrice,
        description,
        duration: updatedDuration,
        category,
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Service updated successfully!");

      navigation.navigate("ServiceDetail", {
        service: {
          ...service,
          name,
          price: updatedPrice,
          description,
          duration: updatedDuration,
          category,
        },
      });
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Failed to update the service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B6B" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Service</Text>
      </View>

      <View style={styles.form}>
        {/* Service Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        {/* Price */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price (VND)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Duration */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        {/* Category */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FF6B6B",
    padding: 15,
    paddingTop: (StatusBar.currentHeight ?? 0) + 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default EditServiceScreen;
