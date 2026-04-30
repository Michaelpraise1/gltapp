import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { GivingTabs } from '@/components/GivingTabs';
import { BankCard } from '@/components/BankCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function GivingScreen() {
  const [activeTab, setActiveTab] = React.useState('offering');

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-14 pb-4">
          <Text className="text-white text-3xl font-bold">Giving</Text>
        </View>

        {/* Giving Type Tabs */}
        <GivingTabs activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Bank Detail Cards */}
        {activeTab === 'offering' && (
          <BankCard 
             category="Offering"
             bankName="Stanbic IBTC Bank"
             accountNo="0067015990"
             accountName="GODS LOVE TABERNACLE"
             color="#116B3C"
          />
        )}

        {activeTab === 'tithe' && (
          <BankCard 
             category="Tithe"
             bankName="Fidelity Bank"
             accountNo="5540044696"
             accountName="GODS LOVE TABERNACLE"
             color="#116B3C"
          />
        )}

        {activeTab === 'rent' && (
          <BankCard 
             category="Rent"
             bankName="Access Bank"
             accountNo="1909666384"
             accountName="GODS LOVE TABERNACLE"
             color="#116B3C"
          />
        )}

        {/* Online Giving Placeholder */}
        <TouchableOpacity className="mx-6 p-6 bg-brand-card/60 rounded-[28px] border border-white/5 flex-row items-center justify-between mb-8">
           <View>
              <Text className="text-white/60 mb-2 italic">Give Online (coming soon)</Text>
              <View className="flex-row gap-3">
                 <MaterialCommunityIcons name="credit-card-outline" size={24} color="white" />
                 <MaterialCommunityIcons name="finance" size={24} color="white" />
              </View>
           </View>
           <Ionicons name="chevron-forward" size={24} color="#116B3C" />
        </TouchableOpacity>

        {/* Other ways to Give Section */}
        <View className="px-6 mb-4">
           <Text className="text-white text-xl font-bold">Other ways to Give</Text>
        </View>
        
        <View className="flex-row px-6 gap-4 mb-8">
           <TouchableOpacity className="flex-1 bg-brand-card/80 p-5 rounded-[28px] border border-white/5">
              <View className="w-10 h-10 bg-brand-red rounded-full items-center justify-center mb-3">
                 <MaterialCommunityIcons name="infinity" size={24} color="white" />
              </View>
              <Text className="text-brand-red font-bold mb-1">Global</Text>
              <Text className="text-white/40 text-[10px]">You can give to our global growth today.</Text>
           </TouchableOpacity>
           
           <TouchableOpacity className="flex-1 bg-brand-card/80 p-5 rounded-[28px] border border-white/5">
              <View className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center mb-3">
                 <MaterialCommunityIcons name="office-building" size={24} color="white" />
              </View>
              <Text className="text-purple-600 font-bold mb-1">Campuses</Text>
              <Text className="text-white/40 text-[10px]">You can give to our other campuses today.</Text>
           </TouchableOpacity>
        </View>

        {/* Ongoing Projects Section */}
        <View className="flex-row items-center justify-between px-6 mb-4">
          <Text className="text-white text-xl font-bold">Ongoing project</Text>
          <TouchableOpacity>
            <Text className="text-brand-green font-semibold">View all</Text>
          </TouchableOpacity>
        </View>

        <ProjectCard 
           title="Global Building Project"
           image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"
        />

        {/* Giving Support Accordion */}
        <TouchableOpacity className="mx-6 mt-8 mb-10 p-5 bg-black/40 rounded-2xl flex-row items-center justify-between border border-white/5">
           <View className="flex-row items-center">
              <MaterialCommunityIcons name="headphones" size={20} color="white" />
              <Text className="text-white/80 ml-3 font-medium">Giving support</Text>
           </View>
           <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        {/* Buffer for bottom tabs */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
