# Script PowerShell pour creer un compte administrateur
# Usage: .\create_admin.ps1

Write-Host "Creation du compte administrateur..." -ForegroundColor Cyan

# Configuration de la base de donnees
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "elearning"
$dbUser = "root"

# Demander le mot de passe MySQL
$dbPassword = Read-Host "Entrez le mot de passe MySQL pour l'utilisateur root" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

# Chemin vers le script SQL
$sqlScript = "create_admin_account.sql"

if (-not (Test-Path $sqlScript)) {
    Write-Host "Erreur: Le fichier $sqlScript n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "Execution du script SQL..." -ForegroundColor Yellow

# Executer le script SQL
try {
    $mysqlCmd = "mysql -h $dbHost -P $dbPort -u $dbUser -p$dbPasswordPlain $dbName"
    Get-Content $sqlScript | & mysql -h $dbHost -P $dbPort -u $dbUser "-p$dbPasswordPlain" $dbName
    
    Write-Host "`nCompte administrateur cree avec succes!" -ForegroundColor Green
    Write-Host "`nIdentifiants de connexion:" -ForegroundColor Cyan
    Write-Host "  Email: admin@elearning.com" -ForegroundColor White
    Write-Host "  Mot de passe: Admin@123" -ForegroundColor White
    Write-Host "`nVous pouvez maintenant vous connecter sur http://localhost:3000/login" -ForegroundColor Yellow
    
} catch {
    Write-Host "`nErreur lors de l'execution du script SQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nVerifiez que:" -ForegroundColor Yellow
    Write-Host "  1. MySQL est installe et en cours d'execution" -ForegroundColor White
    Write-Host "  2. La base de donnees 'elearning' existe" -ForegroundColor White
    Write-Host "  3. Les identifiants MySQL sont corrects" -ForegroundColor White
    exit 1
}
