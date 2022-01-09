import * as vscode from "vscode";
import {basename  } from "path";


export type TreeNode = LogSet | LogSource;

export class LogSetExplorer implements vscode.TreeDataProvider<TreeNode> {
    private emiter = new vscode.EventEmitter<TreeNode | null>();
    readonly onDidChangeTreeData = this.emiter.event;
    constructor(
        private model: LogSetsModel,
    ) {
        model.bindRefresh(this.refresh);
    }

    refresh() {
        this.emiter.fire(null);
    }

    getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
        return element!==undefined ? element.getChildren() : this.model.logSets;
    }

    getParent(element: TreeNode): vscode.ProviderResult<TreeNode> {
        return element.parent;
    }

    getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

}

export class LogSetsModel {
    logSets: LogSet[] = [];
    refresh?: ()=>void = ()=>{};

    bindRefresh(refresh: ()=>void) {
        this.refresh = refresh;
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

}

export class LogSet extends vscode.TreeItem implements vscode.TextDocumentContentProvider  {
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
        if (this.srcs.map((val)=>val.uri.toString()).includes(src.uri.toString())) {
            throw new Error(`cannot create log set with same uri "${src.uri.toString()}"`);
        }
        this.srcs.push(src);
    }

    delLogSource(src: LogSource) {
        this.srcs = this.srcs.filter((val)=>val!==src);
    }

    // commands
    // open a log source.
    openLogSource(uri: vscode.Uri) {
        let src = new LogSource(uri, this);
        src.open();
        this.addLogSource(src);
    }
    // delete itself from logSetsModel.
    dispose(): void { }

}

export class LogSource extends vscode.TreeItem {
    // 
    onEntryArrived?: vscode.Event<LogEntry[]>;
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
    

    open(): void {

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
