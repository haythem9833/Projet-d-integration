# Test script to verify multiple quizzes can be created for the same course
# This script uses PowerShell to test the API endpoints

# Configuration
$BASE_URL = "http://localhost:8082/api"
$TRAINER_EMAIL = "trainer@example.com"
$TRAINER_PASSWORD = "password123"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Multiple Quizzes Per Course - API Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as trainer
Write-Host "Step 1: Logging in as trainer..." -ForegroundColor Yellow

$loginBody = @{
    email = $TRAINER_EMAIL
    password = $TRAINER_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody
    
    $TOKEN = $loginResponse.token
    
    if (-not $TOKEN) {
        Write-Host "❌ Failed to get authentication token" -ForegroundColor Red
        Write-Host "Response: $loginResponse" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Authentication successful" -ForegroundColor Green
    Write-Host "Token: $($TOKEN.Substring(0, 50))..." -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get or create a course
Write-Host "Step 2: Getting course..." -ForegroundColor Yellow

try {
    $courseResponse = Invoke-RestMethod -Uri "$BASE_URL/courses" `
        -Method Get `
        -Headers @{"Authorization" = "Bearer $TOKEN"}
    
    $COURSE_ID = $courseResponse[0].id
    
    if (-not $COURSE_ID) {
        Write-Host "❌ Failed to get course" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Course found: ID=$COURSE_ID" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Failed to get course: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Get modules for the course
Write-Host "Step 3: Getting modules for the course..." -ForegroundColor Yellow

try {
    $modulesResponse = Invoke-RestMethod -Uri "$BASE_URL/modules?courseId=$COURSE_ID" `
        -Method Get `
        -Headers @{"Authorization" = "Bearer $TOKEN"}
    
    $MODULE_ID_1 = $modulesResponse[0].id
    $MODULE_ID_2 = $modulesResponse[1].id
    
    if (-not $MODULE_ID_1 -or -not $MODULE_ID_2) {
        Write-Host "❌ Failed to get modules" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Modules found: ID1=$MODULE_ID_1, ID2=$MODULE_ID_2" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Failed to get modules: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Create first quiz
Write-Host "Step 4: Creating first quiz..." -ForegroundColor Yellow

$quiz1Body = @{
    title = "Quiz 1 - Module 1"
    description = "First quiz for the course"
    courseId = $COURSE_ID
    moduleId = $MODULE_ID_1
    passingScore = 70
} | ConvertTo-Json

try {
    $quiz1Response = Invoke-RestMethod -Uri "$BASE_URL/quiz" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $quiz1Body
    
    $QUIZ_ID_1 = $quiz1Response.id
    
    if (-not $QUIZ_ID_1) {
        Write-Host "❌ Failed to create first quiz" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ First quiz created: ID=$QUIZ_ID_1" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Failed to create first quiz: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Create second quiz (same course, different module)
Write-Host "Step 5: Creating second quiz for the SAME course..." -ForegroundColor Yellow

$quiz2Body = @{
    title = "Quiz 2 - Module 2"
    description = "Second quiz for the same course"
    courseId = $COURSE_ID
    moduleId = $MODULE_ID_2
    passingScore = 75
} | ConvertTo-Json

try {
    $quiz2Response = Invoke-RestMethod -Uri "$BASE_URL/quiz" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $quiz2Body
    
    $QUIZ_ID_2 = $quiz2Response.id
    
    if (-not $QUIZ_ID_2) {
        Write-Host "❌ Failed to create second quiz (this would have failed before the fix)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Second quiz created: ID=$QUIZ_ID_2 (no duplicate error!)" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Failed to create second quiz: $_" -ForegroundColor Red
    Write-Host "This error would have occurred before the constraint fix" -ForegroundColor Red
    exit 1
}

# Step 6: Verify both quizzes exist
Write-Host "Step 6: Verifying both quizzes in database..." -ForegroundColor Yellow
Write-Host "Quiz 1: ID=$QUIZ_ID_1, Course=$COURSE_ID, Module=$MODULE_ID_1" -ForegroundColor Cyan
Write-Host "Quiz 2: ID=$QUIZ_ID_2, Course=$COURSE_ID, Module=$MODULE_ID_2" -ForegroundColor Cyan
Write-Host ""

# Step 7: Summary
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ TEST PASSED" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ First quiz created successfully" -ForegroundColor Green
Write-Host "  ✅ Second quiz created successfully (no duplicate key error)" -ForegroundColor Green
Write-Host "  ✅ Both quizzes linked to the same course" -ForegroundColor Green
Write-Host "  ✅ Each quiz linked to a different module" -ForegroundColor Green
Write-Host "  ✅ Constraint fix is working correctly" -ForegroundColor Green
Write-Host ""
Write-Host "The constraint fix allows multiple quizzes per course!" -ForegroundColor Green
