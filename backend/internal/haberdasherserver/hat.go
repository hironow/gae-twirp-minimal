package haberdasherserver

import (
	"context"
	pb "gae-twirp-minimal/backend/rpc/haberdasher"

	"github.com/satori/go.uuid"
	"google.golang.org/appengine/datastore"
)

// HatIdentifier is string alias
type HatIdentifier = string

func HatID() HatIdentifier {
	return uuid.NewV4().String()
}

func HatKey(ctx context.Context, id HatIdentifier) *datastore.Key {
	return datastore.NewKey(ctx, "Hat", id, 0, nil)
}

func NewHat(inches int32, color, name string) *pb.Hat {
	return &pb.Hat{
		Id:     HatID(),
		Inches: inches,
		Color:  color,
		Name:   name,
	}
}
