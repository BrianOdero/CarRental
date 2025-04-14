import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '@/DBconfig/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

type Showroom = {
  id: number;
  showroomName: string;
  latitude: number;
  longitude: number;
};

const Map = () => {
  const [mapReady, setMapReady] = useState(false);
  
  // Default region centered on Nairobi
  const nairobiRegion = {
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const fetchShowRooms = async (): Promise<Showroom[]> => {
    try {
      const { data, error } = await supabase
        .from('Showrooms')
        .select('*')
        .order('showroomName', { ascending: true });

      if (error) {
        console.error('Error fetching showrooms:', error);
        throw error;
      }
      
      // Validate coordinates to ensure they're numbers
      return data?.map(showroom => ({
        ...showroom,
        latitude: Number(showroom.latitude),
        longitude: Number(showroom.longitude)
      })) || [];
    } catch (error) {
      console.error('Failed to fetch showrooms:', error);
      throw error;
    }
  };

  const { data: showrooms, isLoading, error } = useQuery({
    queryKey: ['showrooms'],
    queryFn: fetchShowRooms,
  });

  // Log data for debugging
  useEffect(() => {
    if (showrooms) {
      console.log('Showrooms data:', showrooms);
    }
    if (error) {
      console.error('Query error:', error);
    }
  }, [showrooms, error]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>Loading map and showrooms...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>Error loading showrooms</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.mapview} 
        initialRegion={nairobiRegion}
        onMapReady={() => setMapReady(true)}
        showsUserLocation
        showsMyLocationButton
      >
        {mapReady && showrooms && showrooms.length > 0 && showrooms.map((showroom, index) => (
          <Marker
            key={showroom.id || index}
            coordinate={{
              latitude: showroom.latitude,
              longitude: showroom.longitude,
            }}
            title={showroom.showroomName}
            description={`Showroom location: ${showroom.showroomName}`}
            pinColor="#0066ff"
          >
            <Callout>
                <View>
                    <Ionicons name='car-sport-outline' size={20} color='#0066ff'/>
                </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Optional overlay to show how many showrooms are displayed */}
      {showrooms && (
        <View style={styles.infoOverlay}>
          <Text style={styles.infoText}>
            {showrooms.length} showroom{showrooms.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapview: {
    width: 'auto',
    height: '100%',

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0066ff',
  },
  infoOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});