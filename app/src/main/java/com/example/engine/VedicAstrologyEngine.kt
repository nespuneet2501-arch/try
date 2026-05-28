package com.example.engine

import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import kotlin.math.abs

data class Planet(val id: String, val name: String, val hindi: String)

val planetsList = listOf(
    Planet("SUN", "Sun", "सूर्य"),
    Planet("MOON", "Moon", "चन्द्र"),
    Planet("MARS", "Mars", "मंगल"),
    Planet("MERCURY", "Mercury", "बुध"),
    Planet("JUPITER", "Jupiter", "बृहस्पति"),
    Planet("VENUS", "Venus", "शुक्र"),
    Planet("SATURN", "Saturn", "शनि"),
    Planet("RAHU", "Rahu", "राहू"),
    Planet("KETU", "Ketu", "केतु")
)

val signNamesEnglish = listOf(
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
)

val signNamesHindi = listOf(
    "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
)

data class PlanetDetail(
    val planet: Planet,
    val degree: Double,
    val signNum: Int,
    val signName: String,
    val signHindi: String,
    val houseNum: Int,
    val rashiLord: String,
    val rashiLordHindi: String,
    val status: String,
    val retrograde: Boolean,
    val combust: Boolean,
    val nakshatra: String,
    val nakshatraLord: String,
    val strengthPct: Int
)

data class AspectType(val name: String, val color: String)

data class Aspect(
    val fromPlanet: Planet,
    val toPlanet: Planet,
    val fromHouse: Int,
    val toHouse: Int,
    val type: AspectType
)

data class DashaPeriod(
    val lord: String,
    val lordHindi: String,
    val startYear: Int,
    val endYear: Int,
    val subDashas: List<String>,
    val subDashasEng: List<String>
)

data class Yoga(
    val nameEng: String,
    val nameHindi: String,
    val present: Boolean,
    val description: String,
    val descriptionHindi: String,
    val effect: String,
    val effectHindi: String
)

data class AstrologyReport(
    val lagnaSignNum: Int,
    val lagnaHindi: String,
    val lagnaEnglish: String,
    val planets: Map<String, PlanetDetail>,
    val aspects: List<Aspect>,
    val dashas: List<DashaPeriod>,
    val yogas: List<Yoga>,
    val mangalDosha: String,
    val mangalDoshaStatus: String,
    val kaalSarpDosha: String,
    val sadeSati: String
)

data class GunaMatchDetail(
    val name: String,
    val points: Double,
    val max: Int,
    val desc: String
)

data class MatchmakingReport(
    val score: Int,
    val level: String,
    val recommendation: String,
    val gunDetails: List<GunaMatchDetail>
)

data class PanchangReport(
    val tithi: String,
    val nakshatra: String,
    val yoga: String,
    val karana: String,
    val sunrise: String,
    val sunset: String,
    val abhijit: String,
    val rahukaal: String
)

object VedicAstrologyEngine {

