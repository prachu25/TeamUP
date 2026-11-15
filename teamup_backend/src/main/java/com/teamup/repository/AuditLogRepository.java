package com.teamup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamup.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
