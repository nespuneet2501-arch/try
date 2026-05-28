package com.example

import android.graphics.Paint
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.room.Room
import com.example.data.AppDatabase
import com.example.data.Profile
import com.example.data.ProfileDao
import com.example.engine.*
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlin.math.abs

// Viewmodel handling persistent records
class AstroViewModel(private val dao: ProfileDao) : ViewModel() {
    val savedProfiles = dao.getAll().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun saveProfile(profile: Profile, onSuccess: () -> Unit) {
        viewModelScope.launch {
            dao.insert(profile)
            onSuccess()
        }
    }

    fun deleteProfile(id: Int) {
        viewModelScope.launch {
            dao.deleteById(id)
        }
    }
}

class AstroViewModelFactory(private val dao: ProfileDao) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AstroViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AstroViewModel(dao) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

class MainActivity : ComponentActivity() {
    private val database by lazy {
        Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "pvastro_db"
        ).fallbackToDestructiveMigration().build()
    }

    private val viewModel: AstroViewModel by viewModels {
        AstroViewModelFactory(database.profileDao)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                val context = LocalContext.current
                val profilesState by viewModel.savedProfiles.collectAsStateWithLifecycle()
                
                // Active Screen Navigation State
                var currentScreen by remember { mutableStateOf("DASHBOARD") } // DASHBOARD, ADD_KUNDLI, REPORT, MATCHMAKING, PANCHANG
                var currentLanguageIsEnglish by remember { mutableStateOf(true) }
                
                // Form States
                var name by remember { mutableStateOf("Puneet") }
                var gender by remember { mutableStateOf("Male") }
                var dob by remember { mutableStateOf("1979-02-16") }
                var tob by remember { mutableStateOf("00:05") }
                var place by remember { mutableStateOf("Muzffarnagar, Uttar Pradesh, India") }
                var lat by remember { mutableStateOf(29.4727) }
                var lon by remember { mutableStateOf(77.7085) }

                // Matchmaking State
                var boyName by remember { mutableStateOf("Rahul") }
                var boyDob by remember { mutableStateOf("1990-08-15") }
                var boyTob by remember { mutableStateOf("14:30") }
                var girlName by remember { mutableStateOf("Anjali") }
                var girlDob by remember { mutableStateOf("1993-11-22") }
                var girlTob by remember { mutableStateOf("08:15") }
                var matchmakingReport by remember { mutableStateOf<MatchmakingReport?>(null) }

                // Panchang State
                var panchangDate by remember { mutableStateOf("2026-05-26") }

                // Derived Astro calculation report
                val astroReport = remember(name, dob, tob, lat, lon) {
                    VedicAstrologyEngine.calculateAstrology(name, dob, tob, lat, lon)
                }

                // Main Scaffolding Layout
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = {
                        AstroHeader(
                            isEnglish = currentLanguageIsEnglish,
                            onLanguageToggle = { currentLanguageIsEnglish = !currentLanguageIsEnglish },
                            onHomeClick = { currentScreen = "DASHBOARD" }
                        )
                    },
                    containerColor = Color(0xFF090A15)
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentScreen) {
                            "DASHBOARD" -> DashboardScreen(
                                isEnglish = currentLanguageIsEnglish,
                                profiles = profilesState,
                                onNewKundli = { currentScreen = "ADD_KUNDLI" },
                                onPanchang = { currentScreen = "PANCHANG" },
                                onMatchmaking = { currentScreen = "MATCHMAKING" },
                                onLoadProfile = { p ->
                                    name = p.name
                                    dob = p.dob
                                    tob = p.tob
                                    place = p.place
                                    lat = p.latitude
                                    lon = p.longitude
                                    gender = p.gender
                                    currentScreen = "REPORT"
                                },
                                onDeleteProfile = { id -> viewModel.deleteProfile(id) }
                            )
                            "ADD_KUNDLI" -> AddKundliScreen(
                                isEnglish = currentLanguageIsEnglish,
                                name = name, onNameChange = { name = it },
                                gender = gender, onGenderChange = { gender = it },
                                dob = dob, onDobChange = { dob = it },
                                tob = tob, onTobChange = { tob = it },
                                place = place, onPlaceChange = { place = it },
                                lat = lat, onLatChange = { lat = it },
                                lon = lon, onLonChange = { lon = it },
                                onCalculate = { currentScreen = "REPORT" },
                                onSave = {
                                    viewModel.saveProfile(
                                        Profile(
                                            name = name, dob = dob, tob = tob,
                                            place = place, latitude = lat, longitude = lon,
                                            gender = gender
                                        )
                                    ) {
                                        Toast.makeText(context, if (currentLanguageIsEnglish) "Profile Saved!" else "कुण्डली सहेजी गई!", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                onBack = { currentScreen = "DASHBOARD" }
                            )
                            "REPORT" -> KundliReportScreen(
                                isEnglish = currentLanguageIsEnglish,
                                name = name, dob = dob, tob = tob, place = place,
                                report = astroReport,
                                onBack = { currentScreen = "DASHBOARD" }
                            )
                            "PANCHANG" -> PanchangScreen(
                                isEnglish = currentLanguageIsEnglish,
                                date = panchangDate,
                                onDateChange = { panchangDate = it },
                                onBack = { currentScreen = "DASHBOARD" }
                            )
                            "MATCHMAKING" -> MatchmakingScreen(
                                isEnglish = currentLanguageIsEnglish,
                                boyName = boyName, onBoyNameChange = { boyName = it },
                                boyDob = boyDob, onBoyDobChange = { boyDob = it },
                                boyTob = boyTob, onBoyTobChange = { boyTob = it },
                                girlName = girlName, onGirlNameChange = { girlName = it },
                                girlDob = girlDob, onGirlDobChange = { girlDob = it },
                                girlTob = girlTob, onGirlTobChange = { girlTob = it },
                                report = matchmakingReport,
                                onCalculate = {
                                    matchmakingReport = VedicAstrologyEngine.calculateMatchmaking(
                                        boyName, boyDob, boyTob, girlName, girlDob, girlTob
                                    )
                                },
                                onBack = { currentScreen = "DASHBOARD" }
                            )
                        }
                    }
                }
            }
        }
    }
}

