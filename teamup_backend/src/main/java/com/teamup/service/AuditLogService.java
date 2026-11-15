package com.teamup.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.teamup.entity.AuditLog;
import com.teamup.repository.AuditLogRepository;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepo;

    public AuditLogService(AuditLogRepository auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    public void logActivity(Long teamId, Long userId, String action, String details) {

        AuditLog auditLog = new AuditLog();

        auditLog.setTeamId(teamId);
        auditLog.setUserId(userId);
        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLog.setCreatedAt(LocalDateTime.now());

        auditLogRepo.save(auditLog);
    }

}
