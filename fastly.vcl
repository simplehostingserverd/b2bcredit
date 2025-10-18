# Fastly VCL Configuration for B2B Credit API
# Upload via: fastly vcl custom create --name="main" --content=@fastly.vcl --version=latest

sub vcl_recv {
  #FASTLY recv

  # Set backend
  set req.backend = F_origin_0;

  # Normalize Accept-Encoding for better cache hit rates
  if (req.http.Accept-Encoding) {
    if (req.http.Accept-Encoding ~ "gzip") {
      set req.http.Accept-Encoding = "gzip";
    } elsif (req.http.Accept-Encoding ~ "deflate") {
      set req.http.Accept-Encoding = "deflate";
    } else {
      unset req.http.Accept-Encoding;
    }
  }

  # Remove tracking parameters for better cache hit rates
  if (req.url ~ "\?(utm_|fbclid|gclid)") {
    set req.url = regsub(req.url, "\?.*$", "");
  }

  # Don't cache authenticated requests (has session cookie)
  if (req.http.Cookie ~ "next-auth\.session-token") {
    return(pass);
  }

  # Only cache GET and HEAD requests
  if (req.request != "GET" && req.request != "HEAD") {
    return(pass);
  }

  # Cache API documentation (OpenAPI spec)
  if (req.url ~ "^/openapi\.json") {
    unset req.http.Cookie;
    return(lookup);
  }

  # Cache API docs page
  if (req.url ~ "^/api-docs") {
    unset req.http.Cookie;
    return(lookup);
  }

  # Cache blog content aggressively
  if (req.url ~ "^/api/blog") {
    unset req.http.Cookie;
    return(lookup);
  }

  # Cache blog categories
  if (req.url ~ "^/api/blog/categories") {
    unset req.http.Cookie;
    return(lookup);
  }

  # Cache health endpoint
  if (req.url ~ "^/api/health") {
    unset req.http.Cookie;
    return(lookup);
  }

  # Never cache admin endpoints
  if (req.url ~ "^/api/admin") {
    return(pass);
  }

  # Never cache auth endpoints
  if (req.url ~ "^/api/auth") {
    return(pass);
  }

  # Never cache newsletter subscribe/unsubscribe
  if (req.url ~ "^/api/newsletter/(subscribe|unsubscribe)") {
    return(pass);
  }

  # Never cache application endpoints
  if (req.url ~ "^/api/applications") {
    return(pass);
  }

  # Never cache document endpoints
  if (req.url ~ "^/api/documents") {
    return(pass);
  }

  # Never cache lead creation (POST)
  if (req.url ~ "^/api/leads") {
    return(pass);
  }

  # Default: pass through to origin
  return(pass);
}

sub vcl_fetch {
  #FASTLY fetch

  # Respect Surrogate-Control header from backend (Fastly-specific)
  if (beresp.http.Surrogate-Control) {
    # Extract max-age from Surrogate-Control
    if (beresp.http.Surrogate-Control ~ "max-age=(\d+)") {
      set beresp.ttl = std.atoi(re.group.1) s;
    }
    # Remove Surrogate-Control before delivering to client
    unset beresp.http.Surrogate-Control;
  }

  # Cache blog posts for 10 minutes with 1 hour grace
  if (req.url ~ "^/api/blog/[^/]+$" && beresp.status == 200) {
    set beresp.ttl = 600s;
    set beresp.grace = 3600s;
  }

  # Cache blog list for 5 minutes
  if (req.url ~ "^/api/blog(\?|$)" && beresp.status == 200) {
    set beresp.ttl = 300s;
    set beresp.grace = 1800s;
  }

  # Cache related posts for 10 minutes
  if (req.url ~ "^/api/blog/[^/]+/related" && beresp.status == 200) {
    set beresp.ttl = 600s;
    set beresp.grace = 3600s;
  }

  # Cache categories for 1 hour
  if (req.url ~ "^/api/blog/categories" && beresp.status == 200) {
    set beresp.ttl = 3600s;
    set beresp.grace = 7200s;
  }

  # Cache OpenAPI spec for 1 hour
  if (req.url ~ "^/openapi\.json" && beresp.status == 200) {
    set beresp.ttl = 3600s;
    set beresp.grace = 7200s;
  }

  # Cache API docs for 1 hour
  if (req.url ~ "^/api-docs" && beresp.status == 200) {
    set beresp.ttl = 3600s;
    set beresp.grace = 7200s;
  }

  # Cache health check for 1 minute
  if (req.url ~ "^/api/health" && beresp.status == 200) {
    set beresp.ttl = 60s;
    set beresp.grace = 300s;
  }

  # Never cache errors (5xx)
  if (beresp.status >= 500 && beresp.status < 600) {
    set beresp.ttl = 0s;
    set beresp.grace = 0s;
    return(deliver);
  }

  # Don't cache redirects
  if (beresp.status >= 300 && beresp.status < 400) {
    set beresp.ttl = 0s;
    return(deliver);
  }

  # Don't cache 4xx errors (except 404 for a short time)
  if (beresp.status >= 400 && beresp.status < 500) {
    if (beresp.status == 404) {
      set beresp.ttl = 60s; # Cache 404 for 1 minute
    } else {
      set beresp.ttl = 0s;
    }
  }

  return(deliver);
}

sub vcl_deliver {
  #FASTLY deliver

  # Add cache status headers for debugging
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
    set resp.http.X-Cache-Hits = obj.hits;
  } else {
    set resp.http.X-Cache = "MISS";
  }

  # Add cache age
  set resp.http.X-Cache-Age = obj.age;

  # Add served-by header (optional, useful for debugging)
  set resp.http.X-Served-By = server.identity;

  # Remove backend headers for security
  unset resp.http.X-Powered-By;
  unset resp.http.Server;
  unset resp.http.Via;

  # Remove internal headers
  unset resp.http.X-Request-ID;

  return(deliver);
}

sub vcl_error {
  #FASTLY error

  # Custom error responses
  if (obj.status == 503 && req.restarts < 1) {
    # Return JSON error for API endpoints
    if (req.url ~ "^/api/") {
      set obj.http.Content-Type = "application/json";
      synthetic {"{"error":"Service temporarily unavailable","code":"SERVICE_UNAVAILABLE","timestamp":""} now {""}"};
      return(deliver);
    }
  }

  # Rate limiting error (custom)
  if (obj.status == 429) {
    set obj.http.Content-Type = "application/json";
    synthetic {"{"error":"Rate limit exceeded. Please try again later.","code":"RATE_LIMIT_EXCEEDED","timestamp":""} now {""}"};
    return(deliver);
  }

  return(deliver);
}

sub vcl_hash {
  #FASTLY hash

  # Include URL in cache key
  set req.hash += req.url;

  # Include host in cache key
  set req.hash += req.http.host;

  # Include Accept header for content negotiation
  if (req.http.Accept) {
    set req.hash += req.http.Accept;
  }

  return(hash);
}
