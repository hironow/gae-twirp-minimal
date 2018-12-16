#import <FirebaseAuth/FirebaseAuth.h>

#ifndef CUSTOM_MAKE_STRING_COPY
#define CUSTOM_MAKE_STRING_COPY
char* __MakeStringCopy(NSString* nsString)
{
  if ((!nsString) || (nil == nsString) || (nsString == (id)[NSNull null]) || (0 == nsString.length)) {
    return NULL;
  }

  const char* string = [nsString UTF8String];
  if (string == NULL) {
    return NULL;
  }

  char* res = (char*)malloc(strlen(string) + 1);
  strcpy(res, string);
  return res;
}
#endif

extern "C" {
    typedef void (*CallbackCaller)(char* token, char* err, void* methodHandle);
    void _CallPlugin_FirebaseAuth(void* methodHandle, CallbackCaller caller) {
        // controllerにcallerを渡して、IDToken取得後に実行する
        NSLog(@"_CallPlugin) [FIRAuth auth].currentUser.uid: %@", [FIRAuth auth].currentUser.uid);

        BOOL forceRefresh = false;
        FIRUser *user = [FIRAuth auth].currentUser;
        if (user) {
            [user getIDTokenForcingRefresh:forceRefresh completion:^(NSString *token, NSError *error) {
                if (error) {
                    NSLog(@"_CallPlugin) getIDTokenForcingRefresh error: %@", error);
                    (caller)(__MakeStringCopy(@""), __MakeStringCopy(error.localizedDescription), methodHandle);
                }

                (caller)(__MakeStringCopy(token), __MakeStringCopy(@""), methodHandle);
            }];
        } else {
            NSLog(@"_CallPlugin) not signed in");
            (caller)(__MakeStringCopy(@""), __MakeStringCopy(@"not signed in"), methodHandle);
        }
    }
}
