// GENERATED CODE -- DO NOT EDIT!
import {createTwirpRequest, throwTwirpError, Fetch} from "../twirp";
import {
Size, Hat, 
} from "./service_pb";
export interface Haberdasher {
    makeHat: (size: Size) => Promise<Hat.AsObject>;
}

export class DefaultHaberdasher implements Haberdasher {
    private hostname: string;
    private fetch: Fetch;
    private token: string;
    private pathPrefix = "/twirp/twirp.example.haberdasher.Haberdasher/";

    constructor(hostname: string, fetch: Fetch, token: string) {
        this.hostname = hostname;
        this.fetch = fetch;
        this.token = token;
    }
    makeHat(size: Size): Promise<Hat.AsObject> {
        const url = this.hostname + this.pathPrefix + "MakeHat";
        return this.fetch(createTwirpRequest(url, size.toObject(), this.token)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then((m): Hat.AsObject => m);
        });
    }
}
