package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Dao
import androidx.room.Query
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Delete
import androidx.room.Database
import androidx.room.RoomDatabase
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "profiles")
data class Profile(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val dob: String,
    val tob: String,
    val place: String,
    val latitude: Double,
    val longitude: Double,
    val gender: String = "Male"
)

@Dao
interface ProfileDao {
    @Query("SELECT * FROM profiles ORDER BY id DESC")
    fun getAll(): Flow<List<Profile>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(profile: Profile)

    @Delete
    suspend fun delete(profile: Profile)

    @Query("DELETE FROM profiles WHERE id = :id")
    suspend fun deleteById(id: Int)
}

@Database(entities = [Profile::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract val profileDao: ProfileDao
}
