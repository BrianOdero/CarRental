import { Dimensions, StyleSheet } from "react-native";

export const onboardingStyles = () =>
    StyleSheet.create({
        containor: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('screen').width,
            backgroundColor: "#F2F0CB"
        }
    })