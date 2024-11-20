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
        <Stack.Screen name="Detail" component={DetailScreen}        
        />
        <Stack.Screen name="AddDealerScreen" component={AddDealerScreen}           options={{headerShown: false}}
 />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
