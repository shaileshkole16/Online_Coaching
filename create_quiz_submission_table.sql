-- Create quiz_submission table if it doesn't exist
USE OnlineCoachingInstitute;

CREATE TABLE IF NOT EXISTS quiz_submission (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    score INT NOT NULL,
    submitted_date DATE NOT NULL,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_quiz_student (quiz_id, student_id)
);

-- Verify table creation
SELECT 'quiz_submission table created successfully!' as status;
DESCRIBE quiz_submission;
