CREATE TABLE IF NOT EXISTS lecture_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    lecture_id BIGINT NOT NULL,
    watched BOOLEAN DEFAULT FALSE,
    watch_percentage INT DEFAULT 0,
    last_watched DATETIME,
    completed_at DATETIME,
    UNIQUE KEY unique_student_lecture (student_id, lecture_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id) ON DELETE CASCADE
);