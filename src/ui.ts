


import { PathLike } from "fs";
import { LogSet } from "./logset";
import * as model from './model';

export class LogSetDoc {
    // docID: string;
}

// views 




// commands

function createLogSet(name: string) {

}

function deleteLogSet(name: string) {

}

// 打开LogSet的一个虚拟文档，展示所有日志文件新append的日志条目
function openLogSet(setName: string): LogSetDoc {
    throw new Error("");
}

// 关闭虚拟文档
function closeLogSet(docID: string) {
}


function addLogSourceInLogSet(setName: string, path: PathLike) {

}

function deleteLogSourceInLogSet(setName: string, srcID: model.LogSourceID) {

}

