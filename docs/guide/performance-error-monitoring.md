# Performance and errors monitoring

You can monitor HTTP performance and errors using
[distributed tracing](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html). Tracing
allows you to see how a request progresses through different services and systems, timings of every
operation, any logs and errors as they occur.

BunRouter supports tracing using OpenTelemetry API. OpenTelemetry is a vendor-neutral API for
distributed traces and metrics. It specifies how to collect and send telemetry data to backend
platforms. It means that you can instrument your application once and then add or change vendors
(backends) as required.

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
	bunrouter.WithMiddleware(bunrouterotel.NewMiddleware(
		bunrouterotel.WithClientIP(),
	)),
)
handler := otelhttp.NewHandler(router, "")

httpServer := &http.Server{
	Handler: handler,
}
```

As expected, BunRouter creates
[spans](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html#spans) for processed
requests and records any errors as they occur. Here is how the collected information is displayed at
[Uptrace](https://uptrace.dev/explore/1/groups/?system=db%3Apostgresql&utm_source=bun&utm_campaign=bun-tracing):

![Bunrouter trace](/img/bunrouter-trace.png)

You can find a runnable example on
[GitHub](https://github.com/uptrace/bunrouter/tree/master/example/opentelemetry).
