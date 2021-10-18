# Handlers, Gzip, CORS

## Route handlers

Use structs to group handlers by functionality and to store global handler state:

```go
type UserHandler struct{
    db        *bun.DB
    rowLimit  int
    rateLimit int
}

func (h *UserHandler) Create(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) Update(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) Delete(w http.ResponseWriter, req bunrouter.Request) error {}

func (h *UserHandler) Show(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) List(w http.ResponseWriter, req bunrouter.Request) error {}
```

Naturally, you can use BunRouter [groups](README.md#routing-groups) and
[middlewares](middlewares.md) with struct-based handlers:

```go
group.NewGroup("/users",
    bunrouter.WithMiddleware(authMiddleware),
    bunrouter.WithMiddleware(readPermsMiddleware),
    bunrouter.WithGroup(func(group *bunrouter.Group) {
    userHandler := &UserHandler{...}

    group.GET("", userHandler.List)
    group.GET("/:id", userHandler.Show)

    group = group.WithMiddleware(writePermsMiddleware)

    group.POST("", userHandler.Create)
    group.PUT("/:id", userHandler.Update)
    group.DELETE("/:id", userHandler.Delete)
})
```

## Gzip compression

You can compress HTTP responses using
[gzhttp](https://github.com/klauspost/compress/tree/master/gzhttp) module:

```shell
go get github.com/klauspost/compress
```

All you need to do is to wrap BunRouter instance with gzhttp:

```go
import (
    "github.com/klauspost/compress/gzhttp"
)

router := bunrouter.New()

handler := http.Handler(router)
handler = gzhttp.GzipHandler(handler)

httpServer := &http.Server{
	Handler: handler,
}
```

## CORS requests

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
import "github.com/rs/cors""

router := bunrouter.New()

handler := http.Handler(router)
handler = cors.Default().Handler(handler)
```

## Panic recovering

<!-- prettier-ignore -->
::: warning
Panics are exceptional situations that can leave you app in a broken state. It may be better to let the app crash and restart it then to recover.
:::

You can recover from panics in HTTP handlers like this:

```go
type PanicHandler struct {
	Next http.Handler
}

func (h PanicHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	defer func() {
		if err := recover(); err != nil {
			buf := make([]byte, 10<<10)
			n := runtime.Stack(buf, true)
			fmt.Fprintf(os.Stderr, "panic: %v\n\n%s", err, buf[:n])

			// Uncomment to exit instead of recovering.
			// os.Exit(1)

			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
		}
	}()

	h.Next.ServeHTTP(w, req)
}

router := bunrouter.New()

handler := http.Handler(router)
handler = PanicHandler{Next: handler}

httpServer := &http.Server{
	Handler: handler,
}
```
