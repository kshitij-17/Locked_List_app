import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import List_screen from "./showlist";
import Logout_screen from "./logout";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
const Material = createMaterialBottomTabNavigator();
export default function Lists_screen_nav() {
    return (
        <Material.Navigator

            shifting={true}
            screenOptions={({ route }) => (
                {

                    tabBarIcon: ({ focused, size, color }) => {
                        let iconName;
                        if (route.name == 'showlists') {
                            iconName = 'list'
                            size = focused ? 25 : 20;
                        }
                        else if (route.name == 'logout') {
                            iconName = 'cog'
                            size = focused ? 25 : 20;
                        }
                        return (
                            <FontAwesome5
                                name={iconName}
                                size={size}
                            />
                        )
                    }
                }

            )}>
            <Material.Screen name='showlists' component={List_screen} options={{ title: 'list' }} />
            <Material.Screen name='logout' component={Logout_screen} options={{ tabBarColor: "red", title: 'settings' }} />
        </Material.Navigator>

    )
}