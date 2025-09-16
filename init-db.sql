-- PostgreSQL initialization script for Crit-Fumble development
-- This script runs when the database container first starts

-- Create the main database (already created by POSTGRES_DB env var)
-- Additional setup can be added here if needed

-- Create a test database for running tests
CREATE DATABASE crit_fumble_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE crit_fumble TO postgres;
GRANT ALL PRIVILEGES ON DATABASE crit_fumble_test TO postgres;

-- Log that initialization completed
SELECT 'Crit-Fumble PostgreSQL database initialized successfully!' as message;