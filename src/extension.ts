// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let ctx: MyContext|null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	ctx = new MyContext(context);
	ctx?.activate();
}

// this method is called when your extension is deactivated
export function deactivate() {
	ctx?.deactivate();
 }

class MyContext {
	context: vscode.ExtensionContext;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	initModel() {
		throw new Error("not implemented");
	}

	initView() {
		throw new Error("not implemented");
	}

	activate() {
		throw new Error("not implemented");
	}

	deactivate() {
		throw new Error("not implemented");
	}
}