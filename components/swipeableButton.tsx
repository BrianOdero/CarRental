import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const SwipeableButton = ({
    buttonText = 'Swipe',
    onSwipeComplete = () => {},
    trackWidth = Dimensions.get('window').width - 50,
    trackHeight = 60,
    buttonWidth = 100,
    buttonColor = '#4CAF50',
    trackColor = '#e0e0e0',
    textColor = '#fff',
}) => {
    const translateX = useSharedValue(0); // Shared value for animation

    // Gesture for swiping
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            // Limit the swipe range
            translateX.value = Math.min(Math.max(0, e.translationX), trackWidth - buttonWidth);
        })
        .onEnd(() => {
            if (translateX.value > (trackWidth - buttonWidth) / 2) {
                // Trigger action if swipe passes halfway
                translateX.value = withSpring(trackWidth - buttonWidth); // Snap to the end
                onSwipeComplete(); // Call the action
            } else {
                translateX.value = withSpring(0); // Reset if not swiped enough
            }
        });

    // Animated style for the swipeable button
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={[styles.track, { width: trackWidth, height: trackHeight, backgroundColor: trackColor }]}>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.swipeable,
                        animatedStyle,
                        { width: buttonWidth, backgroundColor: buttonColor },
                    ]}
                >
                    <Text style={[styles.swipeText, { color: textColor }]}>{buttonText}</Text>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        borderRadius: 30,
        justifyContent: 'center',
        position: 'relative',
    },
    swipeable: {
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    swipeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SwipeableButton;
