package app

import "google.golang.org/appengine"

func getFrontendHostURL() string {
	if appengine.IsDevAppServer() {
		// only local
		return "http://localhost:8081"
	}
	return "http://localhost:8081" // TODO: deploy env url
}

func getAllowedOrigins() []string {
	origins := []string{
		getFrontendHostURL(),
	}

	if appengine.IsDevAppServer() {
		// only local, frontend dev server
		origins = []string{"*"}
		//origins = append(origins, "http://localhost:3000")
		//origins = append(origins, "http://0.0.0.0:8081")
		//origins = append(origins, "http://192.168.100.103:8081")
	}

	return origins
}
