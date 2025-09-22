WITH fast_count AS (
    SELECT cnt::BIGINT AS count
    FROM local_log_namespace_context_counts
    WHERE ($1 IS NULL OR namespace = $1)
      AND ($3 IS NULL OR context ILIKE '%' || $3 || '%')
),
full_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM local_log
    WHERE ($1 IS NULL OR namespace = $1)
      AND ($3 IS NULL OR context ILIKE '%' || $3 || '%')
      AND ($2 IS NULL OR event ILIKE '%' || $2 || '%' OR name ILIKE '%' || $2 || '%')
)
SELECT 
    CASE 
        WHEN $2 IS NULL
            THEN (SELECT count FROM fast_count)
        ELSE (SELECT count FROM full_count)
    END AS count;
