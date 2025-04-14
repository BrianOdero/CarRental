import {
  View, Text, Image, StyleSheet, TouchableOpacity,ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';


export default function CarDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [expanded, setExpanded] = useState<boolean>(false);

  
  
  //constants to be inserted and used in this page
  const price = params.price;
  const vehicle_name = `${params.carBrand} ${params.name}`;
  const logo = params.logo as string

   
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: params.logo as string }} style={styles.carImage} resizeMode="contain" />
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.nameRow}>
            <Text style={styles.carName}>{params.carBrand} {params.name} - {params.price} / day</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Contact Below Contact For More Details</Text>
          </View>

          <View style={styles.renterContainer}>
            <View style={styles.renterInfo}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.renterImage} />
              <View style={styles.renterDetails}>
                <Text style={styles.renterName}>{params.ownerName}</Text>
                <Text style={styles.renterRole}>+{params.ownerNumber}</Text>
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#f90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={20} color="#f90" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Car Specification</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}><Ionicons name="people" size={18} color="#f90" /><Text style={styles.infoText}>{params.carPass} Passengers</Text></View>
              <View style={styles.infoItem}><Ionicons name="car" size={18} color="#f90" /><Text style={styles.infoText}>{params.carType}</Text></View>
              <View style={styles.infoItem}><Ionicons name="speedometer" size={18} color="#f90" /><Text style={styles.infoText}>{params.topSpeed} km/hr</Text></View>
              <View style={styles.infoItem}><Ionicons name="cog" size={18} color="#f90" /><Text style={styles.infoText}>{params.transmission}</Text></View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              A luxury car with several advantages will make you feel comfortable in using it...
              {!expanded && (
                <TouchableOpacity onPress={() => setExpanded(true)}>
                  <Text style={styles.readMoreText}> Read More</Text>
                </TouchableOpacity>
              )}
            </Text>
            {expanded && (
              <Text style={styles.descriptionText}>
                The car comes with premium leather seats, advanced navigation system...
              </Text>
            )}
          </View>



          <TouchableOpacity style={styles.bookNowButton} onPress={() => {router.push({
            pathname: "/(auth)/paymentScreen",
            params: {
              price: price,
              vehicle_name: vehicle_name,
              logo: logo
            }
          })}}>
            <Text style={styles.bookNowText}>Proceed to book vehicle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Purple background
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  imageContainer: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  carImage: {
    width: '90%',
    height: '100%',
  },
  threeSixtyButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threeSixtyText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
  },
  renterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  renterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  renterDetails: {
    marginLeft: 12,
  },
  renterName: {
    fontWeight: '600',
    fontSize: 16,
    color: "#f90",

  },
  renterRole: {
    fontSize: 14,
    color: "#f90",

  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    

  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#333',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  specUnit: {
    color: '#666',
    fontSize: 14,
  },
  specDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#EEEEEE',
  },
  descriptionText: {
    color: '#666',
    lineHeight: 20,
  },
  readMoreText: {
    color: '#f90',
    fontWeight: '600',
  },
  bookNowButton: {
    backgroundColor: '#f90',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  bookNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInputContainer: {
    marginTop: 20,
  },
  phoneInputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  phonePrefix: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
});