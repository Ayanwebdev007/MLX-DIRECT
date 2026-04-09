import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher_string.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Help & Support', style: TextStyle(color: AppTheme.darkSlate, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.darkSlate, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(FontAwesomeIcons.headset, size: 40, color: AppTheme.primaryBlue),
              ),
              const SizedBox(height: 24),
              const Text(
                'Need Assistance?',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.darkSlate),
              ),
              const SizedBox(height: 12),
              Text(
                'Our team is here to help you with any issues or queries.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: () async {
                  final telUrl = 'tel:+918388021807';
                  const number = '+91 83880 21807';
                  
                  try {
                    // Try to launch the dialer
                    await launchUrlString(telUrl);
                  } catch (e) {
                    debugPrint('Error launching dialer: $e');
                  }

                  // Always show SnackBar on web or if launch fails as a backup
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Support Number: ' + number),
                        backgroundColor: AppTheme.primaryBlue,
                        duration: Duration(seconds: 4),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                icon: const Icon(Icons.support_agent_rounded, size: 20),
                label: const Text('Contact Admin'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
