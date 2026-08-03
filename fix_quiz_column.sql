-- Fix quiz.questions column type to match Hibernate expectations
USE OnlineCoachingInstitute;

ALTER TABLE quiz MODIFY COLUMN questions LONGTEXT;
