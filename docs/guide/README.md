# Getting started

## Installation

```go
go get github.com/uptrace/bunrouter
```

## Creating a router

Usually, you create a single router:

```go
import "github.com/uptrace/bunrouter"

router := bunrouter.New()
```

And use it to add routes:

```go
router.GET("/", func(w http.ResponseWriter, req bunrouter.Request) error {
    // req embeds *http.Request and has all the same fields and methods
    fmt.Println(req.Method, req.Route(), req.Params().Map())
    return nil
})
```

`bunrouter.New` accepts a couple of options to customize the router:

- `WithNotFoundHandler(handler bunrouter.HandlerFunc)` overrides the handler that is called when
  there are no matching routes.
- `WithMethodNotAllowedHandler(handler bunrouter.HandlerFunc)` overrides the handler that is called
  when a route matches, but the route does not have a handler for the requested method.
- `WithMiddleware(middleware bunrouter.MiddlewareFunc)` adds the middleware to the router's stack of
  middlewares. Router will apply the middleware to all route handlers including `NotFoundHandler`
  and `MethodNotAllowedHandler`.

For example, to log requests, you can install `reqlog` middleware:

```go
import (
    "github.com/uptrace/bunrouter"
    "github.com/uptrace/bunrouter/extra/reqlog"
)

router := bunrouter.New(
	bunrouter.WithMiddleware(reqlog.NewMiddleware()),
)
```

You define routes by specifying a request method and a [routing rule](#routing-rules), for
[example](https://github.com/uptrace/bunrouter/tree/master/example/basic):

```go
router.POST("/users", createUserHandler)
router.GET("/users/:id", showUserHandler)
router.PUT("/users/:id", updateUserHandler)
router.DELETE("/users/:id", deleteUserHandler)
```

### Compat handlers

You can also use `http.HandlerFunc` handlers in compatibility mode, for
[example](https://github.com/uptrace/bunrouter/tree/master/example/basic-compat):

```go
router := bunrouter.New().Compat()

router.GET("/", func(w http.ResponseWriter, req *http.Request) {
    params := bunrouter.ParamsFromContext(req.Context())
    fmt.Println(params.Route(), params.Map())
})
```

### Verbose handlers

BunRouter also supports httprouter-like handlers, for
[example](https://github.com/uptrace/bunrouter/tree/master/example/basic-verbose):

```go
router := bunrouter.New().Verbose()

router.GET("/", func(w http.ResponseWriter, req *http.Request, ps bunrouter.Params) {
    fmt.Println(params.Route(), params.Map(), params.ByName("param"))
})
```

## Routing rules

Routing rule is a path that contains zero or more routing params, for example, `/users/:id` or
`/image/*path`.

BunRouter supports the following param types:

- `:param` is a named parameter that matches a single path segment (text between slashes).
- `*param` is a wildcard parameter that matches everything and must always be at the end of the
  route.

You can retrieve the matched route params using `Params` method:

```go
func handler(w http.ResponseWriter, req bunrouter.Request) error {
    params := req.Params()
    path := params.ByName("path")
    id, err := params.Int64("id")
}
```

Or using compatibility API:

```go
func handler(w http.ResponseWriter, req *http.Request) {
    params := bunrouter.ParamsFromContext(req.Context())
    path := params.ByName("path")
    id, err := params.Int64("id")
}
```

## Routing priority

Routing rules have matching priority that is based on node types and does not depend on routes
definition order:

1. Static nodes, for example, `/users/`
2. Named nodes, for example, `:id`.
3. Wildcard nodes, for example, `*path`.

The following routes are sorted by their matching priority from the highest to the lowest:

- `/users/list`.
- `/users/:id`.
- `/users/*path`.

## Routing groups

You can add routes using the `router`:

```go
router.GET("/api/users/:id", handler)
router.POST("/api/users", handler)
router.PUT("/api/users/:id", handler)
router.DELETE("/api/users/:id", handler)
```

But it is better to group routes by functionality under some prefix:

```go
group := router.NewGroup("/api/users")

group.GET("/:id", handler)
group.POST("", handler)
group.PUT("/:id", handler)
group.DELETE("/:id", handler)
```

Or even better:

```go
router.WithGroup("/api/users", func(group *bunrouter.Group) {
    group.GET("/:id", handler)
    group.POST("", handler)
    group.PUT("/:id", handler)
    group.DELETE("/:id", handler)
})
```

You can also nest groups to build complex APIs:

```go
router.WithGroup("/api/categories", func(group *bunrouter.Group) {
    // /api/categories/:category/items
    group.WithGroup("/:category/items", func(group *bunrouter.Group) {})

    // /api/categories/archive
    group.WithGroup("/archive", func(group *bunrouter.Group) {})
})
```

Groups can even have their own [middlewares](middlewares.md#installing-middlewares) to further
customize request processing.
