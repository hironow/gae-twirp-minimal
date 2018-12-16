package haberdasherserver

import (
	"context"
	"gae-twirp-minimal/backend/middleware"
	pb "gae-twirp-minimal/backend/rpc/haberdasher"
	"math/rand"

	"github.com/twitchtv/twirp"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

// Server implements the Haberdasher service
type Server struct{}

func (s *Server) MakeHat(ctx context.Context, size *pb.Size) (hat *pb.Hat, err error) {
	if size.Inches <= 0 {
		return nil, twirp.InvalidArgumentError("inches", "I can't make a hat that small!")
	}

	uID := middleware.ContextFirebaseUID(ctx)
	log.Infof(ctx, "Haberdasher) uID: %+v", uID)

	userID := middleware.ContextUserID(ctx)
	log.Infof(ctx, "Haberdasher) userID: %+v", userID)

	// list
	var hats []pb.Hat
	q := datastore.NewQuery("Hat").Limit(20)
	if _, err := q.GetAll(ctx, &hats); err != nil {
		log.Errorf(ctx, "datastore.NewQuery: err: %+v", err)
		return nil, twirp.InternalErrorWith(err)
	}
	for _, h := range hats {
		log.Debugf(ctx, "%+v", h)
	}

	// create
	hat = NewHat(
		size.GetInches(),
		[]string{"white", "black", "brown", "red", "blue"}[rand.Intn(4)],
		[]string{"bowler", "baseball cap", "top hat", "derby"}[rand.Intn(3)],
	)

	// save
	if err := PutHat(ctx, hat); err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	//key := HatKey(ctx, hat.GetId())                           // TODO: ちゃんとしたkeyを使う
	//if key, err := datastore.Put(ctx, key, hat); err != nil { // do not save XXX_ props
	//	log.Errorf(ctx, "datastore.Put: key: %+v err: %+v", key, err)
	//	return nil, twirp.InternalErrorWith(err)
	//}

	return hat, nil
}
