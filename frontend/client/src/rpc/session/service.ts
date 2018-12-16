// GENERATED CODE -- DO NOT EDIT!
import {createTwirpRequest, throwTwirpError, Fetch} from "../twirp";
import {
LoginRequest, LoginResponse, 
} from "./service_pb";
export interface Session {
    login: (loginRequest: LoginRequest) => Promise<LoginResponse.AsObject>;
}

export class DefaultSession implements Session {
    private hostname: string;
    private fetch: Fetch;
    private token: string;
    private pathPrefix = "/twirp/twitch.twirp.example.session.Session/";

    constructor(hostname: string, fetch: Fetch, token: string) {
        this.hostname = hostname;
        this.fetch = fetch;
        this.token = token;
    }
    login(loginRequest: LoginRequest): Promise<LoginResponse.AsObject> {
        const url = this.hostname + this.pathPrefix + "Login";
        return this.fetch(createTwirpRequest(url, loginRequest.toObject(), this.token)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then((m): LoginResponse.AsObject => m);
        });
    }
}
