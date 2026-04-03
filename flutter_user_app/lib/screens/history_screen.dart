import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../providers/wallet_provider.dart';
import '../utils/app_theme.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Transaction History', style: TextStyle(color: AppTheme.darkSlate, fontWeight: FontWeight.w700, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.darkSlate, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<WalletProvider>(
        builder: (context, wallet, _) {
          if (wallet.transactions.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(FontAwesomeIcons.clockRotateLeft, size: 64, color: Colors.grey.shade200),
                  const SizedBox(height: 24),
                  Text('No history found.', style: TextStyle(color: Colors.grey.shade400, fontWeight: FontWeight.w600)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: wallet.fetchData,
            color: AppTheme.primaryPurple,
            child: ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: wallet.transactions.length,
              itemBuilder: (context, index) {
                final tx = wallet.transactions[index];
                final isDeposit = tx.type == 'deposit';
                
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
                    children: [
                      Container(
                        width: 52, height: 52,
                        decoration: BoxDecoration(
                          color: isDeposit ? AppTheme.successEmerald.withOpacity(0.08) : AppTheme.errorRed.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Icon(
                          isDeposit ? Icons.south_west_rounded : Icons.north_east_rounded,
                          color: isDeposit ? AppTheme.successEmerald : AppTheme.errorRed,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isDeposit ? 'Money Received' : 'Money Sent',
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppTheme.darkSlate),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              DateFormat('EEE, MMM dd • hh:mm a').format(tx.createdAt.toLocal()),
                              style: TextStyle(color: Colors.grey.shade400, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '${isDeposit ? '+' : '-'}${NumberFormat.simpleCurrency(name: 'INR').format(tx.amount)}',
                            style: TextStyle(
                              fontWeight: FontWeight.w900, fontSize: 16,
                              color: isDeposit ? AppTheme.successEmerald : AppTheme.errorRed,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          _StatusChip(status: tx.status),
                        ],
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

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status) {
      case 'approved': color = AppTheme.successEmerald; break;
      case 'rejected': color = AppTheme.errorRed; break;
      default: color = AppTheme.pendingAmber;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 8, fontWeight: FontWeight.w900),
      ),
    );
  }
}
