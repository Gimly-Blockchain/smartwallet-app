package com.jolocomwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
import com.reactnativecommunity.art.ARTPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactlibrary.RNJolocomPackage;

import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.horcrux.svg.SvgPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.keychain.KeychainPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.wix.interactable.Interactable;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSentryPackage(),
            new ReactToolbarPackage(),
            new ARTPackage(),
            new RNGestureHandlerPackage(),
            new RNJolocomPackage(),
            new AndroidOpenSettingsPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNLocalizePackage(),
            new ReanimatedPackage(),
            new RNScreensPackage(),
            new RNVersionNumberPackage(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            new RandomBytesPackage(),
            new KeychainPackage(),
            new RNFetchBlobPackage(),
            new RNCameraPackage(),
            new SQLitePluginPackage(),
            new LinearGradientPackage(),
            new Interactable()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
