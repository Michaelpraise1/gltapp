import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SettingItem = ({ 
  icon, 
  iconColor, 
  label, 
  showArrow = true, 
  isExternal = false,
  onPress,
  isRed = false
}: { 
  icon: any, 
  iconColor: string, 
  label: string, 
  showArrow?: boolean,
  isExternal?: boolean,
  onPress?: () => void,
  isRed?: boolean
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center px-6 py-4 border-b border-white/5 active:bg-white/5"
    >
      <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: iconColor }}>
        {icon}
      </View>
      
      <Text className={`flex-1 ml-4 font-bold ${isRed ? 'text-brand-red' : 'text-white/90'}`}>{label}</Text>
      
      {showArrow && (
        <Ionicons 
          name={isExternal ? "arrow-up-outline" : "chevron-forward"} 
          size={20} 
          color="#9BA1A6" 
          style={isExternal ? { transform: [{ rotate: '45deg' }] } : {}}
        />
      )}
    </TouchableOpacity>
  );
};
