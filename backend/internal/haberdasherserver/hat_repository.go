package haberdasherserver

import (
	"context"
	pb "gae-twirp-minimal/backend/rpc/haberdasher"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

func GetHat(ctx context.Context, hatID HatIdentifier) (dst *pb.Hat, err error) {
	key := HatKey(ctx, hatID)
	err = datastore.Get(ctx, key, &dst)
	if err != nil {
		log.Errorf(ctx, "datastore.Get: key: %+v err: %+v", key, err)
		return
	}
	return
}

func PutHat(ctx context.Context, hat *pb.Hat) (err error) {
	key := HatKey(ctx, hat.GetId())
	key, err = datastore.Put(ctx, key, hat)
	if err != nil {
		log.Errorf(ctx, "datastore.Put: key: %+v err: %+v", key, err)
		return
	}
	return
}

func DeleteHat(ctx context.Context, hatID HatIdentifier) (err error) {
	key := HatKey(ctx, hatID)
	err = datastore.Delete(ctx, key)
	if err != nil {
		log.Errorf(ctx, "datastore.Delete: key: %+v err: %+v", key, err)
		return
	}
	return
}
