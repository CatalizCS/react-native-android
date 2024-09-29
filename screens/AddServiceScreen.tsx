import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import FormErrorMessage from "@/components/FormErrorMessage";
import AlertBox from "@/components/AlertBox";

type RootStackParamList = {
  Home: undefined;
  AddService: undefined;
};

type AddServiceScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddService"
>;

const categories = [
  "Facial",
  "Massage",
  "Hair Care",
  "Nail Care",
  "Body Treatment",
  "Other",
];

const AddServiceScreen = () => {
  const navigation = useNavigation<AddServiceScreenNavigationProp>();
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceCategory, setServiceCategory] = useState(categories[0]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddService = async () => {
    if (
      serviceName.trim() === "" ||
      servicePrice.trim() === "" ||
      serviceDescription.trim() === "" ||
      serviceDuration.trim() === ""
    ) {
      setError("Please fill in all fields");
      return;
    }

    const db = getFirestore();
    try {
      await addDoc(collection(db, "services"), {
        name: serviceName.trim(),
        price: parseFloat(servicePrice),
        description: serviceDescription.trim(),
        duration: parseInt(serviceDuration),
        category: serviceCategory,
        createdAt: new Date(),
      });

      setServiceName("");
      setServicePrice("");
      setServiceDescription("");
      setServiceDuration("");
      setServiceCategory(categories[0]);

      setSuccess("Service added successfully");
    } catch (error) {
      console.error("Error adding service: ", error);
      Alert.alert("Error", "Failed to add service. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {success && (
          <AlertBox
            type="success"
            message={success}
            visible={success !== null}
            title={"Add Service"}
            onClose={() => setSuccess(null)}
            onConfirm={() => setSuccess(null)}
          />
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={serviceName}
            onChangeText={setServiceName}
            placeholder="Enter service name"
          />
          <FormErrorMessage
            error={error ?? undefined}
            visible={error !== null}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price (VND)</Text>
          <TextInput
            style={styles.input}
            value={servicePrice}
            onChangeText={setServicePrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />
          <FormErrorMessage
            error={error ?? undefined}
            visible={error !== null}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={serviceDescription}
            onChangeText={setServiceDescription}
            placeholder="Enter service description"
            multiline
            numberOfLines={4}
          />
          <FormErrorMessage
            error={error ?? undefined}
            visible={error !== null}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={serviceDuration}
            onChangeText={setServiceDuration}
            placeholder="Enter duration in minutes"
            keyboardType="numeric"
          />
          <FormErrorMessage
            error={error ?? undefined}
            visible={error !== null}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={serviceCategory}
            onValueChange={(itemValue) => setServiceCategory(itemValue)}
            style={[styles.picker, { height: 40, width: "100%" }]}
          >
            {categories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker>
          <FormErrorMessage
            error={error ?? undefined}
            visible={error !== null}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddServiceScreen;
