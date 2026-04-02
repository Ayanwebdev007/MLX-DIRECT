const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
try {
  let serviceAccount;
  
  if (process.env.FIREBASE_CONFIG_JSON) {
    // If running in production (Render), parse the JSON string from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
    console.log('Firebase Admin: Using environment variable configuration');
  } else {
    // For local development, fallback to the JSON file
    serviceAccount = require('../config/firebase-admin-sdk.json');
    console.log('Firebase Admin: Using local JSON file configuration');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization failed:', error.message);
}

/**
 * Send a push notification to a specific user
 * @param {string} fcmToken - The target user's device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional data payload
 */
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken) {
    console.log('No FCM token provided, skipping push notification');
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent push notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
};
