import { AbortSignalLike } from '@azure/abort-controller';
import { HttpClient } from '@azure/core-rest-pipeline';
import { HttpMethods } from '@azure/core-rest-pipeline';
import { InternalPipelineOptions } from '@azure/core-rest-pipeline';
import { OperationTracingOptions } from '@azure/core-tracing';
import { Pipeline } from '@azure/core-rest-pipeline';
import { PipelineOptions } from '@azure/core-rest-pipeline';
import { PipelinePolicy } from '@azure/core-rest-pipeline';
import { PipelineRequest } from '@azure/core-rest-pipeline';
import { PipelineResponse } from '@azure/core-rest-pipeline';
import { TokenCredential } from '@azure/core-auth';
import { TransferProgressEvent } from '@azure/core-rest-pipeline';

export declare interface BaseMapper {
    /**
     * Name for the xml element
     */
    xmlName?: string;
    /**
     * Xml element namespace
     */
    xmlNamespace?: string;
    /**
     * Xml element namespace prefix
     */
    xmlNamespacePrefix?: string;
    /**
     * Determines if the current property should be serialized as an attribute of the parent xml element
     */
    xmlIsAttribute?: boolean;
    /**
     * Name for the xml elements when serializing an array
     */
    xmlElementName?: string;
    /**
     * Whether or not the current property should have a wrapping XML element
     */
    xmlIsWrapped?: boolean;
    /**
     * Whether or not the current property is readonly
     */
    readOnly?: boolean;
    /**
     * Whether or not the current property is a constant
     */
    isConstant?: boolean;
    /**
     * Whether or not the current property is required
     */
    required?: boolean;
    /**
     * Whether or not the current property allows mull as a value
     */
    nullable?: boolean;
    /**
     * The name to use when serializing
     */
    serializedName?: string;
    /**
     * Type of the mapper
     */
    type: MapperType;
    /**
     * Default value when one is not explicitly provided
     */
    defaultValue?: any;
    /**
     * Constraints to test the current value against
     */
    constraints?: MapperConstraints;
}

/**
 * The common set of options that high level clients are expected to expose.
 */
export declare interface CommonClientOptions extends PipelineOptions {
    /**
     * The HttpClient that will be used to send HTTP requests.
     */
    httpClient?: HttpClient;
    /**
     * Set to true if the request is sent over HTTP instead of HTTPS
     */
    allowInsecureConnection?: boolean;
}

export declare interface CompositeMapper extends BaseMapper {
    type: CompositeMapperType;
}

export declare interface CompositeMapperType {
    name: "Composite";
    className?: string;
    modelProperties?: {
        [propertyName: string]: Mapper;
    };
    additionalProperties?: Mapper;
    uberParent?: string;
    polymorphicDiscriminator?: PolymorphicDiscriminator;
}

/**
 * Creates a new Pipeline for use with a Service Client.
 * Adds in deserializationPolicy by default.
 * Also adds in bearerTokenAuthenticationPolicy if passed a TokenCredential.
 * @param options - Options to customize the created pipeline.
 */
export declare function createClientPipeline(options?: InternalClientPipelineOptions): Pipeline;

/**
 * Method that creates and returns a Serializer.
 * @param modelMappers - Known models to map
 * @param isXML - If XML should be supported
 */
export declare function createSerializer(modelMappers?: {
    [key: string]: any;
}, isXML?: boolean): Serializer;

/**
 * The content-types that will indicate that an operation response should be deserialized in a
 * particular way.
 */
export declare interface DeserializationContentTypes {
    /**
     * The content-types that indicate that an operation response should be deserialized as JSON.
     * Defaults to [ "application/json", "text/json" ].
     */
    json?: string[];
    /**
     * The content-types that indicate that an operation response should be deserialized as XML.
     * Defaults to [ "application/xml", "application/atom+xml" ].
     */
    xml?: string[];
}

/**
 * This policy handles parsing out responses according to OperationSpecs on the request.
 */
