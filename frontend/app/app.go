package app

import (
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
)

func init() {
	r := mux.NewRouter()

	// index
	r.Methods("GET").Path("/").HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			tmpl := template.Must(template.ParseFiles("dist/index.html"))
			// set backend
			tmpl.Execute(w, struct {
				BackendHostURL string
			}{
				getBackendHostURL(),
			})
		})

	http.Handle("/", r)
}
