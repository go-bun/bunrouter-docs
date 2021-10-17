# Introduction

BunRouter is an extremely fast HTTP router for Go with unique combination of features:

- [Middlewares](./middlewares.md) allow to extract common operations from HTTP handlers into
  reusable functions.
- [Error handling](./error-handling.md) allows to further reduce HTTP handlers size by moving error
  handling to middlewares.
- [Routes priority](./getting-started.md#routes-priority) enables meaningful routing rules matching
  priority: first static nodes, then named nodes, lastly wildcard nodes.
- net/http compatible API means using minimal API without constructing huge wrappers that try to do
  everything: from serving static files to XML generation (for example, `gin.Context` or
  `echo.Context`).

## Why Not ...?

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

## Benchmark

```
BenchmarkChi_Param               	 1430458	       821.3 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_Param              	17184052	        69.23 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Param               	16393251	        76.34 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param        	12598274	        95.07 ns/op	      32 B/op	       1 allocs/op
BenchmarkBunrouter_Param         	51672237	        23.51 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_Param5              	 1000000	      1092 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_Param5             	 7157612	       173.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Param5              	 8747310	       134.8 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param5       	 4431727	       276.7 ns/op	     160 B/op	       1 allocs/op
BenchmarkBunrouter_Param5        	10738804	       115.1 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_Param20             	  710602	      1914 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_Param20            	 2463632	       501.1 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Param20             	 3971754	       302.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Param20      	 1485345	       898.2 ns/op	     640 B/op	       1 allocs/op
BenchmarkBunrouter_Param20       	 2489767	       490.5 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_ParamWrite          	 1312530	       889.9 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_ParamWrite         	 7818566	       168.0 ns/op	       8 B/op	       1 allocs/op
BenchmarkGin_ParamWrite          	 9052273	       125.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParamWrite   	 9648472	       126.4 ns/op	      32 B/op	       1 allocs/op
BenchmarkBunrouter_ParamWrite    	17280351	        70.58 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GithubStatic        	 1486658	       792.3 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_GithubStatic       	14440353	        84.92 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubStatic        	12936698	        94.27 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubStatic 	31951411	        37.16 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_GithubStatic  	37493840	        32.58 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GithubParam         	 1000000	      1097 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_GithubParam        	 6250062	       192.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubParam         	 6965524	       171.8 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubParam  	 5276935	       228.3 ns/op	      96 B/op	       1 allocs/op
BenchmarkBunrouter_GithubParam   	11867866	       102.0 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GithubAll           	    5326	    221631 ns/op	   90948 B/op	     609 allocs/op
BenchmarkEcho_GithubAll          	   30484	     38739 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GithubAll           	   31837	     37504 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GithubAll    	   25502	     46424 ns/op	   13792 B/op	     167 allocs/op
BenchmarkBunrouter_GithubAll     	   57127	     21424 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GPlusStatic         	 1596351	       750.9 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_GPlusStatic        	21408877	        52.82 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusStatic         	18093962	        63.57 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusStatic  	61104475	        19.84 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_GPlusStatic   	76150867	        14.34 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GPlusParam          	 1354800	       860.0 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_GPlusParam         	12307836	        97.64 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusParam          	10570398	       115.3 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusParam   	 6843795	       169.6 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_GPlusParam    	31069144	        33.65 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GPlus2Params        	 1264284	       952.5 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_GPlus2Params       	 7224451	       168.3 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlus2Params        	 7768512	       150.6 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlus2Params 	 6300344	       191.4 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_GPlus2Params  	19280515	        63.94 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_GPlusAll            	   99026	     12357 ns/op	    5824 B/op	      39 allocs/op
BenchmarkEcho_GPlusAll           	  664268	      1817 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_GPlusAll            	  670758	      1800 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_GPlusAll     	  556306	      2186 ns/op	     640 B/op	      11 allocs/op
BenchmarkBunrouter_GPlusAll      	 1556529	       771.2 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_ParseStatic         	 1540129	       755.6 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_ParseStatic        	19150242	        62.06 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseStatic         	16911868	        71.65 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseStatic  	56730783	        21.35 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_ParseStatic   	45109171	        23.51 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_ParseParam          	 1363994	       834.5 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_ParseParam         	14117473	        86.29 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseParam          	13310698	        89.46 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseParam   	 8404693	       140.6 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_ParseParam    	34156603	        32.62 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_Parse2Params        	 1341004	       889.0 ns/op	     448 B/op	       3 allocs/op
BenchmarkEcho_Parse2Params       	 9960117	       119.6 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_Parse2Params        	10148564	       117.3 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_Parse2Params 	 7400347	       161.6 ns/op	      64 B/op	       1 allocs/op
BenchmarkBunrouter_Parse2Params  	23576023	        50.04 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_ParseAll            	   51376	     23343 ns/op	   11648 B/op	      78 allocs/op
BenchmarkEcho_ParseAll           	  399003	      3115 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_ParseAll            	  384474	      3139 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_ParseAll     	  417507	      3082 ns/op	     640 B/op	      16 allocs/op
BenchmarkBunrouter_ParseAll      	  745998	      1522 ns/op	       0 B/op	       0 allocs/op
BenchmarkChi_StaticAll           	    9376	    141685 ns/op	   70339 B/op	     471 allocs/op
BenchmarkEcho_StaticAll          	   47644	     25139 ns/op	       0 B/op	       0 allocs/op
BenchmarkGin_StaticAll           	   48018	     24656 ns/op	       0 B/op	       0 allocs/op
BenchmarkHttpRouter_StaticAll    	  101344	     11754 ns/op	       0 B/op	       0 allocs/op
BenchmarkBunrouter_StaticAll     	   94906	     12327 ns/op	       0 B/op	       0 allocs/op
```
