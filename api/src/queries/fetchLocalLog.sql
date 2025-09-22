SELECT * FROM local_log
WHERE (namespace = $3::TEXT)
  AND context = $5::TEXT
  AND (
      $4::TEXT IS NULL 
      OR event ILIKE '%' || $4::TEXT || '%' 
  )
ORDER BY timestamp DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;
