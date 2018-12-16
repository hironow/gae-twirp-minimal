package helloworldserver

import (
	"context"
	"gae-twirp-minimal/backend/middleware"
	pb "gae-twirp-minimal/backend/rpc/helloworld"

	"google.golang.org/appengine/log"
)

type Server struct{}

func (s *Server) Hello(ctx context.Context, req *pb.HelloReq) (*pb.HelloResp, error) {
	log.Debugf(ctx, "req: %+v", req)

	uID := middleware.ContextFirebaseUID(ctx)
	log.Infof(ctx, "HelloWorld) uID: %+v", uID)

	userID := middleware.ContextUserID(ctx)
	log.Infof(ctx, "HelloWorld) userID: %+v", userID)

	return &pb.HelloResp{Text: "Hello " + req.Subject}, nil
}
