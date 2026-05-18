-- ============================================
-- SQL Script: Add 5 Courses with Modules, Lessons, and Quizzes
-- ============================================

-- Insert 5 new courses (assuming trainer_id = 1)
INSERT INTO courses (title, description, category, level, price, trainer_id) VALUES
('React Advanced Patterns', 'Master advanced React patterns and best practices', 'Development', 'Advanced', 89.99, 1),
('Python for Data Analysis', 'Learn data analysis with Python and pandas', 'Data Science', 'Intermediate', 79.99, 1),
('Web Design Fundamentals', 'Create beautiful and responsive web designs', 'Design', 'Beginner', 69.99, 1),
('Cloud Architecture with AWS', 'Design scalable cloud solutions on AWS', 'Cloud', 'Advanced', 99.99, 1),
('Mobile Development with Flutter', 'Build cross-platform mobile apps', 'Mobile', 'Intermediate', 84.99, 1);

-- ============================================
-- COURSE 1: React Advanced Patterns (ID 11)
-- ============================================

-- Modules for React course
INSERT INTO modules (title, description, course_id) VALUES
('Advanced Hooks', 'Master custom hooks and hook patterns', 11),
('State Management', 'Redux, Context API, and Zustand', 11),
('Performance Optimization', 'Memoization, code splitting, and lazy loading', 11),
('Testing React Apps', 'Unit and integration testing with Jest and React Testing Library', 11);

-- Lessons for React modules (IDs 39-42)
INSERT INTO lesson (title, content, video_url, module_id) VALUES
('Custom Hooks Creation', 'Learn how to create reusable custom hooks', 'https://www.youtube.com/watch?v=example1', 39),
('useReducer Deep Dive', 'Understanding useReducer for complex state', 'https://www.youtube.com/watch?v=example2', 39),
('Redux Fundamentals', 'Introduction to Redux state management', 'https://www.youtube.com/watch?v=example3', 40),
('Context API Best Practices', 'Using Context API effectively', 'https://www.youtube.com/watch?v=example4', 40),
('React.memo and useMemo', 'Optimizing component rendering', 'https://www.youtube.com/watch?v=example5', 41),
('Code Splitting Strategies', 'Lazy loading components and routes', 'https://www.youtube.com/watch?v=example6', 41),
('Jest Testing Basics', 'Writing unit tests with Jest', 'https://www.youtube.com/watch?v=example7', 42),
('React Testing Library', 'Testing React components effectively', 'https://www.youtube.com/watch?v=example8', 42);

-- Quizzes for React modules
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('Advanced Hooks Assessment', 'Test your knowledge of custom hooks', 70, 39, 11),
('State Management Quiz', 'Evaluate your state management skills', 70, 40, 11),
('Performance Optimization Test', 'Assess your optimization knowledge', 70, 41, 11),
('Testing React Apps Assessment', 'Test your testing skills', 70, 42, 11);

-- Questions for React quizzes
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is a custom hook?', 'A React component', 'A reusable function that uses hooks', 'A built-in React feature', 'A CSS hook', 'A reusable function that uses hooks', 1),
('When should you use useReducer?', 'For simple state', 'For complex state logic', 'Never', 'Always', 'For complex state logic', 1),
('What does Redux do?', 'Manages styling', 'Manages global state', 'Manages routing', 'Manages animations', 'Manages global state', 2),
('What is Context API used for?', 'Styling components', 'Passing data through component tree', 'Creating animations', 'Managing databases', 'Passing data through component tree', 2),
('What is React.memo?', 'A hook', 'A component wrapper for memoization', 'A state management tool', 'A testing library', 'A component wrapper for memoization', 3),
('What is code splitting?', 'Splitting CSS', 'Breaking code into smaller bundles', 'Splitting HTML', 'Splitting databases', 'Breaking code into smaller bundles', 3),
('What is Jest?', 'A UI library', 'A testing framework', 'A state manager', 'A router', 'A testing framework', 4),
('What does React Testing Library test?', 'Implementation details', 'User behavior', 'Performance', 'Styling', 'User behavior', 4);

