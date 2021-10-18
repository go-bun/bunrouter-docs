# Serving static files

## File server

You can use [http.FileServer](https://pkg.go.dev/net/http#FileServer) with BunRouter's concise API
with the help of
[bunrouter.HTTPHandler](https://pkg.go.dev/github.com/uptrace/bunrouter#HTTPHandler) converter, for
[example](https://github.com/uptrace/bunrouter/tree/master/example/file-server):

```go
//go:embed files
var filesFS embed.FS

func main() {
	fileServer := http.FileServer(http.FS(filesFS))

	router := bunrouter.New(
		bunrouter.WithMiddleware(reqlog.NewMiddleware(
			reqlog.FromEnv("BUNDEBUG"),
		)),
	)

	router.GET("/", indexHandler)
	router.GET("/files/*path", bunrouter.HTTPHandler(fileServer))
}
```

## fs.Sub

If you want to serve files without a folder name, use [fs.Sub](https://pkg.go.dev/io/fs#Sub):

```go
//go:embed files
var filesFS embed.FS

func main() {
    // Retrieve files subtree.
	filesFS, err := fs.Sub(filesFS, "files")
	if err != nil {
		panic(err)
	}

	fileServer := http.FileServer(http.FS(filesFS))

	router := bunrouter.New(
		bunrouter.WithMiddleware(reqlog.NewMiddleware(
			reqlog.FromEnv("BUNDEBUG"),
		)),
	)

	router.GET("/", indexHandler)
	router.GET("/*path", bunrouter.HTTPHandler(fileServer))
}
```

## http.StripPrefix

If you want to serve files under a different prefix, use
[http.StripPrefix](https://pkg.go.dev/net/http#StripPrefix). In the following example we change
`/files` prefix to `/static/files` prefix:

```go
//go:embed files
var filesFS embed.FS

func main() {
	filesFS, err := fs.Sub(filesFS, "files")
	if err != nil {
		panic(err)
	}

	fileServer := http.FileServer(http.FS(filesFS))
	fileServer = http.StripPrefix("/static/files", fileServer)

	router := bunrouter.New(
		bunrouter.WithMiddleware(reqlog.NewMiddleware(
			reqlog.FromEnv("BUNDEBUG"),
		)),
	)

	router.GET("/", indexHandler)
	router.GET("/static/files/*path", bunrouter.HTTPHandler(fileServer))
}
```
