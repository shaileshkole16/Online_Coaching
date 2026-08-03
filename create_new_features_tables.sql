-- ========================================
-- ONLINE COACHING SYSTEM - NEW FEATURES DATABASE TABLES
-- ========================================

USE OnlineCoachingInstitute;

-- ========================================
-- ATTENDANCE MODULE
-- ========================================

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED') DEFAULT 'PRESENT',
    check_in_time TIME,
    check_out_time TIME,
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES user(user_id),
    UNIQUE KEY unique_attendance (student_id, course_id, attendance_date),
    INDEX idx_student_course (student_id, course_id),
    INDEX idx_date (attendance_date)
);

-- ========================================
-- CERTIFICATE MODULE
-- ========================================

CREATE TABLE certificate (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status ENUM('ACTIVE', 'REVOKED', 'EXPIRED') DEFAULT 'ACTIVE',
    grade VARCHAR(10),
    percentage DECIMAL(5, 2),
    certificate_url VARCHAR(500),
    verification_code VARCHAR(100) UNIQUE,
    issued_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (issued_by) REFERENCES user(user_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_verification (verification_code)
);

-- ========================================
-- STUDENT PROGRESS MODULE
-- ========================================

CREATE TABLE student_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    lecture_id BIGINT,
    completion_percentage DECIMAL(5, 2) DEFAULT 0,
    last_watched_lecture_id BIGINT,
    last_watched_timestamp TIMESTAMP,
    total_time_spent INT DEFAULT 0, -- in minutes
    completed_lectures TEXT, -- JSON array of lecture IDs
    bookmarked_lectures TEXT, -- JSON array of lecture IDs
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id) ON DELETE SET NULL,
    UNIQUE KEY unique_progress (student_id, course_id),
    INDEX idx_student_course (student_id, course_id)
);

-- ========================================
-- LIVE CLASSES MODULE
-- ========================================

CREATE TABLE live_class (
    live_class_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_link VARCHAR(500),
    meeting_id VARCHAR(255),
    meeting_password VARCHAR(100),
    scheduled_date DATETIME NOT NULL,
    duration INT, -- in minutes
    status ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    recording_url VARCHAR(500),
    max_participants INT,
    thumbnail_url VARCHAR(500),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user(user_id),
    INDEX idx_course (course_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status)
);

