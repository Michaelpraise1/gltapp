import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = ["All", "Categories", "Bookmarks", "Downloads"];

export const MediaHeader = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <View className="px-6 pt-14 pb-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-3xl font-bold">Media</Text>
        <TouchableOpacity className="p-2 bg-brand-card rounded-full">
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat}
            onPress={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-2xl mr-3 ${activeCategory === cat ? 'bg-brand-card/80 border border-white/20' : 'bg-brand-card/40'}`}
          >
            <Text className={`text-sm font-semibold ${activeCategory === cat ? 'text-white' : 'text-white/40'}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
