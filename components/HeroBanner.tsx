import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

export const HeroBanner = () => {
  return (
    <View className="px-6 py-4">
      <View className="h-96 w-full rounded-[32px] overflow-hidden bg-brand-card">
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1544427928-c49cd1bd4416?auto=format&fit=crop&q=80' }} // Placeholder
          className="flex-1 justify-end p-6"
        >
            <View className="items-center py-10">
                <Text className="text-white/60 text-sm font-medium tracking-widest uppercase">20 | SETTLED - COVERED - UNDER GOD | 26</Text>
                <Text className="text-white text-6xl font-serif text-center mt-2 tracking-tighter">EBEN EZER</Text>
            </View>

            <View className="items-center mt-auto">
                <TouchableOpacity className="bg-white/10 overflow-hidden rounded-full border border-white/20">
                    <BlurView intensity={20} className="px-8 py-3">
                        <Text className="text-white font-semibold">Share flier! Invite a friend</Text>
                    </BlurView>
                </TouchableOpacity>
            </View>
        </ImageBackground>
      </View>
    </View>
  );
};