CREATE TABLE live_class_participant (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    live_class_id INT NOT NULL,
    student_id INT NOT NULL,
    join_time TIMESTAMP NULL,
    leave_time TIMESTAMP NULL,
    duration_attended INT DEFAULT 0, -- in minutes
    status ENUM('JOINED', 'LEFT', 'MISSED') DEFAULT 'MISSED',
    FOREIGN KEY (live_class_id) REFERENCES live_class(live_class_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (live_class_id, student_id),
    INDEX idx_student (student_id)
);

-- ========================================
-- ANNOUNCEMENTS MODULE
-- ========================================

CREATE TABLE announcement (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    teacher_id INT,
    admin_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type ENUM('GENERAL', 'IMPORTANT', 'URGENT', 'ASSIGNMENT', 'EXAM') DEFAULT 'GENERAL',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    attachment_url VARCHAR(500),
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'PUBLISHED',
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL,
    INDEX idx_course (course_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_publish_date (publish_date),
    INDEX idx_status (status)
);

CREATE TABLE announcement_read (
    read_id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_id INT NOT NULL,
    student_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcement(announcement_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_read (announcement_id, student_id),
    INDEX idx_student (student_id)
);

-- ========================================
-- DISCUSSION FORUM MODULE
-- ========================================

CREATE TABLE discussion_forum (
    forum_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT,
    teacher_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT,
    status ENUM('OPEN', 'CLOSED', 'ARCHIVED') DEFAULT 'OPEN',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_answered BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    INDEX idx_course (course_id),
    INDEX idx_student (student_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE discussion_reply (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    student_id INT,
    teacher_id INT,
    content TEXT NOT NULL,
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    parent_reply_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES discussion_forum(forum_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    FOREIGN KEY (parent_reply_id) REFERENCES discussion_reply(reply_id) ON DELETE SET NULL,
    INDEX idx_forum (forum_id),
    INDEX idx_student (student_id)
);

-- ========================================
-- WISHLIST MODULE
-- ========================================

CREATE TABLE wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (student_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id)
);

-- ========================================
-- CATEGORIES MODULE
-- ========================================

CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    parent_category_id INT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES category(category_id) ON DELETE SET NULL,
    INDEX idx_parent (parent_category_id),
    INDEX idx_status (status)
);

CREATE TABLE course_category (
    course_category_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_category (course_id, category_id),
    INDEX idx_course (course_id),
    INDEX idx_category (category_id)
);

-- ========================================
-- CALENDAR MODULE
-- ========================================

CREATE TABLE calendar_event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_type ENUM('ASSIGNMENT', 'QUIZ', 'LECTURE', 'LIVE_CLASS', 'EXAM', 'MEETING', 'OTHER') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
    location VARCHAR(255),
    course_id INT,
    assignment_id INT,
    quiz_id INT,
    live_class_id INT,
    is_all_day BOOLEAN DEFAULT FALSE,
    reminder_minutes INT DEFAULT 15,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE SET NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id) ON DELETE SET NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id) ON DELETE SET NULL,
    FOREIGN KEY (live_class_id) REFERENCES live_class(live_class_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_start_datetime (start_datetime),
    INDEX idx_event_type (event_type),
    INDEX idx_status (status)
);

-- ========================================
-- AUDIT LOGS MODULE
-- ========================================

CREATE TABLE audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- COURSE APPROVAL MODULE
-- ========================================

CREATE TABLE course_approval (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    submitted_by INT NOT NULL,
    reviewed_by INT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED') DEFAULT 'PENDING',
    review_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES user(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES user(user_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_submitted_by (submitted_by)
);

-- ========================================
-- SYSTEM SETTINGS MODULE
-- ========================================

CREATE TABLE system_setting (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('STRING', 'INTEGER', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    category VARCHAR(100),
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES user(user_id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_key (setting_key)
);

-- ========================================
-- BACKUP MODULE
-- ========================================

CREATE TABLE system_backup (
    backup_id INT AUTO_INCREMENT PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_type ENUM('FULL', 'INCREMENTAL', 'DATABASE', 'FILES') DEFAULT 'FULL',
    file_path VARCHAR(500),
    file_size BIGINT,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED') DEFAULT 'IN_PROGRESS',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL,
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
);

-- ========================================
-- NOTIFICATION PREFERENCES MODULE
-- ========================================

CREATE TABLE notification_preference (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('EMAIL', 'PUSH', 'SMS', 'IN_APP') NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_preference (user_id, notification_type, category),
    INDEX idx_user (user_id)
);

-- ========================================
-- PAYMENT HISTORY & INVOICE MODULE
-- ========================================

CREATE TABLE invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    status ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'SENT',
    subtotal DECIMAL(10, 2),
    tax DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    total DECIMAL(10, 2),
    notes TEXT,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment (payment_id),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_status (status)
);

-- ========================================
-- COURSE REVIEWS & RATINGS ENHANCEMENT
-- ========================================

ALTER TABLE course_rating ADD COLUMN review_title VARCHAR(255);
ALTER TABLE course_rating ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE course_rating ADD COLUMN helpful_count INT DEFAULT 0;
ALTER TABLE course_rating ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE course_rating_helpful (
    helpful_id INT AUTO_INCREMENT PRIMARY KEY,
    course_rating_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_rating_id) REFERENCES course_rating(course_rating_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_helpful (course_rating_id, student_id),
    INDEX idx_rating (course_rating_id),
    INDEX idx_student (student_id)
);

-- ========================================
-- SETUP COMPLETE
-- ========================================
