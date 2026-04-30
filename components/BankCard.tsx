import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export const BankCard = ({ 
  bankName, 
  accountNo, 
  accountName, 
  category,
  logo, 
  color = "#116B3C",
  isDominic = false 
}: { 
  bankName: string, 
  accountNo: string, 
  accountName: string, 
  category: string,
  logo?: any, 
  color?: string,
  isDominic?: boolean
}) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(accountNo);
    // You could add a toast here
  };

  return (
    <View className="mx-6 mb-4 bg-brand-card/80 rounded-[28px] p-5 border border-white/5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center bg-white/5 rounded-full px-3 py-1.5" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
          {logo && <View className="w-5 h-5 bg-white rounded-full mr-2 items-center justify-center overflow-hidden">
             <Image source={typeof logo === 'string' ? { uri: logo } : logo} className="w-full h-full" />
          </View>}
          <Text className="text-white text-[12px] font-bold">{bankName}</Text>
        </View>
        
        <View className="bg-brand-green/20 px-3 py-1.5 rounded-full flex-row items-center">
           <Text className="text-brand-green text-[10px] font-bold uppercase tracking-wider">{category}</Text>
        </View>

        {isDominic && (
           <View className="bg-brand-red/20 px-3 py-1.5 rounded-full flex-row items-center ml-2">
              <MaterialCommunityIcons name="currency-usd" size={14} color="#EE3B3B" />
              <Text className="text-brand-red text-[10px] font-bold ml-1">USD DOM</Text>
           </View>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <View>
            <Text className="text-white text-2xl font-bold tracking-widest">{accountNo}</Text>
            <Text className="text-white/40 text-[10px] mt-1 uppercase font-medium">{accountName}</Text>
        </View>
        
        <TouchableOpacity 
            onPress={copyToClipboard}
            className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
        >
          <MaterialCommunityIcons name="content-copy" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
