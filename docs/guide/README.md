# Introduction

BunRouter is an extremely fast HTTP router for Go with unique combination of features:

- [Middlewares](./middlewares.html) allow to extract common operations from HTTP handlers into
  reusable functions.
- [Error handling](./error-handling.html) allows to further reduce the size of HTTP handlers by
  handling errors in middlewares.
- [Routes priority](./getting-started.html#routes-priority) enables meaningful matching priority for
  routing rules: first static nodes, then named nodes, lastly wildcard nodes.
- net/http compatible API which means using minimal API without constructing huge wrappers that try
  to do everything: from serving static files to XML generation (for example, `gin.Context` or
  `echo.Context`).

| Router          | Middlewares        | Error handling     | Routes priority    | net/http API       |
| --------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| BunRouter       | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [httprouter][1] | :x:                | :x:                | :x:                | :heavy_check_mark: |
| [Chi][2]        | :heavy_check_mark: | :x:                | :heavy_check_mark: | :heavy_check_mark: |
| [Echo][3]       | :heavy_check_mark: | :heavy_check_mark: | :x:                | :x:                |
| [Gin](4)        | :heavy_check_mark: | :heavy_check_mark: | :x:                | :x:                |

[1]: https://github.com/julienschmidt/httprouter
[2]: https://github.com/go-chi/chi
[3]: https://github.com/labstack/echo
[4]: https://github.com/go-gin/gin
