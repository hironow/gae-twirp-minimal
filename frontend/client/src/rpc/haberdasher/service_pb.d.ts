// package: twirp.example.haberdasher
// file: service.proto

import * as jspb from "google-protobuf";

export class Size extends jspb.Message {
  getInches(): number;
  setInches(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Size.AsObject;
  static toObject(includeInstance: boolean, msg: Size): Size.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Size, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Size;
  static deserializeBinaryFromReader(message: Size, reader: jspb.BinaryReader): Size;
}

export namespace Size {
  export type AsObject = {
    inches: number,
  }
}

export class Hat extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getInches(): number;
  setInches(value: number): void;

  getColor(): string;
  setColor(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Hat.AsObject;
  static toObject(includeInstance: boolean, msg: Hat): Hat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Hat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Hat;
  static deserializeBinaryFromReader(message: Hat, reader: jspb.BinaryReader): Hat;
}

export namespace Hat {
  export type AsObject = {
    id: string,
    inches: number,
    color: string,
    name: string,
  }
}

