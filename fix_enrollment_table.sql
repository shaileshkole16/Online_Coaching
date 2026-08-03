-- Fix enrollment table to match entity fields
USE OnlineCoachingInstitute;

-- Add missing columns to enrollment table
ALTER TABLE enrollment 
ADD COLUMN enroll_date DATE,
ADD COLUMN status VARCHAR(50) DEFAULT 'active',
ADD COLUMN plan_type VARCHAR(50),
ADD COLUMN amount_paid DECIMAL(10, 2);

-- Remove the old progress column if it exists (not in entity)
ALTER TABLE enrollment DROP COLUMN IF EXISTS progress;
