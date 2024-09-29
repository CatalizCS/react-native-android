import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import AlertBox from "@/components/AlertBox"; // import the AlertBox

type RootStackParamList = {
  Home: undefined;
  ServiceDetail: {
    service: {
      id: string;
      name: string;
      price: number;
      description: string;
      duration: number;
      category: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  EditService: {
    service: {
      id: string;
      name: string;
      price: number;
      description: string;
      duration: number;
      category: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

type Props = StackScreenProps<RootStackParamList, "ServiceDetail">;

const ServiceDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;

  // State for managing alert visibility and action
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertType, setAlertType] = React.useState<"edit" | "delete" | null>(
    null
  );

  const handleConfirmAction = () => {
    if (alertType === "edit") {
      navigation.navigate("EditService", { service });
    } else if (alertType === "delete") {
      // Perform the delete action
      console.log("Service deleted:", service.id);
      navigation.goBack();
    }
    setAlertVisible(false);
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
        <Text style={styles.headerTitle}>Service detail</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Service name:</Text>
          <Text style={styles.value}>{service.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>
            {service.price.toLocaleString("vi-VN")} đ
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{service.description}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{service.duration} minutes</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{service.category}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>{service.createdAt.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Last updated:</Text>
          <Text style={styles.value}>{service.updatedAt.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {
            setAlertType("edit");
            setAlertVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => {
            setAlertType("delete");
            setAlertVisible(true);
          }}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* AlertBox for confirmation */}
      <AlertBox
        visible={alertVisible}
        title={alertType === "edit" ? "Confirm Edit" : "Confirm Delete"}
        message={
          alertType === "edit"
            ? "Are you sure you want to edit this service?"
            : "Are you sure you want to delete this service?"
        }
        type={alertType === "delete" ? "error" : "success"}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirmAction}
      />
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
  moreButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  infoItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceDetailScreen;
