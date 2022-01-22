import * as vscode from "vscode";
import { basename } from "path";
import { logSetSchema } from "./extension";
import {statSync,createReadStream } from "fs";
import * as rd from "readline";



export type TreeNode = LogSet | LogSource;

export class LogSetsExplorer implements vscode.TreeDataProvider<TreeNode>, vscode.TextDocumentContentProvider {
    readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<TreeNode | null>();
    readonly onDidChangeDocDataEmitter = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event; //定义事件；
    readonly onDidChange = this.onDidChangeDocDataEmitter.event;

    constructor(
        private model: LogSetsModel,
    ) {
        model.bindExplorer(this);
    }

    refresh() {
        this.onDidChangeTreeDataEmitter.fire(null); //发布事件；
    }

    getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
        return element !== undefined ? element.getChildren() : Array.from(this.model.logSets.values());
    }

    getParent(element: TreeNode): vscode.ProviderResult<TreeNode> {
        return element.parent;
    }

    getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let logset = this.model.logSets.get(uri.path);
        if (!logset) {throw new Error(`cannot open uri ${uri.toString()}`);}
        return logset.content();
    }

}

export class LogSetsModel {
    public logSets: Map<string, LogSet> = new Map<string, LogSet>();
    explorer?: LogSetsExplorer;

    bindExplorer(explorer: LogSetsExplorer) {
        this.explorer = explorer;
    }

    // commands
    addEmptyLogSet(name: string) {
        if (this.logSets.get(name)) {
            throw new Error(`cannot create log set with same name "${name}"`);
        }
        this.logSets.set(name, new LogSet(name, this));
    }

    delLogSet(name: string) {
        this.logSets.delete(name);
    }

}

export class LogSet extends vscode.TreeItem {
    private srcs: Map<string, LogSource> = new Map<string, LogSource>();
    readonly parent: null = null; // logSet is child of the tree view root, so set parent to undefined or null;
    explorer?: LogSetsExplorer;
    private content_: string = "";

    constructor(
        public name: string,
        readonly model: LogSetsModel,
    ) {
        super(
            name,
            vscode.TreeItemCollapsibleState.Expanded,
        );
        this.contextValue = "logset";
        this.explorer = model.explorer;
    }

    getChildren(): LogSource[] {
        return Array.from(this.srcs.values());
    }

    // helpers
    addLogSource(src: LogSource) {
        if (this.srcs.get(src.uri.toString())) {
            throw new Error(`cannot create log set with same uri "${src.uri.toString()}"`);
        }
        this.srcs.set(src.uri.toString(), src);
        if (src.onEntryArrived) {
            src.onEntryArrived(this.onEntryArrived, this);
        }
    }
    delLogSource(src: LogSource) {
        this.srcs.delete(src.uri.toString());
    }

    get uri(): vscode.Uri {
        return vscode.Uri.parse(logSetSchema+":"+this.name);
    }

    // 返回文本内容
    content(): vscode.ProviderResult<string> {
        return this.content_;
    }

    // onEntryArrived 处理函数
    // 向文本发送消息
    onEntryArrived(entries: LogEntry[]) {
        this.content_ = this.content_.concat(...entries.map(e=> e.raw ? e.raw : "\n"));
        this.explorer?.onDidChangeDocDataEmitter.fire(this.uri);
    }

    // commands
    // open a log source.
    openLogSource(uri: vscode.Uri) {
        let src = new LogSource(uri, this);
        src.open();
        this.addLogSource(src);
    }

    // open a virtual doc.
    async openDoc(): Promise<void> {
        let doc = await vscode.workspace.openTextDocument(this.uri);
        await vscode.window.showTextDocument(doc, { preview: false });
    }

    // delete itself from logSetsModel.
    dispose(): void { }

}

export class LogSource extends vscode.TreeItem {
    private onEntryArrivedEmitter = new vscode.EventEmitter<LogEntry[]>();
    onEntryArrived?: vscode.Event<LogEntry[]> = this.onEntryArrivedEmitter.event;
    readonly model: LogSetsModel;
    private rdIntf? : rd.Interface;

    constructor(
        public uri: vscode.Uri,
        public parent: LogSet,
    ) {
        super(
            basename(uri.path),
            vscode.TreeItemCollapsibleState.None,
        );
        this.contextValue = "logsource";
        this.model = this.parent.model;
    }

    // ui
    // treeViews: logSource is a leaf treenode, so getChildren should return null.
    getChildren() { return null; }
    
    // open file and listen for the appending lines.
    open(): void {
        console.log("path:",this.uri.path);
        let fileLength = statSync(this.uri.path)['size'];
        let stream = createReadStream(this.uri.path, {
            start: fileLength,
        });
        this.rdIntf = rd.createInterface(stream);
        console.log("stream created");
        this.rdIntf.on('line', this.onLineArrived);
    }

    onLineArrived(line: string) {
        console.log("onLine arrived", line);
        this.onEntryArrivedEmitter.fire([{raw: line}]);
    }

    close(): void {
        this.rdIntf?.close();
    }

    // commands
    // delete itself from logSet.
    dispose(): void {

    }
}

export interface LogEntry {
    level?: string;
    arrivedTime?: Date;
    eventTime?: Date;
    message?: string;
    raw?: string;
}

