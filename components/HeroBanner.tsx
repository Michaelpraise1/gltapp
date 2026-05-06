import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Dimensions, FlatList, ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
// Card width is screen width minus horizontal padding (px-6 is 24px * 2 = 48)
const CARD_WIDTH = width - 48;

interface CarouselItem {
  id: string;
  source: ImageSourcePropType;
}

// TODO: Replace these URIs with the actual images you uploaded. If you save them locally 
// in your assets/images folder, you can use: source: require('../assets/images/bible_study.jpg')
const CAROUSEL_DATA: CarouselItem[] = [
  { id: '1', source: require('../assets/images/f1.jpeg') }, // Replace with attached Bible Study Image
  { id: '2', source: require('../assets/images/f2.jpeg') }, // Replace with attached SOM Image
  { id: '3', source: { uri: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80' } }, // Additional Image
];

export const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View style={{ width: CARD_WIDTH }} className="h-96">
      <ImageBackground
        source={item.source}
        className="flex-1 flex-col justify-end p-6"
      >
        <View className="items-center mt-auto pb-4">
          <TouchableOpacity className="bg-black/40 overflow-hidden rounded-full border border-white/20">
            <BlurView intensity={20} className="px-8 py-3">
              <Text className="text-white font-semibold">Share flier! Invite a friend</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View className="px-6 py-4">
      <View className="h-96 w-full rounded-[32px] overflow-hidden bg-brand-card">
        <FlatList
          data={CAROUSEL_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollPosition / CARD_WIDTH);
            if (index !== currentIndex && index >= 0 && index < CAROUSEL_DATA.length) {
              setCurrentIndex(index);
            }
          }}
          scrollEventThrottle={16}
        />
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center absolute bottom-4 w-full">
          {CAROUSEL_DATA.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
