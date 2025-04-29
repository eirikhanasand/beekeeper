SELECT * FROM global_log
WHERE (
    $3::TEXT IS NULL 
    OR event ILIKE '%' || $3 || '%' 
    OR name ILIKE '%' || $3 || '%'
)
ORDER BY timestamp DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;