// Custom Astrological Header
@Composable
fun AstroHeader(
    isEnglish: Boolean,
    onLanguageToggle: () -> Unit,
    onHomeClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .background(Color(0xFF0F1123))
            .border(1.dp, Color(0xFFCCA43B).copy(alpha = 0.2f))
            .padding(horizontal = 16.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.clickable { onHomeClick() }
        ) {
            Text(
                text = "PVASTRO",
                color = Color(0xFFCCA43B),
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif
            )
            Text(
                text = "VEDIC ASTROLOGY HUB",
                color = Color.Gray,
                fontSize = 8.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(
                onClick = onLanguageToggle,
                colors = ButtonDefaults.textButtonColors(contentColor = Color(0xFFCCA43B)),
                modifier = Modifier
                    .border(1.dp, Color(0xFFCCA43B).copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                    .padding(horizontal = 4.dp, vertical = 1.dp)
            ) {
                Text(
                    text = if (isEnglish) "हिंदी" else "English",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// 1. DASHBOARD SCREEN
@Composable
fun DashboardScreen(
    isEnglish: Boolean,
    profiles: List<Profile>,
    onNewKundli: () -> Unit,
    onPanchang: () -> Unit,
    onMatchmaking: () -> Unit,
    onLoadProfile: (Profile) -> Unit,
    onDeleteProfile: (Int) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                border = BorderStroke(1.dp, Color(0xFFCCA43B).copy(alpha = 0.3f)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = if (isEnglish) "Namaste, Puneet" else "नमस्ते, पुनीत",
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isEnglish) 
                            "Calculate detailed dynamic kundli structures, check daily Muhurtas, and perform traditional matchmaking."
                        else 
                            "विस्तृत कुण्डली संरचना, दैनिक शुभ पंचांग तथा वर-वधू अष्टकूट मिलान की सहज गणना करें।",
                        color = Color.LightGray,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        // Feature Navigation Quick Cards List
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onNewKundli,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFCCA43B)),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = if (isEnglish) "New Kundli" else "नई कुंडली",
                        color = Color(0xFF090A15),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
                Button(
                    onClick = onPanchang,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2979FF)),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = if (isEnglish) "Panchang" else "दैनिक पंचांग",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
                Button(
                    onClick = onMatchmaking,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF50057)),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = if (isEnglish) "Matchmaking" else "गुण मिलान",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }
        }

        // Saved profiles list section label
        item {
            Text(
                text = if (isEnglish) "Saved Birth Charts" else "सहेजी गई जन्म कुंडलियां",
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        // Saved Profiles Grid
        if (profiles.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF14162B)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (isEnglish) "No profiles saved yet. Click 'New Kundli' to create one." else "वर्तमान में कोई कुंडली सहेजी नहीं गई है।",
                            color = Color.Gray,
                            fontSize = 12.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(profiles) { profile ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                    border = BorderStroke(0.5.dp, Color.Gray.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onLoadProfile(profile) }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = profile.name,
                                color = Color(0xFFCCA43B),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${profile.dob}  |  ${profile.tob}",
                                color = Color.LightGray,
                                fontSize = 11.sp
                            )
                            Text(
                                text = profile.place,
                                color = Color.Gray,
                                fontSize = 10.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        IconButton(
                            onClick = { onDeleteProfile(profile.id) }
                        ) {
                            Text(text = "❌", fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

// 2. DETAILED KUNDLI BIRTH FORM SCREEN
@Composable
fun AddKundliScreen(
    isEnglish: Boolean,
    name: String, onNameChange: (String) -> Unit,
    gender: String, onGenderChange: (String) -> Unit,
    dob: String, onDobChange: (String) -> Unit,
    tob: String, onTobChange: (String) -> Unit,
    place: String, onPlaceChange: (String) -> Unit,
    lat: Double, onLatChange: (Double) -> Unit,
    lon: Double, onLonChange: (Double) -> Unit,
    onCalculate: () -> Unit,
    onSave: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Back Navigation Button
        TextButton(onClick = onBack) {
            Text(text = if (isEnglish) "← Return to Home" else "← मुख्य पृष्ठ", color = Color.Gray, fontSize = 12.sp)
        }

        // Header Title
        Text(
            text = if (isEnglish) "Enter Birth Parameters" else "जन्म विवरण प्रविष्ट करें",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif
        )

        // Name
        OutlinedTextField(
            value = name,
            onValueChange = onNameChange,
            label = { Text(if (isEnglish) "Full Name" else "पूरा नाम") },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.LightGray,
                focusedLabelColor = Color(0xFFCCA43B),
                focusedBorderColor = Color(0xFFCCA43B),
                unfocusedBorderColor = Color.Gray
            ),
            modifier = Modifier.fillMaxWidth()
        )

        // Gender Toggle
        Column {
            Text(
                text = if (isEnglish) "Gender" else "लिंग",
                color = Color.LightGray,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Male", "Female", "Other").forEach { g ->
                    val isSelected = gender == g
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) Color(0xFFCCA43B) else Color(0xFF0F1123))
                            .border(
                                1.dp,
                                if (isSelected) Color(0xFFCCA43B) else Color.Gray.copy(alpha = 0.5f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { onGenderChange(g) }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (isEnglish) g else (if (g == "Male") "पुरुष" else if (g == "Female") "महिला" else "अन्य"),
                            color = if (isSelected) Color(0xFF090A15) else Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // DOB & TOB In same Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = dob,
                onValueChange = onDobChange,
                label = { Text(if (isEnglish) "Date (YYYY-MM-DD)" else "जन्म तिथि") },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.LightGray,
                    focusedBorderColor = Color(0xFFCCA43B)
                ),
                modifier = Modifier.weight(1f)
            )

            OutlinedTextField(
                value = tob,
                onValueChange = onTobChange,
                label = { Text(if (isEnglish) "Time (HH:MM)" else "जन्म समय") },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.LightGray,
                    focusedBorderColor = Color(0xFFCCA43B)
                ),
                modifier = Modifier.weight(1f)
            )
        }

        // Place string
        OutlinedTextField(
            value = place,
            onValueChange = onPlaceChange,
            label = { Text(if (isEnglish) "Birth Place" else "जन्म स्थान") },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.LightGray,
                focusedBorderColor = Color(0xFFCCA43B)
            ),
            modifier = Modifier.fillMaxWidth()
        )

        // Coordinates Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = lat.toString(),
                onValueChange = { onLatChange(it.toDoubleOrNull() ?: 0.0) },
                label = { Text(if (isEnglish) "Latitude" else "अक्षांश") },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    focusedBorderColor = Color(0xFFCCA43B)
                ),
                modifier = Modifier.weight(1f)
            )

            OutlinedTextField(
                value = lon.toString(),
                onValueChange = { onLonChange(it.toDoubleOrNull() ?: 0.0) },
                label = { Text(if (isEnglish) "Longitude" else "रेखांश") },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    focusedBorderColor = Color(0xFFCCA43B)
                ),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Action Buttons Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = onSave,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF161A35)),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, Color(0xFFCCA43B).copy(alpha = 0.4f))
            ) {
                Text(text = if (isEnglish) "Save Profile" else "सहेजें", color = Color.White, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = onCalculate,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFCCA43B)),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(text = if (isEnglish) "Generate Chart" else "कुंडली जनरेट करें", color = Color(0xFF090A15), fontWeight = FontWeight.Bold)
            }
        }
    }
}