export declare function deserializationPolicy(options?: DeserializationPolicyOptions): PipelinePolicy;

/**
 * The programmatic identifier of the deserializationPolicy.
 */
export declare const deserializationPolicyName = "deserializationPolicy";

/**
 * Options to configure API response deserialization.
 */
export declare interface DeserializationPolicyOptions {
    /**
     * Configures the expected content types for the deserialization of
     * JSON and XML response bodies.
     */
    expectedContentTypes?: DeserializationContentTypes;
    /**
     * A function that is able to parse XML. Required for XML support.
     */
    parseXML?: (str: string, opts?: XmlOptions) => Promise<any>;
    /**
     * Configures behavior of xml parser and builder.
     */
    serializerOptions?: SerializerOptions;
}

export declare interface DictionaryMapper extends BaseMapper {
    type: DictionaryMapperType;
    headerCollectionPrefix?: string;
}

export declare interface DictionaryMapperType {
    name: "Dictionary";
    value: Mapper;
}

export declare interface EnumMapper extends BaseMapper {
    type: EnumMapperType;
}

export declare interface EnumMapperType {
    name: "Enum";
    allowedValues: any[];
}

/**
 * Wrapper object for http request and response. Deserialized object is stored in
 * the `parsedBody` property when the response body is received in JSON or XML.
 */
export declare interface FullOperationResponse extends PipelineResponse {
    /**
     * The parsed HTTP response headers.
     */
    parsedHeaders?: {
        [key: string]: unknown;
    };
    /**
     * The response body as parsed JSON or XML.
     */
    parsedBody?: any;
    /**
     * The request that generated the response.
     */
    request: OperationRequest;
}

/**
 * Options for creating a Pipeline to use with ServiceClient.
 * Mostly for customizing the auth policy (if using token auth) or
 * the deserialization options when using XML.
 */
export declare interface InternalClientPipelineOptions extends InternalPipelineOptions {
    /**
     * Options to customize bearerTokenAuthenticationPolicy.
     */
    credentialOptions?: {
        credentialScopes: string | string[];
        credential: TokenCredential;
    };
    /**
     * Options to customize deserializationPolicy.
     */
    deserializationOptions?: DeserializationPolicyOptions;
    /**
     * Options to customize serializationPolicy.
     */
    serializationOptions?: SerializationPolicyOptions;
}

export declare type Mapper = BaseMapper | CompositeMapper | SequenceMapper | DictionaryMapper | EnumMapper;

export declare interface MapperConstraints {
    InclusiveMaximum?: number;
    ExclusiveMaximum?: number;
    InclusiveMinimum?: number;
    ExclusiveMinimum?: number;
    MaxLength?: number;
    MinLength?: number;
    Pattern?: RegExp;
    MaxItems?: number;
    MinItems?: number;
    UniqueItems?: true;
    MultipleOf?: number;
}

export declare type MapperType = SimpleMapperType | CompositeMapperType | SequenceMapperType | DictionaryMapperType | EnumMapperType;

/**
 * Known types of Mappers
 */
export declare const MapperTypeNames: {
    readonly Base64Url: "Base64Url";
    readonly Boolean: "Boolean";
    readonly ByteArray: "ByteArray";
    readonly Composite: "Composite";
    readonly Date: "Date";
    readonly DateTime: "DateTime";
    readonly DateTimeRfc1123: "DateTimeRfc1123";
    readonly Dictionary: "Dictionary";
    readonly Enum: "Enum";
    readonly Number: "Number";
    readonly Object: "Object";
    readonly Sequence: "Sequence";
    readonly String: "String";
    readonly Stream: "Stream";
    readonly TimeSpan: "TimeSpan";
    readonly UnixTime: "UnixTime";
};

/**
 * A collection of properties that apply to a single invocation of an operation.
 */
export declare interface OperationArguments {
    /**
     * The parameters that were passed to the operation method.
     */
    [parameterName: string]: unknown;
    /**
     * The optional arguments that are provided to an operation.
     */
    options?: OperationOptions;
}

