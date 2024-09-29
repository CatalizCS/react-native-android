import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

type RootStackParamList = {
  Home: undefined;
  EditCustomer: { customer: CustomerItemProps };
};

type CustomerDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface CustomerItemProps {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const CustomerDetailScreen = () => {
  const navigation = useNavigation<CustomerDetailScreenNavigationProp>();
  const route = useRoute();
  const { customer } = route.params as { customer: CustomerItemProps };

  const handleDeleteCustomer = async () => {
    const db = getFirestore();
    try {
      await deleteDoc(doc(db, "customers", customer.id));
      Alert.alert("Success", "Customer deleted successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to delete customer. Please try again.");
    }
  };

  const handleEditCustomerPress = () => {
    navigation.navigate("EditCustomer", { customer });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailText}>{customer.name}</Text>

        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailText}>{customer.email}</Text>

        <Text style={styles.detailLabel}>Phone:</Text>
        <Text style={styles.detailText}>{customer.phone}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditCustomerPress}
          >
            <Text style={styles.editButtonText}>Edit Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteCustomer}
          >
            <Text style={styles.deleteButtonText}>Delete Customer</Text>
          </TouchableOpacity>
        </View>
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
  detailContainer: {
    padding: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomerDetailScreen;
