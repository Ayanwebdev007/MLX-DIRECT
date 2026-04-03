import 'package:flutter/material.dart';
import '../utils/app_theme.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('About Us', style: TextStyle(color: AppTheme.darkSlate, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.darkSlate, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Hero(
                tag: 'logo',
                child: Center(
                  child: Icon(Icons.shield_rounded, size: 80, color: AppTheme.primaryPurple),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'About BOA PAY Wallet',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.darkSlate),
              ),
              const SizedBox(height: 16),
              Text(
                'BOA PAY Wallet is a cutting-edge financial platform designed to provide a secure and seamless payment experience. Our mission is to simplify transactions for everyone, from bill payments to global transfers.',
                style: TextStyle(fontSize: 16, height: 1.6, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 24),
              const Text(
                'Our Vision',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.darkSlate),
              ),
              const SizedBox(height: 12),
              Text(
                'To be the most trusted and widely used digital wallet, fostering financial inclusion through innovative technology and exceptional user service.',
                style: TextStyle(fontSize: 16, height: 1.6, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 24),
              const Text(
                'Key Features',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.darkSlate),
              ),
              const SizedBox(height: 12),
              _buildFeatureItem('Safe & Secure', 'State-of-the-art encryption protecting your data.'),
              _buildFeatureItem('Instant Transfers', 'Send and receive money in seconds, not minutes.'),
              _buildFeatureItem('24/7 Support', 'Our support team is always available to help you.'),
              const SizedBox(height: 48),
              const Center(
                child: Text(
                  'Version 4.0.0 (MLX DIRECT Global)',
                  style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_rounded, color: AppTheme.primaryPurple, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(desc, style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
