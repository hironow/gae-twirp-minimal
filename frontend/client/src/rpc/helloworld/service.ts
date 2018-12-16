// GENERATED CODE -- DO NOT EDIT!
import {createTwirpRequest, throwTwirpError, Fetch} from "../twirp";
import {
HelloReq, HelloResp, 
} from "./service_pb";
export interface HelloWorld {
    hello: (helloReq: HelloReq) => Promise<HelloResp.AsObject>;
}

export class DefaultHelloWorld implements HelloWorld {
    private hostname: string;
    private fetch: Fetch;
    private token: string;
    private pathPrefix = "/twirp/twitch.twirp.example.helloworld.HelloWorld/";

    constructor(hostname: string, fetch: Fetch, token: string) {
        this.hostname = hostname;
        this.fetch = fetch;
        this.token = token;
    }
    hello(helloReq: HelloReq): Promise<HelloResp.AsObject> {
        const url = this.hostname + this.pathPrefix + "Hello";
        return this.fetch(createTwirpRequest(url, helloReq.toObject(), this.token)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then((m): HelloResp.AsObject => m);
        });
    }
}
