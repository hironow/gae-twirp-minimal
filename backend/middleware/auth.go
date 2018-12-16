package middleware

import (
	"context"
	"errors"
	"strings"
	"time"

	"google.golang.org/appengine/log"

	"github.com/dgrijalva/jwt-go"
	"github.com/twitchtv/twirp"
)

// code
// - https://github.com/grpc/grpc-go/blob/master/examples/oauth/server/main.go

const (
	SECRET                = "my_secret"
	ACCESS_TOKEN_LIFETIME = 15 * time.Minute // 15分で期限切れ、 TODO: ID Tokenのexpは1時間なのでそれに合わせる？
)

const (
	ClaimUserID = "userid"
)

type JWTData struct {
	// Standard claims are the standard jwt claims from the IETF standard
	// https://tools.ietf.org/html/rfc7519
	jwt.StandardClaims
	CustomClaims map[string]string `json:"custom,omitempty"`
}

// JWTCheckerHooks backend Access Tokenを検証するHook
//
// Authorizationヘッダから取得したAccess Tokenを検証する。
// 期限切れならTokenの再取得を要求する。
// 期限切れ間近のTokenは、前もって再取得しておくと良い。
func JWTCheckerHooks() *twirp.ServerHooks {
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
		ok, userID := authorized(ctx, tokenString, svc, method)
		if !ok {
			log.Debugf(ctx, "not authorized to use this method")
			return ctx, twirp.NewError(twirp.PermissionDenied, "not authorized to use this method")
		}

		// set userID
		log.Debugf(ctx, "Verified userID: %+v", userID)
		ctx = contextWithUserID(ctx, userID)

		return ctx, nil
	}
	return hooks
}

func GetJWTWithCustomClaims(ctx context.Context, customClaims map[string]string) string {
	claims := JWTData{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(ACCESS_TOKEN_LIFETIME).Unix(),
		},

		CustomClaims: customClaims,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(SECRET))
	if err != nil {
		log.Errorf(ctx, "%+v", err)
	}

	log.Debugf(ctx, "tokenString: %+v", tokenString)

	return tokenString
}

func authorized(ctx context.Context, tokenString, svc, method string) (bool, string) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTData{}, func(token *jwt.Token) (interface{}, error) {
		if jwt.SigningMethodHS256 != token.Method {
			return nil, errors.New("invalid signing algorithm")
		}
		return []byte(SECRET), nil
	})
	if err != nil {
		// unauthorized
		log.Errorf(ctx, "%+v", err)
		return false, ""
	}

	if claims, ok := token.Claims.(*JWTData); ok && token.Valid {
		log.Debugf(ctx, "CustomClaims: %+v", claims.CustomClaims)
		return true, claims.CustomClaims[ClaimUserID]
	}

	return false, ""
}
