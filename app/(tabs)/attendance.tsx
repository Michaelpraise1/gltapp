import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { AttendanceService } from '@/services/AttendanceService';
import { attendanceAPI, branchAPI } from '@/services/api';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [currentCheckIn, setCurrentCheckIn] = useState<any>(null);

  useEffect(() => {
    fetchHistory();
    checkCurrentStatus();
  }, []);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const response = await attendanceAPI.getUserHistory(user.id);
      setAttendanceData(response.data);
    } catch (err) {
      console.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentStatus = async () => {
    // In a real app, you might have an endpoint to check current active session
    // For now, we'll look at the most recent record if it has no duration/checkout
    if (attendanceData.length > 0 && !attendanceData[0].duration) {
      setCurrentCheckIn(attendanceData[0]);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.branch) {
      Alert.alert("Error", "Please select a branch in your profile first.");
      return;
    }
    setLoading(true);
    try {
      await attendanceAPI.checkIn({ 
        branchId: user.branch, 
        serviceType: 'Sunday Service' // Default or dynamic
      });
      Alert.alert("Success", "Checked in successfully!");
      fetchHistory();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.branch) return;
    setLoading(true);
    try {
      await attendanceAPI.checkOut({ branchId: user.branch });
      Alert.alert("Success", "Checked out successfully!");
      setCurrentCheckIn(null);
      fetchHistory();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoAttendance = async (value: boolean) => {
    if (value) {
      try {
        // Fetch branches from the API to get actual coordinates
        const response = await branchAPI.getBranches();
        const branches = response.data;
        const matchingBranch = branches.find((b: any) => b._id === user?.branch);

        const branchCoordinates = {
          _id: user?.branch || 'ibadan-branch-id',
          latitude: matchingBranch?.latitude || 7.3775, // Backend or default
          longitude: matchingBranch?.longitude || 3.9470, // Backend or default
          geofenceRadius: 200
        };

        await AttendanceService.startMonitoring([branchCoordinates]);
        setIsAutoEnabled(true);
        Alert.alert(
          "Automatic Attendance Active",
          "The app will now automatically check you in when you arrive at church premises."
        );
      } catch (err) {
        Alert.alert("Permission Required", "Please enable background location access in your settings to use this feature.");
        setIsAutoEnabled(false);
      }
    } else {
      await AttendanceService.stopMonitoring();
      setIsAutoEnabled(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-4">
          <Text className="text-white text-3xl font-bold">Attendance</Text>
        </View>

        {/* Status Card */}
        <View className="mx-6 p-6 bg-brand-card/80 rounded-[32px] border border-white/5 mb-8">
           <View className="flex-row items-center justify-between mb-6">
              <View>
                 <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Current Status</Text>
                 <Text className="text-white text-xl font-bold mt-1">
                   {attendanceData.length > 0 && !attendanceData[0].duration ? 'Checked In' : 'Not at Church'}
                 </Text>
                 {attendanceData.length > 0 && !attendanceData[0].duration && (
                   <Text className="text-brand-green text-xs font-bold mt-1">
                     Arrived: {new Date(attendanceData[0].checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </Text>
                 )}
              </View>
              <View className="w-12 h-12 bg-white/5 rounded-full items-center justify-center">
                 <MaterialCommunityIcons 
                   name={attendanceData.length > 0 && !attendanceData[0].duration ? "map-marker-check" : "map-marker-off"} 
                   size={24} 
                   color={attendanceData.length > 0 && !attendanceData[0].duration ? "#116B3C" : "#9BA1A6"} 
                 />
              </View>
           </View>

           {/* Manual Check-in Button */}
           <TouchableOpacity 
             onPress={attendanceData.length > 0 && !attendanceData[0].duration ? handleCheckOut : handleCheckIn}
             className={`py-4 rounded-2xl items-center justify-center mb-6 ${attendanceData.length > 0 && !attendanceData[0].duration ? 'bg-white/5 border border-white/10' : 'bg-brand-green'}`}
           >
             <Text className={`font-bold ${attendanceData.length > 0 && !attendanceData[0].duration ? 'text-white' : 'text-white'}`}>
               {attendanceData.length > 0 && !attendanceData[0].duration ? 'Check-out Manual' : 'Check-in Now'}
             </Text>
           </TouchableOpacity>

           <View className="flex-row items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
              <View className="flex-1 mr-4">
                 <Text className="text-white font-bold text-sm">Automatic Attendance</Text>
                 <Text className="text-white/40 text-[10px] mt-1">Check-in automatically via Geofence</Text>
              </View>
              <Switch 
                value={isAutoEnabled}
                onValueChange={toggleAutoAttendance}
                trackColor={{ false: '#1c1e22', true: '#116B3C' }}
                thumbColor="#fff"
              />
           </View>
        </View>

        {/* History Section */}
        <View className="px-6 mb-4 flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">Recent Stays</Text>
            <TouchableOpacity>
                <Text className="text-brand-green font-semibold">View All</Text>
            </TouchableOpacity>
        </View>

        {loading ? (
            <ActivityIndicator color="#116B3C" className="mt-10" />
        ) : (
            <View className="px-6 gap-4">
                {attendanceData.length > 0 ? (
                    attendanceData.map((record, index) => (
                        <View key={index} className="p-5 bg-brand-card/60 rounded-[24px] border border-white/5 flex-row items-center">
                            <View className="w-12 h-12 bg-white/5 rounded-full items-center justify-center mr-4">
                                <Ionicons name="calendar" size={20} color="#116B3C" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-sm">
                                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                                <Text className="text-white/40 text-[10px] mt-1">{record.serviceType}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-sm">{record.duration || 0}m</Text>
                                <Text className="text-white/40 text-[10px] mt-1">Time Spent</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="items-center py-20">
                        <Text className="text-white/20 italic">No attendance records found</Text>
                    </View>
                )}
            </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

