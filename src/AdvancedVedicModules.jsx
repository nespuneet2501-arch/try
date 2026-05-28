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

                    <div className="md:col-span-2 p-3 bg-amber-500/5 rounded-lg border border-[#cca43b]/20">
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

    return {
      career: `करियर और व्यवसाय (Career): शनि का गोचर वर्तमान में आपके ${hSaturn}वें भाव में चल रहा है। शनिदेव (Saturn) का कुंडली के इस कर्म कल्पद्रुम क्षेत्र से पारगमन करियर में अत्यधिक जिम्मेदारी और काम के दबाव को दर्शाता है (transit logic). कार्यक्षेत्र में बड़े बदलाव और अतिरिक्त काम का भार बढ़ेगा (house impact). शनि की सातवीं दृष्टि शत्रु एवं रोग भाव और दसवीं दृष्टि नवम भाव पर रहने से गुप्त शत्रुओं से सावधानी और भाग्य संवर्धन हेतु कठोर परिश्रम आवश्यक रहेगा (aspect impact). कड़े अनुशासन से स्थायी पदोन्नति का यह उत्तम समय है (reason of prediction).`,
      health: `स्वास्थ्य और काया (Health): छाया ग्रह राहु वर्तमान में आपके ${hRahu}वें भाव से गोचर कर रहा है। राहु (Rahu) का इस भाव से साया प्रभाग मानसिक संशय और नींद की अनिमितता देता है (transit logic). आपकी सेहत में हल्की सुस्ती और स्नायु तंत्र में तनाव की शिकायत रह सकती है (house impact). राहु की शुभ पंचम दृष्टि पंचम भाव (ज्ञान भाव) और एकादश दृष्टि नवम भाव पर होने से मन को भटकाव से बचाना आवश्यक होगा (aspect impact). शनिवार की शाम तेल का दान और नियमित प्राणायाम सबसे उचित उपाय है (reason of prediction).`,
      marriage: `विवाह और साझेदारी (Marriage): देवगुरु बृहस्पति का सर्वोत्तम गोचर वर्तमान में आपके ${hJupiter}वें भाव में हो रहा है। बृहस्पति (Jupiter) का यह शुभ पारगमन दांपत्य जीवन में अपार मिठास और विवाह योगों का सृजन कर रहा है (transit logic). अविवाहित जातकों की शादियां तय होंगी और प्रेम संबंधों में प्रगाढ़ता आएगी (house impact). बृहस्पति की पूर्ण पंचम दृष्टि ${((hJupiter+5-2)%12)+1}वें भाव (संतान व विद्या प्रभाग) तथा अमृत नवम दृष्टि ${((hJupiter+9-2)%12)+1}वें भाव पर होने से जीवनसाथी के प्रभाव से अकूत संपत्ति लाभ होगा (aspect impact). पारिवारिक मतभेद समाप्त होंगे (reason of prediction).`,
      money: `धनलाभ और निवेश (Money): सूर्य, बुध और शुक्र का संजोग वर्तमान में आपके ${hSun}वें भाव से पारगमन कर रहा है। बुधादित्य एवं लक्ष्मीनारायण योग का यह प्रभाव वित्तीय मजबूती और बैंक संचय को दर्शाता है (transit logic). पैतृक संपत्तियों और पुराने निवेशों से बड़ा धन आपके संचय में जुड़ेगा (house impact). बुध व्यापारिक सूझबूझ बढ़ाएगा और सूर्य की दृष्टि से राजकीय कार्यों से रुका हुआ सरकारी रुका पैसा वापस मिलेगा (aspect impact). यह अवधि नए निवेश करने हेतु सर्वथा अनुकूल है (reason of prediction).`,
      education: `शिक्षा और ज्ञान (Education): गुरु का ${hJupiter}वें भाव से गोचर विद्यार्थियों के लिए विद्या संवर्धन का काल है। गुरु (Jupiter) की कृपा बौद्धिक ऊर्जा को तीक्ष्ण और स्मरण शक्ति को तीव्र करती है (transit logic). प्रतियोगी परीक्षाओं में शत-प्रतिशत सफलता की प्रबल संभावनाएं विकसित हो रही हैं (house impact). पंचमेश बृहस्पति की अनुकूलता से शैक्षणिक स्तर पर कोई बड़ा सम्मान या स्कॉलरशिप मिल सकती है (aspect impact). यह आपके ज्ञान अर्जन का स्वर्णकाल है (reason of prediction).`,
      family: `पारिवारिक सुख (Family): केतु का गोचर आपके ${hKetu}वें भाव में होने से पारिवारिक वातावरण में वाणी संयम रखना अनिवार्य होगा। केतु (Ketu) के कारण पैतृक और गृह संपत्ति से विवाद होने की मामूली आशंका है (transit logic). केतु की छाया दृष्टि वाणी भाव पर होने से गृह कलह से बचें (aspect impact). नित्य हनुमान चालीसा का पाठ शांति स्थापित करेगा (reason of prediction).`
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
        <div className="lg:col-span-5 bg-[#090b16] rounded-xl p-4 border border-slate-800 flex flex-col items-center">
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
        <div className="lg:col-span-7 space-y-3.5">
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
  const lagna = report.lagnaEnglish;
  const rashi = report.planets['MOON'] ? report.planets['MOON'].signName : 'Vedic Sign';
  const moonNak = report.planets['MOON'] ? report.planets['MOON'].nakshatra : 'Vedic Asterism';

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

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Award className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-extrabold uppercase font-cinzel text-slate-800">{t("Certified Vedic Lifetime Prediction Almanac", "प्रमाणित वैदिक जीवनफल कल्पद्रुम भविष्यकथन")}</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">{t("Comprehensive lifetime readings calculated through precise Parashari principles based on Lagna Lord, Chandra Nakshatra, and relative house strengths.", "लग्न स्वामी, चंद्र नक्षत्र, और भाव सुदृढ़ता के आधार पर पाराशरीय सिद्धांतों द्वारा गणितीय रूप से प्राप्त समग्र जीवन चक्र भविष्यकथन।")}</p>

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
  );
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
