import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

interface FormErrorMessageProps {
  error?: string;
  visible?: boolean;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  error,
  visible,
}) => {
  if (!visible || !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
  },
});

export default FormErrorMessage;
