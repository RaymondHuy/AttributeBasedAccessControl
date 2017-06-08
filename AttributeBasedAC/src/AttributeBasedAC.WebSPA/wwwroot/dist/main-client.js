/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7973c09f7ea30093eb75"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(16);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
	/*global __resourceQuery __webpack_public_path__*/
	
	var options = {
	  path: "/__webpack_hmr",
	  timeout: 20 * 1000,
	  overlay: true,
	  reload: false,
	  log: true,
	  warn: true,
	  name: ''
	};
	if (true) {
	  var querystring = __webpack_require__(4);
	  var overrides = querystring.parse(__resourceQuery.slice(1));
	  if (overrides.path) options.path = overrides.path;
	  if (overrides.timeout) options.timeout = overrides.timeout;
	  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
	  if (overrides.reload) options.reload = overrides.reload !== 'false';
	  if (overrides.noInfo && overrides.noInfo !== 'false') {
	    options.log = false;
	  }
	  if (overrides.name) {
	    options.name = overrides.name;
	  }
	  if (overrides.quiet && overrides.quiet !== 'false') {
	    options.log = false;
	    options.warn = false;
	  }
	  if (overrides.dynamicPublicPath) {
	    options.path = __webpack_require__.p + options.path;
	  }
	}
	
	if (typeof window === 'undefined') {
	  // do nothing
	} else if (typeof window.EventSource === 'undefined') {
	  console.warn(
	    "webpack-hot-middleware's client requires EventSource to work. " +
	    "You should include a polyfill if you want to support this browser: " +
	    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
	  );
	} else {
	  connect();
	}
	
	function EventSourceWrapper() {
	  var source;
	  var lastActivity = new Date();
	  var listeners = [];
	
	  init();
	  var timer = setInterval(function() {
	    if ((new Date() - lastActivity) > options.timeout) {
	      handleDisconnect();
	    }
	  }, options.timeout / 2);
	
	  function init() {
	    source = new window.EventSource(options.path);
	    source.onopen = handleOnline;
	    source.onerror = handleDisconnect;
	    source.onmessage = handleMessage;
	  }
	
	  function handleOnline() {
	    if (options.log) console.log("[HMR] connected");
	    lastActivity = new Date();
	  }
	
	  function handleMessage(event) {
	    lastActivity = new Date();
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i](event);
	    }
	  }
	
	  function handleDisconnect() {
	    clearInterval(timer);
	    source.close();
	    setTimeout(init, options.timeout);
	  }
	
	  return {
	    addMessageListener: function(fn) {
	      listeners.push(fn);
	    }
	  };
	}
	
	function getEventSourceWrapper() {
	  if (!window.__whmEventSourceWrapper) {
	    window.__whmEventSourceWrapper = {};
	  }
	  if (!window.__whmEventSourceWrapper[options.path]) {
	    // cache the wrapper for other entries loaded on
	    // the same page with the same options.path
	    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
	  }
	  return window.__whmEventSourceWrapper[options.path];
	}
	
	function connect() {
	  getEventSourceWrapper().addMessageListener(handleMessage);
	
	  function handleMessage(event) {
	    if (event.data == "\uD83D\uDC93") {
	      return;
	    }
	    try {
	      processMessage(JSON.parse(event.data));
	    } catch (ex) {
	      if (options.warn) {
	        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
	      }
	    }
	  }
	}
	
	// the reporter needs to be a singleton on the page
	// in case the client is being used by multiple bundles
	// we only want to report once.
	// all the errors will go to all clients
	var singletonKey = '__webpack_hot_middleware_reporter__';
	var reporter;
	if (typeof window !== 'undefined') {
	  if (!window[singletonKey]) {
	    window[singletonKey] = createReporter();
	  }
	  reporter = window[singletonKey];
	}
	
	function createReporter() {
	  var strip = __webpack_require__(7);
	
	  var overlay;
	  if (typeof document !== 'undefined' && options.overlay) {
	    overlay = __webpack_require__(9);
	  }
	
	  var styles = {
	    errors: "color: #ff0000;",
	    warnings: "color: #999933;"
	  };
	  var previousProblems = null;
	  function log(type, obj) {
	    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
	    if (previousProblems == newProblems) {
	      return;
	    } else {
	      previousProblems = newProblems;
	    }
	
	    var style = styles[type];
	    var name = obj.name ? "'" + obj.name + "' " : "";
	    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
	    // NOTE: console.warn or console.error will print the stack trace
	    // which isn't helpful here, so using console.log to escape it.
	    if (console.group && console.groupEnd) {
	      console.group("%c" + title, style);
	      console.log("%c" + newProblems, style);
	      console.groupEnd();
	    } else {
	      console.log(
	        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
	        style + "font-weight: bold;",
	        style + "font-weight: normal;"
	      );
	    }
	  }
	
	  return {
	    cleanProblemsCache: function () {
	      previousProblems = null;
	    },
	    problems: function(type, obj) {
	      if (options.warn) {
	        log(type, obj);
	      }
	      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
	    },
	    success: function() {
	      if (overlay) overlay.clear();
	    },
	    useCustomOverlay: function(customOverlay) {
	      overlay = customOverlay;
	    }
	  };
	}
	
	var processUpdate = __webpack_require__(15);
	
	var customHandler;
	var subscribeAllHandler;
	function processMessage(obj) {
	  switch(obj.action) {
	    case "building":
	      if (options.log) {
	        console.log(
	          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
	          "rebuilding"
	        );
	      }
	      break;
	    case "built":
	      if (options.log) {
	        console.log(
	          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
	          "rebuilt in " + obj.time + "ms"
	        );
	      }
	      // fall through
	    case "sync":
	      if (obj.name && options.name && obj.name !== options.name) {
	        return;
	      }
	      if (obj.errors.length > 0) {
	        if (reporter) reporter.problems('errors', obj);
	      } else {
	        if (reporter) {
	          if (obj.warnings.length > 0) {
	            reporter.problems('warnings', obj);
	          } else {
	            reporter.cleanProblemsCache();
	          }
	          reporter.success();
	        }
	        processUpdate(obj.hash, obj.modules, options);
	      }
	      break;
	    default:
	      if (customHandler) {
	        customHandler(obj);
	      }
	  }
	
	  if (subscribeAllHandler) {
	    subscribeAllHandler(obj);
	  }
	}
	
	if (module) {
	  module.exports = {
	    subscribeAll: function subscribeAll(handler) {
	      subscribeAllHandler = handler;
	    },
	    subscribe: function subscribe(handler) {
	      customHandler = handler;
	    },
	    useCustomOverlay: function useCustomOverlay(customOverlay) {
	      if (reporter) reporter.useCustomOverlay(customOverlay);
	    }
	  };
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?path=http%3A%2F%2Flocalhost%3A7965%2F__webpack_hmr", __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(236);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = vendor_065aa8bd3f33e516eb8b;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(5);
	exports.encode = exports.stringify = __webpack_require__(6);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(8)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/*eslint-env browser*/
	
	var clientOverlay = document.createElement('div');
	clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
	var styles = {
	  background: 'rgba(0,0,0,0.85)',
	  color: '#E8E8E8',
	  lineHeight: '1.2',
	  whiteSpace: 'pre',
	  fontFamily: 'Menlo, Consolas, monospace',
	  fontSize: '13px',
	  position: 'fixed',
	  zIndex: 9999,
	  padding: '10px',
	  left: 0,
	  right: 0,
	  top: 0,
	  bottom: 0,
	  overflow: 'auto',
	  dir: 'ltr',
	  textAlign: 'left'
	};
	for (var key in styles) {
	  clientOverlay.style[key] = styles[key];
	}
	
	var ansiHTML = __webpack_require__(10);
	var colors = {
	  reset: ['transparent', 'transparent'],
	  black: '181818',
	  red: 'E36049',
	  green: 'B3CB74',
	  yellow: 'FFD080',
	  blue: '7CAFC2',
	  magenta: '7FACCA',
	  cyan: 'C3C2EF',
	  lightgrey: 'EBE7E3',
	  darkgrey: '6D7891'
	};
	ansiHTML.setColors(colors);
	
	var Entities = __webpack_require__(11).AllHtmlEntities;
	var entities = new Entities();
	
	exports.showProblems =
	function showProblems(type, lines) {
	  clientOverlay.innerHTML = '';
	  lines.forEach(function(msg) {
	    msg = ansiHTML(entities.encode(msg));
	    var div = document.createElement('div');
	    div.style.marginBottom = '26px';
	    div.innerHTML = problemType(type) + ' in ' + msg;
	    clientOverlay.appendChild(div);
	  });
	  if (document.body) {
	    document.body.appendChild(clientOverlay);
	  }
	};
	
	exports.clear =
	function clear() {
	  if (document.body && clientOverlay.parentNode) {
	    document.body.removeChild(clientOverlay);
	  }
	};
	
	var problemColors = {
	  errors: colors.red,
	  warnings: colors.yellow
	};
	
	function problemType (type) {
	  var color = problemColors[type] || colors.red;
	  return (
	    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
	      type.slice(0, -1).toUpperCase() +
	    '</span>'
	  );
	}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict'
	
	module.exports = ansiHTML
	
	// Reference to https://github.com/sindresorhus/ansi-regex
	var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/
	
	var _defColors = {
	  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
	  black: '000',
	  red: 'ff0000',
	  green: '209805',
	  yellow: 'e8bf03',
	  blue: '0000ff',
	  magenta: 'ff00ff',
	  cyan: '00ffee',
	  lightgrey: 'f0f0f0',
	  darkgrey: '888'
	}
	var _styles = {
	  30: 'black',
	  31: 'red',
	  32: 'green',
	  33: 'yellow',
	  34: 'blue',
	  35: 'magenta',
	  36: 'cyan',
	  37: 'lightgrey'
	}
	var _openTags = {
	  '1': 'font-weight:bold', // bold
	  '2': 'opacity:0.5', // dim
	  '3': '<i>', // italic
	  '4': '<u>', // underscore
	  '8': 'display:none', // hidden
	  '9': '<del>' // delete
	}
	var _closeTags = {
	  '23': '</i>', // reset italic
	  '24': '</u>', // reset underscore
	  '29': '</del>' // reset delete
	}
	
	;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
	  _closeTags[n] = '</span>'
	})
	
	/**
	 * Converts text with ANSI color codes to HTML markup.
	 * @param {String} text
	 * @returns {*}
	 */
	function ansiHTML (text) {
	  // Returns the text if the string has no ANSI escape code.
	  if (!_regANSI.test(text)) {
	    return text
	  }
	
	  // Cache opened sequence.
	  var ansiCodes = []
	  // Replace with markup.
	  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
	    var ot = _openTags[seq]
	    if (ot) {
	      // If current sequence has been opened, close it.
	      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
	        ansiCodes.pop()
	        return '</span>'
	      }
	      // Open tag.
	      ansiCodes.push(seq)
	      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
	    }
	
	    var ct = _closeTags[seq]
	    if (ct) {
	      // Pop sequence
	      ansiCodes.pop()
	      return ct
	    }
	    return ''
	  })
	
	  // Make sure tags are closed.
	  var l = ansiCodes.length
	  ;(l > 0) && (ret += Array(l + 1).join('</span>'))
	
	  return ret
	}
	
	/**
	 * Customize colors.
	 * @param {Object} colors reference to _defColors
	 */
	ansiHTML.setColors = function (colors) {
	  if (typeof colors !== 'object') {
	    throw new Error('`colors` parameter must be an Object.')
	  }
	
	  var _finalColors = {}
	  for (var key in _defColors) {
	    var hex = colors.hasOwnProperty(key) ? colors[key] : null
	    if (!hex) {
	      _finalColors[key] = _defColors[key]
	      continue
	    }
	    if ('reset' === key) {
	      if (typeof hex === 'string') {
	        hex = [hex]
	      }
	      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
	        return typeof h !== 'string'
	      })) {
	        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
	      }
	      var defHexColor = _defColors[key]
	      if (!hex[0]) {
	        hex[0] = defHexColor[0]
	      }
	      if (hex.length === 1 || !hex[1]) {
	        hex = [hex[0]]
	        hex.push(defHexColor[1])
	      }
	
	      hex = hex.slice(0, 2)
	    } else if (typeof hex !== 'string') {
	      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
	    }
	    _finalColors[key] = hex
	  }
	  _setTags(_finalColors)
	}
	
	/**
	 * Reset colors.
	 */
	ansiHTML.reset = function () {
	  _setTags(_defColors)
	}
	
	/**
	 * Expose tags, including open and close.
	 * @type {Object}
	 */
	ansiHTML.tags = {}
	
	if (Object.defineProperty) {
	  Object.defineProperty(ansiHTML.tags, 'open', {
	    get: function () { return _openTags }
	  })
	  Object.defineProperty(ansiHTML.tags, 'close', {
	    get: function () { return _closeTags }
	  })
	} else {
	  ansiHTML.tags.open = _openTags
	  ansiHTML.tags.close = _closeTags
	}
	
	function _setTags (colors) {
	  // reset all
	  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
	  // inverse
	  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
	  // dark grey
	  _openTags['90'] = 'color:#' + colors.darkgrey
	
	  for (var code in _styles) {
	    var color = _styles[code]
	    var oriColor = colors[color] || '000'
	    _openTags[code] = 'color:#' + oriColor
	    code = parseInt(code)
	    _openTags[(code + 10).toString()] = 'background:#' + oriColor
	  }
	}
	
	ansiHTML.reset()


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = {
	  XmlEntities: __webpack_require__(12),
	  Html4Entities: __webpack_require__(13),
	  Html5Entities: __webpack_require__(14),
	  AllHtmlEntities: __webpack_require__(14)
	};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	var ALPHA_INDEX = {
	    '&lt': '<',
	    '&gt': '>',
	    '&quot': '"',
	    '&apos': '\'',
	    '&amp': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&apos;': '\'',
	    '&amp;': '&'
	};
	
	var CHAR_INDEX = {
	    60: 'lt',
	    62: 'gt',
	    34: 'quot',
	    39: 'apos',
	    38: 'amp'
	};
	
	var CHAR_S_INDEX = {
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    '\'': '&apos;',
	    '&': '&amp;'
	};
	
	/**
	 * @constructor
	 */
	function XmlEntities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    return str.replace(/<|>|"|'|&/g, function(s) {
	        return CHAR_S_INDEX[s];
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encode = function(str) {
	    return new XmlEntities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.decode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
	        if (s.charAt(1) === '#') {
	            var code = s.charAt(2).toLowerCase() === 'x' ?
	                parseInt(s.substr(3), 16) :
	                parseInt(s.substr(2));
	
	            if (isNaN(code) || code < -32768 || code > 65535) {
	                return '';
	            }
	            return String.fromCharCode(code);
	        }
	        return ALPHA_INDEX[s] || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.decode = function(str) {
	    return new XmlEntities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonUTF = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var alpha = CHAR_INDEX[c];
	        if (alpha) {
	            result += "&" + alpha + ";";
	            i++;
	            continue;
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonUTF = function(str) {
	    return new XmlEntities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonASCII = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLenght = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLenght) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonASCII = function(str) {
	    return new XmlEntities().encodeNonASCII(str);
	 };
	
	module.exports = XmlEntities;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
	var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];
	
	var alphaIndex = {};
	var numIndex = {};
	
	var i = 0;
	var length = HTML_ALPHA.length;
	while (i < length) {
	    var a = HTML_ALPHA[i];
	    var c = HTML_CODES[i];
	    alphaIndex[a] = String.fromCharCode(c);
	    numIndex[c] = a;
	    i++;
	}
	
	/**
	 * @constructor
	 */
	function Html4Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.decode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1).toLowerCase() === 'x' ?
	                parseInt(entity.substr(2), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.decode = function(str) {
	    return new Html4Entities().decode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var alpha = numIndex[str.charCodeAt(i)];
	        result += alpha ? "&" + alpha + ";" : str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encode = function(str) {
	    return new Html4Entities().encode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonUTF = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var cc = str.charCodeAt(i);
	        var alpha = numIndex[cc];
	        if (alpha) {
	            result += "&" + alpha + ";";
	        } else if (cc < 32 || cc > 126) {
	            result += "&#" + cc + ";";
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonUTF = function(str) {
	    return new Html4Entities().encodeNonUTF(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonASCII = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonASCII = function(str) {
	    return new Html4Entities().encodeNonASCII(str);
	};
	
	module.exports = Html4Entities;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
	
	var alphaIndex = {};
	var charIndex = {};
	
	createIndexes(alphaIndex, charIndex);
	
	/**
	 * @constructor
	 */
	function Html5Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.decode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1) === 'x' ?
	                parseInt(entity.substr(2).toLowerCase(), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.decode = function(str) {
	    return new Html5Entities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encode = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var charInfo = charIndex[str.charCodeAt(i)];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        result += str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encode = function(str) {
	    return new Html5Entities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonUTF = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var charInfo = charIndex[c];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonUTF = function(str) {
	    return new Html5Entities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonASCII = function(str) {
	    if (!str || !str.length) {
	        return '';
	    }
	    var strLength = str.length;
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonASCII = function(str) {
	    return new Html5Entities().encodeNonASCII(str);
	 };
	
	/**
	 * @param {Object} alphaIndex Passed by reference.
	 * @param {Object} charIndex Passed by reference.
	 */
	function createIndexes(alphaIndex, charIndex) {
	    var i = ENTITIES.length;
	    var _results = [];
	    while (i--) {
	        var e = ENTITIES[i];
	        var alpha = e[0];
	        var chars = e[1];
	        var chr = chars[0];
	        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
	        var charInfo;
	        if (addChar) {
	            charInfo = charIndex[chr] = charIndex[chr] || {};
	        }
	        if (chars[1]) {
	            var chr2 = chars[1];
	            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
	            _results.push(addChar && (charInfo[chr2] = alpha));
	        } else {
	            alphaIndex[alpha] = String.fromCharCode(chr);
	            _results.push(addChar && (charInfo[''] = alpha));
	        }
	    }
	}
	
	module.exports = Html5Entities;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Based heavily on https://github.com/webpack/webpack/blob/
	 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
	 * Original copyright Tobias Koppers @sokra (MIT license)
	 */
	
	/* global window __webpack_hash__ */
	
	if (false) {
	  throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len
	
	var lastHash;
	var failureStatuses = { abort: 1, fail: 1 };
	var applyOptions = { ignoreUnaccepted: true };
	
	function upToDate(hash) {
	  if (hash) lastHash = hash;
	  return lastHash == __webpack_require__.h();
	}
	
	module.exports = function(hash, moduleMap, options) {
	  var reload = options.reload;
	  if (!upToDate(hash) && module.hot.status() == "idle") {
	    if (options.log) console.log("[HMR] Checking for updates on the server...");
	    check();
	  }
	
	  function check() {
	    var cb = function(err, updatedModules) {
	      if (err) return handleError(err);
	
	      if(!updatedModules) {
	        if (options.warn) {
	          console.warn("[HMR] Cannot find update (Full reload needed)");
	          console.warn("[HMR] (Probably because of restarting the server)");
	        }
	        performReload();
	        return null;
	      }
	
	      var applyCallback = function(applyErr, renewedModules) {
	        if (applyErr) return handleError(applyErr);
	
	        if (!upToDate()) check();
	
	        logUpdates(updatedModules, renewedModules);
	      };
	
	      var applyResult = module.hot.apply(applyOptions, applyCallback);
	      // webpack 2 promise
	      if (applyResult && applyResult.then) {
	        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
	        applyResult.then(function(outdatedModules) {
	          applyCallback(null, outdatedModules);
	        });
	        applyResult.catch(applyCallback);
	      }
	
	    };
	
	    var result = module.hot.check(false, cb);
	    // webpack 2 promise
	    if (result && result.then) {
	        result.then(function(updatedModules) {
	            cb(null, updatedModules);
	        });
	        result.catch(cb);
	    }
	  }
	
	  function logUpdates(updatedModules, renewedModules) {
	    var unacceptedModules = updatedModules.filter(function(moduleId) {
	      return renewedModules && renewedModules.indexOf(moduleId) < 0;
	    });
	
	    if(unacceptedModules.length > 0) {
	      if (options.warn) {
	        console.warn(
	          "[HMR] The following modules couldn't be hot updated: " +
	          "(Full reload needed)\n" +
	          "This is usually because the modules which have changed " +
	          "(and their parents) do not know how to hot reload themselves. " +
	          "See " + hmrDocsUrl + " for more details."
	        );
	        unacceptedModules.forEach(function(moduleId) {
	          console.warn("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	      performReload();
	      return;
	    }
	
	    if (options.log) {
	      if(!renewedModules || renewedModules.length === 0) {
	        console.log("[HMR] Nothing hot updated.");
	      } else {
	        console.log("[HMR] Updated modules:");
	        renewedModules.forEach(function(moduleId) {
	          console.log("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	
	      if (upToDate()) {
	        console.log("[HMR] App is up to date.");
	      }
	    }
	  }
	
	  function handleError(err) {
	    if (module.hot.status() in failureStatuses) {
	      if (options.warn) {
	        console.warn("[HMR] Cannot check for update (Full reload needed)");
	        console.warn("[HMR] " + err.stack || err.message);
	      }
	      performReload();
	      return;
	    }
	    if (options.warn) {
	      console.warn("[HMR] Update check failed: " + err.stack || err.message);
	    }
	  }
	
	  function performReload() {
	    if (reload) {
	      if (options.warn) console.warn("[HMR] Reloading page");
	      window.location.reload();
	    }
	  }
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	__webpack_require__(17);
	var core_1 = __webpack_require__(18);
	var angular2_universal_1 = __webpack_require__(19);
	var app_module_1 = __webpack_require__(20);
	__webpack_require__(58);
	// Enable either Hot Module Reloading or production mode
	if (module['hot']) {
	    module['hot'].accept();
	    module['hot'].dispose(function () { platform.destroy(); });
	}
	else {
	    core_1.enableProdMode();
	}
	// Boot the application, either now or when the DOM content is loaded
	var platform = angular2_universal_1.platformUniversalDynamic();
	var bootApplication = function () { platform.bootstrapModule(app_module_1.AppModule); };
	if (document.readyState === 'complete') {
	    bootApplication();
	}
	else {
	    document.addEventListener('DOMContentLoaded', bootApplication);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(80);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(1);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(83);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var router_1 = __webpack_require__(21);
	var forms_1 = __webpack_require__(22);
	var angular2_universal_1 = __webpack_require__(19);
	var app_component_1 = __webpack_require__(23);
	var navmenu_component_1 = __webpack_require__(28);
	var home_component_1 = __webpack_require__(32);
	var privacy_checking_component_1 = __webpack_require__(34);
	var policy_review_component_1 = __webpack_require__(39);
	var access_control_form_create_component_1 = __webpack_require__(43);
	var access_control_detail_component_1 = __webpack_require__(45);
	var privacy_policy_form_create_component_1 = __webpack_require__(47);
	var privacy_policy_detail_component_1 = __webpack_require__(49);
	var privacy_domain_form_create_component_1 = __webpack_require__(51);
	var policy_management_1 = __webpack_require__(54);
	var sub_privacy_policy_form_create_component_1 = __webpack_require__(56);
	var primeng_1 = __webpack_require__(36);
	var AppModule = (function () {
	    function AppModule() {
	    }
	    return AppModule;
	}());
	AppModule = __decorate([
	    core_1.NgModule({
	        bootstrap: [app_component_1.AppComponent],
	        declarations: [
	            app_component_1.AppComponent,
	            navmenu_component_1.NavMenuComponent,
	            home_component_1.HomeComponent,
	            privacy_checking_component_1.PrivacyComponent,
	            policy_review_component_1.PolicyReviewComponent,
	            access_control_form_create_component_1.AccessControlPolicyFormCreateComponent,
	            privacy_policy_form_create_component_1.PrivacyPolicyFormCreateComponent,
	            privacy_domain_form_create_component_1.PrivacyDomainComponent,
	            policy_management_1.PolicyManagementComponent,
	            sub_privacy_policy_form_create_component_1.SubPrivacyPolicyFormCreateComponent,
	            privacy_policy_detail_component_1.PrivacyPolicyDetailComponent,
	            access_control_detail_component_1.AccessControlDetailComponent
	        ],
	        imports: [
	            angular2_universal_1.UniversalModule,
	            router_1.RouterModule.forRoot([
	                { path: '', redirectTo: 'home', pathMatch: 'full' },
	                { path: 'home', component: home_component_1.HomeComponent },
	                { path: 'privacy_checking', component: privacy_checking_component_1.PrivacyComponent },
	                { path: 'policy_review', component: policy_review_component_1.PolicyReviewComponent },
	                { path: 'access_control_policy', component: access_control_form_create_component_1.AccessControlPolicyFormCreateComponent },
	                { path: 'access_control_detail/:id', component: access_control_detail_component_1.AccessControlDetailComponent },
	                { path: 'privacy_policy', component: privacy_policy_form_create_component_1.PrivacyPolicyFormCreateComponent },
	                { path: 'privacy_policy_detail/:id', component: privacy_policy_detail_component_1.PrivacyPolicyDetailComponent },
	                { path: 'sub_privacy_policy', component: sub_privacy_policy_form_create_component_1.SubPrivacyPolicyFormCreateComponent },
	                { path: 'privacy_domain', component: privacy_domain_form_create_component_1.PrivacyDomainComponent },
	                { path: 'policy_management', component: policy_management_1.PolicyManagementComponent },
	                { path: '**', redirectTo: 'home' },
	            ]),
	            forms_1.FormsModule,
	            primeng_1.ButtonModule,
	            primeng_1.GrowlModule,
	            primeng_1.DropdownModule,
	            primeng_1.AutoCompleteModule, primeng_1.InputTextareaModule, primeng_1.MessagesModule, primeng_1.AccordionModule,
	            primeng_1.InputTextModule, primeng_1.DataTableModule, primeng_1.SharedModule, primeng_1.PanelModule, primeng_1.FieldsetModule, primeng_1.ConfirmDialogModule
	        ]
	    })
	], AppModule);
	exports.AppModule = AppModule;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(9);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(6);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var AppComponent = (function () {
	    function AppComponent() {
	    }
	    return AppComponent;
	}());
	AppComponent = __decorate([
	    core_1.Component({
	        selector: 'app',
	        template: __webpack_require__(24),
	        styles: [__webpack_require__(25)]
	    })
	], AppComponent);
	exports.AppComponent = AppComponent;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = "<div class='container-fluid'>\n    <div class='row'>\n        <div class='col-sm-3'>\n            <nav-menu></nav-menu>\n        </div>\n        <div class='col-sm-9 body-content'>\n            <router-outlet></router-outlet>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(26);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(27)();
	// imports
	
	
	// module
	exports.push([module.id, "@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    .body-content {\n        padding-top: 50px;\n    }\n}\n", ""]);
	
	// exports


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var NavMenuComponent = (function () {
	    function NavMenuComponent() {
	    }
	    return NavMenuComponent;
	}());
	NavMenuComponent = __decorate([
	    core_1.Component({
	        selector: 'nav-menu',
	        template: __webpack_require__(29),
	        styles: [__webpack_require__(30)]
	    })
	], NavMenuComponent);
	exports.NavMenuComponent = NavMenuComponent;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">Privacy Access Control</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_checking']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Checking\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/access_control_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Access Control Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/sub_privacy_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Sub Privacy Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/policy_review']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Policy Review\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_domain']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Domain\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/policy_management']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Policy Management\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(31);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(27)();
	// imports
	
	
	// module
	exports.push([module.id, "li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\nli.link-active a,\nli.link-active a:hover,\nli.link-active a:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .navbar-header {\n        float: none;\n    }\n    .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .navbar ul {\n        float: none;\n    }\n    .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n", ""]);
	
	// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var HomeComponent = (function () {
	    function HomeComponent() {
	    }
	    return HomeComponent;
	}());
	HomeComponent = __decorate([
	    core_1.Component({
	        selector: 'home',
	        template: __webpack_require__(33)
	    })
	], HomeComponent);
	exports.HomeComponent = HomeComponent;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<h1>Hello, world!</h1>\n<p>Welcome to your new single-page application, built with:</p>\n<ul>\n    <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>\n    <li><a href='https://angular.io/'>Angular 2</a> and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>\n    <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>\n    <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>\n</ul>\n<p>To help you get started, we've also set up:</p>\n<ul>\n    <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>\n    <li><strong>Server-side prerendering</strong>. For faster initial loading and improved SEO, your Angular 2 app is prerendered on the server. The resulting HTML is then transferred to the browser where a client-side copy of the app takes over.</li>\n    <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>\n    <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, your Angular 2 app will be rebuilt and a new instance injected is into the page.</li>\n    <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>\n</ul>\n"

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var primeng_1 = __webpack_require__(36);
	var app_setting_1 = __webpack_require__(37);
	var PrivacyComponent = (function () {
	    function PrivacyComponent(http) {
	        this.http = http;
	        this.user_property_names = [];
	        //#endregion
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        this.environment_result = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        //#region result
	        this.result = [];
	        this.result_property_names = [];
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	        this.resource_operators.push({ label: 'Equals', value: 'Equals' });
	        this.resource_operators.push({ label: 'GreaterThan', value: 'GreaterThan' });
	        this.resource_operators.push({ label: 'LessThan', value: 'LessThan' });
	    }
	    PrivacyComponent.prototype.ngOnInit = function () {
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'accounts/').subscribe(function (data) {
	            var jsonObject = data.json()[0];
	            console.log(jsonObject);
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                var object = jsonObject[property];
	                if (!Array.isArray(object) && typeof object !== 'object') {
	                    that.user_property_names.push(property);
	                }
	            }
	            that.users = data.json();
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	    };
	    PrivacyComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (that.resource_selected_field === undefined)
	                    that.resource_selected_field = property;
	                that.initialize_fields(property, jsonObject, "", that.resource_fields);
	            }
	        });
	    };
	    PrivacyComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    PrivacyComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    PrivacyComponent.prototype.and_click = function () {
	        this.condition_result += " AND ";
	    };
	    PrivacyComponent.prototype.or_click = function () {
	        this.condition_result += " OR ";
	    };
	    PrivacyComponent.prototype.not_click = function () {
	        this.condition_result += "NOT( ";
	    };
	    PrivacyComponent.prototype.open_bracket_click = function () {
	        this.condition_result += "(";
	    };
	    PrivacyComponent.prototype.close_bracket_click = function () {
	        this.condition_result += " )";
	    };
	    PrivacyComponent.prototype.add_condition = function () {
	        if (!this.resource_selected_field)
	            this.resource_selected_field = this.resource_fields[0].value;
	        if (!this.resource_selected_operator)
	            this.resource_selected_operator = this.resource_operators[0].value;
	        var expression = this.resource_selected_operator + '('
	            + this.resource_selected_field + ', ' + this.resource_values + ')';
	        if (this.condition_result)
	            this.condition_result += expression;
	        else
	            this.condition_result = expression;
	    };
	    PrivacyComponent.prototype.clear_condition = function () {
	        this.condition_result = null;
	    };
	    PrivacyComponent.prototype.add_environment_field = function () {
	        if (!this.environment_result)
	            this.environment_result = "\"" + this.environment_field + "\" : \"" + this.environment_value + "\"";
	        else
	            this.environment_result += ", \"" + this.environment_field + "\" : \"" + this.environment_value + "\"";
	        this.environment_object = "{ " + this.environment_result + " }";
	        this.environment_field = this.environment_value = null;
	    };
	    PrivacyComponent.prototype.clear_environment = function () {
	        this.environment_object = "";
	        this.environment_result = "";
	    };
	    PrivacyComponent.prototype.submit = function () {
	        var _this = this;
	        if (!this.selected_user) {
	            this.msgs = [];
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'You have not selected user' });
	            return;
	        }
	        var environment = "{ " + this.environment_result + " }";
	        console.log(typeof this.selected_user._id === 'object');
	        var command = {
	            "UserID": typeof this.selected_user._id === 'object' ? this.selected_user._id.$oid : this.selected_user._id,
	            "ResourceName": this.collection_selected_name,
	            "ResourceCondition": this.condition_result,
	            "Environment": environment,
	            "Action": "read"
	        };
	        console.log(command);
	        this.result = [];
	        this.result_property_names = [];
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'privacy/check/', JSON.stringify(command), this.options).subscribe(function (data) {
	            if (data.text() == 'Deny') {
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Denied' });
	            }
	            else if (data.text() == 'Not Applicable') {
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Not Applicable' });
	            }
	            else {
	                that.result = data.json();
	                if (that.result.length == 0) {
	                    _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'User doesnot have right to access resource' });
	                }
	                var jsonObject = data.json()[0];
	                for (var property in jsonObject) {
	                    that.result_property_names.push(property);
	                }
	            }
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return PrivacyComponent;
	}());
	PrivacyComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_checking',
	        template: __webpack_require__(38),
	        providers: [primeng_1.ConfirmationService]
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PrivacyComponent);
	exports.PrivacyComponent = PrivacyComponent;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(46);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(191);

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AppSetting = (function () {
	    function AppSetting() {
	    }
	    return AppSetting;
	}());
	AppSetting.API_ENDPOINT = 'http://localhost:5000/api/';
	exports.AppSetting = AppSetting;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"col-lg-12\">\r\n    <p-growl [value]=\"msgs\"></p-growl>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Subject Selection</h3></div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"users\" selectionMode=\"single\" [(selection)]=\"selected_user\"\r\n                     [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"6\">\r\n            <p-column *ngFor=\"let col of user_property_names\" field=\"{{col}}\" header=\"{{col}}\"\r\n                      [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <!--<p-footer><div style=\"text-align: left\">Selected User: {{json_helper.stringify(selected_user)}}</div></p-footer>-->\r\n        </p-dataTable>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\"><h3 style=\"color:#f0ad4e\">Resource Condition</h3></div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-xs-12 form-group\">\r\n            <label>Collection Name :</label>\r\n            <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\" \r\n                        [style]=\"{'width':'120px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n        </div>\r\n        <!--<div class=\"col-xs-4 form-group\">\r\n            <label style=\"padding-right:13px\">Resource Field: </label>\r\n            <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'120px'}\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Operator :</label>\r\n            <p-dropdown [options]=\"resource_operators\" [(ngModel)]=\"resource_selected_operator\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Value :</label>\r\n            <input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"resource_values\" />\r\n        </div>-->\r\n    </div>\r\n    <!--<div class=\"col-lg-12\" style=\"padding-bottom: 10px\">\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_condition()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Clear\" (click)=\"clear_condition()\"></button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <textarea style=\"border-color: black\" rows=\"2\" cols=\"140\" pInputTextarea\r\n                  [(ngModel)]=\"condition_result\" [disabled]=\"true\"></textarea>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n    </div>-->\r\n\r\n    <div class=\"col-lg-12\"><h3 style=\"color:#5cb85c\">Environment Condition</h3></div>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Field :</label>\r\n            <p-autoComplete [(ngModel)]=\"environment_field\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                            [minLength]=\"1\" >\r\n            </p-autoComplete>\r\n            <!--<input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"environment_field\" />-->\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Value :</label>\r\n            <input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"environment_value\" />\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"col-xs-12\" style=\"padding-bottom: 10px\" >\r\n        <button class=\"ui-button-success\" pButton type=\"button\" \r\n                label=\"Add\" (click)=\"add_environment_field()\"></button>\r\n        <button class=\"ui-button-success\" pButton type=\"button\"\r\n                 label=\"Clear\" (click)=\"clear_environment()\"></button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <textarea style=\"border-color: black\" rows=\"2\" cols=\"140\" pInputTextarea class=\"ui-inputtextarea\"\r\n                  [(ngModel)]=\"environment_object\" [disabled]=\"true\"></textarea>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-primary btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Submit</button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\" *ngIf=\"result.length > 0\" style=\"margin-top:20px\">\r\n        <table class=\"table table-bordered table-responsive table-striped\">\r\n            <thead>\r\n                <tr>\r\n                    <th *ngFor=\"let col of result_property_names\">{{col}}</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let row of result\">\r\n                    <td *ngFor=\"let idx of result_property_names\">{{json_helper.stringify(row[idx])}}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>"

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var access_control_rule_model_1 = __webpack_require__(40);
	var privacy_rule_model_1 = __webpack_require__(41);
	var PolicyReviewComponent = (function () {
	    function PolicyReviewComponent(http) {
	        this.http = http;
	        this.collection_names = [];
	        //#region resource
	        this.resource_fields = [];
	        //#endregion
	        this.actions = [];
	        this.policy_types = [];
	        //#region subject
	        this.subject_fields = [];
	        //#endregion
	        //#region result
	        this.result = [];
	        this.result_property_names = [];
	        //#endregion
	        this.access_controls = [];
	        this.privacy_policies = [];
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    PolicyReviewComponent.prototype.ngOnInit = function () {
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        this.policy_types.push({ label: 'Access Control', value: 'Access Control' });
	        this.policy_types.push({ label: 'Privacy', value: 'Privacy' });
	        this.selected_policy_type = this.policy_types[0].value;
	    };
	    PolicyReviewComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            console.log(jsonObject);
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.resource_selected_field === undefined)
	                    that.resource_selected_field = property;
	                that.initialize_fields(property, jsonObject, "", that.resource_fields);
	            }
	        });
	    };
	    PolicyReviewComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    PolicyReviewComponent.prototype.add_subject_field = function () {
	        if (!this.subject_result_temp)
	            this.subject_result_temp = "\"" + this.selected_subject_field + "\" : \"" + this.constant_subject_value + "\"";
	        else
	            this.subject_result_temp += ", \"" + this.selected_subject_field + "\" : \"" + this.constant_subject_value + "\"";
	        this.subject_result = "{ " + this.subject_result_temp + " }";
	        this.constant_subject_value = null;
	    };
	    PolicyReviewComponent.prototype.add_resource_field = function () {
	        if (!this.resource_result_temp)
	            this.resource_result_temp = "\"" + this.resource_selected_field + "\" : \"" + this.constant_resource_value + "\"";
	        else
	            this.resource_result_temp += ", \"" + this.resource_selected_field + "\" : \"" + this.constant_resource_value + "\"";
	        this.resource_result = "{ " + this.resource_result_temp + " }";
	        this.constant_resource_value = null;
	    };
	    PolicyReviewComponent.prototype.add_environment_value = function () {
	        if (!this.environment_result_temp)
	            this.environment_result_temp = "\"" + this.environment_field + "\" : \"" + this.constant_environment_value + "\"";
	        else
	            this.environment_result_temp += ", \"" + this.environment_field + "\" : \"" + this.constant_environment_value + "\"";
	        this.environment_result = "{ " + this.environment_result_temp + " }";
	        this.environment_field = this.constant_environment_value = null;
	    };
	    PolicyReviewComponent.prototype.clear = function () {
	        this.environment_result_temp = null;
	        this.resource_result_temp = null;
	        this.subject_result_temp = null;
	        this.resource_result = "";
	        this.subject_result = "";
	        this.environment_result = "";
	    };
	    PolicyReviewComponent.prototype.submit = function () {
	        var _this = this;
	        var command = {
	            UserJsonData: this.subject_result,
	            ResourceJsonData: this.resource_result,
	            EnvironmentJsonData: this.environment_result,
	            Action: this.selected_action,
	            CollectionName: this.collection_selected_name
	        };
	        this.result = [];
	        this.result_property_names = [];
	        var that = this;
	        if (this.selected_policy_type == 'Access Control') {
	            this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControl/Review/', JSON.stringify(command), this.options).subscribe(function (data) {
	                _this.access_controls = [];
	                _this.privacy_policies = [];
	                var policies = data.json();
	                for (var _i = 0, policies_1 = policies; _i < policies_1.length; _i++) {
	                    var policy = policies_1[_i];
	                    _this.access_controls.push(new access_control_rule_model_1.AccessControl(policy.policyId, policy.description, policy.collectionName, policy.ruleCombining, policy.target, policy.action));
	                }
	            }, function (error) {
	                _this.msgs = [];
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	            });
	        }
	        else {
	            this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'Privacy/Review/', JSON.stringify(command), this.options).subscribe(function (data) {
	                _this.access_controls = [];
	                _this.privacy_policies = [];
	                var policies = data.json();
	                for (var _i = 0, policies_2 = policies; _i < policies_2.length; _i++) {
	                    var policy = policies_2[_i];
	                    _this.privacy_policies.push(new privacy_rule_model_1.PrivacyPolicy(policy.policyId, policy.description, policy.collectionName, policy.target));
	                }
	            }, function (error) {
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	            });
	        }
	    };
	    return PolicyReviewComponent;
	}());
	PolicyReviewComponent = __decorate([
	    core_1.Component({
	        selector: 'policy_review',
	        template: __webpack_require__(42)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PolicyReviewComponent);
	exports.PolicyReviewComponent = PolicyReviewComponent;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AccessControlRule = (function () {
	    function AccessControlRule(ruleId, condition, effect) {
	        this.RuleId = ruleId;
	        this.Condition = condition;
	        this.Effect = effect;
	    }
	    return AccessControlRule;
	}());
	exports.AccessControlRule = AccessControlRule;
	var AccessControl = (function () {
	    function AccessControl(policyID, description, collectionName, ruleCombining, target, action) {
	        if (action === void 0) { action = "read"; }
	        this.PolicyID = policyID;
	        this.CollectionName = collectionName;
	        this.Description = description;
	        this.RuleCombining = ruleCombining;
	        this.Action = action;
	        this.Target = target;
	    }
	    return AccessControl;
	}());
	exports.AccessControl = AccessControl;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var FieldEffect = (function () {
	    function FieldEffect(propertyName, privacyFunction) {
	        this.FunctionApply = privacyFunction;
	        this.Name = propertyName;
	    }
	    return FieldEffect;
	}());
	exports.FieldEffect = FieldEffect;
	var FieldEffectOption = (function () {
	    function FieldEffectOption(propertyName, privacyFunction) {
	        this.Functions = privacyFunction;
	        this.Name = propertyName;
	    }
	    return FieldEffectOption;
	}());
	exports.FieldEffectOption = FieldEffectOption;
	var PrivacyRule = (function () {
	    function PrivacyRule(ruleID, condition, fieldEffects) {
	        this.RuleID = ruleID;
	        this.Condition = condition;
	        this.FieldEffects = fieldEffects;
	    }
	    return PrivacyRule;
	}());
	exports.PrivacyRule = PrivacyRule;
	var PrivacyPolicy = (function () {
	    function PrivacyPolicy(policyID, description, collectionName, target) {
	        this.PolicyID = policyID;
	        this.Description = description;
	        this.CollectionName = collectionName;
	        this.Target = target;
	    }
	    return PrivacyPolicy;
	}());
	exports.PrivacyPolicy = PrivacyPolicy;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Policy Review</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Policy Type :</label>\r\n                <p-dropdown [options]=\"policy_types\" [(ngModel)]=\"selected_policy_type\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:28px\">Subject Field: </label>\r\n                <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_subject_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_subject_field()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"subject_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Resource Field: </label>\r\n                <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_resource_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_resource_field()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"resource_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"\">Environment Field: </label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"environment_field\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_environment_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_environment_value()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"environment_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12 text-center\">\r\n        <div class=\"col-lg-offset-1 col-lg-5\">\r\n            <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Submit</button>\r\n        </div>\r\n        <div class=\"col-lg-offset-0 col-lg-5\">\r\n            <button class=\"btn btn-danger btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"clear()\">Clear</button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" *ngIf=\"access_controls.length > 0\" style=\"padding-top:15px\">\r\n        <p-dataTable [value]=\"access_controls\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"RuleCombining\" header=\"Rule Combining\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Action\" header=\"Action\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Target\" header=\"Target\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            \r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\" *ngIf=\"privacy_policies.length > 0\" style=\"padding-top:15px\">\r\n        <p-dataTable [value]=\"privacy_policies\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Target\" header=\"Target\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            \r\n        </p-dataTable>\r\n    </div>\r\n</div>"

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var access_control_rule_model_1 = __webpack_require__(40);
	var AccessControlPolicyFormCreateComponent = (function () {
	    function AccessControlPolicyFormCreateComponent(http) {
	        this.http = http;
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        //#endregion
	        this.policy_id = '';
	        this.description = '';
	        this.actions = [];
	        this.rule_effects = [];
	        this.final_rule_effects = [];
	        this.function_names = [];
	        this.subject_fields = [];
	        this.current_rule_result = "";
	        this.final_rule_result = [];
	        this.rules_combining = [];
	        this.target_result = "";
	        this.environment_value = '';
	        this.constant_value = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        this.rule_id = '';
	        this.rule_ids = [];
	        this.msgs = [];
	        this.rules = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    AccessControlPolicyFormCreateComponent.prototype.ngOnInit = function () {
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'function/').subscribe(function (data) {
	            var names = data.json();
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name = names_1[_i];
	                that.function_names.push({ label: name, value: name });
	            }
	            that.selected_function_name = names[0];
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        this.rule_effects.push({ label: 'Permit', value: 'Permit' });
	        this.rule_effects.push({ label: 'Deny', value: 'Deny' });
	        this.selected_rule_effect = this.rule_effects[0].value;
	        this.rules_combining.push({ label: 'Permit overrides', value: 'Permit overrides' });
	        this.rules_combining.push({ label: 'Deny overrides', value: 'Deny overrides' });
	        this.selected_rule_combining = this.rules_combining[0].value;
	    };
	    AccessControlPolicyFormCreateComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_fields(property, jsonObject, "", that.resource_fields);
	            }
	        });
	        this.reset();
	    };
	    AccessControlPolicyFormCreateComponent.prototype.reset = function () {
	        this.rule_ids = [];
	        this.target_result = '';
	        this.current_rule_result = '';
	        this.rules = [];
	    };
	    AccessControlPolicyFormCreateComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    //#region data form.
	    AccessControlPolicyFormCreateComponent.prototype.add_function_name_to_rule = function () {
	        this.current_rule_result += this.selected_function_name + " ( ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_function_name_to_target = function () {
	        this.target_result += this.selected_function_name + " ( ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_resource_field_to_rule = function () {
	        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_resource_field_to_target = function () {
	        this.target_result += "Resource." + this.resource_selected_field + " ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_subject_field_to_rule = function () {
	        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_subject_field_to_target = function () {
	        this.target_result += "Subject." + this.selected_subject_field + " ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_constant_value_to_rule = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.current_rule_result += "'" + this.constant_value + "' ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_constant_value_to_target = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.target_result += "'" + this.constant_value + "' ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_environment_value_to_rule = function () {
	        this.current_rule_result += "Environment." + this.environment_value + " ";
	    };
	    AccessControlPolicyFormCreateComponent.prototype.add_environment_value_to_target = function () {
	        this.target_result += "Environment." + this.environment_value + " ";
	    };
	    //#endregion
	    //#region logic form
	    AccessControlPolicyFormCreateComponent.prototype.and_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "AND ";
	        }
	        else {
	            this.current_rule_result += "AND ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.or_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "OR ";
	        }
	        else {
	            this.current_rule_result += "OR ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.not_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "NOT ( ";
	        }
	        else {
	            this.current_rule_result += "NOT ( ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.open_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "( ";
	        }
	        else {
	            this.current_rule_result += "( ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.close_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ") ";
	        }
	        else {
	            this.current_rule_result += ") ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.comma_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ", ";
	        }
	        else {
	            this.current_rule_result += ", ";
	        }
	    };
	    AccessControlPolicyFormCreateComponent.prototype.clear_condition = function (isTarget) {
	        if (isTarget) {
	            this.target_result = "";
	        }
	        else {
	            this.current_rule_result = "";
	        }
	    };
	    //#endregion 
	    AccessControlPolicyFormCreateComponent.prototype.add_current_rule = function () {
	        if (this.current_rule_result == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        else if (this.rule_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID can not be null' });
	            return;
	        }
	        for (var _i = 0, _a = this.rule_ids; _i < _a.length; _i++) {
	            var r = _a[_i];
	            if (r == this.rule_id) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID must be unique' });
	                return;
	            }
	        }
	        this.final_rule_result.push(this.current_rule_result);
	        this.rule_ids.push(this.rule_id);
	        this.final_rule_effects.push(this.selected_rule_effect);
	        this.rules.push(new access_control_rule_model_1.AccessControlRule(this.rule_id, this.current_rule_result, this.selected_rule_effect));
	        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'One rule added' });
	    };
	    AccessControlPolicyFormCreateComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    AccessControlPolicyFormCreateComponent.prototype.submit = function () {
	        var _this = this;
	        if (this.policy_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Policy ID can not be null' });
	            return;
	        }
	        else if (this.rules.length == 0) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        var command = {
	            "PolicyID": this.policy_id,
	            "CollectionName": this.collection_selected_name,
	            "Description": this.description,
	            "Action": this.selected_action,
	            "RuleCombining": this.selected_rule_combining,
	            "Target": this.target_result,
	            "Rules": this.rules
	        };
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControlPolicy', JSON.stringify(command), this.options).subscribe(function (data) {
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Create Successfully' });
	            that.reset();
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return AccessControlPolicyFormCreateComponent;
	}());
	AccessControlPolicyFormCreateComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_rule',
	        template: __webpack_require__(44)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], AccessControlPolicyFormCreateComponent);
	exports.AccessControlPolicyFormCreateComponent = AccessControlPolicyFormCreateComponent;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Access Control Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:3px\">Rule Combining :</label>\r\n                <p-dropdown [options]=\"rules_combining\" [(ngModel)]=\"selected_rule_combining\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target Condition:</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule ID :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label>Rule Effect :</label>\r\n                <p-dropdown [options]=\"rule_effects\" [(ngModel)]=\"selected_rule_effect\"></p-dropdown>\r\n            </div>\r\n            \r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\" *ngIf=\"rules.length > 0\">\r\n            <p-dataTable [value]=\"rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleId\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'320px'}\"></p-column>\r\n                <p-column field=\"Effect\" header=\"Effect\" [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"rule_effects\" [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n        </p-fieldset>\r\n    </div>\r\n    \r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var access_control_rule_model_1 = __webpack_require__(40);
	var AccessControlDetailComponent = (function () {
	    function AccessControlDetailComponent(http) {
	        this.http = http;
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        //#endregion
	        this.policy_id = '';
	        this.description = '';
	        this.actions = [];
	        this.rule_effects = [];
	        this.final_rule_effects = [];
	        this.function_names = [];
	        this.subject_fields = [];
	        this.current_rule_result = "";
	        this.final_rule_result = [];
	        this.rules_combining = [];
	        this.target_result = "";
	        this.environment_value = '';
	        this.constant_value = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        this.rule_id = '';
	        this.rule_ids = [];
	        this.msgs = [];
	        this.rules = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    AccessControlDetailComponent.prototype.ngOnInit = function () {
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'function/').subscribe(function (data) {
	            var names = data.json();
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name = names_1[_i];
	                that.function_names.push({ label: name, value: name });
	            }
	            that.selected_function_name = names[0];
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        this.rule_effects.push({ label: 'Permit', value: 'Permit' });
	        this.rule_effects.push({ label: 'Deny', value: 'Deny' });
	        this.selected_rule_effect = this.rule_effects[0].value;
	        this.rules_combining.push({ label: 'Permit overrides', value: 'Permit overrides' });
	        this.rules_combining.push({ label: 'Deny overrides', value: 'Deny overrides' });
	        this.selected_rule_combining = this.rules_combining[0].value;
	    };
	    AccessControlDetailComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_fields(property, jsonObject, "", that.resource_fields);
	            }
	        });
	        this.reset();
	    };
	    AccessControlDetailComponent.prototype.reset = function () {
	        this.rule_ids = [];
	        this.target_result = '';
	        this.current_rule_result = '';
	        this.rules = [];
	    };
	    AccessControlDetailComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    //#region data form.
	    AccessControlDetailComponent.prototype.add_function_name_to_rule = function () {
	        this.current_rule_result += this.selected_function_name + " ( ";
	    };
	    AccessControlDetailComponent.prototype.add_function_name_to_target = function () {
	        this.target_result += this.selected_function_name + " ( ";
	    };
	    AccessControlDetailComponent.prototype.add_resource_field_to_rule = function () {
	        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
	    };
	    AccessControlDetailComponent.prototype.add_resource_field_to_target = function () {
	        this.target_result += "Resource." + this.resource_selected_field + " ";
	    };
	    AccessControlDetailComponent.prototype.add_subject_field_to_rule = function () {
	        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
	    };
	    AccessControlDetailComponent.prototype.add_subject_field_to_target = function () {
	        this.target_result += "Subject." + this.selected_subject_field + " ";
	    };
	    AccessControlDetailComponent.prototype.add_constant_value_to_rule = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.current_rule_result += "'" + this.constant_value + "' ";
	    };
	    AccessControlDetailComponent.prototype.add_constant_value_to_target = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.target_result += "'" + this.constant_value + "' ";
	    };
	    AccessControlDetailComponent.prototype.add_environment_value_to_rule = function () {
	        this.current_rule_result += "Environment." + this.environment_value + " ";
	    };
	    AccessControlDetailComponent.prototype.add_environment_value_to_target = function () {
	        this.target_result += "Environment." + this.environment_value + " ";
	    };
	    //#endregion
	    //#region logic form
	    AccessControlDetailComponent.prototype.and_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "AND ";
	        }
	        else {
	            this.current_rule_result += "AND ";
	        }
	    };
	    AccessControlDetailComponent.prototype.or_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "OR ";
	        }
	        else {
	            this.current_rule_result += "OR ";
	        }
	    };
	    AccessControlDetailComponent.prototype.not_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "NOT ( ";
	        }
	        else {
	            this.current_rule_result += "NOT ( ";
	        }
	    };
	    AccessControlDetailComponent.prototype.open_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "( ";
	        }
	        else {
	            this.current_rule_result += "( ";
	        }
	    };
	    AccessControlDetailComponent.prototype.close_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ") ";
	        }
	        else {
	            this.current_rule_result += ") ";
	        }
	    };
	    AccessControlDetailComponent.prototype.comma_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ", ";
	        }
	        else {
	            this.current_rule_result += ", ";
	        }
	    };
	    AccessControlDetailComponent.prototype.clear_condition = function (isTarget) {
	        if (isTarget) {
	            this.target_result = "";
	        }
	        else {
	            this.current_rule_result = "";
	        }
	    };
	    //#endregion 
	    AccessControlDetailComponent.prototype.add_current_rule = function () {
	        if (this.current_rule_result == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        else if (this.rule_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID can not be null' });
	            return;
	        }
	        for (var _i = 0, _a = this.rule_ids; _i < _a.length; _i++) {
	            var r = _a[_i];
	            if (r == this.rule_id) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID must be unique' });
	                return;
	            }
	        }
	        this.final_rule_result.push(this.current_rule_result);
	        this.rule_ids.push(this.rule_id);
	        this.final_rule_effects.push(this.selected_rule_effect);
	        this.rules.push(new access_control_rule_model_1.AccessControlRule(this.rule_id, this.current_rule_result, this.selected_rule_effect));
	        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'One rule added' });
	    };
	    AccessControlDetailComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    AccessControlDetailComponent.prototype.submit = function () {
	        var _this = this;
	        if (this.policy_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Policy ID can not be null' });
	            return;
	        }
	        else if (this.rules.length == 0) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        var command = {
	            "PolicyID": this.policy_id,
	            "CollectionName": this.collection_selected_name,
	            "Description": this.description,
	            "Action": this.selected_action,
	            "RuleCombining": this.selected_rule_combining,
	            "Target": this.target_result,
	            "Rules": this.rules
	        };
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControlPolicy', JSON.stringify(command), this.options).subscribe(function (data) {
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Create Successfully' });
	            that.reset();
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return AccessControlDetailComponent;
	}());
	AccessControlDetailComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_rule',
	        template: __webpack_require__(46)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], AccessControlDetailComponent);
	exports.AccessControlDetailComponent = AccessControlDetailComponent;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Access Control Policy Detail</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:3px\">Rule Combining :</label>\r\n                <p-dropdown [options]=\"rules_combining\" [(ngModel)]=\"selected_rule_combining\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target Condition:</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule ID :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label>Rule Effect :</label>\r\n                <p-dropdown [options]=\"rule_effects\" [(ngModel)]=\"selected_rule_effect\"></p-dropdown>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\" *ngIf=\"rules.length > 0\">\r\n            <p-dataTable [value]=\"rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleId\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'320px'}\"></p-column>\r\n                <p-column field=\"Effect\" header=\"Effect\" [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"rule_effects\" [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n        </p-fieldset>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Update</button>\r\n    </div>\r\n</div>"

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var privacy_rule_model_1 = __webpack_require__(41);
	var PrivacyPolicyFormCreateComponent = (function () {
	    function PrivacyPolicyFormCreateComponent(http) {
	        this.http = http;
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        //#endregion
	        this.policy_id = '';
	        this.description = '';
	        this.actions = [];
	        this.function_names = [];
	        this.subject_fields = [];
	        this.current_rule_result = "";
	        this.final_rule_result = [];
	        this.target_result = "";
	        this.constant_value = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        //#endregion environment
	        this.rule_id = '';
	        this.rule_ids = [];
	        this.privacy_functions = [];
	        this.field_effects = [];
	        this.final_field_effects = [];
	        this.field_effect_options = [];
	        this.privacy_rules = [];
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    PrivacyPolicyFormCreateComponent.prototype.ngOnInit = function () {
	        var that = this;
	        //#region call web api for option data
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'function/').subscribe(function (data) {
	            var names = data.json();
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name = names_1[_i];
	                that.function_names.push({ label: name, value: name });
	            }
	            that.selected_function_name = names[0];
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunctions/').subscribe(function (data) {
	            var methods = data.json();
	            for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
	                var method = methods_1[_i];
	                that.privacy_functions.push({ label: method, value: method });
	            }
	            that.privacy_functions.push({ label: 'Optional', value: 'Optional' });
	        });
	        //#endregion
	        //#region hard code for options
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        //#endregion
	    };
	    PrivacyPolicyFormCreateComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.field_effect_options = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_field_effects(property, jsonObject, "", that.resource_fields);
	                that.field_effects = [];
	                for (var _i = 0, _a = that.resource_fields; _i < _a.length; _i++) {
	                    var item = _a[_i];
	                    that.field_effects.push(new privacy_rule_model_1.FieldEffect(item.label, "Optional"));
	                }
	            }
	        });
	        this.reset();
	    };
	    PrivacyPolicyFormCreateComponent.prototype.initialize_field_effects = function (property, jsonObject, prefix, container) {
	        var _this = this;
	        if (property == "_id")
	            return;
	        var that = this;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_field_effects(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_field_effects(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            var name_1 = "";
	            if (prefix == '') {
	                container.push({ label: property, value: property });
	                name_1 = property;
	            }
	            else {
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	                name_1 = prefix + '.' + property;
	            }
	            var parameter = this.collection_selected_name + '.' + name_1;
	            this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunction?name=' + parameter, this.options).subscribe(function (data) {
	                var effects = data.json();
	                var select_items = [];
	                for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
	                    var effect = effects_1[_i];
	                    select_items.push({ label: effect, value: effect });
	                }
	                that.field_effect_options.push(new privacy_rule_model_1.FieldEffectOption(name_1, select_items));
	            }, function (error) {
	                _this.msgs = [];
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	            });
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    //#region data form.
	    PrivacyPolicyFormCreateComponent.prototype.add_function_name_to_rule = function () {
	        this.current_rule_result += this.selected_function_name + " ( ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_function_name_to_target = function () {
	        this.target_result += this.selected_function_name + " ( ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_resource_field_to_rule = function () {
	        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_resource_field_to_target = function () {
	        this.target_result += "Resource." + this.resource_selected_field + " ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_subject_field_to_rule = function () {
	        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_subject_field_to_target = function () {
	        this.target_result += "Subject." + this.selected_subject_field + " ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_constant_value_to_rule = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.current_rule_result += "'" + this.constant_value + "' ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_constant_value_to_target = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.target_result += "'" + this.constant_value + "' ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_environment_value_to_rule = function () {
	        this.current_rule_result += "Environment." + this.environment_value + " ";
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_environment_value_to_target = function () {
	        this.target_result += "Environment." + this.environment_value + " ";
	    };
	    //#endregion
	    //#region logic form
	    PrivacyPolicyFormCreateComponent.prototype.and_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "AND ";
	        }
	        else {
	            this.current_rule_result += "AND ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.or_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "OR ";
	        }
	        else {
	            this.current_rule_result += "OR ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.not_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "NOT ( ";
	        }
	        else {
	            this.current_rule_result += "NOT ( ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.open_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "( ";
	        }
	        else {
	            this.current_rule_result += "( ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.close_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ") ";
	        }
	        else {
	            this.current_rule_result += ") ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.comma_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ", ";
	        }
	        else {
	            this.current_rule_result += ", ";
	        }
	    };
	    PrivacyPolicyFormCreateComponent.prototype.clear_rule = function (isTarget) {
	        if (isTarget) {
	            this.target_result = "";
	        }
	        else {
	            this.current_rule_result = "";
	        }
	    };
	    //#endregion
	    PrivacyPolicyFormCreateComponent.prototype.reset = function () {
	        this.rule_ids = [];
	        this.target_result = '';
	        this.current_rule_result = '';
	        this.privacy_rules = [];
	    };
	    PrivacyPolicyFormCreateComponent.prototype.add_current_rule = function () {
	        if (this.rule_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule Id can not be null' });
	            return;
	        }
	        if (this.current_rule_result == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        for (var _i = 0, _a = this.rule_ids; _i < _a.length; _i++) {
	            var r = _a[_i];
	            if (r == this.rule_id) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID must be unique' });
	                return;
	            }
	        }
	        this.final_rule_result.push(this.current_rule_result);
	        this.rule_ids.push(this.rule_id);
	        var cloned = [];
	        for (var _b = 0, _c = this.field_effects; _b < _c.length; _b++) {
	            var item = _c[_b];
	            cloned.push(new privacy_rule_model_1.FieldEffect(item.Name, item.FunctionApply));
	        }
	        this.final_field_effects.push(cloned);
	        this.privacy_rules.push(new privacy_rule_model_1.PrivacyRule(this.rule_id, this.current_rule_result, cloned));
	        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'One Rule added' });
	    };
	    PrivacyPolicyFormCreateComponent.prototype.getPrivacyFunctions = function (fieldName) {
	        var result;
	        if (this.field_effect_options.length == 0)
	            return this.privacy_functions;
	        else
	            result = this.field_effect_options.find(function (x) { return x.Name == fieldName; });
	        if (result != undefined)
	            return result.Functions;
	        return this.privacy_functions;
	    };
	    PrivacyPolicyFormCreateComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    PrivacyPolicyFormCreateComponent.prototype.submit = function () {
	        var _this = this;
	        console.log(this.final_field_effects);
	        if (this.policy_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Policy Id can not be null' });
	            return;
	        }
	        if (this.privacy_rules.length == 0) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rules can not be null' });
	            return;
	        }
	        var command = {
	            "PolicyID": this.policy_id,
	            "CollectionName": this.collection_selected_name,
	            "Description": this.description,
	            "Target": this.target_result,
	            "Rules": this.privacy_rules
	        };
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyPolicy', JSON.stringify(command), this.options).subscribe(function (data) {
	            that.reset();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: "Privacy Policy added successfully" });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return PrivacyPolicyFormCreateComponent;
	}());
	PrivacyPolicyFormCreateComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_policy',
	        template: __webpack_require__(48)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PrivacyPolicyFormCreateComponent);
	exports.PrivacyPolicyFormCreateComponent = PrivacyPolicyFormCreateComponent;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Privacy Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var privacy_rule_model_1 = __webpack_require__(41);
	var PrivacyPolicyDetailComponent = (function () {
	    function PrivacyPolicyDetailComponent(http) {
	        this.http = http;
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        //#endregion
	        this.policy_id = '';
	        this.description = '';
	        this.actions = [];
	        this.function_names = [];
	        this.subject_fields = [];
	        this.current_rule_result = "";
	        this.final_rule_result = [];
	        this.target_result = "";
	        this.constant_value = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        //#endregion environment
	        this.rule_id = '';
	        this.rule_ids = [];
	        this.privacy_functions = [];
	        this.field_effects = [];
	        this.final_field_effects = [];
	        this.field_effect_options = [];
	        this.privacy_rules = [];
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    PrivacyPolicyDetailComponent.prototype.ngOnInit = function () {
	        var that = this;
	        //#region call web api for option data
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'function/').subscribe(function (data) {
	            var names = data.json();
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name = names_1[_i];
	                that.function_names.push({ label: name, value: name });
	            }
	            that.selected_function_name = names[0];
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunctions/').subscribe(function (data) {
	            var methods = data.json();
	            for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
	                var method = methods_1[_i];
	                that.privacy_functions.push({ label: method, value: method });
	            }
	            that.privacy_functions.push({ label: 'Optional', value: 'Optional' });
	        });
	        //#endregion
	        //#region hard code for options
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        //#endregion
	    };
	    PrivacyPolicyDetailComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.field_effect_options = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_field_effects(property, jsonObject, "", that.resource_fields);
	                that.field_effects = [];
	                for (var _i = 0, _a = that.resource_fields; _i < _a.length; _i++) {
	                    var item = _a[_i];
	                    that.field_effects.push(new privacy_rule_model_1.FieldEffect(item.label, "Optional"));
	                }
	            }
	        });
	        this.reset();
	    };
	    PrivacyPolicyDetailComponent.prototype.initialize_field_effects = function (property, jsonObject, prefix, container) {
	        var _this = this;
	        if (property == "_id")
	            return;
	        var that = this;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_field_effects(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_field_effects(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            var name_1 = "";
	            if (prefix == '') {
	                container.push({ label: property, value: property });
	                name_1 = property;
	            }
	            else {
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	                name_1 = prefix + '.' + property;
	            }
	            var parameter = this.collection_selected_name + '.' + name_1;
	            this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunction?name=' + parameter, this.options).subscribe(function (data) {
	                var effects = data.json();
	                var select_items = [];
	                for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
	                    var effect = effects_1[_i];
	                    select_items.push({ label: effect, value: effect });
	                }
	                that.field_effect_options.push(new privacy_rule_model_1.FieldEffectOption(name_1, select_items));
	            }, function (error) {
	                _this.msgs = [];
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	            });
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    //#region data form.
	    PrivacyPolicyDetailComponent.prototype.add_function_name_to_rule = function () {
	        this.current_rule_result += this.selected_function_name + " ( ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_function_name_to_target = function () {
	        this.target_result += this.selected_function_name + " ( ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_resource_field_to_rule = function () {
	        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_resource_field_to_target = function () {
	        this.target_result += "Resource." + this.resource_selected_field + " ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_subject_field_to_rule = function () {
	        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_subject_field_to_target = function () {
	        this.target_result += "Subject." + this.selected_subject_field + " ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_constant_value_to_rule = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.current_rule_result += "'" + this.constant_value + "' ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_constant_value_to_target = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.target_result += "'" + this.constant_value + "' ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_environment_value_to_rule = function () {
	        this.current_rule_result += "Environment." + this.environment_value + " ";
	    };
	    PrivacyPolicyDetailComponent.prototype.add_environment_value_to_target = function () {
	        this.target_result += "Environment." + this.environment_value + " ";
	    };
	    //#endregion
	    //#region logic form
	    PrivacyPolicyDetailComponent.prototype.and_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "AND ";
	        }
	        else {
	            this.current_rule_result += "AND ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.or_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "OR ";
	        }
	        else {
	            this.current_rule_result += "OR ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.not_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "NOT ( ";
	        }
	        else {
	            this.current_rule_result += "NOT ( ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.open_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "( ";
	        }
	        else {
	            this.current_rule_result += "( ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.close_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ") ";
	        }
	        else {
	            this.current_rule_result += ") ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.comma_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ", ";
	        }
	        else {
	            this.current_rule_result += ", ";
	        }
	    };
	    PrivacyPolicyDetailComponent.prototype.clear_rule = function (isTarget) {
	        if (isTarget) {
	            this.target_result = "";
	        }
	        else {
	            this.current_rule_result = "";
	        }
	    };
	    //#endregion
	    PrivacyPolicyDetailComponent.prototype.reset = function () {
	        this.rule_ids = [];
	        this.target_result = '';
	        this.current_rule_result = '';
	        this.privacy_rules = [];
	    };
	    PrivacyPolicyDetailComponent.prototype.add_current_rule = function () {
	        if (this.rule_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule Id can not be null' });
	            return;
	        }
	        if (this.current_rule_result == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        for (var _i = 0, _a = this.rule_ids; _i < _a.length; _i++) {
	            var r = _a[_i];
	            if (r == this.rule_id) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID must be unique' });
	                return;
	            }
	        }
	        this.final_rule_result.push(this.current_rule_result);
	        this.rule_ids.push(this.rule_id);
	        var cloned = [];
	        for (var _b = 0, _c = this.field_effects; _b < _c.length; _b++) {
	            var item = _c[_b];
	            cloned.push(new privacy_rule_model_1.FieldEffect(item.Name, item.FunctionApply));
	        }
	        this.final_field_effects.push(cloned);
	        this.privacy_rules.push(new privacy_rule_model_1.PrivacyRule(this.rule_id, this.current_rule_result, cloned));
	        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'One Rule added' });
	    };
	    PrivacyPolicyDetailComponent.prototype.getPrivacyFunctions = function (fieldName) {
	        var result;
	        if (this.field_effect_options.length == 0)
	            return this.privacy_functions;
	        else
	            result = this.field_effect_options.find(function (x) { return x.Name == fieldName; });
	        if (result != undefined)
	            return result.Functions;
	        return this.privacy_functions;
	    };
	    PrivacyPolicyDetailComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    PrivacyPolicyDetailComponent.prototype.submit = function () {
	        var _this = this;
	        console.log(this.final_field_effects);
	        if (this.policy_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Policy Id can not be null' });
	            return;
	        }
	        if (this.privacy_rules.length == 0) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rules can not be null' });
	            return;
	        }
	        var command = {
	            "PolicyID": this.policy_id,
	            "CollectionName": this.collection_selected_name,
	            "Description": this.description,
	            "Target": this.target_result,
	            "Rules": this.privacy_rules
	        };
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyPolicy', JSON.stringify(command), this.options).subscribe(function (data) {
	            that.reset();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: "Privacy Policy added successfully" });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return PrivacyPolicyDetailComponent;
	}());
	PrivacyPolicyDetailComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_policy_detail',
	        template: __webpack_require__(50)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PrivacyPolicyDetailComponent);
	exports.PrivacyPolicyDetailComponent = PrivacyPolicyDetailComponent;


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Privacy Policy Detail</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Update</button>\r\n    </div>\r\n</div>"

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var primeng_1 = __webpack_require__(36);
	var app_setting_1 = __webpack_require__(37);
	var privacy_domain_model_1 = __webpack_require__(52);
	var PrivacyDomainComponent = (function () {
	    function PrivacyDomainComponent(http) {
	        this.http = http;
	        this.configured_domain_names = [];
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.configured_privacy_domain_functions = [];
	        this.configured_privacy_domain_functions_view = [];
	        this.configured_privacy_domain_fields = [];
	        this.configured_privacy_domain_fields_view = [];
	        this.function_name = '';
	        this.priority_function = 1;
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    PrivacyDomainComponent.prototype.ngOnInit = function () {
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.initialize_domains();
	    };
	    PrivacyDomainComponent.prototype.initialize_domains = function () {
	        this.configured_domain_names = [];
	        this.configured_privacy_domain_functions = [];
	        this.configured_privacy_domain_fields = [];
	        var that = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyDomainField/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_2 = collections; _i < collections_2.length; _i++) {
	                var domain = collections_2[_i];
	                that.configured_domain_names.push({ label: domain.domainName, value: domain.domainName });
	                for (var _a = 0, _b = domain.functions; _a < _b.length; _a++) {
	                    var func = _b[_a];
	                    that.configured_privacy_domain_functions.push(new privacy_domain_model_1.PrivacyDomainFunction(func.name, func.priority, domain.domainName));
	                }
	                for (var _c = 0, _d = domain.fields; _c < _d.length; _c++) {
	                    var field = _d[_c];
	                    that.configured_privacy_domain_fields.push(new privacy_domain_model_1.PrivacyDomainField(field, domain.domainName));
	                }
	            }
	            that.configured_domain_selected_name = that.configured_domain_names[0].label;
	            that.onSelectDomainName(that.configured_domain_selected_name);
	        });
	    };
	    PrivacyDomainComponent.prototype.onSelectDomainName = function (domain_selected) {
	        this.configured_privacy_domain_functions_view = this.configured_privacy_domain_functions.filter(function (x) { return x.DomainName == domain_selected; });
	        this.configured_privacy_domain_fields_view = this.configured_privacy_domain_fields.filter(function (x) { return x.DomainName == domain_selected; });
	    };
	    PrivacyDomainComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_field_effects(property, jsonObject, "", that.resource_fields);
	            }
	        });
	    };
	    PrivacyDomainComponent.prototype.initialize_field_effects = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var that = this;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_field_effects(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_field_effects(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '') {
	                container.push({ label: property, value: property });
	            }
	            else {
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	            }
	        }
	    };
	    PrivacyDomainComponent.prototype.updatePriorityFunctions = function () {
	        var _this = this;
	        var priority_functions = [];
	        for (var _i = 0, _a = this.configured_privacy_domain_functions_view; _i < _a.length; _i++) {
	            var func = _a[_i];
	            priority_functions.push({ "Name": func.FunctionName, "Priority": func.Priority });
	        }
	        var command = {
	            "DomainName": this.configured_domain_selected_name,
	            "PriorityFunctions": priority_functions
	        };
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'PriorityFunctions', JSON.stringify(command), this.options).subscribe(function (data) {
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Update Priority Successfully' });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
	        });
	    };
	    PrivacyDomainComponent.prototype.add_function = function () {
	        var _this = this;
	        var command = {
	            "DomainName": this.configured_domain_selected_name,
	            "Priority": { "Name": this.function_name, "Priority": this.priority_function }
	        };
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyDomainFunction', JSON.stringify(command), this.options).subscribe(function (data) {
	            _this.initialize_domains();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Function Added Successfully' });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
	        });
	    };
	    PrivacyDomainComponent.prototype.addField = function () {
	        var _this = this;
	        var fieldName = this.collection_selected_name + "." + this.resource_selected_field;
	        for (var _i = 0, _a = this.configured_privacy_domain_fields_view; _i < _a.length; _i++) {
	            var field = _a[_i];
	            if (field.FieldName == fieldName) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Field already existed' });
	                return;
	            }
	        }
	        var command = {
	            "DomainName": this.configured_domain_selected_name,
	            "FieldName": fieldName
	        };
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'DomainField', JSON.stringify(command), this.options).subscribe(function (data) {
	            _this.initialize_domains();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Field Added Successfully' });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
	        });
	    };
	    PrivacyDomainComponent.prototype.addDomain = function () {
	        var _this = this;
	        var name = this.domain_name;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyDomain', JSON.stringify(name), this.options).subscribe(function (data) {
	            _this.initialize_domains();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'Insert Domain Successfully' });
	        });
	    };
	    return PrivacyDomainComponent;
	}());
	PrivacyDomainComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_domain',
	        template: __webpack_require__(53),
	        providers: [primeng_1.ConfirmationService]
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PrivacyDomainComponent);
	exports.PrivacyDomainComponent = PrivacyDomainComponent;


/***/ }),
/* 52 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var PrivacyDomain = (function () {
	    function PrivacyDomain(name, fieldsApply) {
	        this.Name = name;
	        this.FieldsApply = fieldsApply;
	    }
	    return PrivacyDomain;
	}());
	exports.PrivacyDomain = PrivacyDomain;
	var PrivacyDomainFunction = (function () {
	    function PrivacyDomainFunction(funcName, priority, domainName) {
	        this.FunctionName = funcName;
	        this.Priority = priority;
	        this.DomainName = domainName;
	    }
	    return PrivacyDomainFunction;
	}());
	exports.PrivacyDomainFunction = PrivacyDomainFunction;
	var PrivacyDomainField = (function () {
	    function PrivacyDomainField(fieldName, domainName) {
	        this.FieldName = fieldName;
	        this.DomainName = domainName;
	    }
	    return PrivacyDomainField;
	}());
	exports.PrivacyDomainField = PrivacyDomainField;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

	module.exports = "<p-growl [value]=\"msgs\"></p-growl>\r\n<h1 style=\"text-align:center\">Privacy Domain</h1>\r\n<div class=\"row\">\r\n    <div class=\"col-lg-12\">\r\n        <h3>New Domain</h3>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:25px\">Name :</label>\r\n            <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"domain_name\" />\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"addDomain()\" label=\"Add Domain\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <h3>Registered Domain</h3>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:7px\">Domains :</label>\r\n            <p-dropdown [options]=\"configured_domain_names\" [(ngModel)]=\"configured_domain_selected_name\"\r\n                        [style]=\"{'width':'200px'}\" (onChange)=\"onSelectDomainName($event.value)\"></p-dropdown>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Functions :</label>\r\n            <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"function_name\" />\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:5px\">Priority :</label>\r\n            <input type=\"number\" size=\"20\" pInputText [(ngModel)]=\"priority_function\"/>\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"add_function()\" label=\"Add Function\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:10px;\">\r\n        <label>Functions</label>\r\n        <p-dataTable [value]=\"configured_privacy_domain_functions_view\" [editable]=\"true\">\r\n            <p-column field=\"DomainName\" header=\"Domain Name\"></p-column>\r\n            <p-column field=\"FunctionName\" header=\"Function Name\" [style]=\"{'width':'320px'}\"></p-column>\r\n            <p-column field=\"Priority\" header=\"Priority\" [editable]=\"true\"></p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:10px;\">\r\n        <div class=\"col-lg-4 \">\r\n            <button type=\"button\" pButton icon=\"fa-save\" (click)=\"updatePriorityFunctions()\" label=\"Update Priority\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:20px;\">\r\n        <label>Fields</label>\r\n        <p-dataTable [value]=\"configured_privacy_domain_fields_view\" [editable]=\"true\">\r\n            <p-column field=\"DomainName\" header=\"Domain Name\"></p-column>\r\n            <p-column field=\"FieldName\" header=\"Field Name\"></p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Collection :</label>\r\n            <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                        [style]=\"{'width':'200px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Fields :</label>\r\n            <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\"\r\n                        [style]=\"{'width':'200px'}\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-lg-4\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"addField()\" label=\"Add Field\"></button>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var primeng_1 = __webpack_require__(36);
	var app_setting_1 = __webpack_require__(37);
	var access_control_rule_model_1 = __webpack_require__(40);
	var privacy_rule_model_1 = __webpack_require__(41);
	var PolicyManagementComponent = (function () {
	    function PolicyManagementComponent(http, confirmationService) {
	        this.http = http;
	        this.confirmationService = confirmationService;
	        this.access_controls = [];
	        this.privacy_policy = [];
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	    }
	    PolicyManagementComponent.prototype.ngOnInit = function () {
	        this.init_access_control();
	        this.init_privacy();
	    };
	    PolicyManagementComponent.prototype.init_access_control = function () {
	        var _this = this;
	        this.access_controls = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControlPolicy/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var _i = 0, jsonObject_1 = jsonObject; _i < jsonObject_1.length; _i++) {
	                var data_1 = jsonObject_1[_i];
	                _this.access_controls.push(new access_control_rule_model_1.AccessControl(data_1.policyId, data_1.description, data_1.collectionName, data_1.ruleCombining, data_1.target, data_1.action));
	            }
	        });
	    };
	    PolicyManagementComponent.prototype.init_privacy = function () {
	        var _this = this;
	        this.privacy_policy = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyPolicy/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var _i = 0, jsonObject_2 = jsonObject; _i < jsonObject_2.length; _i++) {
	                var data_2 = jsonObject_2[_i];
	                _this.privacy_policy.push(new privacy_rule_model_1.PrivacyPolicy(data_2.policyId, data_2.description, data_2.collectionName, data_2.target));
	            }
	        });
	    };
	    PolicyManagementComponent.prototype.delete_access_control = function (policy) {
	        var _this = this;
	        this.confirmationService.confirm({
	            message: 'Do you want to delete this record?',
	            header: 'Delete Confirmation',
	            icon: 'fa fa-trash',
	            accept: function () {
	                _this.http.delete(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControlPolicy?policyID=' + policy.PolicyID, _this.options).subscribe(function (data) {
	                    _this.msgs = [];
	                    _this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
	                    _this.init_access_control();
	                });
	            }
	        });
	    };
	    PolicyManagementComponent.prototype.delete_privacy_policy = function (policy) {
	        var _this = this;
	        this.confirmationService.confirm({
	            message: 'Do you want to delete this record?',
	            header: 'Delete Confirmation',
	            icon: 'fa fa-trash',
	            accept: function () {
	                _this.http.delete(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyPolicy?policyID=' + policy.PolicyID, _this.options).subscribe(function (data) {
	                    _this.msgs = [];
	                    _this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
	                    _this.init_privacy();
	                });
	            }
	        });
	    };
	    return PolicyManagementComponent;
	}());
	PolicyManagementComponent = __decorate([
	    core_1.Component({
	        selector: 'access_control_management',
	        template: __webpack_require__(55),
	        providers: [primeng_1.ConfirmationService]
	    }),
	    __metadata("design:paramtypes", [http_1.Http, primeng_1.ConfirmationService])
	], PolicyManagementComponent);
	exports.PolicyManagementComponent = PolicyManagementComponent;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

	module.exports = "<p-confirmDialog width=\"425\"></p-confirmDialog>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Access Control Management</h3></div>\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"access_controls\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"RuleCombining\" header=\"Rule Combining\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Action\" header=\"Action\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Target\" header=\"Target\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" class=\"ui-button-danger\" pButton (click)=\"delete_access_control(car)\" icon=\"fa-trash\"></button>\r\n                </template>\r\n            </p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Privacy Management</h3></div>\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"privacy_policy\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Target\" header=\"Target\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" class=\"ui-button-danger\" pButton (click)=\"delete_privacy_policy(car)\" icon=\"fa-trash\"></button>\r\n                </template>\r\n            </p-column>\r\n        </p-dataTable>\r\n    </div>\r\n</div>"

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = __webpack_require__(18);
	var http_1 = __webpack_require__(35);
	var app_setting_1 = __webpack_require__(37);
	var privacy_rule_model_1 = __webpack_require__(41);
	var SubPrivacyPolicyFormCreateComponent = (function () {
	    function SubPrivacyPolicyFormCreateComponent(http) {
	        this.http = http;
	        //#region Resource
	        this.collection_names = [];
	        this.resource_fields = [];
	        this.resource_operators = [];
	        this.condition_result = "";
	        //#endregion
	        this.policy_id = '';
	        this.description = '';
	        this.actions = [];
	        this.function_names = [];
	        this.subject_fields = [];
	        this.current_rule_result = "";
	        this.final_rule_result = [];
	        this.target_result = "";
	        this.constant_value = '';
	        this.environment_field_options = ['purpose', 'start_time', 'end_time'];
	        //#endregion environment
	        this.rule_id = '';
	        this.rule_ids = [];
	        this.privacy_functions = [];
	        this.field_effects = [];
	        this.final_field_effects = [];
	        this.field_effect_options = [];
	        this.privacy_rules = [];
	        this.configured_domain_names = [];
	        this.configured_domain_selected_name = '';
	        this.priority = 1;
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    SubPrivacyPolicyFormCreateComponent.prototype.ngOnInit = function () {
	        var that = this;
	        //#region call web api for option data
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'ArrayFields/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_selected_name = collections[0];
	            that.onSelectCollectionName(collections[0]);
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'function/').subscribe(function (data) {
	            var names = data.json();
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name = names_1[_i];
	                that.function_names.push({ label: name, value: name });
	            }
	            that.selected_function_name = names[0];
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var property in jsonObject) {
	                if (property == '_id')
	                    continue;
	                if (that.selected_subject_field === undefined)
	                    that.selected_subject_field = property;
	                that.initialize_fields(property, jsonObject, "", that.subject_fields);
	            }
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunctions/').subscribe(function (data) {
	            var methods = data.json();
	            for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
	                var method = methods_1[_i];
	                that.privacy_functions.push({ label: method, value: method });
	            }
	            that.privacy_functions.push({ label: 'Optional', value: 'Optional' });
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyDomainField/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_2 = collections; _i < collections_2.length; _i++) {
	                var domain = collections_2[_i];
	                that.configured_domain_names.push({ label: domain.domainName, value: domain.domainName });
	            }
	            that.configured_domain_selected_name = that.configured_domain_names[0].label;
	        });
	        //#endregion
	        //#region hard code for options
	        this.actions.push({ label: 'read', value: 'read' });
	        this.actions.push({ label: 'create', value: 'create' });
	        this.actions.push({ label: 'update', value: 'update' });
	        this.actions.push({ label: 'delete', value: 'delete' });
	        this.selected_action = this.actions[0].value;
	        //#endregion
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.onSelectCollectionName = function (collectionSelected) {
	        var that = this;
	        this.resource_fields = [];
	        this.field_effect_options = [];
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'SubStructure/?fieldName=' + collectionSelected).subscribe(function (data) {
	            var jsonObject = data.json();
	            var initialize_resource_selected = false;
	            for (var property in jsonObject[0]) {
	                if (property == '_id')
	                    continue;
	                if (!initialize_resource_selected) {
	                    initialize_resource_selected = true;
	                    that.resource_selected_field = property;
	                }
	                that.initialize_field_effects(property, jsonObject, "", that.resource_fields);
	                that.field_effects = [];
	                for (var _i = 0, _a = that.resource_fields; _i < _a.length; _i++) {
	                    var item = _a[_i];
	                    that.field_effects.push(new privacy_rule_model_1.FieldEffect(item.label, "Optional"));
	                }
	            }
	        });
	        this.reset();
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.initialize_field_effects = function (property, jsonObject, prefix, container) {
	        var _this = this;
	        if (property == "_id")
	            return;
	        var that = this;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_field_effects(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_field_effects(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            var name_1 = "";
	            if (prefix == '') {
	                container.push({ label: property, value: property });
	                name_1 = property;
	            }
	            else {
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	                name_1 = prefix + '.' + property;
	            }
	            var parameter = this.collection_selected_name + '.' + name_1;
	            this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyFunction?name=' + parameter, this.options).subscribe(function (data) {
	                var effects = data.json();
	                var select_items = [];
	                for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
	                    var effect = effects_1[_i];
	                    select_items.push({ label: effect, value: effect });
	                }
	                that.field_effect_options.push(new privacy_rule_model_1.FieldEffectOption(name_1, select_items));
	            }, function (error) {
	                _this.msgs = [];
	                _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	            });
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.initialize_fields = function (property, jsonObject, prefix, container) {
	        if (property == "_id")
	            return;
	        var object = jsonObject[property];
	        if (typeof object === 'object' && !Array.isArray(object)) {
	            for (var sub_property in object) {
	                if (prefix == '')
	                    this.initialize_fields(sub_property, object, prefix + property, container);
	                else
	                    this.initialize_fields(sub_property, object, prefix + '.' + property, container);
	            }
	        }
	        else {
	            if (prefix == '')
	                container.push({ label: property, value: property });
	            else
	                container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
	        }
	    };
	    //#region data form.
	    SubPrivacyPolicyFormCreateComponent.prototype.add_function_name_to_rule = function () {
	        this.current_rule_result += this.selected_function_name + " ( ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_function_name_to_target = function () {
	        this.target_result += this.selected_function_name + " ( ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_resource_field_to_rule = function () {
	        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_resource_field_to_target = function () {
	        this.target_result += "Resource." + this.resource_selected_field + " ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_subject_field_to_rule = function () {
	        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_subject_field_to_target = function () {
	        this.target_result += "Subject." + this.selected_subject_field + " ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_constant_value_to_rule = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.current_rule_result += "'" + this.constant_value + "' ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_constant_value_to_target = function () {
	        if (this.constant_value == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not be null' });
	            return;
	        }
	        if (this.constant_value.indexOf('\'') != -1) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Constant value can not contain \' character' });
	            return;
	        }
	        this.target_result += "'" + this.constant_value + "' ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_environment_value_to_rule = function () {
	        this.current_rule_result += "Environment." + this.environment_value + " ";
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_environment_value_to_target = function () {
	        this.target_result += "Environment." + this.environment_value + " ";
	    };
	    //#endregion
	    //#region logic form
	    SubPrivacyPolicyFormCreateComponent.prototype.and_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "AND ";
	        }
	        else {
	            this.current_rule_result += "AND ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.or_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "OR ";
	        }
	        else {
	            this.current_rule_result += "OR ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.not_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "NOT ( ";
	        }
	        else {
	            this.current_rule_result += "NOT ( ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.open_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += "( ";
	        }
	        else {
	            this.current_rule_result += "( ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.close_bracket_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ") ";
	        }
	        else {
	            this.current_rule_result += ") ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.comma_click = function (isTarget) {
	        if (isTarget) {
	            this.target_result += ", ";
	        }
	        else {
	            this.current_rule_result += ", ";
	        }
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.clear_rule = function (isTarget) {
	        if (isTarget) {
	            this.target_result = "";
	        }
	        else {
	            this.current_rule_result = "";
	        }
	    };
	    //#endregion
	    SubPrivacyPolicyFormCreateComponent.prototype.reset = function () {
	        this.rule_ids = [];
	        this.target_result = '';
	        this.current_rule_result = '';
	        this.privacy_rules = [];
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.add_current_rule = function () {
	        if (this.rule_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule Id can not be null' });
	            return;
	        }
	        if (this.current_rule_result == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule can not be null' });
	            return;
	        }
	        for (var _i = 0, _a = this.rule_ids; _i < _a.length; _i++) {
	            var r = _a[_i];
	            if (r == this.rule_id) {
	                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rule ID must be unique' });
	                return;
	            }
	        }
	        this.final_rule_result.push(this.current_rule_result);
	        this.rule_ids.push(this.rule_id);
	        var cloned = [];
	        for (var _b = 0, _c = this.field_effects; _b < _c.length; _b++) {
	            var item = _c[_b];
	            cloned.push(new privacy_rule_model_1.FieldEffect(item.Name, item.FunctionApply));
	        }
	        this.final_field_effects.push(cloned);
	        this.privacy_rules.push(new privacy_rule_model_1.PrivacyRule(this.rule_id, this.current_rule_result, cloned));
	        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'One Rule added' });
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.getPrivacyFunctions = function (fieldName) {
	        var result;
	        if (this.field_effect_options.length == 0)
	            return this.privacy_functions;
	        else
	            result = this.field_effect_options.find(function (x) { return x.Name == fieldName; });
	        if (result != undefined)
	            return result.Functions;
	        return this.privacy_functions;
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.filter_environment_field = function (event) {
	        var query = event.query;
	        var filtered = [];
	        for (var i = 0; i < this.environment_field_options.length; i++) {
	            var field = this.environment_field_options[i];
	            if (field.toLowerCase().indexOf(query.toLowerCase()) == 0) {
	                filtered.push(field);
	            }
	        }
	        this.environment_filtered_field = filtered;
	    };
	    SubPrivacyPolicyFormCreateComponent.prototype.submit = function () {
	        var _this = this;
	        console.log(this.final_field_effects);
	        if (this.policy_id == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Policy Id can not be null' });
	            return;
	        }
	        if (this.privacy_rules.length == 0) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Rules can not be null' });
	            return;
	        }
	        if (this.priority == null) {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Priority can not be null' });
	            return;
	        }
	        if (this.configured_domain_selected_name == '') {
	            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Please create a new domain and add this field to that' });
	            return;
	        }
	        var command = {
	            "PolicyID": this.policy_id,
	            "CollectionName": this.collection_selected_name,
	            "Description": this.description,
	            "Rules": this.privacy_rules,
	            "DomainName": this.configured_domain_selected_name,
	            "Priority": this.priority
	        };
	        var that = this;
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'SubPrivacyPolicy', JSON.stringify(command), this.options).subscribe(function (data) {
	            that.reset();
	            _this.msgs.push({ severity: 'info', summary: 'Info Message', detail: "Sub Privacy Policy added successfully" });
	        }, function (error) {
	            _this.msgs = [];
	            _this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        });
	    };
	    return SubPrivacyPolicyFormCreateComponent;
	}());
	SubPrivacyPolicyFormCreateComponent = __decorate([
	    core_1.Component({
	        selector: 'privacy_policy',
	        template: __webpack_require__(57)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], SubPrivacyPolicyFormCreateComponent);
	exports.SubPrivacyPolicyFormCreateComponent = SubPrivacyPolicyFormCreateComponent;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Sub Privacy Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"21\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:35px\">Field Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'180px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:35px\">Domain :</label>\r\n                <p-dropdown [options]=\"configured_domain_names\" [(ngModel)]=\"configured_domain_selected_name\"\r\n                            [style]=\"{'width':'180px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Priority :</label>\r\n                <input type=\"number\" size=\"20\" pInputText [(ngModel)]=\"priority\"/>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(87);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzk3M2MwOWY3ZWEzMDA5M2ViNzUiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQuanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vbW9kdWxlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXCIiLCJ3ZWJwYWNrOi8vLy4vfi9xdWVyeXN0cmluZy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0cmlwLWFuc2kvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbnNpLXJlZ2V4L2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LW92ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbnNpLWh0bWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vaHRtbC1lbnRpdGllcy9saWIveG1sLWVudGl0aWVzLmpzIiwid2VicGFjazovLy8uL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDQtZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2xpYi9odG1sNS1lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL3Byb2Nlc3MtdXBkYXRlLmpzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9ib290LWNsaWVudC50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIyLXVuaXZlcnNhbC1wb2x5ZmlsbHMvYnJvd3Nlci5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZS9idW5kbGVzL2NvcmUudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbmd1bGFyMi11bml2ZXJzYWwvYnJvd3Nlci9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvYXBwLm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL3JvdXRlci9idW5kbGVzL3JvdXRlci51bWQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2Zvcm1zL2J1bmRsZXMvZm9ybXMudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC5jc3M/ZGRjMyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQuY3NzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3M/OWY2NCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3MiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X2NoZWNraW5nLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2h0dHAvYnVuZGxlcy9odHRwLnVtZC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcHJpbWVuZy9wcmltZW5nLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvYXBwX3NldHRpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9jaGVja2luZy5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsLnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvbW9kZWxzL3ByaXZhY3lfcnVsZS5tb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9hY2Nlc3NfY29udHJvbF9mb3JtX2NyZWF0ZS5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9hY2Nlc3NfY29udHJvbF9kZXRhaWwuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2RldGFpbC5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9mb3JtX2NyZWF0ZS5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9kZXRhaWwuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvbW9kZWxzL3ByaXZhY3lfZG9tYWluLm1vZGVsLnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfZG9tYWluX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9zdWJfcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAvZGlzdC9qcy9ucG0uanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtEQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkI7QUFDM0I7QUFDQSxZQUFJO0FBQ0o7QUFDQSxXQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLHFDQUE2Qjs7QUFFN0IsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTixhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1AsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUM3UEEsZ0Q7Ozs7OztBQ0FBLDhDOzs7Ozs7QUNBQTs7QUFFQTtBQUNBOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxRQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0EsOEJBQTZCLFlBQVksSUFBSSxJQUFJLE1BQU0sSUFBSTtBQUMzRDs7Ozs7OztBQ0hBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbURBQWtELFlBQVksaUJBQWlCO0FBQy9FO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDOUVBOztBQUVBOztBQUVBO0FBQ0Esb0RBQW1ELElBQUksU0FBUyxNQUFNLElBQUk7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQztBQUNEO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUEyRDtBQUMzRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtB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Q0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQ3pHLGNBQUk7YUFDQSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDYixLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsdUNBQXVDLEVBQUUsQ0FBQyxDQUFDO1NBQ25ILENBQUMsRUFDRCxlQUFLO2FBQ0QsS0FBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7YUFDZixLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztTQUMxRixDQUFDLENBQ0osQ0FBQztLQUNOLENBQUM7S0FDTCwwQ0FBQztBQUFELEVBQUM7QUE1Wlksb0NBQW1DO0tBSi9DLGdCQUFTLENBQUM7U0FDUCxRQUFRLEVBQUUsZ0JBQWdCO1NBQzFCLFFBQVEsRUFBRSxtQkFBTyxDQUFDLEVBQWlELENBQUM7TUFDdkUsQ0FBQztzQ0E0RDRCLFdBQUk7SUEzRHJCLG1DQUFtQyxDQTRaL0M7QUE1WlksbUZBQW1DOzs7Ozs7O0FDWGhELHNnQ0FBcWdDLGdCQUFnQixxWEFBcVgsZ0JBQWdCLG9xRUFBb3FFLHFCQUFxQixpUkFBaVIsZUFBZSxpaENBQWloQyxnQkFBZ0IsNGRBQTRkLGdCQUFnQiwrbkJBQStuQixnQkFBZ0IsNm5CQUE2bkIsZ0JBQWdCLDQ2RDs7Ozs7O0FDQTVwTiwrQyIsImZpbGUiOiJtYWluLWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoY2FsbGJhY2spIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdHRyeSB7XHJcbiBcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gMTAwMDA7XHJcbiBcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIpO1xyXG4gXHRcdH1cclxuIFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdGNhbGxiYWNrKG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRjYWxsYmFjaygpO1xyXG4gXHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdGNhbGxiYWNrKG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2soZSk7XHJcbiBcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVwZGF0ZSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0Ly8gQ29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvYmVmNDViMC9zcmMvc2hhcmVkL3V0aWxzL2NhbkRlZmluZVByb3BlcnR5LmpzXHJcbiBcdHZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IGZhbHNlO1xyXG4gXHR0cnkge1xyXG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgXCJ4XCIsIHtcclxuIFx0XHRcdGdldDogZnVuY3Rpb24oKSB7fVxyXG4gXHRcdH0pO1xyXG4gXHRcdGNhbkRlZmluZVByb3BlcnR5ID0gdHJ1ZTtcclxuIFx0fSBjYXRjaCh4KSB7XHJcbiBcdFx0Ly8gSUUgd2lsbCBmYWlsIG9uIGRlZmluZVByb3BlcnR5XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI3OTczYzA5ZjdlYTMwMDkzZWI3NVwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdFx0fSBlbHNlIGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkpIHtcclxuIFx0XHRcdFx0aWYoY2FuRGVmaW5lUHJvcGVydHkpIHtcclxuIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIChmdW5jdGlvbihuYW1lKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fShuYW1lKSkpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGZuW25hbWVdID0gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkLCBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKG51bGwsIGZuKTtcclxuIFx0XHRcdFx0fSBmaW5hbGx5IHtcclxuIFx0XHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcdGlmKGNhbkRlZmluZVByb3BlcnR5KSB7XHJcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIFwiZVwiLCB7XHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdHZhbHVlOiBlbnN1cmVcclxuIFx0XHRcdH0pO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRmbi5lID0gZW5zdXJlO1xyXG4gXHRcdH1cclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2s7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjaztcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJudW1iZXJcIilcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxpYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdENhbGxiYWNrO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHksIGNhbGxiYWNrKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aWYodHlwZW9mIGFwcGx5ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdGhvdEFwcGx5T25VcGRhdGUgPSBmYWxzZTtcclxuIFx0XHRcdGNhbGxiYWNrID0gYXBwbHk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGlmKGVycikgdGhyb3cgZXJyO1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0aG90RG93bmxvYWRNYW5pZmVzdChmdW5jdGlvbihlcnIsIHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKTtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgbnVsbCk7XHJcbiBcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxpYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHVwZGF0ZS5jLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRob3RBdmFpbGlibGVGaWxlc01hcFt1cGRhdGUuY1tpXV0gPSB0cnVlO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGlibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsaWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBjYWxsYmFjayA9IGhvdENhbGxiYWNrO1xyXG4gXHRcdGhvdENhbGxiYWNrID0gbnVsbDtcclxuIFx0XHRpZighY2FsbGJhY2spIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlLCBjYWxsYmFjayk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0Y2FsbGJhY2sobnVsbCwgb3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRpZih0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiBcdFx0XHRvcHRpb25zID0ge307XHJcbiBcdFx0fSBlbHNlIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09IFwib2JqZWN0XCIpIHtcclxuIFx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGlmKGVycikgdGhyb3cgZXJyO1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0b3B0aW9ucyA9IHt9O1xyXG4gXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0aWYoZXJyKSB0aHJvdyBlcnI7XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGUpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbbW9kdWxlXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZUlkID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyBtb2R1bGVJZCArIFwiIGluIFwiICsgcGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4gW291dGRhdGVkTW9kdWxlcywgb3V0ZGF0ZWREZXBlbmRlbmNpZXNdO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoIXJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2socmVzdWx0KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0WzBdKTtcclxuIFx0XHRcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiByZXN1bHRbMV0pIHtcclxuIFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0WzFdLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHRbMV1bbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHR2YXIgaWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRjYihvdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0dmFyIG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2UgaWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdGNhbGxiYWNrKG51bGwsIG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdH1cclxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2UsXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IGhvdEN1cnJlbnRQYXJlbnRzLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKSgwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3OTczYzA5ZjdlYTMwMDkzZWI3NSIsIi8qZXNsaW50LWVudiBicm93c2VyKi9cbi8qZ2xvYmFsIF9fcmVzb3VyY2VRdWVyeSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyovXG5cbnZhciBvcHRpb25zID0ge1xuICBwYXRoOiBcIi9fX3dlYnBhY2tfaG1yXCIsXG4gIHRpbWVvdXQ6IDIwICogMTAwMCxcbiAgb3ZlcmxheTogdHJ1ZSxcbiAgcmVsb2FkOiBmYWxzZSxcbiAgbG9nOiB0cnVlLFxuICB3YXJuOiB0cnVlLFxuICBuYW1lOiAnJ1xufTtcbmlmIChfX3Jlc291cmNlUXVlcnkpIHtcbiAgdmFyIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcbiAgdmFyIG92ZXJyaWRlcyA9IHF1ZXJ5c3RyaW5nLnBhcnNlKF9fcmVzb3VyY2VRdWVyeS5zbGljZSgxKSk7XG4gIGlmIChvdmVycmlkZXMucGF0aCkgb3B0aW9ucy5wYXRoID0gb3ZlcnJpZGVzLnBhdGg7XG4gIGlmIChvdmVycmlkZXMudGltZW91dCkgb3B0aW9ucy50aW1lb3V0ID0gb3ZlcnJpZGVzLnRpbWVvdXQ7XG4gIGlmIChvdmVycmlkZXMub3ZlcmxheSkgb3B0aW9ucy5vdmVybGF5ID0gb3ZlcnJpZGVzLm92ZXJsYXkgIT09ICdmYWxzZSc7XG4gIGlmIChvdmVycmlkZXMucmVsb2FkKSBvcHRpb25zLnJlbG9hZCA9IG92ZXJyaWRlcy5yZWxvYWQgIT09ICdmYWxzZSc7XG4gIGlmIChvdmVycmlkZXMubm9JbmZvICYmIG92ZXJyaWRlcy5ub0luZm8gIT09ICdmYWxzZScpIHtcbiAgICBvcHRpb25zLmxvZyA9IGZhbHNlO1xuICB9XG4gIGlmIChvdmVycmlkZXMubmFtZSkge1xuICAgIG9wdGlvbnMubmFtZSA9IG92ZXJyaWRlcy5uYW1lO1xuICB9XG4gIGlmIChvdmVycmlkZXMucXVpZXQgJiYgb3ZlcnJpZGVzLnF1aWV0ICE9PSAnZmFsc2UnKSB7XG4gICAgb3B0aW9ucy5sb2cgPSBmYWxzZTtcbiAgICBvcHRpb25zLndhcm4gPSBmYWxzZTtcbiAgfVxuICBpZiAob3ZlcnJpZGVzLmR5bmFtaWNQdWJsaWNQYXRoKSB7XG4gICAgb3B0aW9ucy5wYXRoID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBvcHRpb25zLnBhdGg7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gIC8vIGRvIG5vdGhpbmdcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5FdmVudFNvdXJjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgY29uc29sZS53YXJuKFxuICAgIFwid2VicGFjay1ob3QtbWlkZGxld2FyZSdzIGNsaWVudCByZXF1aXJlcyBFdmVudFNvdXJjZSB0byB3b3JrLiBcIiArXG4gICAgXCJZb3Ugc2hvdWxkIGluY2x1ZGUgYSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byBzdXBwb3J0IHRoaXMgYnJvd3NlcjogXCIgK1xuICAgIFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZlci1zZW50X2V2ZW50cyNUb29sc1wiXG4gICk7XG59IGVsc2Uge1xuICBjb25uZWN0KCk7XG59XG5cbmZ1bmN0aW9uIEV2ZW50U291cmNlV3JhcHBlcigpIHtcbiAgdmFyIHNvdXJjZTtcbiAgdmFyIGxhc3RBY3Rpdml0eSA9IG5ldyBEYXRlKCk7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICBpbml0KCk7XG4gIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIGlmICgobmV3IERhdGUoKSAtIGxhc3RBY3Rpdml0eSkgPiBvcHRpb25zLnRpbWVvdXQpIHtcbiAgICAgIGhhbmRsZURpc2Nvbm5lY3QoKTtcbiAgICB9XG4gIH0sIG9wdGlvbnMudGltZW91dCAvIDIpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc291cmNlID0gbmV3IHdpbmRvdy5FdmVudFNvdXJjZShvcHRpb25zLnBhdGgpO1xuICAgIHNvdXJjZS5vbm9wZW4gPSBoYW5kbGVPbmxpbmU7XG4gICAgc291cmNlLm9uZXJyb3IgPSBoYW5kbGVEaXNjb25uZWN0O1xuICAgIHNvdXJjZS5vbm1lc3NhZ2UgPSBoYW5kbGVNZXNzYWdlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25saW5lKCkge1xuICAgIGlmIChvcHRpb25zLmxvZykgY29uc29sZS5sb2coXCJbSE1SXSBjb25uZWN0ZWRcIik7XG4gICAgbGFzdEFjdGl2aXR5ID0gbmV3IERhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoZXZlbnQpIHtcbiAgICBsYXN0QWN0aXZpdHkgPSBuZXcgRGF0ZSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZURpc2Nvbm5lY3QoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgc291cmNlLmNsb3NlKCk7XG4gICAgc2V0VGltZW91dChpbml0LCBvcHRpb25zLnRpbWVvdXQpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRNZXNzYWdlTGlzdGVuZXI6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICBsaXN0ZW5lcnMucHVzaChmbik7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRFdmVudFNvdXJjZVdyYXBwZXIoKSB7XG4gIGlmICghd2luZG93Ll9fd2htRXZlbnRTb3VyY2VXcmFwcGVyKSB7XG4gICAgd2luZG93Ll9fd2htRXZlbnRTb3VyY2VXcmFwcGVyID0ge307XG4gIH1cbiAgaWYgKCF3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXJbb3B0aW9ucy5wYXRoXSkge1xuICAgIC8vIGNhY2hlIHRoZSB3cmFwcGVyIGZvciBvdGhlciBlbnRyaWVzIGxvYWRlZCBvblxuICAgIC8vIHRoZSBzYW1lIHBhZ2Ugd2l0aCB0aGUgc2FtZSBvcHRpb25zLnBhdGhcbiAgICB3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXJbb3B0aW9ucy5wYXRoXSA9IEV2ZW50U291cmNlV3JhcHBlcigpO1xuICB9XG4gIHJldHVybiB3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXJbb3B0aW9ucy5wYXRoXTtcbn1cblxuZnVuY3Rpb24gY29ubmVjdCgpIHtcbiAgZ2V0RXZlbnRTb3VyY2VXcmFwcGVyKCkuYWRkTWVzc2FnZUxpc3RlbmVyKGhhbmRsZU1lc3NhZ2UpO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZGF0YSA9PSBcIlxcdUQ4M0RcXHVEQzkzXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3NNZXNzYWdlKEpTT04ucGFyc2UoZXZlbnQuZGF0YSkpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgSE1SIG1lc3NhZ2U6IFwiICsgZXZlbnQuZGF0YSArIFwiXFxuXCIgKyBleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIHRoZSByZXBvcnRlciBuZWVkcyB0byBiZSBhIHNpbmdsZXRvbiBvbiB0aGUgcGFnZVxuLy8gaW4gY2FzZSB0aGUgY2xpZW50IGlzIGJlaW5nIHVzZWQgYnkgbXVsdGlwbGUgYnVuZGxlc1xuLy8gd2Ugb25seSB3YW50IHRvIHJlcG9ydCBvbmNlLlxuLy8gYWxsIHRoZSBlcnJvcnMgd2lsbCBnbyB0byBhbGwgY2xpZW50c1xudmFyIHNpbmdsZXRvbktleSA9ICdfX3dlYnBhY2tfaG90X21pZGRsZXdhcmVfcmVwb3J0ZXJfXyc7XG52YXIgcmVwb3J0ZXI7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgaWYgKCF3aW5kb3dbc2luZ2xldG9uS2V5XSkge1xuICAgIHdpbmRvd1tzaW5nbGV0b25LZXldID0gY3JlYXRlUmVwb3J0ZXIoKTtcbiAgfVxuICByZXBvcnRlciA9IHdpbmRvd1tzaW5nbGV0b25LZXldO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXBvcnRlcigpIHtcbiAgdmFyIHN0cmlwID0gcmVxdWlyZSgnc3RyaXAtYW5zaScpO1xuXG4gIHZhciBvdmVybGF5O1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLm92ZXJsYXkpIHtcbiAgICBvdmVybGF5ID0gcmVxdWlyZSgnLi9jbGllbnQtb3ZlcmxheScpO1xuICB9XG5cbiAgdmFyIHN0eWxlcyA9IHtcbiAgICBlcnJvcnM6IFwiY29sb3I6ICNmZjAwMDA7XCIsXG4gICAgd2FybmluZ3M6IFwiY29sb3I6ICM5OTk5MzM7XCJcbiAgfTtcbiAgdmFyIHByZXZpb3VzUHJvYmxlbXMgPSBudWxsO1xuICBmdW5jdGlvbiBsb2codHlwZSwgb2JqKSB7XG4gICAgdmFyIG5ld1Byb2JsZW1zID0gb2JqW3R5cGVdLm1hcChmdW5jdGlvbihtc2cpIHsgcmV0dXJuIHN0cmlwKG1zZyk7IH0pLmpvaW4oJ1xcbicpO1xuICAgIGlmIChwcmV2aW91c1Byb2JsZW1zID09IG5ld1Byb2JsZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZpb3VzUHJvYmxlbXMgPSBuZXdQcm9ibGVtcztcbiAgICB9XG5cbiAgICB2YXIgc3R5bGUgPSBzdHlsZXNbdHlwZV07XG4gICAgdmFyIG5hbWUgPSBvYmoubmFtZSA/IFwiJ1wiICsgb2JqLm5hbWUgKyBcIicgXCIgOiBcIlwiO1xuICAgIHZhciB0aXRsZSA9IFwiW0hNUl0gYnVuZGxlIFwiICsgbmFtZSArIFwiaGFzIFwiICsgb2JqW3R5cGVdLmxlbmd0aCArIFwiIFwiICsgdHlwZTtcbiAgICAvLyBOT1RFOiBjb25zb2xlLndhcm4gb3IgY29uc29sZS5lcnJvciB3aWxsIHByaW50IHRoZSBzdGFjayB0cmFjZVxuICAgIC8vIHdoaWNoIGlzbid0IGhlbHBmdWwgaGVyZSwgc28gdXNpbmcgY29uc29sZS5sb2cgdG8gZXNjYXBlIGl0LlxuICAgIGlmIChjb25zb2xlLmdyb3VwICYmIGNvbnNvbGUuZ3JvdXBFbmQpIHtcbiAgICAgIGNvbnNvbGUuZ3JvdXAoXCIlY1wiICsgdGl0bGUsIHN0eWxlKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG5ld1Byb2JsZW1zLCBzdHlsZSk7XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIiVjXCIgKyB0aXRsZSArIFwiXFxuXFx0JWNcIiArIG5ld1Byb2JsZW1zLnJlcGxhY2UoL1xcbi9nLCBcIlxcblxcdFwiKSxcbiAgICAgICAgc3R5bGUgKyBcImZvbnQtd2VpZ2h0OiBib2xkO1wiLFxuICAgICAgICBzdHlsZSArIFwiZm9udC13ZWlnaHQ6IG5vcm1hbDtcIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsZWFuUHJvYmxlbXNDYWNoZTogZnVuY3Rpb24gKCkge1xuICAgICAgcHJldmlvdXNQcm9ibGVtcyA9IG51bGw7XG4gICAgfSxcbiAgICBwcm9ibGVtczogZnVuY3Rpb24odHlwZSwgb2JqKSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgIGxvZyh0eXBlLCBvYmopO1xuICAgICAgfVxuICAgICAgaWYgKG92ZXJsYXkgJiYgdHlwZSAhPT0gJ3dhcm5pbmdzJykgb3ZlcmxheS5zaG93UHJvYmxlbXModHlwZSwgb2JqW3R5cGVdKTtcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG92ZXJsYXkpIG92ZXJsYXkuY2xlYXIoKTtcbiAgICB9LFxuICAgIHVzZUN1c3RvbU92ZXJsYXk6IGZ1bmN0aW9uKGN1c3RvbU92ZXJsYXkpIHtcbiAgICAgIG92ZXJsYXkgPSBjdXN0b21PdmVybGF5O1xuICAgIH1cbiAgfTtcbn1cblxudmFyIHByb2Nlc3NVcGRhdGUgPSByZXF1aXJlKCcuL3Byb2Nlc3MtdXBkYXRlJyk7XG5cbnZhciBjdXN0b21IYW5kbGVyO1xudmFyIHN1YnNjcmliZUFsbEhhbmRsZXI7XG5mdW5jdGlvbiBwcm9jZXNzTWVzc2FnZShvYmopIHtcbiAgc3dpdGNoKG9iai5hY3Rpb24pIHtcbiAgICBjYXNlIFwiYnVpbGRpbmdcIjpcbiAgICAgIGlmIChvcHRpb25zLmxvZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIltITVJdIGJ1bmRsZSBcIiArIChvYmoubmFtZSA/IFwiJ1wiICsgb2JqLm5hbWUgKyBcIicgXCIgOiBcIlwiKSArXG4gICAgICAgICAgXCJyZWJ1aWxkaW5nXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJidWlsdFwiOlxuICAgICAgaWYgKG9wdGlvbnMubG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiW0hNUl0gYnVuZGxlIFwiICsgKG9iai5uYW1lID8gXCInXCIgKyBvYmoubmFtZSArIFwiJyBcIiA6IFwiXCIpICtcbiAgICAgICAgICBcInJlYnVpbHQgaW4gXCIgKyBvYmoudGltZSArIFwibXNcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgY2FzZSBcInN5bmNcIjpcbiAgICAgIGlmIChvYmoubmFtZSAmJiBvcHRpb25zLm5hbWUgJiYgb2JqLm5hbWUgIT09IG9wdGlvbnMubmFtZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAob2JqLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChyZXBvcnRlcikgcmVwb3J0ZXIucHJvYmxlbXMoJ2Vycm9ycycsIG9iaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVwb3J0ZXIpIHtcbiAgICAgICAgICBpZiAob2JqLndhcm5pbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlcG9ydGVyLnByb2JsZW1zKCd3YXJuaW5ncycsIG9iaik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcG9ydGVyLmNsZWFuUHJvYmxlbXNDYWNoZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXBvcnRlci5zdWNjZXNzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc1VwZGF0ZShvYmouaGFzaCwgb2JqLm1vZHVsZXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChjdXN0b21IYW5kbGVyKSB7XG4gICAgICAgIGN1c3RvbUhhbmRsZXIob2JqKTtcbiAgICAgIH1cbiAgfVxuXG4gIGlmIChzdWJzY3JpYmVBbGxIYW5kbGVyKSB7XG4gICAgc3Vic2NyaWJlQWxsSGFuZGxlcihvYmopO1xuICB9XG59XG5cbmlmIChtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgc3Vic2NyaWJlQWxsOiBmdW5jdGlvbiBzdWJzY3JpYmVBbGwoaGFuZGxlcikge1xuICAgICAgc3Vic2NyaWJlQWxsSGFuZGxlciA9IGhhbmRsZXI7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIHN1YnNjcmliZShoYW5kbGVyKSB7XG4gICAgICBjdXN0b21IYW5kbGVyID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIHVzZUN1c3RvbU92ZXJsYXk6IGZ1bmN0aW9uIHVzZUN1c3RvbU92ZXJsYXkoY3VzdG9tT3ZlcmxheSkge1xuICAgICAgaWYgKHJlcG9ydGVyKSByZXBvcnRlci51c2VDdXN0b21PdmVybGF5KGN1c3RvbU92ZXJsYXkpO1xuICAgIH1cbiAgfTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQuanM/cGF0aD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBNzk2NSUyRl9fd2VicGFja19obXJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoMjM2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL21vZHVsZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmcvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3F1ZXJ5c3RyaW5nL2RlY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG9ialtrXS5tYXAoZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgYW5zaVJlZ2V4ID0gcmVxdWlyZSgnYW5zaS1yZWdleCcpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBzdHIucmVwbGFjZShhbnNpUmVnZXgsICcnKSA6IHN0cjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3RyaXAtYW5zaS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIC9bXFx1MDAxYlxcdTAwOWJdW1soKSM7P10qKD86WzAtOV17MSw0fSg/OjtbMC05XXswLDR9KSopP1swLTlBLVBSWmNmLW5xcnk9PjxdL2c7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyplc2xpbnQtZW52IGJyb3dzZXIqL1xuXG52YXIgY2xpZW50T3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY2xpZW50T3ZlcmxheS5pZCA9ICd3ZWJwYWNrLWhvdC1taWRkbGV3YXJlLWNsaWVudE92ZXJsYXknO1xudmFyIHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsMC44NSknLFxuICBjb2xvcjogJyNFOEU4RTgnLFxuICBsaW5lSGVpZ2h0OiAnMS4yJyxcbiAgd2hpdGVTcGFjZTogJ3ByZScsXG4gIGZvbnRGYW1pbHk6ICdNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gIGZvbnRTaXplOiAnMTNweCcsXG4gIHBvc2l0aW9uOiAnZml4ZWQnLFxuICB6SW5kZXg6IDk5OTksXG4gIHBhZGRpbmc6ICcxMHB4JyxcbiAgbGVmdDogMCxcbiAgcmlnaHQ6IDAsXG4gIHRvcDogMCxcbiAgYm90dG9tOiAwLFxuICBvdmVyZmxvdzogJ2F1dG8nLFxuICBkaXI6ICdsdHInLFxuICB0ZXh0QWxpZ246ICdsZWZ0J1xufTtcbmZvciAodmFyIGtleSBpbiBzdHlsZXMpIHtcbiAgY2xpZW50T3ZlcmxheS5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG59XG5cbnZhciBhbnNpSFRNTCA9IHJlcXVpcmUoJ2Fuc2ktaHRtbCcpO1xudmFyIGNvbG9ycyA9IHtcbiAgcmVzZXQ6IFsndHJhbnNwYXJlbnQnLCAndHJhbnNwYXJlbnQnXSxcbiAgYmxhY2s6ICcxODE4MTgnLFxuICByZWQ6ICdFMzYwNDknLFxuICBncmVlbjogJ0IzQ0I3NCcsXG4gIHllbGxvdzogJ0ZGRDA4MCcsXG4gIGJsdWU6ICc3Q0FGQzInLFxuICBtYWdlbnRhOiAnN0ZBQ0NBJyxcbiAgY3lhbjogJ0MzQzJFRicsXG4gIGxpZ2h0Z3JleTogJ0VCRTdFMycsXG4gIGRhcmtncmV5OiAnNkQ3ODkxJ1xufTtcbmFuc2lIVE1MLnNldENvbG9ycyhjb2xvcnMpO1xuXG52YXIgRW50aXRpZXMgPSByZXF1aXJlKCdodG1sLWVudGl0aWVzJykuQWxsSHRtbEVudGl0aWVzO1xudmFyIGVudGl0aWVzID0gbmV3IEVudGl0aWVzKCk7XG5cbmV4cG9ydHMuc2hvd1Byb2JsZW1zID1cbmZ1bmN0aW9uIHNob3dQcm9ibGVtcyh0eXBlLCBsaW5lcykge1xuICBjbGllbnRPdmVybGF5LmlubmVySFRNTCA9ICcnO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgIG1zZyA9IGFuc2lIVE1MKGVudGl0aWVzLmVuY29kZShtc2cpKTtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyNnB4JztcbiAgICBkaXYuaW5uZXJIVE1MID0gcHJvYmxlbVR5cGUodHlwZSkgKyAnIGluICcgKyBtc2c7XG4gICAgY2xpZW50T3ZlcmxheS5hcHBlbmRDaGlsZChkaXYpO1xuICB9KTtcbiAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsaWVudE92ZXJsYXkpO1xuICB9XG59O1xuXG5leHBvcnRzLmNsZWFyID1cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBpZiAoZG9jdW1lbnQuYm9keSAmJiBjbGllbnRPdmVybGF5LnBhcmVudE5vZGUpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGNsaWVudE92ZXJsYXkpO1xuICB9XG59O1xuXG52YXIgcHJvYmxlbUNvbG9ycyA9IHtcbiAgZXJyb3JzOiBjb2xvcnMucmVkLFxuICB3YXJuaW5nczogY29sb3JzLnllbGxvd1xufTtcblxuZnVuY3Rpb24gcHJvYmxlbVR5cGUgKHR5cGUpIHtcbiAgdmFyIGNvbG9yID0gcHJvYmxlbUNvbG9yc1t0eXBlXSB8fCBjb2xvcnMucmVkO1xuICByZXR1cm4gKFxuICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IycgKyBjb2xvciArICc7IGNvbG9yOiNmZmY7IHBhZGRpbmc6MnB4IDRweDsgYm9yZGVyLXJhZGl1czogMnB4XCI+JyArXG4gICAgICB0eXBlLnNsaWNlKDAsIC0xKS50b1VwcGVyQ2FzZSgpICtcbiAgICAnPC9zcGFuPidcbiAgKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQtb3ZlcmxheS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBhbnNpSFRNTFxuXG4vLyBSZWZlcmVuY2UgdG8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hbnNpLXJlZ2V4XG52YXIgX3JlZ0FOU0kgPSAvKD86KD86XFx1MDAxYlxcWyl8XFx1MDA5YikoPzooPzpbMC05XXsxLDN9KT8oPzooPzo7WzAtOV17MCwzfSkqKT9bQS1NfGYtbV0pfFxcdTAwMWJbQS1NXS9cblxudmFyIF9kZWZDb2xvcnMgPSB7XG4gIHJlc2V0OiBbJ2ZmZicsICcwMDAnXSwgLy8gW0ZPUkVHUk9VRF9DT0xPUiwgQkFDS0dST1VORF9DT0xPUl1cbiAgYmxhY2s6ICcwMDAnLFxuICByZWQ6ICdmZjAwMDAnLFxuICBncmVlbjogJzIwOTgwNScsXG4gIHllbGxvdzogJ2U4YmYwMycsXG4gIGJsdWU6ICcwMDAwZmYnLFxuICBtYWdlbnRhOiAnZmYwMGZmJyxcbiAgY3lhbjogJzAwZmZlZScsXG4gIGxpZ2h0Z3JleTogJ2YwZjBmMCcsXG4gIGRhcmtncmV5OiAnODg4J1xufVxudmFyIF9zdHlsZXMgPSB7XG4gIDMwOiAnYmxhY2snLFxuICAzMTogJ3JlZCcsXG4gIDMyOiAnZ3JlZW4nLFxuICAzMzogJ3llbGxvdycsXG4gIDM0OiAnYmx1ZScsXG4gIDM1OiAnbWFnZW50YScsXG4gIDM2OiAnY3lhbicsXG4gIDM3OiAnbGlnaHRncmV5J1xufVxudmFyIF9vcGVuVGFncyA9IHtcbiAgJzEnOiAnZm9udC13ZWlnaHQ6Ym9sZCcsIC8vIGJvbGRcbiAgJzInOiAnb3BhY2l0eTowLjUnLCAvLyBkaW1cbiAgJzMnOiAnPGk+JywgLy8gaXRhbGljXG4gICc0JzogJzx1PicsIC8vIHVuZGVyc2NvcmVcbiAgJzgnOiAnZGlzcGxheTpub25lJywgLy8gaGlkZGVuXG4gICc5JzogJzxkZWw+JyAvLyBkZWxldGVcbn1cbnZhciBfY2xvc2VUYWdzID0ge1xuICAnMjMnOiAnPC9pPicsIC8vIHJlc2V0IGl0YWxpY1xuICAnMjQnOiAnPC91PicsIC8vIHJlc2V0IHVuZGVyc2NvcmVcbiAgJzI5JzogJzwvZGVsPicgLy8gcmVzZXQgZGVsZXRlXG59XG5cbjtbMCwgMjEsIDIyLCAyNywgMjgsIDM5LCA0OV0uZm9yRWFjaChmdW5jdGlvbiAobikge1xuICBfY2xvc2VUYWdzW25dID0gJzwvc3Bhbj4nXG59KVxuXG4vKipcbiAqIENvbnZlcnRzIHRleHQgd2l0aCBBTlNJIGNvbG9yIGNvZGVzIHRvIEhUTUwgbWFya3VwLlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBhbnNpSFRNTCAodGV4dCkge1xuICAvLyBSZXR1cm5zIHRoZSB0ZXh0IGlmIHRoZSBzdHJpbmcgaGFzIG5vIEFOU0kgZXNjYXBlIGNvZGUuXG4gIGlmICghX3JlZ0FOU0kudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cblxuICAvLyBDYWNoZSBvcGVuZWQgc2VxdWVuY2UuXG4gIHZhciBhbnNpQ29kZXMgPSBbXVxuICAvLyBSZXBsYWNlIHdpdGggbWFya3VwLlxuICB2YXIgcmV0ID0gdGV4dC5yZXBsYWNlKC9cXDAzM1xcWyhcXGQrKSptL2csIGZ1bmN0aW9uIChtYXRjaCwgc2VxKSB7XG4gICAgdmFyIG90ID0gX29wZW5UYWdzW3NlcV1cbiAgICBpZiAob3QpIHtcbiAgICAgIC8vIElmIGN1cnJlbnQgc2VxdWVuY2UgaGFzIGJlZW4gb3BlbmVkLCBjbG9zZSBpdC5cbiAgICAgIGlmICghIX5hbnNpQ29kZXMuaW5kZXhPZihzZXEpKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XG4gICAgICAgIGFuc2lDb2Rlcy5wb3AoKVxuICAgICAgICByZXR1cm4gJzwvc3Bhbj4nXG4gICAgICB9XG4gICAgICAvLyBPcGVuIHRhZy5cbiAgICAgIGFuc2lDb2Rlcy5wdXNoKHNlcSlcbiAgICAgIHJldHVybiBvdFswXSA9PT0gJzwnID8gb3QgOiAnPHNwYW4gc3R5bGU9XCInICsgb3QgKyAnO1wiPidcbiAgICB9XG5cbiAgICB2YXIgY3QgPSBfY2xvc2VUYWdzW3NlcV1cbiAgICBpZiAoY3QpIHtcbiAgICAgIC8vIFBvcCBzZXF1ZW5jZVxuICAgICAgYW5zaUNvZGVzLnBvcCgpXG4gICAgICByZXR1cm4gY3RcbiAgICB9XG4gICAgcmV0dXJuICcnXG4gIH0pXG5cbiAgLy8gTWFrZSBzdXJlIHRhZ3MgYXJlIGNsb3NlZC5cbiAgdmFyIGwgPSBhbnNpQ29kZXMubGVuZ3RoXG4gIDsobCA+IDApICYmIChyZXQgKz0gQXJyYXkobCArIDEpLmpvaW4oJzwvc3Bhbj4nKSlcblxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogQ3VzdG9taXplIGNvbG9ycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2xvcnMgcmVmZXJlbmNlIHRvIF9kZWZDb2xvcnNcbiAqL1xuYW5zaUhUTUwuc2V0Q29sb3JzID0gZnVuY3Rpb24gKGNvbG9ycykge1xuICBpZiAodHlwZW9mIGNvbG9ycyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bjb2xvcnNgIHBhcmFtZXRlciBtdXN0IGJlIGFuIE9iamVjdC4nKVxuICB9XG5cbiAgdmFyIF9maW5hbENvbG9ycyA9IHt9XG4gIGZvciAodmFyIGtleSBpbiBfZGVmQ29sb3JzKSB7XG4gICAgdmFyIGhleCA9IGNvbG9ycy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gY29sb3JzW2tleV0gOiBudWxsXG4gICAgaWYgKCFoZXgpIHtcbiAgICAgIF9maW5hbENvbG9yc1trZXldID0gX2RlZkNvbG9yc1trZXldXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBpZiAoJ3Jlc2V0JyA9PT0ga2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGhleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaGV4ID0gW2hleF1cbiAgICAgIH1cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShoZXgpIHx8IGhleC5sZW5ndGggPT09IDAgfHwgaGV4LnNvbWUoZnVuY3Rpb24gKGgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBoICE9PSAnc3RyaW5nJ1xuICAgICAgfSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdmFsdWUgb2YgYCcgKyBrZXkgKyAnYCBwcm9wZXJ0eSBtdXN0IGJlIGFuIEFycmF5IGFuZCBlYWNoIGl0ZW0gY291bGQgb25seSBiZSBhIGhleCBzdHJpbmcsIGUuZy46IEZGMDAwMCcpXG4gICAgICB9XG4gICAgICB2YXIgZGVmSGV4Q29sb3IgPSBfZGVmQ29sb3JzW2tleV1cbiAgICAgIGlmICghaGV4WzBdKSB7XG4gICAgICAgIGhleFswXSA9IGRlZkhleENvbG9yWzBdXG4gICAgICB9XG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gMSB8fCAhaGV4WzFdKSB7XG4gICAgICAgIGhleCA9IFtoZXhbMF1dXG4gICAgICAgIGhleC5wdXNoKGRlZkhleENvbG9yWzFdKVxuICAgICAgfVxuXG4gICAgICBoZXggPSBoZXguc2xpY2UoMCwgMilcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBoZXggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB2YWx1ZSBvZiBgJyArIGtleSArICdgIHByb3BlcnR5IG11c3QgYmUgYSBoZXggc3RyaW5nLCBlLmcuOiBGRjAwMDAnKVxuICAgIH1cbiAgICBfZmluYWxDb2xvcnNba2V5XSA9IGhleFxuICB9XG4gIF9zZXRUYWdzKF9maW5hbENvbG9ycylcbn1cblxuLyoqXG4gKiBSZXNldCBjb2xvcnMuXG4gKi9cbmFuc2lIVE1MLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICBfc2V0VGFncyhfZGVmQ29sb3JzKVxufVxuXG4vKipcbiAqIEV4cG9zZSB0YWdzLCBpbmNsdWRpbmcgb3BlbiBhbmQgY2xvc2UuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5hbnNpSFRNTC50YWdzID0ge31cblxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYW5zaUhUTUwudGFncywgJ29wZW4nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfb3BlblRhZ3MgfVxuICB9KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYW5zaUhUTUwudGFncywgJ2Nsb3NlJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX2Nsb3NlVGFncyB9XG4gIH0pXG59IGVsc2Uge1xuICBhbnNpSFRNTC50YWdzLm9wZW4gPSBfb3BlblRhZ3NcbiAgYW5zaUhUTUwudGFncy5jbG9zZSA9IF9jbG9zZVRhZ3Ncbn1cblxuZnVuY3Rpb24gX3NldFRhZ3MgKGNvbG9ycykge1xuICAvLyByZXNldCBhbGxcbiAgX29wZW5UYWdzWycwJ10gPSAnZm9udC13ZWlnaHQ6bm9ybWFsO29wYWNpdHk6MTtjb2xvcjojJyArIGNvbG9ycy5yZXNldFswXSArICc7YmFja2dyb3VuZDojJyArIGNvbG9ycy5yZXNldFsxXVxuICAvLyBpbnZlcnNlXG4gIF9vcGVuVGFnc1snNyddID0gJ2NvbG9yOiMnICsgY29sb3JzLnJlc2V0WzFdICsgJztiYWNrZ3JvdW5kOiMnICsgY29sb3JzLnJlc2V0WzBdXG4gIC8vIGRhcmsgZ3JleVxuICBfb3BlblRhZ3NbJzkwJ10gPSAnY29sb3I6IycgKyBjb2xvcnMuZGFya2dyZXlcblxuICBmb3IgKHZhciBjb2RlIGluIF9zdHlsZXMpIHtcbiAgICB2YXIgY29sb3IgPSBfc3R5bGVzW2NvZGVdXG4gICAgdmFyIG9yaUNvbG9yID0gY29sb3JzW2NvbG9yXSB8fCAnMDAwJ1xuICAgIF9vcGVuVGFnc1tjb2RlXSA9ICdjb2xvcjojJyArIG9yaUNvbG9yXG4gICAgY29kZSA9IHBhcnNlSW50KGNvZGUpXG4gICAgX29wZW5UYWdzWyhjb2RlICsgMTApLnRvU3RyaW5nKCldID0gJ2JhY2tncm91bmQ6IycgKyBvcmlDb2xvclxuICB9XG59XG5cbmFuc2lIVE1MLnJlc2V0KClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnNpLWh0bWwvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBYbWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIveG1sLWVudGl0aWVzLmpzJyksXG4gIEh0bWw0RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw0LWVudGl0aWVzLmpzJyksXG4gIEh0bWw1RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw1LWVudGl0aWVzLmpzJyksXG4gIEFsbEh0bWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIvaHRtbDUtZW50aXRpZXMuanMnKVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgQUxQSEFfSU5ERVggPSB7XG4gICAgJyZsdCc6ICc8JyxcbiAgICAnJmd0JzogJz4nLFxuICAgICcmcXVvdCc6ICdcIicsXG4gICAgJyZhcG9zJzogJ1xcJycsXG4gICAgJyZhbXAnOiAnJicsXG4gICAgJyZsdDsnOiAnPCcsXG4gICAgJyZndDsnOiAnPicsXG4gICAgJyZxdW90Oyc6ICdcIicsXG4gICAgJyZhcG9zOyc6ICdcXCcnLFxuICAgICcmYW1wOyc6ICcmJ1xufTtcblxudmFyIENIQVJfSU5ERVggPSB7XG4gICAgNjA6ICdsdCcsXG4gICAgNjI6ICdndCcsXG4gICAgMzQ6ICdxdW90JyxcbiAgICAzOTogJ2Fwb3MnLFxuICAgIDM4OiAnYW1wJ1xufTtcblxudmFyIENIQVJfU19JTkRFWCA9IHtcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAnXFwnJzogJyZhcG9zOycsXG4gICAgJyYnOiAnJmFtcDsnXG59O1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBYbWxFbnRpdGllcygpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuWG1sRW50aXRpZXMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC88fD58XCJ8J3wmL2csIGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIENIQVJfU19JTkRFWFtzXTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIFhtbEVudGl0aWVzLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgWG1sRW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblhtbEVudGl0aWVzLnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiM/WzAtOWEtekEtWl0rOz8vZywgZnVuY3Rpb24ocykge1xuICAgICAgICBpZiAocy5jaGFyQXQoMSkgPT09ICcjJykge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSBzLmNoYXJBdCgyKS50b0xvd2VyQ2FzZSgpID09PSAneCcgP1xuICAgICAgICAgICAgICAgIHBhcnNlSW50KHMuc3Vic3RyKDMpLCAxNikgOlxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHMuc3Vic3RyKDIpKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOKGNvZGUpIHx8IGNvZGUgPCAtMzI3NjggfHwgY29kZSA+IDY1NTM1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFMUEhBX0lOREVYW3NdIHx8IHM7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBYbWxFbnRpdGllcy5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IFhtbEVudGl0aWVzKCkuZGVjb2RlKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5YbWxFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIHZhciBhbHBoYSA9IENIQVJfSU5ERVhbY107XG4gICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjIDwgMzIgfHwgYyA+IDEyNikge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICcmIycgKyBjICsgJzsnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gWG1sRW50aXRpZXMuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBYbWxFbnRpdGllcygpLmVuY29kZU5vblVURihzdHIpO1xuIH07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuWG1sRW50aXRpZXMucHJvdG90eXBlLmVuY29kZU5vbkFTQ0lJID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgc3RyTGVuZ2h0ID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ2h0KSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDw9IDI1NSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0cltpKytdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9ICcmIycgKyBjICsgJzsnO1xuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBYbWxFbnRpdGllcy5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgWG1sRW50aXRpZXMoKS5lbmNvZGVOb25BU0NJSShzdHIpO1xuIH07XG5cbm1vZHVsZS5leHBvcnRzID0gWG1sRW50aXRpZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaHRtbC1lbnRpdGllcy9saWIveG1sLWVudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgSFRNTF9BTFBIQSA9IFsnYXBvcycsICduYnNwJywgJ2lleGNsJywgJ2NlbnQnLCAncG91bmQnLCAnY3VycmVuJywgJ3llbicsICdicnZiYXInLCAnc2VjdCcsICd1bWwnLCAnY29weScsICdvcmRmJywgJ2xhcXVvJywgJ25vdCcsICdzaHknLCAncmVnJywgJ21hY3InLCAnZGVnJywgJ3BsdXNtbicsICdzdXAyJywgJ3N1cDMnLCAnYWN1dGUnLCAnbWljcm8nLCAncGFyYScsICdtaWRkb3QnLCAnY2VkaWwnLCAnc3VwMScsICdvcmRtJywgJ3JhcXVvJywgJ2ZyYWMxNCcsICdmcmFjMTInLCAnZnJhYzM0JywgJ2lxdWVzdCcsICdBZ3JhdmUnLCAnQWFjdXRlJywgJ0FjaXJjJywgJ0F0aWxkZScsICdBdW1sJywgJ0FyaW5nJywgJ0FlbGlnJywgJ0NjZWRpbCcsICdFZ3JhdmUnLCAnRWFjdXRlJywgJ0VjaXJjJywgJ0V1bWwnLCAnSWdyYXZlJywgJ0lhY3V0ZScsICdJY2lyYycsICdJdW1sJywgJ0VUSCcsICdOdGlsZGUnLCAnT2dyYXZlJywgJ09hY3V0ZScsICdPY2lyYycsICdPdGlsZGUnLCAnT3VtbCcsICd0aW1lcycsICdPc2xhc2gnLCAnVWdyYXZlJywgJ1VhY3V0ZScsICdVY2lyYycsICdVdW1sJywgJ1lhY3V0ZScsICdUSE9STicsICdzemxpZycsICdhZ3JhdmUnLCAnYWFjdXRlJywgJ2FjaXJjJywgJ2F0aWxkZScsICdhdW1sJywgJ2FyaW5nJywgJ2FlbGlnJywgJ2NjZWRpbCcsICdlZ3JhdmUnLCAnZWFjdXRlJywgJ2VjaXJjJywgJ2V1bWwnLCAnaWdyYXZlJywgJ2lhY3V0ZScsICdpY2lyYycsICdpdW1sJywgJ2V0aCcsICdudGlsZGUnLCAnb2dyYXZlJywgJ29hY3V0ZScsICdvY2lyYycsICdvdGlsZGUnLCAnb3VtbCcsICdkaXZpZGUnLCAnb3NsYXNoJywgJ3VncmF2ZScsICd1YWN1dGUnLCAndWNpcmMnLCAndXVtbCcsICd5YWN1dGUnLCAndGhvcm4nLCAneXVtbCcsICdxdW90JywgJ2FtcCcsICdsdCcsICdndCcsICdPRWxpZycsICdvZWxpZycsICdTY2Fyb24nLCAnc2Nhcm9uJywgJ1l1bWwnLCAnY2lyYycsICd0aWxkZScsICdlbnNwJywgJ2Vtc3AnLCAndGhpbnNwJywgJ3p3bmonLCAnendqJywgJ2xybScsICdybG0nLCAnbmRhc2gnLCAnbWRhc2gnLCAnbHNxdW8nLCAncnNxdW8nLCAnc2JxdW8nLCAnbGRxdW8nLCAncmRxdW8nLCAnYmRxdW8nLCAnZGFnZ2VyJywgJ0RhZ2dlcicsICdwZXJtaWwnLCAnbHNhcXVvJywgJ3JzYXF1bycsICdldXJvJywgJ2Zub2YnLCAnQWxwaGEnLCAnQmV0YScsICdHYW1tYScsICdEZWx0YScsICdFcHNpbG9uJywgJ1pldGEnLCAnRXRhJywgJ1RoZXRhJywgJ0lvdGEnLCAnS2FwcGEnLCAnTGFtYmRhJywgJ011JywgJ051JywgJ1hpJywgJ09taWNyb24nLCAnUGknLCAnUmhvJywgJ1NpZ21hJywgJ1RhdScsICdVcHNpbG9uJywgJ1BoaScsICdDaGknLCAnUHNpJywgJ09tZWdhJywgJ2FscGhhJywgJ2JldGEnLCAnZ2FtbWEnLCAnZGVsdGEnLCAnZXBzaWxvbicsICd6ZXRhJywgJ2V0YScsICd0aGV0YScsICdpb3RhJywgJ2thcHBhJywgJ2xhbWJkYScsICdtdScsICdudScsICd4aScsICdvbWljcm9uJywgJ3BpJywgJ3JobycsICdzaWdtYWYnLCAnc2lnbWEnLCAndGF1JywgJ3Vwc2lsb24nLCAncGhpJywgJ2NoaScsICdwc2knLCAnb21lZ2EnLCAndGhldGFzeW0nLCAndXBzaWgnLCAncGl2JywgJ2J1bGwnLCAnaGVsbGlwJywgJ3ByaW1lJywgJ1ByaW1lJywgJ29saW5lJywgJ2ZyYXNsJywgJ3dlaWVycCcsICdpbWFnZScsICdyZWFsJywgJ3RyYWRlJywgJ2FsZWZzeW0nLCAnbGFycicsICd1YXJyJywgJ3JhcnInLCAnZGFycicsICdoYXJyJywgJ2NyYXJyJywgJ2xBcnInLCAndUFycicsICdyQXJyJywgJ2RBcnInLCAnaEFycicsICdmb3JhbGwnLCAncGFydCcsICdleGlzdCcsICdlbXB0eScsICduYWJsYScsICdpc2luJywgJ25vdGluJywgJ25pJywgJ3Byb2QnLCAnc3VtJywgJ21pbnVzJywgJ2xvd2FzdCcsICdyYWRpYycsICdwcm9wJywgJ2luZmluJywgJ2FuZycsICdhbmQnLCAnb3InLCAnY2FwJywgJ2N1cCcsICdpbnQnLCAndGhlcmU0JywgJ3NpbScsICdjb25nJywgJ2FzeW1wJywgJ25lJywgJ2VxdWl2JywgJ2xlJywgJ2dlJywgJ3N1YicsICdzdXAnLCAnbnN1YicsICdzdWJlJywgJ3N1cGUnLCAnb3BsdXMnLCAnb3RpbWVzJywgJ3BlcnAnLCAnc2RvdCcsICdsY2VpbCcsICdyY2VpbCcsICdsZmxvb3InLCAncmZsb29yJywgJ2xhbmcnLCAncmFuZycsICdsb3onLCAnc3BhZGVzJywgJ2NsdWJzJywgJ2hlYXJ0cycsICdkaWFtcyddO1xudmFyIEhUTUxfQ09ERVMgPSBbMzksIDE2MCwgMTYxLCAxNjIsIDE2MywgMTY0LCAxNjUsIDE2NiwgMTY3LCAxNjgsIDE2OSwgMTcwLCAxNzEsIDE3MiwgMTczLCAxNzQsIDE3NSwgMTc2LCAxNzcsIDE3OCwgMTc5LCAxODAsIDE4MSwgMTgyLCAxODMsIDE4NCwgMTg1LCAxODYsIDE4NywgMTg4LCAxODksIDE5MCwgMTkxLCAxOTIsIDE5MywgMTk0LCAxOTUsIDE5NiwgMTk3LCAxOTgsIDE5OSwgMjAwLCAyMDEsIDIwMiwgMjAzLCAyMDQsIDIwNSwgMjA2LCAyMDcsIDIwOCwgMjA5LCAyMTAsIDIxMSwgMjEyLCAyMTMsIDIxNCwgMjE1LCAyMTYsIDIxNywgMjE4LCAyMTksIDIyMCwgMjIxLCAyMjIsIDIyMywgMjI0LCAyMjUsIDIyNiwgMjI3LCAyMjgsIDIyOSwgMjMwLCAyMzEsIDIzMiwgMjMzLCAyMzQsIDIzNSwgMjM2LCAyMzcsIDIzOCwgMjM5LCAyNDAsIDI0MSwgMjQyLCAyNDMsIDI0NCwgMjQ1LCAyNDYsIDI0NywgMjQ4LCAyNDksIDI1MCwgMjUxLCAyNTIsIDI1MywgMjU0LCAyNTUsIDM0LCAzOCwgNjAsIDYyLCAzMzgsIDMzOSwgMzUyLCAzNTMsIDM3NiwgNzEwLCA3MzIsIDgxOTQsIDgxOTUsIDgyMDEsIDgyMDQsIDgyMDUsIDgyMDYsIDgyMDcsIDgyMTEsIDgyMTIsIDgyMTYsIDgyMTcsIDgyMTgsIDgyMjAsIDgyMjEsIDgyMjIsIDgyMjQsIDgyMjUsIDgyNDAsIDgyNDksIDgyNTAsIDgzNjQsIDQwMiwgOTEzLCA5MTQsIDkxNSwgOTE2LCA5MTcsIDkxOCwgOTE5LCA5MjAsIDkyMSwgOTIyLCA5MjMsIDkyNCwgOTI1LCA5MjYsIDkyNywgOTI4LCA5MjksIDkzMSwgOTMyLCA5MzMsIDkzNCwgOTM1LCA5MzYsIDkzNywgOTQ1LCA5NDYsIDk0NywgOTQ4LCA5NDksIDk1MCwgOTUxLCA5NTIsIDk1MywgOTU0LCA5NTUsIDk1NiwgOTU3LCA5NTgsIDk1OSwgOTYwLCA5NjEsIDk2MiwgOTYzLCA5NjQsIDk2NSwgOTY2LCA5NjcsIDk2OCwgOTY5LCA5NzcsIDk3OCwgOTgyLCA4MjI2LCA4MjMwLCA4MjQyLCA4MjQzLCA4MjU0LCA4MjYwLCA4NDcyLCA4NDY1LCA4NDc2LCA4NDgyLCA4NTAxLCA4NTkyLCA4NTkzLCA4NTk0LCA4NTk1LCA4NTk2LCA4NjI5LCA4NjU2LCA4NjU3LCA4NjU4LCA4NjU5LCA4NjYwLCA4NzA0LCA4NzA2LCA4NzA3LCA4NzA5LCA4NzExLCA4NzEyLCA4NzEzLCA4NzE1LCA4NzE5LCA4NzIxLCA4NzIyLCA4NzI3LCA4NzMwLCA4NzMzLCA4NzM0LCA4NzM2LCA4NzQzLCA4NzQ0LCA4NzQ1LCA4NzQ2LCA4NzQ3LCA4NzU2LCA4NzY0LCA4NzczLCA4Nzc2LCA4ODAwLCA4ODAxLCA4ODA0LCA4ODA1LCA4ODM0LCA4ODM1LCA4ODM2LCA4ODM4LCA4ODM5LCA4ODUzLCA4ODU1LCA4ODY5LCA4OTAxLCA4OTY4LCA4OTY5LCA4OTcwLCA4OTcxLCA5MDAxLCA5MDAyLCA5Njc0LCA5ODI0LCA5ODI3LCA5ODI5LCA5ODMwXTtcblxudmFyIGFscGhhSW5kZXggPSB7fTtcbnZhciBudW1JbmRleCA9IHt9O1xuXG52YXIgaSA9IDA7XG52YXIgbGVuZ3RoID0gSFRNTF9BTFBIQS5sZW5ndGg7XG53aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgIHZhciBhID0gSFRNTF9BTFBIQVtpXTtcbiAgICB2YXIgYyA9IEhUTUxfQ09ERVNbaV07XG4gICAgYWxwaGFJbmRleFthXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gICAgbnVtSW5kZXhbY10gPSBhO1xuICAgIGkrKztcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSHRtbDRFbnRpdGllcygpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYoIz9bXFx3XFxkXSspOz8vZywgZnVuY3Rpb24ocywgZW50aXR5KSB7XG4gICAgICAgIHZhciBjaHI7XG4gICAgICAgIGlmIChlbnRpdHkuY2hhckF0KDApID09PSBcIiNcIikge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSBlbnRpdHkuY2hhckF0KDEpLnRvTG93ZXJDYXNlKCkgPT09ICd4JyA/XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZW50aXR5LnN1YnN0cigyKSwgMTYpIDpcbiAgICAgICAgICAgICAgICBwYXJzZUludChlbnRpdHkuc3Vic3RyKDEpKTtcblxuICAgICAgICAgICAgaWYgKCEoaXNOYU4oY29kZSkgfHwgY29kZSA8IC0zMjc2OCB8fCBjb2RlID4gNjU1MzUpKSB7XG4gICAgICAgICAgICAgICAgY2hyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNociA9IGFscGhhSW5kZXhbZW50aXR5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hyIHx8IHM7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNEVudGl0aWVzKCkuZGVjb2RlKHN0cik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYWxwaGEgPSBudW1JbmRleFtzdHIuY2hhckNvZGVBdChpKV07XG4gICAgICAgIHJlc3VsdCArPSBhbHBoYSA/IFwiJlwiICsgYWxwaGEgKyBcIjtcIiA6IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgYWxwaGEgPSBudW1JbmRleFtjY107XG4gICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgfSBlbHNlIGlmIChjYyA8IDMyIHx8IGNjID4gMTI2KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCImI1wiICsgY2MgKyBcIjtcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGVOb25VVEYoc3RyKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPD0gMjU1KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyW2krK107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDRFbnRpdGllcygpLmVuY29kZU5vbkFTQ0lJKHN0cik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWw0RW50aXRpZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDQtZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBFTlRJVElFUyA9IFtbJ0FhY3V0ZScsIFsxOTNdXSwgWydhYWN1dGUnLCBbMjI1XV0sIFsnQWJyZXZlJywgWzI1OF1dLCBbJ2FicmV2ZScsIFsyNTldXSwgWydhYycsIFs4NzY2XV0sIFsnYWNkJywgWzg3NjddXSwgWydhY0UnLCBbODc2NiwgODE5XV0sIFsnQWNpcmMnLCBbMTk0XV0sIFsnYWNpcmMnLCBbMjI2XV0sIFsnYWN1dGUnLCBbMTgwXV0sIFsnQWN5JywgWzEwNDBdXSwgWydhY3knLCBbMTA3Ml1dLCBbJ0FFbGlnJywgWzE5OF1dLCBbJ2FlbGlnJywgWzIzMF1dLCBbJ2FmJywgWzgyODldXSwgWydBZnInLCBbMTIwMDY4XV0sIFsnYWZyJywgWzEyMDA5NF1dLCBbJ0FncmF2ZScsIFsxOTJdXSwgWydhZ3JhdmUnLCBbMjI0XV0sIFsnYWxlZnN5bScsIFs4NTAxXV0sIFsnYWxlcGgnLCBbODUwMV1dLCBbJ0FscGhhJywgWzkxM11dLCBbJ2FscGhhJywgWzk0NV1dLCBbJ0FtYWNyJywgWzI1Nl1dLCBbJ2FtYWNyJywgWzI1N11dLCBbJ2FtYWxnJywgWzEwODE1XV0sIFsnYW1wJywgWzM4XV0sIFsnQU1QJywgWzM4XV0sIFsnYW5kYW5kJywgWzEwODM3XV0sIFsnQW5kJywgWzEwODM1XV0sIFsnYW5kJywgWzg3NDNdXSwgWydhbmRkJywgWzEwODQ0XV0sIFsnYW5kc2xvcGUnLCBbMTA4NDBdXSwgWydhbmR2JywgWzEwODQyXV0sIFsnYW5nJywgWzg3MzZdXSwgWydhbmdlJywgWzEwNjYwXV0sIFsnYW5nbGUnLCBbODczNl1dLCBbJ2FuZ21zZGFhJywgWzEwNjY0XV0sIFsnYW5nbXNkYWInLCBbMTA2NjVdXSwgWydhbmdtc2RhYycsIFsxMDY2Nl1dLCBbJ2FuZ21zZGFkJywgWzEwNjY3XV0sIFsnYW5nbXNkYWUnLCBbMTA2NjhdXSwgWydhbmdtc2RhZicsIFsxMDY2OV1dLCBbJ2FuZ21zZGFnJywgWzEwNjcwXV0sIFsnYW5nbXNkYWgnLCBbMTA2NzFdXSwgWydhbmdtc2QnLCBbODczN11dLCBbJ2FuZ3J0JywgWzg3MzVdXSwgWydhbmdydHZiJywgWzg4OTRdXSwgWydhbmdydHZiZCcsIFsxMDY1M11dLCBbJ2FuZ3NwaCcsIFs4NzM4XV0sIFsnYW5nc3QnLCBbMTk3XV0sIFsnYW5nemFycicsIFs5MDg0XV0sIFsnQW9nb24nLCBbMjYwXV0sIFsnYW9nb24nLCBbMjYxXV0sIFsnQW9wZicsIFsxMjAxMjBdXSwgWydhb3BmJywgWzEyMDE0Nl1dLCBbJ2FwYWNpcicsIFsxMDg2M11dLCBbJ2FwJywgWzg3NzZdXSwgWydhcEUnLCBbMTA4NjRdXSwgWydhcGUnLCBbODc3OF1dLCBbJ2FwaWQnLCBbODc3OV1dLCBbJ2Fwb3MnLCBbMzldXSwgWydBcHBseUZ1bmN0aW9uJywgWzgyODldXSwgWydhcHByb3gnLCBbODc3Nl1dLCBbJ2FwcHJveGVxJywgWzg3NzhdXSwgWydBcmluZycsIFsxOTddXSwgWydhcmluZycsIFsyMjldXSwgWydBc2NyJywgWzExOTk2NF1dLCBbJ2FzY3InLCBbMTE5OTkwXV0sIFsnQXNzaWduJywgWzg3ODhdXSwgWydhc3QnLCBbNDJdXSwgWydhc3ltcCcsIFs4Nzc2XV0sIFsnYXN5bXBlcScsIFs4NzgxXV0sIFsnQXRpbGRlJywgWzE5NV1dLCBbJ2F0aWxkZScsIFsyMjddXSwgWydBdW1sJywgWzE5Nl1dLCBbJ2F1bWwnLCBbMjI4XV0sIFsnYXdjb25pbnQnLCBbODc1NV1dLCBbJ2F3aW50JywgWzEwNzY5XV0sIFsnYmFja2NvbmcnLCBbODc4MF1dLCBbJ2JhY2tlcHNpbG9uJywgWzEwMTRdXSwgWydiYWNrcHJpbWUnLCBbODI0NV1dLCBbJ2JhY2tzaW0nLCBbODc2NV1dLCBbJ2JhY2tzaW1lcScsIFs4OTA5XV0sIFsnQmFja3NsYXNoJywgWzg3MjZdXSwgWydCYXJ2JywgWzEwOTgzXV0sIFsnYmFydmVlJywgWzg4OTNdXSwgWydiYXJ3ZWQnLCBbODk2NV1dLCBbJ0JhcndlZCcsIFs4OTY2XV0sIFsnYmFyd2VkZ2UnLCBbODk2NV1dLCBbJ2JicmsnLCBbOTE0MV1dLCBbJ2Jicmt0YnJrJywgWzkxNDJdXSwgWydiY29uZycsIFs4NzgwXV0sIFsnQmN5JywgWzEwNDFdXSwgWydiY3knLCBbMTA3M11dLCBbJ2JkcXVvJywgWzgyMjJdXSwgWydiZWNhdXMnLCBbODc1N11dLCBbJ2JlY2F1c2UnLCBbODc1N11dLCBbJ0JlY2F1c2UnLCBbODc1N11dLCBbJ2JlbXB0eXYnLCBbMTA2NzJdXSwgWydiZXBzaScsIFsxMDE0XV0sIFsnYmVybm91JywgWzg0OTJdXSwgWydCZXJub3VsbGlzJywgWzg0OTJdXSwgWydCZXRhJywgWzkxNF1dLCBbJ2JldGEnLCBbOTQ2XV0sIFsnYmV0aCcsIFs4NTAyXV0sIFsnYmV0d2VlbicsIFs4ODEyXV0sIFsnQmZyJywgWzEyMDA2OV1dLCBbJ2JmcicsIFsxMjAwOTVdXSwgWydiaWdjYXAnLCBbODg5OF1dLCBbJ2JpZ2NpcmMnLCBbOTcxMV1dLCBbJ2JpZ2N1cCcsIFs4ODk5XV0sIFsnYmlnb2RvdCcsIFsxMDc1Ml1dLCBbJ2JpZ29wbHVzJywgWzEwNzUzXV0sIFsnYmlnb3RpbWVzJywgWzEwNzU0XV0sIFsnYmlnc3FjdXAnLCBbMTA3NThdXSwgWydiaWdzdGFyJywgWzk3MzNdXSwgWydiaWd0cmlhbmdsZWRvd24nLCBbOTY2MV1dLCBbJ2JpZ3RyaWFuZ2xldXAnLCBbOTY1MV1dLCBbJ2JpZ3VwbHVzJywgWzEwNzU2XV0sIFsnYmlndmVlJywgWzg4OTddXSwgWydiaWd3ZWRnZScsIFs4ODk2XV0sIFsnYmthcm93JywgWzEwNTA5XV0sIFsnYmxhY2tsb3plbmdlJywgWzEwNzMxXV0sIFsnYmxhY2tzcXVhcmUnLCBbOTY0Ml1dLCBbJ2JsYWNrdHJpYW5nbGUnLCBbOTY1Ml1dLCBbJ2JsYWNrdHJpYW5nbGVkb3duJywgWzk2NjJdXSwgWydibGFja3RyaWFuZ2xlbGVmdCcsIFs5NjY2XV0sIFsnYmxhY2t0cmlhbmdsZXJpZ2h0JywgWzk2NTZdXSwgWydibGFuaycsIFs5MjUxXV0sIFsnYmxrMTInLCBbOTYxOF1dLCBbJ2JsazE0JywgWzk2MTddXSwgWydibGszNCcsIFs5NjE5XV0sIFsnYmxvY2snLCBbOTYwOF1dLCBbJ2JuZScsIFs2MSwgODQyMV1dLCBbJ2JuZXF1aXYnLCBbODgwMSwgODQyMV1dLCBbJ2JOb3QnLCBbMTA5ODldXSwgWydibm90JywgWzg5NzZdXSwgWydCb3BmJywgWzEyMDEyMV1dLCBbJ2JvcGYnLCBbMTIwMTQ3XV0sIFsnYm90JywgWzg4NjldXSwgWydib3R0b20nLCBbODg2OV1dLCBbJ2Jvd3RpZScsIFs4OTA0XV0sIFsnYm94Ym94JywgWzEwNjk3XV0sIFsnYm94ZGwnLCBbOTQ4OF1dLCBbJ2JveGRMJywgWzk1NTddXSwgWydib3hEbCcsIFs5NTU4XV0sIFsnYm94REwnLCBbOTU1OV1dLCBbJ2JveGRyJywgWzk0ODRdXSwgWydib3hkUicsIFs5NTU0XV0sIFsnYm94RHInLCBbOTU1NV1dLCBbJ2JveERSJywgWzk1NTZdXSwgWydib3hoJywgWzk0NzJdXSwgWydib3hIJywgWzk1NTJdXSwgWydib3hoZCcsIFs5NTE2XV0sIFsnYm94SGQnLCBbOTU3Ml1dLCBbJ2JveGhEJywgWzk1NzNdXSwgWydib3hIRCcsIFs5NTc0XV0sIFsnYm94aHUnLCBbOTUyNF1dLCBbJ2JveEh1JywgWzk1NzVdXSwgWydib3hoVScsIFs5NTc2XV0sIFsnYm94SFUnLCBbOTU3N11dLCBbJ2JveG1pbnVzJywgWzg4NjNdXSwgWydib3hwbHVzJywgWzg4NjJdXSwgWydib3h0aW1lcycsIFs4ODY0XV0sIFsnYm94dWwnLCBbOTQ5Nl1dLCBbJ2JveHVMJywgWzk1NjNdXSwgWydib3hVbCcsIFs5NTY0XV0sIFsnYm94VUwnLCBbOTU2NV1dLCBbJ2JveHVyJywgWzk0OTJdXSwgWydib3h1UicsIFs5NTYwXV0sIFsnYm94VXInLCBbOTU2MV1dLCBbJ2JveFVSJywgWzk1NjJdXSwgWydib3h2JywgWzk0NzRdXSwgWydib3hWJywgWzk1NTNdXSwgWydib3h2aCcsIFs5NTMyXV0sIFsnYm94dkgnLCBbOTU3OF1dLCBbJ2JveFZoJywgWzk1NzldXSwgWydib3hWSCcsIFs5NTgwXV0sIFsnYm94dmwnLCBbOTUwOF1dLCBbJ2JveHZMJywgWzk1NjldXSwgWydib3hWbCcsIFs5NTcwXV0sIFsnYm94VkwnLCBbOTU3MV1dLCBbJ2JveHZyJywgWzk1MDBdXSwgWydib3h2UicsIFs5NTY2XV0sIFsnYm94VnInLCBbOTU2N11dLCBbJ2JveFZSJywgWzk1NjhdXSwgWydicHJpbWUnLCBbODI0NV1dLCBbJ2JyZXZlJywgWzcyOF1dLCBbJ0JyZXZlJywgWzcyOF1dLCBbJ2JydmJhcicsIFsxNjZdXSwgWydic2NyJywgWzExOTk5MV1dLCBbJ0JzY3InLCBbODQ5Ml1dLCBbJ2JzZW1pJywgWzgyNzFdXSwgWydic2ltJywgWzg3NjVdXSwgWydic2ltZScsIFs4OTA5XV0sIFsnYnNvbGInLCBbMTA2OTNdXSwgWydic29sJywgWzkyXV0sIFsnYnNvbGhzdWInLCBbMTAxODRdXSwgWydidWxsJywgWzgyMjZdXSwgWydidWxsZXQnLCBbODIyNl1dLCBbJ2J1bXAnLCBbODc4Ml1dLCBbJ2J1bXBFJywgWzEwOTI2XV0sIFsnYnVtcGUnLCBbODc4M11dLCBbJ0J1bXBlcScsIFs4NzgyXV0sIFsnYnVtcGVxJywgWzg3ODNdXSwgWydDYWN1dGUnLCBbMjYyXV0sIFsnY2FjdXRlJywgWzI2M11dLCBbJ2NhcGFuZCcsIFsxMDgyMF1dLCBbJ2NhcGJyY3VwJywgWzEwODI1XV0sIFsnY2FwY2FwJywgWzEwODI3XV0sIFsnY2FwJywgWzg3NDVdXSwgWydDYXAnLCBbODkxNF1dLCBbJ2NhcGN1cCcsIFsxMDgyM11dLCBbJ2NhcGRvdCcsIFsxMDgxNl1dLCBbJ0NhcGl0YWxEaWZmZXJlbnRpYWxEJywgWzg1MTddXSwgWydjYXBzJywgWzg3NDUsIDY1MDI0XV0sIFsnY2FyZXQnLCBbODI1N11dLCBbJ2Nhcm9uJywgWzcxMV1dLCBbJ0NheWxleXMnLCBbODQ5M11dLCBbJ2NjYXBzJywgWzEwODI5XV0sIFsnQ2Nhcm9uJywgWzI2OF1dLCBbJ2NjYXJvbicsIFsyNjldXSwgWydDY2VkaWwnLCBbMTk5XV0sIFsnY2NlZGlsJywgWzIzMV1dLCBbJ0NjaXJjJywgWzI2NF1dLCBbJ2NjaXJjJywgWzI2NV1dLCBbJ0Njb25pbnQnLCBbODc1Ml1dLCBbJ2NjdXBzJywgWzEwODI4XV0sIFsnY2N1cHNzbScsIFsxMDgzMl1dLCBbJ0Nkb3QnLCBbMjY2XV0sIFsnY2RvdCcsIFsyNjddXSwgWydjZWRpbCcsIFsxODRdXSwgWydDZWRpbGxhJywgWzE4NF1dLCBbJ2NlbXB0eXYnLCBbMTA2NzRdXSwgWydjZW50JywgWzE2Ml1dLCBbJ2NlbnRlcmRvdCcsIFsxODNdXSwgWydDZW50ZXJEb3QnLCBbMTgzXV0sIFsnY2ZyJywgWzEyMDA5Nl1dLCBbJ0NmcicsIFs4NDkzXV0sIFsnQ0hjeScsIFsxMDYzXV0sIFsnY2hjeScsIFsxMDk1XV0sIFsnY2hlY2snLCBbMTAwMDNdXSwgWydjaGVja21hcmsnLCBbMTAwMDNdXSwgWydDaGknLCBbOTM1XV0sIFsnY2hpJywgWzk2N11dLCBbJ2NpcmMnLCBbNzEwXV0sIFsnY2lyY2VxJywgWzg3OTFdXSwgWydjaXJjbGVhcnJvd2xlZnQnLCBbODYzNF1dLCBbJ2NpcmNsZWFycm93cmlnaHQnLCBbODYzNV1dLCBbJ2NpcmNsZWRhc3QnLCBbODg1OV1dLCBbJ2NpcmNsZWRjaXJjJywgWzg4NThdXSwgWydjaXJjbGVkZGFzaCcsIFs4ODYxXV0sIFsnQ2lyY2xlRG90JywgWzg4NTddXSwgWydjaXJjbGVkUicsIFsxNzRdXSwgWydjaXJjbGVkUycsIFs5NDE2XV0sIFsnQ2lyY2xlTWludXMnLCBbODg1NF1dLCBbJ0NpcmNsZVBsdXMnLCBbODg1M11dLCBbJ0NpcmNsZVRpbWVzJywgWzg4NTVdXSwgWydjaXInLCBbOTY3NV1dLCBbJ2NpckUnLCBbMTA2OTFdXSwgWydjaXJlJywgWzg3OTFdXSwgWydjaXJmbmludCcsIFsxMDc2OF1dLCBbJ2Npcm1pZCcsIFsxMDk5MV1dLCBbJ2NpcnNjaXInLCBbMTA2OTBdXSwgWydDbG9ja3dpc2VDb250b3VySW50ZWdyYWwnLCBbODc1NF1dLCBbJ2NsdWJzJywgWzk4MjddXSwgWydjbHVic3VpdCcsIFs5ODI3XV0sIFsnY29sb24nLCBbNThdXSwgWydDb2xvbicsIFs4NzU5XV0sIFsnQ29sb25lJywgWzEwODY4XV0sIFsnY29sb25lJywgWzg3ODhdXSwgWydjb2xvbmVxJywgWzg3ODhdXSwgWydjb21tYScsIFs0NF1dLCBbJ2NvbW1hdCcsIFs2NF1dLCBbJ2NvbXAnLCBbODcwNV1dLCBbJ2NvbXBmbicsIFs4NzI4XV0sIFsnY29tcGxlbWVudCcsIFs4NzA1XV0sIFsnY29tcGxleGVzJywgWzg0NTBdXSwgWydjb25nJywgWzg3NzNdXSwgWydjb25nZG90JywgWzEwODYxXV0sIFsnQ29uZ3J1ZW50JywgWzg4MDFdXSwgWydjb25pbnQnLCBbODc1MF1dLCBbJ0NvbmludCcsIFs4NzUxXV0sIFsnQ29udG91ckludGVncmFsJywgWzg3NTBdXSwgWydjb3BmJywgWzEyMDE0OF1dLCBbJ0NvcGYnLCBbODQ1MF1dLCBbJ2NvcHJvZCcsIFs4NzIwXV0sIFsnQ29wcm9kdWN0JywgWzg3MjBdXSwgWydjb3B5JywgWzE2OV1dLCBbJ0NPUFknLCBbMTY5XV0sIFsnY29weXNyJywgWzg0NzFdXSwgWydDb3VudGVyQ2xvY2t3aXNlQ29udG91ckludGVncmFsJywgWzg3NTVdXSwgWydjcmFycicsIFs4NjI5XV0sIFsnY3Jvc3MnLCBbMTAwMDddXSwgWydDcm9zcycsIFsxMDc5OV1dLCBbJ0NzY3InLCBbMTE5OTY2XV0sIFsnY3NjcicsIFsxMTk5OTJdXSwgWydjc3ViJywgWzEwOTU5XV0sIFsnY3N1YmUnLCBbMTA5NjFdXSwgWydjc3VwJywgWzEwOTYwXV0sIFsnY3N1cGUnLCBbMTA5NjJdXSwgWydjdGRvdCcsIFs4OTQzXV0sIFsnY3VkYXJybCcsIFsxMDU1Ml1dLCBbJ2N1ZGFycnInLCBbMTA1NDldXSwgWydjdWVwcicsIFs4OTI2XV0sIFsnY3Vlc2MnLCBbODkyN11dLCBbJ2N1bGFycicsIFs4NjMwXV0sIFsnY3VsYXJycCcsIFsxMDU1N11dLCBbJ2N1cGJyY2FwJywgWzEwODI0XV0sIFsnY3VwY2FwJywgWzEwODIyXV0sIFsnQ3VwQ2FwJywgWzg3ODFdXSwgWydjdXAnLCBbODc0Nl1dLCBbJ0N1cCcsIFs4OTE1XV0sIFsnY3VwY3VwJywgWzEwODI2XV0sIFsnY3VwZG90JywgWzg4NDVdXSwgWydjdXBvcicsIFsxMDgyMV1dLCBbJ2N1cHMnLCBbODc0NiwgNjUwMjRdXSwgWydjdXJhcnInLCBbODYzMV1dLCBbJ2N1cmFycm0nLCBbMTA1NTZdXSwgWydjdXJseWVxcHJlYycsIFs4OTI2XV0sIFsnY3VybHllcXN1Y2MnLCBbODkyN11dLCBbJ2N1cmx5dmVlJywgWzg5MTBdXSwgWydjdXJseXdlZGdlJywgWzg5MTFdXSwgWydjdXJyZW4nLCBbMTY0XV0sIFsnY3VydmVhcnJvd2xlZnQnLCBbODYzMF1dLCBbJ2N1cnZlYXJyb3dyaWdodCcsIFs4NjMxXV0sIFsnY3V2ZWUnLCBbODkxMF1dLCBbJ2N1d2VkJywgWzg5MTFdXSwgWydjd2NvbmludCcsIFs4NzU0XV0sIFsnY3dpbnQnLCBbODc1M11dLCBbJ2N5bGN0eScsIFs5MDA1XV0sIFsnZGFnZ2VyJywgWzgyMjRdXSwgWydEYWdnZXInLCBbODIyNV1dLCBbJ2RhbGV0aCcsIFs4NTA0XV0sIFsnZGFycicsIFs4NTk1XV0sIFsnRGFycicsIFs4NjA5XV0sIFsnZEFycicsIFs4NjU5XV0sIFsnZGFzaCcsIFs4MjA4XV0sIFsnRGFzaHYnLCBbMTA5ODBdXSwgWydkYXNodicsIFs4ODY3XV0sIFsnZGJrYXJvdycsIFsxMDUxMV1dLCBbJ2RibGFjJywgWzczM11dLCBbJ0RjYXJvbicsIFsyNzBdXSwgWydkY2Fyb24nLCBbMjcxXV0sIFsnRGN5JywgWzEwNDRdXSwgWydkY3knLCBbMTA3Nl1dLCBbJ2RkYWdnZXInLCBbODIyNV1dLCBbJ2RkYXJyJywgWzg2NTBdXSwgWydERCcsIFs4NTE3XV0sIFsnZGQnLCBbODUxOF1dLCBbJ0REb3RyYWhkJywgWzEwNTEzXV0sIFsnZGRvdHNlcScsIFsxMDg3MV1dLCBbJ2RlZycsIFsxNzZdXSwgWydEZWwnLCBbODcxMV1dLCBbJ0RlbHRhJywgWzkxNl1dLCBbJ2RlbHRhJywgWzk0OF1dLCBbJ2RlbXB0eXYnLCBbMTA2NzNdXSwgWydkZmlzaHQnLCBbMTA2MjNdXSwgWydEZnInLCBbMTIwMDcxXV0sIFsnZGZyJywgWzEyMDA5N11dLCBbJ2RIYXInLCBbMTA1OTddXSwgWydkaGFybCcsIFs4NjQzXV0sIFsnZGhhcnInLCBbODY0Ml1dLCBbJ0RpYWNyaXRpY2FsQWN1dGUnLCBbMTgwXV0sIFsnRGlhY3JpdGljYWxEb3QnLCBbNzI5XV0sIFsnRGlhY3JpdGljYWxEb3VibGVBY3V0ZScsIFs3MzNdXSwgWydEaWFjcml0aWNhbEdyYXZlJywgWzk2XV0sIFsnRGlhY3JpdGljYWxUaWxkZScsIFs3MzJdXSwgWydkaWFtJywgWzg5MDBdXSwgWydkaWFtb25kJywgWzg5MDBdXSwgWydEaWFtb25kJywgWzg5MDBdXSwgWydkaWFtb25kc3VpdCcsIFs5ODMwXV0sIFsnZGlhbXMnLCBbOTgzMF1dLCBbJ2RpZScsIFsxNjhdXSwgWydEaWZmZXJlbnRpYWxEJywgWzg1MThdXSwgWydkaWdhbW1hJywgWzk4OV1dLCBbJ2Rpc2luJywgWzg5NDZdXSwgWydkaXYnLCBbMjQ3XV0sIFsnZGl2aWRlJywgWzI0N11dLCBbJ2RpdmlkZW9udGltZXMnLCBbODkwM11dLCBbJ2Rpdm9ueCcsIFs4OTAzXV0sIFsnREpjeScsIFsxMDI2XV0sIFsnZGpjeScsIFsxMTA2XV0sIFsnZGxjb3JuJywgWzg5OTBdXSwgWydkbGNyb3AnLCBbODk3M11dLCBbJ2RvbGxhcicsIFszNl1dLCBbJ0RvcGYnLCBbMTIwMTIzXV0sIFsnZG9wZicsIFsxMjAxNDldXSwgWydEb3QnLCBbMTY4XV0sIFsnZG90JywgWzcyOV1dLCBbJ0RvdERvdCcsIFs4NDEyXV0sIFsnZG90ZXEnLCBbODc4NF1dLCBbJ2RvdGVxZG90JywgWzg3ODVdXSwgWydEb3RFcXVhbCcsIFs4Nzg0XV0sIFsnZG90bWludXMnLCBbODc2MF1dLCBbJ2RvdHBsdXMnLCBbODcyNF1dLCBbJ2RvdHNxdWFyZScsIFs4ODY1XV0sIFsnZG91YmxlYmFyd2VkZ2UnLCBbODk2Nl1dLCBbJ0RvdWJsZUNvbnRvdXJJbnRlZ3JhbCcsIFs4NzUxXV0sIFsnRG91YmxlRG90JywgWzE2OF1dLCBbJ0RvdWJsZURvd25BcnJvdycsIFs4NjU5XV0sIFsnRG91YmxlTGVmdEFycm93JywgWzg2NTZdXSwgWydEb3VibGVMZWZ0UmlnaHRBcnJvdycsIFs4NjYwXV0sIFsnRG91YmxlTGVmdFRlZScsIFsxMDk4MF1dLCBbJ0RvdWJsZUxvbmdMZWZ0QXJyb3cnLCBbMTAyMzJdXSwgWydEb3VibGVMb25nTGVmdFJpZ2h0QXJyb3cnLCBbMTAyMzRdXSwgWydEb3VibGVMb25nUmlnaHRBcnJvdycsIFsxMDIzM11dLCBbJ0RvdWJsZVJpZ2h0QXJyb3cnLCBbODY1OF1dLCBbJ0RvdWJsZVJpZ2h0VGVlJywgWzg4NzJdXSwgWydEb3VibGVVcEFycm93JywgWzg2NTddXSwgWydEb3VibGVVcERvd25BcnJvdycsIFs4NjYxXV0sIFsnRG91YmxlVmVydGljYWxCYXInLCBbODc0MV1dLCBbJ0Rvd25BcnJvd0JhcicsIFsxMDUxNV1dLCBbJ2Rvd25hcnJvdycsIFs4NTk1XV0sIFsnRG93bkFycm93JywgWzg1OTVdXSwgWydEb3duYXJyb3cnLCBbODY1OV1dLCBbJ0Rvd25BcnJvd1VwQXJyb3cnLCBbODY5M11dLCBbJ0Rvd25CcmV2ZScsIFs3ODVdXSwgWydkb3duZG93bmFycm93cycsIFs4NjUwXV0sIFsnZG93bmhhcnBvb25sZWZ0JywgWzg2NDNdXSwgWydkb3duaGFycG9vbnJpZ2h0JywgWzg2NDJdXSwgWydEb3duTGVmdFJpZ2h0VmVjdG9yJywgWzEwNTc2XV0sIFsnRG93bkxlZnRUZWVWZWN0b3InLCBbMTA1OTBdXSwgWydEb3duTGVmdFZlY3RvckJhcicsIFsxMDU4Ml1dLCBbJ0Rvd25MZWZ0VmVjdG9yJywgWzg2MzddXSwgWydEb3duUmlnaHRUZWVWZWN0b3InLCBbMTA1OTFdXSwgWydEb3duUmlnaHRWZWN0b3JCYXInLCBbMTA1ODNdXSwgWydEb3duUmlnaHRWZWN0b3InLCBbODY0MV1dLCBbJ0Rvd25UZWVBcnJvdycsIFs4NjE1XV0sIFsnRG93blRlZScsIFs4ODY4XV0sIFsnZHJia2Fyb3cnLCBbMTA1MTJdXSwgWydkcmNvcm4nLCBbODk5MV1dLCBbJ2RyY3JvcCcsIFs4OTcyXV0sIFsnRHNjcicsIFsxMTk5NjddXSwgWydkc2NyJywgWzExOTk5M11dLCBbJ0RTY3knLCBbMTAyOV1dLCBbJ2RzY3knLCBbMTEwOV1dLCBbJ2Rzb2wnLCBbMTA3NDJdXSwgWydEc3Ryb2snLCBbMjcyXV0sIFsnZHN0cm9rJywgWzI3M11dLCBbJ2R0ZG90JywgWzg5NDVdXSwgWydkdHJpJywgWzk2NjNdXSwgWydkdHJpZicsIFs5NjYyXV0sIFsnZHVhcnInLCBbODY5M11dLCBbJ2R1aGFyJywgWzEwNjA3XV0sIFsnZHdhbmdsZScsIFsxMDY2Ml1dLCBbJ0RaY3knLCBbMTAzOV1dLCBbJ2R6Y3knLCBbMTExOV1dLCBbJ2R6aWdyYXJyJywgWzEwMjM5XV0sIFsnRWFjdXRlJywgWzIwMV1dLCBbJ2VhY3V0ZScsIFsyMzNdXSwgWydlYXN0ZXInLCBbMTA4NjJdXSwgWydFY2Fyb24nLCBbMjgyXV0sIFsnZWNhcm9uJywgWzI4M11dLCBbJ0VjaXJjJywgWzIwMl1dLCBbJ2VjaXJjJywgWzIzNF1dLCBbJ2VjaXInLCBbODc5MF1dLCBbJ2Vjb2xvbicsIFs4Nzg5XV0sIFsnRWN5JywgWzEwNjldXSwgWydlY3knLCBbMTEwMV1dLCBbJ2VERG90JywgWzEwODcxXV0sIFsnRWRvdCcsIFsyNzhdXSwgWydlZG90JywgWzI3OV1dLCBbJ2VEb3QnLCBbODc4NV1dLCBbJ2VlJywgWzg1MTldXSwgWydlZkRvdCcsIFs4Nzg2XV0sIFsnRWZyJywgWzEyMDA3Ml1dLCBbJ2VmcicsIFsxMjAwOThdXSwgWydlZycsIFsxMDkwNl1dLCBbJ0VncmF2ZScsIFsyMDBdXSwgWydlZ3JhdmUnLCBbMjMyXV0sIFsnZWdzJywgWzEwOTAyXV0sIFsnZWdzZG90JywgWzEwOTA0XV0sIFsnZWwnLCBbMTA5MDVdXSwgWydFbGVtZW50JywgWzg3MTJdXSwgWydlbGludGVycycsIFs5MTkxXV0sIFsnZWxsJywgWzg0NjddXSwgWydlbHMnLCBbMTA5MDFdXSwgWydlbHNkb3QnLCBbMTA5MDNdXSwgWydFbWFjcicsIFsyNzRdXSwgWydlbWFjcicsIFsyNzVdXSwgWydlbXB0eScsIFs4NzA5XV0sIFsnZW1wdHlzZXQnLCBbODcwOV1dLCBbJ0VtcHR5U21hbGxTcXVhcmUnLCBbOTcyM11dLCBbJ2VtcHR5dicsIFs4NzA5XV0sIFsnRW1wdHlWZXJ5U21hbGxTcXVhcmUnLCBbOTY0M11dLCBbJ2Vtc3AxMycsIFs4MTk2XV0sIFsnZW1zcDE0JywgWzgxOTddXSwgWydlbXNwJywgWzgxOTVdXSwgWydFTkcnLCBbMzMwXV0sIFsnZW5nJywgWzMzMV1dLCBbJ2Vuc3AnLCBbODE5NF1dLCBbJ0VvZ29uJywgWzI4MF1dLCBbJ2VvZ29uJywgWzI4MV1dLCBbJ0VvcGYnLCBbMTIwMTI0XV0sIFsnZW9wZicsIFsxMjAxNTBdXSwgWydlcGFyJywgWzg5MTddXSwgWydlcGFyc2wnLCBbMTA3MjNdXSwgWydlcGx1cycsIFsxMDg2NV1dLCBbJ2Vwc2knLCBbOTQ5XV0sIFsnRXBzaWxvbicsIFs5MTddXSwgWydlcHNpbG9uJywgWzk0OV1dLCBbJ2Vwc2l2JywgWzEwMTNdXSwgWydlcWNpcmMnLCBbODc5MF1dLCBbJ2VxY29sb24nLCBbODc4OV1dLCBbJ2Vxc2ltJywgWzg3NzBdXSwgWydlcXNsYW50Z3RyJywgWzEwOTAyXV0sIFsnZXFzbGFudGxlc3MnLCBbMTA5MDFdXSwgWydFcXVhbCcsIFsxMDg2OV1dLCBbJ2VxdWFscycsIFs2MV1dLCBbJ0VxdWFsVGlsZGUnLCBbODc3MF1dLCBbJ2VxdWVzdCcsIFs4Nzk5XV0sIFsnRXF1aWxpYnJpdW0nLCBbODY1Ml1dLCBbJ2VxdWl2JywgWzg4MDFdXSwgWydlcXVpdkREJywgWzEwODcyXV0sIFsnZXF2cGFyc2wnLCBbMTA3MjVdXSwgWydlcmFycicsIFsxMDYwOV1dLCBbJ2VyRG90JywgWzg3ODddXSwgWydlc2NyJywgWzg0OTVdXSwgWydFc2NyJywgWzg0OTZdXSwgWydlc2RvdCcsIFs4Nzg0XV0sIFsnRXNpbScsIFsxMDg2N11dLCBbJ2VzaW0nLCBbODc3MF1dLCBbJ0V0YScsIFs5MTldXSwgWydldGEnLCBbOTUxXV0sIFsnRVRIJywgWzIwOF1dLCBbJ2V0aCcsIFsyNDBdXSwgWydFdW1sJywgWzIwM11dLCBbJ2V1bWwnLCBbMjM1XV0sIFsnZXVybycsIFs4MzY0XV0sIFsnZXhjbCcsIFszM11dLCBbJ2V4aXN0JywgWzg3MDddXSwgWydFeGlzdHMnLCBbODcwN11dLCBbJ2V4cGVjdGF0aW9uJywgWzg0OTZdXSwgWydleHBvbmVudGlhbGUnLCBbODUxOV1dLCBbJ0V4cG9uZW50aWFsRScsIFs4NTE5XV0sIFsnZmFsbGluZ2RvdHNlcScsIFs4Nzg2XV0sIFsnRmN5JywgWzEwNjBdXSwgWydmY3knLCBbMTA5Ml1dLCBbJ2ZlbWFsZScsIFs5NzkyXV0sIFsnZmZpbGlnJywgWzY0MjU5XV0sIFsnZmZsaWcnLCBbNjQyNTZdXSwgWydmZmxsaWcnLCBbNjQyNjBdXSwgWydGZnInLCBbMTIwMDczXV0sIFsnZmZyJywgWzEyMDA5OV1dLCBbJ2ZpbGlnJywgWzY0MjU3XV0sIFsnRmlsbGVkU21hbGxTcXVhcmUnLCBbOTcyNF1dLCBbJ0ZpbGxlZFZlcnlTbWFsbFNxdWFyZScsIFs5NjQyXV0sIFsnZmpsaWcnLCBbMTAyLCAxMDZdXSwgWydmbGF0JywgWzk4MzddXSwgWydmbGxpZycsIFs2NDI1OF1dLCBbJ2ZsdG5zJywgWzk2NDldXSwgWydmbm9mJywgWzQwMl1dLCBbJ0ZvcGYnLCBbMTIwMTI1XV0sIFsnZm9wZicsIFsxMjAxNTFdXSwgWydmb3JhbGwnLCBbODcwNF1dLCBbJ0ZvckFsbCcsIFs4NzA0XV0sIFsnZm9yaycsIFs4OTE2XV0sIFsnZm9ya3YnLCBbMTA5NjldXSwgWydGb3VyaWVydHJmJywgWzg0OTddXSwgWydmcGFydGludCcsIFsxMDc2NV1dLCBbJ2ZyYWMxMicsIFsxODldXSwgWydmcmFjMTMnLCBbODUzMV1dLCBbJ2ZyYWMxNCcsIFsxODhdXSwgWydmcmFjMTUnLCBbODUzM11dLCBbJ2ZyYWMxNicsIFs4NTM3XV0sIFsnZnJhYzE4JywgWzg1MzldXSwgWydmcmFjMjMnLCBbODUzMl1dLCBbJ2ZyYWMyNScsIFs4NTM0XV0sIFsnZnJhYzM0JywgWzE5MF1dLCBbJ2ZyYWMzNScsIFs4NTM1XV0sIFsnZnJhYzM4JywgWzg1NDBdXSwgWydmcmFjNDUnLCBbODUzNl1dLCBbJ2ZyYWM1NicsIFs4NTM4XV0sIFsnZnJhYzU4JywgWzg1NDFdXSwgWydmcmFjNzgnLCBbODU0Ml1dLCBbJ2ZyYXNsJywgWzgyNjBdXSwgWydmcm93bicsIFs4OTk0XV0sIFsnZnNjcicsIFsxMTk5OTVdXSwgWydGc2NyJywgWzg0OTddXSwgWydnYWN1dGUnLCBbNTAxXV0sIFsnR2FtbWEnLCBbOTE1XV0sIFsnZ2FtbWEnLCBbOTQ3XV0sIFsnR2FtbWFkJywgWzk4OF1dLCBbJ2dhbW1hZCcsIFs5ODldXSwgWydnYXAnLCBbMTA4ODZdXSwgWydHYnJldmUnLCBbMjg2XV0sIFsnZ2JyZXZlJywgWzI4N11dLCBbJ0djZWRpbCcsIFsyOTBdXSwgWydHY2lyYycsIFsyODRdXSwgWydnY2lyYycsIFsyODVdXSwgWydHY3knLCBbMTA0M11dLCBbJ2djeScsIFsxMDc1XV0sIFsnR2RvdCcsIFsyODhdXSwgWydnZG90JywgWzI4OV1dLCBbJ2dlJywgWzg4MDVdXSwgWydnRScsIFs4ODA3XV0sIFsnZ0VsJywgWzEwODkyXV0sIFsnZ2VsJywgWzg5MjNdXSwgWydnZXEnLCBbODgwNV1dLCBbJ2dlcXEnLCBbODgwN11dLCBbJ2dlcXNsYW50JywgWzEwODc4XV0sIFsnZ2VzY2MnLCBbMTA5MjFdXSwgWydnZXMnLCBbMTA4NzhdXSwgWydnZXNkb3QnLCBbMTA4ODBdXSwgWydnZXNkb3RvJywgWzEwODgyXV0sIFsnZ2VzZG90b2wnLCBbMTA4ODRdXSwgWydnZXNsJywgWzg5MjMsIDY1MDI0XV0sIFsnZ2VzbGVzJywgWzEwOTAwXV0sIFsnR2ZyJywgWzEyMDA3NF1dLCBbJ2dmcicsIFsxMjAxMDBdXSwgWydnZycsIFs4ODExXV0sIFsnR2cnLCBbODkyMV1dLCBbJ2dnZycsIFs4OTIxXV0sIFsnZ2ltZWwnLCBbODUwM11dLCBbJ0dKY3knLCBbMTAyN11dLCBbJ2dqY3knLCBbMTEwN11dLCBbJ2dsYScsIFsxMDkxN11dLCBbJ2dsJywgWzg4MjNdXSwgWydnbEUnLCBbMTA4OThdXSwgWydnbGonLCBbMTA5MTZdXSwgWydnbmFwJywgWzEwODkwXV0sIFsnZ25hcHByb3gnLCBbMTA4OTBdXSwgWydnbmUnLCBbMTA4ODhdXSwgWydnbkUnLCBbODgwOV1dLCBbJ2duZXEnLCBbMTA4ODhdXSwgWydnbmVxcScsIFs4ODA5XV0sIFsnZ25zaW0nLCBbODkzNV1dLCBbJ0dvcGYnLCBbMTIwMTI2XV0sIFsnZ29wZicsIFsxMjAxNTJdXSwgWydncmF2ZScsIFs5Nl1dLCBbJ0dyZWF0ZXJFcXVhbCcsIFs4ODA1XV0sIFsnR3JlYXRlckVxdWFsTGVzcycsIFs4OTIzXV0sIFsnR3JlYXRlckZ1bGxFcXVhbCcsIFs4ODA3XV0sIFsnR3JlYXRlckdyZWF0ZXInLCBbMTA5MTRdXSwgWydHcmVhdGVyTGVzcycsIFs4ODIzXV0sIFsnR3JlYXRlclNsYW50RXF1YWwnLCBbMTA4NzhdXSwgWydHcmVhdGVyVGlsZGUnLCBbODgxOV1dLCBbJ0dzY3InLCBbMTE5OTcwXV0sIFsnZ3NjcicsIFs4NDU4XV0sIFsnZ3NpbScsIFs4ODE5XV0sIFsnZ3NpbWUnLCBbMTA4OTRdXSwgWydnc2ltbCcsIFsxMDg5Nl1dLCBbJ2d0Y2MnLCBbMTA5MTldXSwgWydndGNpcicsIFsxMDg3NF1dLCBbJ2d0JywgWzYyXV0sIFsnR1QnLCBbNjJdXSwgWydHdCcsIFs4ODExXV0sIFsnZ3Rkb3QnLCBbODkxOV1dLCBbJ2d0bFBhcicsIFsxMDY0NV1dLCBbJ2d0cXVlc3QnLCBbMTA4NzZdXSwgWydndHJhcHByb3gnLCBbMTA4ODZdXSwgWydndHJhcnInLCBbMTA2MTZdXSwgWydndHJkb3QnLCBbODkxOV1dLCBbJ2d0cmVxbGVzcycsIFs4OTIzXV0sIFsnZ3RyZXFxbGVzcycsIFsxMDg5Ml1dLCBbJ2d0cmxlc3MnLCBbODgyM11dLCBbJ2d0cnNpbScsIFs4ODE5XV0sIFsnZ3ZlcnRuZXFxJywgWzg4MDksIDY1MDI0XV0sIFsnZ3ZuRScsIFs4ODA5LCA2NTAyNF1dLCBbJ0hhY2VrJywgWzcxMV1dLCBbJ2hhaXJzcCcsIFs4MjAyXV0sIFsnaGFsZicsIFsxODldXSwgWydoYW1pbHQnLCBbODQ1OV1dLCBbJ0hBUkRjeScsIFsxMDY2XV0sIFsnaGFyZGN5JywgWzEwOThdXSwgWydoYXJyY2lyJywgWzEwNTY4XV0sIFsnaGFycicsIFs4NTk2XV0sIFsnaEFycicsIFs4NjYwXV0sIFsnaGFycncnLCBbODYyMV1dLCBbJ0hhdCcsIFs5NF1dLCBbJ2hiYXInLCBbODQ2M11dLCBbJ0hjaXJjJywgWzI5Ml1dLCBbJ2hjaXJjJywgWzI5M11dLCBbJ2hlYXJ0cycsIFs5ODI5XV0sIFsnaGVhcnRzdWl0JywgWzk4MjldXSwgWydoZWxsaXAnLCBbODIzMF1dLCBbJ2hlcmNvbicsIFs4ODg5XV0sIFsnaGZyJywgWzEyMDEwMV1dLCBbJ0hmcicsIFs4NDYwXV0sIFsnSGlsYmVydFNwYWNlJywgWzg0NTldXSwgWydoa3NlYXJvdycsIFsxMDUzM11dLCBbJ2hrc3dhcm93JywgWzEwNTM0XV0sIFsnaG9hcnInLCBbODcwM11dLCBbJ2hvbXRodCcsIFs4NzYzXV0sIFsnaG9va2xlZnRhcnJvdycsIFs4NjE3XV0sIFsnaG9va3JpZ2h0YXJyb3cnLCBbODYxOF1dLCBbJ2hvcGYnLCBbMTIwMTUzXV0sIFsnSG9wZicsIFs4NDYxXV0sIFsnaG9yYmFyJywgWzgyMTNdXSwgWydIb3Jpem9udGFsTGluZScsIFs5NDcyXV0sIFsnaHNjcicsIFsxMTk5OTddXSwgWydIc2NyJywgWzg0NTldXSwgWydoc2xhc2gnLCBbODQ2M11dLCBbJ0hzdHJvaycsIFsyOTRdXSwgWydoc3Ryb2snLCBbMjk1XV0sIFsnSHVtcERvd25IdW1wJywgWzg3ODJdXSwgWydIdW1wRXF1YWwnLCBbODc4M11dLCBbJ2h5YnVsbCcsIFs4MjU5XV0sIFsnaHlwaGVuJywgWzgyMDhdXSwgWydJYWN1dGUnLCBbMjA1XV0sIFsnaWFjdXRlJywgWzIzN11dLCBbJ2ljJywgWzgyOTFdXSwgWydJY2lyYycsIFsyMDZdXSwgWydpY2lyYycsIFsyMzhdXSwgWydJY3knLCBbMTA0OF1dLCBbJ2ljeScsIFsxMDgwXV0sIFsnSWRvdCcsIFszMDRdXSwgWydJRWN5JywgWzEwNDVdXSwgWydpZWN5JywgWzEwNzddXSwgWydpZXhjbCcsIFsxNjFdXSwgWydpZmYnLCBbODY2MF1dLCBbJ2lmcicsIFsxMjAxMDJdXSwgWydJZnInLCBbODQ2NV1dLCBbJ0lncmF2ZScsIFsyMDRdXSwgWydpZ3JhdmUnLCBbMjM2XV0sIFsnaWknLCBbODUyMF1dLCBbJ2lpaWludCcsIFsxMDc2NF1dLCBbJ2lpaW50JywgWzg3NDldXSwgWydpaW5maW4nLCBbMTA3MTZdXSwgWydpaW90YScsIFs4NDg5XV0sIFsnSUpsaWcnLCBbMzA2XV0sIFsnaWpsaWcnLCBbMzA3XV0sIFsnSW1hY3InLCBbMjk4XV0sIFsnaW1hY3InLCBbMjk5XV0sIFsnaW1hZ2UnLCBbODQ2NV1dLCBbJ0ltYWdpbmFyeUknLCBbODUyMF1dLCBbJ2ltYWdsaW5lJywgWzg0NjRdXSwgWydpbWFncGFydCcsIFs4NDY1XV0sIFsnaW1hdGgnLCBbMzA1XV0sIFsnSW0nLCBbODQ2NV1dLCBbJ2ltb2YnLCBbODg4N11dLCBbJ2ltcGVkJywgWzQzN11dLCBbJ0ltcGxpZXMnLCBbODY1OF1dLCBbJ2luY2FyZScsIFs4NDUzXV0sIFsnaW4nLCBbODcxMl1dLCBbJ2luZmluJywgWzg3MzRdXSwgWydpbmZpbnRpZScsIFsxMDcxN11dLCBbJ2lub2RvdCcsIFszMDVdXSwgWydpbnRjYWwnLCBbODg5MF1dLCBbJ2ludCcsIFs4NzQ3XV0sIFsnSW50JywgWzg3NDhdXSwgWydpbnRlZ2VycycsIFs4NDg0XV0sIFsnSW50ZWdyYWwnLCBbODc0N11dLCBbJ2ludGVyY2FsJywgWzg4OTBdXSwgWydJbnRlcnNlY3Rpb24nLCBbODg5OF1dLCBbJ2ludGxhcmhrJywgWzEwNzc1XV0sIFsnaW50cHJvZCcsIFsxMDgxMl1dLCBbJ0ludmlzaWJsZUNvbW1hJywgWzgyOTFdXSwgWydJbnZpc2libGVUaW1lcycsIFs4MjkwXV0sIFsnSU9jeScsIFsxMDI1XV0sIFsnaW9jeScsIFsxMTA1XV0sIFsnSW9nb24nLCBbMzAyXV0sIFsnaW9nb24nLCBbMzAzXV0sIFsnSW9wZicsIFsxMjAxMjhdXSwgWydpb3BmJywgWzEyMDE1NF1dLCBbJ0lvdGEnLCBbOTIxXV0sIFsnaW90YScsIFs5NTNdXSwgWydpcHJvZCcsIFsxMDgxMl1dLCBbJ2lxdWVzdCcsIFsxOTFdXSwgWydpc2NyJywgWzExOTk5OF1dLCBbJ0lzY3InLCBbODQ2NF1dLCBbJ2lzaW4nLCBbODcxMl1dLCBbJ2lzaW5kb3QnLCBbODk0OV1dLCBbJ2lzaW5FJywgWzg5NTNdXSwgWydpc2lucycsIFs4OTQ4XV0sIFsnaXNpbnN2JywgWzg5NDddXSwgWydpc2ludicsIFs4NzEyXV0sIFsnaXQnLCBbODI5MF1dLCBbJ0l0aWxkZScsIFsyOTZdXSwgWydpdGlsZGUnLCBbMjk3XV0sIFsnSXVrY3knLCBbMTAzMF1dLCBbJ2l1a2N5JywgWzExMTBdXSwgWydJdW1sJywgWzIwN11dLCBbJ2l1bWwnLCBbMjM5XV0sIFsnSmNpcmMnLCBbMzA4XV0sIFsnamNpcmMnLCBbMzA5XV0sIFsnSmN5JywgWzEwNDldXSwgWydqY3knLCBbMTA4MV1dLCBbJ0pmcicsIFsxMjAwNzddXSwgWydqZnInLCBbMTIwMTAzXV0sIFsnam1hdGgnLCBbNTY3XV0sIFsnSm9wZicsIFsxMjAxMjldXSwgWydqb3BmJywgWzEyMDE1NV1dLCBbJ0pzY3InLCBbMTE5OTczXV0sIFsnanNjcicsIFsxMTk5OTldXSwgWydKc2VyY3knLCBbMTAzMl1dLCBbJ2pzZXJjeScsIFsxMTEyXV0sIFsnSnVrY3knLCBbMTAyOF1dLCBbJ2p1a2N5JywgWzExMDhdXSwgWydLYXBwYScsIFs5MjJdXSwgWydrYXBwYScsIFs5NTRdXSwgWydrYXBwYXYnLCBbMTAwOF1dLCBbJ0tjZWRpbCcsIFszMTBdXSwgWydrY2VkaWwnLCBbMzExXV0sIFsnS2N5JywgWzEwNTBdXSwgWydrY3knLCBbMTA4Ml1dLCBbJ0tmcicsIFsxMjAwNzhdXSwgWydrZnInLCBbMTIwMTA0XV0sIFsna2dyZWVuJywgWzMxMl1dLCBbJ0tIY3knLCBbMTA2MV1dLCBbJ2toY3knLCBbMTA5M11dLCBbJ0tKY3knLCBbMTAzNl1dLCBbJ2tqY3knLCBbMTExNl1dLCBbJ0tvcGYnLCBbMTIwMTMwXV0sIFsna29wZicsIFsxMjAxNTZdXSwgWydLc2NyJywgWzExOTk3NF1dLCBbJ2tzY3InLCBbMTIwMDAwXV0sIFsnbEFhcnInLCBbODY2Nl1dLCBbJ0xhY3V0ZScsIFszMTNdXSwgWydsYWN1dGUnLCBbMzE0XV0sIFsnbGFlbXB0eXYnLCBbMTA2NzZdXSwgWydsYWdyYW4nLCBbODQ2Nl1dLCBbJ0xhbWJkYScsIFs5MjNdXSwgWydsYW1iZGEnLCBbOTU1XV0sIFsnbGFuZycsIFsxMDIxNl1dLCBbJ0xhbmcnLCBbMTAyMThdXSwgWydsYW5nZCcsIFsxMDY0MV1dLCBbJ2xhbmdsZScsIFsxMDIxNl1dLCBbJ2xhcCcsIFsxMDg4NV1dLCBbJ0xhcGxhY2V0cmYnLCBbODQ2Nl1dLCBbJ2xhcXVvJywgWzE3MV1dLCBbJ2xhcnJiJywgWzg2NzZdXSwgWydsYXJyYmZzJywgWzEwNTI3XV0sIFsnbGFycicsIFs4NTkyXV0sIFsnTGFycicsIFs4NjA2XV0sIFsnbEFycicsIFs4NjU2XV0sIFsnbGFycmZzJywgWzEwNTI1XV0sIFsnbGFycmhrJywgWzg2MTddXSwgWydsYXJybHAnLCBbODYxOV1dLCBbJ2xhcnJwbCcsIFsxMDU1M11dLCBbJ2xhcnJzaW0nLCBbMTA2MTFdXSwgWydsYXJydGwnLCBbODYxMF1dLCBbJ2xhdGFpbCcsIFsxMDUyMV1dLCBbJ2xBdGFpbCcsIFsxMDUyM11dLCBbJ2xhdCcsIFsxMDkyM11dLCBbJ2xhdGUnLCBbMTA5MjVdXSwgWydsYXRlcycsIFsxMDkyNSwgNjUwMjRdXSwgWydsYmFycicsIFsxMDUwOF1dLCBbJ2xCYXJyJywgWzEwNTEwXV0sIFsnbGJicmsnLCBbMTAwOThdXSwgWydsYnJhY2UnLCBbMTIzXV0sIFsnbGJyYWNrJywgWzkxXV0sIFsnbGJya2UnLCBbMTA2MzVdXSwgWydsYnJrc2xkJywgWzEwNjM5XV0sIFsnbGJya3NsdScsIFsxMDYzN11dLCBbJ0xjYXJvbicsIFszMTddXSwgWydsY2Fyb24nLCBbMzE4XV0sIFsnTGNlZGlsJywgWzMxNV1dLCBbJ2xjZWRpbCcsIFszMTZdXSwgWydsY2VpbCcsIFs4OTY4XV0sIFsnbGN1YicsIFsxMjNdXSwgWydMY3knLCBbMTA1MV1dLCBbJ2xjeScsIFsxMDgzXV0sIFsnbGRjYScsIFsxMDU1MF1dLCBbJ2xkcXVvJywgWzgyMjBdXSwgWydsZHF1b3InLCBbODIyMl1dLCBbJ2xkcmRoYXInLCBbMTA1OTldXSwgWydsZHJ1c2hhcicsIFsxMDU3MV1dLCBbJ2xkc2gnLCBbODYyNl1dLCBbJ2xlJywgWzg4MDRdXSwgWydsRScsIFs4ODA2XV0sIFsnTGVmdEFuZ2xlQnJhY2tldCcsIFsxMDIxNl1dLCBbJ0xlZnRBcnJvd0JhcicsIFs4Njc2XV0sIFsnbGVmdGFycm93JywgWzg1OTJdXSwgWydMZWZ0QXJyb3cnLCBbODU5Ml1dLCBbJ0xlZnRhcnJvdycsIFs4NjU2XV0sIFsnTGVmdEFycm93UmlnaHRBcnJvdycsIFs4NjQ2XV0sIFsnbGVmdGFycm93dGFpbCcsIFs4NjEwXV0sIFsnTGVmdENlaWxpbmcnLCBbODk2OF1dLCBbJ0xlZnREb3VibGVCcmFja2V0JywgWzEwMjE0XV0sIFsnTGVmdERvd25UZWVWZWN0b3InLCBbMTA1OTNdXSwgWydMZWZ0RG93blZlY3RvckJhcicsIFsxMDU4NV1dLCBbJ0xlZnREb3duVmVjdG9yJywgWzg2NDNdXSwgWydMZWZ0Rmxvb3InLCBbODk3MF1dLCBbJ2xlZnRoYXJwb29uZG93bicsIFs4NjM3XV0sIFsnbGVmdGhhcnBvb251cCcsIFs4NjM2XV0sIFsnbGVmdGxlZnRhcnJvd3MnLCBbODY0N11dLCBbJ2xlZnRyaWdodGFycm93JywgWzg1OTZdXSwgWydMZWZ0UmlnaHRBcnJvdycsIFs4NTk2XV0sIFsnTGVmdHJpZ2h0YXJyb3cnLCBbODY2MF1dLCBbJ2xlZnRyaWdodGFycm93cycsIFs4NjQ2XV0sIFsnbGVmdHJpZ2h0aGFycG9vbnMnLCBbODY1MV1dLCBbJ2xlZnRyaWdodHNxdWlnYXJyb3cnLCBbODYyMV1dLCBbJ0xlZnRSaWdodFZlY3RvcicsIFsxMDU3NF1dLCBbJ0xlZnRUZWVBcnJvdycsIFs4NjEyXV0sIFsnTGVmdFRlZScsIFs4ODY3XV0sIFsnTGVmdFRlZVZlY3RvcicsIFsxMDU4Nl1dLCBbJ2xlZnR0aHJlZXRpbWVzJywgWzg5MDddXSwgWydMZWZ0VHJpYW5nbGVCYXInLCBbMTA3MDNdXSwgWydMZWZ0VHJpYW5nbGUnLCBbODg4Ml1dLCBbJ0xlZnRUcmlhbmdsZUVxdWFsJywgWzg4ODRdXSwgWydMZWZ0VXBEb3duVmVjdG9yJywgWzEwNTc3XV0sIFsnTGVmdFVwVGVlVmVjdG9yJywgWzEwNTkyXV0sIFsnTGVmdFVwVmVjdG9yQmFyJywgWzEwNTg0XV0sIFsnTGVmdFVwVmVjdG9yJywgWzg2MzldXSwgWydMZWZ0VmVjdG9yQmFyJywgWzEwNTc4XV0sIFsnTGVmdFZlY3RvcicsIFs4NjM2XV0sIFsnbEVnJywgWzEwODkxXV0sIFsnbGVnJywgWzg5MjJdXSwgWydsZXEnLCBbODgwNF1dLCBbJ2xlcXEnLCBbODgwNl1dLCBbJ2xlcXNsYW50JywgWzEwODc3XV0sIFsnbGVzY2MnLCBbMTA5MjBdXSwgWydsZXMnLCBbMTA4NzddXSwgWydsZXNkb3QnLCBbMTA4NzldXSwgWydsZXNkb3RvJywgWzEwODgxXV0sIFsnbGVzZG90b3InLCBbMTA4ODNdXSwgWydsZXNnJywgWzg5MjIsIDY1MDI0XV0sIFsnbGVzZ2VzJywgWzEwODk5XV0sIFsnbGVzc2FwcHJveCcsIFsxMDg4NV1dLCBbJ2xlc3Nkb3QnLCBbODkxOF1dLCBbJ2xlc3NlcWd0cicsIFs4OTIyXV0sIFsnbGVzc2VxcWd0cicsIFsxMDg5MV1dLCBbJ0xlc3NFcXVhbEdyZWF0ZXInLCBbODkyMl1dLCBbJ0xlc3NGdWxsRXF1YWwnLCBbODgwNl1dLCBbJ0xlc3NHcmVhdGVyJywgWzg4MjJdXSwgWydsZXNzZ3RyJywgWzg4MjJdXSwgWydMZXNzTGVzcycsIFsxMDkxM11dLCBbJ2xlc3NzaW0nLCBbODgxOF1dLCBbJ0xlc3NTbGFudEVxdWFsJywgWzEwODc3XV0sIFsnTGVzc1RpbGRlJywgWzg4MThdXSwgWydsZmlzaHQnLCBbMTA2MjBdXSwgWydsZmxvb3InLCBbODk3MF1dLCBbJ0xmcicsIFsxMjAwNzldXSwgWydsZnInLCBbMTIwMTA1XV0sIFsnbGcnLCBbODgyMl1dLCBbJ2xnRScsIFsxMDg5N11dLCBbJ2xIYXInLCBbMTA1OTRdXSwgWydsaGFyZCcsIFs4NjM3XV0sIFsnbGhhcnUnLCBbODYzNl1dLCBbJ2xoYXJ1bCcsIFsxMDYwMl1dLCBbJ2xoYmxrJywgWzk2MDRdXSwgWydMSmN5JywgWzEwMzNdXSwgWydsamN5JywgWzExMTNdXSwgWydsbGFycicsIFs4NjQ3XV0sIFsnbGwnLCBbODgxMF1dLCBbJ0xsJywgWzg5MjBdXSwgWydsbGNvcm5lcicsIFs4OTkwXV0sIFsnTGxlZnRhcnJvdycsIFs4NjY2XV0sIFsnbGxoYXJkJywgWzEwNjAzXV0sIFsnbGx0cmknLCBbOTcyMl1dLCBbJ0xtaWRvdCcsIFszMTldXSwgWydsbWlkb3QnLCBbMzIwXV0sIFsnbG1vdXN0YWNoZScsIFs5MTM2XV0sIFsnbG1vdXN0JywgWzkxMzZdXSwgWydsbmFwJywgWzEwODg5XV0sIFsnbG5hcHByb3gnLCBbMTA4ODldXSwgWydsbmUnLCBbMTA4ODddXSwgWydsbkUnLCBbODgwOF1dLCBbJ2xuZXEnLCBbMTA4ODddXSwgWydsbmVxcScsIFs4ODA4XV0sIFsnbG5zaW0nLCBbODkzNF1dLCBbJ2xvYW5nJywgWzEwMjIwXV0sIFsnbG9hcnInLCBbODcwMV1dLCBbJ2xvYnJrJywgWzEwMjE0XV0sIFsnbG9uZ2xlZnRhcnJvdycsIFsxMDIyOV1dLCBbJ0xvbmdMZWZ0QXJyb3cnLCBbMTAyMjldXSwgWydMb25nbGVmdGFycm93JywgWzEwMjMyXV0sIFsnbG9uZ2xlZnRyaWdodGFycm93JywgWzEwMjMxXV0sIFsnTG9uZ0xlZnRSaWdodEFycm93JywgWzEwMjMxXV0sIFsnTG9uZ2xlZnRyaWdodGFycm93JywgWzEwMjM0XV0sIFsnbG9uZ21hcHN0bycsIFsxMDIzNl1dLCBbJ2xvbmdyaWdodGFycm93JywgWzEwMjMwXV0sIFsnTG9uZ1JpZ2h0QXJyb3cnLCBbMTAyMzBdXSwgWydMb25ncmlnaHRhcnJvdycsIFsxMDIzM11dLCBbJ2xvb3BhcnJvd2xlZnQnLCBbODYxOV1dLCBbJ2xvb3BhcnJvd3JpZ2h0JywgWzg2MjBdXSwgWydsb3BhcicsIFsxMDYyOV1dLCBbJ0xvcGYnLCBbMTIwMTMxXV0sIFsnbG9wZicsIFsxMjAxNTddXSwgWydsb3BsdXMnLCBbMTA3OTddXSwgWydsb3RpbWVzJywgWzEwODA0XV0sIFsnbG93YXN0JywgWzg3MjddXSwgWydsb3diYXInLCBbOTVdXSwgWydMb3dlckxlZnRBcnJvdycsIFs4NjAxXV0sIFsnTG93ZXJSaWdodEFycm93JywgWzg2MDBdXSwgWydsb3onLCBbOTY3NF1dLCBbJ2xvemVuZ2UnLCBbOTY3NF1dLCBbJ2xvemYnLCBbMTA3MzFdXSwgWydscGFyJywgWzQwXV0sIFsnbHBhcmx0JywgWzEwNjQzXV0sIFsnbHJhcnInLCBbODY0Nl1dLCBbJ2xyY29ybmVyJywgWzg5OTFdXSwgWydscmhhcicsIFs4NjUxXV0sIFsnbHJoYXJkJywgWzEwNjA1XV0sIFsnbHJtJywgWzgyMDZdXSwgWydscnRyaScsIFs4ODk1XV0sIFsnbHNhcXVvJywgWzgyNDldXSwgWydsc2NyJywgWzEyMDAwMV1dLCBbJ0xzY3InLCBbODQ2Nl1dLCBbJ2xzaCcsIFs4NjI0XV0sIFsnTHNoJywgWzg2MjRdXSwgWydsc2ltJywgWzg4MThdXSwgWydsc2ltZScsIFsxMDg5M11dLCBbJ2xzaW1nJywgWzEwODk1XV0sIFsnbHNxYicsIFs5MV1dLCBbJ2xzcXVvJywgWzgyMTZdXSwgWydsc3F1b3InLCBbODIxOF1dLCBbJ0xzdHJvaycsIFszMjFdXSwgWydsc3Ryb2snLCBbMzIyXV0sIFsnbHRjYycsIFsxMDkxOF1dLCBbJ2x0Y2lyJywgWzEwODczXV0sIFsnbHQnLCBbNjBdXSwgWydMVCcsIFs2MF1dLCBbJ0x0JywgWzg4MTBdXSwgWydsdGRvdCcsIFs4OTE4XV0sIFsnbHRocmVlJywgWzg5MDddXSwgWydsdGltZXMnLCBbODkwNV1dLCBbJ2x0bGFycicsIFsxMDYxNF1dLCBbJ2x0cXVlc3QnLCBbMTA4NzVdXSwgWydsdHJpJywgWzk2NjddXSwgWydsdHJpZScsIFs4ODg0XV0sIFsnbHRyaWYnLCBbOTY2Nl1dLCBbJ2x0clBhcicsIFsxMDY0Nl1dLCBbJ2x1cmRzaGFyJywgWzEwNTcwXV0sIFsnbHVydWhhcicsIFsxMDU5OF1dLCBbJ2x2ZXJ0bmVxcScsIFs4ODA4LCA2NTAyNF1dLCBbJ2x2bkUnLCBbODgwOCwgNjUwMjRdXSwgWydtYWNyJywgWzE3NV1dLCBbJ21hbGUnLCBbOTc5NF1dLCBbJ21hbHQnLCBbMTAwMTZdXSwgWydtYWx0ZXNlJywgWzEwMDE2XV0sIFsnTWFwJywgWzEwNTAxXV0sIFsnbWFwJywgWzg2MTRdXSwgWydtYXBzdG8nLCBbODYxNF1dLCBbJ21hcHN0b2Rvd24nLCBbODYxNV1dLCBbJ21hcHN0b2xlZnQnLCBbODYxMl1dLCBbJ21hcHN0b3VwJywgWzg2MTNdXSwgWydtYXJrZXInLCBbOTY0Nl1dLCBbJ21jb21tYScsIFsxMDc5M11dLCBbJ01jeScsIFsxMDUyXV0sIFsnbWN5JywgWzEwODRdXSwgWydtZGFzaCcsIFs4MjEyXV0sIFsnbUREb3QnLCBbODc2Ml1dLCBbJ21lYXN1cmVkYW5nbGUnLCBbODczN11dLCBbJ01lZGl1bVNwYWNlJywgWzgyODddXSwgWydNZWxsaW50cmYnLCBbODQ5OV1dLCBbJ01mcicsIFsxMjAwODBdXSwgWydtZnInLCBbMTIwMTA2XV0sIFsnbWhvJywgWzg0ODddXSwgWydtaWNybycsIFsxODFdXSwgWydtaWRhc3QnLCBbNDJdXSwgWydtaWRjaXInLCBbMTA5OTJdXSwgWydtaWQnLCBbODczOV1dLCBbJ21pZGRvdCcsIFsxODNdXSwgWydtaW51c2InLCBbODg2M11dLCBbJ21pbnVzJywgWzg3MjJdXSwgWydtaW51c2QnLCBbODc2MF1dLCBbJ21pbnVzZHUnLCBbMTA3OTRdXSwgWydNaW51c1BsdXMnLCBbODcyM11dLCBbJ21sY3AnLCBbMTA5NzFdXSwgWydtbGRyJywgWzgyMzBdXSwgWydtbnBsdXMnLCBbODcyM11dLCBbJ21vZGVscycsIFs4ODcxXV0sIFsnTW9wZicsIFsxMjAxMzJdXSwgWydtb3BmJywgWzEyMDE1OF1dLCBbJ21wJywgWzg3MjNdXSwgWydtc2NyJywgWzEyMDAwMl1dLCBbJ01zY3InLCBbODQ5OV1dLCBbJ21zdHBvcycsIFs4NzY2XV0sIFsnTXUnLCBbOTI0XV0sIFsnbXUnLCBbOTU2XV0sIFsnbXVsdGltYXAnLCBbODg4OF1dLCBbJ211bWFwJywgWzg4ODhdXSwgWyduYWJsYScsIFs4NzExXV0sIFsnTmFjdXRlJywgWzMyM11dLCBbJ25hY3V0ZScsIFszMjRdXSwgWyduYW5nJywgWzg3MzYsIDg0MDJdXSwgWyduYXAnLCBbODc3N11dLCBbJ25hcEUnLCBbMTA4NjQsIDgyNF1dLCBbJ25hcGlkJywgWzg3NzksIDgyNF1dLCBbJ25hcG9zJywgWzMyOV1dLCBbJ25hcHByb3gnLCBbODc3N11dLCBbJ25hdHVyYWwnLCBbOTgzOF1dLCBbJ25hdHVyYWxzJywgWzg0NjldXSwgWyduYXR1cicsIFs5ODM4XV0sIFsnbmJzcCcsIFsxNjBdXSwgWyduYnVtcCcsIFs4NzgyLCA4MjRdXSwgWyduYnVtcGUnLCBbODc4MywgODI0XV0sIFsnbmNhcCcsIFsxMDgxOV1dLCBbJ05jYXJvbicsIFszMjddXSwgWyduY2Fyb24nLCBbMzI4XV0sIFsnTmNlZGlsJywgWzMyNV1dLCBbJ25jZWRpbCcsIFszMjZdXSwgWyduY29uZycsIFs4Nzc1XV0sIFsnbmNvbmdkb3QnLCBbMTA4NjEsIDgyNF1dLCBbJ25jdXAnLCBbMTA4MThdXSwgWydOY3knLCBbMTA1M11dLCBbJ25jeScsIFsxMDg1XV0sIFsnbmRhc2gnLCBbODIxMV1dLCBbJ25lYXJoaycsIFsxMDUzMl1dLCBbJ25lYXJyJywgWzg1OTldXSwgWyduZUFycicsIFs4NjYzXV0sIFsnbmVhcnJvdycsIFs4NTk5XV0sIFsnbmUnLCBbODgwMF1dLCBbJ25lZG90JywgWzg3ODQsIDgyNF1dLCBbJ05lZ2F0aXZlTWVkaXVtU3BhY2UnLCBbODIwM11dLCBbJ05lZ2F0aXZlVGhpY2tTcGFjZScsIFs4MjAzXV0sIFsnTmVnYXRpdmVUaGluU3BhY2UnLCBbODIwM11dLCBbJ05lZ2F0aXZlVmVyeVRoaW5TcGFjZScsIFs4MjAzXV0sIFsnbmVxdWl2JywgWzg4MDJdXSwgWyduZXNlYXInLCBbMTA1MzZdXSwgWyduZXNpbScsIFs4NzcwLCA4MjRdXSwgWydOZXN0ZWRHcmVhdGVyR3JlYXRlcicsIFs4ODExXV0sIFsnTmVzdGVkTGVzc0xlc3MnLCBbODgxMF1dLCBbJ25leGlzdCcsIFs4NzA4XV0sIFsnbmV4aXN0cycsIFs4NzA4XV0sIFsnTmZyJywgWzEyMDA4MV1dLCBbJ25mcicsIFsxMjAxMDddXSwgWyduZ0UnLCBbODgwNywgODI0XV0sIFsnbmdlJywgWzg4MTddXSwgWyduZ2VxJywgWzg4MTddXSwgWyduZ2VxcScsIFs4ODA3LCA4MjRdXSwgWyduZ2Vxc2xhbnQnLCBbMTA4NzgsIDgyNF1dLCBbJ25nZXMnLCBbMTA4NzgsIDgyNF1dLCBbJ25HZycsIFs4OTIxLCA4MjRdXSwgWyduZ3NpbScsIFs4ODIxXV0sIFsnbkd0JywgWzg4MTEsIDg0MDJdXSwgWyduZ3QnLCBbODgxNV1dLCBbJ25ndHInLCBbODgxNV1dLCBbJ25HdHYnLCBbODgxMSwgODI0XV0sIFsnbmhhcnInLCBbODYyMl1dLCBbJ25oQXJyJywgWzg2NTRdXSwgWyduaHBhcicsIFsxMDk5NF1dLCBbJ25pJywgWzg3MTVdXSwgWyduaXMnLCBbODk1Nl1dLCBbJ25pc2QnLCBbODk1NF1dLCBbJ25pdicsIFs4NzE1XV0sIFsnTkpjeScsIFsxMDM0XV0sIFsnbmpjeScsIFsxMTE0XV0sIFsnbmxhcnInLCBbODYwMl1dLCBbJ25sQXJyJywgWzg2NTNdXSwgWydubGRyJywgWzgyMjldXSwgWydubEUnLCBbODgwNiwgODI0XV0sIFsnbmxlJywgWzg4MTZdXSwgWydubGVmdGFycm93JywgWzg2MDJdXSwgWyduTGVmdGFycm93JywgWzg2NTNdXSwgWydubGVmdHJpZ2h0YXJyb3cnLCBbODYyMl1dLCBbJ25MZWZ0cmlnaHRhcnJvdycsIFs4NjU0XV0sIFsnbmxlcScsIFs4ODE2XV0sIFsnbmxlcXEnLCBbODgwNiwgODI0XV0sIFsnbmxlcXNsYW50JywgWzEwODc3LCA4MjRdXSwgWydubGVzJywgWzEwODc3LCA4MjRdXSwgWydubGVzcycsIFs4ODE0XV0sIFsnbkxsJywgWzg5MjAsIDgyNF1dLCBbJ25sc2ltJywgWzg4MjBdXSwgWyduTHQnLCBbODgxMCwgODQwMl1dLCBbJ25sdCcsIFs4ODE0XV0sIFsnbmx0cmknLCBbODkzOF1dLCBbJ25sdHJpZScsIFs4OTQwXV0sIFsnbkx0dicsIFs4ODEwLCA4MjRdXSwgWydubWlkJywgWzg3NDBdXSwgWydOb0JyZWFrJywgWzgyODhdXSwgWydOb25CcmVha2luZ1NwYWNlJywgWzE2MF1dLCBbJ25vcGYnLCBbMTIwMTU5XV0sIFsnTm9wZicsIFs4NDY5XV0sIFsnTm90JywgWzEwOTg4XV0sIFsnbm90JywgWzE3Ml1dLCBbJ05vdENvbmdydWVudCcsIFs4ODAyXV0sIFsnTm90Q3VwQ2FwJywgWzg4MTNdXSwgWydOb3REb3VibGVWZXJ0aWNhbEJhcicsIFs4NzQyXV0sIFsnTm90RWxlbWVudCcsIFs4NzEzXV0sIFsnTm90RXF1YWwnLCBbODgwMF1dLCBbJ05vdEVxdWFsVGlsZGUnLCBbODc3MCwgODI0XV0sIFsnTm90RXhpc3RzJywgWzg3MDhdXSwgWydOb3RHcmVhdGVyJywgWzg4MTVdXSwgWydOb3RHcmVhdGVyRXF1YWwnLCBbODgxN11dLCBbJ05vdEdyZWF0ZXJGdWxsRXF1YWwnLCBbODgwNywgODI0XV0sIFsnTm90R3JlYXRlckdyZWF0ZXInLCBbODgxMSwgODI0XV0sIFsnTm90R3JlYXRlckxlc3MnLCBbODgyNV1dLCBbJ05vdEdyZWF0ZXJTbGFudEVxdWFsJywgWzEwODc4LCA4MjRdXSwgWydOb3RHcmVhdGVyVGlsZGUnLCBbODgyMV1dLCBbJ05vdEh1bXBEb3duSHVtcCcsIFs4NzgyLCA4MjRdXSwgWydOb3RIdW1wRXF1YWwnLCBbODc4MywgODI0XV0sIFsnbm90aW4nLCBbODcxM11dLCBbJ25vdGluZG90JywgWzg5NDksIDgyNF1dLCBbJ25vdGluRScsIFs4OTUzLCA4MjRdXSwgWydub3RpbnZhJywgWzg3MTNdXSwgWydub3RpbnZiJywgWzg5NTFdXSwgWydub3RpbnZjJywgWzg5NTBdXSwgWydOb3RMZWZ0VHJpYW5nbGVCYXInLCBbMTA3MDMsIDgyNF1dLCBbJ05vdExlZnRUcmlhbmdsZScsIFs4OTM4XV0sIFsnTm90TGVmdFRyaWFuZ2xlRXF1YWwnLCBbODk0MF1dLCBbJ05vdExlc3MnLCBbODgxNF1dLCBbJ05vdExlc3NFcXVhbCcsIFs4ODE2XV0sIFsnTm90TGVzc0dyZWF0ZXInLCBbODgyNF1dLCBbJ05vdExlc3NMZXNzJywgWzg4MTAsIDgyNF1dLCBbJ05vdExlc3NTbGFudEVxdWFsJywgWzEwODc3LCA4MjRdXSwgWydOb3RMZXNzVGlsZGUnLCBbODgyMF1dLCBbJ05vdE5lc3RlZEdyZWF0ZXJHcmVhdGVyJywgWzEwOTE0LCA4MjRdXSwgWydOb3ROZXN0ZWRMZXNzTGVzcycsIFsxMDkxMywgODI0XV0sIFsnbm90bmknLCBbODcxNl1dLCBbJ25vdG5pdmEnLCBbODcxNl1dLCBbJ25vdG5pdmInLCBbODk1OF1dLCBbJ25vdG5pdmMnLCBbODk1N11dLCBbJ05vdFByZWNlZGVzJywgWzg4MzJdXSwgWydOb3RQcmVjZWRlc0VxdWFsJywgWzEwOTI3LCA4MjRdXSwgWydOb3RQcmVjZWRlc1NsYW50RXF1YWwnLCBbODkyOF1dLCBbJ05vdFJldmVyc2VFbGVtZW50JywgWzg3MTZdXSwgWydOb3RSaWdodFRyaWFuZ2xlQmFyJywgWzEwNzA0LCA4MjRdXSwgWydOb3RSaWdodFRyaWFuZ2xlJywgWzg5MzldXSwgWydOb3RSaWdodFRyaWFuZ2xlRXF1YWwnLCBbODk0MV1dLCBbJ05vdFNxdWFyZVN1YnNldCcsIFs4ODQ3LCA4MjRdXSwgWydOb3RTcXVhcmVTdWJzZXRFcXVhbCcsIFs4OTMwXV0sIFsnTm90U3F1YXJlU3VwZXJzZXQnLCBbODg0OCwgODI0XV0sIFsnTm90U3F1YXJlU3VwZXJzZXRFcXVhbCcsIFs4OTMxXV0sIFsnTm90U3Vic2V0JywgWzg4MzQsIDg0MDJdXSwgWydOb3RTdWJzZXRFcXVhbCcsIFs4ODQwXV0sIFsnTm90U3VjY2VlZHMnLCBbODgzM11dLCBbJ05vdFN1Y2NlZWRzRXF1YWwnLCBbMTA5MjgsIDgyNF1dLCBbJ05vdFN1Y2NlZWRzU2xhbnRFcXVhbCcsIFs4OTI5XV0sIFsnTm90U3VjY2VlZHNUaWxkZScsIFs4ODMxLCA4MjRdXSwgWydOb3RTdXBlcnNldCcsIFs4ODM1LCA4NDAyXV0sIFsnTm90U3VwZXJzZXRFcXVhbCcsIFs4ODQxXV0sIFsnTm90VGlsZGUnLCBbODc2OV1dLCBbJ05vdFRpbGRlRXF1YWwnLCBbODc3Ml1dLCBbJ05vdFRpbGRlRnVsbEVxdWFsJywgWzg3NzVdXSwgWydOb3RUaWxkZVRpbGRlJywgWzg3NzddXSwgWydOb3RWZXJ0aWNhbEJhcicsIFs4NzQwXV0sIFsnbnBhcmFsbGVsJywgWzg3NDJdXSwgWyducGFyJywgWzg3NDJdXSwgWyducGFyc2wnLCBbMTEwMDUsIDg0MjFdXSwgWyducGFydCcsIFs4NzA2LCA4MjRdXSwgWyducG9saW50JywgWzEwNzcyXV0sIFsnbnByJywgWzg4MzJdXSwgWyducHJjdWUnLCBbODkyOF1dLCBbJ25wcmVjJywgWzg4MzJdXSwgWyducHJlY2VxJywgWzEwOTI3LCA4MjRdXSwgWyducHJlJywgWzEwOTI3LCA4MjRdXSwgWyducmFycmMnLCBbMTA1NDcsIDgyNF1dLCBbJ25yYXJyJywgWzg2MDNdXSwgWyduckFycicsIFs4NjU1XV0sIFsnbnJhcnJ3JywgWzg2MDUsIDgyNF1dLCBbJ25yaWdodGFycm93JywgWzg2MDNdXSwgWyduUmlnaHRhcnJvdycsIFs4NjU1XV0sIFsnbnJ0cmknLCBbODkzOV1dLCBbJ25ydHJpZScsIFs4OTQxXV0sIFsnbnNjJywgWzg4MzNdXSwgWyduc2NjdWUnLCBbODkyOV1dLCBbJ25zY2UnLCBbMTA5MjgsIDgyNF1dLCBbJ05zY3InLCBbMTE5OTc3XV0sIFsnbnNjcicsIFsxMjAwMDNdXSwgWyduc2hvcnRtaWQnLCBbODc0MF1dLCBbJ25zaG9ydHBhcmFsbGVsJywgWzg3NDJdXSwgWyduc2ltJywgWzg3NjldXSwgWyduc2ltZScsIFs4NzcyXV0sIFsnbnNpbWVxJywgWzg3NzJdXSwgWyduc21pZCcsIFs4NzQwXV0sIFsnbnNwYXInLCBbODc0Ml1dLCBbJ25zcXN1YmUnLCBbODkzMF1dLCBbJ25zcXN1cGUnLCBbODkzMV1dLCBbJ25zdWInLCBbODgzNl1dLCBbJ25zdWJFJywgWzEwOTQ5LCA4MjRdXSwgWyduc3ViZScsIFs4ODQwXV0sIFsnbnN1YnNldCcsIFs4ODM0LCA4NDAyXV0sIFsnbnN1YnNldGVxJywgWzg4NDBdXSwgWyduc3Vic2V0ZXFxJywgWzEwOTQ5LCA4MjRdXSwgWyduc3VjYycsIFs4ODMzXV0sIFsnbnN1Y2NlcScsIFsxMDkyOCwgODI0XV0sIFsnbnN1cCcsIFs4ODM3XV0sIFsnbnN1cEUnLCBbMTA5NTAsIDgyNF1dLCBbJ25zdXBlJywgWzg4NDFdXSwgWyduc3Vwc2V0JywgWzg4MzUsIDg0MDJdXSwgWyduc3Vwc2V0ZXEnLCBbODg0MV1dLCBbJ25zdXBzZXRlcXEnLCBbMTA5NTAsIDgyNF1dLCBbJ250Z2wnLCBbODgyNV1dLCBbJ050aWxkZScsIFsyMDldXSwgWydudGlsZGUnLCBbMjQxXV0sIFsnbnRsZycsIFs4ODI0XV0sIFsnbnRyaWFuZ2xlbGVmdCcsIFs4OTM4XV0sIFsnbnRyaWFuZ2xlbGVmdGVxJywgWzg5NDBdXSwgWydudHJpYW5nbGVyaWdodCcsIFs4OTM5XV0sIFsnbnRyaWFuZ2xlcmlnaHRlcScsIFs4OTQxXV0sIFsnTnUnLCBbOTI1XV0sIFsnbnUnLCBbOTU3XV0sIFsnbnVtJywgWzM1XV0sIFsnbnVtZXJvJywgWzg0NzBdXSwgWydudW1zcCcsIFs4MTk5XV0sIFsnbnZhcCcsIFs4NzgxLCA4NDAyXV0sIFsnbnZkYXNoJywgWzg4NzZdXSwgWydudkRhc2gnLCBbODg3N11dLCBbJ25WZGFzaCcsIFs4ODc4XV0sIFsnblZEYXNoJywgWzg4NzldXSwgWydudmdlJywgWzg4MDUsIDg0MDJdXSwgWydudmd0JywgWzYyLCA4NDAyXV0sIFsnbnZIYXJyJywgWzEwNTAwXV0sIFsnbnZpbmZpbicsIFsxMDcxOF1dLCBbJ252bEFycicsIFsxMDQ5OF1dLCBbJ252bGUnLCBbODgwNCwgODQwMl1dLCBbJ252bHQnLCBbNjAsIDg0MDJdXSwgWydudmx0cmllJywgWzg4ODQsIDg0MDJdXSwgWydudnJBcnInLCBbMTA0OTldXSwgWydudnJ0cmllJywgWzg4ODUsIDg0MDJdXSwgWydudnNpbScsIFs4NzY0LCA4NDAyXV0sIFsnbndhcmhrJywgWzEwNTMxXV0sIFsnbndhcnInLCBbODU5OF1dLCBbJ253QXJyJywgWzg2NjJdXSwgWydud2Fycm93JywgWzg1OThdXSwgWydud25lYXInLCBbMTA1MzVdXSwgWydPYWN1dGUnLCBbMjExXV0sIFsnb2FjdXRlJywgWzI0M11dLCBbJ29hc3QnLCBbODg1OV1dLCBbJ09jaXJjJywgWzIxMl1dLCBbJ29jaXJjJywgWzI0NF1dLCBbJ29jaXInLCBbODg1OF1dLCBbJ09jeScsIFsxMDU0XV0sIFsnb2N5JywgWzEwODZdXSwgWydvZGFzaCcsIFs4ODYxXV0sIFsnT2RibGFjJywgWzMzNl1dLCBbJ29kYmxhYycsIFszMzddXSwgWydvZGl2JywgWzEwODA4XV0sIFsnb2RvdCcsIFs4ODU3XV0sIFsnb2Rzb2xkJywgWzEwNjg0XV0sIFsnT0VsaWcnLCBbMzM4XV0sIFsnb2VsaWcnLCBbMzM5XV0sIFsnb2ZjaXInLCBbMTA2ODddXSwgWydPZnInLCBbMTIwMDgyXV0sIFsnb2ZyJywgWzEyMDEwOF1dLCBbJ29nb24nLCBbNzMxXV0sIFsnT2dyYXZlJywgWzIxMF1dLCBbJ29ncmF2ZScsIFsyNDJdXSwgWydvZ3QnLCBbMTA2ODldXSwgWydvaGJhcicsIFsxMDY3N11dLCBbJ29obScsIFs5MzddXSwgWydvaW50JywgWzg3NTBdXSwgWydvbGFycicsIFs4NjM0XV0sIFsnb2xjaXInLCBbMTA2ODZdXSwgWydvbGNyb3NzJywgWzEwNjgzXV0sIFsnb2xpbmUnLCBbODI1NF1dLCBbJ29sdCcsIFsxMDY4OF1dLCBbJ09tYWNyJywgWzMzMl1dLCBbJ29tYWNyJywgWzMzM11dLCBbJ09tZWdhJywgWzkzN11dLCBbJ29tZWdhJywgWzk2OV1dLCBbJ09taWNyb24nLCBbOTI3XV0sIFsnb21pY3JvbicsIFs5NTldXSwgWydvbWlkJywgWzEwNjc4XV0sIFsnb21pbnVzJywgWzg4NTRdXSwgWydPb3BmJywgWzEyMDEzNF1dLCBbJ29vcGYnLCBbMTIwMTYwXV0sIFsnb3BhcicsIFsxMDY3OV1dLCBbJ09wZW5DdXJseURvdWJsZVF1b3RlJywgWzgyMjBdXSwgWydPcGVuQ3VybHlRdW90ZScsIFs4MjE2XV0sIFsnb3BlcnAnLCBbMTA2ODFdXSwgWydvcGx1cycsIFs4ODUzXV0sIFsnb3JhcnInLCBbODYzNV1dLCBbJ09yJywgWzEwODM2XV0sIFsnb3InLCBbODc0NF1dLCBbJ29yZCcsIFsxMDg0NV1dLCBbJ29yZGVyJywgWzg1MDBdXSwgWydvcmRlcm9mJywgWzg1MDBdXSwgWydvcmRmJywgWzE3MF1dLCBbJ29yZG0nLCBbMTg2XV0sIFsnb3JpZ29mJywgWzg4ODZdXSwgWydvcm9yJywgWzEwODM4XV0sIFsnb3JzbG9wZScsIFsxMDgzOV1dLCBbJ29ydicsIFsxMDg0M11dLCBbJ29TJywgWzk0MTZdXSwgWydPc2NyJywgWzExOTk3OF1dLCBbJ29zY3InLCBbODUwMF1dLCBbJ09zbGFzaCcsIFsyMTZdXSwgWydvc2xhc2gnLCBbMjQ4XV0sIFsnb3NvbCcsIFs4ODU2XV0sIFsnT3RpbGRlJywgWzIxM11dLCBbJ290aWxkZScsIFsyNDVdXSwgWydvdGltZXNhcycsIFsxMDgwNl1dLCBbJ090aW1lcycsIFsxMDgwN11dLCBbJ290aW1lcycsIFs4ODU1XV0sIFsnT3VtbCcsIFsyMTRdXSwgWydvdW1sJywgWzI0Nl1dLCBbJ292YmFyJywgWzkwMjFdXSwgWydPdmVyQmFyJywgWzgyNTRdXSwgWydPdmVyQnJhY2UnLCBbOTE4Ml1dLCBbJ092ZXJCcmFja2V0JywgWzkxNDBdXSwgWydPdmVyUGFyZW50aGVzaXMnLCBbOTE4MF1dLCBbJ3BhcmEnLCBbMTgyXV0sIFsncGFyYWxsZWwnLCBbODc0MV1dLCBbJ3BhcicsIFs4NzQxXV0sIFsncGFyc2ltJywgWzEwOTk1XV0sIFsncGFyc2wnLCBbMTEwMDVdXSwgWydwYXJ0JywgWzg3MDZdXSwgWydQYXJ0aWFsRCcsIFs4NzA2XV0sIFsnUGN5JywgWzEwNTVdXSwgWydwY3knLCBbMTA4N11dLCBbJ3BlcmNudCcsIFszN11dLCBbJ3BlcmlvZCcsIFs0Nl1dLCBbJ3Blcm1pbCcsIFs4MjQwXV0sIFsncGVycCcsIFs4ODY5XV0sIFsncGVydGVuaycsIFs4MjQxXV0sIFsnUGZyJywgWzEyMDA4M11dLCBbJ3BmcicsIFsxMjAxMDldXSwgWydQaGknLCBbOTM0XV0sIFsncGhpJywgWzk2Nl1dLCBbJ3BoaXYnLCBbOTgxXV0sIFsncGhtbWF0JywgWzg0OTldXSwgWydwaG9uZScsIFs5NzQyXV0sIFsnUGknLCBbOTI4XV0sIFsncGknLCBbOTYwXV0sIFsncGl0Y2hmb3JrJywgWzg5MTZdXSwgWydwaXYnLCBbOTgyXV0sIFsncGxhbmNrJywgWzg0NjNdXSwgWydwbGFuY2toJywgWzg0NjJdXSwgWydwbGFua3YnLCBbODQ2M11dLCBbJ3BsdXNhY2lyJywgWzEwNzg3XV0sIFsncGx1c2InLCBbODg2Ml1dLCBbJ3BsdXNjaXInLCBbMTA3ODZdXSwgWydwbHVzJywgWzQzXV0sIFsncGx1c2RvJywgWzg3MjRdXSwgWydwbHVzZHUnLCBbMTA3ODldXSwgWydwbHVzZScsIFsxMDg2Nl1dLCBbJ1BsdXNNaW51cycsIFsxNzddXSwgWydwbHVzbW4nLCBbMTc3XV0sIFsncGx1c3NpbScsIFsxMDc5MF1dLCBbJ3BsdXN0d28nLCBbMTA3OTFdXSwgWydwbScsIFsxNzddXSwgWydQb2luY2FyZXBsYW5lJywgWzg0NjBdXSwgWydwb2ludGludCcsIFsxMDc3M11dLCBbJ3BvcGYnLCBbMTIwMTYxXV0sIFsnUG9wZicsIFs4NDczXV0sIFsncG91bmQnLCBbMTYzXV0sIFsncHJhcCcsIFsxMDkzNV1dLCBbJ1ByJywgWzEwOTM5XV0sIFsncHInLCBbODgyNl1dLCBbJ3ByY3VlJywgWzg4MjhdXSwgWydwcmVjYXBwcm94JywgWzEwOTM1XV0sIFsncHJlYycsIFs4ODI2XV0sIFsncHJlY2N1cmx5ZXEnLCBbODgyOF1dLCBbJ1ByZWNlZGVzJywgWzg4MjZdXSwgWydQcmVjZWRlc0VxdWFsJywgWzEwOTI3XV0sIFsnUHJlY2VkZXNTbGFudEVxdWFsJywgWzg4MjhdXSwgWydQcmVjZWRlc1RpbGRlJywgWzg4MzBdXSwgWydwcmVjZXEnLCBbMTA5MjddXSwgWydwcmVjbmFwcHJveCcsIFsxMDkzN11dLCBbJ3ByZWNuZXFxJywgWzEwOTMzXV0sIFsncHJlY25zaW0nLCBbODkzNl1dLCBbJ3ByZScsIFsxMDkyN11dLCBbJ3ByRScsIFsxMDkzMV1dLCBbJ3ByZWNzaW0nLCBbODgzMF1dLCBbJ3ByaW1lJywgWzgyNDJdXSwgWydQcmltZScsIFs4MjQzXV0sIFsncHJpbWVzJywgWzg0NzNdXSwgWydwcm5hcCcsIFsxMDkzN11dLCBbJ3BybkUnLCBbMTA5MzNdXSwgWydwcm5zaW0nLCBbODkzNl1dLCBbJ3Byb2QnLCBbODcxOV1dLCBbJ1Byb2R1Y3QnLCBbODcxOV1dLCBbJ3Byb2ZhbGFyJywgWzkwMDZdXSwgWydwcm9mbGluZScsIFs4OTc4XV0sIFsncHJvZnN1cmYnLCBbODk3OV1dLCBbJ3Byb3AnLCBbODczM11dLCBbJ1Byb3BvcnRpb25hbCcsIFs4NzMzXV0sIFsnUHJvcG9ydGlvbicsIFs4NzU5XV0sIFsncHJvcHRvJywgWzg3MzNdXSwgWydwcnNpbScsIFs4ODMwXV0sIFsncHJ1cmVsJywgWzg4ODBdXSwgWydQc2NyJywgWzExOTk3OV1dLCBbJ3BzY3InLCBbMTIwMDA1XV0sIFsnUHNpJywgWzkzNl1dLCBbJ3BzaScsIFs5NjhdXSwgWydwdW5jc3AnLCBbODIwMF1dLCBbJ1FmcicsIFsxMjAwODRdXSwgWydxZnInLCBbMTIwMTEwXV0sIFsncWludCcsIFsxMDc2NF1dLCBbJ3FvcGYnLCBbMTIwMTYyXV0sIFsnUW9wZicsIFs4NDc0XV0sIFsncXByaW1lJywgWzgyNzldXSwgWydRc2NyJywgWzExOTk4MF1dLCBbJ3FzY3InLCBbMTIwMDA2XV0sIFsncXVhdGVybmlvbnMnLCBbODQ2MV1dLCBbJ3F1YXRpbnQnLCBbMTA3NzRdXSwgWydxdWVzdCcsIFs2M11dLCBbJ3F1ZXN0ZXEnLCBbODc5OV1dLCBbJ3F1b3QnLCBbMzRdXSwgWydRVU9UJywgWzM0XV0sIFsnckFhcnInLCBbODY2N11dLCBbJ3JhY2UnLCBbODc2NSwgODE3XV0sIFsnUmFjdXRlJywgWzM0MF1dLCBbJ3JhY3V0ZScsIFszNDFdXSwgWydyYWRpYycsIFs4NzMwXV0sIFsncmFlbXB0eXYnLCBbMTA2NzVdXSwgWydyYW5nJywgWzEwMjE3XV0sIFsnUmFuZycsIFsxMDIxOV1dLCBbJ3JhbmdkJywgWzEwNjQyXV0sIFsncmFuZ2UnLCBbMTA2NjFdXSwgWydyYW5nbGUnLCBbMTAyMTddXSwgWydyYXF1bycsIFsxODddXSwgWydyYXJyYXAnLCBbMTA2MTNdXSwgWydyYXJyYicsIFs4Njc3XV0sIFsncmFycmJmcycsIFsxMDUyOF1dLCBbJ3JhcnJjJywgWzEwNTQ3XV0sIFsncmFycicsIFs4NTk0XV0sIFsnUmFycicsIFs4NjA4XV0sIFsnckFycicsIFs4NjU4XV0sIFsncmFycmZzJywgWzEwNTI2XV0sIFsncmFycmhrJywgWzg2MThdXSwgWydyYXJybHAnLCBbODYyMF1dLCBbJ3JhcnJwbCcsIFsxMDU2NV1dLCBbJ3JhcnJzaW0nLCBbMTA2MTJdXSwgWydSYXJydGwnLCBbMTA1MThdXSwgWydyYXJydGwnLCBbODYxMV1dLCBbJ3JhcnJ3JywgWzg2MDVdXSwgWydyYXRhaWwnLCBbMTA1MjJdXSwgWydyQXRhaWwnLCBbMTA1MjRdXSwgWydyYXRpbycsIFs4NzU4XV0sIFsncmF0aW9uYWxzJywgWzg0NzRdXSwgWydyYmFycicsIFsxMDUwOV1dLCBbJ3JCYXJyJywgWzEwNTExXV0sIFsnUkJhcnInLCBbMTA1MTJdXSwgWydyYmJyaycsIFsxMDA5OV1dLCBbJ3JicmFjZScsIFsxMjVdXSwgWydyYnJhY2snLCBbOTNdXSwgWydyYnJrZScsIFsxMDYzNl1dLCBbJ3JicmtzbGQnLCBbMTA2MzhdXSwgWydyYnJrc2x1JywgWzEwNjQwXV0sIFsnUmNhcm9uJywgWzM0NF1dLCBbJ3JjYXJvbicsIFszNDVdXSwgWydSY2VkaWwnLCBbMzQyXV0sIFsncmNlZGlsJywgWzM0M11dLCBbJ3JjZWlsJywgWzg5NjldXSwgWydyY3ViJywgWzEyNV1dLCBbJ1JjeScsIFsxMDU2XV0sIFsncmN5JywgWzEwODhdXSwgWydyZGNhJywgWzEwNTUxXV0sIFsncmRsZGhhcicsIFsxMDYwMV1dLCBbJ3JkcXVvJywgWzgyMjFdXSwgWydyZHF1b3InLCBbODIyMV1dLCBbJ0Nsb3NlQ3VybHlEb3VibGVRdW90ZScsIFs4MjIxXV0sIFsncmRzaCcsIFs4NjI3XV0sIFsncmVhbCcsIFs4NDc2XV0sIFsncmVhbGluZScsIFs4NDc1XV0sIFsncmVhbHBhcnQnLCBbODQ3Nl1dLCBbJ3JlYWxzJywgWzg0NzddXSwgWydSZScsIFs4NDc2XV0sIFsncmVjdCcsIFs5NjQ1XV0sIFsncmVnJywgWzE3NF1dLCBbJ1JFRycsIFsxNzRdXSwgWydSZXZlcnNlRWxlbWVudCcsIFs4NzE1XV0sIFsnUmV2ZXJzZUVxdWlsaWJyaXVtJywgWzg2NTFdXSwgWydSZXZlcnNlVXBFcXVpbGlicml1bScsIFsxMDYwN11dLCBbJ3JmaXNodCcsIFsxMDYyMV1dLCBbJ3JmbG9vcicsIFs4OTcxXV0sIFsncmZyJywgWzEyMDExMV1dLCBbJ1JmcicsIFs4NDc2XV0sIFsnckhhcicsIFsxMDU5Nl1dLCBbJ3JoYXJkJywgWzg2NDFdXSwgWydyaGFydScsIFs4NjQwXV0sIFsncmhhcnVsJywgWzEwNjA0XV0sIFsnUmhvJywgWzkyOV1dLCBbJ3JobycsIFs5NjFdXSwgWydyaG92JywgWzEwMDldXSwgWydSaWdodEFuZ2xlQnJhY2tldCcsIFsxMDIxN11dLCBbJ1JpZ2h0QXJyb3dCYXInLCBbODY3N11dLCBbJ3JpZ2h0YXJyb3cnLCBbODU5NF1dLCBbJ1JpZ2h0QXJyb3cnLCBbODU5NF1dLCBbJ1JpZ2h0YXJyb3cnLCBbODY1OF1dLCBbJ1JpZ2h0QXJyb3dMZWZ0QXJyb3cnLCBbODY0NF1dLCBbJ3JpZ2h0YXJyb3d0YWlsJywgWzg2MTFdXSwgWydSaWdodENlaWxpbmcnLCBbODk2OV1dLCBbJ1JpZ2h0RG91YmxlQnJhY2tldCcsIFsxMDIxNV1dLCBbJ1JpZ2h0RG93blRlZVZlY3RvcicsIFsxMDU4OV1dLCBbJ1JpZ2h0RG93blZlY3RvckJhcicsIFsxMDU4MV1dLCBbJ1JpZ2h0RG93blZlY3RvcicsIFs4NjQyXV0sIFsnUmlnaHRGbG9vcicsIFs4OTcxXV0sIFsncmlnaHRoYXJwb29uZG93bicsIFs4NjQxXV0sIFsncmlnaHRoYXJwb29udXAnLCBbODY0MF1dLCBbJ3JpZ2h0bGVmdGFycm93cycsIFs4NjQ0XV0sIFsncmlnaHRsZWZ0aGFycG9vbnMnLCBbODY1Ml1dLCBbJ3JpZ2h0cmlnaHRhcnJvd3MnLCBbODY0OV1dLCBbJ3JpZ2h0c3F1aWdhcnJvdycsIFs4NjA1XV0sIFsnUmlnaHRUZWVBcnJvdycsIFs4NjE0XV0sIFsnUmlnaHRUZWUnLCBbODg2Nl1dLCBbJ1JpZ2h0VGVlVmVjdG9yJywgWzEwNTg3XV0sIFsncmlnaHR0aHJlZXRpbWVzJywgWzg5MDhdXSwgWydSaWdodFRyaWFuZ2xlQmFyJywgWzEwNzA0XV0sIFsnUmlnaHRUcmlhbmdsZScsIFs4ODgzXV0sIFsnUmlnaHRUcmlhbmdsZUVxdWFsJywgWzg4ODVdXSwgWydSaWdodFVwRG93blZlY3RvcicsIFsxMDU3NV1dLCBbJ1JpZ2h0VXBUZWVWZWN0b3InLCBbMTA1ODhdXSwgWydSaWdodFVwVmVjdG9yQmFyJywgWzEwNTgwXV0sIFsnUmlnaHRVcFZlY3RvcicsIFs4NjM4XV0sIFsnUmlnaHRWZWN0b3JCYXInLCBbMTA1NzldXSwgWydSaWdodFZlY3RvcicsIFs4NjQwXV0sIFsncmluZycsIFs3MzBdXSwgWydyaXNpbmdkb3RzZXEnLCBbODc4N11dLCBbJ3JsYXJyJywgWzg2NDRdXSwgWydybGhhcicsIFs4NjUyXV0sIFsncmxtJywgWzgyMDddXSwgWydybW91c3RhY2hlJywgWzkxMzddXSwgWydybW91c3QnLCBbOTEzN11dLCBbJ3JubWlkJywgWzEwOTkwXV0sIFsncm9hbmcnLCBbMTAyMjFdXSwgWydyb2FycicsIFs4NzAyXV0sIFsncm9icmsnLCBbMTAyMTVdXSwgWydyb3BhcicsIFsxMDYzMF1dLCBbJ3JvcGYnLCBbMTIwMTYzXV0sIFsnUm9wZicsIFs4NDc3XV0sIFsncm9wbHVzJywgWzEwNzk4XV0sIFsncm90aW1lcycsIFsxMDgwNV1dLCBbJ1JvdW5kSW1wbGllcycsIFsxMDYwOF1dLCBbJ3JwYXInLCBbNDFdXSwgWydycGFyZ3QnLCBbMTA2NDRdXSwgWydycHBvbGludCcsIFsxMDc3MF1dLCBbJ3JyYXJyJywgWzg2NDldXSwgWydScmlnaHRhcnJvdycsIFs4NjY3XV0sIFsncnNhcXVvJywgWzgyNTBdXSwgWydyc2NyJywgWzEyMDAwN11dLCBbJ1JzY3InLCBbODQ3NV1dLCBbJ3JzaCcsIFs4NjI1XV0sIFsnUnNoJywgWzg2MjVdXSwgWydyc3FiJywgWzkzXV0sIFsncnNxdW8nLCBbODIxN11dLCBbJ3JzcXVvcicsIFs4MjE3XV0sIFsnQ2xvc2VDdXJseVF1b3RlJywgWzgyMTddXSwgWydydGhyZWUnLCBbODkwOF1dLCBbJ3J0aW1lcycsIFs4OTA2XV0sIFsncnRyaScsIFs5NjU3XV0sIFsncnRyaWUnLCBbODg4NV1dLCBbJ3J0cmlmJywgWzk2NTZdXSwgWydydHJpbHRyaScsIFsxMDcwMl1dLCBbJ1J1bGVEZWxheWVkJywgWzEwNzQwXV0sIFsncnVsdWhhcicsIFsxMDYwMF1dLCBbJ3J4JywgWzg0NzhdXSwgWydTYWN1dGUnLCBbMzQ2XV0sIFsnc2FjdXRlJywgWzM0N11dLCBbJ3NicXVvJywgWzgyMThdXSwgWydzY2FwJywgWzEwOTM2XV0sIFsnU2Nhcm9uJywgWzM1Ml1dLCBbJ3NjYXJvbicsIFszNTNdXSwgWydTYycsIFsxMDk0MF1dLCBbJ3NjJywgWzg4MjddXSwgWydzY2N1ZScsIFs4ODI5XV0sIFsnc2NlJywgWzEwOTI4XV0sIFsnc2NFJywgWzEwOTMyXV0sIFsnU2NlZGlsJywgWzM1MF1dLCBbJ3NjZWRpbCcsIFszNTFdXSwgWydTY2lyYycsIFszNDhdXSwgWydzY2lyYycsIFszNDldXSwgWydzY25hcCcsIFsxMDkzOF1dLCBbJ3NjbkUnLCBbMTA5MzRdXSwgWydzY25zaW0nLCBbODkzN11dLCBbJ3NjcG9saW50JywgWzEwNzcxXV0sIFsnc2NzaW0nLCBbODgzMV1dLCBbJ1NjeScsIFsxMDU3XV0sIFsnc2N5JywgWzEwODldXSwgWydzZG90YicsIFs4ODY1XV0sIFsnc2RvdCcsIFs4OTAxXV0sIFsnc2RvdGUnLCBbMTA4NTRdXSwgWydzZWFyaGsnLCBbMTA1MzNdXSwgWydzZWFycicsIFs4NjAwXV0sIFsnc2VBcnInLCBbODY2NF1dLCBbJ3NlYXJyb3cnLCBbODYwMF1dLCBbJ3NlY3QnLCBbMTY3XV0sIFsnc2VtaScsIFs1OV1dLCBbJ3Nlc3dhcicsIFsxMDUzN11dLCBbJ3NldG1pbnVzJywgWzg3MjZdXSwgWydzZXRtbicsIFs4NzI2XV0sIFsnc2V4dCcsIFsxMDAzOF1dLCBbJ1NmcicsIFsxMjAwODZdXSwgWydzZnInLCBbMTIwMTEyXV0sIFsnc2Zyb3duJywgWzg5OTRdXSwgWydzaGFycCcsIFs5ODM5XV0sIFsnU0hDSGN5JywgWzEwNjVdXSwgWydzaGNoY3knLCBbMTA5N11dLCBbJ1NIY3knLCBbMTA2NF1dLCBbJ3NoY3knLCBbMTA5Nl1dLCBbJ1Nob3J0RG93bkFycm93JywgWzg1OTVdXSwgWydTaG9ydExlZnRBcnJvdycsIFs4NTkyXV0sIFsnc2hvcnRtaWQnLCBbODczOV1dLCBbJ3Nob3J0cGFyYWxsZWwnLCBbODc0MV1dLCBbJ1Nob3J0UmlnaHRBcnJvdycsIFs4NTk0XV0sIFsnU2hvcnRVcEFycm93JywgWzg1OTNdXSwgWydzaHknLCBbMTczXV0sIFsnU2lnbWEnLCBbOTMxXV0sIFsnc2lnbWEnLCBbOTYzXV0sIFsnc2lnbWFmJywgWzk2Ml1dLCBbJ3NpZ21hdicsIFs5NjJdXSwgWydzaW0nLCBbODc2NF1dLCBbJ3NpbWRvdCcsIFsxMDg1OF1dLCBbJ3NpbWUnLCBbODc3MV1dLCBbJ3NpbWVxJywgWzg3NzFdXSwgWydzaW1nJywgWzEwOTEwXV0sIFsnc2ltZ0UnLCBbMTA5MTJdXSwgWydzaW1sJywgWzEwOTA5XV0sIFsnc2ltbEUnLCBbMTA5MTFdXSwgWydzaW1uZScsIFs4Nzc0XV0sIFsnc2ltcGx1cycsIFsxMDc4OF1dLCBbJ3NpbXJhcnInLCBbMTA2MTBdXSwgWydzbGFycicsIFs4NTkyXV0sIFsnU21hbGxDaXJjbGUnLCBbODcyOF1dLCBbJ3NtYWxsc2V0bWludXMnLCBbODcyNl1dLCBbJ3NtYXNocCcsIFsxMDgwM11dLCBbJ3NtZXBhcnNsJywgWzEwNzI0XV0sIFsnc21pZCcsIFs4NzM5XV0sIFsnc21pbGUnLCBbODk5NV1dLCBbJ3NtdCcsIFsxMDkyMl1dLCBbJ3NtdGUnLCBbMTA5MjRdXSwgWydzbXRlcycsIFsxMDkyNCwgNjUwMjRdXSwgWydTT0ZUY3knLCBbMTA2OF1dLCBbJ3NvZnRjeScsIFsxMTAwXV0sIFsnc29sYmFyJywgWzkwMjNdXSwgWydzb2xiJywgWzEwNjkyXV0sIFsnc29sJywgWzQ3XV0sIFsnU29wZicsIFsxMjAxMzhdXSwgWydzb3BmJywgWzEyMDE2NF1dLCBbJ3NwYWRlcycsIFs5ODI0XV0sIFsnc3BhZGVzdWl0JywgWzk4MjRdXSwgWydzcGFyJywgWzg3NDFdXSwgWydzcWNhcCcsIFs4ODUxXV0sIFsnc3FjYXBzJywgWzg4NTEsIDY1MDI0XV0sIFsnc3FjdXAnLCBbODg1Ml1dLCBbJ3NxY3VwcycsIFs4ODUyLCA2NTAyNF1dLCBbJ1NxcnQnLCBbODczMF1dLCBbJ3Nxc3ViJywgWzg4NDddXSwgWydzcXN1YmUnLCBbODg0OV1dLCBbJ3Nxc3Vic2V0JywgWzg4NDddXSwgWydzcXN1YnNldGVxJywgWzg4NDldXSwgWydzcXN1cCcsIFs4ODQ4XV0sIFsnc3FzdXBlJywgWzg4NTBdXSwgWydzcXN1cHNldCcsIFs4ODQ4XV0sIFsnc3FzdXBzZXRlcScsIFs4ODUwXV0sIFsnc3F1YXJlJywgWzk2MzNdXSwgWydTcXVhcmUnLCBbOTYzM11dLCBbJ1NxdWFyZUludGVyc2VjdGlvbicsIFs4ODUxXV0sIFsnU3F1YXJlU3Vic2V0JywgWzg4NDddXSwgWydTcXVhcmVTdWJzZXRFcXVhbCcsIFs4ODQ5XV0sIFsnU3F1YXJlU3VwZXJzZXQnLCBbODg0OF1dLCBbJ1NxdWFyZVN1cGVyc2V0RXF1YWwnLCBbODg1MF1dLCBbJ1NxdWFyZVVuaW9uJywgWzg4NTJdXSwgWydzcXVhcmYnLCBbOTY0Ml1dLCBbJ3NxdScsIFs5NjMzXV0sIFsnc3F1ZicsIFs5NjQyXV0sIFsnc3JhcnInLCBbODU5NF1dLCBbJ1NzY3InLCBbMTE5OTgyXV0sIFsnc3NjcicsIFsxMjAwMDhdXSwgWydzc2V0bW4nLCBbODcyNl1dLCBbJ3NzbWlsZScsIFs4OTk1XV0sIFsnc3N0YXJmJywgWzg5MDJdXSwgWydTdGFyJywgWzg5MDJdXSwgWydzdGFyJywgWzk3MzRdXSwgWydzdGFyZicsIFs5NzMzXV0sIFsnc3RyYWlnaHRlcHNpbG9uJywgWzEwMTNdXSwgWydzdHJhaWdodHBoaScsIFs5ODFdXSwgWydzdHJucycsIFsxNzVdXSwgWydzdWInLCBbODgzNF1dLCBbJ1N1YicsIFs4OTEyXV0sIFsnc3ViZG90JywgWzEwOTQxXV0sIFsnc3ViRScsIFsxMDk0OV1dLCBbJ3N1YmUnLCBbODgzOF1dLCBbJ3N1YmVkb3QnLCBbMTA5NDddXSwgWydzdWJtdWx0JywgWzEwOTQ1XV0sIFsnc3VibkUnLCBbMTA5NTVdXSwgWydzdWJuZScsIFs4ODQyXV0sIFsnc3VicGx1cycsIFsxMDk0M11dLCBbJ3N1YnJhcnInLCBbMTA2MTddXSwgWydzdWJzZXQnLCBbODgzNF1dLCBbJ1N1YnNldCcsIFs4OTEyXV0sIFsnc3Vic2V0ZXEnLCBbODgzOF1dLCBbJ3N1YnNldGVxcScsIFsxMDk0OV1dLCBbJ1N1YnNldEVxdWFsJywgWzg4MzhdXSwgWydzdWJzZXRuZXEnLCBbODg0Ml1dLCBbJ3N1YnNldG5lcXEnLCBbMTA5NTVdXSwgWydzdWJzaW0nLCBbMTA5NTFdXSwgWydzdWJzdWInLCBbMTA5NjVdXSwgWydzdWJzdXAnLCBbMTA5NjNdXSwgWydzdWNjYXBwcm94JywgWzEwOTM2XV0sIFsnc3VjYycsIFs4ODI3XV0sIFsnc3VjY2N1cmx5ZXEnLCBbODgyOV1dLCBbJ1N1Y2NlZWRzJywgWzg4MjddXSwgWydTdWNjZWVkc0VxdWFsJywgWzEwOTI4XV0sIFsnU3VjY2VlZHNTbGFudEVxdWFsJywgWzg4MjldXSwgWydTdWNjZWVkc1RpbGRlJywgWzg4MzFdXSwgWydzdWNjZXEnLCBbMTA5MjhdXSwgWydzdWNjbmFwcHJveCcsIFsxMDkzOF1dLCBbJ3N1Y2NuZXFxJywgWzEwOTM0XV0sIFsnc3VjY25zaW0nLCBbODkzN11dLCBbJ3N1Y2NzaW0nLCBbODgzMV1dLCBbJ1N1Y2hUaGF0JywgWzg3MTVdXSwgWydzdW0nLCBbODcyMV1dLCBbJ1N1bScsIFs4NzIxXV0sIFsnc3VuZycsIFs5ODM0XV0sIFsnc3VwMScsIFsxODVdXSwgWydzdXAyJywgWzE3OF1dLCBbJ3N1cDMnLCBbMTc5XV0sIFsnc3VwJywgWzg4MzVdXSwgWydTdXAnLCBbODkxM11dLCBbJ3N1cGRvdCcsIFsxMDk0Ml1dLCBbJ3N1cGRzdWInLCBbMTA5NjhdXSwgWydzdXBFJywgWzEwOTUwXV0sIFsnc3VwZScsIFs4ODM5XV0sIFsnc3VwZWRvdCcsIFsxMDk0OF1dLCBbJ1N1cGVyc2V0JywgWzg4MzVdXSwgWydTdXBlcnNldEVxdWFsJywgWzg4MzldXSwgWydzdXBoc29sJywgWzEwMTg1XV0sIFsnc3VwaHN1YicsIFsxMDk2N11dLCBbJ3N1cGxhcnInLCBbMTA2MTldXSwgWydzdXBtdWx0JywgWzEwOTQ2XV0sIFsnc3VwbkUnLCBbMTA5NTZdXSwgWydzdXBuZScsIFs4ODQzXV0sIFsnc3VwcGx1cycsIFsxMDk0NF1dLCBbJ3N1cHNldCcsIFs4ODM1XV0sIFsnU3Vwc2V0JywgWzg5MTNdXSwgWydzdXBzZXRlcScsIFs4ODM5XV0sIFsnc3Vwc2V0ZXFxJywgWzEwOTUwXV0sIFsnc3Vwc2V0bmVxJywgWzg4NDNdXSwgWydzdXBzZXRuZXFxJywgWzEwOTU2XV0sIFsnc3Vwc2ltJywgWzEwOTUyXV0sIFsnc3Vwc3ViJywgWzEwOTY0XV0sIFsnc3Vwc3VwJywgWzEwOTY2XV0sIFsnc3dhcmhrJywgWzEwNTM0XV0sIFsnc3dhcnInLCBbODYwMV1dLCBbJ3N3QXJyJywgWzg2NjVdXSwgWydzd2Fycm93JywgWzg2MDFdXSwgWydzd253YXInLCBbMTA1MzhdXSwgWydzemxpZycsIFsyMjNdXSwgWydUYWInLCBbOV1dLCBbJ3RhcmdldCcsIFs4OTgyXV0sIFsnVGF1JywgWzkzMl1dLCBbJ3RhdScsIFs5NjRdXSwgWyd0YnJrJywgWzkxNDBdXSwgWydUY2Fyb24nLCBbMzU2XV0sIFsndGNhcm9uJywgWzM1N11dLCBbJ1RjZWRpbCcsIFszNTRdXSwgWyd0Y2VkaWwnLCBbMzU1XV0sIFsnVGN5JywgWzEwNThdXSwgWyd0Y3knLCBbMTA5MF1dLCBbJ3Rkb3QnLCBbODQxMV1dLCBbJ3RlbHJlYycsIFs4OTgxXV0sIFsnVGZyJywgWzEyMDA4N11dLCBbJ3RmcicsIFsxMjAxMTNdXSwgWyd0aGVyZTQnLCBbODc1Nl1dLCBbJ3RoZXJlZm9yZScsIFs4NzU2XV0sIFsnVGhlcmVmb3JlJywgWzg3NTZdXSwgWydUaGV0YScsIFs5MjBdXSwgWyd0aGV0YScsIFs5NTJdXSwgWyd0aGV0YXN5bScsIFs5NzddXSwgWyd0aGV0YXYnLCBbOTc3XV0sIFsndGhpY2thcHByb3gnLCBbODc3Nl1dLCBbJ3RoaWNrc2ltJywgWzg3NjRdXSwgWydUaGlja1NwYWNlJywgWzgyODcsIDgyMDJdXSwgWydUaGluU3BhY2UnLCBbODIwMV1dLCBbJ3RoaW5zcCcsIFs4MjAxXV0sIFsndGhrYXAnLCBbODc3Nl1dLCBbJ3Roa3NpbScsIFs4NzY0XV0sIFsnVEhPUk4nLCBbMjIyXV0sIFsndGhvcm4nLCBbMjU0XV0sIFsndGlsZGUnLCBbNzMyXV0sIFsnVGlsZGUnLCBbODc2NF1dLCBbJ1RpbGRlRXF1YWwnLCBbODc3MV1dLCBbJ1RpbGRlRnVsbEVxdWFsJywgWzg3NzNdXSwgWydUaWxkZVRpbGRlJywgWzg3NzZdXSwgWyd0aW1lc2JhcicsIFsxMDgwMV1dLCBbJ3RpbWVzYicsIFs4ODY0XV0sIFsndGltZXMnLCBbMjE1XV0sIFsndGltZXNkJywgWzEwODAwXV0sIFsndGludCcsIFs4NzQ5XV0sIFsndG9lYScsIFsxMDUzNl1dLCBbJ3RvcGJvdCcsIFs5MDE0XV0sIFsndG9wY2lyJywgWzEwOTkzXV0sIFsndG9wJywgWzg4NjhdXSwgWydUb3BmJywgWzEyMDEzOV1dLCBbJ3RvcGYnLCBbMTIwMTY1XV0sIFsndG9wZm9yaycsIFsxMDk3MF1dLCBbJ3Rvc2EnLCBbMTA1MzddXSwgWyd0cHJpbWUnLCBbODI0NF1dLCBbJ3RyYWRlJywgWzg0ODJdXSwgWydUUkFERScsIFs4NDgyXV0sIFsndHJpYW5nbGUnLCBbOTY1M11dLCBbJ3RyaWFuZ2xlZG93bicsIFs5NjYzXV0sIFsndHJpYW5nbGVsZWZ0JywgWzk2NjddXSwgWyd0cmlhbmdsZWxlZnRlcScsIFs4ODg0XV0sIFsndHJpYW5nbGVxJywgWzg3OTZdXSwgWyd0cmlhbmdsZXJpZ2h0JywgWzk2NTddXSwgWyd0cmlhbmdsZXJpZ2h0ZXEnLCBbODg4NV1dLCBbJ3RyaWRvdCcsIFs5NzA4XV0sIFsndHJpZScsIFs4Nzk2XV0sIFsndHJpbWludXMnLCBbMTA4MTBdXSwgWydUcmlwbGVEb3QnLCBbODQxMV1dLCBbJ3RyaXBsdXMnLCBbMTA4MDldXSwgWyd0cmlzYicsIFsxMDcwMV1dLCBbJ3RyaXRpbWUnLCBbMTA4MTFdXSwgWyd0cnBleml1bScsIFs5MTg2XV0sIFsnVHNjcicsIFsxMTk5ODNdXSwgWyd0c2NyJywgWzEyMDAwOV1dLCBbJ1RTY3knLCBbMTA2Ml1dLCBbJ3RzY3knLCBbMTA5NF1dLCBbJ1RTSGN5JywgWzEwMzVdXSwgWyd0c2hjeScsIFsxMTE1XV0sIFsnVHN0cm9rJywgWzM1OF1dLCBbJ3RzdHJvaycsIFszNTldXSwgWyd0d2l4dCcsIFs4ODEyXV0sIFsndHdvaGVhZGxlZnRhcnJvdycsIFs4NjA2XV0sIFsndHdvaGVhZHJpZ2h0YXJyb3cnLCBbODYwOF1dLCBbJ1VhY3V0ZScsIFsyMThdXSwgWyd1YWN1dGUnLCBbMjUwXV0sIFsndWFycicsIFs4NTkzXV0sIFsnVWFycicsIFs4NjA3XV0sIFsndUFycicsIFs4NjU3XV0sIFsnVWFycm9jaXInLCBbMTA1NjldXSwgWydVYnJjeScsIFsxMDM4XV0sIFsndWJyY3knLCBbMTExOF1dLCBbJ1VicmV2ZScsIFszNjRdXSwgWyd1YnJldmUnLCBbMzY1XV0sIFsnVWNpcmMnLCBbMjE5XV0sIFsndWNpcmMnLCBbMjUxXV0sIFsnVWN5JywgWzEwNTldXSwgWyd1Y3knLCBbMTA5MV1dLCBbJ3VkYXJyJywgWzg2NDVdXSwgWydVZGJsYWMnLCBbMzY4XV0sIFsndWRibGFjJywgWzM2OV1dLCBbJ3VkaGFyJywgWzEwNjA2XV0sIFsndWZpc2h0JywgWzEwNjIyXV0sIFsnVWZyJywgWzEyMDA4OF1dLCBbJ3VmcicsIFsxMjAxMTRdXSwgWydVZ3JhdmUnLCBbMjE3XV0sIFsndWdyYXZlJywgWzI0OV1dLCBbJ3VIYXInLCBbMTA1OTVdXSwgWyd1aGFybCcsIFs4NjM5XV0sIFsndWhhcnInLCBbODYzOF1dLCBbJ3VoYmxrJywgWzk2MDBdXSwgWyd1bGNvcm4nLCBbODk4OF1dLCBbJ3VsY29ybmVyJywgWzg5ODhdXSwgWyd1bGNyb3AnLCBbODk3NV1dLCBbJ3VsdHJpJywgWzk3MjBdXSwgWydVbWFjcicsIFszNjJdXSwgWyd1bWFjcicsIFszNjNdXSwgWyd1bWwnLCBbMTY4XV0sIFsnVW5kZXJCYXInLCBbOTVdXSwgWydVbmRlckJyYWNlJywgWzkxODNdXSwgWydVbmRlckJyYWNrZXQnLCBbOTE0MV1dLCBbJ1VuZGVyUGFyZW50aGVzaXMnLCBbOTE4MV1dLCBbJ1VuaW9uJywgWzg4OTldXSwgWydVbmlvblBsdXMnLCBbODg0Nl1dLCBbJ1VvZ29uJywgWzM3MF1dLCBbJ3VvZ29uJywgWzM3MV1dLCBbJ1VvcGYnLCBbMTIwMTQwXV0sIFsndW9wZicsIFsxMjAxNjZdXSwgWydVcEFycm93QmFyJywgWzEwNTE0XV0sIFsndXBhcnJvdycsIFs4NTkzXV0sIFsnVXBBcnJvdycsIFs4NTkzXV0sIFsnVXBhcnJvdycsIFs4NjU3XV0sIFsnVXBBcnJvd0Rvd25BcnJvdycsIFs4NjQ1XV0sIFsndXBkb3duYXJyb3cnLCBbODU5N11dLCBbJ1VwRG93bkFycm93JywgWzg1OTddXSwgWydVcGRvd25hcnJvdycsIFs4NjYxXV0sIFsnVXBFcXVpbGlicml1bScsIFsxMDYwNl1dLCBbJ3VwaGFycG9vbmxlZnQnLCBbODYzOV1dLCBbJ3VwaGFycG9vbnJpZ2h0JywgWzg2MzhdXSwgWyd1cGx1cycsIFs4ODQ2XV0sIFsnVXBwZXJMZWZ0QXJyb3cnLCBbODU5OF1dLCBbJ1VwcGVyUmlnaHRBcnJvdycsIFs4NTk5XV0sIFsndXBzaScsIFs5NjVdXSwgWydVcHNpJywgWzk3OF1dLCBbJ3Vwc2loJywgWzk3OF1dLCBbJ1Vwc2lsb24nLCBbOTMzXV0sIFsndXBzaWxvbicsIFs5NjVdXSwgWydVcFRlZUFycm93JywgWzg2MTNdXSwgWydVcFRlZScsIFs4ODY5XV0sIFsndXB1cGFycm93cycsIFs4NjQ4XV0sIFsndXJjb3JuJywgWzg5ODldXSwgWyd1cmNvcm5lcicsIFs4OTg5XV0sIFsndXJjcm9wJywgWzg5NzRdXSwgWydVcmluZycsIFszNjZdXSwgWyd1cmluZycsIFszNjddXSwgWyd1cnRyaScsIFs5NzIxXV0sIFsnVXNjcicsIFsxMTk5ODRdXSwgWyd1c2NyJywgWzEyMDAxMF1dLCBbJ3V0ZG90JywgWzg5NDRdXSwgWydVdGlsZGUnLCBbMzYwXV0sIFsndXRpbGRlJywgWzM2MV1dLCBbJ3V0cmknLCBbOTY1M11dLCBbJ3V0cmlmJywgWzk2NTJdXSwgWyd1dWFycicsIFs4NjQ4XV0sIFsnVXVtbCcsIFsyMjBdXSwgWyd1dW1sJywgWzI1Ml1dLCBbJ3V3YW5nbGUnLCBbMTA2NjNdXSwgWyd2YW5ncnQnLCBbMTA2NTJdXSwgWyd2YXJlcHNpbG9uJywgWzEwMTNdXSwgWyd2YXJrYXBwYScsIFsxMDA4XV0sIFsndmFybm90aGluZycsIFs4NzA5XV0sIFsndmFycGhpJywgWzk4MV1dLCBbJ3ZhcnBpJywgWzk4Ml1dLCBbJ3ZhcnByb3B0bycsIFs4NzMzXV0sIFsndmFycicsIFs4NTk3XV0sIFsndkFycicsIFs4NjYxXV0sIFsndmFycmhvJywgWzEwMDldXSwgWyd2YXJzaWdtYScsIFs5NjJdXSwgWyd2YXJzdWJzZXRuZXEnLCBbODg0MiwgNjUwMjRdXSwgWyd2YXJzdWJzZXRuZXFxJywgWzEwOTU1LCA2NTAyNF1dLCBbJ3ZhcnN1cHNldG5lcScsIFs4ODQzLCA2NTAyNF1dLCBbJ3ZhcnN1cHNldG5lcXEnLCBbMTA5NTYsIDY1MDI0XV0sIFsndmFydGhldGEnLCBbOTc3XV0sIFsndmFydHJpYW5nbGVsZWZ0JywgWzg4ODJdXSwgWyd2YXJ0cmlhbmdsZXJpZ2h0JywgWzg4ODNdXSwgWyd2QmFyJywgWzEwOTg0XV0sIFsnVmJhcicsIFsxMDk4N11dLCBbJ3ZCYXJ2JywgWzEwOTg1XV0sIFsnVmN5JywgWzEwNDJdXSwgWyd2Y3knLCBbMTA3NF1dLCBbJ3ZkYXNoJywgWzg4NjZdXSwgWyd2RGFzaCcsIFs4ODcyXV0sIFsnVmRhc2gnLCBbODg3M11dLCBbJ1ZEYXNoJywgWzg4NzVdXSwgWydWZGFzaGwnLCBbMTA5ODJdXSwgWyd2ZWViYXInLCBbODg5MV1dLCBbJ3ZlZScsIFs4NzQ0XV0sIFsnVmVlJywgWzg4OTddXSwgWyd2ZWVlcScsIFs4Nzk0XV0sIFsndmVsbGlwJywgWzg5NDJdXSwgWyd2ZXJiYXInLCBbMTI0XV0sIFsnVmVyYmFyJywgWzgyMTRdXSwgWyd2ZXJ0JywgWzEyNF1dLCBbJ1ZlcnQnLCBbODIxNF1dLCBbJ1ZlcnRpY2FsQmFyJywgWzg3MzldXSwgWydWZXJ0aWNhbExpbmUnLCBbMTI0XV0sIFsnVmVydGljYWxTZXBhcmF0b3InLCBbMTAwNzJdXSwgWydWZXJ0aWNhbFRpbGRlJywgWzg3NjhdXSwgWydWZXJ5VGhpblNwYWNlJywgWzgyMDJdXSwgWydWZnInLCBbMTIwMDg5XV0sIFsndmZyJywgWzEyMDExNV1dLCBbJ3ZsdHJpJywgWzg4ODJdXSwgWyd2bnN1YicsIFs4ODM0LCA4NDAyXV0sIFsndm5zdXAnLCBbODgzNSwgODQwMl1dLCBbJ1ZvcGYnLCBbMTIwMTQxXV0sIFsndm9wZicsIFsxMjAxNjddXSwgWyd2cHJvcCcsIFs4NzMzXV0sIFsndnJ0cmknLCBbODg4M11dLCBbJ1ZzY3InLCBbMTE5OTg1XV0sIFsndnNjcicsIFsxMjAwMTFdXSwgWyd2c3VibkUnLCBbMTA5NTUsIDY1MDI0XV0sIFsndnN1Ym5lJywgWzg4NDIsIDY1MDI0XV0sIFsndnN1cG5FJywgWzEwOTU2LCA2NTAyNF1dLCBbJ3ZzdXBuZScsIFs4ODQzLCA2NTAyNF1dLCBbJ1Z2ZGFzaCcsIFs4ODc0XV0sIFsndnppZ3phZycsIFsxMDY1MF1dLCBbJ1djaXJjJywgWzM3Ml1dLCBbJ3djaXJjJywgWzM3M11dLCBbJ3dlZGJhcicsIFsxMDg0N11dLCBbJ3dlZGdlJywgWzg3NDNdXSwgWydXZWRnZScsIFs4ODk2XV0sIFsnd2VkZ2VxJywgWzg3OTNdXSwgWyd3ZWllcnAnLCBbODQ3Ml1dLCBbJ1dmcicsIFsxMjAwOTBdXSwgWyd3ZnInLCBbMTIwMTE2XV0sIFsnV29wZicsIFsxMjAxNDJdXSwgWyd3b3BmJywgWzEyMDE2OF1dLCBbJ3dwJywgWzg0NzJdXSwgWyd3cicsIFs4NzY4XV0sIFsnd3JlYXRoJywgWzg3NjhdXSwgWydXc2NyJywgWzExOTk4Nl1dLCBbJ3dzY3InLCBbMTIwMDEyXV0sIFsneGNhcCcsIFs4ODk4XV0sIFsneGNpcmMnLCBbOTcxMV1dLCBbJ3hjdXAnLCBbODg5OV1dLCBbJ3hkdHJpJywgWzk2NjFdXSwgWydYZnInLCBbMTIwMDkxXV0sIFsneGZyJywgWzEyMDExN11dLCBbJ3hoYXJyJywgWzEwMjMxXV0sIFsneGhBcnInLCBbMTAyMzRdXSwgWydYaScsIFs5MjZdXSwgWyd4aScsIFs5NThdXSwgWyd4bGFycicsIFsxMDIyOV1dLCBbJ3hsQXJyJywgWzEwMjMyXV0sIFsneG1hcCcsIFsxMDIzNl1dLCBbJ3huaXMnLCBbODk1NV1dLCBbJ3hvZG90JywgWzEwNzUyXV0sIFsnWG9wZicsIFsxMjAxNDNdXSwgWyd4b3BmJywgWzEyMDE2OV1dLCBbJ3hvcGx1cycsIFsxMDc1M11dLCBbJ3hvdGltZScsIFsxMDc1NF1dLCBbJ3hyYXJyJywgWzEwMjMwXV0sIFsneHJBcnInLCBbMTAyMzNdXSwgWydYc2NyJywgWzExOTk4N11dLCBbJ3hzY3InLCBbMTIwMDEzXV0sIFsneHNxY3VwJywgWzEwNzU4XV0sIFsneHVwbHVzJywgWzEwNzU2XV0sIFsneHV0cmknLCBbOTY1MV1dLCBbJ3h2ZWUnLCBbODg5N11dLCBbJ3h3ZWRnZScsIFs4ODk2XV0sIFsnWWFjdXRlJywgWzIyMV1dLCBbJ3lhY3V0ZScsIFsyNTNdXSwgWydZQWN5JywgWzEwNzFdXSwgWyd5YWN5JywgWzExMDNdXSwgWydZY2lyYycsIFszNzRdXSwgWyd5Y2lyYycsIFszNzVdXSwgWydZY3knLCBbMTA2N11dLCBbJ3ljeScsIFsxMDk5XV0sIFsneWVuJywgWzE2NV1dLCBbJ1lmcicsIFsxMjAwOTJdXSwgWyd5ZnInLCBbMTIwMTE4XV0sIFsnWUljeScsIFsxMDMxXV0sIFsneWljeScsIFsxMTExXV0sIFsnWW9wZicsIFsxMjAxNDRdXSwgWyd5b3BmJywgWzEyMDE3MF1dLCBbJ1lzY3InLCBbMTE5OTg4XV0sIFsneXNjcicsIFsxMjAwMTRdXSwgWydZVWN5JywgWzEwNzBdXSwgWyd5dWN5JywgWzExMDJdXSwgWyd5dW1sJywgWzI1NV1dLCBbJ1l1bWwnLCBbMzc2XV0sIFsnWmFjdXRlJywgWzM3N11dLCBbJ3phY3V0ZScsIFszNzhdXSwgWydaY2Fyb24nLCBbMzgxXV0sIFsnemNhcm9uJywgWzM4Ml1dLCBbJ1pjeScsIFsxMDQ3XV0sIFsnemN5JywgWzEwNzldXSwgWydaZG90JywgWzM3OV1dLCBbJ3pkb3QnLCBbMzgwXV0sIFsnemVldHJmJywgWzg0ODhdXSwgWydaZXJvV2lkdGhTcGFjZScsIFs4MjAzXV0sIFsnWmV0YScsIFs5MThdXSwgWyd6ZXRhJywgWzk1MF1dLCBbJ3pmcicsIFsxMjAxMTldXSwgWydaZnInLCBbODQ4OF1dLCBbJ1pIY3knLCBbMTA0Nl1dLCBbJ3poY3knLCBbMTA3OF1dLCBbJ3ppZ3JhcnInLCBbODY2OV1dLCBbJ3pvcGYnLCBbMTIwMTcxXV0sIFsnWm9wZicsIFs4NDg0XV0sIFsnWnNjcicsIFsxMTk5ODldXSwgWyd6c2NyJywgWzEyMDAxNV1dLCBbJ3p3aicsIFs4MjA1XV0sIFsnenduaicsIFs4MjA0XV1dO1xuXG52YXIgYWxwaGFJbmRleCA9IHt9O1xudmFyIGNoYXJJbmRleCA9IHt9O1xuXG5jcmVhdGVJbmRleGVzKGFscGhhSW5kZXgsIGNoYXJJbmRleCk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEh0bWw1RW50aXRpZXMoKSB7fVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw1RW50aXRpZXMucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mKCM/W1xcd1xcZF0rKTs/L2csIGZ1bmN0aW9uKHMsIGVudGl0eSkge1xuICAgICAgICB2YXIgY2hyO1xuICAgICAgICBpZiAoZW50aXR5LmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgIHZhciBjb2RlID0gZW50aXR5LmNoYXJBdCgxKSA9PT0gJ3gnID9cbiAgICAgICAgICAgICAgICBwYXJzZUludChlbnRpdHkuc3Vic3RyKDIpLnRvTG93ZXJDYXNlKCksIDE2KSA6XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZW50aXR5LnN1YnN0cigxKSk7XG5cbiAgICAgICAgICAgIGlmICghKGlzTmFOKGNvZGUpIHx8IGNvZGUgPCAtMzI3NjggfHwgY29kZSA+IDY1NTM1KSkge1xuICAgICAgICAgICAgICAgIGNociA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaHIgPSBhbHBoYUluZGV4W2VudGl0eV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNociB8fCBzO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gSHRtbDVFbnRpdGllcy5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw1RW50aXRpZXMoKS5kZWNvZGUoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw1RW50aXRpZXMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgY2hhckluZm8gPSBjaGFySW5kZXhbc3RyLmNoYXJDb2RlQXQoaSldO1xuICAgICAgICBpZiAoY2hhckluZm8pIHtcbiAgICAgICAgICAgIHZhciBhbHBoYSA9IGNoYXJJbmZvW3N0ci5jaGFyQ29kZUF0KGkgKyAxKV07XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFscGhhID0gY2hhckluZm9bJyddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZW5jb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZW5jb2RlKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgdmFyIGNoYXJJbmZvID0gY2hhckluZGV4W2NdO1xuICAgICAgICBpZiAoY2hhckluZm8pIHtcbiAgICAgICAgICAgIHZhciBhbHBoYSA9IGNoYXJJbmZvW3N0ci5jaGFyQ29kZUF0KGkgKyAxKV07XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFscGhhID0gY2hhckluZm9bJyddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMgPCAzMiB8fCBjID4gMTI2KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBIdG1sNUVudGl0aWVzLmVuY29kZU5vblVURiA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDVFbnRpdGllcygpLmVuY29kZU5vblVURihzdHIpO1xuIH07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDVFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPD0gMjU1KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyW2krK107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIGkrK1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gSHRtbDVFbnRpdGllcy5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDVFbnRpdGllcygpLmVuY29kZU5vbkFTQ0lJKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gYWxwaGFJbmRleCBQYXNzZWQgYnkgcmVmZXJlbmNlLlxuICogQHBhcmFtIHtPYmplY3R9IGNoYXJJbmRleCBQYXNzZWQgYnkgcmVmZXJlbmNlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVJbmRleGVzKGFscGhhSW5kZXgsIGNoYXJJbmRleCkge1xuICAgIHZhciBpID0gRU5USVRJRVMubGVuZ3RoO1xuICAgIHZhciBfcmVzdWx0cyA9IFtdO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIGUgPSBFTlRJVElFU1tpXTtcbiAgICAgICAgdmFyIGFscGhhID0gZVswXTtcbiAgICAgICAgdmFyIGNoYXJzID0gZVsxXTtcbiAgICAgICAgdmFyIGNociA9IGNoYXJzWzBdO1xuICAgICAgICB2YXIgYWRkQ2hhciA9IChjaHIgPCAzMiB8fCBjaHIgPiAxMjYpIHx8IGNociA9PT0gNjIgfHwgY2hyID09PSA2MCB8fCBjaHIgPT09IDM4IHx8IGNociA9PT0gMzQgfHwgY2hyID09PSAzOTtcbiAgICAgICAgdmFyIGNoYXJJbmZvO1xuICAgICAgICBpZiAoYWRkQ2hhcikge1xuICAgICAgICAgICAgY2hhckluZm8gPSBjaGFySW5kZXhbY2hyXSA9IGNoYXJJbmRleFtjaHJdIHx8IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFyc1sxXSkge1xuICAgICAgICAgICAgdmFyIGNocjIgPSBjaGFyc1sxXTtcbiAgICAgICAgICAgIGFscGhhSW5kZXhbYWxwaGFdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaHIpICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIyKTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goYWRkQ2hhciAmJiAoY2hhckluZm9bY2hyMl0gPSBhbHBoYSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxwaGFJbmRleFthbHBoYV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocik7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGFkZENoYXIgJiYgKGNoYXJJbmZvWycnXSA9IGFscGhhKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSHRtbDVFbnRpdGllcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWVudGl0aWVzL2xpYi9odG1sNS1lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBCYXNlZCBoZWF2aWx5IG9uIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrL3dlYnBhY2svYmxvYi9cbiAqICBjMGFmZGY5YzZhYmMxZGQ3MDcwN2M1OTRlNDczODAyYTU2NmY3YjZlL2hvdC9vbmx5LWRldi1zZXJ2ZXIuanNcbiAqIE9yaWdpbmFsIGNvcHlyaWdodCBUb2JpYXMgS29wcGVycyBAc29rcmEgKE1JVCBsaWNlbnNlKVxuICovXG5cbi8qIGdsb2JhbCB3aW5kb3cgX193ZWJwYWNrX2hhc2hfXyAqL1xuXG5pZiAoIW1vZHVsZS5ob3QpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG5cbnZhciBobXJEb2NzVXJsID0gXCJodHRwOi8vd2VicGFjay5naXRodWIuaW8vZG9jcy9ob3QtbW9kdWxlLXJlcGxhY2VtZW50LXdpdGgtd2VicGFjay5odG1sXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuXG52YXIgbGFzdEhhc2g7XG52YXIgZmFpbHVyZVN0YXR1c2VzID0geyBhYm9ydDogMSwgZmFpbDogMSB9O1xudmFyIGFwcGx5T3B0aW9ucyA9IHsgaWdub3JlVW5hY2NlcHRlZDogdHJ1ZSB9O1xuXG5mdW5jdGlvbiB1cFRvRGF0ZShoYXNoKSB7XG4gIGlmIChoYXNoKSBsYXN0SGFzaCA9IGhhc2g7XG4gIHJldHVybiBsYXN0SGFzaCA9PSBfX3dlYnBhY2tfaGFzaF9fO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhhc2gsIG1vZHVsZU1hcCwgb3B0aW9ucykge1xuICB2YXIgcmVsb2FkID0gb3B0aW9ucy5yZWxvYWQ7XG4gIGlmICghdXBUb0RhdGUoaGFzaCkgJiYgbW9kdWxlLmhvdC5zdGF0dXMoKSA9PSBcImlkbGVcIikge1xuICAgIGlmIChvcHRpb25zLmxvZykgY29uc29sZS5sb2coXCJbSE1SXSBDaGVja2luZyBmb3IgdXBkYXRlcyBvbiB0aGUgc2VydmVyLi4uXCIpO1xuICAgIGNoZWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVjaygpIHtcbiAgICB2YXIgY2IgPSBmdW5jdGlvbihlcnIsIHVwZGF0ZWRNb2R1bGVzKSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcblxuICAgICAgaWYoIXVwZGF0ZWRNb2R1bGVzKSB7XG4gICAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBDYW5ub3QgZmluZCB1cGRhdGUgKEZ1bGwgcmVsb2FkIG5lZWRlZClcIik7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gKFByb2JhYmx5IGJlY2F1c2Ugb2YgcmVzdGFydGluZyB0aGUgc2VydmVyKVwiKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJmb3JtUmVsb2FkKCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXBwbHlDYWxsYmFjayA9IGZ1bmN0aW9uKGFwcGx5RXJyLCByZW5ld2VkTW9kdWxlcykge1xuICAgICAgICBpZiAoYXBwbHlFcnIpIHJldHVybiBoYW5kbGVFcnJvcihhcHBseUVycik7XG5cbiAgICAgICAgaWYgKCF1cFRvRGF0ZSgpKSBjaGVjaygpO1xuXG4gICAgICAgIGxvZ1VwZGF0ZXModXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBhcHBseVJlc3VsdCA9IG1vZHVsZS5ob3QuYXBwbHkoYXBwbHlPcHRpb25zLCBhcHBseUNhbGxiYWNrKTtcbiAgICAgIC8vIHdlYnBhY2sgMiBwcm9taXNlXG4gICAgICBpZiAoYXBwbHlSZXN1bHQgJiYgYXBwbHlSZXN1bHQudGhlbikge1xuICAgICAgICAvLyBIb3RNb2R1bGVSZXBsYWNlbWVudC5ydW50aW1lLmpzIHJlZmVycyB0byB0aGUgcmVzdWx0IGFzIGBvdXRkYXRlZE1vZHVsZXNgXG4gICAgICAgIGFwcGx5UmVzdWx0LnRoZW4oZnVuY3Rpb24ob3V0ZGF0ZWRNb2R1bGVzKSB7XG4gICAgICAgICAgYXBwbHlDYWxsYmFjayhudWxsLCBvdXRkYXRlZE1vZHVsZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwbHlSZXN1bHQuY2F0Y2goYXBwbHlDYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICB9O1xuXG4gICAgdmFyIHJlc3VsdCA9IG1vZHVsZS5ob3QuY2hlY2soZmFsc2UsIGNiKTtcbiAgICAvLyB3ZWJwYWNrIDIgcHJvbWlzZVxuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgICAgICAgIGNiKG51bGwsIHVwZGF0ZWRNb2R1bGVzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3VsdC5jYXRjaChjYik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbG9nVXBkYXRlcyh1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcbiAgICB2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcbiAgICAgIHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG4gICAgfSk7XG5cbiAgICBpZih1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogXCIgK1xuICAgICAgICAgIFwiKEZ1bGwgcmVsb2FkIG5lZWRlZClcXG5cIiArXG4gICAgICAgICAgXCJUaGlzIGlzIHVzdWFsbHkgYmVjYXVzZSB0aGUgbW9kdWxlcyB3aGljaCBoYXZlIGNoYW5nZWQgXCIgK1xuICAgICAgICAgIFwiKGFuZCB0aGVpciBwYXJlbnRzKSBkbyBub3Qga25vdyBob3cgdG8gaG90IHJlbG9hZCB0aGVtc2VsdmVzLiBcIiArXG4gICAgICAgICAgXCJTZWUgXCIgKyBobXJEb2NzVXJsICsgXCIgZm9yIG1vcmUgZGV0YWlscy5cIlxuICAgICAgICApO1xuICAgICAgICB1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVNYXBbbW9kdWxlSWRdKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBwZXJmb3JtUmVsb2FkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubG9nKSB7XG4gICAgICBpZighcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG4gICAgICAgIHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIltITVJdICAtIFwiICsgbW9kdWxlTWFwW21vZHVsZUlkXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodXBUb0RhdGUoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltITVJdIEFwcCBpcyB1cCB0byBkYXRlLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnIpIHtcbiAgICBpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSBpbiBmYWlsdXJlU3RhdHVzZXMpIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gQ2Fubm90IGNoZWNrIGZvciB1cGRhdGUgKEZ1bGwgcmVsb2FkIG5lZWRlZClcIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIFwiICsgZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHBlcmZvcm1SZWxvYWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gVXBkYXRlIGNoZWNrIGZhaWxlZDogXCIgKyBlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1SZWxvYWQoKSB7XG4gICAgaWYgKHJlbG9hZCkge1xuICAgICAgaWYgKG9wdGlvbnMud2FybikgY29uc29sZS53YXJuKFwiW0hNUl0gUmVsb2FkaW5nIHBhZ2VcIik7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL3Byb2Nlc3MtdXBkYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgJ2FuZ3VsYXIyLXVuaXZlcnNhbC1wb2x5ZmlsbHMvYnJvd3Nlcic7XG5pbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcGxhdGZvcm1Vbml2ZXJzYWxEeW5hbWljIH0gZnJvbSAnYW5ndWxhcjItdW5pdmVyc2FsJztcbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gJy4vYXBwL2FwcC5tb2R1bGUnO1xuaW1wb3J0ICdib290c3RyYXAnO1xuXG4vLyBFbmFibGUgZWl0aGVyIEhvdCBNb2R1bGUgUmVsb2FkaW5nIG9yIHByb2R1Y3Rpb24gbW9kZVxuaWYgKG1vZHVsZVsnaG90J10pIHtcbiAgICBtb2R1bGVbJ2hvdCddLmFjY2VwdCgpO1xuICAgIG1vZHVsZVsnaG90J10uZGlzcG9zZSgoKSA9PiB7IHBsYXRmb3JtLmRlc3Ryb3koKTsgfSk7XG59IGVsc2Uge1xuICAgIGVuYWJsZVByb2RNb2RlKCk7XG59XG5cbi8vIEJvb3QgdGhlIGFwcGxpY2F0aW9uLCBlaXRoZXIgbm93IG9yIHdoZW4gdGhlIERPTSBjb250ZW50IGlzIGxvYWRlZFxuY29uc3QgcGxhdGZvcm0gPSBwbGF0Zm9ybVVuaXZlcnNhbER5bmFtaWMoKTtcbmNvbnN0IGJvb3RBcHBsaWNhdGlvbiA9ICgpID0+IHsgcGxhdGZvcm0uYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7IH07XG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgIGJvb3RBcHBsaWNhdGlvbigpO1xufSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgYm9vdEFwcGxpY2F0aW9uKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9ib290LWNsaWVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDgwKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYW5ndWxhcjItdW5pdmVyc2FsLXBvbHlmaWxscy9icm93c2VyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGJcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlL2J1bmRsZXMvY29yZS51bWQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YlxuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoODMpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbmd1bGFyMi11bml2ZXJzYWwvYnJvd3Nlci9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgVW5pdmVyc2FsTW9kdWxlIH0gZnJvbSAnYW5ndWxhcjItdW5pdmVyc2FsJztcclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50J1xyXG5pbXBvcnQgeyBOYXZNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgUHJpdmFjeUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfY2hlY2tpbmcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUG9saWN5UmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcG9saWN5X3Jldmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY2Nlc3NDb250cm9sUG9saWN5Rm9ybUNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2Zvcm1fY3JlYXRlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjY2Vzc0NvbnRyb2xEZXRhaWxDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9hY2Nlc3NfY29udHJvbF9kZXRhaWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJpdmFjeVBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9mb3JtX2NyZWF0ZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcml2YWN5UG9saWN5RGV0YWlsQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByaXZhY3lEb21haW5Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X2RvbWFpbl9mb3JtX2NyZWF0ZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQb2xpY3lNYW5hZ2VtZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcG9saWN5X21hbmFnZW1lbnQnO1xyXG5pbXBvcnQgeyBTdWJQcml2YWN5UG9saWN5Rm9ybUNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3N1Yl9wcml2YWN5X3BvbGljeV9mb3JtX2NyZWF0ZS5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEJ1dHRvbk1vZHVsZSwgR3Jvd2xNb2R1bGUsIERyb3Bkb3duTW9kdWxlLCBBdXRvQ29tcGxldGVNb2R1bGUsIElucHV0VGV4dE1vZHVsZSwgRGF0YVRhYmxlTW9kdWxlLFxyXG4gICAgU2hhcmVkTW9kdWxlLCBJbnB1dFRleHRhcmVhTW9kdWxlLCBNZXNzYWdlc01vZHVsZSwgUGFuZWxNb2R1bGUsIEFjY29yZGlvbk1vZHVsZSwgRmllbGRzZXRNb2R1bGUsIENvbmZpcm1EaWFsb2dNb2R1bGVcclxufSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGJvb3RzdHJhcDogWyBBcHBDb21wb25lbnQgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEFwcENvbXBvbmVudCxcclxuICAgICAgICBOYXZNZW51Q29tcG9uZW50LFxyXG4gICAgICAgIEhvbWVDb21wb25lbnQsXHJcbiAgICAgICAgUHJpdmFjeUNvbXBvbmVudCxcclxuICAgICAgICBQb2xpY3lSZXZpZXdDb21wb25lbnQsXHJcbiAgICAgICAgQWNjZXNzQ29udHJvbFBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQsXHJcbiAgICAgICAgUHJpdmFjeVBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQsXHJcbiAgICAgICAgUHJpdmFjeURvbWFpbkNvbXBvbmVudCxcclxuICAgICAgICBQb2xpY3lNYW5hZ2VtZW50Q29tcG9uZW50LFxyXG4gICAgICAgIFN1YlByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50LFxyXG4gICAgICAgIFByaXZhY3lQb2xpY3lEZXRhaWxDb21wb25lbnQsXHJcbiAgICAgICAgQWNjZXNzQ29udHJvbERldGFpbENvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBVbml2ZXJzYWxNb2R1bGUsIC8vIE11c3QgYmUgZmlyc3QgaW1wb3J0LiBUaGlzIGF1dG9tYXRpY2FsbHkgaW1wb3J0cyBCcm93c2VyTW9kdWxlLCBIdHRwTW9kdWxlLCBhbmQgSnNvbnBNb2R1bGUgdG9vLlxyXG4gICAgICAgIFJvdXRlck1vZHVsZS5mb3JSb290KFtcclxuICAgICAgICAgICAgeyBwYXRoOiAnJywgcmVkaXJlY3RUbzogJ2hvbWUnLCBwYXRoTWF0Y2g6ICdmdWxsJyB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdob21lJywgY29tcG9uZW50OiBIb21lQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3ByaXZhY3lfY2hlY2tpbmcnLCBjb21wb25lbnQ6IFByaXZhY3lDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAncG9saWN5X3JldmlldycsIGNvbXBvbmVudDogUG9saWN5UmV2aWV3Q29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ2FjY2Vzc19jb250cm9sX3BvbGljeScsIGNvbXBvbmVudDogQWNjZXNzQ29udHJvbFBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnYWNjZXNzX2NvbnRyb2xfZGV0YWlsLzppZCcsIGNvbXBvbmVudDogQWNjZXNzQ29udHJvbERldGFpbENvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdwcml2YWN5X3BvbGljeScsIGNvbXBvbmVudDogUHJpdmFjeVBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAncHJpdmFjeV9wb2xpY3lfZGV0YWlsLzppZCcsIGNvbXBvbmVudDogUHJpdmFjeVBvbGljeURldGFpbENvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdzdWJfcHJpdmFjeV9wb2xpY3knLCBjb21wb25lbnQ6IFN1YlByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3ByaXZhY3lfZG9tYWluJywgY29tcG9uZW50OiBQcml2YWN5RG9tYWluQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3BvbGljeV9tYW5hZ2VtZW50JywgY29tcG9uZW50OiBQb2xpY3lNYW5hZ2VtZW50Q29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJyoqJywgcmVkaXJlY3RUbzogJ2hvbWUnIH0sXHJcbiAgICAgICAgXSksXHJcbiAgICAgICAgRm9ybXNNb2R1bGUsXHJcbiAgICAgICAgQnV0dG9uTW9kdWxlLFxyXG4gICAgICAgIEdyb3dsTW9kdWxlLFxyXG4gICAgICAgIERyb3Bkb3duTW9kdWxlLFxyXG4gICAgICAgIEF1dG9Db21wbGV0ZU1vZHVsZSwgSW5wdXRUZXh0YXJlYU1vZHVsZSwgTWVzc2FnZXNNb2R1bGUsIEFjY29yZGlvbk1vZHVsZSxcclxuICAgICAgICBJbnB1dFRleHRNb2R1bGUsIERhdGFUYWJsZU1vZHVsZSwgU2hhcmVkTW9kdWxlLCBQYW5lbE1vZHVsZSwgRmllbGRzZXRNb2R1bGUsIENvbmZpcm1EaWFsb2dNb2R1bGVcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9hcHAubW9kdWxlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoOSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL3JvdXRlci9idW5kbGVzL3JvdXRlci51bWQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YlxuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoNik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2Zvcm1zL2J1bmRsZXMvZm9ybXMudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGJcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FwcCcsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYXBwLmNvbXBvbmVudC5odG1sJyksXG4gICAgc3R5bGVzOiBbcmVxdWlyZSgnLi9hcHAuY29tcG9uZW50LmNzcycpXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9J2NvbnRhaW5lci1mbHVpZCc+XFxuICAgIDxkaXYgY2xhc3M9J3Jvdyc+XFxuICAgICAgICA8ZGl2IGNsYXNzPSdjb2wtc20tMyc+XFxuICAgICAgICAgICAgPG5hdi1tZW51PjwvbmF2LW1lbnU+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9J2NvbC1zbS05IGJvZHktY29udGVudCc+XFxuICAgICAgICAgICAgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4gICAgICAgIHZhciByZXN1bHQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2FwcC5jb21wb25lbnQuY3NzXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBtZWRpYSAobWF4LXdpZHRoOiA3NjdweCkge1xcbiAgICAvKiBPbiBzbWFsbCBzY3JlZW5zLCB0aGUgbmF2IG1lbnUgc3BhbnMgdGhlIGZ1bGwgd2lkdGggb2YgdGhlIHNjcmVlbi4gTGVhdmUgYSBzcGFjZSBmb3IgaXQuICovXFxuICAgIC5ib2R5LWNvbnRlbnQge1xcbiAgICAgICAgcGFkZGluZy10b3A6IDUwcHg7XFxuICAgIH1cXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduYXYtbWVudScsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vbmF2bWVudS5jb21wb25lbnQuaHRtbCcpLFxuICAgIHN0eWxlczogW3JlcXVpcmUoJy4vbmF2bWVudS5jb21wb25lbnQuY3NzJyldXG59KVxuZXhwb3J0IGNsYXNzIE5hdk1lbnVDb21wb25lbnQge1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz0nbWFpbi1uYXYnPlxcclxcbiAgICA8ZGl2IGNsYXNzPSduYXZiYXIgbmF2YmFyLWludmVyc2UnPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz0nbmF2YmFyLWhlYWRlcic+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSduYXZiYXItdG9nZ2xlJyBkYXRhLXRvZ2dsZT0nY29sbGFwc2UnIGRhdGEtdGFyZ2V0PScubmF2YmFyLWNvbGxhcHNlJz5cXHJcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3NyLW9ubHknPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naWNvbi1iYXInPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2ljb24tYmFyJz48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpY29uLWJhcic+PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDxhIGNsYXNzPSduYXZiYXItYnJhbmQnIFtyb3V0ZXJMaW5rXT1cXFwiWycvaG9tZSddXFxcIj5Qcml2YWN5IEFjY2VzcyBDb250cm9sPC9hPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPSdjbGVhcmZpeCc+PC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPSduYXZiYXItY29sbGFwc2UgY29sbGFwc2UnPlxcclxcbiAgICAgICAgICAgIDx1bCBjbGFzcz0nbmF2IG5hdmJhci1uYXYnPlxcclxcbiAgICAgICAgICAgICAgICA8bGkgW3JvdXRlckxpbmtBY3RpdmVdPVxcXCJbJ2xpbmstYWN0aXZlJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVxcXCJbJy9wcml2YWN5X2NoZWNraW5nJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxpc3QnPjwvc3Bhbj4gUHJpdmFjeSBDaGVja2luZ1xcclxcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgICAgICAgICA8bGkgW3JvdXRlckxpbmtBY3RpdmVdPVxcXCJbJ2xpbmstYWN0aXZlJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVxcXCJbJy9hY2Nlc3NfY29udHJvbF9wb2xpY3knXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBBY2Nlc3MgQ29udHJvbCBQb2xpY3lcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvcHJpdmFjeV9wb2xpY3knXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBQcml2YWN5IFBvbGljeVxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgICAgICAgICA8bGkgW3JvdXRlckxpbmtBY3RpdmVdPVxcXCJbJ2xpbmstYWN0aXZlJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVxcXCJbJy9zdWJfcHJpdmFjeV9wb2xpY3knXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBTdWIgUHJpdmFjeSBQb2xpY3lcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvcG9saWN5X3JldmlldyddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi10aC1saXN0Jz48L3NwYW4+IFBvbGljeSBSZXZpZXdcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvcHJpdmFjeV9kb21haW4nXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBQcml2YWN5IERvbWFpblxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgICAgICAgICA8bGkgW3JvdXRlckxpbmtBY3RpdmVdPVxcXCJbJ2xpbmstYWN0aXZlJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVxcXCJbJy9wb2xpY3lfbWFuYWdlbWVudCddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi10aC1saXN0Jz48L3NwYW4+IFBvbGljeSBNYW5hZ2VtZW50XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGk+XFxyXFxuICAgICAgICAgICAgPC91bD5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4gICAgICAgIHZhciByZXN1bHQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL25hdm1lbnUuY29tcG9uZW50LmNzc1wiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImxpIC5nbHlwaGljb24ge1xcbiAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XFxufVxcblxcbi8qIEhpZ2hsaWdodGluZyBydWxlcyBmb3IgbmF2IG1lbnUgaXRlbXMgKi9cXG5saS5saW5rLWFjdGl2ZSBhLFxcbmxpLmxpbmstYWN0aXZlIGE6aG92ZXIsXFxubGkubGluay1hY3RpdmUgYTpmb2N1cyB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM0MTg5Qzc7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLyogS2VlcCB0aGUgbmF2IG1lbnUgaW5kZXBlbmRlbnQgb2Ygc2Nyb2xsaW5nIGFuZCBvbiB0b3Agb2Ygb3RoZXIgaXRlbXMgKi9cXG4ubWFpbi1uYXYge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHRvcDogMDtcXG4gICAgbGVmdDogMDtcXG4gICAgcmlnaHQ6IDA7XFxuICAgIHotaW5kZXg6IDE7XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xcbiAgICAvKiBPbiBzbWFsbCBzY3JlZW5zLCBjb252ZXJ0IHRoZSBuYXYgbWVudSB0byBhIHZlcnRpY2FsIHNpZGViYXIgKi9cXG4gICAgLm1haW4tbmF2IHtcXG4gICAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICAgIHdpZHRoOiBjYWxjKDI1JSAtIDIwcHgpO1xcbiAgICB9XFxuICAgIC5uYXZiYXIge1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMHB4O1xcbiAgICAgICAgYm9yZGVyLXdpZHRoOiAwcHg7XFxuICAgICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIH1cXG4gICAgLm5hdmJhci1oZWFkZXIge1xcbiAgICAgICAgZmxvYXQ6IG5vbmU7XFxuICAgIH1cXG4gICAgLm5hdmJhci1jb2xsYXBzZSB7XFxuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgIzQ0NDtcXG4gICAgICAgIHBhZGRpbmc6IDBweDtcXG4gICAgfVxcbiAgICAubmF2YmFyIHVsIHtcXG4gICAgICAgIGZsb2F0OiBub25lO1xcbiAgICB9XFxuICAgIC5uYXZiYXIgbGkge1xcbiAgICAgICAgZmxvYXQ6IG5vbmU7XFxuICAgICAgICBmb250LXNpemU6IDE1cHg7XFxuICAgICAgICBtYXJnaW46IDZweDtcXG4gICAgfVxcbiAgICAubmF2YmFyIGxpIGEge1xcbiAgICAgICAgcGFkZGluZzogMTBweCAxNnB4O1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgICB9XFxuICAgIC5uYXZiYXIgYSB7XFxuICAgICAgICAvKiBJZiBhIG1lbnUgaXRlbSdzIHRleHQgaXMgdG9vIGxvbmcsIHRydW5jYXRlIGl0ICovXFxuICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICAgIH1cXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2hvbWUnLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2hvbWUuY29tcG9uZW50Lmh0bWwnKVxufSlcbmV4cG9ydCBjbGFzcyBIb21lQ29tcG9uZW50IHtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9ob21lL2hvbWUuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMT5IZWxsbywgd29ybGQhPC9oMT5cXG48cD5XZWxjb21lIHRvIHlvdXIgbmV3IHNpbmdsZS1wYWdlIGFwcGxpY2F0aW9uLCBidWlsdCB3aXRoOjwvcD5cXG48dWw+XFxuICAgIDxsaT48YSBocmVmPSdodHRwczovL2dldC5hc3AubmV0Lyc+QVNQLk5FVCBDb3JlPC9hPiBhbmQgPGEgaHJlZj0naHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS82N2VmOHNiZC5hc3B4Jz5DIzwvYT4gZm9yIGNyb3NzLXBsYXRmb3JtIHNlcnZlci1zaWRlIGNvZGU8L2xpPlxcbiAgICA8bGk+PGEgaHJlZj0naHR0cHM6Ly9hbmd1bGFyLmlvLyc+QW5ndWxhciAyPC9hPiBhbmQgPGEgaHJlZj0naHR0cDovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvJz5UeXBlU2NyaXB0PC9hPiBmb3IgY2xpZW50LXNpZGUgY29kZTwvbGk+XFxuICAgIDxsaT48YSBocmVmPSdodHRwczovL3dlYnBhY2suZ2l0aHViLmlvLyc+V2VicGFjazwvYT4gZm9yIGJ1aWxkaW5nIGFuZCBidW5kbGluZyBjbGllbnQtc2lkZSByZXNvdXJjZXM8L2xpPlxcbiAgICA8bGk+PGEgaHJlZj0naHR0cDovL2dldGJvb3RzdHJhcC5jb20vJz5Cb290c3RyYXA8L2E+IGZvciBsYXlvdXQgYW5kIHN0eWxpbmc8L2xpPlxcbjwvdWw+XFxuPHA+VG8gaGVscCB5b3UgZ2V0IHN0YXJ0ZWQsIHdlJ3ZlIGFsc28gc2V0IHVwOjwvcD5cXG48dWw+XFxuICAgIDxsaT48c3Ryb25nPkNsaWVudC1zaWRlIG5hdmlnYXRpb248L3N0cm9uZz4uIEZvciBleGFtcGxlLCBjbGljayA8ZW0+Q291bnRlcjwvZW0+IHRoZW4gPGVtPkJhY2s8L2VtPiB0byByZXR1cm4gaGVyZS48L2xpPlxcbiAgICA8bGk+PHN0cm9uZz5TZXJ2ZXItc2lkZSBwcmVyZW5kZXJpbmc8L3N0cm9uZz4uIEZvciBmYXN0ZXIgaW5pdGlhbCBsb2FkaW5nIGFuZCBpbXByb3ZlZCBTRU8sIHlvdXIgQW5ndWxhciAyIGFwcCBpcyBwcmVyZW5kZXJlZCBvbiB0aGUgc2VydmVyLiBUaGUgcmVzdWx0aW5nIEhUTUwgaXMgdGhlbiB0cmFuc2ZlcnJlZCB0byB0aGUgYnJvd3NlciB3aGVyZSBhIGNsaWVudC1zaWRlIGNvcHkgb2YgdGhlIGFwcCB0YWtlcyBvdmVyLjwvbGk+XFxuICAgIDxsaT48c3Ryb25nPldlYnBhY2sgZGV2IG1pZGRsZXdhcmU8L3N0cm9uZz4uIEluIGRldmVsb3BtZW50IG1vZGUsIHRoZXJlJ3Mgbm8gbmVlZCB0byBydW4gdGhlIDxjb2RlPndlYnBhY2s8L2NvZGU+IGJ1aWxkIHRvb2wuIFlvdXIgY2xpZW50LXNpZGUgcmVzb3VyY2VzIGFyZSBkeW5hbWljYWxseSBidWlsdCBvbiBkZW1hbmQuIFVwZGF0ZXMgYXJlIGF2YWlsYWJsZSBhcyBzb29uIGFzIHlvdSBtb2RpZnkgYW55IGZpbGUuPC9saT5cXG4gICAgPGxpPjxzdHJvbmc+SG90IG1vZHVsZSByZXBsYWNlbWVudDwvc3Ryb25nPi4gSW4gZGV2ZWxvcG1lbnQgbW9kZSwgeW91IGRvbid0IGV2ZW4gbmVlZCB0byByZWxvYWQgdGhlIHBhZ2UgYWZ0ZXIgbWFraW5nIG1vc3QgY2hhbmdlcy4gV2l0aGluIHNlY29uZHMgb2Ygc2F2aW5nIGNoYW5nZXMgdG8gZmlsZXMsIHlvdXIgQW5ndWxhciAyIGFwcCB3aWxsIGJlIHJlYnVpbHQgYW5kIGEgbmV3IGluc3RhbmNlIGluamVjdGVkIGlzIGludG8gdGhlIHBhZ2UuPC9saT5cXG4gICAgPGxpPjxzdHJvbmc+RWZmaWNpZW50IHByb2R1Y3Rpb24gYnVpbGRzPC9zdHJvbmc+LiBJbiBwcm9kdWN0aW9uIG1vZGUsIGRldmVsb3BtZW50LXRpbWUgZmVhdHVyZXMgYXJlIGRpc2FibGVkLCBhbmQgdGhlIDxjb2RlPndlYnBhY2s8L2NvZGU+IGJ1aWxkIHRvb2wgcHJvZHVjZXMgbWluaWZpZWQgc3RhdGljIENTUyBhbmQgSmF2YVNjcmlwdCBmaWxlcy48L2xpPlxcbjwvdWw+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9ob21lL2hvbWUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IFNlbGVjdEl0ZW0sIE1lc3NhZ2UsIENvbmZpcm1hdGlvblNlcnZpY2UgfSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuaW1wb3J0IHsgQXBwU2V0dGluZyB9IGZyb20gJy4uLy4uL21vZGVscy9hcHBfc2V0dGluZyc7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdwcml2YWN5X2NoZWNraW5nJyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3ByaXZhY3lfY2hlY2tpbmcuY29tcG9uZW50Lmh0bWwnKSxcclxuICAgIHByb3ZpZGVyczogW0NvbmZpcm1hdGlvblNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQcml2YWN5Q29tcG9uZW50IHtcclxuXHJcbiAgICAvLyNyZWdpb24gU3ViamVjdFxyXG4gICAgcHJpdmF0ZSB1c2VyczogYW55W107XHJcbiAgICBwcml2YXRlIHVzZXJfcHJvcGVydHlfbmFtZXM6IGFueVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3VzZXI6IGFueTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZW52aXJvbm1lbnRcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfdmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfb2JqZWN0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3Jlc3VsdDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpZWxkX29wdGlvbnM6IHN0cmluZ1tdID0gWydwdXJwb3NlJywgJ3N0YXJ0X3RpbWUnLCAnZW5kX3RpbWUnXTtcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGQ6IHN0cmluZ1tdO1xyXG5cclxuICAgIC8vI3JlZ2lvbiByZXN1bHRcclxuICAgIHByaXZhdGUgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXN1bHRfcHJvcGVydHlfbmFtZXM6IGFueVtdID0gW107XHJcbiAgICAvLyNlbmRyZWdpb25cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2Vfb3BlcmF0b3JzLnB1c2goeyBsYWJlbDogJ0VxdWFscycsIHZhbHVlOiAnRXF1YWxzJyB9KTtcclxuICAgICAgICB0aGlzLnJlc291cmNlX29wZXJhdG9ycy5wdXNoKHsgbGFiZWw6ICdHcmVhdGVyVGhhbicsIHZhbHVlOiAnR3JlYXRlclRoYW4nIH0pO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2Vfb3BlcmF0b3JzLnB1c2goeyBsYWJlbDogJ0xlc3NUaGFuJywgdmFsdWU6ICdMZXNzVGhhbicgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2FjY291bnRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpWzBdO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uT2JqZWN0KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShvYmplY3QpICYmIHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51c2VyX3Byb3BlcnR5X25hbWVzLnB1c2gocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQudXNlcnMgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnY29sbGVjdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5yZXNvdXJjZV9maWVsZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG4gICAgYW5kX2NsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uX3Jlc3VsdCArPSBcIiBBTkQgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25fcmVzdWx0ICs9IFwiIE9SIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdF9jbGljaygpIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgKz0gXCJOT1QoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljaygpIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgKz0gXCIoXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbG9zZV9icmFja2V0X2NsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uX3Jlc3VsdCArPSBcIiApXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfY29uZGl0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZClcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9IHRoaXMucmVzb3VyY2VfZmllbGRzWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3IpXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3IgPSB0aGlzLnJlc291cmNlX29wZXJhdG9yc1swXS52YWx1ZTtcclxuXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb246IHN0cmluZyA9IHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3IgKyAnKCdcclxuICAgICAgICAgICAgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgJywgJyArIHRoaXMucmVzb3VyY2VfdmFsdWVzICsgJyknO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25kaXRpb25fcmVzdWx0KVxyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgKz0gZXhwcmVzc2lvbjtcclxuICAgICAgICBlbHNlIHRoaXMuY29uZGl0aW9uX3Jlc3VsdCA9IGV4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhcl9jb25kaXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25fcmVzdWx0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZF9lbnZpcm9ubWVudF9maWVsZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW52aXJvbm1lbnRfcmVzdWx0KVxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCA9IFwiXFxcIlwiICsgdGhpcy5lbnZpcm9ubWVudF9maWVsZCArIFwiXFxcIiA6IFxcXCJcIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIlxcXCJcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0ICs9IFwiLCBcXFwiXCIgKyB0aGlzLmVudmlyb25tZW50X2ZpZWxkICsgXCJcXFwiIDogXFxcIlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiXFxcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X29iamVjdCA9IFwieyBcIiArIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0ICsgXCIgfVwiO1xyXG5cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X2ZpZWxkID0gdGhpcy5lbnZpcm9ubWVudF92YWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhcl9lbnZpcm9ubWVudCgpIHtcclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X29iamVjdCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZF91c2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1lvdSBoYXZlIG5vdCBzZWxlY3RlZCB1c2VyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZW52aXJvbm1lbnQgPSBcInsgXCIgKyB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCArIFwiIH1cIjtcclxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgdGhpcy5zZWxlY3RlZF91c2VyLl9pZCA9PT0gJ29iamVjdCcpO1xyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIlVzZXJJRFwiOiB0eXBlb2YgdGhpcy5zZWxlY3RlZF91c2VyLl9pZCA9PT0gJ29iamVjdCcgPyB0aGlzLnNlbGVjdGVkX3VzZXIuX2lkLiRvaWQgOiB0aGlzLnNlbGVjdGVkX3VzZXIuX2lkLFxyXG4gICAgICAgICAgICBcIlJlc291cmNlTmFtZVwiOiB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSxcclxuICAgICAgICAgICAgXCJSZXNvdXJjZUNvbmRpdGlvblwiOiB0aGlzLmNvbmRpdGlvbl9yZXN1bHQsXHJcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjogZW52aXJvbm1lbnQsXHJcbiAgICAgICAgICAgIFwiQWN0aW9uXCI6IFwicmVhZFwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb21tYW5kKTtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHRoaXMucmVzdWx0X3Byb3BlcnR5X25hbWVzID0gW107XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3ByaXZhY3kvY2hlY2svJywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnRleHQoKSA9PSAnRGVueScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0RlbmllZCcgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEudGV4dCgpID09ICdOb3QgQXBwbGljYWJsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ05vdCBBcHBsaWNhYmxlJyB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXN1bHQgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5yZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnVXNlciBkb2Vzbm90IGhhdmUgcmlnaHQgdG8gYWNjZXNzIHJlc291cmNlJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXN1bHRfcHJvcGVydHlfbmFtZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9jaGVja2luZy5jb21wb25lbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSg0Nik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2h0dHAvYnVuZGxlcy9odHRwLnVtZC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSgxOTEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9wcmltZW5nL3ByaW1lbmcuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YlxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEFwcFNldHRpbmcge1xyXG4gICAgcHVibGljIHN0YXRpYyBBUElfRU5EUE9JTlQgPSAnaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaS8nO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvYXBwX3NldHRpbmcudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjwvZGl2PlxcclxcblxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+U3ViamVjdCBTZWxlY3Rpb248L2gzPjwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInVzZXJzXFxcIiBzZWxlY3Rpb25Nb2RlPVxcXCJzaW5nbGVcXFwiIFsoc2VsZWN0aW9uKV09XFxcInNlbGVjdGVkX3VzZXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgW3BhZ2luYXRvcl09XFxcInRydWVcXFwiIFtwYWdlTGlua3NdPVxcXCIzXFxcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cXFwiWzEwLDIwLDUwXVxcXCIgW3Jvd3NdPVxcXCI2XFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gKm5nRm9yPVxcXCJsZXQgY29sIG9mIHVzZXJfcHJvcGVydHlfbmFtZXNcXFwiIGZpZWxkPVxcXCJ7e2NvbH19XFxcIiBoZWFkZXI9XFxcInt7Y29sfX1cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDwhLS08cC1mb290ZXI+PGRpdiBzdHlsZT1cXFwidGV4dC1hbGlnbjogbGVmdFxcXCI+U2VsZWN0ZWQgVXNlcjoge3tqc29uX2hlbHBlci5zdHJpbmdpZnkoc2VsZWN0ZWRfdXNlcil9fTwvZGl2PjwvcC1mb290ZXI+LS0+XFxyXFxuICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj48aDMgc3R5bGU9XFxcImNvbG9yOiNmMGFkNGVcXFwiPlJlc291cmNlIENvbmRpdGlvbjwvaDM+PC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbGxlY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWVcXFwiIFxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicxMjBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLTxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5SZXNvdXJjZSBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTIwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+T3BlcmF0b3IgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9vcGVyYXRvcnNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9vcGVyYXRvclxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+VmFsdWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IGlkPVxcXCJpblxcXCIgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3ZhbHVlc1xcXCIgLz5cXHJcXG4gICAgICAgIDwvZGl2Pi0tPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPCEtLTxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgc3R5bGU9XFxcInBhZGRpbmctYm90dG9tOiAxMHB4XFxcIj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZFxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbmRpdGlvbigpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkNsZWFyXFxcIiAoY2xpY2spPVxcXCJjbGVhcl9jb25kaXRpb24oKVxcXCI+PC9idXR0b24+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCIxNDBcXFwiIHBJbnB1dFRleHRhcmVhXFxyXFxuICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcImNvbmRpdGlvbl9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQU5EXFxcIiAoY2xpY2spPVxcXCJhbmRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIihcXFwiIChjbGljayk9XFxcIm9wZW5fYnJhY2tldF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgIDwvZGl2Pi0tPlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPjxoMyBzdHlsZT1cXFwiY29sb3I6IzVjYjg1Y1xcXCI+RW52aXJvbm1lbnQgQ29uZGl0aW9uPC9oMz48L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5GaWVsZCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1hdXRvQ29tcGxldGUgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X2ZpZWxkXFxcIiBbc3VnZ2VzdGlvbnNdPVxcXCJlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZFxcXCIgKGNvbXBsZXRlTWV0aG9kKT1cXFwiZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKCRldmVudClcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttaW5MZW5ndGhdPVxcXCIxXFxcIiA+XFxyXFxuICAgICAgICAgICAgPC9wLWF1dG9Db21wbGV0ZT5cXHJcXG4gICAgICAgICAgICA8IS0tPGlucHV0IGlkPVxcXCJpblxcXCIgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X2ZpZWxkXFxcIiAvPi0tPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+VmFsdWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IGlkPVxcXCJpblxcXCIgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X3ZhbHVlXFxcIiAvPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLWJvdHRvbTogMTBweFxcXCIgPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXN1Y2Nlc3NcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBcXHJcXG4gICAgICAgICAgICAgICAgbGFiZWw9XFxcIkFkZFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X2ZpZWxkKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXN1Y2Nlc3NcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgbGFiZWw9XFxcIkNsZWFyXFxcIiAoY2xpY2spPVxcXCJjbGVhcl9lbnZpcm9ubWVudCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjE0MFxcXCIgcElucHV0VGV4dGFyZWEgY2xhc3M9XFxcInVpLWlucHV0dGV4dGFyZWFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X29iamVjdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMiB0ZXh0LWNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLWxnXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJoZWlnaHQ6OTAlXFxcIiAoY2xpY2spPVxcXCJzdWJtaXQoKVxcXCI+U3VibWl0PC9idXR0b24+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiICpuZ0lmPVxcXCJyZXN1bHQubGVuZ3RoID4gMFxcXCIgc3R5bGU9XFxcIm1hcmdpbi10b3A6MjBweFxcXCI+XFxyXFxuICAgICAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLXJlc3BvbnNpdmUgdGFibGUtc3RyaXBlZFxcXCI+XFxyXFxuICAgICAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGggKm5nRm9yPVxcXCJsZXQgY29sIG9mIHJlc3VsdF9wcm9wZXJ0eV9uYW1lc1xcXCI+e3tjb2x9fTwvdGg+XFxyXFxuICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgPC90aGVhZD5cXHJcXG4gICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XFxcImxldCByb3cgb2YgcmVzdWx0XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAqbmdGb3I9XFxcImxldCBpZHggb2YgcmVzdWx0X3Byb3BlcnR5X25hbWVzXFxcIj57e2pzb25faGVscGVyLnN0cmluZ2lmeShyb3dbaWR4XSl9fTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgICAgIDwvdGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X2NoZWNraW5nLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgQWNjZXNzQ29udHJvbCB9IGZyb20gJy4uLy4uL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsJztcclxuaW1wb3J0IHsgUHJpdmFjeVBvbGljeSB9IGZyb20gJy4uLy4uL21vZGVscy9wcml2YWN5X3J1bGUubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3BvbGljeV9yZXZpZXcnLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vcG9saWN5X3Jldmlldy5jb21wb25lbnQuaHRtbCcpXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2xpY3lSZXZpZXdDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIC8vI3JlZ2lvbiByZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBjb25zdGFudF9yZXNvdXJjZV92YWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2VfcmVzdWx0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3Jlc3VsdF90ZW1wOiBzdHJpbmc7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV90eXBlczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3BvbGljeV90eXBlOiBzdHJpbmc7XHJcblxyXG4gICAgLy8jcmVnaW9uIHN1YmplY3RcclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3N1YmplY3RfdmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3ViamVjdF9yZXN1bHQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3ViamVjdF9yZXN1bHRfdGVtcDogc3RyaW5nO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X2Vudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3Jlc3VsdDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9yZXN1bHRfdGVtcDogc3RyaW5nO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHJlc3VsdFxyXG4gICAgcHJpdmF0ZSByZXN1bHQ6IGFueVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc3VsdF9wcm9wZXJ0eV9uYW1lczogYW55W10gPSBbXTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgYWNjZXNzX2NvbnRyb2xzOiBBY2Nlc3NDb250cm9sW10gPSBbXTtcclxuICAgIHByaXZhdGUgcHJpdmFjeV9wb2xpY2llczogUHJpdmFjeVBvbGljeVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBqc29uX2hlbHBlcjogYW55O1xyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgdGhpcy5qc29uX2hlbHBlciA9IEpTT047XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnY29sbGVjdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdWJqZWN0L2ZpZWxkcy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGF0LnNlbGVjdGVkX3N1YmplY3RfZmllbGQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkX3N1YmplY3RfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQuc3ViamVjdF9maWVsZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdyZWFkJywgdmFsdWU6ICdyZWFkJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnY3JlYXRlJywgdmFsdWU6ICdjcmVhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICd1cGRhdGUnLCB2YWx1ZTogJ3VwZGF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2RlbGV0ZScsIHZhbHVlOiAnZGVsZXRlJyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX2FjdGlvbiA9IHRoaXMuYWN0aW9uc1swXS52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2xpY3lfdHlwZXMucHVzaCh7IGxhYmVsOiAnQWNjZXNzIENvbnRyb2wnLCB2YWx1ZTogJ0FjY2VzcyBDb250cm9sJyB9KTtcclxuICAgICAgICB0aGlzLnBvbGljeV90eXBlcy5wdXNoKHsgbGFiZWw6ICdQcml2YWN5JywgdmFsdWU6ICdQcml2YWN5JyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX3BvbGljeV90eXBlID0gdGhpcy5wb2xpY3lfdHlwZXNbMF0udmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25TZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdHJ1Y3R1cmUvP2NvbGxlY3Rpb25OYW1lPScgKyBjb2xsZWN0aW9uU2VsZWN0ZWQpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uT2JqZWN0KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5yZXNvdXJjZV9maWVsZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIGVsc2UgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfc3ViamVjdF9maWVsZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3ViamVjdF9yZXN1bHRfdGVtcClcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0X3Jlc3VsdF90ZW1wID0gXCJcXFwiXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmNvbnN0YW50X3N1YmplY3RfdmFsdWUgKyBcIlxcXCJcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdF9yZXN1bHRfdGVtcCArPSBcIiwgXFxcIlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCJcXFwiIDogXFxcIlwiICsgdGhpcy5jb25zdGFudF9zdWJqZWN0X3ZhbHVlICsgXCJcXFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3ViamVjdF9yZXN1bHQgPSBcInsgXCIgKyB0aGlzLnN1YmplY3RfcmVzdWx0X3RlbXAgKyBcIiB9XCI7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc3RhbnRfc3ViamVjdF92YWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfcmVzb3VyY2VfZmllbGQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlc291cmNlX3Jlc3VsdF90ZW1wKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlX3Jlc3VsdF90ZW1wID0gXCJcXFwiXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCJcXFwiIDogXFxcIlwiICsgdGhpcy5jb25zdGFudF9yZXNvdXJjZV92YWx1ZSArIFwiXFxcIlwiO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZV9yZXN1bHRfdGVtcCArPSBcIiwgXFxcIlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiXFxcIiA6IFxcXCJcIiArIHRoaXMuY29uc3RhbnRfcmVzb3VyY2VfdmFsdWUgKyBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9yZXN1bHQgPSBcInsgXCIgKyB0aGlzLnJlc291cmNlX3Jlc3VsdF90ZW1wICsgXCIgfVwiO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnN0YW50X3Jlc291cmNlX3ZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZF9lbnZpcm9ubWVudF92YWx1ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW52aXJvbm1lbnRfcmVzdWx0X3RlbXApXHJcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0X3RlbXAgPSBcIlxcXCJcIiArIHRoaXMuZW52aXJvbm1lbnRfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmNvbnN0YW50X2Vudmlyb25tZW50X3ZhbHVlICsgXCJcXFwiXCI7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50X3Jlc3VsdF90ZW1wICs9IFwiLCBcXFwiXCIgKyB0aGlzLmVudmlyb25tZW50X2ZpZWxkICsgXCJcXFwiIDogXFxcIlwiICsgdGhpcy5jb25zdGFudF9lbnZpcm9ubWVudF92YWx1ZSArIFwiXFxcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCA9IFwieyBcIiArIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0X3RlbXAgKyBcIiB9XCI7XHJcblxyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfZmllbGQgPSB0aGlzLmNvbnN0YW50X2Vudmlyb25tZW50X3ZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0X3RlbXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfcmVzdWx0X3RlbXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdF9yZXN1bHRfdGVtcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0ID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdCgpIHtcclxuICAgICAgICB2YXIgY29tbWFuZCA9IHtcclxuICAgICAgICAgICAgVXNlckpzb25EYXRhOiB0aGlzLnN1YmplY3RfcmVzdWx0LFxyXG4gICAgICAgICAgICBSZXNvdXJjZUpzb25EYXRhOiB0aGlzLnJlc291cmNlX3Jlc3VsdCxcclxuICAgICAgICAgICAgRW52aXJvbm1lbnRKc29uRGF0YTogdGhpcy5lbnZpcm9ubWVudF9yZXN1bHQsXHJcbiAgICAgICAgICAgIEFjdGlvbjogdGhpcy5zZWxlY3RlZF9hY3Rpb24sXHJcbiAgICAgICAgICAgIENvbGxlY3Rpb25OYW1lOiB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHRoaXMucmVzdWx0X3Byb3BlcnR5X25hbWVzID0gW107XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkX3BvbGljeV90eXBlID09ICdBY2Nlc3MgQ29udHJvbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnQWNjZXNzQ29udHJvbC9SZXZpZXcvJywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NfY29udHJvbHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaXZhY3lfcG9saWNpZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9saWNpZXMgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwb2xpY3kgb2YgcG9saWNpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NfY29udHJvbHMucHVzaChuZXcgQWNjZXNzQ29udHJvbChwb2xpY3kucG9saWN5SWQsIHBvbGljeS5kZXNjcmlwdGlvbiwgcG9saWN5LmNvbGxlY3Rpb25OYW1lLCBwb2xpY3kucnVsZUNvbWJpbmluZywgcG9saWN5LnRhcmdldCwgcG9saWN5LmFjdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3kvUmV2aWV3LycsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjZXNzX2NvbnRyb2xzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcml2YWN5X3BvbGljaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvbGljaWVzID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcG9saWN5IG9mIHBvbGljaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpdmFjeV9wb2xpY2llcy5wdXNoKG5ldyBQcml2YWN5UG9saWN5KHBvbGljeS5wb2xpY3lJZCwgcG9saWN5LmRlc2NyaXB0aW9uLCBwb2xpY3kuY29sbGVjdGlvbk5hbWUsIHBvbGljeS50YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9yZXZpZXcuY29tcG9uZW50LnRzIiwiZXhwb3J0IGNsYXNzIEFjY2Vzc0NvbnRyb2xSdWxlIHtcclxuICAgIHB1YmxpYyBSdWxlSWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBDb25kaXRpb246IHN0cmluZztcclxuICAgIHB1YmxpYyBFZmZlY3Q6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihydWxlSWQ6IHN0cmluZywgY29uZGl0aW9uOiBzdHJpbmcsIGVmZmVjdDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5SdWxlSWQgPSBydWxlSWQ7XHJcbiAgICAgICAgdGhpcy5Db25kaXRpb24gPSBjb25kaXRpb247XHJcbiAgICAgICAgdGhpcy5FZmZlY3QgPSBlZmZlY3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBY2Nlc3NDb250cm9sIHtcclxuICAgIHB1YmxpYyBQb2xpY3lJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIERlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQ29sbGVjdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBSdWxlQ29tYmluaW5nOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQWN0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgVGFyZ2V0OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9saWN5SUQ6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgY29sbGVjdGlvbk5hbWU6IHN0cmluZywgcnVsZUNvbWJpbmluZzogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgYWN0aW9uOnN0cmluZz1cInJlYWRcIikge1xyXG4gICAgICAgIHRoaXMuUG9saWN5SUQgPSBwb2xpY3lJRDtcclxuICAgICAgICB0aGlzLkNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbk5hbWU7XHJcbiAgICAgICAgdGhpcy5EZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHRoaXMuUnVsZUNvbWJpbmluZyA9IHJ1bGVDb21iaW5pbmc7XHJcbiAgICAgICAgdGhpcy5BY3Rpb24gPSBhY3Rpb247XHJcbiAgICAgICAgdGhpcy5UYXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsLnRzIiwiaW1wb3J0IHsgU2VsZWN0SXRlbSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGRFZmZlY3Qge1xyXG4gICAgcHVibGljIE5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBGdW5jdGlvbkFwcGx5OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcGVydHlOYW1lOiBzdHJpbmcsIHByaXZhY3lGdW5jdGlvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5GdW5jdGlvbkFwcGx5ID0gcHJpdmFjeUZ1bmN0aW9uO1xyXG4gICAgICAgIHRoaXMuTmFtZSA9IHByb3BlcnR5TmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRWZmZWN0T3B0aW9uIHtcclxuICAgIHB1YmxpYyBOYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgRnVuY3Rpb25zOiBTZWxlY3RJdGVtW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcGVydHlOYW1lOiBzdHJpbmcsIHByaXZhY3lGdW5jdGlvbjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgdGhpcy5GdW5jdGlvbnMgPSBwcml2YWN5RnVuY3Rpb247XHJcbiAgICAgICAgdGhpcy5OYW1lID0gcHJvcGVydHlOYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJpdmFjeVJ1bGUge1xyXG4gICAgcHVibGljIFJ1bGVJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIENvbmRpdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIEZpZWxkRWZmZWN0czogRmllbGRFZmZlY3RbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihydWxlSUQ6IHN0cmluZywgY29uZGl0aW9uOiBzdHJpbmcsIGZpZWxkRWZmZWN0czogRmllbGRFZmZlY3RbXSkge1xyXG4gICAgICAgIHRoaXMuUnVsZUlEID0gcnVsZUlEO1xyXG4gICAgICAgIHRoaXMuQ29uZGl0aW9uID0gY29uZGl0aW9uO1xyXG4gICAgICAgIHRoaXMuRmllbGRFZmZlY3RzID0gZmllbGRFZmZlY3RzO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBQcml2YWN5UG9saWN5IHtcclxuICAgIHB1YmxpYyBQb2xpY3lJRDogc3RyaW5nO1xyXG4gICAgcHVibGljIERlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQ29sbGVjdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBUYXJnZXQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2xpY3lJRDogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuUG9saWN5SUQgPSBwb2xpY3lJRDtcclxuICAgICAgICB0aGlzLkRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdGhpcy5Db2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xyXG4gICAgICAgIHRoaXMuVGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvcHJpdmFjeV9ydWxlLm1vZGVsLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPlBvbGljeSBSZXZpZXc8L2gzPlxcclxcbjxwLWdyb3dsIFt2YWx1ZV09XFxcIm1zZ3NcXFwiPjwvcC1ncm93bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5BY3Rpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiYWN0aW9uc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX2FjdGlvblxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+UG9saWN5IFR5cGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicG9saWN5X3R5cGVzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcG9saWN5X3R5cGVcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTMgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoyOHB4XFxcIj5TdWJqZWN0IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMyBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImNvbnN0YW50X3N1YmplY3RfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTEgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy01IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzdWx0OiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjFcXFwiIGNvbHM9XFxcIjYwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInN1YmplY3RfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy0zIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzb3VyY2UgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicmVzb3VyY2VfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwicmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTMgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5WYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF9yZXNvdXJjZV92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMSBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZFxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy01IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzdWx0OiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjFcXFwiIGNvbHM9XFxcIjYwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMyBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJcXFwiPkVudmlyb25tZW50IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X2ZpZWxkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy0zIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+VmFsdWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIyNVxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfZW52aXJvbm1lbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTEgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGRcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNSBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc3VsdDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIxXFxcIiBjb2xzPVxcXCI2MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJlbnZpcm9ubWVudF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMiB0ZXh0LWNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTVcXFwiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcInN1Ym1pdCgpXFxcIj5TdWJtaXQ8L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLW9mZnNldC0wIGNvbC1sZy01XFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcImNsZWFyKClcXFwiPkNsZWFyPC9idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgKm5nSWY9XFxcImFjY2Vzc19jb250cm9scy5sZW5ndGggPiAwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MTVweFxcXCI+XFxyXFxuICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiYWNjZXNzX2NvbnRyb2xzXFxcIiBbcGFnaW5hdG9yXT1cXFwidHJ1ZVxcXCIgW3BhZ2VMaW5rc109XFxcIjNcXFwiIFtyb3dzUGVyUGFnZU9wdGlvbnNdPVxcXCJbMTAsMjAsNTBdXFxcIiBbcm93c109XFxcIjEwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlBvbGljeUlEXFxcIiBoZWFkZXI9XFxcIlBvbGljeSBJRFxcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJEZXNjcmlwdGlvblxcXCIgaGVhZGVyPVxcXCJEZXNjcmlwdGlvblxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb2xsZWN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJDb2xsZWN0aW9uIE5hbWVcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUNvbWJpbmluZ1xcXCIgaGVhZGVyPVxcXCJSdWxlIENvbWJpbmluZ1xcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJBY3Rpb25cXFwiIGhlYWRlcj1cXFwiQWN0aW9uXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlRhcmdldFxcXCIgaGVhZGVyPVxcXCJUYXJnZXRcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIFxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgKm5nSWY9XFxcInByaXZhY3lfcG9saWNpZXMubGVuZ3RoID4gMFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjE1cHhcXFwiPlxcclxcbiAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInByaXZhY3lfcG9saWNpZXNcXFwiIFtwYWdpbmF0b3JdPVxcXCJ0cnVlXFxcIiBbcGFnZUxpbmtzXT1cXFwiM1xcXCIgW3Jvd3NQZXJQYWdlT3B0aW9uc109XFxcIlsxMCwyMCw1MF1cXFwiIFtyb3dzXT1cXFwiMTBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUG9saWN5SURcXFwiIGhlYWRlcj1cXFwiUG9saWN5IElEXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkRlc2NyaXB0aW9uXFxcIiBoZWFkZXI9XFxcIkRlc2NyaXB0aW9uXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkNvbGxlY3Rpb25OYW1lXFxcIiBoZWFkZXI9XFxcIkNvbGxlY3Rpb24gTmFtZVxcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJUYXJnZXRcXFwiIGhlYWRlcj1cXFwiVGFyZ2V0XFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICBcXHJcXG4gICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgQWNjZXNzQ29udHJvbFJ1bGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWNjZXNzX2NvbnRyb2xfcnVsZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9ydWxlJyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2FjY2Vzc19jb250cm9sX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjY2Vzc0NvbnRyb2xQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBydWxlX2VmZmVjdHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9ydWxlX2VmZmVjdDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX2VmZmVjdHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2Z1bmN0aW9uX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHN1YmplY3RfZmllbGRzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfc3ViamVjdF9maWVsZDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudF9ydWxlX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgZmluYWxfcnVsZV9yZXN1bHQ6IHN0cmluZ1tdID0gW107XHJcbiAgICBwcml2YXRlIHJ1bGVzX2NvbWJpbmluZzogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3J1bGVfY29tYmluaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSB0YXJnZXRfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfdmFsdWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBjb25zdGFudF92YWx1ZTogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWVsZF9vcHRpb25zOiBzdHJpbmdbXSA9IFsncHVycG9zZScsICdzdGFydF90aW1lJywgJ2VuZF90aW1lJ107XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkOiBzdHJpbmdbXTtcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGpzb25faGVscGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIG1zZ3M6IE1lc3NhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgcnVsZXM6IEFjY2Vzc0NvbnRyb2xSdWxlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgdGhpcy5qc29uX2hlbHBlciA9IEpTT047XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnY29sbGVjdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdmdW5jdGlvbi8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mdW5jdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSA9IG5hbWVzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3ViamVjdC9maWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnN1YmplY3RfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAncmVhZCcsIHZhbHVlOiAncmVhZCcgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2NyZWF0ZScsIHZhbHVlOiAnY3JlYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAndXBkYXRlJywgdmFsdWU6ICd1cGRhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdkZWxldGUnLCB2YWx1ZTogJ2RlbGV0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF0udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZV9lZmZlY3RzLnB1c2goeyBsYWJlbDogJ1Blcm1pdCcsIHZhbHVlOiAnUGVybWl0JyB9KTtcclxuICAgICAgICB0aGlzLnJ1bGVfZWZmZWN0cy5wdXNoKHsgbGFiZWw6ICdEZW55JywgdmFsdWU6ICdEZW55JyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0ID0gdGhpcy5ydWxlX2VmZmVjdHNbMF0udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZXNfY29tYmluaW5nLnB1c2goeyBsYWJlbDogJ1Blcm1pdCBvdmVycmlkZXMnLCB2YWx1ZTogJ1Blcm1pdCBvdmVycmlkZXMnIH0pO1xyXG4gICAgICAgIHRoaXMucnVsZXNfY29tYmluaW5nLnB1c2goeyBsYWJlbDogJ0Rlbnkgb3ZlcnJpZGVzJywgdmFsdWU6ICdEZW55IG92ZXJyaWRlcycgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9ydWxlX2NvbWJpbmluZyA9IHRoaXMucnVsZXNfY29tYmluaW5nWzBdLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uU2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlc291cmNlX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3RydWN0dXJlLz9jb2xsZWN0aW9uTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQucmVzb3VyY2VfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzID0gW107XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5ydWxlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIGVsc2UgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGRhdGEgZm9ybS5cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSB0aGlzLnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgKyBcIiAoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9mdW5jdGlvbl9uYW1lX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIlJlc291cmNlLlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJTdWJqZWN0LlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUuaW5kZXhPZignXFwnJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGNvbnRhaW4gXFwnIGNoYXJhY3RlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiJ1wiICsgdGhpcy5jb25zdGFudF92YWx1ZSArIFwiJyBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkVudmlyb25tZW50LlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiIFwiO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGxvZ2ljIGZvcm1cclxuXHJcbiAgICBhbmRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiQU5EIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIkFORCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcl9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJPUiBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJPUiBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBub3RfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiTk9UICggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiTk9UICggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbl9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbG9zZV9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIikgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKSBcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWFfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIsIFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyX2NvbmRpdGlvbihpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uIFxyXG5cclxuICAgIHByaXZhdGUgYWRkX2N1cnJlbnRfcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJ1bGVfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJ1bGVfaWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChyID09IHRoaXMucnVsZV9pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIG11c3QgYmUgdW5pcXVlJyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfcmVzdWx0LnB1c2godGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0KTtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzLnB1c2godGhpcy5ydWxlX2lkKTtcclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfZWZmZWN0cy5wdXNoKHRoaXMuc2VsZWN0ZWRfcnVsZV9lZmZlY3QpO1xyXG4gICAgICAgIHRoaXMucnVsZXMucHVzaChuZXcgQWNjZXNzQ29udHJvbFJ1bGUodGhpcy5ydWxlX2lkLCB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQsIHRoaXMuc2VsZWN0ZWRfcnVsZV9lZmZlY3QpKTtcclxuICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6ICdPbmUgcnVsZSBhZGRlZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0gZXZlbnQucXVlcnk7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGZpZWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkID0gZmlsdGVyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9saWN5X2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUG9saWN5IElEIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucnVsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiUG9saWN5SURcIjogdGhpcy5wb2xpY3lfaWQsXHJcbiAgICAgICAgICAgIFwiQ29sbGVjdGlvbk5hbWVcIjogdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogdGhpcy5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgXCJBY3Rpb25cIjogdGhpcy5zZWxlY3RlZF9hY3Rpb24sXHJcbiAgICAgICAgICAgIFwiUnVsZUNvbWJpbmluZ1wiOiB0aGlzLnNlbGVjdGVkX3J1bGVfY29tYmluaW5nLFxyXG4gICAgICAgICAgICBcIlRhcmdldFwiOiB0aGlzLnRhcmdldF9yZXN1bHQsXHJcbiAgICAgICAgICAgIFwiUnVsZXNcIjogdGhpcy5ydWxlc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ0FjY2Vzc0NvbnRyb2xQb2xpY3knLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnQ3JlYXRlIFN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPkFjY2VzcyBDb250cm9sIFBvbGljeSBGb3JtPC9oMz5cXHJcXG48cC1ncm93bCBbdmFsdWVdPVxcXCJtc2dzXFxcIj48L3AtZ3Jvd2w+XFxyXFxuPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlBvbGljeSBJZGVudGlmaWVyIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInBvbGljeV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtOCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+RGVzY3JpcHRpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCI3MFxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiZGVzY3JpcHRpb25cXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5Db2xsZWN0aW9uIE5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiY29sbGVjdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcImNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiIChvbkNoYW5nZSk9XFxcIm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoJGV2ZW50LnZhbHVlKVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+QWN0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImFjdGlvbnNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9hY3Rpb25cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjNweFxcXCI+UnVsZSBDb21iaW5pbmcgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicnVsZXNfY29tYmluaW5nXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcnVsZV9jb21iaW5pbmdcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDwhLS0gVGFyZ2V0IC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlRhcmdldCBDb25kaXRpb246PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiTk9UXFxcIiAoY2xpY2spPVxcXCJub3RfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiLFxcXCIgKGNsaWNrKT1cXFwiY29tbWFfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfY29uZGl0aW9uKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwidGFyZ2V0X3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLSBSdWxlIC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgUnVsZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfY29uZGl0aW9uKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBzdHlsZT1cXFwiYm9yZGVyLWNvbG9yOiBibGFja1xcXCIgcm93cz1cXFwiMlxcXCIgY29scz1cXFwiNzBcXFwiIHBJbnB1dFRleHRhcmVhXFxyXFxuICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJjdXJyZW50X3J1bGVfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDogNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UnVsZSBJRCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJydWxlX2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+UnVsZSBFZmZlY3QgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicnVsZV9lZmZlY3RzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcnVsZV9lZmZlY3RcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIEN1cnJlbnQgUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2N1cnJlbnRfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiAqbmdJZj1cXFwicnVsZXMubGVuZ3RoID4gMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInJ1bGVzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJSdWxlSWRcXFwiIGhlYWRlcj1cXFwiUnVsZSBJRFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb25kaXRpb25cXFwiIGhlYWRlcj1cXFwiQ29uZGl0aW9uXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMzIwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJFZmZlY3RcXFwiIGhlYWRlcj1cXFwiRWZmZWN0XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J292ZXJmbG93JzondmlzaWJsZSd9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY29sIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiZWRpdG9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbKG5nTW9kZWwpXT1cXFwiY2FyW2NvbC5maWVsZF1cXFwiIFtvcHRpb25zXT1cXFwicnVsZV9lZmZlY3RzXFxcIiBbYXV0b1dpZHRoXT1cXFwiZmFsc2VcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxMDAlJ31cXFwiIHJlcXVpcmVkPVxcXCJ0cnVlXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDxwLWZpZWxkc2V0IGxlZ2VuZD1cXFwiVXRpbGl0eVxcXCIgW3RvZ2dsZWFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5GdW5jdGlvbiBOYW1lOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJmdW5jdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX2Z1bmN0aW9uX25hbWVcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzb3VyY2UgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MjhweFxcXCI+U3ViamVjdCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwic3ViamVjdF9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3N1YmplY3RfZmllbGRfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkNvbnN0YW50IFZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJcXFwiPkVudmlyb25tZW50IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtYXV0b0NvbXBsZXRlIFsobmdNb2RlbCldPVxcXCJlbnZpcm9ubWVudF92YWx1ZVxcXCIgW3N1Z2dlc3Rpb25zXT1cXFwiZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGRcXFwiIChjb21wbGV0ZU1ldGhvZCk9XFxcImZpbHRlcl9lbnZpcm9ubWVudF9maWVsZCgkZXZlbnQpXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttaW5MZW5ndGhdPVxcXCIxXFxcIiBbc2l6ZV09XFxcIjE3XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcC1hdXRvQ29tcGxldGU+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvcC1maWVsZHNldD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIFxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPkNyZWF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBBY2Nlc3NDb250cm9sUnVsZSB9IGZyb20gJy4uLy4uL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdwcml2YWN5X3J1bGUnLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjY2Vzc0NvbnRyb2xEZXRhaWxDb21wb25lbnQge1xyXG4gICAgLy8jcmVnaW9uIFJlc291cmNlXHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlc291cmNlX2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3ZhbHVlczogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9vcGVyYXRvcnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9vcGVyYXRvcjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uZGl0aW9uX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcG9saWN5X2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgYWN0aW9uczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2FjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgcnVsZV9lZmZlY3RzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfcnVsZV9lZmZlY3Q6IHN0cmluZztcclxuICAgIHByaXZhdGUgZmluYWxfcnVsZV9lZmZlY3RzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZnVuY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9mdW5jdGlvbl9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJqZWN0X2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3N1YmplY3RfZmllbGQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRfcnVsZV9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbmFsX3J1bGVfcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBydWxlc19jb21iaW5pbmc6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9ydWxlX2NvbWJpbmluZzogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgdGFyZ2V0X3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgY29uc3RhbnRfdmFsdWU6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcblxyXG4gICAgcHJpdmF0ZSBydWxlX2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgcnVsZV9pZHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBqc29uX2hlbHBlcjogYW55O1xyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVzOiBBY2Nlc3NDb250cm9sUnVsZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSA9IGNvbGxlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnZnVuY3Rpb24vJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmFtZXM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuZnVuY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgPSBuYW1lc1swXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N1YmplY3QvZmllbGRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5zdWJqZWN0X2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3JlYWQnLCB2YWx1ZTogJ3JlYWQnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdjcmVhdGUnLCB2YWx1ZTogJ2NyZWF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3VwZGF0ZScsIHZhbHVlOiAndXBkYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnZGVsZXRlJywgdmFsdWU6ICdkZWxldGUnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bGVfZWZmZWN0cy5wdXNoKHsgbGFiZWw6ICdQZXJtaXQnLCB2YWx1ZTogJ1Blcm1pdCcgfSk7XHJcbiAgICAgICAgdGhpcy5ydWxlX2VmZmVjdHMucHVzaCh7IGxhYmVsOiAnRGVueScsIHZhbHVlOiAnRGVueScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9ydWxlX2VmZmVjdCA9IHRoaXMucnVsZV9lZmZlY3RzWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bGVzX2NvbWJpbmluZy5wdXNoKHsgbGFiZWw6ICdQZXJtaXQgb3ZlcnJpZGVzJywgdmFsdWU6ICdQZXJtaXQgb3ZlcnJpZGVzJyB9KTtcclxuICAgICAgICB0aGlzLnJ1bGVzX2NvbWJpbmluZy5wdXNoKHsgbGFiZWw6ICdEZW55IG92ZXJyaWRlcycsIHZhbHVlOiAnRGVueSBvdmVycmlkZXMnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfcnVsZV9jb21iaW5pbmcgPSB0aGlzLnJ1bGVzX2NvbWJpbmluZ1swXS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMucnVsZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBkYXRhIGZvcm0uXHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBsb2dpYyBmb3JtXHJcblxyXG4gICAgYW5kX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkFORCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJBTkQgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiT1IgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiT1IgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk5PVCAoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk5PVCAoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VfYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIpIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIikgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1hX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiwgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhcl9jb25kaXRpb24oaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvbiBcclxuXHJcbiAgICBwcml2YXRlIGFkZF9jdXJyZW50X3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ydWxlX2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJRCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHIgb2YgdGhpcy5ydWxlX2lkcykge1xyXG4gICAgICAgICAgICBpZiAociA9PSB0aGlzLnJ1bGVfaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJRCBtdXN0IGJlIHVuaXF1ZScgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9ydWxlX3Jlc3VsdC5wdXNoKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCk7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcy5wdXNoKHRoaXMucnVsZV9pZCk7XHJcbiAgICAgICAgdGhpcy5maW5hbF9ydWxlX2VmZmVjdHMucHVzaCh0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0KTtcclxuICAgICAgICB0aGlzLnJ1bGVzLnB1c2gobmV3IEFjY2Vzc0NvbnRyb2xSdWxlKHRoaXMucnVsZV9pZCwgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0LCB0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0KSk7XHJcbiAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnT25lIHJ1bGUgYWRkZWQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBvbGljeV9pZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1BvbGljeSBJRCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJ1bGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIlBvbGljeUlEXCI6IHRoaXMucG9saWN5X2lkLFxyXG4gICAgICAgICAgICBcIkNvbGxlY3Rpb25OYW1lXCI6IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IHRoaXMuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIFwiQWN0aW9uXCI6IHRoaXMuc2VsZWN0ZWRfYWN0aW9uLFxyXG4gICAgICAgICAgICBcIlJ1bGVDb21iaW5pbmdcIjogdGhpcy5zZWxlY3RlZF9ydWxlX2NvbWJpbmluZyxcclxuICAgICAgICAgICAgXCJUYXJnZXRcIjogdGhpcy50YXJnZXRfcmVzdWx0LFxyXG4gICAgICAgICAgICBcIlJ1bGVzXCI6IHRoaXMucnVsZXNcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdBY2Nlc3NDb250cm9sUG9saWN5JywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ0NyZWF0ZSBTdWNjZXNzZnVsbHknIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5yZXNldCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2RldGFpbC5jb21wb25lbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgzIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOmNlbnRlclxcXCI+QWNjZXNzIENvbnRyb2wgUG9saWN5IERldGFpbDwvaDM+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qb2xpY3kgSWRlbnRpZmllciA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJwb2xpY3lfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTggZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPkRlc2NyaXB0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiNzBcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImRlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+Q29sbGVjdGlvbiBOYW1lIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbGxlY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkFjdGlvbiA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJhY3Rpb25zXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfYWN0aW9uXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDozcHhcXFwiPlJ1bGUgQ29tYmluaW5nIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJ1bGVzX2NvbWJpbmluZ1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3J1bGVfY29tYmluaW5nXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8IS0tIFRhcmdldCAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5UYXJnZXQgQ29uZGl0aW9uOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk9SXFxcIiAoY2xpY2spPVxcXCJvcl9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKVxcXCIgKGNsaWNrKT1cXFwiY2xvc2VfYnJhY2tldF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX2NvbmRpdGlvbih0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInRhcmdldF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwhLS0gUnVsZSAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5DdXJyZW50IFJ1bGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX2NvbmRpdGlvbigpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY3VycmVudF9ydWxlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6IDVweFxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlJ1bGUgSUQgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicnVsZV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlJ1bGUgRWZmZWN0IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJ1bGVfZWZmZWN0c1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3J1bGVfZWZmZWN0XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBDdXJyZW50IFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jdXJyZW50X3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgKm5nSWY9XFxcInJ1bGVzLmxlbmd0aCA+IDBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJydWxlc1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUlkXFxcIiBoZWFkZXI9XFxcIlJ1bGUgSURcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29uZGl0aW9uXFxcIiBoZWFkZXI9XFxcIkNvbmRpdGlvblxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzMyMHB4J31cXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRWZmZWN0XFxcIiBoZWFkZXI9XFxcIkVmZmVjdFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieydvdmVyZmxvdyc6J3Zpc2libGUnfVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbGV0LWNvbCBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gWyhuZ01vZGVsKV09XFxcImNhcltjb2wuZmllbGRdXFxcIiBbb3B0aW9uc109XFxcInJ1bGVfZWZmZWN0c1xcXCIgW2F1dG9XaWR0aF09XFxcImZhbHNlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTAwJSd9XFxcIiByZXF1aXJlZD1cXFwidHJ1ZVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8cC1maWVsZHNldCBsZWdlbmQ9XFxcIlV0aWxpdHlcXFwiIFt0b2dnbGVhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+RnVuY3Rpb24gTmFtZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiZnVuY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9mdW5jdGlvbl9uYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc291cmNlIEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI4cHhcXFwiPlN1YmplY3QgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5Db25zdGFudCBWYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwiXFxcIj5FbnZpcm9ubWVudCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWF1dG9Db21wbGV0ZSBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfdmFsdWVcXFwiIFtzdWdnZXN0aW9uc109XFxcImVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkXFxcIiAoY29tcGxldGVNZXRob2QpPVxcXCJmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoJGV2ZW50KVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbWluTGVuZ3RoXT1cXFwiMVxcXCIgW3NpemVdPVxcXCIxN1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3AtYXV0b0NvbXBsZXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L3AtZmllbGRzZXQ+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPlVwZGF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgRmllbGRFZmZlY3QsIEZpZWxkRWZmZWN0T3B0aW9uLCBQcml2YWN5UnVsZSB9IGZyb20gJy4uLy4uL21vZGVscy9wcml2YWN5X3J1bGUubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3ByaXZhY3lfcG9saWN5JyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIFByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50X3J1bGVfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX3Jlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHRhcmdldF9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcbiAgICAvLyNlbmRyZWdpb24gZW52aXJvbm1lbnRcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHByaXZhY3lfZmllbGRfc2VsZWN0ZWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJpdmFjeV9mdW5jdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBmaWVsZF9lZmZlY3RzOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICBwcml2YXRlIGZpbmFsX2ZpZWxkX2VmZmVjdHM6IEZpZWxkRWZmZWN0W11bXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZmllbGRfZWZmZWN0X29wdGlvbnM6IEZpZWxkRWZmZWN0T3B0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgcHJpdmFjeV9ydWxlczogUHJpdmFjeVJ1bGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8jcmVnaW9uIGNhbGwgd2ViIGFwaSBmb3Igb3B0aW9uIGRhdGFcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSA9IGNvbGxlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnZnVuY3Rpb24vJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmFtZXM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuZnVuY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgPSBuYW1lc1swXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N1YmplY3QvZmllbGRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5zdWJqZWN0X2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lGdW5jdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbWV0aG9kczogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1ldGhvZCBvZiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByaXZhY3lfZnVuY3Rpb25zLnB1c2goeyBsYWJlbDogbWV0aG9kLCB2YWx1ZTogbWV0aG9kIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQucHJpdmFjeV9mdW5jdGlvbnMucHVzaCh7IGxhYmVsOiAnT3B0aW9uYWwnLCB2YWx1ZTogJ09wdGlvbmFsJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgICAgICAvLyNyZWdpb24gaGFyZCBjb2RlIGZvciBvcHRpb25zXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3JlYWQnLCB2YWx1ZTogJ3JlYWQnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdjcmVhdGUnLCB2YWx1ZTogJ2NyZWF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3VwZGF0ZScsIHZhbHVlOiAndXBkYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnZGVsZXRlJywgdmFsdWU6ICdkZWxldGUnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdLnZhbHVlO1xyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uU2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlc291cmNlX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmllbGRfZWZmZWN0X29wdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5yZXNvdXJjZV9maWVsZHMpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3RzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoYXQucmVzb3VyY2VfZmllbGRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3RzLnB1c2gobmV3IEZpZWxkRWZmZWN0KGl0ZW0ubGFiZWwsIFwiT3B0aW9uYWxcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcGFyYW1ldGVyID0gdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgKyAnLicgKyBuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lGdW5jdGlvbj9uYW1lPScgKyBwYXJhbWV0ZXIsIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVmZmVjdHMgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0X2l0ZW1zOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBlZmZlY3Qgb2YgZWZmZWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RfaXRlbXMucHVzaCh7IGxhYmVsOiBlZmZlY3QsIHZhbHVlOiBlZmZlY3QgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3Rfb3B0aW9ucy5wdXNoKG5ldyBGaWVsZEVmZmVjdE9wdGlvbihuYW1lLCBzZWxlY3RfaXRlbXMpKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eTogYW55LCBqc29uT2JqZWN0OiBhbnksIHByZWZpeDogc3RyaW5nLCBjb250YWluZXI6IFNlbGVjdEl0ZW1bXSkge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PSBcIl9pZFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgLy8gICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdFswXSkge1xyXG4gICAgICAgIC8vICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgLy8gICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgZWxzZSBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gZGF0YSBmb3JtLlxyXG5cclxuICAgIGFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSB0aGlzLnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgKyBcIiAoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9yZXNvdXJjZV9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlJlc291cmNlLlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3N1YmplY3RfZmllbGRfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJTdWJqZWN0LlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3N1YmplY3RfZmllbGRfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfY29uc3RhbnRfdmFsdWVfdG9fcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUuaW5kZXhPZignXFwnJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGNvbnRhaW4gXFwnIGNoYXJhY3RlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiJ1wiICsgdGhpcy5jb25zdGFudF92YWx1ZSArIFwiJyBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9lbnZpcm9ubWVudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIkVudmlyb25tZW50LlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9lbnZpcm9ubWVudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gbG9naWMgZm9ybVxyXG5cclxuICAgIGFuZF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJBTkQgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiQU5EIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9yX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk9SIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk9SIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5vdF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJOT1QgKCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJOT1QgKCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuX2JyYWNrZXRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiKCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlX2JyYWNrZXRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiKSBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIpIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1hX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiwgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiLCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyX3J1bGUoaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMucHJpdmFjeV9ydWxlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkX2N1cnJlbnRfcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5ydWxlX2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJZCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJ1bGVfaWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChyID09IHRoaXMucnVsZV9pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIG11c3QgYmUgdW5pcXVlJyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfcmVzdWx0LnB1c2godGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0KTtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzLnB1c2godGhpcy5ydWxlX2lkKTtcclxuICAgICAgICB2YXIgY2xvbmVkOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaXRlbSBvZiB0aGlzLmZpZWxkX2VmZmVjdHMpIHtcclxuICAgICAgICAgICAgY2xvbmVkLnB1c2gobmV3IEZpZWxkRWZmZWN0KGl0ZW0uTmFtZSwgaXRlbS5GdW5jdGlvbkFwcGx5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxfZmllbGRfZWZmZWN0cy5wdXNoKGNsb25lZCk7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3J1bGVzLnB1c2gobmV3IFByaXZhY3lSdWxlKHRoaXMucnVsZV9pZCwgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0LCBjbG9uZWQpKTtcclxuICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6ICdPbmUgUnVsZSBhZGRlZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQcml2YWN5RnVuY3Rpb25zKGZpZWxkTmFtZTogYW55KTogU2VsZWN0SXRlbVtdIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGRfZWZmZWN0X29wdGlvbnMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByaXZhY3lfZnVuY3Rpb25zO1xyXG4gICAgICAgIGVsc2UgcmVzdWx0ID0gdGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucy5maW5kKHggPT4geC5OYW1lID09IGZpZWxkTmFtZSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuRnVuY3Rpb25zO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhY3lfZnVuY3Rpb25zO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBldmVudC5xdWVyeTtcclxuICAgICAgICBsZXQgZmlsdGVyZWQ6IGFueVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoZmllbGQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goZmllbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGQgPSBmaWx0ZXJlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZpbmFsX2ZpZWxkX2VmZmVjdHMpO1xyXG4gICAgICAgIGlmICh0aGlzLnBvbGljeV9pZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1BvbGljeSBJZCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnByaXZhY3lfcnVsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlcyBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIlBvbGljeUlEXCI6IHRoaXMucG9saWN5X2lkLFxyXG4gICAgICAgICAgICBcIkNvbGxlY3Rpb25OYW1lXCI6IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IHRoaXMuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIFwiVGFyZ2V0XCI6IHRoaXMudGFyZ2V0X3Jlc3VsdCxcclxuICAgICAgICAgICAgXCJSdWxlc1wiOiB0aGlzLnByaXZhY3lfcnVsZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lQb2xpY3knLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiBcIlByaXZhY3kgUG9saWN5IGFkZGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDMgc3R5bGU9XFxcInRleHQtYWxpZ246Y2VudGVyXFxcIj5Qcml2YWN5IFBvbGljeSBGb3JtPC9oMz5cXHJcXG48cC1ncm93bCBbdmFsdWVdPVxcXCJtc2dzXFxcIj48L3AtZ3Jvd2w+XFxyXFxuPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlBvbGljeSBJZGVudGlmaWVyIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInBvbGljeV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtOCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+RGVzY3JpcHRpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCI3MFxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiZGVzY3JpcHRpb25cXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5Db2xsZWN0aW9uIE5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiY29sbGVjdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcImNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiIChvbkNoYW5nZSk9XFxcIm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoJGV2ZW50LnZhbHVlKVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8IS0tIFRhcmdldCAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5UYXJnZXQgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk9SXFxcIiAoY2xpY2spPVxcXCJvcl9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKVxcXCIgKGNsaWNrKT1cXFwiY2xvc2VfYnJhY2tldF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX3J1bGUodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBzdHlsZT1cXFwiYm9yZGVyLWNvbG9yOiBibGFja1xcXCIgcm93cz1cXFwiMlxcXCIgY29scz1cXFwiNzBcXFwiIHBJbnB1dFRleHRhcmVhXFxyXFxuICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJ0YXJnZXRfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8IS0tIFJ1bGUgLS0+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+Q3VycmVudCBSdWxlIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQU5EXFxcIiAoY2xpY2spPVxcXCJhbmRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk9SXFxcIiAoY2xpY2spPVxcXCJvcl9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiTk9UXFxcIiAoY2xpY2spPVxcXCJub3RfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIihcXFwiIChjbGljayk9XFxcIm9wZW5fYnJhY2tldF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKVxcXCIgKGNsaWNrKT1cXFwiY2xvc2VfYnJhY2tldF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiLFxcXCIgKGNsaWNrKT1cXFwiY29tbWFfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkNMRUFSXFxcIiAoY2xpY2spPVxcXCJjbGVhcl9ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBzdHlsZT1cXFwiYm9yZGVyLWNvbG9yOiBibGFja1xcXCIgcm93cz1cXFwiMlxcXCIgY29scz1cXFwiNzBcXFwiIHBJbnB1dFRleHRhcmVhXFxyXFxuICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJjdXJyZW50X3J1bGVfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJmaWVsZF9lZmZlY3RzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJOYW1lXFxcIiBoZWFkZXI9XFxcIlByb3BlcnR5IE5hbWVcXFwiIFtlZGl0YWJsZV09XFxcImZhbHNlXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkZ1bmN0aW9uQXBwbHlcXFwiIGhlYWRlcj1cXFwiUHJpdmFjeSBGdW5jdGlvblxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtlZGl0YWJsZV09XFxcInRydWVcXFwiIFtzdHlsZV09XFxcInsnb3ZlcmZsb3cnOid2aXNpYmxlJ31cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jb2wgbGV0LWNhcj1cXFwicm93RGF0YVxcXCIgcFRlbXBsYXRlPVxcXCJlZGl0b3JcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFsobmdNb2RlbCldPVxcXCJjYXJbY29sLmZpZWxkXVxcXCIgW29wdGlvbnNdPVxcXCJnZXRQcml2YWN5RnVuY3Rpb25zKGNhci5OYW1lKVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXV0b1dpZHRoXT1cXFwiZmFsc2VcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxMDAlJ31cXFwiIHJlcXVpcmVkPVxcXCJ0cnVlXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOiA1cHhcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5SdWxlIElkIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInJ1bGVfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBDdXJyZW50IFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jdXJyZW50X3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgKm5nSWY9XFxcInByaXZhY3lfcnVsZXMubGVuZ3RoID4gMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInByaXZhY3lfcnVsZXNcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlJ1bGVJRFxcXCIgaGVhZGVyPVxcXCJSdWxlIElEXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkNvbmRpdGlvblxcXCIgaGVhZGVyPVxcXCJDb25kaXRpb25cXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOic0MDBweCd9XFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDxwLWZpZWxkc2V0IGxlZ2VuZD1cXFwiVXRpbGl0eVxcXCIgW3RvZ2dsZWFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5GdW5jdGlvbiBOYW1lOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJmdW5jdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX2Z1bmN0aW9uX25hbWVcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzb3VyY2UgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MjhweFxcXCI+U3ViamVjdCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwic3ViamVjdF9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3N1YmplY3RfZmllbGRfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkNvbnN0YW50IFZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJcXFwiPkVudmlyb25tZW50IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtYXV0b0NvbXBsZXRlIFsobmdNb2RlbCldPVxcXCJlbnZpcm9ubWVudF92YWx1ZVxcXCIgW3N1Z2dlc3Rpb25zXT1cXFwiZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGRcXFwiIChjb21wbGV0ZU1ldGhvZCk9XFxcImZpbHRlcl9lbnZpcm9ubWVudF9maWVsZCgkZXZlbnQpXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttaW5MZW5ndGhdPVxcXCIxXFxcIiBbc2l6ZV09XFxcIjE3XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcC1hdXRvQ29tcGxldGU+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvcC1maWVsZHNldD5cXHJcXG5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMiB0ZXh0LWNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXN1Y2Nlc3MgYnRuLWxnXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJoZWlnaHQ6OTAlXFxcIiAoY2xpY2spPVxcXCJzdWJtaXQoKVxcXCI+Q3JlYXRlPC9idXR0b24+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9mb3JtX2NyZWF0ZS5jb21wb25lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IFNlbGVjdEl0ZW0sIE1lc3NhZ2UsIENvbmZpcm1hdGlvblNlcnZpY2UgfSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuaW1wb3J0IHsgQXBwU2V0dGluZyB9IGZyb20gJy4uLy4uL21vZGVscy9hcHBfc2V0dGluZyc7XHJcbmltcG9ydCB7IEZpZWxkRWZmZWN0LCBGaWVsZEVmZmVjdE9wdGlvbiwgUHJpdmFjeVJ1bGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcHJpdmFjeV9ydWxlLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdwcml2YWN5X3BvbGljeV9kZXRhaWwnLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIFByaXZhY3lQb2xpY3lEZXRhaWxDb21wb25lbnQge1xyXG4gICAgLy8jcmVnaW9uIFJlc291cmNlXHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlc291cmNlX2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3ZhbHVlczogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9vcGVyYXRvcnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9vcGVyYXRvcjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uZGl0aW9uX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcG9saWN5X2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgYWN0aW9uczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2FjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgZnVuY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9mdW5jdGlvbl9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJqZWN0X2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3N1YmplY3RfZmllbGQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRfcnVsZV9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbmFsX3J1bGVfcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgdGFyZ2V0X3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAvLyNyZWdpb24gZW52aXJvbm1lbnRcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfdmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgY29uc3RhbnRfdmFsdWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWVsZF9vcHRpb25zOiBzdHJpbmdbXSA9IFsncHVycG9zZScsICdzdGFydF90aW1lJywgJ2VuZF90aW1lJ107XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkOiBzdHJpbmdbXTtcclxuICAgIC8vI2VuZHJlZ2lvbiBlbnZpcm9ubWVudFxyXG5cclxuICAgIHByaXZhdGUgcnVsZV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIHJ1bGVfaWRzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgcHJpdmFjeV9maWVsZF9zZWxlY3RlZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBwcml2YWN5X2Z1bmN0aW9uczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGZpZWxkX2VmZmVjdHM6IEZpZWxkRWZmZWN0W10gPSBbXTtcclxuICAgIHByaXZhdGUgZmluYWxfZmllbGRfZWZmZWN0czogRmllbGRFZmZlY3RbXVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBmaWVsZF9lZmZlY3Rfb3B0aW9uczogRmllbGRFZmZlY3RPcHRpb25bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBwcml2YWN5X3J1bGVzOiBQcml2YWN5UnVsZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBqc29uX2hlbHBlcjogYW55O1xyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgdGhpcy5qc29uX2hlbHBlciA9IEpTT047XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyNyZWdpb24gY2FsbCB3ZWIgYXBpIGZvciBvcHRpb24gZGF0YVxyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnY29sbGVjdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdmdW5jdGlvbi8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mdW5jdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSA9IG5hbWVzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3ViamVjdC9maWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnN1YmplY3RfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtZXRob2RzOiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQucHJpdmFjeV9mdW5jdGlvbnMucHVzaCh7IGxhYmVsOiBtZXRob2QsIHZhbHVlOiBtZXRob2QgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5wcml2YWN5X2Z1bmN0aW9ucy5wdXNoKHsgbGFiZWw6ICdPcHRpb25hbCcsIHZhbHVlOiAnT3B0aW9uYWwnIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgICAgIC8vI3JlZ2lvbiBoYXJkIGNvZGUgZm9yIG9wdGlvbnNcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAncmVhZCcsIHZhbHVlOiAncmVhZCcgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2NyZWF0ZScsIHZhbHVlOiAnY3JlYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAndXBkYXRlJywgdmFsdWU6ICd1cGRhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdkZWxldGUnLCB2YWx1ZTogJ2RlbGV0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF0udmFsdWU7XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25TZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3RydWN0dXJlLz9jb2xsZWN0aW9uTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhhdC5yZXNvdXJjZV9maWVsZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5sYWJlbCwgXCJPcHRpb25hbFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICcuJyArIHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwYXJhbWV0ZXIgPSB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSArICcuJyArIG5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9uP25hbWU9JyArIHBhcmFtZXRlciwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0cyA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RfaXRlbXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGVmZmVjdCBvZiBlZmZlY3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9pdGVtcy5wdXNoKHsgbGFiZWw6IGVmZmVjdCwgdmFsdWU6IGVmZmVjdCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdF9vcHRpb25zLnB1c2gobmV3IEZpZWxkRWZmZWN0T3B0aW9uKG5hbWUsIHNlbGVjdF9pdGVtcykpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IudGV4dCgpIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9lbHNlIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAvLyAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0WzBdKSB7XHJcbiAgICAgICAgLy8gICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBkYXRhIGZvcm0uXHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBsb2dpYyBmb3JtXHJcblxyXG4gICAgYW5kX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkFORCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJBTkQgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiT1IgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiT1IgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk5PVCAoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk5PVCAoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VfYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIpIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIikgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWFfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIsIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJfcnVsZShpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzID0gW107XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3J1bGVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfY3VycmVudF9ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1bGVfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucnVsZV9pZHMpIHtcclxuICAgICAgICAgICAgaWYgKHIgPT0gdGhpcy5ydWxlX2lkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgSUQgbXVzdCBiZSB1bmlxdWUnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxfcnVsZV9yZXN1bHQucHVzaCh0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQpO1xyXG4gICAgICAgIHRoaXMucnVsZV9pZHMucHVzaCh0aGlzLnJ1bGVfaWQpO1xyXG4gICAgICAgIHZhciBjbG9uZWQ6IEZpZWxkRWZmZWN0W10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMuZmllbGRfZWZmZWN0cykge1xyXG4gICAgICAgICAgICBjbG9uZWQucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5OYW1lLCBpdGVtLkZ1bmN0aW9uQXBwbHkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9maWVsZF9lZmZlY3RzLnB1c2goY2xvbmVkKTtcclxuICAgICAgICB0aGlzLnByaXZhY3lfcnVsZXMucHVzaChuZXcgUHJpdmFjeVJ1bGUodGhpcy5ydWxlX2lkLCB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQsIGNsb25lZCkpO1xyXG4gICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ09uZSBSdWxlIGFkZGVkJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaXZhY3lGdW5jdGlvbnMoZmllbGROYW1lOiBhbnkpOiBTZWxlY3RJdGVtW10ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgICAgICBpZiAodGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcbiAgICAgICAgZWxzZSByZXN1bHQgPSB0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zLmZpbmQoeCA9PiB4Lk5hbWUgPT0gZmllbGROYW1lKTtcclxuICAgICAgICBpZiAocmVzdWx0ICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5GdW5jdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmluYWxfZmllbGRfZWZmZWN0cyk7XHJcbiAgICAgICAgaWYgKHRoaXMucG9saWN5X2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUG9saWN5IElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucHJpdmFjeV9ydWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGVzIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiUG9saWN5SURcIjogdGhpcy5wb2xpY3lfaWQsXHJcbiAgICAgICAgICAgIFwiQ29sbGVjdGlvbk5hbWVcIjogdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogdGhpcy5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgXCJUYXJnZXRcIjogdGhpcy50YXJnZXRfcmVzdWx0LFxyXG4gICAgICAgICAgICBcIlJ1bGVzXCI6IHRoaXMucHJpdmFjeV9ydWxlc1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeVBvbGljeScsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6IFwiUHJpdmFjeSBQb2xpY3kgYWRkZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDMgc3R5bGU9XFxcInRleHQtYWxpZ246Y2VudGVyXFxcIj5Qcml2YWN5IFBvbGljeSBEZXRhaWw8L2gzPlxcclxcbjxwLWdyb3dsIFt2YWx1ZV09XFxcIm1zZ3NcXFwiPjwvcC1ncm93bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UG9saWN5IElkZW50aWZpZXIgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicG9saWN5X2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy04IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5EZXNjcmlwdGlvbiA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjcwXFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJkZXNjcmlwdGlvblxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDwhLS0gVGFyZ2V0IC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlRhcmdldCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiTk9UXFxcIiAoY2xpY2spPVxcXCJub3RfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiLFxcXCIgKGNsaWNrKT1cXFwiY29tbWFfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfcnVsZSh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInRhcmdldF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwhLS0gUnVsZSAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5DdXJyZW50IFJ1bGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcImN1cnJlbnRfcnVsZV9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcImZpZWxkX2VmZmVjdHNcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIk5hbWVcXFwiIGhlYWRlcj1cXFwiUHJvcGVydHkgTmFtZVxcXCIgW2VkaXRhYmxlXT1cXFwiZmFsc2VcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRnVuY3Rpb25BcHBseVxcXCIgaGVhZGVyPVxcXCJQcml2YWN5IEZ1bmN0aW9uXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieydvdmVyZmxvdyc6J3Zpc2libGUnfVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbGV0LWNvbCBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gWyhuZ01vZGVsKV09XFxcImNhcltjb2wuZmllbGRdXFxcIiBbb3B0aW9uc109XFxcImdldFByaXZhY3lGdW5jdGlvbnMoY2FyLk5hbWUpXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdXRvV2lkdGhdPVxcXCJmYWxzZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzEwMCUnfVxcXCIgcmVxdWlyZWQ9XFxcInRydWVcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XFxyXFxuICAgICAgICAgICAgICAgIDwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6IDVweFxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlJ1bGUgSWQgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicnVsZV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIEN1cnJlbnQgUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2N1cnJlbnRfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiAqbmdJZj1cXFwicHJpdmFjeV9ydWxlcy5sZW5ndGggPiAwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwicHJpdmFjeV9ydWxlc1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUlEXFxcIiBoZWFkZXI9XFxcIlJ1bGUgSURcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29uZGl0aW9uXFxcIiBoZWFkZXI9XFxcIkNvbmRpdGlvblxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzQwMHB4J31cXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTZcXFwiPlxcclxcbiAgICAgICAgPHAtZmllbGRzZXQgbGVnZW5kPVxcXCJVdGlsaXR5XFxcIiBbdG9nZ2xlYWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkZ1bmN0aW9uIE5hbWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImZ1bmN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfZnVuY3Rpb25fbmFtZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZnVuY3Rpb25fbmFtZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5SZXNvdXJjZSBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicmVzb3VyY2VfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwicmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoyOHB4XFxcIj5TdWJqZWN0IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJzdWJqZWN0X2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3N1YmplY3RfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3N1YmplY3RfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+Q29uc3RhbnQgVmFsdWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImNvbnN0YW50X3ZhbHVlXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcIlxcXCI+RW52aXJvbm1lbnQgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1hdXRvQ29tcGxldGUgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X3ZhbHVlXFxcIiBbc3VnZ2VzdGlvbnNdPVxcXCJlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZFxcXCIgKGNvbXBsZXRlTWV0aG9kKT1cXFwiZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKCRldmVudClcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21pbkxlbmd0aF09XFxcIjFcXFwiIFtzaXplXT1cXFwiMTdcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9wLWF1dG9Db21wbGV0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9wLWZpZWxkc2V0PlxcclxcblxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyIHRleHQtY2VudGVyXFxcIj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcInN1Ym1pdCgpXFxcIj5VcGRhdGU8L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2RldGFpbC5jb21wb25lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgUHJpdmFjeURvbWFpbiwgUHJpdmFjeURvbWFpbkZ1bmN0aW9uLCBQcml2YWN5RG9tYWluRmllbGQgfSBmcm9tICcuLi8uLi9tb2RlbHMvcHJpdmFjeV9kb21haW4ubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3ByaXZhY3lfZG9tYWluJyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3ByaXZhY3lfZG9tYWluX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJyksXHJcbiAgICBwcm92aWRlcnM6IFtDb25maXJtYXRpb25TZXJ2aWNlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW5Db21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgY29uZmlndXJlZF9kb21haW5fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9mdW5jdGlvbnM6IFByaXZhY3lEb21haW5GdW5jdGlvbltdID0gW107XHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zX3ZpZXc6IFByaXZhY3lEb21haW5GdW5jdGlvbltdID0gW107XHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZmllbGRzOiBQcml2YWN5RG9tYWluRmllbGRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkc192aWV3OiBQcml2YWN5RG9tYWluRmllbGRbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZG9tYWluX25hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgZnVuY3Rpb25fbmFtZTogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIHByaW9yaXR5X2Z1bmN0aW9uOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdjb2xsZWN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX25hbWVzLnB1c2goeyBsYWJlbDogbmFtZSwgdmFsdWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgPSBjb2xsZWN0aW9uc1swXTtcclxuICAgICAgICAgICAgdGhhdC5vblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25zWzBdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVfZG9tYWlucygpO1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6ZV9kb21haW5zKCkge1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlZF9kb21haW5fbmFtZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lEb21haW5GaWVsZC8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgZG9tYWluIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbmZpZ3VyZWRfZG9tYWluX25hbWVzLnB1c2goeyBsYWJlbDogZG9tYWluLmRvbWFpbk5hbWUsIHZhbHVlOiBkb21haW4uZG9tYWluTmFtZSB9KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGZ1bmMgb2YgZG9tYWluLmZ1bmN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9mdW5jdGlvbnMucHVzaChuZXcgUHJpdmFjeURvbWFpbkZ1bmN0aW9uKGZ1bmMubmFtZSwgZnVuYy5wcmlvcml0eSwgZG9tYWluLmRvbWFpbk5hbWUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGZpZWxkIG9mIGRvbWFpbi5maWVsZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZmllbGRzLnB1c2gobmV3IFByaXZhY3lEb21haW5GaWVsZChmaWVsZCwgZG9tYWluLmRvbWFpbk5hbWUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWUgPSB0aGF0LmNvbmZpZ3VyZWRfZG9tYWluX25hbWVzWzBdLmxhYmVsO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0RG9tYWluTmFtZSh0aGF0LmNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb25TZWxlY3REb21haW5OYW1lKGRvbWFpbl9zZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2Z1bmN0aW9uc192aWV3ID0gdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2Z1bmN0aW9ucy5maWx0ZXIoeCA9PiB4LkRvbWFpbk5hbWUgPT0gZG9tYWluX3NlbGVjdGVkKTtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZmllbGRzX3ZpZXcgPSB0aGlzLmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZmllbGRzLmZpbHRlcih4ID0+IHguRG9tYWluTmFtZSA9PSBkb21haW5fc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25TZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdHJ1Y3R1cmUvP2NvbGxlY3Rpb25OYW1lPScgKyBjb2xsZWN0aW9uU2VsZWN0ZWQpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQucmVzb3VyY2VfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVByaW9yaXR5RnVuY3Rpb25zKCkge1xyXG4gICAgICAgIGxldCBwcmlvcml0eV9mdW5jdGlvbnM6IGFueVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgZnVuYyBvZiB0aGlzLmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zX3ZpZXcpIHtcclxuICAgICAgICAgICAgcHJpb3JpdHlfZnVuY3Rpb25zLnB1c2goeyBcIk5hbWVcIjogZnVuYy5GdW5jdGlvbk5hbWUsIFwiUHJpb3JpdHlcIjogZnVuYy5Qcmlvcml0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiRG9tYWluTmFtZVwiOiB0aGlzLmNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiUHJpb3JpdHlGdW5jdGlvbnNcIjogcHJpb3JpdHlfZnVuY3Rpb25zXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcmlvcml0eUZ1bmN0aW9ucycsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6ICdVcGRhdGUgUHJpb3JpdHkgU3VjY2Vzc2Z1bGx5JyB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRfZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiRG9tYWluTmFtZVwiOiB0aGlzLmNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiUHJpb3JpdHlcIjogeyBcIk5hbWVcIjogdGhpcy5mdW5jdGlvbl9uYW1lLCBcIlByaW9yaXR5XCI6IHRoaXMucHJpb3JpdHlfZnVuY3Rpb24gfSBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lEb21haW5GdW5jdGlvbicsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZG9tYWlucygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnRnVuY3Rpb24gQWRkZWQgU3VjY2Vzc2Z1bGx5JyB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRGaWVsZCgpIHtcclxuICAgICAgICBsZXQgZmllbGROYW1lID0gdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgKyBcIi5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQ7XHJcbiAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkc192aWV3KSB7XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC5GaWVsZE5hbWUgPT0gZmllbGROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0ZpZWxkIGFscmVhZHkgZXhpc3RlZCcgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiRG9tYWluTmFtZVwiOiB0aGlzLmNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiRmllbGROYW1lXCI6IGZpZWxkTmFtZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnRG9tYWluRmllbGQnLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2RvbWFpbnMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ0ZpZWxkIEFkZGVkIFN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkRG9tYWluKCkge1xyXG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRvbWFpbl9uYW1lO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lEb21haW4nLCBKU09OLnN0cmluZ2lmeShuYW1lKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2RvbWFpbnMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ0luc2VydCBEb21haW4gU3VjY2Vzc2Z1bGx5JyB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwiZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW4ge1xyXG4gICAgcHVibGljIE5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBGaWVsZHNBcHBseTogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBmaWVsZHNBcHBseTogc3RyaW5nW10pIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuRmllbGRzQXBwbHkgPSBmaWVsZHNBcHBseTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW5GdW5jdGlvbiB7XHJcbiAgICBwdWJsaWMgRG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIFByaW9yaXR5OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZnVuY05hbWU6IHN0cmluZywgcHJpb3JpdHk6IG51bWJlciwgZG9tYWluTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5GdW5jdGlvbk5hbWUgPSBmdW5jTmFtZTtcclxuICAgICAgICB0aGlzLlByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5Eb21haW5OYW1lID0gZG9tYWluTmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW5GaWVsZCB7XHJcbiAgICBwdWJsaWMgRG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEZpZWxkTmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZpZWxkTmFtZTogc3RyaW5nLCBkb21haW5OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLkZpZWxkTmFtZSA9IGZpZWxkTmFtZTtcclxuICAgICAgICB0aGlzLkRvbWFpbk5hbWUgPSBkb21haW5OYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL21vZGVscy9wcml2YWN5X2RvbWFpbi5tb2RlbC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8cC1ncm93bCBbdmFsdWVdPVxcXCJtc2dzXFxcIj48L3AtZ3Jvd2w+XFxyXFxuPGgxIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOmNlbnRlclxcXCI+UHJpdmFjeSBEb21haW48L2gxPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8aDM+TmV3IERvbWFpbjwvaDM+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI1cHhcXFwiPk5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJkb21haW5fbmFtZVxcXCIgLz5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gaWNvbj1cXFwiZmEtcGx1c1xcXCIgKGNsaWNrKT1cXFwiYWRkRG9tYWluKClcXFwiIGxhYmVsPVxcXCJBZGQgRG9tYWluXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxoMz5SZWdpc3RlcmVkIERvbWFpbjwvaDM+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjdweFxcXCI+RG9tYWlucyA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbmZpZ3VyZWRfZG9tYWluX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29uZmlndXJlZF9kb21haW5fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMjAwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3REb21haW5OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5GdW5jdGlvbnMgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJmdW5jdGlvbl9uYW1lXFxcIiAvPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qcmlvcml0eSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBzaXplPVxcXCIyMFxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicHJpb3JpdHlfZnVuY3Rpb25cXFwiLz5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gaWNvbj1cXFwiZmEtcGx1c1xcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uKClcXFwiIGxhYmVsPVxcXCJBZGQgRnVuY3Rpb25cXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOjEwcHg7XFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5GdW5jdGlvbnM8L2xhYmVsPlxcclxcbiAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcImNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zX3ZpZXdcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRG9tYWluTmFtZVxcXCIgaGVhZGVyPVxcXCJEb21haW4gTmFtZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkZ1bmN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJGdW5jdGlvbiBOYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMzIwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlByaW9yaXR5XFxcIiBoZWFkZXI9XFxcIlByaW9yaXR5XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206MTBweDtcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgXFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgcEJ1dHRvbiBpY29uPVxcXCJmYS1zYXZlXFxcIiAoY2xpY2spPVxcXCJ1cGRhdGVQcmlvcml0eUZ1bmN0aW9ucygpXFxcIiBsYWJlbD1cXFwiVXBkYXRlIFByaW9yaXR5XFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbToyMHB4O1xcXCI+XFxyXFxuICAgICAgICA8bGFiZWw+RmllbGRzPC9sYWJlbD5cXHJcXG4gICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJjb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkc192aWV3XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkRvbWFpbk5hbWVcXFwiIGhlYWRlcj1cXFwiRG9tYWluIE5hbWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJGaWVsZE5hbWVcXFwiIGhlYWRlcj1cXFwiRmllbGQgTmFtZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicyMDBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkZpZWxkcyA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicyMDBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00XFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgcEJ1dHRvbiBpY29uPVxcXCJmYS1wbHVzXFxcIiAoY2xpY2spPVxcXCJhZGRGaWVsZCgpXFxcIiBsYWJlbD1cXFwiQWRkIEZpZWxkXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IFNlbGVjdEl0ZW0sIE1lc3NhZ2UsIENvbmZpcm1hdGlvblNlcnZpY2UgfSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuaW1wb3J0IHsgQXBwU2V0dGluZyB9IGZyb20gJy4uLy4uL21vZGVscy9hcHBfc2V0dGluZyc7XHJcbmltcG9ydCB7IEFjY2Vzc0NvbnRyb2wgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWNjZXNzX2NvbnRyb2xfcnVsZS5tb2RlbCc7XHJcbmltcG9ydCB7IFByaXZhY3lQb2xpY3kgfSBmcm9tICcuLi8uLi9tb2RlbHMvcHJpdmFjeV9ydWxlLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhY2Nlc3NfY29udHJvbF9tYW5hZ2VtZW50JyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWwnKSxcclxuICAgIHByb3ZpZGVyczogW0NvbmZpcm1hdGlvblNlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgUG9saWN5TWFuYWdlbWVudENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIGFjY2Vzc19jb250cm9sczogQWNjZXNzQ29udHJvbFtdID0gW107XHJcbiAgICBwcml2YXRlIHByaXZhY3lfcG9saWN5OiBQcml2YWN5UG9saWN5W10gPSBbXTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuICAgIHByaXZhdGUgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgIHByaXZhdGUgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHAsIHByaXZhdGUgY29uZmlybWF0aW9uU2VydmljZTogQ29uZmlybWF0aW9uU2VydmljZSkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuaW5pdF9hY2Nlc3NfY29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdF9wcml2YWN5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdF9hY2Nlc3NfY29udHJvbCgpIHtcclxuICAgICAgICB0aGlzLmFjY2Vzc19jb250cm9scyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnQWNjZXNzQ29udHJvbFBvbGljeS8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc19jb250cm9scy5wdXNoKG5ldyBBY2Nlc3NDb250cm9sKGRhdGEucG9saWN5SWQsIGRhdGEuZGVzY3JpcHRpb24sIGRhdGEuY29sbGVjdGlvbk5hbWUsIGRhdGEucnVsZUNvbWJpbmluZywgZGF0YS50YXJnZXQsIGRhdGEuYWN0aW9uKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0X3ByaXZhY3koKSB7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3BvbGljeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeVBvbGljeS8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByaXZhY3lfcG9saWN5LnB1c2gobmV3IFByaXZhY3lQb2xpY3koZGF0YS5wb2xpY3lJZCwgZGF0YS5kZXNjcmlwdGlvbiwgZGF0YS5jb2xsZWN0aW9uTmFtZSwgZGF0YS50YXJnZXQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZV9hY2Nlc3NfY29udHJvbChwb2xpY3k6IGFueSkge1xyXG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uU2VydmljZS5jb25maXJtKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RvIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nLFxyXG4gICAgICAgICAgICBoZWFkZXI6ICdEZWxldGUgQ29uZmlybWF0aW9uJyxcclxuICAgICAgICAgICAgaWNvbjogJ2ZhIGZhLXRyYXNoJyxcclxuICAgICAgICAgICAgYWNjZXB0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAuZGVsZXRlKEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ0FjY2Vzc0NvbnRyb2xQb2xpY3k/cG9saWN5SUQ9JyArIHBvbGljeS5Qb2xpY3lJRCwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnQ29uZmlybWVkJywgZGV0YWlsOiAnUmVjb3JkIGRlbGV0ZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdF9hY2Nlc3NfY29udHJvbCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVfcHJpdmFjeV9wb2xpY3kocG9saWN5OiBhbnkpIHtcclxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvblNlcnZpY2UuY29uZmlybSh7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdEbyB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyByZWNvcmQ/JyxcclxuICAgICAgICAgICAgaGVhZGVyOiAnRGVsZXRlIENvbmZpcm1hdGlvbicsXHJcbiAgICAgICAgICAgIGljb246ICdmYSBmYS10cmFzaCcsXHJcbiAgICAgICAgICAgIGFjY2VwdDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmRlbGV0ZShBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcml2YWN5UG9saWN5P3BvbGljeUlEPScgKyBwb2xpY3kuUG9saWN5SUQsIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0NvbmZpcm1lZCcsIGRldGFpbDogJ1JlY29yZCBkZWxldGVkJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRfcHJpdmFjeSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxwLWNvbmZpcm1EaWFsb2cgd2lkdGg9XFxcIjQyNVxcXCI+PC9wLWNvbmZpcm1EaWFsb2c+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+QWNjZXNzIENvbnRyb2wgTWFuYWdlbWVudDwvaDM+PC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiYWNjZXNzX2NvbnRyb2xzXFxcIiBbcGFnaW5hdG9yXT1cXFwidHJ1ZVxcXCIgW3BhZ2VMaW5rc109XFxcIjNcXFwiIFtyb3dzUGVyUGFnZU9wdGlvbnNdPVxcXCJbMTAsMjAsNTBdXFxcIiBbcm93c109XFxcIjEwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlBvbGljeUlEXFxcIiBoZWFkZXI9XFxcIlBvbGljeSBJRFxcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJEZXNjcmlwdGlvblxcXCIgaGVhZGVyPVxcXCJEZXNjcmlwdGlvblxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb2xsZWN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJDb2xsZWN0aW9uIE5hbWVcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUNvbWJpbmluZ1xcXCIgaGVhZGVyPVxcXCJSdWxlIENvbWJpbmluZ1xcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJBY3Rpb25cXFwiIGhlYWRlcj1cXFwiQWN0aW9uXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlRhcmdldFxcXCIgaGVhZGVyPVxcXCJUYXJnZXRcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBzdHlsZUNsYXNzPVxcXCJjb2wtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiYm9keVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVpLWJ1dHRvbi1kYW5nZXJcXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwiZGVsZXRlX2FjY2Vzc19jb250cm9sKGNhcilcXFwiIGljb249XFxcImZhLXRyYXNoXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+UHJpdmFjeSBNYW5hZ2VtZW50PC9oMz48L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJwcml2YWN5X3BvbGljeVxcXCIgW3BhZ2luYXRvcl09XFxcInRydWVcXFwiIFtwYWdlTGlua3NdPVxcXCIzXFxcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cXFwiWzEwLDIwLDUwXVxcXCIgW3Jvd3NdPVxcXCIxMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJQb2xpY3lJRFxcXCIgaGVhZGVyPVxcXCJQb2xpY3kgSURcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRGVzY3JpcHRpb25cXFwiIGhlYWRlcj1cXFwiRGVzY3JpcHRpb25cXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29sbGVjdGlvbk5hbWVcXFwiIGhlYWRlcj1cXFwiQ29sbGVjdGlvbiBOYW1lXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlRhcmdldFxcXCIgaGVhZGVyPVxcXCJUYXJnZXRcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBzdHlsZUNsYXNzPVxcXCJjb2wtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiYm9keVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVpLWJ1dHRvbi1kYW5nZXJcXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwiZGVsZXRlX3ByaXZhY3lfcG9saWN5KGNhcilcXFwiIGljb249XFxcImZhLXRyYXNoXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBGaWVsZEVmZmVjdCwgRmllbGRFZmZlY3RPcHRpb24sIFByaXZhY3lSdWxlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3ByaXZhY3lfcnVsZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9wb2xpY3knLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIFN1YlByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50X3J1bGVfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX3Jlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHRhcmdldF9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcbiAgICAvLyNlbmRyZWdpb24gZW52aXJvbm1lbnRcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHByaXZhY3lfZmllbGRfc2VsZWN0ZWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJpdmFjeV9mdW5jdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBmaWVsZF9lZmZlY3RzOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICBwcml2YXRlIGZpbmFsX2ZpZWxkX2VmZmVjdHM6IEZpZWxkRWZmZWN0W11bXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZmllbGRfZWZmZWN0X29wdGlvbnM6IEZpZWxkRWZmZWN0T3B0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgcHJpdmFjeV9ydWxlczogUHJpdmFjeVJ1bGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgY29uZmlndXJlZF9kb21haW5fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgcHJpb3JpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gICAgcHJpdmF0ZSBqc29uX2hlbHBlcjogYW55O1xyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgdGhpcy5qc29uX2hlbHBlciA9IEpTT047XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyNyZWdpb24gY2FsbCB3ZWIgYXBpIGZvciBvcHRpb24gZGF0YVxyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnQXJyYXlGaWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdmdW5jdGlvbi8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mdW5jdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSA9IG5hbWVzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3ViamVjdC9maWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnN1YmplY3RfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtZXRob2RzOiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQucHJpdmFjeV9mdW5jdGlvbnMucHVzaCh7IGxhYmVsOiBtZXRob2QsIHZhbHVlOiBtZXRob2QgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5wcml2YWN5X2Z1bmN0aW9ucy5wdXNoKHsgbGFiZWw6ICdPcHRpb25hbCcsIHZhbHVlOiAnT3B0aW9uYWwnIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeURvbWFpbkZpZWxkLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBkb21haW4gb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29uZmlndXJlZF9kb21haW5fbmFtZXMucHVzaCh7IGxhYmVsOiBkb21haW4uZG9tYWluTmFtZSwgdmFsdWU6IGRvbWFpbi5kb21haW5OYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29uZmlndXJlZF9kb21haW5fc2VsZWN0ZWRfbmFtZSA9IHRoYXQuY29uZmlndXJlZF9kb21haW5fbmFtZXNbMF0ubGFiZWw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgLy8jcmVnaW9uIGhhcmQgY29kZSBmb3Igb3B0aW9uc1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdyZWFkJywgdmFsdWU6ICdyZWFkJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnY3JlYXRlJywgdmFsdWU6ICdjcmVhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICd1cGRhdGUnLCB2YWx1ZTogJ3VwZGF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2RlbGV0ZScsIHZhbHVlOiAnZGVsZXRlJyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX2FjdGlvbiA9IHRoaXMuYWN0aW9uc1swXS52YWx1ZTtcclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdTdWJTdHJ1Y3R1cmUvP2ZpZWxkTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdFswXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhhdC5yZXNvdXJjZV9maWVsZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5sYWJlbCwgXCJPcHRpb25hbFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICcuJyArIHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwYXJhbWV0ZXIgPSB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSArICcuJyArIG5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9uP25hbWU9JyArIHBhcmFtZXRlciwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0cyA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RfaXRlbXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGVmZmVjdCBvZiBlZmZlY3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9pdGVtcy5wdXNoKHsgbGFiZWw6IGVmZmVjdCwgdmFsdWU6IGVmZmVjdCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdF9vcHRpb25zLnB1c2gobmV3IEZpZWxkRWZmZWN0T3B0aW9uKG5hbWUsIHNlbGVjdF9pdGVtcykpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IudGV4dCgpIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9lbHNlIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAvLyAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0WzBdKSB7XHJcbiAgICAgICAgLy8gICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBkYXRhIGZvcm0uXHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBsb2dpYyBmb3JtXHJcblxyXG4gICAgYW5kX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkFORCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJBTkQgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiT1IgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiT1IgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk5PVCAoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk5PVCAoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VfYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIpIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIikgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWFfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIsIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJfcnVsZShpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzID0gW107XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3J1bGVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfY3VycmVudF9ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1bGVfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucnVsZV9pZHMpIHtcclxuICAgICAgICAgICAgaWYgKHIgPT0gdGhpcy5ydWxlX2lkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgSUQgbXVzdCBiZSB1bmlxdWUnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxfcnVsZV9yZXN1bHQucHVzaCh0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQpO1xyXG4gICAgICAgIHRoaXMucnVsZV9pZHMucHVzaCh0aGlzLnJ1bGVfaWQpO1xyXG4gICAgICAgIHZhciBjbG9uZWQ6IEZpZWxkRWZmZWN0W10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMuZmllbGRfZWZmZWN0cykge1xyXG4gICAgICAgICAgICBjbG9uZWQucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5OYW1lLCBpdGVtLkZ1bmN0aW9uQXBwbHkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9maWVsZF9lZmZlY3RzLnB1c2goY2xvbmVkKTtcclxuICAgICAgICB0aGlzLnByaXZhY3lfcnVsZXMucHVzaChuZXcgUHJpdmFjeVJ1bGUodGhpcy5ydWxlX2lkLCB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQsIGNsb25lZCkpO1xyXG4gICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ09uZSBSdWxlIGFkZGVkJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaXZhY3lGdW5jdGlvbnMoZmllbGROYW1lOiBhbnkpOiBTZWxlY3RJdGVtW10ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgICAgICBpZiAodGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcbiAgICAgICAgZWxzZSByZXN1bHQgPSB0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zLmZpbmQoeCA9PiB4Lk5hbWUgPT0gZmllbGROYW1lKTtcclxuICAgICAgICBpZiAocmVzdWx0ICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5GdW5jdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmluYWxfZmllbGRfZWZmZWN0cyk7XHJcbiAgICAgICAgaWYgKHRoaXMucG9saWN5X2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUG9saWN5IElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucHJpdmFjeV9ydWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGVzIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucHJpb3JpdHkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1ByaW9yaXR5IGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJlZF9kb21haW5fc2VsZWN0ZWRfbmFtZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1BsZWFzZSBjcmVhdGUgYSBuZXcgZG9tYWluIGFuZCBhZGQgdGhpcyBmaWVsZCB0byB0aGF0JyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY29tbWFuZCA9IHtcclxuICAgICAgICAgICAgXCJQb2xpY3lJRFwiOiB0aGlzLnBvbGljeV9pZCxcclxuICAgICAgICAgICAgXCJDb2xsZWN0aW9uTmFtZVwiOiB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSxcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICBcIlJ1bGVzXCI6IHRoaXMucHJpdmFjeV9ydWxlcyxcclxuICAgICAgICAgICAgXCJEb21haW5OYW1lXCI6IHRoaXMuY29uZmlndXJlZF9kb21haW5fc2VsZWN0ZWRfbmFtZSxcclxuICAgICAgICAgICAgXCJQcmlvcml0eVwiOiB0aGlzLnByaW9yaXR5XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdTdWJQcml2YWN5UG9saWN5JywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogXCJTdWIgUHJpdmFjeSBQb2xpY3kgYWRkZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDMgc3R5bGU9XFxcInRleHQtYWxpZ246Y2VudGVyXFxcIj5TdWIgUHJpdmFjeSBQb2xpY3kgRm9ybTwvaDM+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qb2xpY3kgSWRlbnRpZmllciA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjIxXFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJwb2xpY3lfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTggZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPkRlc2NyaXB0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiNzBcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImRlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MzVweFxcXCI+RmllbGQgTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTgwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDozNXB4XFxcIj5Eb21haW4gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiY29uZmlndXJlZF9kb21haW5fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJjb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTgwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlByaW9yaXR5IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBzaXplPVxcXCIyMFxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicHJpb3JpdHlcXFwiLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTZcXFwiPlxcclxcbiAgICAgICAgPCEtLSBSdWxlIC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgUnVsZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY3VycmVudF9ydWxlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiZmllbGRfZWZmZWN0c1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiTmFtZVxcXCIgaGVhZGVyPVxcXCJQcm9wZXJ0eSBOYW1lXFxcIiBbZWRpdGFibGVdPVxcXCJmYWxzZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJGdW5jdGlvbkFwcGx5XFxcIiBoZWFkZXI9XFxcIlByaXZhY3kgRnVuY3Rpb25cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J292ZXJmbG93JzondmlzaWJsZSd9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY29sIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiZWRpdG9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbKG5nTW9kZWwpXT1cXFwiY2FyW2NvbC5maWVsZF1cXFwiIFtvcHRpb25zXT1cXFwiZ2V0UHJpdmFjeUZ1bmN0aW9ucyhjYXIuTmFtZSlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F1dG9XaWR0aF09XFxcImZhbHNlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTAwJSd9XFxcIiByZXF1aXJlZD1cXFwidHJ1ZVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDogNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UnVsZSBJZCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJydWxlX2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgQ3VycmVudCBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY3VycmVudF9ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiICpuZ0lmPVxcXCJwcml2YWN5X3J1bGVzLmxlbmd0aCA+IDBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJwcml2YWN5X3J1bGVzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJSdWxlSURcXFwiIGhlYWRlcj1cXFwiUnVsZSBJRFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb25kaXRpb25cXFwiIGhlYWRlcj1cXFwiQ29uZGl0aW9uXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonNDAwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8cC1maWVsZHNldCBsZWdlbmQ9XFxcIlV0aWxpdHlcXFwiIFt0b2dnbGVhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+RnVuY3Rpb24gTmFtZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiZnVuY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9mdW5jdGlvbl9uYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc291cmNlIEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MjhweFxcXCI+U3ViamVjdCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwic3ViamVjdF9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkNvbnN0YW50IFZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcIlxcXCI+RW52aXJvbm1lbnQgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1hdXRvQ29tcGxldGUgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X3ZhbHVlXFxcIiBbc3VnZ2VzdGlvbnNdPVxcXCJlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZFxcXCIgKGNvbXBsZXRlTWV0aG9kKT1cXFwiZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKCRldmVudClcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21pbkxlbmd0aF09XFxcIjFcXFwiIFtzaXplXT1cXFwiMTdcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9wLWF1dG9Db21wbGV0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L3AtZmllbGRzZXQ+XFxyXFxuXFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPkNyZWF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSg4Nyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9kaXN0L2pzL25wbS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSA1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9