package middleware

import "net/http"

func WithJWT(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		ctx := r.Context()
		ctx = contextWithJWT(ctx, authHeader)

		//log.Debugf(ctx, "RemoteAddr: %#v", r.RemoteAddr)
		//log.Debugf(ctx, "X-Forwarded-For: %#v", r.Header.Get("X-Forwarded-For"))
		//log.Debugf(ctx, "X-Real-Ip: %#v", r.Header.Get("X-Real-Ip"))
		//log.Debugf(ctx, "User-Agent: %#v", r.Header.Get("User-Agent"))

		r = r.WithContext(ctx)
		h.ServeHTTP(w, r)
	})
}
