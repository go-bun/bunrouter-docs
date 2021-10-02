# Error handling

You can and should use middlewares to handle errors. BunRouter does not provide an error handler,
but you can easily create your own.

For example, let's create an error handler for JSON API. It should generate a response like this
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
		err := next(w, req)

		switch err := err.(type) {
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

You can find the source code on
[GitHub](https://github.com/uptrace/bunrouter/tree/master/example/error-handling).
