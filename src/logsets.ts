import * as vscode from "vscode";
import { basename } from "path";


export type TreeNode = LogSet | LogSource;

export class LogSetsExplorer implements vscode.TreeDataProvider<TreeNode>, vscode.TextDocumentContentProvider {
    private onDidChangeTreeDataEmitter = new vscode.EventEmitter<TreeNode | null>();
    private onDidChangeDocDataEmitter = new vscode.EventEmitter<vscode.Uri>();
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
        return element !== undefined ? element.getChildren() : this.model.logSets;
    }

    getParent(element: TreeNode): vscode.ProviderResult<TreeNode> {
        return element.parent;
    }

    getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        throw new Error("not implemented");
    }

}

export class LogSetsModel {
    logSets: LogSet[] = [];
    explorer?: LogSetsExplorer;

    bindExplorer(explorer: LogSetsExplorer) {
        this.explorer = explorer;
    }

    loadFrom(uri: vscode.Uri) {

    }

    // commands
    addEmptyLogSet(name: string) {
        if (this.logSets.map((val) => val.name).includes(name)) {
            throw new Error(`cannot create log set with same name "${name}"`);
        }
        this.logSets.push(new LogSet(name, this));
    }

    delLogSet(name: string) {
        this.logSets = this.logSets.filter((val) => { val.name !== name; });
    }

}

export class LogSet extends vscode.TreeItem {
    private srcs: LogSource[] = [];
    readonly parent: null = null; // logSet is child of the tree view root, so set parent to undefined

    constructor(
        public name: string,
        readonly model: LogSetsModel,
    ) {
        super(
            name,
            vscode.TreeItemCollapsibleState.Expanded,
        );
        this.contextValue = "logset";
    }

    // ui
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        throw new Error("not implemented");
    }

    getChildren(): LogSource[] {
        return this.srcs;
    }

    // helpers
    addLogSource(src: LogSource) {
        if (this.srcs.map((val) => val.uri.toString()).includes(src.uri.toString())) {
            throw new Error(`cannot create log set with same uri "${src.uri.toString()}"`);
        }
        this.srcs.push(src);
        if (src.onEntryArrived) {
            src.onEntryArrived(() => { throw new Error("not implemented"); });
        }
    }
    delLogSource(src: LogSource) {
        this.srcs = this.srcs.filter((val) => val !== src);
    }

    addDoc() {

    }
    delDoc() {

    }

    // commands
    // open a log source.
    openLogSource(uri: vscode.Uri) {
        let src = new LogSource(uri, this);
        src.open();
        this.addLogSource(src);
    }

    // open a virtual doc.
    openDoc() {

    }
    // delete itself from logSetsModel.
    dispose(): void { }

}

export class LogSource extends vscode.TreeItem {
    private onEntryArrivedEmitter = new vscode.EventEmitter<LogEntry[]>();
    onEntryArrived?: vscode.Event<LogEntry[]> = this.onEntryArrivedEmitter.event;
    readonly model: LogSetsModel;

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

    // open file 
    open(): void {
        throw new Error("not implemented");
    }

    close(): void {
        throw new Error("not implemented");
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
