import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const Header = ({ branch = "Ibadan" }) => {
  return (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
      {/* Logo & Branch */}
      <View className="flex-row items-center gap-3">
        <Image 
          source={require('@/assets/images/glt_logo.png')} 
          style={{ width: 44, height: 44, borderRadius: 12 }} 
        />
        <Text className="text-white text-xl font-bold">{branch}</Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="flex-row items-center bg-brand-card/50 px-3 py-1.5 rounded-full">
          <MaterialCommunityIcons name="fire" size={20} color="#FFD700" />
          <Text className="text-white font-bold ml-1">0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="relative bg-brand-card/50 p-2 rounded-full">
          <Ionicons name="notifications-outline" size={24} color="white" />
          <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green rounded-full items-center justify-center border-2 border-brand-dark">
            <Text className="text-white text-[8px] font-bold">1</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
