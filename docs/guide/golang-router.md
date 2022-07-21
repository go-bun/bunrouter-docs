---
title: Golang HTTP router [fastest in 2022]
---

# Golang HTTP router

[[toc]]

## Introduction

BunRouter is an extremely fast HTTP router for Go with unique combination of features:

- [Middlewares](golang-http-middlewares.html) allow to extract common operations from HTTP handlers
  into reusable functions.
- [Error handling](golang-http-error-handling.html) allows to further reduce the size of HTTP
  handlers by handling errors in middlewares.
- [Routes priority](#routes-priority) enables meaningful matching priority for routing rules: first
  static nodes, then named nodes, lastly wildcard nodes.
- net/http compatible API which means using minimal API without constructing huge wrappers that try
  to do everything: from serving static files to XML generation (for example, `gin.Context` or
  `echo.Context`).

## Installation

To install Golang HTTP router:

```go
go get github.com/uptrace/bunrouter
```

## Creating a Go router

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
- `Use(middleware bunrouter.MiddlewareFunc)` adds the middleware to the router's stack of
  middlewares. Router will apply the middleware to all route handlers including `NotFoundHandler`
  and `MethodNotAllowedHandler`.

For example, to log requests, you can install `reqlog` middleware:

```go
import (
    "github.com/uptrace/bunrouter"
    "github.com/uptrace/bunrouter/extra/reqlog"
)

router := bunrouter.New(
	bunrouter.Use(reqlog.NewMiddleware()),
)
```

You define routes by specifying a HTTP method and a [routing rule](#routing-rules), for
[example](https://github.com/uptrace/bunrouter/tree/master/example/basic):

```go
router.POST("/users", createUserHandler)
router.GET("/users/:id", showUserHandler)
router.PUT("/users/:id", updateUserHandler)
router.DELETE("/users/:id", deleteUserHandler)
```

### Handlers

`bunrouter.HandlerFunc` is a slightly enhanced version of `http.HandlerFunc` that accepts a
`bunrouter.Request` and returns errors that you can handle with
[middlewares](golang-http-middlewares.html):

```go
func handler(w http.ResponseWriter, req bunrouter.Request) error {
    return nil
}
```

`bunrouter.Request` is a thin wrapper over `*http.Request` with route name and params:

```go
type Request struct {
	*http.Request
	params Params
}
```

`bunrouter.HandlerFunc` implements `http.Handler` interface and can be used with standard HTTP
middlewares. BunRouter also provides the following helpers to work with `bunrouter.HandlerFunc`:

- [bunrouter.HTTPHandler](https://pkg.go.dev/github.com/uptrace/bunrouter#HTTPHandler) converts
  `http.Handler` to `bunrouter.HandlerFunc`.
- [bunrouter.HTTPHandlerFunc](https://pkg.go.dev/github.com/uptrace/bunrouter#HTTPHandlerFunc)
  converts `http.HandlerFunc` to `bunrouter.HandlerFunc`.

For example, to use a classical HTTP handler with BunRouter:

```go
router.GET("/", bunrouter.HTTPHandlerFunc(func(w http.ResponseWriter, req *http.Request) {
    // ...
}))
```

### Compat handlers

Using compatibility API, you can directly work with `http.HandlerFunc` handlers, for
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

```
Route: /static

  /static          match
  /static/         redirect to /static

Route: /static/

  /static          redirect to /static/
  /static/         match

Route: /users/:id

  /users           no match
  /users/          no match
  /users/123       match
  /users/foo       match
  /users/foo-bar   match
  /users/foo/bar   no match

Route: /static/*path

  /static          redirect to /static/
  /static/         match
  /static/foo      match
  /static/foo-bar  match
  /static/foo/bar  match
```

You can retrieve the matched route params using
[Params](https://pkg.go.dev/github.com/uptrace/bunrouter#Params) method:

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

## Routes priority

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

Groups can even have their own [middlewares](golang-http-middlewares.html#installing-middlewares) to
further customize request processing.

## Not found handler

To customize not found handler:

```go
router := bunrouter.New(
	bunrouter.WithNotFoundHandler(notFoundHandler),
)

func notFoundHandler(w http.ResponseWriter, req bunrouter.Request) error {
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(
		w,
		"<html>BunRouter can't find a route that matches <strong>%s</strong></html>",
		req.URL.Path,
	)
	return nil
}
```

## Method not allowed handler

To customize method not found handler:

```go
router := bunrouter.New(
	bunrouter.WithMethodNotAllowedHandler(methodNotAllowedHandler),
)

func methodNotAllowedHandler(w http.ResponseWriter, req bunrouter.Request) error {
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(
		w,
		"<html>BunRouter does have a route that matches <strong>%s</strong>, "+
			"but it does not handle method <strong>%s</strong></html>",
		req.URL.Path, req.Method,
	)
	return nil
}
```

## Testing routes

BunRouter exposes `ServeHTTPError` method that serves the request returning the error from the
matched route handler:

```go
router := bunrouter.New()
router.GET("/user/:param", func(w http.ResponseWriter, req bunrouter.Request) error {
	require.Equal(t, "hello", req.Param("param"))
	return nil
})

w := httptest.NewRecorder()
req, _ := http.NewRequest(http.MethodGet, "/user/hello", nil)
err := router.ServeHTTPError(w, req)
require.NoError(t, err)
```
