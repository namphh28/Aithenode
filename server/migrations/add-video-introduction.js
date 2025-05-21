// Migration to add video_introduction field to educator_profiles table
const performMigration = async (pgPool) => {
  try {
    console.log('Starting migration: Add video_introduction to educator_profiles');
    
    // Add the new column
    await pgPool.query(`
      ALTER TABLE educator_profiles
      ADD COLUMN IF NOT EXISTS video_introduction TEXT;
    `);
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

module.exports = {
  name: 'add-video-introduction-to-educator-profiles',
  performMigration,
}; 