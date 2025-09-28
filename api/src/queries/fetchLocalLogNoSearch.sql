SELECT * FROM local_log
WHERE namespace = $3::TEXT
  AND context = $4::TEXT
ORDER BY timestamp DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;
