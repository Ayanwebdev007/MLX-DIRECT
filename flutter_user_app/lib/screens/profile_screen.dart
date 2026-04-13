import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/wallet_provider.dart';
import '../utils/app_theme.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _panController = TextEditingController();
  final _aadharController = TextEditingController();
  
  final _accNameController = TextEditingController();
  final _accNumberController = TextEditingController();
  final _ifscController = TextEditingController();
  final _bankNameController = TextEditingController();

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<WalletProvider>(context, listen: false).user;
    if (user != null) {
      _panController.text = user.kyc['pan'] ?? '';
      _aadharController.text = user.kyc['aadhar'] ?? '';
      _accNameController.text = user.bankDetails['accountHolderName'] ?? '';
      _accNumberController.text = user.bankDetails['accountNumber'] ?? '';
      _ifscController.text = user.bankDetails['ifscCode'] ?? '';
      _bankNameController.text = user.bankDetails['bankName'] ?? '';
    }
  }

  Future<void> _updateKYC() async {
    if (_panController.text.length < 10 || _aadharController.text.length < 12) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid document details')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final error = await Provider.of<WalletProvider>(context, listen: false).updateKYC(
      _panController.text,
      _aadharController.text,
    );
    setState(() => _isLoading = false);

    if (error == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Identity documents submitted for verification'), backgroundColor: AppTheme.successEmerald),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error), backgroundColor: AppTheme.errorRed),
      );
    }
  }

  Future<void> _updateBank() async {
    if (_accNumberController.text.isEmpty || _ifscController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid bank details')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final error = await Provider.of<WalletProvider>(context, listen: false).updateBankDetails(
      _accNameController.text,
      _accNumberController.text,
      _ifscController.text,
      _bankNameController.text,
    );
    setState(() => _isLoading = false);

    if (error == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bank verification request successful'), backgroundColor: AppTheme.successEmerald),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error), backgroundColor: AppTheme.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<WalletProvider>(context).user;
    if (user == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final kycStatus = user.kyc['status'] ?? 'none';
    final bankStatus = user.bankDetails['status'] ?? 'none';
    final bankVerified = user.bankDetails['verified'] ?? false;
    final hasBankDetails = user.bankDetails['accountNumber'] != null && user.bankDetails['accountNumber'].toString().isNotEmpty;
    
    // Logic to lock fields
    final bool kycLocked = kycStatus == 'approved' || kycStatus == 'pending';
    final bool bankPending = bankStatus == 'pending';
    final bool bankLocked = bankVerified || bankStatus == 'pending' || bankStatus == 'approved';

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), // Slate 100
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Customer Verification', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Top Section with Gradient
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 100, bottom: 40, left: 30, right: 30),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppTheme.primaryBlue, Color(0xFF002255)], // Brand Blue to Deep Blue
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(bottomLeft: Radius.circular(50)),
              ),
              child: Column(
                children: [
                   Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white24, width: 2),
                    ),
                    child: CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white.withOpacity(0.1),
                      child: Text(user.name[0].toUpperCase(), 
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(user.name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: -0.5)),
                  const SizedBox(height: 4),
                  Text(user.email.toLowerCase(), style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13, fontWeight: FontWeight.w600)),
                  if (user.phone.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text(user.phone, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1)),
                    ),
                  const SizedBox(height: 30),
                  
                  // Verification Progress Stepper
                  Row(
                    children: [
                      _buildStepIndicator('Identity', kycStatus == 'approved', kycStatus == 'pending'),
                      Expanded(child: Container(height: 2, color: Colors.white10)),
                      _buildStepIndicator('Bank', bankVerified, bankPending),
                      Expanded(child: Container(height: 2, color: Colors.white10)),
                      _buildStepIndicator('Active', kycStatus == 'approved' && bankVerified, false),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // KYC CARD
                  _buildSectionLabel('SECURE IDENTITY', FaIcon(FontAwesomeIcons.shieldHalved, size: 14, color: AppTheme.primaryBlue)),
                  _buildPremiumCard(
                    status: kycStatus,
                    locked: kycLocked,
                    child: Column(
                      children: [
                        _buildStyledInput(_panController, 'PAN Number', kycLocked, textCapitalization: TextCapitalization.characters),
                        const SizedBox(height: 20),
                        _buildStyledInput(_aadharController, 'Aadhar Number', kycLocked, isNumeric: true),
                        const SizedBox(height: 24),
                        if (!kycLocked)
                          _buildSubmitButton('Submit KYC Documents', _updateKYC)
                        else
                          _buildLockedBadge(kycStatus == 'approved' ? 'Identity Verified' : 'Awaiting Approval'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // BANK CARD
                  _buildSectionLabel('SECURE BANK PORT', const FaIcon(FontAwesomeIcons.buildingColumns, size: 14, color: Colors.indigo)),
                  _buildPremiumCard(
                    status: bankStatus,
                    isVerified: bankVerified,
                    locked: bankLocked,
                    child: Column(
                      children: [
                        _buildStyledInput(_accNameController, 'Account Holder Name', bankLocked),
                        const SizedBox(height: 16),
                        _buildStyledInput(_accNumberController, 'Bank Account Number', bankLocked, isNumeric: true),
                        const SizedBox(height: 16),
                        _buildStyledInput(_ifscController, 'IFSC Code', bankLocked),
                        const SizedBox(height: 16),
                        _buildStyledInput(_bankNameController, 'Financial Institution', bankLocked),
                        const SizedBox(height: 24),
                        if (!bankLocked)
                          _buildSubmitButton('Secure Bank Account', _updateBank, isIndigo: true)
                        else
                          _buildLockedBadge(bankVerified ? 'Verified Bank Channel' : 'Awaiting Approval', isSuccess: bankVerified),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator(String label, bool isDone, bool isPending) {
    Color color = Colors.white24;
    Widget icon = Text(label[0], style: const TextStyle(color: Colors.white24, fontWeight: FontWeight.bold, fontSize: 10));

    if (isDone) {
      color = AppTheme.successEmerald;
      icon = const Icon(Icons.check, color: Colors.white, size: 12);
    } else if (isPending) {
      color = Colors.orange;
      icon = const SizedBox(width: 10, height: 10, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white));
    }

    return Column(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 2),
          ),
          child: Center(child: icon),
        ),
        const SizedBox(height: 8),
        Text(label.toUpperCase(), style: TextStyle(color: isDone ? Colors.white : Colors.white38, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
      ],
    );
  }

  Widget _buildSectionLabel(String label, Widget icon) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 12),
      child: Row(
        children: [
          icon,
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.blueGrey, letterSpacing: 1.5)),
        ],
      ),
    );
  }

  Widget _buildPremiumCard({required Widget child, String status = 'none', bool isVerified = false, bool locked = false}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10)),
        ],
        border: locked ? Border.all(color: (isVerified || status == 'approved') ? AppTheme.successEmerald.withOpacity(0.2) : Colors.orange.withOpacity(0.2), width: 1) : null,
      ),
      child: child,
    );
  }

  Widget _buildStyledInput(TextEditingController controller, String label, bool locked, {bool isNumeric = false, TextCapitalization textCapitalization = TextCapitalization.none}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.grey.shade400, letterSpacing: 1)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          enabled: !locked,
          textCapitalization: textCapitalization,
          keyboardType: isNumeric ? TextInputType.number : TextInputType.text,
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: locked ? Colors.black54 : Colors.black87),
          decoration: InputDecoration(
            filled: true,
            fillColor: locked ? Colors.grey.shade50 : Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
            enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFE2E8F0))),
            disabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.transparent)),
            focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: AppTheme.primaryBlue, width: 2)),
          ),
        ),
      ],
    );
  }

  Widget _buildSubmitButton(String label, VoidCallback onPressed, {bool isIndigo = false}) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isIndigo ? const Color(0xFF4338CA) : AppTheme.primaryBlue,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
        child: _isLoading 
          ? const CircularProgressIndicator(color: Colors.white) 
          : Text(label.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1, fontSize: 13)),
      ),
    );
  }

  Widget _buildLockedBadge(String label, {bool isSuccess = false}) {
    final color = isSuccess ? AppTheme.successEmerald : Colors.orange;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(isSuccess ? Icons.verified_user_rounded : Icons.pending_actions_rounded, color: color, size: 18),
          const SizedBox(width: 10),
          Text(label.toUpperCase(), style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 1)),
        ],
      ),
    );
  }
}
