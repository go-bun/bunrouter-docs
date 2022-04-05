---
title: Zero downtime restarts and deploys
---

<UptraceCta />

# Zero downtime restarts and deploys for Go using systemd

During restarts, your API may be unavailable for short period of time required to stop an old app
instance and start a new one. You can fix that by introducing another app (proxy) that listens on
behalf of the main app and somehow proxies the data to the main app.

A popular way to do that is to pass the listening socket as a file descriptor to a child process and
then re-create the socket there using the descriptor. Systemd can do that for you via the feature
called [socket activation](https://www.freedesktop.org/software/systemd/man/systemd.socket.html).

By configuring a systemd socket, you can tell systemd to listen on the configured ports and start
your service with a copy of the listening sockets. During restarts, the data is not lost but stored
in OS buffers.

## Systemd socket

You can configure a systemd socket by creating `/lib/systemd/system/myapp.socket` file, for example,
the following socket listens on the port 80, but you can add as many ports as you need:

```
[Socket]
ListenStream = 80
#ListenStream = 443
BindIPv6Only = both
Service      = myapp.service

[Install]
WantedBy = sockets.target
```

You also need to configure an accompanying systemd service by creating `myapp.service` file:

```
[Unit]
Description = myapp
After       = network.target

[Service]
Type = simple

ExecStart = /bin/myapp
ExecStop  = /bin/kill $MAINPID
KillMode  = none

[Install]
WantedBy = multi-user.target
```

## Using systemd sockets

The Go application should be modified to use the systemd socket instead of directly listening on the
port. Let's install a Go module that will help us with that:

```shell
go get github.com/coreos/go-systemd/v22
```

And then use it like this:

```go
import "github.com/coreos/go-systemd/v22/activation"

func main() {
	listeners, err := activation.Listeners()
	if err != nil {
		return err
	}

	httpLn := listeners[0]
	//httpsLn := listeners[1]

	httpServer := &http.Server{
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:	   5 * time.Second,
		WriteTimeout:	   5 * time.Second,
		IdleTimeout:	   60 * time.Second,
		Handler:		   router,
	}
	if err := httpServer.Serve(httpLn); err != nil {
		log.Printf("Serve failed: %s", err)
	}
}
```

## Restarting the app

First, you need to start the configured systemd socket:

```shell
sudo systemctl start myapp.socket
```

And then check that the socket was created successfully:

```shell
sudo systemctl status myapp.socket
```

Systemd will automatically start the service on the first request or if the service crashes. You can
also manually restart the service during deploys:

```shell
sudo systemctl restart myapp.service
```
