export let BACKEND_HOST_URL = 'http://localhost:8080';

const v = document.querySelector("meta[name='backend-host-url']").getAttribute("content");
if (v.startsWith("http")) {
    BACKEND_HOST_URL = v;
}