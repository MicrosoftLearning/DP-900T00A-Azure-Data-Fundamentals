import { IUri } from "../IUri";
import { ITenantDiscoveryResponse } from "./ITenantDiscoveryResponse";
import TelemetryManager from "../telemetry/TelemetryManager";
/**
 * @hidden
 */
export declare enum AuthorityType {
    Default = 0,
    Adfs = 1
}
/**
 * @hidden
 */
export declare class Authority {
    constructor(authority: string, validateAuthority: boolean, authorityMetadata?: ITenantDiscoveryResponse);
    static isAdfs(authorityUrl: string): boolean;
    readonly AuthorityType: AuthorityType;
    IsValidationEnabled: boolean;
    readonly Tenant: string;
    private tenantDiscoveryResponse;
    readonly AuthorizationEndpoint: string;
    readonly EndSessionEndpoint: string;
    readonly SelfSignedJwtAudience: string;
    private validateResolved;
    /**
     * A URL that is the authority set by the developer
     */
    CanonicalAuthority: string;
    private canonicalAuthority;
    private canonicalAuthorityUrlComponents;
    readonly CanonicalAuthorityUrlComponents: IUri;
    protected readonly DefaultOpenIdConfigurationEndpoint: string;
    /**
     * Given a string, validate that it is of the form https://domain/path
     */
    private validateAsUri;
    /**
     * Calls the OIDC endpoint and returns the response
     */
    private DiscoverEndpoints;
    /**
     * Returns a promise.
     * Checks to see if the authority is in the cache
     * Discover endpoints via openid-configuration
     * If successful, caches the endpoint for later use in OIDC
     */
    resolveEndpointsAsync(telemetryManager: TelemetryManager, correlationId: string): Promise<ITenantDiscoveryResponse>;
    /**
     * Checks if there is a cached tenant discovery response with required fields.
     */
    hasCachedMetadata(): boolean;
    /**
     * Returns a promise which resolves to the OIDC endpoint
     * Only responds with the endpoint
     */
    GetOpenIdConfigurationEndpoint(): string;
}
