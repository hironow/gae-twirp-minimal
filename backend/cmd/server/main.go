package main

import (
	"net/http"

	"gae-twirp-minimal/backend/internal/haberdasherserver"
	"gae-twirp-minimal/backend/rpc/haberdasher"
)

func main() {
	server := &haberdasherserver.Server{} // implements Haberdasher interface
	twirpHandler := haberdasher.NewHaberdasherServer(server, nil)

	http.ListenAndServe(":8080", twirpHandler)
}