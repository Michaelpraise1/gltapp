import React from 'react';
import { ScrollView, View, Text, StatusBar } from 'react-native';
import { Header } from '@/components/Header';
import { QuickActions } from '@/components/QuickActions';
import { HeroBanner } from '@/components/HeroBanner';
import { ServiceGrid } from '@/components/ServiceGrid';
import { MediaCard } from '@/components/MediaCard';
import { ConfessionCard } from '@/components/ConfessionCard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Header branch="Ibadan" />

        {/* Quick Actions Chips */}
        <QuickActions />

        {/* Hero Event Banner */}
        <HeroBanner />

        {/* Secondary Services Grid */}
        <ServiceGrid />

        {/* Latest Sermon Section */}
        <View className="px-6 pt-4 pb-3">
          <Text className="text-white text-xl font-bold">Latest Sermon</Text>
        </View>
        <MediaCard 
          title="Jesus - The Son Of Man"
          speaker="Yeshua"
          duration="01:08:30"
          thumbnail="https://images.unsplash.com/photo-1544427928-c49cd1bd4416?auto=format&fit=crop&q=80"
        />

        {/* Daily Word / Confession */}
        <View className="pt-8">
           <ConfessionCard 
             views={114}
             text="I declare, that by the teaching of the word, I am transformed into the image of Christ..."
             dateRange="Apr 20 - Apr 22, 2026"
             thumbnail="https://images.unsplash.com/photo-1544427928-c49cd1bd4416?auto=format&fit=crop&q=80"
           />
        </View>

        {/* Buffer for bottom tabs */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