/**
 * The base options type for all operations.
 */
export declare interface OperationOptions {
    /**
     * The signal which can be used to abort requests.
     */
    abortSignal?: AbortSignalLike;
    /**
     * Options used when creating and sending HTTP requests for this operation.
     */
    requestOptions?: OperationRequestOptions;
    /**
     * Options used when tracing is enabled.
     */
    tracingOptions?: OperationTracingOptions;
    /**
     * Options to override serialization/de-serialization behavior.
     */
    serializerOptions?: SerializerOptions;
    /**
     * A function to be called each time a response is received from the server
     * while performing the requested operation.
     * May be called multiple times.
     */
    onResponse?: RawResponseCallback;
}

/**
 * A common interface that all Operation parameter's extend.
 */
export declare interface OperationParameter {
    /**
     * The path to this parameter's value in OperationArguments or the object that contains paths for
     * each property's value in OperationArguments.
     */
    parameterPath: ParameterPath;
    /**
     * The mapper that defines how to validate and serialize this parameter's value.
     */
    mapper: Mapper;
}

/**
 * A parameter for an operation that will be added as a query parameter to the operation's HTTP
 * request.
 */
export declare interface OperationQueryParameter extends OperationParameter {
    /**
     * Whether or not to skip encoding the query parameter's value before adding it to the URL.
     */
    skipEncoding?: boolean;
    /**
     * If this query parameter's value is a collection, what type of format should the value be
     * converted to.
     */
    collectionFormat?: QueryCollectionFormat;
}

/**
 * A type alias for future proofing.
 */
export declare type OperationRequest = PipelineRequest;

/**
 * Metadata that is used to properly parse a response.
 */
export declare interface OperationRequestInfo {
    /**
     * Used to parse the response.
     */
    operationSpec?: OperationSpec;
    /**
     * Used to encode the request.
     */
    operationArguments?: OperationArguments;
    /**
     * A function that returns the proper OperationResponseMap for the given OperationSpec and
     * PipelineResponse combination. If this is undefined, then a simple status code lookup will
     * be used.
     */
    operationResponseGetter?: (operationSpec: OperationSpec, response: PipelineResponse) => undefined | OperationResponseMap;
    /**
     * Whether or not the PipelineResponse should be deserialized. Defaults to true.
     */
    shouldDeserialize?: boolean | ((response: PipelineResponse) => boolean);
}

/**
 * Options used when creating and sending HTTP requests for this operation.
 */
export declare interface OperationRequestOptions {
    /**
     * User defined custom request headers that
     * will be applied before the request is sent.
     */
    customHeaders?: {
        [key: string]: string;
    };
    /**
     * The number of milliseconds a request can take before automatically being terminated.
     */
    timeout?: number;
    /**
     * Callback which fires upon upload progress.
     */
    onUploadProgress?: (progress: TransferProgressEvent) => void;
    /**
     * Callback which fires upon download progress.
     */
    onDownloadProgress?: (progress: TransferProgressEvent) => void;
    /**
     * Whether or not the HttpOperationResponse should be deserialized. If this is undefined, then the
     * HttpOperationResponse should be deserialized.
     */
    shouldDeserialize?: boolean | ((response: PipelineResponse) => boolean);
    /**
     * Set to true if the request is sent over HTTP instead of HTTPS
     */
    allowInsecureConnection?: boolean;
}

/**
 * An OperationResponse that can be returned from an operation request for a single status code.
 */
export declare interface OperationResponseMap {
    /**
     * The mapper that will be used to deserialize the response headers.
     */
    headersMapper?: Mapper;
    /**
     * The mapper that will be used to deserialize the response body.
     */
    bodyMapper?: Mapper;
    /**
     * Indicates if this is an error response
     */
    isError?: boolean;
}

/**
 * A specification that defines an operation.
 */
