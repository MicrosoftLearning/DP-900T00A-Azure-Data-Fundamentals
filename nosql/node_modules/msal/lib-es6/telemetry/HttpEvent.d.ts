import TelemetryEvent from "./TelemetryEvent";
import { StringDict } from "../MsalTypes";
export declare const EVENT_KEYS: {
    HTTP_PATH: string;
    USER_AGENT: string;
    QUERY_PARAMETERS: string;
    API_VERSION: string;
    RESPONSE_CODE: string;
    O_AUTH_ERROR_CODE: string;
    HTTP_METHOD: string;
    REQUEST_ID_HEADER: string;
    SPE_INFO: string;
    SERVER_ERROR_CODE: string;
    SERVER_SUB_ERROR_CODE: string;
    URL: string;
};
export default class HttpEvent extends TelemetryEvent {
    constructor(correlationId: string, eventLabel: string);
    url: string;
    httpPath: string;
    userAgent: string;
    queryParams: StringDict;
    apiVersion: string;
    httpResponseStatus: number;
    oAuthErrorCode: string;
    httpMethod: string;
    requestIdHeader: string;
    /**
     * Indicates whether the request was executed on a ring serving SPE traffic.
     * An empty string indicates this occurred on an outer ring, and the string "I"
     * indicates the request occurred on the inner ring
     */
    speInfo: string;
    serverErrorCode: string;
    serverSubErrorCode: string;
}
