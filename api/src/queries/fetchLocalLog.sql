SELECT * FROM local_log
WHERE ($3::TEXT IS NULL OR namespace = $3)
AND (
    $4::TEXT IS NULL 
    OR event ILIKE '%' || $4 || '%' 
    OR name ILIKE '%' || $4 || '%'
)
ORDER BY timestamp DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;
