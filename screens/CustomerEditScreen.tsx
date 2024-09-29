import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

type RootStackParamList = {
  Home: undefined;
};

type EditCustomerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface CustomerItemProps {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const EditCustomerScreen = () => {
  const navigation = useNavigation<EditCustomerScreenNavigationProp>();
  const route = useRoute();
  const { customer } = route.params as { customer: CustomerItemProps };

  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);

  const handleUpdateCustomer = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const db = getFirestore();
    const customerRef = doc(db, "customers", customer.id);

    try {
      await updateDoc(customerRef, {
        name,
        email,
        phone,
      });
      Alert.alert("Success", "Customer updated successfully!");
      navigation.goBack(); // Navigate back after updating
    } catch (error) {
      Alert.alert("Error", "Failed to update customer. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Customer</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer email"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer phone"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateCustomer}
        >
          <Text style={styles.saveButtonText}>Update Customer</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#FF6B6B",
    padding: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditCustomerScreen;
