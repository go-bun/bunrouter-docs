---
title: Golang HTTP Panic Handling
---

<CoverImage title="Golang HTTP Panic Handling" />

<!-- prettier-ignore -->
::: warning
Panics are exceptional situations that can leave you app in a broken state. It may be better to let the app crash and restart it then to recover.
:::

You can recover from panics in HTTP handlers like this:

```go
type PanicHandler struct {
	Next http.Handler
}

func (h PanicHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	defer func() {
		if err := recover(); err != nil {
			buf := make([]byte, 10<<10)
			n := runtime.Stack(buf, false)
			fmt.Fprintf(os.Stderr, "panic: %v\n\n%s", err, buf[:n])

			// Uncomment to exit instead of recovering.
			// os.Exit(1)

			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
		}
	}()

	h.Next.ServeHTTP(w, req)
}

router := bunrouter.New()

handler := http.Handler(router)
handler = PanicHandler{Next: handler}

httpServer := &http.Server{
	Handler: handler,
}
```
