package app

import "google.golang.org/appengine"

func getBackendHostURL() string {
	if appengine.IsDevAppServer() {
		// only local
		return "http://192.168.100.103:8080"
	}
	return "http://localhost:8080" // TODO: deploy env url
}
