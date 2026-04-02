import 'package:flutter/foundation.dart';

class ApiService {
  // Use environment define for production, fallback to localhost for development
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: kIsWeb 
      ? 'https://mlxdirect.com/api' 
      : 'http://10.0.2.2:5000/api', // Android Emulator
  );
  
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await getHeaders();
    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  static Future<http.Response> get(String endpoint) async {
    final headers = await getHeaders();
    return await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
  }
}
