// Migration to add teaching_method field to educator_profiles table
const performMigration = async (pgPool) => {
  try {
    console.log('Starting migration: Add teaching_method to educator_profiles');
    
    // Add the new column
    await pgPool.query(`
      ALTER TABLE educator_profiles
      ADD COLUMN IF NOT EXISTS teaching_method TEXT;
    `);
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

module.exports = {
  name: 'add-teaching-method-to-educator-profiles',
  performMigration,
}; 