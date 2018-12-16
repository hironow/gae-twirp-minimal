package middleware

import "context"

type ctxKey int

const (
	// keyJWT
	keyJWT ctxKey = iota
	// keyFirebaseUID
	keyFirebaseUID
	// keyUserID
	keyUserID
)

// ref. https://github.com/ribice/chisk/blob/82ffc39c9f336448dc5b67e618407f8ada551b50/pkg/jwt/jwt.go

func contextWithJWT(ctx context.Context, token string) context.Context {
	return context.WithValue(ctx, keyJWT, token)
}

func contextJWT(ctx context.Context) string {
	if jwt, ok := ctx.Value(keyJWT).(string); ok {
		return jwt
	}
	return ""
}

func contextWithFirebaseUID(ctx context.Context, uID string) context.Context {
	return context.WithValue(ctx, keyFirebaseUID, uID)
}

func ContextFirebaseUID(ctx context.Context) string {
	if uID, ok := ctx.Value(keyFirebaseUID).(string); ok {
		return uID
	}
	return ""
}

func contextWithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, keyUserID, userID)
}

func ContextUserID(ctx context.Context) string {
	if userID, ok := ctx.Value(keyUserID).(string); ok {
		return userID
	}
	return ""
}
