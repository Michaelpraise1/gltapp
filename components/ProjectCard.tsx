import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export const ProjectCard = ({ title, image }: { title: string, image: string }) => {
  return (
    <TouchableOpacity className="mx-6 bg-brand-card/80 rounded-[32px] overflow-hidden border border-white/5">
      <View className="h-44 w-full">
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="p-6">
        <Text className="text-white font-bold text-lg">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
