import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/wallet_provider.dart';
import 'providers/notification_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/history_screen.dart';
import 'screens/notification_screen.dart';
import 'screens/help_support_screen.dart';
import 'screens/about_us_screen.dart';
import 'screens/profile_screen.dart';
import 'utils/app_theme.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  print('--- BOA PAY: INITIALIZING ECOSYSTEM ---');

  // Safely initialize Firebase without blocking the UI thread indefinitely
  try {
    if (kIsWeb) {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: 'AIzaSyAanFDmKoOBDSFQSP6p0yv3Z6VmSRSqaU4',
          appId: '1:654537241880:android:26f552f24525951bd01a6d',
          messagingSenderId: '654537241880',
          projectId: 'boa-platform',
          storageBucket: 'boa-platform.firebasestorage.app',
        ),
      ).timeout(const Duration(seconds: 5), onTimeout: () {
          print('Firebase initialization timed out. Proceeding to App UI...');
          return Firebase.app(); // Return existing app instance if possible
      });
      print('Firebase Web Initialized');
    } else {
      await Firebase.initializeApp();
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      print('Firebase Mobile Initialized');
    }
  } catch (e) {
    print('Firebase Initialization Notice: $e');
  }
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WalletProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BOA PAY',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const LoginWrapper(),
      routes: {
        '/login': (ctx) => const LoginScreen(),
        '/register': (ctx) => const RegisterScreen(),
        '/dashboard': (ctx) => const DashboardScreen(),
        '/history': (ctx) => const HistoryScreen(),
        '/notifications': (ctx) => const NotificationScreen(),
        '/help': (ctx) => const HelpSupportScreen(),
        '/about': (ctx) => const AboutUsScreen(),
        '/profile': (ctx) => const ProfileScreen(),
      },
    );
  }
}

class LoginWrapper extends StatefulWidget {
  const LoginWrapper({super.key});

  @override
  _LoginWrapperState createState() => _LoginWrapperState();
}

class _LoginWrapperState extends State<LoginWrapper> {
  bool _isChecking = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<WalletProvider>(context, listen: false).tryAutoLogin().then((_) {
        if (!mounted) return;
        final user = Provider.of<WalletProvider>(context, listen: false).user;
        if (user != null) {
          Navigator.pushReplacementNamed(context, '/dashboard');
        } else {
          setState(() => _isChecking = false);
        }
      }).catchError((_) {
        if (mounted) setState(() => _isChecking = false);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isChecking) {
      return Scaffold(
        backgroundColor: AppTheme.primaryBlue,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/logo.png',
                width: 140,
                height: 140,
              ),
              const SizedBox(height: 48),
              const SizedBox(width: 28, height: 28, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3)),
            ],
          ),
        ),
      );
    }
    return const LoginScreen();
  }
}
