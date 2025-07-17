// app/(auth)/AIChat.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVehicleContext } from "@/contexts/VehicleContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define message type
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
};

const CHAT_STORAGE_KEY = "@vehicle_chat_history";

const AIChat = () => {
  const router = useRouter();
  const { vehicles } = useVehicleContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingMessageIdRef = useRef<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialization
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const storedChat = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (storedChat) {
          const parsedMessages = JSON.parse(storedChat).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(parsedMessages);
        } else {
          setMessages([
            {
              id: "1",
              content: "Hello! I'm your vehicle assistant. How can I help you with our car rentals today?",
              role: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setMessages([
          {
            id: "1",
            content: "Hello! I'm your vehicle assistant. How can I help you with our car rentals today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsInitializing(false);
      }
    };

    loadChatHistory();
  }, []);

  // Save chat history
  useEffect(() => {
    if (!isInitializing) {
      const saveChatHistory = async () => {
        try {
          const messagesToSave = messages.filter(msg => !msg.isTyping);
          await AsyncStorage.setItem(
            CHAT_STORAGE_KEY,
            JSON.stringify(messagesToSave)
          );
        } catch (error) {
          console.error("Failed to save chat history:", error);
        }
      };

      saveChatHistory();
    }
  }, [messages, isInitializing]);

  // Scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && !isInitializing) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isInitializing]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const typingMessageId = `typing-${Date.now()}`;
    typingMessageIdRef.current = typingMessageId;
    setMessages((prev) => [
      ...prev,
      {
        id: typingMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      const vehicleContext = vehicles
        .slice(0, 5)
        .map(
          (v) => 
            `${v.carBrand} ${v.name}: ${v.price}/day, ${v.carType}, ${v.transmission} transmission, ${v.HorsePower} HP, at ${v.show_room} showroom.`
        )
        .join("\n");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful vehicle rental assistant. You have access to current vehicle inventory. 
              Vehicle data: ${vehicleContext || "No vehicles currently available"}
              Answer questions about vehicles, prices, features, and availability. Be concise and helpful.`,
            },
            ...messages
              .filter(msg => !msg.isTyping)
              .map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: inputText.trim() },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== typingMessageIdRef.current);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            content: aiMessage,
            role: "assistant",
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error("AI Error:", error);
      
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== typingMessageIdRef.current);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            content: "Sorry, I'm having trouble connecting. Please try again later.",
            role: "assistant",
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
      typingMessageIdRef.current = null;
    }
  };

  const showClearConfirmation = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all chat history? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsClearing(true);
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
            
            setTimeout(() => {
              clearChatHistory();
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => setIsClearing(false));
            }, 1500);
          },
        },
      ]
    );
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([
        {
          id: "1",
          content: "Hello! I'm your vehicle assistant. How can I help you with our car rentals today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      Alert.alert("Error", "Failed to clear chat history. Please try again.");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isTyping) {
      return (
        <View style={[styles.messageContainer, styles.aiMessage]}>
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.typingText}>Assistant is typing...</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View
        style={[
          styles.messageContainer,
          item.role === "user" ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Deletion Feedback Overlay */}
      {isClearing && (
        <Animated.View 
          style={[
            styles.deletionOverlay, 
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.deletionFeedback}>
            <Ionicons name="trash" size={48} color="white" />
            <Text style={styles.deletionText}>Clearing chat history...</Text>
          </View>
        </Animated.View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Assistant</Text>
        <TouchableOpacity onPress={showClearConfirmation}>
          <Ionicons name="trash-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about vehicles..."
          placeholderTextColor="#999"
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          <Ionicons
            name={isLoading ? "time-outline" : "send-outline"}
            size={24}
            color={isLoading ? "#ccc" : "black"}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    borderTopRightRadius: 0,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 16,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    marginLeft: 8,
    color: "#666",
    fontStyle: "italic",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  deletionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  deletionFeedback: {
    backgroundColor: "#333",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  deletionText: {
    color: "white",
    fontSize: 18,
    marginTop: 16,
    fontWeight: "bold",
  },
});

export default AIChat;