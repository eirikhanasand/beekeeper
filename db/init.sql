DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beekeeper') THEN
        CREATE DATABASE beekeeper;
    END IF;
END $$;

\c osvdb

DO $$
DECLARE
    user_password text;
BEGIN
    user_password := current_setting('db_password', true);

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'beekeeper') THEN
        EXECUTE format('CREATE USER beekeeper WITH ENCRYPTED PASSWORD %L', user_password);
        EXECUTE 'GRANT ALL PRIVILEGES ON DATABASE beekeeper TO beekeeper';
    END IF;
END $$;

-- Logs
CREATE TABLE IF NOT EXISTS logs (
    name TEXT PRIMARY KEY,
    event TEXT NOT NULL
)
