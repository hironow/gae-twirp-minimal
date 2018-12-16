package haberdasherserver

import (
	pb "gae-twirp-minimal/backend/rpc/haberdasher"
	"reflect"
	"testing"

	"google.golang.org/appengine/aetest"
)

func TestServer_MakeHat(t *testing.T) {
	ctx, done, err := aetest.NewContext()
	if err != nil {
		t.Fatal(err)
	}
	defer done()

	type args struct {
		size *pb.Size
	}
	tests := []struct {
		name    string
		args    args
		wantHat *pb.Hat
		wantErr bool
	}{
		{"ok", args{&pb.Size{Inches: 10}}, &pb.Hat{Inches: 10}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Server{}
			gotHat, err := s.MakeHat(ctx, tt.args.size)
			if (err != nil) != tt.wantErr {
				t.Errorf("Server.MakeHat() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(gotHat, tt.wantHat) {
				t.Errorf("Server.MakeHat() = %v, want %v", gotHat, tt.wantHat)
			}
		})
	}
}