export declare interface OperationSpec {
    /**
     * The serializer to use in this operation.
     */
    readonly serializer: Serializer;
    /**
     * The HTTP method that should be used by requests for this operation.
     */
    readonly httpMethod: HttpMethods;
    /**
     * The URL that was provided in the service's specification. This will still have all of the URL
     * template variables in it. If this is not provided when the OperationSpec is created, then it
     * will be populated by a "baseUri" property on the ServiceClient.
     */
    readonly baseUrl?: string;
    /**
     * The fixed path for this operation's URL. This will still have all of the URL template variables
     * in it.
     */
    readonly path?: string;
    /**
     * The content type of the request body. This value will be used as the "Content-Type" header if
     * it is provided.
     */
    readonly contentType?: string;
    /**
     * The media type of the request body.
     * This value can be used to aide in serialization if it is provided.
     */
    readonly mediaType?: "json" | "xml" | "form" | "binary" | "multipart" | "text" | "unknown" | string;
    /**
     * The parameter that will be used to construct the HTTP request's body.
     */
    readonly requestBody?: OperationParameter;
    /**
     * Whether or not this operation uses XML request and response bodies.
     */
    readonly isXML?: boolean;
    /**
     * The parameters to the operation method that will be substituted into the constructed URL.
     */
    readonly urlParameters?: ReadonlyArray<OperationURLParameter>;
    /**
     * The parameters to the operation method that will be added to the constructed URL's query.
     */
    readonly queryParameters?: ReadonlyArray<OperationQueryParameter>;
    /**
     * The parameters to the operation method that will be converted to headers on the operation's
     * HTTP request.
     */
    readonly headerParameters?: ReadonlyArray<OperationParameter>;
    /**
     * The parameters to the operation method that will be used to create a formdata body for the
     * operation's HTTP request.
     */
    readonly formDataParameters?: ReadonlyArray<OperationParameter>;
    /**
     * The different types of responses that this operation can return based on what status code is
     * returned.
     */
    readonly responses: {
        [responseCode: string]: OperationResponseMap;
    };
}

/**
 * A parameter for an operation that will be substituted into the operation's request URL.
 */
export declare interface OperationURLParameter extends OperationParameter {
    /**
     * Whether or not to skip encoding the URL parameter's value before adding it to the URL.
     */
    skipEncoding?: boolean;
}

/**
 * Encodes how to reach a particular property on an object.
 */
export declare type ParameterPath = string | string[] | {
    [propertyName: string]: ParameterPath;
};

export declare interface PolymorphicDiscriminator {
    serializedName: string;
    clientName: string;
    [key: string]: string;
}

/**
 * The format that will be used to join an array of values together for a query parameter value.
 */
export declare type QueryCollectionFormat = "CSV" | "SSV" | "TSV" | "Pipes" | "Multi";

/**
 * A function to be called each time a response is received from the server
 * while performing the requested operation.
 * May be called multiple times.
 */
export declare type RawResponseCallback = (rawResponse: FullOperationResponse, flatResponse: unknown) => void;

export declare interface SequenceMapper extends BaseMapper {
    type: SequenceMapperType;
}

export declare interface SequenceMapperType {
    name: "Sequence";
    element: Mapper;
}

/**
 * This policy handles assembling the request body and headers using
 * an OperationSpec and OperationArguments on the request.
 */
export declare function serializationPolicy(options?: SerializationPolicyOptions): PipelinePolicy;

/**
 * The programmatic identifier of the serializationPolicy.
 */
export declare const serializationPolicyName = "serializationPolicy";

/**
 * Options to configure API request serialization.
 */
export declare interface SerializationPolicyOptions {
    /**
     * A function that is able to write XML. Required for XML support.
     */
    stringifyXML?: (obj: any, opts?: XmlOptions) => string;
    /**
     * Configures behavior of xml parser and builder.
     */
    serializerOptions?: SerializerOptions;
}

/**
 * Used to map raw response objects to final shapes.
 * Mostly useful for unpacking/packing Dates and other encoded types that
 * are not intrinsic to JSON.
 */
