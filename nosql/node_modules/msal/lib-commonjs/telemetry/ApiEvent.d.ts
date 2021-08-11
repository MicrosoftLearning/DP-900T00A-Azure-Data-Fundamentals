import TelemetryEvent from "./TelemetryEvent";
export declare const EVENT_KEYS: {
    AUTHORITY: string;
    AUTHORITY_TYPE: string;
    PROMPT: string;
    TENANT_ID: string;
    USER_ID: string;
    WAS_SUCESSFUL: string;
    API_ERROR_CODE: string;
    LOGIN_HINT: string;
};
export declare enum API_CODE {
    AcquireTokenRedirect = 2001,
    AcquireTokenSilent = 2002,
    AcquireTokenPopup = 2003,
    LoginRedirect = 2004,
    LoginPopup = 2005,
    Logout = 2006
}
export declare enum API_EVENT_IDENTIFIER {
    AcquireTokenRedirect = "AcquireTokenRedirect",
    AcquireTokenSilent = "AcquireTokenSilent",
    AcquireTokenPopup = "AcquireTokenPopup",
    LoginRedirect = "LoginRedirect",
    LoginPopup = "LoginPopup",
    Logout = "Logout"
}
export default class ApiEvent extends TelemetryEvent {
    private piiEnabled;
    constructor(correlationId: string, piiEnabled: boolean, apiEventIdentifier?: API_EVENT_IDENTIFIER);
    apiEventIdentifier: string;
    apiCode: number;
    authority: string;
    apiErrorCode: string;
    tenantId: string;
    accountId: string;
    wasSuccessful: boolean;
    loginHint: string;
    authorityType: string;
    promptType: string;
}
