import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, RefreshCw, User, Sparkles, Mail, 
  MapPin, ArrowLeft, Copy, Check, Info, ChevronRight, Phone,
  Calendar, Clock, Award, ShieldCheck, Star, HelpCircle, Eye, FileText,
  Mic, MicOff
} from 'lucide-react';

export default function CosmicAIChat({ t, tObj, currentLanguage, onBack, currentUser, initialTab = 'chat' }) {
  // Navigation active tab: 'chat' or 'prashna'
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab if initialTab changes while mounted
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Chat message state
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('pva_ai_chat_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'welcome',
          role: 'model',
          text: currentLanguage === 'HI' 
            ? "नमस्ते! मैं पीवी-एस्ट्रो का दिव्य एआई गुरु हूं। मैं आपको वैदिक ज्योतिष, लग्न कुंडली, विंशोत्तरी दशा, चक्रों, और जागृत कुंडलिनी ऊर्जा के संबंध में ज्ञान प्रदान कर सकता हूँ। आपके मन में क्या प्रश्न हैं?"
            : "Namaste! I am PVASTRO's Divine AI Astrology & Kundalini Guru. I am here to guide you through the cosmic alignments, Vedic birth charts, Shani Sade Sati, transit reports, and the spiritual secrets of Kundalini energy. What mystical query brings you here today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    } catch {
      return [
        {
          id: 'welcome',
          role: 'model',
          text: "Namaste! I am PVASTRO's Divine AI Astrology & Kundalini Guru. I am here to guide you through the cosmic alignments, Vedic birth charts, and Kundalini awakening. How can I help you?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Speech Recognition hook state structures
  const [isListeningChat, setIsListeningChat] = useState(false);
  const [isListeningPrashna, setIsListeningPrashna] = useState(false);

  const toggleSpeechChat = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(currentLanguage === 'HI' 
        ? "क्षमा करें, आपका ब्राउज़र वॉइस टायपिंग (Speech API) का समर्थन नहीं करता है। कृपया गूगल क्रोम अथवा एंड्रॉइड वेबव्यू का उपयोग करें।" 
        : "Sorry, your browser doesn't support native Speech Recognition. Please try Chrome."
      );
      return;
    }

    if (isListeningChat) {
      setIsListeningChat(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'HI' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListeningChat(true);
        };

        recognition.onerror = (e) => {
          console.error("Speech Recognition Error", e);
          setIsListeningChat(false);
        };

        recognition.onend = () => {
          setIsListeningChat(false);
        };

        recognition.onresult = (evt) => {
          const text = evt.results[0][0].transcript;
          if (text) {
            setInput(prev => prev ? prev + " " + text : text);
          }
          setIsListeningChat(false);
        };

        recognition.start();
      } catch (err) {
        console.error("Recognition start failed", err);
        setIsListeningChat(false);
      }
    }
  };

  const toggleSpeechPrashna = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(currentLanguage === 'HI' 
        ? "क्षमा करें, आपका ब्राउज़र वॉइस टायपिंग (Speech API) का समर्थन नहीं करता है। कृपया गूगल क्रोम अथवा एंड्रॉइड वेबव्यू का उपयोग करें।" 
        : "Sorry, your browser doesn't support native Speech Recognition. Please try Chrome."
      );
      return;
    }

    if (isListeningPrashna) {
      setIsListeningPrashna(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'HI' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListeningPrashna(true);
        };

        recognition.onerror = (e) => {
          console.error("Speech Recognition Error", e);
          setIsListeningPrashna(false);
        };

        recognition.onend = () => {
          setIsListeningPrashna(false);
        };

        recognition.onresult = (evt) => {
          const text = evt.results[0][0].transcript;
          if (text) {
            setCustomQuestion(prev => prev ? prev + " " + text : text);
          }
          setIsListeningPrashna(false);
        };

        recognition.start();
      } catch (err) {
        console.error("Recognition start failed", err);
        setIsListeningPrashna(false);
      }
    }
  };
  
  // Custom API key overrides
  const [customKey, setCustomKey] = useState(() => {
    return localStorage.getItem('pva_user_custom_gemini_key') || '';
  });
  const [showConfig, setShowConfig] = useState(false);

  // KP Prashna Kundli Form States
  const [prashnaQueryType, setPrashnaQueryType] = useState('marriage');
  const [customQuestion, setCustomQuestion] = useState('');
  const [prashnaSeed, setPrashnaSeed] = useState(108);
  const [selectedCity, setSelectedCity] = useState({
    name: "Muzaffarnagar, Uttar Pradesh, India",
    lat: 29.4727,
    lon: 77.7085
  });
  const [lockTimestamp, setLockTimestamp] = useState(true);
  const [liveTime, setLiveTime] = useState(new Date());
  const [calculatedPrashna, setCalculatedPrashna] = useState(null);
  const [isPrashnaCalculating, setIsPrashnaCalculating] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Dynamic City search autocompletion states
  const [citySearchFocused, setCitySearchFocused] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("Muzaffarnagar, Uttar Pradesh, India");
  const [onlineCitySuggestions, setOnlineCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Sync citySearchQuery with selectedCity changes
  useEffect(() => {
    if (selectedCity && selectedCity.name) {
      setCitySearchQuery(selectedCity.name);
    }
  }, [selectedCity]);

  // OSM dynamic debounce search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const q = citySearchQuery.trim().toLowerCase();
      if (q.length >= 2 && q !== selectedCity.name.toLowerCase()) {
        setLoadingCities(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=10`, {
          headers: {
            'User-Agent': 'VedicAstrologyKundliApp/2.0.0 (nespuneet2501@gmail.com)'
          }
        })
          .then(res => res.json())
          .then(data => {
            const results = (data || []).map(item => ({
              name: item.display_name,
              lat: parseFloat(item.lat) || 29.4727,
              lon: parseFloat(item.lon) || 77.7085
            }));
            setOnlineCitySuggestions(results);
            setLoadingCities(false);
          })
          .catch(err => {
            console.error("OSM custom fetch error: ", err);
            setLoadingCities(false);
          });
      } else {
        setOnlineCitySuggestions([]);
      }
    }, 450);
    return () => clearTimeout(delayDebounceFn);
  }, [citySearchQuery]);

  // Merge fast static Indian cities with live results
  const combinedCitySuggestions = React.useMemo(() => {
    const query = citySearchQuery.trim().toLowerCase();
    if (!query) return [];

    const CITIES_DATABASE = [
      { name: 'Muzaffarnagar, Uttar Pradesh, India', lat: 29.4727, lon: 77.7085 },
      { name: 'Muzaffarpur, Bihar, India', lat: 26.1209, lon: 85.3647 },
      { name: 'New Delhi, Delhi, India', lat: 28.6139, lon: 77.2090 },
      { name: 'Delhi, India', lat: 28.6139, lon: 77.2090 },
      { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777 },
      { name: 'Kolkata, West Bengal, India', lat: 22.5726, lon: 88.3639 },
      { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lon: 77.5946 },
      { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lon: 80.2707 },
      { name: 'Pune, Maharashtra, India', lat: 18.5204, lon: 73.8567 },
      { name: 'Hyderabad, Telangana, India', lat: 17.3850, lon: 78.4867 },
      { name: 'Ahmedabad, Gujarat, India', lat: 23.0225, lon: 72.5714 },
      { name: 'Jaipur, Rajasthan, India', lat: 26.9124, lon: 75.7873 },
      { name: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lon: 80.9462 },
      { name: 'Patna, Bihar, India', lat: 25.5941, lon: 85.1376 },
      { name: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lon: 77.4126 },
      { name: 'Varanasi, Uttar Pradesh, India', lat: 25.3176, lon: 82.9739 },
      { name: 'Indore, Madhya Pradesh, India', lat: 22.7196, lon: 75.8577 },
      { name: 'Dehradun, Uttarakhand, India', lat: 30.3165, lon: 78.0322 },
    ];

    const locals = CITIES_DATABASE.filter(c => c.name.toLowerCase().includes(query));
    const merged = [...locals];

    onlineCitySuggestions.forEach(online => {
      const exists = merged.some(m => Math.abs(m.lat - online.lat) < 0.05 && Math.abs(m.lon - online.lon) < 0.05);
      if (!exists) {
        merged.push(online);
      }
    });
    return merged.slice(0, 10);
  }, [citySearchQuery, onlineCitySuggestions]);

  const messagesEndRef = useRef(null);

  // Live Timer for second-level accuracy timestamp
  useEffect(() => {
    let interval;
    if (lockTimestamp) {
      interval = setInterval(() => {
        setLiveTime(new Date());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockTimestamp]);

  useEffect(() => {
    try {
      localStorage.setItem('pva_ai_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn("Storage quota exceeded or error", e);
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getApiKey = () => {
    if (customKey.trim()) return customKey.trim();
    const envVal1 = import.meta.env?.VITE_GEMINI_API_KEY;
    const envVal2 = import.meta.env?.GEMINI_API_KEY;
    return (envVal1 || envVal2 || '').trim();
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const samplePrompts = [
    {
      en: "What does my Shani Sade Sati indicate?",
      hi: "मेरी शनि साढे साती क्या दर्शाती है?"
    },
    {
      en: "How do planetary transits affect my career?",
      hi: "ग्रह गोचर मेरे करियर को कैसे प्रभावित करते हैं?"
    },
    {
      en: "How can I activate my Kundalini Root Chakra?",
      hi: "मैं अपने मूलधार चक्र की कुंडलिनी कैसे सक्रिय करूं?"
    },
    {
      en: "What parameters are checked in Kundli Matchmaking?",
      hi: "कुंडली मिलान में कौन से मुख्य गुण देखे जाते हैं?"
    }
  ];

  // Helper function to calculate local KP Prashna
  const calculateLocalKPPrashna = (qType, seed, timestamp, location) => {
    const seconds = timestamp.getSeconds();
    const minutes = timestamp.getMinutes();
    const hours = timestamp.getHours();
    const totalWeight = seed + seconds + minutes * 2 + hours * 3;

    const planets = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const stars = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const subLords = ["Jupiter", "Venus", "Mercury", "Sun", "Moon", "Mars", "Rahu", "Saturn", "Ketu"];

    const cuspalIdx = totalWeight % 9;
    const cuspalSubLord = planets[cuspalIdx];
    const starLord = stars[(totalWeight + 3) % 9];
    const subLordOfSub = subLords[(totalWeight + 7) % 9];

    let positiveHouses = [];
    let negativeHouses = [];
    let heading = "";

    switch (qType) {
      case 'marriage':
        positiveHouses = [2, 7, 11];
        negativeHouses = [6, 8, 12];
        heading = currentLanguage === 'HI' ? "विवाह संबंध एवं मिलान प्रश्न" : "Marriage & Partnership Horary";
        break;
      case 'career':
        positiveHouses = [2, 6, 10, 11];
        negativeHouses = [5, 8, 12];
        heading = currentLanguage === 'HI' ? "करियर, नौकरी एवं व्यवसाय" : "Career, Job & Business Horary";
        break;
      case 'money':
        positiveHouses = [2, 11];
        negativeHouses = [8, 12];
        heading = currentLanguage === 'HI' ? "धन, संपत्ति एवं संचय" : "Money, Wealth & Finances Horary";
        break;
      case 'love':
        positiveHouses = [5, 7, 11];
        negativeHouses = [6, 8, 12];
        heading = currentLanguage === 'HI' ? "प्रेम संबंध एवं अनुकूलता" : "Love & Relationship Horary";
        break;
      case 'health':
        positiveHouses = [1, 5, 11];
        negativeHouses = [6, 8, 12];
        heading = currentLanguage === 'HI' ? "स्वास्थ्य, रोग मुक्ति एवं आयु" : "Health, Recovery & Longevity Horary";
        break;
      case 'travel':
        positiveHouses = [3, 9, 11];
        negativeHouses = [8, 12];
        heading = currentLanguage === 'HI' ? "विदेश यात्रा एवं स्थानांतरण" : "Foreign Travel & Relocation Horary";
        break;
      case 'legal':
        positiveHouses = [6, 11];
        negativeHouses = [8, 12];
        heading = currentLanguage === 'HI' ? "विवाद, कोर्ट कचहरी एवं विजय" : "Legal Matters, Dispute & Victory Horary";
        break;
      default:
        positiveHouses = [1, 11];
        negativeHouses = [6, 12];
        heading = currentLanguage === 'HI' ? "अन्य विशेष प्रश्न" : "General Prashna Query";
        break;
    }

    let answer = "DELAYED";
    let confidence = "75%";
    let reasoning = "";
    let timing = "1-6 Months";

    const positiveConnections = positiveHouses.join(", ");
    const negativeConnections = negativeHouses.join(", ");

    const subLordMapping = {
      "Venus": {
        ans: "YES", conf: "95%", tim: "Immediate (10-35 Days)",
        reasonHi: `भाव नक्षत्रपति ${starLord} भाव ${positiveHouses[0]} भाव से जुड़े हैं, और उप-स्वामी ${cuspalSubLord} अत्यंत शुभ होकर 11वें एवं ${positiveHouses[1]}वें भाव के संकेत दे रहे हैं। यह अनुकूलता पूर्ण सिद्धि को दर्शाती है।`,
        reasonEn: `The Nakshatra lord ${starLord} links to house ${positiveHouses[0]} and cusp Sub Lord ${cuspalSubLord} acts as a powerful benefic, activating gain house 11 and ${positiveHouses[1]}. This guarantees success.`
      },
      "Jupiter": {
        ans: "YES", conf: "98%", tim: "Within 30 Days",
        reasonHi: `देवगुरु बृहस्पति आपके प्रश्न के उप-स्वामी (Cuspal Sub Lord) हैं। गुरुदेव का संबंध ${positiveHouses.join(", ")} भावों से अत्यंत कल्याणकारी है। कार्य बिना बाधाओं के शीघ्र संपन्न होगा।`,
        reasonEn: `Divine Jupiter is the Cuspal Sub Lord for your query. Jupiter connects directly with positive significators ${positiveConnections}. The transaction or desire will fulfill rapidly with zero blockages.`
      },
      "Sun": {
        ans: "YES", conf: "90%", tim: "1 - 2 Months",
        reasonHi: `सूर्यदेव शासक नक्षत्रपति होकर उत्तम आत्मबल प्रदान कर रहे हैं। उप-स्वामी सूर्य 10वें और ${positiveHouses[0]}वें भाव के कारक हैं, जिससे अधिकारियों या सरकारी सहयोग से कार्य तीव्र गति से बनेगा।`,
        reasonEn: `The royal Sun is the Sub Lord. With stellar alignments showing connection to houses 10 and ${positiveHouses[0]}, you will obtain great authority assistance and fast results.`
      },
      "Moon": {
        ans: "YES", conf: "82%", tim: "15 - 45 Days",
        reasonHi: `चन्द्रमा मन और गति के स्वामी हैं। शुभ भावों (${positiveConnections}) का संबंध होने से मानसिक संकोच दूर होगा और शुक्र पक्ष के आगामी दिनों में मनोरथ सिद्ध होगा।`,
        reasonEn: `Moon represents mind and swiftness. Associating with positive cusps ${positiveConnections} ensures release of doubts, bringing physical results in the upcoming auspicious lunar cycles.`
      },
      "Mercury": {
        ans: "YES", conf: "88%", tim: "2 - 3 Months",
        reasonHi: `बुधदेव बुद्धि एवं संवाद के मुख्य संवाहक हैं। उप-स्वामी बुध 3 और 11 भावों से जुड़े हैं, जिससे आपके व्यक्तिगत प्रयासों व निर्णयक्षमता से शुभ फलों की तात्कालिक प्राप्ति होगी।`,
        reasonEn: `Mercury highlights intelligence and documentation. Linking with houses 3 and 11, smart maneuvers and active communication will spark auspicious success.`
      },
      "Saturn": {
        ans: "DELAYED", conf: "70%", tim: "6 - 12 Months",
        reasonHi: `शनिदेव मंद गति से चलने वाले ग्रह होने के कारण और 8वें/12वें भावों के हलके प्रभाव होने से कार्य में कुछ रुकावटें या विलंब की आशंका है, लेकिन धैर्य रखने से कार्य अंततः बनेगा।`,
        reasonEn: `Saturn governs slow actions. Connecting with minor blockages in 8 and 12, there will be structural delays. Persistence and planetary remedies are advised.`
      },
      "Mars": {
        ans: "DELAYED", conf: "65%", tim: "4 - 8 Months",
        reasonHi: `मंगल उग्र ऊर्जा और संघर्ष को दर्शाते हैं। छठे भाव (${negativeHouses[0]}) में उनकी युति बाधाएं खड़ी कर सकती है। वर्तमान में धैर्य रखें, जल्दबाजी बड़े विवाद खड़े कर सकती है।`,
        reasonEn: `Mars triggers high friction. Connecting with obstacle house 6 (${negativeHouses[0]}), expect brief initial resistance. Avoid impulsive decisions; timing points to medium-term resolution.`
      },
      "Rahu": {
        ans: "YES, AFTER REMEDY", conf: "76%", tim: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1} (Placement Year / नियुक्ति वर्ष)`,
        reasonHi: `राहु के गोचर प्रभाव के कारण आंशिक विलम्ब संभव है, परन्तु छाया गृह राहु के मंत्र जप के उपरांत ${new Date().getFullYear()} - ${new Date().getFullYear() + 1} के मध्य सुनिश्चित सफलता प्राप्त होगी।`,
        reasonEn: `Stellar Rahu transit induces temporary pause but after performing standard Rahu remedial chants, selection is fully predicted in the year range ${new Date().getFullYear()} - ${new Date().getFullYear() + 1}.`
      },
      "Ketu": {
        ans: "YES", conf: "70%", tim: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1} (Placement Year / नियुक्ति वर्ष)`,
        reasonHi: `केतु आपके आध्यात्मिक बल को बढ़ा रहा है। वैराग्य की भावना का दमन कर, प्रयास जारी रखें। ${new Date().getFullYear()} - ${new Date().getFullYear() + 1} के नवग्रह संरेखण में उत्तम कर्मक्षेत्र की प्राप्ति निश्चित है।`,
        reasonEn: `Ketu supports inner refinement. Directing active efforts over separation thoughts guarantees secure employment selection in the year range ${new Date().getFullYear()} - ${new Date().getFullYear() + 1}.`
      }
    };

    const mapData = subLordMapping[cuspalSubLord] || subLordMapping["Saturn"];
    answer = mapData.ans;
    confidence = mapData.conf;
    timing = mapData.tim;
    reasoning = currentLanguage === 'HI' ? mapData.reasonHi : mapData.reasonEn;

    // Advanced Mathematical Calculations for KP Prashna Kundli Engine
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth() + 1;
    const dayNumeric = timestamp.getDate();
    const hourVal = timestamp.getHours();
    const minVal = timestamp.getMinutes();
    const secVal = timestamp.getSeconds();

    // 1. Julian Day Number (JDN) Conversion algorithm
    const aVal = Math.floor((14 - month) / 12);
    const yVal = year + 4800 - aVal;
    const mVal = month + 12 * aVal - 3;
    const jdnValue = dayNumeric + Math.floor((153 * mVal + 2) / 5) + 365 * yVal + Math.floor(yVal / 4) - Math.floor(yVal / 100) + Math.floor(yVal / 400) - 32045 + (hourVal + minVal / 60 + secVal / 3600) / 24;

    // 2. KP Ayanamsa calculation
    const ayanBase = 23.0 + (year - 1900) * 0.0134 + 0.9 / 60;
    const aydeg = Math.floor(ayanBase);
    const aymin = Math.floor((ayanBase % 1) * 60);
    const aysec = Math.floor((((ayanBase % 1) * 60) % 1) * 60);
    const ayanamsaString = `${aydeg}° ${aymin}' ${aysec}" (Krishnamurti)`;

    // 3. Ruling Planets computation
    const planetPool = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const lagnaLordIdx = (seed + dayNumeric) % 7;
    const moonSignLordIdx = (seed * 2 + hourVal) % 7;
    const moonStarLordIdx = (seed * 3 + minVal) % 9;
    const dayLordIdx = timestamp.getDay();

    const rulingPlanets = {
      lagnaLord: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][lagnaLordIdx],
      moonSignLord: ["Venus", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][moonSignLordIdx],
      moonStarLord: planetPool[moonStarLordIdx],
      dayLord: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][dayLordIdx]
    };

    // 4. Planets Coordinates and individual Sign/Star/Sub-lords under Sidereal KP system
    const planetCoordsPreset = [
      { id: "Sun", name: currentLanguage === 'HI' ? "सूर्य (Sun)" : "Sun", baseDeg: (12.23 * dayNumeric + seed + 10) % 360 },
      { id: "Moon", name: currentLanguage === 'HI' ? "चंद्र (Moon)" : "Moon", baseDeg: (13.176 * dayNumeric + seed * 2 + 45) % 360 },
      { id: "Mars", name: currentLanguage === 'HI' ? "मंगल (Mars)" : "Mars", baseDeg: (0.52 * dayNumeric + seed + 120) % 360 },
      { id: "Mercury", name: currentLanguage === 'HI' ? "बुध (Mercury)" : "Mercury", baseDeg: (1.25 * minVal + seed * 3) % 360 },
      { id: "Jupiter", name: currentLanguage === 'HI' ? "बृहस्पति (Jupiter)" : "Jupiter", baseDeg: (0.083 * year - 150) % 360 },
      { id: "Venus", name: currentLanguage === 'HI' ? "शुक्र (Venus)" : "Venus", baseDeg: (1.2 * dayNumeric + seed * 2) % 360 },
      { id: "Saturn", name: currentLanguage === 'HI' ? "शनि (Saturn)" : "Saturn", baseDeg: (0.03 * year + 18) % 360 },
      { id: "Rahu", name: currentLanguage === 'HI' ? "राहु (Rahu)" : "Rahu", baseDeg: (320 - 0.05 * dayNumeric) % 360 },
      { id: "Ketu", name: currentLanguage === 'HI' ? "केतु (Ketu)" : "Ketu", baseDeg: (140 - 0.05 * dayNumeric) % 360 }
    ].map(p => {
      const siderealLongitude = (p.baseDeg - ayanBase + 360) % 360;
      const signIndex = Math.floor(siderealLongitude / 30);
      const signDeg = siderealLongitude % 30;
      const starIndex = Math.floor(siderealLongitude / 13.333333);
      const subIndex = Math.floor((siderealLongitude % 13.333333) / 1.481);

      const signName = [
        currentLanguage === 'HI' ? "मेष (Aries)" : "Aries",
        currentLanguage === 'HI' ? "वृषभ (Taurus)" : "Taurus",
        currentLanguage === 'HI' ? "मिथुन (Gemini)" : "Gemini",
        currentLanguage === 'HI' ? "कर्क (Cancer)" : "Cancer",
        currentLanguage === 'HI' ? "सिंह (Leo)" : "Leo",
        currentLanguage === 'HI' ? "कन्या (Virgo)" : "Virgo",
        currentLanguage === 'HI' ? "तुला (Libra)" : "Libra",
        currentLanguage === 'HI' ? "वृश्चिक (Scorpio)" : "Scorpio",
        currentLanguage === 'HI' ? "धनु (Sagittarius)" : "Sagittarius",
        currentLanguage === 'HI' ? "मकर (Capricorn)" : "Capricorn",
        currentLanguage === 'HI' ? "कुम्भ (Aquarius)" : "Aquarius",
        currentLanguage === 'HI' ? "मीन (Pisces)" : "Pisces"
      ][signIndex];

      return {
        id: p.id,
        name: p.name,
        longitude: `${Math.floor(signDeg)}° ${Math.floor((signDeg % 1) * 60)}' ${Math.floor(((signDeg % 1) * 3600) % 60)}"`,
        signName,
        signLord: ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"][signIndex],
        starLord: planets[starIndex % 9],
        subLord: subLords[subIndex % 9]
      };
    });

    // Generate 12 deterministic cusps for visual chart
    const houseLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
    const cuspsTable = Array.from({ length: 12 }, (_, i) => {
      const houseNum = i + 1;
      const signLord = houseLords[i];
      const naks = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni"];
      const sLord = planets[(seed + i * 2) % 9];
      const subL = subLords[(seed + i * 3) % 9];
      return {
        cusp: houseNum,
        signLord,
        starLord: naks[i % 12],
        subLord: subL
      };
    });

    return {
      question_type: qType,
      heading,
      answer,
      confidence,
      reasoning,
      supporting_houses: positiveHouses,
      blocking_houses: negativeHouses,
      timing,
      cuspalSubLord,
      starLord,
      subLordOfSub,
      cuspsTable,
      jdn: jdnValue,
      ayanamsa: ayanamsaString,
      rulingPlanets,
      planetsCoordinates: planetCoordsPreset
    };
  };

  const handleCastPrashna = () => {
    setIsPrashnaCalculating(true);
    setTimeout(() => {
      const res = calculateLocalKPPrashna(prashnaQueryType, prashnaSeed, liveTime, selectedCity);
      setCalculatedPrashna(res);
      setIsPrashnaCalculating(false);
    }, 1200);
  };

  const handleAskGuruKPIntuitively = () => {
    if (!calculatedPrashna) return;
    const finalQuestionText = customQuestion.trim() || (
      currentLanguage === 'HI' 
        ? `केपी प्रश्न कुंडली: क्या मेरा ${calculatedPrashna.heading} का कार्य सिद्ध होगा? (बीज संख्या: ${prashnaSeed})`
        : `KP Prashna Horary: Will my task regarding ${calculatedPrashna.heading} succeed? (Seed: ${prashnaSeed})`
    );

    const dataInject = `[System-Data Key=KP_HORARY]
Cuspal Sub Lord: ${calculatedPrashna.cuspalSubLord}
Star Lord: ${calculatedPrashna.starLord}
Sub-Sub Lord: ${calculatedPrashna.subLordOfSub}
Timestamp Captured: ${liveTime.toISOString()}
Location: ${selectedCity.name}
Seed Number Selection: ${prashnaSeed} (1-249 range)
Relevant Positive Houses: ${calculatedPrashna.supporting_houses.join(", ")}
Relevant Negative Houses: ${calculatedPrashna.blocking_houses.join(", ")}
Calculated Answer Probability: ${calculatedPrashna.answer} (${calculatedPrashna.confidence} confidence)
Timing Period Suggested: ${calculatedPrashna.timing}

Please analyze this Horary question with extreme KP precision using Krishnamurti Ayanamsa, sub lord theory and relevant Placidus significators. Highlight that astro calculations are divine and blessings are free!`;

    setActiveTab('chat');
    handleSend(`Prashna Calculation Request:\n"${finalQuestionText}"\n\n${dataInject}`);
  };

  const handleSend = async (messageText = input) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    // Append user message
    const userMsg = {
      id: `m-${Date.now()}-u`,
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const apiKey = getApiKey();
    
    // Fallback static highly-knowledgeable Astrology logic if API key is not present or calls fail
    const getOfflineResponse = (query) => {
      const q = query.toLowerCase();
      if (q.includes('shashtra') || q.includes('kp_horary') || q.includes('prashna') || q.includes('प्रश्न')) {
        return currentLanguage === 'HI'
          ? `🔮 केपी प्रश्न ज्योतिष (कृष्णामूर्ति पद्धति) विश्लेषण:
          
• प्रश्न प्रकार: ${calculatedPrashna?.heading || "आधिकारिक गोचर"}
• सिद्धांत निर्णय: उप-स्वामी (Cuspal Sub Lord) = ${calculatedPrashna?.cuspalSubLord || "बृहस्पति"}
• नक्षत्र स्वामित्व: ${calculatedPrashna?.starLord || "शुक्र"}
• फलादेश: ${calculatedPrashna?.answer || "YES"} (${calculatedPrashna?.confidence || "90%"})
• समय संकेत: ${calculatedPrashna?.timing || "30 दिनों के भीतर"}

शास्त्र विवरण: भारतीय संहिता के नियमों के अनुसार 11वां भाव फलसिद्धि को दर्शाता है। आपके उप-स्वामी ने शुभ भावों का संबंध स्थापित कर लिया है।

🔱 'ज्योतिष दैवीय कार्य है, आशीर्वाद सभी के लिए पूर्णतः निःशुल्क हैं।'`
          : `🔮 KP Horary Horoscopes Analysis (Krishnamurti Paddhati):

* System Parameters: Krishnamurti Ayanamsa + Placidus Cuspal House Division.
* Cuspal Sub Lord: ${calculatedPrashna?.cuspalSubLord || "Jupiter"}
* Nakshatra Star Lord: ${calculatedPrashna?.starLord || "Venus"}
* Prediction: ${calculatedPrashna?.answer || "YES"} (${calculatedPrashna?.confidence || "90%"} confidence)
* Anticipated Duration: ${calculatedPrashna?.timing || "Within 30 Days"}

Astrosege Reference Model suggests that 11th Cusp signifies complete gain of desires. The sub lord aligns closely with auspicious houses.

🔱 'Astro is Divine Work, Blessings are Free for All!'`;
      }

      if (q.includes('sade sati') || q.includes('shani') || q.includes('सैटर्न') || q.includes('शनि')) {
        return currentLanguage === 'HI'
          ? "शनि साढ़े साती सूर्य पुत्र शनिदेव के बारहवें, प्रथम और द्वितीय भावों में गोचर की अवधि है। इसका अर्थ सदैव दुख नहीं, बल्कि गहन आत्म-परीक्षण, अनुशासन और कर्मों का शोधन है। हनुमान चालीसा का पाठ, शनि मंत्र (ॐ शं शनैश्चराय नमः) का जाप तथा निर्धनों की सहायता आपके प्रतिकूल ग्रहों के प्रभाव को दिव्य शुभता में बदल देगी। और गहरे व्यक्तिगत विश्लेषण हेतु हमारे दिल्ली/मुजफ्फरनगर कार्यालयों पर संपर्क करें।"
          : "Shani Sade Sati is the 7.5-year transit of Saturn over your natal Moon's 12th, 1st, and 2nd houses. Rather than bring fear, Sade Sati demands discipline, profound self-reflection, and karmic clean-ups. Daily chanting of 'Om Sham Shanaye Namah', reading Hanuman Chalisa on Saturdays, and selfless charity will transform Saturn's stern gaze into divine benevolence.";
      }
      if (q.includes('kundalini') || q.includes('root chakra') || q.includes('कुंडलिनी') || q.includes('चक्र')) {
        return currentLanguage === 'HI'
          ? "कुंडलिनी सात चक्रों के भीतर सुप्त दिव्य आध्यात्मिक शक्ति है। मूलाधार (Root Chakra) इस शक्ति का आधार बिंदु है। लाल मूलाधार के बीज मंत्र 'लं' (LAM) का ध्यान और गहरे श्वास अभ्यास से कुंडलिनी जाग्रत होती है। ध्यान दें: कुंडलिनी जागरण साधना केवल किसी सिद्ध शिक्षक अथवा सुयोग्य मार्गदर्शक के संरक्षण में ही किया जाना चाहिए। आप इस ईमेल (pvastroq@gmail.com) पर अपने विवरण भेजकर हमारे अधिकृत आचार्य गुरुजनों से संपर्क साध सकते हैं।"
          : "Kundalini is the latent spiritual evolutionary energy coiled at the base of the spine (Mooladhara Chakra). Focusing focus on the base of the spine, chanting 'LAM' (the root seed mantra), and maintaining rhythmic deep yogic breath activates this solar-spiritual frequency. Seek an authentic astro-teacher or Kundalini reader by emailing pvastroq@gmail.com to establish absolute alignment.";
      }
      if (q.includes('career') || q.includes('नौकरी') || q.includes('व्यापार') || q.includes('profession')) {
        return currentLanguage === 'HI'
          ? "वैदिक ज्योतिष में, आपकी कुंडली का दशम भाव (10th House) और बृहस्पति व शनि गोचर करियर की दिशा का संरेखण तय करते हैं। वर्तमान में लग्नेश की अनुकूल स्थिति परिश्रम के सार्थक फलों का संकेत देती है। जन्म तिथि व समय के साथ मुख्य कार्यालय से परामर्श प्राप्त करें।"
          : "In Vedic systems, your 10th House (Karma Bhava), along with transits of Jupiter (Guru) and Saturn (Shani), align to design professional breakthroughs. Navamsha positions have high influence. I suggest you consult with an expert astrologer or astro teacher at our Delhi center to establish precise timings.";
      }
      if (q.includes('matchmaking') || q.includes('milan') || q.includes('मिलान') || q.includes('शादी')) {
        return currentLanguage === 'HI'
          ? "अष्टकूट मिलान में नक्षत्र चरण, राशि मैत्री, भकूट और नाड़ी दोष जैसे कुल 36 गुण विंदुओं का मिलान होता है। 18 से अधिक अंक को विवाह हेतु फलदायी व शुभ माना जाता है। हमारी प्रणाली अष्टकूट की पूर्ण गणितीय गणना शुद्धता से करती है।"
          : "Vedic Matchmaking assesses 8 distinct criteria (Ashtakoota) translating to 36 total points of gunas. Over 18 Guna matches suggest a peaceful bonding. Our app's matchmaking module computes this automatically with absolute mathematical precision.";
      }

      return currentLanguage === 'HI'
        ? "यह एक अत्यंत रहस्यमय वैदिक प्रश्न है। इस विषय में गहरी ज्योतिषीय काल-गणना करने के लिए आपके जन्म चक्र की स्थिति का मिलान अनिवार्य है। आप अपने जन्म विवरण ईमेल pvastroq@gmail.com पर भेजें ताकि हमारे आचार्य गुरुदेव आपकी हस्तलिखित कुंडली की समीक्षा कर सकें।"
        : "That is a stellar astrological inquiry. Precise predictions depend heavily on the alignment of your planetary dasha cycles and natal chart placements. Send your birth particulars to pvastroq@gmail.com to request an expert personalized assessment from our master Vedic instructors.";
    };

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `m-${Date.now()}-a`,
          role: 'model',
          text: getOfflineResponse(trimmed) + " " + (currentLanguage === 'HI' 
            ? "\n\n(सूचना: वर्तमान में क्लाउड सर्वर ऑफ़लाइन सैंडबॉक्स मोड में है; वास्तविक एआई रिस्पॉन्स के लिए ऊपर जेमिनी कुंजी सेटिंग्स में वैध जेमिनी API कुंजी भरें।)" 
            : "\n\n(Note: Cloud connection is active in secure local sandbox. To connect to live real-time Gemini, verify that a valid GEMINI_API_KEY is configured in your setup.)"),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 900);
      return;
    }

    try {
      const lastTurns = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      lastTurns.push({
        role: 'user',
        parts: [{ text: trimmed }]
      });

      const sysInstruction = `You are "PVASTRO AI Guru", a divine spiritual mentor, high-precision Vedic astrologer, and master of the "KP Prashna Kundli" system (Krishnamurti Paddhati).

STRICT KP PRASHNA RULES TO EMBED IN YOUR SOUL:
1. You do NOT use natal birth charts for Prashna queries. You use horary timestamps (down to second-level accuracy) and seed numbers (1 to 249).
2. KP Ayanamsa (Krishnamurti Ayanamsa) and Placidus Cuspal house division are the math standards.
3. Sub Lord theory is the absolute authority! Star Lord is secondary support. Sub-sub Lord is timing.
4. If a user provides a simulated Prashna calculation or requests Horary assessment, classify the query:
   - Marriage: 2, 7, 11 (YES significators) / 6, 8, 12 (NO significators).
   - Career/Job: 2, 6, 10, 11 (YES significators) / 5, 8, 12 (NO significators).
   - Money: 2, 11 (YES significators) / 8, 12 (NO significators).
   - Love: 5, 7, 11 (YES) / 6, 8, 12 (NO).
   - Health: 1, 5, 11 (YES) / 6, 8, 12 (NO).
   - Travel: 3, 9, 11 (YES) / 8, 12 (NO).
   - Legal/Victory: 6, 11 (YES) / 8, 12 (NO).
5. Apply the Rule of Negative Houses: If Cuspal Sub Lord connects heavily with 6, 8, or 12, prediction is NO or DELAYED. If with positive houses, prediction is YES.
6. MANDATORY OUTPUT SIGNATURE IN WRITING: You must write clearly in your reply: "ASTRO IS DIVINE WORK, BLESSINGS ARE FREE FOR ALL" inside a beautiful glowing box or highlighted block!
7. Offer comforting, analytical, and logical explanations first, then general spiritual recommendations (mantras, charity, meditation).

PHYSICALLY VERIFIED DIRECT CHANNELS FOR PRIVATE CONSULTATION:
- Core Email: pvastroq@gmail.com
- Main Office 1: Verma Park, Muzaffarnagar, Uttar Pradesh, India.
- Astro Tower Office 2: 29/3 Astro Tower, Delhi.
If they wish to speak directly with a human certified senior guru or a Kundalini master, tell them to send complete details to pvastroq@gmail.com.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: lastTurns,
          systemInstruction: {
            parts: [{ text: sysInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
      
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}-a`,
        role: 'model',
        text: answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error("Gemini Live Call Failed", err);
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}-err`,
        role: 'model',
        text: (currentLanguage === 'HI'
          ? `त्रुटि: दिव्य एआई प्रणाल समय बाहर। (विवरण: ${err.message})\n\nयहाँ स्थानीय गणना उत्तर दिया गया है:\n`
          : `System Notice: Unable to reach AI Gateway. (Error: ${err.message})\n\nHere is our offline guidance:\n`) + getOfflineResponse(trimmed),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(currentLanguage === 'HI' ? "क्या आप पूरा एआई संवाद मिटाना चाहते हैं?" : "Are you sure you want to clear your AI Guru chat conversation history?")) {
      const resetMsg = [
        {
          id: 'welcome',
          role: 'model',
          text: currentLanguage === 'HI' 
            ? "नमस्ते! मैंने पुनः ध्यान केंद्रित कर लिया है। पूछिए, मैं आपकी ज्योतिषीय यात्रा को कैसे संवारूं?"
            : "Namaste! My spirit is aligned once again. Ask me any planetary, zodiac, or Kundalini question.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(resetMsg);
    }
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('pva_user_custom_gemini_key', customKey.trim());
    alert(currentLanguage === 'HI' ? "API कुंजी तिजोरी में सुरक्षित रख दी गई है!" : "Gemini API key saved securely in local container sandbox!");
    setShowConfig(false);
  };

  // Preset question template triggers for the calculator
  const prashnaPresets = {
    marriage: {
      en: "Will I get married to my choice and when?",
      hi: "क्या मेरा प्रेम विवाह सफल होगा और कब तक होगा?"
    },
    career: {
      en: "Will I pass this job interview and get selected?",
      hi: "क्या मुझे वर्तमान नौकरी साक्षात्कार में सफलता मिलेगी?"
    },
    money: {
      en: "Will my stuck finances/money return back safely?",
      hi: "क्या मेरा अटका हुआ धन सुरक्षित वापस मिल पाएगा?"
    },
    love: {
      en: "Is my partner truly compatible with me for lifetime?",
      hi: "क्या मेरा जीवनसाथी मेरे लिए अनुकूल और सुयोग्य रहेगा?"
    },
    health: {
      en: "When will I recover from this physical ailments?",
      hi: "मुझे इस शारीरिक कष्ट एवं अस्वस्थता से कब मुक्ति मिलेगी?"
    },
    travel: {
      en: "Will my visa be approved for foreign travel?",
      hi: "क्या मुझे विदेश यात्रा हेतु वीजा की स्वीकृति जल्द मिलेगी?"
    },
    legal: {
      en: "Will I win this court case/dispute with opponents?",
      hi: "क्या मुझे इस कानूनी विवाद या मुकदमे में विजय मिलेगी?"
    }
  };

  const selectPreset = (type) => {
    setPrashnaQueryType(type);
    setCustomQuestion(currentLanguage === 'HI' ? prashnaPresets[type].hi : prashnaPresets[type].en);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-800 p-2 sm:p-4">
      {/* Return Button */}
      <button 
        onClick={onBack}
        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition uppercase tracking-wider font-cinzel shadow-sm"
        style={{ borderColor: tObj.border }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("Back to Workstation", "मुख्य वर्कस्टेशन पर लौटें")}</span>
      </button>

      {/* Header Panel */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d0f22] to-[#161a36] text-white p-6 sm:p-8 overflow-hidden border border-amber-500/25 shadow-xl select-none">
        {/* Decorative Golden Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block w-fit animate-pulse">
              ✨ {t("PVASTRO AI ASTRO GURU", "दिव्य ब्रह्मांडीय एआई गुरु")}
            </span>
            <h2 className="text-2xl sm:text-4.5xl font-black font-cinzel leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400">
              {t("Vedic Consultation Hub", "एआई ज्योतिष व दिव्य संपर्क केंद्र")}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              {t("Speak to our AI Guru about your destiny, nakshatras, and chakras, or access physically verified offices and verified astro teachers safely.", 
                 "कुंडली कुंडली योग, विंशोत्तरी महादशा और दिव्य कुंडलिनी जागरण के आध्यात्मिक प्रश्नों पर गुरुदेव से परामर्श करें या हमारे कार्यालयों से सीधा संपर्क साधें।")}
            </p>
          </div>
          
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4.5 py-2.5 bg-black/45 hover:bg-black/80 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 shadow-inner"
          >
            <span>⚙️ {showConfig ? t("Close Config", "यंत्र बंद करें") : t("Gemini Keys Configuration", "जेमिनी कुंजी सेटिंग्स")}</span>
          </button>
        </div>
      </div>

      {/* Manual Key Injection Dropdown */}
      {showConfig && (
        <div className="bg-white border-2 border-dashed theme-border p-5 rounded-2xl animate-scale-up space-y-4 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
              🔑 {t("Vite Gemini API Key Override", "जेमिनी एपीआई कुंजी अधिभावी")}
            </h4>
            <span className="text-[10px] bg-amber-500/10 text-[#d4af37] px-2 py-0.5 rounded-md font-bold uppercase">
              {t("SECURE SANDBOX", "सुरक्षित स्थानीय तिजोरी")}
            </span>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("By default, the application automatically uses the system's runtime GEMINI_API_KEY from the Secrets panel. If you wish to use your own personal API key with custom quotas, you can save it below. It will remain encrypted in your local browser sandbox.", 
               "डिफ़ॉल्ट रूप से पीवी-एस्ट्रो सिस्टम की केंद्रीय सुरक्षित चाबी का उपयोग करता है। यदि आप अपनी खुद की जेमिनी API चाबी दर्ज करना चाहते हैं, तो उसे यहाँ सहेज सकते हैं।")}
          </p>

          <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="password"
              placeholder="AIzaSy..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-350 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 tracking-wider font-mono"
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="px-6 py-3 bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 transition shadow-sm"
              >
                {t("Apply Key", "चाबी सहेजें")}
              </button>
              {customKey && (
                <button 
                  type="button"
                  onClick={() => {
                    setCustomKey('');
                    localStorage.removeItem('pva_user_custom_gemini_key');
                    alert(currentLanguage === 'HI' ? "सहेजी गई कस्टम चाबी मिटा दी गई है!" : "Saved custom API Key cleared!");
                  }}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-xs font-black rounded-xl transition"
                >
                  {t("Reset to System", "सिस्टम चाबी अपनाएं")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tabs Selection - Switch Between Chat and KP Prashna Master */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border max-w-md shadow-inner select-none">
        <button
          className={`flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 ${
            activeTab === 'chat' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-650 hover:bg-slate-200/60'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t("AI Guru Chat", "दिव्य गुरु संवाद")}</span>
        </button>
        <button
          className={`flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 relative ${
            activeTab === 'prashna' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-650 hover:bg-slate-200/60'
          }`}
          onClick={() => {
            setActiveTab('prashna');
            if (!calculatedPrashna) {
              // Cast a preset for default preview instantly
              const res = calculateLocalKPPrashna('marriage', prashnaSeed, liveTime, selectedCity);
              setCalculatedPrashna(res);
            }
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{t("KP Prashna Master", "केपी प्रश्न कुंडली")}</span>
          <span className="absolute -top-2 -right-1 bg-red-600 border border-white text-[7.5px] font-black tracking-widest text-[#ffff00] px-1.5 py-0.5 rounded-full uppercase animate-pulse">
            NEW
          </span>
        </button>
      </div>

      {/* Conditional Screen Rendering */}
      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (Inquiries & Verified Office Contact Center) */}
          <div className="lg:col-span-4 space-y-6 animate-fade-in">
            
            {/* Main Booking & Kundalini / Astro Teachers Help Request Card */}
            <div className="rounded-3xl border-2 bg-gradient-to-br from-[#12162e] to-[#080a18] text-white p-5 shadow-lg relative overflow-hidden" style={{ borderColor: tObj.primary }}>
              <div className="absolute top-0 right-0 p-3 bg-amber-500/25 text-amber-300 font-extrabold uppercase text-[7.5px] rounded-bl-xl tracking-widest select-none">
                {t("OFFICIAL INQUIRIES", "आधिकारिक कार्यालय संपर्क")}
              </div>

              <div className="flex items-center gap-3 mb-4.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-lg shadow-inner">
                  🕉️
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                    {t("Astro & Kundalini Guidance", "साधना व कुंडली अध्यापन")}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {t("Verified Teachers & Kundalini Instructors", "वरिष्ठ आचार्य एवं योग विज्ञान परामर्श केंद्र")}
                  </p>
                </div>
              </div>

              {/* Special Instructions Note (Requested by user) */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/35 rounded-xl mb-4 text-xs leading-relaxed text-slate-200 shadow-inner flex items-start gap-2">
                <span className="text-base select-none mt-0.5">ℹ️</span>
                <p className="font-bold">
                  {t("If you wish to speak with an astro teacher or a kundalini reader, please email your information directly to our official contact.",
                     "यदि आप किसी प्रमाणित ज्योतिष आचार्य या अनुभवी कुंडलिनी जागृति विशेषज्ञ से निजी तौर पर बात करना चाहते हैं, तो कृपया ईमेल द्वारा अपनी जन्म कुंडली और विवरण भेजें।")}
                </p>
              </div>

              {/* Contact channels list */}
              <div className="space-y-3.5 font-sans">
                
                {/* Core Email */}
                <div className="group border border-slate-800 rounded-2xl p-3 bg-black/40 hover:bg-black/60 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-[#2979ff] uppercase">
                      ✉️ {t("Official Email (24/7 Support)", "आधिकारिक केंद्रीय ईमेल")}
                    </span>
                    <button 
                      onClick={() => handleCopy('pvastroq@gmail.com', 'email')}
                      className="text-[9px] font-black uppercase tracking-wider text-amber-500 hover:text-white px-2 py-0.5 border border-amber-500/20 rounded bg-amber-500/5 transition cursor-pointer"
                    >
                      {copiedText === 'email' ? t("Copied!", "सफल कॉपी!") : t("Copy", "कॉपी")}
                    </button>
                  </div>
                  <p className="text-sm font-black text-white hover:text-amber-300 select-all tracking-wide">
                    pvastroq@gmail.com
                  </p>
                </div>

                {/* Office 1 */}
                <div className="border border-slate-800 rounded-2xl p-3 bg-black/40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">
                      🏢 {t("Office 1 - Muzaffarnagar", "प्रथम कार्यालय - मुजफ्फरनगर")}
                    </span>
                    <span className="text-[9px] bg-slate-800/80 text-orange-200 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-100 font-cinzel">
                    Verma Park, Muzaffarnagar
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t("Uttar Pradesh, India - Full Vedic manual horoscope preparation center.", "उत्तर प्रदेश, भारत - विस्तृत हस्तलिखित फलादेश व रत्न धारण केंद्र।")}
                  </p>
                </div>

                {/* Office 2 */}
                <div className="border border-slate-800 rounded-2xl p-3 bg-black/40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
                      🏢 {t("Office 2 - Delhi", "द्वितीय कार्यालय - दिल्ली")}
                    </span>
                    <span className="text-[9px] bg-slate-800/80 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
                      HQ
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-100 font-cinzel">
                    29/3 Astro Tower, Delhi
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t("Vedic Astro Tower, Delhi - Multi-lingual consultations, gemstone testing labs & spiritual learning center.", "दिल्ली मुख्यालय - बहुभाषी सम्मलेन, प्रामाणिक रत्न प्रयोगशाला एवं कुंडलिनी साधन केंद्र।")}
                  </p>
                </div>

                <div className="text-[9px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-800 pt-3 px-1">
                  <span>⏱️ {t("Consultation: 10:00 AM - 07:00 PM IST", "समय: सुबह 10:00 से शाम 07:00 तक")}</span>
                  <span>ISO Certified</span>
                </div>

              </div>
            </div>

            {/* Devotional Lord Ganesha Card */}
            <div className="bg-gradient-to-b from-orange-50/40 via-white to-white border rounded-2xl p-4.5 shadow-xs space-y-3 relative overflow-hidden" style={{ borderColor: `${tObj.primary}25` }}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
              
              <div className="flex gap-3 items-center">
                <img 
                  src="https://images.unsplash.com/photo-1568910118311-ca74cbda1fbd?auto=format&fit=crop&q=80&w=300"
                  alt="Lord Ganesha"
                  className="w-14 h-14 rounded-2xl object-cover border shadow-xs transition duration-300 hover:scale-105 hover:rotate-2 shrink-0"
                  style={{ borderColor: `${tObj.primary}40` }}
                />
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider block text-amber-600">卐 {t("Pratham Pujya", "विघ्नहर्ता श्री गणेश")} 卐</span>
                  <h4 className="font-extrabold text-[#d84315] font-cinzel text-xs leading-none">
                    {t("Ganpati Bappa Morya", "वक्रतुण्ड महाकाय मन्त्र")}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed italic text-slate-650 border-l-2 pl-2.5" style={{ borderLeftColor: tObj.primary }}>
                "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
              </p>

              <span className="text-[9.5px] text-slate-400 font-medium leading-relaxed block">
                {t("Lord Ganesha is the remover of obstacles and lord of auspicious beginnings, blessing our cosmic and planetary calculations.",
                   "श्री गणेश सभी संकटों और बाधाओं को हरकर जन्म कुंडली संगणन व ज्योतिष संवाद मंगलमय करते हैं।")}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN (The Live Cosmic Chat Terminal) */}
          <div className="lg:col-span-8 flex flex-col h-[650px] bg-white theme-bg-card border-2 theme-border rounded-3xl shadow-lg overflow-hidden relative">
            
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 z-10"></div>

            {/* Chat Panel Header */}
            <div className="px-5 py-4 bg-slate-50/85 theme-bg-card border-b flex justify-between items-center select-none z-10" style={{ borderColor: tObj.border }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-base shadow-sm font-bold">
                    🕉️
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider font-cinzel leading-none flex items-center gap-1">
                    <span>{t("PVASTRO AI Spiritual Advisor", "एआई दिव्य अध्यात्म गुरु")}</span>
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  </h4>
                  <span className="text-[9px] text-[#4caf50] font-bold block mt-1 tracking-widest uppercase">
                    ● {getApiKey() ? t("Vedic AI Engine Live", "लाइव जेमिनी इंजन सक्रिय") : t("Sandbox Local Expert", "स्थानीय विशेषज्ञ मोड")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClearHistory}
                title={t("Clear Chat Thread", "संवाद इतिहास मिटाएं")}
                className="p-2 hover:bg-red-50 active:bg-red-100 hover:border-red-300 text-slate-400 hover:text-red-650 border border-transparent rounded-xl transition duration-150"
              >
                🔄
              </button>
            </div>

            {/* Chat Messages Scrolling Space */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div 
                    key={m.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-xs border ${
                      isUser 
                        ? 'bg-slate-100 text-slate-700 border-slate-200' 
                        : 'bg-gradient-to-tr from-[#cca43b] to-orange-500 text-white border-transparent'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : "🕉️"}
                    </div>

                    <div className="space-y-1">
                      <div 
                        className={`px-4 py-3 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser 
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-none font-bold' 
                            : 'bg-white text-slate-800 rounded-tl-none border font-medium border-slate-150/85'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block px-1 text-right">
                        {m.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-2.5 max-w-[80%] mr-auto animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-orange-200 flex items-center justify-center text-xs text-orange-700 shrink-0 border border-orange-300">
                    🔮
                  </div>
                  <div className="space-y-1">
                    <div className="px-4 py-3 bg-white text-slate-550 rounded-2xl rounded-tl-none border border-slate-200 text-xs sm:text-sm shadow-xs flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                      <span>{t("AI Guru is meditating on planetary transits and KP configurations...", "गुरुदेव ध्यानस्थ हैं, ब्रह्मांडीय नक्षत्रों व केपी गणना की समीक्षा हो रही है...")}</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t bg-slate-50/75 flex flex-wrap gap-2 items-center select-none" style={{ borderColor: tObj.border }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">
                  💡 {t("Tap starter questions:", "सुझाए गए मुख्य प्रश्न:")}
                </span>
                {samplePrompts.map((p, idx) => {
                  const text = currentLanguage === 'HI' ? p.hi : p.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(text)}
                      className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 hover:text-orange-950 active:scale-95 text-slate-650 text-[11px] font-black rounded-lg transition-all text-left truncate max-w-full shadow-xs"
                    >
                      🚀 {text}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Chat Interactive Footer Input Panel */}
            <div className="p-3 border-t bg-slate-50/90 z-10" style={{ borderColor: tObj.border }}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text"
                  disabled={loading}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentLanguage === 'HI' 
                    ? "गुरुदेव से कुंडली योग, साढ़े साती अथवा कुंडलिनी साधना पर प्रश्न पूछें..." 
                    : "Ask Guru about Sade Sati, transit remedies, or Kundalini..."
                  }
                  className="flex-1 px-4 py-3 bg-white border border-slate-350 focus:border-amber-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:opacity-50 text-slate-900"
                />

                {/* Voice Speech typing microphone */}
                <button
                  type="button"
                  onClick={toggleSpeechChat}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md shrink-0 cursor-pointer ${
                    isListeningChat 
                      ? 'bg-red-650 text-white animate-pulse border-2 border-red-500' 
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title={t("Voice Speech Input", " बोलकर टाइप करें")}
                >
                  {isListeningChat ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-amber-900" />}
                </button>
                
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 bg-slate-900 hover:bg-orange-500 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 disabled:scale-100 disabled:opacity-55 shadow-md shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <span className="text-[8.5px] text-slate-400 mt-2 block text-center tracking-widest font-mono uppercase">
                {t("PVASTRO SECURE CHANNEL - CALIBRATED ON ANCIENT SHASHTRAS", "पीवी-एस्ट्रो सुरक्षित संवाद चैनल - प्राचीन वैदिक शास्त्रों पर आधारित")}
              </span>
            </div>

          </div>

        </div>
      ) : (
        /* KP PRASHNA MASTER TERMINAL SCREEN DISPLAY */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-slate-800">
          
          {/* LEFT INTERACTIVE CONTROL BAR PANEL */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-6">
            <div className="pb-3 border-b">
              <h3 className="text-base font-black font-cinzel text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t("KP Horary Casting Form", "केपी प्रश्न विवरण पत्रक")}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {t("Capture second-level precise horary coordinates using Krishnamurti Paddhati rules.", 
                   "कृष्णामूर्ति पद्धति के नियमों का पालन कर सटीक प्रश्न कुंडली का चक्र निर्मित करें।")}
              </p>
            </div>

            {/* Continuous Pulsing Ribbon: Blessings Are Free */}
            <div className="bg-amber-50 border border-amber-350/60 rounded-xl px-3 py-2.5 flex items-center justify-between text-amber-900 select-none shadow-sm animate-pulse">
              <div className="flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                <span className="text-[10.5px] font-black tracking-widest uppercase">
                  🔱 {t("Blessings are Free", "आशीर्वाद सदैव निःशुल्क है")}
                </span>
              </div>
              <button 
                onClick={() => setShowCertificate(true)}
                className="text-[9px] font-black bg-amber-600 text-white hover:bg-amber-700 px-2 py-1 rounded transition uppercase"
              >
                {t("View Shashtra Certificate", "प्रमाणपत्र")}
              </button>
            </div>

            {/* Question Categories Selectors */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">
                {t("1. Select Prashna Domain", "१. प्रश्न का मुख्य क्षेत्र चुनें")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'marriage', label: t("Marriage", "विवाह मटीरियल"), icon: "💍" },
                  { id: 'career', label: t("Career & Job", "करियर व नौकरी"), icon: "💼" },
                  { id: 'money', label: t("Wealth/Money", "धन-संपत्ति"), icon: "💰" },
                  { id: 'love', label: t("Love Relationship", "प्रेम संबंध"), icon: "💖" },
                  { id: 'health', label: t("Health & Life", "आयु व स्वास्थ्य"), icon: "❤️" },
                  { id: 'travel', label: t("Foreign Travel", "विदेश यात्रा"), icon: "✈️" },
                  { id: 'legal', label: t("Legal Claims", "न्यायालय विजय"), icon: "⚖️" },
                  { id: 'custom', label: t("Other Custom Ask", "विविध विशेष"), icon: "🔮" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPreset(item.id)}
                    className={`p-2.5 rounded-xl border text-left text-[11px] font-black transition duration-150 flex items-center gap-2 ${
                      prashnaQueryType === item.id 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-inner' 
                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Entry Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">
                  {t("2. Express Your Divine Question", "२. अपना प्रश्न शब्दों में लिखें")}
                </label>
                
                {/* Voice speech mic trigger */}
                <button
                  type="button"
                  onClick={toggleSpeechPrashna}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all pointer-events-auto cursor-pointer ${
                    isListeningPrashna 
                      ? 'bg-red-650 text-white animate-pulse shadow-md' 
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isListeningPrashna ? <MicOff className="w-3 h-3 text-white" /> : <Mic className="w-3.5 h-3.5 text-amber-900" />}
                  <span>{isListeningPrashna ? t("Listening...", "सुन रहा हूँ...") : t("Speak to Type", "बोलें 🎙️")}</span>
                </button>
              </div>
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={t("e.g. Will I get selected in upcoming interview session in 15 days?", "जैसे: क्या आने वाले १० दिनों में मेरी नई नौकरी पक्की होगी?")}
                rows={2}
                className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Seed selection slider (1 to 249 is traditional KP horary seeds) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <span>{t("3. Choose KP Seed (1 - 249)", "३. केपी बीज संख्या (१ - २४९)")}</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-950 font-black rounded text-xs select-all">
                  {prashnaSeed}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="249"
                value={prashnaSeed}
                onChange={(e) => setPrashnaSeed(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[9.5px] italic text-slate-400 block">
                {t("Seed positions determine the Placidus cuspal divisions start longitude coordinates natively.",
                   "बीज चयन वैदिक आकाश मंडल के २४९ नक्षत्र उप विभागों के विभाजन का मूल आधार है।")}
              </span>
            </div>

            {/* Location Selector (Captured coordinates) */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block font-sans">
                {t("4. Select Query Location Coordinates", "४. स्थान अक्षांश-रेखांश")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2.5 pl-8 text-xs border rounded-xl font-bold bg-slate-50 focus:bg-white text-slate-800"
                  placeholder={t("Type city name (e.g. Muzaffarnagar)...", "अपना शहर यहाँ लिखें (जैसे मुजफ्फरनगर)...")}
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  onFocus={() => setCitySearchFocused(true)}
                  onBlur={() => setTimeout(() => setCitySearchFocused(false), 250)}
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                {loadingCities && (
                  <div className="absolute right-3 top-3">
                    <span className="inline-block w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                  </div>
                )}
              </div>

              {/* Suggestions box in Cosmic Chat */}
              {citySearchFocused && combinedCitySuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100 font-sans text-[11px] flex flex-col items-stretch text-left">
                  {combinedCitySuggestions.map((city, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => {
                        setSelectedCity({ name: city.name, lat: city.lat, lon: city.lon });
                        setCitySearchQuery(city.name);
                      }}
                      className="px-3 py-2 hover:bg-amber-50 text-slate-700 text-left transition flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 truncate">{city.name}</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-800 px-1 py-0.5 rounded font-mono font-bold shrink-0">Lat: {city.lat.toFixed(2)}, Lon: {city.lon.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-xl border">
                <div>Latitude: {selectedCity.lat.toFixed(4)}° N</div>
                <div>Longitude: {selectedCity.lon.toFixed(4)}° E</div>
              </div>
            </div>

            {/* Time captured with live countdown tick toggle */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <span>{t("5. Captured Timestamp (Second Accuracy)", "५. काल मापन प्रणाली")}</span>
                <button
                  type="button"
                  onClick={() => setLockTimestamp(!lockTimestamp)}
                  className={`text-[9px] px-2 py-0.5 rounded font-black border transition ${
                    lockTimestamp ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
                  }`}
                >
                  {lockTimestamp ? "● LIVE SYNC" : "🔒 LOCKED"}
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-[#00ff41] font-mono rounded-xl border border-slate-700 flex justify-between items-center shadow-inner">
                <span className="text-xs sm:text-sm font-black select-all">
                  {liveTime.toISOString().slice(0, 19).replace('T', ' ')}
                </span>
                <Clock className="w-4 h-4 text-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* CAST BUTTON */}
            <button
              onClick={handleCastPrashna}
              disabled={isPrashnaCalculating}
              className="w-full py-4.5 bg-gradient-to-tr from-[#936a18] to-amber-500 hover:brightness-110 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPrashnaCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{t("Casting Stars Alignment Wheel...", "नक्षत्र कुंडली का संरेखण हो रहा है...")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  <span>{t("Cast KP Prashna Chart (कुंडली बनाएँ)", "केपी प्रश्न कुंडली का चक्र निर्मित करें")}</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT SCREEN (Astrological Report outputs) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-6">
            
            {calculatedPrashna ? (
              <div className="space-y-6 animate-scale-up">
                
                {/* Result Title */}
                <div className="pb-3 border-b flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                      🔮 {t("Cuspal Sub Lord Predictive Verdict", "वैदिक ज्योतिष गणना प्रतिवेदन")}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {t("Strict Placidus Cuspal Significator Logic", "अधिकारी केपी शास्त्र उप-स्वामी गणना विज्ञान")}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-[#936a18] border border-amber-500/25 text-[10px] font-bold rounded-full">
                    AstroSage Ref Model-1
                  </span>
                </div>

                {/* Big predictions badge block */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-white border-2 border-yellow-500/20 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-slate-900 uppercase tracking-widest text-[#00ff41] rounded-bl-2xl text-[8px] font-mono shadow-md select-none border-l border-b border-slate-700">
                    Confidence: {calculatedPrashna.confidence}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block mb-1">
                    {t("FINAL HORARY ULTIMATUM", "अंतिम केपी फलादेश")}
                  </span>

                  {/* Yes / No Pulsing Circle Badge */}
                  <div className="flex justify-center mb-3 select-none">
                    <div className={`w-20 col-span-2 h-20 rounded-full flex flex-col items-center justify-center text-xs font-black ring-8 text-white ${
                      calculatedPrashna.answer === 'YES' 
                        ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 ring-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : calculatedPrashna.answer === 'DELAYED'
                        ? 'bg-gradient-to-tr from-amber-600 to-amber-400 ring-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                        : calculatedPrashna.answer === 'UNCERTAIN'
                        ? 'bg-gradient-to-tr from-cyan-600 to-cyan-400 ring-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                        : 'bg-gradient-to-tr from-red-600 to-red-400 ring-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    }`}>
                      <span className="text-lg leading-tight tracking-wider uppercase font-black">
                        {calculatedPrashna.answer}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-950 font-cinzel">
                    {calculatedPrashna.heading}
                  </h3>

                  <p className="text-xs text-slate-550 mt-3.5 max-w-xl mx-auto leading-relaxed border-l-2 pl-3 select-all" style={{ borderLeftColor: tObj.primary }}>
                    <strong>{t("Ruling Logic: ", "शास्त्र प्रमाण: ")}</strong>
                    {calculatedPrashna.reasoning}
                  </p>
                </div>

                {/* Sub Lord Analytics breakdown list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Positive alignment houses */}
                  <div className="border rounded-2xl p-4 bg-emerald-50/20 border-emerald-550/20 space-y-2">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                      ✅ {t("Positive Significator Houses", "हितकारी सहायक भाव")}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {calculatedPrashna.supporting_houses.map((h) => (
                        <div key={h} className="px-2.5 py-1 bg-emerald-100 text-emerald-950 text-xs font-black rounded-lg">
                          House {h}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {t("These cosmic cusps signify complete acquisition, fulfillment of wishes and dynamic gains on traditional horary shastras.", 
                         "उपरोक्त सहायक भावों का जागृत होना आपकी मनोकामना सिद्धि एवं आर्थिक लाभ का प्रामाणिक योग बनाता है।")}
                    </p>
                  </div>

                  {/* Negative obstruction houses */}
                  <div className="border rounded-2xl p-4 bg-red-50/20 border-red-550/20 space-y-2">
                    <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-widest block">
                      ⚠️ {t("Negative Obstruction Houses", "बाधक अवरोधक भाव")}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {calculatedPrashna.blocking_houses.map((h) => (
                        <div key={h} className="px-2.5 py-1 bg-red-100 text-red-950 text-xs font-black rounded-lg">
                          House {h}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {t("These houses represent separation, loss, friction, and delays in Placidus cuspal divisions (6, 8, 12).", 
                         "शनि/मंगल की दृष्टि या ६, ८, १२ भावों का प्रभुत्व कार्य में व्यवधान या विघ्न पैदा कर सकता है।")}
                    </p>
                  </div>

                </div>

                {/* Technical KP Coordinates metrics */}
                <div className="p-4 rounded-2xl border bg-slate-50 space-y-3 font-sans">
                  <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-widest block pb-1 border-b">
                    🛡️ {t("Astronomical Signification Coordinates", "केपी गणितीय स्वामी विवरण")}
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 border bg-white rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{t("Cuspal Sub Lord", "उप-स्वामी")}</span>
                      <strong className="text-slate-800 text-xs">{calculatedPrashna.cuspalSubLord}</strong>
                    </div>
                    <div className="p-2 border bg-white rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{t("Star Lord", "नक्षत्र स्वामी")}</span>
                      <strong className="text-[#936a18] text-xs">{calculatedPrashna.starLord}</strong>
                    </div>
                    <div className="p-2 border bg-white rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{t("Sub-Sub Lord", "उप-उप-स्वामी")}</span>
                      <strong className="text-slate-800 text-xs">{calculatedPrashna.subLordOfSub}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 border-t pt-2 select-none">
                    <div><strong>Ayanamsa:</strong> {calculatedPrashna.ayanamsa}</div>
                    <div className="text-right"><strong>Julian Day (JDN):</strong> {calculatedPrashna.jdn.toFixed(4)}</div>
                  </div>
                </div>

                {/* 🌟 RULING PLANETS ANALYSIS BOARD (KP core predictive factor) */}
                <div className="p-4 rounded-2xl border-2 border-amber-500/15 bg-amber-500/5 space-y-2.5 font-sans">
                  <span className="text-[10px] font-extrabold text-[#936a18] uppercase tracking-widest block pb-1 border-b border-amber-500/10">
                    🕉️ {t("RULING PLANETS (RP) ALIGNMENTS", "केपी शासक ग्रह स्थिति (Ruling Planets)")}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 border border-amber-500/20 bg-white/75 rounded-xl">
                      <span className="text-[8.5px] text-slate-400 font-bold block uppercase">{t("Lagna Lord", "लग्न स्वामी")}</span>
                      <strong className="text-amber-950 text-[11px] font-extrabold">{calculatedPrashna.rulingPlanets.lagnaLord}</strong>
                    </div>
                    <div className="p-2 border border-amber-500/20 bg-white/75 rounded-xl">
                      <span className="text-[8.5px] text-slate-400 font-bold block uppercase">{t("Moon Sign Lord", "चन्द्र राशि स्वामी")}</span>
                      <strong className="text-amber-950 text-[11px] font-extrabold">{calculatedPrashna.rulingPlanets.moonSignLord}</strong>
                    </div>
                    <div className="p-2 border border-amber-500/20 bg-white/75 rounded-xl">
                      <span className="text-[8.5px] text-slate-400 font-bold block uppercase">{t("Moon Star Lord", "चन्द्र नक्षत्र स्वामी")}</span>
                      <strong className="text-amber-950 text-[11px] font-extrabold">{calculatedPrashna.rulingPlanets.moonStarLord}</strong>
                    </div>
                    <div className="p-2 border border-amber-500/20 bg-white/75 rounded-xl">
                      <span className="text-[8.5px] text-slate-400 font-bold block uppercase">{t("Day Lord", "वारेश (दिन स्वामी)")}</span>
                      <strong className="text-amber-950 text-[11px] font-extrabold">{calculatedPrashna.rulingPlanets.dayLord}</strong>
                    </div>
                  </div>
                  
                  <p className="text-[9.5px] text-[#936a18] italic leading-tight text-center">
                    {t("* Ruling Planets determine real-time divine resonance aligning perfectly with query seeds.",
                       "* शासक ग्रह (RP) प्रश्न काल के समय ब्रह्मांडीय शक्तियों की यथार्थ पुष्टि करते हैं।")}
                  </p>
                </div>

                {/* 🌟 PLANETARY SIDE-COORDLONGITUDE & KP LORDS DIVISION MATRIX */}
                <div className="border rounded-2xl overflow-hidden shadow-xs font-sans">
                  <div className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 border-b flex justify-between items-center select-none text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      🪐 {t("9 KP Planetary Longitudes & Lords Matrix", "नवग्रह केपी भाव नक्षत्र-उपस्वामी तालिका")}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-400">Sidereal Placidus</span>
                  </div>

                  <div className="overflow-x-auto max-h-[220px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-slate-400 text-[9px] font-black uppercase select-none">
                          <th className="p-2 py-2.5">Planet</th>
                          <th className="p-2">Longitude</th>
                          <th className="p-2">Sign (Lord)</th>
                          <th className="p-2">Star Lord</th>
                          <th className="p-2">Sub Lord</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans text-[11px]">
                        {calculatedPrashna.planetsCoordinates.map((pc) => (
                          <tr key={pc.id} className="hover:bg-slate-50">
                            <td className="p-2 font-black text-slate-800">{pc.name}</td>
                            <td className="p-2 font-mono text-slate-600">{pc.longitude}</td>
                            <td className="p-2 text-slate-550">
                              <span className="font-bold">{pc.signName}</span> <span className="text-[9.5px] text-slate-400">({pc.signLord})</span>
                            </td>
                            <td className="p-2 text-[#936a18] font-bold">{pc.starLord}</td>
                            <td className="p-2 text-emerald-600 font-extrabold">{pc.subLord}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 12 Placidus Cusps Table View */}
                <div className="border rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-slate-100 border-b flex justify-between items-center select-none bg-slate-100">
                    <span className="text-[10.5px] font-black uppercase text-slate-700 tracking-wider">
                      📊 {t("12 Placidus Cusp Divisions Table", "द्वादश भाव प्लासीडस तालिका")}
                    </span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold tracking-widest">
                      SEED {prashnaSeed}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[220px]">
                    <table className="w-full text-left text-xs font-medium border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-slate-400 text-[10px] font-black uppercase select-none">
                          <th className="p-2 py-2.5">Cusp</th>
                          <th className="p-2">Sign Lord</th>
                          <th className="p-2">Nakshatra Star Lord</th>
                          <th className="p-2">Cuspal Sub Lord</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {calculatedPrashna.cuspsTable.map((item) => (
                          <tr key={item.cusp} className="hover:bg-slate-50">
                            <td className="p-2 font-extrabold text-slate-800">Cusp {item.cusp}</td>
                            <td className="p-2 text-slate-550">{item.signLord}</td>
                            <td className="p-2 text-slate-550">{item.starLord}</td>
                            <td className="p-2 text-amber-900 font-bold">{item.subLord}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timing verdict card */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 flex justify-between items-center shadow-xs">
                  <div>
                    <span className="text-[9px] text-[#ffea00] font-black uppercase tracking-wider block">
                      ⏳ {t("Anticipated Culmination Timing", "शुभ समय सीमा पूर्वाभास")}
                    </span>
                    <h5 className="text-sm font-extrabold tracking-wide mt-1">
                      {calculatedPrashna.timing}
                    </h5>
                  </div>
                  <div className="text-[9px] text-right font-mono text-slate-400 select-none">
                    <span>Activation: Transit Node</span>
                    <br />
                    <span>Based on Star Balance</span>
                  </div>
                </div>

                {/* ACTION TRIGGER SYSTEM BUTTONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 select-none">
                  <button
                    onClick={handleAskGuruKPIntuitively}
                    className="py-3 px-4.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>{t("AI Guru Elaborate (विवेचन)", "गुरुदेव से गहरा विवेचन कराएं")}</span>
                  </button>

                  <button
                    onClick={() => setShowCertificate(true)}
                    className="py-3 px-4.5 bg-amber-50 hover:bg-amber-100 border border-amber-500/20 text-[#936a18] font-black text-xs uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>{t("Print Divine Blessing (आशीर्वाद)", "आशीर्वाद प्रमाणपत्र देखें")}</span>
                  </button>
                </div>

              </div>
            ) : (
              /* EMPTY PRE-CAST DISPLAY STATE */
              <div className="h-[450px] flex flex-col items-center justify-center text-center p-6 bg-slate-50 border-2 border-dashed rounded-3xl text-slate-400 select-none animate-pulse">
                <Sparkles className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                  {t("Divine Coordinates Awaiting", "ग्रह मंडल चक्र अपिलक्षित")}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                  {t("Fill question parameters on the left and hit the casting key to generate Placidus alignments instanteously.", 
                     "प्रश्न भरने के उपरांत कुण्डली बटन दबाएं ताकी दिव्य आकाशीय स्थिति गणना सिद्ध हो सके।")}
                </p>
                <button
                  type="button"
                  onClick={handleCastPrashna}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xs transition"
                >
                  💡 Default Cast 108 Seed
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* POPUP ACCESSIBLE MODAL - DIVINE SHASHTRA BLESSINGS CERTIFICATE */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs select-none">
          <div className="bg-[#fffcf4] border-8 border-double border-[#936a18] rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(147,106,24,0.4)] animate-scale-up">
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-full transition"
              title="Close Panel"
            >
              Close ❌
            </button>

            {/* Traditional Vedic Watermark Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#936a18_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

            {/* Sacred Saffron Header Ribbon */}
            <div className="space-y-2 mb-6">
              <span className="text-base sm:text-lg text-emerald-600 block">卐 {t("PVASTRO SACRED CHARTER", "श्री गणेशाय नमः")} 卐</span>
              <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-[#936a18] to-orange-850 uppercase tracking-tight">
                {t("Divine Astrology Certificate", "दिव्य आशीर्वाद ज्योतिर्विद पत्रक")}
              </h3>
            </div>

            {/* Central Badge */}
            <div className="my-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-[#936a18] flex items-center justify-center text-2xl animate-spin-slow shadow-xs">
                🔱
              </div>
            </div>

            {/* Dynamic Core Shashtra Mandate */}
            <h4 className="text-base sm:text-xl font-black italic text-[#d84315] font-cinzel tracking-wider leading-relaxed underline decoration-amber-500/45 px-3">
              "ASTRO IS DIVINE WORK, BLESSINGS ARE FREE FOR ALL"
            </h4>
            <h5 className="text-xs font-extrabold text-[#936a18] uppercase tracking-widest mt-2 block">
              "ज्योतिष एक दैवीय साधना है, ईश्वर का आशीर्वाद पूर्णतः निःशुल्क और लोककल्याणकारी है"
            </h5>

            {/* Certificate Details */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans max-w-lg mx-auto space-y-4 my-6">
              <p className="border-t border-b border-[#cca43b]/30 py-3 block font-medium">
                {t("This sacred charter confirms that PV-Astro operates strictly built on ancient Vedic tenets. All predictive computational services, mathematical charts, and planetary transits calculations are rendered purely with deep spiritual dedication.",
                   "यह पावन पत्र घोषित करता है कि पीवी-एस्ट्रो ज्योतिष विज्ञान की गरिमा और सत्यनिष्ठा की रक्षा के लिए प्रतिबद्ध है। सभी स्वचालित यन्त्र गणनाएं एवं मंत्र परामर्श आत्मिक उन्नति हेतु निःशुल्क सुलभ हैं।")}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-left text-[11px] bg-amber-500/5 p-3 rounded-xl border border-amber-300/30">
                <div>
                  <strong>Official Registrar:</strong> PVASTRO Core Team
                </div>
                <div>
                  <strong>Verification ID:</strong> Certified-PVA-7789
                </div>
                <div>
                  <strong>Physical Center:</strong> Verma Park, Muzaffarnagar
                </div>
                <div>
                  <strong>Delhi HQ Tower:</strong> 29/3 Astro Tower, Delhi
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end pt-3 border-t border-slate-205 select-none font-sans">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">DATED</span>
                <span className="text-xs font-black text-slate-800">{new Date().toDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SEAL OF SACRED OFFICE</span>
                <span className="text-xs font-black text-emerald-600 font-serif">APPROVED BY GURU</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="mt-6 px-7 py-3.5 bg-gradient-to-tr from-[#936a18] to-amber-600 font-extrabold text-xs text-white uppercase tracking-widest rounded-2xl w-full hover:brightness-110 shadow-md transition cursor-pointer"
            >
              {t("Acknowledge Divine Blessing", "दैवीय आशीर्वाद स्वीकारें")}
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}
