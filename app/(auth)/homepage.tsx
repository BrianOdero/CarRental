import { FlatList, Image, ListRenderItem, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type Data = {
  name: string;
  logo: any;
  price: string;
  carType: string | any;
  carModel: string;
  carPass: string;
  personLogo: string | any;
  topSpeed: string;
  showroom: { name: string; latitude: number; longitude: number };
  latitude: number;
  longitude: number;
};

const carBrands = [
  { name: 'Honda', logo: require('@/vehicleImages/toyotaLogo.jpeg') },
  { name: 'Toyota', logo: require('@/vehicleImages/toyotaLogo.jpeg') },
  { name: 'Mercedes', logo: require('@/vehicleImages/mercedesLogo.jpeg') },
  { name: 'BMW', logo: require('@/vehicleImages/bmwLogo.jpeg') },
  { name: 'Mitsubishi', logo: require('@/vehicleImages/mitsubishiLogo.jpeg') },
  { name: 'Peugeot', logo: require('@/vehicleImages/peugeotLogo.jpeg') },
];

const CarShop = [
  { name: 'Kai and Karo', latitude: 1.2160, longitude: 36.8347 },
  { name: 'Lanchaster Car Shop', latitude: 1.2944, longitude: 36.7973 },
];

const vehicleData = [
  {
    name: 'Peugeot 207',
    logo: require('@/vehicleImages/peugeot207.jpeg'),
    price: '$ 100 / day',
    carType: 'car-sport-outline',
    carModel: 'Hatchback',
    carPass: '4 Pass',
    personLogo: 'person-outline',
    topSpeed: '180km/h',
    showroom: CarShop.find(car => car.name === 'Kai and Karo') || { latitude: 0, longitude: 0, name: 'Unknown' },
    latitude: 1.2160,
    longitude: 36.8347,
  },
  {
    name: 'Peugeot 208',
    logo: require('@/vehicleImages/peugeot207.jpeg'),
    price: '$ 100 / day',
    carType: 'car-sport-outline',
    carModel: 'Hatchback',
    carPass: '4 Pass',
    personLogo: 'person-outline',
    topSpeed: '160km/h',
    showroom: CarShop.find(car => car.name === 'Lanchaster Car Shop') || { latitude: 0, longitude: 0, name: 'Unknown' },
    latitude: 1.2944,
    longitude: 36.7973,
  },
];

const VehicleCard: React.FC<{ item: Data }> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/details',
          params: {
            name: item.name,
            logo: item.logo,
            price: item.price,
            carType: item.carType,
            model: item.carModel,
            topSpeed: item.topSpeed,
            showroom: item.showroom?.name,
            latitude: item.showroom?.latitude || 0, // Ensure proper latitude
            longitude: item.showroom?.longitude || 0, // Ensure proper longitude
          },
        })
      }
    >
      <View style={styles.vehicleCard}>
        <Image source={item.logo} style={styles.vehicleImage} resizeMode="contain" />
        <View style={styles.vehiclePricingView}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <View style={styles.vehicleData}>
          <View style={styles.vehicleDetails}>
            <Ionicons name={item.carType} size={20} color="black" style={styles.iconSpacing} />
            <Text>{item.carModel}</Text>
          </View>
          <View style={styles.vehicleDetails}>
            <Ionicons name={item.personLogo} size={20} color="black" style={styles.iconSpacing} />
            <Text>{item.carPass}</Text>
          </View>
          <View style={styles.vehicleDetails}>
            <Ionicons name={item.carType} size={20} color="black" style={styles.iconSpacing} />
            <Text>{item.carModel}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BrandTag: React.FC<{ brand: { name: string; logo: any } }> = ({ brand }) => {
  return (
    <View style={styles.brandTags}>
      <Text>{brand.name}</Text>
      <Image source={brand.logo} style={styles.brandImage} />
    </View>
  );
};

const Homepage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>RENT A CAR ANYTIME</Text>

      {/* Search input */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder="Type The Car To search" />
        <Ionicons name="search-outline" size={24} color="black" />
      </View>

      {/* Available Brands */}
      <Text style={styles.brandsText}>Available Brands</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {carBrands.map((brand, index) => (
          <BrandTag key={index} brand={brand} />
        ))}
      </ScrollView>

      {/* Vehicle List */}
      <FlatList
        data={vehicleData}
        renderItem={({ item }) => <VehicleCard item={item} />}
        keyExtractor={(item) => item.name.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 10,
    fontFamily: 'serif',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
  },
  textInput: {
    height: 40,
    width: '85%',
    margin: 10,
  },
  brandImage: {
    height: 30,
    width: 30,
    margin: 10,
  },
  brandTags: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  vehicleCard: {
    boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 6px rgba(0, 0, 0, 0.4)',
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  vehicleName: {
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    margin: 10,
    marginHorizontal: 15,
  },
  vehicleImage: {
    height: 150,
    width: 'auto',
  },
  vehiclePricingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  priceText: {
    color: 'green',
    textAlign: 'right',
    margin: 10,
    marginHorizontal: 20,
  },
  vehicleData: {
    flexDirection: 'row',
  },
  vehicleDetails: {
    flexDirection: 'row',
    flex: 1,
    margin: 5,
    justifyContent: 'space-evenly',
  },
  iconSpacing: {
    marginRight: 10,
  },
  brandsText: {
    margin: 10,
  },
});

export default Homepage;
