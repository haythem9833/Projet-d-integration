-- Insert new test courses
INSERT INTO course (title, description, category, level, price, trainer_id, created_at) VALUES
('Machine Learning Basics', 'Learn the fundamentals of machine learning with Python', 'Data Science', 'Beginner', 79.99, 1, NOW()),
('Advanced JavaScript', 'Master advanced JavaScript concepts and patterns', 'Development', 'Advanced', 89.99, 2, NOW()),
('UI/UX Design Principles', 'Learn professional UI/UX design from scratch', 'Design', 'Beginner', 69.99, 3, NOW()),
('DevOps Essentials', 'Master Docker, Kubernetes, and CI/CD pipelines', 'Cloud', 'Intermediate', 99.99, 1, NOW()),
('Blockchain Development', 'Build decentralized applications with Solidity', 'Development', 'Advanced', 129.99, 2, NOW());

-- Get the IDs of newly created courses (assuming they are 6-10)
-- Insert modules for Machine Learning course (ID 6)
INSERT INTO modules (title, description, course_id) VALUES
('ML Fundamentals', 'Introduction to machine learning concepts', 6),
('Supervised Learning', 'Learn regression and classification algorithms', 6),
('Unsupervised Learning', 'Clustering and dimensionality reduction', 6),
('Neural Networks', 'Deep learning and neural network basics', 6);

-- Insert modules for Advanced JavaScript course (ID 7)
INSERT INTO modules (title, description, course_id) VALUES
('Closures and Scope', 'Understanding JavaScript closures and scope chain', 7),
('Async Programming', 'Promises, async/await, and event loop', 7),
('Design Patterns', 'Common JavaScript design patterns', 7),
('Performance Optimization', 'Optimizing JavaScript applications', 7);

-- Insert modules for UI/UX Design course (ID 8)
INSERT INTO modules (title, description, course_id) VALUES
('Design Fundamentals', 'Color theory, typography, and layout', 8),
('User Research', 'Understanding user needs and behavior', 8),
('Wireframing & Prototyping', 'Creating effective wireframes and prototypes', 8),
('Design Systems', 'Building scalable design systems', 8);

-- Insert modules for DevOps course (ID 9)
INSERT INTO modules (title, description, course_id) VALUES
('Docker Basics', 'Containerization with Docker', 9),
('Kubernetes Orchestration', 'Container orchestration with Kubernetes', 9),
('CI/CD Pipelines', 'Continuous integration and deployment', 9),
('Monitoring & Logging', 'System monitoring and log management', 9);

-- Insert modules for Blockchain course (ID 10)
INSERT INTO modules (title, description, course_id) VALUES
('Blockchain Fundamentals', 'Understanding blockchain technology', 10),
('Smart Contracts', 'Writing smart contracts with Solidity', 10),
('DApp Development', 'Building decentralized applications', 10),
('Security Best Practices', 'Blockchain security and auditing', 10);

-- Insert lessons for ML course modules (IDs 19-22)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('What is Machine Learning', 'Introduction to ML concepts', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 19),
('Types of ML', 'Supervised, unsupervised, and reinforcement learning', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 19),
('Linear Regression', 'Understanding linear regression algorithm', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 20),
('Logistic Regression', 'Classification with logistic regression', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 20),
('K-Means Clustering', 'Unsupervised clustering algorithm', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 21),
('PCA Dimensionality Reduction', 'Reducing feature dimensions', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 21),
('Neural Network Basics', 'Introduction to neural networks', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 22),
('Backpropagation', 'Training neural networks', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 22);

-- Insert lessons for JavaScript course modules (IDs 23-26)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Function Scope', 'Understanding function scope in JavaScript', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 23),
('Closure Patterns', 'Practical closure patterns', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 23),
('Promises', 'Working with JavaScript promises', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 24),
('Async/Await', 'Modern async programming with async/await', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 24),
('Singleton Pattern', 'Implementing singleton pattern', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 25),
('Observer Pattern', 'Event-driven architecture with observer pattern', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 25),
('Code Splitting', 'Optimizing bundle size with code splitting', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 26),
('Memory Leaks', 'Identifying and fixing memory leaks', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 26);

-- Insert lessons for UI/UX course modules (IDs 27-30)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Color Theory', 'Understanding color in design', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 27),
('Typography', 'Choosing and using fonts effectively', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 27),
('User Interviews', 'Conducting effective user interviews', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 28),
('User Personas', 'Creating accurate user personas', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 28),
('Wireframe Basics', 'Creating effective wireframes', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 29),
('Prototyping Tools', 'Using Figma and other prototyping tools', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 29),
('Component Libraries', 'Building design system components', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 30),
('Design Tokens', 'Managing design tokens', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 30);

-- Insert lessons for DevOps course modules (IDs 31-34)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Docker Installation', 'Setting up Docker environment', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 31),
('Docker Images', 'Creating and managing Docker images', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 31),
('Kubernetes Clusters', 'Setting up Kubernetes clusters', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 32),
('Deployments', 'Managing Kubernetes deployments', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 32),
('Jenkins Pipeline', 'Setting up CI/CD with Jenkins', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 33),
('GitLab CI', 'Using GitLab CI/CD', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 33),
('Prometheus Monitoring', 'Monitoring with Prometheus', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 34),
('ELK Stack', 'Logging with Elasticsearch, Logstash, Kibana', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 34);

-- Insert lessons for Blockchain course modules (IDs 35-38)
INSERT INTO lessons (title, content, video_url, module_id) VALUES
('Blockchain History', 'Evolution of blockchain technology', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 35),
('Consensus Mechanisms', 'PoW, PoS, and other consensus algorithms', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 35),
('Solidity Basics', 'Introduction to Solidity programming', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 36),
('Smart Contract Development', 'Writing production-ready smart contracts', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 36),
('Web3.js', 'Interacting with blockchain using Web3.js', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 37),
('DApp Architecture', 'Building scalable DApps', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 37),
('Smart Contract Auditing', 'Security auditing of smart contracts', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 38),
('Common Vulnerabilities', 'Identifying and fixing security issues', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 38);

