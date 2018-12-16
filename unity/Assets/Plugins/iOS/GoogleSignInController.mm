#import <Foundation/Foundation.h>
#import "GoogleSignInController.h"

#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseAuth/FirebaseAuth.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <GoogleSignIn/GIDGoogleUser.h>
#include "UnityInterface.h"
#import "AppDelegateListener.h"

@interface GoogleSignInController()<AppDelegateListener, GIDSignInDelegate, GIDSignInUIDelegate>
@end

@implementation GoogleSignInController

#pragma mark singleton

static GoogleSignInController *sharedInstance = nil;

+ (GoogleSignInController *) sharedInstance {
    @synchronized (self) {
        if (!sharedInstance) {
            sharedInstance = [GoogleSignInController new];
        }
    }
    return sharedInstance;
}

- (id) init {
    self = [super init];
    if (self) {
        // initialization

        // すでにclientID登録済み
        [GIDSignIn sharedInstance].delegate = self;
        [GIDSignIn sharedInstance].uiDelegate = self;
        
        NSLog(@"GoogleSignInController init) GoogleSignIn: %@", [GIDSignIn sharedInstance].clientID);
        
        UnityRegisterAppDelegateListener(self);
    }
    return self;
}

#pragma mark AppDelegateListener

- (void)onOpenURL:(NSNotification*)notification {
    NSLog(@"GoogleSignInController) AppDelegateListener.onOpenURL");
    NSURL* url = notification.userInfo[@"url"];
    NSString* sourceApplication = notification.userInfo[@"sourceApplication"];
    id annotation = notification.userInfo[@"annotation"];
    [[GIDSignIn sharedInstance] handleURL:url sourceApplication:sourceApplication annotation:annotation];
}

#pragma mark GIDSignInDelegate

- (void)signIn:(GIDSignIn *)signIn
didSignInForUser:(GIDGoogleUser *)user
     withError:(NSError *)error {
    // SignIn後の処理
    NSLog(@"GoogleSignInController) GIDSignInDelegate.singIn, didSignInForUser error:%@", error);

    if (error == nil) {
        GIDAuthentication *authentication = user.authentication;
        NSLog(@"GoogleSignInController) authentication.idToken: %@", authentication.idToken);
        
        FIRAuthCredential *credential =
        [FIRGoogleAuthProvider credentialWithIDToken:authentication.idToken
                                         accessToken:authentication.accessToken];
        // ...
        
        // Firebase Auth
        [[FIRAuth auth] signInAndRetrieveDataWithCredential:credential
             completion:^(FIRAuthDataResult * _Nullable authResult,
                          NSError * _Nullable error) {
                 if (error) {
                     // ...
                     NSLog(@"GoogleSignInController) GIDSignInDelegate.singIn, didSignInForUser, signInAndRetrieveDataWithCredential error:%@", error);
                     return;
                 }
                 // User successfully signed in. Get user data from the FIRUser object
                 if (authResult == nil) { return; }
                 FIRUser *user = authResult.user;
                 NSLog(@"GoogleSignInController) user.uid: %@", user.uid);
                 // ...
             }];
    } else {
        // ...
        NSLog(@"GoogleSignInController) GIDSignInDelegate.singIn, didSignInForUser has error");
    }
}

- (void)signIn:(GIDSignIn *)signIn
didDisconnectWithUser:(GIDGoogleUser *)user
     withError:(NSError *)error {
    // 実質SignOutではなく、Loginキャンセル or 失敗？
    NSLog(@"GoogleSignInController) GIDSignInDelegate.signIn, didDisconnectWithUser error:%@", error);
    
    // Firebase Auth
    NSError *signOutError;
    BOOL status = [[FIRAuth auth] signOut:&signOutError];
    if (!status) {
        NSLog(@"GoogleSignInController) [FIRAuth auth] signOut error: %@", signOutError);
        return;
    }
}

#pragma mark GIDSignInUIDelegate

- (void)signInWillDispatch:(GIDSignIn *)signIn error:(NSError *)error {
    NSLog(@"GoogleSignInController) GIDSignInUIDelegate.signInWillDispatch, error:%@", error);
}

- (void)signIn:(GIDSignIn *)signIn presentViewController:(UIViewController *)viewController {
    NSLog(@"GoogleSignInController) GIDSignInUIDelegate.signIn, presentViewController");
    [UnityGetGLViewController() presentViewController:viewController animated:YES completion:nil];
}

- (void)signIn:(GIDSignIn *)signIn dismissViewController:(UIViewController *)viewController {
    NSLog(@"GoogleSignInController) GIDSignInUIDelegate.signIn, dismissViewController");
    [UnityGetGLViewController() dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark GoogleSignInController

- (void)signIn {
    NSLog(@"GoogleSignInController) signIn");
    NSLog(@"GoogleSignInController) signIn [GIDSignIn sharedInstance].currentUser: %@", [GIDSignIn sharedInstance].currentUser);
    NSLog(@"GoogleSignInController) signIn [FIRAuth auth].currentUser.uid: %@", [FIRAuth auth].currentUser.uid);
    [[GIDSignIn sharedInstance] signIn];
    
    // Firebase Authはdelegate内で処理
}

- (void)signOut {
    NSLog(@"GoogleSignInController) signOut");
    NSLog(@"GoogleSignInController) signOut before [GIDSignIn sharedInstance].currentUser: %@", [GIDSignIn sharedInstance].currentUser);
    NSLog(@"GoogleSignInController) signOut before [FIRAuth auth].currentUser.uid: %@", [FIRAuth auth].currentUser.uid);

    [[GIDSignIn sharedInstance] signOut];
    
    // Firebase Auth
    NSError *signOutError;
    BOOL status = [[FIRAuth auth] signOut:&signOutError];
    if (!status) {
        NSLog(@"GoogleSignInController) signOut [FIRAuth auth] signOut error: %@", signOutError);
        return;
    }

    NSLog(@"GoogleSignInController) signOut after [GIDSignIn sharedInstance].currentUser: %@", [GIDSignIn sharedInstance].currentUser);
    NSLog(@"GoogleSignInController) signOut after [FIRAuth auth].currentUser.uid: %@", [FIRAuth auth].currentUser.uid);
}

@end
