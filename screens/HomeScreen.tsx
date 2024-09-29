import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
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
} from "firebase/firestore";

type RootStackParamList = {
  Home: undefined;
  ServiceDetail: { service: ServiceItemProps };
  AccountProfile: undefined;
  AddService: undefined;
  Customers: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface ServiceItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceItem: React.FC<
  ServiceItemProps & { onPress: (service: ServiceItemProps) => void }
> = ({
  id,
  name,
  price,
  description,
  duration,
  category,
  onPress,
  createdAt,
  updatedAt,
}) => (
  <TouchableOpacity
    style={styles.serviceItem}
    onPress={() =>
      onPress({
        id,
        name,
        price,
        description,
        duration,
        category,
        createdAt,
        updatedAt,
      })
    }
  >
    <View style={styles.serviceHeader}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.servicePrice}>{price.toLocaleString("vi-VN")} đ</Text>
    </View>
    <Text style={styles.serviceDescription} numberOfLines={2}>
      {description}
    </Text>
    <View style={styles.serviceFooter}>
      <Text style={styles.serviceDuration}>{duration} minutes</Text>
      <Text style={styles.serviceCategory}>{category}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ServiceItemProps[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const servicesData: ServiceItemProps[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        servicesData.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          description: data.description,
          duration: data.duration,
          category: data.category,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt
            ? data.updatedAt.toDate()
            : data.createdAt.toDate(),
        } as ServiceItemProps);
      });
      setServices(servicesData);
    });

    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchQuery?.toLowerCase() ?? "") ||
      service.description
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() ?? "") ||
      service.category?.toLowerCase().includes(searchQuery?.toLowerCase() ?? "")
  );

  const handleServicePress = (service: ServiceItemProps) => {
    navigation.navigate("ServiceDetail", { service });
  };

  const handleProfilePress = () => {
    navigation.navigate("AccountProfile");
  };

  const handleAddServicePress = () => {
    navigation.navigate("AddService");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HUYỀN TRINH</Text>
        <TouchableOpacity onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://example.com/kami-spa-logo.png" }}
          style={styles.logo}
          resizeMode="contain"
        />
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
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.serviceListHeader}>
        <Text style={styles.serviceListTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddServicePress}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.serviceList}>
        {filteredServices.map((service) => (
          <ServiceItem
            key={service.id}
            {...service}
            onPress={handleServicePress}
          />
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="#FF6B6B" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="card" size={24} color="#999" />
          <Text style={styles.navText}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Customers")}
        >
          <Ionicons name="people" size={24} color="#999" />
          <Text style={styles.navText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings" size={24} color="#999" />
          <Text style={styles.navText}>Setting</Text>
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
  logoContainer: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 50,
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
  serviceListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  serviceListTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 15,
    padding: 5,
  },
  serviceList: {
    flex: 1,
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    color: "#999",
  },
  serviceItem: {
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
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceDuration: {
    fontSize: 12,
    color: "#999",
  },
  serviceCategory: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
});

export default HomeScreen;
