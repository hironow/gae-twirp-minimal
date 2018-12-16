// GENERATED CODE -- DO NOT EDIT!
export interface TwirpErrorJSON {
    code: string;
    msg: string;
    meta: {[index:string]: string};
}

export class TwirpError extends Error {
    code: string;
    meta: {[index:string]: string};

    constructor(te: TwirpErrorJSON) {
        super(te.msg);

        this.code = te.code;
        this.meta = te.meta;
    }
}

export const throwTwirpError = (resp: Response) => {
    return resp.json().then((err: TwirpErrorJSON) => { throw new TwirpError(err); })
};

export const createTwirpRequest = (url: string, body: object, token: string): Request => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token !== "") {
        headers.append("Authorization", "Bearer " + token);
    }

    return new Request(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });
};

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;