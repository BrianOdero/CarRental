"use client"

import React, { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, FlatList, View, Text, StatusBar, TouchableOpacity, Dimensions } from "react-native"
import LottieView from "lottie-react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width, height } = Dimensions.get("window")
const COLORS = { primary: "white", white: "#fff" }

// Key for AsyncStorage
const ONBOARDING_COMPLETE_KEY = "onboarding_complete"

const slides = [
  {
    id: "0",
    animation: require("@/assets/images/welcomeAnimation.json"),
    title: "Welcome To CarSoko",
    subtitle: "Your one stop shop for all your car needs.",
  },
  {
    id: "1",
    animation: require("@/assets/images/welcomeAnimation.json"),
    title: "Find the Perfect Ride",
    subtitle: "Explore a wide range of rental cars to suit your travel needs and budget.",
  },
  {
    id: "2",
    animation: require("@/assets/images/welcomeAnimation.json"),
    title: "Book with Ease",
    subtitle: "Choose your vehicle, schedule your pickup, and reserve instantly—anytime, anywhere.",
  },
  {
    id: "3",
    animation: require("@/assets/images/welcomeAnimation.json"),
    title: "Drive with Confidence",
    subtitle: "Enjoy a smooth rental experience with reliable vehicles and 24/7 support.",
  },
]

const Slide = ({ item, onButtonPress }: { item: any; onButtonPress?: () => void }) => (
  <View style={{ alignItems: "center", width }}>
    <LottieView source={item.animation} autoPlay loop style={{ height: "75%", width }} />
    <Text style={item.id === "0" ? styles.welcomeTitle : styles.title}>{item.title}</Text>
    <Text style={item.id === "0" ? styles.welcomeSubtitle : styles.subtitle}>{item.subtitle}</Text>
    {item.id === "0" && (
      <TouchableOpacity onPress={onButtonPress} style={styles.getStartedButton} activeOpacity={0.7}>
        <Text style={styles.getStartedText}>GET STARTED</Text>
      </TouchableOpacity>
    )}
  </View>
)

const OnboardingScreen = ({ navigation }: { navigation: any }) => {
  const router = useRouter()
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
  const ref = React.useRef<FlatList>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Entrance animation
  const fadeIn = useSharedValue(0)
  const slideIn = useSharedValue(40)

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideIn.value }],
  }))

  // Check if onboarding is completed
  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
      if (value === "true") {
        // Onboarding already completed, navigate to loginSignup
        router.replace("/loginSignup")
        return
      }
      // Show onboarding if not completed
      setIsLoading(false)
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      setIsLoading(false)
    }
  }

  // Mark onboarding as complete and navigate to loginSignup
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true")
      router.replace("/loginSignup")
    } catch (error) {
      console.error("Error saving onboarding status:", error)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      fadeIn.value = withTiming(1, { duration: 600 })
      slideIn.value = withTiming(0, { duration: 600 })
    }
  }, [isLoading])

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / width)
    setCurrentSlideIndex(currentIndex)
  }

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width
      ref.current?.scrollToOffset({ offset })
      setCurrentSlideIndex(nextSlideIndex)
    }
  }

  const goToPrevSlide = () => {
    const prevSlideIndex = currentSlideIndex - 1
    if (prevSlideIndex >= 0) {
      const offset = prevSlideIndex * width
      ref.current?.scrollToOffset({ offset })
      setCurrentSlideIndex(prevSlideIndex)
    }
  }

  const skip = () => {
    const lastSlideIndex = slides.length - 1
    const offset = lastSlideIndex * width
    ref.current?.scrollToOffset({ offset })
    setCurrentSlideIndex(lastSlideIndex)
  }

  const Footer = () => (
    <View style={styles.footerContainer}>
      {currentSlideIndex !== 0 && (
        <>
          <View style={styles.indicatorContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlideIndex === index && {
                    backgroundColor: COLORS.white,
                    width: 25,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.footerButtons}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.prevBtn]} onPress={goToPrevSlide}>
              <Text style={styles.prevText}>PREV</Text>
            </TouchableOpacity>
            <View style={{ width: 15 }} />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={currentSlideIndex === slides.length - 1 ? completeOnboarding : goToNextSlide}
              style={styles.btn}
            >
              <Text style={styles.nextText}>{currentSlideIndex === slides.length - 1 ? "FINISH ONBOARDING" : "NEXT"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <Animated.View style={[{ flex: 1 }, entranceStyle]}>
        {/* Top-left Skip Button */}
        {currentSlideIndex !== 0 && currentSlideIndex !== slides.length - 1 && (
          <TouchableOpacity style={styles.topSkipButton} onPress={skip}>
            <Text style={styles.topSkipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          contentContainerStyle={{ height: height * 0.65 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={slides}
          pagingEnabled
          renderItem={({ item }) => <Slide item={item} onButtonPress={goToNextSlide} />}
          keyExtractor={(item) => item.id}
        />
        <Footer />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    color: "#000",
    fontSize: 13,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: "blue",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  prevBtn: {
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 1,
  },
  prevText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  nextText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white"
  },
  footerButtons: {
    marginBottom: 20,
    flexDirection: "row",
  },
  footerContainer: {
    height: height * 0.25,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: 150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white"
  },
  topSkipButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  topSkipText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default OnboardingScreen
