
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useState, useEffect } from "react"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native-gesture-handler"
import { vehicleData } from "@/types/types"
import { carBrands } from "@/data/data"

import supabase from "@/DBconfig/supabaseClient"
import { useVehicleContext } from "@/contexts/VehicleContext"

const Homepage = () => {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { vehicles, setVehicles } = useVehicleContext()

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data, error } = await supabase.from("Vehicle").select("*")
      if (error) throw error
      setVehicles(data as vehicleData[])
    }
    fetchVehicle()
  }, [])

  const filterVehicles = (
    vehicles: vehicleData[] = [],
    searchTerm: string,
    brand: string,
  ) => {
    let filtered = vehicles

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.carBrand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (brand !== "all") {
      filtered = filtered.filter(
        (vehicle) => vehicle.carBrand.toLowerCase() === brand.toLowerCase(),
      )
    }

    return filtered
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    const { data, error } = await supabase.from("Vehicle").select("*")
    if (!error) setVehicles(data as vehicleData[])
    setRefreshing(false)
  }

  const handlePress = (item: vehicleData) => {
    router.push({
      pathname: "/(auth)/[id]" as any,
      params: {
        name: item.name,
        logo: item.logo,
        price: Number.parseInt(item.price),
        carType: item.carType,
        carPass: item.carPass,
        carBrand: item.carBrand,
        topSpeed: item.topSpeed,
        showroom: item.show_room,
        transmission: item.transmission,
        descriptiom: item.description,
        ownerName: item.ownerName,
        ownerNumber: item.ownerNumber,
        doorCount: item.doorCount,
        HP: item.HorsePower,
      },
    })
  }

  const filteredVehicles = filterVehicles(vehicles, searchTerm, selectedBrand)

  const VehicleCard = ({ item }: { item: vehicleData }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.vehicleCard}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.logo }}
          style={styles.vehicleImage}
          resizeMode="cover"
        />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>
            {item.carBrand} {item.name}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="black" />
            <Text style={styles.locationText}>
              {item.show_room} showroom
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Ksh {item.price} per day</Text>
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="person-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Book A Vehicle Anytime</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.brandFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandFiltersContent}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {carBrands.map((brand) => {
            const isSelected = selectedBrand === brand.id
            return (
              <TouchableOpacity
                key={brand.id}
                style={[
                  styles.brandFilter,
                  isSelected && styles.selectedBrandFilter,
                  isSelected && styles.selectedShadow,
                ]}
                onPress={() => setSelectedBrand(brand.id)}
              >
                <Text
                  style={[
                    styles.brandText,
                    isSelected && styles.selectedBrandText,
                  ]}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.availableCarsHeader}>
        <Text style={styles.availableCarsText}>Available Cars</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Ionicons name="options-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "black",
            padding: 16,
            borderRadius: 50,
            elevation: 5,
            zIndex: 999,
          }}
          onPress={() => router.push("/(auth)/AIchat")}
        >
          <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
</TouchableOpacity>


      {vehicles.length === 0 ? (
        <Text style={styles.loadingText}>No vehicles available</Text>
      ) : (
        <FlatList
          data={filteredVehicles}
          renderItem={({ item }) => <VehicleCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  searchIcon: {
    padding: 4,
  },
  // UPDATED BRAND FILTERS STYLES
  brandFiltersContainer: {
    height: 60,
    marginBottom: 16,
  },
  brandFiltersContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  brandFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "white",
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedBrandFilter: {
    backgroundColor: "#000",
    borderColor: '#000',
  },
  selectedShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  brandText: {
    fontSize: 15,
    fontWeight: '500',
    color: "#333",
  },
  selectedBrandText: {
    color: "white",
    fontWeight: '600',
  },
  availableCarsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  availableCarsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  filterIcon: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  vehicleCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  vehicleImage: {
    width: 140,
    height: 80,
    borderRadius: 8,
    margin: 12,
  },
  vehicleDetails: {
    flex: 1,
    padding: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f90",
    backgroundColor: "rgba(255, 153, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 8,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
})

export default Homepage