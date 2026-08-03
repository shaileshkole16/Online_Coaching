-- Fix lecture table to support longer descriptions
USE OnlineCoachingInstitute;

-- Drop duplicate unique constraint
ALTER TABLE lecture DROP INDEX UKivamlbajre4d510qcbai23n1r;

-- Increase description column length to TEXT
ALTER TABLE lecture MODIFY COLUMN description TEXT;

-- Verify the changes
DESCRIBE lecture;
