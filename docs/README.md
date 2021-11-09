---
home: true
title: Fast and flexible HTTP router for Go

actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
  - text: Introduction
    link: /guide/
    type: secondary

features:
  - title: Flexible routing
    details: Routing rules are compatible with httprouter and have proper matching priority.
  - title: Performant matching
    details:
      BunRouter is very fast and does zero allocations when matching routes or retrieving
      parameters.
  - title: Compatible API
    details: Out-of-the box works with standard http.HandlerFunc and httprouter-like handlers.
  - title: Middlewares
    details:
      Extract common operations from your handlers into reusable wrapper functions (middlewares).
  - title: Error handling
    details: Just return errors from route handlers and handle all of them from a single middleware.
  - title: Auto-correction
    details: Bunrouter redirects users to the right route in case of extra/missing/double slashes.
---

<CodeGroup>
  <CodeGroupItem title="bunrouter">

```go
router := bunrouter.New(
	bunrouter.WithMiddleware(reqlog.NewMiddleware()),
)

router.WithGroup("/api", func(g *bunrouter.Group) {
	g.GET("/users/:id", debugHandler)
	g.GET("/users/current", debugHandler)
	g.GET("/users/*path", debugHandler)
})

func debugHandler(w http.ResponseWriter, req bunrouter.Request) error {
	// use req.Request to get *http.Request

	return bunrouter.JSON(w, bunrouter.H{
		"route":  req.Route(),
		"params": req.Params().Map(),
	})
}
```

  </CodeGroupItem>

  <CodeGroupItem title="http.HandlerFunc">

```go
router := bunrouter.New(
	bunrouter.WithMiddleware(reqlog.NewMiddleware()),
).Compat()

router.WithGroup("/api", func(g *bunrouter.CompatGroup) {
	g.GET("/users/:id", debugHandler)
	g.GET("/users/current", debugHandler)
	g.GET("/users/*path", debugHandler)
})

func debugHandler(w http.ResponseWriter, req *http.Request) {
	params := bunrouter.ParamsFromContext(req.Context())

	_ = bunrouter.JSON(w, bunrouter.H{
		"route":  params.Route(),
		"params": params.Map(),
	})
}
```

  </CodeGroupItem>

  <CodeGroupItem title="httprouter.Handle">

```go
router := bunrouter.New(
	bunrouter.WithMiddleware(reqlog.NewMiddleware()),
).Verbose()

router.WithGroup("/api", func(g *bunrouter.VerboseGroup) {
	g.GET("/users/:id", debugHandler)
	g.GET("/users/current", debugHandler)
	g.GET("/users/*path", debugHandler)
})

func debugHandler(w http.ResponseWriter, req *http.Request, params bunrouter.Params) {
	_ = bunrouter.JSON(w, bunrouter.H{
		"route":  params.Route(),
		"params": params.Map(),
	})
}
```

  </CodeGroupItem>
</CodeGroup>

<!-- prettier-ignore-start -->
::: details Benchmark results
```
BenchmarkGin_Param               	16019718	        74.16 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param        	12560001	        95.04 ns/op	      32 B/op	       1 allocs/op
BenchmarkBunrouter_Param         	50015306	        23.81 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Param5              	 8997234	       131.5 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param5       	 4809441	       261.3 ns/op	     160 B/op	       1 allocs/op
BenchmarkBunrouter_Param5        	10789635	       114.0 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Param20             	 3953041	       302.4 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param20      	 1661373	       743.3 ns/op	     640 B/op	       1 allocs/op
BenchmarkBunrouter_Param20       	 2462354	       482.8 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParamWrite          	 9258986	       128.0 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParamWrite   	 9908178	       123.0 ns/op	      32 B/op	       1 allocs/op
BenchmarkBunrouter_ParamWrite    	15511226	        70.62 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubStatic        	12781513	        94.17 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubStatic 	30077443	        37.36 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_GithubStatic  	37160334	        32.41 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubParam         	 6971791	       169.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubParam  	 5464755	       217.4 ns/op	      96 B/op	       1 allocs/op
BenchmarkBunrouter_GithubParam   	12047902	       101.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubAll           	   32758	     37382 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubAll    	   27324	     43932 ns/op	   13792 B/op	     167 allocs/op
BenchmarkBunrouter_GithubAll     	   57910	     20914 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusStatic         	17788194	        69.13 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusStatic  	60191341	        19.84 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_GPlusStatic   	87114368	        14.06 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusParam          	10075399	       119.5 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusParam   	 8272046	       149.2 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_GPlusParam    	37359979	        32.43 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlus2Params        	 7375279	       162.9 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlus2Params 	 6538942	       186.7 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_GPlus2Params  	19681939	        61.51 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusAll            	  647716	      1752 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusAll     	  590356	      2085 ns/op	     640 B/op	      11 allocs/op
BenchmarkBunrouter_GPlusAll      	 1685287	       712.8 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseStatic         	14566458	        76.58 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseStatic  	52994076	        21.02 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_ParseStatic   	50583933	        23.83 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseParam          	13443874	        90.66 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseParam   	 8825664	       135.6 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_ParseParam    	38058278	        31.33 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Parse2Params        	10179813	       118.1 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Parse2Params 	 7801735	       152.9 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_Parse2Params  	23704574	        50.78 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseAll            	  394884	      3073 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseAll     	  410238	      3011 ns/op	     640 B/op	      16 allocs/op
BenchmarkBunrouter_ParseAll      	  810908	      1487 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_StaticAll           	   50658	     23699 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_StaticAll    	  105313	     11518 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_StaticAll     	   99674	     12188 ns/op	       0 B/op	       0 allocs/op
```
:::
<!-- prettier-ignore-end -->
