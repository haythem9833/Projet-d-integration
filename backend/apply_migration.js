const mysql = require('mysql2/promise');

async function applyMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'elearning'
  });

  try {
    console.log('Applying migration V2: Fix Quiz Course Constraint...');
    
    // Drop the unique constraint
    await connection.execute('ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr');
    console.log('✓ Unique constraint removed from quiz table');
    
    // Verify the constraint is removed
    const [indexes] = await connection.execute('SHOW INDEXES FROM quiz');
    console.log('✓ Current indexes on quiz table:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.Key_name} (${idx.Column_name})`);
    });
    
    console.log('\n✓ Migration V2 applied successfully!');
    console.log('✓ Multiple quizzes can now be created per course');
    
  } catch (error) {
    if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.log('✓ Constraint already removed or does not exist');
    } else {
      console.error('Error applying migration:', error.message);
      process.exit(1);
    }
  } finally {
    await connection.end();
  }
}

applyMigration();
