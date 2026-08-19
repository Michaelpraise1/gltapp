import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { GivingTabs } from '@/components/GivingTabs';
import { BankCard } from '@/components/BankCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { contentAPI, branchAPI } from '@/services/api';
import { Picker } from "@react-native-picker/picker";

export default function GivingScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('offering');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load branches on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchRes = await branchAPI.getBranches();
        const branchList = branchRes.data || [];
        setBranches(branchList);

        if (user?.branch) {
          setSelectedBranchId(user.branch);
        } else if (branchList.length > 0) {
          setSelectedBranchId(branchList[0]._id);
        }
      } catch (error) {
        console.error('Error loading branches in Giving:', error);
      }
    };
    loadInitialData();
  }, [user?.branch]);

  // Load accounts when selected branch changes
  useEffect(() => {
    if (!selectedBranchId) return;

    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await contentAPI.getAccounts(selectedBranchId);
        setAccounts(response.data || []);
      } catch (error) {
        console.error('Error loading accounts:', error);
        Alert.alert('Error', 'Failed to load bank accounts for the selected branch.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [selectedBranchId]);

  // Filter accounts by type mapping to activeTab
  const getFilteredAccounts = () => {
    const typeMap: Record<string, string> = {
      offering: 'Offering',
      tithe: 'Tithe',
      project: 'Project',
    };
    const targetType = typeMap[activeTab];
    return accounts.filter((acc) => acc.type === targetType);
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-bold">Giving</Text>
          {branches.length > 1 && (
            <View className="bg-brand-card border border-white/5 rounded-full overflow-hidden justify-center" style={{ height: 36, width: 140 }}>
              <Picker
                selectedValue={selectedBranchId}
                onValueChange={(val) => setSelectedBranchId(val)}
                dropdownIconColor="white"
                style={{ color: 'white', fontSize: 12, height: 36, backgroundColor: 'transparent' }}
              >
                {branches.map((branch) => (
                  <Picker.Item key={branch._id} label={branch.name} value={branch._id} style={{ fontSize: 12 }} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Giving Type Tabs */}
        <GivingTabs activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Bank Detail Cards */}
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#116B3C" />
            <Text className="text-white/40 text-xs mt-2 font-medium">Fetching accounts...</Text>
          </View>
        ) : getFilteredAccounts().length > 0 ? (
          getFilteredAccounts().map((acc, index) => (
            <BankCard 
               key={acc._id || index}
               category={acc.type}
               bankName={acc.bankName}
               accountNo={acc.accountNumber}
               accountName={acc.accountName}
               color="#116B3C"
            />
          ))
        ) : (
          <View className="mx-6 mb-6 p-6 bg-brand-card/30 rounded-[28px] border border-white/5 items-center justify-center">
            <Ionicons name="information-circle-outline" size={32} color="#9BA1A6" />
            <Text className="text-white/60 text-center text-sm font-semibold mt-2">No bank details found</Text>
            <Text className="text-white/30 text-center text-xs mt-1">No account details have been configured for this category under the selected branch.</Text>
          </View>
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