    fun calculateAstrology(name: String, dob: String, tob: String, latitude: Double, longitude: Double): AstrologyReport {
        // Generate pseudo-deterministic values using name and DOB as key seed
        val dSeed = try {
            val date = LocalDate.parse(dob, DateTimeFormatter.ISO_LOCAL_DATE)
            date.dayOfMonth + date.monthValue * 30 + date.year + name.length
        } catch (e: Exception) {
            45 + name.length
        }

        // 1. Calculate Ascendant (Lagna) Sign (1 to 12)
        val latOffset = (latitude.toInt() % 12 + 12) % 12
        val lagnaSignNum = ((dSeed + latOffset) % 12) + 1
        val lagnaEnglish = signNamesEnglish[lagnaSignNum - 1]
        val lagnaHindi = signNamesHindi[lagnaSignNum - 1]

        // 2. Planets Longitudes and details
        val details = mutableMapOf<String, PlanetDetail>()
        val startH = (dSeed % 12) + 1

        planetsList.forEachIndexed { i, pl ->
            val pSeed = dSeed + i * 37
            val rawDeg = (pSeed % 300) / 10.0 // 0 to 30 deg
            val signNum = ((startH + i) % 12) + 1
            
            // House offset from Lagna
            val houseNum = ((signNum - lagnaSignNum + 12) % 12) + 1
            
            val rashiLordIndex = (signNum - 1) % 7 // simplified lord lookup
            val lordsEng = listOf("Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn")
            val lordsHindi = listOf("सूर्य", "चन्द्र", "मंगल", "बुध", "बृहस्पति", "शुक्र", "शनि")
            
            val nakshatras = listOf("Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni")
            val nakLord = lordsEng[i % 7]

            // combust / retrograde
            val retro = i > 1 && (pSeed % 5) == 2
            val comb = i > 0 && abs(rawDeg - 15.0) < 5.0 && (pSeed % 4) == 1

            val strength = 45 + (pSeed % 46) // 45% to 90%

            details[pl.id] = PlanetDetail(
                planet = pl,
                degree = rawDeg,
                signNum = signNum,
                signName = signNamesEnglish[signNum - 1],
                signHindi = signNamesHindi[signNum - 1],
                houseNum = houseNum,
                rashiLord = lordsEng[rashiLordIndex],
                rashiLordHindi = lordsHindi[rashiLordIndex],
                status = if (strength > 75) "Exalted" else if (strength < 55) "Debilitated" else "Neutral",
                retrograde = retro,
                combust = comb,
                nakshatra = nakshatras[pSeed % nakshatras.size],
                nakshatraLord = nakLord,
                strengthPct = strength
            )
        }

        // 3. Aspects formulas
        val aspects = mutableListOf<Aspect>()
        val aspectTypeFull = AspectType("Full Aspect (पूर्ण दृष्टि)", "#ffa726")
        val aspectTypeTrine = AspectType("Special Aspect (विशेष दृष्टि)", "#cca43b")

        // Mars, Jupiter, Saturn have special aspects in Vedic Astrology
        details["JUPITER"]?.let { jup ->
            // Jupiter aspects 5, 7, 9 houses relative to itself
            val houses = listOf(5, 7, 9)
            houses.forEach { h ->
                val targetH = (jup.houseNum + h - 1) % 12 + 1
                val targetPl = details.values.find { it.houseNum == targetH }
                if (targetPl != null) {
                    aspects.add(Aspect(jup.planet, targetPl.planet, jup.houseNum, targetH, aspectTypeTrine))
                }
            }
        }

        details["MARS"]?.let { mars ->
            // Mars aspects 4, 7, 8 houses from itself
            val houses = listOf(4, 7, 8)
            houses.forEach { h ->
                val targetH = (mars.houseNum + h - 1) % 12 + 1
                val targetPl = details.values.find { it.houseNum == targetH }
                if (targetPl != null) {
                    aspects.add(Aspect(mars.planet, targetPl.planet, mars.houseNum, targetH, aspectTypeTrine))
                }
            }
        }

        details["SATURN"]?.let { sat ->
            // Saturn aspects 3, 7, 10 houses from itself
            val houses = listOf(3, 7, 10)
            houses.forEach { h ->
                val targetH = (sat.houseNum + h - 1) % 12 + 1
                val targetPl = details.values.find { it.houseNum == targetH }
                if (targetPl != null) {
                    aspects.add(Aspect(sat.planet, targetPl.planet, sat.houseNum, targetH, aspectTypeTrine))
                }
            }
        }

        // Standard 7th House aspects for others (simplified)
        details.values.forEach { dt ->
            if (dt.planet.id != "JUPITER" && dt.planet.id != "MARS" && dt.planet.id != "SATURN") {
                val targetH = (dt.houseNum + 6) % 12 + 1
                val targetPl = details.values.find { it.houseNum == targetH }
                if (targetPl != null) {
                    aspects.add(Aspect(dt.planet, targetPl.planet, dt.houseNum, targetH, aspectTypeFull))
                }
            }
        }

        // 4. Mahadashas cycle (120 years Vimshottari)
        val dashaSequence = listOf(
            Pair("Ketu", "केतु"), Pair("Venus", "शुक्र"), Pair("Sun", "सूर्य"),
            Pair("Moon", "चन्द्र"), Pair("Mars", "मंगल"), Pair("Rahu", "राहू"),
            Pair("Jupiter", "बृहस्पति"), Pair("Saturn", "शनि"), Pair("Mercury", "बुध")
        )
        
        val moonPl = details["MOON"]
        val baseDashaIndex = if (moonPl != null) (moonPl.degree.toInt() % 9) else 0

        val dashaList = mutableListOf<DashaPeriod>()
        var currentYear = 2026 - (dSeed % 35) // start with a reasonable birth/youth offset

        for (k in 0 until 9) {
            val dashaIdx = (baseDashaIndex + k) % 9
            val currentDashaItem = dashaSequence[dashaIdx]
            val dur = when (dashaIdx) {
                0 -> 7; 1 -> 20; 2 -> 6; 3 -> 10; 4 -> 7; 5 -> 18; 6 -> 16; 7 -> 19; else -> 17
            }
            val nextYear = currentYear + dur

            val subDashas = List(5) { s ->
                val subIdx = (dashaIdx + s + 1) % 9
                "${dashaSequence[subIdx].second} (${currentYear + (s * dur) / 5}-${currentYear + ((s + 1) * dur) / 5})"
            }

            val subDashasEng = List(5) { s ->
                val subIdx = (dashaIdx + s + 1) % 9
                "${dashaSequence[subIdx].first} (${currentYear + (s * dur) / 5}-${currentYear + ((s + 1) * dur) / 5})"
            }

            dashaList.add(
                DashaPeriod(
                    lord = currentDashaItem.first,
                    lordHindi = currentDashaItem.second,
                    startYear = currentYear,
                    endYear = nextYear,
                    subDashas = subDashas,
                    subDashasEng = subDashasEng
                )
            )
            currentYear = nextYear
        }

        // 5. Yogas
        val yogas = mutableListOf<Yoga>()

        val jupPl = details["JUPITER"]
        val diffMoonJup = if (jupPl != null && moonPl != null) ((jupPl.houseNum - moonPl.houseNum + 12) % 12) else 0
        val gajaKesariPresent = listOf(0, 3, 6, 9).contains(diffMoonJup)
        
        yogas.add(
            Yoga(
                nameEng = "Gajakesari Yoga",
                nameHindi = "गजकेसरी योग",
                present = gajaKesariPresent,
                description = "Occurs when Jupiter is in angular houses (Kendra) 1st, 4th, 7th, or 10th from the Moon place.",
                descriptionHindi = "जब देवगुरु बृहस्पति चन्द्रमा से केंद्र (भाव 1, 4, 7, या 10) में स्थित हों, तब गजकेसरी योग बनता है।",
                effect = "Brings wealth, intelligence, long life, and professional reputation.",
                effectHindi = "यह योग अतुल्य धन, यश, मान-समादर, उत्तम बुद्धि और दीर्घायु प्रदान करता है।"
            )
        )

        val sunPl = details["SUN"]
        val mercPl = details["MERCURY"]
        val budhadityaPresent = sunPl != null && mercPl != null && sunPl.signNum == mercPl.signNum
        
        yogas.add(
            Yoga(
                nameEng = "Budhaditya Yoga",
                nameHindi = "बुधादित्य योग",
                present = budhadityaPresent,
                description = "Formed when the Sun and Mercury are conjunct in the same zodiac sign.",
                descriptionHindi = "सूर्य और बुध की किसी एक राशि में युति होने पर इस अत्यंत शुभ योग का निर्माण होता है।",
                effect = "Grants sharp intelligence, analytical skills, academic success, and communication mastery.",
                effectHindi = "यह योग तीव्र बुद्धि, उत्कृष्ट विश्लेषण क्षमता, उच्च शिक्षा, और प्रभावशाली भाषण कौशल देता है।"
            )
        )

        val rajYogaPresent = (dSeed % 10) < 6
        
        yogas.add(
            Yoga(
                nameEng = "Dharma Karmadhipati Raja Yoga",
                nameHindi = "राज योग",
                present = rajYogaPresent,
                description = "Occurs when the 9th lord (Dharma) and 10th lord (Karma) form a mutual relationship.",
                descriptionHindi = "जब भाग्येष और कर्मेश (NAVAM and DASHAM House Lords) परस्पर संबंध बनाते हैं।",
                effect = "Brings exceptional administrative power, political excellence, immense wealth, and authority.",
                effectHindi = "यह जातक को शासन-प्रशासन में उच्च पद, व्यापार में भारी सफलता और समाज में विशेष नेतृत्व शक्ति देता है।"
            )
        )

        val anyDebilitated = details.values.any { it.status == "Debilitated" }
        yogas.add(
            Yoga(
                nameEng = "Neech Bhanga Raja Yoga",
                nameHindi = "नीचभंग राजयोग",
                present = anyDebilitated,
                description = "Occurs when the debilitated planet's dispositor or exalted lord is in angular position from Lagna.",
                descriptionHindi = "जब जातक की कुंडली में कोई नीच का ग्रह हो परंतु उसका स्वामी अथवा उच्च नाथ लग्न से केंद्र में हो।",
                effect = "Overcomes initial hurdles and converts weaknesses into extreme success, wealth and fame.",
                effectHindi = "यह जीवन के शुरुआती संघर्षों को समाप्त कर जातक को चक्रवर्ती राजा की तरह सुख एवं प्रसिद्धि देता है।"
            )
        )

        // 6. Doshas
        val marsPl = details["MARS"]
        val marsHouse = marsPl?.houseNum ?: 0
        val isMangalDosha = listOf(1, 4, 7, 8, 12).contains(marsHouse)
        val mangalDoshaStatus = if (isMangalDosha) "Present" else "Absent"
        val mangalDosha = if (isMangalDosha) {
            "आपकी कुंडली में मंगल दोष (मांगलिक) उपस्थित है। मंगल ग्रह ${marsHouse}वें भाव में स्थित है। यह वैवाहिक संबंधों में अत्यधिक सतर्कता और ऊर्जा का संकेत देता है।"
        } else {
            "आपकी कुंडली पूरी तरह से मंगली दोष से मुक्त है। मंगल ग्रह ${marsHouse}वें भाव में अनुकूल अवस्था में विराजमान है।"
        }

        val rahuPl = details["RAHU"]
        val ketuPl = details["KETU"]
        val rahuHouse = rahuPl?.houseNum ?: 1
        val ketuHouse = ketuPl?.houseNum ?: 7
        val isKaalSarp = abs(rahuHouse - ketuHouse) == 6 && (dSeed % 4) == 0
        val kaalSarpDosha = if (isKaalSarp) {
            "आंशिक कालसर्प योग (Anant/Sheshnag representation) उपस्थित है। इसके निवारण हेतु शिव आराधना उत्तम है।"
        } else {
            "आपकी पत्रिका में कोई काल सर्प दोष नहीं है। सभी ग्रह सामान्य अनुकूल स्थानों पर स्थित हैं।"
        }

        val satPl = details["SATURN"]
        val satHouse = satPl?.houseNum ?: 0
        val moonHouse = moonPl?.houseNum ?: 0
        val isSadeSatiActive = abs(satHouse - moonHouse) <= 1 || abs(satHouse - moonHouse) >= 11
        val sadeSati = if (isSadeSatiActive) {
            "वर्तमान में शनि की साढ़े साती अथवा ढैय्या का प्रभाव चल रहा है। आपको शनिवार को हनुमान जी की आराधना करनी चाहिए और महामृत्युंजय मंत्र जप करना चाहिए।"
        } else {
            "वर्तमान में शनि की साढ़े साती अथवा ढैय्या का कोई हानिकारक प्रभाव नहीं है। शनि आपके पक्ष में बने हुए हैं।"
        }

        return AstrologyReport(
            lagnaSignNum = lagnaSignNum,
            lagnaHindi = lagnaHindi,
            lagnaEnglish = lagnaEnglish,
            planets = details,
            aspects = aspects,
            dashas = dashaList,
            yogas = yogas,
            mangalDosha = mangalDosha,
            mangalDoshaStatus = mangalDoshaStatus,
            kaalSarpDosha = kaalSarpDosha,
            sadeSati = sadeSati
        )
    }

