import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const TopicCard = ({ title, colors }: { title: string, colors: [string, string, ...string[]] }) => {
  return (
    <TouchableOpacity className="flex-1 min-w-[45%] h-24 m-1.5 overflow-hidden rounded-[24px]">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 items-center justify-center p-4"
      >
        <Text className="text-white font-bold text-center text-sm">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
