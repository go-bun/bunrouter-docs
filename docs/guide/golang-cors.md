---
title: 'Golang CORS: Cross-Origin Resource Sharing [guide for 2022]'
---

<CoverImage title="Go CORS: Cross-Origin Resource Sharing" />

The following CORS middleware should handle most use cases:

```go
type CORSHandler struct {
	Next http.Handler
}

func (h CORSHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	origin := req.Header.Get("Origin")
	if origin == "" {
		h.Next.ServeHTTP(w, req)
		return
	}

	header := w.Header()
	header.Set("Access-Control-Allow-Origin", origin)
	header.Set("Access-Control-Allow-Credentials", "true")

	if req.Method == http.MethodOptions {
		header.Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD")
		header.Set("Access-Control-Allow-Headers", "authorization,content-type,content-length")
		header.Set("Access-Control-Max-Age", "86400")
		return
	}

	h.Next.ServeHTTP(w, req)
}

router := bunrouter.New()

handler := http.Handler(router)
handler = CORSHandler{Next: handler}
```

Alternatively, you can use [cors](https://github.com/rs/cors) module:

```go
import "github.com/rs/cors"

router := bunrouter.New()

handler := http.Handler(router)
handler = cors.Default().Handler(handler)
```

See [example](https://github.com/uptrace/bunrouter/tree/master/example/cors) for details.
