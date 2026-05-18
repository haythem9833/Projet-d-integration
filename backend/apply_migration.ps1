# Apply Flyway migration V2 to fix quiz constraint
$sqlScript = @"
-- Fix the unique constraint on course_id in quiz table
-- This allows multiple quizzes per course
-- The constraint name is: UK8b1no9kk3xjgste5vdbfgpcrr

ALTER TABLE elearning.quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr;

-- Verify the constraint is removed
SHOW INDEXES FROM elearning.quiz;
"@

# Write to a temporary SQL file
$sqlFile = "d:\projetDintegration\backend\temp_migration.sql"
$sqlScript | Out-File -FilePath $sqlFile -Encoding UTF8

# Execute the SQL file using mysql command
# Note: This assumes mysql is in PATH or we need to use the full path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

if (Test-Path $mysqlPath) {
    & $mysqlPath -h localhost -u root -proot < $sqlFile
    Write-Host "Migration applied successfully"
} else {
    Write-Host "MySQL not found at expected location. Trying with 'mysql' command..."
    mysql -h localhost -u root -proot < $sqlFile
}

# Clean up
Remove-Item -Path $sqlFile -Force
