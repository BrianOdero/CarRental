import { MMKV } from 'react-native-mmkv'

// Create MMKV instance
export const storage = new MMKV()

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
} as const

// Storage utilities
export const StorageUtils = {
  // String operations
  setString: (key: string, value: string) => {
    storage.set(key, value)
  },
  
  getString: (key: string): string | undefined => {
    return storage.getString(key)
  },
  
  // Boolean operations
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value)
  },
  
  getBoolean: (key: string): boolean => {
    return storage.getBoolean(key) ?? false
  },
  
  // Number operations
  setNumber: (key: string, value: number) => {
    storage.set(key, value)
  },
  
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key)
  },
  
  // Object operations (JSON)
  setObject: (key: string, value: object) => {
    storage.set(key, JSON.stringify(value))
  },
  
  getObject: <T>(key: string): T | null => {
    const jsonString = storage.getString(key)
    if (!jsonString) return null
    
    try {
      return JSON.parse(jsonString) as T
    } catch (error) {
      console.error('Error parsing JSON from storage:', error)
      return null
    }
  },
  
  // Delete operations
  delete: (key: string) => {
    storage.delete(key)
  },
  
  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key)
  },
  
  // Clear all data
  clearAll: () => {
    storage.clearAll()
  },
  
  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys()
  },
}

// Specific app storage functions
export const AppStorage = {
  // Onboarding
  setOnboardingComplete: (completed: boolean) => {
    StorageUtils.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE, completed)
  },
  
  getOnboardingComplete: (): boolean => {
    return StorageUtils.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE)
  },
  
  // User preferences
  setUserPreferences: (preferences: Record<string, any>) => {
    StorageUtils.setObject(STORAGE_KEYS.USER_PREFERENCES, preferences)
  },
  
  getUserPreferences: <T>(): T | null => {
    return StorageUtils.getObject<T>(STORAGE_KEYS.USER_PREFERENCES)
  },
  
  // Auth token
  setAuthToken: (token: string) => {
    StorageUtils.setString(STORAGE_KEYS.AUTH_TOKEN, token)
  },
  
  getAuthToken: (): string | undefined => {
    return StorageUtils.getString(STORAGE_KEYS.AUTH_TOKEN)
  },
  
  clearAuthToken: () => {
    StorageUtils.delete(STORAGE_KEYS.AUTH_TOKEN)
  },
}