-- Insert quizzes for all modules (one per module)
INSERT INTO quiz (title, description, passing_score, module_id, course_id) VALUES
('ML Fundamentals Assessment', 'Test your understanding of machine learning fundamentals', 70, 19, 6),
('Supervised Learning Quiz', 'Assess your knowledge of supervised learning algorithms', 70, 20, 6),
('Unsupervised Learning Test', 'Evaluate your understanding of clustering and dimensionality reduction', 70, 21, 6),
('Neural Networks Assessment', 'Test your knowledge of neural networks and deep learning', 70, 22, 6),
('Closures and Scope Quiz', 'Assess your understanding of JavaScript closures', 70, 23, 7),
('Async Programming Test', 'Evaluate your async programming skills', 70, 24, 7),
('Design Patterns Assessment', 'Test your knowledge of JavaScript design patterns', 70, 25, 7),
('Performance Optimization Quiz', 'Assess your optimization skills', 70, 26, 7),
('Design Fundamentals Test', 'Evaluate your design fundamentals knowledge', 70, 27, 8),
('User Research Assessment', 'Test your user research skills', 70, 28, 8),
('Wireframing Quiz', 'Assess your wireframing and prototyping skills', 70, 29, 8),
('Design Systems Test', 'Evaluate your design systems knowledge', 70, 30, 8),
('Docker Basics Assessment', 'Test your Docker knowledge', 70, 31, 9),
('Kubernetes Quiz', 'Assess your Kubernetes skills', 70, 32, 9),
('CI/CD Pipeline Test', 'Evaluate your CI/CD knowledge', 70, 33, 9),
('Monitoring Assessment', 'Test your monitoring and logging skills', 70, 34, 9),
('Blockchain Fundamentals Quiz', 'Assess your blockchain knowledge', 70, 35, 10),
('Smart Contracts Test', 'Evaluate your smart contract development skills', 70, 36, 10),
('DApp Development Assessment', 'Test your DApp development knowledge', 70, 37, 10),
('Security Best Practices Quiz', 'Assess your blockchain security knowledge', 70, 38, 10);

-- Insert sample questions for each quiz
INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, quiz_id) VALUES
('What is the primary goal of machine learning?', 'To create artificial intelligence', 'To enable computers to learn from data', 'To replace human intelligence', 'To process large datasets', 'To enable computers to learn from data', 1),
('Which type of learning uses labeled data?', 'Unsupervised learning', 'Supervised learning', 'Reinforcement learning', 'Transfer learning', 'Supervised learning', 1),
('What is linear regression used for?', 'Classification', 'Clustering', 'Prediction of continuous values', 'Dimensionality reduction', 'Prediction of continuous values', 2),
('What is the purpose of logistic regression?', 'Regression analysis', 'Binary classification', 'Multi-class classification', 'Clustering', 'Binary classification', 2),
('What does K-Means clustering do?', 'Classifies labeled data', 'Groups similar data points', 'Reduces feature dimensions', 'Predicts continuous values', 'Groups similar data points', 3),
('What is PCA used for?', 'Classification', 'Clustering', 'Dimensionality reduction', 'Regression', 'Dimensionality reduction', 3),
('What is a neural network?', 'A biological brain', 'A computational model inspired by neurons', 'A type of database', 'A programming language', 'A computational model inspired by neurons', 4),
('What is backpropagation?', 'Moving data forward', 'Training algorithm for neural networks', 'Storing data', 'Retrieving data', 'Training algorithm for neural networks', 4),
('What is a closure in JavaScript?', 'A function that closes', 'A function with access to outer scope', 'A loop that ends', 'A variable declaration', 'A function with access to outer scope', 5),
('What is function scope?', 'Global scope only', 'Variables accessible within a function', 'Variables accessible everywhere', 'No scope', 'Variables accessible within a function', 5),
('What is a Promise in JavaScript?', 'A guarantee', 'An object representing async operation', 'A variable type', 'A function parameter', 'An object representing async operation', 6),
('What does async/await do?', 'Makes code slower', 'Simplifies asynchronous code', 'Adds complexity', 'Removes functions', 'Simplifies asynchronous code', 6),
('What is the Singleton pattern?', 'Multiple instances', 'Single instance of a class', 'Pattern for loops', 'Pattern for arrays', 'Single instance of a class', 7),
('What is the Observer pattern?', 'Pattern for watching', 'Event-driven architecture pattern', 'Pattern for storage', 'Pattern for networking', 'Event-driven architecture pattern', 7),
('What is code splitting?', 'Dividing code into files', 'Breaking code into smaller bundles', 'Removing code', 'Combining code', 'Breaking code into smaller bundles', 8),
('What causes memory leaks?', 'Too much RAM', 'Unreleased references to objects', 'Fast processors', 'Large files', 'Unreleased references to objects', 8),
('What is color theory?', 'Study of colors in art and design', 'Study of light wavelengths', 'Study of paint', 'Study of printers', 'Study of colors in art and design', 9),
('What is typography?', 'Study of maps', 'Art of arranging type', 'Study of fonts', 'Study of text', 'Art of arranging type', 9),
('What is a user persona?', 'A real user', 'A fictional representation of target user', 'A user account', 'A user profile', 'A fictional representation of target user', 10),
('What is user research?', 'Studying users behavior and needs', 'Researching user accounts', 'Studying user interfaces', 'Researching user data', 'Studying users behavior and needs', 10);

COMMIT;
