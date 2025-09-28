SELECT COUNT(*)::BIGINT AS count
FROM local_log
WHERE (namespace || '|' || context || '|' || event) ILIKE '%' || $3::TEXT || '%'
  AND namespace = $1::TEXT
  AND context   = $2::TEXT;
