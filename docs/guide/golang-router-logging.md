---
title: 'Golang Router: Logging and debugging'
---

<CoverImage title="Logging and debugging" />

For quick debugging, you can print processed requests to stdout. First, you need to install reqlog
package:

```shell
go get github.com/uptrace/bunrouter/extra/reqlog
```

Then install the provided middleware:

```go
import "github.com/uptrace/bunrouter/extra/reqlog"

router := bunrouter.New(
	bunrouter.Use(reqlog.NewMiddleware()),
)
```

By default, the middleware logs all processed requests, but you can configure it to log only failed
requests using `WithVerbose` option:

```go
reqlog.NewMiddleware(reqlog.WithVerbose(false))
```

You can also disable the middleware by default and use environment variables to enable it when
needed:

```go
reqlog.NewMiddleware(
    // disable the middleware
    reqlog.WithEnabled(false),

    // BUNDEBUG=1 logs failed requests
    // BUNDEBUG=2 logs all requests
    reqlog.FromEnv("BUNDEBUG"),
)
```

## See also

- [Golang HTTP Performance and Errors Monitoring](golang-http-performance.html)
