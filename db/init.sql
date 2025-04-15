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
    name TEXT PRIMARY KEY
);

-- Namespace
CREATE TABLE IF NOT EXISTS namespaces (
    name TEXT PRIMARY KEY,
    FOREIGN KEY (name) REFERENCES contexts(name)
);

-- Pods
CREATE TABLE IF NOT EXISTS pods (
    name TEXT PRIMARY KEY,
    FOREIGN KEY (name) REFERENCES namespaces(name)
);

-- Logs
CREATE TABLE IF NOT EXISTS logs (
    id TEXT NOT NUlL,
    event TEXT NOT NULL,
    type TEXT NOT NULL,
    app TEXT,
    pod TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (name) REFERENCES namespaces(name),
    PRIMARY KEY (name, id)
);
