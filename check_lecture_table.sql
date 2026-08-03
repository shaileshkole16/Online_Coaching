-- Check if lecture table exists and create it if not
USE OnlineCoachingInstitute;

-- Check if lecture table exists
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_schema = 'OnlineCoachingInstitute' 
AND table_name = 'lecture';

-- If the above returns 0, run the following to create the table:
CREATE TABLE IF NOT EXISTS lecture (
    lecture_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    lecture_order INT,
    upload_date DATE,
    course_id INT,
    UNIQUE KEY unique_title_course (title, course_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Verify the table structure
DESCRIBE lecture;
