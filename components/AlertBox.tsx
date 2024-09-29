import React from "react";
import { View, Text, Button, StyleSheet, Modal } from "react-native";

interface AlertBoxProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "error" | "success";
  onClose: () => void;
  onConfirm: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  visible,
  title,
  message,
  type = "success",
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            type === "error" ? styles.error : styles.success,
          ]}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <Button title="Confirm" onPress={onConfirm} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalMessage: {
    marginBottom: 15,
    textAlign: "center",
  },
  error: {
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: "#f8d7da",
  },
  success: {
    borderColor: "green",
    borderWidth: 2,
    backgroundColor: "#d4edda",
  },
});

export default AlertBox;
