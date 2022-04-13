---
title: HTTP Error handling
---

<CoverImage title="HTTP error handling" />

With BunRouter, you can and should use middlewares to handle all errors from a single place.
BunRouter does not provide a built-in error handler, but you can easily create your own.

For example, let's create an error handler for a JSON API that generates responses like this
whenever there is an error:

```json
{
  "code": "login_required",
  "message": "You must log in before continuing"
}
```

Let's start by defining a struct that will carry some information about an error:

```go
type HTTPError struct {
	statusCode int

	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e HTTPError) Error() string {
	return e.Message
}
```

Next, we need some logic to convert an `error` into a `HTTPError`:

```go
func NewHTTPError(err error) HTTPError {
	switch err {
	case io.EOF:
		return HTTPError{
			statusCode: http.StatusBadRequest,

			Code:    "eof",
			Message: "EOF reading HTTP request body",
		}
	case sql.ErrNoRows:
		return HTTPError{
			statusCode: http.StatusNotFound,

			Code:    "not_found",
			Message: "Page Not Found",
		}
	}

	return HTTPError{
		statusCode: http.StatusInternalServerError,

		Code:    "internal",
		Message: "Internal server error",
	}
}
```

Lastly, we need a middleware that pulls everything together:

```go
func errorHandler(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
		// Call the next handler on the chain to get the error.
		err := next(w, req)

		switch err := err.(type) {
		case nil:
			// no error
		case HTTPError: // already a HTTPError
			w.WriteHeader(err.statusCode)
			_ = bunrouter.JSON(w, err)
		default:
			httpErr := NewHTTPError(err)
			w.WriteHeader(httpErr.statusCode)
			_ = bunrouter.JSON(w, httpErr)
		}

		return err // return the err in case there other middlewares
	}
}
```

It is a good idea to isolate the API by creating a separate routing group and installing error
handler only for that group:

```go
api := router.NewGroup("/api", bunrouter.Use(errorHandler))
api.GET("/", indexHandler)
```

You can find the source code on
[GitHub](https://github.com/uptrace/bunrouter/tree/master/example/error-handling).
