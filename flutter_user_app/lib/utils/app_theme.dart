import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Colors
  static const Color primaryBlue = Color(0xFF003B91);
  static const Color primaryRed = Color(0xFFCE2029);
  static const Color darkSlate = Color(0xFF0A0A0A);
  static const Color backgroundGray = Color(0xFFF8FAFC);
  static const Color surfaceWhite = Colors.white;
  
  // Secondary Colors
  static const Color errorRed = Color(0xFFE11D48);
  static const Color pendingAmber = Color(0xFFD97706);
  static const Color successEmerald = Color(0xFF10B981);
  
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryBlue,
        primary: primaryBlue,
        secondary: primaryRed,
        surface: backgroundGray,
        error: errorRed,
      ),
      scaffoldBackgroundColor: backgroundGray,
      textTheme: GoogleFonts.outfitTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: surfaceWhite,
        foregroundColor: darkSlate,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.outfit(
          color: darkSlate,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
          elevation: 0,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceWhite,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primaryBlue, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: errorRed),
        ),
        labelStyle: GoogleFonts.outfit(color: Colors.grey.shade600),
        hintStyle: GoogleFonts.outfit(color: Colors.grey.shade400, fontSize: 14),
      ),
    );
  }
}
