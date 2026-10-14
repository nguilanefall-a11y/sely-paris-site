/**
 * SELY Privé – Répertoire Universel des Langues Mondiales
 * Contient les 130+ langues du monde avec leurs drapeaux, noms natifs et codes ISO.
 */

export const POPULAR_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR', region: 'France & Europe' },
  { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN', region: 'International' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪', short: 'AR', region: 'Moyen-Orient & Golfe', dir: 'rtl' },
  { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES', region: 'Espagne & Amériques' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳', short: 'ZH', region: 'Asie' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', short: 'DE', region: 'Europe' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', short: 'IT', region: 'Europe' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', short: 'PT', region: 'Europe & Brésil' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', short: 'RU', region: 'Europe de l\'Est' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', short: 'JA', region: 'Asie' },
];

export const ALL_WORLD_LANGUAGES = [
  // Top VIP
  { code: 'fr', name: 'Français', englishName: 'French', flag: '🇫🇷' },
  { code: 'en', name: 'English', englishName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', flag: '🇦🇪', dir: 'rtl' },
  { code: 'es', name: 'Español', englishName: 'Spanish', flag: '🇪🇸' },
  { code: 'zh-CN', codeAlias: 'zh', name: '中文 (简体)', englishName: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文 (繁體)', englishName: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'de', name: 'Deutsch', englishName: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', englishName: 'Korean', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', flag: '🇸🇪' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', flag: '🇵🇱' },
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', flag: '🇮🇱', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', englishName: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', flag: '🇲🇾' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', englishName: 'Norwegian', flag: '🇳🇴' },
  { code: 'cs', name: 'Čeština', englishName: 'Czech', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', englishName: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', englishName: 'Hungarian', flag: '🇭🇺' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian', flag: '🇺🇦' },
  { code: 'sk', name: 'Slovenčina', englishName: 'Slovak', flag: '🇸🇰' },
  { code: 'bg', name: 'Български', englishName: 'Bulgarian', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', englishName: 'Croatian', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', englishName: 'Serbian', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', englishName: 'Slovenian', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', englishName: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', englishName: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', englishName: 'Lithuanian', flag: '🇱🇹' },
  { code: 'is', name: 'Íslenska', englishName: 'Icelandic', flag: '🇮🇸' },
  { code: 'ga', name: 'Gaeilge', englishName: 'Irish', flag: '🇮🇪' },
  { code: 'fa', name: 'فارسی', englishName: 'Persian', flag: '🇮🇷', dir: 'rtl' },
  { code: 'ur', name: 'اردو', englishName: 'Urdu', flag: '🇵🇰', dir: 'rtl' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', flag: '🇧🇩' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', flag: '🇮🇳' },
  { code: 'tl', name: 'Filipino', englishName: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', flag: '🇰🇪' },
  { code: 'af', name: 'Afrikaans', englishName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', flag: '🇦🇱' },
  { code: 'hy', name: 'Հայերեն', englishName: 'Armenian', flag: '🇦🇲' },
  { code: 'az', name: 'Azərbaycan', englishName: 'Azerbaijani', flag: '🇦🇿' },
  { code: 'eu', name: 'Euskara', englishName: 'Basque', flag: '🇪🇸' },
  { code: 'be', name: 'Беларуская', englishName: 'Belarusian', flag: '🇧🇾' },
  { code: 'bs', name: 'Bosanski', englishName: 'Bosnian', flag: '🇧🇦' },
  { code: 'ca', name: 'Català', englishName: 'Catalan', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', englishName: 'Galician', flag: '🇪🇸' },
  { code: 'ka', name: 'ქართული', englishName: 'Georgian', flag: '🇬🇪' },
  { code: 'kk', name: 'Қазақ', englishName: 'Kazakh', flag: '🇰🇿' },
  { code: 'km', name: 'ខ្មែរ', englishName: 'Khmer', flag: '🇰🇭' },
  { code: 'lo', name: 'ລາວ', englishName: 'Lao', flag: '🇱🇦' },
  { code: 'mk', name: 'Македонски', englishName: 'Macedonian', flag: '🇲🇰' },
  { code: 'mn', name: 'Монгол', englishName: 'Mongolian', flag: '🇲🇳' },
  { code: 'my', name: 'မြန်မာ', englishName: 'Burmese', flag: '🇲🇲' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali', flag: '🇳🇵' },
  { code: 'si', name: 'සිංහල', englishName: 'Sinhala', flag: '🇱🇰' },
  { code: 'uz', name: 'Oʻzbek', englishName: 'Uzbek', flag: '🇺🇿' },
];

export function getLanguageMetadata(code) {
  if (!code) return POPULAR_LANGUAGES[0];
  const clean = String(code).toLowerCase().split('-')[0];
  const found = ALL_WORLD_LANGUAGES.find(
    (l) => l.code === code || l.codeAlias === clean || l.code.startsWith(clean)
  );
  if (found) return found;
  return { code, name: code.toUpperCase(), flag: '🌐' };
}
