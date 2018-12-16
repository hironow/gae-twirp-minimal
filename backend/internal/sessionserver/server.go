package sessionserver

import (
	"context"
	"gae-twirp-minimal/backend/middleware"
	pb "gae-twirp-minimal/backend/rpc/session"

	"google.golang.org/appengine/log"
)

type Server struct{}

// Login Register？
func (s *Server) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	uID := middleware.ContextFirebaseUID(ctx)
	log.Infof(ctx, "Session) uID: %+v", uID)

	userID := middleware.ContextUserID(ctx)
	log.Infof(ctx, "Session) userID: %+v", userID)

	// TODO: IPアドレス記録
	ipAddress := ""
	log.Infof(ctx, "Session) ip: %+v", ipAddress)

	// TODO: User作成

	// 自サービス用Access Token発行
	tokenString := middleware.GetJWTWithCustomClaims(ctx, map[string]string{
		middleware.ClaimUserID: "auth_service_u1",
	})

	return &pb.LoginResponse{Token: tokenString}, nil
}
