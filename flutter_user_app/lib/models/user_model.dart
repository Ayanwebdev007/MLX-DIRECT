class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final double walletBalance;
  final double withdrawLimit;

  final Map<String, dynamic> kyc;
  final Map<String, dynamic> bankDetails;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.walletBalance,
    required this.withdrawLimit,
    this.kyc = const {},
    this.bankDetails = const {},
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'user',
      walletBalance: (json['walletBalance'] ?? 0).toDouble(),
      withdrawLimit: (json['withdrawLimit'] ?? 0).toDouble(),
      kyc: json['kyc'] ?? {},
      bankDetails: json['bankDetails'] ?? {},
    );
  }
}
