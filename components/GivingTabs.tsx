import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  { id: 'offering', label: 'Offering', icon: 'hand-heart-outline' },
  { id: 'tithe', label: 'Tithe', icon: 'package-variant-closed' },
  { id: 'project', label: 'Project', icon: 'office-building' }
];

export const GivingTabs = ({
  activeTab,
  onSelectTab
}: {
  activeTab: string,
  onSelectTab: (id: string) => void
}) => {
  return (
    <View className="px-6 py-4">
      <View className="flex-row bg-brand-card/40 rounded-full p-2 border border-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectTab(tab.id)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-full ${isActive ? 'bg-brand-green' : ''}`}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={18}
                color={isActive ? "white" : "#9BA1A6"}
              />
              <Text className={`ml-2 text-sm font-bold ${isActive ? 'text-white' : 'text-[#9BA1A6]'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
