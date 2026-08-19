import { useAuth } from '@/context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verificationAPI } from '@/services/api';

export default function BecomeStewardScreen() {
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  // Group link - can be updated to specific GLT cohort link
  const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/GLTFormalFBS';

  if (user?.role === 'steward') {
    return (
      <View className="flex-1 bg-brand-dark">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1" edges={['top']}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Become a Steward</Text>
            <View className="w-10" />
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 bg-brand-green/20 rounded-full items-center justify-center mb-6 border border-brand-green/30">
              <Ionicons name="shield-checkmark" size={40} color="#116B3C" />
            </View>
            <Text className="text-white text-2xl font-bold text-center mb-2">Verified Steward</Text>
            <Text className="text-white/60 text-sm text-center leading-relaxed max-w-xs">
              You are already registered and verified as a Steward in GLT. Thank you for your service to the body of Christ!
            </Text>
            
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-8 bg-brand-green px-8 py-3.5 rounded-xl"
            >
              <Text className="text-white font-bold text-sm">Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setCertificate(file);
        Alert.alert('Success', 'FBS Certificate selected!');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleJoinWhatsApp = async () => {
    try {
      const supported = await Linking.canOpenURL(WHATSAPP_GROUP_LINK);
      if (supported) {
        await Linking.openURL(WHATSAPP_GROUP_LINK);
      } else {
        // Fallback to opening in browser
        await Linking.openURL(WHATSAPP_GROUP_LINK);
      }
    } catch (error) {
      console.error('Error opening WhatsApp link:', error);
      Alert.alert('Error', 'Could not open the WhatsApp link. Please try again later.');
    }
  };

  const handleSubmit = async () => {
    if (!certificate) {
      Alert.alert('Error', 'Please select your FBS certificate file to upload.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', {
        uri: certificate.uri,
        name: certificate.name || 'fbs_certificate.pdf',
        type: certificate.mimeType || 'application/pdf',
      } as any);

      await verificationAPI.upload(formData);

      Alert.alert(
        'Submission Successful',
        'Your FBS certificate has been uploaded. The admin team will review it, and update your status to Steward once approved.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error uploading certificate:', error);
      Alert.alert(
        'Upload Failed',
        error.response?.data?.msg || error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Become a Steward</Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero / Doctrinal info */}
          <View className="px-6 pt-6">
            <LinearGradient
              colors={['#151719', '#0B0C0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6 rounded-[28px] border border-white/5 shadow-2xl mb-6 relative overflow-hidden"
            >
              <View className="w-12 h-12 bg-brand-green/20 rounded-2xl items-center justify-center mb-4 border border-brand-green/10">
                <Ionicons name="school" size={24} color="#116B3C" />
              </View>
              
              <Text className="text-white text-xl font-bold mb-2">Foundation Bible School</Text>
              <Text className="text-white/60 text-sm leading-relaxed mb-4">
                The Foundation Bible School (FBS) is a structured doctrinal class designed to equip believers with the foundational truths of God's Word and align them with the unique vision, culture, and core values of GLT (God's Love Tabernacle).
              </Text>
              <Text className="text-white/60 text-sm leading-relaxed">
                Completing FBS and obtaining the certificate is a required milestone for anyone seeking to serve in any stewardship capacity or department within GLT global.
              </Text>
            </LinearGradient>
          </View>

          {/* Section 1: Join FBS (If not enrolled/completed) */}
          <View className="px-6 mb-6">
            <Text className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Haven't completed FBS?</Text>
            <View className="bg-brand-card/60 p-5 rounded-[24px] border border-white/5">
              <Text className="text-white text-sm font-semibold mb-2">Join the next cohort on WhatsApp</Text>
              <Text className="text-white/50 text-xs leading-relaxed mb-4">
                If you have not attended FBS or do not have a copy of your certificate yet, join the learning channel below to register for the upcoming cohort.
              </Text>

              <TouchableOpacity
                onPress={handleJoinWhatsApp}
                className="w-full flex-row items-center justify-center bg-[#25D366] py-3.5 rounded-xl"
              >
                <Ionicons name="logo-whatsapp" size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-sm ml-2">Join FBS Class on WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Upload Certificate (If completed) */}
          <View className="px-6">
            <Text className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Already have your certificate?</Text>
            <View className="bg-brand-card/60 p-5 rounded-[24px] border border-white/5">
              <Text className="text-white text-sm font-semibold mb-1">Submit your FBS Certificate</Text>
              <Text className="text-white/50 text-xs leading-relaxed mb-4">
                Upload your certificate in PDF or image format (max 5MB) to initiate your promotion to a Steward.
              </Text>

              {uploading ? (
                <View className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 items-center justify-center">
                  <ActivityIndicator size="small" color="#116B3C" />
                  <Text className="text-white/60 text-xs mt-3">Uploading certificate...</Text>
                </View>
              ) : certificate ? (
                /* Selected File Card */
                <View className="bg-white/5 border border-white/15 rounded-2xl p-4 flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1 pr-4">
                    <View className="w-10 h-10 bg-brand-green/20 rounded-xl items-center justify-center mr-3">
                      <Ionicons name="document-text" size={22} color="#116B3C" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                        {certificate.name}
                      </Text>
                      <Text className="text-white/40 text-[10px] mt-0.5">
                        {certificate.size ? `${(certificate.size / 1024 / 1024).toFixed(2)} MB` : 'PDF / Image'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setCertificate(null)}
                    className="p-1 bg-white/10 rounded-full"
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                /* File picker area */
                <TouchableOpacity
                  onPress={handleSelectDocument}
                  className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 items-center justify-center active:bg-white/10 mb-4"
                >
                  <MaterialCommunityIcons name="cloud-upload" size={32} color="#9BA1A6" />
                  <Text className="text-white text-xs font-semibold mt-2">Choose Certificate File</Text>
                  <Text className="text-white/40 text-[10px] mt-1">PDF, JPG, or PNG up to 5MB</Text>
                </TouchableOpacity>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={uploading || !certificate}
                className={`w-full py-4 rounded-xl items-center justify-center ${
                  uploading || !certificate ? 'bg-brand-green/50' : 'bg-brand-green'
                }`}
              >
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-sm">Submit Verification Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
