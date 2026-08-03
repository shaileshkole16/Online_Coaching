import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.pushToken = null;
  }

  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Push notifications are not supported on simulators');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    // Get the token that uniquely identifies this device
    this.pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Save token to storage
    await AsyncStorage.setItem('pushToken', this.pushToken);
    
    console.log('Push token:', this.pushToken);
    return this.pushToken;
  }

  async getPushToken() {
    if (this.pushToken) {
      return this.pushToken;
    }
    
    try {
      const storedToken = await AsyncStorage.getItem('pushToken');
      if (storedToken) {
        this.pushToken = storedToken;
        return storedToken;
      }
    } catch (error) {
      console.log('Error getting stored push token:', error);
    }
    
    return null;
  }

  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.log('Error sending local notification:', error);
    }
  }

  async scheduleNotification(title, body, trigger, data = {}) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });
      return notificationId;
    } catch (error) {
      console.log('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error canceling all notifications:', error);
    }
  }

  addNotificationListener(listener) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseListener(listener) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  removeSubscription(subscription) {
    subscription.remove();
  }

  // Notification helpers for specific events
  async notifyNewMessage(senderName, message) {
    await this.sendLocalNotification(
      `New message from ${senderName}`,
      message,
      { type: 'message' }
    );
  }

  async notifyNewAssignment(courseName, assignmentTitle) {
    await this.sendLocalNotification(
      'New Assignment Posted',
      `${assignmentTitle} has been posted in ${courseName}`,
      { type: 'assignment', courseName }
    );
  }

  async notifyQuizReminder(courseName, quizTitle, dueDate) {
    await this.sendLocalNotification(
      'Quiz Reminder',
      `${quizTitle} in ${courseName} is due on ${dueDate}`,
      { type: 'quiz', courseName }
    );
  }

  async notifyCourseUpdate(courseName, updateMessage) {
    await this.sendLocalNotification(
      `Update: ${courseName}`,
      updateMessage,
      { type: 'course_update', courseName }
    );
  }

  async notifyGradePosted(courseName, assignmentTitle, grade) {
    await this.sendLocalNotification(
      'Grade Posted',
      `Your grade for ${assignmentTitle} in ${courseName} is ${grade}`,
      { type: 'grade', courseName }
    );
  }

  async scheduleClassReminder(courseName, lectureTitle, date, time) {
    const trigger = new Date(date);
    trigger.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0);
    
    if (trigger > new Date()) {
      await this.scheduleNotification(
        'Class Reminder',
        `${lectureTitle} for ${courseName} starts at ${time}`,
        { date: trigger, type: 'class_reminder', courseName },
        trigger
      );
    }
  }
}

export default new NotificationService();
