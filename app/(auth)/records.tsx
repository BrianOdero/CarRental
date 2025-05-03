"use client"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import supabase from "@/DBconfig/supabaseClient"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

// Booking record structure for display
type BookingRecord = {
  id: string
  vehicleName: string
  bookingDate: string
  pickupType: "Self Pickup" | "Arrange Drop"
  location: string
  amount: string
  duration: string
  status: string
  imageUrl: string
}

// Raw structure from Supabase
type Records = {
  number: string
  amount: number
  status: string
  checkoutID: string
  transaction: string
  vehicle_name: string
  vehicle_image: string
  pickup_mode: string
  duration: string
  start_date: string
  end_date: string
}

// Main component
export default function VehicleBookingHistory() {
  const [refreshing, setRefreshing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "failed":
        return "#FF4444" // Light red
      case "cancelled":
        return "black" // Light yellow
      case "completed":
      case "paid":
        return "#4CAF50" // Light green
      default:
        return "#757575" // Default grey
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "Upcoming"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      case "failed":
        return "Failed"
      default:
        return status
    }
  }

  const fetchRecords = async () => {
    const { data, error } = await supabase.from("Records").select("*").order("id", { ascending: false })
    if (error) throw error
    return data as Records[]
  }

  const {
    data: records,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["records"],
    queryFn: fetchRecords,
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const transformRecordsToBookingData = (records: Records[]): BookingRecord[] => {
    return records.map((record) => ({
      id: record.checkoutID || Math.random().toString(),
      vehicleName: record.vehicle_name,
      bookingDate: new Date(record.start_date).toLocaleString(),
      pickupType: record.pickup_mode === "Self Pickup" ? "Self Pickup" : "Arrange Drop",
      location: "Nairobi, Kenya",
      amount: `Ksh ${record.amount}`,
      duration: record.duration,
      status: record.status,
      imageUrl: record.vehicle_image,
    }))
  }

  const renderItem = ({ item }: { item: BookingRecord }) => {
    const statusColor = getStatusColor(item.status)

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingInfo}>
          <Text style={styles.vehicleName}>{item.vehicleName}</Text>
          <Text style={styles.bookingDate}>{item.bookingDate}</Text>

          <View style={styles.divider} />

          <View style={styles.pickupContainer}>
            <Text style={styles.pickupType}>{item.pickupType}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <Ionicons name="location-outline" size={16} color="rgba(0,0,0,0.5)" />
            </View>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.durationText}>Dur.: {item.duration} days</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              Payment Status: {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.vehicleImage} />
        </View>
      </View>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 50 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={records ? transformRecordsToBookingData(records) : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1E88E5" />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  bookingCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bookingInfo: {
    flex: 1,
    padding: 16,
  },
  vehicleName: {
    color: "#212121",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookingDate: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 12,
  },
  pickupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pickupType: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "500",
  },
  amount: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIconContainer: {
    marginRight: 4,
  },
  locationText: {
    color: "#666",
    fontSize: 14,
    flex: 1,
  },
  durationText: {
    color: "#666",
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  imageContainer: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  vehicleImage: {
    width: 120,
    height: 80,
    resizeMode: "contain",
  },
})