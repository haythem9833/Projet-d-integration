package com.example.back.config;

import com.github.javafaker.Faker;
import com.example.back.entity.*;
import com.example.back.entity.Module;
import com.example.back.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@Profile("!prod") // Only run in non-production environments
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CertificateRepository certificateRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    public DataSeeder(
            UserRepository userRepository,
            CourseRepository courseRepository,
            ModuleRepository moduleRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            PaymentRepository paymentRepository,
            CertificateRepository certificateRepository,
            SubscriptionPlanRepository subscriptionPlanRepository,
            SubscriptionRepository subscriptionRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.paymentRepository = paymentRepository;
        this.certificateRepository = certificateRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting database seed with realistic test data...");

        // 0. Create Subscription Plans (always, even if data exists)
        createSubscriptionPlans();

        // 0.5. Create Courses (always, even if data exists)
        createCoursesIfNotExist();

        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("Database already populated. Skipping seed data.");
            // But still create subscriptions for existing students if they don't have one
            createSubscriptionsForExistingStudents();
            return;
        }

        // 1. Create Users
        List<User> users = createUsers();

        // 2. Create Courses (with Trainers) - will be skipped if already created
        List<Course> courses = createCourses(users);

        // 3. Create Modules for each Course
        List<Module> modules = createModules(courses);

        // 4. Create Lessons for each Module
        List<Lesson> lessons = createLessons(modules);

        // 5. Create Enrollments
        List<Enrollment> enrollments = createEnrollments(users, courses);

        // 8. Create Payments
        createPayments(users, enrollments);

        // 9. Create Certificates
        createCertificates(users, courses);

        System.out.println("✓ Database seed completed successfully!");
        System.out.println("  - 3 Subscription Plans created");
        System.out.println("  - 10 Users created (2 ADMIN, 3 TRAINER, 5 STUDENT)");
        System.out.println("  - 5 Courses created");
        System.out.println("  - 18 Modules created");
        System.out.println("  - 75 Lessons created");
        System.out.println("  - 20 Enrollments created");
        System.out.println("  - 15 Payments created");
        System.out.println("  - 10 Certificates created");
    }

    private void createSubscriptionPlans() {
        // Check if plans already exist
        if (subscriptionPlanRepository.count() > 0) {
            System.out.println("✓ Subscription plans already exist. Skipping creation.");
            return;
        }

        // BASIC Plan
        SubscriptionPlan basicPlan = new SubscriptionPlan();
        basicPlan.setName("BASIC");
        basicPlan.setPrice(9.99);
        basicPlan.setBillingCycle(BillingCycle.MONTHLY);
        basicPlan.setMaxCourses(5);
        basicPlan.setMaxStudents(null);
        basicPlan.setFeatures("[\"Access to 5 courses\", \"Basic support\", \"Monthly billing\"]");
        subscriptionPlanRepository.save(basicPlan);

        // PRO Plan
        SubscriptionPlan proPlan = new SubscriptionPlan();
        proPlan.setName("PRO");
        proPlan.setPrice(29.99);
        proPlan.setBillingCycle(BillingCycle.MONTHLY);
        proPlan.setMaxCourses(50);
        proPlan.setMaxStudents(null);
        proPlan.setFeatures("[\"Access to 50 courses\", \"Priority support\", \"Monthly billing\", \"Certificates\"]");
        subscriptionPlanRepository.save(proPlan);

        // PREMIUM Plan
        SubscriptionPlan premiumPlan = new SubscriptionPlan();
        premiumPlan.setName("PREMIUM");
        premiumPlan.setPrice(99.99);
        premiumPlan.setBillingCycle(BillingCycle.YEARLY);
        premiumPlan.setMaxCourses(null);
        premiumPlan.setMaxStudents(null);
        premiumPlan.setFeatures("[\"Unlimited courses\", \"24/7 support\", \"Yearly billing\", \"Certificates\", \"Live sessions\", \"Mentorship\"]");
        subscriptionPlanRepository.save(premiumPlan);

        System.out.println("✓ Created 3 subscription plans");
    }

    private void createCoursesIfNotExist() {
        // Check if courses already exist
        if (courseRepository.count() > 0) {
            System.out.println("✓ Courses already exist. Skipping creation.");
            return;
        }

        // Get trainers from database (if they exist)
        List<User> trainers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TRAINER)
                .toList();

        // If no trainers exist, create temporary ones for course creation
        if (trainers.isEmpty()) {
            System.out.println("⚠ No trainers found. Creating temporary trainers for courses...");
            for (int i = 1; i <= 3; i++) {
                User trainer = new User();
                trainer.setFirstName("Trainer" + i);
                trainer.setLastName("Prof" + i);
                trainer.setEmail("trainer" + i + "@elearning.com");
                trainer.setPassword(passwordEncoder.encode("Trainer@123"));
                trainer.setRole(Role.TRAINER);
                trainer.setBlocked(false);
                userRepository.save(trainer);
            }
            trainers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.TRAINER)
                    .toList();
        }

        String[] courseNames = {
                "Java Programming Fundamentals",
                "Web Development with React",
                "Python Data Science Basics",
                "Mobile App Development with Flutter",
                "Cloud Computing with AWS"
        };

        String[] descriptions = {
                "Learn Java from scratch including OOP, Collections, Streams, and Spring Boot framework.",
                "Master React.js with hooks, state management, and modern ES6+ JavaScript techniques.",
                "Dive into data science with Python, pandas, numpy, matplotlib, and machine learning basics.",
                "Build cross-platform mobile apps using Flutter and Dart programming language.",
                "Get certified in AWS cloud services, EC2, S3, Lambda, and cloud architecture patterns."
        };

        String[] categories = { "Programming", "Web Development", "Data Science", "Mobile", "Cloud" };
        String[] levels = { "Beginner", "Intermediate", "Advanced", "Beginner", "Intermediate" };
        Double[] prices = { 49.99, 59.99, 69.99, 79.99, 89.99 };

        for (int i = 0; i < courseNames.length; i++) {
            Course course = new Course();
            course.setTitle(courseNames[i]);
            course.setDescription(descriptions[i]);
            course.setCategory(categories[i]);
            course.setLevel(levels[i]);
            course.setPrice(prices[i]);
            course.setTrainer(trainers.get(i % trainers.size()));
            courseRepository.save(course);
        }

        System.out.println("✓ Created 5 courses");
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();

        // 2 ADMIN Users
        for (int i = 1; i <= 2; i++) {
            User admin = new User();
            admin.setFirstName("Admin" + i);
            admin.setLastName("User" + i);
            admin.setEmail("admin" + i + "@elearning.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setBlocked(false);
            users.add(userRepository.save(admin));
        }

        // 3 TRAINER Users
        for (int i = 1; i <= 3; i++) {
            User trainer = new User();
            trainer.setFirstName("Trainer" + i);
            trainer.setLastName("Prof" + i);
            trainer.setEmail("trainer" + i + "@elearning.com");
            trainer.setPassword(passwordEncoder.encode("Trainer@123"));
            trainer.setRole(Role.TRAINER);
            trainer.setBlocked(false);
            users.add(userRepository.save(trainer));
        }

        // 5 STUDENT Users
        for (int i = 1; i <= 5; i++) {
            User student = new User();
            student.setFirstName(faker.name().firstName());
            student.setLastName(faker.name().lastName());
            student.setEmail("student" + i + "@student.com");
            student.setPassword(passwordEncoder.encode("Student@123"));
            student.setRole(Role.STUDENT);
            student.setBlocked(false);
            users.add(userRepository.save(student));
        }

        System.out.println("✓ Created 10 users");
        return users;
    }

    private List<Course> createCourses(List<User> users) {
        List<Course> courses = new ArrayList<>();

        // If courses already exist, fetch and return them
        if (courseRepository.count() > 0) {
            System.out.println("✓ Courses already exist. Skipping creation.");
            return courseRepository.findAll();
        }

        String[] courseNames = {
                "Java Programming Fundamentals",
                "Web Development with React",
                "Python Data Science Basics",
                "Mobile App Development with Flutter",
                "Cloud Computing with AWS"
        };

        String[] descriptions = {
                "Learn Java from scratch including OOP, Collections, Streams, and Spring Boot framework.",
                "Master React.js with hooks, state management, and modern ES6+ JavaScript techniques.",
                "Dive into data science with Python, pandas, numpy, matplotlib, and machine learning basics.",
                "Build cross-platform mobile apps using Flutter and Dart programming language.",
                "Get certified in AWS cloud services, EC2, S3, Lambda, and cloud architecture patterns."
        };

        String[] categories = { "Programming", "Web Development", "Data Science", "Mobile", "Cloud" };
        String[] levels = { "Beginner", "Intermediate", "Advanced", "Beginner", "Intermediate" };
        Double[] prices = { 49.99, 59.99, 69.99, 79.99, 89.99 };

        List<User> trainers = users.stream()
                .filter(u -> u.getRole() == Role.TRAINER)
                .toList();

        for (int i = 0; i < courseNames.length; i++) {
            Course course = new Course();
            course.setTitle(courseNames[i]);
            course.setDescription(descriptions[i]);
            course.setCategory(categories[i]);
            course.setLevel(levels[i]);
            course.setPrice(prices[i]);
            course.setTrainer(trainers.get(i % trainers.size()));
            courses.add(courseRepository.save(course));
        }

        System.out.println("✓ Created 5 courses");
        return courses;
    }

    private List<Module> createModules(List<Course> courses) {
        List<Module> modules = new ArrayList<>();

        String[][] moduleNames = {
                // Java course modules
                { "Java Basics", "OOP Concepts", "Collections Framework", "Streams & Lambdas" },
                // React course modules
                { "React Fundamentals", "State & Props", "Hooks Deep Dive", "Advanced Patterns" },
                // Python course modules
                { "Python Basics", "Data Structures", "Pandas & Numpy", "Visualization" },
                // Flutter course modules
                { "Flutter Setup", "Widgets & Layout", "State Management", "APIs & HTTP" },
                // AWS course modules
                { "AWS Fundamentals", "EC2 & Storage", "Databases", "Serverless Computing" }
        };

        for (int i = 0; i < courses.size(); i++) {
            for (String moduleName : moduleNames[i]) {
                Module module = new Module();
                module.setTitle(moduleName);
                module.setCourse(courses.get(i));
                modules.add(moduleRepository.save(module));
            }
        }

        System.out.println("✓ Created " + modules.size() + " modules");
        return modules;
    }

    private List<Lesson> createLessons(List<Module> modules) {
        List<Lesson> lessons = new ArrayList<>();

        String[] lessonTitles = {
                "Introduction & Setup", "Variables & Data Types", "Control Flow", "Functions & Methods",
                "Classes & Objects", "Inheritance & Polymorphism", "Interfaces & Abstractions",
                "Exception Handling", "File I/O Operations", "Collections Overview",
                "Lists & ArrayLists", "Maps & HashMaps", "Sets & HashSets",
                "Streams Introduction", "Filter & Map Operations", "Terminal Operations",
                "Functional Interfaces", "Lambda Expressions", "Method References"
        };

        String[] videoUrls = {
                "https://www.youtube.com/watch?v=eIrMbAQSU34",  // Java Programming for Beginners - Introduction
                "https://www.youtube.com/watch?v=GoXwIVyNvX0",  // Java Variables and Data Types
                "https://www.youtube.com/watch?v=sxQaBpxrsSA",  // Java Control Flow - If/Else and Loops
                "https://www.youtube.com/watch?v=rRwAFV59wO8",  // Java Methods and Functions
                "https://www.youtube.com/watch?v=PAVD7Z7AwqE"   // Java Object-Oriented Programming
        };

        String[] contents = {
                "Learn the basics and setup your development environment with IDE and tools.",
                "Understand variables, data types, and how to work with different primitive types.",
                "Master control flow statements like if-else, switch, loops.",
                "Learn how to define and use functions and methods effectively.",
                "Understand object-oriented programming with classes and objects.",
                "Learn inheritance, method overriding, and polymorphism concepts.",
                "Master interfaces, abstract classes, and abstraction principles.",
                "Learn exception handling with try-catch-finally blocks.",
                "Understand file operations for reading and writing data.",
                "Overview of Java Collections Framework.",
                "Learn about List interface and ArrayList implementation.",
                "Understand Map interface and HashMap implementation.",
                "Learn about Set interface and HashSet implementation.",
                "Introduction to Java Streams API.",
                "Learn filter and map operations on streams.",
                "Understand terminal operations like collect, forEach.",
                "Learn functional interfaces in Java.",
                "Master lambda expressions for concise code.",
                "Learn method references as a shorthand for lambdas."
        };

        int lessonIndex = 0;
        for (Module module : modules) {
            int lessonsPerModule = 3 + new Random().nextInt(3);
            for (int i = 0; i < lessonsPerModule && lessonIndex < lessonTitles.length; i++) {
                Lesson lesson = new Lesson();
                lesson.setTitle(lessonTitles[lessonIndex]);
                lesson.setContent(contents[lessonIndex % contents.length]);
                lesson.setVideoUrl(videoUrls[lessonIndex % videoUrls.length]);
                lesson.setModule(module);
                lessons.add(lessonRepository.save(lesson));
                lessonIndex++;
            }
        }

        System.out.println("✓ Created " + lessons.size() + " lessons");
        return lessons;
    }

    private List<Enrollment> createEnrollments(List<User> users, List<Course> courses) {
        List<Enrollment> enrollments = new ArrayList<>();

        List<User> students = users.stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .toList();

        for (User student : students) {
            for (Course course : courses) {
                if (new Random().nextBoolean()) {
                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);
                    enrollment.setEnrolledAt(LocalDate.now().minusDays(new Random().nextInt(60)));
                    enrollment.setProgress(new Random().nextDouble() * 100);
                    enrollments.add(enrollmentRepository.save(enrollment));
                }
            }
        }

        System.out.println("✓ Created " + enrollments.size() + " enrollments");
        return enrollments;
    }

    private void createPayments(List<User> users, List<Enrollment> enrollments) {
        List<Payment> payments = new ArrayList<>();

        String[] paymentMethods = { "credit_card", "debit_card", "paypal", "stripe" };
        PaymentStatus[] paymentStatuses = { PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED };

        for (int i = 0; i < 15; i++) {
            Payment payment = new Payment();
            Enrollment enrollment = enrollments.get(new Random().nextInt(enrollments.size()));

            payment.setUser(enrollment.getStudent());
            payment.setAmount(enrollment.getCourse().getPrice());
            payment.setMethod(paymentMethods[new Random().nextInt(paymentMethods.length)]);
            payment.setStatus(paymentStatuses[new Random().nextInt(paymentStatuses.length)]);
            payment.setPaidAt(LocalDateTime.now().minusDays(new Random().nextInt(30)));

            payments.add(paymentRepository.save(payment));
        }

        System.out.println("✓ Created " + payments.size() + " payments");
    }

    private void createCertificates(List<User> users, List<Course> courses) {
        List<User> students = users.stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .toList();

        int certificatesCreated = 0;
        for (int i = 0; i < 10 && i < students.size() * courses.size(); i++) {
            Certificate certificate = new Certificate();
            User student = students.get(i % students.size());
            Course course = courses.get(i % courses.size());

            certificate.setUser(student);
            certificate.setCourse(course);
            certificate.setCertificateUrl("https://certificates.elearning.com/cert-" + UUID.randomUUID());

            certificateRepository.save(certificate);
            certificatesCreated++;
        }

        System.out.println("✓ Created " + certificatesCreated + " certificates");
    }

    private void createSubscriptionsForExistingStudents() {
        System.out.println("Creating subscriptions for existing students...");
        
        // Get all students
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .toList();
        
        // Get the first available plan
        SubscriptionPlan plan = subscriptionPlanRepository.findAll().stream()
                .findFirst()
                .orElse(null);
        
        if (plan == null) {
            System.out.println("⚠ No subscription plans found. Skipping subscription creation.");
            return;
        }
        
        int subscriptionsCreated = 0;
        for (User student : students) {
            // Check if student already has any subscription
            List<Subscription> existingSubscriptions = subscriptionRepository.findByUser(student);
            
            if (existingSubscriptions.isEmpty()) {
                Subscription subscription = new Subscription();
                subscription.setUser(student);
                subscription.setPlan(plan);
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setStartDate(LocalDateTime.now());
                subscription.setEndDate(LocalDateTime.now().plusMonths(1));
                subscription.setRenewalDate(LocalDateTime.now().plusMonths(1));
                subscription.setAutoRenew(true);
                
                subscriptionRepository.save(subscription);
                subscriptionsCreated++;
            }
        }
        
        if (subscriptionsCreated > 0) {
            System.out.println("✓ Created " + subscriptionsCreated + " subscriptions for existing students");
        }
    }
}

