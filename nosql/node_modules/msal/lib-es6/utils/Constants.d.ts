/**
 * @hidden
 * Constants
 */
export declare class Constants {
    static readonly libraryName: string;
    static readonly claims: string;
    static readonly clientId: string;
    static readonly adalIdToken: string;
    static readonly cachePrefix: string;
    static readonly scopes: string;
    static readonly no_account: string;
    static readonly upn: string;
    static readonly domain_hint: string;
    static readonly prompt_select_account: string;
    static readonly prompt_none: string;
    static readonly prompt: string;
    static readonly response_mode_fragment: string;
    static readonly resourceDelimiter: string;
    static readonly cacheDelimiter: string;
    private static _popUpWidth;
    static popUpWidth: number;
    private static _popUpHeight;
    static popUpHeight: number;
    static readonly login: string;
    static readonly renewToken: string;
    static readonly unknown: string;
    static readonly ADFS: string;
    static readonly homeAccountIdentifier: string;
    static readonly common: string;
    static readonly openidScope: string;
    static readonly profileScope: string;
    static readonly oidcScopes: Array<string>;
    static readonly interactionTypeRedirect: InteractionType;
    static readonly interactionTypePopup: InteractionType;
    static readonly interactionTypeSilent: InteractionType;
    static readonly inProgress: string;
}
/**
 * Keys in the hashParams
 */
export declare enum ServerHashParamKeys {
    SCOPE = "scope",
    STATE = "state",
    ERROR = "error",
    ERROR_DESCRIPTION = "error_description",
    ACCESS_TOKEN = "access_token",
    ID_TOKEN = "id_token",
    EXPIRES_IN = "expires_in",
    SESSION_STATE = "session_state",
    CLIENT_INFO = "client_info"
}
/**
 * @hidden
 * @ignore
 * response_type from OpenIDConnect
 * References: https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html & https://tools.ietf.org/html/rfc6749#section-4.2.1
 *
 */
export declare const ResponseTypes: {
    id_token: string;
    token: string;
    id_token_token: string;
};
/**
 * @hidden
 * CacheKeys for MSAL
 */
export declare enum TemporaryCacheKeys {
    AUTHORITY = "authority",
    ACQUIRE_TOKEN_ACCOUNT = "acquireTokenAccount",
    SESSION_STATE = "session.state",
    STATE_LOGIN = "state.login",
    STATE_ACQ_TOKEN = "state.acquireToken",
    STATE_RENEW = "state.renew",
    NONCE_IDTOKEN = "nonce.idtoken",
    LOGIN_REQUEST = "login.request",
    RENEW_STATUS = "token.renew.status",
    URL_HASH = "urlHash",
    INTERACTION_STATUS = "interaction_status",
    REDIRECT_REQUEST = "redirect_request"
}
export declare enum PersistentCacheKeys {
    IDTOKEN = "idtoken",
    CLIENT_INFO = "client.info"
}
export declare enum ErrorCacheKeys {
    LOGIN_ERROR = "login.error",
    ERROR = "error",
    ERROR_DESC = "error.description"
}
export declare const DEFAULT_AUTHORITY: string;
export declare const AAD_INSTANCE_DISCOVERY_ENDPOINT: string;
export declare const WELL_KNOWN_SUFFIX: string;
/**
 * @hidden
 * SSO Types - generated to populate hints
 */
export declare enum SSOTypes {
    ACCOUNT = "account",
    SID = "sid",
    LOGIN_HINT = "login_hint",
    ORGANIZATIONS = "organizations",
    CONSUMERS = "consumers",
    ID_TOKEN = "id_token",
    ACCOUNT_ID = "accountIdentifier",
    HOMEACCOUNT_ID = "homeAccountIdentifier"
}
/**
 * @hidden
 */
export declare const BlacklistedEQParams: SSOTypes[];
export declare type InteractionType = "redirectInteraction" | "popupInteraction" | "silentInteraction";
export declare const NetworkRequestType: {
    GET: string;
    POST: string;
};
/**
 * we considered making this "enum" in the request instead of string, however it looks like the allowed list of
 * prompt values kept changing over past couple of years. There are some undocumented prompt values for some
 * internal partners too, hence the choice of generic "string" type instead of the "enum"
 * @hidden
 */
export declare const PromptState: {
    LOGIN: string;
    SELECT_ACCOUNT: string;
    CONSENT: string;
    NONE: string;
};
/**
 * Frame name prefixes for the hidden iframe created in silent frames
 */
export declare const FramePrefix: {
    ID_TOKEN_FRAME: string;
    TOKEN_FRAME: string;
};
