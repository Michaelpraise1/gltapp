import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const TopicCard = ({ title, colors }: { title: string, colors: [string, string, ...string[]] }) => {
  return (
    <TouchableOpacity
      style={{ width: '48%', margin: '1%', height: 110, borderRadius: 20, overflow: 'hidden' }}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}
      >
        {/* Decorative circle */}
        <View
          style={{
            position: 'absolute',
            right: -18,
            top: -18,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.10)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 12,
            bottom: -24,
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Icon badge */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="headset-outline" size={16} color="white" />
        </View>

        {/* Title */}
        <Text
          style={{
            color: 'white',
            fontWeight: '700',
            fontSize: 13,
            lineHeight: 18,
            marginTop: 8,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
