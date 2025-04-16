DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beekeeper') THEN
        CREATE DATABASE beekeeper;
    END IF;
END $$;

\c beekeeper

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

-- Contexts
CREATE TABLE IF NOT EXISTS contexts (
    name TEXT PRIMARY KEY,
    cluster TEXT NOT NULL,
    authinfo TEXT NOT NULL,
    namespace TEXT
);

-- Namespace
CREATE TABLE IF NOT EXISTS namespaces (
    context TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    -- operational / degraded / down (ok - green, warning - orange, alert - red) 
    service_status TEXT NOT NULL,
    AGE TEXT NOT NULL,
    FOREIGN KEY (context) REFERENCES contexts(name),
    PRIMARY KEY (context, name)
);

-- Namespace notes
CREATE TABLE IF NOT EXISTS namespace_notes (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (context, name) REFERENCES namespaces(context, name)
);

-- Pods
CREATE TABLE IF NOT EXISTS pods (
    name TEXT PRIMARY KEY,
    context TEXT NOT NULL,
    FOREIGN KEY (context, name) REFERENCES namespaces(context, name)
);

-- Global logs
CREATE TABLE IF NOT EXISTS global_log (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    event TEXT NOT NULL,
    status TEXT NOT NULL,
    command TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Local logs
CREATE TABLE IF NOT EXISTS local_log (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    name TEXT NOT NULL,
    namespace TEXT NOT NULL,
    event TEXT NOT NULL,
    command TEXT NOT NULL,
    app TEXT,
    pod TEXT,
    status TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (context, namespace) REFERENCES namespaces(context, name)
);

-- Global commands
CREATE TABLE IF NOT EXISTS global_commands (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    command TEXT NOT NULL,
    author TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Namespace specific commands
CREATE TABLE IF NOT EXISTS local_commands (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    name TEXT NOT NULL,
    namespace TEXT NOT NULL,
    command TEXT NOT NULL,
    author TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (context, namespace) REFERENCES namespaces(context, name)
);

-- User table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
