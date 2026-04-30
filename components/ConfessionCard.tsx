import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ConfessionCard = ({ text, dateRange, views, thumbnail }: { text: string, dateRange: string, views: number, thumbnail: string }) => {
  return (
    <View className="mx-6 mb-10 bg-brand-card rounded-[28px] p-5 border border-white/5 flex-row">
      <View className="flex-1 pr-4">
        <View className="flex-row items-center bg-white/5 self-flex-start px-2 py-1 rounded-full mb-3">
          <Ionicons name="eye-outline" size={12} color="#9BA1A6" />
          <Text className="text-[#9BA1A6] text-[10px] ml-1 font-bold">{views}</Text>
        </View>

        <Text className="text-white/60 text-xs font-bold mb-1">Confession</Text>
        <Text className="text-white text-sm leading-5 mb-4" numberOfLines={3}>
          {text}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#9BA1A6" />
          <Text className="text-[#9BA1A6] text-[10px] ml-1">{dateRange}</Text>
        </View>
      </View>

      <View className="w-24 h-24 rounded-2xl overflow-hidden self-center">
        <Image source={{ uri: thumbnail }} className="w-full h-full" />
      </View>
      
      <View className="absolute top-5 right-5">
         <View className="w-5 h-5 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={12} color="white" />
         </View>
      </View>
    </View>
  );
};
