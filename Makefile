BACKEND_RPC_PATH = ./backend/rpc

FRONTEND_RPC_PATH = ./frontend/client/src/rpc
FRONTEND_TEMPLATE_PATH = ./templates/frontend
PROTOC_GEN_TS_PATH="./frontend/client/node_modules/.bin/protoc-gen-ts"

UNITY_RPC_PATH = ./unity/Assets/RPC
UNITY_TEMPLATE_PATH = ./templates/unity
GRPC_CSHARP_PLUGIN_PATH = ./temp/Grpc.Tools/tools/macosx_x64/grpc_csharp_plugin


install: ## Install protoc plugin
	go get -u github.com/golang/protobuf/protoc-gen-go && \
	go get -u github.com/twitchtv/twirp/protoc-gen-twirp && \
	go get -u moul.io/protoc-gen-gotemplate && \
	go get -u github.com/gogo/protobuf/protoc-gen-gofast

dev-server: ## develop server
	dev_appserver.py backend/app/app.yaml frontend/app/app.yaml --host 0.0.0.0 --enable_host_checking false

dev-web: ## develop web
	cd frontend/client/ && npm run start:dev

gen-all: gen-go gen-ts gen-unity ## generate all

gen-go: ## generate Go protobug. Auto-generate code
	@ echo "Start to generate Go protobuf files."
	go generate ./...

gen-ts: ## generate Typescript protobuf. Protobufは公式(↓)、GrpcはTwirp利用、Fetchリクエスト部分はgen-go-template TODO: https://github.com/improbable-eng/ts-protoc-gen 利用
	@ echo "Start to generate Typescript protobuf files."
	@ echo "Twirp files..."
	mkdir -p $(FRONTEND_RPC_PATH)
	protoc -I=. -I=$(GOPATH)/src \
		--proto_path="$(BACKEND_RPC_PATH)/session" \
		--gotemplate_out="debug=true,template_dir=$(FRONTEND_TEMPLATE_PATH)/twirp:$(FRONTEND_RPC_PATH)" \
		service.proto

	@ echo "RPC files..."
	mkdir -p $(FRONTEND_RPC_PATH)/session
	protoc -I=. -I="$(GOPATH)/src" \
		--proto_path="$(BACKEND_RPC_PATH)/session" \
		--js_out="import_style=commonjs,binary:$(FRONTEND_RPC_PATH)/session" \
		--ts_out="$(FRONTEND_RPC_PATH)/session" \
		--gotemplate_out="debug=true,template_dir=$(FRONTEND_TEMPLATE_PATH)/service:$(FRONTEND_RPC_PATH)/session" \
		--plugin="protoc-gen-ts=$(PROTOC_GEN_TS_PATH)" \
		service.proto

	mkdir -p $(FRONTEND_RPC_PATH)/haberdasher
	protoc -I=. -I="$(GOPATH)/src" \
		--proto_path="$(BACKEND_RPC_PATH)/haberdasher" \
		--js_out="import_style=commonjs,binary:$(FRONTEND_RPC_PATH)/haberdasher" \
		--ts_out="$(FRONTEND_RPC_PATH)/haberdasher" \
		--gotemplate_out="debug=true,template_dir=$(FRONTEND_TEMPLATE_PATH)/service:$(FRONTEND_RPC_PATH)/haberdasher" \
		--plugin="protoc-gen-ts=$(PROTOC_GEN_TS_PATH)" \
		service.proto

	mkdir -p $(FRONTEND_RPC_PATH)/helloworld
	protoc -I=. -I="$(GOPATH)/src" \
		--proto_path="$(BACKEND_RPC_PATH)/helloworld" \
		--js_out="import_style=commonjs,binary:$(FRONTEND_RPC_PATH)/helloworld" \
		--ts_out="$(FRONTEND_RPC_PATH)/helloworld" \
		--gotemplate_out="debug=true,template_dir=$(FRONTEND_TEMPLATE_PATH)/service:$(FRONTEND_RPC_PATH)/helloworld" \
		--plugin="protoc-gen-ts=$(PROTOC_GEN_TS_PATH)" \
		service.proto

gen-unity: ## generate Unity C# protobuf. Protobufは公式、Grpcは公式だが利用しない、Fetchリクエスト部分はgen-go-template TODO: Grpc.Coreは削除できる
	@ echo "Start to generate Unity C# protobuf files."
	@ echo "Twirp files..."
	mkdir -p $(UNITY_RPC_PATH)/session
	protoc -I=. -I=$(GOPATH)/src -I=$(GOPATH)/src/github.com/gogo/protobuf/protobuf \
		--csharp_out=$(UNITY_RPC_PATH)/session \
		--gotemplate_out=debug=true,template_dir=$(UNITY_TEMPLATE_PATH)/twirp:$(UNITY_RPC_PATH) \
		$(BACKEND_RPC_PATH)/session/service.proto \
		--plugin=protoc-gen-grpc=$(GRPC_CSHARP_PLUGIN_PATH)

	@ echo "RPC files..."
	mkdir -p $(UNITY_RPC_PATH)/session
	protoc -I=. -I=$(GOPATH)/src -I=$(GOPATH)/src/github.com/gogo/protobuf/protobuf \
		--csharp_out=$(UNITY_RPC_PATH)/session \
		--gotemplate_out=debug=true,template_dir=$(UNITY_TEMPLATE_PATH)/service:$(UNITY_RPC_PATH)/session \
		$(BACKEND_RPC_PATH)/session/service.proto \
		--plugin=protoc-gen-grpc=$(GRPC_CSHARP_PLUGIN_PATH)
	# --grpc_out=$(UNITY_RPC_PATH)/session \

	mkdir -p $(UNITY_RPC_PATH)/haberdasher
	protoc -I=. -I=$(GOPATH)/src -I=$(GOPATH)/src/github.com/gogo/protobuf/protobuf \
		--csharp_out=$(UNITY_RPC_PATH)/haberdasher \
		--gotemplate_out=debug=true,template_dir=$(UNITY_TEMPLATE_PATH)/service:$(UNITY_RPC_PATH)/haberdasher \
		$(BACKEND_RPC_PATH)/haberdasher/service.proto \
		--plugin=protoc-gen-grpc=$(GRPC_CSHARP_PLUGIN_PATH)
	# --grpc_out=$(UNITY_RPC_PATH)/haberdasher \

	mkdir -p $(UNITY_RPC_PATH)/helloworld
	protoc -I=. -I=$(GOPATH)/src -I=$(GOPATH)/src/github.com/gogo/protobuf/protobuf \
		--csharp_out=$(UNITY_RPC_PATH)/helloworld \
		--gotemplate_out=debug=true,template_dir=$(UNITY_TEMPLATE_PATH)/service:$(UNITY_RPC_PATH)/helloworld \
		$(BACKEND_RPC_PATH)/helloworld/service.proto \
		--plugin=protoc-gen-grpc=$(GRPC_CSHARP_PLUGIN_PATH)
	# --grpc_out=$(UNITY_RPC_PATH)/helloworld \

clean: ## Remove vendor files
	@ echo "Remove vendor files..."
	rm -rf vendor/*

help: ## Self-documented Makefile
	@ grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install dev-server dev-web gen-all gen-go gen-ts gen-unity clean help