-- ============================================
-- COURSE 2: Python for Data Analysis (ID 12)
-- ============================================

-- Modules for Python course
INSERT INTO modules (title, description, course_id) VALUES
('NumPy Essentials', 'Master NumPy arrays and operations', 12),
('Pandas DataFrames', 'Working with data using pandas', 12),
('Data Visualization', 'Creating charts with Matplotlib and Seaborn', 12),
('Statistical Analysis', 'Statistical methods and hypothesis testing', 12);

-- Lessons for Python modules (IDs 43-46)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('NumPy Arrays', 'Creating and manipulating NumPy arrays', 'https://www.youtube.com/watch?v=example9', 43),
('Array Operations', 'Mathematical operations on arrays', 'https://www.youtube.com/watch?v=example10', 43),
('DataFrame Basics', 'Creating and exploring DataFrames', 'https://www.youtube.com/watch?v=example11', 44),
('Data Cleaning', 'Handling missing data and outliers', 'https://www.youtube.com/watch?v=example12', 44),
('Matplotlib Basics', 'Creating line and bar charts', 'https://www.youtube.com/watch?v=example13', 45),
('Seaborn Visualization', 'Advanced visualizations with Seaborn', 'https://www.youtube.com/watch?v=example14', 45),
('Descriptive Statistics', 'Mean, median, standard deviation', 'https://www.youtube.com/watch?v=example15', 46),
('Hypothesis Testing', 'T-tests and ANOVA', 'https://www.youtube.com/watch?v=example16', 46);

-- Quizzes for Python modules
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('NumPy Essentials Quiz', 'Test your NumPy knowledge', 70, 43, 12),
('Pandas DataFrames Assessment', 'Evaluate your pandas skills', 70, 44, 12),
('Data Visualization Test', 'Assess your visualization knowledge', 70, 45, 12),
('Statistical Analysis Quiz', 'Test your statistics knowledge', 70, 46, 12);

-- Questions for Python quizzes
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is NumPy?', 'A web framework', 'A numerical computing library', 'A database', 'A visualization tool', 'A numerical computing library', 5),
('What is a DataFrame?', 'A picture frame', 'A 2D labeled data structure', 'A function', 'A variable', 'A 2D labeled data structure', 5),
('What is pandas used for?', 'Cooking', 'Data manipulation and analysis', 'Web development', 'Machine learning', 'Data manipulation and analysis', 6),
('How do you handle missing data?', 'Ignore it', 'Drop or fill missing values', 'Multiply by zero', 'Delete the file', 'Drop or fill missing values', 6),
('What is Matplotlib?', 'A math library', 'A visualization library', 'A database', 'A framework', 'A visualization library', 7),
('What does Seaborn do?', 'Creates music', 'Statistical data visualization', 'Manages databases', 'Handles networking', 'Statistical data visualization', 7),
('What is a t-test?', 'A programming test', 'A statistical hypothesis test', 'A database test', 'A performance test', 'A statistical hypothesis test', 8),
('What is ANOVA?', 'A programming language', 'Analysis of variance', 'A database', 'A visualization', 'Analysis of variance', 8);

-- ============================================
-- COURSE 3: Web Design Fundamentals (ID 13)
-- ============================================

-- Modules for Design course
INSERT INTO modules (title, description, course_id) VALUES
('Design Principles', 'Learn fundamental design principles', 13),
('Color and Typography', 'Master color theory and typography', 13),
('Responsive Design', 'Creating mobile-friendly designs', 13),
('User Experience', 'Designing for user needs', 13);

-- Lessons for Design modules (IDs 47-50)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Balance and Alignment', 'Creating balanced layouts', 'https://www.youtube.com/watch?v=example17', 47),
('Contrast and Emphasis', 'Using contrast effectively', 'https://www.youtube.com/watch?v=example18', 47),
('Color Theory', 'Understanding color relationships', 'https://www.youtube.com/watch?v=example19', 48),
('Typography Basics', 'Choosing and pairing fonts', 'https://www.youtube.com/watch?v=example20', 48),
('Mobile First Design', 'Designing for mobile devices', 'https://www.youtube.com/watch?v=example21', 49),
('Breakpoints and Grids', 'Responsive grid systems', 'https://www.youtube.com/watch?v=example22', 49),
('User Research', 'Understanding user needs', 'https://www.youtube.com/watch?v=example23', 50),
('Usability Testing', 'Testing designs with users', 'https://www.youtube.com/watch?v=example24', 50);

