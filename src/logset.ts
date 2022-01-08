import * as model from './model';
import * as event from './event';
import { PathLike } from 'fs';

export class LogSet implements model.ModelObject {
    name: string; //用户定义的LogSet名字
    srcs: Map<model.LogSourceID, model.LogSource>;

    constructor(name: string) {
        this.name = name;
        this.srcs = new Map<string, model.LogSource>(null);
    }

    createAndAddLogSource(path: PathLike): model.LogSourceID {
        throw new Error("not implemented");
    }

    addLogSource(src: model.LogSource): model.LogSourceID {
        throw new Error("not implemented");
    }

    delLogSource(srcid: model.LogSourceID) {
        throw new Error("not implemented");
    }
    
    listLogSources(): model.LogSource[] {
        throw new Error("not implemented");
    }

    writeEntry(e: model.LogEntry): void {
        throw new Error("not implemented");
    }
}

// 单例，全局唯一
export class LogSets {
    // TODO
    logsets: LogSet[];
    constructor() {
        throw new Error("not implemented");
    }

    register(h: event.EventHandler) {
        throw new Error("not implemented");
    }
}