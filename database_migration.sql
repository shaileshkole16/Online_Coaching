-- Database Migration Script to Fix Data Redundancy
-- This script normalizes the database by centralizing user data in the User table

USE OnlineCoachingInstitute;

-- Step 1: Add password column to User table
ALTER TABLE user ADD COLUMN password VARCHAR(255) AFTER email;

-- Step 2: Add user_id foreign key columns to role-specific tables
ALTER TABLE admin ADD COLUMN user_id INT AFTER admin_id;
ALTER TABLE student ADD COLUMN user_id INT AFTER student_id;
ALTER TABLE teacher ADD COLUMN user_id INT AFTER teacher_id;

-- Step 3: Create User records for existing Admin, Student, Teacher records
-- and link them via user_id

-- For Admin
INSERT INTO user (name, email, password, role)
SELECT name, email, password, 'admin' FROM admin
WHERE NOT EXISTS (SELECT 1 FROM user WHERE user.email = admin.email);

UPDATE admin a
SET a.user_id = (SELECT user_id FROM user WHERE user.email = a.email)
WHERE a.user_id IS NULL;

-- For Student
INSERT INTO user (name, email, password, role)
SELECT name, email, password, 'student' FROM student
WHERE NOT EXISTS (SELECT 1 FROM user WHERE user.email = student.email);

UPDATE student s
SET s.user_id = (SELECT user_id FROM user WHERE user.email = s.email)
WHERE s.user_id IS NULL;

-- For Teacher
INSERT INTO user (name, email, password, role)
SELECT name, email, password, 'teacher' FROM teacher
WHERE NOT EXISTS (SELECT 1 FROM user WHERE user.email = teacher.email);

UPDATE teacher t
SET t.user_id = (SELECT user_id FROM user WHERE user.email = t.email)
WHERE t.user_id IS NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE admin 
ADD CONSTRAINT fk_admin_user 
FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE;

ALTER TABLE student 
ADD CONSTRAINT fk_student_user 
FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE;

ALTER TABLE teacher 
ADD CONSTRAINT fk_teacher_user 
FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE;

-- Step 5: Add unique constraint on user_id in role tables
ALTER TABLE admin ADD UNIQUE INDEX unique_admin_user (user_id);
ALTER TABLE student ADD UNIQUE INDEX unique_student_user (user_id);
ALTER TABLE teacher ADD UNIQUE INDEX unique_teacher_user (user_id);

-- Step 6: Remove redundant columns from role tables
ALTER TABLE admin DROP COLUMN name;
ALTER TABLE admin DROP COLUMN email;
ALTER TABLE admin DROP COLUMN password;

ALTER TABLE student DROP COLUMN name;
ALTER TABLE student DROP COLUMN email;
ALTER TABLE student DROP COLUMN password;

ALTER TABLE teacher DROP COLUMN name;
ALTER TABLE teacher DROP COLUMN email;
ALTER TABLE teacher DROP COLUMN password;

-- Step 7: Update Message table foreign key if needed
-- (Message table already references user_id, so no change needed)

-- Step 8: Add missing columns to quiz table
ALTER TABLE quiz ADD COLUMN duration INT AFTER quiz_date;
ALTER TABLE quiz ADD COLUMN passing_score INT AFTER duration;
ALTER TABLE quiz ADD COLUMN questions LONGTEXT AFTER passing_score;

-- Fix questions column type to match Hibernate expectations
ALTER TABLE quiz MODIFY COLUMN questions TINYTEXT;

-- Verification queries
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as admin_count FROM admin;
SELECT COUNT(*) as student_count FROM student;
SELECT COUNT(*) as teacher_count FROM teacher;
SELECT COUNT(*) as user_count FROM user;
