import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, Tabs, useRouter } from "expo-router";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export default function HomePageLayout() {

    const router = useRouter()
    const queryClient = new QueryClient()

    return (
       <QueryClientProvider client={queryClient}>
             <Tabs screenOptions={{
            tabBarStyle: {
                borderColor: "black",
                backgroundColor: "black",
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
    
            }
        }}>
            <Tabs.Screen name="homepage" options={{
                headerShown: false,
                tabBarIcon: ({color}) => (<Ionicons name="home" size={24} color={color} />),
                tabBarLabel: "Home",
                tabBarActiveTintColor: "white",
            }}/>
            <Tabs.Screen name="map" options={{
                headerTitle: "Maps And SHowrooms",
                tabBarIcon: ({color}) => (<Ionicons name="map" size={24} color={color} />)
            }}/>
            <Tabs.Screen name="records" options={{
                headerShown: false,
                tabBarIcon: ({color}) => (<Ionicons name="list" size={24} color={color} />),
                tabBarLabel: "Payment History",
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
            <Tabs.Screen name="[id]" options={{
                href: null,
                tabBarStyle: {display: "none"},
                headerShown: false
            }}/>
            <Tabs.Screen name="paymentScreen" options={{
                href: null,
                tabBarStyle: {display: "none"},
                headerShown: false
            }}/>
            
           
          
        </Tabs>
       </QueryClientProvider>
    )
}