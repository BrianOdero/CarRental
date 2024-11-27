import { FlatList, Image, ListRenderItem, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type Data = {
    name: string,
    logo: string,
    price: string,
    carType: string,
    carModel: string,
    carPass: string,
    personLogo: string,
    topSpeed: string,
    showroom: any
}

const Homepage = () => {

    const router = useRouter()

const carBrands = [
  { name: "Honda", logo: require('@/vehicleImages/toyotaLogo.jpeg')},
  { name: "Toyota", logo: require('@/vehicleImages/toyotaLogo.jpeg') },
  { name: "Mercedes", logo: require('@/vehicleImages/mercedesLogo.jpeg') },
  { name: "BMW", logo: require('@/vehicleImages/bmwLogo.jpeg') },
  { name: "Mitsubishi", logo: require('@/vehicleImages/mitsubishiLogo.jpeg') },
  { name: "Peugeot", logo: require('@/vehicleImages/peugeotLogo.jpeg')},
]

const carSpecs = [
    {name: 'car-sport-outline', detail: 'Hatchback'},
    {name: 'person-outline', detail: '4 Pass'}, 
    {name: 'person-outline', detail: '4 Pass'}, 
]

const CarShop = [
    {name: 'Kai and Karo', latitude: 1.2160, longitude: 36.8347},
    {name: 'Lanchaster Car Shop', latitude: 1.2944, longitude: 36.7973},
]

const vehicle = [
    {
        name: 'Peugeot 207', 
        logo: require('@/vehicleImages/peugeot207.jpeg'),
        price: '$ 100 / day', 
        carType: 'car-sport-outline',
        carModel: 'hatchback', 
        carPass: '4 Pass',
        personLogo: 'person-outline',
        topSpeed: "180km/h",
        showroom: CarShop.find(car => car.name === 'Kai and Karo')
    },
    {
        name: 'Peugeot 208', 
        logo: require('@/vehicleImages/peugeot207.jpeg'),
        price: '$ 100 / day', 
        carType: 'car-sport-outline',
        carModel: 'hatchback', 
        carPass: '4 Pass',
        personLogo: 'person-outline',
        topSpeed: "160km/h",
        showroom: CarShop.find(car => car.name === 'Lanchaster Car Shop')
    },
    
]

const renderItem : ListRenderItem<Data> = ({item}) => {
    return (
        <TouchableOpacity onPress={() => router.push({
            pathname: "/details",
            params: {
                name: item.name,
                logo: item.logo,
                price: item.price,
                carType: item.carType,
                model: item.carModel,
                topSpeed: item.topSpeed,
                showroom: item.showroom.name,
                latitude: item.showroom.latitude,
                longitude: item.showroom.longitude

            }
        })}>
            <View style={styles.vehicleCard}>
                <View >
                    <Image source={item.logo as any} alt={item.name} style={styles.vehicleImage} resizeMode="contain"/>
                    <View style={styles.vehiclePricingView}>
                        <Text style={styles.vehicleName}>{item.name}</Text>
                        <Text style={{color: "green",textAlign:"right", margin: 10,marginHorizontal: 20}}>{item.price}</Text>
                    </View>
                </View>
                <View style={styles.vehicleData}>
                    <View style={{display: "flex", flexDirection: "row", flex: 1,margin: 5,justifyContent: "space-evenly"}}>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Ionicons name={item.carType as any} size={20} color="black" style={{marginRight: 10}}/>
                            <Text>{item.carModel}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Ionicons name={item.personLogo as any} size={20} color="black" style={{marginRight: 10}}/>
                            <Text>{item.carPass}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Ionicons name={item.carType as any} size={20} color="black" style={{marginRight: 10}}/>
                            <Text>{item.carModel}</Text>
                        </View>
                    </View>
                
                </View>
            </View>
        </TouchableOpacity>
    )
};

  return (
    <SafeAreaView style={styles.containor}>
      <Text style={styles.header} >RENT A CAR ANYTIME</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder='Type The Car To search'/>
        <Ionicons name='search-outline' size={24} color="black"/>
      </View>
      <Text style={{margin: 10}}>Available Brands</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {carBrands.map((car, index) => (
        <View key={index} style={styles.brandTags}>
             <Text>{car.name}</Text>
             <Image source={car.logo} alt={car.name} style={styles.brandImage} />
        </View>))
        }
      </ScrollView>

      <FlatList
        data={vehicle}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
        showsVerticalScrollIndicator={false}/>
    </SafeAreaView>

    
  )
}

export default Homepage

const styles = StyleSheet.create({
    containor:{
        backgroundColor: "white"
    },
    header:{
        fontSize: 28,
        fontWeight: "bold",
        fontFamily:"serif",
        margin: 10
    },
    inputContainer:{
        display: "flex",
        flexDirection: "row",
        width: "auto",
        alignItems: "center",
        height: 50,
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
        margin: 10

    },
    textInput: {
        height: 40,
        width: "85%",
        margin: 10, 
    },
    brandImage:{
        height: 30,
        width: 30,
        margin: 10
    },
    brandTags:{
        margin: 10, 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        
    },
    vehicleCard:{
        boxShadow: "0 8px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 6px rgba(0, 0, 0, 0.40)",
        margin: 10,
        padding: 10,
        borderRadius: 20,
        

    },
    vehicleName:{
        textAlign: "left",
        fontSize: 16,
        fontFamily: "serif",
        fontWeight: "bold",
        margin: 10,
        marginHorizontal: 15
    },
    vehicleImage:{
        height: 150,
        width: "auto"
    },
    vehiclePricingView:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10
    },
    vehicleData:{
        display: "flex",
        flexDirection: "row",
    }
})