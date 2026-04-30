import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ActionButton = ({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center bg-brand-card/60 px-4 py-2.5 rounded-full mr-3 border border-white/5"
  >
    <View className="mr-2">
      {icon}
    </View>
    <Text className="text-white/90 font-medium text-sm">{label}</Text>
  </TouchableOpacity>
);

export const QuickActions = () => {
  const router = useRouter();
  
  return (
    <View className="py-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        <ActionButton 
          label="Check-in" 
          icon={<Ionicons name="checkmark-circle" size={18} color="#9BA1A6" />} 
          onPress={() => router.push('/attendance')}
        />
        <ActionButton 
          label="Join Online" 
          icon={<Ionicons name="globe-outline" size={18} color="#9BA1A6" />} 
        />
        <ActionButton 
          label="Campus Info" 
          icon={<MaterialIcons name="location-on" size={18} color="#9BA1A6" />} 
        />
      </ScrollView>
    </View>
  );
};
