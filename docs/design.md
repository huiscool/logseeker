## 设计方案

## 

UI (展示、命令)

model 层 -- 文件操作、集合增删改查

logset、 logsource(单个日志文件)、 logEntry 日志条目

logset 持久化

## 生命周期

logset负责管控 logSource的生命周期，通过addLogSource和delLogSource方法来管理。

## 合并多个文件的写入

数据流向：外部系统 -> 日志文件 -> logset -> ui

因此，是打开的日志文件（logSource)向logSet并发写入（或者说传递）新的logEntry。

在接口设计上，应该由logSource调用logSet的方法来写入（异步），而不是logSet调用logSource方法（轮询）。

logSet需要提供一个写入Entry的方法(WriteLogEntry)，并在创建logSource时传入；

logSource打开文件后，监听文件的写入；当文件写入时，调用WriteLogEntry.

## UI 观察者模式

用户点击 -> UI 调用 model的方法 -> model 变化 -> emit 事件 —> UI收到事件 -> 调用UI方法 -> UI 变化

~ 1. model里面写死UI事件处理函数；~

2. model提供一个注册函数Register(callback)，UI注册自己的处理方法（回调） 

## VSCode 相关

[文件系统](https://code.visualstudio.com/api/references/vscode-api#FileSystemProvider)

## 学习要点

[] javascript 基本语法
    [] 错误处理
    [] 回调的写法
    [] Promise
[] typescript 基本类型定义、函数定义
[] nodejs中的文件操作

