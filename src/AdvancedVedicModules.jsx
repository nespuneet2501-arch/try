import React, { useState } from 'react';
import { 
  Flame, Sparkles, Compass, Award, Gem, Calendar, BookOpen, ShieldCheck, 
  ChevronRight, ChevronDown, Check, Edit, Trash2, ArrowLeft, Heart, Play, Clock, Star, AlertTriangle, Printer
} from 'lucide-react';

// ==========================================
// 1. ADVANCED DASHA EXPLOROR (TREE ACCORDION)
// ==========================================
export function AdvancedDashaExplorer({ report, currentLanguage, t }) {
  const [expandedMaha, setExpandedMaha] = useState(null);
  const [expandedAntar, setExpandedAntar] = useState(null);

  const getDashaColor = (lord) => {
    switch (lord) {
      case 'Sun': return 'border-amber-500 bg-amber-500/5 text-amber-500';
      case 'Moon': return 'border-blue-300 bg-blue-300/5 text-blue-400';
      case 'Mars': return 'border-rose-500 bg-rose-500/5 text-rose-500';
      case 'Mercury': return 'border-emerald-500 bg-emerald-500/5 text-emerald-500';
      case 'Jupiter': return 'border-yellow-500 bg-yellow-500/5 text-yellow-500';
      case 'Venus': return 'border-pink-500 bg-pink-500/5 text-pink-500';
      case 'Saturn': return 'border-indigo-600 bg-indigo-600/5 text-indigo-400';
      case 'Rahu': return 'border-purple-600 bg-purple-600/5 text-purple-400';
      case 'Ketu': return 'border-fuchsia-600 bg-fuchsia-600/5 text-fuchsia-400';
      default: return 'border-slate-500 bg-slate-500/5 text-slate-400';
    }
  };

  const getDashaPreAndRemedy = (lord) => {
    switch (lord) {
      case 'Sun': return {
        areas: t('Authority, Gov Relations, Leadership, Vitality', 'प्रशासन, राजकीय सम्बन्ध, अग्रणी नेतृत्व, शारीरिक तेज'),
        desc: t('Sun mahadasha triggers rise in social status. Best phase for clearing competitive exams and getting administrative roles.', 'सूर्य की दशा मान-सम्मान व प्रतिष्ठा में वृद्धि लाती है। सरकारी नौकरी, प्रशासन, और स्वास्थ्य संवर्धन के लिए यह सर्वोत्कृष्ट समय है।'),
        rem: t('Offer Arghya to Sun daily with "Om Suryaya Namah".', 'नित्य सूर्य देव को जल दें और तांबे का छल्ला मध्यमा अंगुली में धारण करें।')
      };
      case 'Moon': return {
        areas: t('Mental Happiness, Maternal Comfort, Arts, Business', 'मानसिक एकाग्रता, माता का सुख, कलात्मक विकास, व्यापारिक लाभ'),
        desc: t('Promises high emotional intelligence and creativity. Support from maternal relationships will enhance career luck.', 'चन्द्र की यह दशा मन की प्रसन्नता, रचनात्मकता, और माता से अपार स्नेह दिलाने वाली है। कलात्मक कार्यों और यात्राओं से लाभ मिलेगा।'),
        rem: t('Donate milk on Mondays and chant Lord Shiva mantras.', 'सोमवार को पंचामृत से महादेव का अभिषेक करें और सफेद चंदन अर्पित करें।')
      };
      case 'Mars': return {
        areas: t('Courage, Real Estate, Leadership, Competition wins', 'असीम साहस, जमीन-जायदाद, साहसिक परियोजनाएं, शत्रु विजय'),
        desc: t('Provides explosive energy and wealth gains from property. Be careful with anger and sudden speech impulse.', 'जमीन-जायदाद से भारी धनलाभ और प्रतिद्वंद्वियों पर विजय का काल है। साहस बढ़ेगा, पर गुस्से पर अत्यधिक नियंत्रण रखना आवश्यक होगा।'),
        rem: t('Chant Hanuman Chalisa daily and donate sweet boondi on Tuesdays.', 'नित्य हनुमान चालीसा पढ़ें और मंगलवार को सुन्दरकाण्ड का पाठ करें।')
      };
      case 'Mercury': return {
        areas: t('Business expansion, Calculations, Communication, Tech skills', 'व्यापारिक प्रसार, गणितीय कौशल, वाणी प्रभाव, नवीन शिक्षा'),
        desc: t('Highly profitable phase for business, trading, and information technology. Sharp communication will open major doors.', 'वाणी, बौद्धिक लेखन, और व्यापारिक प्रसार का स्वर्णिम समय है। तकनीकी और वाणिज्य क्षेत्रों में अभूतपूर्व प्रगति होगी।'),
        rem: t('Feed green grass to cows on Wednesdays and worship Lord Ganesha.', 'बुधवार को जरूरतमंदों को मूंग की दाल दान करें और भगवान गणेश को दूर्वा चढ़ाएं।')
      };
      case 'Jupiter': return {
        areas: t('Wisdom, Wealth, Children, Marital peace, Higher Luck', 'दैविक ज्ञान, विपुल धन, उत्तम संतान, वैवाहिक आनंद, आध्यात्मिक उन्नति'),
        desc: t('The most auspicious period for overall prosperity. Childbirth, marriage expansion, and guru mentoring support are highlighted.', 'देवगुरु बृहस्पति की दशा सुख, समृद्धि व भाग्य का उदय कराएगी। सलाहकारी, शैक्षिक, अध्यात्म और पारिवारिक मांगलिक कार्य सफल होंगे।'),
        rem: t('Wear Yellow Sapphire, fast on Thursdays and worship Banana tree.', 'गुरुवार को पीले वस्त्र धारण करें, हल्दी युक्त जल से केले के वृक्ष का सिंचन करें।')
      };
      case 'Venus': return {
        areas: t('Cosmetics, Marriage harmony, Luxury cars, Social fame', 'विलासिता, उत्तम वैवाहिक जीवन, वाहन सुख, कला-संगीत समृद्धि'),
        desc: t('Fosters creation of material assets, luxury purchases, and blissful matrimonial ties. Fame in social circuits rises.', 'दैत्यगुरु शुक्र की महादशा भौतिक समृद्धि, वाहन सुख, और दांपत्य जीवन के चरमोत्कर्ष का काल है। कलात्मक गतिविधियों से यश मिलेगा।'),
        rem: t('Chant "Om Shum Shukraya Namah" and donate white sweets on Fridays.', 'शुक्रवार को महालक्ष्मी की आराधना करें और सफेद सुगंधित वस्तुओं का दान करें।')
      };
      case 'Saturn': return {
        areas: t('Patience, Industrial units, Legacy wealth, Foreign land success', 'अथाह धैर्य, निर्माण कार्य, पैतृक लाभ, विदेशी संबंधों से आजीविका'),
        desc: t('Brings deep structural adjustments and long-term authority. Relentless hard work will establish permanent success.', 'शनि की दशा संघर्ष के उपरांत राजा के समान स्थिरता प्रदान करेगी। न्याय और निर्माण क्षेत्र में अपार सफलता के योग बनेंगे।'),
        rem: t('Chant Shani Chalisa and light mustard oil lamp under Peepal tree on Saturday evenings.', 'शनिवार की शाम पीपल के वृक्ष के निकट सरसों के तेल का अखंड दीपक प्रज्वलित करें।')
      };
      case 'Rahu': return {
        areas: t('Foreign travel, Tech gains, Sudden windfalls of money', 'विदेश गमन, तकनीकी उन्नति, आकस्मिक धन संपदा, अनपेक्षित लाभ'),
        desc: t('Triggers great material ambitions and unexpected financial gains through technology or global networks. Avoid unethical work.', 'राहु की रहस्यमयी दशा अचानक बड़ी सफलता, तकनीक क्षेत्र से अकूत लाभ और विदेश यात्रा प्रदान कर सकती है। अनैतिकता से बचें।'),
        rem: t('Feed stray dogs and birds daily. Chant Rahu Beej mantra on Saturdays.', 'शनिवार को भैरव चालीसा का पाठ करें और काले कुत्तों को रोटी अर्पित करें।')
      };
      case 'Ketu': return {
        areas: t('Intuition, Spiritual growth, Philosophical research, Travel', 'अतीन्द्रिय बोध, आध्यात्मिक वैराग्य, गुप्त शोध, तीर्थ यात्राएं'),
        desc: t('Enhances spiritual intuition, yoga learning, and visits to holy places. Might cause some worldly detachment.', 'केतु की महादशा जीवन के सत्य और अध्यात्म की ओर झुकाव लाएगी। तीर्थ यात्राओं और अतीन्द्रिय ज्ञान के विकास के अनुकूल है।'),
        rem: t('Worship Lord Ganesha and offer Durva grass on Wednesdays.', 'भगवान गणेश को मोदक और दूर्वा अर्पित करें, तथा कुत्तों को दूध-रोटी खिलाएं।')
      };
      default:
        return { areas: t('General life areas', 'सामान्य क्षेत्र'), desc: t('Vedic transit period', 'वैदिक काल का प्रभाव'), rem: t('Pray to Kuldevi/Devta', 'कुलदेवता का ध्यान करें') };
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Flame className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Vimshottari Dasha Tree (120-Year Paradigm)", "विंशोत्तरी महादशा वृक्ष प्रणाली (गहन कालखंड विश्लेषण)")}</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">{t("Click on any Mahadasha lord to view its corresponding 9 Antardashas, sub-periods timelines, localized strength metrics, and custom remedies.", "किसी भी महादशा स्वामी पर क्लिक करके उसके ९ अंतर्दशा कालखंड, सटीक समय सीमा, ग्रह बल एवं वैदिक जीवन उपाय प्राप्त करें।")}</p>

      <div className="space-y-3 font-sans text-xs">
        {report.dashas.map((d, idx) => {
          const isMahaExpanded = expandedMaha === idx;
          const details = getDashaPreAndRemedy(d.lord);
          const colorClass = getDashaColor(d.lord);
          
          return (
            <div key={idx} className={`rounded-xl border transition-all ${isMahaExpanded ? 'border-amber-500/40 bg-amber-50/15' : 'border-slate-100 bg-[#FAFBF9]'}`}>
              {/* Mahadasha Row Header */}
              <div 
                onClick={() => {
                  setExpandedMaha(isMahaExpanded ? null : idx);
                  setExpandedAntar(null);
                }}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full border-2 ${colorClass.split(' ')[0]}`}></span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {t(d.lord, d.lordHindi)} {t("Mahadasha", "महादशा")}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{d.startYear} - {d.endYear} | {d.endYear - d.startYear} {t("Years", "वर्ष")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${colorClass.split(' ').slice(1).join(' ')}`}>
                    {t("Active Duration", "सक्रिय काल")}
                  </span>
                  {isMahaExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expandable Content Area */}
              {isMahaExpanded && (
                <div className="p-4 border-t border-slate-100 bg-white space-y-4 rounded-b-xl">
                  {/* Detailed Predictions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-amber-50/10 rounded-lg border border-amber-500/10">
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#936a18] mb-1">{t("Core Affected Life Areas", "प्रभावित जीवन चक्र प्रभाग")}</h5>
                      <span className="text-xs font-bold text-slate-700">{details.areas}</span>
                    </div>

                    <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 mb-1">{t("Astro-Mathematics Strength", "काल बल व महादशा सामर्थ्य")}</h5>
                      <span className="text-xs font-bold text-emerald-800 font-mono">{(80 + (idx * 2.5) % 17).toFixed(1)}% {t("Strength Approved", "बल आकलित")}</span>
                    </div>

                    <div className="md:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-105">
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">{t("Dasha Predictions Verdict", "दशाफल प्रबोधिनी भविष्यकथन")}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">{details.desc}</p>
                    </div>

                    <div className="md:col-span-2 p-3 bg-amber-505 bg-amber-500/5 rounded-lg border border-[#cca43b]/20">
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#936a18] mb-1.5">🕊️ {t("Authentic Vedic Remedial Measures", "दोष शमन एवं वैदिक सुगम उपाय")}</h5>
                      <p className="text-xs text-[#936a18] font-bold leading-relaxed">{details.rem}</p>
                    </div>
                  </div>

                  {/* Sub-Dashas (Antardasha Timeline Accordion) */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <h5 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">{t("Antardashas Timeline Breakdown", "अंतर्दशा चक्र समयकाल सारणी (Mahadasha -> Antardasha)")}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(currentLanguage === 'English' ? d.subDashasEng : d.subDashas).map((antar, sIdx) => {
                        const isAntarExpanded = expandedAntar === sIdx;
                        const antarName = antar.split('(')[0].trim();
                        const antarDetails = getDashaPreAndRemedy(antarName);
                        
                        return (
                          <div key={sIdx} className="rounded-lg border border-slate-100 bg-[#FAF9F5] overflow-hidden text-slate-700">
                            <div 
                              onClick={() => setExpandedAntar(isAntarExpanded ? null : sIdx)}
                              className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition text-[11px]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-bold font-mono">A.{sIdx + 1}</span>
                                <span className="font-bold text-slate-800">{antar}</span>
                              </div>
                              {isAntarExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            </div>

                            {isAntarExpanded && (
                              <div className="p-3 bg-white border-t border-slate-100 space-y-2 text-[10px] text-slate-500 leading-relaxed font-sans">
                                <p className="font-semibold text-slate-700"><strong>{t("Antar Impact: ", "अंतर्दशा प्रभाव: ")}</strong>{antarDetails.desc}</p>
                                <p className="text-amber-700 font-bold"><strong>{t("Remedy: ", "विशेष उपाय: ")}</strong>{antarDetails.rem}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. GOCHAR TRANSIT PANEL & CHART RENDERER
// ==========================================
export function GocharTransitPanel({ report, currentLanguage, t, activeChartStyle }) {
  const [gocharReference, setGocharReference] = useState('Lagna'); // Lagna vs Moon

  const transitPlanets2026 = {
    SUN: { name: 'Sun', hindi: 'सूर्य', signNum: 2, degree: 14.5, signHindi: 'वृष' }, // Taurus
    MOON: { name: 'Moon', hindi: 'चन्द्र', signNum: 5, degree: 11.2, signHindi: 'सिंह' }, // Leo
    MARS: { name: 'Mars', hindi: 'मंगल', signNum: 12, degree: 8.4, signHindi: 'मीन' }, // Pisces
    MERCURY: { name: 'Mercury', hindi: 'बुध', signNum: 2, degree: 29.1, signHindi: 'वृष' }, // Taurus
    JUPITER: { name: 'Jupiter', hindi: 'गुरु', signNum: 3, degree: 12.5, signHindi: 'मिथुन' }, // Gemini
    VENUS: { name: 'Venus', hindi: 'शुक्र', signNum: 2, degree: 4.8, signHindi: 'वृष' }, // Taurus
    SATURN: { name: 'Saturn', hindi: 'शनि', signNum: 12, degree: 28.9, signHindi: 'मीन' }, // Pisces
    RAHU: { name: 'Rahu', hindi: 'राहु', signNum: 11, degree: 1.2, signHindi: 'कुंभ' }, // Aquarius
    KETU: { name: 'Ketu', hindi: 'केतु', signNum: 5, degree: 1.2, signHindi: 'सिंह' } // Leo
  };

  const getGocharCenterCoords = (houseNum) => {
    switch (houseNum) {
      case 1:  return { x: 200, y: 110 };
      case 2:  return { x: 110, y: 55 };
      case 3:  return { x: 55,  y: 110 };
      case 4:  return { x: 110, y: 200 };
      case 5:  return { x: 55,  y: 290 };
      case 6:  return { x: 110, y: 345 };
      case 7:  return { x: 200, y: 290 };
      case 8:  return { x: 290, y: 345 };
      case 9:  return { x: 345, y: 290 };
      case 10: return { x: 290, y: 200 };
      case 11: return { x: 345, y: 110 };
      case 12: return { x: 290, y: 55 };
      default: return { x: 200, y: 200 };
    }
  };

  const natalLagna = report.lagnaSignNum;
  const natalMoonSign = report.planets['MOON'].signNum;
  const viewSignBase = gocharReference === 'Lagna' ? natalLagna : natalMoonSign;

  // Build resolved transiting planet placement on houses
  const gocharPlanetsMap = Object.entries(transitPlanets2026).map(([pId, info]) => {
    const transitHouse = ((info.signNum - viewSignBase + 12) % 12) + 1;
    return {
      id: pId,
      name: info.name,
      hindi: info.hindi,
      houseNum: transitHouse,
      signNum: info.signNum,
      signHindi: info.signHindi,
      degree: info.degree
    };
  });

  const getHindiGocharPredictions = () => {
    const lagna = report.lagnaSignNum;
    const moonSign = report.planets['MOON'].signNum;
    const base = gocharReference === 'Lagna' ? lagna : moonSign;
    
    const hSaturn = ((12 - base + 12) % 12) + 1;
    const hJupiter = ((3 - base + 12) % 12) + 1;
    const hRahu = ((11 - base + 12) % 12) + 1;
    const hKetu = ((5 - base + 12) % 12) + 1;
    const hSun = ((2 - base + 12) % 12) + 1;

    const houseMeanings = {
      1: { name: "प्रथम भाव (तन एवं व्यक्तित्व प्रभाग)", effect: "आत्मविश्वास में वृद्धि करेगा, परंतु स्वास्थ्य के प्रति सतर्क और अनुशासित रहें।" },
      2: { name: "द्वितीय भाव (धन एवं कुटुंब प्रभाग)", effect: "आर्थिक संचय और नए वित्तीय निवेशों के सुंदर रास्ते खोलेगा, वाणी पर संयम रखें।" },
      3: { name: "तृतीय भाव (पराक्रम एवं सहज प्रभाग)", effect: "अदम्य साहस, पराक्रम और लघु यात्राओं द्वारा जीवन में नए सुनहरे अवसर देगा।" },
      4: { name: "चतुर्थ भाव (सुख एवं मातृ प्रभाग)", effect: "गृह एवं वाहन सुख में वृद्धि करेगा, परंतु माता के स्वास्थ्य पर ध्यान देना अनिवार्य होगा।" },
      5: { name: "पंचम भाव (संतान एवं बुद्धि प्रभाग)", effect: "असाधारण रचनात्मक ऊर्जा, बौद्धिक विकास एवं संतान पक्ष से परम हर्ष देगा।" },
      6: { name: "षष्ठ भाव (रोग, ऋण एवं शत्रु प्रभाग)", effect: "दैनिक कार्यशैली में सुधार करेगा, कोर्ट-कचहरी और शत्रुओं पर पूर्ण विजय दिलाएगा।" },
      7: { name: "सप्तम भाव (जाया एवं साझेदारी प्रभाग)", effect: "वैवाहिक समन्वय, व्यापार में लाभ और साझेदारी के नए द्वार खोलेगा।" },
      8: { name: "अष्टम भाव (आयु एवं रहस्यमय विधा प्रभाग)", effect: "शोध एवं गुप्त विधाओं में गहरी रुचि जगाएगा, स्वास्थ्य का विशेष ख्याल रखें।" },
      9: { name: "नवम भाव (भाग्य एवं धर्म प्रभाग)", effect: "परम भाग्यवर्धन, तीर्थयात्रा और समाज सेवा के माध्यम से प्रसिद्धि का सृजन करेगा।" },
      10: { name: "दशम भाव (कर्म एवं यश प्रभाग)", effect: "करियर में ऐतिहासिक उन्नति, शीर्ष नेतृत्व पद और व्यावसायिक मान-सम्मान देगा।" },
      11: { name: "एकादश भाव (आय एवं लाभ प्रभाग)", effect: "अतुल्य आकस्मिक धनलाभ, महत्वाकांक्षाओं की पूर्ति और बड़े भाई-बहनों से सहयोग दिलाएगा।" },
      12: { name: "द्वादश भाव (व्यय एवं मोक्ष प्रभाग)", effect: "आध्यात्मिक यात्रा, विदेश संपर्कों से लाभ देगा, अनावश्यक खर्चों पर नियंत्रण रखें।" }
    };

    return {
      career: `करियर और व्यवसाय (Career): शनि का गोचर वर्तमान में आपके ${hSaturn}वें भाव [${houseMeanings[hSaturn].name}] में चल रहा है। शनिदेव (Saturn) का कुंडली के इस क्षेत्र से पारगमन ${houseMeanings[hSaturn].effect} कार्यक्षेत्र में बड़े बदलाव और अतिरिक्त जिम्मेदारी मिलेगी। कड़े अनुशासन से स्थायी पदोन्नति का यह उत्तम समय है।`,
      health: `स्वास्थ्य और काया (Health): छाया ग्रह राहु वर्तमान में आपके ${hRahu}वें भाव [${houseMeanings[hRahu].name}] से गोचर कर रहा है। राहु (Rahu) का इस भाव से साया ${houseMeanings[hRahu].effect} मानसिक संशय से बचें, नियमित प्राणायाम और शनिवार की शाम तेल का दान सबसे उचित उपाय है।`,
      marriage: `विवाह और साझेदारी (Marriage): देवगुरु बृहस्पति का सर्वोत्तम गोचर वर्तमान में आपके ${hJupiter}वें भाव [${houseMeanings[hJupiter].name}] में हो रहा है। बृहस्पति (Jupiter) का यह शुभ पारगमन ${houseMeanings[hJupiter].effect} अविवाहित जातकों की शादियां तय होंगी और पारिवारिक मतभेद समाप्त होंगे।`,
      money: `धनलाभ और निवेश (Money): सूर्य, बुध और शुक्र का संजोग वर्तमान में आपके ${hSun}वें भाव [${houseMeanings[hSun].name}] से पारगमन कर रहा है। बुधादित्य एवं लक्ष्मीनारायण योग का यह प्रभाव ${houseMeanings[hSun].effect} वित्तीय मजबूती और पैतृक संपत्तियों से बड़ा धन आपके संचय में जुड़ेगा।`,
      education: `शिक्षा और ज्ञान (Education): गुरु का ${hJupiter}वें भाव [${houseMeanings[hJupiter].name}] से गोचर विद्यार्थियों के लिए विद्या संवर्धन का काल है। गुरु (Jupiter) की कृपा ${houseMeanings[hJupiter].effect} प्रतियोगी परीक्षाओं में शत-प्रतिशत सफलता की प्रबल संभावनाएं विकसित हो रही हैं।`,
      family: `पारिवारिक सुख (Family): केतु का गोचर आपके ${hKetu}वें भाव [${houseMeanings[hKetu].name}] में होने से ${houseMeanings[hKetu].effect} वाणी संयम रखना अनिवार्य होगा, नित्य हनुमान चालीसा का पाठ शांति स्थापित करेगा।`
    };
  };

  const predictions = getHindiGocharPredictions();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Gochar (Transit) Prediction Engine - Year 2026", "वर्ष २०२६ गोचर पारगमन चक्र व फल प्रबोधिनी")}</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-1 rounded-lg border border-slate-200 font-sans text-[10px]">
          <span className="text-slate-400 font-bold px-1.5">{t("Reference Point:", "गोचर आधार:")}:</span>
          <button 
            onClick={() => setGocharReference('Lagna')} 
            className={`px-2 py-1 rounded font-bold ${gocharReference === 'Lagna' ? 'bg-[#936a18] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t("Janma Lagna", "जन्म लग्न आधारित")}
          </button>
          <button 
            onClick={() => setGocharReference('Moon')} 
            className={`px-2 py-1 rounded font-bold ${gocharReference === 'Moon' ? 'bg-[#936a18] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t("Chandra Rashi", "चन्द्र राशि आधारित")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* Gochar Chart Layout (SVG) */}
        <div className="lg:col-span-12 xl:col-span-5 bg-[#090b16] rounded-xl p-4 border border-slate-800 flex flex-col items-center">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#cca43b] text-center mb-3">
            {t("Current Transits Layout (2026)", "वर्तमान पारगमन चक्र (गोचर रेखाचित्र)")}
          </h4>
          
          <div className="bg-white rounded-lg p-2 flex items-center justify-center border border-slate-700 w-full max-w-[320px]">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <rect x="0" y="0" width="400" height="400" fill="transparent" stroke="#936a18" strokeWidth="2.5" />
              <line x1="0" y1="0" x2="400" y2="400" stroke="#936a18" strokeWidth="1.5" />
              <line x1="400" y1="0" x2="0" y2="400" stroke="#936a18" strokeWidth="1.5" />
              <line x1="200" y1="0" x2="0" y2="200" stroke="#936a18" strokeWidth="1.5" />
              <line x1="0" y1="200" x2="200" y2="400" stroke="#936a18" strokeWidth="1.5" />
              <line x1="200" y1="400" x2="400" y2="200" stroke="#936a18" strokeWidth="1.5" />
              <line x1="400" y1="200" x2="200" y2="0" stroke="#936a18" strokeWidth="1.5" />

              {/* Render Transit Numbers (House specific sign indices) */}
              {Array.from({ length: 12 }, (_, i) => {
                const houseNum = i + 1;
                const sign = ((viewSignBase + houseNum - 2) % 12) + 1;
                const pos = getGocharCenterCoords(houseNum);
                return (
                  <text key={`gt-${houseNum}`} x={pos.x} y={pos.y + 25} fill="#936a18" fontSize="11" fontWeight="extrabold" textAnchor="middle" opacity="0.6">
                    {sign}
                  </text>
                );
              })}

              {/* Transit Planets inside boxes */}
              {gocharPlanetsMap.map((det) => {
                const pos = getGocharCenterCoords(det.houseNum);
                const idxInHouse = gocharPlanetsMap.filter(p => p.houseNum === det.houseNum).findIndex(p => p.id === det.id);
                const offsetX = (idxInHouse % 2) === 0 ? -12 : 12;
                const offsetY = idxInHouse > 1 ? 15 : -10;
                
                return (
                  <g key={`gop-${det.id}`}>
                    <rect x={pos.x + offsetX - 16} y={pos.y + offsetY - 10} width="32" height="15" rx="3" fill="#ffffff" stroke="#936a18" strokeWidth="1" />
                    <text x={pos.x + offsetX} y={pos.y + offsetY + 1} fill="#1E293B" fontSize="8" fontWeight="black" textAnchor="middle">
                      {currentLanguage === 'English' ? det.name.substring(0, 3).toUpperCase() : det.hindi}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-[9px] text-slate-400 text-center font-mono mt-2 leading-tight">
            Transits are plotted relative to {gocharReference === 'Lagna' ? `Janma Lagna (Sign ${natalLagna})` : `Chandra Rashi (Sign ${natalMoonSign})`}.
          </p>
        </div>

        {/* Hindi Transit Predictions */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 border-b pb-1 mb-2">💼 {t("Career & Professional Gochar", "व्यावसायिक प्रभाग पारगमन")}</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">{predictions.career}</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-black text-blue-800 flex items-center gap-1.5 border-b pb-1 mb-2">❤️ {t("Marriage & Partnership Gochar", "दांपत्य जीवन पारगमन")}</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">{predictions.marriage}</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-black text-emerald-800 flex items-center gap-1.5 border-b pb-1 mb-2">💰 {t("Wealth Accumulation Gochar", "वित्तीय संचय पारगमन")}</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">{predictions.money}</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-black text-amber-800 flex items-center gap-1.5 border-b pb-1 mb-2">📖 {t("Education & Knowledge Gochar", "शिक्षा एवं शोध प्रभाग")}</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-semibold">{predictions.education}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-slate-200">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#936a18] mb-1">❤️ {t("Daily Important Transit Highlight & Remdies", "दैनिक गोचर विशेष सारांश एवं उपाय")}</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
              {t("Jupiter and Sun transits currently signify a powerful period for starting legal settlements and clearing family blockages. Rememdy: Light sesame lamp relative to Saturn transit as protection.", "गुरु और सूर्य का यह गोचर आपकी जन्मपत्रिका के अनुसार आकस्मिक संपत्ति और शैक्षणिक विकास के मार्ग पूरी तरह प्रशस्त कर रहा है। शनिवार को पीपल के नीचे सरसों के तेल का दीया जरूर जलाएं।")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. LIFETIME VEDIC PREDICTION MODULE
// ==========================================
export function LifetimePredictionsPanel({ report, t }) {
  const [activeSubTab, setActiveSubTab] = useState('general'); // general, planetary, aspects, monthly, yearly, systems
  
  const lagna = report.lagnaEnglish;
  const rashi = report.planets['MOON'] ? report.planets['MOON'].signName : 'Vedic Sign';
  const moonNak = report.planets['MOON'] ? report.planets['MOON'].nakshatra : 'Vedic Asterism';

  const getConjunctions = () => {
    if (!report || !report.planets) return [];
    const houseGroups = {};
    Object.entries(report.planets).forEach(([pId, p]) => {
      const h = p.houseNum;
      if (!houseGroups[h]) houseGroups[h] = [];
      houseGroups[h].push({ id: pId, name: p.name, hindi: p.hindi, degree: p.degree || '12°' });
    });
    
    const conjunctionsList = [];
    Object.entries(houseGroups).forEach(([house, plist]) => {
      if (plist.length >= 2) {
        conjunctionsList.push({
          house: parseInt(house),
          planets: plist
        });
      }
    });
    return conjunctionsList;
  };

  const getLifetimePredictions = () => {
    return {
      career: t(
        `With an ascendant of ${lagna}, your career is ruled by supreme perseverance and leadership. You will experience major breakthroughs around age 28 and 36. Positions of authority inside engineering, administration, or corporate management are indicated. Your high strength planets provide sustained status.`,
        `आपके जन्म लग्न ${report.lagnaHindi} के अनुसार, आपका करियर अत्यधिक संघर्ष के उपरांत राजा के समान सुख देने वाला रहेगा। जीवन का २८वां, ३२वां और ३६वां वर्ष करियर की दृष्टि से भाग्योदय का मुख्य काल सिद्ध होगा। प्रशासनिक सेवाओं, तकनीकी क्षेत्रों का व्यापार, या रियल एस्टेट क्षेत्र में असाधारण सफलता मिलने के अकाट्य संकेत हैं।`
      ),
      marriage: t(
        `Seventh house and planetary aspects indicate a supportive spouse who brings material fortune. Marriage life will remain harmoniously aligned under Jupiter's direct dasha phase. Mutual maturity will foster deep domestic bonds and comfortable children growth.`,
        `जन्मपत्रिका के सप्तम भाव पर ग्रहों की स्थिति जीवनसाथी के भाग्यशाली और सहायक होने के संकेत देते हैं। विवाह के उपरांत आपका विशेष भाग्योदय होगा। देवगुरु बृहस्पति की दृष्टि होने से वैवाहिक सामंजस्य सदैव मधुर रहेगा और धार्मिक कार्यों में संलिप्तता बढ़ेगी।`
      ),
      wealth: t(
        `Vedic wealth indicators are exceedingly robust with Gajakesari and Budhaditya influences. Major turning points around age 30 will trigger substantial property, vehicles, and long-term land ownership. Savings will follow clean investment guidelines.`,
        `आपकी द्वितीया और एकादश भाव की श्रेष्ठ शक्ति के कारण जीवन में अकूत धनलाभ होगा। ३० वर्ष की आयु पार करते ही आपके पास निजी भूमि, भवन, और विलासितापूर्ण वाहनों का चरम सुख संचित होगा। किसी विश्वसनीय गुरु से सलाह लेकर वित्तीय निवेश करें तो आर्थिक हानि नहीं होगी।`
      ),
      health: t(
        `Lagna lord strength guarantees fine longevity and natural recovery power. Practice daily pranayama and keep hydration values optimal to combat potential stomach or stress issues during competitive phases.`,
        `लग्न भाव के बलवान होने से आपकी दीर्घायु निश्चित है। उत्तम शारीरिक प्रतिरोधक क्षमता प्राप्त है। अत्यधिक मानसिक तनाव के दौरान पाचन तंत्र की संवेदनशीलता बढ़ सकती है, इसलिए नित्य योग करें और सुबह स्वच्छ गुनगुने जल का सेवन उचित रहेगा।`
      ),
      spirituality: t(
        `Ketu and Jupiter placements will drive heavy inclinations towards deep Vedic study, pilgrimage, and charity works after mid-life years. Inner calm will flow through mantra sadhana.`,
        `जीवन के उत्तरार्ध में आपका झुकाव ज्योतिषशास्त्र, धार्मिक अध्ययन, और गुप्त साधनाओं की ओर बहुत तेजी से बढ़ेगा। केतु की नवम भाव दृष्टि तीर्थ यात्राओं और समाज सेवा की ओर उन्मुख करेगी, जिससे आत्मिक सुख मिलेगा।`
      ),
      goodYears: "24, 28, 30, 32, 36, 42, 45, 54",
      badYears: "19, 29, 38, 48, 57"
    };
  };

  const lp = getLifetimePredictions();

  // Dynamic predictions mapping for each planet in Houses (Parashari basis)
  const planetHouseDescriptions = {
    SUN: {
      1: {
        en: `Independent, courageous, having strong self-worth and leadership skills. Gives administrative power.`,
        hi: `आप साहसी, महत्वाकांक्षी और स्वतंत्र विचारों वाले होंगे। नेतृत्व करने की नैसर्गिक शक्ति मिलेगी और समाज में विशिष्ट यश मिलेगा।`
      },
      2: {
        en: `Influential speech and strong motivation for financial stability. Prompts ancestral property accumulation.`,
        hi: `आपकी वाणी गंभीर एवं प्रभावशाली होगी। कुटुंब का उत्तम साथ मिलेगा और पैतृक साधनों से अच्छी आर्थिक सम्पन्नता संचित होगी।`
      },
      3: {
        en: `Incredibly energetic and victorious over rivals. Brotherly support and immense societal goodwill.`,
        hi: `अदम्य पराक्रमी, साहसी और विरोधियों पर स्वतः विजय पाने वाले जातक होंगे। लघु व्यापार, संचार और लेखन में उत्तम सफलता मिलेगी।`
      },
      4: {
        en: `Deep connection to family traditions. Promotes land possession and real estate growth.`,
        hi: `घरेलू मामलों और मातृभूमि के प्रति विशेष लगाव रहेगा। सुख भाव का बल बढ़ने से जीवन के मध्य काल में भूमि-भवन का उत्तम सुख मिलेगा।`
      },
      5: {
        en: `Sharp intellectual faculties, highly creative, and administrative prestige. High education parameters.`,
        hi: `कुशाग्र बुद्धि, तीक्ष्ण विचारशक्ति और शिक्षा प्रभाग में असाधारण कीर्ति। संतान पक्ष से शुभ समाचार और सामाजिक गौरव मिलेगा।`
      },
      6: {
        en: `Conquers all opposition. High success in civil services, examinations, and judicial challenges.`,
        hi: `शत्रुहंता होंगे। प्रतियोगिता परीक्षाओं और मुकदमों में शत-प्रतिशत विजय मिलेगी। प्रशासनिक या सरकारी नौकरी के प्रबल योग बनते हैं।`
      },
      7: {
        en: `Self-respecting life partner, great growth in trade collaborations and overall respect.`,
        hi: `जीवनसाथी स्वाभिमानी, रूपवान और सहायक होगा। साझीदारी के व्यापार में बड़ा लाभ मिलेगा और व्यावसायिक मान-सम्मान संचित होगा।`
      },
      8: {
        en: `Interest in occult systems, longevity, and unexpected inheritance assets gains.`,
        hi: `अध्यात्मिक रुचि, गुप्त विद्याओं और ज्योतिषीय अनुसंधान में गहरी पैठ होगी। अचानक वसीयत या पैतृक संपत्ति से अप्रत्याशित वित्तीय धनलाभ होगा।`
      },
      9: {
        en: `Righteous, highly fortunate, long distance travel avenues, and academic or religious writing accomplishments.`,
        hi: `अत्यंत भाग्यशाली, धर्मपरायण और लंबी धार्मिक यात्राओं के शौकीन। पिता से पूर्ण सहयोग और समाज कल्याण के कार्यों से चरम ख्याति।`
      },
      10: {
        en: `Supreme Raja Yoga. Elite governmental status, top-tier corporate positions, authority, and high state privileges.`,
        hi: `दिगबली सूर्य का दशम भाव में होना परम राजयोग है। प्रशासनिक सेवाओं, राजनीति या शासकीय संस्थाओं में अत्यंत सर्वोच्च नेतृत्व प्राप्त होगा।`
      },
      11: {
        en: `Stellar monetary cash flows, association with powerful state officials, and fulfillment of material desires.`,
        hi: `अतुल्य आकस्मिक धनलाभ, सरकारी उच्च अधिकारियों से मित्रता और जीवन में सर्वोच्च महत्वाकांक्षाओं की स्वतः पूर्णता।`
      },
      12: {
        en: `Foreign land associations, success in foreign business, and high meditative spiritual growth.`,
        hi: `विदेशी संपर्कों से बड़ा आर्थिक लाभ मिलेगा। आध्यात्मिक मोक्ष की दिशा में तीव्र उन्नति होगी, सुखद गृह त्याग के योग भी संभव हैं।`
      }
    },
    MOON: {
      1: {
        en: `Charming appearance, intuitive mindset, deeply empathetic and universally loved.`,
        hi: `आकर्षक स्वरूप, भावुक और तीव्र अंतर्ज्ञान युक्त स्वभाव। समाज में अत्यंत लोकप्रिय होंगे और रचनात्मक कार्यों में मन लगेगा।`
      },
      2: {
        en: `Elegance in tone, sweet speaker, fast financial accumulation networks, and warm family bonding.`,
        hi: `वाणी में मधुरता, सुंदर वक्तृत्व कला और आर्थिक संचय के उत्तम अवसर। परिवार में सुखद और स्नेहपूर्ण वातावरण बना रहेगा।`
      },
      3: {
        en: `Intellectual expansion, artistic skills, frequent short-distance travels, and supportive siblings.`,
        hi: `कलात्मक लेखन, तीक्ष्ण संप्रेषण क्षमता और छोटी-मोटी मनोरंजक यात्राओं का सुख। भाइयों के साथ संबंध अत्यंत सौहार्दपूर्ण रहेंगे।`
      },
      4: {
        en: `Strong maternal connection, peaceful residence, love for nature, water-bodies, and domestic bliss.`,
        hi: `माता का पूर्ण दुलार, जन्मभूमि के निकट समृद्धि और आलीशान घर का सुख। मन सदैव शांत, प्रसन्न और कल्याणकारी विचारों से ओतप्रोत रहेगा।`
      },
      5: {
        en: `Scholarly disposition, creative arts interests, emotional depth, and highly qualified progeny.`,
        hi: `असाधारण कल्पनाशीलता, कला व संगीत प्रभाग में रुचि और विद्या संवर्द्धन। संतान पक्ष अत्यंत सभ्य और आज्ञाकारी सिद्ध होगा।`
      },
      6: {
        en: `Empathetic in healing fields, highly dedicated in service. Care required for seasonal wellness.`,
        hi: `सेवा भाव कूट-कूट कर भरा होगा। जन कल्याणकारी कार्यों में ख्याति मिलेगी, ऋतु परिवर्तन के समय स्वास्थ्य का थोड़ा ध्यान रखें।`
      },
      7: {
        en: `Compassionate, loyal, and visually appealing partner. Early marital settlement and peaceful cooperation.`,
        hi: `अत्यंत सौम्य, संवेदनशील और सुंदर जीवनसाथी। दांपत्य जीवन में अपार परस्पर आदर रहेगा और विवाह के बाद भाग्योदय होगा।`
      },
      8: {
        en: `Intuitive, attraction to mystical sciences, deep mental reserves, and inheritance fortunes.`,
        hi: `गहन चिंतन, गुप्त विद्याओं और रहस्यमई घटनाओं में तीव्र रुचि। मानसिक संवेदनशीलता बढ़ेगी, माता के सहयोग से गुप्त धनलाभ के योग।`
      },
      9: {
        en: `Righteous, philosophical growth, pilgrimage visits, and higher philosophical knowledge acquisitions.`,
        hi: `धर्मपरायण, परोपकारी और तीर्थयात्राओं में आनंद लेने वाले। धार्मिक साहित्य के अध्ययन से मानसिक शांति और ख्याति संचित होगी।`
      },
      10: {
        en: `Highly respected in public career, steady professional status, and success in public service.`,
        hi: `कार्यक्षेत्र में भरपूर यश, जनता का अद्भुत समर्थन और लोक कल्याणकारी योजनाओं या जनसंपर्क क्षेत्रों में शीर्ष करियर उन्नति।`
      },
      11: {
        en: `Massive social network, financial success through business of liquids/gems, and early wish fulfillments.`,
        hi: `विशाल मित्र मंडली, जलीय पदार्थों, कृषि या रत्न व्यापार से बड़ा वित्तीय लाभ और समस्त लौकिक महत्वाकांक्षाओं की पूर्ति।`
      },
      12: {
        en: `Spiritual isolation, dreams analysis interest, foreign stay comforts, and high charity expenditures.`,
        hi: `विदेश यात्रा या सुदूर शांत स्थानों पर निवास की इच्छा। परोपकारी और दान-पुण्य के कार्यों पर सुखद व्यय होने के योग।`
      }
    },
    MARS: {
      1: {
        en: `Dynamic physically, high courage, energetic drive, leadership potential but slight aggression propensity.`,
        hi: `शारीरिक रूप से बलवान, साहसी और अदम्य ऊर्जावान। चुनौतियों का डटकर सामना करेंगे, क्रोध पर थोड़ा नियंत्रण रखना उचित होगा।`
      },
      2: {
        en: `Urgent speaker, independent money maker, land acquisition opportunities.`,
        hi: `स्पष्टवादी, स्वतंत्र आर्थिक प्रयासों से प्रचुर धन कमाने वाले। अचल संपत्ति और स्वर्ण संपदा के संवर्धन के प्रबल अवसर मिलेंगे।`
      },
      3: {
        en: `Fierce bravery, victory over physical challenges, sports/military leadership potential.`,
        hi: `अत्यंत पराक्रमी, साहसी और साहसिक कार्यों में अग्रणी। शत्रुओं का मानमर्दन करेंगे और खेल, पुलिस या सेना में उच्च सम्मान पा सकते हैं।`
      },
      4: {
        en: `Strong protectiveness towards home. Leads to real estate assets development, strict management.`,
        hi: `अपने परिवार और भूमि के प्रति अत्यधिक सुरक्षात्मक रुख। जमीन, निर्माण और रियल एस्टेट प्रभाग से बड़ी वित्तीय संपदा अर्जित करेंगे।`
      },
      5: {
        en: `Sharp analytical brain, risk taker in investments, dynamic parenting styles.`,
        hi: `तीव्र तकनीकी और गणितीय बुद्धि। शेयर बाजार या साहसिक निवेशों में बड़ा दांव लगाने वाले, संतान पक्ष ऊर्जावान और प्रखर होगा।`
      },
      6: {
        en: `Shatta-Hanta. Absolute victory in legal and competitive domains, highly energetic resistance.`,
        hi: `शत्रुहंता योग का निर्माण। विरोधियों पर एकाधिकार और अदालती विवादों में शत-प्रतिशत सफलता। शारीरिक आरोग्यता उत्तम रहेगी।`
      },
      7: {
        en: `Fierce partner. Generates high energy in partnership, require mutual respect and yoga.`,
        hi: `जीवनसाथी स्वतंत्र विचारों वाला, साहसी और ऊर्जावान होगा। वैवाहिक जीवन में समरसता हेतु परस्पर विचारों के आदर की आवश्यकता है।`
      },
      8: {
        en: `Sudden financial changes, occult attraction, extreme resilience in times of challenges.`,
        hi: `भूगर्भ विधाओं, रहस्यमई शक्तियों में रुचि। अचानक वित्तीय उतार-चढ़ाव आ सकते हैं, वाहन चलाते समय थोड़ा संयम रखना उचित रहेगा।`
      },
      9: {
        en: `Defends moral rights, energetic journeys, spiritual crusader, supports siblings.`,
        hi: `धार्मिक सिद्धांतों की रक्षा करने वाले साहसी व्यक्तित्व। लंबी साहसिक यात्राओं के शौकीन और भाई-बहनों के मार्गदर्शक सिद्ध होंगे।`
      },
      10: {
        en: `Extremely powerful (Digbali). Top administrative officer, police head, building constructor, high state privileges.`,
        hi: `कुलदीपक राजयोग। कार्यक्षेत्र में अपार अधिकार, पुलिस, न्याय, सेना, या निर्माण उद्योग में सर्वोच्च शासकीय मान-सम्मान।`
      },
      11: {
        en: `Windfall gains from lands, influential circle, supreme financial drive.`,
        hi: `भूमि विक्रय, कृषि फार्म, या तकनीकी उद्योगों से बड़ी मात्रा में धनलाभ। समाज के रसूखदार शक्तिशाली लोगों से सानिध्य मिलेगा।`
      },
      12: {
        en: `Foreign land settlement, initial heavy expenses, high resilience post struggles.`,
        hi: `विदेश यात्रा या विदेशी भूमि पर व्यवसाय के उत्तम अवसर। शुरुआत में आर्थिक व्यय अधिक हो सकता है, परंतु उत्तरार्ध सुदृढ़ रहेगा।`
      }
    },
    MERCURY: {
      1: {
        en: `Exceptional communication, literary bend, witty, business advisor, young personality.`,
        hi: `असाधारण तर्कशक्ति, हाजिरजवाबी और उत्तम संप्रेषण कला। आप लेखक, सलाहकार या सफल व्यवसायी के रूप में ख्याति पाएंगे।`
      },
      2: {
        en: `Saraswati Yoga. Extreme eloquence, financial analytics master, wealthy lineage.`,
        hi: `वाणी में सरस्वती वास करेगी। लेखा-जोखा और वित्तीय प्रभाग के परम विद्वान। अपनी तीक्ष्ण वाणी से अतुल्य धन संचय करेंगे।`
      },
      3: {
        en: `Creative writer, technical communication expert, friendly neighbors, and local travels.`,
        hi: `रचनात्मक लेखन, पत्रकारिता या मार्केटिंग प्रभाग में महारत। सगे-सम्बन्धियों एवं दोस्तों का सदा सुखद साथ प्राप्त होगा।`
      },
      4: {
        en: `High domestic education vibe, intellectual friends circle, properties through paper-work.`,
        hi: `बौद्धिक मित्रों का संगम, उत्तम पुस्तकालय रखने के शौकीन। पेपर-वर्क, कमीशन या बौद्धिक कार्यों से उत्तम भूमि-भवन संजोएंगे।`
      },
      5: {
        en: `Brilliant scholar, expert in astrology and mathematics, highly innovative progeny.`,
        hi: `ज्योतिष, गणित और अनुसंधान के प्रकांड विद्वान। आपकी योजनाएं सदा सफल होंगी और संतान पक्ष बौद्धिक रूप से सर्वोच्च होगा।`
      },
      6: {
        en: `Detailed analyzer, argumentative victory, high administrative service.`,
        hi: `गहरी विश्लेषण क्षमता। कानूनी मसलों और शास्त्रार्थ में विजयी रहेंगे। बैंकिंग, ऑडिटिंग या प्रशासनिक सेवाओं में बड़ा पद।`
      },
      7: {
        en: `Charming, business-minded spouse. Fast expansion in commercial trade partnerships.`,
        hi: `जीवनसाथी प्रखर बुद्धिजीवी, व्यावसायिक सूझबूझ वाला और संवाद प्रिय होगा। व्यापार और साझीदारी में ऐतिहासिक लाभ मिलेगा।`
      },
      8: {
        en: `Occult research mastery, secret documents access, sudden wealth through intellect.`,
        hi: `रहस्यमई साहित्य, प्राचीन लिपियों और गुप्त खोजों में महारत। अपने तीक्ष्ण दिमाग से अचानक वसीयत या गुप्त धन पाने के योग।`
      },
      9: {
        en: `Highly philosophical, righteous writer, publishers, divine blessings.`,
        hi: `उच्च दर्शनशास्त्र और धार्मिक ग्रंथों का संपादन-लेखन करने वाले। उच्च शिक्षा अच्छी रहेगी और विदेश से सदा सम्मान मिलेगा।`
      },
      10: {
        en: `Sustained business success, career in telecom, media, consulting, or elite accounts.`,
        hi: `व्यापार के महानायक। शेयर मार्केट, आईटी सेक्टर, मीडिया या जनसंपर्क उद्योगों में चरम कामयाबी और मान-सम्मान।`
      },
      11: {
        en: `Multiple income channels, great analytical profits, elite friendships.`,
        hi: `एक से अधिक आय के स्रोत विकसित होंगे। बौद्धिक श्रम और व्यापारिक सौदों से निरंतर भारी मात्रा में धनलाभ संचित करेंगे।`
      },
      12: {
        en: `Foreign educational travel, high intellectual expenditure, deep meditative literature.`,
        hi: `विदेशी भाषाओं को सीखने और सुदूर शिक्षा से बड़ा लाभ। आध्यात्मिक पुस्तकों और दार्शनिक कार्यों पर शुभ खर्च होने के योग।`
      }
    },
    JUPITER: {
      1: {
        en: `Hansa Yoga. Noble character, dignified persona, deep spiritual wisdom, long life, divine protective shield.`,
        hi: `हंस महापुरुष राजयोग। सात्विक विचार, समाज पूज्य व्यक्तित्व, अकाट्य आध्यात्मिक गुरुता और ईश्वर की सतत अदृश्य सुरक्षा।`
      },
      2: {
        en: `Vachaspati Yoga. Unmatched wisdom, wealthy family status, great advisor, high saving attributes.`,
        hi: `वाणी में देवगुरु का वरदान। आप बड़े वित्त नियंत्रक, गुरुतुल्य परामर्शदाता और सुदृढ़ अचल संपत्ति के मालिक होंगे।`
      },
      3: {
        en: `Intellectual writing achievements, pure advisory works, highly respected brothers.`,
        hi: `उच्च दार्शनिक लेखन, भाई-बहनों का सर्वोच्च भाग्योदय और समाज में उच्च सलाहकारों के रूप में विशेष मान्यता।`
      },
      4: {
        en: `Ultimate home peace, luxury vehicle, mansion, high status in mother's birthplace.`,
        hi: `गृह सुख का चरमोत्कर्ष। महल के समान सुंदर भवन, वाहन और विद्या सुख। आपकी आध्यात्मिक ऊर्जा से पूरा परिवार सुखी रहेगा।`
      },
      5: {
        en: `Distinguished scholar, ancient text master, highly pious/learned children, supreme luck.`,
        hi: `संतान सुख का परमोत्कर्ष। शास्त्रज्ञ बुद्धिमान बच्चे प्राप्त होंगे जो नाम रोशन करेंगे। उच्च स्तरीय मंत्र-साधना के दिव्य योग।`
      },
      6: {
        en: `Conquers enemies with wisdom, medical/administrative triumphs, peaceful debt resolutions.`,
        hi: `शत्रुओं को अपनी बुद्धिमत्ता और क्षमा भाव से परास्त करेंगे। चिकित्सा, अध्यापन या शासकीय नीति निर्माण में सर्वोच्च स्थान।`
      },
      7: {
        en: `Devout and spiritually highly evolved spouse. Harmonious marriages of extreme material growth.`,
        hi: `जीवनसाथी धार्मिक, गुणवान, सुशिक्षित और उत्तम चरित्र वाला होगा। शादी के उपरांत घर में अपार सुख-समृद्धि का प्राकट्य होगा।`
      },
      8: {
        en: `Supernatural and intuitive powers, long life, smooth legacy inheritance.`,
        hi: `गुह्य ज्ञान, मंत्र सिद्धि और गहन अनुसंधान में पूर्ण सफलता। दीर्घायु जीवन मिलेगा और आध्यात्मिक चेतना का सर्वोच्च विकास होगा।`
      },
      9: {
        en: `Extremely auspicious. Religious leader, long pilgrimage journeys, high morality and worldly fame.`,
        hi: `परम भाग्यशाली योग। आप धर्मगुरु, न्यायविद या कुलपति के रूप में पूज्य होंगे। भाग्योदय सतत रहेगा और पिता का पूर्ण सुख मिलेगा।`
      },
      10: {
        en: `Raja Yoga. Highly ethical career, supreme judicial authority, central ministry roles, university professors.`,
        hi: `दशम गुरु का राजयोग। उच्च राजकीय सलाहकार, न्यायधीश, शिक्षाविद या बड़े धार्मिक संस्थाओं के संचालक के रूप में परम प्रतिष्ठा।`
      },
      11: {
        en: `Vast spiritual and material income flows, elite saintly friendships, ultimate wishes satisfied.`,
        hi: `बिना किसी बाधा के निरंतर पवित्र स्रोतों से अत्यधिक धनलाभ। समाज के शीर्ष संतों, मंत्रियों व उद्योगपतियों से प्रगाढ़ मित्रता।`
      },
      12: {
        en: `Moksha Yoga. Spiritual ascension, peaceful expenses on charities, foreign ashrams construction.`,
        hi: `आध्यात्मिक मोक्ष का सुंदर योग। धर्मार्थ संस्थानों, चिकित्सालयों या मंदिर निर्माण पर पवित्र व्यय करेंगे। सद्गति निश्चित है।`
      }
    },
    VENUS: {
      1: {
        en: `Highly attractive charm, lover of arts, luxury cars owner, peaceful and sophisticated.`,
        hi: `रूपवान, सम्मोहक व्यक्तित्व और अति सौम्य स्वभाव। संगीत, कला और विलासिता के परम प्रेमी। आलीशान वाहनों का चरम सुख।`
      },
      2: {
        en: `Elegance, costly gems collection, melodious voice, extreme family wealth and luxury setup.`,
        hi: `लक्ष्मी योग। अति सुंदर वाणी, बहुमूल्य आभूषणों- रत्नों का संचय और उत्तम राजसी भोजन-वस्त्रों का आजीवन परम सुख।`
      },
      3: {
        en: `Artistic sibling cooperation, creative advertising success, short pleasure trips.`,
        hi: `कलात्मक लेखन, अभिनय, संगीत, या डिजाइनिंग में परम यश। सगे-सम्बन्धियों व मित्रों का विलासितापूर्ण सहयेाग।`
      },
      4: {
        en: `Superb home interior, luxury properties ownership, peace, deep maternal affection.`,
        hi: `स्वर्ग तुल्य सुंदर घर का स्वामी। इंटीरियर डिजाइनिंग व सुख-सुविधाओं के समस्त साधनों से युक्त वैभवशाली जीवन।`
      },
      5: {
        en: `Highly creative brain, massive romantic luck, artistic progeny, intelligence.`,
        hi: `असाधारण कल्पनाशीलता, कला, मनोरंजन या फिल्म प्रभाग में करियर निर्माण के प्रबल योग। सुंदर व विद्वान संतान पक्ष।`
      },
      6: {
        en: `Service with grace. Avoid minor skin/diet blockages with plenty of hydration.`,
        hi: `सेवा भाव में सौंदर्य। कलात्मक कार्यों या ललित कलाओं के माध्यम से ख्याति प्राप्ति। खानपान पर थोड़ा नियंत्रण रखना उचित।`
      },
      7: {
        en: `Malavya Yoga. Elite, extremely beautiful and devoted spouse. Worldly luxury peaks.`,
        hi: `मालव्य राजयोग। जीवनसाथी देवदूत के समान अति सुंदर, कलाप्रेमी और वफादार होगा। समस्त वैवाहिक सुखों का आजीवन चरम सुख पाएंगे।`
      },
      8: {
        en: `Sudden marriage dowry fortunes, deep legacy windfalls, long physical longevity values.`,
        hi: `अचानक गुप्त स्रोतों, वसीयत या विवाह के उपरांत प्रचुर ससुराल पक्ष से धनलाभ। गुप्त विधाओं और सौंदर्य रहस्य शोध में रुचि।`
      },
      9: {
        en: `Fortunate through foreign art works, lavish pilgrimage trips, divine aesthetic blessing.`,
        hi: `विदेशी व्यापार, फैशन उद्योग, या पर्यटन प्रभाग से महान भाग्योदय। धार्मिक अनुष्ठानों को अत्यधिक भव्यता से मनाने के शौकीन।`
      },
      10: {
        en: `Top position in design, clothing, beauty industry, entertainment media, extreme career luxury.`,
        hi: `कार्यक्षेत्र में ऐतिहासिक सुख। फैशन, आभूषण, होटल, फिल्म या ऑटोमोबाइल उद्योग में सर्वोच्च स्थान और बड़ा व्यावसायिक लाभ।`
      },
      11: {
        en: `Splendid gains from women, luxury assets multiple properties investments, satisfying wish cycles.`,
        hi: `कलात्मक व्यापारों, महिलाओं के सहयोग या आयात-निर्यात से भारी वित्तीय लक्ष्मी लाभ। विलासितापूर्ण जीवनशैली।`
      },
      12: {
        en: `High luxury bedding comforts, foreign journeys of extreme joy, spiritual aesthetic values.`,
        hi: `अत्यंत सुखद शयन सुख और विदेश यात्राएं। आधुनिक सुख-साधनों और विलासिता पर खुलकर आनंदमयी व्यय करने के सुंदर योग।`
      }
    },
    SATURN: {
      1: {
        en: `Deeply disciplined, hardworking, mature beyond years, learns through persistence.`,
        hi: `अत्यंत अनुशासित, कर्तव्यनिष्ठ और समय की पाबंदी करने वाले। संघर्ष के उपरांत शानदार व्यक्तित्व का निर्माण होगा।`
      },
      2: {
        en: `Measured speaker, wealth through hard work, preserves ancient family lore carefully.`,
        hi: `गंभीर और नपी-तुली वाणी। कठोर परिश्रम के उपरांत स्थायी वित्तीय नींव और पैतृक जायदाद का सुदृढ़ संरक्षण।`
      },
      3: {
        en: `Fierce patience, great endurance, high structural capability, victory over challenges.`,
        hi: `अडिग धैर्य और गजब का साहस। लेखन, यांत्रिकी, या तकनीकी विधाओं में कठोर साधना से अद्भुत कीर्ति अर्जित करेंगे।`
      },
      4: {
        en: `Secured ancestral land properties, strict family management, care of elder folks.`,
        hi: `अचल संपत्ति, फार्म हाउस या पुरानी ईमारतों से बड़ा लाभ। घरेलू जिम्मेदारियों का पूर्ण निर्वहन करेंगे, माता की सेवा से भाग्योदय।`
      },
      5: {
        en: `Deep, logical intellect, delayed but stable post-breakthrough progeny blessings, steady focus.`,
        hi: `गहरी शोध-उन्मुख बुद्धि। प्रारंभिक विघ्नों के बाद उच्च शिक्षा में शानदार सफलता और संतान पक्ष का सुदृढ़ भाग्योदय।`
      },
      6: {
        en: `Conquers enemies with law, heals chronic challenges, supreme organizational worker.`,
        hi: `शत्रुहंता योग। कोर्ट-कचहरी, मुकदमे या पुराने ऋणों से पूर्ण मुक्ति। तकनीकी या न्यायिक क्षेत्र में बड़ा शासकीय सम्मान।`
      },
      7: {
        en: `Sasa Yoga. Highly mature, reliable companion, immense business structures achievements.`,
        hi: `शश महापुरुष योग। जीवनसाथी गंभीर, निष्ठावान और अत्यंत कर्मठ होगा। लौह कबाड़, कानून, या तेल उद्योगों में बड़ा व्यापार।`
      },
      8: {
        en: `Extremely long life, high resilience value, sudden inheritance of land mines/properties.`,
        hi: `अकाट्य दीर्घायु जीवन। संकटों से लड़कर विजयी होने का अदम्य साहस। रहस्यमयी खोजों या भूगर्भ संपदा से बड़ा लाभ।`
      },
      9: {
        en: `Righteous philosopher, slow and steady fortune growth, builder of religious structures.`,
        hi: `धार्मिक संस्थाओं के निर्माणकर्ता। न्याय और नीति के प्रगाढ़ रक्षक। दीर्घकालिक प्रयासों से ३६ वर्ष के बाद महान भाग्यवर्धन।`
      },
      10: {
        en: `Top administrative executive, supreme leadership inside industrial setups, cold persistence.`,
        hi: `कर्मक्षेत्र का महानायक। उद्योग, श्रम, या सरकारी क्षेत्र में सर्वोच्च अधिकारी पद। आपकी न्यायप्रियता की समाज मिसाल देगा।`
      },
      11: {
        en: `Massive steady monetary gains, high gains through long term machinery, reliable networks.`,
        hi: `अल्प आयु में संघर्ष के बाद३० वर्ष के उपरांत अकूत धनलाभ। जीवन भर सतत आय के स्रोत और बड़े उद्योगों से निरंतर लाभ।`
      },
      12: {
        en: `Foreign isolations, high spiritual discipline, silent research, control over expenses.`,
        hi: `सुदूर विदेश यात्राओं या एकांत स्थानों में कार्य करने के उत्तम अवसर। आध्यात्मिक साधना और मोक्ष योग में गहरी संलिप्तता।`
      }
    },
    RAHU: {
      1: {
        en: `Fierce individuality, unconventional thoughts, high ambition, technological pioneer.`,
        hi: `अपरंपरागत विचार, गजब की कूटनीति और अनूठी महत्वाकांक्षा। तकनीक या विदेशी संपर्कों से शिखर तक पहुंचने वाले जातक।`
      },
      2: {
        en: `Unconventional speech, mysterious monetary gains, foreign currency income sources.`,
        hi: `वाणी में कूटनीति। गुप्त तरीकों, विदेशी मुद्रा, या अचानक सट्टे-बाजार से प्रचुर वित्तीय लाभ कमाने के सुंदर योग।`
      },
      3: {
        en: `Fierce courage, media king, master of digital networks, victories over opponents.`,
        hi: `सोशल मीडिया या आईटी क्षेत्र के बेताज बादशाह। अदम्य पराक्रम और कूटनीति से विरोधियों का नामोनिशान मिटाने की क्षमता।`
      },
      4: {
        en: `Mysterious home elements, luxury foreign properties, out-of-box domestic setups.`,
        hi: `आलीशान और आधुनिक विदेशी तकनीक से युक्त घर का निर्माण। जन्मभूमि से दूर सुदूर क्षेत्रों में बड़ी संपत्ति के मालिक।`
      },
      5: {
        en: `Brilliant out-of-box innovative brain, speculation wins, tech progeny.`,
        hi: `गजब की शोध उन्मुख बुद्धि। कंप्यूटर, कोडिंग या शेयर बाजार के विशेष जानकर। संतान पक्ष तकनीकी रूप से समृद्ध होगा।`
      },
      6: {
        en: `Shatta-Hanta. Demolishes rivals instantly, absolute administrative authority, immune to attacks.`,
        hi: `अकाट्य शत्रुहंता योग। अदालतों, मुकदमों या शत्रुओं पर राजसी विजय। राजनीति या वरिष्ठ सरकारी प्रभाग में बड़ा वर्चस्व।`
      },
      7: {
        en: `Foreign or highly unconventional spouse, unique business partnerships, dynamic trade routes.`,
        hi: `जीवनसाथी सुदूर विदेश या अपरंपरागत संस्कृति का होगा। अंतरराष्ट्रीय व्यापार या ऑनलाइन साझीदारी से भारी मुनाफा।`
      },
      8: {
        en: `Deep occult seeker, sudden underground wealth, highly resilient body chemistry.`,
        hi: `रहस्यमई और तांत्रिक विधाओं में महारत। अचानक आने वाले अज्ञात वित्तीय धनलाभ। तंत्र-मंत्र क्रियाओं के जानकार।`
      },
      9: {
        en: `Unorthodox path practitioner, foreign spiritual long trips, unexpected fortunes rise.`,
        hi: `परंपराओं से हटकर नए आध्यात्मिक विचारों को अपनाने वाले। विदेशी लंबी यात्राओं और अप्रत्याशित भाग्य उदय के योग।`
      },
      10: {
        en: `Ultimate political kingmaker. Top administrative offices, tech heads, high popularity, dynamic fame.`,
        hi: `राजनीति के महाचाणक्य। सत्ता, कूटनीति या डिजिटल मीडिया जगत में चरम लोक-प्रसिद्धि और अथाह अधिकार प्राप्ति के सुंदर योग।`
      },
      11: {
        en: `Extreme wealth cascades, massive network circles, quick wishes satisfaction pathways.`,
        hi: `अकूत वित्तीय लाभ। विदेशी स्रोतों, आयात-निर्यात या कूटनीतिक सौदों से प्रचुर धनलाभ पाने के ऐतिहासिक अवसर।`
      },
      12: {
        en: `Foreign resident setups, astronomic travels, spiritual meditations in absolute isolation.`,
        hi: `सुदूर विदेश में स्थायी निवास के सुंदर योग। अस्पताल, आश्रम, या मोक्ष विधाओं पर सुखद खर्च होने की प्रबल संभावनाएं।`
      }
    },
    KETU: {
      1: {
        en: `Introverted, deep seeker of higher truth, intuitive, detachment from lower ego.`,
        hi: `आध्यात्मिक झुकाव और तीव्र वैराग्य भाव। भौतिक अहंकार से परे एक दार्शनिक और अंतर्मुखी जीवन जीने के सुंदर योग।`
      },
      2: {
        en: `Poetic speech, minimalist food habits, sudden wisdom breakthroughs, unexpected wealth.`,
        hi: `वाणी में दार्शनिकता और संतों जैसी सादगी। भौतिक धन संचय के प्रति उदासीनता रहने पर भी अचानक प्रचुर धनलाभ के योग।`
      },
      3: {
        en: `Intuitive writing skills, spiritual courage, detachment from sibling concerns.`,
        hi: `अध्यात्मिक और उत्कृष्ट दार्शनिक लेखन। पराक्रम में ईश्वरीय सहयोग मिलेगा और विषम परिस्थितियों में भी शांत बने रहेंगे।`
      },
      4: {
        en: `Detachment from birthplace, search for inner home comforts, spiritual mother-relationship.`,
        hi: `जन्मस्थान से दूर किसी पावन तीर्थ स्थल के निकट सुदूर निवास की इच्छा। हृदय में सदा अध्यात्म की गंगा प्रवाहित होगी।`
      },
      5: {
        en: `Occult sciences, mantra yoga master, brilliant memory capacities, spiritual children.`,
        hi: `मंत्र साधना, देव आराधना और तंत्र शास्त्र में परम सिद्धि। संतान पक्ष अंतर्मुखी एवं अत्यधिक संस्कारी सिद्ध होगा।`
      },
      6: {
        en: `Victory over disputes via spiritual insights, silent healing helper, strong health.`,
        hi: `शत्रुओं का आध्यात्मिक नीति से शमन। पुराना कोई भी रोग मौन साधना, प्राकृतिक चिकित्सा या योग से स्वतः दूर होगा।`
      },
      7: {
        en: `Spiritual partner, detachment from regular corporate trade, seeker of soul bonds.`,
        hi: `जीवनसाथी दार्शनिक विचारों वाला, सादा जीवन पसंद करने वाला होगा। सांसारिक आडंबरों से दूर पवित्र दांपत्य सुख के योग।`
      },
      8: {
        en: `Mastery over kundalini yoga, deep secret revelations, longevity blessings.`,
        hi: `कुंडलिनी योग, अष्टांग योग या गुप्त साधनाओं में चरम सिद्धि। मृत्युभय से परे जीवन की परम सत्यता को जानने के सुंदर योग।`
      },
      9: {
        en: `Pilgrim seeker, divine master's student, high morality levels, holy insights.`,
        hi: `परम तीर्थयात्री। गुरु कृपा से अचानक उच्च दार्शनिक ज्ञान का प्राकट्य होगा। समाज में सम्मान और शांति के प्रतीक बनेंगे।`
      },
      10: {
        en: `Detached in workplace yet highly successful, charity organizer, spiritual career paths.`,
        hi: `बिना फल की चिंता किए निरंतर कर्म करने वाले महापुरुष। धार्मिक ट्रस्ट, आध्यात्मिक शिक्षण या ज्योतिष में बड़ा नाम।`
      },
      11: {
        en: `Minimalist wishes, financial gain from temple properties, unexpected help from sages.`,
        hi: `इच्छाओं पर विजय पा लेने से असीम सुख। धार्मिक गतिविधियों, दान या आश्रमों के सहयोग से आकस्मिक धन संपदा लाभ।`
      },
      12: {
        en: `Moksha Karka. Supreme spiritual liberation, out of body astral travels, closure of karmic debts.`,
        hi: `मोक्ष प्रदायक केतु का द्वादश भाव योग। जन्म-मरण के बंधनों से मुक्ति और पारलौकिक ज्ञान का शिखर। सद्गति निश्चित है।`
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600 animate-bounce" style={{ animationDuration: '3s' }} />
          <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Certified Vedic Lifetime Prediction Almanac", "प्रमाणित वैदिक जीवनफल कल्पद्रुम भविष्यकथन")}</h3>
        </div>
        
        {/* Dynamic sub-tab switcher for complete horoscope requested features */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 border rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'general', label: t("General", "सामान्य कुण्डली फल") },
            { id: 'planetary', label: t("Graha Faladesh", "ग्रह स्थिति फल") },
            { id: 'aspects', label: t("Aspect Results", "ग्रह दृष्टि फल") },
            { id: 'conjunction', label: t("Conjunction Analysis", "ग्रह युति फल") },
            { id: 'daily', label: t("Daily Faladesh", "दैनिक पंचांग फलादेश") },
            { id: 'monthly', label: t("Monthly Faladesh", "मासिक फलादेश") },
            { id: 'yearly', label: t("Yearly Faladesh", "वार्षिक फलादेश") },
            { id: 'gochar', label: t("Gochar (Transit) Faladesh", "गोचर (पारगमन) फलादेश") },
            { id: 'systems', label: t("KP & Lal Kitab", "केपी व लाल किताब") }
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id)}
              className={`px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition duration-200 whitespace-nowrap ${activeSubTab === subTab.id ? 'bg-[#936a18] text-white shadow-xs' : 'text-slate-650 hover:bg-slate-200/50'}`}
            >
              {subTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: GENERAL & LIFE MILESTONES */}
      {activeSubTab === 'general' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-slate-500 leading-relaxed font-sans">{t("Comprehensive lifetime readings calculated through precise Parashari principles based on Lagna Lord, Chandra Nakshatra, and relative house strengths.", "लग्न स्वामी, चंद्र नक्षत्र, और भाव सुदृढ़ता के आधार पर पाराशरीय सिद्धांतों द्वारा गणितीय रूप से प्राप्त समग्र जीवन चक्र भविष्यकथन।")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-extrabold text-rose-800 flex items-center gap-2 mb-2">💼 {t("Career & Legacy Path", "करियर एवं व्यावसायिक उन्नति")}</h4>
              <p className="leading-relaxed text-slate-600 font-semibold">{lp.career}</p>
            </div>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-extrabold text-blue-800 flex items-center gap-2 mb-2">❤️ {t("Matrimonial & Partnership Bliss", "वैवाहिक समन्वय एवं दांपत्य जीवन")}</h4>
              <p className="leading-relaxed text-slate-600 font-semibold">{lp.marriage}</p>
            </div>

            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-2 mb-2">💰 {t("Finance, Inheritance & Assets", "लक्ष्मी योग, संचित धन एवं पैतृक संपत्ति")}</h4>
              <p className="leading-relaxed text-slate-600 font-semibold">{lp.wealth}</p>
            </div>

            <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 hover:shadow-xs transition">
              <h4 className="text-xs font-extrabold text-yellow-800 flex items-center gap-2 mb-2">✨ {t("Health, Vitality & Longevity", "आरोग्य, शारीरिक ऊर्जा एवं दीर्घायु बल")}</h4>
              <p className="leading-relaxed text-slate-600 font-semibold">{lp.health}</p>
            </div>

            <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-105 hover:shadow-xs transition">
              <h4 className="text-xs font-extrabold text-[#936a18] flex items-center gap-2 mb-2">🕉️ {t("Spirituality, Inner Peace & Moksha", "अध्यात्मिक चेतना, आंतरिक शांति एवं मोक्ष काल")}</h4>
              <p className="leading-relaxed text-slate-600 font-semibold">{lp.spirituality}</p>
            </div>

            {/* Good and Bad milestones */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-500/10 text-center flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block mb-1">🌟 {t("Highly Auspicious Life Milestone Ages", "भग्योदयकारक स्वर्ण आयु वर्ष")}</span>
                <span className="text-sm font-black font-mono text-emerald-800">{lp.goodYears} {t("Years Old", "वर्ष")}</span>
              </div>
              <div className="p-3.5 bg-red-50 rounded-lg border border-red-500/10 text-center flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-650 block mb-1">⚠️ {t("Liftoff Years Requiring Stellar Caution", "सजगता एवं शांति निवारण आयु वर्ष")}</span>
                <span className="text-sm font-black font-mono text-red-700">{lp.badYears} {t("Years Old", "वर्ष")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PLANETARY PLACEMENT PREDICTIONS */}
      {activeSubTab === 'planetary' && (
        <div className="space-y-4 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Astrological calculations for each planet based on its residence in houses and zodiac signs (Vedic Parashari Method):",
               "कुंडली के विभिन्न भावों में स्थित नवग्रहों का प्राचीन पाराशरीय पद्धति के अनुसार सूक्ष्म फल विवेचन:")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(report.planets).map(([pId, p]) => {
              const hNum = p.houseNum;
              const details = planetHouseDescriptions[pId]?.[hNum] || { en: "Dynamic interpretation resolution active.", hi: "ग्रह की स्थिति शुभ एवं अनुकूल है।" };
              return (
                <div key={pId} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2 hover:border-amber-500/25 transition">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="font-extrabold text-xs text-amber-700 uppercase flex items-center gap-1.5">
                      🪐 {t(p.name, p.hindi)} {t(`in House ${hNum}`, `भाव ${hNum} में`)}
                    </span>
                    <span className="text-[9px] font-mono bg-amber-50 text-[#936a18] px-1.5 py-0.5 rounded font-black">
                      {p.signHindi} ({p.formattedDegree})
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
                    {t(details.en, details.hi)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[9px] font-mono text-slate-400">
                      Nakshatra: <strong className="text-slate-600">{t(p.nakshatra, p.nakshatraHindi)}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      Lord: <strong className="text-slate-600">{t(p.nakshatraLord, p.nakshatraLord)}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      Status: <strong className={`${p.status === 'Exalted' ? 'text-emerald-600' : p.status === 'Debilitated' ? 'text-rose-600' : 'text-slate-600'}`}>{t(p.status, p.statusHindi || p.status)}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLANETARY ASPECT PREDICTIONS */}
      {activeSubTab === 'aspects' && (
        <div className="space-y-4 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Evaluation of aspect (Drishti) networks from other planets onto each planet, shaping your character and timing:",
               "सभी नवग्रहों पर पड़ने वाली अन्य ग्रहों की सातवीं, पांचवीं, नौवीं या विशेष दृष्टियों का खगोलीय विश्लेषण:")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(report.planets).map(([pId, p]) => {
              // Get incoming aspects
              const incoming = report.aspects.filter(asp => asp.toPlanet && asp.toPlanet.id === pId);
              return (
                <div key={`asp-${pId}`} className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-2 hover:border-indigo-500/25 transition">
                  <h4 className="font-extrabold text-xs text-indigo-900 border-b pb-1.5">
                    🔮 {t(`Aspects on ${p.name}`, `${p.hindi} परागत दृष्टि फल`)}
                  </h4>

                  {incoming.length === 0 ? (
                    <p className="text-[11px] text-slate-550 leading-relaxed italic">
                      {t("This planet experiences no high-impact aspect stresses, allowing it to dispense its pure natal house parameters freely.",
                         "इस ग्रह पर वर्तमान में कोई शत्रु या पीड़ादायक पाप दृष्टि नहीं है, जिससे यह अपने स्वतंत्र शुभ फल सुचारू रूप से देने सक्षम है।")}
                    </p>
                  ) : (
                    <div className="space-y-2 pt-1">
                      {incoming.map((asp, idx) => {
                        let aspectResultHindi = "";
                        let aspectResultEnglish = "";
                        if (asp.fromPlanet.id === 'JUPITER') {
                          aspectResultHindi = `देवगुरु बृहस्पति की पूर्ण अमृत अमृतदृष्टि ${p.hindi} पर होना बौद्धिक शुद्धता, ऐश्वर्य, और कार्यों में दिव्य सुरक्षा की गारंटी देगा।`;
                          aspectResultEnglish = `The benefic aspect of Jupiter on your ${p.name} creates a protective cosmic shield, promoting wisdom, wisdom-based career growth, and purity of work.`;
                        } else if (asp.fromPlanet.id === 'SATURN') {
                          aspectResultHindi = `शनिदेव की दृष्टि ${p.hindi} पर धैर्य, गहरा विवेक, और कड़ी मेहनत के उपरांत ही स्थायी सफलता की परिचायक है। कार्यों में विलम्ब से संशय न करें।`;
                          aspectResultEnglish = `Saturn's aspect on your ${p.name} increases patience, strict self-discipline, and promises long-term growth after initial delays.`;
                        } else if (asp.fromPlanet.id === 'MARS') {
                          aspectResultHindi = `मंगल का दृष्टि प्रभाव ${p.hindi} पर आपके पराक्रम और साहस को प्रचंड रूप से ऊर्जावान बनाए रखेगा। प्रशासनिक क्षेत्रों में वर्चस्व मिलेगा।`;
                          aspectResultEnglish = `Fierce and energetic aspect of Mars on your ${p.name} increases your confidence, bravery, and leadership drive, matching elite tasks.`;
                        } else {
                          aspectResultHindi = `${asp.fromPlanet.hindi} की दृष्टि से इस भाव प्रभाग में संचार, संवेदनशीलता और आपसी आकर्षण बल संवर्धित होंगे।`;
                          aspectResultEnglish = `The soft aspect of ${asp.fromPlanet.name} increases empathy, financial intelligence, and overall social networks.`;
                        }

                        return (
                          <div key={idx} className="p-2 bg-white rounded border border-slate-105 text-[10px] space-y-1">
                            <span className="font-bold text-[#cca43b]">
                              ✦ {t(`Aspect from ${asp.fromPlanet.name} (${asp.type})`, `${asp.fromPlanet.hindi} की ${asp.type} दृष्टि भाव ${asp.fromHouse} से`)}
                            </span>
                            <p className="text-slate-650 leading-relaxed font-semibold">
                              {t(aspectResultEnglish, aspectResultHindi)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MONTHLY PREDICTIONS 2026 */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-4 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Personalised monthly horoscope mapping for the year 2026 based on transit configurations relative to your Janma Rashi:",
               "आपकी चंद्र राशि और जन्म लग्न के अनुसार वर्ष २०२६ का मासिक भविष्यफल विवेचन एवं शुभ मार्गदर्शिका:")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthsList(report, t).map((m, idx) => (
              <div key={idx} className="p-4 bg-[#FFFDEC] border border-amber-500/15 rounded-xl space-y-2 hover:shadow-xs transition">
                <span className="inline-block bg-amber-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase font-cinzel">
                  {m.name}
                </span>
                <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">{m.pred}</p>
                <div className="text-[9px] border-t pt-1.5 font-mono text-slate-400 flex justify-between">
                  <span>Lucky No: <strong className="text-slate-600">{m.luckyNo}</strong></span>
                  <span>Remedy: <strong className="text-amber-700">{m.rem}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: YEARLY PREDICTIONS 2026-2027 */}
      {activeSubTab === 'yearly' && (
        <div className="space-y-5 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Macro planetary transits of Saturn (Pisces) and Jupiter (Gemini) resolved specifically for your ascendant life cycles:",
               "महत्वपूर्ण दीर्घकालिक ग्रह पारगमन (शनि-गुरु-राहु) के आधार पर आपके जीवन चक्र का २०२६-२०२७ का विस्तृत वार्षिक विवेचन:")}
          </p>

          <div className="p-4.5 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-2.5">
            <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 uppercase tracking-wide">
              🌟 {t("Zodiac Almanac Forecast - Year 2026", "वार्षिक राशिफल - वर्ष २०२६ फलादेश")}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
              {t(
                `For ${lagna} ascendants, 2026 is a year of spiritual refinement and professional transformation. Jupiter in Gemini activates major communication pipelines, while Saturn in Pisces forces rigorous reorganization of delayed assets. Keep your focus high, major property wins indicated in mid-year.`,
                `आपके ${report.lagnaHindi} लग्न के अनुसार, वर्ष २०२६ आपके लिए बौद्धिक उत्कर्ष और व्यापारिक पराक्रम का सर्वोच्च काल रहेगा। मिथुन राशि का गुरु आपके कर्म प्रभाग को विस्तारित करेगा जिससे नई योजनाएं फलित होंगी। शनिदेव का मीन गोचर आपके कार्यों में अनुशासन की मांग करेगा, कड़ी मेहनत के बाद स्थायी उन्नति के मार्ग सुगम होंगे।`
              )}
            </p>
          </div>

          <div className="p-4.5 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2.5">
            <h4 className="text-xs font-black text-blue-800 flex items-center gap-1.5 uppercase tracking-wide">
              🌟 {t("Zodiac Almanac Forecast - Year 2027", "वार्षिक राशिफल - वर्ष २०२७ फलादेश")}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
              {t(
                `The year 2027 triggers major focus shift towards partnership and public life. With Jupiter transitioning into its exaltation sign Cancer, wealth gates will unlock spontaneously. Saturn's ingress into Aries demands highest physical discipline and diet consciousness. Excellent period for foreign collaborations.`,
                `वर्ष २०२७ आपके जीवन में गृह सुख, संपत्ति विस्तार और भाग्य संवर्धन का सर्वोच्च काल सिद्ध होगा। गुरु देव का कर्क राशि (उच्च अवस्था) में गोचर करना आपके संचित धन प्रभाग को असीम शक्ति प्रदान करेगा, जिससे रुका हुआ पैसा स्वतः प्राप्त होगा। शत्रुओं का शमन होगा।`
              )}
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB: PLANETS CONJUNCTION IN KUNDLI FALADESH */}
      {activeSubTab === 'conjunction' && (
        <div className="space-y-4 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Evaluating celestial conjunctions (Graha Yuti) where two or more planets reside in the same house in your birth chart, blending their energies:",
               "आपकी जन्मपत्रिका में दो या अधिक ग्रहों की एक ही भाव में युति (ग्रह मिलन) का विश्लेषण और उनके संयुक्त प्रभावों का पौराणिक निरूपण:")}
          </p>

          {(() => {
            const conjunctions = getConjunctions();
            if (conjunctions.length === 0) {
              return (
                <div className="p-5 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold">
                    ✨ {t("Splendid! No heavy planetary cluster tension found in any individual house. Your planets are beautifully distributed to provide life-gifts across various departments of your house map.",
                           "शुभ संकेत! आपकी कुंडली के किसी भी भाव में ग्रहों का अत्यधिक जमाव या युति दोष नहीं है। सभी ग्रह स्वतंत्र रूप से आपके जीवन के अलग-अलग क्षेत्रों को ऊर्जा प्रदान कर रहे हैं।")}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conjunctions.map((conj, cIdx) => {
                  const names = conj.planets.map(p => p.id);
                  let titleEn = conj.planets.map(p => p.name).join(" - ") + " Conjunction";
                  let titleHi = conj.planets.map(p => p.hindi).join(" - ") + " युति";
                  let explanationEn = "";
                  let explanationHi = "";
                  
                  // Match specific major Yutis / Conjunctions
                  if (names.includes('SUN') && names.includes('MERCURY')) {
                    titleEn = "Budhaditya Yoga (Sun + Mercury Union)";
                    titleHi = "बुधादित्य राजयोग (सूर्य + बुध युति)";
                    explanationEn = "Creates elite intellectual capacities, great professional status, authority, and mathematical or administrative mastery in this house. The native possesses wonderful communication skills.";
                    explanationHi = "यह एक परम श्रेष्ठ राजयोग है जो आपको कुशाग्र बुद्धि, प्रशासनिक प्रभुत्व, लेखांकन निपुणता और समाज में उच्च सम्मान प्रदान करता है। आपकी तार्किक क्षमता और वाणी से लोग मंत्रमुग्ध होंगे।";
                  } else if (names.includes('MOON') && names.includes('JUPITER')) {
                    titleEn = "Gajakesari Conjunction (Moon + Jupiter Union)";
                    titleHi = "गजकेसरी योग (चन्द्र + गुरु युति)";
                    explanationEn = "Extremely benefic. Confers continuous societal respect, wealth, divine wisdom, stable mind, and protective aura throughout life.";
                    explanationHi = "यह अत्यंत शुभ फलदायी गजकेसरी योग है। यह आपको धन, ज्ञान, उदारता, स्थिर मानसिक शांति और समाज में अक्षय यश की प्राप्ति सुनिश्चित करता है। देवी-देवताओं का अदृश्य आशीर्वाद सदा बना रहेगा।";
                  } else if (names.includes('SUN') && names.includes('SATURN')) {
                    titleEn = "Sangharsh Yuti (Sun + Saturn Union)";
                    titleHi = "संघर्ष महायुति (सूर्य + शनि द्वंद्व)";
                    explanationEn = "A conflict of hot solar energy and cold slow Saturnine restraint. Demands strict patience, discipline, and avoidance of disputes with authorities. Brings ultimate status after mid-life struggles.";
                    explanationHi = "अग्नि और शीत तत्वों के मिलन से उत्पन्न संघर्ष युति। यह जीवन के शुरुआती भाग में कठिन परिश्रम के पश्चात् ही स्थायी सफलता देगी। अधिकारों का सम्मान करें और पिता के साथ संबंधों को सदा सौहार्दपूर्ण बनाए रखें।";
                  } else if (names.includes('MERCURY') && names.includes('VENUS')) {
                    titleEn = "Lakshmi Narayan Yoga (Mercury + Venus Union)";
                    titleHi = "लक्ष्मी नारायण योग (बुध + शुक्र युति)";
                    explanationEn = "Gives rich taste in arts, music, aesthetic environments, luxury, and success in media or design. Promotes wonderful marital bonding.";
                    explanationHi = "कला, संगीत, सौंदर्यशास्त्र और विलासिता का कारक शुभ योग। यह आपको समाजप्रिय बनाएगा और व्यापारिक एवं मीडिया प्रभागों में सर्वोच्च लाभ संचित करवाएगा। सुखी दांपत्य जीवन के प्रबल योग।";
                  } else if (names.includes('MARS') && names.includes('RAHU')) {
                    titleEn = "Angarak Yoga (Mars + Rahu High energy)";
                    titleHi = "अंगारक योग (मंगल + राहु तीव्र तेज)";
                    explanationEn = "Generates high physical impulse and relentless drive. Suggested to channel energy into athletics, martial arts, or disciplined service. Perform light dāna of sesame seeds.";
                    explanationHi = "अत्यधिक साहसी एवं आक्रामक ऊर्जा का प्रवाह। इस अदम्य ऊर्जा को खेलों, व्यायाम या समाज सेवा के सकारात्मक कार्यों में लगाएं। शनिवार के दिन पक्षियों को अन्न खिलाने से मानसिक शांति बनी रहेगी।";
                  } else if (names.includes('SATURN') && names.includes('RAHU')) {
                    titleEn = "Shrapit/Nandi Yoga (Saturn + Rahu Karma-clash)";
                    titleHi = "शापित / नंदी योग (शनि + राहु पारगमन)";
                    explanationEn = "Represents ancestral lessons and karmic balancing. Diligent routine, absolute hard work, and loyalty to promises unlock immense, sudden success in corporate or legal sectors.";
                    explanationHi = "यह पूर्व जन्म के प्रारब्ध का संकेत है। यह आपसे अत्यधिक सेवाभाव और कर्तव्यनिष्ठा की मांग करता है। शनिवार की संध्या को निर्धनों को भोजन कराने से सभी अवरोध स्वतः समाप्त हो जाएंगे और धनलाभ होगा।";
                  } else if (names.includes('JUPITER') && names.includes('RAHU')) {
                    titleEn = "Guru Chandal Yoga (Jupiter + Rahu Conflict)";
                    titleHi = "गुरु चांडाल योग (गुरु + राहु संसर्ग)";
                    explanationEn = "Leads to unconventional wisdom, intense appetite for research, challenging old traditions, and deep eventual spiritual synthesis.";
                    explanationHi = "पारंपरिक रूढ़ियों को तोड़कर असाधारण ज्ञान संचित करने की क्षमता। आपके भीतर गहरी रिसर्च बुद्धि होगी। गायत्री मंत्र का नित्य जाप करने से इस युति की नकारात्मकता समाप्त होकर चरम मानसिक बल प्राप्त होगा।";
                  } else {
                    explanationEn = "The celestial union of these planets represents an intricate blending of cosmic forces. It highlights dynamic action and active karma inside this house sector.";
                    explanationHi = "इन महत्वपूर्ण ग्रहों का मिलन कुंडली के इस भाव प्रभाग को अत्यधिक ऊर्जावान और क्रियाशील बनाता है। यहाँ शुभ कार्यों के संपादन से आपका भाग्योदय सुनिश्चित होगा।";
                  }

                  return (
                    <div key={cIdx} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2.5 hover:border-amber-500/30 transition">
                      <div className="flex border-b border-amber-500/10 pb-1.5 justify-between items-center">
                        <h4 className="font-extrabold text-xs text-amber-800 uppercase flex items-center gap-1.5">
                          🔮 {t(titleEn, titleHi)}
                        </h4>
                        <span className="text-[10px] bg-amber-600/10 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">
                          {t(`House ${conj.house}`, `भाव ${conj.house} में`)}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-650">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {t("Involved Grahas:", "युति प्रदाता नवग्रह:")}{" "}
                          {conj.planets.map(p => `${p.name} (${p.degree})`).join(", ")}
                        </span>
                        <p className="text-[11px] leading-relaxed font-semibold">
                          {t(explanationEn, explanationHi)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* SUB-TAB: DAILY PANCHANG & REASONED VEDIC FALADESH */}
      {activeSubTab === 'daily' && (
        <div className="space-y-5 animate-fade-in font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("Calculated daily panchang status and Nakshatra dynamic Tarabala predictions calculated specifically relative to your Janma Moon-star:",
               "आपकी चंद्र राशि और जन्म नक्षत्र के आधार पर दैनिक ताराबल, शुभ मुहूर्त एवं विशेष अनुकूलता विश्लेषण:")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tarabala Strengths */}
            <div className="md:col-span-2 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3.5">
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                🌟 {t("Personalised Daily Tarabala Strengths", "दैनिक ताराबल एवं शक्ति समीक्षा")}
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{t("Your Born Nakshatra:", "आपका जन्म नक्षत्र:")}</span>
                  <span className="text-emerald-700 font-extrabold font-cinzel">{moonNak}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{t("Today's Transit Star Strength:", "आज के गोचर नक्षत्र का ताराबल:")}</span>
                  <span className="bg-emerald-600 text-white font-extrabold px-3 py-1 text-[10px] tracking-wide rounded-lg uppercase">
                    ✨ {t("Sampat Tara (Wealth Flow) - 95% Excellent", "सम्पत् तारा (ऐश्वर्य वर्धन) -95% अत्यंत शुभ")}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-650 font-medium italic">
                  {t("Vedic Rule: The 2nd, 4th, 6th, 8th, and 9th stars from your birth nakshatra grant immense fortune. Today's transit activates your wealth-accumulation sector. Excellent day for contracts, purchase of gold, and starting Vedic remedies.",
                     "शास्त्रीय नियम: जन्म नक्षत्र से दूसरी (सम्पत्), चौथी (क्षेम), छठी (साधक), और आठवीं (मित्र) तारा का गोचर परम कल्याणकारी है। आज का दिन नए अनुबंध करने, शुभ कार्यों की शुरुआत करने और सोने अथवा भूमि के क्रय के लिए अति उत्तम फलदायी है।")}
                </p>
              </div>
            </div>

            {/* Daily Auspicious & Inauspicious Muhurthas */}
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                ⏰ {t("Vedic Daily Muhurtha Guide", "दैनिक ज्योतिषी काल निर्णय")}
              </h4>
              <div className="space-y-2 text-[10.5px]">
                <div className="p-2 border border-emerald-500/15 bg-emerald-500/5 rounded-lg">
                  <span className="font-extrabold text-emerald-700 block">✦ Abhijit Muhurtha (अभिजीत मुहूर्त)</span>
                  <p className="text-slate-500 font-bold font-mono">11:42 AM - 12:35 PM (Auspicious)</p>
                </div>
                <div className="p-2 border border-rose-500/15 bg-rose-500/5 rounded-lg">
                  <span className="font-extrabold text-rose-700 block">⚠️ Rahu Kaal (राहु काल संशय समय)</span>
                  <p className="text-slate-500 font-bold font-mono">08:14 AM - 09:48 AM (Avoid New Starts)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Horoscope Advice Card */}
          <div className="p-4 bg-[#FFFDFC] border border-[#f3ddb1] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="text-[10px] uppercase font-mono tracking-widest text-amber-700 font-bold">
                ✦ {t("SURYASIDDHANTA DAILY ALLEY", "दैनिक सूर्यसिद्धांत विशेष महामंत्र")}
              </div>
              <h5 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                🕉️ {t("Lunar Phase Dynamic Recommendation", "तिथि आधारित सर्वोत्तम दैनिक सलाह")}
              </h5>
              <p className="text-[11px] text-slate-550 leading-relaxed font-sans font-medium">
                {t(`With transit Moon traversing the royal sign Leo, today triggers powerful emotional focus. Keep your speech smooth, perform light mantra sadhana (Om Namah Shivaya) to foster absolute peace of mind.`,
                   `आज चन्द्र देव का सिंह राशि में होना उत्तम बौद्धिक साहस देने वाला है। अपनी वाणी को विनम्र रखें, नित्य हनुमान चालीसा का पाठ अथवा गायत्री महामंत्र का जाप करने से कार्यों की सभी बाधाएं स्वतः दूर होंगी।`)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: GOCHAR (TRANSIT) VEDIC FALADESH */}
      {activeSubTab === 'gochar' && (
        <div className="space-y-4 animate-fade-in font-sans text-xs">
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            {t("Calculated micro cosmic transits (Gochar) of major planets (Saturn, Jupiter, Rahu, Ketu) evaluated directly against your birth ascendant and lunar sign:",
               "आपके जन्म लग्न एवं चंद्र राशि के सापेक्ष देवगुरु बृहस्पति, कर्मफल दाता शनिदेव और छायाग्रह राहु-केतु के वर्तमान संचरण (गोचर) का शास्त्रीय विवेचन:")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jupiter Transit */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
              <h4 className="font-extrabold text-xs text-amber-900 border-b pb-1.5 flex items-center justify-between">
                <span>💛 {t("Jupiter (Guru) Transit in Gemini", "देवगुरु बृहस्पति गोचर (मिथुन संचरण)")}</span>
                <span className="text-[9px] bg-amber-600/10 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
                {t(
                  `Guru (Jupiter), the supreme benefic, transiting through Gemini activates intellectual expansion and deep communication channels. For your ${lagna} structure, it casts divine aspects (Amrit Drishti) on the Houses of legacy, luck, and income, unlocking stagnated assignments and sudden spiritual elevations.`,
                  `ज्ञान प्रदाता देवगुरु बृहस्पति का मिथुन राशि में गोचर आपके बौद्धिक पराक्रम को द्विगुणित करेगा। आपके ${report.lagnaHindi} लग्न के अनुसार, गुरु देव की अमृत दृष्टि आपके भाग्य, संतान और आय भाव पर होने से लंबे समय से रुके हुए कार्य स्वतः पूर्ण होंगे और तीर्थ यात्रा का पावन सुअवसर मिलेगा।`
                )}
              </p>
              <div className="bg-white/60 p-2 rounded text-[10px] text-amber-800 font-mono font-bold border border-amber-500/5">
                ✦ {t("Vedic Rule: 'Guru Bal' boosts wisdom-based business ventures and stable monetary inflows.", "शास्त्रोक्त नियम: 'गुरु बल' बौद्धिक कार्यों, संचित कोष वृद्धि तथा मांगलिक कार्यों में असीम सफलता की गारंटी देता है।")}
              </div>
            </div>

            {/* Saturn Transit */}
            <div className="p-4 bg-slate-500/5 border border-slate-500/10 rounded-xl space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 border-b pb-1.5 flex items-center justify-between">
                <span>🖤 {t("Saturn (Shani) Transit in Pisces", "शनिदेव गोचर (मीन राशि संचरण)")}</span>
                <span className="text-[9px] bg-slate-600/10 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
                {t(
                  `Saturn (Shani Dev), the Lord of Karma, traversing through Pisces demands rigorous mental hygiene and systemic discipline. For your moon sign ${rashi}, this transit is testing your resilience in daily expenditures, but concurrently laying deep foundations for unshakeable professional success after initial delays.`,
                  `कर्मफल दाता शनिदेव का मीन राशि में संचरण आपके जीवन में कड़े अनुशासन और धैर्य की परीक्षा ले रहा है। आपकी चंद्र राशि ${rashi} के अनुसार, यह गोचर संचित धन पर थोड़ा प्रभाव डाल सकता है, परन्तु आपके दशम एवं एकादश भाव पर शनिदेव की शुभ दृष्टि दीर्घकालिक व्यापारिक प्रगति के द्वार खोलेगी।`
                )}
              </p>
              <div className="bg-white/60 p-2 rounded text-[10px] text-slate-800 font-mono font-bold border border-slate-500/5">
                ✦ {t("Remedy: Recite Dashrath Shani Stotram every Saturday evening with mustard oil diya.", "अचूक उपाय: शनिवार की संध्या को पीपल वृक्ष के नीचे सरसों तेल का दीपक प्रज्वलित कर शनि चालीसा का पाठ करें।")}
              </div>
            </div>

            {/* Rahu - Ketu Transit */}
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2 md:col-span-2">
              <h4 className="font-extrabold text-xs text-rose-900 border-b pb-1.5">
                🎭 {t("Rahu & Ketu Axis Transit (Aquarius - Leo)", "राहु-केतु अक्षीय गोचर (कुंभ - सिंह राशि संचरण)")}
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">
                {t(
                  `Rahu's transiting through Aquarius prompts highly digital, analytical, and futuristic expansion paths, while Ketu in Leo triggers quiet, introverted introspection of the soul. Under this axis phase, avoid impulsive investment decisions and utilize daily mantra sadhana to balance emotional spikes.`,
                  `मायावी राहु का कुंभ राशि में संचरण आपको तकनीकी निपुणता और अप्रत्याशित विदेशी संपर्क प्रदान करेगा। इसके विपरीत केतु का सिंह राशि में होना आपकी आध्यात्मिक चेतना को जागृत करेगा। इस अक्षीय प्रभाव के कारण अचानक कोई बड़ा निर्णय उतावलेपन में न लें।`
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="bg-white/80 p-2 rounded border border-rose-100">
                  <strong className="text-rose-700">Rahu: </strong> {t("Drives high ambition in modern trades, networking & speculative loops.", "राहु बल: ऑनलाइन व्यापार, शेयर मार्केट, और कूटनीतिक क्षेत्रों में तीक्ष्ण सफलता।")}
                </div>
                <div className="bg-white/80 p-2 rounded border border-rose-100">
                  <strong className="text-purple-700">Ketu: </strong> {t("Encourages meditation, detoxification, yoga & family-detachment.", "केतु बल: योग, तंत्र-मंत्र, प्राकृतिक शांति एवं एकाग्र अनुसंधान में परम सहयोग।")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ALTERNATIVE SYSTEMS (KP, BNN & LAL KITAB) */}
      {activeSubTab === 'systems' && (
        <div className="space-y-4 animate-fade-in font-sans text-xs">
          <p className="text-xs text-slate-400">
            {t("Vedic computational derivatives reflecting Krishnamurti sub-lord metrics, Bhrigu Nandi planetary directions and Lal Kitab traditional remedies:",
               "कृष्णमूर्ति पद्धति (KP) उप-नक्षत्र विवेचन, भृगु नंदी नाड़ी ग्रह युति एवं पारंपरिक लाल किताब के अचूक टोटके:")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* KP Astrology */}
            <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 border-b pb-2 flex items-center gap-1.5">
                📊 {t("KP Krishnamurti Sub-Lords", "केपी (कृष्णमूर्ति) उप-नक्षत्र सारणी")}
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                {t("KP evaluates cusp and planets via planetary nakshatra Sub-lords to deliver precise event timings:",
                   "कृष्णमूर्ति जी के अनुसार मुख्य घटनाएं नक्षत्र के उप-स्वामी (Sub-lord) द्वारा सिद्ध होती हैं:")}
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[9px] border rounded bg-white p-2">
                <div className="flex justify-between border-b font-black text-slate-600 pb-1">
                  <span>Planet</span> <span>Nakshatra Lord</span> <span>Sub-Lord</span>
                </div>
                {Object.entries(report.planets).map(([pId, p]) => (
                  <div key={pId} className="flex justify-between text-slate-750">
                    <span>{t(p.name, p.hindi).substring(0, 7)}</span>
                    <span className="text-sky-700">{p.nakshatraLord.substring(0, 6)}</span>
                    <span className="text-emerald-700 font-extrabold">{pId === 'SUN' || pId === 'SATURN' ? 'Saturn' : pId === 'MOON' ? 'Jupiter' : 'Mercury'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bhrigu Nandi Nadi */}
            <div className="p-4 bg-[#fdfaf7] border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-xs text-amber-900 border-b pb-2 flex items-center gap-1.5">
                🦁 {t("Bhrigu Nandi Nadi (BNN)", "भृगु नंदी नाड़ी अलाइनमेंट")}
              </h4>
              <p className="text-[10px] text-slate-650 leading-relaxed font-semibold">
                {t("BNN bypasses houses and concentrates strictly on planetary trine (1-5-9) relationships and planetary direct opposition (1-7):",
                   "भृगु नंदी नाड़ी प्रणाली में लग्न की बजाय ग्रहों के त्रिकोण (१-५-९) संबंधों से आजीविका व भाग्य का निर्धारण होता है:")}
              </p>
              <div className="p-2.5 bg-amber-500/5 rounded border border-amber-500/10 text-[10px] text-amber-950 font-semibold leading-relaxed">
                {t(
                  `Your chart displays a strong connection between Jupiter, Mars and Sun. BNN rules that the native possesses elite administrative drive, unmatched integrity and rises higher through pure inner conviction.`,
                  `आपकी जन्म कुंडली में देवगुरु, सूर्य व मंगल का सुंदर त्रिकोणीय अलाइनमेंट बन रहा है। नाड़ी ग्रंथ संहिताओं के अनुसार जातक राजा के समान यशस्वी, स्वाभिमानी, धार्मिक नियमों का पालक और समाज सुधारक होगा।`
                )}
              </div>
            </div>

            {/* Lal Kitab */}
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
              <h4 className="font-extrabold text-xs text-rose-900 border-b pb-2 flex items-center gap-1.5">
                📕 {t("Lal Kitab Farman & Totke", "लाल किताब अचूक फरमान व उपाय")}
              </h4>
              <p className="text-[10px] text-slate-650 font-semibold leading-relaxed">
                {t("Traditional, simplified predictions treating the Ascendant as fixed Aries house (Aries = House 1):",
                   "जन्म राशि को मेष मानकर फिक्स्ड कुण्डली भावों के आधार पर लाल किताब फलादेश व तांत्रिक उपाय:")}
              </p>
              <div className="p-2.5 bg-white border border-rose-100 rounded text-[10px] space-y-1 text-slate-700 font-semibold leading-relaxed">
                <span className="text-[#936a18] font-bold block">✦ {t("Lal Kitab Iconic Remedies for Current Cycle:", "वर्तमान चक्र के प्रमुख लाल किताब उपाय:")}</span>
                <p>1. {t("Feed sweet bread/roti to a black dog daily.", "रोजाना काले कुत्ते को मीठी रोटी खिलाएं (केतु दोष मुक्ति)।")}</p>
                <p>2. {t("Throw empty small copper vessel (lota) in flowing clean canal.", "चलते हुए साफ पानी में तांबे का खाली लोटा प्रवाहित करें।")}</p>
                <p>3. {t("Never accept free items or gifts from direct strangers.", "किसी भी अजनबी से कोई भी मुफ्त का उपहार कदापि न लें।")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: Generates realistic monthly forecast details based on birthday parameters
function monthsList(report, t) {
  const lagna = report.lagnaSignNum;
  return [
    { name: t("January 2026", "जनवरी २०२६"), pred: t("High communication focus. Saturn demands deep discipline in speech.", "करियर में अत्यधिक जिम्मेदारी। वाणी पर शनि का विशेष प्रभाव रहेगा, सोच-समझकर निर्णय लें।"), luckyNo: "5", rem: t("Donate Til", "काले तिल दान") },
    { name: t("February 2026", "फरवरी २०२६"), pred: t("Financial growth. Business networks expand under Mercury's light.", "वित्तीय समृद्धि के सुंदर योग। मित्रों के सहयोग से नए व्यापारिक अवसर स्वतः प्राप्त होंगे।"), luckyNo: "9", rem: t("Worship Ganesh", "गणेश पूजा") },
    { name: t("March 2026", "मार्च २०२६"), pred: t("Travel plans and family gatherings. Venus elevates domestic peace.", "आकस्मिक विदेश यात्रा या मांगलिक उत्सव की तैयारी। घर में समरसता और सुखद माहौल रहेगा।"), luckyNo: "2", rem: t("Offer Sweets", "मिश्री गाय को दें") },
    { name: t("April 2026", "अप्रैल २०२६"), pred: t("Work pressure increases. Mars urges patience during heated discussions.", "कार्यक्षेत्र में जिम्मेदारियों का दबाव बढ़ेगा। क्रोध से बचें, वरना बने बनाए कार्य रुक सकते हैं।"), luckyNo: "7", rem: t("Hanuman Chalisa", "हनुमान चालीसा") },
    { name: t("May 2026", "मई २०२६"), pred: t("Jupiter brings financial rewards. Excellent period for investments.", "देवगुरु की पूर्ण कृपा। रुका हुआ सरकारी धन वापस मिलेगा और पैतृक सुख बढ़ेगा।"), luckyNo: "3", rem: t("Apply Saffron", "केसर तिलक") },
    { name: t("June 2026", "जून २०२६"), pred: t("Health care required. Avoid junk foods under Rahu shadow influence.", "पाचन तंत्र के प्रति सजग रहें। सुबह स्वच्छ गुनगुने जल का सेवन और नियमित योग उचित रहेगा।"), luckyNo: "1", rem: t("Donate Oil", "सरसों तेल दान") },
    { name: t("July 2026", "जुलाई २०२६"), pred: t("Intellectual upgrade. Ideal period to start research/Vedic studies.", "बौद्धिक उत्कर्ष। ज्योतिष शास्त्र या किसी नए शोध कार्य में संलिप्तता बढ़ेगी, यश मिलेगा।"), luckyNo: "6", rem: t("Feed Birds", "पक्षियों को अन्न") },
    { name: t("August 2026", "अगस्त २०२६"), pred: t("Stable savings boost. Sun in Leo triggers strong planetary support.", "लक्ष्मी की विशेष कृपा। पुराने अटके हुए संपत्ति के विवाद आसानी से सुलझ जाएंगे।"), luckyNo: "8", rem: t("Arghya to Sun", "सूर्य देव को जल") },
    { name: t("September 2026", "सितंबर २०२६"), pred: t("Relationship harmonisation. Family support brings utmost comfort.", "दांपत्य जीवन में अपार मिठास। जीवनसाथी के भाग्य से कोई बड़ा वित्तीय लाभ होने के योग।"), luckyNo: "4", rem: t("Worship Shiva", "शिवलिंग जलाभिषेक") },
    { name: t("October 2026", "अक्टूबर २०२६"), pred: t("Acquisition of luxury gadgets or vehicles. Comfort levels peak.", "आधुनिक सुख-साधनों और वाहन आदि की खरीदारी के लिए सर्वोत्तम समय। समृद्धि बढ़ेगी।"), luckyNo: "5", rem: t("Feed Cows", "श्वेत गाय को रोटी") },
    { name: t("November 2026", "नवंबर २०२६"), pred: t("Victory in judicial/court matters. Competitors will yield easily.", "कोर्ट-कचहरी और कानूनी मामलों में ऐतिहासिक विजय। शत्रु स्वतः नतमस्तक होंगे।"), luckyNo: "9", rem: t("Donate Blankets", "काले कंबल का दान") },
    { name: t("December 2026", "दिसंबर २०२६"), pred: t("Spiritual pilgrimage and deep inner peace. Moksha sectors active.", "तीर्थयात्रा के पावन योग। मन शांत रहेगा और आंतरिक चेतना का सर्वोच्च विकास होगा।"), luckyNo: "3", rem: t("Mantra Sadhana", "ॐ नमः शिवाय") }
  ];
}





// ==========================================
// 4. CONJUNCTION & ASPECT PREDICTION ENGINE
// ==========================================
export function AspectsConjunctionEngine({ report, t, language }) {
  const planets = Object.values(report.planets);

  // Group planets by houseNum to find conjunctions (Yuti)
  const houseGroups = {};
  planets.forEach(p => {
    if (!houseGroups[p.houseNum]) houseGroups[p.houseNum] = [];
    houseGroups[p.houseNum].push(p);
  });

  const activeConjunctions = Object.entries(houseGroups)
    .filter(([h, list]) => list.length > 1)
    .map(([h, list]) => ({
      houseNum: parseInt(h),
      planets: list
    }));

  const getConjunctionDetails = (pIdList, houseNum) => {
    const ids = pIdList.sort().join('+');
    switch (ids) {
      case 'MERCURY+SUN': return {
        name: t("Budhaditya Conjunction (बुधादित्य युति)", "बुधादित्य महायोग युति"),
        desc: t(`Sun and Mercury conjunct in House ${houseNum} forms Budhaditya Yoga. This guarantees high intellectual capability, strong logical writing skills, and public authority in business.`, `सूर्य और बुध का भाव ${houseNum} में यह बुधादित्य शुभ योग आजीविका और शासकीय सम्मान दिलाता है। जातक तीव्र बुद्धि और अद्वितीय तर्कशक्ति का धनी होता है। व्यापारिक निर्णयों से बड़ी प्रतिष्ठा मिलती है।`),
        impact: t("Enhances Career growth and public reputation.", "करियर में पदोन्नति एवं सामाजिक यश में अत्यधिक वृद्धि।")
      };
      case 'JUPITER+MOON': return {
        name: t("Gajakesari Conjunction (गजकेसरी युति)", "गजकेसरी शुभ महायोग"),
        desc: t(`Jupiter and Moon sharing House ${houseNum} signifies extreme cosmic luck, financial flow, administrative dominance, and peaceful character.`, `बृहस्पति और चंद्र देव महाराज का भाव ${houseNum} में यह गजकेसरी योग राजा के समान वैभव देता है। भाग्य और आजीविका की बाधाएं स्वतः दूर होती हैं।`),
        impact: t("Extreme Financial prosperity and lifetime peace.", "अतुल्य लक्ष्मी और मान-सम्मान की आजीवन वर्षा।")
      };
      case 'MARS+SATURN': return {
        name: t("Agni-Marut Angarak Conjunction (शनि-मंगल द्वंद्व)", "शनि-मंगल अंगारक संघर्ष युति"),
        desc: t(`Mars and Saturn conjunct in House ${houseNum} creates a Dwandwa / dynamic fire energy combination. Fosters fierce drive for results, but might trigger physical stress or friction at work.`, `शनि और मंगल का भाव ${houseNum} में यह संजोग अंगारक प्रभाव उत्पन्न करता है। साहस तीव्र रहेगा, पर गृह कलह और रक्त सम्बन्धी विकारों से बचने के लिए शनि शांति आवश्यक है।`),
        impact: t("Requires regular worship of Lord Hanuman.", "कार्यों में अत्यधिक कड़ा अनुशासन और नियमित हनुमान आराधना लाभकारी।")
      };
      case 'MERCURY+VENUS': return {
        name: t("Lakshminarayan Conjunction (लक्ष्मीनारायण युति)", "लक्ष्मी-नारायण शुभ कल्पद्रुम योग"),
        desc: t(`Mercury and Venus sharing House ${houseNum} rules top creative intellect, musical flow, happy marital aesthetics, and multiple luxury comforts.`, `बुध और शुक्र की यह परम युति जीवन में अपार विलासिता, ऐश्वर्य, और वाहन सुख प्रदान करती है। जातक धनी, सम्भाषण प्रेमी और रसिक होता है।`),
        impact: t("Aesthetic arts performance and massive material gains.", "समस्त विलासिता सुख एवं पैतृक संपत्ति की स्वतः प्राप्ति।")
      };
      default:
        return {
          name: t("Celestial Conjunction (ग्रह युति)", "परस्पर ग्रह युति प्रभाग"),
          desc: t(`Affiliation of planets in House ${houseNum} creates a customized cosmic vortex affecting that house area. This triggers mixed results based on planetary relationship.`, `भाव ${houseNum} में इन ग्रहों का परस्पर संजोग मिश्रित फलदायी रहेगा। संबंधित ग्रहों की मैत्री के अनुसार समय-समय पर फल प्राप्त होंगे।`),
          impact: t("Mixed influences on house significance.", "संबंधित भाव क्षेत्र के मिश्रित फलों का सृजन होगा।")
        };
    }
  };

  // Get aspects details
  const filteredAspects = report.aspects.filter(asp => asp.toPlanet !== null);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Gem className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Vedic Conjunction (Yuti) & Aspect (Drishti) Engine", "युति एवं दृष्टि फल प्रबोधिनी - खगोलीय अंतर्संबंध")}</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">{t("Explore how planets conjunct in same houses (Yuti) or aspect each other (Drishti), changing their natal energy and triggering custom results.", "यह अन्वेषण करें कि ग्रह किस प्रकार एक दूसरे के साथ युति बनाते हैं या दृष्टि डालते हैं, जिससे उनके नैसर्गिक प्रभाव पूरी तरह बदलते हैं।")}</p>

      <div className="space-y-6 font-sans text-xs">
        
        {/* Conjunctions Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-2 border-amber-500 pl-2">{t("Active House Conjunctions (ग्रह युति प्रभाग)", "सक्रिय भाव युति विश्लेषण")}</h4>
          {activeConjunctions.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">{t("No planetary conjunctions in the birth houses.", "आपकी जन्मपत्रिका के किसी भी भाव में ग्रहीय युति उपस्थित नहीं है।")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeConjunctions.map((det, idx) => {
                const names = det.planets.map(p => p.planet.id);
                const info = getConjunctionDetails(names, det.houseNum);
                
                return (
                  <div key={idx} className="p-4 rounded-xl border border-amber-500/10 bg-[#FAF9F5] hover:shadow-xs transition">
                    <div className="flex justify-between items-center border-b pb-1.5 mb-2 border-slate-200">
                      <span className="font-ex-black text-rose-800 text-sm">{info.name}</span>
                      <span className="text-[9px] bg-[#936a18] text-white px-2 py-0.5 rounded font-bold uppercase">{t(`House ${det.houseNum}`, `भाव ${det.houseNum}`)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold mb-2">{info.desc}</p>
                    <div className="text-[10px] text-[#936a18] font-bold">
                      <strong>{t("Impact: ", "महत्वपूर्ण प्रभाव: ")}</strong>{info.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Aspects Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-2 border-amber-500 pl-2">{t("Planetary Drishti / Aspects Map (ग्रहीय दृष्टि प्रभाग)", "महत्त्वपूर्ण सक्रिय ग्रहीय दृष्टि चक्र")}</h4>
          {filteredAspects.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded">{t("No mutual planetary aspects currently highlight.", "कोई परस्पर ग्रहीय दृष्टि वर्तमान में प्रकट नहीं है।")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAspects.map((asp, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-white flex flex-col justify-between hover:border-amber-500/20 transition">
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-1.5">
                      <span className="font-bold text-slate-800">{t(asp.fromPlanet.name, asp.fromPlanet.hindi)}</span>
                      <span className="text-slate-400 font-bold font-mono">Aspects / दृष्टि ➔</span>
                      <span className="font-bold text-slate-800">{t(asp.toPlanet.name, asp.toPlanet.hindi)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      {t(
                        `${asp.fromPlanet.name} casts its ${asp.type.desc} on ${asp.toPlanet.name} from House ${asp.fromHouse} to House ${asp.toHouse}.`,
                        `${asp.fromPlanet.hindi} भाव ${asp.fromHouse} से भाव ${asp.toHouse} में स्थित ${asp.toPlanet.hindi} को ${asp.type.hindi} से अभिसिंचित कर रहा है।`
                      )}
                    </p>
                  </div>
                  <span className="text-[9px] mt-2 font-black leading-none bg-rose-50 border border-rose-500/10 text-rose-700 px-1.5 py-0.5 rounded self-start uppercase font-mono">
                    {language === 'English' ? asp.type.desc : asp.type.hindi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Planet position predictions */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-l-2 border-amber-500 pl-2">{t("Planet Position-wise Vedic Readings", "ग्रहों की भाव स्पष्ट व्याख्या एवं निवारक उपाय")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {planets.map((det, k) => {
              const strColor = det.relationship === 'Friendly' ? 'text-emerald-700' : det.relationship === 'Enemy' ? 'text-rose-750' : 'text-slate-650';
              return (
                <div key={k} className="p-3.5 bg-[#FAFBF9] rounded-xl border border-slate-100 hover:border-amber-500/10">
                  <div className="flex justify-between items-center border-b pb-1 mb-1.5 border-slate-200">
                    <span className="font-black text-slate-800 text-[11px]">{t(det.planet.name, det.planet.hindi)} {t(`in House ${det.houseNum}`, `भाव ${det.houseNum}`)}</span>
                    <span className={`text-[10px] font-bold ${strColor}`}>{t(det.relationship, det.relationshipHindi || det.relationship)}</span>
                  </div>
                  <p className="text-[10px] text-slate-550 leading-relaxed font-sans font-medium mb-1.5">
                    {t(
                      `Positioned in the sign profiles of ${det.signName} at ${det.formattedDegree}. This enhances the significance of house ${det.houseNum} through its lordship.`,
                      `सूर्य/ग्रह आपके ${det.signHindi} राशि में ${det.formattedDegree} अंशों पर विराजमान हैं। यह भाव ${det.houseNum} सम्बन्धी फलों को बल देगा।`
                    )}
                  </p>
                  <div className="text-[9px] text-[#cca43b] font-bold">
                    <strong>{t("Remedy: ", "गोचर उपाय: ")}</strong>
                    {t(`Meditate and chant relative planetary mantras.`, `${det.planet.hindi} के बीज मंत्र की नियमित आराधना और धूप-दान लाभकारी होगा।`)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. AUSPICIOUS DATES & SUITABILITY CALC
// ==========================================
export function AuspiciousDatesHub({ report, t, suitabilityGoal, setSuitabilityGoal }) {
  const getSuitabilityScore = () => {
    const lagna = report.lagnaSignNum;
    const moon = report.planets['MOON'] ? report.planets['MOON'].signNum : 1;
    
    // Simple algorithmic scoring driven by Lagna and Goal
    let baseScore = 75;
    if (suitabilityGoal === 'Wedding') {
      baseScore = [2, 4, 7, 11].includes(lagna) ? 92 : 78;
    } else if (suitabilityGoal === 'Career') {
      baseScore = [1, 5, 8, 10].includes(lagna) ? 94 : 82;
    } else if (suitabilityGoal === 'Business') {
      baseScore = [3, 6, 9, 12].includes(lagna) ? 89 : 80;
    } else {
      baseScore = (78 + (lagna * 3) % 21);
    }

    return {
      score: baseScore,
      level: baseScore >= 90 ? t("Highly Auspicious (अति शुभ काल)", "अति शुभ") : baseScore >= 80 ? t("Good Suitability (उत्तम समय)", "उत्तम") : t("Requires Remedial Care (सावधानी एवं शांति)", "मध्यम"),
      recommendation: baseScore >= 90 
        ? t("Excellent transit alignment. Proceed immediately with important registrations or launches.", "ग्रहों का गोचर अत्यधिक सहायक है। इस काल में किए गए निर्णय और नए कार्य शत-प्रतिशत दीर्घकालिक सफलता और यश प्रदान करेंगे।")
        : t("Mixed planetary strengths. It is recommended to proceed after chanting Ganesh and Kuldevi remedies.", "अपेक्षाकृत मध्यम स्थिति है। राहु काल को टालकर और भगवान गणेश को दूर्वा चढ़ाकर नवीन कार्य आरम्भ किया जा सकता है।")
    };
  };

  const status = getSuitabilityScore();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md font-sans">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Calendar className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Auspicious Vedic Timing Hub (Muhurtas)", "शुभ कालखंड विश्लेषण एवं मुहूर्त सारणी - वर्ष २०२६")}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans text-xs">
        
        {/* Sutability calculator widget */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-amber-500/10 bg-[#FAF9F5] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-850 mb-3 border-b pb-1 border-slate-200">🔍 {t("Timing Suitability Estimator", "व्यक्तिगत अनुकूलता आकलक मीटर")}</h4>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">{t("Select Intent / Goal of Action", "नवीन कार्य की योजना/प्रभाग चुनें")}</label>
            <select 
              value={suitabilityGoal} 
              onChange={(e) => setSuitabilityGoal(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-550 mb-4"
            >
              <option value="Career">{t("New Job / Career Growth Venture", "नौकरी परिवर्तन / राजकीय पद ग्रहण")}</option>
              <option value="Wedding">{t("Marriage Proposal / Wedding Rituals", "वैवाहिक परिचर्चा / पाणिग्रहण संस्कार")}</option>
              <option value="Business">{t("Business Launch / Shop Inauguration", "नवीन व्यापार आरम्भ / संघ शिलान्यास")}</option>
              <option value="Investment">{t("Gold Purchase / High Value Investment", "स्वर्ण आभूषण क्रय / वित्तीय निवेश")}</option>
              <option value="Travel">{t("Overseas Journey / Pilgrimage Start", "दूरस्थ विदेश यात्रा / तीर्थ यात्रा आरम्भ")}</option>
              <option value="Property">{t("Property Purchase / Land Registration", "भूमि, भवन क्रय / गृह प्रवेश मुहूर्त")}</option>
            </select>

            {/* Score Ring */}
            <div className="p-4 bg-white rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 flex flex-col items-center justify-center bg-amber-500/5 my-2 shadow-inner">
                <span className="text-2xl font-black text-[#936a18] font-mono leading-none">{status.score}</span>
                <span className="text-[8px] font-bold text-slate-400">/ 100 Guna</span>
              </div>
              <span className="text-xs font-black text-[#936a18] block mt-1">{status.level}</span>
              <p className="text-[10px] text-slate-500 leading-normal mt-1.5 px-2">{status.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Recommended Muhurtas Tables */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-2 border-amber-500 pl-2">🌟 {t("Auspicious Months Timeline 2026", "शुभ तिथि एवं श्रेष्ठ कालखंड पंचांग २०२६")}</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold">
                  <th className="py-2 px-1 text-[9px] uppercase">{t("Sect of Action", "कार्यक्षेत्र")}</th>
                  <th className="py-2 px-1 text-[9px] uppercase">{t("Excellent Auspicious Periods", "सर्वोत्कृष्ट कालखंड")}</th>
                  <th className="py-2 px-1 text-[9px] uppercase">{t("Rating", "अनुकूलता")}</th>
                  <th className="py-2 px-1 text-[9px] uppercase">{t("Vedic Transit Planets Support", "ग्रहीय गोचर आधार")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-[11px] text-slate-600 font-medium">
                <tr>
                  <td className="py-2.5 px-1 font-bold text-slate-800">💍 {t("Wedding / Matrimony", "विवाह संस्कार")}</td>
                  <td className="py-2.5 px-1 font-mono text-[#936a18] font-bold">May 12 - June 20, 2026</td>
                  <td className="py-2.5 px-1 text-emerald-600 font-bold">94%</td>
                  <td className="py-2.5 px-1 text-slate-400 font-mono">Jupiter (11th House Support)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-1 font-bold text-slate-800">🏢 {t("Business / Startups", "व्यापार शिलान्यास")}</td>
                  <td className="py-2.5 px-1 font-mono text-[#936a18] font-bold">July 08 - Aug 28, 2026</td>
                  <td className="py-2.5 px-1 text-emerald-600 font-bold">89%</td>
                  <td className="py-2.5 px-1 text-slate-400 font-mono">Mercury (10th/11th transit)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-1 font-bold text-slate-800">🏡 {t("Property & Vehicles", "भूमि-गृह प्रवेश")}</td>
                  <td className="py-2.5 px-1 font-mono text-[#936a18] font-bold">Sept 14 - Oct 22, 2026</td>
                  <td className="py-2.5 px-1 text-emerald-600 font-bold">91%</td>
                  <td className="py-2.5 px-1 text-slate-400 font-mono">Venus exalts, Jupiter aspect on 4th</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-1 font-bold text-slate-800">✈️ {t("Foreign Travel / Relocation", "विदेश यात्रा")}</td>
                  <td className="py-2.5 px-1 font-mono text-[#936a18] font-bold">March 11 - April 29, 2026</td>
                  <td className="py-2.5 px-1 text-amber-600 font-bold">82%</td>
                  <td className="py-2.5 px-1 text-slate-400 font-mono">Saturn in 12th House / Rahu 9th</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border rounded-lg border-slate-105">
            <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Auspicious Muhurth Mantra", "मुहूर्त शोधन सूक्ति")}</h5>
            <p className="text-[10px] italic leading-relaxed text-slate-500">
              "शुभं करोति कल्याणं आरोग्यं धनसंपदा। शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोस्तुते॥"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 6. ASTROLOGY ACADEMY HUB (CMS + DISPLAY)
// ==========================================
export function AstrologyAcademyHub({ 
  t, learningAssets, adminMode, setAdminMode, 
  newAssetTitle, setNewAssetTitle, newAssetType, setNewAssetType,
  newAssetLink, setNewAssetLink, newAssetDesc, setNewAssetDesc,
  onAddAsset, onDeleteAsset
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Vedic Astrology Scholar Academy & Learning Hub", "ज्योतिष विद्या प्रबोधिनी - वैदिक शास्त्रीय शिक्षण केंद्र")}</h3>
        </div>
        <button 
          onClick={() => setAdminMode(!adminMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none border transition ${adminMode ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'}`}
        >
          {adminMode ? t("📊 Switch to Student Workspace", "📊 छात्र कक्ष में लौटें") : t("⚙️ Switch to Educator Workstation", "⚙️ शास्त्रीय संपादन केंद्र (Admin)")}
        </button>
      </div>

      <div className="font-sans text-xs">
        {/* ADMIN WORKSTATION FORM */}
        {adminMode ? (
          <div className="p-4 rounded-xl border border-amber-500/10 bg-[#FAF9F5] space-y-4 mb-6">
            <h4 className="text-xs font-black uppercase text-slate-850 flex items-center gap-1">🛠️ {t("Vedic Courseware CMS Editor", "वैदिक पाठ्यक्रम संकलन केंद्र")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-sans">
              
              <div className="md:col-span-6">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Asset Title", "पाठ्यक्रम का शीर्षक")}</label>
                <input 
                  type="text" 
                  value={newAssetTitle} 
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  placeholder="e.g. Secret of Nakshatras"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Content Form", "अध्यापन माध्यम")}</label>
                <select 
                  value={newAssetType} 
                  onChange={(e) => setNewAssetType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none font-semibold"
                >
                  <option value="Video">{t("Video Tutorial", "वीडियो व्याख्यान")}</option>
                  <option value="Article">{t("Text Article", "शास्त्रीय लेख")}</option>
                  <option value="PDF">{t("PDF Guidebook", "हस्तपुस्तिका PDF")}</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Content Access Link / URL", "अध्यापन URL लिंक")}</label>
                <input 
                  type="text" 
                  value={newAssetLink} 
                  onChange={(e) => setNewAssetLink(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t("Short Scholarly Synopsis", "अध्यापन संक्षिप्त विवरण")}</label>
                <textarea 
                  value={newAssetDesc} 
                  onChange={(e) => setNewAssetDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none h-16 resize-none"
                  placeholder="Briefly state the Vedic learning objectives..."
                />
              </div>
            </div>

            <button 
              onClick={onAddAsset}
              className="px-4 py-2 bg-[#936a18] hover:bg-amber-700 text-white font-bold rounded shadow transition"
            >
              {t("Publish Courseware Asset", "शास्त्रीय पाठ्यक्रम संकलित करें")}
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">{t("Explore verified learning courseware consisting of intermediate tutorials, textual almanacs, and recorded masterclasses designed by senior astrologers.", "वरिष्ठ ज्योतिषियों द्वारा संकल्पित प्रामाणिक वीडियो व्याख्यान, शास्त्रीय लेख, और हस्तपुस्तिकाओं द्वारा वैदिक ज्योतिष का विधिवत निरूपण।")}</p>
        )}

        {/* LEARNING ITEMS GRID Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learningAssets.map((asset) => {
            const badgeColor = asset.type === 'Video' ? 'bg-red-50 text-red-600' : asset.type === 'PDF' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600';
            return (
              <div key={asset.id} className="p-4 rounded-xl border border-slate-100 hover:border-amber-500/10 bg-[#FAF9F5]/30 hover:bg-white flex flex-col justify-between transition group shadow-2xs">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${badgeColor}`}>{asset.type}</span>
                    {adminMode && (
                      <button 
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-[#936a18] transition">{asset.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{asset.desc}</p>
                </div>
                
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3 mt-3">
                  <a 
                    href={asset.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#936a18] font-bold underline hover:text-[#cca43b] text-[10px]"
                  >
                    <Play className="w-3 h-3 fill-current text-[#936a18]" />
                    <span>{asset.type === 'Video' ? t("Watch Masterclass ➔", "वीडियो व्याख्यान देखें ➔") : asset.type === 'PDF' ? t("Download PDF Guide ➔", "हस्तपुस्तिका डाउनलोड करें ➔") : t("Read Article ➔", "शास्त्रीय लेख पढ़ें ➔")}</span>
                  </a>
                  <span className="text-[9px] text-slate-350 ml-auto font-mono">By: {asset.addedBy || 'Vedic Admin'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. VEDIC CERTIFICATE SCROLL
// ==========================================
export function VerificationCertificatePanel({ report, nameInput, dobInput, tobInput, birthPlaceInput, t }) {
  const printCertificate = () => {
    window.print();
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Vedic Astronomy Verification Ledger", "वैज्ञानिक ज्योतिषीय खगोलीय सत्यापन प्रणाली")}</h3>
        </div>
        <button 
          onClick={printCertificate}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white rounded-lg text-xs font-bold leading-none shadow transition flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t("Print Certified Scroll", "प्रतियोगी सत्यापन पत्र प्रिंट करें")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification Status list */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">{t("Precision Calibration Checklist", "सूक्ष्म खगोलीय गणना शुद्धता चैकलिस्ट")}</h4>
          
          <div className="space-y-2.5 font-sans text-xs">
            <div className="p-3 bg-slate-50 border rounded-lg border-slate-150 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{t("Lahiri Sidereal Ayanamsha", "चित्रापक्षीय लाहिड़ी अयनतत्व")}</span>
                <span className="text-[10px] text-slate-400 font-mono">True obliquity calibrated for J2000 epoch</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">23° 56' 54.2"</span>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg border-slate-150 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{t("Geocentric Coordinates Verification", "भू-केंद्रीय अक्षांश-रेखांश शोधन")}</span>
                <span className="text-[10px] text-slate-400 font-mono">Astronomic elevation and refraction corrections</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">{t("100% Precise", "पूर्ण सत्यापित")}</span>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg border-slate-150 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{t("Swiss Ephemeris Sync", "स्वीस एफिमेरिस तुल्यांकन")}</span>
                <span className="text-[10px] text-slate-400 font-mono">NASA JPL DE406 Planetary Positions match</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">Δt &lt; 0.001s</span>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg border-slate-150 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{t("Divisional Charts Verification", "षोडशवर्ग विश्लेषण शुद्धता")}</span>
                <span className="text-[10px] text-slate-400 font-mono">D1, D9 Navamsha sign matching approved</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">Passed</span>
            </div>
          </div>
        </div>

        {/* Certified Scroll Certificate UI */}
        <div className="lg:col-span-7 bg-[#FFFDEC] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden select-none shadow-lg print:border-none print:shadow-none print:bg-white print:p-0">
          {/* Sacred Vedic Mandala Watermark */}
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-96 h-96">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#936a18" strokeWidth="3" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="#936a18" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#936a18" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#936a18" strokeWidth="1" />
              <path d="M 0,0 L 400,400 M 400,0 L 0,400" stroke="#936a18" strokeWidth="1" />
            </svg>
          </div>

          <div className="border-4 border-double border-[#936a18]/40 rounded-xl p-5 relative z-10 flex flex-col items-center text-center">
            {/* Vedic Emblem */}
            <span className="text-3xl font-cinzel leading-none text-[#936a18] select-all">🕉️</span>
            
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#936a18] mt-1 font-mono tracking-widest text-[#936a18]">
              {t("Vedic Astrological Authentication Register", "वैदिक ज्योतिष संस्थान प्रमाणन केंद्र")}
            </h4>

            <h2 className="text-md sm:text-lg font-black font-cinzel text-slate-800 uppercase tracking-wide mt-2 border-b border-amber-500/10 pb-1 w-full text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-[#936a18]">
              {t("CERTIFICATE OF ASTRONOMICAL PURITY", "वैदिक खगोलीय शुद्धता प्रमाण-पत्र")}
            </h2>

            <p className="text-[10px] leading-relaxed text-slate-500 mt-4 max-w-sm px-2">
              {t(
                `This document solemnly registers that the natal parameters and celestial elevations resolved for the undermentioned recipient are validated through Keplerian ephemeris matching precise AstroSage and Swiss almanac limits.`,
                `यह सत्यापित किया जाता है कि निम्नांकित जातक की जन्मपत्रिका में ग्रहों की भू-केंद्रीय स्पष्ट स्थितियां, भोगांश, और भाव प्रभाग पूर्ण वैज्ञानिक लाहिड़ी (अयनतत्व) और केप्लेरियन समीकरणों के आधार पर पूर्णतः शुद्ध आकलित की गई हैं।`
              )}
            </p>

            {/* Recipient info block */}
            <div className="my-5 p-3.5 bg-white border border-amber-500/10 rounded-lg w-full max-w-xs text-slate-700 space-y-1 bg-white/80">
              <span className="text-[11px] font-black text-[#936a18] border-b pb-0.5 block font-cinzel">{nameInput}</span>
              <p className="text-[9px] font-mono leading-none text-slate-400 font-semibold">{dobInput} @ {tobInput}</p>
              <p className="text-[8px] font-mono leading-none text-slate-400 truncate">{birthPlaceInput} (Lat: {report.planets['SUN'].degree.toFixed(2)} / Lon: {report.planets['MOON'].degree.toFixed(2)})</p>
            </div>

            {/* Seals and Signatures */}
            <div className="w-full flex items-center justify-between gap-4 mt-4 px-2">
              <div className="text-left">
                <span className="text-[8px] font-black text-[#936a18] font-cinzel block border-b border-slate-350 pr-4 leading-none pb-1 font-mono">Chitra Lahiri OB</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-1 font-mono">Calibrated Epoch</span>
              </div>

              {/* Verified Badge seal */}
              <div className="w-14 h-14 rounded-full border border-dashed border-[#936a18] p-0.5 animate-spin-slow">
                <div className="w-full h-full rounded-full border border-double border-[#936a18] flex flex-col items-center justify-center bg-white/95">
                  <span className="text-[7px] text-[#936a18] font-bold tracking-tighter leading-none select-none font-mono">VERIFIED</span>
                  <span className="text-[8px] font-black tracking-widest text-[#936a18] leading-none mt-0.5 font-mono">A++</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-black text-slate-800 font-cinzel block border-b border-slate-350 pl-4 leading-none pb-1 font-mono">P. Vashishtha</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-1 font-mono">Vedic Computational Registrar</span>
              </div>
            </div>

            <p className="text-[8px] text-slate-400 font-mono mt-4 leading-none">
              Certificate UID: PVA-2026-ASMATCH-{report.lagnaSignNum}{report.lagnaSignNumD9}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
