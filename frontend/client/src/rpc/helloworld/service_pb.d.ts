// package: twitch.twirp.example.helloworld
// file: service.proto

import * as jspb from "google-protobuf";

export class HelloReq extends jspb.Message {
  getSubject(): string;
  setSubject(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloReq.AsObject;
  static toObject(includeInstance: boolean, msg: HelloReq): HelloReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelloReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloReq;
  static deserializeBinaryFromReader(message: HelloReq, reader: jspb.BinaryReader): HelloReq;
}

export namespace HelloReq {
  export type AsObject = {
    subject: string,
  }
}

export class HelloResp extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloResp.AsObject;
  static toObject(includeInstance: boolean, msg: HelloResp): HelloResp.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelloResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloResp;
  static deserializeBinaryFromReader(message: HelloResp, reader: jspb.BinaryReader): HelloResp;
}

export namespace HelloResp {
  export type AsObject = {
    text: string,
  }
}

