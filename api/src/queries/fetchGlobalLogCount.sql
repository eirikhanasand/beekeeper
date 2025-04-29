SELECT COUNT(*) 
FROM global_log
WHERE (
    $1::TEXT IS NULL 
    OR event ILIKE '%' || $1 || '%' 
    OR name ILIKE '%' || $1 || '%'
);
