package com.teamup.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "idempotency_keys", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "idempotency_key" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IdempotencyKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "response_data", columnDefinition = "json")
    private String responseData;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        expiresAt = createdAt.plusDays(20);
    }
}