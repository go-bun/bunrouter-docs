---
title: Golang HTTP gzip compression
---

<CoverImage title="Golang HTTP gzip compression" />

You can compress HTTP responses using
[gzhttp](https://github.com/klauspost/compress/tree/master/gzhttp) module:

```shell
go get github.com/klauspost/compress
```

All you need to do is to wrap BunRouter instance with gzhttp:

```go
import (
    "github.com/klauspost/compress/gzhttp"
)

router := bunrouter.New()

handler := http.Handler(router)
handler = gzhttp.GzipHandler(handler)

httpServer := &http.Server{
	Handler: handler,
}
```
