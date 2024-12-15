import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, Tabs, useRouter } from "expo-router";

export default function HomePageLayout() {

    const router = useRouter()

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
            <Tabs.Screen name="details" options={{
                href:null,
                headerLeft: () => (
                    <Ionicons name="arrow-back-outline" size={24} color="gray" style={{marginRight: 20,marginLeft: 10}} onPress={() => router.back()}/>
                ),
                headerTitle: "Vehicle Details",
                tabBarStyle: {display: "none"},
            }}/>
           
          
        </Tabs>
    )
}