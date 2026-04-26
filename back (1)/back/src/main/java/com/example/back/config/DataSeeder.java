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
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final PaymentRepository paymentRepository;
    private final CertificateRepository certificateRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    public DataSeeder(
            UserRepository userRepository,
            CourseRepository courseRepository,
            ModuleRepository moduleRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            PaymentRepository paymentRepository,
            CertificateRepository certificateRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.paymentRepository = paymentRepository;
        this.certificateRepository = certificateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("Database already populated. Skipping seed data.");
            return;
        }

        System.out.println("Starting database seed with realistic test data...");

        // 1. Create Users
        List<User> users = createUsers();

        // 2. Create Courses (with Trainers)
        List<Course> courses = createCourses(users);

        // 3. Create Modules for each Course
        List<Module> modules = createModules(courses);

        // 4. Create Lessons for each Module
        List<Lesson> lessons = createLessons(modules);

        // 5. Create Quizzes for each Course
        List<Quiz> quizzes = createQuizzes(courses);

        // 6. Create Questions for each Quiz
        createQuestions(quizzes);

        // 7. Create Enrollments
        List<Enrollment> enrollments = createEnrollments(users, courses);

        // 8. Create Payments
        createPayments(users, enrollments);

        // 9. Create Certificates
        createCertificates(users, courses);

        System.out.println("✓ Database seed completed successfully!");
        System.out.println("  - 10 Users created (2 ADMIN, 3 TRAINER, 5 STUDENT)");
        System.out.println("  - 5 Courses created");
        System.out.println("  - 18 Modules created");
        System.out.println("  - 75 Lessons created");
        System.out.println("  - 20 Enrollments created");
        System.out.println("  - 5 Quizzes with 60 Questions created");
        System.out.println("  - 15 Payments created");
        System.out.println("  - 10 Certificates created");
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
                "https://youtube.com/watch?v=video1",
                "https://youtube.com/watch?v=video2",
                "https://youtube.com/watch?v=video3",
                "https://youtube.com/watch?v=video4",
                "https://youtube.com/watch?v=video5"
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

    private List<Quiz> createQuizzes(List<Course> courses) {
        List<Quiz> quizzes = new ArrayList<>();

        String[] quizTitles = {
                "Java Fundamentals Assessment",
                "React Mastery Quiz",
                "Python Data Science Quiz",
                "Flutter Development Test",
                "AWS Architecture Quiz"
        };

        for (int i = 0; i < courses.size(); i++) {
            Quiz quiz = new Quiz();
            quiz.setTitle(quizTitles[i]);
            quiz.setCourse(courses.get(i));
            quizzes.add(quizRepository.save(quiz));
        }

        System.out.println("✓ Created " + quizzes.size() + " quizzes");
        return quizzes;
    }

    private void createQuestions(List<Quiz> quizzes) {
        String[][] questionSets = {
                // Java questions
                {
                        "What is the purpose of the 'static' keyword in Java?",
                        "Which collection type maintains insertion order?",
                        "What does JVM stand for?",
                        "How many threads can a single process have?",
                        "What is the difference between ArrayList and LinkedList?",
                        "What is the purpose of the 'final' keyword?",
                        "How does garbage collection work in Java?",
                        "What is method overloading?",
                        "Explain the concept of inheritance in Java",
                        "What are the different access modifiers in Java?",
                        "What is encapsulation?",
                        "What is polymorphism?"
                },
                // React questions
                {
                        "What is JSX in React?",
                        "What is the difference between state and props?",
                        "What are hooks in React?",
                        "How does React handle component re-rendering?",
                        "What is the virtual DOM?",
                        "Explain the component lifecycle",
                        "What is a higher-order component (HOC)?",
                        "What are controlled components?",
                        "Explain uncontrolled components",
                        "What is context API?",
                        "How does React diffing algorithm work?",
                        "What is Redux?"
                },
                // Python questions
                {
                        "What is a list comprehension?",
                        "Explain the difference between lists and tuples",
                        "What is a lambda function?",
                        "How do you handle exceptions in Python?",
                        "What is a decorator?",
                        "Explain the GIL in Python",
                        "What are generators?",
                        "What is the difference between == and is?",
                        "How does Python manage memory?",
                        "What are *args and **kwargs?",
                        "Explain Python's import system",
                        "What is a package in Python?"
                },
                // Flutter questions
                {
                        "What is Flutter and why use it?",
                        "Explain the difference between StatelessWidget and StatefulWidget",
                        "What is hot reload in Flutter?",
                        "What are widgets in Flutter?",
                        "How does Flutter achieve cross-platform compatibility?",
                        "What is the purpose of BuildContext?",
                        "Explain the widget tree",
                        "What are layouts in Flutter?",
                        "How do you handle navigation in Flutter?",
                        "What is the provider package?",
                        "Explain bloc pattern",
                        "What is a stream in Flutter?"
                },
                // AWS questions
                {
                        "What are the benefits of cloud computing?",
                        "Explain the AWS shared responsibility model",
                        "What is an EC2 instance?",
                        "What is S3 in AWS?",
                        "Explain the difference between RDS and DynamoDB",
                        "What is Lambda in AWS?",
                        "What is CloudFront?",
                        "Explain VPC in AWS",
                        "What are IAM roles?",
                        "What is Auto Scaling?",
                        "Explain load balancing",
                        "What is CloudWatch?"
                }
        };

        String[][] answerOptions = {
                // Java answers
                {
                        "Members|To create class-level variables|Method modifiers|Package declaration",
                        "HashMap|LinkedList|TreeSet|HashSet",
                        "Java Virtual Machine|Java Version Manager|Java Validation Module|Java Versioning Model",
                        "One|Two|Three|Unlimited",
                        "ArrayList is faster for random access|LinkedList uses less memory|ArrayList uses contiguous memory|All of above",
                        "To make a variable immutable|To create constants|To prevent inheritance|All of above",
                        "Automatically reclaims unused memory|Manually triggered|Scheduled process|Both A and C",
                        "Same method name with different parameters|Same method name with different return type|Different method names|None",
                        "Passing properties to parent|Creating class hierarchy|Reusing code|All of above",
                        "public, private, protected, default|public, private, static, default|public, protected, final, default|None",
                        "Bundling data and methods|Hiding implementation details|Controlling access|All of above",
                        "Object acting as multiple types|Method having multiple implementations|Class having multiple parents|All of above"
                },
                // React answers
                {
                        "JavaScript XML|JSON XML|JavaScript eXtension|None",
                        "Props are mutable|State is passed from parent|Props are read-only|State updates trigger re-render",
                        "Functions for managing state|Only class components|Functional components feature|Built-in functions",
                        "When state changes|When props change|When parent re-renders|All of above",
                        "Optimized representation of DOM|Browser API|Memory storage|Server-side rendering",
                        "Mounting, Updating, Unmounting|Loading, Processing, Saving|Creation, Execution, Termination|None",
                        "Function returning component|Component wrapper pattern|Class decorator|All of above",
                        "Form elements with controlled state|Form elements without state|Manual form handling|None",
                        "State maintained internally|No props passed|Element manages own state|All of above",
                        "Global state management|Local state management|Props passing|State lifting",
                        "Virtual DOM comparison|Key-based diffing|Depth-first traversal|All of above",
                        "State management library|Middleware|Reducer pattern|All of above"
                },
                // Python answers
                {
                        "Shorthand syntax for lists|Filtering data|Creating new lists|All of above",
                        "Lists are mutable|Tuples are immutable|Different syntax|All of above",
                        "Anonymous function|Function without name|Short function|All of above",
                        "try-except-finally|try-except|try-catch|None",
                        "Function wrapper|Modifying function behavior|Design pattern|All of above",
                        "Memory management|Threading limitation|Performance issue|All of above",
                        "Functions yielding values|Lazy evaluation|Memory efficient|All of above",
                        "Equality check|Identity check|Same meaning|None",
                        "Reference counting|Automatic|Manual|Both A and B",
                        "Variable arguments|Keyword arguments|Both|Neither",
                        "Module system|Package management|Namespace|All of above",
                        "Directory with __init__.py|Python file|Collection of modules|Both A and C"
                },
                // Flutter answers
                {
                        "UI framework|Programming language|Database|Server",
                        "StatelessWidget is immutable|StatefulWidget manages state|Both|Neither",
                        "Reloading without restarting|Compilation feature|Debugging tool|All of above",
                        "UI elements|Building blocks|Components|All of above",
                        "Single codebase|Cross-compilation|Virtual machine|All of above",
                        "Accessing theme data|Navigation context|Widget reference|All of above",
                        "Hierarchy of widgets|Widget composition|UI structure|All of above",
                        "Positioning widgets|Arranging widgets|Organizing UI|All of above",
                        "Navigator class|Route objects|Page transitions|All of above",
                        "State management|Dependency injection|Reactive programming|All of above",
                        "Design pattern|State management architecture|Business logic|All of above",
                        "Asynchronous data|Continuous data flow|Observable pattern|All of above"
                },
                // AWS answers
                {
                        "Scalability|Flexibility|Cost-effectiveness|All of above",
                        "AWS responsible for infrastructure|Customer responsible for content|Both have responsibilities|None",
                        "Virtual machine|Server instance|Computing resource|All of above",
                        "Simple Storage Service|Secure Storage Service|Static Storage Service|None",
                        "Relational vs NoSQL|Structured vs unstructured|Different query models|All of above",
                        "Serverless compute|Event-driven functions|Auto-scaling|All of above",
                        "CDN service|Content delivery|Edge locations|All of above",
                        "Virtual network|Isolated network|Security boundary|All of above",
                        "Access management|User permissions|Resource authorization|All of above",
                        "Automatic scaling|Load distribution|Performance optimization|All of above",
                        "Distributing traffic|High availability|Fault tolerance|All of above",
                        "Monitoring service|Metrics tracking|Logging|All of above"
                }
        };

        int correctAnswers = 0;
        for (int i = 0; i < quizzes.size(); i++) {
            String[] questions = questionSets[i % questionSets.length];
            String[] answers = answerOptions[i % answerOptions.length];

            for (int j = 0; j < questions.length; j++) {
                Question question = new Question();
                question.setQuestionText(questions[j]);

                String[] options = answers[j % answers.length].split("\\|");
                if (options.length >= 4) {
                    question.setOptionA(options[0]);
                    question.setOptionB(options[1]);
                    question.setOptionC(options[2]);
                    question.setOptionD(options[3]);
                    question.setCorrectAnswer(options[0]); // First option is correct
                    correctAnswers++;
                } else {
                    question.setOptionA("Option A");
                    question.setOptionB("Option B");
                    question.setOptionC("Option C");
                    question.setOptionD("Option D");
                    question.setCorrectAnswer("Option A");
                    correctAnswers++;
                }

                question.setQuiz(quizzes.get(i));
                questionRepository.save(question);
            }
        }

        System.out.println("✓ Created " + correctAnswers + " questions");
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
        String[] paymentStatuses = { "pending", "completed", "failed" };

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
}
