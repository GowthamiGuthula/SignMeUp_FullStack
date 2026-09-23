-- ============================================================
-- SignMeUp database initialization script (MySQL 8+)
-- Creates the schema matching the JPA entities in
-- java-spring-boot-back-end-app and seeds it with sample data.
--
-- Usage:
--   mysql -u root -p < database/init.sql
-- ============================================================

DROP DATABASE IF EXISTS signmeup;
CREATE DATABASE signmeup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE signmeup;

-- ------------------------------------------------------------
-- Schema
-- ------------------------------------------------------------

CREATE TABLE roles (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT uq_roles_name UNIQUE (name)
);

CREATE TABLE users (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(100) NOT NULL,
    email          VARCHAR(160) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    display_name   VARCHAR(100),
    created_at     DATETIME NOT NULL,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE events (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(120) NOT NULL,
    event_date         VARCHAR(20) NOT NULL,
    time_range         VARCHAR(60),
    location           VARCHAR(255),
    category           VARCHAR(20) CHECK (category IN ('WORKSHOP', 'SOCIAL', 'COMPETITION', 'MEETUP', 'OTHER')),
    total_slots        INT NOT NULL,
    description        TEXT,
    image_url          VARCHAR(500),
    visibility         VARCHAR(20) NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
    organizer_email    VARCHAR(160) NOT NULL,
    organizer_user_id  BIGINT,
    created_at         DATETIME NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_events_total_slots CHECK (total_slots >= 1)
);

CREATE TABLE event_invitations (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id    BIGINT NOT NULL,
    email       VARCHAR(160) NOT NULL,
    invited_at  DATETIME NOT NULL,
    CONSTRAINT uq_event_invitations_event_email UNIQUE (event_id, email),
    CONSTRAINT fk_event_invitations_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

CREATE INDEX idx_email ON event_invitations (email);

CREATE TABLE guest_access_tokens (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(160) NOT NULL,
    token         VARCHAR(36) NOT NULL,
    created_at    DATETIME NOT NULL,
    last_used_at  DATETIME,
    CONSTRAINT uq_guest_access_tokens_email UNIQUE (email),
    CONSTRAINT uq_guest_access_tokens_token UNIQUE (token)
);

CREATE TABLE rsvps (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id      BIGINT NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(160) NOT NULL,
    phone         VARCHAR(20),
    phone_digits  VARCHAR(10),
    status        VARCHAR(20) NOT NULL CHECK (status IN ('ATTENDING', 'MAYBE', 'NOT_ATTENDING')),
    user_id       BIGINT,
    created_at    DATETIME NOT NULL,
    CONSTRAINT uq_rsvps_event_email UNIQUE (event_id, email),
    CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE contact_messages (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(160) NOT NULL,
    message       TEXT NOT NULL,
    submitted_at  DATETIME NOT NULL,
    handled       BOOLEAN NOT NULL DEFAULT FALSE
);

-- ------------------------------------------------------------
-- Seed data
-- ------------------------------------------------------------

INSERT INTO roles (name) VALUES
    ('USER'),
    ('ORGANIZER'),
    ('ADMIN');

-- password_hash for all seed users is BCrypt("Password123!")
INSERT INTO users (username, email, password_hash, display_name, created_at) VALUES
    ('jsmith',     'jane.smith@example.com',    '$2a$10$IY2eT4zMSwFL0e/m8Y2NEOFn0e8jeKuKXMKd7YKwsFEUsrtFW5NY.', 'Jane Smith',     '2026-08-01 09:00:00'),
    ('mrodriguez', 'miguel.rodriguez@example.com', '$2a$10$IY2eT4zMSwFL0e/m8Y2NEOFn0e8jeKuKXMKd7YKwsFEUsrtFW5NY.', 'Miguel Rodriguez', '2026-08-02 10:15:00'),
    ('aparker',    'amy.parker@example.com',    '$2a$10$IY2eT4zMSwFL0e/m8Y2NEOFn0e8jeKuKXMKd7YKwsFEUsrtFW5NY.', 'Amy Parker',     '2026-08-03 11:30:00'),
    ('dkim',       'david.kim@example.com',     '$2a$10$IY2eT4zMSwFL0e/m8Y2NEOFn0e8jeKuKXMKd7YKwsFEUsrtFW5NY.', 'David Kim',      '2026-08-04 14:45:00'),
    ('lchen',      'lisa.chen@example.com',     '$2a$10$IY2eT4zMSwFL0e/m8Y2NEOFn0e8jeKuKXMKd7YKwsFEUsrtFW5NY.', 'Lisa Chen',      '2026-08-05 16:20:00');

INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 1), (1, 3),   -- Jane: USER, ADMIN
    (2, 1), (2, 2),   -- Miguel: USER, ORGANIZER
    (3, 1), (3, 2),   -- Amy: USER, ORGANIZER
    (4, 1),           -- David: USER
    (5, 1);           -- Lisa: USER

INSERT INTO events (name, event_date, time_range, location, category, total_slots, description, image_url, visibility, organizer_email, organizer_user_id, created_at) VALUES
    ('Spring Coding Bootcamp Kickoff', '2026-10-05', '9:00 AM - 12:00 PM', 'LaunchCode HQ, Room 201', 'WORKSHOP', 30,
     'Kickoff session for the new cohort covering tools setup and program expectations.',
     'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', 'PUBLIC',
     'jane.smith@example.com', 1, '2026-08-10 08:00:00'),
    ('Fall Hackathon', '2026-11-14', '10:00 AM - 6:00 PM', 'Downtown Innovation Center', 'COMPETITION', 50,
     'A one-day hackathon for teams to build a project from scratch and demo it to judges.',
     'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', 'PUBLIC',
     'miguel.rodriguez@example.com', 2, '2026-08-11 09:00:00'),
    ('Game Night Meetup', '2026-10-18', '6:00 PM - 9:00 PM', 'Community Center, Main Hall', 'SOCIAL', 20,
     'Casual board games and pizza to unwind and meet other students.',
     'https://images.unsplash.com/photo-1506954673998-b077f05b13c7?auto=format&fit=crop&w=1200&q=80', 'PUBLIC',
     'amy.parker@example.com', 3, '2026-08-12 12:00:00'),
    ('React Study Group', '2026-10-22', '5:30 PM - 7:30 PM', 'Online (Zoom)', 'MEETUP', 15,
     'Weekly study group working through React hooks and component patterns.',
     'https://images.unsplash.com/photo-1758270705290-62b6294dd044?auto=format&fit=crop&w=1200&q=80', 'PUBLIC',
     'david.kim@example.com', 4, '2026-08-13 13:00:00'),
    ('Alumni Networking Mixer', '2026-11-02', '7:00 PM - 9:00 PM', 'The Grand Loft', 'SOCIAL', 40,
     'Invite-only mixer for program alumni to reconnect and network with employer partners.',
     'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80', 'PRIVATE',
     'lisa.chen@example.com', 5, '2026-08-14 15:00:00'),
    ('Career Fair Prep Workshop', '2026-10-29', '1:00 PM - 3:00 PM', 'LaunchCode HQ, Room 105', 'WORKSHOP', 25,
     'Resume reviews and mock interviews ahead of the fall career fair.',
     'https://images.unsplash.com/photo-1698047681432-006d2449c631?auto=format&fit=crop&w=1200&q=80', 'PUBLIC',
     'jane.smith@example.com', 1, '2026-08-15 10:00:00');

INSERT INTO event_invitations (event_id, email, invited_at) VALUES
    (5, 'miguel.rodriguez@example.com', '2026-08-16 09:00:00'),
    (5, 'amy.parker@example.com',       '2026-08-16 09:00:00'),
    (5, 'guest.alum@example.com',       '2026-08-16 09:05:00');

INSERT INTO guest_access_tokens (email, token, created_at, last_used_at) VALUES
    ('guest.alum@example.com', 'b1a7c8e2-4f3d-4a11-9c2e-7d5f6a1b2c3d', '2026-08-16 09:10:00', NULL),
    ('nora.guest@example.com', 'e4f1d2a3-8b9c-4d5e-af10-2c3b4a5d6e7f', '2026-08-17 11:00:00', '2026-08-18 08:30:00');

INSERT INTO rsvps (event_id, first_name, last_name, email, phone, phone_digits, status, user_id, created_at) VALUES
    (1, 'Jane',   'Smith',    'jane.smith@example.com',    '314-555-0101', '3145550101', 'ATTENDING', 1, '2026-08-20 09:00:00'),
    (1, 'David',  'Kim',      'david.kim@example.com',     '314-555-0104', '3145550104', 'ATTENDING', 4, '2026-08-20 10:00:00'),
    (1, 'Priya',  'Nair',     'priya.nair@example.com',    '314-555-0201', '3145550201', 'MAYBE',     NULL, '2026-08-20 11:00:00'),
    (2, 'Miguel', 'Rodriguez','miguel.rodriguez@example.com', '314-555-0102', '3145550102', 'ATTENDING', 2, '2026-08-21 09:00:00'),
    (2, 'Lisa',   'Chen',     'lisa.chen@example.com',     '314-555-0105', '3145550105', 'ATTENDING', 5, '2026-08-21 09:30:00'),
    (2, 'Tom',    'Baker',    'tom.baker@example.com',     '314-555-0202', '3145550202', 'NOT_ATTENDING', NULL, '2026-08-21 10:00:00'),
    (3, 'Amy',    'Parker',   'amy.parker@example.com',    '314-555-0103', '3145550103', 'ATTENDING', 3, '2026-08-22 09:00:00'),
    (3, 'Sam',    'Ortiz',    'sam.ortiz@example.com',     '314-555-0203', '3145550203', 'MAYBE',     NULL, '2026-08-22 09:45:00'),
    (4, 'David',  'Kim',      'david.kim@example.com',     '314-555-0104', '3145550104', 'ATTENDING', 4, '2026-08-23 09:00:00'),
    (5, 'Miguel', 'Rodriguez','miguel.rodriguez@example.com', '314-555-0102', '3145550102', 'ATTENDING', 2, '2026-08-24 09:00:00'),
    (5, 'Nora',   'Guest',    'nora.guest@example.com',    '314-555-0204', '3145550204', 'ATTENDING', NULL, '2026-08-24 09:15:00'),
    (6, 'Jane',   'Smith',    'jane.smith@example.com',    '314-555-0101', '3145550101', 'ATTENDING', 1, '2026-08-25 09:00:00');

INSERT INTO contact_messages (name, email, message, submitted_at, handled) VALUES
    ('Priya Nair', 'priya.nair@example.com', 'Is the Spring Coding Bootcamp Kickoff open to beginners with no prior experience?', '2026-08-26 10:00:00', FALSE),
    ('Tom Baker',  'tom.baker@example.com',  'Can I get a refund on my hackathon registration since I can no longer attend?', '2026-08-27 14:30:00', TRUE),
    ('Sam Ortiz',  'sam.ortiz@example.com',  'Would love to see more virtual meetup options in the future.', '2026-08-28 16:00:00', FALSE);
