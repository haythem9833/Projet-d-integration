-- Script pour créer un compte administrateur
-- Email: admin@elearning.com
-- Mot de passe: Admin@123

-- Vérifier si l'utilisateur existe déjà
DELETE FROM users WHERE email = 'admin@elearning.com';

-- Insérer le compte administrateur
-- Le mot de passe "Admin@123" est encodé en BCrypt
-- Hash BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (first_name, last_name, email, password, role, blocked, created_at)
VALUES (
    'Admin',
    'System',
    'admin@elearning.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    false,
    NOW()
);

-- Afficher le résultat
SELECT id, first_name, last_name, email, role, blocked, created_at
FROM users
WHERE email = 'admin@elearning.com';
