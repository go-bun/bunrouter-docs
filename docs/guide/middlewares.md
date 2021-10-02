# Middlewares

## Introduction

Middlewares allow you to extract common functionality into a reusable function, for example, you
should already be familiar with `reqlog` middleware that logs processed requests:

```go
import (
    "github.com/uptrace/bunrouter"
    "github.com/uptrace/bunrouter/extra/reqlog"
)

router := bunrouter.New(
	bunrouter.WithMiddleware(reqlog.NewMiddleware()),
)
```

You can implement a similar middleware like this:

```go
func middleware(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
    // you can initialize the middleware here

    // Return the middleware handler.
    return func(w http.ResponseWriter, req bunrouter.Request) error {
        rec := httptest.NewRecorder()

        // Pass the recorder instead of http.ResponseWriter.
        if err := next(rec, req); err != nil {
            fmt.Printf("%s %s failed: %s\n", req.Method, req.Route(), err)
            // Swallow the error.
            return nil
        }

        fmt.Printf("%s %s returned %d\n", req.Method, req.Route(), rec.Code)
    }
}
```

Or you can write a middleware that handles CORS requests:

```go
func corsMiddleware(next treemux.HandlerFunc) treemux.HandlerFunc {
	return func(w http.ResponseWriter, req treemux.Request) error {
		if origin := req.Header.Get("Origin"); origin != "" {
			h := w.Header()
			h.Set("Access-Control-Allow-Origin", origin)
			h.Set("Access-Control-Allow-Credentials", "true")
		}
		return next(w, req)
	}
}

router := bunrouter.New(
	bunrouter.WithMiddleware(corsMiddleware),
)
```

## Installing middlewares

You can install a middleware for all route handlers (including `NotFoundHandler` and
`MethodNotAllowedHandler`) when creating a router:

```go
router := bunrouter.New(
    bunrouter.WithMiddleware(middleware1),
    bunrouter.WithMiddleware(middleware2),
)
```

Or for a single group that will inherit router middlewares:

```go
router.NewGroup("/users/:user_id",
    bunrouter.WithMiddleware(middleware1),
    bunrouter.WithMiddleware(middleware2),
    bunrouter.WithGroup(func(g *bunrouter.Group) {}),
)
```

You can nest groups inside each other and nested groups will inherit all parent middlewares:

```go
router := bunrouter.New(
    bunrouter.WithMiddleware(reqlog.NewMiddleware()),
)

group := router.NewGroup("/api")
group.GET("/users/login", loginHandler)

group = group.WithMiddleware(authMiddleware)
group.GET("/users/current", currentUserHandler)

group.NewGroup("/users",
    bunrouter.WithMiddleware(middleware1),
    bunrouter.WithGroup(func(group *bunrouter.Group) {
        group.GET("/users/:id", showUserHandler)

        group = group.WithMiddleware(middleware2)

        group.POST("/users", createUserHandler)
    }),
)
```

But it is best to avoid creating too many groups or too many nesting levels.

## Passing data

You can use `WithContext` to pass data to the next handler:

```go
type userCtxKey struct{}

func authMiddleware(next treemux.HandlerFunc) treemux.HandlerFunc {
	return func(w http.ResponseWriter, req treemux.Request) error {
        ctx := req.Context()
		ctx = context.WithValue(ctx, userCtxKey{}, user)
        return next(w, req.WithContext(ctx))
    }
}
```

You can also return data to the previous handler with an error, but the previous handler should know
how to handle it:

```go
type ErrorPayload struct {
    error
    data map[string]interface{}
}

func debugMiddleware(next treemux.HandlerFunc) treemux.HandlerFunc {
	return func(w http.ResponseWriter, req treemux.Request) error {
        err := next(w, req)
        return &ErrorPayload{error: err, data: nil}
    }
}
```

## Error handling

See [Error handling](error-handling.md).
