/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
// This file will be loaded before the other scripts in the renderer process.
// It will expose the functions from the pre-loaders to the window object.

const { contextBridge } = require("electron");
const filePreloader = require("./file.preloader.cjs");
const mongodbPreloader = require("./databases/mongo.preloader.cjs");

contextBridge.exposeInMainWorld("uploadFile", filePreloader.uploadFile);

contextBridge.exposeInMainWorld("removeFile", filePreloader.removeFile);

contextBridge.exposeInMainWorld("mongo", mongodbPreloader);

console.log("preload.js loaded");
