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
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
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
      title: 'BOA',
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
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<WalletProvider>(context, listen: false).tryAutoLogin().then((_) {
        if (!mounted) return;
        final user = Provider.of<WalletProvider>(context, listen: false).user;
        if (user != null) {
          Navigator.pushReplacementNamed(context, '/dashboard');
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return const LoginScreen();
  }
}
