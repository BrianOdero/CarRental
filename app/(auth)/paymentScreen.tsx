"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native"
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import supabase from "@/DBconfig/supabaseClient"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function PaymentScreen() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [numberOfDays, setNumberOfDays] = useState("0")
  const [pickupMode, setPickupMode] = useState("Self Pickup")
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [showPickupModal, setShowPickupModal] = useState(false)

  const params = useLocalSearchParams()

  const price = params.price
  const logo = params.logo
  const vehicle_name = params.vehicle_name
 

  // Calculate days between dates
  useEffect(() => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setNumberOfDays(diffDays.toString())
  }, [startDate, endDate])

  const getTimestamp = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  const timestamp = getTimestamp()

  const password = btoa(`174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`)

  const getAccessToken = async () => {
    try {
      let headers = new Headers();
      headers.append("Authorization", "Basic aks1UTZObmp5ZXk1R2kyVjIyVkVOaThWT3FMdUNMazRtS3pReGVoTWhDNVdtU253OklJMVJBVXR5WkM1aVN1Vjk2OUpSMW9iRjgxNGRhTTZ3RWNmS3V1QmxybEduSXEyczFaS0ZnR0c5WTlFTEE5MTg=");
  
      const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: "GET",
        headers,
      });
  
      const data = await response.json();
      console.log("Access token:", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("❌ Failed to get access token:", error);
      return null;
    }
  };
  

  const handleSTK = async () => {
    try {
      const token = await getAccessToken()
  
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", `Bearer ${token}`)
  
      const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          "BusinessShortCode": 174379,
          "Password": password,
          "Timestamp": timestamp,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": 1,
          "PartyA": 254721503973,
          "PartyB": 174379,
          "PhoneNumber": 254721503973,
          "CallBackURL": "https://alluring-flow-production-7d19.up.railway.app/callback",
          "AccountReference": "CompanyXLTD",
          "TransactionDesc": "Payment of X"
        })
      })
  
      const result = await response.json()
      console.log("STK object: ", JSON.stringify(result, null, 2))
  
      if (result.CheckoutRequestID) {
        return result.CheckoutRequestID
      } else {
        console.error("❌ No CheckoutRequestID in STK push response.")
        return null
      }
  
    } catch (error) {
      console.error("❌ handleSTK failed:", error)
      return null
    }
  }
  

  const checkPaymentStatus = async () => {
    const checkoutID = await handleSTK()
  
    if (!checkoutID) {
      console.error("❌ STK Push failed. No CheckoutRequestID.")
      return
    }
  
    await new Promise((resolve) => setTimeout(resolve, 20000)) // Wait 20 seconds
  
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", `Bearer ${await getAccessToken()}`)
  
    fetch("https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query", {
      method: "POST",
      headers,
      body: JSON.stringify({
        BusinessShortCode: 174379,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutID,
      }),
    })
      .then((response) => response.json())
      .then(async (result) => {
        console.log("Payment status object", JSON.stringify(result, null, 2))
        const resultcode = result.ResultCode
  
        if (typeof resultcode === "undefined") {
          console.error("❌ No ResultCode found in response.")
          return
        }
  
        await insertRecord(checkoutID, resultcode)
      })
      .catch((error) => console.log(error))
  }
  

  const insertRecord = async (checkoutID: string, resultCode: any) => {
    console.log("🧾 Received ResultCode:", resultCode, "Type:", typeof resultCode)

    // Ensure resultCode is a number
    const code = typeof resultCode === "string" ? Number.parseInt(resultCode, 10) : resultCode

    let status: string

    if (code === 0) {
      status = "paid"
    } else if (code === 1032) {
      status = "cancelled"
    } else {
      status = "failed"
    }

    console.log("✅ Resolved status:", status)

    const readableStartDate = startDate.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      
      const readableEndDate = endDate.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

    const { data, error } = await supabase
      .from("Records")
      .insert({
        number: 254721503973,
        amount: price,
        status: status,
        checkoutID: checkoutID,
        transaction: "CustomerPayBillOnline",
        vehicle_image: logo,
        vehicle_name:vehicle_name,
        pickup_mode: pickupMode,
        start_date: readableStartDate,
        end_date: readableEndDate,
        duration: numberOfDays,
      })
      .select("id")

    if (error) {
      console.error("❌ Error inserting record:", error)
      return
    }

    console.log("✅ Record inserted successfully:", data)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate
    setShowStartDatePicker(false)
    setStartDate(currentDate)

    // Ensure end date is not before start date
    if (endDate < currentDate) {
      setEndDate(currentDate)
    }
  }

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate
    setShowEndDatePicker(false)
    setEndDate(currentDate)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back()
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Back To Home</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="wallet-outline" size={24} color="white" />
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              {/* First Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>PAY AMOUNT FOR</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{params.vehicle_name}</Text>
                </View>
              </View>

              {/* Second Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>PAY AMOUNT</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{params.price}</Text>
                </View>
              </View>

              {/* Date Picker Fields */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>START DATE</Text>
                <TouchableOpacity style={styles.fieldValueContainer} onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.fieldValue}>{formatDate(startDate)}</Text>
                  <Feather name="calendar" size={16} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>END DATE</Text>
                <TouchableOpacity style={styles.fieldValueContainer} onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.fieldValue}>{formatDate(endDate)}</Text>
                  <Feather name="calendar" size={16} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>NUMBER OF DAYS</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{numberOfDays} days</Text>
                </View>
              </View>

              {/* Pickup Mode Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>PICKUP MODE</Text>
                <TouchableOpacity style={styles.fieldValueContainer} onPress={() => setShowPickupModal(true)}>
                  <Text style={styles.fieldValue}>{pickupMode}</Text>
                  <Feather name="chevron-down" size={16} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Phone Number Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>ENTER PHONE NUMBER</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.editButton}>
                    <Feather name="edit-2" size={16} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      {/* Pickup Mode Modal */}
      <Modal visible={showPickupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pickup Mode</Text>

            <TouchableOpacity
              style={[styles.modalOption, pickupMode === "Self Pickup" && styles.selectedOption]}
              onPress={() => {
                setPickupMode("Self Pickup")
                setShowPickupModal(false)
              }}
            >
              <Text style={styles.modalOptionText}>Self Pickup</Text>
              {pickupMode === "Self Pickup" && <MaterialIcons name="check-circle" size={20} color="#f90" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, pickupMode === "Arrange Drop" && styles.selectedOption]}
              onPress={() => {
                setPickupMode("Arrange Drop")
                setShowPickupModal(false)
              }}
            >
              <Text style={styles.modalOptionText}>Arrange Drop</Text>
              {pickupMode === "Arrange Drop" && <MaterialIcons name="check-circle" size={20} color="#f90" />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPickupModal(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Button */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottomButtonContainer}
      >
        <TouchableOpacity style={styles.bottomButton} onPress={checkPaymentStatus}>
          <Text style={styles.bottomButtonText}>INITIATE STK PUSH</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 4,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Add padding to ensure the card is fully visible when scrolling
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f90",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
  },
  cardContent: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    fontWeight: "500",
  },
  fieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    flex: 1,
    padding: 0,
  },
  editButton: {
    padding: 4,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bottomButton: {
    backgroundColor: "#f90",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "rgba(255, 153, 0, 0.1)",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
})
