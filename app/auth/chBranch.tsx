import { useAuth } from '@/context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { branchAPI, verificationAPI } from '@/services/api';

const ChBranch = () => {
  const { register } = useAuth();
  const params = useLocalSearchParams();

  // Retrieve user registration params forwarded from register.tsx
  const fullName = (params?.fullName as string) || '';
  const email = (params?.email as string) || '';
  const password = (params?.password as string) || '';

  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [isSteward, setIsSteward] = useState<boolean | null>(null);
  const [certificate, setCertificate] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchAPI.getBranches();
        setBranches(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedBranch(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        Alert.alert('Error', 'Failed to load branches from the server.');
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Function to handle certificate file selection
  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setCertificate(file);
        Alert.alert('Success', 'Certificate selected!');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleCompleteRegistration = async () => {
    if (!selectedBranch) {
      Alert.alert('Error', 'Please select your branch');
      return;
    }

    if (isSteward === null) {
      Alert.alert('Error', 'Please select whether you are a steward');
      return;
    }

    if (isSteward && !certificate) {
      Alert.alert('Error', 'Please upload your steward certificate');
      return;
    }

    setLoading(true);
    try {
      const finalRole = isSteward ? 'steward' : 'member';
      
      // Call register action from AuthContext
      await register(fullName, email, password, finalRole, selectedBranch);
      
      // If user is a steward, now upload the certificate
      if (isSteward && certificate) {
        setUploading(true);
        const formData = new FormData();
        formData.append('document', {
          uri: certificate.uri,
          name: certificate.name || 'certificate.pdf',
          type: certificate.mimeType || 'application/pdf',
        } as any);
        
        await verificationAPI.upload(formData);
      }
      
      Alert.alert('Success', 'Registration completed successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration/Upload failed:', error);
      Alert.alert('Registration Failed', error.response?.data?.msg || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        className="px-6 py-10"
      >
        <View className="w-full max-w-md mx-auto bg-brand-card rounded-3xl p-6 border border-white/5 shadow-2xl shadow-black/50">
          
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-[#116B3C]/20 rounded-full items-center justify-center mb-4">
              <MaterialCommunityIcons name="church" size={32} color="#116B3C" />
            </View>
            <Text className="text-white text-2xl font-bold text-center">Complete Profile</Text>
            <Text className="text-white/60 text-sm text-center mt-1">Select your branch and role to continue</Text>
          </View>

          {/* Branch Picker */}
          <View className="mb-6">
            <Text className="text-white/80 text-sm font-semibold mb-2">Choose Your Branch</Text>
            <View className="bg-white/5 border border-white/10 rounded-xl overflow-hidden justify-center" style={{ height: 50 }}>
              {branchesLoading ? (
                <ActivityIndicator size="small" color="#116B3C" />
              ) : (
                <Picker
                  selectedValue={selectedBranch}
                  onValueChange={(itemValue) => setSelectedBranch(itemValue)}
                  dropdownIconColor="white"
                  style={{ color: 'white', height: 50 }}
                >
                  {branches.map((branch) => (
                    <Picker.Item key={branch._id} label={branch.name} value={branch._id} />
                  ))}
                </Picker>
              )}
            </View>
          </View>

          {/* Are you a steward? */}
          <View className="mb-6">
            <Text className="text-white/80 text-sm font-semibold mb-3">Are you a Steward?</Text>
            <View className="flex-row gap-4">
              {/* Option: No */}
              <TouchableOpacity
                onPress={() => {
                  setIsSteward(false);
                  setCertificate(null);
                }}
                className={`flex-1 flex-col items-center justify-center p-4 rounded-2xl border ${
                  isSteward === false
                    ? 'bg-[#116B3C]/10 border-[#116B3C]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                  isSteward === false ? 'bg-[#116B3C]/20' : 'bg-white/5'
                }`}>
                  <Ionicons 
                    name="person-outline" 
                    size={20} 
                    color={isSteward === false ? '#116B3C' : '#9BA1A6'} 
                  />
                </View>
                <Text className={`font-semibold ${isSteward === false ? 'text-white' : 'text-white/60'}`}>
                  No
                </Text>
                <Text className="text-[10px] text-center text-white/40 mt-1">Register as member</Text>
              </TouchableOpacity>

              {/* Option: Yes */}
              <TouchableOpacity
                onPress={() => setIsSteward(true)}
                className={`flex-1 flex-col items-center justify-center p-4 rounded-2xl border ${
                  isSteward === true
                    ? 'bg-[#116B3C]/10 border-[#116B3C]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                  isSteward === true ? 'bg-[#116B3C]/20' : 'bg-white/5'
                }`}>
                  <Ionicons 
                    name="shield-checkmark-outline" 
                    size={20} 
                    color={isSteward === true ? '#116B3C' : '#9BA1A6'} 
                  />
                </View>
                <Text className={`font-semibold ${isSteward === true ? 'text-white' : 'text-white/60'}`}>
                  Yes
                </Text>
                <Text className="text-[10px] text-center text-white/40 mt-1">Upload certificate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Certificate upload section */}
          {isSteward === true && (
            <View className="mb-6">
              <Text className="text-white/80 text-sm font-semibold mb-2">Upload Steward Certificate</Text>
              
              {uploading ? (
                <View className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 items-center justify-center">
                  <ActivityIndicator size="small" color="#116B3C" />
                  <Text className="text-white/60 text-xs mt-2">Uploading certificate...</Text>
                </View>
              ) : certificate ? (
                /* Selected File Card */
                <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 pr-4">
                    <View className="w-10 h-10 bg-[#116B3C]/20 rounded-xl items-center justify-center mr-3">
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
                /* Empty Upload Target */
                <TouchableOpacity
                  onPress={handleSelectDocument}
                  className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 items-center justify-center active:bg-white/10"
                >
                  <Ionicons name="cloud-upload-outline" size={32} color="#9BA1A6" />
                  <Text className="text-white text-xs font-semibold mt-2">Choose Certificate File</Text>
                  <Text className="text-white/40 text-[10px] mt-1">PDF, JPG, or PNG up to 5MB</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCompleteRegistration}
            disabled={loading || uploading}
            className={`w-full py-4 rounded-xl items-center justify-center mt-4 ${
              loading || uploading ? 'bg-[#116B3C]/50' : 'bg-[#116B3C]'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Complete Registration</Text>
            )}
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </View>
  );
};

export default ChBranch;