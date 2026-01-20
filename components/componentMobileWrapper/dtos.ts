export interface IframeConfig {
    locale: string;
    checkoutRequestId: string;
    publicKey: string;
}

export interface IPerformanceMeasure {
    initLoadTime: number;
  }

export interface IframeCallbacks {
    onCreateTokenSucceeded?: (token: string) => void;
    onCreateTokenError?: (error: string) => void;
    onFinalizePayment?: (order: any) => void;
    onErrorPayment?: (error: string) => void;
    onGetInfoSuccess?: (performanceMeasure: IPerformanceMeasure) => void;
    onEventListener?: (payload: { name: string; value: any }) => void;
    preRedirect?: (urlRedirect: string) => Promise<boolean>;
    onUpdateSubmitTrigger?: (triggerSubmitFromExternalFunction: (args: any) => void) => void;
}