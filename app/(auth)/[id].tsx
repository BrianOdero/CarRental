import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import supabase from '@/DBconfig/supabaseClient';

export default function CarDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {showroom} = useLocalSearchParams();

  const [token, setToken] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const price = params.price;

  const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const timestamp = getTimestamp();
  
  const getAccessToken = async () => {
    try {
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Basic MmR0UGFKT0hBTkM1c2lTZE1Qa0dvVlUzQWtuMjN3M3pmUk5NaWdBR21Qb3gxbUprOklBUDlnUUtaSklFamZaZTRHamh0Uk5GYXlEWjVPRk9yODZCQ01MbFB5T2lwbTZRUXFvMmtFeDNXVzFUaEdENHk="
      );
  
      const response = await fetch(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        { headers }
      );
      const data = await response.json();
      return data.access_token; // Return access token
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  };
  
  const initiateSTKPush = async () => {
    const accessToken = await getAccessToken();
  
    if (!accessToken) {
      console.error("Failed to retrieve access token");
      return;
    }
  
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 9) {
      Alert.alert('Invalid phone number');
      console.error("Invalid phone number. Please enter 9 digits.");
      return;
    }
  
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${accessToken}`);
  
    const password = btoa(`174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${getTimestamp()}`);
  
    const body = {
      BusinessShortCode: 174379,
      Password: password,
      Timestamp: getTimestamp(),
      TransactionType: "CustomerPayBillOnline",
      Amount: price,
      PartyA: `254${phoneNumber}`,
      PartyB: 174379,
      PhoneNumber: `254${phoneNumber}`,
      CallBackURL: "https://mydomain.com/path",
      AccountReference: "CompanyXLTD",
      TransactionDesc: "Payment of X",
    };
  
    try {
      const response = await fetch(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }
      );
  
      const result = await response.json();
      console.log("STK Push Response:", result);
  
      // Check if the response contains the expected structure
      if (result.ResponseCode === "0") {
        Alert.alert('Your Payment has been processed. Wait for STK push and fill your password');
        const insertedId = await insertPaymentRecord('pending');
        if (insertedId) {
          console.log('Inserted Record ID:', insertedId);
          // Use the insertedId as needed
        }
        setPhoneNumber('');
  
        // Check the payment status using the CheckoutRequestID
        checkPaymentStatus(result.CheckoutRequestID,insertedId);
      } else {
        console.error("STK Push failed with response code:", result.ResponseCode);
        Alert.alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error("Error initiating STK push:", error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  const checkPaymentStatus = async (checkoutRequestId: string, recordId: number) => {
    try {
      const password = btoa(`174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`);
  
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", "Bearer FrMnc9bazDDalXcjZOAAAYMApaGC");
  
      const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query", {
        method: "POST",
        headers,
        body: JSON.stringify({
          BusinessShortCode: 174379,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId, // Dynamic ID passed to function
        }),
      });
  
      const result = await response.json();
  
      if (result.ResultCode === "0") {
        // Payment successful, update the status to 'Paid' in Supabase
        const { data, error } = await supabase
          .from("Records")
          .update({ status: "Paid" })
          .eq("id", recordId);
  
        if (error) {
          console.error("Error updating payment status:", error);
        } else {
          console.log("Payment status updated to 'Paid' for record ID:", recordId);
        }
      } else if (result.ResultCode === "1032") {
        // Handle user cancellation case
        const { data, error } = await supabase
          .from("Records")
          .update({ status: "Cancelled" })
          .eq("id", recordId);
  
        if (error) {
          console.error("Error updating payment status:", error);
        } else {
          console.log("Payment status updated to 'Cancelled' for record ID:", recordId);
        }
      }
  
      if (!response.ok) {
        throw new Error(`API Error: ${result.errorMessage || "Unknown error"}`);
      }
  
      console.log("Payment status response:", result);
      return result;
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };
  
  const insertPaymentRecord = async (status: string) => {
    try {
      const { data, error } = await supabase
        .from("Records")
        .insert([
          {
            amount: Number(price),
            number: `254${phoneNumber}`,
            transaction_type: "CustomerPayBillOnline",
            status: status,
          },
        ])
        .select("id") // Select the ID of the inserted record
        .single(); // Ensure we get a single object
  
      if (error) {
        console.error("Database insertion error:", error);
        Alert.alert("An error occurred while recording your payment. Please try again.");
        return null;
      }
  
      if (data) {
        setPhoneNumber("");
        return data.id; // Return the inserted row's ID
      }
    } catch (error) {
      console.error("Error in insertPaymentRecord:", error);
      Alert.alert("An error occurred while recording your payment. Please try again.");
      return null;
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: params.logo as string }}
          style={styles.carImage}
          resizeMode="contain"
        />
        
      </View>

      {/* Car Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.carName}>{params.carBrand} {params.name} </Text>
        <Text style={styles.description}>
          A car with high specs that are rented at an affordable price
        </Text>

        <Text style={styles.sectionTitle}>Specification</Text>
        <View style={styles.specificationContainer}>
          <View style={styles.specCard}>
            <Ionicons name="person" size={24} color="#f90" />
            <Text style={styles.specTitle}>Capacity</Text>
            <Text style={styles.specValue}>{params.carPass}</Text>
          </View>
          <View style={styles.specCard}>
            <Ionicons name="speedometer" size={24} color="#f90" />
            <Text style={styles.specTitle}>Max Speed</Text>
            <Text style={styles.specValue}>{params.topSpeed} km/hr</Text>
          </View>
          <View style={styles.specCard}>
            <Ionicons name="speedometer" size={24} color="#f90" />
            <Text style={styles.specTitle}>Car Type</Text>
            <Text style={styles.specValue}>{params.carType}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Text style={{color: 'white', fontSize: 20, marginVertical: 16}}>Process Your Payment Here </Text>

        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, flex: 1}}>
          <Text style={{color: 'white', fontSize: 16, marginRight: 5}}>+254</Text>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="numeric"
            placeholder="Enter phone number"
            placeholderTextColor="#666"
            maxLength={9}
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Rental price</Text>
            <Text style={styles.price}>{params.price} Ksh / day</Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={initiateSTKPush}>
            <Text style={styles.bookButtonText}>Book Car</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  carImage: {
    width: '90%',
    height: '100%',
  },
  sliderIndicator: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sliderDot: {
    width: 30,
    height: 6,
    backgroundColor: '#4169E1',
    borderRadius: 3,
  },
  infoContainer: {
    padding: 20,
  },
  carName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  specificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 5
  },
  specCard: {
    flex: 1,
    color: "#f90",
    backgroundColor: "rgba(255, 153, 0, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  specTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  phoneInputContainer: {
    marginBottom: 20,
    flex: 1
  },
  phoneLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  phoneInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    color: 'white',
    fontSize: 16,
    width: '90%',
  },
  priceLabel: {
    color: '#999',
    fontSize: 14,
  },
  price: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: "rgba(228, 141, 11, 0.7)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});