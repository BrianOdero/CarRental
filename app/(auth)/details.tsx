import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import SwipeButton from 'rn-swipe-button'

const Details = () => {


    const {name, logo , price , carType , model , carPrice, topSpeed ,latitude,longitude } = useLocalSearchParams();


    //for ensbling the swipeable button

    const [disableCBButton, setDisableCBButton] = useState(false)
    const defaultStatusMessage = 'swipe status appears here';
    const [swipeStatusMessage, setSwipeStatusMessage] = useState(
    defaultStatusMessage)




    const forceResetLastButton: any = null;

    const CheckoutButton = () => {
        return(
            <View style={{
                width: 100, 
                height: 30, 
                backgroundColor: '#C70039', 
                borderRadius: 5, 
                justifyContent: 'center', 
                alignItems: 'center'
                }}>
                <Text style={{color: '#ffffff'}}>Checkout</Text>
            </View>
        );
      } 

     



  return (
    <SafeAreaView style={styles.containor}>
        <View style={styles.vehicleCard}>
            <Image source={logo as any}
            alt={name as string} 
            style={styles.vehicleImage} 
            resizeMode="contain"
            />
            <Text style={styles.specsHeader}>CAR SPECIFICATION</Text>
            <View style={styles.specsContainor}>
                <View style={styles.specs}>
                    <Text style={styles.specsText}>Car Model</Text>
                    <Text style={styles.specsDetail}>{model}</Text>
                </View>
                <View style={styles.specs}>
                    <Text style={styles.specsText}>Car Price</Text>
                    <Text style={styles.specsDetail}>{price}</Text>
                </View>
                <View style={styles.specs}>
                    <Text style={styles.specsText}>Top Speed</Text>
                    <Text style={styles.specsDetail}>{topSpeed}</Text>
                </View>
                
            </View>
        <View style={styles.buttonView}>
        <Button title='Confirm Booking' color='black' />
          </View>
       
    </View>
    </SafeAreaView>
  )
}

export default Details

const styles = StyleSheet.create({
    containor:{
        display: "flex",
        flex:1,
        backgroundColor: "white"
    },
    vehicleCard:{
        display: "flex",
        flexDirection: "column",
        borderColor: "black",
        borderRadius: 10,
        margin: 10,
        padding: 5,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    },
    vehicleImage:{
        width: 400,
        height: 200,
        padding: 10,
        borderRadius: 10,
    },
    specsHeader:{
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
        textAlign: "center"
    },
    specsContainor:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 5
    },
    specs:{
        borderWidth: 1,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        margin: 10,
        padding: 5,
        
        borderRadius: 10,
        backgroundColor: "#e6e6ed"
    },
    specsText: {
        fontSize: 15,
        margin: 5,
        color: "gray"
    },
    specsDetail:{
        fontSize: 15,
        margin: 5
    },
    buttonView:{
        height: "auto",
        width: "auto",
        margin: 10
    }
})