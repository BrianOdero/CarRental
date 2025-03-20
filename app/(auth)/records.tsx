import supabase from "@/DBconfig/supabaseClient"
import Ionicons from "@expo/vector-icons/Ionicons"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from "react-native"

// Define the payment record type
type PaymentRecord = {
  id: string
  status: "pending" | "paid"
  amount: string
  timePaid: string
}

// Sample data
const paymentData: PaymentRecord[] = [
  { id: "1", status: "pending", amount: "$250.00", timePaid: "Jan 23, 2024" },
  { id: "2", status: "paid", amount: "$175.50", timePaid: "Jan 27, 2024" },
  { id: "3", status: "pending", amount: "$320.00", timePaid: "Jan 14, 2024" },
  { id: "4", status: "paid", amount: "$95.75", timePaid: "Jan 06, 2024" },
  { id: "5", status: "pending", amount: "$430.25", timePaid: "Jan 08, 2024" },
]

interface Records {
  id: number;
  time_paid: string; // ISO timestamp format
  number: string | null; // Nullable text field
  amount: number;
  transaction_type: string;
  status: string;
}

// Helper function to format ISO timestamp
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Records = () => {

  const fetchRecords = async (): Promise<Records[]> => {
    const { data, error } = await supabase.from('Records').select('*').order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };

  const queryClient = useQueryClient()

  const { data: records, isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: fetchRecords
  })


  const deleteAllLogs = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('Records').delete().neq('id', 0);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['records'] as any);
      Alert.alert('Success', 'All logs deleted successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete logs');
    },
  });

  const renderItem = ({ item }: { item: Records }) => {
    const isPaid = item.status === "paid"

    return (
      <View style={styles.row}>
        <View style={styles.cell}>
          <View style={[styles.statusContainer, isPaid ? styles.paidStatus : styles.pendingStatus]}>
            <View style={[styles.statusDot, isPaid ? styles.paidDot : styles.pendingDot]} />
            <Text style={styles.statusText}>{isPaid ? "Paid" : "Pending"}</Text>
          </View>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>KSh {item.amount}/=</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.number}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}


      <Text style={{ fontSize: 20, alignSelf: 'center', marginVertical: 10 }}>PAYMENT RECORDS</Text>

      <View style={styles.headerRow}>
        <View style={styles.cell}>
          <Text style={styles.headerText}>Payment Status</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.headerText}>Amount Paid</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.headerText}>Phone number</Text>
        </View>
      </View>

      {/* List */}

      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.trashButton} onPress={() => deleteAllLogs.mutate()}>
        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 14,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  pendingStatus: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  paidStatus: {
    backgroundColor: "rgba(52, 199, 89, 0.2)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pendingDot: {
    backgroundColor: "#007AFF", // Blue dot for pending
  },
  paidDot: {
    backgroundColor: "#34C759", // Green dot for paid
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    flexGrow: 1,
  },
  trashButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#EF4444',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
})

export default Records