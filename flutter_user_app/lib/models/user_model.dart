class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final double walletBalance;
  final double withdrawLimit;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.walletBalance,
    required this.withdrawLimit,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      walletBalance: (json['walletBalance'] ?? 0).toDouble(),
      withdrawLimit: (json['withdrawLimit'] ?? 0).toDouble(),
    );
  }
}
