# PowerShell script to clean quiz duplicates
Write-Host "=== CLEANING QUIZ DUPLICATES ===" -ForegroundColor Green

# Read SQL file
$sqlContent = Get-Content -Path "clean_quiz_duplicates_final.sql" -Raw

# Split by semicolons to execute each statement separately
$statements = $sqlContent -split ";"

# MySQL connection details
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$user = "root"
$password = "root"
$database = "elearning"

# Check if MySQL exists
if (-not (Test-Path $mysqlPath)) {
    Write-Host "MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please update the path in the script" -ForegroundColor Yellow
    exit 1
}

# Execute each SQL statement
foreach ($statement in $statements) {
    $statement = $statement.Trim()
    if ($statement -ne "" -and -not $statement.StartsWith("--")) {
        Write-Host "`nExecuting: $($statement.Substring(0, [Math]::Min(50, $statement.Length)))..." -ForegroundColor Cyan
        
        # Execute SQL
        $statement | & $mysqlPath -u $user -p$password $database 2>&1
    }
}

Write-Host "`n=== CLEANUP COMPLETE ===" -ForegroundColor Green
Write-Host "Please restart the backend server to clear Hibernate cache" -ForegroundColor Yellow
