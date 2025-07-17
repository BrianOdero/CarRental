// app/(auth)/reset-password.tsx
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "@/DBconfig/supabaseClient";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "reset">("request");

  const handleProceedToReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep("reset");
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      // First sign in the user anonymously
      const { error: signInError } = await supabase.auth.signInAnonymously();

      if (signInError) {
        throw signInError;
      }

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      Alert.alert("Success", "Your password has been updated successfully");
      router.replace("/loginSignup");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {step === "request" ? "Reset Password" : "Create New Password"}
      </Text>
      
      {step === "request" ? (
        <>
          <Text style={styles.description}>
            Enter your email to proceed with password reset
          </Text>
          
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TouchableOpacity 
            onPress={handleProceedToReset} 
            style={styles.primaryButton}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Proceed to Reset</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.description}>
            Please create a new password for your account
          </Text>
          
          <TextInput
            placeholder="Email"
            value={email}
            editable={false}
            style={[styles.textInput, styles.disabledInput]}
          />
          
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.textInput}
            secureTextEntry
          />
          
          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            secureTextEntry
          />
          
          <TouchableOpacity 
            onPress={handlePasswordReset} 
            style={styles.primaryButton}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  primaryButton: {
    backgroundColor: "#f90",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    padding: 15,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#f90",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResetPasswordScreen;