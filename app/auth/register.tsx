import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    router.push({
      pathname: '/auth/chBranch' as any,
      params: { fullName, email, password }
    });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/worship_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/60">
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            className="px-6 py-8"
          >
            <View className="w-full max-w-md mx-auto bg-[#151719]/95 border border-white/10 rounded-[32px] p-6 shadow-2xl shadow-black/80">
              
              {/* Logo / Header */}
              <View className="items-center mb-8">
                <Image
                  source={require('@/assets/images/glt_logo.png')}
                  className="w-20 h-20 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-white text-2xl font-bold text-center tracking-tight">God's Love Tabernacle</Text>
                <Text className="text-white/40 text-xs mt-1 text-center font-bold tracking-widest uppercase">Create Account</Text>
              </View>

              {/* Full Name Input */}
              <View className="mb-4">
                <Text className="text-white/80 text-xs font-semibold mb-2">Full Name</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <Ionicons name="person-outline" size={20} color="#9BA1A6" style={{ marginRight: 12 }} />
                  <TextInput
                    className="flex-1 text-white text-sm"
                    placeholder="Enter full name"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-white/80 text-xs font-semibold mb-2">Email Address</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <Ionicons name="mail-outline" size={20} color="#9BA1A6" style={{ marginRight: 12 }} />
                  <TextInput
                    className="flex-1 text-white text-sm"
                    placeholder="Enter email"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-white/80 text-xs font-semibold mb-2">Password</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#9BA1A6" style={{ marginRight: 12 }} />
                  <TextInput
                    className="flex-1 text-white text-sm"
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleRegister}
                className="w-full py-4 rounded-2xl items-center justify-center bg-brand-green mb-6 animate-pulse"
              >
                <Text className="text-white font-bold text-sm">Continue</Text>
              </TouchableOpacity>

              {/* Navigation Link */}
              <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
                <Text className="text-brand-lightGreen text-center text-xs font-semibold">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
