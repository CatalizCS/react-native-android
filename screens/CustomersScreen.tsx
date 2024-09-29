import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

type RootStackParamList = {
  Home: undefined;
  AddCustomer: undefined;
  EditCustomer: { customer: CustomerItemProps };
  CustomerDetail: { customer: CustomerItemProps };
};

type CustomerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface CustomerItemProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const CustomerItem: React.FC<
  CustomerItemProps & {
    onPress: (customer: CustomerItemProps) => void;
    onDelete: (id: string) => void;
  }
> = ({ id, name, email, phone, onPress, onDelete }) => (
  <TouchableOpacity
    style={styles.customerItem}
    onPress={() =>
      onPress({
        id,
        name,
        email,
        phone,
        createdAt: new Date(),
      })
    }
  >
    <View style={styles.customerHeader}>
      <Text style={styles.customerName}>{name}</Text>
      <Text style={styles.customerEmail}>{email}</Text>
    </View>
    <View style={styles.customerFooter}>
      <Text style={styles.customerPhone}>{phone}</Text>
      <TouchableOpacity onPress={() => onDelete(id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const CustomersScreen = () => {
  const navigation = useNavigation<CustomerScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerItemProps[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData: CustomerItemProps[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        customersData.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          createdAt: data.createdAt.toDate(),
        });
      });
      setCustomers(customersData);
    });

    return () => unsubscribe();
  }, []);

  const handleCustomerPress = (customer: CustomerItemProps) => {
    navigation.navigate("CustomerDetail", { customer });
  };

  const handleAddCustomerPress = () => {
    navigation.navigate("AddCustomer");
  };

  const handleDeleteCustomer = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "customers", id));
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <TouchableOpacity onPress={handleAddCustomerPress}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.customerList}>
        {filteredCustomers.map((customer) => (
          <CustomerItem
            key={customer.id}
            {...customer}
            onPress={handleCustomerPress}
            onDelete={handleDeleteCustomer}
          />
        ))}
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
    backgroundColor: "#FF6B6B",
    padding: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  customerList: {
    flex: 1,
  },
  customerItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  customerName: {
    flex: 1,
    fontSize: 16,
  },
  customerEmail: {
    fontSize: 14,
    color: "#666",
  },
  customerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerPhone: {
    fontSize: 14,
    color: "#666",
  },
});

export default CustomersScreen;
