import { Dimensions, StyleSheet } from "react-native";


export const indexStyles = () => 

    StyleSheet.create({
        containor:{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('screen').width,
            backgroundColor: "#F2F0CB"
            
        },
        welcomeText:{
            fontSize: 28,
            padding: 10,
            fontWeight: "bold"
        },
        welcomeText2:{
            fontSize: 20,
            padding: 10,
            
        },
        getStartedButton: {
            padding: 10,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            alignItems: "baseline",
            height: 100,
            marginVertical: 30,
            backgroundColor: "black",
            width: 200,
            
        },
        getStartedText: {
            color: "white",
            alignSelf: "center"
        }
    });

