import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import UserScreen from './src/screens/UserScreen'; // Updated UserScreen
import AddNewForm from './src/screens/AddNewForm';
import MyProfileScreen from './src/screens/MyProfileScreen';
import DetailScreen from './src/screens/DetailsScreen';
import AddDealerScreen from './src/screens/AddDealerScreen';
import EmployeeList from './src/screens/EmployeeList';
import EmployeeDetails from './src/screens/EmployeeDetails';
import ManageForm from './src/screens/ManageForm';
import UserDetailScreen from './src/screens/UserDetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminScreen"
          component={AdminScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddNewForm"
          component={AddNewForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen
          name="AddDealerScreen"
          component={AddDealerScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmployeeList"
          component={EmployeeList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmployeeDetails"
          component={EmployeeDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManageForm"
          component={ManageForm}
          options={{headerShown: true}}
        />
        <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
