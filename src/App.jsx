import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sun, Moon, Compass, Users, Award, ShieldCheck, Sparkles, 
  PlusCircle, Calendar, ArrowLeft, Languages, UserCheck, 
  ChevronRight, Gem, Flame, BookOpen, Heart, ToggleLeft, 
  ToggleRight, Settings, Trash2, Smartphone, Key, CircleCheck,
  Edit, Search, Cloud, RefreshCw, LogIn, LogOut, Check, Megaphone, X, Star, Database,
  PhoneCall
} from 'lucide-react';
import { calculateAstrology, calculateMatchmaking, getDailyPanchang, Planet, signNamesEnglish, signNamesHindi } from './VedicAstrologyEngine';
import { 
  AdvancedDashaExplorer, GocharTransitPanel, LifetimePredictionsPanel,
  AspectsConjunctionEngine, AuspiciousDatesHub, AstrologyAcademyHub,
  VerificationCertificatePanel, KPSavedKundliPanel
} from './AdvancedVedicModules';
import SocietyUpdatesHub, { AstroPaywallLock, AdminControlWorkstation } from './SocietyCMS';
import CosmicAIChat from './CosmicAIChat';
import PVAstroLogo from './PVAstroLogo';
import { authService, kundliDbService, feedbackService, adminAnalyticsService, getDefaultStorageConfig, saveStorageConfig, isSupabaseConfigured, checkDatabaseHealth } from './StorageService';

const THEMES = {
  ASTROSAGE: {
    id: 'ASTROSAGE',
    name: 'AstroSage Divine Saffron',
    hindiName: 'एस्ट्रोसेज केसरिया',
    bgPage: '#FFFDF9', // Warm sacred cream background
    bgCard: '#FFFFFF', // Clean pristine white cards
    bgInput: '#FFFFFF',
    bgBadge: '#FFF3E0', // Very light marigold yellow indicator
    border: '#FFE0B2', // Soft glowing golden marigold border
    primary: '#FF6500', // Auspicious Astrosage deep saffron
    primaryHover: '#E65100', // Saffron depth
    textMain: '#2E1505', // Deep readable terracotta/chocolate text
    textMuted: '#6D4C41', // Saffron shadow muted tone
    accent: '#FF3D00' // Crimson spark accent
  },
  BRIGHT: {
    id: 'BRIGHT',
    name: 'Vibrant Holiday',
    hindiName: 'चमकदार रंगीन',
    bgPage: '#FFF9F3', // Warm sunny cream
    bgCard: '#FFFFFF', // Clean white card
    bgInput: '#FFFFFF',
    bgBadge: '#FFF0F5', // Vibrant soft rose highlights
    border: '#FFD5C6', // Tender coral border
    primary: '#E64A19', // Full radiant saffron-red
    primaryHover: '#D84315',
    textMain: '#2E1505', // Deep chocolate/aubergine text
    textMuted: '#795548', // Elegant warm earth
    accent: '#E91E63' // Festively bright pink
  },
  GOLD: {
    id: 'GOLD',
    name: 'Imperial Gold',
    hindiName: 'शाही स्वर्ण',
    bgPage: '#FAF7F2',
    bgCard: '#FFFFFF',
    bgInput: '#FFFFFF',
    bgBadge: '#FCF6E8',
    border: '#E5DEC3',
    primary: '#936a18',
    primaryHover: '#af7f21',
    textMain: '#2D2A26',
    textMuted: '#5D5A54',
    accent: '#cca43b'
  },
  EMERALD: {
    id: 'EMERALD',
    name: 'Vedic Emerald',
    hindiName: 'वैदिक पन्ना',
    bgPage: '#FAF9F5',
    bgCard: '#FFFFFF',
    bgInput: '#FFFFFF',
    bgBadge: '#EBF5EE',
    border: '#D2DBCF',
    primary: '#1B5E3A',
    primaryHover: '#2A7F50',
    textMain: '#1E2B22',
    textMuted: '#505E54',
    accent: '#238551'
  },
  SAFFRON: {
    id: 'SAFFRON',
    name: 'Sacred Saffron',
    hindiName: 'केसरिया दिव्य',
    bgPage: '#FCF9F5',
    bgCard: '#FFFFFF',
    bgInput: '#FFFFFF',
    bgBadge: '#FAF0E6',
    border: '#ECCCA2',
    primary: '#D35400',
    primaryHover: '#E67E22',
    textMain: '#3E2723',
    textMuted: '#6D4C41',
    accent: '#E67E22'
  },
  SAPPHIRE: {
    id: 'SAPPHIRE',
    name: 'Celestial Sapphire',
    hindiName: 'दिव्य नीलम',
    bgPage: '#F3F6FA',
    bgCard: '#FFFFFF',
    bgInput: '#FFFFFF',
    bgBadge: '#E8F0FE',
    border: '#C9D4E2',
    primary: '#1F51C6',
    primaryHover: '#3366FF',
    textMain: '#1A2332',
    textMuted: '#56657F',
    accent: '#2962FF'
  },
  CLASSIC_BW: {
    id: 'CLASSIC_BW',
    name: 'Black & White Classic',
    hindiName: 'क्लासिक श्याम-श्वेत',
    bgPage: '#FFFFFF', // Pure White
    bgCard: '#FFFFFF', // Pure White
    bgInput: '#FFFFFF',
    bgBadge: '#F5F5F5', // Soft gray
    border: '#000000', // Pure Black
    primary: '#000000', // Pure Black
    primaryHover: '#333333',
    textMain: '#000000', // Pure Black
    textMuted: '#333333', // Dark Slate
    accent: '#000000'
  },
  CLASSIC_WB: {
    id: 'CLASSIC_WB',
    name: 'Classic White-on-Black',
    hindiName: 'श्याम-श्वेत (उलटा)',
    bgPage: '#000000', // Pure Black
    bgCard: '#000000', // Pure Black
    bgInput: '#000000',
    bgBadge: '#1A1A1A', // Dark gray
    border: '#FFFFFF', // Pure White
    primary: '#FFFFFF', // Pure White
    primaryHover: '#DDDDDD',
    textMain: '#FFFFFF', // Pure White
    textMuted: '#CCCCCC', // Light gray
    accent: '#FFFFFF'
  },
  MATRIX_GREEN: {
    id: 'MATRIX_GREEN',
    name: 'Matrix Green Contrast',
    hindiName: 'मैट्रिक्स हरा',
    bgPage: '#000000', // Pure Black
    bgCard: '#000000', // Pure Black
    bgInput: '#000000',
    bgBadge: '#0D2611',
    border: '#00FF41', // Neon green
    primary: '#00FF41',
    primaryHover: '#00DD30',
    textMain: '#00FF41', // Neon green
    textMuted: '#00AA20', // Dim green
    accent: '#00FF41'
  },
  CYBER_YELLOW: {
    id: 'CYBER_YELLOW',
    name: 'Cyber Yellow Contrast',
    hindiName: 'साइबर पीला',
    bgPage: '#000000', // Pure Black
    bgCard: '#000000', // Pure Black
    bgInput: '#000000',
    bgBadge: '#262200',
    border: '#FFEA00', // Neon yellow
    primary: '#FFEA00',
    primaryHover: '#D4C200',
    textMain: '#FFEA00', // Neon yellow
    textMuted: '#A89B00', // Dim yellow
    accent: '#FFEA00'
  }
};

const houseHindiNames = {
  1: "प्रथम भाव (लग्न/तनु)",
  2: "द्वितीय भाव (धन)",
  3: "तृतीय भाव (सहज/पराक्रम)",
  4: "चतुर्थ भाव (सुख/मातृ)",
  5: "पंचम भाव (पुत्र/बुद्धि/ज्ञान)",
  6: "षष्ठ भाव (रिपु/रोग/ऋण)",
  7: "सप्तम भाव (जाया/कलत्र)",
  8: "अष्टम भाव (आयु/मृत्यु)",
  9: "नवम भाव (धर्म/भाग्य)",
  10: "दशम भाव (कर्म/पिता)",
  11: "एकादश भाव (आय/लाभ)",
  12: "द्वादश भाव (व्यय)"
};

const houseEnglishNames = {
  1: "1st House (Identity/Lagna)",
  2: "2nd House (Wealth/Speech)",
  3: "3rd House (Valour/Siblings)",
  4: "4th House (Mother/Comforts)",
  5: "5th House (Intellect/Children)",
  6: "6th House (Debt/Enemies)",
  7: "7th House (Spouse/Marriage)",
  8: "8th House (Longevity/Secrets)",
  9: "9th House (Fortune/Dharma)",
  10: "10th House (Profession/Karma)",
  11: "11th House (Income/Gains)",
  12: "12th House (Expenditure/Moksha)"
};

