import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ServiceItem = ({ icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <TouchableOpacity className="flex-1 bg-brand-card p-4 rounded-[24px] items-center text-center border border-white/5">
    <View className="mb-2">
      {icon}
    </View>
    <Text className="text-white font-bold text-[13px] text-center mb-1">{title}</Text>
    <Text className="text-white/40 text-[10px] text-center" numberOfLines={2}>{subtitle}</Text>
  </TouchableOpacity>
);

export const ServiceGrid = () => {
  return (
    <View className="flex-row px-6 gap-3 py-4">
      <ServiceItem 
        icon={<MaterialCommunityIcons name="heart-multiple-outline" size={24} color="#EE3B3B" />}
        title="Join a MAP"
        subtitle="Meet and pray with others"
      />
      <ServiceItem 
        icon={<MaterialCommunityIcons name="hands-pray" size={24} color="#EE3B3B" />}
        title="Ask for prayer"
        subtitle="We would love to pray with you"
      />
      <ServiceItem 
        icon={<MaterialCommunityIcons name="chat-question-outline" size={24} color="#EE3B3B" />}
        title="Counselling"
        subtitle="Ask questions, and get support"
      />
    </View>
  );
};
