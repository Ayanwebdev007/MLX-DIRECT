import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../providers/wallet_provider.dart';
import '../utils/app_theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  void _register() async {
    final success = await Provider.of<WalletProvider>(context, listen: false).register(
      _nameController.text,
      _emailController.text,
      _phoneController.text,
      _passwordController.text,
    );
    if (success) {
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/dashboard');
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registration failed. Try a different email.'),
          backgroundColor: AppTheme.errorRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Account'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              // Header
              Text(
                'Create Your Profile',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppTheme.darkSlate),
              ),
              const SizedBox(height: 8),
              Text(
                'Join the BOA PAY elite ecosystem',
                style: TextStyle(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 40),
              // Fields
              Text(
                'Full Name',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  hintText: 'John Doe',
                  prefixIcon: Icon(Icons.person_outline, size: 20),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Email Address',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  hintText: 'name@example.com',
                  prefixIcon: Icon(Icons.email_outlined, size: 20),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 24),
              Text(
                'Mobile Number',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  hintText: '9876543210',
                  prefixIcon: Icon(Icons.phone_android_outlined, size: 20),
                ),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 24),
              Text(
                'Password',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  hintText: '••••••••',
                  prefixIcon: const Icon(Icons.lock_outline, size: 20),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              // Register Button
              Consumer<WalletProvider>(
                builder: (context, wallet, _) => wallet.isLoading
                    ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryBlue))
                    : ElevatedButton(
                        onPressed: _register,
                        child: const Text('Initialize Account'),
                      ),
              ),
              const SizedBox(height: 24),
              // Footer
              Center(
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: RichText(
                    text: TextSpan(
                      text: "Already a member? ",
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
                      children: const [
                        TextSpan(
                          text: 'Sign In',
                          style: TextStyle(color: AppTheme.primaryBlue, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              // Copyright Footer
              const Center(
                child: Text(
                  '© 2026 Bank of America Pay',
                  style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
