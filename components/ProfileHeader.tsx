import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export const ProfileHeader = () => {
  const { user } = useAuth();
  
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <View className="px-6 py-6 flex-row items-center border-b border-white/5">
      {/* Avatar */}
      <View className="w-20 h-20 bg-brand-red rounded-full items-center justify-center shadow-lg shadow-brand-red/40">
        <Text className="text-white text-3xl font-bold">{getInitials(user?.fullName || 'User')}</Text>
      </View>

      {/* Info */}
      <View className="flex-1 ml-5">
        <Text className="text-white text-xl font-bold">{user?.fullName || 'Guest User'}</Text>
        <Text className="text-white/40 text-xs mb-2">{user?.email || 'email@example.com'}</Text>
        
        <View className="flex-row items-center bg-white/5 self-flex-start px-2 py-1.5 rounded-full mt-1 border border-white/10">
           <MaterialCommunityIcons name="office-building" size={14} color="#10b981" />
           <Text className="text-white/80 text-[10px] ml-1 font-bold">Ibadan</Text>
        </View>
      </View>

      {/* Edit */}
      <TouchableOpacity className="p-2 bg-brand-card rounded-full">
        <MaterialCommunityIcons name="pencil" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};
