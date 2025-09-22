WITH fast_count AS (
    SELECT cnt::BIGINT AS count
    FROM local_log_namespace_context_counts
    WHERE (namespace = $1::TEXT)
      AND (context = $3::TEXT)
),
full_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM local_log
    WHERE (namespace = $1::TEXT)
      AND (context = $3::TEXT)
      AND ($2::TEXT IS NULL OR event ILIKE '%' || $2::TEXT || '%' OR name ILIKE '%' || $2::TEXT || '%')
)
SELECT 
    CASE 
        WHEN $2::TEXT IS NULL
            THEN (SELECT count FROM fast_count)
        ELSE (SELECT count FROM full_count)
    END AS count;
