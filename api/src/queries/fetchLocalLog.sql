SELECT * FROM local_log ORDER BY timestamp DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;