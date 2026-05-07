import { ProfileHeader } from '@/components/ProfileHeader';
import { SettingItem } from '@/components/SettingItem';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-14 pb-4">
          <Text className="text-white text-3xl font-bold">Account</Text>
        </View>

        {/* Profile Section */}
        <ProfileHeader />

        <View className="mt-4">
          <SettingItem
            icon={<MaterialCommunityIcons name="account-details" size={24} color="white" />}
            iconColor="#007AFF"
            label="Account settings"
          />
        </View>

        {/* Settings Group */}
        <View className="mt-6 px-6 mb-2">
          <Text className="text-white/40 text-xs font-bold uppercase tracking-wider">Settings</Text>
        </View>
        <View>
          <SettingItem
            icon={<Ionicons name="notifications" size={20} color="white" />}
            iconColor="#EE3B3B"
            label="Notifications"
          />
          <SettingItem
            icon={<Ionicons name="color-palette" size={20} color="white" />}
            iconColor="#4a4a4a"
            label="Preferences"
          />
          <SettingItem
            icon={<MaterialCommunityIcons name="lock-reset" size={20} color="white" />}
            iconColor="#8b5cf6"
            label="Change Password"
          />
          <SettingItem
            icon={<Ionicons name="play-circle" size={20} color="white" />}
            iconColor="#10b981"
            label="Media Settings"
          />
          <SettingItem
            icon={<Ionicons name="help-circle" size={20} color="white" />}
            iconColor="#22d3ee"
            label="Help & Support"
          />
        </View>

        {/* Resources Group */}
        <View className="mt-8 px-6 mb-2">
          <Text className="text-white/40 text-xs font-bold uppercase tracking-wider">Resources</Text>
        </View>
        <View>
          <SettingItem
            icon={<Ionicons name="star" size={20} color="white" />}
            iconColor="#0ea5e9"
            label="Rate in App Store"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="happy" size={20} color="white" />}
            iconColor="#6366f1"
            label="Feature Request"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="chatbox-ellipses" size={20} color="white" />}
            iconColor="#a855f7"
            label="App Feedback"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="megaphone" size={20} color="white" />}
            iconColor="#06b6d4"
            label="Share Testimony"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="information-circle" size={20} color="white" />}
            iconColor="#854d0e"
            label="FAQ"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="planet" size={20} color="white" />}
            iconColor="#0284c7"
            label="Follow @glt_global"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="document-text" size={20} color="white" />}
            iconColor="#f59e0b"
            label="Terms of Use"
            isExternal={true}
          />
          <SettingItem
            icon={<Ionicons name="shield-checkmark" size={20} color="white" />}
            iconColor="#e11d48"
            label="Privacy Policy"
            isExternal={true}
          />
        </View>

        {/* Sign Out */}
        <View className="mt-8">
          <SettingItem
            icon={<Ionicons name="log-out" size={20} color="white" />}
            iconColor="#EE3B3B"
            label="Sign Out"
            showArrow={false}
            onPress={logout}
            isRed={true}
          />
        </View>

        {/* Footer */}
        <View className="items-center py-12">
          <MaterialCommunityIcons name="infinity" size={48} color="#1c1e22" />
          <Text className="text-white/20 text-[10px] mt-4 font-bold tracking-widest">VERSION 1.0.0</Text>
          <TouchableOpacity className="mt-2">
            <Text className="text-white/20 text-[10px] underline">Acknowledgements</Text>
          </TouchableOpacity>
        </View>

        {/* Buffer for bottom tabs */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
