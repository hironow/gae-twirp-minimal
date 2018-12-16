package config

import (
	"context"

	"firebase.google.com/go"
	"google.golang.org/appengine/log"
)

var (
	FirebaseConfig = &firebase.Config{
		ProjectID: FIREBASE_PROJECT_ID,
	}
)

// verifyFirebaseIDToken verify firebase auth id_token.
//
// ref.
// - https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#retrieve_id_tokens_on_clients
//
// code
// - https://github.com/GoogleCloudPlatform/golang-samples/blob/master/appengine/gophers/gophers-6/main.go
func verifyFirebaseIDToken(ctx context.Context, idTokenString string) bool {
	app, err := firebase.NewApp(ctx, FirebaseConfig)
	if err != nil {
		log.Errorf(ctx, "firebase.NewApp: %+v", err)
		return false
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Errorf(ctx, "error getting Auth client: %+v", err)
		return false
	}

	token, err := authClient.VerifyIDToken(ctx, idTokenString)
	if err != nil {
		log.Errorf(ctx, "error verifying ID token: %+v", err)
		return false
	}

	log.Debugf(ctx, "Verified ID uID: %+v token: %+v", token.UID, token)

	return true
}
