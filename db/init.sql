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
    PRIMARY KEY (context, name)
);

-- Namespace notes
CREATE TABLE IF NOT EXISTS namespace_notes (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    namespace TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    author TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pods
CREATE TABLE IF NOT EXISTS pods (
    name TEXT NOT NULL,
    ready TEXT NOT NULL,
    status TEXT NOT NULL,
    restarts TEXT NOT NULL,
    age TEXT NOT NULL,
    context TEXT NOT NULL,
    namespace TEXT NOT NULL,
    PRIMARY KEY (context, namespace, name)
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
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
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
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Namespace domains
CREATE TABLE IF NOT EXISTS namespace_domains (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    context TEXT NOT NULL,
    namespace TEXT NOT NULL,
    UNIQUE (context, namespace, url)
);

-- Namespace incidents
CREATE TABLE IF NOT EXISTS namespace_incidents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    context TEXT NOT NULL, 
    namespace TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Namespace ingress
CREATE TABLE IF NOT EXISTS namespace_ingress (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    namespace TEXT NOT NULL,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    hosts TEXT NOT NULL,
    address TEXT NOT NULL,
    ports TEXT NOT NULL,
    age TEXT NOT NULL,
    UNIQUE (context, namespace, name)
);

-- Namespace ingress events
CREATE TABLE IF NOT EXISTS namespace_ingress_events (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL,
    namespace TEXT NOT NULL,
    name TEXT NOT NULL,
    events TEXT NOT NULL
);
