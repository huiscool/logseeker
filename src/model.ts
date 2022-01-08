import {PathLike} from "fs";

export interface LogEntry {
    level: string | null | undefined;
    timestamp: number | null | undefined;
}

export type LogSourceID = string;

export interface LogSource {
    id: LogSourceID; //在logset唯一标识一个LogSource.
    name: string;
}

export interface LogSet {
    name: string;
    logSources: LogSource[]

    createAndAddLogSource(path: PathLike): LogSourceID

    addLogSource(src: LogSource): LogSourceID

    delLogSource(srcid: LogSourceID):void

    writeEntry(e: LogEntry): void
}

export interface LogSets {
    logsets: LogSet[];

    addLogSet(name: string): void

    delLogSet(name: string): void

    
}