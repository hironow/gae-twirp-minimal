// GENERATED CODE -- DO NOT EDIT!
namespace Pj.Protobuf.Twirp {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    using UnityEngine.Networking;
    using Google.Protobuf;
    using System.Threading.Tasks;

    public class TwirpErrorJSON {
        public string code;
        public string msg;
        public IDictionary<string, string> meta; // index

        public TwirpErrorJSON(TwirpErrorJSON te) {
            // super(te.msg);

            code = te.code;
            meta = te.meta;
        }
    }

    public class TwirpErrorException : Exception { // extends Error
        public string code;
        public IDictionary<string, string> meta; // index

        public TwirpErrorException() { }
        public TwirpErrorException(string message) : base(message) { }
        public TwirpErrorException(string message, Exception inner) : base(message, inner) { }

        public TwirpErrorException ThrowTwirpError(UnityWebRequest request) {
            return new TwirpErrorException();
        }
    }

    //export const throwTwirpError = (resp: Response) => {
    //    return resp.json().then((err: TwirpErrorJSON) => { throw new TwirpError(err); })
    //};

}