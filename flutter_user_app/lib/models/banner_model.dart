class BannerModel {
  final String id;
  final String title;
  final String imageUrl;
  final String link;

  BannerModel({
    required this.id,
    required this.title,
    required this.imageUrl,
    this.link = '',
  });

  factory BannerModel.fromJson(Map<String, dynamic> json) {
    return BannerModel(
      id: json['_id'],
      title: json['title'],
      imageUrl: json['imageUrl'],
      link: json['link'] ?? '',
    );
  }
}
