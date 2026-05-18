package com.example.back.repository;

import com.example.back.entity.AuditLog;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
    List<AuditLog> findByPerformedBy(User user);
}