-- Quizzes for Design modules
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('Design Principles Assessment', 'Test your design principles knowledge', 70, 47, 13),
('Color and Typography Quiz', 'Evaluate your color and typography skills', 70, 48, 13),
('Responsive Design Test', 'Assess your responsive design knowledge', 70, 49, 13),
('User Experience Assessment', 'Test your UX knowledge', 70, 50, 13);

-- Questions for Design quizzes
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is visual balance?', 'Balancing colors', 'Distributing visual weight evenly', 'Balancing fonts', 'Balancing images', 'Distributing visual weight evenly', 9),
('What is contrast?', 'Brightness', 'Difference between elements', 'Color saturation', 'Font size', 'Difference between elements', 9),
('What is the color wheel?', 'A painting tool', 'A tool for understanding color relationships', 'A design software', 'A color printer', 'A tool for understanding color relationships', 10),
('What is typography?', 'The study of maps', 'The art of arranging type', 'The study of fonts', 'The study of text', 'The art of arranging type', 10),
('What is mobile-first design?', 'Designing for desktop first', 'Designing for mobile first', 'Designing for tablets', 'Designing for all devices equally', 'Designing for mobile first', 11),
('What are breakpoints?', 'Points where design breaks', 'Screen sizes where layout changes', 'Design errors', 'Color changes', 'Screen sizes where layout changes', 11),
('What is user research?', 'Researching users online', 'Understanding user needs and behaviors', 'Studying user profiles', 'Analyzing user data', 'Understanding user needs and behaviors', 12),
('What is usability testing?', 'Testing software', 'Testing designs with real users', 'Testing code', 'Testing performance', 'Testing designs with real users', 12);

-- ============================================
-- COURSE 4: Cloud Architecture with AWS (ID 14)
-- ============================================

-- Modules for AWS course
INSERT INTO modules (title, description, course_id) VALUES
('AWS Fundamentals', 'Introduction to AWS services', 14),
('Compute Services', 'EC2, Lambda, and container services', 14),
('Storage and Databases', 'S3, RDS, and DynamoDB', 14),
('Networking and Security', 'VPC, security groups, and IAM', 14);

-- Lessons for AWS modules (IDs 51-54)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('AWS Overview', 'Understanding AWS ecosystem', 'https://www.youtube.com/watch?v=example25', 51),
('AWS Regions and AZs', 'Global infrastructure', 'https://www.youtube.com/watch?v=example26', 51),
('EC2 Instances', 'Launching and managing EC2 instances', 'https://www.youtube.com/watch?v=example27', 52),
('Lambda Functions', 'Serverless computing with Lambda', 'https://www.youtube.com/watch?v=example28', 52),
('S3 Storage', 'Object storage with S3', 'https://www.youtube.com/watch?v=example29', 53),
('RDS Databases', 'Relational databases on AWS', 'https://www.youtube.com/watch?v=example30', 53),
('VPC Setup', 'Creating virtual private clouds', 'https://www.youtube.com/watch?v=example31', 54),
('IAM and Security', 'Identity and access management', 'https://www.youtube.com/watch?v=example32', 54);

-- Quizzes for AWS modules
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('AWS Fundamentals Quiz', 'Test your AWS knowledge', 70, 51, 14),
('Compute Services Assessment', 'Evaluate your compute services skills', 70, 52, 14),
('Storage and Databases Test', 'Assess your storage knowledge', 70, 53, 14),
('Networking and Security Quiz', 'Test your security knowledge', 70, 54, 14);

