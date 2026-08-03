-- Fix quiz questions column type to support larger JSON data
USE OnlineCoachingInstitute;

-- Change questions column from TINYTEXT to LONGTEXT to support larger JSON arrays
ALTER TABLE quiz MODIFY COLUMN questions LONGTEXT;

-- Verify the change
DESCRIBE quiz;
