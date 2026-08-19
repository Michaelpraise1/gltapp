import { useAuth } from '@/context/AuthContext';
import { contentAPI, branchAPI } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Modal, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

interface Testimony {
  _id: string;
  title: string;
  content: string;
  date: string;
  user?: {
    fullName: string;
  };
}

export default function TestimoniesScreen() {
  const { user } = useAuth();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchAPI.getBranches();
        const branchList = response.data || [];
        setBranches(branchList);
        if (user?.branch) {
          setSelectedBranchId(user.branch);
        } else if (branchList.length > 0) {
          setSelectedBranchId(branchList[0]._id);
        }
      } catch (error) {
        console.error('Error fetching branches in testimonies:', error);
      }
    };
    fetchBranches();
  }, [user?.branch]);

  // Load testimonies whenever selectedBranchId changes
  useEffect(() => {
    if (!selectedBranchId) return;
    loadTestimonies();
  }, [selectedBranchId]);

  const loadTestimonies = async () => {
    setLoading(true);
    try {
      const response = await contentAPI.getTestimonies(selectedBranchId);
      setTestimonies(response.data || []);
    } catch (error) {
      console.error('Error loading testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitTestimony = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const branchToSubmit = user?.branch || selectedBranchId;
    if (!branchToSubmit) {
      Alert.alert('Error', 'Please select a branch first');
      return;
    }

    setSubmitting(true);
    try {
      await contentAPI.submitTestimony({
        title,
        content,
        branch: branchToSubmit,
      });
      Alert.alert('Success', 'Testimony submitted for approval! It will appear once approved by an admin.');
      setModalVisible(false);
      setTitle('');
      setContent('');
      loadTestimonies();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.msg || 'Failed to submit testimony');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between border-b border-white/5">
        <View>
          <Text className="text-white text-3xl font-bold">Testimonies</Text>
          <Text className="text-white/40 text-xs mt-1 font-semibold tracking-wider">SHARE GOD'S GOODNESS</Text>
        </View>
        
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

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#116B3C" />
            <Text className="text-white/40 text-xs mt-2 font-medium">Loading testimonies...</Text>
          </View>
        ) : testimonies.length === 0 ? (
          <View className="py-16 items-center justify-center bg-brand-card/20 rounded-[28px] border border-white/5">
            <Text className="text-5xl mb-4 text-center">📖</Text>
            <Text className="text-white text-lg font-bold text-center">No testimonies yet</Text>
            <Text className="text-white/40 text-xs mt-1 text-center px-6">Be the first to share your testimony and inspire others!</Text>
          </View>
        ) : (
          testimonies.map((testimony) => (
            <View key={testimony._id} className="mb-4 bg-brand-card/80 border border-white/5 rounded-[28px] p-6 shadow-md shadow-black/40">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold flex-1 mr-2" numberOfLines={1}>
                  {testimony.title}
                </Text>
                <View className="bg-brand-green/20 px-2.5 py-1 rounded-full">
                  <Text className="text-brand-green text-[10px] font-bold">
                    {new Date(testimony.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </View>
              <Text className="text-white/60 text-sm leading-6 mb-4">{testimony.content}</Text>
              
              <View className="flex-row items-center border-t border-white/5 pt-3 justify-between">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-brand-red rounded-full items-center justify-center mr-2">
                    <Text className="text-white text-[10px] font-bold">
                      {(testimony.user?.fullName || 'Anonymous').substring(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-white/40 text-xs font-semibold">
                    By {testimony.user?.fullName || 'Anonymous'}
                  </Text>
                </View>
                
                <TouchableOpacity className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Ionicons name="heart-outline" size={14} color="#9BA1A6" />
                  <Text className="text-white/40 text-[10px] ml-1 font-bold">Inspiring</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>

      {/* FAB to add testimony */}
      {user && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute right-6 bottom-24 w-14 h-14 bg-brand-green rounded-full items-center justify-center shadow-lg shadow-brand-green/30"
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Testimony Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-[#151719]/95 border-t border-white/10 rounded-t-[32px] p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Share Your Testimony</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 bg-white/5 rounded-full">
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-white/80 text-xs font-semibold mb-2">Testimony Title</Text>
            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4">
              <TextInput
                className="text-white text-sm"
                placeholder="Brief title (e.g. Divine Healing)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <Text className="text-white/80 text-xs font-semibold mb-2">Testimony Content</Text>
            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-6">
              <TextInput
                className="text-white text-sm min-h-[120px]"
                placeholder="Describe what God has done..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={submitTestimony}
                disabled={submitting}
                className={`flex-1 py-4 rounded-2xl items-center justify-center ${
                  submitting ? 'bg-brand-green/50' : 'bg-brand-green'
                }`}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-sm">Submit Testimony</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
