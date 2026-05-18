# Cleanup duplicate quizzes in the database
Write-Host "Starting duplicate quiz cleanup..." -ForegroundColor Cyan

# MySQL connection details
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$dbHost = "localhost"
$dbUser = "root"
$dbPassword = ""
$database = "elearning"

# Check if MySQL exists at the expected path
if (-not (Test-Path $mysqlPath)) {
    Write-Host "MySQL not found at: $mysqlPath" -ForegroundColor Yellow
    Write-Host "Searching for MySQL installation..." -ForegroundColor Yellow
    
    # Try to find MySQL in common locations
    $possiblePaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $mysqlPath = $path
            Write-Host "Found MySQL at: $mysqlPath" -ForegroundColor Green
            break
        }
    }
    
    if (-not (Test-Path $mysqlPath)) {
        Write-Host "ERROR: Could not find MySQL executable. Please install MySQL or update the path." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Using MySQL at: $mysqlPath" -ForegroundColor Green

# Step 1: Check for duplicate quiz IDs
Write-Host "`n=== Step 1: Checking for duplicate quiz IDs ===" -ForegroundColor Cyan
$query1 = "SELECT id, COUNT(*) as count FROM quiz GROUP BY id HAVING COUNT(*) > 1;"
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query1

# Step 2: Check for duplicate module_ids
Write-Host "`n=== Step 2: Checking for duplicate module_ids ===" -ForegroundColor Cyan
$query2 = "SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1;"
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query2

# Step 3: Show all quizzes with duplicate module_ids
Write-Host "`n=== Step 3: Showing quizzes with duplicate module_ids ===" -ForegroundColor Cyan
$query3 = @"
SELECT q.id, q.module_id, q.title, q.created_at 
FROM quiz q
WHERE q.module_id IN (
    SELECT module_id FROM quiz 
    WHERE module_id IS NOT NULL 
    GROUP BY module_id 
    HAVING COUNT(*) > 1
)
ORDER BY q.module_id, q.id;
"@
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query3

# Ask for confirmation before deleting
Write-Host "`n=== WARNING: About to delete duplicate quizzes ===" -ForegroundColor Yellow
Write-Host "This will keep only the quiz with the highest ID (latest) for each module_id." -ForegroundColor Yellow
$confirmation = Read-Host "Do you want to proceed? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "Cleanup cancelled by user." -ForegroundColor Red
    exit 0
}

# Step 4: Delete duplicate quizzes
Write-Host "`n=== Step 4: Deleting duplicate quizzes ===" -ForegroundColor Cyan
$query4 = @"
DELETE q1 FROM quiz q1
INNER JOIN quiz q2 ON q1.module_id = q2.module_id AND q1.id < q2.id
WHERE q1.module_id IS NOT NULL;
"@
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query4
Write-Host "Duplicates deleted." -ForegroundColor Green

# Step 5: Verify no more duplicates
Write-Host "`n=== Step 5: Verifying no duplicates remain ===" -ForegroundColor Cyan
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query2

# Step 6: Check existing indexes
Write-Host "`n=== Step 6: Checking existing indexes ===" -ForegroundColor Cyan
$query6 = "SHOW INDEXES FROM quiz;"
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query6

# Step 7: Add UNIQUE constraint if it doesn't exist
Write-Host "`n=== Step 7: Adding UNIQUE constraint on module_id ===" -ForegroundColor Cyan
$query7 = "ALTER TABLE quiz ADD UNIQUE KEY UK_module_id (module_id);"
try {
    & $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query7 2>&1 | Out-Null
    Write-Host "UNIQUE constraint added successfully." -ForegroundColor Green
} catch {
    Write-Host "Note: Constraint may already exist (this is OK)." -ForegroundColor Yellow
}

# Step 8: Final verification
Write-Host "`n=== Step 8: Final verification - All indexes ===" -ForegroundColor Cyan
& $mysqlPath -h $dbHost -u $dbUser --default-auth=mysql_native_password -D $database -e $query6

Write-Host "`n=== Cleanup Complete! ===" -ForegroundColor Green
Write-Host "Next step: Restart the backend to clear Hibernate cache." -ForegroundColor Yellow
