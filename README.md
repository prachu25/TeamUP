
# 🚀 TeamUP – Hackathon Collaboration Platform

## 🎯 Problem Statement

Hackathon participants often struggle to find teammates, organize teams, and manage team membership. Without a centralized system, team formation can become difficult, especially when multiple participants try to join teams with limited seats.

**TeamUP addresses this by providing a centralized backend system for hackathon discovery, participation, team creation, and membership management while maintaining data consistency and access control.**

## ✨ Key Features & Implementation

- 🏆 **Hackathon Discovery & Participation:** APIs to retrieve, search, register for, and cancel participation in hackathons.

- 👥 **Team Creation & Management:** Create hackathon-specific teams with configurable minimum and maximum member limits.

- 📩 **Join Request Workflow:** Participants can request to join teams, while team leaders can approve or reject requests.

- ⚡ **Concurrent Membership Management:** Handles simultaneous membership operations while enforcing team capacity and membership constraints.

- 🔄 **Idempotency:** Uses database-backed idempotency keys to prevent duplicate operations during request retries.

- 🔐 **Authentication & Authorization:** Uses Spring Security to protect backend endpoints and control access to restricted operations.

- 📋 **Audit Logging:** Records important team activities, including the action performed and its associated user.

## 💻 Backend Implementation

- **Layered Architecture:** Separate Controller, Service, Repository, DTO, and Entity layers.
- **Spring Data JPA & Hibernate:** Manage database entities and relationships.
- **Transaction Management:** Maintain consistency during team membership operations.
- **MySQL:** Persist users, hackathons, teams, memberships, and activity records.
- **Global Exception Handling:** Handle application errors through a centralized exception handler.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Language | Java |
| Backend Framework | Spring Boot |
| Security | Spring Security |
| ORM | Spring Data JPA, Hibernate |
| Database | MySQL |
| API Architecture | RESTful APIs |
| Build Tool | Maven |
| API Testing | Postman |
| Version Control | Git, GitHub |

## 🗄️ Database Design

**Database:** MySQL 

### Database Tables

| Table Name | Description |
|---|---|
| `users` | Stores user details and profile information |
| `hackathons` | Stores hackathon information |
| `teams` | Stores team details and team leader information |
| `team_members` | Manages team membership |
| `hackathon_participants` | Tracks users registered for hackathons |
| `join_requests` | Manages requests to join teams |
| `idempotency_keys` | Prevents duplicate operations |
| `audit_logs` | Records user activities and system actions |



## 📂 Complete Backend Folder Structure

```text
teamup_backend/
│
├── src/
│   ├── main/
│   │   │
│   │   ├── java/com/teamup/
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── HackathonController.java
│   │   │   │   ├── HackathonParticipantController.java
│   │   │   │   ├── JoinRequestController.java
│   │   │   │   ├── TeamController.java
│   │   │   │   └── UserController.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── CreateTeamRequest.java
│   │   │   │   ├── CreateTeamResponse.java
│   │   │   │   ├── LoginRequestDTO.java
│   │   │   │   ├── LoginResponseDTO.java
│   │   │   │   ├── RegisterRequestDTO.java
│   │   │   │   └── TeamResponseDTO.java
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── AuditLog.java
│   │   │   │   ├── Hackathon.java
│   │   │   │   ├── HackathonParticipant.java
│   │   │   │   ├── IdempotencyKey.java
│   │   │   │   ├── JoinRequest.java
│   │   │   │   ├── Team.java
│   │   │   │   ├── TeamMember.java
│   │   │   │   └── User.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── AlreadyParticipatingException.java
│   │   │   │   ├── DuplicateEmailException.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── HackathonNotFoundException.java
│   │   │   │   ├── InvalidCredentialsException.java
│   │   │   │   └── UserNotFoundException.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── AuditLogRepository.java
│   │   │   │   ├── HackathonParticipantRepository.java
│   │   │   │   ├── HackathonRepository.java
│   │   │   │   ├── IdempotencyKeyRepository.java
│   │   │   │   ├── JoinRequestRepository.java
│   │   │   │   ├── TeamMemberRepository.java
│   │   │   │   ├── TeamRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuditLogService.java
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── HackathonParticipantService.java
│   │   │   │   ├── HackathonService.java
│   │   │   │   ├── JoinRequestService.java
│   │   │   │   ├── TeamService.java
│   │   │   │   └── UserService.java
│   │   │   │
│   │   │   └── TeamupApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       ├── templates/
│   │       └── application.properties
│   │
│   └── test/
│
├── .gitignore
├── HELP.md
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## 🔗 REST API Documentation

**Base URL:** `http://localhost:8080`

### 🔐 1. Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | User login |
| PUT | `/api/user/logout` | User logout |

**Register Request**
```json
{
  "name": "Prachi",
  "email": "prachi@example.com",
  "password": "password",
  "timezone": "Asia/Kolkata"
}
```

**Login Request**
```json
{
  "email": "prachi@example.com",
  "password": "password"
}
```

### 🏆 2. Hackathon APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/hackathons` | Get all hackathons |
| GET | `/api/hackathons/search?name=AI` | Search hackathons |
| POST | `/api/hackathons/{hackathonId}/participate?userId=9` | Participate |
| DELETE | `/api/participants/cancle?userId=9&hackathonId=7773` | Cancel participation |

### 👥 3. Team APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/teams` | Get teams |
| POST | `/api/teams/create?userId=9` | Create team |

**Create Team Request**
```json
{
  "hackathonId": 775,
  "teamName": "TeamUP Developers",
  "minMembers": 2,
  "maxMembers": 5
}
```

### 📩 4. Join Request APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/join-requests/send?teamId=775&userId=10` | Send request |
| PUT | `/api/join-requests/accept/{requestId}?leaderId=9` | Accept request |
| PUT | `/api/join-requests/reject/{teamId}?leaderId=9` | Reject requests |

### 👤 5. User APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | Get all users |
| PUT | `/api/users/{user_id}` | Update user |

## ⚙️ Getting Started

### Prerequisites
- Java 21
- Maven
- MySQL

### 1. Clone Repository
```bash
git clone https://github.com/prachu25/TeamUP.git
cd teamup_backend
```

### 2. Configure Database

Update `application.properties`:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
```

### 3. Run Backend
```bash
mvn spring-boot:run
```

Server starts at:

`http://localhost:8080`

### 👩‍💻 Author

**Prachi Gorde**

B.E. Electronics & Telecommunication Engineering

---

⭐ **TeamUP – Building reliable hackathon teams through robust backend engineering.**

