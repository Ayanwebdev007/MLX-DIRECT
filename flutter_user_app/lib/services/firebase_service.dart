import 'package:firebase_messaging/firebase_messaging.dart';
import '../services/api_service.dart';
import 'dart:convert';

class FirebaseService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  static Future<void> initialize() async {
    // Request permissions (important for iOS)
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print('User granted permission');
      
      // Get the token
      String? token = await _messaging.getToken();
      if (token != null) {
        print('FCM Token: $token');
        await syncToken(token);
      }
    }

    // Listen for token refreshes
    _messaging.onTokenRefresh.listen((newToken) {
      syncToken(newToken);
    });

    // Handle background messages (handled in main.dart)
  }

  static Future<void> syncToken(String token) async {
    try {
      final response = await ApiService.post('/auth/fcm-token', {'fcmToken': token});
      if (response.statusCode == 200) {
        print('FCM Token synced with backend');
      }
    } catch (e) {
      print('Error syncing FCM token: $e');
    }
  }

  static void listenToMessages(Function(RemoteMessage) onMessageReceived) {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Message received in foreground: ${message.notification?.title}');
      onMessageReceived(message);
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('App opened from notification: ${message.notification?.title}');
    });
  }
}
