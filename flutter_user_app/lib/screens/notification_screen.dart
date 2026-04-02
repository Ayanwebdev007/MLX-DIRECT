import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../providers/notification_provider.dart';
import '../utils/app_theme.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final provider = Provider.of<NotificationProvider>(context, listen: false);
      provider.fetchNotifications();
      provider.markAllAsRead();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(color: AppTheme.darkSlate, fontWeight: FontWeight.w700, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.darkSlate, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<NotificationProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.notifications.isEmpty) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple));
          }

          if (provider.notifications.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_none_rounded, size: 64, color: Colors.grey.shade200),
                  const SizedBox(height: 24),
                  Text('No notifications yet.', style: TextStyle(color: Colors.grey.shade400, fontWeight: FontWeight.w600)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: provider.fetchNotifications,
            color: AppTheme.primaryPurple,
            child: ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: provider.notifications.length,
              itemBuilder: (context, index) {
                final notification = provider.notifications[index];
                
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
                    ],
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _NotificationIcon(type: notification.type),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              notification.title,
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppTheme.darkSlate),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              notification.message,
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 13, height: 1.4),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              DateFormat('MMM dd, yyyy • hh:mm a').format(notification.createdAt),
                              style: TextStyle(color: Colors.grey.shade400, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      if (!notification.isRead)
                        Container(
                          width: 8, height: 8,
                          decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                        ),
                    ],
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _NotificationIcon extends StatelessWidget {
  final String type;
  const _NotificationIcon({required this.type});

  @override
  Widget build(BuildContext context) {
    IconData icon;
    Color color;

    switch (type) {
      case 'success':
        icon = Icons.check_circle_rounded;
        color = AppTheme.successEmerald;
        break;
      case 'error':
        icon = Icons.error_rounded;
        color = AppTheme.errorRed;
        break;
      case 'warning':
        icon = Icons.warning_rounded;
        color = AppTheme.pendingAmber;
        break;
      default:
        icon = Icons.info_rounded;
        color = const Color(0xFF6B21A8);
    }

    return Container(
      width: 48, height: 48,
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(16)),
      child: Icon(icon, color: color, size: 20),
    );
  }
}
