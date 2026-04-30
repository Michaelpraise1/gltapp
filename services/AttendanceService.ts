import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { attendanceAPI } from './api';

const GEOFENCE_TASK_NAME = 'AUTOMATED_ATTENDANCE_GEOFENCE';

// 1. Define the task
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data: { eventType, region }, error }: any) => {
  if (error) {
    console.error('Geofence error:', error);
    return;
  }

  // region.identifier should be the branchId
  const branchId = region.identifier;

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`Entering geofence for branch: ${branchId}`);
    try {
      await attendanceAPI.checkIn({ branchId });
      // Optional: Local notification
    } catch (err) {
      console.error('Failed to auto check-in:', err);
    }
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log(`Exiting geofence for branch: ${branchId}`);
    try {
      await attendanceAPI.checkOut({ branchId });
      // Optional: Local notification
    } catch (err) {
      console.error('Failed to auto check-out:', err);
    }
  }
});

// 2. Service methods
export const AttendanceService = {
  startMonitoring: async (branches: any[]) => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') return;

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') return;

    // Convert branches to Expo geofence regions
    const regions = branches.map(branch => ({
      identifier: branch._id,
      latitude: branch.latitude,
      longitude: branch.longitude,
      radius: branch.geofenceRadius || 200,
      notifyOnEnter: true,
      notifyOnExit: true,
    }));

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
    console.log('Automated attendance monitoring started');
  },

  stopMonitoring: async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
    if (isRegistered) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      console.log('Automated attendance monitoring stopped');
    }
  }
};
