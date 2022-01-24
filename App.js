import React from "react";
import { Text,View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login_screen from "./custom_components/login";
import Lists_screen_nav from "./custom_components/lists";
import { store } from "./custom_components/redux/store";
import { Provider } from "react-redux";
const Stack=createNativeStackNavigator();
function App(){
  return(
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
      >
        <Stack.Screen name='login' component={Login_screen} options={{header:()=>null}} />
        <Stack.Screen name='lists' component={Lists_screen_nav} options={{title:"secure list"}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  )
}
export default App;