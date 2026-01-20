import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { useRef } from 'react';
import { IframeCallbacks, IframeConfig } from './dtos';

interface ComponentMobileWrapperProps{
  config: IframeConfig,
  options?: any;
  callbacks?: IframeCallbacks
}

export default function ComponentMobileWrapper({config, options, callbacks}: ComponentMobileWrapperProps) {
  const injectCallbacks = `
    window.callbacks = {
      onCreateTokenSucceeded: ${callbacks?.onCreateTokenSucceeded ? `function (token) { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onCreateTokenSucceeded', data: token })); }` : `undefined`},
      onCreateTokenError: ${callbacks?.onCreateTokenError ? `function (error) { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onCreateTokenError', data: error })); }` : `undefined`},
      onGetInfoSuccess: ${callbacks?.onGetInfoSuccess ? `function (loadingTime) { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onGetInfoSuccess', data: loadingTime })); }` : `undefined`},
      onFinalizePayment: ${callbacks?.onFinalizePayment ? `function (order) { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onFinalizePayment', data: order })); }` : `undefined`},
      onErrorPayment: ${callbacks?.onErrorPayment ? `function (error) { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onErrorPayment', data: error })); }` : `undefined`}
    };
  `;
  
  const webviewRef = useRef<WebView>(null);
  const onWebViewLoad = () => {
    if (webviewRef.current) {
      const componentParams = {
        config,
        options,
      };

      const paramsString = JSON.stringify(componentParams);

      webviewRef.current.injectJavaScript(`
        ${injectCallbacks}
        if (window.initializeCheckout) {
          window.initializeCheckout({ ...${paramsString}, callbacks: window.callbacks });
        }
      `);
    }
  };

  const onMessage = (componentEvent: any) => {
    try {
      const { event } = JSON.parse(componentEvent.nativeEvent.data);
      const eventType: keyof IframeCallbacks = event.eventType;
      const data: any = event.data;
      
      if (callbacks && typeof callbacks[eventType] === 'function') {
        callbacks[eventType](data);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };
  
  return (
    <WebView
      ref={webviewRef}
      style={styles.webv}
      originWhitelist={['*']}
      source={require('../../assets/loadComponent.html')}
      onLoadEnd={onWebViewLoad}
      onMessage={onMessage} 
    />
  );
}

const styles = StyleSheet.create({
  webv:{
    flex: 1
  }
});