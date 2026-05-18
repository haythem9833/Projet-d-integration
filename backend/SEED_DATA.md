# Database Seed Data Documentation

## Overview

The `DataSeeder` class automatically generates realistic test data for development and testing purposes. It uses Java Faker to create authentic-looking data and establishes proper relationships between entities.

## Generated Data

When the application starts (in non-production environments), the seeder creates:

- **10 Users**
  - 2 ADMIN users: admin1@elearning.com, admin2@elearning.com
  - 3 TRAINER users: trainer1@elearning.com, trainer2@elearning.com, trainer3@elearning.com
  - 5 STUDENT users: student1@student.com through student5@student.com

- **5 Courses** with realistic titles and descriptions
  - Each course is assigned to a trainer
  - Pricing: $49.99 to $89.99
  - Categories: Programming, Web Development, Data Science, Mobile, Cloud

- **18 Modules** (3-4 per course)
  - Related to course content
  - Organized hierarchically under courses

- **75 Lessons** (3-5 per module)
  - Includes lesson title, content, and video URLs
  - Realistic learning progression

- **20 Enrollments** (random students in random courses)
  - With enrollment dates and progress tracking
  - Various completion percentages

- **5 Quizzes** (one per course)
  - 12 questions each (60 total)
  - Multiple choice format

- **15 Payments**
  - Random students for random enrollments
  - Different payment methods: credit_card, debit_card, paypal, stripe
  - Status: pending, completed, failed

- **10 Certificates**
  - Awarded to random students for courses

## Default Test Credentials

### Admin User
- Email: `admin1@elearning.com`
- Password: `Admin@123`

### Trainer User
- Email: `trainer1@elearning.com`
- Password: `Trainer@123`

### Student User
- Email: `student1@student.com`
- Password: `Student@123`

## How It Works

1. **Automatic Activation**: The seeder runs automatically when the Spring Boot application starts
2. **Non-Production Only**: The seeder is only active in non-production environments (controlled by `@Profile("!prod")`)
3. **One-Time Run**: If data already exists in the database, the seeder skips to avoid duplicates
4. **Password Encoding**: All passwords are properly encoded using Spring Security's `PasswordEncoder`

## Environment Profiles

### Development/Testing (Default)
- Data seeder is **enabled**
- Database is populated with test data on startup

### Production
- Data seeder is **disabled**
- No test data is generated
- To disable seeding, run with: `--spring.profiles.active=prod`

## Running the Application

### With Seed Data (Default)
```bash
mvn spring-boot:run
```

### Without Seed Data (Production Profile)
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

## Testing Workflow

1. **Start the application**: `mvn spring-boot:run`
2. **Wait for seed data to be created** (watch console output)
3. **Login with test credentials**:
   ```bash
   POST /api/auth/login
   {
     "email": "student1@student.com",
     "password": "Student@123"
   }
   ```
4. **Use the JWT token** for subsequent requests

## Console Output Example

```
Starting database seed with realistic test data...
✓ Created 10 users
✓ Created 5 courses
✓ Created 18 modules
✓ Created 75 lessons
✓ Created 5 quizzes
✓ Created 60 questions
✓ Created 20 enrollments
✓ Created 15 payments
✓ Created 10 certificates
✓ Database seed completed successfully!
```

## Entity Relationships

The seeder maintains proper relationships:

```
User (TRAINER) → Creates → Course
                              ↓
                         Module (3-4 per course)
                              ↓
                         Lesson (3-5 per module)
                              ↓
                            Quiz (1 per course)
                              ↓
                         Question (12 per quiz)

User (STUDENT) → Enrolled → Course → Enrollment
                              ↓
                           Payment
                              ↓
                          Certificate
```

## Customizing Seed Data

To modify the seed data:

1. Edit `DataSeeder.java`
2. Adjust the numbers in methods like `createUsers()`, `createCourses()`, etc.
3. Modify arrays for titles, descriptions, and other content
4. Restart the application and clear your database if needed

## Performance Notes

- Initial startup may take 30-60 seconds while seeding data
- Subsequent startups are instant (if data already exists)
- Adjust the number of entities if you need more/less test data

## Troubleshooting

### Seeder Not Running
- Check that `application.yaml` does not specify `prod` profile
- Verify `DataSeeder.java` is in correct package path
- Check console for any exceptions

### Duplicate Data
- If seeder runs twice, delete the database and restart
- Or run with production profile to skip seeding

### Password Issues
- All test passwords are: `Admin@123`, `Trainer@123`, `Student@123`
- Passwords are case-sensitive
- Make sure you're using the correct role's credentials
