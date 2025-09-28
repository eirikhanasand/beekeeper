WITH base_filtered AS (
    SELECT *
    FROM local_log
    WHERE namespace = $1::TEXT
      AND context = $3::TEXT
),
fast_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM base_filtered
),
full_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM base_filtered
    WHERE $2::TEXT IS NULL OR event ILIKE '%' || $2::TEXT || '%'
)
SELECT 
    CASE 
        WHEN $2::TEXT IS NULL
            THEN (SELECT count FROM fast_count)
        ELSE (SELECT count FROM full_count)
    END AS count;
