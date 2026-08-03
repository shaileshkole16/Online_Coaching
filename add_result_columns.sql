-- Add assignment_marks and quiz_score columns to result table
USE OnlineCoachingInstitute;

ALTER TABLE result ADD COLUMN assignment_marks INT AFTER total_marks;
ALTER TABLE result ADD COLUMN quiz_score INT AFTER assignment_marks;

-- Verify the changes
DESCRIBE result;
