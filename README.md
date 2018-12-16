# gae-twirp-minimal

## Installation

```bash
$ brew install protobuf

$ make install
```


```bash
$ cd ./temp

$ mv Grpc.Tools.1.18.0-dev.nupkg Grpc.Tools.1.18.0-dev.zip
$ mkdir Grpc.Tools
$ unzip Grpc.Tools.1.18.0-dev.zip -d Grpc.Tools
$ chmod +x Grpc.Tools/tools/macosx_x64/*

$ unzip grpc_unity_package.1.18.0-dev.zip -d ../unity/Assets
```

add unity/Assets/GoogleService-Info.plist

```go
package config

const GOOGLE_CLIENT_ID = "xxx.apps.googleusercontent.com"

const FIREBASE_PROJECT_ID = "xxx"
```

add frontend/client/src/config.ts

```js
const config = {
    apiKey: "xxx",
    authDomain: "xxx.firebaseapp.com",
    projectId: "xxx",
};
```


## proto generate

```bash
$ make gen-all
```


## update

todo


## web

```bash
$ make dev-web
```


## gae

```bash
$ make dev-server
```

```bash
$ curl -X "POST" "http://localhost:8080/twirp/twirp.example.haberdasher.Haberdasher/MakeHat" \
     -H 'Content-Type: application/json' \
     -d $'{
  "inches": 12
}'
{"inches":12,"color":"red","name":"top hat"}%
```