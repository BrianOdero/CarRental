"use client"

import React, { useEffect, useState } from "react"
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  ImageBackground
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSpring
} from "react-native-reanimated"
import { AppStorage } from "@/utils/storage"

const { width, height } = Dimensions.get("window")

export default function LandingScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Animation values
  const fadeIn = useSharedValue(0)
  const slideUp = useSharedValue(50)
  const buttonScale = useSharedValue(0.8)

  // Check if onboarding is completed
  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = () => {
    try {
      const isCompleted = AppStorage.getOnboardingComplete()
      if (isCompleted) {
        // Onboarding already completed, navigate to loginSignup
        router.replace("/loginSignup")
        return
      }
      // Show landing page if not completed
      setIsLoading(false)
      startAnimations()
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      setIsLoading(false)
      startAnimations()
    }
  }

  const startAnimations = () => {
    fadeIn.value = withTiming(1, { duration: 800 })
    slideUp.value = withTiming(0, { duration: 800 })
    buttonScale.value = withDelay(400, withSpring(1, { damping: 15 }))
  }

  // Mark onboarding as complete and navigate to loginSignup
  const completeOnboarding = () => {
    try {
      AppStorage.setOnboardingComplete(true)
      router.replace("/loginSignup")
    } catch (error) {
      console.error("Error saving onboarding status:", error)
      // Fallback: navigate anyway
      router.replace("/loginSignup")
    }
  }

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }))

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}
        />

        <Animated.View style={[styles.content, containerStyle]}>
          {/* Logo/Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CarSoko</Text>
            </View>
            <Text style={styles.tagline}>Premium Car Rentals</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.heroTitle}>
              Find your perfect ride{'\n'}
              <Text style={styles.heroTitleAccent}>when you're away from home</Text>
            </Text>
            
            <Text style={styles.heroSubtitle}>
              Discover luxury and comfort with our premium car rental service. 
              Book instantly and drive with confidence wherever your journey takes you.
            </Text>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🚗</Text>
                </View>
                <Text style={styles.featureText}>Premium Vehicles</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>⚡</Text>
                </View>
                <Text style={styles.featureText}>Instant Booking</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🛡️</Text>
                </View>
                <Text style={styles.featureText}>24/7 Support</Text>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <Animated.View style={[styles.ctaContainer, buttonStyle]}>
            <TouchableOpacity 
              style={styles.ctaButton} 
              onPress={completeOnboarding}
              activeOpacity={0.9}
            >
              <Text style={styles.ctaButtonText}>Let's go!</Text>
              <View style={styles.ctaButtonIcon}>
                <Text style={styles.ctaButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.ctaSubtext}>
              Join thousands of satisfied customers
            </Text>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  heroTitleAccent: {
    color: '#ff9500',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
  },
  featureIconText: {
    fontSize: 20,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#ff9500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 12,
    minWidth: 200,
    shadowColor: '#ff9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  ctaButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonArrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
})