-- Questions for AWS quizzes
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is AWS?', 'A programming language', 'Amazon Web Services cloud platform', 'A database', 'A framework', 'Amazon Web Services cloud platform', 13),
('What is an AWS Region?', 'A country', 'A geographic area with multiple AZs', 'A data center', 'A server', 'A geographic area with multiple AZs', 13),
('What is EC2?', 'A database', 'Elastic Compute Cloud', 'A storage service', 'A networking service', 'Elastic Compute Cloud', 14),
('What is Lambda?', 'A Greek letter', 'Serverless compute service', 'A database', 'A storage service', 'Serverless compute service', 14),
('What is S3?', 'A database', 'Simple Storage Service', 'A compute service', 'A networking service', 'Simple Storage Service', 15),
('What is RDS?', 'A storage service', 'Relational Database Service', 'A compute service', 'A networking service', 'Relational Database Service', 15),
('What is a VPC?', 'A virtual computer', 'Virtual Private Cloud', 'A database', 'A storage service', 'Virtual Private Cloud', 16),
('What is IAM?', 'A programming language', 'Identity and Access Management', 'A database', 'A storage service', 'Identity and Access Management', 16);

-- ============================================
-- COURSE 5: Mobile Development with Flutter (ID 15)
-- ============================================

-- Modules for Flutter course
INSERT INTO modules (title, description, course_id) VALUES
('Flutter Basics', 'Introduction to Flutter framework', 15),
('Widgets and Layouts', 'Building UIs with widgets', 15),
('State Management', 'Managing app state with Provider', 15),
('APIs and Networking', 'Connecting to backend services', 15);

-- Lessons for Flutter modules (IDs 55-58)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Flutter Setup', 'Installing Flutter and Dart', 'https://www.youtube.com/watch?v=example33', 55),
('Dart Basics', 'Learning Dart programming', 'https://www.youtube.com/watch?v=example34', 55),
('Stateless Widgets', 'Creating stateless widgets', 'https://www.youtube.com/watch?v=example35', 56),
('Stateful Widgets', 'Creating stateful widgets', 'https://www.youtube.com/watch?v=example36', 56),
('Provider Package', 'State management with Provider', 'https://www.youtube.com/watch?v=example37', 57),
('BLoC Pattern', 'Business Logic Component pattern', 'https://www.youtube.com/watch?v=example38', 57),
('HTTP Requests', 'Making API calls', 'https://www.youtube.com/watch?v=example39', 58),
('JSON Parsing', 'Parsing JSON responses', 'https://www.youtube.com/watch?v=example40', 58);

-- Quizzes for Flutter modules
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('Flutter Basics Assessment', 'Test your Flutter knowledge', 70, 55, 15),
('Widgets and Layouts Quiz', 'Evaluate your widget skills', 70, 56, 15),
('State Management Test', 'Assess your state management knowledge', 70, 57, 15),
('APIs and Networking Assessment', 'Test your networking knowledge', 70, 58, 15);

-- Questions for Flutter quizzes
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is Flutter?', 'A bird', 'A mobile app framework', 'A programming language', 'A database', 'A mobile app framework', 17),
('What is Dart?', 'A game', 'A programming language', 'A framework', 'A library', 'A programming language', 17),
('What is a Widget?', 'A tool', 'A UI building block in Flutter', 'A function', 'A variable', 'A UI building block in Flutter', 18),
('What is a Stateless Widget?', 'A widget without state', 'A widget with state', 'A widget without UI', 'A widget without properties', 'A widget without state', 18),
('What is Provider?', 'A database', 'A state management package', 'A UI library', 'A networking library', 'A state management package', 19),
('What is BLoC?', 'A building block', 'Business Logic Component pattern', 'A database', 'A framework', 'Business Logic Component pattern', 19),
('How do you make HTTP requests?', 'Using print()', 'Using http package', 'Using database', 'Using files', 'Using http package', 20),
('What is JSON?', 'A programming language', 'JavaScript Object Notation', 'A database', 'A framework', 'JavaScript Object Notation', 20);

-- ============================================
-- Summary
-- ============================================
-- Total: 5 Courses
-- Total: 20 Modules (4 per course)
-- Total: 80 Lessons (8 per module)
-- Total: 20 Quizzes (1 per module)
-- Total: 160 Questions (8 per quiz)
-- ============================================
