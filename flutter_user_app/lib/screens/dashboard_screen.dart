import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:intl/intl.dart';
import 'package:carousel_slider/carousel_slider.dart';
import '../providers/wallet_provider.dart';
import '../services/firebase_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../utils/app_theme.dart';
import '../providers/notification_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _amountController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _setupFirebase();
    // Fetch initial notifications so the badge appears immediately if there are unread messages
    Future.microtask(() {
      Provider.of<NotificationProvider>(context, listen: false).fetchNotifications();
    });
  }

  void _setupFirebase() async {
    await FirebaseService.initialize();
    FirebaseService.listenToMessages((RemoteMessage message) {
      // Refresh notifications to update the red dot badge instantly
      Provider.of<NotificationProvider>(context, listen: false).fetchNotifications();
      
      // Also show a snackbar for immediate feedback
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message.notification?.title ?? "New Notification Received"),
          backgroundColor: AppTheme.primaryBlue,
          behavior: SnackBarBehavior.floating,
        ),
      );
    });
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature feature coming soon!'),
        backgroundColor: AppTheme.primaryBlue,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _requestWithdrawal({Function(String?)? onError}) async {
    final amountText = _amountController.text;
    final amount = double.tryParse(amountText) ?? 0;
    
    if (amount <= 0) {
      if (onError != null) {
        onError('Please enter a valid amount');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter a valid amount'), backgroundColor: AppTheme.errorRed),
        );
      }
      return;
    }

    final error = await Provider.of<WalletProvider>(context, listen: false).requestWithdrawal(amount);
    if (!mounted) return;
    
    if (error == null) {
      _amountController.clear();
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Withdrawal request submitted!'), backgroundColor: AppTheme.successEmerald, behavior: SnackBarBehavior.floating),
      );
    } else {
      if (onError != null) {
        onError(error);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error), backgroundColor: AppTheme.errorRed, behavior: SnackBarBehavior.floating),
        );
      }
    }
  }

  void _showWithdrawModal() {
    String? modalError;
    final user = Provider.of<WalletProvider>(context, listen: false).user;
    
    // Safety check: User must have verified bank details
    if (user?.bankDetails['verified'] != true) {
      modalError = 'Please verify your bank details in Profile first.';
    }
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(40)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 40,
            top: 24,
            left: 24,
            right: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Secure Payout',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.darkSlate, letterSpacing: -0.8),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close_rounded, color: Colors.grey),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (modalError != null)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 24),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.errorRed.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.errorRed.withOpacity(0.1)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline_rounded, color: AppTheme.errorRed, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          modalError!,
                          style: const TextStyle(color: AppTheme.errorRed, fontSize: 13, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                )
              else
                 Row(
                   children: [
                     const Icon(Icons.verified_user_rounded, color: AppTheme.successEmerald, size: 14),
                     const SizedBox(width: 8),
                     Text(
                      'Disbursement to verified channel active',
                      style: TextStyle(fontSize: 12, color: AppTheme.successEmerald, fontWeight: FontWeight.w900, letterSpacing: 0.2),
                    ),
                   ],
                 ),
              const SizedBox(height: 32),
              
              // Amount Input with modern style
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('REQUEST AMOUNT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey.shade400, letterSpacing: 1.5)),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _amountController,
                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, letterSpacing: -1),
                      onChanged: (_) {
                        if (modalError != null) setModalState(() => modalError = null);
                      },
                      decoration: const InputDecoration(
                        hintText: '0.00',
                        prefixIcon: Icon(FontAwesomeIcons.indianRupeeSign, size: 24, color: Colors.black),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        contentPadding: EdgeInsets.zero,
                      ),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      autofocus: true,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              // Limit Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Available Limit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text(
                    NumberFormat.simpleCurrency(name: 'INR').format(user?.withdrawLimit ?? 0),
                    style: const TextStyle(color: AppTheme.primaryBlue, fontWeight: FontWeight.w900, fontSize: 14),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              
              SizedBox(
                width: double.infinity,
                height: 64,
                child: ElevatedButton(
                  onPressed: () => _requestWithdrawal(
                    onError: (error) => setModalState(() => modalError = error),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryBlue,
                    shadowColor: AppTheme.primaryBlue.withOpacity(0.4),
                    elevation: 12,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('INITIATE WITHDRAWAL', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Consumer<WalletProvider>(
        builder: (context, wallet, _) {
          final user = wallet.user;
          if (user == null) return const Center(child: CircularProgressIndicator());

          return RefreshIndicator(
            onRefresh: wallet.fetchData,
            color: AppTheme.primaryBlue,
            child: SafeArea(
              bottom: false,
              child: CustomScrollView(
                slivers: [
                SliverAppBar(
                  expandedHeight: 80.0,
                  floating: true,
                  pinned: true,
                  backgroundColor: Colors.white,
                  elevation: 0,
                  leading: Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: InkWell(
                      onTap: () => Navigator.pushNamed(context, '/profile'),
                      borderRadius: BorderRadius.circular(20),
                      child: CircleAvatar(
                        backgroundColor: Colors.pink.shade50,
                        child: Text(user.name.substring(0, 1).toUpperCase(), 
                          style: const TextStyle(color: Colors.pink, fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ),
                  ),
                  title: Text(
                    'BOA PAY',
                    style: TextStyle(color: AppTheme.darkSlate, fontWeight: FontWeight.w600, fontSize: 17),
                  ),
                  actions: [
                    IconButton(
                      icon: Consumer<NotificationProvider>(
                        builder: (context, notificationProvider, _) => Stack(
                          clipBehavior: Clip.none,
                          children: [
                            const Icon(Icons.notifications_none_rounded, color: AppTheme.darkSlate),
                            if (notificationProvider.unreadCount > 0)
                              Positioned(
                                right: -4, top: -4,
                                child: Container(
                                  padding: const EdgeInsets.all(2),
                                  constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                                  decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                                  alignment: Alignment.center,
                                  child: Text(
                                    '${notificationProvider.unreadCount}',
                                    style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                      onPressed: () => Navigator.pushNamed(context, '/notifications'),
                    ),
                    IconButton(
                      icon: const Icon(Icons.logout_rounded, color: AppTheme.darkSlate),
                      onPressed: () {
                        Provider.of<WalletProvider>(context, listen: false).logout();
                        Navigator.pushReplacementNamed(context, '/login');
                      },
                    ),
                    const SizedBox(width: 8),
                  ],
                ),

                SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (wallet.banners.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          child: CarouselSlider(
                            options: CarouselOptions(
                              height: 180.0,
                              autoPlay: true,
                              enlargeCenterPage: true,
                              viewportFraction: 0.92,
                              autoPlayCurve: Curves.fastOutSlowIn,
                              enableInfiniteScroll: true,
                              autoPlayAnimationDuration: const Duration(milliseconds: 800),
                            ),
                            items: wallet.banners.map((banner) {
                              return Builder(
                                builder: (BuildContext context) {
                                  return Container(
                                    width: MediaQuery.of(context).size.width,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(24),
                                      image: DecorationImage(
                                        image: NetworkImage(banner.imageUrl),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(24),
                                        gradient: LinearGradient(
                                          begin: Alignment.bottomCenter, end: Alignment.topCenter,
                                          colors: [Colors.black.withOpacity(0.5), Colors.transparent],
                                        ),
                                      ),
                                      padding: const EdgeInsets.all(20),
                                      alignment: Alignment.bottomLeft,
                                      child: Text(
                                        banner.title,
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                    ),
                                  );
                                },
                              );
                            }).toList(),
                          ),
                        ),

                      Container(
                        width: double.infinity,
                        margin: const EdgeInsets.symmetric(horizontal: 20),
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 20, offset: const Offset(0, 10)),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text('My Wallet', style: TextStyle(color: Colors.grey.shade600, fontSize: 14, fontWeight: FontWeight.w600)),
                                const SizedBox(width: 6),
                                Icon(Icons.info_outline_rounded, size: 14, color: Colors.grey.shade400),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              '${NumberFormat.simpleCurrency(name: 'INR').format(user.walletBalance)}',
                              style: const TextStyle(color: AppTheme.darkSlate, fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5),
                            ),
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _FeatureIcon(icon: FontAwesomeIcons.wallet, label: 'Add Money', onTap: () => _showComingSoon('Add Money')),
                                _FeatureIcon(icon: FontAwesomeIcons.paperPlane, label: 'Transfer', onTap: () => _showComingSoon('Transfer')),
                                _FeatureIcon(icon: FontAwesomeIcons.moneyBillTransfer, label: 'Withdraw', onTap: _showWithdrawModal),
                                _FeatureIcon(icon: FontAwesomeIcons.clockRotateLeft, label: 'History', onTap: () => Navigator.pushNamed(context, '/history')),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const _AnimatedGlowBanner(),

                      _SectionHeader(title: 'Recharge & Bill Payment'),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _FeatureIcon(icon: FontAwesomeIcons.mobileScreenButton, label: 'Mobile', onTap: () => _showComingSoon('Mobile Recharge')),
                            _FeatureIcon(icon: FontAwesomeIcons.satelliteDish, label: 'DTH', onTap: () => _showComingSoon('DTH')),
                            _FeatureIcon(icon: FontAwesomeIcons.lightbulb, label: 'Electricity', onTap: () => _showComingSoon('Electricity')),
                            _FeatureIcon(icon: FontAwesomeIcons.fireBurner, label: 'Cylinder', onTap: () => _showComingSoon('Cylinder Booking')),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      _SectionHeader(title: 'Ticket Booking'),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _FeatureIcon(icon: FontAwesomeIcons.plane, label: 'Flight', onTap: () => _showComingSoon('Flight Ticket')),
                            _FeatureIcon(icon: FontAwesomeIcons.train, label: 'Train', onTap: () => _showComingSoon('Train Ticket')),
                            _FeatureIcon(icon: FontAwesomeIcons.bus, label: 'Bus', onTap: () => _showComingSoon('Bus Ticket')),
                            _FeatureIcon(icon: FontAwesomeIcons.hotel, label: 'Hotel', onTap: () => _showComingSoon('Hotel Booking')),
                          ],
                        ),
                      ),

                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    ),
  );
}
}

class _AnimatedGlowBanner extends StatefulWidget {
  const _AnimatedGlowBanner({Key? key}) : super(key: key);

  @override
  State<_AnimatedGlowBanner> createState() => _AnimatedGlowBannerState();
}

class _AnimatedGlowBannerState extends State<_AnimatedGlowBanner> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    // Total duration is 3 seconds. The animation uses a small window of this time to sweep across, giving the requested ~2-second delay.
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );
    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final bannerHeight = (screenWidth * 0.32).clamp(110.0, 150.0);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Container(
          width: double.infinity,
          height: bannerHeight,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [AppTheme.primaryBlue, AppTheme.primaryRed],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -20, bottom: -20,
                child: Icon(FontAwesomeIcons.coins, size: 100, color: Colors.white.withOpacity(0.1)),
              ),
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Invest in 24K Gold', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 8),
                    const Text('Turn your savings into real assets.', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                      child: const Text('INVEST NOW', style: TextStyle(color: AppTheme.primaryBlue, fontWeight: FontWeight.bold, fontSize: 10)),
                    ),
                  ],
                ),
              ),
              AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  // -1.5 is far left, 1.5 is far right, scaling to 5 to wait for the rest of the duration
                  final xPos = -1.5 + (_controller.value * 6.5);
                  return Positioned.fill(
                    child: FractionalTranslation(
                      translation: Offset(xPos, 0),
                      child: Transform(
                        transform: Matrix4.skewX(-0.3),
                        alignment: Alignment.center,
                        child: FractionallySizedBox(
                          widthFactor: 0.4, // Glow width relative to parent
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white.withOpacity(0.0),
                                  Colors.white.withOpacity(0.4),
                                  Colors.white.withOpacity(0.0),
                                ],
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                                stops: const [0.0, 0.5, 1.0],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(28, 0, 28, 20),
      child: Text(
        title,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.darkSlate, letterSpacing: -0.2),
      ),
    );
  }
}

class _FeatureIcon extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _FeatureIcon({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final iconAreaSize = (screenWidth * 0.17).clamp(56.0, 68.0);
    final iconFontSize = (screenWidth * 0.03).clamp(10.0, 12.0);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(4),
        child: Column(
          children: [
            Container(
              width: iconAreaSize, height: iconAreaSize,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 8)),
                ],
              ),
              child: Center(
                child: Icon(icon, color: AppTheme.primaryBlue, size: (iconAreaSize * 0.35)),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label, 
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: iconFontSize, fontWeight: FontWeight.w800, color: const Color(0xFF1E293B), letterSpacing: -0.2),
            ),
          ],
        ),
      ),
    );
  }
}

class _SupportTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SupportTile({required this.icon, required this.title, required this.subtitle, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(color: AppTheme.primaryBlue.withOpacity(0.05), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: AppTheme.primaryBlue, size: 18),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: Colors.grey.shade300),
          ],
        ),
      ),
    );
  }
}
