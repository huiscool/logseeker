


import { PathLike } from "fs";
import * as model from './model';


// views 

export class LogSetsView {
    setViews: LogSetView[];
    sets: model.LogSets;
    constructor(sets: model.LogSets) {
        this.sets = sets;
        throw new Error("not implemented");
    }
}

export class LogSetView {
    srcs: LogSourceView[];
    constructor(set: model.LogSet) {
       throw new Error("not implemented");
    }
}

export class LogSourceView {
    constructor(src: model.LogSource) {
        throw new Error("not implemented");
    }
}

// 文档
export class LogSetDocView {
    // docID: string;
}