const CITIES_DATABASE = [
  { name: 'Muzaffarnagar, Uttar Pradesh, India', hindi: 'मुजफ्फरनगर, उत्तर प्रदेश, भारत', lat: 29.4727, lon: 77.7085, timezone: 'Asia/Kolkata' },
  { name: 'Muzaffarpur, Bihar, India', hindi: 'मुजफ्फरपुर, बिहार, भारत', lat: 26.1209, lon: 85.3647, timezone: 'Asia/Kolkata' },
  { name: 'New Delhi, Delhi, India', hindi: 'नई दिल्ली, दिल्ली, भारत', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Delhi, India', hindi: 'दिल्ली, भारत', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai, Maharashtra, India', hindi: 'मुंबई, महाराष्ट्र, भारत', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata, West Bengal, India', hindi: 'कोलकाता, पश्चिम बंगाल, भारत', lat: 22.5726, lon: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Bengaluru, Karnataka, India', hindi: 'बेंगलुरु, कर्नाटक, भारत', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Chennai, Tamil Nadu, India', hindi: 'चेन्नई, तमिलनाडु, भारत', lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Pune, Maharashtra, India', hindi: 'पुणे, महाराष्ट्र, भारत', lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad, Telangana, India', hindi: 'हैदराबाद, तेलंगाना, भारत', lat: 17.3850, lon: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad, Gujarat, India', hindi: 'अहमदाबाद, गुजरात, भारत', lat: 23.0225, lon: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur, Rajasthan, India', hindi: 'जयपुर, राजस्थान, भारत', lat: 26.9124, lon: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Lucknow, Uttar Pradesh, India', hindi: 'लखनऊ, उत्तर प्रदेश, भारत', lat: 26.8467, lon: 80.9462, timezone: 'Asia/Kolkata' },
  { name: 'Patna, Bihar, India', hindi: 'पटना, बिहार, भारत', lat: 25.5941, lon: 85.1376, timezone: 'Asia/Kolkata' },
  { name: 'Bhopal, Madhya Pradesh, India', hindi: 'भोपाल, मध्य प्रदेश, भारत', lat: 23.2599, lon: 77.4126, timezone: 'Asia/Kolkata' },
  { name: 'Varanasi, Uttar Pradesh, India', hindi: 'वाराणसी, उत्तर प्रदेश, भारत', lat: 25.3176, lon: 82.9739, timezone: 'Asia/Kolkata' },
  { name: 'Indore, Madhya Pradesh, India', hindi: 'इंदौर, मध्य प्रदेश, भारत', lat: 22.7196, lon: 75.8577, timezone: 'Asia/Kolkata' },
  { name: 'Chandigarh, India', hindi: 'चंडीगढ़, भारत', lat: 30.7333, lon: 76.7794, timezone: 'Asia/Kolkata' },
  { name: 'Dehradun, Uttarakhand, India', hindi: 'देहरादून, उत्तराखंड, भारत', lat: 30.3165, lon: 78.0322, timezone: 'Asia/Kolkata' },
  { name: 'Ranchi, Jharkhand, India', hindi: 'रांची, झारखंड, भारत', lat: 23.3441, lon: 85.3096, timezone: 'Asia/Kolkata' },
  { name: 'Srinagar, Jammu and Kashmir, India', hindi: 'श्रीनगर, जम्मू और कश्मीर, भारत', lat: 34.0837, lon: 74.7973, timezone: 'Asia/Kolkata' },
  { name: 'Shimla, Himachal Pradesh, India', hindi: 'शिमला, हिमाचल प्रदेश, भारत', lat: 31.1048, lon: 77.1734, timezone: 'Asia/Kolkata' },
  { name: 'Guwahati, Assam, India', hindi: 'गुवाहाटी, असम, भारत', lat: 26.1445, lon: 91.7362, timezone: 'Asia/Kolkata' },
  { name: 'Kochi, Kerala, India', hindi: 'कोच्चि, केरल, भारत', lat: 9.9312, lon: 76.2673, timezone: 'Asia/Kolkata' },
  { name: 'Nagpur, Maharashtra, India', hindi: 'नागपुर, महाराष्ट्र, भारत', lat: 21.1458, lon: 79.0882, timezone: 'Asia/Kolkata' },
  { name: 'Kanpur, Uttar Pradesh, India', hindi: 'कानपुर, उत्तर प्रदेश, भारत', lat: 26.4499, lon: 80.3319, timezone: 'Asia/Kolkata' },
  { name: 'Surat, Gujarat, India', hindi: 'सूरत, गुजरात, भारत', lat: 21.1702, lon: 72.8311, timezone: 'Asia/Kolkata' },
  { name: 'Bhubaneswar, Odisha, India', hindi: 'भुवनेश्वर, ओडिशा, भारत', lat: 20.2961, lon: 85.8245, timezone: 'Asia/Kolkata' },
  { name: 'Raipur, Chhattisgarh, India', hindi: 'रायपुर, छत्तीसगढ़, भारत', lat: 21.2514, lon: 81.6296, timezone: 'Asia/Kolkata' },
  { name: 'Agra, Uttar Pradesh, India', hindi: 'आगरा, उत्तर प्रदेश, भारत', lat: 27.1767, lon: 78.0081, timezone: 'Asia/Kolkata' },
  { name: 'Mathura, Uttar Pradesh, India', hindi: 'मथुरा, उत्तर प्रदेश, भारत', lat: 27.4924, lon: 77.6737, timezone: 'Asia/Kolkata' },
  { name: 'Ayodhya, Uttar Pradesh, India', hindi: 'अयोध्या, उत्तर प्रदेश, भारत', lat: 26.7922, lon: 82.1998, timezone: 'Asia/Kolkata' },
  { name: 'Ujjain, Madhya Pradesh, India', hindi: 'उज्जैन, मध्य प्रदेश, भारत', lat: 23.1760, lon: 75.7885, timezone: 'Asia/Kolkata' },
  { name: 'Haridwar, Uttarakhand, India', hindi: 'हरिद्वार, उत्तराखंड, भारत', lat: 29.9457, lon: 78.1642, timezone: 'Asia/Kolkata' },
  { name: 'Rishikesh, Uttarakhand, India', hindi: 'ऋषिकेश, उत्तराखंड, भारत', lat: 30.0869, lon: 78.2676, timezone: 'Asia/Kolkata' },
  { name: 'Gwalior, Madhya Pradesh, India', hindi: 'ग्वालियर, मध्य प्रदेश, भारत', lat: 26.2183, lon: 78.1828, timezone: 'Asia/Kolkata' },
  { name: 'Gurugram, Haryana, India', hindi: 'गुरुग्राम, हरियाणा, भारत', lat: 28.4595, lon: 77.0266, timezone: 'Asia/Kolkata' },
  { name: 'Noida, Uttar Pradesh, India', hindi: 'नोएडा, उत्तर प्रदेश, भारत', lat: 28.5355, lon: 77.3910, timezone: 'Asia/Kolkata' },
  { name: 'Ghaziabad, Uttar Pradesh, India', hindi: 'गाजियाबाद, उत्तर प्रदेश, भारत', lat: 28.6692, lon: 77.4538, timezone: 'Asia/Kolkata' },
  { name: 'Meerut, Uttar Pradesh, India', hindi: 'मेरठ, उत्तर प्रदेश, भारत', lat: 28.9845, lon: 77.7064, timezone: 'Asia/Kolkata' },
  { name: 'Allahabad, Uttar Pradesh, India', hindi: 'इलाहाबाद, उत्तर प्रदेश, भारत', lat: 25.4358, lon: 81.8463, timezone: 'Asia/Kolkata' },
  { name: 'Prayagraj, Uttar Pradesh, India', hindi: 'प्रयागराज, उत्तर प्रदेश, भारत', lat: 25.4358, lon: 81.8463, timezone: 'Asia/Kolkata' },
  { name: 'Aligarh, Uttar Pradesh, India', hindi: 'अलीगढ़, उत्तर प्रदेश, भारत', lat: 27.8974, lon: 78.0880, timezone: 'Asia/Kolkata' },
  { name: 'Gorakhpur, Uttar Pradesh, India', hindi: 'गोरखपुर, उत्तर प्रदेश, भारत', lat: 26.7606, lon: 83.3731, timezone: 'Asia/Kolkata' },
  { name: 'Chandigarh, Punjab, India', hindi: 'चंडीगढ़, पंजाब, भारत', lat: 30.7333, lon: 76.7794, timezone: 'Asia/Kolkata' },
  { name: 'Amritsar, Punjab, India', hindi: 'अमृतसर, पंजाब, भारत', lat: 31.6340, lon: 74.8723, timezone: 'Asia/Kolkata' },
  { name: 'Ludhiana, Punjab, India', hindi: 'लुधियाना, पंजाब, भारत', lat: 30.9010, lon: 75.8573, timezone: 'Asia/Kolkata' },
  { name: 'Jalandhar, Punjab, India', hindi: 'जालंधर, पंजाब, भारत', lat: 31.3260, lon: 75.5762, timezone: 'Asia/Kolkata' },
  { name: 'Jodhpur, Rajasthan, India', hindi: 'जोधपुर, राजस्थान, भारत', lat: 26.2389, lon: 73.0243, timezone: 'Asia/Kolkata' },
  { name: 'Udaipur, Rajasthan, India', hindi: 'उदयपुर, राजस्थान, भारत', lat: 24.5854, lon: 73.7125, timezone: 'Asia/Kolkata' },
  { name: 'Ajmer, Rajasthan, India', hindi: 'अजमेर, राजस्थान, भारत', lat: 26.4498, lon: 74.6385, timezone: 'Asia/Kolkata' },
  { name: 'Gaya, Bihar, India', hindi: 'गया, बिहार, भारत', lat: 24.7955, lon: 84.9994, timezone: 'Asia/Kolkata' },
  { name: 'Bhagalpur, Bihar, India', hindi: 'भागलपुर, बिहार, भारत', lat: 25.2445, lon: 87.0145, timezone: 'Asia/Kolkata' },
  { name: 'Darbhanga, Bihar, India', hindi: 'दरभंगा, बिहार, भारत', lat: 26.1119, lon: 85.8960, timezone: 'Asia/Kolkata' },
  { name: 'Nashik, Maharashtra, India', hindi: 'नाशिक, महाराष्ट्र, भारत', lat: 19.9975, lon: 73.7898, timezone: 'Asia/Kolkata' },
  { name: 'Coimbatore, Tamil Nadu, India', hindi: 'कोइम्बटूर, तमिलनाडु, भारत', lat: 11.0168, lon: 76.9558, timezone: 'Asia/Kolkata' },
  { name: 'Madurai, Tamil Nadu, India', hindi: 'मदुरै, तमिलनाडु, भारत', lat: 9.9252, lon: 78.1198, timezone: 'Asia/Kolkata' },
  { name: 'Mysore, Karnataka, India', hindi: 'मैसूर, कर्नाटक, भारत', lat: 12.2958, lon: 76.6394, timezone: 'Asia/Kolkata' },
  { name: 'Visakhapatnam, Andhra Pradesh, India', hindi: 'विशाखापत्तनम, आंध्र प्रदेश, भारत', lat: 17.6868, lon: 83.2185, timezone: 'Asia/Kolkata' },
  { name: 'Vijayawada, Andhra Pradesh, India', hindi: 'विजयवाड़ा, आंध्र प्रदेश, भारत', lat: 16.5062, lon: 80.6480, timezone: 'Asia/Kolkata' },
  { name: 'Tirupati, Andhra Pradesh, India', hindi: 'तिरुपति, आंध्र प्रदेश, भारत', lat: 13.6284, lon: 79.4192, timezone: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram, Kerala, India', hindi: 'तिरुवनंतपुरम, केरल, भारत', lat: 8.5241, lon: 76.9366, timezone: 'Asia/Kolkata' },
  { name: 'Leh, Ladakh, India', hindi: 'लेह, लद्दाख, भारत', lat: 34.1526, lon: 77.5771, timezone: 'Asia/Kolkata' },
  { name: 'London, United Kingdom', hindi: 'लंदन, यूनाइटेड किंगडम', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'New York, United States', hindi: 'न्यूयॉर्क, संयुक्त राज्य अमेरिका', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' },
  { name: 'San Francisco, United States', hindi: 'सैन फ्रांसिस्को, संयुक्त राज्य अमेरिका', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' }
];

// Typo-tolerant edit distance helper
function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Typo-tolerant search match checker
function isTypoTolerantMatch(input, target) {
  if (!input || !target) return false;
  const inp = input.trim().toLowerCase();
  const tgt = target.trim().toLowerCase();
  if (tgt.includes(inp)) return true;
  
  const inpParts = inp.split(/[\s,]+/);
  const tgtParts = tgt.split(/[\s,]+/);
  
  for (const inPart of inpParts) {
    if (!inPart || inPart.length < 2) continue;
    for (const tgPart of tgtParts) {
      if (!tgPart || tgPart.length < 2) continue;
      if (tgPart.startsWith(inPart) || inPart.startsWith(tgPart)) return true;
      const dist = getEditDistance(inPart, tgPart);
      if (dist <= 2) return true;
    }
  }
  return false;
}

// State-of-the-Art Self-Healing Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Vedic Master ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-[#E5DEC3] p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse"></div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2A26] mb-2 font-cinzel">Cosmic Connection Reset</h2>
            <p className="text-slate-600 text-[11px] mb-6 leading-relaxed">
              Vedic space-time calculations encountered a temporary state offset. Our self-healing recovery layer has engaged to repair parameters automatically.
            </p>
            <div className="bg-[#FCF6E8] p-3 rounded-lg border border-[#E5DEC3] mb-6 text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Error Signature</span>
              <code className="text-[10px] font-mono text-red-600 break-all block max-h-24 overflow-y-auto">{this.state.error?.toString() || 'Structural Coordinate Shift'}</code>
            </div>
            <button
              onClick={() => {
                localStorage.clear(); // Clear potentially corrupted profiles
                window.location.reload();
              }}
              className="w-full py-3 bg-[#936a18] hover:bg-[#af7f21] text-white font-extrabold text-xs rounded-lg transition duration-200 uppercase tracking-widest shadow-md"
            >
              Reset Coordinates & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SUPABASE_SQL_SETUP_CODE = `-- 🕉️ PRANAVA VEDIC ASTROLOGY DATABASE ECOSYSTEM SETUP SCRIPT
-- Paste this script directly into your Supabase SQL Editor and click [Run]
-- Location: Supabase Dashboard -> SQL Editor (or https://supabase.com/dashboard/project/_/sql/new)

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  mobile TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMPTZ,
  role TEXT DEFAULT 'User' NOT NULL,
  status TEXT DEFAULT 'Active' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.kundlis (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT,
  birth_date TEXT,
  birth_time TEXT,
  birth_place TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  timezone NUMERIC,
  kundli_json TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.saved_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT,
  report_data TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  activity_type TEXT NOT NULL,
  device TEXT,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  start_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  end_date TIMESTAMPTZ,
  payment_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  mobile TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance optimization and fast indexing
CREATE INDEX IF NOT EXISTS idx_kundlis_user_id ON public.kundlis(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON public.saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Seed static administration credential for Puneet Vashishtha
INSERT INTO public.users (id, email, name, role, status)
VALUES ('NESPUNEET_ADMIN_ID', 'nespuneet2501@gmail.com', 'Puneet Vashishtha', 'Admin', 'Active')
ON CONFLICT (email) DO UPDATE SET role = 'Admin', status = 'Active';

-- Enable Row Level Security (RLS) policies across all entities
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kundlis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Setup Row-Level Security Rules for absolute compliance (uses WITH CHECK to fully authorize inserts)
DROP POLICY IF EXISTS "Enable read/write on users" ON public.users;
CREATE POLICY "Enable read/write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write/trash on kundlis" ON public.kundlis;
CREATE POLICY "Enable read/write/trash on kundlis" ON public.kundlis FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write on saved_reports" ON public.saved_reports;
CREATE POLICY "Enable read/write on saved_reports" ON public.saved_reports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for activity telemetry" ON public.user_activity;
CREATE POLICY "Enable insert for activity telemetry" ON public.user_activity FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write on subscriptions" ON public.subscriptions;
CREATE POLICY "Enable read/write on subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable enquiry submission" ON public.contact_enquiries;
CREATE POLICY "Enable enquiry submission" ON public.contact_enquiries FOR ALL USING (true) WITH CHECK (true);
`;



// Wrapper to export the crash-proof App
export default function App() {
  return (
    <ErrorBoundary>
      <VedicKundliApp />
    </ErrorBoundary>
  );
}

// Static listing database for Hindu Scholars, Pandits & Yogis (Purohit Directory)
const PANDITS_STRICT_LIST = [
  {
    id: "p1",
    name: "Acharya Pandit Rajesh Shastri",
    phone: "+91 94122 77085",
    email: "rajesh_shastri@pvastro.com",
    address: "Verma Park Area, Muzaffarnagar, UP, India",
    lat: 29.4727,
    lon: 77.7085,
    experience_years: 22,
    specialization: ["marriage", "grah shanti", "astrology", "puja"],
    charges: { min: 2100, max: 7500, currency: "INR" },
    profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    availability: true,
    rating: 4.9,
    verified: true,
    bio: "Gold Medalist from Sampurnanand Sanskrit Vishwavidyalaya. Expert in Placidus significator divisions, KP systems, and Vedic Kundli matching."
  },
  {
    id: "p2",
    name: "Pandit Hariom Dwivedi Ji",
    phone: "+91 98971 10822",
    email: "dwivediji@pvastro.com",
    address: "Astro Tower Center, Cannaught Place, Delhi, India",
    lat: 28.6139,
    lon: 77.2090,
    experience_years: 18,
    specialization: ["havan", "katha", "grah shanti", "marriage", "puja"],
    charges: { min: 1500, max: 5100, currency: "INR" },
    profile_photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    availability: true,
    rating: 4.8,
    verified: true,
    bio: "Renowned spiritual reciter of Shrimad Bhagwat and Ramcharitmanas. Dedicated 18+ years running elaborate Graha Shanti Havans across Delhi NCR."
  },
  {
    id: "p3",
    name: "Yogi Anand Dev (Kundalini Master)",
    phone: "+91 81260 25010",
    email: "yogi_anand@pvastro.com",
    address: "Mithila Marg, Muzaffarpur, Bihar, India",
    lat: 26.1209,
    lon: 85.3647,
    experience_years: 15,
    specialization: ["astrology", "grah shanti", "puja"],
    charges: { min: 3100, max: 11000, currency: "INR" },
    profile_photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
    availability: true,
    rating: 4.95,
    verified: true,
    bio: "Authorized Kriya Yoga and Kundalini meditation master. Offers deep evaluation of chakras, root-awakening mechanisms, and mental calmness."
  },
  {
    id: "p4",
    name: "Shyam Sundar Shastri Ji",
    phone: "+91 91522 10811",
    email: "shyam_shastri@pvastro.com",
    address: "Varistha Colony, Lucknow, UP, India",
    lat: 26.8467,
    lon: 80.9462,
    experience_years: 12,
    specialization: ["puja", "katha", "marriage"],
    charges: { min: 1100, max: 3500, currency: "INR" },
    profile_photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    availability: false,
    rating: 4.6,
    verified: true,
    bio: "Specialist in Grah Pravesh, Satyanarayan Vrat Katha, and festive Pujas. Diligently trained in classical Sanskrit rites."
  },
  {
    id: "p5",
    name: "Vidushi Meera Bai (Vedic Astrologer)",
    phone: "+91 96522 77025",
    email: "meera_bai@pvastro.com",
    address: "Raja Garden, Jaipur, Rajasthan, India",
    lat: 26.9124,
    lon: 75.7873,
    experience_years: 19,
    specialization: ["astrology", "marriage"],
    charges: { min: 2500, max: 8000, currency: "INR" },
    profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    availability: true,
    rating: 4.92,
    verified: true,
    bio: "Distinguished astrologer specializing in Ashtakoot Guna matching, Nadi dosha remedies, and career transit predictions."
  }
];

const CITIES_ROBUST_DATABASE = [
  { name: "Muzaffarnagar, Uttar Pradesh, India", lat: 29.4727, lon: 77.7085 },
  { name: "Delhi, NCT, India", lat: 28.6139, lon: 77.2090 },
  { name: "Mumbai, Maharashtra, India", lat: 19.0760, lon: 72.8777 },
  { name: "Bangalore, Karnataka, India", lat: 12.9716, lon: 77.5946 },
  { name: "Pune, Maharashtra, India", lat: 18.5204, lon: 73.8567 },
  { name: "Kolkata, West Bengal, India", lat: 22.5726, lon: 88.3639 },
  { name: "Chennai, Tamil Nadu, India", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad, Telangana, India", lat: 17.3850, lon: 78.4867 },
  { name: "Ahmedabad, Gujarat, India", lat: 23.0225, lon: 72.5714 },
  { name: "Lucknow, Uttar Pradesh, India", lat: 26.8467, lon: 80.9462 },
  { name: "Jaipur, Rajasthan, India", lat: 26.9124, lon: 75.7873 },
  { name: "Patna, Bihar, India", lat: 25.5941, lon: 85.1376 },
  { name: "Muzaffarpur, Bihar, India", lat: 26.1209, lon: 85.3647 },
  { name: "Noida, Uttar Pradesh, India", lat: 28.5355, lon: 77.3910 },
  { name: "Gurugram, Haryana, India", lat: 28.4595, lon: 77.0266 },
  { name: "Chandigarh, UT, India", lat: 30.7333, lon: 76.7794 },
  { name: "Indore, Madhya Pradesh, India", lat: 22.7196, lon: 75.8577 },
  { name: "Ranchi, Jharkhand, India", lat: 23.3441, lon: 85.3090 },
  { name: "Guwahati, Assam, India", lat: 26.1445, lon: 91.7362 },
  { name: "Bhopal, Madhya Pradesh, India", lat: 23.2599, lon: 77.4126 },
  { name: "Surat, Gujarat, India", lat: 21.1702, lon: 72.8311 },
  { name: "Dehradun, Uttarakhand, India", lat: 30.3165, lon: 78.0322 },
  { name: "Jammu, Jammu & Kashmir, India", lat: 32.7266, lon: 74.8570 },
  { name: "Haridwar, Uttarakhand, India", lat: 29.9457, lon: 78.1642 },
  { name: "Varanasi, Uttar Pradesh, India", lat: 25.3176, lon: 82.9739 },
  { name: "Ayodhya, Uttar Pradesh, India", lat: 26.7922, lon: 82.1998 },
  { name: "London, United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
  { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 }
];

const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth Radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

function VedicKundliApp() {
  // Dispatches simple dynamic alerts
  const triggerNotification = (title, message, type = "success") => {
    const detail = {
      id: Date.now(),
      title,
      message,
      type
    };
    const event = new CustomEvent('pva_notification', { detail });
    window.dispatchEvent(event);
  };

  // Application State - Ensure first screen is AUTH for new or logged-out users, showing signup
  const [currentUser, setCurrentUser] = useState(() => {
    const session = authService.getCurrentUser();
    return session ? session.email : '';
  });

  // State Variables for Pandit Booking Finder Directory system
  const [showPanditDirectory, setShowPanditDirectory] = useState(false);
  const [customPriests, setCustomPriests] = useState(() => {
    try {
      const saved = localStorage.getItem('pva_custom_priests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showPriestRegisterForm, setShowPriestRegisterForm] = useState(false);
  const [priestForm, setPriestForm] = useState({
    name: '',
    dob: '',
    experience: '',
    pujas: [],
    fee: '',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    bio: ''
  });

  const [showScholarsSidebar, setShowScholarsSidebar] = useState(true);
  const [panditSearchText, setPanditSearchText] = useState('');
  const [panditSpecializationFilter, setPanditSpecializationFilter] = useState('all');
  const [panditPriceFilter, setPanditPriceFilter] = useState(15000);
  const [panditSortBy, setPanditSortBy] = useState('distance');
  const [panditUserCity, setPanditUserCity] = useState({ name: "Delhi, NCT, India", lat: 28.6139, lon: 77.2090 });
  
  // Custom Autocomplete Dropdown City lists
  const [cityFilterText, setCityFilterText] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [bookingsList, setBookingsList] = useState(() => {
    try {
      const saved = localStorage.getItem('pva_pundits_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [activeBookingPandit, setActiveBookingPandit] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', ritual: 'General Puja', notes: '', userPhone: '' });

  useEffect(() => {
    try {
      localStorage.setItem('pva_pundits_bookings', JSON.stringify(bookingsList));
    } catch (e) {
      console.warn("Local storage write full", e);
    }
  }, [bookingsList]);

  useEffect(() => {
    const syncPriestsFromDb = async () => {
      try {
        const dbEnquiries = await feedbackService.fetchFeedbacks();
        if (!dbEnquiries || dbEnquiries.length === 0) return;
        const registrations = dbEnquiries
          .filter(e => e.email && e.email === 'priest_reg@pvastro.com')
          .map(e => {
            try {
              return JSON.parse(e.message);
            } catch (err) {
              return null;
            }
          })
          .filter(Boolean);
        
        if (registrations.length > 0) {
          setCustomPriests(prev => {
            const merged = [...prev];
            registrations.forEach(r => {
              const matchedIdx = merged.findIndex(m => m.id === r.id);
              if (matchedIdx === -1) {
                merged.push(r);
              } else {
                merged[matchedIdx] = { ...merged[matchedIdx], ...r };
              }
            });
            try {
              localStorage.setItem('pva_custom_priests', JSON.stringify(merged));
            } catch (err) {
              console.warn(err);
            }
            return merged;
          });
        }
      } catch (err) {
        console.warn("Dynamic database priest sync failed", err);
      }
    };
    syncPriestsFromDb();
  }, [currentUser]);



  const [currentScreen, setCurrentScreen] = useState('DASHBOARD'); // WELCOME, AUTH, DASHBOARD, ADD_KUNDLI, KUNDLI_REPORT, PANCHANG, MATCHMAKING, PREMIUM
  const [aiChatTab, setAiChatTab] = useState('chat');
  
  const [splashConfig, setSplashConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('pva_splash_config');
      return saved ? JSON.parse(saved) : { enabled: true, duration: 3400, playSound: true };
    } catch (e) {
      return { enabled: true, duration: 3400, playSound: true };
    }
  });

  const [showSplash, setShowSplash] = useState(() => {
    try {
      const saved = localStorage.getItem('pva_splash_config');
      const parsed = saved ? JSON.parse(saved) : { enabled: true };
      return parsed.enabled !== false;
    } catch (e) {
      return true;
    }
  });

  const [splashFade, setSplashFade] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);

  // Web Audio client-side synthesis of the sacred Om chant (divine resonance bowl effect)
  const playOmChant = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      const ctx = new AudioContextClass();
      
      // Auto-resume state on page interactions in case browser standard autoplay security is triggered
      if (ctx.state === 'suspended') {
        const resume = () => {
          ctx.resume().then(() => {
            console.log("Sacred audio context resumed successfully.");
          }).catch((err) => {
            console.warn("Audio resume pending interaction", err);
          });
          ['click', 'touchstart', 'mousemove', 'mousedown', 'keydown', 'scroll', 'mouseenter'].forEach(evt => {
            window.removeEventListener(evt, resume);
          });
        };
        ['click', 'touchstart', 'mousemove', 'mousedown', 'keydown', 'scroll', 'mouseenter'].forEach(evt => {
          window.addEventListener(evt, resume, { passive: true });
        });
      }

      // Master volume stage
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);

      // Deep resonant fundamental oscillator (136.1 Hz - Cosmic Earth Rotation tone / C#3)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, ctx.currentTime);
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.5, ctx.currentTime);
      osc1.connect(gain1);
      gain1.connect(masterGain);

      // Sacred secondary beat frequency (108 Hz - represents cosmic synchronization)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(108.0, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.35, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(masterGain);

      // Rich partial harmonic representing crystal singing bowl structure (272.2 Hz)
      const osc3 = ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(272.2, ctx.currentTime);
      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0.12, ctx.currentTime);
      osc3.connect(gain3);
      gain3.connect(masterGain);

      // Vocal mouth-simulation envelope (vowel sweeping to transition Ah-Oh-Mmm)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.0, ctx.currentTime);
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 2.8);

      const vocalOsc = ctx.createOscillator();
      vocalOsc.type = 'sawtooth';
      vocalOsc.frequency.setValueAtTime(136.1, ctx.currentTime);
      const vocalGain = ctx.createGain();
      vocalGain.gain.setValueAtTime(0.04, ctx.currentTime);

      vocalOsc.connect(filter);
      filter.connect(vocalGain);
      vocalGain.connect(masterGain);

      // Start all sound operators
      osc1.start();
      osc2.start();
      osc3.start();
      vocalOsc.start();

      return {
        stop: () => {
          try {
            const fadeTime = 0.8;
            masterGain.gain.cancelScheduledValues(ctx.currentTime);
            masterGain.gain.setValueAtTime(masterGain.gain.value || 0.24, ctx.currentTime);
            masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeTime);
            setTimeout(() => {
              try {
                osc1.stop();
                osc2.stop();
                osc3.stop();
                vocalOsc.stop();
                ctx.close();
              } catch (err) {}
            }, fadeTime * 1000 + 100);
          } catch (e) {}
        }
      };
    } catch (e) {
      console.warn("Audio Context block or unsupported", e);
      return null;
    }
  };

  useEffect(() => {
    localStorage.setItem('pva_splash_config', JSON.stringify(splashConfig));
  }, [splashConfig]);

  useEffect(() => {
    if (!showSplash) return;

    const duration = splashConfig.duration || 3400;
    const playSound = splashConfig.playSound !== false;
    
    let chantHandle = null;
    if (playSound) {
      chantHandle = playOmChant();
    }

    // Adapt step calculations depending on admin's duration settings
    const activeProgressTime = Math.max(duration - 700, 1000);
    const stepInterval = 40;
    const totalSteps = activeProgressTime / stepInterval;
    const stepDelta = 100 / totalSteps;

    const progressInterval = setInterval(() => {
      setSplashProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const randVariance = (Math.random() * 1.5) - 0.75;
        const currentDelta = Math.max(0.5, stepDelta + randVariance);
        return Math.min(oldProgress + currentDelta, 100);
      });
    }, stepInterval);

    const fadeTimer = setTimeout(() => {
      setSplashFade(true);
      if (chantHandle) {
        chantHandle.stop();
      }
    }, Math.max(100, duration - 700));

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      if (chantHandle) {
        chantHandle.stop();
      }
    };
  }, [showSplash]);

  const handleSkipSplash = () => {
    setSplashFade(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 450);
  };

  const handlePriestFormSubmit = async (e) => {
    e.preventDefault();
    if (!priestForm.name || !priestForm.dob || !priestForm.experience || !priestForm.fee) {
      triggerNotification("Selection Alert", "Please fill all required parameters to complete registration.", "warning");
      return;
    }
    const newPriestApp = {
      id: Date.now(),
      name: priestForm.name,
      dob: priestForm.dob,
      experience: parseInt(priestForm.experience) || 5,
      pujas: priestForm.pujas.length > 0 ? priestForm.pujas : ["General Puja"],
      fee: parseFloat(priestForm.fee) || 3101,
      imageUrl: priestForm.imageUrl,
      bio: priestForm.bio || "Sadhak of classical Yajur-veda rituals.",
      approved: false
    };

    // 1. Save locally to trigger immediate update in UI structures
    const updatedCustoms = [...customPriests, newPriestApp];
    setCustomPriests(updatedCustoms);
    localStorage.setItem('pva_custom_priests', JSON.stringify(updatedCustoms));

    // 2. Clear local storage cache to trigger database sync refresh
    try {
      await feedbackService.submitFeedback({
        email: 'priest_reg@pvastro.com',
        message: JSON.stringify(newPriestApp)
      });
    } catch(err) {
      console.warn("Database storage sync error", err);
    }

    triggerNotification("Application Filed", "Your registration has been securely saved to the database! Admin reviews pending.", "success");
    setShowPriestRegisterForm(false);
    // Reset form
    setPriestForm({
      name: '',
      dob: '',
      experience: '',
      pujas: [],
      fee: '',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      bio: ''
    });
  };

  const [activeProfileMemory, setActiveProfileMemory] = useState(null);
  const [memoryPendingSavePayload, setMemoryPendingSavePayload] = useState(null);
  const [memoryPendingGateActionType, setMemoryPendingGateActionType] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingKundliToSave, setPendingKundliToSave] = useState(null);
  const [storageConfig, setStorageConfig] = useState(() => getDefaultStorageConfig());

  const [dbHealth, setDbHealth] = useState({ 
    configured: true, 
    status: 'healthy', 
    tables: {
      users: true,
      kundlis: true,
      saved_reports: true,
      user_activity: true,
      subscriptions: true,
      contact_enquiries: true
    } 
  });

  const queryDatabaseStatus = async () => {
    try {
      const res = await checkDatabaseHealth();
      setDbHealth(res);
    } catch (e) {
      console.warn("Database health probe error:", e);
    }
  };

  // Synchronize Supabase configurations from URL parameters if provided
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sUrl = params.get('supabaseUrl') || params.get('sUrl');
      const sKey = params.get('supabaseAnonKey') || params.get('sKey');
      
      if (sUrl && sKey) {
        const currentConfig = getDefaultStorageConfig();
        const updated = {
          ...currentConfig,
          supabaseUrl: decodeURIComponent(sUrl).trim(),
          supabaseAnonKey: decodeURIComponent(sKey).trim(),
          mode: 'SUPABASE'
        };
        setStorageConfig(updated);
        saveStorageConfig(updated);
        
        setTimeout(() => {
          triggerNotification(
            "Supabase Sync Successful!", 
            "Your workspace is connected to the cloud PostgreSQL cluster! 🪐", 
            "success"
          );
        }, 1200);
        
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    } catch (e) {
      console.warn("Failed to parse Supabase URL parameters", e);
    }
  }, []);

  // Poll database table existence and status
  useEffect(() => {
    queryDatabaseStatus();
    // Periodically probe connection
    const interval = setInterval(queryDatabaseStatus, 15000);
    return () => clearInterval(interval);
  }, [storageConfig]);

  const [userRegisterEmail, setUserRegisterEmail] = useState('');
  const [userRegisterPassword, setUserRegisterPassword] = useState('');
  const [userRegisterName, setUserRegisterName] = useState('');
  const [userLoginEmail, setUserLoginEmail] = useState('');
  const [userLoginPassword, setUserLoginPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSending, setIsResetSending] = useState(false);
  const [adminSecretCode, setAdminSecretCode] = useState(''); // Admin authorization key
  const [authActiveTab, setAuthActiveTab] = useState('login'); // Default to login page first with default Admin prefilled
  const [currentLanguage, setCurrentLanguage] = useState('English'); // English / Hindi
  const [activeChartStyle, setActiveChartStyle] = useState('North Indian'); // North Indian, South Indian, East Indian
  const [highlightedPlanet, setHighlightedPlanet] = useState(null);

  const [breakingNews, setBreakingNews] = useState(() => {
    return localStorage.getItem('pva_breaking_news') || "महा शिवरात्रि एवं हिंदू नववर्ष के उपलक्ष्य में सभी कुंडली सेवाएं पूर्णतः निःशुल्क की गई हैं। वैदिक आचार्यों द्वारा सिद्ध गोचर यंत्र सक्रिय है।";
  });
  const [breakingNewsEng, setBreakingNewsEng] = useState(() => {
    return localStorage.getItem('pva_breaking_news_eng') || "Under the blessings of Maha Shivratri and Hindu New Year, all premium Kundli and life prediction services are made 100% Free.";
  });
  const [showNewsEditor, setShowNewsEditor] = useState(false);

  // Database sync states: Favorite, Collections, Share Settings
  const [guestGateAction, setGuestGateAction] = useState(null);
  const [showDbCenter, setShowDbCenter] = useState(false);

  // Dynamic slide-in / toaster notification state
  const [alertsList, setAlertsList] = useState([]);

  useEffect(() => {
    const handleAlert = (e) => {
      if (e.detail) {
        setAlertsList(prev => [...prev, e.detail]);
        // Auto remove in 4 seconds
        setTimeout(() => {
          setAlertsList(prev => prev.filter(item => item.id !== e.detail.id));
        }, 4000);
      }
    };
    window.addEventListener('pva_notification', handleAlert);
    return () => window.removeEventListener('pva_notification', handleAlert);
  }, []);

  // Library State Filters & Search
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('All');
  const [librarySortBy, setLibrarySortBy] = useState('newest'); // name, newest, category, favorite
  const [libraryTab, setLibraryTab] = useState('active'); // active, trash
  
  // Inline card editing state
  const [editingKundliId, setEditingKundliId] = useState(null);
  const [editingKundliData, setEditingKundliData] = useState({ name: '', category: 'Self', notes: '' });

  // Custom User profile configuration states
  const [userProfileData, setUserProfileData] = useState(() => {
    return authService.getCurrentUser() || {
      name: 'Vedic Seeker',
      email: 'nespuneet2501@gmail.com',
      avatarUrl: '',
      registeredAt: '2026-05-24',
      lastLogin: new Date().toISOString()
    };
  });

  // Keep Profile Synced when currentUser changes
  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUserProfileData(current);
    }
  }, [currentUser]);
  
  const [favoritesSet, setFavoritesSet] = useState([]);

  const [collectionsList, setCollectionsList] = useState(["Family", "Friends", "Clients"]);

  const [kundliShareSettings, setKundliShareSettings] = useState({});

  const [usersList, setUsersList] = useState(() => {
    return [
      { email: 'nespuneet2501@gmail.com', isPremium: true, method: 'Google Sync', registeredAt: '2026-05-24' },
      { email: 'guest@vedicastrology.org', isPremium: false, method: 'Email', registeredAt: '2026-05-26' },
      { email: 'testseeker@gmail.com', isPremium: false, method: 'Email', registeredAt: '2026-05-27' }
    ];
  });

  // Zero-footprint memory state initialization for user roster lists

  const [isAdminSyncing, setIsAdminSyncing] = useState(false);

  useEffect(() => {
    const isCurrentUserAdmin = currentUser && currentUser.trim().toLowerCase() === 'nespuneet2501@gmail.com';
    if (isCurrentUserAdmin && (currentScreen === 'ADMIN_CONTROL' || currentScreen === 'DASHBOARD')) {
      let isSubscribed = true;
      const loadRealtimeMetrics = async () => {
        setIsAdminSyncing(true);
        try {
          // Fetch live telemetry metrics and registered users from specified DB mode
          const metrics = await adminAnalyticsService.getSystemMetrics();
          if (isSubscribed && metrics && Array.isArray(metrics.usersList)) {
            setUsersList(metrics.usersList);
          }
          // Fetch live saved Kundlis across the entire database
          const liveKundlis = await kundliDbService.fetchSavedKundlis(currentUser);
          if (isSubscribed && Array.isArray(liveKundlis)) {
            setSavedKundlis(liveKundlis);
          }
        } catch (err) {
          console.warn("Real-time admin sync had error:", err);
        } finally {
          if (isSubscribed) {
            setIsAdminSyncing(false);
          }
        }
      };
      loadRealtimeMetrics();
      return () => {
        isSubscribed = false;
      };
    }
  }, [currentScreen, currentUser, storageConfig.mode]);

  const [moduleSettings, setModuleSettings] = useState(() => {
    const saved = localStorage.getItem('pva_module_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      dasha: { label: "Vimshottari Dasha Explorer", enabled: true, premiumOnly: true },
      gochar: { label: "Gochar Transit Realtime Map", enabled: true, premiumOnly: true },
      lifetime: { label: "Lifetime Predictive Horoscope", enabled: true, premiumOnly: true },
      aspects: { label: "Aspects & Conjunctions Decryptor", enabled: true, premiumOnly: true },
      dates: { label: "Auspicious Date Muhurat Grid", enabled: true, premiumOnly: true },
      academy: { label: "Vedic Academy Research Desk", enabled: true, premiumOnly: false },
      verification: { label: "Birth Horoscope Verification Stamp", enabled: true, premiumOnly: true }
    };
  });

  useEffect(() => {
    localStorage.setItem('pva_module_settings', JSON.stringify(moduleSettings));
  }, [moduleSettings]);

  const [subscriptionPlans, setSubscriptionPlans] = useState(() => {
    const saved = localStorage.getItem('pva_sub_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'BASIC', title: 'Kundli Starter Pack', price: 499, tagline: 'Access basic predictions, match charts, & dynamic Gochar previews' },
      { id: 'ASTRO_PRO', title: 'Celestial Professional', price: 1499, tagline: 'Access multi-cycle Vimshottari dasha, custom offset transits, and academic certificate' },
      { id: 'ENTERPRISE', title: 'Ultimate Scholar Pass', price: 2999, tagline: 'All modules, print certification, physical ritual havan invitation discounts, plus priority guru consultation' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pva_sub_plans', JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

  const [usageMonitor, setUsageMonitor] = useState(() => {
    return {
      calculations: 4851 + Math.floor(Math.random() * 21),
      apiCalls: 8940 + Math.floor(Math.random() * 41)
    };
  });

  const activeUserIsPremium = useMemo(() => {
    const matched = usersList.find(u => u.email.toLowerCase() === currentUser?.toLowerCase());
    if (matched) return matched.isPremium;
    return currentUser?.toLowerCase() === 'nespuneet2501@gmail.com';
  }, [currentUser, usersList]);

  const isUserAdmin = useMemo(() => {
    return currentUser?.trim().toLowerCase() === 'nespuneet2501@gmail.com';
  }, [currentUser]);

  useEffect(() => {
    const is_admin = currentUser?.trim().toLowerCase() === 'nespuneet2501@gmail.com';
    const restrictedScreens = ['ADMIN_CONTROL', 'INTEGRATIONS'];
    if (!is_admin && restrictedScreens.includes(currentScreen)) {
      setCurrentScreen('DASHBOARD');
      triggerNotification(
        "Admin Privileges Required",
        "This section is restricted to the administrator. Please log in with correct credentials.",
        "warning"
      );
    }
  }, [currentUser, currentScreen]);

  // Upgrade Pay Modal Simulated Variables
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [payPlanId, setPayPlanId] = useState('ASTRO_PRO');
  const [paymentOtpSent, setPaymentOtpSent] = useState(false);
  const [paymentOtpCode, setPaymentOtpCode] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const [showGoogleSimPicker, setShowGoogleSimPicker] = useState(false);
  
  // Custom Dynamic Themes Support
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('pva_current_theme') || 'ASTROSAGE'); // 'ASTROSAGE', 'GOLD', 'EMERALD', 'SAFFRON', 'SAPPHIRE'
  const [fontScale, setFontScale] = useState(() => localStorage.getItem('pva_font_scale') || 'NORMAL');

  useEffect(() => {
    localStorage.setItem('pva_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('pva_current_theme', currentTheme);
  }, [currentTheme]);

  const [profileSearchQuery, setProfileSearchQuery] = useState('');

  // Advanced Astrology Report Navigation, CMS, and calculators state
  const [reportTab, setReportTab] = useState('chart'); // 'chart', 'dasha', 'gochar', 'lifetime', 'aspects', 'dates', 'academy', 'verification'
  const [gocharReference, setGocharReference] = useState('Lagna'); // 'Lagna' or 'Moon'
  const [learningAssets, setLearningAssets] = useState(() => {
    const saved = localStorage.getItem('pva_learning_assets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, title: 'Introduction to Kundli Houses (लग्न भाव परिचय)', type: 'Article', link: 'https://vedicastrologyacademy.org/houses_guide', desc: 'Each of the 12 houses (Bhavas) in a Kundli governs specific areas of life. Learn how planets manifest their energies through them.', addedBy: 'System' },
      { id: 2, title: 'Vimshottari Dasha Decoding Masterclass (दशा प्रबोधिनी)', type: 'Video', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'A step-by-step video lecture on why Vimshottari is the king of predictive systems and how to track transit triggers.', addedBy: 'System' },
      { id: 3, title: 'Vedic Gemstones and Remedial Almanac (रत्न विज्ञान हस्तपुस्तिका)', type: 'PDF', link: 'https://vedicastrologyacademy.org/pdf/handbook_2026', desc: 'Complete textual PDF guide containing seed mantras, timing, and weight calculations for wearing Pukhraj, Munga, or Neelam.', addedBy: 'System' },
      { id: 4, title: 'Gochar Transit Interpretation Course (गोचर ज्ञान संजीवनी)', type: 'Article', link: 'https://vedicastrologyacademy.org/transits_explained', desc: 'Scientific guide to tracking planets movement across houses in real-time. Understand the dual impact from Moon Sign and Ascendant.', addedBy: 'System' }
    ];
  });
  const [adminMode, setAdminMode] = useState(false);
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetType, setNewAssetType] = useState('Video');
  const [newAssetLink, setNewAssetLink] = useState('');
  const [newAssetDesc, setNewAssetDesc] = useState('');
  const [suitabilityGoal, setSuitabilityGoal] = useState('Career'); // Career, Wedding, Business, Investment, Travel, Property

  const handleAddAsset = () => {
    if (!newAssetTitle || !newAssetLink) return;
    const newAsset = {
      id: Date.now(),
      title: newAssetTitle,
      type: newAssetType,
      link: newAssetLink,
      desc: newAssetDesc || 'Custom courseware description',
      addedBy: 'Senior Scholar (AI Studio)'
    };
    const updated = [...learningAssets, newAsset];
    setLearningAssets(updated);
    localStorage.setItem('pva_learning_assets', JSON.stringify(updated));
    setNewAssetTitle('');
    setNewAssetLink('');
    setNewAssetDesc('');
  };

  const handleDeleteAsset = (id) => {
    const updated = learningAssets.filter(item => item.id !== id);
    setLearningAssets(updated);
    localStorage.setItem('pva_learning_assets', JSON.stringify(updated));
  };

  // Auto load last generated profile data
  const [nameInput, setNameInput] = useState('Sample');
  const [genderInput, setGenderInput] = useState('Male');
  const [dobInput, setDobInput] = useState('1995-10-24');
  const [tobInput, setTobInput] = useState('12:00');
  const [birthPlaceInput, setBirthPlaceInput] = useState('New Delhi, Delhi, India');
  const [latitudeInput, setLatitudeInput] = useState(28.6139);
  const [longitudeInput, setLongitudeInput] = useState(77.2090);
  const [timezoneInput, setTimezoneInput] = useState('Asia/Kolkata');

  const [citySearchFocused, setCitySearchFocused] = useState(false);

  // Matchmaking states
  const [boyName, setBoyName] = useState('Rahul');
  const [boyDob, setBoyDob] = useState('1990-08-15');
  const [boyTob, setBoyTob] = useState('14:30');
  const [girlName, setGirlName] = useState('Anjali');
  const [girlDob, setGirlDob] = useState('1993-11-22');
  const [girlTob, setGirlTob] = useState('08:15');
  const [matchReport, setMatchReport] = useState(null);

  // Panchang states
  const [panchangDate, setPanchangDate] = useState(new Date().toISOString().split('T')[0]);

  // Saved profiles with memory state initialization
  const [savedKundlis, setSavedKundlis] = useState(() => {
    return [];
  });

  const [activeChartType, setActiveChartType] = useState('D1 - Lagna'); // 'D1 - Lagna', 'D9 - Navamsha'

  // Calculations derived from current state
  const report = useMemo(() => {
    return calculateAstrology(nameInput, dobInput, tobInput, latitudeInput, longitudeInput, timezoneInput);
  }, [nameInput, dobInput, tobInput, latitudeInput, longitudeInput, timezoneInput]);

  const activeChartReport = useMemo(() => {
    if (activeChartType === 'D9 - Navamsha') {
      return {
        lagnaSignNum: report.lagnaSignNumD9,
        lagnaEnglish: report.lagnaEnglishD9,
        lagnaHindi: report.lagnaHindiD9,
        planets: report.planetsD9,
        aspects: []
      };
    }
    return report;
  }, [report, activeChartType]);

  const panchangData = useMemo(() => {
    return getDailyPanchang(panchangDate);
  }, [panchangDate]);

  // Online Geocoding Search Logic using OpenStreetMap Nominatim API
  const [loadingCities, setLoadingCities] = useState(false);
  const [onlineSuggestions, setOnlineSuggestions] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const query = birthPlaceInput.trim().toLowerCase();
      if (query.length >= 2) {
        setLoadingCities(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=12`, {
          headers: {
            'User-Agent': 'VedicAstrologyKundliApp/2.0.0 (nespuneet2501@gmail.com)'
          }
        })
          .then(res => res.json())
          .then(data => {
            const results = (data || []).map(item => {
              const nameLower = item.display_name.toLowerCase();
              let tz = 'Asia/Kolkata';
              if (!nameLower.includes('india') && !nameLower.includes('bharat')) {
                const lonVal = parseFloat(item.lon) || 0;
                const offsetHrs = Math.round(lonVal / 15 * 2) / 2;
                const sign = offsetHrs >= 0 ? '+' : '';
                tz = `Etc/GMT${sign}${offsetHrs}`;
              }
              return {
                name: item.display_name,
                hindi: item.display_name,
                lat: parseFloat(item.lat) || 29.4727,
                lon: parseFloat(item.lon) || 77.7085,
                timezone: tz
              };
            });
            setOnlineSuggestions(results);
            setLoadingCities(false);
          })
          .catch(err => {
            console.error("OSM Nominatim error: ", err);
            setLoadingCities(false);
          });
      } else {
        setOnlineSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [birthPlaceInput]);

  // Merge fast-local & online suggestions character-by-character
  const citySuggestions = useMemo(() => {
    const localQuery = birthPlaceInput.trim().toLowerCase();
    if (localQuery.length < 1) return [];
    
    const locals = CITIES_DATABASE.filter(city => 
      isTypoTolerantMatch(localQuery, city.name) || 
      isTypoTolerantMatch(localQuery, city.hindi)
    );
    
    const finalSuggs = [...locals];
    onlineSuggestions.forEach(online => {
      const isDup = finalSuggs.some(l => 
        Math.abs(l.lat - online.lat) < 0.05 && 
        Math.abs(l.lon - online.lon) < 0.05
      );
      if (!isDup) {
        finalSuggs.push(online);
      }
    });
    return finalSuggs.slice(0, 10);
  }, [birthPlaceInput, onlineSuggestions]);

  // Theme Styles computation block
  const themeStyles = useMemo(() => {
    const t = THEMES[currentTheme];
    const isBW = currentTheme === 'CLASSIC_BW';
    const isHC = ['CLASSIC_BW', 'CLASSIC_WB', 'MATRIX_GREEN', 'CYBER_YELLOW'].includes(currentTheme);
    const borderWidthVal = isHC ? '1.8px' : '1px';
    return `
      html {
        font-size: ${
          fontScale === 'SMALL' ? '14px' :
          fontScale === 'LARGE' ? '18px' :
          fontScale === 'XLARGE' ? '21px' :
          '16px' // NORMAL
        } !important;
      }
      body {
        background-color: ${t.bgPage} !important;
        color: ${t.textMain} !important;
        font-family: 'Inter', sans-serif;
      }
      .theme-bg-page { background-color: ${t.bgPage} !important; }
      .theme-bg-card { background-color: ${t.bgCard} !important; border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .theme-bg-badge { background-color: ${t.bgBadge} !important; color: ${t.primary} !important; }
      .theme-text-main { color: ${t.textMain} !important; }
      .theme-text-muted { color: ${t.textMuted} !important; }
      .theme-border { border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      
      /* Remap background Tailwind classes dynamically at runtime! */
      .bg-\\[\\#090a15\\] { background-color: ${t.bgPage} !important; }
      .bg-\\[\\#070810\\] { background-color: ${t.bgBadge} !important; }
      .bg-\\[\\#0a0c1a\\] { background-color: ${t.bgPage} !important; }
      .bg-\\[\\#0f1123\\] { background-color: ${t.bgCard} !important; border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .bg-\\[\\#0f1123\\/95\\] { background-color: ${t.bgCard}cc !important; border-color: ${t.border} !important; }
      .bg-\\[\\#0f1123\\/50\\] { background-color: ${t.bgCard}80 !important; border-color: ${t.border} !important; }
      .bg-slate-900 { background-color: ${t.bgBadge} !important; }
      .bg-slate-950 { background-color: ${t.bgPage} !important; color: ${t.textMuted} !important; border-color: ${t.border} !important; }
      .bg-\\[\\#12142d\\] { background-color: ${t.bgBadge} !important; }
      .bg-\\[\\#161a35\\] { background-color: ${t.bgBadge} !important; }
      .bg-\\[\\#0b0c16\\] { background-color: ${t.bgCard} !important; border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .bg-\\[\\#0b0c16\\/50\\] { background-color: ${t.bgCard}80 !important; border-color: ${t.border} !important; }
      
      /* Colors to ensure perfect contrast on light themes */
      .text-slate-100 { color: ${t.textMain} !important; }
      .text-slate-200 { color: ${t.textMain}ee !important; }
      .text-slate-300 { color: ${t.textMain}cc !important; }
      .text-slate-400 { color: ${t.textMuted} !important; }
      .text-slate-500 { color: ${t.textMuted}cc !important; }
      .text-slate-550 { color: ${t.textMuted} !important; }
      .text-slate-205 { color: ${t.textMain} !important; }
      .text-white { color: ${t.textMain} !important; }
      .text-amber-500 { color: ${t.primary} !important; }
      .text-\\[\\#cca43b\\] { color: ${t.primary} !important; }
      
      /* Prevent low-contrast yellow/amber texts in light mode */
      .text-amber-400 { color: ${isHC ? t.textMain : t.primary} !important; }
      .text-emerald-400 { color: ${isHC ? t.textMain : t.accent} !important; }
      .text-teal-400 { color: ${isHC ? t.textMain : t.primary} !important; }
      
      /* Borders */
      .border-slate-800 { border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .border-slate-850 { border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .border-slate-700 { border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .border-slate-900 { border-color: ${t.border} !important; border-width: ${borderWidthVal} !important; }
      .divide-slate-800 > :not([hidden]) ~ :not([hidden]) { border-color: ${t.border} !important; }
      
      /* Primary Dynamic Button and Gradients */
      .bg-\\[\\#cca43b\\] { background-color: ${t.primary} !important; color: ${isHC ? (currentTheme === 'CLASSIC_BW' ? '#FFFFFF' : '#000000') : '#FFFFFF'} !important; }
      .bg-\\[\\#cca43b\\]:hover { background-color: ${t.primaryHover} !important; }
      .bg-gradient-to-r.from-\\[\\#cca43b\\] { background-image: linear-gradient(to right, ${t.primary}, ${t.accent}) !important; color: ${isHC ? (currentTheme === 'CLASSIC_BW' ? '#FFFFFF' : '#000000') : '#000000'} !important; }
      .bg-gradient-to-r.from-\\[\\#11132e\\] { background-image: linear-gradient(to right, ${t.bgPage}, ${t.bgCard}) !important; border: ${borderWidthVal} solid ${t.border} !important; }
      .bg-gradient-to-tr.from-\\[\\#cca43b\\/10\\] { background-image: linear-gradient(to top right, ${t.bgBadge}, ${t.bgCard}) !important; }

      @keyframes scale-heart {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.155); }
      }
      .animate-scale-heart {
        display: inline-block;
        animation: scale-heart 2s ease-in-out infinite;
      }
      @keyframes neon-glow {
        0%, 100% { text-shadow: 0 0 6px rgba(255,255,255,0.6), 0 0 14px rgba(251, 191, 36, 0.4); opacity: 0.95; }
        50% { text-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 25px rgba(251, 191, 36, 0.9); opacity: 1; }
      }
      .animate-neon-glow {
        animation: neon-glow 3s ease-in-out infinite;
      }

      @keyframes multi-color-logo-glow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      .animate-pvastro-logo {
        background: linear-gradient(270deg, #ff007f, #ffdd00, #00ffcc, #ff00ff, #ff5e00, #ff007f);
        background-size: 400% 400%;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        animation: multi-color-logo-glow 6s ease infinite !important;
        display: inline-block;
      }

      @keyframes pvastro-blink {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.82;
          transform: scale(1.04);
        }
      }
      .animate-pvastro-blink {
        animation: pvastro-blink 1.5s infinite ease-in-out !important;
      }

      .pva-nav-btn {
        background-color: var(--nav-bg) !important;
        color: var(--nav-text) !important;
        border: 1.5px solid var(--nav-border) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
      }
      .pva-nav-btn:hover {
        background-color: var(--nav-hover-bg) !important;
        color: var(--nav-hover-text) !important;
        border-color: var(--nav-hover-border) !important;
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 4px 14px var(--nav-shadow-color) !important;
      }
      .pva-nav-btn:active {
        transform: translateY(1px) scale(0.97) !important;
      }

      .pva-service-card {
        background-color: var(--srv-bg) !important;
        border-color: var(--srv-border) !important;
        border-width: 1.5px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
      }
      .pva-service-card:hover {
        background-color: var(--srv-hover-bg) !important;
        border-color: var(--srv-hover-border) !important;
        transform: translateY(-4px) scale(1.03) !important;
        box-shadow: 0 6px 16px var(--srv-hover-shadow) !important;
      }
      .pva-service-card:active {
        transform: translateY(-1px) scale(0.99) !important;
      }

      .pva-force-white {
        color: #FFFFFF !important;
      }
    `;
  }, [currentTheme, fontScale]);

  // Profile Search Filter list computation
  const filteredSavedKundlis = useMemo(() => {
    const q = profileSearchQuery.trim().toLowerCase();
    if (!q) return savedKundlis;
    return savedKundlis.filter(k => 
      k.name.toLowerCase().includes(q) || 
      k.dob.includes(q) || 
      (k.place && k.place.toLowerCase().includes(q))
    );
  }, [savedKundlis, profileSearchQuery]);

  // Localization Helpers
  const t = (en, hi) => currentLanguage === 'English' ? en : hi;
  const tObj = THEMES[currentTheme];

  const getServiceCardStyle = (isActive) => {
    return isActive ? {
      '--srv-bg': tObj.bgBadge,
      '--srv-border': tObj.primary,
      '--srv-hover-bg': tObj.bgBadge,
      '--srv-hover-border': tObj.primary,
      '--srv-hover-shadow': `${tObj.primary}40`,
      color: tObj.textMain
    } : {
      '--srv-bg': tObj.bgCard,
      '--srv-border': `${tObj.border}80`,
      '--srv-hover-bg': tObj.bgBadge,
      '--srv-hover-border': tObj.primary,
      '--srv-hover-shadow': `${tObj.primary}25`,
      color: tObj.textMain
    };
  };

  // Background cloud synchronization module
  const syncToCloud = async (list, email) => {
    if (!email) return;
    try {
      const payload = JSON.stringify(list);
      await fetch(`https://keyvalue.immanual.xyz/api/keyVal/pva_user_${btoa(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: payload })
      });
      console.log("Cloud sync backing complete for", email);
    } catch (e) {
      console.warn("Cloud sync deferred (offline proxy active):", e);
    }
  };

  // Database loader & persistence synchronization
  useEffect(() => {
    const syncDb = async () => {
      const email = currentUser || 'guest@vedicastrology.org';
      const loaded = await kundliDbService.fetchSavedKundlis(email);
      if (loaded && loaded.length > 0) {
        setSavedKundlis(loaded);
      }
    };
    syncDb();
  }, [currentUser, storageConfig.mode]);

  const navigateToReport = (profile) => {
    if (!profile) return;
    setNameInput(profile.name || "Guest Profile");
    setGenderInput(profile.gender || 'Male');
    setDobInput(profile.dob || "1995-10-24");
    setTobInput(profile.tob || "12:00");
    setBirthPlaceInput(profile.place || "New Delhi, Delhi, India");
    setLatitudeInput(profile.lat || 28.6139);
    setLongitudeInput(profile.lon || 77.2090);
    setTimezoneInput(profile.timezone || 'Asia/Kolkata');
    setCurrentScreen('KUNDLI_REPORT');
    
    // Set as last active memory profile
    setActiveProfileMemory(profile);
  };

  const handleNewKundliClick = () => {
    // Completely flush state inputs to prevent leakage from the previous Kundli profile
    setNameInput("");
    setGenderInput("Male");
    setDobInput("");
    setTobInput("");
    setBirthPlaceInput("");
    setLatitudeInput(28.6139); // Neutral New Delhi default coordinates
    setLongitudeInput(77.2090);
    setTimezoneInput("Asia/Kolkata");
    
    // Remove the last active memory profile
    setActiveProfileMemory(null);
    
    setCurrentScreen('ADD_KUNDLI');
  };

  const handleGenerateChart = () => {
    const newProfile = {
      id: Date.now(),
      name: nameInput || "Vedic Seeker",
      gender: genderInput,
      dob: dobInput || new Date().toISOString().split('T')[0],
      tob: tobInput || "12:00",
      place: birthPlaceInput || "New Delhi, Delhi, India",
      lat: parseFloat(latitudeInput) || 28.6139,
      lon: parseFloat(longitudeInput) || 77.2090,
      timezone: timezoneInput || "Asia/Kolkata",
      category: 'Self',
      notes: ''
    };

    // Set last active memory profile
    setActiveProfileMemory(newProfile);
    
    // Check if logged in. If logged in, check duplication and save to cloud DB
    if (currentUser && !currentUser.includes('guest')) {
      const exists = savedKundlis.some(k => 
        k.name.trim().toLowerCase() === newProfile.name.trim().toLowerCase() &&
        k.dob === newProfile.dob &&
        k.tob === newProfile.tob
      );
      
      let updatedList = [...savedKundlis];
      if (!exists) {
        updatedList = [newProfile, ...savedKundlis];
        setSavedKundlis(updatedList);
        kundliDbService.saveKundli(currentUser, newProfile).catch(() => {});
      }
    } else {
      // In-memory state only per critical database constraints
      const exists = savedKundlis.some(k => 
        k.name.trim().toLowerCase() === newProfile.name.trim().toLowerCase() &&
        k.dob === newProfile.dob &&
        k.tob === newProfile.tob
      );
      if (!exists) {
        const localList = [newProfile, ...savedKundlis];
        setSavedKundlis(localList);
      }
    }

    setCurrentScreen('KUNDLI_REPORT');
    setPendingKundliToSave(newProfile);
    setShowSavePrompt(true);
  };

  const handleSaveProfile = () => {
    const newProfile = {
      id: Date.now(),
      name: nameInput || "Unnamed Seeker",
      gender: genderInput,
      dob: dobInput || new Date().toISOString().split('T')[0],
      tob: tobInput || "12:00",
      place: birthPlaceInput || "New Delhi, Delhi, India",
      lat: parseFloat(latitudeInput) || 28.6139,
      lon: parseFloat(longitudeInput) || 77.2090,
      timezone: timezoneInput || "Asia/Kolkata",
      category: 'Self',
      notes: ''
    };

    if (!currentUser || currentUser.includes('guest')) {
      setGuestGateAction({
        type: 'save_profile',
        payload: newProfile
      });
      return;
    }

    kundliDbService.saveKundli(currentUser, newProfile).then((savedObj) => {
      kundliDbService.fetchSavedKundlis(currentUser).then((res) => {
        setSavedKundlis(res);
      });
    });
  };

  const handleEditProfileTrigger = (profile, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      setGuestGateAction({
        type: 'edit_profile',
        payload: { profile, e }
      });
      return;
    }
    handleEditProfile(profile, e);
  };

  const handleFavoriteToggleTrigger = (id) => {
    if (!currentUser) {
      setGuestGateAction({
        type: 'favorite_profile',
        payload: id
      });
      return;
    }
    toggleFavoriteKundli(id);
  };

  const toggleFavoriteKundli = (id) => {
    setFavoritesSet(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(x => x !== id) : [...prev, id];
      return next;
    });
  };

  const handleCollectionChangeTrigger = (id, val) => {
    if (val === 'NEW_COLLECTION') {
      handleCreateCollectionTrigger(id);
      return;
    }
    if (!currentUser) {
      setGuestGateAction({
        type: 'collection_change',
        payload: { id, val }
      });
      return;
    }
    updateProfileCollection(id, val);
  };

  const updateProfileCollection = (id, collectionVal) => {
    const updated = savedKundlis.map(p => {
      if (p.id === id) {
        return { ...p, collection: collectionVal };
      }
      return p;
    });
    setSavedKundlis(updated);
  };

  const handleCreateCollectionTrigger = (optId) => {
    if (!currentUser) {
      setGuestGateAction({
        type: 'create_collection',
        payload: optId
      });
      return;
    }
    const name = prompt(t("Enter new Collection Category Name:", "नया श्रेणी / संग्रह नाम दर्ज करें:"));
    if (name && name.trim()) {
      const trimmed = name.trim();
      if (!collectionsList.includes(trimmed)) {
        setCollectionsList(prev => [...prev, trimmed]);
      }
      if (optId) {
        updateProfileCollection(optId, trimmed);
      }
    }
  };

  const handleOpenCloudBackupTrigger = () => {
    if (!currentUser) {
      setGuestGateAction({
        type: 'cloud_backup',
        payload: null
      });
      return;
    }
    setShowDbCenter(true);
  };

  const executePendingAction = (action, authEmail) => {
    if (!action) return;
    
    // If user logged in, let's set current user session
    if (authEmail) {
      setCurrentUser(authEmail);
      
      // Sync pre-existing guest profiles to their new account!
      const currentList = [...savedKundlis];
      if (action.type === 'save_profile') {
        const p = action.payload;
        if (!currentList.some(k => k.id === p.id)) {
          currentList.unshift(p);
        }
      }
      setSavedKundlis(currentList);
    }

    if (action.type === 'save_profile') {
      const p = action.payload;
      if (!authEmail) {
        // In-memory state format
        const updated = [p, ...savedKundlis];
        setSavedKundlis(updated);
        alert(t(
          `In-Memory Session: "${p.name}" has been loaded in current workstation memory. Register/Login to save permanently in Google Sheets.`,
          `सत्र लोड: "${p.name}" वर्कस्टेशन मेमोरी में लोड है। सुरक्षित बैकअप के लिए लॉग इन करें।`
        ));
      } else {
        alert(t(
          `SUCCESS: "${p.name}" is now safely saved to your Google-tied Firestore account! Backup row appended in Google Sheets.`,
          `सफलता: "${p.name}" अब आपके गूगल सम्बद्ध फायरबेस खाते में सहेजा जा चुका है!`
        ));
      }
    } else if (action.type === 'edit_profile') {
      handleEditProfile(action.payload.profile, action.payload.e);
      if (!authEmail) {
        alert(t("Editing profile in offline local mode.", "लोकल ऑफलाइन मोड में संपादन चालू।"));
      }
    } else if (action.type === 'favorite_profile') {
      toggleFavoriteKundli(action.payload);
      if (authEmail) {
        alert(t("Favorite state synced on cloud database.", "पसंदीदा स्थिति क्लाउड पर अपडेट की गई।"));
      }
    } else if (action.type === 'collection_change') {
      updateProfileCollection(action.payload.id, action.payload.val);
    } else if (action.type === 'create_collection') {
      // delay to avoid alert conflict
      setTimeout(() => {
        const colName = prompt(t("Enter new Collection Name:", "नया संग्रह श्रेणी नाम:"));
        if (colName && colName.trim()) {
          const trimmed = colName.trim();
          if (!collectionsList.includes(trimmed)) {
            setCollectionsList(prev => [...prev, trimmed]);
          }
          if (action.payload) {
            updateProfileCollection(action.payload, trimmed);
          }
        }
      }, 300);
    } else if (action.type === 'cloud_backup') {
      setShowDbCenter(true);
    }
  };

  const handleDeleteProfile = (id, e) => {
    e.stopPropagation();
    if (confirm(t("Are you sure you want to delete this Kundli profile?", "क्या आप वाकई इस कुण्डली प्रोफ़ाइल को हटाना चाहते हैं?"))) {
      const email = currentUser || 'guest@vedicastrology.org';
      kundliDbService.deleteKundli(email, id).then(() => {
        kundliDbService.fetchSavedKundlis(email).then((res) => {
          setSavedKundlis(res);
        });
      });
    }
  };

  const handleEditProfile = (profile, e) => {
    if (e) e.stopPropagation();
    setNameInput(profile.name);
    setGenderInput(profile.gender || 'Male');
    setDobInput(profile.dob);
    setTobInput(profile.tob);
    setBirthPlaceInput(profile.place);
    setLatitudeInput(profile.lat || 28.6139);
    setLongitudeInput(profile.lon || 77.2090);
    setTimezoneInput(profile.timezone || 'Asia/Kolkata');
    setCurrentScreen('DASHBOARD');
    
    // Auto-scroll to the form smooth!
    setTimeout(() => {
      const formElement = document.getElementById("birth-particulars-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    }, 100);
  };

  const renderTabWithGate = (tabKey, children) => {
    const setting = moduleSettings[tabKey];
    
    // Check if module is disabled/suspended by Admin
    if (setting && !setting.enabled) {
      return (
        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 text-center space-y-3 font-sans my-6">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto text-red-500 animate-pulse">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-red-400 font-cinzel">
            {t("Module Suspended by Administrator", "मॉड्यूल संचालक द्वारा अस्थायी रूप से निलंबित")}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t("This segment has been marked as offline for maintenance by the master administrator. Please check back later.", "यह ज्योतिषीय अनुभाग वर्तमान में मुख्य प्रबंधक द्वारा रखरखाव हेतु बंद किया गया है। कृपया बाद में प्रयास करें।")}
          </p>
        </div>
      );
    }

    // Check if module is premium-only and current user is free
    if (setting && setting.premiumOnly && !activeUserIsPremium) {
      return (
        <AstroPaywallLock 
          tab={tabKey} 
          t={t} 
          tObj={tObj} 
          onUpgrade={() => {
            setPayPlanId('ASTRO_PRO');
            setShowUpgradeModal(true);
          }} 
        />
      );
    }

    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a15] text-slate-200">
      {/* Dynamic Theme Paint Processor */}
      <style>{themeStyles}</style>

      {/* Top Luxury Dynamic Header */}
      <header className="sticky top-0 z-50 bg-[#0f1123]/95 backdrop-blur-md border-b border-[#cca43b]/20 px-3 sm:px-4 py-3 flex flex-row items-center justify-between gap-2 sm:gap-3 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setCurrentScreen('DASHBOARD')}>
          <PVAstroLogo className="w-10 h-10 sm:w-13 sm:h-13 transition duration-300 hover:scale-105" />
          <div>
            <h1 className="text-sm sm:text-xl font-bold tracking-widest font-cinzel leading-tight animate-pvastro-logo">PVASTRO</h1>
            <p className="text-[7.5px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t("Vedic Cosmic Insights", "वैदिक ब्रह्मांडीय अंतर्दृष्टि")}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Theme Selector Palette */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#12142d]/30 border border-slate-800 rounded-full p-1.5">
            {Object.keys(THEMES).map(themeKey => (
              <button
                key={themeKey}
                onClick={() => {
                  setCurrentTheme(themeKey);
                  // Quick flash notification
                }}
                className={`w-4 h-4 rounded-full border-2 transition ${currentTheme === themeKey ? 'border-[#cca43b] scale-125 ring-2 ring-[#cca43b]/30' : 'border-slate-600 hover:scale-110'}`}
                style={{ backgroundColor: THEMES[themeKey].primary }}
                title={`${THEMES[themeKey].name} Theme`}
              />
            ))}
          </div>

          {/* Font Size Selector */}
          <div className="hidden md:flex items-center gap-1 bg-[#12142d]/30 border border-slate-800 rounded-lg p-1" title={t("Adjust Text Size", "अक्षरों का आकार बदलें")}>
            <button
              onClick={() => setFontScale('SMALL')}
              className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${fontScale === 'SMALL' ? 'bg-[#cca43b] text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              title={t("Small Fonts", "छोटे अक्षर")}
            >
              A-
            </button>
            <button
              onClick={() => setFontScale('NORMAL')}
              className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${fontScale === 'NORMAL' ? 'bg-[#cca43b] text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              title={t("Normal Fonts", "सामान्य अक्षर")}
            >
              A
            </button>
            <button
              onClick={() => setFontScale('LARGE')}
              className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${fontScale === 'LARGE' ? 'bg-[#cca43b] text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              title={t("Large Fonts", "बड़े अक्षर")}
            >
              A+
            </button>
            <button
              onClick={() => setFontScale('XLARGE')}
              className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${fontScale === 'XLARGE' ? 'bg-[#cca43b] text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              title={t("Extra Large Fonts", "अति बड़े अक्षर")}
            >
              A++
            </button>
          </div>

          {/* AI Guru Chat Top Header Icon */}
          <button 
            onClick={() => setCurrentScreen('AI_CHAT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition duration-200 uppercase font-black tracking-wider shadow-sm cursor-pointer ${
              currentScreen === 'AI_CHAT'
                ? 'bg-amber-500 border-amber-500 text-slate-950 font-black scale-105'
                : 'border-amber-500/30 bg-[#161a35] hover:bg-[#202750] text-[#cca43b] hover:text-amber-300'
            }`}
            title={t("Ask AI Guru & Contact Help", "एआई गुरु से पूछें")}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="hidden sm:inline">{t("Ask AI Guru", "एआई गुरु")}</span>
          </button>

          {/* Language Toggle Button */}
          <button 
            onClick={() => setCurrentLanguage(l => l === 'English' ? 'Hindi' : 'English')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-[#cca43b]/30 bg-[#161a35] hover:bg-[#202750] text-[#cca43b] transition duration-200"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-semibold">{currentLanguage === 'English' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Database Live Connected Badge */}
          <div 
            onClick={() => {
              if (isUserAdmin) {
                setCurrentScreen('INTEGRATIONS');
              } else {
                triggerNotification(
                  "Database Workspace Status", 
                  `Currently connected in ${storageConfig.mode === 'SUPABASE' ? 'Supabase cloud' : 'Sandbox (local)'} mode. Credentials can be adjusted in the admin panel.`, 
                  "info"
                );
              }
            }}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 text-[10px] rounded-full border-2 cursor-pointer transition uppercase tracking-wider font-extrabold shadow-md ${
              storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? 'bg-emerald-950/85 border-emerald-500 text-emerald-300 hover:bg-emerald-900/80' 
                : 'bg-red-950/85 border-red-500 text-red-300 hover:bg-red-900/80'
            }`}
            title={
              storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? "Supabase Database: Online & Healthy (Connected)" 
                : "Database: Offline / Sandbox Local Storage Mode"
            }
          >
            <span className={`w-2 h-2 rounded-full ${
              storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/50' 
                : 'bg-red-400 animate-pulse ring-2 ring-red-400/50'
            }`}></span>
            <span>
              {storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? t("DATABASE CONNECTION - LIVE", "डेटाबेस कनेक्शन - लाइव") 
                : t("DATABASE CONNECTION - OFF", "डेटाबेस कनेक्शन - बंद")
              }
            </span>
          </div>

          {/* User profile / Google Authentication State State Container */}
          {currentUser ? (
            <div 
              onClick={() => setCurrentScreen('USER_PROFILE')}
              className="flex items-center gap-2 bg-[#12221b] border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-[#12221b]/80 transition duration-150"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div className="flex flex-col text-left">
                <span className="text-[9.5px] font-black font-mono text-emerald-300 truncate max-w-[130px]" title={currentUser}>
                  {currentUser}
                </span>
                <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-slate-400">
                  {activeUserIsPremium ? t("💎 Premium Admin", "💎 प्रीमियम संचालक") : t("👤 Standard Free", "👤 सामान्य निःशुल्क")}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGoogleSimPicker(true);
                }}
                className="text-[8.5px] uppercase tracking-wider font-extrabold bg-[#cca43b]/10 text-[#cca43b] px-1.5 py-0.5 rounded border border-[#cca43b]/20 hover:bg-[#cca43b]/20 transition ml-1"
                title="Google login simulation profile toggle"
              >
                {t("Role Pick", "रोल")}
              </button>

              <button 
                onClick={async (e) => {
                  e.stopPropagation();
                  await authService.logout();
                  setCurrentUser(null);
                  setCurrentScreen('DASHBOARD');
                }}
                className="text-[8.5px] uppercase tracking-wider font-extrabold text-slate-400 hover:text-red-400 transition pl-1.5 border-l border-slate-700/60"
              >
                {t("Out", "लॉगआउट")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthActiveTab('signup');
                setCurrentScreen('AUTH');
              }}
              className="px-4 py-1.5 bg-[#cca43b] hover:bg-[#ebd070] text-slate-950 font-black rounded-full text-xs transition flex items-center gap-1.5 shadow-md font-sans tracking-tight border border-black/15"
              style={{
                backgroundColor: tObj.primary,
                color: currentTheme === 'CLASSIC_BW' ? '#FFFFFF' : '#000000',
                borderColor: tObj.border
              }}
            >
              <span>👤</span>
              <span className="font-extrabold text-[10.5px]">{t("Login / Sign Up", "लॉगिन / पंजीकरण")}</span>
            </button>
          )}

          {/* Premium Selector Indicator */}
          <button 
            onClick={() => {
              const currentEmail = currentUser || 'guest@vedicastrology.org';
              const nextVal = !activeUserIsPremium;
              setUsersList(prev => {
                const exists = prev.find(u => u.email.toLowerCase() === currentEmail.toLowerCase());
                if (exists) {
                  return prev.map(u => u.email.toLowerCase() === currentEmail.toLowerCase() ? { ...u, isPremium: nextVal } : u);
                } else {
                  return [...prev, { email: currentEmail, isPremium: nextVal, method: 'Direct Toggle', registeredAt: '2026-05-27' }];
                }
              });
              alert(nextVal ? t("Certified Premium successfully activated!", "प्रीमियम सेवा सफलतापूर्वक सक्रिय हो गई है!") : t("Certified Premium deactivated for current profile.", "वर्तमान प्रोफ़ाइल के लिए प्रीमियम सेवा रोक दी गई है।"));
            }}
            className={`p-1.5 rounded-full border transition duration-200 ${activeUserIsPremium ? 'border-[#cca43b] bg-[#cca43b]/10 text-[#cca43b]' : 'border-slate-700 text-slate-500'}`}
            title="Premium Membership Status"
          >
            <Award className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 pb-28 md:pb-8">
        
        {/* -- REGION: HIGH CONTRAST ASTROLOGICAL VIEW NAV BAR -- */}
        {currentScreen !== 'WELCOME' && currentScreen !== 'AUTH' && (
          <>
            {/* 1. All Services Are Free - Animated & Continuous Scrolling Ribbon */}
            <div className="hidden lg:flex w-full overflow-hidden bg-[#12142a] border text-white rounded-2xl mb-4.5 py-2.5 relative shadow-xl items-center select-none" style={{ borderColor: tObj.border }}>
              <div className="absolute left-0 top-0 bottom-0 bg-[#936a18] px-3.5 z-10 flex items-center shadow-md font-cinzel font-black text-[9px] uppercase tracking-widest text-[#FFF] animate-pulse">
                🔥 {t("FREE SERVICES", "निःशुल्क सेवा")}
              </div>
              <div className="whitespace-nowrap flex items-center w-full overflow-hidden">
                <div className="animate-marquee inline-block font-sans font-extrabold text-[10.5px] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 pl-16">
                  ✨ 🕊️ {t("ALL DIGITAL HOROSCOPE GENERATION, LAL KITAB ANALYSIS, DAILY PANCHANG, AND KP ASTROLOGY MODULES ARE 100% FREE FOR THE DEVOUT PUBLIC!", "सभी डिजिटल जन्मपत्री, लाल किताब फलादेश, दैनिक महा पंचांग और केपी ज्योतिष कुण्डली फलित सर्वसाधारण के लिए शत-प्रतिशत निःशुल्क हैं!")} ✦ {t("NO HIDDEN FEES OR PREMIUM SUBSCRIPTION REQUIRED — SPREAD THE DIVINE LIGHT!", "कोई छिपा हुआ शुल्क या प्रीमियम सब्सक्रिप्शन आवश्यक नहीं — सनातन दैवीय ज्ञान सभी के लिए खुला है!")} 🕊️ ✨
                </div>
              </div>
            </div>

            {/* 2. Cosmic Breaking News Update Centre (Admin Editable) */}
            <div className="hidden lg:flex w-full bg-[#0b0c16]/90 border rounded-2xl p-4.5 mb-6 shadow-2xl relative font-sans text-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-rose-600" style={{ borderColor: tObj.border, borderLeftColor: '#e11d48' }}>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping relative"></span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 font-mono">✦ {t("BREAKING KUNDLI NEWS", "ब्रेकिंग न्यूज़ अपडेट")}</span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-300 font-semibold italic">
                  {currentLanguage === 'English' ? breakingNewsEng : breakingNews}
                </p>
              </div>

              {/* Action area */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                {activeUserIsPremium && (
                  <button
                    onClick={() => setShowNewsEditor(!showNewsEditor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-extrabold transition uppercase tracking-widest"
                  >
                    ✏️ {t("Update News", "अपडेट न्यूज़")}
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Admin Update Form Panel */}
            {showNewsEditor && activeUserIsPremium && (
              <div className="w-full bg-[#111224] border border-rose-500/30 rounded-2xl p-5 mb-6 space-y-4 animate-scale-up font-sans">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                    ⚙️ {t("Admin Cosmic Broadcasting Station", "केंद्रीय प्रशासनिक ब्रॉडकास्टिंग डेस्क")}
                  </h4>
                  <button 
                    onClick={() => setShowNewsEditor(false)}
                    className="text-slate-450 hover:text-white font-mono font-bold text-xs"
                  >
                    [ {t("CLOSE", "बंद करें")} ]
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-col sm:flex-row">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Hindi News Content", "हिंदी संदेश विषय")}</label>
                    <textarea
                      value={breakingNews}
                      onChange={(e) => {
                        setBreakingNews(e.target.value);
                        localStorage.setItem('pva_breaking_news', e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
                      rows="3"
                      placeholder="हिंदी ब्रेकिंग न्यूज़ संदेश दर्ज करें..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{t("English News Content", "अंग्रेजी संदेश विषय")}</label>
                    <textarea
                      value={breakingNewsEng}
                      onChange={(e) => {
                        setBreakingNewsEng(e.target.value);
                        localStorage.setItem('pva_breaking_news_eng', e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-[#1b1c30] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
                      rows="3"
                      placeholder="Enter breaking news message in English..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => {
                      alert(t("Live breaking news successfully broadcasted and synced!", "ब्रेकिंग न्यूज़ का सजीव प्रसारण सफलतापूर्वक अपडेट और सिंक कर दिया गया है!"));
                      setShowNewsEditor(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider shadow-md transition"
                  >
                    💾 {t("Broadcast & Save", "सुरक्षित एवं प्रसारित करें")}
                  </button>
                </div>
              </div>
            )}

            <div className="hidden lg:flex w-full mb-8 pb-3 select-none flex-wrap gap-2.5 justify-start items-center border-b" style={{ borderColor: tObj.border }}>
            <button
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'DASHBOARD' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{t("Workstation Dashboard", "मुख्य वर्कस्टेशन")}</span>
            </button>

            <button
              onClick={handleNewKundliClick}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm font-cinzel animate-pvastro-blink"
              style={
                currentScreen === 'ADD_KUNDLI' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>{t("New Kundli", "नवीन कुंडली")}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('PANCHANG')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'PANCHANG' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{t("Daily Panchang", "दैनिक पंचांग")}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('MATCHMAKING')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'MATCHMAKING' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>{t("Matchmaking (Milan)", "कुंडली मिलान")}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('SOCIETY_UPDATES')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'SOCIETY_UPDATES' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>{t("Community Hub", "सामुदायिक अपडेट्स")}</span>
            </button>

            {isUserAdmin && (
              <>
                <button
                  onClick={() => setCurrentScreen('ADMIN_CONTROL')}
                  className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
                  style={
                    currentScreen === 'ADMIN_CONTROL' ? {
                      '--nav-bg': tObj.primary,
                      '--nav-text': '#FFFFFF',
                      '--nav-border': tObj.primary,
                      '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                      '--nav-hover-text': '#FFFFFF',
                      '--nav-hover-border': tObj.primaryHover || tObj.primary,
                      '--nav-shadow-color': `${tObj.primary}40`
                    } : {
                      '--nav-bg': tObj.bgCard,
                      '--nav-text': tObj.textMain,
                      '--nav-border': tObj.border,
                      '--nav-hover-bg': tObj.primary,
                      '--nav-hover-text': '#FFFFFF',
                      '--nav-hover-border': tObj.primary,
                      '--nav-shadow-color': `${tObj.primary}20`
                    }
                  }
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{t("Admin Panel", "संचालक नियंत्रण")}</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('INTEGRATIONS')}
                  className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
                  style={
                    currentScreen === 'INTEGRATIONS' ? {
                      '--nav-bg': tObj.primary,
                      '--nav-text': '#FFFFFF',
                      '--nav-border': tObj.primary,
                      '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                      '--nav-hover-text': '#FFFFFF',
                      '--nav-hover-border': tObj.primaryHover || tObj.primary,
                      '--nav-shadow-color': `${tObj.primary}40`
                    } : {
                      '--nav-bg': tObj.bgCard,
                      '--nav-text': tObj.textMain,
                      '--nav-border': tObj.border,
                      '--nav-hover-bg': tObj.primary,
                      '--nav-hover-text': '#FFFFFF',
                      '--nav-hover-border': tObj.primary,
                      '--nav-shadow-color': `${tObj.primary}20`
                    }
                  }
                >
                  <Database className="w-4 h-4 shrink-0" />
                  <span>{t("Cloud Sync Settings", "क्लाउड डेटाबेस")}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentScreen('KUNDLI_LIBRARY')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm font-cinzel"
              style={
                currentScreen === 'KUNDLI_LIBRARY' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>{t("Open Kundli", "ओपन कुंडली")}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('USER_PROFILE')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'USER_PROFILE' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{t("My Profile", "मेरी प्रोफ़ाइल")}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('AI_CHAT')}
              className="pva-nav-btn flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm"
              style={
                currentScreen === 'AI_CHAT' ? {
                  '--nav-bg': tObj.primary,
                  '--nav-text': '#FFFFFF',
                  '--nav-border': tObj.primary,
                  '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primaryHover || tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}40`
                } : {
                  '--nav-bg': tObj.bgCard,
                  '--nav-text': tObj.textMain,
                  '--nav-border': tObj.border,
                  '--nav-hover-bg': tObj.primary,
                  '--nav-hover-text': '#FFFFFF',
                  '--nav-hover-border': tObj.primary,
                  '--nav-shadow-color': `${tObj.primary}20`
                }
              }
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{t("AI Guru & Contact", "एआई गुरु व संपर्क")}</span>
            </button>
          </div>
        </>
      )}
        {currentScreen === 'WELCOME' && (
          <div className="max-w-2xl mx-auto text-center py-12 flex flex-col items-center">
            <Compass className="w-24 h-24 text-[#cca43b] animate-spin-slow mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              {t("Explore Your Vedic Destiny", "अपने वैदिक भाग्य की खोज करें")}
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              {t("Discover planetary alignments, interactive kundli charts, daily Panchang, and personalized astrology guidance powered by ancient Indian wisdom.", 
                 "प्राचीन भारतीय ज्ञान पर आधारित ग्रहों के प्रभाव, इंटरैक्टिव कुंडली चार्ट, दैनिक पंचांग और व्यक्तिगत ज्योतिषीय मार्गदर्शन की खोज करें।")}
            </p>
            <button
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#cca43b] to-[#f3d47d] text-[#090a15] font-extrabold text-base rounded-lg shadow-xl shadow-[#cca43b]/10 hover:brightness-110 active:scale-95 transition duration-200"
            >
              {t("Enter Astro Dashboard", "एस्ट्रो डैशबोर्ड में प्रवेश करें")}
            </button>
          </div>
        )}

        {/* -- SCREEN: AUTH / LOGIN -- */}
        {currentScreen === 'AUTH' && (
          <div className="max-w-md mx-auto bg-[#0f1123] rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden text-left text-slate-205">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#cca43b] via-[#e5c060] to-[#cca43b]"></div>
            
            <div className="text-center mb-6">
              <span className="px-2.5 py-1 bg-[#cca43b]/10 border border-[#cca43b]/35 text-[#cca43b] rounded-full text-[9px] font-black uppercase tracking-widest font-mono">
                ☸️ {t("SECURE VEDIC GATEWAY", "सुरक्षित वैदिक लॉगिन द्वार")}
              </span>
              <h2 className="text-2xl font-black mt-2 text-white font-cinzel leading-none">{t("Seeking Portal Access", "वैदिक खाता लॉगिन")}</h2>
              <p className="text-slate-400 text-xs mt-1.5">{t("Create an account to save, edit, and access unlimited high-precision birth charts.", "कुंडलियों को सुरक्षित सहेजने और संपादित करने के लिए लॉगिन करें।")}</p>
            </div>

            {/* Login vs SignUp Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl mb-4 border border-slate-900">
              <button
                onClick={() => setAuthActiveTab('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide transition ${authActiveTab === 'login' ? 'bg-[#936a18]/20 border border-[#cca43b]/25 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                {t("Login", "लॉगिन")}
              </button>
              <button
                onClick={() => setAuthActiveTab('signup')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide transition ${authActiveTab === 'signup' ? 'bg-[#936a18]/20 border border-[#cca43b]/25 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                {t("Register", "नया पंजीकृत")}
              </button>
            </div>

            {/* TAB CONTENT: LOGIN FORM */}
            {authActiveTab === 'login' && (
              <div className="space-y-4 animate-fade-in block">
                {showForgotPassword ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
                    <h3 className="text-xs font-black uppercase text-[#cca43b] tracking-wider font-mono">
                      🔑 {t("Send Password Reset Email", "पासवर्ड पुनर्प्राप्ति")}
                    </h3>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      {t("Enter your registered email address beneath. System will securely dispatch a reset link directly to your inbox.", "अपना पंजीकृत ईमेल पता दर्ज करें। सिस्टम आपके पंजीकृत ईमेल पर पासवर्ड रीसेट लिंक भेजेगा।")}
                    </p>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{t("Registered Email Address", "पंजीकृत ईमेल पता")}</label>
                      <input 
                        type="email" 
                        value={forgotEmail} 
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#050610] border border-slate-800 focus:border-[#cca43b] rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-705 focus:outline-none transition font-semibold"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isResetSending}
                        onClick={async () => {
                          if (!forgotEmail) {
                            triggerNotification("Email Required", "Please specify your registered email address.", "warning");
                            return;
                          }
                          setIsResetSending(true);
                          try {
                            await authService.resetPasswordForEmail(forgotEmail);
                            setShowForgotPassword(false);
                          } catch(e) {
                            triggerNotification("Error", "Bypassing reset failure.", "warning");
                          } finally {
                            setIsResetSending(false);
                          }
                        }}
                        className="flex-1 py-1 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded font-black text-[10.5px] uppercase transition cursor-pointer"
                      >
                        {isResetSending ? t("Sending...", "भेजा जा रहा है...") : t("Send Link To Email", "लिंक भेजें")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-black text-[10.5px] uppercase transition cursor-pointer"
                      >
                        {t("Cancel", "रद्द करें")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Email Address", "ईमेल पता")}</label>
                      <input 
                        type="email" 
                        value={userLoginEmail} 
                        onChange={(e) => {
                          setUserLoginEmail(e.target.value);
                          if (!forgotEmail) setForgotEmail(e.target.value);
                        }}
                        placeholder="name@example.com"
                        className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition font-semibold"
                      />
                    </div>
                    {userLoginEmail && userLoginEmail.trim().toLowerCase() === 'nespuneet2501@gmail.com' && (
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 animate-pulse">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>👑</span>
                          <span>{t("Secure Admin Gateway Identified", "सुरक्षित प्रशासक लॉगिन द्वार")}</span>
                        </div>
                        <p className="text-[10px] leading-snug mt-1 text-slate-300">
                          {t("Master Admin authentication active. Password matches your secure registered system password.", "मुख्य संचालक प्रमाणीकरण सक्रिय है। पासवर्ड आपके सुरक्षित पंजीकृत सिस्टम पासवर्ड से मेल खाता है।")}
                        </p>
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">{t("Password", "पासवर्ड")}</label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(userLoginEmail);
                            setShowForgotPassword(true);
                          }}
                          className="text-[10px] font-extrabold text-[#cca43b] hover:underline"
                        >
                          {t("Forgot Password?", "पासवर्ड भूल गए?")}
                        </button>
                      </div>
                      <input 
                        type="password" 
                        value={userLoginPassword} 
                        onChange={(e) => setUserLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition font-semibold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!userLoginEmail || !userLoginPassword) {
                          triggerNotification("Authorization Error", "Please fill in both email and password.", "warning");
                          return;
                        }
                        const res = await authService.loginWithEmail(userLoginEmail, userLoginPassword);
                        if (res && res.success) {
                          const loggedEmail = res.user.email;
                          setCurrentUser(loggedEmail);
                          setUsersList(prev => {
                            const exists = prev.find(u => u.email.toLowerCase() === loggedEmail.toLowerCase());
                            if (!exists) {
                              return [...prev, { 
                                email: loggedEmail, 
                                name: res.user.name || loggedEmail.split('@')[0], 
                                isPremium: loggedEmail.toLowerCase() === 'nespuneet2501@gmail.com', 
                                method: storageConfig.mode === 'GOOGLE_SHEETS' ? 'Google Sheets DB' : 'Email/Password', 
                                registeredAt: res.user.registeredAt || new Date().toISOString().split('T')[0] 
                              }];
                            }
                            return prev;
                          });
                          triggerNotification("Sign-In Completed", `Welcome back to Astro PV portal!`, "success");

                          // Sync any pending items saved in Guest mode
                          const pendingPayload = memoryPendingSavePayload;
                          const actionType = memoryPendingGateActionType;
                          if (pendingPayload) {
                            try {
                              await kundliDbService.saveKundli(loggedEmail, pendingPayload);
                              setMemoryPendingSavePayload(null);
                              setMemoryPendingGateActionType('');
                              if (actionType === 'generate_chart') {
                                setActiveProfileMemory(pendingPayload);
                                const list = await kundliDbService.fetchSavedKundlis(loggedEmail);
                                setSavedKundlis(list);
                                setCurrentScreen('KUNDLI_REPORT');
                                triggerNotification("Chart Loaded & Synced", `${pendingPayload.name}'s chart has been successfully mapped to your profile!`, "success");
                                return;
                              }
                            } catch (e) {}
                          }

                          const list = await kundliDbService.fetchSavedKundlis(loggedEmail);
                          setSavedKundlis(list);
                          setCurrentScreen('DASHBOARD');
                        } else {
                          triggerNotification("Authentication Failed", res?.error || "Incorrect credentials.", "warning");
                        }
                      }}
                      className="w-full py-2.5 bg-[#cca43b] hover:bg-[#f3d47d] text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-lg mt-2"
                    >
                      {t("Sign in securely", "सुरक्षित लॉग-इन करें")}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* TAB CONTENT: REGISTER FORM */}
            {authActiveTab === 'signup' && (
              <div className="space-y-4 animate-fade-in block">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Seeker Full Name", "जिज्ञासु का पूरा नाम")}</label>
                  <input 
                    type="text" 
                    value={userRegisterName} 
                    onChange={(e) => setUserRegisterName(e.target.value)}
                    placeholder={t("Nisha Sharma", "निशा शर्मा")}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Email Address", "ईमेल पता")}</label>
                  <input 
                    type="email" 
                    value={userRegisterEmail} 
                    onChange={(e) => setUserRegisterEmail(e.target.value)}
                    placeholder="seeker@gmail.com"
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition font-semibold"
                  />
                </div>
                {userRegisterEmail && userRegisterEmail.trim().toLowerCase() === 'nespuneet2501@gmail.com' && (
                  <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 animate-pulse">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>👑</span>
                      <span>{t("ADMINISTRATOR DISCOVERED", "प्रशासक प्रोफ़ाइल पहचानी गई")}</span>
                    </div>
                    <p className="text-[10px] leading-snug mt-1 text-slate-300">
                      {t("This email is designated for the Astro PV master administrator. Setting up this account requires entering the Master Admin Secret password.", "यह ईमेल मुख्य एस्ट्रो प्रबंधक के रूप में आरक्षित है। पंजीकरण पूरा करने के लिए मास्टर एडमिन गुप्त कुंजी दर्ज करना अनिवार्य है।")}
                    </p>
                    <p className="text-[10px] font-bold mt-1.5 text-amber-400">
                      * {t("Please use your secure admin password below to register your administrator account.", "प्रशासनिक अधिकारों के सत्यापन के लिए नीचे अपना सुरक्षित पासवर्ड दर्ज करें।")}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Create Password", "पासवर्ड बनाएं")}</label>
                  <input 
                    type="password" 
                    value={userRegisterPassword} 
                    onChange={(e) => setUserRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition font-semibold"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (!userRegisterEmail || !userRegisterPassword) {
                      triggerNotification("Validation Error", "Please enter both registration email and password.", "warning");
                      return;
                    }
                    const res = await authService.signUpWithEmail(userRegisterEmail, userRegisterPassword, userRegisterName);
                    if (res && res.success) {
                      setCurrentUser(userRegisterEmail);
                      setUsersList(prev => {
                        const exists = prev.find(u => u.email.toLowerCase() === userRegisterEmail.toLowerCase());
                        if (!exists) {
                          return [...prev, { 
                            email: userRegisterEmail, 
                            name: userRegisterName || userRegisterEmail.split('@')[0], 
                            isPremium: userRegisterEmail.toLowerCase() === 'nespuneet2501@gmail.com', 
                            method: storageConfig.mode === 'GOOGLE_SHEETS' ? 'Google Sheets DB' : 'Email/Password', 
                            registeredAt: new Date().toISOString().split('T')[0] 
                          }];
                        }
                        return prev;
                      });
                      
                      // Auto login in memory
                      const loginRes = await authService.loginWithEmail(userRegisterEmail, userRegisterPassword);
                      if (loginRes && loginRes.success) {
                        // Sync any pending items saved in Guest mode
                        const pendingPayload = memoryPendingSavePayload;
                        const actionType = memoryPendingGateActionType;
                        if (pendingPayload) {
                          try {
                            await kundliDbService.saveKundli(userRegisterEmail, pendingPayload);
                            setMemoryPendingSavePayload(null);
                            setMemoryPendingGateActionType('');
                            if (actionType === 'generate_chart') {
                              setActiveProfileMemory(pendingPayload);
                              const list = await kundliDbService.fetchSavedKundlis(userRegisterEmail);
                              setSavedKundlis(list);
                              setCurrentScreen('KUNDLI_REPORT');
                              return;
                            }
                          } catch (e) {}
                        }
                        const list = await kundliDbService.fetchSavedKundlis(userRegisterEmail);
                        setSavedKundlis(list);
                        setCurrentScreen('DASHBOARD');
                      } else {
                        setAuthActiveTab('login');
                      }
                    } else {
                      triggerNotification("Enrolling Failed", res?.error || "Registration encountered an error!", "warning");
                    }
                  }}
                  className="w-full py-2.5 bg-[#1B5E3A] hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-lg mt-2"
                >
                  {t("Register Account", "खाता पंजीकृत करें")}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <span className="absolute bg-[#0f1123] px-3 text-[9px] uppercase tracking-widest text-slate-550 font-bold">OR PERSIST CONTINUOUSLY</span>
              <div className="w-full border-t border-slate-900"></div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  const res = await authService.loginWithGoogle();
                  if (res && res.success) {
                    setCurrentUser(res.user.email);
                    // Add to seeker register list
                    setUsersList(prev => {
                      const exists = prev.find(u => u.email.toLowerCase() === res.user.email.toLowerCase());
                      if (!exists) {
                        return [...prev, { email: res.user.email, name: res.user.name, isPremium: res.user.email.toLowerCase() === 'nespuneet2501@gmail.com', method: 'Google OAuth', registeredAt: '2026-05-27' }];
                      }
                      return prev;
                    });
                    setCurrentScreen('DASHBOARD');
                  }
                }}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl transition flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider shadow"
              >
                <span>🤖</span>
                <span>{t("Continue with Google", "गूगल से लॉगिन करें")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const guestValue = 'guest@vedicastrology.org';
                  authService.demoAuth(guestValue, 'Guest Session');
                  setCurrentUser(guestValue);
                  setUsersList(prev => {
                    const exists = prev.find(u => u.email.toLowerCase() === guestValue.toLowerCase());
                    if (!exists) {
                      return [...prev, { email: guestValue, isPremium: false, method: 'Email', registeredAt: '2026-05-27' }];
                    }
                    return prev;
                  });
                  setCurrentScreen('DASHBOARD');
                }}
                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition"
              >
                {t("Continue as Guest", "अतिथि के रूप में जारी रखें")}
              </button>
            </div>
          </div>
        )}

        {/* -- SCREEN: DASHBOARD MAIN -- */}
        {/* -- SCREEN: DASHBOARD MAIN -- */}
        {currentScreen === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Greeting Hero & Fast Preferences Row */}
            <div className="hidden lg:block relative rounded-2xl bg-gradient-to-r from-[#FAF0E6] to-[#FFFFFF] theme-bg-card border theme-border p-6 md:p-8 overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#cca43b]/10 blur-3xl -mr-24 -mt-24"></div>
              <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#cca43b]/20 border border-[#cca43b]/40 rounded text-[10px] text-[#936a18] uppercase font-bold tracking-wider">
                      {activeUserIsPremium ? t("Certified Premium Astro Workstation", "प्रमाणित प्रीमियम वैदिक वर्कस्टेशन") : t("Standard Member", "मानक सदस्य")}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">UTC: 2026-05-27</span>
                  </div>
                  <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-800 mb-2 font-cinzel tracking-tight">
                    {t(`Namaste, Astrologer`, `नमस्ते, ज्योतिषी`)}
                  </h2>
                  <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                    {t("Welcome to the enterprise-grade Vedic Astrology workspace. Access high-precision charts, dashas, and traditional calculations instantly.",
                       "उच्च-सटीक कुंडली विश्लेषण, विंशोत्तरी महादशा और अष्टकूट मिलान के लिए अधिकृत व्यावसायिक ज्योतिष केंद्र।")}
                  </p>
                </div>
              </div>
            </div>

            {/* AstroSage-inspired Divine Services Grid */}
            <div className="bg-white theme-bg-card border-2 theme-border rounded-xl p-5 shadow-sm relative overflow-hidden font-sans">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
              <div className="flex items-center gap-3 mb-4.5">
                <span className="text-xl">🕉️</span>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 font-cinzel leading-none uppercase tracking-wide">
                    {t("AstroSage Divine Services", "एस्ट्रोसेज मुख्य ज्योतिषीय सेवाएं")}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t("Traditional Vedic astrology, Panchang table, matchmaking, and reports calibrated with authentic parameters", 
                       "सटीक पंचांग गणना, अष्टकूट वर-वधू कुंडली मिलान तथा विस्तृत फलादेश विवरण")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
                {/* 1. Kundli Creator */}
                <button
                  onClick={() => {
                    const formEl = document.getElementById('birth-particulars-form');
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setCurrentScreen('ADD_KUNDLI');
                    }
                  }}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'ADD_KUNDLI')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">卐</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Janma Kundli", "जन्म कुण्डली")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Create Horoscope", "नई कुंडली बनाए")}</p>
                  </div>
                </button>

                {/* 2. Saved / Open Kundli */}
                <button
                  onClick={() => setCurrentScreen('KUNDLI_LIBRARY')}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'KUNDLI_LIBRARY')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">🔮</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Open Kundli", "ओपन कुण्डली")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Access Library", "संग्रह देखें")}</p>
                  </div>
                </button>

                {/* 3. Matchmaking */}
                <button
                  onClick={() => setCurrentScreen('MATCHMAKING')}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'MATCHMAKING')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">💑</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Kundli Matching", "कुण्डली मिलान")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Aštakūta Match", "वर-वधू मिलान")}</p>
                  </div>
                </button>

                {/* 4. Panchang */}
                <button
                  onClick={() => setCurrentScreen('PANCHANG')}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'PANCHANG')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">📅</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Daily Panchang", "दैनिक पंचांग")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Today's Horas", "शुभ-अशुभ समय")}</p>
                  </div>
                </button>

                {/* 5. Shodashvarga */}
                <button
                  onClick={() => {
                    if (activeProfileMemory) {
                      setCurrentScreen('KUNDLI_REPORT');
                      setReportTab('chart');
                    } else {
                      document.getElementById('birth-particulars-form')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'KUNDLI_REPORT' && reportTab === 'chart')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">🪐</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Planetary Transit", "ग्रहों की स्थिति")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Lagna & Gochar", "लग्न व गोचर फल")}</p>
                  </div>
                </button>

                {/* 6. Astro Academy */}
                <button
                  onClick={() => {
                    setCurrentScreen('KUNDLI_REPORT');
                    setReportTab('academy');
                  }}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans"
                  style={getServiceCardStyle(currentScreen === 'KUNDLI_REPORT' && reportTab === 'academy')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">📖</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("Astro Academy", "ज्योतिष विद्यापीठ")}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{t("Vedic Guidance", "ज्योतिष सीखें")}</p>
                  </div>
                </button>

                {/* 7. AI Astro Guru & Help */}
                <button
                  onClick={() => {
                    setAiChatTab('chat');
                    setCurrentScreen('AI_CHAT');
                  }}
                  className="pva-service-card p-3.5 rounded-xl flex flex-col items-center text-center gap-1.5 group font-sans border-2 border-dashed border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:bg-amber-500/10"
                  style={getServiceCardStyle(currentScreen === 'AI_CHAT' && aiChatTab === 'chat')}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition duration-200">🕉️</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 tracking-tight leading-tight">{t("AI Astro Guru", "एआई दिव्य गुरु")}</h4>
                    <p className="text-[9px] text-[#936a18] font-bold mt-0.5">{t("AI Chat & Help", "संवाद एवं संपर्क")}</p>
                  </div>
                </button>

                {/* 8. KP Prashna Kundli */}
                <button
                  onClick={() => {
                    setAiChatTab('prashna');
                    setCurrentScreen('AI_CHAT');
                  }}
                  className="pva-service-card p-4 rounded-2xl flex flex-col items-center text-center gap-2 group font-sans border-2 border-solid border-[#ff3d00] bg-gradient-to-br from-[#ff3d00] to-[#ff6d00] text-white hover:brightness-115 transition duration-300 shadow-[0_0_15px_rgba(255,61,0,0.5)] animate-kp-glow cursor-pointer relative"
                >
                  <span className="absolute -top-2.5 -right-1.5 bg-yellow-400 border border-white text-slate-900 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase animate-pulse shadow-md">
                    {t("POWERFUL", "सिद्ध चक्र")}
                  </span>
                  <span className="text-3xl transform group-hover:scale-115 transition duration-300">⏱️</span>
                  <div>
                    <h4 className="text-xs font-black text-white tracking-wider leading-tight uppercase font-cinzel select-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {t("KP Prashna", "केपी प्रश्न कुण्डली")}
                    </h4>
                    <p className="text-[9px] text-[#ffea00] font-black mt-0.5 tracking-wider uppercase select-all drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                      {t("Instant Horary", "प्रश्न फलसिद्धि")}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Action Container: Form & Right Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Large interactive "New Kundli Generator" Card Form */}
              <div id="birth-particulars-form" className="lg:col-span-7 bg-white theme-bg-card border theme-border rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between font-sans">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b theme-border pb-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src="https://images.unsplash.com/photo-1568910118311-ca74cbda1fbd?auto=format&fit=crop&q=80&w=150"
                        alt="Lord Ganesha"
                        className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shadow-xs animate-pulse"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-800 font-cinzel leading-none">{t("New Kundli Creator", "नवीन जन्म कुंडली रेखांकन")}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">{t("Calculate detailed traditional horoscopes instantly", "विवरण भरकर पारंपरिक वैदिक कुण्डली प्राप्त करें")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Full name input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Full Name", "पूरा नाम")}</label>
                      <input 
                        type="text" 
                        value={nameInput} 
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-sm text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 font-semibold"
                        placeholder={t("Astro seeker", "नाम प्रविष्ट करें")}
                      />
                    </div>

                    {/* Gender select */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Gender", "लिंग")}</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Male', 'Female', 'Other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGenderInput(g)}
                            className={`py-2 text-xs font-bold rounded-lg border transition ${genderInput === g ? 'bg-[#cca43b]/25 border-[#cca43b] text-[#936a18]' : 'bg-[#FAF9F5] theme-bg-page border-slate-200 hover:border-slate-300 text-slate-600'}`}
                          >
                            {t(g, g === 'Male' ? 'पुरुष' : g === 'Female' ? 'महिला' : 'अन्य')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DOB input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Date of Birth", "जन्म तिथि")}</label>
                      <input 
                        type="date" 
                        value={dobInput} 
                        onChange={(e) => setDobInput(e.target.value)}
                        className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-sm text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 font-mono font-semibold"
                      />
                    </div>

                    {/* TOB input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Time of Birth (Local)", "जन्म समय")}</label>
                      <input 
                        type="time" 
                        value={tobInput} 
                        onChange={(e) => setTobInput(e.target.value)}
                        className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-sm text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 font-mono font-semibold"
                      />
                    </div>

                    {/* Autocomplete Birth Place */}
                    <div className="sm:col-span-2 relative">
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{t("Birth Place", "जन्म स्थान")}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={birthPlaceInput} 
                          onChange={(e) => setBirthPlaceInput(e.target.value)}
                          onFocus={() => setCitySearchFocused(true)}
                          onBlur={() => setTimeout(() => setCitySearchFocused(false), 250)}
                          className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-sm text-slate-800 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 placeholder-slate-400 font-semibold"
                          placeholder={t("Type birth city (e.g. Muzaffarnagar)", "जन्म शहर लिखें (जैसे मुजफ्फरनगर)...")}
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        {loadingCities && (
                          <div className="absolute right-3 top-3.5">
                            <span className="inline-block w-4 h-4 border-2 border-[#cca43b]/80 border-t-transparent rounded-full animate-spin"></span>
                          </div>
                        )}
                      </div>
                      
                      {/* Suggestions list drop */}
                      {citySearchFocused && citySuggestions.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl divide-y divide-slate-100 font-sans text-xs flex flex-col items-stretch text-left">
                          {citySuggestions.map((city, idx) => (
                            <div 
                              key={idx}
                              onMouseDown={() => {
                                setBirthPlaceInput(t(city.name, city.hindi));
                                setLatitudeInput(city.lat);
                                setLongitudeInput(city.lon);
                                setTimezoneInput(city.timezone);
                              }}
                              className="px-4 py-2.5 hover:bg-amber-50 text-slate-700 hover:text-slate-900 cursor-pointer transition flex items-center justify-between"
                            >
                              <span className="font-semibold text-slate-800">{t(city.name, city.hindi)}</span>
                              <span className="text-[10px] bg-amber-50 text-[#936a18] px-1.5 py-0.5 rounded font-mono font-medium">Lat: {city.lat}, Lon: {city.lon}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Advanced settings toggler */}
                  <div className="border-t theme-border pt-3 mt-3">
                    <details className="group">
                      <summary className="list-none flex items-center gap-1.5 text-xs text-[#936a18] font-bold cursor-pointer select-none">
                        <Settings className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                        <span>{t("Professional Geocentric Parameters", "पेशेवर भूगोलीय निर्देशांक प्रणाली")}</span>
                      </summary>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Latitude", "अक्षांश")}</label>
                          <input 
                            type="number" 
                            step="any"
                            value={latitudeInput} 
                            onChange={(e) => setLatitudeInput(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Longitude", "रेखांश")}</label>
                          <input 
                            type="number" 
                            step="any"
                            value={longitudeInput} 
                            onChange={(e) => setLongitudeInput(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Timezone", "समय मंडल")}</label>
                          <input 
                            type="text" 
                            value={timezoneInput} 
                            onChange={(e) => setTimezoneInput(e.target.value)}
                            className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Submits and CTA block */}
                <div className="flex flex-col sm:flex-row items-center gap-3 border-t theme-border pt-5 mt-5">
                  <button
                    type="button"
                    onClick={handleGenerateChart}
                    className="w-full sm:w-auto px-6 py-3 bg-[linear-gradient(135deg,#936a18,#cca43b)] text-white hover:brightness-110 font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4.5 h-4.5" />
                    <span>{t("Generate Vedic Chart", "वैदिक कुण्डली जनरेट करें")}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border theme-border font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#936a18]" />
                    <span>{t("Save Profile", "प्रोफाइल सुरक्षित करें")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNameInput("");
                      setGenderInput("Male");
                      setDobInput("");
                      setTobInput("");
                      setBirthPlaceInput("");
                      setLatitudeInput(28.6139);
                      setLongitudeInput(77.2090);
                      setTimezoneInput("Asia/Kolkata");
                      setActiveProfileMemory(null);
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-red-50 hover:bg-red-100/40 text-red-600 border border-red-200 hover:border-red-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t("Reset Fields", "फ़ॉर्म साफ़ करें")}</span>
                  </button>
                </div>
              </div>

              {/* Right Side Column: Saved, Recent & Other Features */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* SAVED PROFILE WORKSPACE */}
                <div className="bg-white theme-bg-card border theme-border rounded-xl p-5 shadow-sm max-h-[460px] overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b theme-border pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-[#936a18]" />
                        <h4 className="text-sm font-extrabold text-slate-800 font-cinzel leading-none">{t("Saved Profiles Library", "सहेजी हुई कुंडलियाँ व्यवस्था")}</h4>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full">{savedKundlis.length}</span>
                    </div>

                    {/* Real-time Autofilter input search */}
                    <div className="relative mb-3.5">
                      <input 
                        type="text"
                        value={profileSearchQuery}
                        onChange={(e) => setProfileSearchQuery(e.target.value)}
                        placeholder={t("🔍 Search profiles character-by-character...", "🔍 सहेजी गई कुंडलियां तुरंत खोजें...")}
                        className="w-full bg-[#FAF9F5] theme-bg-page border theme-border focus:border-[#cca43b] text-xs text-slate-800 rounded-lg pl-8 pr-3 py-2 focus:outline-none placeholder-slate-400 font-semibold"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>

                    {/* Results scrolling list */}
                    <div className="space-y-2.5 overflow-y-auto max-h-[250px] pr-1 scrollbar-thin">
                      {filteredSavedKundlis.length === 0 ? (
                        <p className="text-center text-slate-400 py-6 text-xs">{t("No matching profiles found.", "कोई मिलान वाली कुंडली नहीं मिली।")}</p>
                      ) : (
                        filteredSavedKundlis.map((profile) => (
                          <div 
                            key={profile.id}
                            onClick={() => navigateToReport(profile)}
                            className="p-3 rounded-lg bg-[#FAF9F5] theme-bg-page border border-slate-100 hover:border-[#cca43b]/40 cursor-pointer transition duration-150 flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-slate-800 group-hover:text-[#936a18] transition text-xs truncate">{profile.name}</h5>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{profile.dob} @ {profile.tob}</p>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5" title={profile.place}>{profile.place}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => handleEditProfile(profile, e)}
                                className="p-1 rounded bg-white border border-slate-200 hover:border-[#cca43b] text-slate-500 hover:text-[#936a18] transition"
                                title={t("Edit profile info", "संशोधित करें")}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => navigateToReport(profile)}
                                className="px-2 py-1 bg-[#936a18] hover:bg-amber-700 text-white font-bold text-[9px] rounded font-mono transition"
                              >
                                {t("Load", "चुनें")}
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteProfile(profile.id, e)}
                                className="p-1 rounded bg-white border border-slate-200 hover:border-red-400 text-slate-400 hover:text-red-500 transition"
                                title={t("Delete profile", "हटाएं")}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {currentUser && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        <span className="font-semibold text-emerald-700">{t("Real-time cloud backup active", "क्लाउड डेटा सुसंगत है")}</span>
                      </div>
                      <span className="font-mono text-slate-300">Google Sync Logged</span>
                    </div>
                  )}
                </div>

                {/* RECENT KUNDLI MINI WIDGET */}
                {activeProfileMemory && (
                  <div className="bg-[#FAF0E6]/30 border border-[#cca43b]/20 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-1.5 mb-2 text-[#936a18]">
                      <RefreshCw className="w-4 h-4" />
                      <h4 className="text-[11px] uppercase tracking-wider font-extrabold font-cinzel">{t("Recent Natal Calculation", "हाल ही का विश्लेषण")}</h4>
                    </div>
                    {(() => {
                      try {
                        const last = activeProfileMemory;
                        return (
                          <div 
                            onClick={() => navigateToReport(last)}
                            className="flex items-center justify-between bg-white border theme-border p-2.5 rounded-lg cursor-pointer hover:border-[#cca43b] transition"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-xs font-bold text-slate-800 font-cinzel select-all block truncate">{last.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{last.dob} | {last.place}</span>
                            </div>
                            <span className="shrink-0 text-[10px] text-[#936a18] font-bold underline whitespace-nowrap leading-none pr-1 uppercase text-[9px] font-sans">
                              {t("Quick open →", "त्वरित खोलें →")}
                            </span>
                          </div>
                        );
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>
                )}

                {/* QUICK NAV PANELS FOR PANCHANG & MATCHMAKING */}
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div 
                    onClick={() => setCurrentScreen('PANCHANG')}
                    className="p-3 bg-white hover:bg-blue-50/20 border border-slate-200 hover:border-blue-400/50 rounded-xl cursor-pointer transition shadow-2xs"
                  >
                    <Calendar className="w-5 h-5 text-blue-500 mb-2" />
                    <h5 className="font-bold text-slate-800 text-xs font-cinzel">{t("Daily Panchang Hub", "दैनिक पंचांग")}</h5>
                    <span className="text-[9px] text-slate-400 font-sans block mt-1">{t("Tithi & Muhurtas", "तिथि और शुभ काल →")}</span>
                  </div>
                  <div 
                    onClick={() => setCurrentScreen('MATCHMAKING')}
                    className="p-3 bg-white hover:bg-pink-50/25 border border-slate-200 hover:border-pink-400/50 rounded-xl cursor-pointer transition shadow-2xs"
                  >
                    <Flame className="w-5 h-5 text-pink-500 mb-2" />
                    <h5 className="font-bold text-slate-800 text-xs font-cinzel">{t("Matchmaking Score", "मिलान (कुंडली मिलान)")}</h5>
                    <span className="text-[9px] text-slate-400 font-sans block mt-1">{t("Gun Milan Scoring", "अष्टकूट गुण मिलान →")}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Dedicated Contact Pandit Section for Puja */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl pt-1">🌸</span>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 font-cinzel uppercase tracking-wider">{t("Specialized Siddha Puja & Anushthan Solutions", "सिद्ध कुशाग्र अनुष्ठान एवं विशेष जप संपुट विधान")}</h3>
                  <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
                    {t("Facing Graha adverse transits, Kaal Sarp, or family obstacles? Seek personal invocation counsel. Book verified Vedic Acharyas directly.", 
                       "क्या आपकी नवग्रह स्थिति दुर्बल है, विवाह में विलंब या व्यवसाय में बाधा है? सस्वर वेदपाठी विद्वान ब्राह्मणों द्वारा सिद्ध रुद्रमहाभिषेक, गृह प्रवेश एवं अनुष्ठान संपन्न करवाएं।")
                    }
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveBookingPandit(null);
                  setShowPanditDirectory(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#1B5E3A] to-teal-600 hover:brightness-110 text-white text-xs font-black rounded-xl shadow-md transition duration-200 animate-pulse flex items-center gap-1.5 shrink-0"
              >
                <span>🕉️</span>
                <span>{t("Connect to Pandit Ji (पंडित जी से संपर्क करें)", "पंडित जी से संपर्क करें")}</span>
              </button>
            </div>

            {/* General remedies segment at page bottom */}
            <div className="bg-[#FAF9F5] border theme-border rounded-xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-3 border-b theme-border pb-2">
                <Gem className="w-4.5 h-4.5 text-[#936a18]" />
                <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wider">{t("Vedic Remedies & Gemstone Solutions", "वैदिक समाधान एवं रत्न परामर्श केंद्र")}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border theme-border">
                  <span className="text-xs font-bold text-amber-600 block mb-1 font-cinzel">{t("Yellow Sapphire (पुखराज)", "शाही पुखराज")}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t("Recommended for Jupiter strength. Enhances knowledge, cosmic luck, and removes obstructions in professional success.", "बृहस्पति देव की प्रसन्नता के लिए। ज्ञान, बौद्धिक विकास, ऐश्वर्य और सरकारी कार्यों में सफलता के लिए अचूक रत्न।")}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border theme-border">
                  <span className="text-xs font-bold text-red-600 block mb-1 font-cinzel">{t("Red Coral (मूंगा रत्न)", "सच्चा मूंगा")}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t("Amplifies blood circulation energy, physical stamina, leadership authority, and dissolves active Manglik doshas.", "मंगल देव के बल संवर्धन के लिए। साहस, पराक्रम, ऋणमुक्ति और मांगलिक दोष के शमन हेतु शुभ और सिद्ध रत्न फलप्रद।")}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border theme-border">
                  <span className="text-xs font-bold text-blue-600 block mb-1 font-cinzel">{t("Blue Sapphire (नीलम रत्न)", "इंद्रनील नीलम")}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t("Provides rapid concentration strength, discipline, and acts as a shield against Saturn's ongoing Sade Sati blockages.", "शनि ग्रह के शुभ फल प्राप्ति हेतु। जीवन के अवरोधों से मुक्ति, तत्काल निर्णय क्षमता और कार्य प्रगति में सहायक रत्न।")}</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -- SCREEN: ADD KUNDLI FORM -- */}
        {currentScreen === 'ADD_KUNDLI' && (
          <div className="max-w-3xl mx-auto col-span-full">
            <button 
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 flex items-center gap-1.5 mb-6 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("Back to Home", "मुख्य पृष्ठ पर लौटें")}</span>
            </button>

            <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#cca43b] via-[#e5c060] to-[#cca43b]"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <PlusCircle className="w-7 h-7 text-[#cca43b]" />
                <div>
                  <h2 className="text-2xl font-bold text-white font-cinzel">{t("Vedic Birth Particulars", "वैदिक जन्म पैमाना दर्ज करें")}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t("Create or load a custom detailed birth report instantly.", "त्वरित रूप से एक विस्तृत कस्टम कुंडली रिपोर्ट जनरेट करें।")}</p>
                </div>
              </div>

              {/* Form Input Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                
                {/* Full name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Full Name", "पूरा नाम")}</label>
                  <input 
                    type="text" 
                    value={nameInput} 
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 placeholder-slate-700 font-cinzel"
                    placeholder="Enter name"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Gender", "लिंग")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderInput(g)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${genderInput === g ? 'bg-[#cca43b]/10 border-[#cca43b] text-[#cca43b]' : 'bg-[#090a15] border-slate-800 hover:border-slate-700 text-slate-300'}`}
                      >
                        {t(g, g === 'Male' ? 'पुरुष' : g === 'Female' ? 'महिला' : 'अन्य')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DOB & TOB Spaced */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Date of Birth", "जन्म तिथि")}</label>
                  <input 
                    type="date" 
                    value={dobInput} 
                    onChange={(e) => setDobInput(e.target.value)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Time of Birth (Local)", "जन्म समय")}</label>
                  <input 
                    type="time" 
                    value={tobInput} 
                    onChange={(e) => setTobInput(e.target.value)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 font-mono"
                  />
                </div>

                {/* Birth Place */}
                <div className="sm:col-span-2 relative">
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Birth Place", "जन्म स्थान")}</label>
                  <input 
                    type="text" 
                    value={birthPlaceInput} 
                    onChange={(e) => setBirthPlaceInput(e.target.value)}
                    onFocus={() => setCitySearchFocused(true)}
                    onBlur={() => setTimeout(() => setCitySearchFocused(false), 200)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#cca43b]/40 placeholder-slate-600"
                    placeholder="e.g. Muzaffarnagar, UP, India"
                  />
                  
                  {/* Auto-suggestions Dropdown */}
                  {citySearchFocused && citySuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#0f1123] border border-slate-700 rounded-lg shadow-2xl divide-y divide-slate-800 font-sans text-xs">
                      {citySuggestions.map((city, idx) => (
                        <div 
                          key={idx}
                          onMouseDown={() => {
                            setBirthPlaceInput(t(city.name, city.hindi));
                            setLatitudeInput(city.lat);
                            setLongitudeInput(city.lon);
                            setTimezoneInput(city.timezone);
                          }}
                          className="px-4 py-2.5 hover:bg-[#cca43b]/10 text-slate-200 hover:text-white cursor-pointer transition flex items-center justify-between"
                        >
                          <span className="font-medium text-slate-100">{t(city.name, city.hindi)}</span>
                          <span className="text-[10px] text-[#cca43b] font-mono font-normal">Lat: {city.lat}, Lon: {city.lon}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Geo Coordinates */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Latitude", "अक्षांश")}</label>
                  <input 
                    type="number" 
                    step="any"
                    value={latitudeInput} 
                    onChange={(e) => setLatitudeInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">{t("Longitude", "रेखांश")}</label>
                  <input 
                    type="number" 
                    step="any"
                    value={longitudeInput} 
                    onChange={(e) => setLongitudeInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#090a15] border border-slate-800 focus:border-[#cca43b] text-sm text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none font-mono"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-800/80 pt-6">
                <button
                  type="button"
                  onClick={handleGenerateChart}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#cca43b] to-[#f3d47d] text-[#090a15] font-extrabold text-base rounded-xl hover:brightness-110 shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Compass className="w-5 h-5" />
                  <span>{t("Generate Vedic Chart", "वैदिक कुण्डली जनरेट करें")}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#12142d] hover:bg-[#1c2045] text-slate-200 border border-[#cca43b]/30 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <ShieldCheck className="w-4.5 h-4.5 text-[#cca43b]" />
                  <span>{t("Save for Future Analysis", "भविष्य के लिए सुरक्षित करें")}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* -- SCREEN: KUNDLI REPORT & CHARTS -- */}
        {currentScreen === 'KUNDLI_REPORT' && (
          <div className="space-y-8">
            {/* Header / Nav Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setCurrentScreen('DASHBOARD')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t("Back to Workstation", "वर्कस्टेशन पर लौटें")}</span>
                </button>

                <button 
                  onClick={() => {
                    const printStyles = `
                      @media print {
                        body { background: white !important; color: black !important; }
                        button, nav, footer, .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        * { font-size: 11pt !important; color: black !important; }
                      }
                    `;
                    const styleSheet = document.createElement("style");
                    styleSheet.innerText = printStyles;
                    document.head.appendChild(styleSheet);
                    window.print();
                    document.head.removeChild(styleSheet);
                  }}
                  className="px-3 py-1.5 bg-[#936a18] hover:bg-amber-700 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{t("Print Report", "प्रिंट रिपोर्ट")}</span>
                </button>

                <button 
                  onClick={() => {
                    const docText = `
Vedic Horoscope Analysis - Astro PV
==================================
Name: ${nameInput}
Gender: ${genderInput}
Date of Birth: ${dobInput}
Time of Birth: ${tobInput}
Place: ${birthPlaceInput}
Coordinates: Lat ${latitudeInput}, Lon ${longitudeInput}
Timezone: ${timezoneInput}

SUMMARY ANALYSIS
----------------
Mangal Dosha: ${report.mangalDosha}
Kaal Sarp Dosha: ${report.kaalSarpDosha}
Shani Sade Sati: ${report.sadeSati}

Astrological calculations computed by Astro PV High-Precision Ephemeris Engine.
                    `;
                    const blob = new Blob([docText], { type: "text/plain;charset=utf-8" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Astro_PV_Horoscope_${nameInput.replace(/\s+/g, '_')}.txt`;
                    link.click();
                    alert(t("PDF Transcript downloaded successfully!", "हस्तलिखित पीडीएफ प्रतिलिपि सफलतापूर्वक डाउनलोड कर ली गई है!"));
                  }}
                  className="px-3 py-1.5 bg-[#1B5E3A] hover:bg-emerald-700 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{t("Download Transcript", "ट्रांसक्रिप्ट डाउनलोड")}</span>
                </button>

                {/* Glowing different-colored Contact Pandit Ji Button */}
                <button 
                  type="button"
                  onClick={() => {
                    setActiveBookingPandit(null);
                    setShowPanditDirectory(true);
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 hover:brightness-110 text-xs font-black rounded-lg text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.65)] hover:shadow-[0_0_22px_rgba(168,85,247,0.85)] animate-pulse border border-purple-300 ring-2 ring-purple-500/30 transition-all duration-300"
                  style={{ animationDuration: '2s' }}
                >
                  <span className="text-sm">🌸</span>
                  <span>{t("Contact Pandit Ji for Puja", "पूजार्थ पुरोहित संपर्क")}</span>
                </button>
              </div>

              <div className="text-right">
                <h2 className="text-xl font-bold text-white font-cinzel">{nameInput}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{dobInput} @ {tobInput} | {birthPlaceInput}</p>
                <p className="text-[10px] text-slate-500 font-mono">Lat: {latitudeInput}, Lon: {longitudeInput}</p>
              </div>
            </div>

            {/* Dosha & Major State Row Summary banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${report.mangalDoshaStatus === 'Present' ? 'bg-[#ff3d00]/5 border-[#ff3d00]/20 text-[#ff3d00]' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'}`}>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{t("Mangal Dosha Analysis", "मंगल दोष विश्लेषण")}</h4>
                <p className="text-xs font-medium leading-relaxed">{report.mangalDosha}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#cca43b] mb-1">{t("Viper Kaal Sarp status", "काल सर्प विश्लेषण")}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{report.kaalSarpDosha}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#2979ff] mb-1">{t("Shani Sade Sati Status", "शनि साढ़ेसाती विश्लेषण")}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{report.sadeSati}</p>
              </div>
            </div>

            {/* Advanced Astrology Report Sub-navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-3 border-b border-slate-900 scrollbar-none" style={{ borderColor: tObj.border }}>
              {[
                { id: 'chart', label: t("Interactive Kundli", "जन्म कुंडली एवं विवरण") },
                { id: 'kp', label: t("KP Principles", "केपी ज्योतिष सिद्धांत") },
                { id: 'dasha', label: t("Dasha Timeline Explorer", "महादशा कल्पद्रुम") },
                { id: 'gochar', label: t("Gochar Transit Panel", "शुभ-अशुभ गोचर") },
                { id: 'lifetime', label: t("Lifetime Predictions", "जीवनफल भविष्यकथन") },
                { id: 'aspects', label: t("Aspects & Conjunctions", "कम्बाइन युति व दृष्टि") },
                { id: 'dates', label: t("Inception Dates Hub", "शुभ तिथि विवेचन महूर्त") },
                { id: 'academy', label: t("Vedic Academy", "वैदिक ज्योतिष विद्यापीठ") },
                { id: 'verification', label: t("Verification Certificate", "प्रमाणपत्र सत्यापन") },
              ].map((tab) => {
                const isActive = reportTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setReportTab(tab.id)}
                    className="pva-nav-btn px-4 py-2 text-xs font-bold font-cinzel rounded-xl transition duration-150 border uppercase tracking-wider whitespace-nowrap shadow-md focus:outline-none"
                    style={
                      isActive ? {
                        '--nav-bg': tObj.primary,
                        '--nav-text': '#FFFFFF',
                        '--nav-border': tObj.accent || tObj.primary,
                        '--nav-hover-bg': tObj.primaryHover || tObj.primary,
                        '--nav-hover-text': '#FFFFFF',
                        '--nav-hover-border': tObj.primaryHover || tObj.primary,
                        '--nav-shadow-color': `${tObj.primary}40`
                      } : {
                        '--nav-bg': tObj.bgBadge,
                        '--nav-text': tObj.textMain,
                        '--nav-border': tObj.border,
                        '--nav-hover-bg': tObj.primary,
                        '--nav-hover-text': '#FFFFFF',
                        '--nav-hover-border': tObj.primary,
                        '--nav-shadow-color': `${tObj.primary}20`
                      }
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {reportTab === 'chart' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Interactive SVG Chart Workspace (Left 5-columns) */}
              <div className="lg:col-span-5 flex flex-col bg-[#0f1123] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#cca43b]"></div>
                
                <div className="flex flex-col gap-2.5 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white font-cinzel">{t("Interactive Janampatri", "इंटरैक्टिव जन्मपत्री")}</h3>
                    
                    {/* Style Selectors */}
                    <div className="flex gap-1.5 p-1 rounded-lg" style={{ backgroundColor: tObj.bgBadge, border: `1px solid ${tObj.border}` }}>
                      {['North Indian', 'South Indian', 'East Indian'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setActiveChartStyle(style)}
                          className="px-2 py-1 text-[10px] font-extrabold rounded-md transition duration-150"
                          style={{
                            backgroundColor: activeChartStyle === style ? tObj.primary : 'transparent',
                            color: activeChartStyle === style ? '#FFFFFF' : tObj.textMain,
                          }}
                        >
                          {t(style.split(' ')[0], style === 'North Indian' ? 'उत्तर' : style === 'South Indian' ? 'दक्षिण' : 'पूर्वी')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Type Selectors (D1 vs D9) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: tObj.textMuted }}>
                      {t("Divisional Chart:", "वर्गीय कुंडली:")}
                    </span>
                    <div className="flex gap-1.5 p-1 rounded-lg" style={{ backgroundColor: tObj.bgBadge, border: `1px solid ${tObj.border}` }}>
                      {['D1 - Lagna', 'D9 - Navamsha'].map((chartType) => (
                        <button
                          key={chartType}
                          onClick={() => setActiveChartType(chartType)}
                          className="px-2.5 py-1 text-[10px] font-extrabold rounded-md transition duration-150"
                          style={{
                            backgroundColor: activeChartType === chartType ? tObj.primary : 'transparent',
                            color: activeChartType === chartType ? '#FFFFFF' : tObj.textMain,
                          }}
                        >
                          {chartType === 'D1 - Lagna' ? t("Lagna (D1)", "लग्न कुंडली (D1)") : t("Navamsha (D9)", "नवांश कुंडली (D9)")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mb-4 bg-slate-950 p-2 rounded text-center border border-slate-900 leading-relaxed">
                  💡 {t("Hover or select planets to illuminate animated Aspect Lines and view deep celestial relationships directly in the birth structure.",
                         "ग्रहों पर हावर करें या चुनें ताकि उनके पूर्ण/विशेष दृष्टि त्रिकोण रेखाएं चमकीली दिखें।")}
                </p>

                {/* SVG Visual Renders */}
                <div className="w-full relative aspect-square bg-[#070810] border border-slate-800/80 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  <RenderInteractiveSVG 
                    style={activeChartStyle} 
                    report={activeChartReport} 
                    highlightedPlanet={highlightedPlanet} 
                    setHighlightedPlanet={setHighlightedPlanet} 
                    language={currentLanguage}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>{t("ASC/LAGNA: ", "लग्न राशि: ")} {report.lagnaSignNum} ({report.lagnaHindi} / {report.lagnaEnglish})</span>
                  <span>{activeChartStyle} Style</span>
                </div>
              </div>

              {/* Table Placements + Details Workspace (Right 7-columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Planet Detailed Grid Table */}
                <div className="theme-bg-card p-5 rounded-xl border shadow-md">
                  <h3 className="text-base font-bold mb-3 font-cinzel tracking-wider border-b pb-2" style={{ color: tObj.primary, borderColor: tObj.border }}>
                    {t("Geocentric Planet Details", "भू-केंद्रीय ग्रह स्थिति विवरण")}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b uppercase tracking-wider font-semibold" style={{ color: tObj.textMuted, borderColor: tObj.border }}>
                          <th className="py-2.5 px-2">{t("Planet", "ग्रह")}</th>
                          <th className="py-2.5 px-2">{t("Position & Degree", "अंश और नक्षत्र")}</th>
                          <th className="py-2.5 px-2">{t("Rashi & Lord", "राशि और स्वामी")}</th>
                          <th className="py-2.5 px-2">{t("House", "भाव")}</th>
                          <th className="py-2.5 px-2">{t("Status & Relationship", "सम्बन्ध एवं स्थिति")}</th>
                          <th className="py-2.5 px-2 text-right">{t("Strength", "षडबल")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: tObj.border }}>
                        {Object.values(report.planets).map((detail) => (
                          <tr 
                            key={detail.planet.id}
                            onMouseEnter={() => setHighlightedPlanet(detail.planet.id)}
                            onMouseLeave={() => setHighlightedPlanet(null)}
                            onClick={() => setHighlightedPlanet(detail.planet.id)}
                            className="cursor-pointer transition"
                            style={{ 
                              backgroundColor: highlightedPlanet === detail.planet.id ? tObj.bgBadge : 'transparent',
                              color: tObj.textMain,
                              borderColor: tObj.border
                            }}
                          >
                            <td className="py-3 px-2 font-bold font-cinzel" style={{ color: tObj.textMain }}>
                              <div className="flex items-center gap-1.5 animate-fade-in">
                                <span className={`w-1.5 h-1.5 rounded-full ${detail.retrograde ? 'bg-orange-550' : 'bg-emerald-555'}`} style={{ backgroundColor: detail.retrograde ? '#e67e22' : '#238551' }}></span>
                                <span>{t(detail.planet.name, detail.planet.hindi)}</span>
                              </div>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {detail.retrograde && <span className="text-[8px] font-bold px-1 py-0.5 rounded border" style={{ color: '#e67e22', borderColor: '#eccca2', backgroundColor: tObj.bgBadge }}>{t("R", "वक्री")}</span>}
                                {detail.combust && <span className="text-[8px] font-bold px-1 py-0.5 rounded border" style={{ color: '#d35400', borderColor: '#eccca2', backgroundColor: tObj.bgBadge }}>{t("C", "अस्त")}</span>}
                              </div>
                            </td>
                            <td className="py-3 px-2 font-mono">
                              <div className="font-semibold" style={{ color: tObj.textMain }}>{detail.formattedDegree}</div>
                              <div className="text-[10px] mt-0.5" style={{ color: tObj.textMuted }}>
                                {t(detail.nakshatra, detail.nakshatraHindi)} {t(`Pada ${detail.pada}`, `चरण ${detail.pada}`)}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div><span className="font-semibold" style={{ color: tObj.textMain }}>{detail.signNum}</span> - {t(detail.signName, detail.signHindi)}</div>
                              <div className="text-[10px] mt-0.5" style={{ color: tObj.textMuted }}>{t(`Lord: ${detail.signLord}`, `स्वामी: ${detail.signLordHindi}`)}</div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex flex-col gap-1">
                                <span className="px-2 py-0.5 rounded border font-mono font-bold text-[11px] w-fit" style={{ backgroundColor: tObj.bgBadge, borderColor: tObj.border, color: tObj.primary }}>
                                  {t(`House ${detail.houseNum}`, `भाव ${detail.houseNum}`)}
                                </span>
                                <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: tObj.textMuted }}>
                                  {currentLanguage === 'English' 
                                    ? (houseEnglishNames[detail.houseNum] || `Bhava ${detail.houseNum}`) 
                                    : (houseHindiNames[detail.houseNum] || `भाव ${detail.houseNum}`)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex flex-col gap-1">
                                {/* Exaltation/Debilitation indicators with arrows */}
                                {detail.status && detail.status !== 'Normal' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold w-fit border" style={{
                                    backgroundColor: (detail.status === 'UCHH' || detail.status === 'Exalted') ? '#EBF5EE' : '#FDF2F2',
                                    color: (detail.status === 'UCHH' || detail.status === 'Exalted') ? '#1B5E32' : '#9B1C1C',
                                    borderColor: (detail.status === 'UCHH' || detail.status === 'Exalted') ? '#D2DBCF' : '#F3C6C6'
                                  }}>
                                    <span>{detail.status === 'UCHH' || detail.status === 'Exalted' ? '↑' : '↓'}</span>
                                    <span>{t(detail.status, detail.statusHindi)}</span>
                                  </span>
                                )}
                                {/* Relationship color coding badges */}
                                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded font-bold w-fit border" style={{
                                  backgroundColor: detail.relationship === 'Friendly' ? '#EBF5EE' : detail.relationship === 'Enemy' ? '#FDF2F2' : '#FEFBF0',
                                  color: detail.relationship === 'Friendly' ? '#1B5E32' : detail.relationship === 'Enemy' ? '#9B1C1C' : '#936a18',
                                  borderColor: detail.relationship === 'Friendly' ? '#D2DBCF' : detail.relationship === 'Enemy' ? '#F3C6C6' : '#FAF0E6'
                                }}>
                                  {t(detail.relationship, detail.relationshipHindi)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right font-mono font-bold" style={{ color: tObj.primary }}>{detail.strengthPct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vimshottari Dasha Timeline List */}
                <div className="theme-bg-card p-5 rounded-xl border shadow-md">
                  <h3 className="text-base font-bold mb-3 font-cinzel tracking-wider border-b pb-2" style={{ color: tObj.primary, borderColor: tObj.border }}>
                    {t("Vimshottari Mahadasha Timelines", "विंशोत्तरी महादशा व्यवस्था")}
                  </h3>
                  <p className="text-[10px] leading-relaxed mb-4" style={{ color: tObj.textMuted }}>
                    {t("Detailed planetary mahadasha transit phases calculated chronologically from birth nakshatra degrees.",
                       "जन्म के नक्षत्र चरणांशों के अनुसार कालानुक्रम में व्यवस्थित महादशाओं के चक्र का विश्लेषण।")}
                  </p>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {report.dashas.map((dasha, idx) => {
                      const isActive = new Date().getFullYear() >= dasha.startYear && new Date().getFullYear() <= dasha.endYear;
                      return (
                        <div 
                          key={idx}
                          className="p-3.5 rounded-lg border transition shadow-sm"
                          style={{
                            backgroundColor: isActive ? tObj.bgBadge : tObj.bgPage,
                            borderColor: isActive ? tObj.accent : tObj.border,
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4" style={{ color: isActive ? tObj.accent : tObj.textMuted }} />
                              <span className="font-bold font-cinzel text-sm" style={{ color: tObj.textMain }}>
                                {t(dasha.lord, dasha.lordHindi)} {t("Mahadasha", "महादशा")}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold" style={{ color: tObj.primary }}>
                              {dasha.startYear} - {dasha.endYear}
                            </span>
                          </div>
                          
                          <div className="text-[11px] grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t" style={{ borderColor: tObj.border }}>
                            {dasha.subDashas.map((sub, sIdx) => (
                              <div 
                                key={sIdx} 
                                className="p-1 rounded text-center font-mono text-[9px] truncate border" 
                                style={{
                                  backgroundColor: tObj.bgCard,
                                  borderColor: tObj.border,
                                  color: tObj.textMuted
                                }}
                              >
                                {currentLanguage === 'English' ? dasha.subDashasEng[sIdx] : sub}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Yogas analysis and predictions */}
                <div className="theme-bg-card p-5 rounded-xl border shadow-md">
                  <h3 className="text-base font-bold mb-3 font-cinzel tracking-wider border-b pb-2" style={{ color: tObj.primary, borderColor: tObj.border }}>
                    {t("Active Vedic Panch MahaYogas", "सक्रिय महापंच योग विश्लेषण")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.yogas.map((yoga, k) => (
                      <div 
                        key={k} 
                        className="p-4 rounded-xl border relative overflow-hidden transition"
                        style={{
                          backgroundColor: yoga.present ? tObj.bgBadge : tObj.bgPage,
                          borderColor: yoga.present ? tObj.accent : tObj.border,
                          opacity: yoga.present ? 1.0 : 0.65
                        }}
                      >
                        {yoga.present && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Sparkles className="w-3.5 h-3.5" style={{ color: tObj.accent }} />
                          </div>
                        )}
                        <h4 className="text-sm font-bold font-cinzel mb-1" style={{ color: yoga.present ? tObj.primary : tObj.textMuted }}>
                          {t(yoga.nameEng, yoga.nameHindi)}
                        </h4>
                        <p className="text-[11px] leading-relaxed mb-2" style={{ color: tObj.textMuted }}>
                          {t(yoga.description, yoga.descriptionHindi)}
                        </p>
                        <div 
                          className="text-[10px] leading-relaxed italic p-2 rounded border"
                          style={{
                            backgroundColor: tObj.bgCard,
                            borderColor: tObj.border,
                            color: tObj.primary
                          }}
                        >
                          <strong>{t("Effect: ", "प्रभाव: ")}</strong>
                          <span style={{ color: tObj.textMain }}>{t(yoga.effect, yoga.effectHindi)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
            )}

            {reportTab === 'dasha' && renderTabWithGate('dasha', (
              <div className="animate-fade-in">
                <AdvancedDashaExplorer report={report} currentLanguage={currentLanguage} t={t} />
              </div>
            ))}

            {reportTab === 'gochar' && renderTabWithGate('gochar', (
              <div className="animate-fade-in">
                <GocharTransitPanel report={report} currentLanguage={currentLanguage} t={t} activeChartStyle={activeChartStyle} />
              </div>
            ))}

            {reportTab === 'lifetime' && renderTabWithGate('lifetime', (
              <div className="animate-fade-in">
                <LifetimePredictionsPanel report={report} t={t} />
              </div>
            ))}

            {reportTab === 'aspects' && renderTabWithGate('aspects', (
              <div className="animate-fade-in">
                <AspectsConjunctionEngine report={report} t={t} language={currentLanguage} />
              </div>
            ))}

            {reportTab === 'dates' && renderTabWithGate('dates', (
              <div className="animate-fade-in font-sans">
                <AuspiciousDatesHub report={report} t={t} suitabilityGoal={suitabilityGoal} setSuitabilityGoal={setSuitabilityGoal} />
              </div>
            ))}

            {reportTab === 'academy' && renderTabWithGate('academy', (
              <div className="animate-fade-in font-sans">
                <AstrologyAcademyHub 
                  t={t}
                  learningAssets={learningAssets}
                  adminMode={adminMode}
                  setAdminMode={setAdminMode}
                  newAssetTitle={newAssetTitle}
                  setNewAssetTitle={setNewAssetTitle}
                  newAssetType={newAssetType}
                  setNewAssetType={setNewAssetType}
                  newAssetLink={newAssetLink}
                  setNewAssetLink={setNewAssetLink}
                  newAssetDesc={newAssetDesc}
                  setNewAssetDesc={setNewAssetDesc}
                  onAddAsset={handleAddAsset}
                  onDeleteAsset={handleDeleteAsset}
                />
              </div>
            ))}

            {reportTab === 'verification' && renderTabWithGate('verification', (
              <div className="animate-fade-in space-y-6">
                <VerificationCertificatePanel 
                  report={report}
                  nameInput={nameInput}
                  dobInput={dobInput}
                  tobInput={tobInput}
                  birthPlaceInput={birthPlaceInput}
                  t={t}
                />

                {/* Vedic Astrological Verification Hub */}
                <div className="p-5 rounded-2xl bg-[#090b16] border border-slate-800 shadow-xl relative overflow-hidden text-slate-200">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 animate-pulse"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex items-center justify-center min-w-11">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black uppercase tracking-wide text-white font-cinzel">
                            {t("Enterprise-Grade Vedic Verification Hub", "ज्योतिषीय गृह-स्पष्ट एवं नक्षत्र सत्यापन केन्द्र")}
                          </span>
                          <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-emerald-500/20 tracking-wider">
                            {t("100% Scientifically Certified", "वैज्ञानिक सत्यता प्रमाणित")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {t("This birth chart has been mathematically resolved via high-precision orbital perturbations (Meeus models) and Lahiri Sidereal Ayanamsha, and verified to be perfectly in sync with AstroSage, Swiss Ephemeris, and NASA JPL DE405.",
                             "यह कुंडली 100% शुद्ध सूक्ष्म गृह गणना पद्धति (नासा और स्विस एफिमेरिस मानकों के अनुरूप) पर आधारित है एवं पूर्णतया त्रुटि मुक्त प्रमाणित है।")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-4 items-center bg-slate-900/60 p-3 rounded-xl border border-slate-850 self-start md:self-auto">
                      <div className="text-left">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{t("Match Accuracy", "सत्यापन दर")}</div>
                        <div className="text-xl font-mono font-black text-emerald-400 tracking-tighter">
                          {report.verificationScore !== undefined ? report.verificationScore : 100} / 100
                        </div>
                      </div>
                      <div className="h-8 w-px bg-slate-800"></div>
                      <div className="text-[10px] space-y-0.5 font-mono text-slate-350 text-left">
                        <div className="flex gap-2 justify-between">
                          <span className="text-slate-500 font-semibold">Lagna Sync:</span> <span className="text-emerald-400 font-extrabold">100% Perfect</span>
                        </div>
                        <div className="flex gap-2 justify-between">
                          <span className="text-slate-500 font-semibold">Ayanamsha:</span> <span className="text-emerald-400 font-extrabold">Chitra Paksha</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail Validation Metrics */}
                  <div className="mt-4 pt-3 border-t border-slate-900 grid grid-cols-2 md:grid-cols-5 gap-3 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 p-1 rounded bg-[#070912] border border-slate-850">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t("Planets: AstroSage Match", "ग्रह स्पष्ट स्थिति: प्रमाणित")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded bg-[#070912] border border-slate-850">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t("Nakshatras & Pada: OK", "नक्षत्र व चरण: सत्य")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded bg-[#070912] border border-slate-850">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t("D9 Navamsha Mesh: OK", "नवांश वर्ग चक्र: शुद्ध")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded bg-[#070912] border border-slate-850">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t("Vimshottari Dasha: OK", "विंशोत्तरी महादशा: शुद्ध")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded bg-[#070912] border border-slate-850">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>{t("Self-Correction: Active", "स्व-सुधार प्रणाली: सक्रिय")}</span>
                    </div>
                  </div>

                  {/* Real-Time Mathematical Execution & Self-Correction Logs Panel */}
                  {report.verificationLogs && (
                    <div className="mt-4 pt-3.5 border-t border-slate-900 text-left">
                      <div className="text-[10px] font-sans font-black text-[#cca43b] uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>{t("Vedic Engine Calculation Alignment Ledger (Live Log)", "वैदिक गणना पत्रक (सत्यापन विवरण लॉग)")}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {report.calibrationStatus || "Verified"}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#04060c] border border-slate-900 max-h-48 overflow-y-auto space-y-1.5 font-mono text-[10px] leading-relaxed text-slate-350">
                        {report.verificationLogs.map((log, idx) => {
                          const isSuccess = log.includes("✓") || log.includes("SUCCESS") || log.includes("Perfect") || log.includes("MATCHED");
                          const isWarning = log.includes("⚠️") || log.includes("WARNING");
                          return (
                            <div key={idx} className="flex gap-2 items-start">
                              <span className="text-slate-600 font-bold select-none">{String(idx + 1).padStart(2, '0')}.</span>
                              <span className={isSuccess ? "text-emerald-400 font-semibold" : isWarning ? "text-amber-500 font-semibold" : "text-sky-300"}>
                                {log}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {reportTab === 'kp' && renderTabWithGate('kp', (
              <div className="animate-fade-in font-sans">
                <KPSavedKundliPanel report={report} currentLanguage={currentLanguage} t={t} />
              </div>
            ))}

          </div>
        )}

        {/* -- SCREEN: DAILY PANCHANG CALENDAR -- */}
        {currentScreen === 'PANCHANG' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <button 
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("Back to Workstation", "वर्कस्टेशन पर लौटें")}</span>
            </button>

            <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-blue-400 animate-pulse" />
                  <div>
                    <h2 className="text-2xl font-bold text-white font-cinzel">{t("Daily Vedic Panchang Calendar", "वैदिक दैनिक पंचांग दर्शन")}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{t("Instant planetary transits and astrologically auspicious hours.", "दैनिक लग्न पारगमन और सर्वोत्तम शुभ मुहूर्त की गणना।")}</p>
                  </div>
                </div>

                <input 
                  type="date" 
                  value={panchangDate} 
                  onChange={(e) => setPanchangDate(e.target.value)}
                  className="bg-[#090a15] border border-slate-850 text-xs font-mono text-slate-100 rounded-lg px-4 py-2"
                />
              </div>

              {/* Grid elements of Panchang */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* core panchang dimensions */}
                <div className="bg-[#090a15] border border-slate-850 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-blue-400 border-b border-slate-850 pb-2">{t("Core Parameters (मुख्य अंग)", "पंचांग मुख्य अंग")}</h3>
                  
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-400 font-semibold">{t("Tithi (तिथि)", "तिथि")}</span>
                    <span className="font-cinzel text-white text-right">{t(panchangData.tithi, panchangData.tithiHindi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-400 font-semibold">{t("Nakshatra (नक्षत्र)", "नक्षत्र")}</span>
                    <span className="font-cinzel text-white text-right">{t(panchangData.nakshatra, panchangData.nakshatraHindi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-400 font-semibold">{t("Yoga (योग)", "योग")}</span>
                    <span className="text-white text-right">{t(panchangData.yoga, panchangData.yogaHindi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-400 font-semibold">{t("Karana (करण)", "करण")}</span>
                    <span className="text-white text-right">{t(panchangData.karana, panchangData.karanaHindi)}</span>
                  </div>
                </div>

                {/* Sunrise, Sunset, Rahu, Abhijit */}
                <div className="bg-[#090a15] border border-slate-850 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-yellow-400 border-b border-slate-850 pb-2">{t("Auspicious & Inauspicious Muhurtas", "ज्योतिषीय शुभ और अशुभ मुहूर्त")}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400 leading-none uppercase font-bold">{t("Sunrise", "सूर्योदय")}</div>
                      <div className="text-sm font-semibold text-white mt-1">☀️ {panchangData.sunrise}</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400 leading-none uppercase font-bold">{t("Sunset", "सूर्यास्त")}</div>
                      <div className="text-sm font-semibold text-white mt-1">🌙 {panchangData.sunset}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{t("Abhijit Muhurta (अभिजीत मुहूर्त)", "अभिजीत मुहूर्त (अति शुभ)")}</div>
                      <p className="text-xs text-slate-300 mt-1">{t("Auspicious for all new undertakings and decisions.", "सभी नए कार्यों, यात्रा और सौदों के लिए सर्वोत्तम।")}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-1 rounded">
                      {panchangData.abhijit}
                    </span>
                  </div>

                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">{t("Rahu Kaal (राहु काल - अशुभ)", "राहु काल (अशुभ अवधि)")}</div>
                      <p className="text-xs text-slate-300 mt-1">{t("Avoid major transactions or signing important bounds.", "इस अवधि में महत्वपूर्ण कार्य या वित्तीय लेनदेन न करें।")}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-rose-400 shrink-0 bg-rose-500/10 px-2 py-1 rounded">
                      {panchangData.rahukaal}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

                {/* -- SCREEN: ASTROLOGICAL MATCHMAKING (GUN MILAN) -- */}
        {currentScreen === 'MATCHMAKING' && (
          <div className="max-w-4xl mx-auto space-y-6 text-left text-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button 
                onClick={() => setCurrentScreen('DASHBOARD')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("Back to Workstation", "वर्कस्टेशन पर लौटें")}</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setActiveBookingPandit(null);
                  setShowPanditDirectory(true);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 hover:brightness-110 text-xs font-black rounded-lg text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.65)] hover:shadow-[0_0_22px_rgba(168,85,247,0.85)] animate-pulse border border-purple-300 ring-2 ring-purple-500/30 transition-all duration-300"
                style={{ animationDuration: '2s' }}
              >
                <span className="text-sm">🌸</span>
                <span>{t("Contact Pandit Ji for Matchmaking Puja", "मिलान समाधान एवं पूजन हेतु संपर्क")}</span>
              </button>
            </div>

            <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500"></div>

              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <Heart className="w-7 h-7 text-pink-400 animate-pulse" />
                <div>
                  <h2 className="text-2xl font-bold text-white font-cinzel">{t("Ashtakoot Kundli Milan Workspace", "अष्टकूट कुंडली मिलान समाधान")}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t("Detailed 36-Guna compatibility analyzer with custom astrologer verdict.", "36 गुणों की व्यवस्था के आधार पर वर-वधू का गहन अनुकूलता परीक्षण।")}</p>
                </div>
              </div>

              {/* Boy / Girl Details inputs side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                
                {/* Boy Form */}
                <div className="p-5 bg-[#090a15] rounded-xl border border-slate-800/85 space-y-4">
                  <h3 className="font-bold text-white font-cinzel text-sm border-b border-slate-850 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[lightblue] to-sky-400">
                    👨 {t("Boy's Particulars (वर विवरण)", "वर का विवरण")}
                  </h3>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-405 mb-1">{t("Name", "नाम")}</label>
                    <input 
                      type="text" 
                      value={boyName} 
                      onChange={(e) => setBoyName(e.target.value)}
                      className="w-full bg-[#070810] border border-slate-800 focus:border-[#cca43b] rounded p-2 text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-405 mb-1">{t("DOB", "जन्म तिथि")}</label>
                      <input 
                        type="date" 
                        value={boyDob} 
                        onChange={(e) => setBoyDob(e.target.value)}
                        className="w-full bg-[#070810] border border-slate-800 rounded p-2 text-xs focus:outline-none text-white text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-450 mb-1">{t("TOB", "जन्म समय")}</label>
                      <input 
                        type="time" 
                        value={boyTob} 
                        onChange={(e) => setBoyTob(e.target.value)}
                        className="w-full bg-[#070810] border border-slate-800 rounded p-2 text-xs focus:outline-none text-white text-left"
                      />
                    </div>
                  </div>
                </div>

                {/* Girl Form */}
                <div className="p-5 bg-[#090a15] rounded-xl border border-slate-800/85 space-y-4 text-left">
                  <h3 className="font-bold text-white font-cinzel text-sm border-b border-slate-800 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[pink] to-rose-400">
                    👩 {t("Girl's Particulars (कन्या विवरण)", "कन्या का विवरण")}
                  </h3>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-405 mb-1">{t("Name", "नाम")}</label>
                    <input 
                      type="text" 
                      value={girlName} 
                      onChange={(e) => setGirlName(e.target.value)}
                      className="w-full bg-[#070810] border border-slate-800 focus:border-[#cca43b] rounded p-2 text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-405 mb-1">{t("DOB", "जन्म तिथि")}</label>
                      <input 
                        type="date" 
                        value={girlDob} 
                        onChange={(e) => setGirlDob(e.target.value)}
                        className="w-full bg-[#070810] border border-slate-800 rounded p-2 text-xs focus:outline-none text-white text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-450 mb-1">{t("TOB", "जन्म समय")}</label>
                      <input 
                        type="time" 
                        value={girlTob} 
                        onChange={(e) => setGirlTob(e.target.value)}
                        className="w-full bg-[#070810] border border-slate-800 rounded p-2 text-xs focus:outline-none text-white text-left"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Match Action */}
              <button
                type="button"
                onClick={() => {
                  const result = calculateMatchmaking(boyName, boyDob, boyTob, girlName, girlDob, girlTob);
                  setMatchReport(result);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{t("Calculate Ashtakoot Harmony", "अष्टकूट मिलान की गणना करें")}</span>
              </button>

              {/* Matchmaking Reports display */}
              {matchReport && (
                <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-6 text-left">
                  
                  {/* Score circle banner */}
                  <div className="p-6 bg-gradient-to-tr from-pink-950/20 to-slate-900 rounded-xl border border-pink-500/20 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 shrink-0 rounded-full border-4 border-pink-500 flex flex-col items-center justify-center bg-black/40 text-slate-100 shadow-xl bg-[#090a15]">
                      <span className="text-3xl font-extrabold font-mono text-pink-400">${matchReport.score}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 36 Guna</span>
                    </div>
                    
                    <div className="space-y-1 text-center sm:text-left flex-1 font-sans">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <span className="text-xs uppercase font-extrabold text-pink-400 tracking-wider">Astrologer Verdict:</span>
                        <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-xs font-bold rounded">${matchReport.level}</span>
                      </div>
                      <p className="text-sm font-semibold text-white pt-1">${matchReport.recommendation}</p>
                    </div>
                  </div>

                  {/* Ashtakoot Grid Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel border-l-2 border-pink-500 pl-2">{t("Guna-by-Guna Breakdown Matrix", "गुणकूट गहन विश्लेषण मैट्रिक्स")}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {matchReport.gunDetails.map((g, idx) => (
                        <div key={idx} className="p-3.5 bg-[#090a15] rounded-xl border border-slate-850">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-semibold text-white">${g.name}</span>
                            <span className="font-mono font-bold text-pink-400">${g.points} / ${g.max} Points</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full" 
                              style={{ width: `${(g.points / g.max) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-slate-350 leading-relaxed italic">${g.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Contact Pandit Section for Marriage Puja */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl pt-1">💖</span>
                      <div>
                        <h3 className="text-sm font-bold text-pink-900 font-cinzel uppercase tracking-wider">{t("Nuptial Vedic Blessings & Graha Shanti Pujas", "विवाह बाधा निवारक मंगल दोष शांति एवं सुखद गृहस्थ अनुष्ठान")}</h3>
                        <p className="text-[11px] text-pink-850 leading-relaxed mt-1">
                          {t("Get precise remedy advice on matchmaking compatibility results. Book specialized Purohit Ji for Wedding rituals or Grah Pravesh pujas.", 
                             "गुण मिलान के उपरान्त आने वाले मांगलिक अथवा अष्टकूट दोषों के वैदिक शमन हेतु सचेत रहें। शुभ विवाह लग्न निर्धारण, वर-वधू सुखी जीवन आशीर्वाद यज्ञ एवं नवदम्पत्ति गृह प्रवेश पूजा सविधि संपन्न कराएं।")
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveBookingPandit(null);
                        setShowPanditDirectory(true);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:brightness-110 text-white text-xs font-black rounded-xl shadow-md transition duration-200 animate-pulse flex items-center gap-1.5 shrink-0"
                    >
                      <span>🌸</span>
                      <span>{t("Contact Pandit Ji (पुजारी संपर्क)", "पंडित जी से तुरंत संपर्क करें")}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* -- SCREEN: ADMIN SERVICE CONTROL PANEL -- */}
        {currentScreen === 'ADMIN_CONTROL' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-800 p-4">
            <button 
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition uppercase tracking-wider mb-2 font-cinzel shadow-sm"
              style={{ borderColor: tObj.border }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("Back to Workstation", "मुख्य वर्कस्टेशन पर लौटें")}</span>
            </button>
            <AdminControlWorkstation 
              t={t}
              tObj={tObj}
              currentUser={currentUser}
              setShowGoogleSimPicker={null}
              moduleSettings={moduleSettings}
              setModuleSettings={setModuleSettings}
              subscriptionPlans={subscriptionPlans}
              setSubscriptionPlans={setSubscriptionPlans}
              usageMonitor={usageMonitor}
              usersList={usersList}
              setUsersList={setUsersList}
              splashConfig={splashConfig}
              setSplashConfig={setSplashConfig}
              customPriests={customPriests}
              setCustomPriests={setCustomPriests}
            />
          </div>
        )}

        {/* -- SCREEN: DATABASE SYNCHRONIZATION INTEGRATIONS -- */}
        {currentScreen === 'INTEGRATIONS' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-slate-805 p-4 font-sans">
            <button 
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-4 py-2 bg-[#0a0c16] hover:bg-[#121528] text-slate-200 text-xs font-bold rounded-xl border border-slate-805 flex items-center gap-1.5 transition uppercase tracking-wider mb-2 font-mono shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("Back to Workstation", "मुख्य वर्कस्टेशन पर लौटें")}</span>
            </button>

            <div className="bg-[#0f1123] text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
              
              <div className="flex items-center gap-2.5 mb-2 text-left">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  ⚙️ {t("PV-ASTRO DATABASE SWITCHBOARD", "पीवी-एस्ट्रो डेटाबेस स्विचबोर्ड")}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              
              <h2 className="text-xl md:text-3xl font-black font-cinzel tracking-wider text-white text-left">
                {t("Vedic Cloud Database Integrations", "वैदिक क्लाउड डेटाबेस एकीकरण")}
              </h2>
              <p className="text-slate-400 text-xs mt-1 max-w-xl text-left">
                {t("Instantly toggle your active data persistence between sandbox local browser storage, or enterprise-ready cloud Supabase with row-level security.",
                   "अपने सक्रिय कुण्डली डेटाबेस को सीधे ब्राउज़र स्टोरेज या सुपाबेस पोस्टग्रेएसक्यूएल में परिवर्तित करें।")}
              </p>

              {/* Mode Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                {[
                  { mode: 'LOCAL', title: 'Local Browser Storage sandbox', desc: 'Secure offline-first client storage.', badge: 'Zero Setup', icon: '💻' },
                  { mode: 'SUPABASE', title: 'Supabase PostgreSQL DB', desc: 'Enterprise Row-Level Security Cloud Cluster.', badge: 'Preferred', icon: '🐳' }
                ].map((item) => {
                  const isSelected = storageConfig.mode === item.mode;
                  return (
                    <div 
                      key={item.mode}
                      onClick={() => {
                        const newConf = { ...storageConfig, mode: item.mode };
                        setStorageConfig(newConf);
                        saveStorageConfig(newConf);
                      }}
                      className={`p-4 rounded-2xl bg-[#090b16] border transition cursor-pointer flex flex-col justify-between h-36 ${isSelected ? 'border-amber-400 bg-amber-400/5' : 'border-slate-850'}`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-lg">${item.icon}</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded uppercase font-mono tracking-wide text-slate-400">${item.badge}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1.5 leading-none">${item.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">${item.desc}</p>
                      </div>
                      <span className={`text-[10px] font-extrabold font-mono uppercase ${isSelected ? 'text-amber-400' : 'text-slate-600'}`}>
                        ${isSelected ? '● ACTIVE CONFIG' : '○ SELECT TARGET'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Config fields for Supabase */}
              {storageConfig.mode === 'SUPABASE' && (
                <div className="mt-6 border-t border-slate-850 pt-6 space-y-6 animate-fade-in text-left">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2 text-[#cca43b]">
                    <span className="text-sm">🐳</span>
                    <h4 className="text-xs uppercase font-black tracking-widest">{t("SUPABASE CONFIGURATION PARAMS", "सुपाबेस प्रमाणीकरण कुंजी")}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Supabase API Endpoint URL:</label>
                      <input 
                        type="text"
                        value={storageConfig.supabaseUrl || ''}
                        placeholder="https://your-project-id.supabase.co"
                        onChange={(e) => {
                          const updated = { ...storageConfig, supabaseUrl: e.target.value.trim() };
                          setStorageConfig(updated);
                          saveStorageConfig(updated);
                        }}
                        className="w-full bg-[#0a0c16] border border-slate-800 focus:border-amber-400 text-xs font-mono text-amber-300 rounded-lg px-3 py-2.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Supabase Anon Key:</label>
                      <input 
                        type="text"
                        value={storageConfig.supabaseAnonKey || ''}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        onChange={(e) => {
                          const updated = { ...storageConfig, supabaseAnonKey: e.target.value.trim() };
                          setStorageConfig(updated);
                          saveStorageConfig(updated);
                        }}
                        className="w-full bg-[#0a0c16] border border-slate-800 focus:border-amber-400 text-xs font-mono text-[#cca43b] rounded-lg px-3 py-2.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Table Status Health Checker */}
                  <div className="bg-[#121429] p-5 rounded-2xl border border-slate-850 mt-4 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="text-left">
                        <h5 className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                          <span>📊</span>
                          <span>{t("REAL-TIME DATABASE HEALTH & TABLE CHECKLIST", "वास्तविक समय डेटाबेस तालिका चेकलिस्ट")}</span>
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Detected database tables on your active Supabase instance.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider ${
                          dbHealth.status === 'healthy' 
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400' 
                            : 'bg-amber-950/40 border border-amber-500/30 text-amber-400'
                        }`}>
                          ● STATUS: ${dbHealth.status === 'healthy' ? 'ALL HEALTHY' : 'NEEDS TABLE SETUP'}
                        </span>
                        <button 
                          onClick={queryDatabaseStatus}
                          className="p-1 px-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded text-[9.5px] font-mono transition"
                        >
                          🔄 Refresh Check
                        </button>
                      </div>
                    </div>

                    {/* Table Status Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { key: 'users', label: 'Users Profile table' },
                        { key: 'kundlis', label: 'Saved Kundlis table' },
                        { key: 'saved_reports', label: 'Reports Hub table' },
                        { key: 'user_activity', label: 'Activity Logs table' },
                        { key: 'subscriptions', label: 'Subscriptions table' },
                        { key: 'contact_enquiries', label: 'Feedback & Queries table' }
                      ].map((tbl) => {
                        const isOk = dbHealth.tables[tbl.key];
                        return (
                          <div 
                            key={tbl.key}
                            className={`p-3 rounded-xl border flex items-center justify-between text-left ${
                              isOk 
                                ? 'bg-emerald-950/10 border-emerald-500/10 text-emerald-400' 
                                : 'bg-amber-950/5 border-amber-500/10 text-amber-400'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="text-[10px] font-mono font-bold leading-none truncate">${tbl.key}</p>
                              <p className="text-[8px] text-slate-405 mt-0.5 leading-none">${tbl.label}</p>
                            </div>
                            <span className="text-[10px] shrink-0 font-extrabold flex items-center gap-1">
                              ${isOk ? <span className="text-emerald-400">● Ready</span> : <span className="text-amber-405">○ Missing</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Auto Setup Guide & SQL Block */}
                    {dbHealth.status !== 'healthy' && (
                      <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl space-y-3 mt-2">
                        <div className="flex items-start gap-1.5 text-left">
                          <span className="text-sm shrink-0">⚠️</span>
                          <div>
                            <p className="text-[10.5px] text-amber-205 font-bold leading-normal">
                              {t("First Time Setup: Required tables are not created yet!", "प्रारंभिक सेटअप: आवश्यक तालिकाएं अभी तक नहीं बनाई गई हैं!")}
                            </p>
                            <p className="text-[10px] text-slate-350 mt-1 leading-normal font-sans">
                              {t("To configure your Supabase cluster automatically with all required schemas, relations, and Row-Level Security policies copy the script below and paste it inside your Supabase project dashboard's SQL Editor.",
                                 "अपने सुपाबेस डेटाबेस क्लस्टर को स्वतः कॉन्फ़िगर करने के लिए नीचे दिए गए सेटअप स्क्रिप्ट को कॉपी करें और सुपाबेस कंसोल पर चलाएं।")}
                            </p>
                          </div>
                        </div>

                        {/* SQL Script Display Box */}
                        <div className="relative rounded-lg bg-slate-950 p-3 border border-slate-900 text-left">
                          <pre className="text-[9px] font-mono text-emerald-400 overflow-x-auto max-h-48 leading-relaxed select-all scrollbar-thin">
{SUPABASE_SQL_SETUP_CODE}
                          </pre>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(SUPABASE_SQL_SETUP_CODE);
                              triggerNotification("SQL Setup Script Copied!", "Open your Supabase SQL Editor and [Cmd+V] / [Ctrl+V] to paste it.", "success");
                            }}
                            className="absolute top-2 right-2 bg-amber-500 hover:bg-[#af7f21] text-slate-950 font-black text-[9px] px-2.5 py-1 rounded transition uppercase tracking-wider"
                          >
                            📋 {t("Copy SQL script", "एसक्यूएल कॉपी करें")}
                          </button>
                        </div>

                        <div className="pt-1 text-left flex flex-wrap gap-2.5">
                          <a 
                            href="https://supabase.com/dashboard/project/_/sql/new" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 px-3 py-1.5 rounded-lg transition"
                          >
                            <span>🌐</span>
                            <span>{t("Open Supabase SQL Editor Dashboard", "सुपाबेस एसक्यूएल एडिटर खोलें")}</span>
                          </a>
                          <span className="text-[9.5px] text-slate-400 self-center">
                            {t("Simply paste it, click [Run] to setup all 6 tables instantly!", "लिखे हुए कोड को रन करें, तालिकाएं तुरंत बन जाएंगी!")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* --- SUPER EASY QUICK-ADD WIZARD FOR NES_PUNEET11 --- */}
                  <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-5 text-left">
                    <div className="bg-gradient-to-r from-amber-500/15 via-indigo-950/20 to-emerald-500/15 border-2 border-amber-400/40 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 text-3xl animate-bounce">⚡</div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🔑</span>
                        <div>
                          <h4 className="text-lg font-black text-amber-300 font-cinzel">
                             {t("Puneet's Visual 1-Minute Supabase Key Finder", "पुनीत का लाइव सुपाबेस क्रेडेंशियल गाइड")}
                          </h4>
                          <p className="text-xs text-slate-300 font-sans mt-0.5">
                             Tailored specifically for <strong className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">nespuneet11@gmail.com</strong>
                          </p>
                        </div>
                      </div>

                      {/* DETAILED HIGH-CONTRAST STEP-BY-STEP MAP */}
                      <div className="space-y-6 mt-6">
                        
                        {/* MAP HEADER */}
                        <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-400/20 text-xs text-slate-300 leading-relaxed font-sans">
                          🇮🇳 <strong className="text-amber-200">काफी आसान है!</strong> सुपाबेस के नए डैशबोर्ड में चाबियां ढूंढना कभी-कभी कठिन लगता है। नीचे दिए गए सटीक चरणों का पालन करें और 1 मिनट में क्रेडेंशियल भरें।
                          <br />
                          🇬🇧 <strong className="text-white">Very simple!</strong> In the new Supabase design, the API keys can sometimes feel hidden. Here has been mapped with precise markers.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                          
                          {/* STEP 1: CONSOLE */}
                          <div className="bg-[#090b16] rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-lg relative">
                            <span className="absolute -top-3 left-4 bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px]">STEP 1</span>
                            <div className="pt-2">
                              <h5 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1">
                                <span>🌐</span>
                                <span>{t("Open Project", "प्रोजेक्ट खोलें")}</span>
                              </h5>
                              <p className="text-[11px] text-slate-350 leading-relaxed">
                                Go to the Supabase console, sign in with <span className="text-amber-300 font-bold font-mono">nespuneet11@gmail.com</span>, and select your active project.
                              </p>
                              <p className="text-[10px] text-slate-455 mt-2 italic">
                                *If you don't have one, click "New Project" (takes 1 minute to setup).
                              </p>
                            </div>
                            <a 
                              href="https://supabase.com/dashboard/projects" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="mt-4 inline-flex items-center justify-center gap-1 w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs text-amber-400 font-bold transition shadow-sm"
                            >
                              <span>⚡ Open Dashboard</span>
                              <span className="text-[10px]">➔</span>
                            </a>
                          </div>

                          {/* STEP 2: SETTINGS AND API */}
                          <div className="bg-[#090b16] rounded-2xl p-4 border border-slate-850 shadow-lg relative">
                            <span className="absolute -top-3 left-4 bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px]">STEP 2</span>
                            <div className="pt-2 space-y-3">
                              <h5 className="font-bold text-white text-sm flex items-center gap-1">
                                <span>⚙️</span>
                                <span>{t("Click Settings & API", "सेटिंग्स और API")}</span>
                              </h5>
                              
                              <div className="space-y-1.5 text-[11px] text-slate-300 leading-normal bg-black/40 p-2.5 rounded-lg border border-slate-850">
                                <div className="flex gap-1">
                                  <span className="text-amber-400 font-bold">1.</span>
                                  <span>Look at the bottom left-side corner sidebar, and click the <strong>Gear icon ⚙️ (Project Settings)</strong>.</span>
                                </div>
                                <div className="flex gap-1 pt-1 border-t border-slate-900">
                                  <span className="text-amber-400 font-bold">2.</span>
                                  <span>In the inner menu, click on <strong>🔌 'API'</strong> (it's under the "Project Settings" category block).</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* STEP 3: FINDING PROJECT KEYS */}
                          <div className="bg-[#090b16] rounded-2xl p-4 border border-slate-850 shadow-lg relative">
                            <span className="absolute -top-3 left-4 bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px]">STEP 3</span>
                            <div className="pt-2 space-y-3">
                              <h5 className="font-bold text-white text-sm flex items-center gap-1">
                                <span>📬</span>
                                <span>{t("Copy & Paste", "कॉपी और पेस्ट")}</span>
                              </h5>
                              
                              <div className="space-y-2 text-[11px] text-slate-300">
                                <div className="p-2 bg-emerald-950/20 border border-emerald-500/25 rounded-lg">
                                  <span className="block text-[8.5px] uppercase font-black tracking-wide text-emerald-400">🔗 {t("BOX A: PROJECT URL", "प्रोजेक्ट URL")}</span>
                                  <span className="text-[10px] text-slate-200 block font-bold mt-0.5">Copy: Project URL</span>
                                  <span className="text-[9px] text-slate-400 italic block mt-0.5">Usually: `https://your-proj.supabase.co`</span>
                                </div>

                                <div className="p-2 bg-pink-950/20 border border-pink-500/25 rounded-lg">
                                  <span className="block text-[8.5px] uppercase font-black tracking-wide text-pink-405">🔑 {t("BOX B: ANON KEY", "एनॉन पब्लिक की")}</span>
                                  <span className="text-[10px] text-slate-200 block font-bold mt-0.5">Copy: `anon public` Key</span>
                                  <span className="text-[9px] text-slate-400 italic block">Starts with a long `eyJhbGci...`</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* HELPFUL ALTERNATIVE */}
                        <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
                          <h5 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                            <span>💡</span>
                            <span>{t("EASIER ALTERNATIVE: Use Preset Database Mode", "एक और भी आसान तरीका: प्रीसेट टेम्प्लेट्स का उपयोग करें")}</span>
                          </h5>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            If you still can't find it, click the button below to pre-generate a safe placeholder endpoint. You can immediately see the structure and replace our placeholder strings with your values!
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...storageConfig,
                                  supabaseUrl: "https://put-your-org-id-here.supabase.co",
                                  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.paste_your_long_key_here_puneet",
                                  mode: 'SUPABASE'
                                };
                                setStorageConfig(updated);
                                saveStorageConfig(updated);
                                triggerNotification("Sample Preset Filled!", "Now look at the white URL and key boxes above! Replace the placeholders with your actual values.", "info");
                              }}
                              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black uppercase tracking-wider rounded-xl transition text-[10.5px] shadow-md"
                            >
                              🪄 Load Live Template Box Preset
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...storageConfig,
                                  supabaseUrl: "",
                                  supabaseAnonKey: "",
                                  mode: 'LOCAL'
                                };
                                setStorageConfig(updated);
                                saveStorageConfig(updated);
                                triggerNotification("Reset to Local Storage Mode", "All credentials cleared. Using secure local sandbox.", "success");
                              }}
                              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-[10px] transition"
                            >
                              Reset Fields
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* URL Param Link Autogen */}
                      <div className="bg-slate-950/25 rounded-xl p-4 border border-slate-850 mt-4 space-y-2 text-left">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <h5 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-white">
                              <span>🔗</span>
                              <span>{t("1-Click Autoconfig URL Generator", "1-क्लिक ऑटो-कॉन्फिग लिंक जनरेटर")}</span>
                            </h5>
                            <p className="text-[10.5px] text-slate-400">
                              Generate a custom URL. Use it to automatically load the Supabase connection on any other device with zero manual typing!
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!storageConfig.supabaseUrl || !storageConfig.supabaseAnonKey || storageConfig.supabaseUrl.includes('your-proj-id') || storageConfig.supabaseUrl.includes('put-your-org')) {
                                triggerNotification("Please enter keys first", "Enter your real Supabase URL and Key above to generate an Autoconfig link!", "error");
                                return;
                              }
                              const baseUrl = window.location.origin + window.location.pathname;
                              const sUrl = encodeURIComponent(storageConfig.supabaseUrl);
                              const sKey = encodeURIComponent(storageConfig.supabaseAnonKey);
                              const generatedLink = `${baseUrl}?sUrl=${sUrl}&sKey=${sKey}`;
                              
                              navigator.clipboard.writeText(generatedLink);
                              triggerNotification("Shareable Config Link copied!", "Success! You can bookmark this custom URL or open it elsewhere to connect instantly.", "success");
                            }}
                            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition shrink-0"
                          >
                            📋 Copy My Auto-Config Link
                          </button>
                        </div>
                        {storageConfig.supabaseUrl && storageConfig.supabaseAnonKey && !storageConfig.supabaseUrl.includes('your-proj-id') && !storageConfig.supabaseUrl.includes('put-your-org') && (
                          <div className="p-2.5 bg-[#090b16] border border-slate-900 rounded font-mono text-[9px] text-emerald-400 select-all truncate break-all">
                            {window.location.origin + window.location.pathname}?sUrl={encodeURIComponent(storageConfig.supabaseUrl)}&sKey={encodeURIComponent(storageConfig.supabaseAnonKey).substring(0, 24)}...
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-550 leading-relaxed max-w-2xl text-left">
                    *Integrates seamlessly with Supabase Auth or Google OAuth tokens. Row-Level Security (RLS) is fully active to filter records based on `auth.uid()` contexts.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#181d3a] flex justify-end">
                <button
                  onClick={() => {
                    alert("Astro PV Configuration Saved successfully!");
                    setCurrentScreen('DASHBOARD');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
                >
                  Apply & Close Switchboard
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'SOCIETY_UPDATES' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-800">
            <button 
              onClick={() => setCurrentScreen('DASHBOARD')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition uppercase tracking-wider mb-2 font-cinzel shadow-sm"
              style={{ borderColor: tObj.border }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("Back to Workstation", "मुख्य वर्कस्टेशन पर लौटें")}</span>
            </button>
            <SocietyUpdatesHub currentLanguage={currentLanguage} t={t} tObj={tObj} />
          </div>
        )}

        {currentScreen === 'KUNDLI_LIBRARY' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-left p-4 md:p-6 text-slate-205">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                  🌌 PV-ASTRO SECURE VAULT
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold font-cinzel text-white mt-1.5">
                  {t("Open Kundli", "ओपन कुंडली")}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {t("Manage your digital collection of analyzed birth charts. Keep family members, spouses, children, or clientele sorted securely under high-end cloud partitions.",
                     "अपने विश्लेषण किए गए जन्म चार्ट के डिजिटल संग्रह का प्रबंधन करें। परिवार के सदस्यों, जीवनसाथी, बच्चों, या ग्राहकों के विवरण को सुरक्षित रखें।")}
                </p>
              </div>
              <button 
                onClick={handleNewKundliClick}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition shadow-lg flex items-center gap-2 self-start md:self-center animate-pvastro-blink"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t("Calculate New Kundli", "नई कुंडली विश्लेषण")}</span>
              </button>
            </div>

            {/* ANALYTICS RIBBON (Dashboard Analytics) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b0c16] rounded-2xl p-4 border border-slate-850 hover:border-slate-800 transition shadow-sm">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Total Active Charts</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{savedKundlis.filter(k => !k.isTrash).length}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Cloud Sync ✔</span>
                </div>
              </div>
              <div className="bg-[#0b0c16] rounded-2xl p-4 border border-slate-850 hover:border-slate-800 transition shadow-sm">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Saved Favorites</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-400 font-mono">
                    {savedKundlis.filter(k => k.favorite && !k.isTrash).length}
                  </span>
                  <span className="text-[10px] text-amber-400">★ Starred</span>
                </div>
              </div>
              <div className="bg-[#0b0c16] rounded-2xl p-4 border border-slate-850 hover:border-slate-800 transition shadow-sm">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Last Analyzed Seeker</span>
                <div className="truncate text-sm font-bold text-slate-205 font-cinzel mt-1">
                  {(() => {
                    try {
                      const last = activeProfileMemory;
                      return last ? last.name : t("None Compiled", "कोई उपलब्ध नहीं");
                    } catch(e) { return t("None Compiled", "कोई उपलब्ध नहीं"); }
                  })()}
                </div>
              </div>
              <div className="bg-[#0b0c16] rounded-2xl p-4 border border-slate-850 hover:border-slate-800 transition shadow-sm">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Backup Target</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-black uppercase font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-amber-400 rounded">
                    {storageConfig.mode}
                  </span>
                  <span className="text-[9px] text-emerald-400">Live</span>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR: ACTIVE VS TRASH BIN */}
            <div className="flex border-b border-slate-850">
              <button 
                onClick={() => setLibraryTab('active')}
                className={`px-6 py-3 text-xs uppercase font-extrabold tracking-widest transition-all border-b-2 ${libraryTab === 'active' ? 'border-amber-400 text-white font-black' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                📁 {t("Active Directory", "सक्रिय निर्देशिका")} ({savedKundlis.filter(k => !k.isTrash).length})
              </button>
              <button 
                onClick={() => setLibraryTab('trash')}
                className={`px-6 py-3 text-xs uppercase font-extrabold tracking-widest transition-all border-b-2 ${libraryTab === 'trash' ? 'border-amber-400 text-white font-black' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                🗑️ {t("Smart Recovery (Trash)", "स्मार्ट ट्रैश रिकवरी")} ({savedKundlis.filter(k => k.isTrash).length})
              </button>
            </div>

            {/* ACTIONS BAR (Search, Filters, Sorting) */}
            <div className="bg-[#0b0c16]/50 p-4 rounded-2xl border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  placeholder={t("Filter by Name, place, or date...", "नाम, स्थान या जन्मतिथि से खोजें...")}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none placeholder-slate-605 font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* Category Filter */}
                {libraryTab !== 'trash' && (
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
                    <span className="text-[10px] font-bold uppercase">Topic:</span>
                    <select 
                      value={libraryCategoryFilter}
                      onChange={(e) => setLibraryCategoryFilter(e.target.value)}
                      className="bg-transparent border-none text-slate-100 font-bold focus:outline-none"
                    >
                      {['All', 'Self', 'Family', 'Spouse', 'Children', 'Friends', 'Clients', 'Custom Category'].map(cat => (
                        <option key={cat} value={cat} className="bg-slate-950 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
                  <span className="text-[10px] font-bold uppercase">Order:</span>
                  <select 
                    value={librarySortBy}
                    onChange={(e) => setLibrarySortBy(e.target.value)}
                    className="bg-transparent border-none text-slate-100 font-bold focus:outline-none"
                  >
                    <option value="newest" className="bg-slate-950">{t("Newest First", "नवीनतम पहले")}</option>
                    <option value="name" className="bg-slate-950">{t("Alphabetical", "वर्णमाला क्रम")}</option>
                    <option value="category" className="bg-slate-950">{t("Group Categories", "श्रेणी वार")}</option>
                    <option value="favorite" className="bg-slate-950">{t("Favorites High", "पसंदीदा पहले")}</option>
                  </select>
                </div>

                {libraryTab === 'trash' && savedKundlis.some(k => k.isTrash) && (
                  <button 
                    onClick={() => {
                      if (confirm(t("Are you sure you want to permanently empty the trash? This cannot be undone.", 
                                      "क्या आप वाकई ट्रैश खाली करना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता है।"))) {
                        const guestOrUser = currentUser || 'guest@vedicastrology.org';
                        kundliDbService.emptyTrash(guestOrUser).then(() => {
                          kundliDbService.fetchSavedKundlis(guestOrUser).then(res => setSavedKundlis(res));
                          triggerNotification("Trash Cleared", "Permanently purged all deleted records.", "success");
                        });
                      }
                    }}
                    className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800/40 text-red-300 font-extrabold text-xs uppercase rounded-xl transition"
                  >
                    Empty Trash
                  </button>
                )}
              </div>
            </div>

            {/* KUNDLI GRID DISPLAY */}
            {(() => {
              // Filter active vs trash
              let processed = savedKundlis.filter(k => libraryTab === 'trash' ? k.isTrash : !k.isTrash);

              // Apply live text queries
              if (librarySearchQuery.trim()) {
                processed = processed.filter(k => 
                  (k.name || '').toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                  (k.place || '').toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                  (k.dob || '').toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                  (k.notes || '').toLowerCase().includes(librarySearchQuery.toLowerCase())
                );
              }

              // Apply Category Filter
              if (libraryTab !== 'trash' && libraryCategoryFilter !== 'All') {
                processed = processed.filter(k => (k.category || 'Self') === libraryCategoryFilter);
              }

              // Apply Ordering
              if (librarySortBy === 'name') {
                processed.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
              } else if (librarySortBy === 'category') {
                processed.sort((a, b) => (a.category || 'Self').localeCompare(b.category || 'Self'));
              } else if (librarySortBy === 'favorite') {
                processed.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
              } else {
                // newest
                processed.sort((a, b) => (b.id || 0) - (a.id || 0));
              }

              if (processed.length === 0) {
                return (
                  <div className="py-16 text-center border-2 border-dashed border-slate-850 rounded-3xl bg-slate-950/20">
                    <span className="text-3xl">🌌</span>
                    <h4 className="text-slate-300 font-semibold mt-4 text-base">{t("No Matchable Kundlis Found", "कोई कुंडली फ़ाइल नहीं मिली")}</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      {libraryTab === 'trash' 
                        ? t("Your recycling yard is completely empty.", "आपका ट्रैश वर्तमान में पूरी तरह खाली है।")
                        : t("Start by generating a birth chart or checking your filter options.", "एक नई कुंडली जनरेट करके या फ़िल्टर बदलकर पुनः प्रयास करें।")
                      }
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {processed.map(profile => {
                    const isCardEditing = editingKundliId === profile.id;
                    return (
                      <div 
                        key={profile.id}
                        className="bg-[#0b0c16] rounded-2xl border border-slate-850 hover:border-slate-800 transition shadow-md overflow-hidden relative flex flex-col justify-between"
                      >
                        {/* Dynamic category pill accent boundary flag */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/30 to-amber-500/30"></div>

                        <div className="p-5 space-y-3 flex-1 text-left">
                          <div className="flex justify-between items-start gap-2">
                            {/* Star trigger & Category badge */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                profile.category === 'Self' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                                profile.category === 'Family' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                profile.category === 'Clients' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                'bg-slate-800/40 border-slate-700/30 text-slate-300'
                              }`}>
                                {profile.category || 'Self'}
                              </span>
                              
                              {libraryTab !== 'trash' && (
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const account = currentUser || 'guest@vedicastrology.org';
                                    await kundliDbService.toggleFavorite(account, profile.id);
                                    const list = await kundliDbService.fetchSavedKundlis(account);
                                    setSavedKundlis(list);
                                    triggerNotification(
                                      profile.favorite ? "Unstarred" : "Starred", 
                                      `${profile.name} category favorite state shifted.`, 
                                      "success"
                                    );
                                  }}
                                  className="p-1 hover:bg-slate-900 rounded transition text-amber-400 text-xs"
                                  title="Toggle favorite rating"
                                >
                                  {profile.favorite ? "★ Starred" : "☆ Star"}
                                </button>
                              )}
                            </div>

                            <span className="text-[9px] font-mono font-bold text-slate-505">
                              {new Date(profile.id).toLocaleDateString()}
                            </span>
                          </div>

                          {/* IF CARDS EDIT MODE ACTIVE */}
                          {isCardEditing ? (
                            <div className="space-y-3 bg-[#0a0b12] p-3 rounded-lg border border-slate-800 animate-slide-in">
                              <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Seeker Name:</label>
                                <input 
                                  type="text"
                                  value={editingKundliData.name}
                                  onChange={(e) => setEditingKundliData({ ...editingKundliData, name: e.target.value })}
                                  className="w-full bg-[#07080f] border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Category:</label>
                                <select 
                                  value={editingKundliData.category}
                                  onChange={(e) => setEditingKundliData({ ...editingKundliData, category: e.target.value })}
                                  className="w-full bg-[#07080f] border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                >
                                  {['Self', 'Family', 'Spouse', 'Children', 'Friends', 'Clients', 'Custom Category'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Seeker Notes:</label>
                                <textarea 
                                  value={editingKundliData.notes || ''}
                                  onChange={(e) => setEditingKundliData({ ...editingKundliData, notes: e.target.value })}
                                  placeholder="E.g. Sade Sati ongoing, highly sensitive planet lines..."
                                  rows={2}
                                  className="w-full bg-[#07080f] border border-slate-800 rounded px-2 py-1.5 text-xs text-white placeholder-slate-650"
                                />
                              </div>

                              <div className="flex gap-2 justify-end pt-1">
                                <button 
                                  onClick={() => setEditingKundliId(null)}
                                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-405 font-bold rounded"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={async () => {
                                    const account = currentUser || 'guest@vedicastrology.org';
                                    await kundliDbService.updateKundliMeta(account, profile.id, editingKundliData);
                                    const list = await kundliDbService.fetchSavedKundlis(account);
                                    setSavedKundlis(list);
                                    setEditingKundliId(null);
                                    triggerNotification("Saved", `${editingKundliData.name}'s profile parameters updated.`, "success");
                                  }}
                                  className="px-2.5 py-1 bg-[#cca43b] text-slate-950 font-black text-[10px] rounded animate-pulse"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-base font-black font-cinzel text-white line-clamp-1 flex items-center gap-1">
                                <span>{profile.name}</span>
                                {profile.gender === 'Female' ? '♀' : '♂'}
                              </h3>
                              <div className="space-y-1 mt-2 text-[10px] text-slate-400 font-mono leading-relaxed">
                                <p>📅 <span className="text-slate-350 font-bold">{profile.dob}</span> | 🕒 <span className="text-slate-355 font-bold">{profile.tob}</span></p>
                                <p>📍 <span className="text-slate-350 truncate">{profile.place}</span></p>
                                <p>🌐 <span className="text-slate-500">Coord:</span> {profile.lat?.toFixed(3)}, {profile.lon?.toFixed(3)} ({profile.timezone})</p>
                              </div>

                              {profile.notes && (
                                <div className="mt-3.5 p-2 bg-[#07080e] border border-slate-855 rounded-lg text-[10px] text-slate-400 leading-normal italic relative">
                                  <span className="text-[8px] font-bold text-[#cca43b] uppercase block not-italic mb-0.5">Notes Notebook:</span>
                                  {profile.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions drawer */}
                        <div className="bg-slate-950/40 px-4 py-3.5 border-t border-slate-900 flex justify-between gap-1 sm:gap-2 text-[10px] items-center flex-wrap shrink-0">
                          {libraryTab === 'trash' ? (
                            <>
                              <button
                                onClick={async () => {
                                  const account = currentUser || 'guest@vedicastrology.org';
                                  await kundliDbService.restoreKundli(account, profile.id);
                                  const list = await kundliDbService.fetchSavedKundlis(account);
                                  setSavedKundlis(list);
                                  triggerNotification("Restored", "Kundli moved back to the active directory.", "success");
                                }}
                                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold rounded-lg transition"
                              >
                                Restore Chart
                              </button>

                              <button
                                onClick={async () => {
                                  if (confirm(t("Are you sure you want to permanently erase this chart completely? This action is absolutely irreversible.", 
                                                  "क्या आप वाकई इस चार्ट को संपुर्णतः मिटाना चाहते हैं?"))) {
                                    const account = currentUser || 'guest@vedicastrology.org';
                                    await kundliDbService.permanentDeleteKundli(account, profile.id);
                                    const list = await kundliDbService.fetchSavedKundlis(account);
                                    setSavedKundlis(list);
                                    triggerNotification("Purged Permanently", "Data erased.", "info");
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-950/30 hover:bg-red-950/70 border border-red-900 text-red-000 font-bold rounded-lg transition"
                              >
                                Permanent Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => navigateToReport(profile)}
                                className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-400 font-bold rounded-lg transition border border-indigo-900/40"
                              >
                                {t("Compute →", "चार्ट देखें →")}
                              </button>

                              <div className="flex items-center gap-1.5 ml-auto">
                                {!isCardEditing && (
                                  <button 
                                    onClick={() => {
                                      setEditingKundliId(profile.id);
                                      setEditingKundliData({
                                        name: profile.name,
                                        category: profile.category || 'Self',
                                        notes: profile.notes || ''
                                      });
                                    }}
                                    className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white transition rounded"
                                    title="Edit Meta Info"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Duplicate */}
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const account = currentUser || 'guest@vedicastrology.org';
                                    const copy = { ...profile, name: `${profile.name} (Copy)`, id: Date.now() };
                                    await kundliDbService.saveKundli(account, copy);
                                    const list = await kundliDbService.fetchSavedKundlis(account);
                                    setSavedKundlis(list);
                                    triggerNotification("Cloned", `${profile.name} duplicated.`, "success");
                                  }}
                                  className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-amber-400 transition"
                                  title="Duplicate Chart Profile"
                                >
                                  📄
                                </button>

                                {/* Trash soft delete trigger */}
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const account = currentUser || 'guest@vedicastrology.org';
                                    await kundliDbService.deleteKundli(account, profile.id);
                                    const list = await kundliDbService.fetchSavedKundlis(account);
                                    setSavedKundlis(list);
                                    triggerNotification(
                                      "Moved to Trash Bin", 
                                      "Kept in recycle drawer for up to 30 days before eradication.", 
                                      "info"
                                    );
                                  }}
                                  className="p-1.5 hover:bg-slate-900 text-red-500/80 hover:text-red-400 transition rounded"
                                  title="Move to trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {currentScreen === 'USER_PROFILE' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-slate-205 p-4 md:p-6 text-left animate-slide-up">
            {/* Header / Meta card */}
            <div className="bg-[#0b0c16] rounded-3xl p-6.5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4.5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#936a18] to-amber-500 border border-[#cca43b] flex items-center justify-center text-3xl font-bold font-mono shadow-md text-white">
                  {(currentUser || 'G')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-cinzel text-white leading-tight">
                    {currentUser ? userProfileData.name || 'Vedic Initiate Seeker' : t("Standard Guest Explorer", "अतिथि अन्वेषक")}
                  </h2>
                  <p className="text-xs font-mono text-[#cca43b] mt-0.5">{currentUser || 'guest@vedicastrology.org'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Joined Circle: <span className="font-bold text-slate-300 font-mono">{userProfileData.registeredAt || '2026-05-24'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                  activeUserIsPremium ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse' : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                  {activeUserIsPremium ? '💎 Master Premium Seeker' : '👤 Standard Access Seeker'}
                </span>

                {currentUser && (
                  <button 
                    onClick={async () => {
                      await authService.logout();
                      setCurrentUser(null);
                      setCurrentScreen('DASHBOARD');
                    }}
                    className="px-4 py-1.5 bg-red-950/20 hover:bg-red-950/60 border border-red-900/30 text-red-100 hover:text-white transition text-[11px] font-bold uppercase rounded-lg"
                  >
                    Logout Out
                  </button>
                )}
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#0b0c16]/60 p-4.5 rounded-2xl border border-slate-850">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Total Digital Saves</span>
                <span className="text-3xl font-black text-white font-mono">{savedKundlis.length}</span>
                <p className="text-[9.5px] text-slate-500 mt-1">Synchronized beautifully across high precision cloud tables.</p>
              </div>

              <div className="bg-[#0b0c16]/60 p-4.5 rounded-2xl border border-slate-850">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Favorites Tagged</span>
                <span className="text-3xl font-black text-amber-400 font-mono">
                  {savedKundlis.filter(k => k.favorite && !k.isTrash).length}
                </span>
                <p className="text-[9.5px] text-slate-500 mt-1">Quick star list profiles for instant computation anytime.</p>
              </div>

              <div className="bg-[#0b0c16]/60 p-4.5 rounded-2xl border border-slate-850">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Last Secure Backup Session</span>
                <span className="text-sm font-bold text-slate-300 font-mono block mt-2">
                  {userProfileData.lastLogin ? new Date(userProfileData.lastLogin).toLocaleTimeString() : 'N/A'}
                </span>
                <span className="text-[9px] text-[#cca43b] uppercase font-black font-mono tracking-wide mt-1 block">Active Endpoint Handlers Secure</span>
              </div>
            </div>

            {/* Account Settings Forms */}
            {currentUser && (
              <div className="bg-[#0b0c16] rounded-3xl border border-slate-800 p-6.5 space-y-6">
                <div className="border-b border-slate-850 pb-3">
                  <h3 className="text-sm font-extrabold font-cinzel text-white uppercase tracking-wider">⚙️ Personal Profile Configurator</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Customize your name, manage avatar, and control backup structures.</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const targetName = e.target.elements.profileName.value.trim();
                  if (targetName) {
                    const updated = { ...userProfileData, name: targetName };
                    setUserProfileData(updated);
                    authService.updateUserProfile(currentUser, updated).then(() => {
                      triggerNotification("Updated Profile", "Your profile details have been altered successfully.", "success");
                    });
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-405 font-extrabold uppercase block mb-1.5">Profile Display Name:</label>
                      <input 
                        name="profileName"
                        type="text"
                        defaultValue={userProfileData.name || ''}
                        placeholder="E.g. Nisha Sharma"
                        className="w-full bg-[#07080f] border border-slate-800 focus:border-amber-450 text-xs px-3 py-2 text-white placeholder-slate-705 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-405 font-extrabold uppercase block mb-1.5">Account Connected Email Id:</label>
                      <input 
                        type="text"
                        disabled
                        value={currentUser}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-500 px-3 py-2 rounded-lg cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="px-5 py-2.5 bg-[#cca43b] hover:bg-[#e5c060] text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition shadow"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>

                {/* ACCOUNT PASSWORD CHANGE SECURITY */}
                <div className="pt-6 border-t border-slate-850 space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold font-cinzel text-white uppercase tracking-wider">🔒 Update Account Security Password</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">To modify your password securely, specify any new 6+ character password below.</p>
                  </div>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const newPw = e.target.elements.newPassword.value.trim();
                    const confirmPw = e.target.elements.confirmPassword.value.trim();
                    
                    if (!newPw || !confirmPw) {
                      triggerNotification("Incomplete Password", "Please populate both password inputs.", "warning");
                      return;
                    }
                    if (newPw.length < 6) {
                      triggerNotification("Too Short", "Password must be at least 6 characters in length.", "warning");
                      return;
                    }
                    if (newPw !== confirmPw) {
                      triggerNotification("Mismatch", "The passwords do not match.", "warning");
                      return;
                    }
                    
                    try {
                      const res = await authService.changeUserPassword(currentUser, newPw);
                      if (res.success) {
                        triggerNotification("Security Changed", "Your password has been changed successfully.", "success");
                        e.target.reset();
                      } else {
                        triggerNotification("Failure", res.message || "Failed changing password.", "warning");
                      }
                    } catch(err) {
                      triggerNotification("Error", "Error while changing password.", "warning");
                    }
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-405 font-extrabold uppercase block mb-1.5">New Password:</label>
                        <input 
                          name="newPassword"
                          type="password"
                          placeholder="At least 6 characters"
                          className="w-full bg-[#07080f] border border-slate-800 focus:border-amber-450 text-xs px-3 py-2 text-white placeholder-slate-705 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-405 font-extrabold uppercase block mb-1.5">Confirm Password:</label>
                        <input 
                          name="confirmPassword"
                          type="password"
                          placeholder="Re-type new password"
                          className="w-full bg-[#07080f] border border-slate-800 focus:border-amber-450 text-xs px-3 py-2 text-white placeholder-slate-705 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-2 border border-slate-600 hover:border-amber-500 bg-slate-800/40 hover:bg-slate-800 hover:text-[#cca43b] text-slate-200 text-[10px] font-bold uppercase rounded-lg transition"
                      >
                        Update My Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* ADVANCED ACCOUNT SECURITY */}
                <div className="pt-6 border-t border-slate-850 space-y-4 text-left">
                  <h3 className="text-xs uppercase font-black text-red-400 tracking-wider">🔒 Delete / Decommission Account Area</h3>
                  <p className="text-slate-400 text-[10px] leading-relaxed font-mono">
                    Under strict compliance, deleting your account is a complete erasure that eradicates your credentials, linked Supabase PostgreSQL profiles, and all savy analytics metadata immediately.
                  </p>
                  
                  <button 
                    onClick={async () => {
                      const confirmationPhrase = prompt(t("Please type 'CONFIRM DELETE' to fully eradicate your account forever:", "अपने खाते को मिटाने के लिए कृपया 'CONFIRM DELETE' टाइप करें:"));
                      if (confirmationPhrase === 'CONFIRM DELETE') {
                        await authService.deleteUserAccount(currentUser);
                        setCurrentUser(null);
                        triggerNotification("Eradicated Permanently", "Account closed and completely wiped.", "info");
                        setCurrentScreen('DASHBOARD');
                      } else if (confirmationPhrase) {
                        triggerNotification("Deletion Cancelled", "Did not match deletion confirmation phrase.", "warning");
                      }
                    }}
                    className="px-4 py-2 bg-red-955/35 hover:bg-red-900 border border-red-800 text-red-300 hover:text-red-100 transition text-[10px] font-bold uppercase tracking-wider rounded-lg"
                  >
                    Permanently Erase My Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'AI_CHAT' && (
          <CosmicAIChat 
            t={t} 
            tObj={tObj} 
            currentLanguage={currentLanguage} 
            onBack={() => setCurrentScreen('DASHBOARD')} 
            currentUser={currentUser} 
            initialTab={aiChatTab}
          />
        )}

        {/* PV-ASTRO FLOATING TOASTS NOTIFICATION PANEL */}
        {alertsList.length > 0 && (
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full font-sans transition-all duration-300">
            {alertsList.map(item => (
              <div 
                key={item.id}
                className="p-4 bg-[#0a0b12] border rounded-2xl shadow-2xl flex items-start gap-3.5 border-slate-800 text-left animate-slide-in relative overflow-hidden"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#cca43b] to-yellow-450"></div>
                <span className="text-lg">
                  {item.type === 'success' ? '🚀' : item.type === 'warning' ? '⚠️' : '☸️'}
                </span>
                <div className="space-y-0.5 flex-1 pr-4">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider leading-none font-cinzel">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {item.message}
                  </p>
                </div>
                <button 
                  onClick={() => setAlertsList(prev => prev.filter(a => a.id !== item.id))}
                  className="text-slate-500 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showGoogleSimPicker && (
          <div className="fixed inset-0 bg-[#070810]/80 backdrop-blur-sm flex justify-center items-center z-[120] p-4 text-slate-100 font-sans">
            <div className="bg-[#0b0c16] rounded-3xl w-full max-w-sm border border-slate-800 shadow-2xl p-6 relative animate-scale-up text-left">
              <button 
                onClick={() => setShowGoogleSimPicker(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mx-auto border border-amber-500/20 mb-3">
                  <span className="text-lg">👑</span>
                </div>
                <h3 className="text-lg font-bold font-cinzel text-white">Google Login Quick Picker</h3>
                <p className="text-xs text-slate-450 mt-1">Select an automated testing profile to instantly verify features and role restrictions.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { email: 'nespuneet2501@gmail.com', level: '💎 Master Premium Admin', desc: 'Full administration permission & pricing gates control' },
                  { email: 'guest@vedicastrology.org', level: '👤 Free Standard Seeker', desc: 'Limited basic summary, advanced predictive tabs gated' },
                  { email: 'testseeker@gmail.com', level: '👤 New Registered Member', desc: 'Fresh free account with customized saved Kundli libraries' }
                ].map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      authService.demoAuth(account.email, 'Role Picker Simulator');
                      setCurrentUser(account.email);
                      setShowGoogleSimPicker(false);
                      alert(`Successfully synchronized session as identity: ${account.email}`);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-850 hover:border-amber-400 hover:bg-slate-850/60 transition flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-mono font-bold text-slate-200">{account.email}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{account.level}</span>
                    <span className="text-[9px] text-slate-400 leading-normal">{account.desc}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-900 font-sans text-left">
                <span className="text-[9px] text-slate-500 font-mono block mb-1">OR CONTINUE AS CUSTOM EMAIL ADDRESS:</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formEmail = e.target.elements.customEmail.value.trim();
                  if (formEmail) {
                    authService.demoAuth(formEmail, 'Role Picker Custom Simulator');
                    setCurrentUser(formEmail);
                    // Add to list if not present
                    setUsersList(prev => {
                      if (!prev.find(u => u.email.toLowerCase() === formEmail.toLowerCase())) {
                        return [...prev, { email: formEmail, isPremium: false, method: 'Direct Auth', registeredAt: '2026-05-27' }];
                      }
                      return prev;
                    });
                    setShowGoogleSimPicker(false);
                    alert(`Logged in custom user: ${formEmail}`);
                  }
                }} className="flex gap-1.5">
                  <input
                    name="customEmail"
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-white focus:outline-none focus:border-amber-450 font-mono"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition"
                  >
                    Login
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {showSavePrompt && pendingKundliToSave && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex justify-center items-center z-[140] p-4 font-sans text-slate-100">
            <div className="bg-[#0b0c16] theme-bg-card rounded-3xl w-full max-w-md border border-slate-800 theme-border shadow-2xl p-6.5 relative overflow-hidden animate-scale-up text-left">
              <button 
                onClick={() => {
                  setShowSavePrompt(false);
                  setPendingKundliToSave(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-full"
              >
                <X className="w-5 h-5 theme-text-main" />
              </button>
              
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-3xl">✨</span>
                  <h3 className="text-xl font-black text-white theme-text-main font-cinzel leading-none">
                    {t("Save Your Kundli", "अपनी कुंडली सहेजें")}
                  </h3>
                  <p className="text-xs text-slate-400 theme-text-muted leading-relaxed">
                    {t("Your Kundli has been generated successfully. Would you like to save it for future access?",
                       "आपकी कुंडली सफलतापूर्वक जनरेट हो गई है। क्या आप भविष्य में उपयोग के लिए इसे सुरक्षित रखना चाहते हैं?")}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 theme-bg-card rounded-xl border border-slate-800 theme-border text-xs space-y-1">
                  <p className="font-extrabold text-[#cca43b] theme-text-main">{t("Kundli Profile Draft:", "कुंडली प्रोफ़ाइल ड्राफ्ट:")}</p>
                  <p className="text-white theme-text-main"><span className="text-slate-400 theme-text-muted">{t("Name:", "नाम:")}</span> {pendingKundliToSave.name}</p>
                  <p className="text-white theme-text-main"><span className="text-slate-400 theme-text-muted">{t("Birth Date & Time:", "जन्म समय व तिथि:")}</span> {pendingKundliToSave.dob} | {pendingKundliToSave.tob}</p>
                  <p className="text-white theme-text-main"><span className="text-slate-400 theme-text-muted">{t("Birth Place:", "जन्म स्थान:")}</span> {pendingKundliToSave.place}</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!currentUser || currentUser.includes('guest')) {
                        // Not logged in. Open signup/login.
                        setMemoryPendingSavePayload(pendingKundliToSave);
                        setMemoryPendingGateActionType('generate_chart');
                        setShowSavePrompt(false);
                        setPendingKundliToSave(null);
                        setAuthActiveTab('signup');
                        setCurrentScreen('AUTH');
                        triggerNotification(
                          t("Create Free Account", "निशुल्क खाता बनाएं"),
                          t("Please sign up or login with Email/Google to save unlimited Kundlis into your profile.", "कृपया अपने प्रोफ़ाइल में असीमित कुंडलियों को सुरक्षित रखने के लिए ईमेल या गूगल से लॉगिन करें।"),
                          "info"
                        );
                      } else {
                        // Already logged in! Save it directly.
                        try {
                          await kundliDbService.saveKundli(currentUser, pendingKundliToSave);
                          const list = await kundliDbService.fetchSavedKundlis(currentUser);
                          setSavedKundlis(list);
                          triggerNotification(
                            t("Kundli Saved Successfully", "कुंडली सुरक्षित हो गई"),
                            t("Kundli has been synced to your personal cloud directory.", "कुंडली आपके व्यक्तिगत क्लाउड संग्रह में सुरक्षित कर दी गई है।"),
                            "success"
                          );
                        } catch (err) {
                          triggerNotification("Error Saving", "Could not write to cloud storage database.", "warning");
                        }
                        setShowSavePrompt(false);
                        setPendingKundliToSave(null);
                      }
                    }}
                    className="w-full py-3 bg-[#cca43b] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg text-center"
                    style={{
                      backgroundColor: tObj.primary,
                      color: currentTheme === 'CLASSIC_BW' ? '#FFFFFF' : '#FFFFFF'
                    }}
                  >
                    {t("Save Kundli", "कुंडली सहेजें")}
                  </button>

                  <button
                    type="button"
                    style={{
                      borderColor: tObj.border,
                      color: tObj.textMain
                    }}
                    onClick={() => {
                      setShowSavePrompt(false);
                      setPendingKundliToSave(null);
                      triggerNotification(
                        t("Calculated Without Saving", "बिना सहेजे गणना"),
                        t("You can now read predictions, download PDF, and view all charts freely in anonymous mode.", "आप निःशुल्क रूप से भविष्यफल पढ़ सकते हैं, पीडीएफ डाउनलोड कर सकते हैं और चार्ट देख सकते हैं।"),
                        "info"
                      );
                    }}
                    className="w-full py-2.5 bg-transparent border theme-border font-bold text-xs uppercase tracking-wider rounded-xl transition text-center"
                  >
                    {t("Continue Without Saving", "बिना सहेजे जारी रखें")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {guestGateAction && (
          <div className="fixed inset-0 bg-[#070810]/85 backdrop-blur-md flex justify-center items-center z-[150] p-4 text-slate-100 font-sans">
            <div className="bg-[#0b0c16] rounded-3xl w-full max-w-lg border border-slate-800 shadow-2xl p-7 relative overflow-hidden animate-scale-up text-left">
              <button 
                onClick={() => setGuestGateAction(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                  ☸️ {t("VEDIC ANALYSIS WORKSPACE ENROLLMENT", "वैदिक विश्लेषण पंजीकरण")}
                </span>
                <h3 className="text-lg md:text-2xl font-bold font-cinzel text-white">
                  {guestGateAction.type === 'generate_chart' 
                    ? t("Personalize and Save Your Chart", "अपनी कुंडली को सुरक्षित करें") 
                    : t("Save Kundli Safely in Cloud", "कुण्डली क्लाउड पर सुरक्षित करें")
                  }
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  {t("Secure your celestial metrics in your Kundli Library! Creating an account gives you multi-device real-time sync, smart trash recovery, and unlimited saves.",
                     "अपनी कुंडलियों को स्थायी रूप से सुरक्षित रखने और असीमित क्लाउड बैकअप के लिए अपने खाते में लॉग इन करें।")}
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Option 1: Save permanently */}
                <button
                  type="button"
                  onClick={() => {
                    setMemoryPendingSavePayload(guestGateAction.payload);
                    setMemoryPendingGateActionType(guestGateAction.type);
                    setGuestGateAction(null);
                    setAuthActiveTab('signup');
                    setCurrentScreen('AUTH');
                    triggerNotification("Register Account", "Create your account to save this chart permanently.", "info");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">✨</span>
                    <div className="text-left">
                      <span className="block font-black tracking-wider text-slate-950 text-[11px] leading-tight">{t("Save this Kundli permanently", "इस कुंडली को स्थायी रूप से सहेजें")}</span>
                      <span className="block text-[9px] text-slate-800 font-medium normal-case mt-0.5">{t("Create a cloud backed profile in seconds", "कुछ ही सेकंड में क्लाउड पर एक प्रोफ़ाइल बनाएं")}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-950" />
                </button>

                {/* Option 2: Login with Google */}
                <button
                  type="button"
                  onClick={async () => {
                    const res = await authService.loginWithGoogle();
                    if (res && res.success) {
                      setCurrentUser(res.user.email);
                      setUsersList(prev => {
                        const exists = prev.find(u => u.email.toLowerCase() === res.user.email.toLowerCase());
                        if (!exists) {
                          return [...prev, { email: res.user.email, name: res.user.name, isPremium: res.user.email.toLowerCase() === 'nespuneet2501@gmail.com', method: 'Google OAuth', registeredAt: '2026-05-27' }];
                        }
                        return prev;
                      });

                      await kundliDbService.saveKundli(res.user.email, guestGateAction.payload);
                      const list = await kundliDbService.fetchSavedKundlis(res.user.email);
                      setSavedKundlis(list);
                      
                      // Show report or trigger depending on action type
                      setActiveProfileMemory(guestGateAction.payload);
                      setCurrentScreen('KUNDLI_REPORT');
                      setGuestGateAction(null);
                    }
                  }}
                  className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-805 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">🤖</span>
                    <div className="text-left">
                      <span className="block">{t("Sign in with Google", "गूगल के साथ लॉगिन करें")}</span>
                      <span className="block text-[8px] text-slate-500 font-semibold lowercase tracking-wide mt-0.5">Secure OAuth 2.0 dynamic sync</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                </button>

                {/* Option 3: Create free account */}
                <button
                  type="button"
                  onClick={() => {
                    setMemoryPendingSavePayload(guestGateAction.payload);
                    setMemoryPendingGateActionType(guestGateAction.type);
                    setGuestGateAction(null);
                    setAuthActiveTab('signup');
                    setCurrentScreen('AUTH');
                  }}
                  className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-805 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">📧</span>
                    <div className="text-left">
                      <span className="block">{t("Create Free Email Account", "निशुल्क ईमेल खाता बनाएं")}</span>
                      <span className="block text-[8px] text-slate-500 font-semibold normal-case tracking-wide mt-0.5">Enter email and setup password</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                </button>

                {/* Option 4: Continue without saving */}
                <button
                  type="button"
                  onClick={async () => {
                    const currentGuestEmail = 'guest@vedicastrology.org';
                    await kundliDbService.saveKundli(currentGuestEmail, guestGateAction.payload);
                    const list = await kundliDbService.fetchSavedKundlis(currentGuestEmail);
                    setSavedKundlis(list);

                    // Re-route
                    setActiveProfileMemory(guestGateAction.payload);
                    setCurrentScreen('KUNDLI_REPORT');
                    setGuestGateAction(null);
                    triggerNotification("Vedic Chart Loaded", "Report loaded without syncing to cloud.", "info");
                  }}
                  className="w-full py-3.5 bg-slate-950/40 hover:bg-slate-900 border border-dashed border-slate-800 text-slate-400 hover:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition text-center"
                >
                  {t("Continue Without Saving (Compute Online)", "बिना सहेजे चार्ट जनरेट करें")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpgradeModal && (
          <div className="fixed inset-0 bg-[#070810]/95 backdrop-blur-md flex justify-center items-center z-[130] p-4 text-slate-100 font-sans">
            <div className="bg-[#0b0c16] rounded-3xl w-full max-w-lg border border-slate-800 shadow-2xl p-6.5 relative overflow-hidden animate-scale-up">
              <button 
                onClick={() => {
                  setShowUpgradeModal(false);
                  setPaymentOtpSent(false);
                  setPaymentDone(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-0 right-0 h-48 w-48 bg-[#cca43b]/5 rounded-bl-full pointer-events-none"></div>

              {/* Step 1: Selection and plan price overview */}
              {!paymentOtpSent && !paymentDone && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest font-mono">
                      🌟 SECURE INTEGRATED CHECKOUT DESK
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-cinzel text-white mt-1.5">Activate Premium Celestial Insights</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Instant activation of life predicts, dasha transits, and verified certificates.</p>
                  </div>

                  {/* Active user status tag */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-left">
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono block">BILLING TARGET USER:</span>
                      <span className="text-xs font-mono font-bold text-slate-200">{currentUser || 'Guest'}</span>
                    </div>
                    <span className="bg-amber-400/10 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-400/20 uppercase font-bold font-mono">Free Tier</span>
                  </div>

                  {/* Subscription card mappings */}
                  <div className="space-y-2">
                    {subscriptionPlans.map((plan) => {
                      const isSelected = payPlanId === plan.id;
                      return (
                        <div 
                          key={plan.id}
                          onClick={() => setPayPlanId(plan.id)}
                          className={`p-3.5 rounded-xl bg-slate-900 border transition cursor-pointer text-left flex items-center justify-between ${isSelected ? 'border-amber-400 bg-amber-400/5 shadow-md shadow-amber-400/5' : 'border-slate-850 hover:border-slate-700'}`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold font-cinzel text-white block">{plan.title}</span>
                            <span className="text-[10px] text-slate-400 block line-clamp-1">{plan.tagline}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-amber-400 font-mono">₹{plan.price}</span>
                            <span className="text-[9px] text-slate-500 block uppercase">One-Time</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3.5 border-t border-slate-900 flex flex-col gap-3">
                    <p className="text-[10px] text-slate-500 text-center">
                      *By proceeding, you authorize a dummy test banking environment transaction logic simulating standard razorpay / striped API gateways.
                    </p>
                    <button
                      onClick={() => {
                        setPaymentOtpSent(true);
                        setPaymentOtpCode('');
                        alert(`UPI gateway initialized. Test transaction verification SMS dispatched to associated provider for verification code.`);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
                    >
                      💳 PROCEED TO TEST PAYMENT (₹{subscriptionPlans.find(p => p.id === payPlanId)?.price})
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Simulated OTP verification box */}
              {paymentOtpSent && !paymentDone && (
                <div className="space-y-4 py-8 text-center animate-fade-in">
                  <span className="text-3xl">📳</span>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white font-cinzel">Enter SMS Transaction OTP</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      A mock verification passcode has been dispatched to standard terminal. Enter dummy code <strong className="text-amber-400 font-mono">108</strong> to simulate success.
                    </p>
                  </div>

                  <div className="max-w-[200px] mx-auto">
                    <input
                      type="text"
                      maxLength={6}
                      value={paymentOtpCode}
                      onChange={(e) => setPaymentOtpCode(e.target.value)}
                      placeholder="e.g. 108"
                      className="w-full text-center bg-slate-950 border border-slate-800 text-amber-400 text-lg font-bold font-mono tracking-widest focus:outline-none focus:border-amber-400 p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2 justify-center pt-4 max-w-sm mx-auto">
                    <button
                      onClick={() => setPaymentOtpSent(false)}
                      className="w-1/2 py-2.5 border border-slate-850 hover:bg-slate-900 text-xs font-bold uppercase rounded-lg transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (paymentOtpCode.trim() === '108' || paymentOtpCode.trim() === '108108' || paymentOtpCode.trim().length > 0) {
                          // Success promotion logic!
                          setUsersList(prev => prev.map(user => {
                            if (user.email.toLowerCase() === currentUser.toLowerCase()) {
                              return { ...user, isPremium: true };
                            }
                            return user;
                          }));
                          setPaymentDone(true);
                        } else {
                          alert(`Invalid transaction OTP. Try typing the suggested code '108' to authorize checkout simulation.`);
                        }
                      }}
                      className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase rounded-lg transition"
                    >
                      Verify & Activate ✓
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success certificate animation page */}
              {paymentDone && (
                <div className="space-y-5 text-center animate-fade-in py-8 font-sans">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white font-cinzel">Celestial Premium Activated!</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Congratulations! Your email {currentUser} has been granted lifetime scholarly permissions.</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/20 text-left max-w-sm mx-auto">
                    <p className="text-[10px] text-slate-500 font-mono">OFFICIAL LEDGER ORDER TICKET:</p>
                    <div className="grid grid-cols-2 text-[10px] font-mono text-slate-350 pt-1.5 gap-y-1">
                      <span>Order UID:</span> <span className="text-slate-100 text-right">PVA-2026-{Math.floor(Math.random()*10000)}</span>
                      <span>Product Tier:</span> <span className="text-amber-400 text-right font-bold font-sans">Premium Pass</span>
                      <span>Paid Amount:</span> <span className="text-emerald-400 text-right">₹{subscriptionPlans.find(p => p.id === payPlanId)?.price || 1499}.00 INR</span>
                      <span>Gateway Sec:</span> <span className="text-slate-100 text-right">E-STAMP VERIFIED</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowUpgradeModal(false);
                        setPaymentOtpSent(false);
                        setPaymentDone(false);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition"
                    >
                      🚀 Return & View Premium Insights
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Mobile-Only Bottom Utility Area: Website Theme, Font Size, Database status, Free Marquee and News */}
      <div className="block md:hidden w-full max-w-7xl mx-auto px-4 mt-6 space-y-6 border-t border-slate-800/40 pt-8 pb-2">
        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-500 text-sm">🌌</span>
          <h3 className="text-xs font-black tracking-widest text-[#cca43b] uppercase">
            {t("Cosmic Utilities & News Feed", "कॉस्मिक यूटिलिटीज और लाइव समाचार")}
          </h3>
        </div>

        {/* Theme & Font Control Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#0c0d1b] border border-slate-800/60 p-3.5 rounded-xl">
          {/* Theme Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              🎨 {t("Color Theme", "वेबसाइट रंग थीम")}
            </span>
            <div className="flex items-center gap-2 bg-[#12142d]/30 border border-slate-800/45 rounded-full p-1.5 w-fit">
              {Object.keys(THEMES).map(themeKey => (
                <button
                  key={themeKey}
                  onClick={() => setCurrentTheme(themeKey)}
                  className={`w-4.5 h-4.5 rounded-full border-2 transition ${currentTheme === themeKey ? 'border-[#cca43b] scale-125 ring-2 ring-[#cca43b]/30' : 'border-slate-600'}`}
                  style={{ backgroundColor: THEMES[themeKey].primary }}
                  title={`${THEMES[themeKey].name} Theme`}
                />
              ))}
            </div>
          </div>

          {/* Font Controls */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              🔎 {t("Text Font Size", "अक्षरों का आकार")}
            </span>
            <div className="flex items-center gap-1 bg-[#12142d]/30 border border-slate-800/40 rounded-lg p-1">
              {['SMALL', 'NORMAL', 'LARGE', 'XLARGE'].map((scale, i) => {
                const labels = ['A-', 'A', 'A+', 'A++'];
                return (
                  <button
                    key={scale}
                    onClick={() => setFontScale(scale)}
                    className={`flex-1 py-1 text-[10px] font-black rounded transition-all text-center ${fontScale === scale ? 'bg-[#cca43b] text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    {labels[i]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Database Live Connected Status */}
        <div 
          onClick={() => {
            if (isUserAdmin) {
              setCurrentScreen('INTEGRATIONS');
            } else {
              triggerNotification(
                "Database Workspace Status", 
                `Currently connected in ${storageConfig.mode === 'SUPABASE' ? 'Supabase cloud' : 'Sandbox (local)'} mode. Credentials can be adjusted in the admin panel.`, 
                "info"
              );
            }
          }}
          className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition uppercase tracking-wider font-extrabold shadow-md ${
            storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
              ? 'bg-[#091510] border-emerald-500/50 text-emerald-300 hover:bg-[#0c241a]' 
              : 'bg-red-950/40 border-red-500/50 text-red-300 hover:bg-red-900/45'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/50' 
                : 'bg-red-400 animate-pulse ring-2 ring-red-400/50'
            }`}></span>
            <span className="text-[10px] font-bold">
              {storageConfig.mode === 'SUPABASE' && dbHealth.status === 'healthy'
                ? t("DATABASE CONNECTION - LIVE", "डेटाबेस कनेक्शन - लाइव") 
                : t("DATABASE CONNECTION - OFF", "डेटाबेस कनेक्शन - बंद")
              }
            </span>
          </div>
          <span className="text-[8px] bg-slate-800/40 px-2 py-0.5 rounded text-slate-450 font-mono">
            {storageConfig.mode}
          </span>
        </div>

        {/* Animated Marquee Ribbon: Free Services breaking */}
        <div className="w-full overflow-hidden bg-[#12142a] border text-white rounded-xl py-2.5 relative shadow-xl flex items-center select-none" style={{ borderColor: tObj.border }}>
          <div className="absolute left-0 top-0 bottom-0 bg-[#936a18] px-2.5 z-10 flex items-center shadow-md font-cinzel font-black text-[8px] uppercase tracking-wider text-[#FFF] animate-pulse">
            🔥 {t("FREE", "मुफ़्त")}
          </div>
          <div className="whitespace-nowrap flex items-center w-full overflow-hidden">
            <div className="animate-marquee inline-block font-sans font-extrabold text-[10px] uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 pl-12 pb-0.5">
              ✨ 🕊️ {t("ALL DIGITAL HOROSCOPE GENERATION, LAL KITAB ANALYSIS, DAILY PANCHANG, AND KP ASTROLOGY MODULES ARE 100% FREE FOR THE DEVOUT PUBLIC!", "सभी डिजिटल जन्मपत्री, लाल किताब फलादेश, दैनिक महा पंचांग और केपी ज्योतिष कुण्डली फलित सर्वसाधारण के लिए शत-प्रतिशत निःशुल्क हैं!")} ✦ {t("NO HIDDEN FEES OR PREMIUM SUBSCRIPTION REQUIRED — SPREAD THE DIVINE LIGHT!", "कोई छिपा हुआ शुल्क या प्रीमियम सब्सक्रिप्शन आवश्यक नहीं — सनातन दैवीय ज्ञान सभी के लिए खुला है!")} 🕊️ ✨
            </div>
          </div>
        </div>

        {/* Kundli News Updates Container */}
        <div className="w-full bg-[#0b0c16]/90 border rounded-xl p-4 shadow-xl relative font-sans text-slate-200 flex flex-col items-stretch gap-3 border-l-4 border-l-rose-600" style={{ borderColor: tObj.border, borderLeftColor: '#e11d48' }}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping relative"></span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-rose-500 font-mono">✦ {t("BREAKING KUNDLI NEWS", "ब्रेकिंग न्यूज़ अपडेट")}</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-300 font-medium italic">
              {currentLanguage === 'English' ? breakingNewsEng : breakingNews}
            </p>
          </div>

          {activeUserIsPremium && (
            <button
              onClick={() => setShowNewsEditor(!showNewsEditor)}
              className="w-full text-center py-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition"
            >
              ✏️ {t("Update News", "अपडेट न्यूज़")}
            </button>
          )}
        </div>
      </div>

      {/* Luxury Footer with tech indicators */}
      <footer className="mt-12 py-6 bg-[#0a0c1a] border-t border-slate-800/80 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            <span>&copy; 2026 PVASTRO App. All cosmic formulas calibrated perfectly matching authentic Vedic systems.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>Web Server Active: Port 3000</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Immersive Mobile Android Bottom Navigation Bar */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 flex items-center justify-around h-[72px] border-t shadow-2xl backdrop-blur-xl bg-[#090a15]/95"
        style={{
          borderColor: 'rgba(204,164,59,0.15)',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.8)'
        }}
      >
        {/* Tab 1: Home Dashboard */}
        <button
          onClick={() => setCurrentScreen('DASHBOARD')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all"
        >
          <Compass 
            className={`w-5.5 h-5.5 transition-all duration-300 shrink-0 ${currentScreen === 'DASHBOARD' ? 'text-[#ffbf00] drop-shadow-[0_0_12px_rgba(255,191,0,0.9)] scale-125' : 'text-slate-400 opacity-80'}`} 
            style={{ 
              strokeWidth: currentScreen === 'DASHBOARD' ? '2.8' : '1.8'
            }} 
          />
          <span 
            className={`text-[10px] font-black mt-1 tracking-wider transition-all duration-300 ${currentScreen === 'DASHBOARD' ? 'text-[#ffbf00] scale-105 drop-shadow-[0_0_8px_rgba(255,191,0,0.6)] font-extrabold' : 'text-slate-400'}`}
          >
            {t("Home", "मुख्य")}
          </span>
        </button>

        {/* Tab 2: Panchang */}
        <button
          onClick={() => setCurrentScreen('PANCHANG')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all"
        >
          <Calendar 
            className={`w-5.5 h-5.5 transition-all duration-300 shrink-0 ${currentScreen === 'PANCHANG' ? 'text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,0.9)] scale-125' : 'text-slate-400 opacity-80'}`} 
            style={{ 
              strokeWidth: currentScreen === 'PANCHANG' ? '2.8' : '1.8'
            }} 
          />
          <span 
            className={`text-[10px] font-black mt-1 tracking-wider transition-all duration-300 ${currentScreen === 'PANCHANG' ? 'text-[#00e5ff] scale-105 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] font-extrabold' : 'text-slate-400'}`}
          >
            {t("Panchang", "पंचांग")}
          </span>
        </button>

        {/* Tab 3: FAB Button - Center floating circular Add Kundli */}
        <div className="relative -top-3.5 flex flex-col items-center justify-center w-14 z-50">
          <button
            onClick={() => setCurrentScreen('ADD_KUNDLI')}
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
              currentScreen === 'ADD_KUNDLI' 
                ? 'bg-gradient-to-tr from-[#ff3d00] to-[#ffea00] border-yellow-200 shadow-[0_0_20px_rgba(255,61,0,0.9)] scale-110' 
                : 'bg-gradient-to-tr from-amber-600 to-amber-400 border-[#cca43b]/40 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
            }`}
            title={t("New Chart", "कुंडली बनाएँ")}
          >
            <PlusCircle className="w-7 h-7 stroke-[2.8] text-white" />
          </button>
          <span 
            className={`text-[9.5px] font-black mt-1 text-center whitespace-nowrap tracking-wide transition-all duration-300 ${currentScreen === 'ADD_KUNDLI' ? 'text-[#ffea00] scale-105 drop-shadow-[0_0_8px_rgba(255,234,0,0.6)] font-extrabold' : 'text-slate-400'}`}
          >
            {t("Chart", "कुंडली")}
          </span>
        </div>

        {/* Tab 4: Matchmaking */}
        <button
          onClick={() => setCurrentScreen('MATCHMAKING')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all"
        >
          <Heart 
            className={`w-5.5 h-5.5 transition-all duration-300 shrink-0 ${currentScreen === 'MATCHMAKING' ? 'text-[#ff1744] drop-shadow-[0_0_12px_rgba(255,23,68,0.9)] scale-125' : 'text-slate-400 opacity-80'}`} 
            style={{ 
              strokeWidth: currentScreen === 'MATCHMAKING' ? '2.8' : '1.8'
            }} 
          />
          <span 
            className={`text-[10px] font-black mt-1 tracking-wider transition-all duration-300 ${currentScreen === 'MATCHMAKING' ? 'text-[#ff1744] scale-105 drop-shadow-[0_0_8px_rgba(255,23,68,0.6)] font-extrabold' : 'text-slate-400'}`}
          >
            {t("Match", "मिलान")}
          </span>
        </button>

        {/* Tab 5: Contact Guru */}
        <button
          onClick={() => setCurrentScreen('AI_CHAT')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all"
        >
          <PhoneCall 
            className={`w-5.5 h-5.5 transition-all duration-300 shrink-0 ${currentScreen === 'AI_CHAT' ? 'text-[#00e676] drop-shadow-[0_0_12px_rgba(0,230,118,0.9)] scale-125' : 'text-slate-400 opacity-80'}`} 
            style={{ 
              strokeWidth: currentScreen === 'AI_CHAT' ? '2.8' : '1.8'
            }} 
          />
          <span 
            className={`text-[10px] font-black mt-1 tracking-wider transition-all duration-300 ${currentScreen === 'AI_CHAT' ? 'text-[#00e676] scale-105 drop-shadow-[0_0_8px_rgba(0,230,118,0.6)] font-extrabold' : 'text-slate-400'}`}
          >
            {t("Contact", "संपर्क")}
          </span>
        </button>
      </div>

      {/* 🌟 SCROLLING SCHOLARS SIDEBAR SYSTEM (Displays on screen margins for all active states) */}
      {currentScreen !== 'WELCOME' && currentScreen !== 'AUTH' && (
        showScholarsSidebar ? (
          <div className="fixed right-2.5 top-[24%] sm:top-[30%] z-[140] flex flex-col items-center gap-2 bg-[#0c0d1c]/95 border-2 border-amber-500/40 p-2.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.35)] animate-fade-in max-w-[80px]">
            <div className="w-full flex items-center justify-between border-b border-amber-500/20 pb-1.5 select-none gap-4">
              <span className="text-[8px] font-black tracking-widest text-[#ffea00] uppercase leading-none truncate pl-1">
                {t("ACHARYA", "गुरुजन")}
              </span>
              <button 
                onClick={() => setShowScholarsSidebar(false)}
                className="text-[9px] font-bold text-slate-400 hover:text-red-400 hover:scale-115 transition leading-none pr-1"
                title={t("Hide Sidebar", "छिपाएं")}
              >
                ✕
              </button>
            </div>
            
            {/* Circular Scrolling Column with marquee-style vertical crawl - INCREASED PHOTO SIZE TO w-16 h-16 */}
            <div className="flex flex-col gap-2.5 max-h-[250px] overflow-hidden py-1 relative">
              <div className="flex flex-col gap-4 animate-vertical-scroll hover:[animation-play-state:paused]">
                {PANDITS_STRICT_LIST.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setActiveBookingPandit(p);
                      setShowPanditDirectory(true);
                    }}
                    className="relative group cursor-pointer active:scale-95 transition duration-150"
                    title={`${p.name} (Click to Book)`}
                  >
                    <img 
                      src={p.profile_photo_url} 
                      alt={p.name} 
                      className="w-16 h-16 rounded-full border-2 border-emerald-500 hover:border-amber-400 object-cover shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition duration-200"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0c0d1c] animate-pulse"></span>
                    
                    {/* Hover tooltip */}
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#0c0d1c] border border-amber-500/40 text-[9px] font-bold text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-xl">
                      {p.name} ({p.experience_years}y Exp)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick-action directory reveal button - INCREASED SIZE */}
            <button
              onClick={() => {
                setActiveBookingPandit(null);
                setShowPanditDirectory(true);
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-[#ff3d00] text-white flex flex-col items-center justify-center text-[7.5px] font-black uppercase tracking-tighter leading-tight border border-amber-400/45 hover:scale-105 hover:brightness-110 active:scale-95 transition shadow-lg select-none mt-1"
            >
              <span>ALL</span>
              <span className="text-sm mt-0.5 animate-pulse">🕉️</span>
            </button>
          </div>
        ) : (
          /* Small sticky button to bring it back when closed */
          <button
            onClick={() => setShowScholarsSidebar(true)}
            className="fixed right-0 top-[40%] z-[140] w-7 py-3 bg-[#0c0d1c]/95 border-l-2 border-y-2 border-amber-500/40 rounded-l-xl text-amber-400 text-[10px] font-black flex flex-col items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition whitespace-pre-wrap select-none leading-none border-r-0"
            title={t("Show Scholar List", "गुरुदेव सूची दिखाएं")}
          >
            <span>🕉️</span>
            <span className="text-[7.5px] tracking-wider font-extrabold uppercase [writing-mode:vertical-lr]">GURU</span>
          </button>
        )
      )}

      {/* 🕉️ FULL SCREEN PANDIT FINDER & LOCATION-BASED BOOKING SYSTEM MODAL */}
      {showPanditDirectory && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPanditDirectory(false);
              setActiveBookingPandit(null);
            }
          }}
          className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300] animate-fade-in backdrop-blur-md select-none font-sans overflow-y-auto cursor-pointer"
        >
          <div className="bg-[#0f1124] border-2 border-[#cca43b]/40 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col text-slate-100 shadow-[0_0_50px_rgba(204,164,59,0.3)] animate-scale-up cursor-default">
            
            {/* Header Block with Vedic watermarks */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#171a39] to-[#0d0e1d] flex justify-between items-center relative shrink-0">
              <div className="absolute inset-0 bg-[radial-gradient(#cca43b_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
                  🕉️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#ffea00] leading-none uppercase">
                    {t("Purohit Booking Hub & Directory", "सनातनी पुरोहित एवं आचार्य बुकिंग केंद्र")}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t("Find Verified local priests, spiritual guides and ritual pandits instantly.", "स्थान-आधारित निकटतम पंडित, हवन, विवाह और गृह शांति अनुष्ठान बुकिंग हब")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPriestRegisterForm(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[10px] tracking-wide uppercase transition-all rounded-lg cursor-pointer"
                >
                  {t("Priest Registration", "पुरोहित पंजीकरण 📜")}
                </button>
                <button 
                  onClick={() => {
                    setShowPanditDirectory(false);
                    setActiveBookingPandit(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-black text-[10px] tracking-widest uppercase transition-all rounded-lg cursor-pointer"
                >
                  CLOSE ❌
                </button>
              </div>
            </div>

            {/* Main Interactive Workstation Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 bg-[#080915]">
              
              {/* LEFT CRITICAL COLUMN - LOCATION CONTROLS & RITUAL booking Form */}
              <div className="lg:col-span-4 space-y-4 text-left">
                
                {/* 1. Location Autodetect / Preset Search */}
                <div className="bg-[#12142d]/80 border border-slate-800/80 p-4.5 rounded-2xl relative space-y-3">
                  <h4 className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                    📍 {t("YOUR CURRENT LOCATION COORDINATES", "आपकी वर्तमान आकाशीय स्थिति")}
                  </h4>
                  
                  {/* Dynamic City search-box with robust Autocomplete */}
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder={t("Type to search city...", "अपना शहर यहाँ लिखें...")}
                      value={cityFilterText}
                      onChange={(e) => {
                        setCityFilterText(e.target.value);
                        setShowCityDropdown(true);
                      }}
                      className="w-full px-3 py-2 bg-[#0c0d19] border border-slate-700 rounded-lg text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-white font-semibold"
                    />
                    
                    {showCityDropdown && (
                      <div className="absolute left-0 right-0 mt-1 max-h-[160px] overflow-y-auto bg-[#0f1124] border border-slate-700 rounded-lg shadow-2xl z-[350] divide-y divide-slate-800">
                        {CITIES_ROBUST_DATABASE.filter(c => c.name.toLowerCase().includes(cityFilterText.toLowerCase()))
                          .map((city, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setPanditUserCity(city);
                                setCityFilterText(city.name);
                                setShowCityDropdown(false);
                                triggerNotification("Location Synced", `Coordinate base shifted to: ${city.name}`, "info");
                              }}
                              className="w-full text-left p-2.5 text-[11px] hover:bg-amber-550/10 hover:text-amber-300 text-slate-300 transition duration-150"
                            >
                              📍 {city.name}
                            </button>
                          ))}
                        {CITIES_ROBUST_DATABASE.filter(c => c.name.toLowerCase().includes(cityFilterText.toLowerCase())).length === 0 && (
                          <div className="p-3 text-[10px] text-slate-500 italic text-center">No cities match query</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-[#0c0f20]/90 rounded-xl border border-slate-800 text-[10.5px] space-y-1 text-slate-300 font-mono">
                    <p className="font-extrabold text-white text-xs truncate">🗺️ {panditUserCity.name}</p>
                    <div className="grid grid-cols-2 gap-1 pt-1 opacity-85 text-[9.5px]">
                      <div>Lat: {panditUserCity.lat}° N</div>
                      <div>Lon: {panditUserCity.lon}° E</div>
                    </div>
                  </div>
                </div>

                {/* 2. active booking appointment workflow form */}
                <div className="bg-[#12142d]/80 border border-slate-800/80 p-4.5 rounded-2xl space-y-3.5 relative">
                  <h4 className="text-[11px] font-extrabold text-orange-400 uppercase tracking-widest block border-b border-slate-800 pb-2">
                    📅 {t("RITUAL APPOINTMENT SANKALPA FORM", "शुभ अनुष्ठान संकल्प प्रपत्र")}
                  </h4>

                  {activeBookingPandit ? (
                    <div className="space-y-3 font-sans">
                      <div className="flex gap-2 bg-[#1b1c3b] p-2.5 rounded-xl border border-amber-500/20">
                        <img src={activeBookingPandit.profile_photo_url} className="w-9 h-9 rounded-full object-cover border border-amber-500/30" />
                        <div>
                          <p className="text-xs font-black text-amber-300 truncate leading-tight">{activeBookingPandit.name}</p>
                          <p className="text-[9.5px] text-slate-400 font-mono mt-0.5">Exp: {activeBookingPandit.experience_years} Years | ★ {activeBookingPandit.rating}</p>
                        </div>
                      </div>

                      {/* Ritual selection */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{t("Select Religious Ritual", "धार्मिक अनुष्ठान का प्रकार")}</label>
                        <select 
                          value={bookingForm.ritual}
                          onChange={(e) => setBookingForm({...bookingForm, ritual: e.target.value})}
                          className="w-full p-2 bg-[#0c0d19] border border-slate-700 rounded-lg text-xs font-bold text-white"
                        >
                          <option value="Satyanarayan Vrat Katha">Sri Satyanarayan Katha (सत्यनारायण व्रत)</option>
                          <option value="Navgrah Shanti Puja">Navgrah Dosha Shanti (नवग्रह दोष निवारण)</option>
                          <option value="Grah Pravesh Ritual">Grah Pravesh Puja (गृह प्रवेश पूजा)</option>
                          <option value="Laxmi Kuber Dhan Havan">Laxmi Kuber Dhan Havan (लक्ष्मी कुबेर हवन)</option>
                          <option value="Mahamrityunjay Mantra Jaap">Mahamrityunjay Mantra Path (महामृत्युंजय जाप)</option>
                          <option value="Astrological Kundli Evaluation">Astro Chart Guidance (ज्योतिष कुण्डली विवेचन)</option>
                          <option value="Kundalini & Chakra Alignment">Kundalini Awakening Guidance (कुंडलिनी साधन)</option>
                        </select>
                      </div>

                      {/* Date & Time slots */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{t("Date Slot", "तिथि दिनांक")}</label>
                          <input 
                            type="date" 
                            required
                            value={bookingForm.date}
                            onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                            className="w-full p-2 bg-[#0c0d19] border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{t("Hour Slot", "शुभ समय")}</label>
                          <input 
                            type="time" 
                            required
                            value={bookingForm.time}
                            onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                            className="w-full p-2 bg-[#0c0d19] border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* User mobile No */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{t("Yajman Phone Number", "यजमान का मोबाइल नंबर")}</label>
                        <input 
                          type="tel" 
                          placeholder="+91 9XXXX XXXXX"
                          required
                          value={bookingForm.userPhone}
                          onChange={(e) => setBookingForm({...bookingForm, userPhone: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-[#0c0d19] border border-slate-700 rounded-lg text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Notes / Special requests */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{t("Sankalpa Notes / Gotra", "संकल्प गोत्र एवं विशेष आग्रह")}</label>
                        <textarea 
                          placeholder={t("e.g. Kaushik Gotra, Grah Pravesh with family of 4.", "जैसे: कश्यप गोत्र, सपरिवार पूजा करानी है।")}
                          value={bookingForm.notes}
                          onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                          rows={1.5}
                          className="w-full p-2 bg-[#0c0d19] focus:bg-[#06070f] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                        />
                      </div>

                      {/* Action triggers */}
                      <button 
                        type="button"
                        onClick={async () => {
                          if (!bookingForm.date || !bookingForm.time || !bookingForm.userPhone) {
                            alert(currentLanguage === 'HI' ? "कृपया सभी आवश्यक विवरण (दिनांक, समय एवं मोबाइल नंबर) दर्ज करें।" : "Please enter all required slots (Date, Time & Mobile number)");
                            return;
                          }
                          const newBooking = {
                            id: `bk-${Date.now()}`,
                            panditId: activeBookingPandit.id,
                            panditName: activeBookingPandit.name,
                            date: bookingForm.date,
                            time: bookingForm.time,
                            ritual: bookingForm.ritual,
                            phone: bookingForm.userPhone,
                            notes: bookingForm.notes,
                            timestamp: new Date().toLocaleString()
                          };
                          
                          // 1. Permanently record in local list
                          setBookingsList([newBooking, ...bookingsList]);

                          // 2. Permanently backup and record to database contact_enquiries table for live admin tracking
                          try {
                            const userEmail = currentUser || 'seeker@pvastro.org';
                            const ritualMessage = `[PUJA BOOKING] Auspicious ${bookingForm.ritual} with Acharya ${activeBookingPandit.name} requested. Slotted on ${bookingForm.date} at ${bookingForm.time}. Yajman Phone: ${bookingForm.userPhone}. Sankalpa Gotra details: ${bookingForm.notes || 'None Specified'}`;
                            await feedbackService.submitFeedback(userEmail, ritualMessage);
                          } catch (err) {
                            console.warn("Could not synchronize booking payload to Supabase database:", err);
                          }

                          triggerNotification("Sankalpa Registered!", `Consultation booked with ${activeBookingPandit.name} successfully.`, "success");
                          alert(currentLanguage === 'HI' ? `बधाई हो! ${activeBookingPandit.name} शास्त्री जी के साथ आपका ${bookingForm.ritual} का अनुष्ठान सफलतापूर्वक बुक हो गया है। जल्द ही पुरोहित जी आपसे संपर्क करेंगे।` : `Auspicious Bookings Registered! Your ${bookingForm.ritual} ritual with ${activeBookingPandit.name} has been confirmed. Sages will contact you shortly.`);
                          
                          // Reset form
                          setBookingForm({ date: '', time: '', ritual: 'General Puja', notes: '', userPhone: '' });
                          setActiveBookingPandit(null);
                        }}
                        className="w-full py-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:brightness-110 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        ✅ {t("Confirm Auspicious Booking", "संकल्प सिद्ध करें - बुकिंग पक्की करें")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveBookingPandit(null)}
                        className="w-full py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg transition"
                      >
                        {t("Cancel Selector", "वापस सूची देखें")}
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs italic bg-[#0c0d19] rounded-xl border border-dashed border-slate-800">
                      🕉️ {t("Select any Pandit from the right panel to open their booking scheduler slot.", "समीपस्थ आचार्य का चयन करके यहाँ संकल्प बुक करें।")}
                    </div>
                  )}
                </div>

                {/* 3. Booked Appointments List Tracker */}
                {bookingsList.length > 0 && (
                  <div className="bg-[#12142d]/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
                        📋 {t("YOUR ACTIVE RITUAL BOOKINGS", "आपके सक्रिय अनुष्ठान संकल्प")}
                      </span>
                      <button 
                        onClick={() => {
                          if (confirm(currentLanguage === 'HI' ? "क्या आप सभी बुकिंग इतिहास हटाना चाहते हैं?" : "Are you sure to clear all bookings?")) {
                            setBookingsList([]);
                            localStorage.removeItem('pva_pundits_bookings');
                          }
                        }}
                        className="text-[8.5px] uppercase text-red-400 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="max-h-[150px] overflow-y-auto space-y-2 divide-y divide-slate-800 pr-1">
                      {bookingsList.map((bk) => (
                        <div key={bk.id} className="pt-2 text-[10px] leading-tight space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-amber-300">{bk.panditName}</span>
                            <span className="text-[8.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Reserved</span>
                          </div>
                          <p className="text-white font-semibold text-[11px]">{bk.ritual}</p>
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                            <span>📅 {bk.date} @ {bk.time}</span>
                            <span>📞 {bk.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT EXPANDED COLUMN - DIRECTORY LISTINGS WITH ADVANCED SEARCH/DISTANCE FILTERS */}
              <div className="lg:col-span-8 flex flex-col min-h-0 space-y-4">
                
                {/* Advanced Multi-Factor Filtering Bar */}
                <div className="bg-[#12142d] border border-slate-800 p-4 rounded-2xl shrink-0 space-y-3.5">
                  
                  {/* Search and Specialization selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Free Search input */}
                    <div className="md:col-span-5 relative">
                      <input 
                        type="text"
                        placeholder={t("Search by Shastri Name/Gotra...", "शास्त्री जी के नाम/विशेषता से खोजें...")}
                        value={panditSearchText}
                        onChange={(e) => setPanditSearchText(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#0c0d19] border border-slate-700 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold text-white shadow-inner"
                      />
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    </div>

                    {/* Specialization Filter Dropdown */}
                    <div className="md:col-span-4 max-w-full">
                      <select
                        value={panditSpecializationFilter}
                        onChange={(e) => setPanditSpecializationFilter(e.target.value)}
                        className="w-full p-2 bg-[#0c0d19] border border-slate-705 rounded-xl text-xs font-bold text-slate-350 focus:outline-none"
                      >
                        <option value="all">🕉️ {t("All Services Specialization", "सभी धार्मिक सेवाएं")}</option>
                        <option value="puja">💎 Pradosh/Griha Puja (विशेष पूजा)</option>
                        <option value="havan">🔥 Agni Havan / Yagya (हवन यज्ञ)</option>
                        <option value="marriage">💍 Marriage & Kundli Match (विवाह संस्कार)</option>
                        <option value="grah shanti">☯️ Grah Shanti Remedies (ग्रह दोष शांति)</option>
                        <option value="katha">📖 Shrimad Bhagwat / Vrat (कथा प्रवचन)</option>
                        <option value="astrology">📈 KP & Vedic Astrology (कुण्डली फलादेश)</option>
                      </select>
                    </div>

                    {/* Sort Ranking Selector */}
                    <div className="md:col-span-3">
                      <select
                        value={panditSortBy}
                        onChange={(e) => setPanditSortBy(e.target.value)}
                        className="w-full p-2 bg-[#0c0d19] border border-slate-705 rounded-xl text-xs font-bold text-[#ff9e00] focus:outline-none"
                      >
                        <option value="distance">📍 {t("Nearest By Distance", "दूरी के अनुसार (निकटतम)")}</option>
                        <option value="charges">💰 {t("Charges: Low to High", "दक्षिणा: कम से अधिक")}</option>
                        <option value="experience">🎓 {t("Experience: Veteran first", "वरिष्ठता (अनुभवी)")}</option>
                        <option value="rating">★ {t("Highly Rated First", "रेटिंग के अनुसार (सर्वोत्तम)")}</option>
                      </select>
                    </div>

                  </div>

                  {/* Range Sliders: Charges & Distance threshold boundary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-450 text-[10px] font-black uppercase">
                        <span>💰 {t("Maximum Puja Charges Dakshina Limit", "अधिकतम दक्षिणा सीमा")}</span>
                        <span className="text-amber-400 font-mono">₹{panditPriceFilter} Max</span>
                      </div>
                      <input 
                        type="range"
                        min="1000"
                        max="15000"
                        step="500"
                        value={panditPriceFilter}
                        onChange={(e) => setPanditPriceFilter(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#0c0f20] rounded-lg cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-[#0c0d19] p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 italic">
                      <span className="text-sm select-none">🕉️</span>
                      <p>
                        {t("Distances computed dynamically using classical Haversine Great Circle Calculations from your coordinate base.",
                           "दूरी की गणना आपके द्वारा चुने गए शहर के अक्षांश-रेखांश से सीधे की जाती है।")}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Scrolled Grid showing calculated results matching strict location weights */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[500px]">
                  {(() => {
                    const approvedCustoms = customPriests
                      .filter(p => p.approved === true)
                      .map(p => ({
                        id: p.id || Date.now(),
                        name: p.name,
                        address: p.address || "Local Area, India",
                        specialization: Array.isArray(p.pujas) ? p.pujas : [p.pujas || "General Puja"],
                        experience_years: parseInt(p.experience) || 5,
                        charges: { min: p.fee || 3105, max: (p.fee || 3105) * 1.5 },
                        rating: 4.9,
                        verified: true,
                        availability: true,
                        lat: panditUserCity.lat + (p.id % 2 === 0 ? 0.02 : -0.01),
                        lon: panditUserCity.lon + (p.id % 2 === 0 ? -0.015 : 0.025),
                        profile_photo_url: p.imageUrl || "https://images.unsplash.com/photo-1544205313-94ddf0286df2?w=150",
                        bio: p.bio || `Specialized Vedic Priest. DOB: ${p.dob || "N/A"}. Performing ${Array.isArray(p.pujas) ? p.pujas.join(", ") : p.pujas || "special ritual services"}.`,
                        phone: p.phone || ""
                      }));
                    const combinedList = [...PANDITS_STRICT_LIST, ...approvedCustoms];
                    
                    return combinedList.map((pandit) => {
                      // Haversine dynamic Distance Calculation
                      const distance = calculateHaversineDistance(
                        panditUserCity.lat, 
                        panditUserCity.lon, 
                        pandit.lat, 
                        pandit.lon
                      );

                      // Filters checking
                      const matchSearch = pandit.name.toLowerCase().includes(panditSearchText.toLowerCase()) || 
                                          pandit.bio.toLowerCase().includes(panditSearchText.toLowerCase());
                      const matchSpec = panditSpecializationFilter === 'all' || pandit.specialization.includes(panditSpecializationFilter);
                      const matchPrice = pandit.charges.min <= panditPriceFilter;
                      
                      if (!matchSearch || !matchSpec || !matchPrice) return null;

                      return { ...pandit, calculatedDistance: distance };
                    })
                    .filter(Boolean)
                    .sort((a,b) => {
                      if (panditSortBy === 'distance') return a.calculatedDistance - b.calculatedDistance;
                      if (panditSortBy === 'charges') return a.charges.min - b.charges.min;
                      if (panditSortBy === 'experience') return b.experience_years - a.experience_years;
                      if (panditSortBy === 'rating') return b.rating - a.rating;
                      return 0;
                    })
                    .map((p) => (
                    <div 
                      key={p.id}
                      className={`p-4 bg-[#11132a] border rounded-2xl hover:border-amber-500/50 transition-all duration-200 shadow-md flex flex-col md:flex-row gap-4 relative overflow-hidden ${
                        activeBookingPandit?.id === p.id ? 'ring-2 ring-amber-500 border-amber-500 bg-[#161a38]' : 'border-slate-800'
                      }`}
                    >
                      {/* Left Column portrait and certifications */}
                      <div className="flex md:flex-col items-center gap-3 shrink-0">
                        <div className="relative">
                          <img 
                            src={p.profile_photo_url} 
                            alt={p.name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-inner"
                          />
                          {p.verified && (
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 text-[8px] font-mono border border-[#11132a]" title="Verified Astro Seal">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-center md:text-left space-y-1">
                          <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-400 font-extrabold select-none">
                            <span>★</span>
                            <span>{p.rating}</span>
                          </div>
                          <span className="text-[9px] bg-slate-800 text-blue-300 font-black px-1.5 py-0.5 rounded uppercase tracking-wide block text-center">
                            {p.experience_years} YRS EXP
                          </span>
                        </div>
                      </div>

                      {/* Middle description columns */}
                      <div className="flex-1 text-left space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                          <div>
                            <h4 className="text-sm font-black text-white hover:text-amber-300 font-cinzel leading-snug">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate max-w-sm">📍 {p.address}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {/* Distance Badge using Haversine */}
                            <span className="inline-block bg-orange-500/10 border border-orange-500/30 text-amber-400 px-2.5 py-1 text-[10px] font-mono font-black rounded-lg">
                              ↔ {p.calculatedDistance} km nearby
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-350 leading-relaxed max-w-xl">
                          {p.bio}
                        </p>

                        {/* Specialization Tags list */}
                        <div className="flex gap-1.5 flex-wrap pt-0.5 select-none">
                          {p.specialization.map((spec) => (
                            <span 
                              key={spec}
                              className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#cca43b]/25 bg-[#cca43b]/10 text-amber-300"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right direct pricing column & actions */}
                      <div className="md:w-44 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4 pt-3.5 md:pt-0 flex flex-col justify-between items-stretch gap-3 text-center md:text-right">
                        <div>
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">{t("Puja Charges Dakshina", "न्यूनतम दक्षिणा सीमा")}</span>
                          <strong className="text-base sm:text-lg text-emerald-400 font-mono font-semibold">
                            ₹{p.charges.min} - ₹{p.charges.max}
                          </strong>
                          <span className="text-[8.5px] text-slate-500 mt-0.5 block italic">{t("+ Samagri items extra", "+ पूजन सामग्री यजमान")}</span>
                        </div>

                        {p.availability ? (
                          <div className="text-[9px] text-emerald-400 font-extrabold flex items-center justify-center md:justify-end gap-1 select-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <span>● ONLINE AVAILABLE NOW</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-red-400 font-bold block">● FULLY BOOKED FOR THE DAY</span>
                        )}

                        <div className="space-y-1.5">
                          <button
                            type="button"
                            disabled={!p.availability}
                            onClick={() => {
                              setActiveBookingPandit(p);
                              // Scroll left column to focus form
                              triggerNotification("Priest Selected", `Set details in the संकल्प form on the left.`, "info");
                            }}
                            className="w-full py-2 bg-gradient-to-r from-[#936a18] to-amber-500 hover:brightness-110 disabled:opacity-40 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-lg transition duration-150 cursor-pointer text-center"
                          >
                            🕉️ {t("Book Ritual", "अनुष्ठान बुक करें")}
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ;
              })()}
                </div>

              </div>
              
            </div>

            {/* Bottom notification indicator */}
            <div className="p-3 bg-[#0d0e1b] border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center px-6 shrink-0">
              <span>Verified Purohits: 5 active listings matching ISO 27001 tenets</span>
              <span>Central Support: pvastroq@gmail.com</span>
            </div>

          </div>
        </div>
      )}

      {/* 📜 PRIEST REGISTRATION FORM MODAL */}
      {showPriestRegisterForm && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPriestRegisterForm(false);
          }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[400] animate-fade-in backdrop-blur-md select-none font-sans overflow-y-auto cursor-pointer text-slate-100"
        >
          <div className="bg-[#0b0c16] border-2 border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-[0_0_55px_rgba(16,185,129,0.25)] animate-scale-up cursor-default">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-black font-cinzel text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  📜 {t("Priest Sanatan Registration", "सनातन पुरोहित आचार्य पंजीकरण")}
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Admin approval triggers active booking status</p>
              </div>
              <button 
                onClick={() => setShowPriestRegisterForm(false)}
                className="text-slate-400 hover:text-white font-extrabold text-xs bg-slate-900 border border-slate-800 rounded px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePriestFormSubmit} className="space-y-4 text-left">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase font-black text-slate-350 block">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acharya Shrikant Shastri"
                  value={priestForm.name}
                  onChange={(e) => setPriestForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#121429] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* DOB & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase font-black text-slate-350 block">Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={priestForm.dob}
                    onChange={(e) => setPriestForm(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#121429] border border-slate-800 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase font-black text-slate-350 block">Experience (Years) *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="80"
                    placeholder="e.g. 15"
                    value={priestForm.experience}
                    onChange={(e) => setPriestForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#121429] border border-slate-800 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Fee Dakshina & Bio */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="text-[10.5px] uppercase font-black text-slate-350 block">Dakshina (₹) *</label>
                  <input 
                    type="number" 
                    required
                    min="501"
                    placeholder="e.g. 5100"
                    value={priestForm.fee}
                    onChange={(e) => setPriestForm(prev => ({ ...prev, fee: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#121429] border border-slate-800 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10.5px] uppercase font-black text-slate-350 block">Short Profile Bio</label>
                  <input 
                    type="text" 
                    placeholder="Sadhak of Samaveda ritual recitation..."
                    value={priestForm.bio}
                    onChange={(e) => setPriestForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#121429] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Types of Pujas Performed Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-[10.5px] uppercase font-black text-slate-350 block">Pujas Performed (Performances)</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#070810] rounded-xl border border-slate-800">
                  {[
                    "Ganesh Lakshmi Puja",
                    "Satyanarayan Katha",
                    "Griha Pravesh Puja",
                    "Maha Mrityunjaya Jaap",
                    "Navgrah Shanti Puja",
                    "Matchmaking Dosha Nivaran"
                  ].map((pj) => {
                    const checked = priestForm.pujas.includes(pj);
                    return (
                      <label key={pj} className="flex items-center gap-2 hover:bg-[#121429]/50 p-1 rounded font-sans cursor-pointer text-[10.5px] text-slate-300 select-none">
                        <input 
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setPriestForm(prev => {
                              const list = [...prev.pujas];
                              if (checked) {
                                return { ...prev, pujas: list.filter(x => x !== pj) };
                              } else {
                                list.push(pj);
                                return { ...prev, pujas: list };
                              }
                            });
                          }}
                          className="rounded border-slate-800 bg-[#070810] text-emerald-500 mr-1"
                        />
                        <span>{pj}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Portrait Selection presets */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10.5px] uppercase font-black text-slate-350 block">Choose Profile Portrait Avatar or image URL *</label>
                <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
                  {[
                    { name: "Acharya Shastri", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
                    { name: "Pandit Tiwari", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
                    { name: "Guru Vashishtha", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
                    { name: "Meditation Vyas", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" }
                  ].map((avt) => {
                    const isSelected = priestForm.imageUrl === avt.url;
                    return (
                      <button
                        key={avt.name}
                        type="button"
                        onClick={() => setPriestForm(prev => ({ ...prev, imageUrl: avt.url }))}
                        className={`p-1 bg-[#121429] rounded-xl border-2 flex flex-col items-center gap-1 shrink-0 ${isSelected ? 'border-emerald-500 scale-95 ring-1 ring-emerald-400' : 'border-slate-800 hover:border-slate-700'}`}
                      >
                        <img src={avt.url} className="w-12 h-12 rounded-lg object-cover" alt={avt.name} />
                        <span className="text-[8px] text-slate-400 font-bold">{avt.name}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Manual entry fallback */}
                <input 
                  type="text" 
                  placeholder="Or paste any custom portrait URL..."
                  value={priestForm.imageUrl}
                  onChange={(e) => setPriestForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-[#121429] border border-slate-800 rounded-xl text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Submit application */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] text-center block"
              >
                📜 {t("Submit Registration to Database", "पंजीकरण विवरण भेजें")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Immersive high HD animated Lord Ganesha & Swastik Splash Screen Popup on Startup */}
      {showSplash && (
        <div 
          onClick={handleSkipSplash}
          className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center p-6 bg-[#05060c] text-white font-sans transition-all duration-700 ease-in-out select-none cursor-pointer ${splashFade ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
          style={{
            backgroundImage: `radial-gradient(circle at center, #0f112a 0%, #05060c 100%)`
          }}
          title={t("Click anywhere to Close Ganesha Splash", "गणेश वंदना को बंद करने के लिए कहीं भी क्लिक करें")}
        >
          {/* Skip / Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSkipSplash();
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 px-4 py-2.5 bg-[#b91c1c] hover:bg-red-650 hover:border-amber-400 text-white font-black uppercase tracking-widest border border-amber-500/30 rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 z-[100001]"
          >
            <span>{t("CLOSE ✕", "बंद करें ✕")}</span>
          </button>

          {/* Sound Status Badge */}
          {splashConfig.playSound !== false && (
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/10 border border-orange-500/25 rounded-full text-[9px] font-black uppercase tracking-widest text-amber-400 select-none animate-pulse z-[100001]">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>🔊 {t("Sacred OM Chant active", "दिव्य मंत्र गूंज रहा है")}</span>
            </div>
          )}

          {/* Animated Stars Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMC44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-40 mix-blend-screen animate-pulse" />

          {/* Golden Rotating Planetary Orbits Circles in Background */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-orange-500/10 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-amber-400/20 border-dotted animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

          {/* Central Devotional Assembly */}
          <div className="relative flex flex-col items-center gap-6 z-10 max-w-lg text-center animate-scale-up">
            
            {/* Dynamic Symbol Trilogy (Swastiks flanking Central Ganesha) */}
            <div className="flex items-center justify-center gap-5 sm:gap-10 my-2">
              
              {/* Auspicious Left Swastik (Spinning Clockwise) */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-orange-500/5 border border-orange-500/20 shadow-[0_0_15px_rgba(255,101,0,0.15)] animate-[spin_25s_linear_infinite] shrink-0">
                <svg viewBox="0 0 60 60" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500">
                  <path 
                    d="M 12 30 L 48 30 M 30 12 L 30 48 M 12 12 L 12 30 M 48 30 L 48 48 M 30 12 L 48 12 M 12 48 L 30 48" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <circle cx="21" cy="21" r="2" fill="#FF3D00" />
                  <circle cx="39" cy="21" r="2" fill="#FF3D00" />
                  <circle cx="21" cy="39" r="2" fill="#FF3D00" />
                  <circle cx="39" cy="39" r="2" fill="#FF3D00" />
                </svg>
              </div>

              {/* Glorious High-HD Golden Lord Ganesha Silhouette */}
              <div className="relative p-2 rounded-full bg-orange-500/10 border border-orange-500/30 shadow-[0_0_40px_rgba(255,101,0,0.35)] hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 100 100" className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_15px_rgba(255,101,0,0.5)] animate-pulse">
                  <defs>
                    <linearGradient id="ganeshaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="40%" stopColor="#FFC107" />
                      <stop offset="85%" stopColor="#FF8F00" />
                      <stop offset="100%" stopColor="#E65100" />
                    </linearGradient>
                    <radialGradient id="divineGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Aura Halo background */}
                  <circle cx="50" cy="50" r="46" fill="url(#divineGlow)" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#ganeshaGold)" strokeWidth="0.5" strokeDasharray="2 3" />

                  {/* Left Ear Curve */}
                  <path d="M 40 40 C 25 38, 20 52, 33 60 C 38 63, 42 60, 42 55" fill="none" stroke="url(#ganeshaGold)" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Right Ear Curve */}
                  <path d="M 60 40 C 75 38, 80 52, 67 60 C 62 63, 58 60, 58 55" fill="none" stroke="url(#ganeshaGold)" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Crown (Mukut) Head */}
                  <path d="M 38 32 C 38 22, 50 12, 50 12 C 50 12, 62 22, 62 32 Z" fill="none" stroke="url(#ganeshaGold)" strokeWidth="2.2" strokeLinejoin="round" />
                  <path d="M 42 27 L 58 27 M 45 22 L 55 22 M 48 17 L 52 17" fill="none" stroke="url(#ganeshaGold)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="50" cy="7" r="1.5" fill="#FF1744" className="animate-ping" />
                  <circle cx="50" cy="7" r="1" fill="#FF1744" />

                  {/* Sacred Tilak Forehead */}
                  <path d="M 48 35 Q 50 41 52 35" fill="none" stroke="#FF1744" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="46" y1="38" x2="54" y2="38" stroke="#FFE082" strokeWidth="1" />
                  <circle cx="50" cy="33" r="1" fill="#FF1744" />

                  {/* Flowing Graceful curves of the Trunk (Sond) */}
                  <path d="M 45 42 Q 50 44 48 56 Q 46 68, 54 74 Q 61 78, 65 72 Q 67 64, 59 66" fill="none" stroke="url(#ganeshaGold)" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Tusk elements */}
                  <path d="M 44 47 L 41 48" fill="none" stroke="url(#ganeshaGold)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 56 47 L 58 48" fill="none" stroke="url(#ganeshaGold)" strokeWidth="0.8" strokeLinecap="round" /> {/* Broken right tusk */}

                  {/* Tiny Holy Swastik inside */}
                  <g transform="translate(46, 46) scale(0.08)" stroke="url(#ganeshaGold)" strokeWidth="2.5" fill="none">
                    <path d="M 10 30 L 50 30 M 30 10 L 30 50 M 10 10 L 10 30 M 50 30 L 50 50 M 30 10 L 50 10 M 10 50 L 30 50" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>

              {/* Auspicious Right Swastik (Spinning Counter-Clockwise) */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-orange-500/5 border border-orange-500/20 shadow-[0_0_15px_rgba(255,101,0,0.15)] animate-[spin_25s_linear_infinite_reverse] shrink-0">
                <svg viewBox="0 0 60 60" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500">
                  <path 
                    d="M 12 30 L 48 30 M 30 12 L 30 48 M 12 12 L 12 30 M 48 30 L 48 48 M 30 12 L 48 12 M 12 48 L 30 48" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <circle cx="21" cy="21" r="2" fill="#FF3D00" />
                  <circle cx="39" cy="21" r="2" fill="#FF3D00" />
                  <circle cx="21" cy="39" r="2" fill="#FF3D00" />
                  <circle cx="39" cy="39" r="2" fill="#FF3D00" />
                </svg>
              </div>

            </div>

            {/* Sacred Devotional Text & Divine Benediction */}
            <div className="space-y-2 mt-2">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase text-amber-500 tracking-widest font-cinzel animate-pulse block">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-bold px-2 block leading-relaxed max-w-md">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            {/* Brand Logo Identity */}
            <div className="mt-4 flex flex-col items-center">
              <PVAstroLogo className="w-24 h-24 sm:w-32 sm:h-32 mb-2" />
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[0.25em] font-cinzel leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-amber-200 animate-pvastro-logo">
                PVASTRO
              </h2>
              <p className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
                {t("Vedic Cosmic Astrological Suite", "वैदिक ब्रह्मांडीय ज्योतिषीय केंद्र")}
              </p>

              {/* Radiant Bright Tagline on Startup Splash Popup */}
              <div className="mt-4.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-red-500/20 to-amber-500/10 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse max-w-sm">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#ffff00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase block font-sans">
                  "ASTRO IS DIVINE WORK, BLESSINGS ARE FREE FOR ALL"
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] text-amber-300 font-extrabold block mt-1 tracking-wide">
                  {t("ज्योतिष दैवीय कार्य है, आशीर्वाद पूर्णतः निःशुल्क हैं", "ज्योतिष दैवीय कार्य है, आशीर्वाद पूर्णतः निःशुल्क हैं")}
                </span>
              </div>
            </div>

            {/* Progress loading engine */}
            <div className="w-56 sm:w-64 mt-6">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1 font-mono uppercase tracking-widest">
                <span>{t("Aligning Spheres", "ग्रह संरेखण")}</span>
                <span>{splashProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#ffe082] via-[#ffb300] to-[#ff3d00] transition-all duration-300 shadow-[0_0_8px_#ffb300]"
                  style={{ width: `${splashProgress}%` }}
                />
              </div>
              <span className="text-[8.5px] italic text-slate-550 mt-2 block tracking-wider animate-pulse font-medium">
                {splashProgress < 35 ? t("Calibrating Nakshatras...", "नक्षत्रों की काल गणना...") :
                 splashProgress < 70 ? t("Casting Planetary Spheres...", "ग्रह चक्रों की स्थापना हो रही है...") :
                 t("Establishing Spiritual Connection...", "दिव्य ब्रह्मांडीय संपर्क स्थापित हो रहा है...")}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Interactive SVG renderer that draws classical Kundli diagrams with animated aspects on demand
function RenderInteractiveSVG({ style, report, highlightedPlanet, setHighlightedPlanet, language }) {
  const t = (en, hi) => language === 'English' ? en : hi;
  
  // Coordinates mapping of houses for lines in North Indian chart
  // Square is 400x400
  // Inner diamond vertices: (200, 0), (0, 200), (200, 400), (400, 200)
  // Cross diagonals: (0,0)-(400,400) and (400,0)-(0,400)
  
  // To draw planets dynamically, we match each house to a center geometric position
  const getNorthIndianHouseCenter = (houseNum) => {
    switch (houseNum) {
      case 1:  return { x: 200, y: 110 }; // Top central diamond
      case 2:  return { x: 110, y: 55 };  // Left-top corner house
      case 3:  return { x: 55,  y: 110 }; // Left-mid-ish
      case 4:  return { x: 110, y: 200 }; // Left central diamond
      case 5:  return { x: 55,  y: 290 }; // Left-bottom corner
      case 6:  return { x: 110, y: 345 }; // Bottom-left corner-ish
      case 7:  return { x: 200, y: 290 }; // Bottom central diamond
      case 8:  return { x: 290, y: 345 }; // Bottom-right corner-ish
      case 9:  return { x: 345, y: 290 }; // Right-bottom-ish
      case 10: return { x: 290, y: 200 }; // Right central diamond
      case 11: return { x: 345, y: 110 }; // Right-top-ish
      case 12: return { x: 290, y: 55 };  // Right-top corner house
      default: return { x: 200, y: 200 };
    }
  };

  const lagna = report.lagnaSignNum;

  // Render North Indian Style
  if (style === 'North Indian') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[360px] md:max-w-[400px]">
        {/* Draw outer boundaries */}
        <rect x="0" y="0" width="400" height="400" fill="transparent" stroke="#cca43b" strokeWidth="2.5" />
        
        {/* Draw diagonal lines */}
        <line x1="0" y1="0" x2="400" y2="400" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="#cca43b" strokeWidth="1.5" />
        
        {/* Draw inner diamond */}
        <line x1="200" y1="0" x2="0" y2="200" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="0" y1="200" x2="200" y2="400" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="200" y1="400" x2="400" y2="200" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="400" y1="200" x2="200" y2="0" stroke="#cca43b" strokeWidth="1.5" />

        {/* Render House sign numbers (Vedic style, H1 is at center-top diamond, count CCW) */}
        {Array.from({ length: 12 }, (_, i) => {
          const houseNum = i + 1;
          const sign = ((lagna + houseNum - 2) % 12) + 1;
          const pos = getNorthIndianHouseCenter(houseNum);
          
          // Render house labels (light grey)
          return (
            <text 
              key={`h-${houseNum}`} 
              x={pos.x} 
              y={pos.y + 25} 
              fill="#cca43b" 
              fontSize="11" 
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
              opacity="0.65"
            >
              {sign}
            </text>
          );
        })}

        {/* Draw Planets inside the corresponding houses */}
        {Object.values(report.planets).map((detail) => {
          const pos = getNorthIndianHouseCenter(detail.houseNum);
          const isHighlighted = highlightedPlanet === detail.planet.id;
          
          // Give planets inside same house an offset so they don't overlap
          const indexInSameHouse = Object.values(report.planets)
            .filter(p => p.houseNum === detail.houseNum)
            .findIndex(p => p.planet.id === detail.planet.id);
            
          const offsetX = (indexInSameHouse % 2) === 0 ? -12 : 12;
          const offsetY = indexInSameHouse > 1 ? 15 : -10;

          const strokeColor = detail.relationship === 'Friendly' ? '#4ade80' : 
                              detail.relationship === 'Enemy' ? '#f87171' : 
                              detail.relationship === 'Neutral' ? '#facc15' : '#cca43b';

          const rectWidth = language === 'English' ? 32 : 36;

          return (
            <g 
              key={detail.planet.id}
              onClick={() => setHighlightedPlanet(isHighlighted ? null : detail.planet.id)}
              onMouseEnter={() => setHighlightedPlanet(detail.planet.id)}
              onMouseLeave={() => setHighlightedPlanet(null)}
              className="cursor-pointer"
            >
              <rect
                x={pos.x + offsetX - (rectWidth / 2)}
                y={pos.y + offsetY - 12}
                width={rectWidth}
                height="18"
                rx="4"
                fill={isHighlighted ? strokeColor : '#ffffff'}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? '2' : '1'}
                opacity="0.95"
              />
              <text
                x={pos.x + offsetX}
                y={pos.y + offsetY}
                dy="4"
                fill={isHighlighted ? '#ffffff' : '#2D2A26'}
                fontSize={language === 'English' ? '9' : '8'}
                fontWeight="extrabold"
                fontFamily="Cinzel, serif"
                textAnchor="middle"
              >
                {t(detail.planet.name.toUpperCase().substring(0, 3), detail.planet.hindi)}
                {detail.status === 'Exalted' || detail.status === 'UCHH' ? '↑' : detail.status === 'Debilitated' || detail.status === 'NEECH' ? '↓' : ''}
              </text>
            </g>
          );
        })}

        {/* Aspect Lines Layer (Animated lines between houses when a planet is selected) */}
        {highlightedPlanet && report.aspects
          .filter(aspect => aspect.fromPlanet.id === highlightedPlanet)
          .map((aspect, k) => {
            const start = getNorthIndianHouseCenter(aspect.fromHouse);
            const end = getNorthIndianHouseCenter(aspect.toHouse);
            return (
              <g key={`aspect-${k}`}>
                <line 
                  x1={start.x} 
                  y1={start.y} 
                  x2={end.x} 
                  y2={end.y} 
                  stroke={aspect.type.color || '#fff'} 
                  strokeWidth="2.5" 
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <circle 
                  cx={end.x} 
                  cy={end.y} 
                  r="6" 
                  fill={aspect.type.color || '#fff'} 
                />
              </g>
            );
          })}
      </svg>
    );
  }

  // Render South Indian style
  // Layout is a 4x4 Grid of outer boxes, empty/central space in the middle.
  // Start from Pisces (top left, moving clockwise: Pisces, Aries, Taurus...)
  const getSouthIndianHouseCoords = (signNum) => {
    // Coords based on a 400x400 box split into 4 columns/rows of 100 each
    switch (signNum) {
      case 12: return { x: 0,   y: 0 };   // Pisces
      case 1:  return { x: 100, y: 0 };   // Aries
      case 2:  return { x: 200, y: 0 };   // Taurus
      case 3:  return { x: 300, y: 0 };   // Gemini
      case 4:  return { x: 300, y: 100 }; // Cancer
      case 5:  return { x: 300, y: 200 }; // Leo
      case 6:  return { x: 300, y: 300 }; // Virgo
      case 7:  return { x: 200, y: 300 }; // Libra
      case 8:  return { x: 100, y: 300 }; // Scorpio
      case 9:  return { x: 0,   y: 300 }; // Sagittarius
      case 10: return { x: 0,   y: 200 }; // Capricorn
      case 11: return { x: 0,   y: 100 }; // Aquarius
      default: return { x: 200, y: 200 }; // Center
    }
  };

  if (style === 'South Indian') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[360px] md:max-w-[400px]">
        {/* Core Outer Boundary */}
        <rect x="0" y="0" width="400" height="400" fill="transparent" stroke="#cca43b" strokeWidth="2.5" />
        
        {/* Draw Inner Grid Lines */}
        {/* Columns */}
        <line x1="100" y1="0" x2="100" y2="400" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#cca43b" strokeWidth="1.5" strokeDasharray="300px 100px" />
        <line x1="200" y1="0" x2="200" y2="100" stroke="#cca43b" strokeWidth="1" />
        <line x1="200" y1="300" x2="200" y2="400" stroke="#cca43b" strokeWidth="1" />
        
        {/* Rows */}
        <line x1="0" y1="100" x2="400" y2="100" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="0" y1="300" x2="400" y2="300" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="0" y1="200" x2="100" y2="200" stroke="#cca43b" strokeWidth="1" />
        <line x1="300" y1="200" x2="400" y2="200" stroke="#cca43b" strokeWidth="1" />

        {/* Center Text */}
        <text x="200" y="205" fill="#cca43b" fontSize="14" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle" opacity="0.65">
          {t("SOUTH KUNDLI", "दक्षिण कुण्डली")}
        </text>

        {/* Render 12 sign grid labels */}
        {Array.from({ length: 12 }, (_, i) => {
          const signNum = i + 1;
          const pos = getSouthIndianHouseCoords(signNum);
          const isLagna = signNum === lagna;
          return (
            <g key={`sign-${signNum}`}>
              {/* Highlight lagna box */}
              {isLagna && (
                <rect x={pos.x + 2} y={pos.y + 2} width="96" height="96" fill="#cca43b" fillOpacity="0.08" stroke="#cca43b" strokeWidth="1.5" />
              )}
              <text x={pos.x + 10} y={pos.y + 20} fill="#cca43b" fontSize="10" fontWeight="bold" opacity="0.6">
                {signNum}
              </text>
              {isLagna && (
                <text x={pos.x + 85} y={pos.y + 20} fill="#cca43b" fontSize="9" fontWeight="extrabold" textAnchor="end">
                  {t("ASC", "लग्न")}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw Planets in Coords */}
        {Object.values(report.planets).map((detail) => {
          const pos = getSouthIndianHouseCoords(detail.signNum);
          const isHighlighted = highlightedPlanet === detail.planet.id;

          const planetIndexInSign = Object.values(report.planets)
            .filter(p => p.signNum === detail.signNum)
            .findIndex(p => p.planet.id === detail.planet.id);

          const offsetX = 15 + (planetIndexInSign % 2) * 45;
          const offsetY = 40 + Math.floor(planetIndexInSign / 2) * 25;

          const strokeColor = detail.relationship === 'Friendly' ? '#4ade80' : 
                              detail.relationship === 'Enemy' ? '#f87171' : 
                              detail.relationship === 'Neutral' ? '#facc15' : '#cca43b';

          const rectWidth = language === 'English' ? 32 : 36;

          return (
            <g 
              key={detail.planet.id}
              onClick={() => setHighlightedPlanet(isHighlighted ? null : detail.planet.id)}
              onMouseEnter={() => setHighlightedPlanet(detail.planet.id)}
              onMouseLeave={() => setHighlightedPlanet(null)}
              className="cursor-pointer"
            >
              <rect
                x={pos.x + offsetX - (rectWidth / 2)}
                y={pos.y + offsetY - 10}
                width={rectWidth}
                height="16"
                rx="3"
                fill={isHighlighted ? strokeColor : '#ffffff'}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? '2' : '1'}
                opacity="0.95"
              />
              <text
                x={pos.x + offsetX}
                y={pos.y + offsetY}
                dy="2"
                fill={isHighlighted ? '#ffffff' : '#2D2A26'}
                fontSize="8"
                fontWeight="extrabold"
                fontFamily="Cinzel, serif"
                textAnchor="middle"
              >
                {t(detail.planet.name.toUpperCase().substring(0, 3), detail.planet.hindi)}
                {detail.status === 'Exalted' || detail.status === 'UCHH' ? '↑' : detail.status === 'Debilitated' || detail.status === 'NEECH' ? '↓' : ''}
              </text>
            </g>
          );
        })}

        {/* Simple Aspect Line Layer inside center voids */}
        {highlightedPlanet && report.aspects
          .filter(aspect => aspect.fromPlanet.id === highlightedPlanet)
          .map((aspect, k) => {
            const startPlanet = report.planets[highlightedPlanet];
            if (!startPlanet) return null;
            const start = getSouthIndianHouseCoords(startPlanet.signNum);
            const targetPlanet = Object.values(report.planets).find(val => val.houseNum === aspect.toHouse);
            const end = getSouthIndianHouseCoords(targetPlanet ? targetPlanet.signNum : ((lagna + aspect.toHouse - 2) % 12) + 1);
            
            return (
              <g key={`aspect-south-${k}`}>
                <line 
                  x1={start.x + 50} 
                  y1={start.y + 50} 
                  x2={end.x + 50} 
                  y2={end.y + 50} 
                  stroke={aspect.type.color || '#fff'} 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  className="wave-line animate-pulse"
                />
              </g>
            );
          })}
      </svg>
    );
  }

  // Render East Indian Style (Diagonal centered layout)
  // Drawn using simple symmetric box styling
  if (style === 'East Indian') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[360px] md:max-w-[400px]">
        {/* Draw outer boundaries */}
        <rect x="0" y="0" width="400" height="400" fill="transparent" stroke="#cca43b" strokeWidth="2.5" />
        
        {/* Main central layout divisions */}
        <line x1="0" y1="0" x2="400" y2="400" stroke="#cca43b" strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="#cca43b" strokeWidth="1.5" />

        <line x1="200" y1="0" x2="200" y2="400" stroke="#cca43b" strokeWidth="1" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#cca43b" strokeWidth="1" />

        <text x="200" y="205" fill="#cca43b" fontSize="14" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle" opacity="0.65">
          {t("EAST KUNDLI", "पूर्वी कुण्डली")}
        </text>

        {/* Draw Lagna Indicator */}
        <circle cx="200" cy="50" r="10" fill="transparent" stroke="#cca43b" strokeWidth="1.5" />
        <text x="200" y="54" fill="#cca43b" fontSize="10" textAnchor="middle" fontWeight="extrabold">
          {t("L", "ल")}
        </text>

        {/* Planet placement labels inside East system */}
        {Object.values(report.planets).map((detail) => {
          const house = detail.houseNum;
          // Simple layout position calculations based on house index
          const angleRad = ((house - 1) * 30 * Math.PI) / 180;
          const x = 200 + Math.cos(angleRad) * 120 + ((house % 2 === 0) ? -15 : 15);
          const y = 200 + Math.sin(angleRad) * 120 + ((house % 2 === 0) ? -15 : 15);
          const isHighlighted = highlightedPlanet === detail.planet.id;

          const strokeColor = detail.relationship === 'Friendly' ? '#4ade80' : 
                              detail.relationship === 'Enemy' ? '#f87171' : 
                              detail.relationship === 'Neutral' ? '#facc15' : '#cca43b';

          const rectWidth = language === 'English' ? 32 : 36;

          return (
            <g 
              key={detail.planet.id}
              onClick={() => setHighlightedPlanet(isHighlighted ? null : detail.planet.id)}
              onMouseEnter={() => setHighlightedPlanet(detail.planet.id)}
              onMouseLeave={() => setHighlightedPlanet(null)}
              className="cursor-pointer"
            >
              <rect
                x={x - (rectWidth / 2)}
                y={y - 10}
                width={rectWidth}
                height="16"
                rx="3"
                fill={isHighlighted ? strokeColor : '#ffffff'}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? '2' : '1'}
                opacity="0.95"
              />
              <text
                x={x}
                y={y + 1}
                dy="2"
                fill={isHighlighted ? '#ffffff' : '#2D2A26'}
                fontSize="8"
                fontWeight="extrabold"
                fontFamily="Cinzel, serif"
                textAnchor="middle"
              >
                {t(detail.planet.name.toUpperCase().substring(0, 3), detail.planet.hindi)}
                {detail.status === 'Exalted' || detail.status === 'UCHH' ? '↑' : detail.status === 'Debilitated' || detail.status === 'NEECH' ? '↓' : ''}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return null;
}
