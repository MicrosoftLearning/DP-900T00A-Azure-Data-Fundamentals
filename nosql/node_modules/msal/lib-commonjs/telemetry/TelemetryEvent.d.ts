export default class TelemetryEvent {
    private startTimestamp;
    protected event: any;
    eventId: string;
    private label;
    constructor(eventName: string, correlationId: string, eventLabel: string);
    private setElapsedTime;
    stop(): void;
    start(): void;
    telemetryCorrelationId: string;
    readonly eventName: string;
    get(): object;
    readonly key: string;
    readonly displayName: string;
    private readonly perfStartMark;
    private readonly perfEndMark;
}
