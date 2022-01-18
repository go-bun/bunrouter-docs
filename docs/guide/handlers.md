# Route handlers

Use structs to group handlers by functionality and to store global handler state:

```go
type UserHandler struct{
    db        *bun.DB
    rowLimit  int
    rateLimit int
}

func (h *UserHandler) Create(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) Update(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) Delete(w http.ResponseWriter, req bunrouter.Request) error {}

func (h *UserHandler) Show(w http.ResponseWriter, req bunrouter.Request) error {}
func (h *UserHandler) List(w http.ResponseWriter, req bunrouter.Request) error {}
```

Naturally, you can use BunRouter [groups](README.md#routing-groups) and
[middlewares](middlewares.md) with struct-based handlers:

```go
group.Use(authMiddleware).
	Use(readPermsMiddleware).
	WithGroup("/users", func(group *bunrouter.Group) {
		userHandler := &UserHandler{...}

		group.GET("", userHandler.List)
		group.GET("/:id", userHandler.Show)

		group = group.Use(writePermsMiddleware)

		group.POST("", userHandler.Create)
		group.PUT("/:id", userHandler.Update)
		group.DELETE("/:id", userHandler.Delete)
})
```
