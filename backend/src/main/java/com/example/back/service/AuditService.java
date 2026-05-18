package com.example.back.service;

import com.example.back.entity.AuditLog;
import com.example.back.entity.AuditAction;
import com.example.back.entity.User;
import com.example.back.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // ✓ Enregistrer une action
    public void log(String entityType, Long entityId, AuditAction action,
                   User performedBy, String changes, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setChanges(changes);
        log.setIpAddress(ipAddress);
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    // ✓ Obtenir l'historique d'une entité
    public List<AuditLog> getHistory(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    // ✓ Obtenir l'historique d'un utilisateur
    public List<AuditLog> getUserHistory(User user) {
        return auditLogRepository.findByPerformedBy(user);
    }
}
