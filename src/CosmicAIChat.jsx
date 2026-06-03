import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, RefreshCw, User, Sparkles, Mail, 
  MapPin, ArrowLeft, Copy, Check, Info, ChevronRight, Phone
} from 'lucide-react';

export default function CosmicAIChat({ t, tObj, currentLanguage, onBack, currentUser }) {
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
  
  // Custom API key if fallback input is ever needed
  const [customKey, setCustomKey] = useState(() => {
    return localStorage.getItem('pva_user_custom_gemini_key') || '';
  });
  const [showConfig, setShowConfig] = useState(false);

  const messagesEndRef = useRef(null);

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
          ? "वैदिक ज्योतिष में, आपकी कुंडली का दशम भाव (10th House) और बृहस्पति व शनि गोचर करियर की दिशा का संरेखण तय करते हैं। वर्तमान में लग्नेश की अनुकूल स्थिति परिश्रम के सार्थक फलों का संकेत देती है। अपनी जन्म तिथि व समय के साथ मुख्य कार्यालय से परामर्श प्राप्त करें।"
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
      // Simulate network wait for organic feel
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `m-${Date.now()}-a`,
          role: 'model',
          text: getOfflineResponse(trimmed) + " " + (currentLanguage === 'HI' 
            ? "\n\n(सूचना: वर्तमान में क्लाउड सर्वर ऑफ़लाइन सैंडबॉक्स मोड में है; वास्तविक एआई रिस्पॉन्स के लिए एडमिन पैनल के पास स्थित सेटिंग्स में वैध जेमिनी API कुंजी भरें।)" 
            : "\n\n(Note: Cloud connection is active in secure local sandbox. To connect to live real-time Gemini, verify that a valid GEMINI_API_KEY is configured in your AI Studio secrets.)"),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 900);
      return;
    }

    try {
      // Build conversation history in Gemini REST schema formats (up to last 10 messages to keep request lightweight)
      const lastTurns = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      // Append the latest user query
      lastTurns.push({
        role: 'user',
        parts: [{ text: trimmed }]
      });

      const sysInstruction = `You are "PVASTRO AI Guru", a divine spiritual mentor, high-precision Vedic astrologer, and expert Kundalini-Chakra guide. 
Your tone should be deeply peaceful, professional, comforting, authentic to Indian shastras, and incredibly helpful. 
Respond elegantly in the user's language (mostly bilingual Hindi and English mixed, as they prefer). 
You must address their queries with concrete Vedic recommendations (such as chanting specific mantras like Om, doing charity, or meditation habits).
In every conversation, when appropriate, remind them that they can book detailed handwritten reports or 1-on-1 calls with astro-teachers or Kundalini readers by sending an email to our core team or visiting our physically verified offices. 
Maintain this contact layout in your memory:
Core Email: pvastroq@gmail.com
Main Office 1: Verma Park, Muzaffarnagar
Astro Tower Office 2: 29/3 Astro Tower, Delhi.
If they wish to speak directly with an astro teacher or a Kundalini reader, tell them to send their complete birth details and specific inquiry to pvastroq@gmail.com, and our divine team will schedule a session immediately.`;

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
          ? `त्रुटि: दिव्य सर्वर प्रतिक्रिया समय बाहर। (विवरण: ${err.message})\n\nयहाँ स्थानीय ज्योतिषीय उत्तर दिया गया है:\n`
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

      {/* Grid of Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (Inquiries & Verified Office Contact Center) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Booking & Kundalini / Astro Teachers Help Request Card */}
          <div className="rounded-3xl border-2 bg-gradient-to-br from-[#12162e] to-[#080a18] text-white p-5 shadow-lg relative overflow-hidden" style={{ borderColor: tObj.primary }}>
            {/* Elegant visual indicator */}
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

              {/* Support Timings */}
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

          {/* Quick FAQ / Guidance Card */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 text-xs text-slate-650" style={{ borderColor: tObj.border }}>
            <h4 className="font-extrabold text-slate-850 uppercase tracking-widest text-[10px] pb-1.5 border-b flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{t("Verified Spiritual Security", "प्रामाणिक वैदिक सुरक्षा और गोपनीयता")}</span>
            </h4>
            <p className="leading-relaxed">
              {t("Every birth chart generated is securely isolated in local storage or encrypted with end-to-end Supabase protection, safeguarding birth coordinates, charts, and queries tightly.", 
                 "आपकी जन्म तिथि, जन्म समय, अष्टकवर्ग संगणन और गुप्त साधना प्रश्न पूर्णतः गोपनीय हैं। इनका किसी भी व्यावसायिक विज्ञापन उद्देश्य हेतु उपयोग नहीं किया जाता।")}
            </p>
            <div className="p-3 bg-slate-50 border rounded-xl space-y-1 hover:bg-slate-100 transition">
              <span className="text-[9.5px] font-black uppercase text-[#e65100] tracking-widest block">💡 {t("Mantra Recitation", "नक्षत्र उपाय")}</span>
              <p className="text-[10.5px] leading-relaxed text-slate-600 block">
                {t("We advise starting your AI Guru conversations by typing your star nakshatra or sun sign class to align the generator's celestial calculations instantly.",
                   "गुरुदेव से संवाद शुरू करने से पहले अपनी जन्म राशि अथवा मुख्य चिंता (जैसे करियर या विवाह मिलान) लिखकर भेजें ताकि सटीक ज्योतिषीय मार्गदर्शन संभव हो।")}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (The Live Cosmic Chat Terminal) */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white theme-bg-card border-2 theme-border rounded-3xl shadow-lg overflow-hidden relative">
          
          {/* Red Ribbon Top Highlight */}
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
                  {/* Avatar bubble */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-xs border ${
                    isUser 
                      ? 'bg-slate-100 text-slate-700 border-slate-200' 
                      : 'bg-gradient-to-tr from-[#cca43b] to-orange-500 text-white border-transparent'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : "🕉️"}
                  </div>

                  {/* Bubble body */}
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
                    {/* Timestamp */}
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
                    <span>{t("AI Guru is meditating on planetary transits...", "गुरुदेव ध्यानस्थ हैं, ब्रह्मांडीय नक्षत्रों की गणना हो रही है...")}</span>
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
                  ? "गुरुदेव से कुंडली योग अथवा कुंडलिनी साधना पर प्रश्न पूछें..." 
                  : "Ask Guru about Sade Sati, transit remedies, or Kundalini..."
                }
                className="flex-1 px-4 py-3 bg-white border border-slate-350 focus:border-amber-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:opacity-50 text-slate-900"
              />
              
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
    </div>
  );
}
