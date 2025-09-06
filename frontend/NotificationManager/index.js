import * as Notifications from 'expo-notifications';
import { API_BACKEND } from '../api';  
import axios from 'axios';
export const registerForPush = async (userId) => {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  await axios.post(`${API_BACKEND}/api/profile/pushtoken`, { userId, token });
};
