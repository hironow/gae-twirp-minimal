#import "AppController.h"
#import <FirebaseCore/FirebaseCore.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation AppController

- (BOOL)application:(UIApplication *)application
didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [super application:application didFinishLaunchingWithOptions:launchOptions];
    
    // Use Firebase library to configure APIs
    if (![FIRApp defaultApp]) {
        NSLog(@"firebase) AppController) FIRApp cofigure need!");
        [FIRApp configure];
    }
    
   // ここでは GoogleSignIn インスタンスへのclientID登録だけ行う
   [GIDSignIn sharedInstance].clientID = [FIRApp defaultApp].options.clientID;
   // [GIDSignIn sharedInstance].uiDelegate = self;
    
    NSLog(@"firebase) AppController) clientID: %@", [FIRApp defaultApp].options.clientID);
    
    return YES;
}

@end
