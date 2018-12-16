package gen

//go:generate protoc -I=. -I=$GOPATH/src -I=$GOPATH/src/github.com/gogo/protobuf/protobuf --proto_path=../ --twirp_out=../ --gofast_out=../ ../session/service.proto
//go:generate protoc -I=. -I=$GOPATH/src -I=$GOPATH/src/github.com/gogo/protobuf/protobuf --proto_path=../ --twirp_out=../ --gofast_out=../ ../haberdasher/service.proto
//go:generate protoc -I=. -I=$GOPATH/src -I=$GOPATH/src/github.com/gogo/protobuf/protobuf --proto_path=../ --twirp_out=../ --gofast_out=../ ../helloworld/service.proto
