vcl 4.0;

backend default {
    .host = "127.0.0.1";
    .port = "3001";
}

sub vcl_recv {
    if (req.http.Cookie) {
        set req.http.X-Theme = regsub(req.http.Cookie, ".*theme=([^;]+);?.*", "\1");
        set req.http.X-Lang = regsub(req.http.Cookie, ".*lang=([^;]+);?.*", "\1");
    }

    return (hash);
}

sub vcl_hash {
    # Hashes the theme and language
    hash_data(req.http.X-Theme + req.http.X-Lang);
}

sub vcl_backend_response {
    set beresp.http.Cache-Control = "login-cache, max-age=60";
    set beresp.ttl = 1m;
    return (deliver);
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT:" + obj.hits;
    } else {
        set resp.http.X-Cache = "MISS";
    }

    return (deliver);
}
