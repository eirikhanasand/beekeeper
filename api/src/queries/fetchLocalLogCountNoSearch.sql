SELECT COUNT(*)::BIGINT AS count
FROM local_log
WHERE namespace = $1::TEXT
  AND context = $2::TEXT;
