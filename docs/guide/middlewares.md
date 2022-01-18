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
	bunrouter.Use(reqlog.NewMiddleware()),
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

Or you can write a fully functional CORS middleware:

```go
func corsMiddleware(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
		origin := req.Header.Get("Origin")
		if origin == "" {
			return next(w, req)
		}

		h := w.Header()

		h.Set("Access-Control-Allow-Origin", origin)
		h.Set("Access-Control-Allow-Credentials", "true")

		// CORS preflight.
		if req.Method == http.MethodOptions {
			h.Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD")
			h.Set("Access-Control-Allow-Headers", "authorization,content-type")
			h.Set("Access-Control-Max-Age", "86400")
			return nil
		}

		return next(w, req)
	}
}

router := bunrouter.New(
	bunrouter.Use(corsMiddleware),
)
```

## Installing middlewares

You can install a middleware for all route handlers (including `NotFoundHandler` and
`MethodNotAllowedHandler`) when creating a router:

```go
router := bunrouter.New(
    bunrouter.Use(middleware1),
    bunrouter.Use(middleware2),
)
```

Or for a single group that will inherit router middlewares:

```go
router.Use(middleware1).
    Use(middleware2).
    WithGroup("/users/:user_id", func(group *bunrouter.Group) {})
```

The same using different API:

```go
router.WithGroup("/users/:user_id", func(group *bunrouter.Group) {
    group = group.Use(middleware1).
        .Use(middleware2)
})
```

You can nest groups inside each other and nested groups will inherit parent middlewares. But be
cautious when creating deeply nested groups, because it can be hard to follow such code.

```go
router := bunrouter.New(
    bunrouter.Use(reqlog.NewMiddleware()),
)

group := router.NewGroup("/api")
group.GET("/users/login", loginHandler)

group = group.Use(authMiddleware)
group.GET("/users/current", currentUserHandler)

group.NewGroup("/users",
    bunrouter.Use(middleware1),
    bunrouter.WithGroup(func(group *bunrouter.Group) {
        group.GET("/users/:id", showUserHandler)

        group = group.Use(middleware2)

        group.POST("/users", createUserHandler)
    }),
)
```

## Passing data

You can use `WithContext` to pass data to the next handler:

```go
type userCtxKey struct{}

func authMiddleware(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
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

func debugMiddleware(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
        err := next(w, req)
        return &ErrorPayload{error: err, data: nil}
    }
}
```

## Error handling

See [Error handling](error-handling.md).
