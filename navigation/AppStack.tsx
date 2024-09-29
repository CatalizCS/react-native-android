import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "@/screens/HomeScreen";
import ServiceDetailScreen from "@/screens/ServiceDetailScreen";
import AccountProfileScreen from "@/screens/AccountProfileScreen";
import AddServiceScreen from "@/screens/AddServiceScreen";
import EditServiceScreen from "@/screens/EditServiceScreen";
import CustomersScreen from "@/screens/CustomersScreen";
import AddCustomerScreen from "@/screens/AddCustomerScreen";
import CustomerDetailScreen from "@/screens/CustomerDetail";
import EditCustomerScreen from "@/screens/CustomerEditScreen";

type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string };
  ServiceDetail: undefined;
  AccountProfile: undefined;
  AddService: undefined;
  EditService: undefined;
  Customers: undefined;
  AddCustomer: undefined;
  CustomerDetail: undefined;
  EditCustomer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppStack: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountProfile"
          component={AccountProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddService"
          component={AddServiceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditService"
          component={EditServiceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Customers"
          component={CustomersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCustomer"
          component={AddCustomerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
