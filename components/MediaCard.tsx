import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MediaCard = ({ title, speaker, duration, thumbnail }: { title: string, speaker: string, duration: string, thumbnail: string }) => {
  return (
    <View className="mx-6 bg-brand-card rounded-[28px] overflow-hidden border border-white/5">
      {/* Thumbnail Area */}
      <View className="h-48 w-full relative">
        <Image 
          source={{ uri: thumbnail }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-md">
          <Text className="text-white text-[10px] font-bold">{duration}</Text>
        </View>
      </View>

      {/* Info Area */}
      <View className="p-5 flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <View className="flex-row items-center gap-2 mb-1">
             <Image source={{ uri: thumbnail }} className="w-8 h-8 rounded-full" />
             <View>
                <Text className="text-white font-bold text-base" numberOfLines={1}>{title}</Text>
                <Text className="text-white/50 text-xs">{speaker}</Text>
             </View>
          </View>
        </View>
        
        <TouchableOpacity className="w-12 h-12 bg-brand-red rounded-full items-center justify-center shadow-lg shadow-brand-red/40">
          <Ionicons name="play" size={24} color="white" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
