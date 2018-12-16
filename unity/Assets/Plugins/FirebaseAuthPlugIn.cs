using System;
using UnityEngine;
using System.Runtime.InteropServices;

public class FirebaseAuthPlugIn {
    // コールバックメソッド型
    public delegate void Callback(string token, string err);
    // コールバックをコールするメソッド型
    public delegate void CallbackCaller(string token, string err, IntPtr methodHandle);
    
    
    // コールバック付きでiOSの処理を呼び出すstaticメソッド
    [DllImport("__Internal")]
    private static extern void _CallPlugin_FirebaseAuth(IntPtr methodHandle, CallbackCaller caller);
    

   // C#(Unity)からコールバック付きでiOSの処理を呼び出すstaticメソッド
   // 
   // 引数はなし
   public static void CallPlugin(Callback callback) {
       if (Application.platform != RuntimePlatform.OSXEditor) {
           // コールバック関数をGCされないようにAllocしてハンドルを取得する
           IntPtr gcHandle = (IntPtr) GCHandle.Alloc(callback, GCHandleType.Normal);
           // コールバック関数のハンドル、コールバック関数を呼び出すためのstaticメソッド
           _CallPlugin_FirebaseAuth(gcHandle, CallCallback);
       } else {
           Debug.Log("CallPlugin not supported");
           Debug.Log("Run directly callback");
           callback("dummy", "");
       }
   }
   
   // iOSから呼ばれるコールバックを呼び出すためのstaticなメソッド
   [AOT.MonoPInvokeCallbackAttribute(typeof(CallbackCaller))]
   static void CallCallback(string token, string err, IntPtr methodHandle) {
       // methodHandleからコールバック関数を取り出す
       GCHandle handle = (GCHandle)methodHandle;
       Callback callback = handle.Target as Callback;
       // 不要になったハンドルを解放する
       handle.Free();

       callback(token, err);
   }
}