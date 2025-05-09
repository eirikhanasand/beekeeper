SELECT COUNT(*) 
FROM local_log
WHERE ($1::TEXT IS NULL OR namespace = $1)
AND (
    $2::TEXT IS NULL 
    OR event ILIKE '%' || $2 || '%' 
    OR name ILIKE '%' || $2 || '%'
);
