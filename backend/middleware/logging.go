package middleware

import (
	"context"

	"github.com/twitchtv/twirp"
	"google.golang.org/appengine/log"
)

func LoggingHooks() *twirp.ServerHooks {
	hooks := &twirp.ServerHooks{}
	hooks.RequestRouted = func(ctx context.Context) (context.Context, error) {
		svc, _ := twirp.ServiceName(ctx)
		method, _ := twirp.MethodName(ctx)

		var ipAddress string
		header, ok := twirp.HTTPRequestHeaders(ctx)
		if ok {
			ipAddress = ""
		}

		userAgent := header.Get("User-Agent")

		log.Infof(ctx, "service: %+v, method: %+v, ip: %+v, ua: %+v, header: %+v", svc, method, ipAddress, userAgent, header)
		return ctx, nil
	}
	return hooks
}
