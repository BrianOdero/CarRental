import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, Tabs } from "expo-router";

export default function HomePageLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                borderRadius: 10,
                borderColor: "black",
                backgroundColor: "black",
                margin: 1,
            }
        }}>
            <Tabs.Screen name="homepage" options={{
                headerShown: false,
                tabBarIcon: ({color}) => (<Ionicons name="home" size={24} color={color} />),
                tabBarLabel: "Home",
                tabBarActiveTintColor: "white",
            }}/>
            <Tabs.Screen name="records" options={{
                headerShown: false,
                tabBarIcon: ({color}) => (<Ionicons name="list" size={24} color={color} />),
                tabBarLabel: "Records",
                tabBarActiveTintColor: "white",
            }}/>
            <Tabs.Screen name="settings" options={{
                headerShown: false,
                tabBarIcon: ({color}) => (<Ionicons name="settings" size={24} color={color} />),
                tabBarLabel: "Settings",
                tabBarActiveTintColor: "white",
            }}/>
        </Tabs>
    )
}