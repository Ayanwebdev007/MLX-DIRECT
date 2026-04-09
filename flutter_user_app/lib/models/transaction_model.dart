class TransactionModel {
  final String id;
  final double amount;
  final String type;
  final String status;
  final DateTime createdAt;
  final String? description;

  final String? payoutId;
  final String? payoutStatus;

  TransactionModel({
    required this.id,
    required this.amount,
    required this.type,
    required this.status,
    required this.createdAt,
    this.description,
    this.payoutId,
    this.payoutStatus,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['_id'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      type: json['type'] ?? '',
      status: json['status'] ?? 'pending',
      createdAt: DateTime.parse(json['createdAt']),
      description: json['description'],
      payoutId: json['payoutId'],
      payoutStatus: json['payoutStatus'],
    );
  }
}
