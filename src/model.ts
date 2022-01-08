import {PathLike} from "fs";

export interface LogEntry {
    level: string | null | undefined;
    timestamp: number | null | undefined;
    raw(): string;
}

export type LogSourceID = string;

export type WriteEntryFunc = (entries: LogEntry[])=>void;

export type EventHandler = (evt: Event)=>void;

export interface Event {
    emitter: any;
    data: any;
}

export interface LogSource extends ModelObject {
    id: LogSourceID; //在logset唯一标识一个LogSource.
    activate(wf: WriteEntryFunc): void;
    deactivate(): void;
}

export interface LogSet extends ModelObject {
    name: string;
    createAndAddLogSource(path: PathLike): LogSourceID

    addLogSource(src: LogSource): LogSourceID

    delLogSource(srcid: LogSourceID):void
    
    listLogSources(): LogSource[]

    writeEntry(e: LogEntry): void
}

export interface LogSets extends ModelObject {
    logsets: LogSet[];
}

export interface ModelObject {
    register(handler: EventHandler): void
}


