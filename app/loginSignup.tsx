import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LottieView from 'lottie-react-native'
import { useState } from "react";
import supabase from "@/DBconfig/supabaseClient";
import { router } from "expo-router";
export default function Index() {


  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const logInsert = async () => {
    const {data,error} = await supabase
    .from('loginLogs')
    .insert({
      user_email: email
    })
    .select()
    .single()


    if(data) console.log('User data inserted into loginLogs:', data)
    if(error) console.log(error)

  }

   const navigateToResetPassword = () => {
      router.push("/reset-password");
    };



  const login = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error){
      Alert.alert(error.message)
      setEmail("")
      setPassword("")
      setLoading(false)
    }else{
      Alert.alert("Login Successful")
      logInsert()
      setEmail("")
      setPassword("")
      setLoading(false)
    }
  }

  const signup = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signUp({
      email,
      password
    })
    if(error){
      Alert.alert(error.message)
      setEmail("")
      setPassword("")
      setLoading(false)
    }else if(password !== confirmPassword){
      Alert.alert("Passwords do not match")
      setPassword("")
      setConfirmPassword("")
      setLoading(false)
    }
    else{
      Alert.alert("Signup Successful")
      setEmail("")
      setPassword("")
      setLoading(false)
      setIsLogin(true)
    }
  }
  if (loading) return (
    <View>
      <LottieView source={require("../assets/images/loadingAnimation.json")} autoPlay loop style={{width:"auto", height: 250, marginVertical: 5}} />
    </View>
  )


  return (
    
    <View style={styles.containor}>
      <LottieView 
        source={isLogin ? require("../assets/images/loginAnimation.json") : require("../assets/images/signupAnimation.json")} 
        autoPlay 
        loop
        style={{width:"auto", height: 250, marginVertical: 5}} />
      <Text style={styles.headerText}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>
      <Text style={{fontSize: 20,margin: 10,textAlign: "center"}}>{isLogin ? "Login to your account" : "Create a new account"}</Text>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        />
      
        <TextInput
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          secureTextEntry={!showPassword}
        />
        {!isLogin && (
           <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            secureTextEntry={!showPassword}
        />
        )}

         {isLogin && (
        <TouchableOpacity onPress={navigateToResetPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
        
        <TouchableOpacity onPress={isLogin ? login : signup}>
          <View style={styles.submitButton} >
            <Text style={{color: "white", fontWeight: "bold"}}>{isLogin ? "Login" : "Sign Up"}</Text>
          </View>
        </TouchableOpacity>

         <TouchableOpacity onPress={async () => {const {data,error} = await supabase.auth.signInAnonymously()}} style={{backgroundColor: "transparent", alignItems: "center",margin: 10}}>
         <Text style={{margin: 10}}><Text style={styles.link}>Sign In As A Guest User</Text>
        </Text>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => {setIsLogin(!isLogin)}} style={{backgroundColor: "transparent", alignItems: "center",margin: 10}}>
         <Text style={{margin: 10}}>{isLogin ? "Don't have an account?" : "Already have an account?"} <Text style={styles.link}>{isLogin ? "Sign Up" : "Login"}</Text>
        </Text>
       </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  containor:{
    flex: 1,
    justifyContent: "center",
    
    
  },headerText:{
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    textAlign:"center"
    
  },
  textInput:{
    borderColor: "#f90",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  submitButton:{
    backgroundColor: "#f90",
    margin: 10,
    borderRadius: 5,
    width: "auto",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  link:{
    color: "#f90",
    marginLeft: 10
  },
    forgotPasswordText: {
    color: "#f90",
    textAlign: "right",
    marginBottom: 15,
    fontWeight: "500",
    margin: 10
  },
})