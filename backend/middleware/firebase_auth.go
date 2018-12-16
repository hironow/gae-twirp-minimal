package middleware

import (
	"context"
	"gae-twirp-minimal/backend/config"
	"strings"

	"firebase.google.com/go"

	"github.com/twitchtv/twirp"
	"google.golang.org/appengine/log"
)

// FirebaseJWTCheckerHooks Firebase ID Tokenを検証するHook
//
// Authorizationヘッダから取得したID TokenをFirebase Admin SDKで検証する。
// 期限切れなら再ログインを要求する。
func FirebaseJWTCheckerHooks() *twirp.ServerHooks {
	hooks := &twirp.ServerHooks{}
	hooks.RequestRouted = func(ctx context.Context) (context.Context, error) {
		authHeader := contextJWT(ctx)
		if authHeader == "" {
			// No error, just no token
			log.Debugf(ctx, "jwt must be included, just no token")
			return nil, twirp.NewError(twirp.Unauthenticated, "jwt must be included, just no token")
		}

		authHeaderParts := strings.Split(authHeader, " ")
		log.Debugf(ctx, "authHeaderParts: %#v", authHeaderParts)

		if len(authHeaderParts) != 2 || strings.ToLower(authHeaderParts[0]) != "bearer" {
			// Authorization header format must be `Bearer {token}`
			log.Debugf(ctx, "jwt must be included, header format")
			return nil, twirp.NewError(twirp.Unauthenticated, "jwt must be included, header format")
		}
		tokenString := authHeaderParts[1]

		log.Debugf(ctx, "tokenString: %#v", tokenString)

		svc, _ := twirp.ServiceName(ctx)
		method, _ := twirp.MethodName(ctx)
		ok, uID := firebaseAuthorized(ctx, tokenString, svc, method)
		if !ok {
			log.Debugf(ctx, "not authorized to use this method")
			return ctx, twirp.NewError(twirp.PermissionDenied, "not authorized to use this method")
		}

		// set UID
		log.Debugf(ctx, "Verified uID: %+v", uID)
		ctx = contextWithFirebaseUID(ctx, uID)

		return ctx, nil
	}
	return hooks
}

func firebaseAuthorized(ctx context.Context, tokenString, svc, method string) (bool, string) {
	app, err := firebase.NewApp(ctx, config.FirebaseConfig)
	if err != nil {
		// unauthorized
		log.Errorf(ctx, "firebase.NewApp: %+v", err)
		return false, ""
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		// unauthorized
		log.Errorf(ctx, "error getting Auth client: %+v", err)
		return false, ""
	}

	token, err := authClient.VerifyIDToken(ctx, tokenString)
	if err != nil {
		// unauthorized
		log.Errorf(ctx, "error verifying ID token: %+v", err)
		return false, ""
	}
	return true, token.UID
}