// 3. KUNDLI REPORT VISUALIZER SCREEN
@Composable
fun KundliReportScreen(
    isEnglish: Boolean,
    name: String, dob: String, tob: String, place: String,
    report: AstrologyReport,
    onBack: () -> Unit
) {
    var chartStyle by remember { mutableStateOf("North Indian") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            TextButton(onClick = onBack) {
                Text(text = if (isEnglish) "← Return to Home" else "← मुख्य पृष्ठ", color = Color.Gray, fontSize = 12.sp)
            }
        }

        // Profile brief banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif)
                        Text(text = "$dob @ $tob | $place", color = Color.LightGray, fontSize = 11.sp)
                    }
                    Box(
                        modifier = Modifier
                            .background(Color(0xFFCCA43B).copy(alpha = 0.15f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "${if (isEnglish) "ASC" else "लग्न"}: ${report.lagnaSignNum}",
                            color = Color(0xFFCCA43B),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Sade Sati + Manglik state
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(text = if (isEnglish) "Mangal Dosha Status" else "मंगली अवस्था", color = Color.Gray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text(text = if (isEnglish) report.mangalDoshaStatus else (if (report.mangalDoshaStatus == "Present") "मंगलिक उपस्थित" else "मंगली मुक्त"), 
                            color = if (report.mangalDoshaStatus == "Present") Color.Red else Color.Green, 
                            fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 2.dp))
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                    modifier = Modifier.weight(1.5f)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(text = if (isEnglish) "Kaal Sarp Status" else "काल सर्प विश्लेषण", color = Color.Gray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text(text = report.kaalSarpDosha, color = Color.LightGray, fontSize = 10.sp, lineHeight = 12.sp, modifier = Modifier.padding(top = 2.dp))
                    }
                }
            }
        }

        // Sade Sati Full details
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(text = if (isEnglish) "Saturn Transit Sade Sati" else "शनि साढ़ेसाती एवं ढैय्या प्रभाव", color = Color(0xFF2979FF), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = report.sadeSati, color = Color.LightGray, fontSize = 11.sp, lineHeight = 15.sp)
                }
            }
        }

        // Selector of Chart types
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = if (isEnglish) "Birth Chart Map" else "ग्रह कुण्डली चक्र", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif)
                Row(
                    modifier = Modifier
                        .background(Color(0xFF0F1123))
                        .padding(2.dp)
                        .clip(RoundedCornerShape(6.dp))
                ) {
                    listOf("North Indian", "South Indian").forEach { style ->
                        val isSel = chartStyle == style
                        Box(
                            modifier = Modifier
                                .background(if (isSel) Color(0xFFCCA43B) else Color.Transparent, RoundedCornerShape(4.dp))
                                .clickable { chartStyle = style }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(text = style.split(" ")[0], color = if (isSel) Color(0xFF090A15) else Color.Gray, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Chart Draw Canvas (North or South)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(Color(0xFF090A15))
                    .border(2.dp, Color(0xFFCCA43B), RoundedCornerShape(8.dp))
                    .padding(8.dp),
                contentAlignment = Alignment.Center
            ) {
                if (chartStyle == "North Indian") {
                    NorthIndianCanvas(report = report)
                } else {
                    SouthIndianCanvas(report = report)
                }
            }
        }

        // Planets Longitude placement records
        item {
            Text(
                text = if (isEnglish) "Planetary Placements" else "ग्रहीय स्पष्ट दूरियाँ",
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        items(report.planets.values.toList()) { detail ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (isEnglish) detail.planet.name else detail.planet.hindi,
                                color = Color.White,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            if (detail.retrograde) {
                                Text(
                                    text = " [R]",
                                    color = Color.Red,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "${if (isEnglish) "Sign" else "राशि"}: ${detail.signNum} (${if (isEnglish) detail.signName else detail.signHindi}) @ ${detail.degree.format(2)}°",
                            color = Color.LightGray,
                            fontSize = 11.sp
                        )
                        Text(
                            text = "${if (isEnglish) "Nakshatra" else "नक्षत्र"}: ${detail.nakshatra} (Lord: ${detail.nakshatraLord})",
                            color = Color.Gray,
                            fontSize = 10.sp
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Box(
                            modifier = Modifier
                                .background(Color.Black.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "${if (isEnglish) "House" else "भाव"} ${detail.houseNum}",
                                color = Color(0xFFCCA43B),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = "${detail.strengthPct}% Shadbala",
                            color = Color.LightGray,
                            fontSize = 10.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }

        // Mahadasha timeline
        item {
            Text(
                text = if (isEnglish) "Mahadasha Timelines" else "विंशोत्तरी महादशा व्यवस्था",
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        items(report.dashas) { dasha ->
            val isActive = 2026 >= dasha.startYear && 2026 <= dasha.endYear
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (isActive) Color(0xFFCCA43B).copy(alpha = 0.1f) else Color(0xFF0F1123)
                ),
                border = if (isActive) BorderStroke(1.dp, Color(0xFFCCA43B)) else null,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${if (isEnglish) dasha.lord else dasha.lordHindi} Mahadasha",
                            color = if (isActive) Color(0xFFCCA43B) else Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${dasha.startYear} - ${dasha.endYear}",
                            color = Color.LightGray,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (isEnglish) dasha.subDashasEng.joinToString(" • ") else dasha.subDashas.joinToString(" • "),
                        color = Color.Gray,
                        fontSize = 10.sp
                    )
                }
            }
        }
    }
}

// 4. PANCHANG CALENDAR VIEW
@Composable
fun PanchangScreen(
    isEnglish: Boolean,
    date: String,
    onDateChange: (String) -> Unit,
    onBack: () -> Unit
) {
    val panchangReport = remember(date) {
        VedicAstrologyEngine.getDailyPanchang(date)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        TextButton(onClick = onBack) {
            Text(text = if (isEnglish) "← Return to Home" else "← मुख्य पृष्ठ", color = Color.Gray, fontSize = 12.sp)
        }

        Text(
            text = if (isEnglish) "Daily Panchang" else "दैनिक वैदिक पंचांग",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif
        )

        // Select Date
        OutlinedTextField(
            value = date,
            onValueChange = onDateChange,
            label = { Text(if (isEnglish) "Select Calendar Date" else "कैलेंडर तारीख") },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                focusedBorderColor = Color(0xFFCCA43B)
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                AstroRow(label = if (isEnglish) "Tithi" else "तिथि (पक्ष)", value = panchangReport.tithi)
                AstroRow(label = if (isEnglish) "Nakshatra" else "नक्षत्र", value = panchangReport.nakshatra)
                AstroRow(label = if (isEnglish) "Yoga" else "योग", value = panchangReport.yoga)
                AstroRow(label = if (isEnglish) "Karana" else "करण", value = panchangReport.karana)
            }
        }

        // Sunrise/Sunset & Muhurta card
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = if (isEnglish) "Sunrise" else "सूर्योदय", color = Color.Gray, fontSize = 10.sp)
                        Text(text = panchangReport.sunrise, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = if (isEnglish) "Sunset" else "सूर्यास्त", color = Color.Gray, fontSize = 10.sp)
                        Text(text = panchangReport.sunset, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Divider(color = Color.Gray.copy(alpha = 0.2f))

                Column {
                    Text(text = if (isEnglish) "Auspicious Muhurta" else "शुभ अभिजीत मुहूर्त", color = Color.Green, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text(text = panchangReport.abhijit, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 2.dp))
                }

                Column {
                    Text(text = if (isEnglish) "Inauspicious Period" else "अशुभ राहू काल", color = Color.Red, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text(text = panchangReport.rahukaal, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 2.dp))
                }
            }
        }
    }
}

// 5. MATCHMAKING SCREEN
@Composable
fun MatchmakingScreen(
    isEnglish: Boolean,
    boyName: String, onBoyNameChange: (String) -> Unit,
    boyDob: String, onBoyDobChange: (String) -> Unit,
    boyTob: String, onBoyTobChange: (String) -> Unit,
    girlName: String, onGirlNameChange: (String) -> Unit,
    girlDob: String, onGirlDobChange: (String) -> Unit,
    girlTob: String, onGirlTobChange: (String) -> Unit,
    report: MatchmakingReport?,
    onCalculate: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        TextButton(onClick = onBack) {
            Text(text = if (isEnglish) "← Return to Home" else "← मुख्य पृष्ठ", color = Color.Gray, fontSize = 12.sp)
        }

        Text(
            text = if (isEnglish) "Kundli Milan (Matchmaking)" else "वर-वधू कुंडली मिलान",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif
        )

        // Boy Profile Column
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(text = if (isEnglish) "Boy's Particulars" else "वर (लड़का) विवरण", color = Color(0xFF2979FF), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                
                OutlinedTextField(
                    value = boyName,
                    onValueChange = onBoyNameChange,
                    label = { Text(if (isEnglish) "Boy Name" else "वर का नाम") },
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = boyDob,
                        onValueChange = onBoyDobChange,
                        label = { Text(if (isEnglish) "DOB" else "जन्मतिथि") },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                        modifier = Modifier.weight(1.2f)
                    )
                    OutlinedTextField(
                        value = boyTob,
                        onValueChange = onBoyTobChange,
                        label = { Text(if (isEnglish) "TOB" else "जन्मसमय") },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Girl Profile Column
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(text = if (isEnglish) "Girl's Particulars" else "कन्या (लड़की) विवरण", color = Color(0xFFF50057), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                
                OutlinedTextField(
                    value = girlName,
                    onValueChange = onGirlNameChange,
                    label = { Text(if (isEnglish) "Girl Name" else "कन्या का नाम") },
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = girlDob,
                        onValueChange = onGirlDobChange,
                        label = { Text(if (isEnglish) "DOB" else "जन्मतिथि") },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                        modifier = Modifier.weight(1.2f)
                    )
                    OutlinedTextField(
                        value = girlTob,
                        onValueChange = onGirlTobChange,
                        label = { Text(if (isEnglish) "TOB" else "जन्मसमय") },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        Button(
            onClick = onCalculate,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFCCA43B)),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text(text = if (isEnglish) "Calculate 36-Gunas Score" else "अष्टकूट मिलान करें", color = Color(0xFF090A15), fontWeight = FontWeight.Bold)
        }

        // Show result
        if (report != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1123)),
                border = BorderStroke(1.dp, Color(0xFFF50057).copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = if (isEnglish) "Gun Milan Score" else "कुल मिलान अंक", color = Color.Gray, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(text = "${report.score} / 36 Gunas", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif)
                        }

                        Box(
                            modifier = Modifier
                                .background(Color(0xFFF50057).copy(alpha = 0.15f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(text = report.level, color = Color(0xFFF50057), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(text = report.recommendation, color = Color.LightGray, fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight.SemiBold)
                    
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(text = if (isEnglish) "Ashtakoot Guna breakdown" else "गुण मिलान गहन विवरण", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    
                    report.gunDetails.forEach { g ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = g.name, color = Color.Gray, fontSize = 11.sp)
                            Text(text = "${g.points} / ${g.max}", color = Color.LightGray, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AstroRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Text(text = value, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif, textAlign = TextAlign.Right)
    }
}

// Draw North Indian Kundli chart
@Composable
fun NorthIndianCanvas(report: AstrologyReport) {
    val lagna = report.lagnaSignNum
    Canvas(
        modifier = Modifier
            .fillMaxSize()
            .aspectRatio(1f)
    ) {
        val w = size.width
        val h = size.height

        // Background / borders
        drawRect(color = Color(0xFF0F1123))

        // Draw outer box border
        drawRect(color = Color(0xFFCCA43B), style = Stroke(width = 4.dp.toPx()))

        // Diagonals x-shape
        drawLine(color = Color(0xFFCCA43B), start = Offset(0f, 0f), end = Offset(w, h), strokeWidth = 2.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(w, 0f), end = Offset(0f, h), strokeWidth = 2.dp.toPx())

        // Inner Diamond lines
        drawLine(color = Color(0xFFCCA43B), start = Offset(w / 2, 0f), end = Offset(0f, h / 2), strokeWidth = 2.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(0f, h / 2), end = Offset(w / 2, h), strokeWidth = 2.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(w / 2, h), end = Offset(w, h / 2), strokeWidth = 2.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(w, h / 2), end = Offset(w / 2, 0f), strokeWidth = 2.dp.toPx())

        // Render House Sign Numbers inside houses (Lagna at house 1 (center top), going CCW)
        val paint = Paint().apply {
            color = Color(0xFFCCA43B).copy(alpha = 0.5f).toArgb()
            textSize = 12.sp.toPx()
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }

        val planetPaint = Paint().apply {
            color = Color.White.toArgb()
            textSize = 9.sp.toPx()
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }

        // Center coordinates of each of the 12 houses in North Indian system
        val houseCenters = listOf(
            Offset(w / 2, h / 4),       // H1
            Offset(w / 4, h / 8),       // H2
            Offset(w / 8, h / 4),       // H3
            Offset(w / 4, h / 2),       // H4
            Offset(w / 8, (3 * h) / 4),  // H5
            Offset(w / 4, (7 * h) / 8),  // H6
            Offset(w / 2, (3 * h) / 4),  // H7
            Offset((3 * w) / 4, (7 * h) / 8), // H8
            Offset((7 * w) / 8, (3 * h) / 4), // H9
            Offset((3 * w) / 4, h / 2),  // H10
            Offset((7 * w) / 8, h / 4),  // H11
            Offset((3 * w) / 4, h / 8)   // H12
        )

        for (i in 0 until 12) {
            val houseNum = i + 1
            val sign = ((lagna + houseNum - 2) % 12) + 1
            val center = houseCenters[i]
            
            // Draw house sign number slightly offset from center
            drawContext.canvas.nativeCanvas.drawText(
                sign.toString(),
                center.x,
                center.y + 16.dp.toPx(),
                paint
            )

            // Gather planets in this house
            val plInHouse = report.planets.values.filter { it.houseNum == houseNum }
            plInHouse.forEachIndexed { pIdx, pl ->
                val planetLabel = pl.planet.id.substring(0, 3)
                // Offset planets in house so they don't overlap
                val pX = center.x + (if (pIdx % 2 == 0) -16.dp.toPx() else 16.dp.toPx())
                val pY = center.y + (if (pIdx > 1) 12.dp.toPx() else -10.dp.toPx())
                
                drawContext.canvas.nativeCanvas.drawText(
                    planetLabel,
                    pX,
                    pY,
                    planetPaint
                )
            }
        }
    }
}

// Draw South Indian Kundli chart
@Composable
fun SouthIndianCanvas(report: AstrologyReport) {
    val lagna = report.lagnaSignNum
    Canvas(
        modifier = Modifier
            .fillMaxSize()
            .aspectRatio(1f)
    ) {
        val w = size.width
        val h = size.height
        val boxW = w / 4
        val boxH = h / 4

        // Background
        drawRect(color = Color(0xFF0F1123))

        // Grid boundaries
        drawRect(color = Color(0xFFCCA43B), style = Stroke(width = 3.dp.toPx()))

        // Horizontal division lines
        drawLine(color = Color(0xFFCCA43B), start = Offset(0f, boxH), end = Offset(w, boxH), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(0f, boxH * 2), end = Offset(boxW, boxH * 2), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(boxW * 3, boxH * 2), end = Offset(w, boxH * 2), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(0f, boxH * 3), end = Offset(w, boxH * 3), strokeWidth = 1.5.dp.toPx())

        // Vertical division lines
        drawLine(color = Color(0xFFCCA43B), start = Offset(boxW, 0f), end = Offset(boxW, h), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(boxW * 2, 0f), end = Offset(boxW * 2, boxH), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(boxW * 2, boxH * 3), end = Offset(boxW * 2, h), strokeWidth = 1.5.dp.toPx())
        drawLine(color = Color(0xFFCCA43B), start = Offset(boxW * 3, 0f), end = Offset(boxW * 3, h), strokeWidth = 1.5.dp.toPx())

        val paint = Paint().apply {
            color = Color(0xFFCCA43B).copy(alpha = 0.5f).toArgb()
            textSize = 10.sp.toPx()
            textAlign = Paint.Align.LEFT
            isAntiAlias = true
        }

        val planetPaint = Paint().apply {
            color = Color.White.toArgb()
            textSize = 8.sp.toPx()
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }

        // Coordinates mapping for 12 signs in clockwise order starting from Pisces (top left grid)
        val signBoxes = listOf(
            Offset(0f, 0f),             // sign 12 (Pisces)
            Offset(boxW, 0f),          // sign 1 (Aries)
            Offset(boxW * 2, 0f),      // sign 2 (Taurus)
            Offset(boxW * 3, 0f),      // sign 3 (Gemini)
            Offset(boxW * 3, boxH),    // sign 4 (Cancer)
            Offset(boxW * 3, boxH * 2),// sign 5 (Leo)
            Offset(boxW * 3, boxH * 3),// sign 6 (Virgo)
            Offset(boxW * 2, boxH * 3),// sign 7 (Libra)
            Offset(boxW, boxH * 3),    // sign 8 (Scorpio)
            Offset(0f, boxH * 3),      // sign 9 (Sagittarius)
            Offset(0f, boxH * 2),      // sign 10 (Capricorn)
            Offset(0f, boxH)           // sign 11 (Aquarius)
        )

        // Render each sign's planets
        for (i in 0 until 12) {
            val signNum = i + 1
            // In South Indian, Pisces is index 0 in the CW layout, which matches sign 12. Let's align indices:
            val layoutIndex = (signNum) % 12
            val origin = signBoxes[layoutIndex]

            val isLagna = signNum == lagna

            // Draw sign number
            drawContext.canvas.nativeCanvas.drawText(
                signNum.toString(),
                origin.x + 8.dp.toPx(),
                origin.y + 16.dp.toPx(),
                paint
            )

            if (isLagna) {
                drawContext.canvas.nativeCanvas.drawText(
                    "ASC",
                    origin.x + boxW - 25.dp.toPx(),
                    origin.y + 16.dp.toPx(),
                    paint
                )
            }

            // Gather planets situated in this sign
            val planetsInSign = report.planets.values.filter { it.signNum == signNum }
            planetsInSign.forEachIndexed { pIdx, pl ->
                val label = pl.planet.id.substring(0, 3)
                val pX = origin.x + boxW / 2 + (if (pIdx % 2 == 0) -14.dp.toPx() else 14.dp.toPx())
                val pY = origin.y + boxH / 2 + (if (pIdx > 1) 10.dp.toPx() else -10.dp.toPx())

                drawContext.canvas.nativeCanvas.drawText(
                    label,
                    pX,
                    pY,
                    planetPaint
                )
            }
        }
    }
}

// Number formatter helper
fun Double.format(digits: Int) = "%.${digits}f".format(this)
