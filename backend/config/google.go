package config

import (
	"context"

	googleOAuth2 "google.golang.org/api/oauth2/v2"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"
)

var (
	googleClientID = GOOGLE_CLIENT_ID
)

// verifyGoogleIDToken verify google id_token
//
// ref.
// - https://github.com/GoogleIdTokenVerifier/GoogleIdTokenVerifier
func verifyGoogleIDToken(ctx context.Context, idTokenString string) bool {
	client := urlfetch.Client(ctx)
	oauth2Service, err := googleOAuth2.New(client)
	if err != nil {
		log.Errorf(ctx, "%+v", err)
		return false
	}

	ti, err := oauth2Service.Tokeninfo().IdToken(idTokenString).Context(ctx).Do()
	if err != nil {
		log.Errorf(ctx, "%+v", err)
		return false
	}

	log.Debugf(ctx, "TokenInfo.Audience: %+v", ti.Audience)
	log.Debugf(ctx, "TokenInfo: %+v", ti)

	if ti.Audience != googleClientID {
		return false
	}

	if !ti.VerifiedEmail {
		log.Errorf(ctx, "not VerifiedEmail")
		return false
	}

	return true
}
