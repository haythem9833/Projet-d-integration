-- Insert test users with bcrypt hashed passwords
-- Password: password123 (bcrypt hash)
-- Hash generated with: $2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM

INSERT INTO users (first_name, last_name, email, password, role, blocked, created_at) VALUES
('Admin', 'User', 'admin@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM', 'ADMIN', 0, NOW()),
('Professor', 'User', 'professor@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM', 'PROFESSOR', 0, NOW()),
('Student', 'User', 'student@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM', 'STUDENT', 0, NOW());