    fun calculateMatchmaking(boyName: String, boyDob: String, boyTob: String, girlName: String, girlDob: String, girlTob: String): MatchmakingReport {
        val hashStr = "${boyName}_${boyDob}_${girlName}_${girlDob}"
        var hash = 0
        for (ch in hashStr) {
            hash = ch.code + ((hash shl 5) - hash)
        }
        val seed = abs(hash)

        val score = 15 + (seed % 21) // 15 to 35

        val gunDetails = listOf(
            GunaMatchDetail("Varna (वर्ण)", if (seed % 2 == 0) 1.0 else 0.0, 1, "Indicates mental compatibility and work profiles."),
            GunaMatchDetail("Vashya (वश्य)", if (seed % 3 == 0) 2.0 else if (seed % 3 == 1) 1.0 else 0.0, 2, "Indicates mutual attraction and dominance."),
            GunaMatchDetail("Tara (तারা)", if (seed % 4 == 0) 3.0 else 1.5, 3, "Indicates destiny, health, and mutual longevity."),
            GunaMatchDetail("Yoni (योनि)", if (seed % 5 == 0) 4.0 else 2.0, 4, "Indicates sexual and physical compatibility."),
            GunaMatchDetail("Graha Maitri (ग्रह मैत्री)", if (seed % 6 == 0) 5.0 else 3.5, 5, "Indicates psychological and temperamental relations."),
            GunaMatchDetail("Gana (गण)", if (seed % 7 == 0) 6.0 else 3.0, 6, "Indicates temperament, social status, and behavior."),
            GunaMatchDetail("Bhakoot (भकूट)", if (seed % 8 == 0) 7.0 else 4.0, 7, "Indicates emotional control and children prospects."),
            GunaMatchDetail("Nadi (नाड़ी)", if (seed % 9 == 0) 8.0 else if (seed % 9 == 1) 4.0 else 0.0, 8, "Indicates physiological factor, genetic health.")
        )

        val calculatedSum = gunDetails.sumOf { it.points }
        val finalScore = calculatedSum.toInt()

        val recommendation: String
        val level: String
        if (finalScore >= 25) {
            level = "Excellent (सर्वोत्तम)"
            recommendation = "दोनो का मिलान बहुत ही शुभ है। भविष्य उज्ज्वल, प्रेममय और आर्थिक रूप से समृद्ध रहने की पूर्ण संभावना है।"
        } else if (finalScore >= 18) {
            level = "Good (उत्तम)"
            recommendation = "मिलान संतोषजनक और अनुकूल है। कुछ सामान्य विचारों में भिन्नता हो सकती है, परंतु वैवाहिक जीवन सुखी रहेगा।"
        } else {
            level = "Average/Low (साधारण)"
            recommendation = "मिलान औसत दर्जे का है। वैवाहिक शांति के लिए नाड़ी या भकूट दोष निवारण पूजा और कुंडली मिलान के उपाय करने की सलाह दी जाती है।"
        }

        return MatchmakingReport(
            score = finalScore,
            level = level,
            recommendation = recommendation,
            gunDetails = gunDetails
        )
    }

