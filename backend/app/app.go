package app

import (
	"gae-twirp-minimal/backend/middleware"
	"net/http"

	"github.com/rs/cors"
	"github.com/twitchtv/twirp"
	"google.golang.org/appengine"

	"gae-twirp-minimal/backend/internal/haberdasherserver"
	"gae-twirp-minimal/backend/internal/helloworldserver"
	"gae-twirp-minimal/backend/internal/sessionserver"
	"gae-twirp-minimal/backend/rpc/haberdasher"
	"gae-twirp-minimal/backend/rpc/helloworld"
	"gae-twirp-minimal/backend/rpc/session"
)

func init() {
	// CORS setting
	c := cors.New(cors.Options{
		AllowedOrigins: getAllowedOrigins(),
		AllowedHeaders: []string{"Origin", "Content-Type", "Authorization"},
	})

	// RPC Service
	r := http.NewServeMux()

	// No Auth
	{
		hooks := twirp.ChainHooks(
			middleware.LoggingHooks(),
		)
		handlerMap := map[string]interface{}{
			// RPC Service Path and Server
			helloworld.HelloWorldPathPrefix: helloworld.NewHelloWorldServer(&helloworldserver.Server{}, hooks),
		}
		for pathPrefix, handler := range handlerMap {
			h := handler.(http.Handler)
			r.Handle(pathPrefix, withContext(
				c.Handler(h)),
			)
		}
	}

	// Firebase ID Token Auth
	{
		hooks := twirp.ChainHooks(
			middleware.LoggingHooks(),
			middleware.FirebaseJWTCheckerHooks(), // with Firebase ID Token
		)
		handlerMap := map[string]interface{}{
			// RPC Service Path and Server
			session.SessionPathPrefix: session.NewSessionServer(&sessionserver.Server{}, hooks),
		}
		for pathPrefix, handler := range handlerMap {
			h := handler.(http.Handler)
			r.Handle(pathPrefix, withContext(
				middleware.WithJWT(c.Handler(h))),
			)
		}
	}

	// Access Token Auth
	{
		hooks := twirp.ChainHooks(
			middleware.LoggingHooks(),
			middleware.JWTCheckerHooks(), // with Access Token
		)
		handlerMap := map[string]interface{}{
			// RPC Service Path and Server
			haberdasher.HaberdasherPathPrefix: haberdasher.NewHaberdasherServer(&haberdasherserver.Server{}, hooks),
		}
		for pathPrefix, handler := range handlerMap {
			h := handler.(http.Handler)
			r.Handle(pathPrefix, withContext(
				middleware.WithJWT(c.Handler(h))),
			)
		}
	}

	http.Handle("/", r)
}

func withContext(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		r = r.WithContext(ctx)
		h.ServeHTTP(w, r)
	})
}