export declare interface Serializer {
    readonly modelMappers: {
        [key: string]: any;
    };
    readonly isXML: boolean;
    validateConstraints(mapper: Mapper, value: any, objectName: string): void;
    serialize(mapper: Mapper, object: any, objectName?: string, options?: SerializerOptions): any;
    deserialize(mapper: Mapper, responseBody: any, objectName: string, options?: SerializerOptions): any;
}

/**
 * Options to configure serialization/de-serialization behavior.
 */
export declare interface SerializerOptions {
    /**
     * Options to configure xml parser/builder behavior.
     */
    xml: XmlOptions;
}

/**
 * Initializes a new instance of the ServiceClient.
 */
export declare class ServiceClient {
    /**
     * If specified, this is the base URI that requests will be made against for this ServiceClient.
     * If it is not specified, then all OperationSpecs must contain a baseUrl property.
     */
    private readonly _baseUri?;
    /**
     * The default request content type for the service.
     * Used if no requestContentType is present on an OperationSpec.
     */
    private readonly _requestContentType?;
    /**
     * Set to true if the request is sent over HTTP instead of HTTPS
     */
    private readonly _allowInsecureConnection?;
    /**
     * The HTTP client that will be used to send requests.
     */
    private readonly _httpClient;
    /**
     * The pipeline used by this client to make requests
     */
    readonly pipeline: Pipeline;
    /**
     * The ServiceClient constructor
     * @param credential - The credentials used for authentication with the service.
     * @param options - The service client options that govern the behavior of the client.
     */
    constructor(options?: ServiceClientOptions);
    /**
     * Send the provided httpRequest.
     */
    sendRequest(request: PipelineRequest): Promise<PipelineResponse>;
    /**
     * Send an HTTP request that is populated using the provided OperationSpec.
     * @typeParam T - The typed result of the request, based on the OperationSpec.
     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
     */
    sendOperationRequest<T>(operationArguments: OperationArguments, operationSpec: OperationSpec): Promise<T>;
}

/**
 * Options to be provided while creating the client.
 */
export declare interface ServiceClientOptions extends CommonClientOptions {
    /**
     * If specified, this is the base URI that requests will be made against for this ServiceClient.
     * If it is not specified, then all OperationSpecs must contain a baseUrl property.
     */
    baseUri?: string;
    /**
     * If specified, will be used to build the BearerTokenAuthenticationPolicy.
     */
    credentialScopes?: string | string[];
    /**
     * The default request content type for the service.
     * Used if no requestContentType is present on an OperationSpec.
     */
    requestContentType?: string;
    /**
     * Credential used to authenticate the request.
     */
    credential?: TokenCredential;
    /**
     * A customized pipeline to use, otherwise a default one will be created.
     */
    pipeline?: Pipeline;
}

export declare interface SimpleMapperType {
    name: "Base64Url" | "Boolean" | "ByteArray" | "Date" | "DateTime" | "DateTimeRfc1123" | "Object" | "Stream" | "String" | "TimeSpan" | "UnixTime" | "Uuid" | "Number" | "any";
}

/**
 * Configuration for creating a new Tracing Span
 */
export declare interface SpanConfig {
    /**
     * Package name prefix
     */
    packagePrefix: string;
    /**
     * Service namespace
     */
    namespace: string;
}

/**
 * Default key used to access the XML attributes.
 */
export declare const XML_ATTRKEY = "$";

/**
 * Default key used to access the XML value content.
 */
export declare const XML_CHARKEY = "_";

/**
 * Options to govern behavior of xml parser and builder.
 */
export declare interface XmlOptions {
    /**
     * indicates the name of the root element in the resulting XML when building XML.
     */
    rootName?: string;
    /**
     * indicates whether the root element is to be included or not in the output when parsing XML.
     */
    includeRoot?: boolean;
    /**
     * key used to access the XML value content when parsing XML.
     */
    xmlCharKey?: string;
}

export { }
