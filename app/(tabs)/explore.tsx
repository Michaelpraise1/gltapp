import { MediaCard } from '@/components/MediaCard';
import { MediaHeader } from '@/components/MediaHeader';
import { TopicCard } from '@/components/TopicCard';
import { useAuth } from '@/context/AuthContext';
import { contentAPI, branchAPI } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface Sermon {
  _id: string;
  title: string;
  preacher: string;
  duration: string;
  thumbnail?: string;
  audioUrl?: string;
  branch: string;
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1544427928-c49cd1bd4416?auto=format&fit=crop&q=80';

export default function MediaScreen() {
  const { user } = useAuth();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  const topics = [
    { title: 'Greatness', colors: ['#116B3C', '#0D502D'] as [string, string] },
    { title: 'Spreading The Blessing Of Abraham', colors: ['#00D1B2', '#116B3C'] as [string, string] },
    { title: 'Sacrificial & Benevolent Giving', colors: ['#7EB674', '#116B3C'] as [string, string] },
    { title: 'Emphasis On Our Identity In Christ', colors: ['#C0C0C0', '#116B3C'] as [string, string] },
  ];

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        let branchId = user?.branch;
        if (!branchId) {
          // No user branch — load from first available branch
          const branchRes = await branchAPI.getBranches();
          const branches = branchRes.data || [];
          branchId = branches[0]?._id;
        }
        if (branchId) {
          const res = await contentAPI.getSermons(branchId);
          setSermons(res.data || []);
        }
      } catch (err) {
        // Backend sermon endpoint not yet deployed — show empty state
        console.log('Sermons endpoint not available yet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [user?.branch]);

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with search and categories */}
        <MediaHeader />

        {/* Latest Sermons Section */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-white text-xl font-bold">Latest Sermons</Text>
          <TouchableOpacity>
            <Text className="text-brand-green font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="small" color="#116B3C" />
            <Text className="text-white/40 text-xs mt-2">Loading sermons...</Text>
          </View>
        ) : sermons.length === 0 ? (
          /* Fallback cards while backend sermon endpoint is being deployed */
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mb-8">
            <View className="w-80 mr-4">
              <MediaCard
                title="Grace Unveiled"
                speaker="Pastor Atoyebi"
                duration="01:08:30"
                thumbnail={DEFAULT_THUMBNAIL}
              />
            </View>
            <View className="w-80 mr-4">
              <MediaCard
                title="Increasing in Grace"
                speaker="Pastor Atoyebi"
                duration="55:20"
                thumbnail="https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80"
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mb-8">
            {sermons.map((sermon) => (
              <View key={sermon._id} className="w-80 mr-4">
                <MediaCard
                  title={sermon.title}
                  speaker={sermon.preacher}
                  duration={sermon.duration || '—'}
                  thumbnail={sermon.thumbnail || DEFAULT_THUMBNAIL}
                />
              </View>
            ))}
          </ScrollView>
        )}

        {/* Explore by Topic Section */}
        <View className="flex-row items-center justify-between px-6 mb-2">
          <View>
            <Text className="text-white text-xl font-bold">Explore by Topic</Text>
            <Text className="text-white/40 text-xs mt-1">Access popular sermons from this year</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-brand-green font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap px-4.5 py-4">
          {topics.map((topic, index) => (
            <TopicCard key={index} title={topic.title} colors={topic.colors} />
          ))}
        </View>

        {/* Buffer for bottom tabs */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
