"use client"
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Define the booking record type
type BookingRecord = {
  id: string
  vehicleName: string
  bookingDate: string
  pickupType: "Self Pickup" | "Arrange Drop"
  location: string
  amount: string
  duration: string
  status: "upcoming" | "completed" | "cancelled"
  imageUrl: string
}

// Sample data
const bookingData: BookingRecord[] = [
  {
    id: "1",
    vehicleName: "Ferrari GTC4",
    bookingDate: "15 Jun 22, 11:00 am",
    pickupType: "Self Pickup",
    location: "Hamilton, NewYork",
    amount: "$60.00",
    duration: "1 day 0 hrs",
    status: "upcoming",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150",
  },
  {
    id: "2",
    vehicleName: "Range Rover",
    bookingDate: "10 Jun 22, 11:00 am",
    pickupType: "Arrange Drop",
    location: "Bridgston, NewYork",
    amount: "$50.00",
    duration: "2 days 4 hrs",
    status: "completed",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150",
  },
  {
    id: "3",
    vehicleName: "Audi A8",
    bookingDate: "2 Jun 22, 11:00 am",
    pickupType: "Self Pickup",
    location: "Manhattan, NewYork",
    amount: "$65.00",
    duration: "1 day 6 hrs",
    status: "completed",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150",
  },
  {
    id: "4",
    vehicleName: "BMW X5",
    bookingDate: "28 May 22, 10:00 am",
    pickupType: "Arrange Drop",
    location: "Brooklyn, NewYork",
    amount: "$75.00",
    duration: "3 days 0 hrs",
    status: "cancelled",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150",
  },
  {
    id: "5",
    vehicleName: "Mercedes GLE",
    bookingDate: "20 May 22, 9:00 am",
    pickupType: "Self Pickup",
    location: "Queens, NewYork",
    amount: "$80.00",
    duration: "2 days 12 hrs",
    status: "completed",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150",
  },
]

export default function VehicleBookingHistory() {
  const getCardColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#1E88E5" // Blue for upcoming
      case "completed":
        return "#212121" // Dark for completed
      case "cancelled":
        return "#757575" // Gray for cancelled
      default:
        return "#212121"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const renderItem = ({ item }: { item: BookingRecord }) => {
    const cardColor = getCardColor(item.status)

    return (
      <View style={[styles.bookingCard, { backgroundColor: cardColor }]}>
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
              <Ionicons name="location-outline" size={16} color="#ffffff80" />
            </View>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: cardColor === "#1E88E5" ? "#BBDEFB" : "#757575" }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.vehicleImage} />
        </View>
      </View>
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
        data={bookingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingInfo: {
    flex: 1,
    padding: 16,
  },
  vehicleName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookingDate: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 12,
  },
  pickupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pickupType: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  amount: {
    color: "white",
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    flex: 1,
  },
  durationText: {
    color: "rgba(255, 255, 255, 0.7)",
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
  },
  vehicleImage: {
    width: 120,
    height: 80,
    resizeMode: "contain",
  },
})