    fun getDailyPanchang(dateStr: String): PanchangReport {
        // Generate pseudo-deterministic panchang
        val seed = dateStr.hashCode()

        val tithis = listOf(
            "Prathama (प्रथमा - शुक्ल पक्ष)", "Dwitiya (द्वितीया - शुक्ल पक्ष)", "Tritiya (तृतीया - शुक्ल पक्ष)",
            "Chaturthi (चतुर्थी - शुक्ल पक्ष)", "Panchami (पंचमी - शुक्ल पक्ष)", "Shashti (षष्ठी - शुक्ल पक्ष)",
            "Saptami (सप्तमी - शुक्ल पक्ष)", "Ashtami (अष्टमी - शुक्ल पक्ष)", "Navami (नवमी - शुक्ल पक्ष)",
            "Dashami (दशमी - शुक्ल पक्ष)", "Ekadashi (एकादशी - शुक्ल पक्ष)", "Dwadashi (द्वादशी - शुक्ल पक्ष)",
            "Trayodashi (त्रयोदशी - शुक्ल पक्ष)", "Chaturdashi (चतुर्दश - शुक्ल पक्ष)", "Purnima (पूर्णिमा)",
            "Prathama (प्रथमा - कृष्ण पक्ष)", "Dwitiya (द्वितीया - कृष्ण पक्ष)", "Tritiya (तृतीया - कृष्ण पक्ष)",
            "Chaturthi (चतुर्थी - कृष्ण पक्ष)", "Panchami (पंचमी - कृष्ण पक्ष)", "Shashti (षष्ठी - कृष्ण पक्ष)",
            "Saptami (सaptमी - कृष्ण पक्ष)", "Ashtami (अष्टमी - कृष्ण पक्ष)", "Navami (नवमी - कृष्ण पक्ष)"
        )

        val nakshatras = listOf(
            "Krittika (कृत्तिका)", "Rohini (रोहिणी)", "Mrigashira (मृगशिरा)", "Ardra (आर्द्रा)",
            "Punarvasu (पुनर्वसु)", "Pushya (पुष्य)", "Ashlesha (श्लेषा)", "Magha (मघा)",
            "Purva Phalguni (पूर्वा फाल्गुनी)", "Uttara Phalguni (उत्तरा फाल्गुनी)", "Hasta (हस्त)", "Chitra (चित्रा)"
        )

        val yogasList = listOf(
            "Auspicious (सौम्य)", "Siddha (सिद्ध)", "Shubha (शुभ)", "Amrita (अमृत)",
            "Sadhya (साध्य)", "Vridhi (वृद्धि)", "Harshana (हर्षण)", "Shiva (शिव)"
        )

        val karansList = listOf(
            "Bava (बव)", "Balava (बालव)", "Kaulava (कौलव)", "Taitila (तैतिल)",
            "Gara (गर)", "Vanija (वणिज)", "Vishti (विष्टि)"
        )

        val idx = abs(seed)

        return PanchangReport(
            tithi = tithis[idx % tithis.size],
            nakshatra = nakshatras[idx % nakshatras.size],
            yoga = yogasList[idx % yogasList.size],
            karana = karansList[idx % karansList.size],
            sunrise = "05:34 AM",
            sunset = "07:05 PM",
            abhijit = "11:45 AM - 12:35 PM",
            rahukaal = "03:00 PM - 04:30 PM"
        )
    }
}
