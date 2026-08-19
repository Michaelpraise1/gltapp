import { ConfessionCard } from '@/components/ConfessionCard';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { MediaCard } from '@/components/MediaCard';
import { QuickActions } from '@/components/QuickActions';
import { ServiceGrid } from '@/components/ServiceGrid';
import { useAuth } from '@/context/AuthContext';
import { contentAPI, branchAPI } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';

interface Sermon {
  _id: string;
  title: string;
  preacher: string;
  duration: string;
  thumbnail?: string;
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1544427928-c49cd1bd4416?auto=format&fit=crop&q=80';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [latestSermon, setLatestSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        let branchId = user?.branch;
        if (!branchId) {
          const branchRes = await branchAPI.getBranches();
          branchId = branchRes.data?.[0]?._id;
        }
        if (branchId) {
          const res = await contentAPI.getSermons(branchId);
          const list: Sermon[] = res.data || [];
          if (list.length > 0) {
            // Show the most recently added sermon (last in list)
            setLatestSermon(list[list.length - 1]);
          }
        }
      } catch {
        // Backend sermon endpoint not yet deployed — use default card
      }
    };
    fetchLatest();
  }, [user?.branch]);

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Header />

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
          title={latestSermon?.title ?? 'Grace unveiled'}
          speaker={latestSermon?.preacher ?? 'Pastor Atoyebi'}
          duration={latestSermon?.duration ?? '01:08:30'}
          thumbnail={latestSermon?.thumbnail ?? DEFAULT_THUMBNAIL}
        />

        {/* Daily Word / Confession */}
        <View className="pt-8">
          <ConfessionCard
            views={114}
            text="I declare, that by the teaching of the word, I am transformed into the image of Christ..."
            dateRange="Apr 20 - Apr 22, 2026"
            thumbnail={DEFAULT_THUMBNAIL}
          />
        </View>

        {/* Buffer for bottom tabs */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
