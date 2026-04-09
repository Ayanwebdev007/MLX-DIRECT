import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../models/transaction_model.dart';
import '../models/banner_model.dart';
import '../services/api_service.dart';

class WalletProvider with ChangeNotifier {
  UserModel? _user;
  List<TransactionModel> _transactions = [];
  List<BannerModel> _banners = [];
  bool _isLoading = false;

  UserModel? get user => _user;
  List<TransactionModel> get transactions => _transactions;
  List<BannerModel> get banners => _banners;
  bool get isLoading => _isLoading;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await ApiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('user', jsonEncode(data['user']));
        _user = UserModel.fromJson(data['user']);
        await fetchData();
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Login error: $e');
    }
    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await ApiService.post('/auth/register', {
        'name': name,
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('user', jsonEncode(data['user']));
        _user = UserModel.fromJson(data['user']);
        await fetchData();
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Register error: $e');
    }
    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> fetchData() async {
    try {
      // 1. Fetch Full User Profile (includes Balance, KYC, Bank)
      final userRes = await ApiService.get('/auth/me');
      if (userRes.statusCode == 200) {
        final data = jsonDecode(userRes.body);
        _user = UserModel.fromJson(data);
      }

      // 2. Fetch Transactions
      final transRes = await ApiService.get('/wallet/transactions');
      if (transRes.statusCode == 200) {
        final List data = jsonDecode(transRes.body);
        _transactions = data.map((t) => TransactionModel.fromJson(t)).toList();
      }

      // 3. Fetch Banners
      final bannerRes = await ApiService.get('/banners');
      if (bannerRes.statusCode == 200) {
        final List data = jsonDecode(bannerRes.body);
        _banners = data.map((b) => BannerModel.fromJson(b)).toList();
      }

      notifyListeners();
    } catch (e) {
      print('Fetch data error: $e');
    }
  }

  Future<String?> updateKYC(String pan, String aadhar) async {
    try {
      final response = await ApiService.post('/auth/update-kyc', {
        'pan': pan,
        'aadhar': aadhar,
      });

      if (response.statusCode == 200) {
        await fetchData();
        return null; // Success
      } else {
        final data = jsonDecode(response.body);
        return data['message'] ?? 'KYC update failed';
      }
    } catch (e) {
      print('Update KYC error: $e');
      return 'Connection error';
    }
  }

  Future<String?> updateBankDetails(String accName, String accNum, String ifsc, String bank) async {
    try {
      final response = await ApiService.post('/auth/update-bank', {
        'accountHolderName': accName,
        'accountNumber': accNum,
        'ifscCode': ifsc,
        'bankName': bank,
      });

      if (response.statusCode == 200) {
        await fetchData();
        return null; // Success
      } else {
        final data = jsonDecode(response.body);
        return data['message'] ?? 'Bank verification failed';
      }
    } catch (e) {
      print('Update Bank error: $e');
      return 'Connection error';
    }
  }

  Future<String?> updatePassword(String oldPass, String newPass) async {
    try {
      final response = await ApiService.post('/auth/update-password', {
        'oldPassword': oldPass,
        'newPassword': newPass,
      });

      if (response.statusCode == 200) {
        return null; // Success
      } else {
        final data = jsonDecode(response.body);
        return data['message'] ?? 'Password update failed';
      }
    } catch (e) {
      print('Update Password error: $e');
      return 'Connection error';
    }
  }

  Future<String?> requestWithdrawal(double amount) async {
    try {
      final response = await ApiService.post('/wallet/withdraw-request', {'amount': amount});
      if (response.statusCode == 201) {
        await fetchData();
        return null; // No error
      } else {
        final data = jsonDecode(response.body);
        return data['message'] ?? 'Withdrawal request failed';
      }
    } catch (e) {
      print('Withdraw error: $e');
      return 'Connection error. Please try again.';
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _user = null;
    _transactions = [];
    _banners = [];
    notifyListeners();
  }

  Future<void> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey('token')) return;
    final userData = prefs.getString('user');
    if (userData != null) {
      _user = UserModel.fromJson(jsonDecode(userData));
      await fetchData();
    }
  }
}
