---
title: Golang HTTP Performance and Errors Monitoring
---

<CoverImage title="Golang HTTP Performance and Errors Monitoring" />

You can monitor HTTP performance and errors using
[distributed tracing](https://uptrace.dev/opentelemetry/distributed-tracing.html) and
[metrics](https://uptrace.dev/opentelemetry/metrics.html) by OpenTelemetry.

[OpenTelemetry](https://uptrace.dev/opentelemetry/) is a vendor-neutral API for distributed traces
and metrics. It specifies how to collect and send telemetry data to backend platforms. It means that
you can instrument your application once and then add or change vendors (backends) as required.

BunRouter comes with an OpenTelemetry instrumentation called
[bunrouterotel](https://github.com/uptrace/bunrouter/tree/master/extra/bunrouterotel) that is
distributed as a separate module:

```shell
go get github.com/uptrace/bunrouter/extra/bunrouterotel
```

To instrument BunRouter, you need to add the middleware provided by bunrouterotel:

```go
import (
	"github.com/uptrace/bunrouter/extra/bunrouterotel"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

router := bunrouter.New(
	bunrouter.Use(bunrouterotel.NewMiddleware(
		bunrouterotel.WithClientIP(),
	)),
)
handler := otelhttp.NewHandler(router, "")

httpServer := &http.Server{
	Handler: handler,
}
```

You can then retrieve the active
[span context](https://uptrace.dev/opentelemetry/go-tracing.html#context) and pass it to other
functions:

```go
ctx := req.Context()
op1(ctx)
op2(ctx)
```

## Uptrace

Uptrace is an OpenTelemetry
[distributed tracing tool](https://uptrace.dev/get/compare/distributed-tracing-tools.html) that
monitors performance and helps finding performance bottlenecks.

As expected, BunRouter instrumentation creates
[spans](https://uptrace.dev/opentelemetry/distributed-tracing.html#spans) for processed requests and
records any errors as they occur. Here is how the collected information is displayed at
[Uptrace](https://uptrace.dev/explore/1/groups/?system=db%3Apostgresql&utm_source=bun&utm_campaign=bun-tracing):

![Bunrouter trace](/img/bunrouter-trace.png)

You can find a runnable example on
[GitHub](https://github.com/uptrace/bunrouter/tree/master/example/opentelemetry).

## See also

- [BunRouter: logging and debugging](golang-router-logging.html)
- [Open Source distributed tracing tools](https://uptrace.dev/get/compare/distributed-tracing-tools.html)
- [OpenTelemetry guide for Gin, GORM, and Zap](https://uptrace.dev/get/opentelemetry-gin-gorm.html)
