import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { branchAPI } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Header = () => {
  const { user } = useAuth();
  const [branchName, setBranchName] = useState('Loading...');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchBranchName = async () => {
      if (!user?.branch) {
        setBranchName('No Branch');
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
        setBranchName('GLT');
      }
    };
    fetchBranchName();
  }, [user?.branch]);

  useEffect(() => {
    const calculateStreak = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastLoginDate = await AsyncStorage.getItem('lastLoginDate');
        let currentStreak = parseInt(await AsyncStorage.getItem('userStreak') || '0', 10);

        if (lastLoginDate) {
          if (lastLoginDate === today) {
            // Already opened app today, keep streak
            setStreak(currentStreak);
          } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastLoginDate === yesterdayStr) {
              currentStreak += 1; // Streak continues!
            } else {
              currentStreak = 1; // Streak broken
            }
            await AsyncStorage.setItem('userStreak', currentStreak.toString());
            await AsyncStorage.setItem('lastLoginDate', today);
            setStreak(currentStreak);
          }
        } else {
          // First time tracking
          await AsyncStorage.setItem('userStreak', '1');
          await AsyncStorage.setItem('lastLoginDate', today);
          setStreak(1);
        }
      } catch (error) {
        console.error('Error calculating streak:', error);
      }
    };
    calculateStreak();
  }, []);

  return (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
      {/* Logo & Branch */}
      <View className="flex-row items-center gap-3">
        <Image 
          source={require('@/assets/images/glt_logo.png')} 
          style={{ width: 44, height: 44, borderRadius: 12 }} 
        />
        <Text className="text-white text-xl font-bold">{branchName}</Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="flex-row items-center bg-brand-card/50 px-3 py-1.5 rounded-full">
          <MaterialCommunityIcons name="fire" size={20} color={streak > 0 ? "#FFD700" : "#9BA1A6"} />
          <Text className="text-white font-bold ml-1">{streak}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="relative bg-brand-card/50 p-2 rounded-full">
          <Ionicons name="notifications-outline" size={24} color="white" />
          <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green rounded-full items-center justify-center border-2 border-brand-dark">
            <Text className="text-white text-[8px] font-bold">1</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
