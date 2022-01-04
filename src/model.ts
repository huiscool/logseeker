import { PathLike } from "fs";

export interface LogEntry {
    level: string | null | undefined;
    timestamp: number | null | undefined;
    raw(): string;
}

export type LogSourceID = string;

export type WriteEntryFunc = (entries: LogEntry[])=>void;

export interface LogSource {
    id: LogSourceID; //在logset唯一标识一个LogSource.
    activate(wf: WriteEntryFunc): void;
    deactivate(): void;
}



