import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LottieView from 'lottie-react-native'
import { useState } from "react";
import supabase from "@/DBconfig/supabaseClient";

export default function Index() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const logInsert = async () => {
    const { data, error } = await supabase
      .from('loginLogs')
      .insert({ user_email: formdata.email })
      .select()
      .single();

    if (data) console.log('User data inserted into loginLogs:', data);
    if (error) console.log(error);
  };

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formdata.email,
      password: formdata.password
    });

    if (error) {
      Alert.alert(error.message);
      setFormData({ email: "", password: "", confirmPassword: "" });
      setLoading(false);
    } else {
      logInsert();
      setFormData({ email: "", password: "", confirmPassword: "" });
      setLoading(false);
      // Navigation will be handled by the auth provider
    }
  };

  const signup = async () => {
    setLoading(true);

    if (formdata.password !== formdata.confirmPassword) {
      Alert.alert("Passwords do not match");
      setFormData({ ...formdata, password: "", confirmPassword: "" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formdata.email,
      password: formdata.password
    });

    if (error) {
      Alert.alert(error.message);
      setFormData({ email: "", password: "", confirmPassword: "" });
      setLoading(false);
    } else {
      Alert.alert("Signup Successful");
      setFormData({ email: "", password: "", confirmPassword: "" });
      setIsLogin(true);
      setLoading(false);
    }
  };

  if (loading) return (
    <View>
      <LottieView source={require("../assets/images/loadingAnimation.json")} autoPlay loop style={{ width: "auto", height: 250, marginVertical: 5 }} />
    </View>
  );

  return (
    <View style={styles.containor}>
      <LottieView
        source={isLogin ? require("../assets/images/loginAnimation.json") : require("../assets/images/signupAnimation.json")}
        autoPlay
        loop
        style={{ width: "auto", height: 250, marginVertical: 5 }}
      />
      <Text style={styles.headerText}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>
      <Text style={{ fontSize: 20, margin: 10, textAlign: "center" }}>{isLogin ? "Login to your account" : "Create a new account"}</Text>

      <TextInput
        placeholder="Enter Email"
        value={formdata.email}
        onChangeText={(text) => setFormData({ ...formdata, email: text })}
        style={styles.textInput}
      />

      <TextInput
        placeholder="Enter Password"
        value={formdata.password}
        onChangeText={(text) => setFormData({ ...formdata, password: text })}
        style={styles.textInput}
        secureTextEntry={!showPassword}
      />

      {!isLogin && (
        <TextInput
          placeholder="Confirm Password"
          value={formdata.confirmPassword}
          onChangeText={(text) => setFormData({ ...formdata, confirmPassword: text })}
          style={styles.textInput}
          secureTextEntry={!showPassword}
        />
      )}

      <TouchableOpacity onPress={isLogin ? login : signup}>
        <View style={styles.submitButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{isLogin ? "Login" : "Sign Up"}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setIsLogin(!isLogin) }} style={{ backgroundColor: "transparent", alignItems: "center", margin: 10 }}>
        <Text style={{ margin: 10 }}>{isLogin ? "Don't have an account?" : "Already have an account?"} <Text style={styles.link}>{isLogin ? "Sign Up" : "Login"}</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containor: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center"
  },
  textInput: {
    borderColor: "black",
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
  submitButton: {
    backgroundColor: "#ff9500",
    margin: 10,
    borderRadius: 5,
    width: "auto",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#ff9500",
    marginLeft: 10
  }
});
