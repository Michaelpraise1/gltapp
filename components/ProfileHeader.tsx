import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { branchAPI } from '@/services/api';

export const ProfileHeader = () => {
  const { user } = useAuth();
  const [branchName, setBranchName] = useState('Loading...');

  useEffect(() => {
    const fetchBranchName = async () => {
      if (!user?.branch) {
        setBranchName('No Branch Selected');
        return;
      }
      try {
        const response = await branchAPI.getBranches();
        const branches = response.data;
        const matchingBranch = branches.find((b: any) => b._id === user.branch);
        if (matchingBranch) {
          setBranchName(matchingBranch.name);
        } else {
          setBranchName('Unknown Branch');
        }
      } catch (err) {
        console.error('Error loading user branch name:', err);
        setBranchName('GLT Member');
      }
    };
    fetchBranchName();
  }, [user?.branch]);
  
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <View className="px-6 py-6 flex-row items-center border-b border-white/5">
      {/* Avatar */}
      <View className="w-20 h-20 bg-brand-red rounded-full items-center justify-center shadow-lg shadow-brand-red/40">
        <Text className="text-white text-3xl font-bold">{getInitials(user?.fullName || 'User')}</Text>
      </View>

      {/* Info */}
      <View className="flex-1 ml-5">
        <Text className="text-white text-xl font-bold">{user?.fullName || 'Guest User'}</Text>
        <Text className="text-white/40 text-xs mb-1">{user?.email || 'email@example.com'}</Text>
        
        <View className="flex-row gap-2 mt-1 flex-wrap">
          {/* Branch Badge */}
          <View className="flex-row items-center bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
             <MaterialCommunityIcons name="office-building" size={12} color="#10b981" />
             <Text className="text-white/80 text-[10px] ml-1 font-bold">{branchName}</Text>
          </View>

          {/* Role Badge */}
          <View className="flex-row items-center bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
             <Ionicons 
               name={user?.role === 'steward' ? 'shield-checkmark' : 'person'} 
               size={12} 
               color={user?.role === 'steward' ? '#116B3C' : '#007AFF'} 
             />
             <Text className="text-white/80 text-[10px] ml-1 font-bold capitalize">{user?.role || 'Member'}</Text>
          </View>
        </View>
      </View>

      {/* Edit */}
      <TouchableOpacity className="p-2 bg-brand-card rounded-full">
        <MaterialCommunityIcons name="pencil" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};
