// GENERATED CODE -- DO NOT EDIT!
namespace Pj.Protobuf.HaberdasherService {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    using UnityEngine.Networking;
    using Google.Protobuf;
    using Pj.Protobuf.Haberdasher;
    using System.Threading.Tasks;

    public class DefaultHaberdasher {
        private readonly string hostName = "http://localhost:8080";
        private readonly string token = "";
        private readonly string pathPrefix = "/twirp/twirp.example.haberdasher.Haberdasher/";

        public DefaultHaberdasher(string hn, string t) {
            hostName = hn;
            token = t;
        }

        public IEnumerator MakeHat(Size size, TaskCompletionSource<Hat> taskCompletionSource) {
            // バイナリデータでリクエスト
            byte[] data = size.ToByteArray();
            UnityWebRequest request = new UnityWebRequest(hostName + pathPrefix + "MakeHat", "POST");
            if (data != null && data.Length != 0) {
                request.uploadHandler = new UploadHandlerRaw(data);
            }
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/protobuf");
            request.SetRequestHeader("Authorization", "Bearer " + token);

            yield return request.SendWebRequest();

            if (request.isNetworkError || request.isHttpError) {
                Debug.LogError(request.isNetworkError);
                Debug.LogError(request.isHttpError);
                Debug.LogError(request.error);

                // TODO: エラーハンドリング、Twirpの型を定義しておかないといけない
                // taskCompletionSource.TrySetException(new Exception(request.error));
            }

            // 結果をバイナリデータとして取得
            byte[] result = request.downloadHandler.data;
            Hat response = Hat.Parser.ParseFrom(result);
            taskCompletionSource.TrySetResult(response);
        }
    }
}