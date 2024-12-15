import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Alert } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import supabase from '@/DBconfig/supabaseClient';

export default function Settings() {



  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      Alert.alert('SignOut successful');
      router.replace('/');
      const user = supabase.auth.getUser();
      console.log('User is: ', user);
       // Redirect to login or another page
    }
  };
  
  
    

    const router = useRouter();

  const settingsItems = [
    { section: 'GENERAL', items: [
      { icon: 'person-outline', label: 'Account', link: "/(settings)/account" },
      { icon: 'trash-outline', label: 'Delete account' },
    ]},
    { section: 'FEEDBACK', items: [
      { icon: 'bug-outline', label: 'Report a bug' },
      { icon: 'paper-plane-outline', label: 'Send feedback' },
    ]},
    { section: 'ABOUT', items: [
      { icon: 'help-circle-outline', label: 'Help' },
      { icon: 'information-circle-outline', label: 'About Developer' },
    ]},
    { section: 'LOGOUT', items: [
        { icon: 'log-out-outline', label: 'Logout', onPress: signOut },
      ]}
  ];

  const renderSettingsItem = (item: { icon: string; label: string; link?: string; onPress?: () => void }, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingsItem, !isLast && styles.settingsItemBorder]}
      onPress={item.onPress ? item.onPress : () => item.link && router.push(item.link as any)}
    >
      <View style={styles.settingsItemContent}>
        <Icon name={item.icon as any} size={24} color="black" style={styles.settingsItemIcon} />
        <Text style={styles.settingsItemLabel}>{item.label}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        {settingsItems.map((section, sectionIndex) => (

          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => 
                renderSettingsItem(item as { icon: string; label: string; link: string }, itemIndex, itemIndex === section.items.length - 1)
              )}

            </View>
          </View>
        ))}
      </ScrollView>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f0f0f0"
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    marginTop: 16,
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    margin: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  settingsItemBorder: {
    borderBottomWidth: 4,
    borderBottomColor: '#E5E7EB',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemIcon: {
    marginRight: 12,
  },
  settingsItemLabel: {
    fontSize: 16,
  },
  navbarItem: {
    padding: 8,
  },
});