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
          backgroundColor: AppTheme.primaryPurple,
          behavior: SnackBarBehavior.floating,
        ),
      );
    });
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature feature coming soon!'),
        backgroundColor: AppTheme.primaryPurple,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _requestWithdrawal() async {
    final amountText = _amountController.text;
    final amount = double.tryParse(amountText) ?? 0;
    if (amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount'), backgroundColor: AppTheme.errorRed),
      );
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error), backgroundColor: AppTheme.errorRed, behavior: SnackBarBehavior.floating),
      );
    }
  }

  void _showWithdrawModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(40)),
        ),
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 40,
          top: 40,
          left: 24,
          right: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Request Payout',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.darkSlate, letterSpacing: -0.5),
            ),
            const SizedBox(height: 8),
            Text(
              'Funds will be processed to your linked account.',
              style: TextStyle(fontSize: 14, color: Colors.grey.shade500, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(
                hintText: '0.00',
                prefixIcon: Icon(FontAwesomeIcons.indianRupeeSign, size: 16),
                labelText: 'Amount to Withdraw',
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              autofocus: true,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _requestWithdrawal,
              style: ElevatedButton.styleFrom(
                shadowColor: AppTheme.primaryPurple.withOpacity(0.4),
                elevation: 10,
              ),
              child: const Text('Confirm Request'),
            ),
          ],
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
            color: AppTheme.primaryPurple,
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
                    child: CircleAvatar(
                      backgroundColor: Colors.pink.shade50,
                      child: Text(user.name.substring(0, 2).toUpperCase(), style: const TextStyle(color: Colors.pink, fontWeight: FontWeight.bold, fontSize: 13)),
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
                        padding: const EdgeInsets.symmetric(horizontal: 40),
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
                        padding: const EdgeInsets.symmetric(horizontal: 40),
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

                      const SizedBox(height: 40),
                      
                      _SupportTile(
                        icon: FontAwesomeIcons.circleQuestion, 
                        title: 'Help and Support', 
                        subtitle: 'Contact us if you have any queries',
                        onTap: () => Navigator.pushNamed(context, '/help'),
                      ),
                      _SupportTile(
                        icon: FontAwesomeIcons.circleExclamation, 
                        title: 'About Us', 
                        subtitle: 'Learn more about BOA PAY',
                        onTap: () => Navigator.pushNamed(context, '/about'),
                      ),
                      
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ],
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
    return Padding(
      padding: const EdgeInsets.all(20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Container(
          width: double.infinity,
          height: 140,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF6B21A8), Color(0xFFC026D3)],
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
                      child: const Text('INVEST NOW', style: TextStyle(color: Color(0xFF6B21A8), fontWeight: FontWeight.bold, fontSize: 10)),
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
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(4),
        child: Column(
          children: [
            Container(
              width: 68, height: 68,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 8)),
                ],
              ),
              child: Center(
                child: Icon(icon, color: AppTheme.primaryPurple, size: 24),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label, 
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF1E293B), letterSpacing: -0.2),
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
              decoration: BoxDecoration(color: const Color(0xFF6B21A8).withOpacity(0.05), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: const Color(0xFF6B21A8), size: 18),
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
