// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TreeNode, LogSetsExplorer, LogSetsModel, LogSet, LogSource } from './logsets';


export const logSetSchema: string = "logset";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let model = new LogSetsModel();
	let explorer = new LogSetsExplorer(model);
	let disposables = [];
	// 注册视图
	disposables.push(vscode.window.registerTreeDataProvider("logsets", explorer));
	// 注册协议
	disposables.push(vscode.workspace.registerTextDocumentContentProvider(logSetSchema, explorer));
	// 命令
	disposables.push(vscode.commands.registerCommand("logsets.refresh",
		explorer.refresh, explorer,
	));
	disposables.push(vscode.commands.registerCommand("logsets.add-logset",
		async () => {
			let val = await vscode.window.showInputBox();
			if (val) {
				model.addEmptyLogSet(val);
				explorer.refresh();
			}
		}));
	disposables.push(vscode.commands.registerCommand("logset.del-logset",
		(node: LogSet) => {
			node.dispose();
		}));
	disposables.push(vscode.commands.registerCommand("logset.open-doc",
		async (node: LogSet) => {
			node.openDoc();
		}));
	disposables.push(vscode.commands.registerCommand("logset.add-logsource",
		async (node: LogSet) => {
			let uris = await vscode.window.showOpenDialog({
				canSelectMany: false,
				canSelectFolders: false,
				canSelectFiles: true,
			});
			if (uris) {
				node.openLogSource(uris[0]);
				explorer.refresh();
			}
		}));
	disposables.push(vscode.commands.registerCommand("logsource.del-logsource", (node: LogSource) => {
		// debug
	}));

	context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() { }