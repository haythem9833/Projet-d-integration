-- ============================================================================
-- MIGRATION 1: Créer les tables d'abonnement
-- ============================================================================

-- 1. Créer TABLE: subscription_plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    billing_cycle ENUM('MONTHLY', 'YEARLY') NOT NULL,
    max_courses INT,
    max_students INT,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_billing_cycle (billing_cycle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer les plans par défaut
INSERT INTO subscription_plans (name, price, billing_cycle, max_courses, max_students, features) VALUES
('BASIC', 9.99, 'MONTHLY', 10, 100, '["access_to_courses", "certificates", "basic_support"]'),
('PRO', 19.99, 'MONTHLY', 50, 500, '["access_to_courses", "certificates", "priority_support", "analytics"]'),
('PREMIUM', 49.99, 'MONTHLY', NULL, NULL, '["access_to_courses", "certificates", "priority_support", "analytics", "custom_branding"]');

-- 2. Créer TABLE: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    renewal_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
    
    INDEX idx_user_status (user_id, status),
    INDEX idx_end_date (end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Créer TABLE: module_progress
CREATE TABLE IF NOT EXISTS module_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id BIGINT NOT NULL,
    module_id BIGINT NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_module_progress (enrollment_id, module_id),
    INDEX idx_status (status),
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Créer TABLE: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by BIGINT,
    changes JSON,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action),
    INDEX idx_performed_by (performed_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FIN DE LA MIGRATION 1
-- ============================================================================
