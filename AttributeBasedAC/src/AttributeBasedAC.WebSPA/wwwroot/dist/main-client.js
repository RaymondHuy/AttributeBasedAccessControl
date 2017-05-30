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
/******/ 	var hotCurrentHash = "9822c54b23c560df5fc1"; // eslint-disable-line no-unused-vars
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
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(16);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	    warnings: "color: #5c3b00;"
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?path=http%3A%2F%2Flocalhost%3A38645%2F__webpack_hmr", __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(236);

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = vendor_065aa8bd3f33e516eb8b;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(5);
	exports.encode = exports.stringify = __webpack_require__(6);


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(8)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  XmlEntities: __webpack_require__(12),
	  Html4Entities: __webpack_require__(13),
	  Html5Entities: __webpack_require__(14),
	  AllHtmlEntities: __webpack_require__(14)
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

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
	    if (str.length === 0) {
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
	    if (str.length === 0) {
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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
	    var strLenght = str.length;
	    if (strLenght === 0) {
	        return '';
	    }
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


/***/ },
/* 13 */
/***/ function(module, exports) {

	var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'Oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'oelig', 'oelig', 'scaron', 'scaron', 'yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
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
	    if (str.length === 0) {
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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


/***/ },
/* 14 */
/***/ function(module, exports) {

	var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['CloseCurlyDoubleQuote', [8221]], ['CloseCurlyQuote', [8217]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
	
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
	    if (str.length === 0) {
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(80);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(1);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(83);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

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
	var access_control_form_create_component_1 = __webpack_require__(42);
	var access_control_detail_component_1 = __webpack_require__(44);
	var privacy_policy_form_create_component_1 = __webpack_require__(46);
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
	            primeng_1.InputTextModule, primeng_1.DataTableModule, primeng_1.SharedModule, primeng_1.PanelModule, primeng_1.FieldsetModule
	        ]
	    })
	], AppModule);
	exports.AppModule = AppModule;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(9);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(6);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "<div class='container-fluid'>\n    <div class='row'>\n        <div class='col-sm-3'>\n            <nav-menu></nav-menu>\n        </div>\n        <div class='col-sm-9 body-content'>\n            <router-outlet></router-outlet>\n        </div>\n    </div>\n</div>\n"

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(26);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(27)();
	// imports
	
	
	// module
	exports.push([module.id, "@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    .body-content {\n        padding-top: 50px;\n    }\n}\n", ""]);
	
	// exports


/***/ },
/* 27 */
/***/ function(module, exports) {

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


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">Privacy Access Control</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_checking']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Checking\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/access_control_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Access Control Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/sub_privacy_policy']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Sub Privacy Policy\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/policy_review']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Policy Review\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/privacy_domain']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Privacy Domain\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/policy_management']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Policy Management\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(31);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(27)();
	// imports
	
	
	// module
	exports.push([module.id, "li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\nli.link-active a,\nli.link-active a:hover,\nli.link-active a:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .navbar-header {\n        float: none;\n    }\n    .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .navbar ul {\n        float: none;\n    }\n    .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n", ""]);
	
	// exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "<h1>Hello, world!</h1>\n<p>Welcome to your new single-page application, built with:</p>\n<ul>\n    <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>\n    <li><a href='https://angular.io/'>Angular 2</a> and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>\n    <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>\n    <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>\n</ul>\n<p>To help you get started, we've also set up:</p>\n<ul>\n    <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>\n    <li><strong>Server-side prerendering</strong>. For faster initial loading and improved SEO, your Angular 2 app is prerendered on the server. The resulting HTML is then transferred to the browser where a client-side copy of the app takes over.</li>\n    <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>\n    <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, your Angular 2 app will be rebuilt and a new instance injected is into the page.</li>\n    <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>\n</ul>\n"

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(46);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(191);

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AppSetting = (function () {
	    function AppSetting() {
	    }
	    return AppSetting;
	}());
	AppSetting.API_ENDPOINT = 'http://localhost:5000/api/';
	exports.AppSetting = AppSetting;


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<div class=\"col-lg-12\">\r\n    <p-growl [value]=\"msgs\"></p-growl>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Subject Selection</h3></div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"users\" selectionMode=\"single\" [(selection)]=\"selected_user\"\r\n                     [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column *ngFor=\"let col of user_property_names\" field=\"{{col}}\" header=\"{{col}}\"\r\n                      [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <!--<p-footer><div style=\"text-align: left\">Selected User: {{json_helper.stringify(selected_user)}}</div></p-footer>-->\r\n        </p-dataTable>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\"><h3 style=\"color:#f0ad4e\">Resource Condition</h3></div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-xs-12 form-group\">\r\n            <label>Collection Name :</label>\r\n            <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\" \r\n                        [style]=\"{'width':'120px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label style=\"padding-right:13px\">Resource Field: </label>\r\n            <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'120px'}\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Operator :</label>\r\n            <p-dropdown [options]=\"resource_operators\" [(ngModel)]=\"resource_selected_operator\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Value :</label>\r\n            <input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"resource_values\" />\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"padding-bottom: 10px\">\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_condition()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Clear\" (click)=\"clear_condition()\"></button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <textarea style=\"border-color: black\" rows=\"2\" cols=\"140\" pInputTextarea\r\n                  [(ngModel)]=\"condition_result\" [disabled]=\"true\"></textarea>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n        <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\"><h3 style=\"color:#5cb85c\">Environment Condition</h3></div>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Field :</label>\r\n            <p-autoComplete [(ngModel)]=\"environment_field\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                            [minLength]=\"1\" >\r\n            </p-autoComplete>\r\n            <!--<input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"environment_field\" />-->\r\n        </div>\r\n        <div class=\"col-xs-4 form-group\">\r\n            <label>Value :</label>\r\n            <input id=\"in\" type=\"text\" size=\"25\" pInputText [(ngModel)]=\"environment_value\" />\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"col-xs-12\" style=\"padding-bottom: 10px\" >\r\n        <button class=\"ui-button-success\" pButton type=\"button\" \r\n                label=\"Add\" (click)=\"add_environment_field()\"></button>\r\n        <button class=\"ui-button-success\" pButton type=\"button\"\r\n                 label=\"Clear\" (click)=\"clear_environment()\"></button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\">\r\n        <textarea style=\"border-color: black\" rows=\"2\" cols=\"140\" pInputTextarea class=\"ui-inputtextarea\"\r\n                  [(ngModel)]=\"environment_object\" [disabled]=\"true\"></textarea>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-primary btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Submit</button>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12\" *ngIf=\"result.length > 0\" style=\"margin-top:20px\">\r\n        <table class=\"table table-bordered table-responsive table-striped\">\r\n            <thead>\r\n                <tr>\r\n                    <th *ngFor=\"let col of result_property_names\">{{col}}</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let row of result\">\r\n                    <td *ngFor=\"let idx of result_property_names\">{{json_helper.stringify(row[idx])}}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>"

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

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
	        this.access_controls.push(new access_control_rule_model_1.AccessControl("Policy_1", "policy for admin", "Department", "permit-overrides"));
	        this.access_controls.push(new access_control_rule_model_1.AccessControl("Policy_5", "policy for admin", "Employee", "permit-overrides"));
	        return;
	        //if (this.selected_policy_type == 'Access Control') {
	        //    this.http.post(AppSetting.API_ENDPOINT + 'AccessControl/Review/', JSON.stringify(command), this.options).subscribe(
	        //        data => {
	        //            console.log('ok');
	        //            that.result = data.json();
	        //            console.log(that.result);
	        //            //let jsonObject: any = data.json()[0];
	        //            //for (var property in jsonObject) {
	        //            //    that.result_property_names.push(property);
	        //            //}
	        //        },
	        //        error => {
	        //            this.msgs = [];
	        //            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        //        }
	        //    );
	        //}
	        //else {
	        //    this.http.post(AppSetting.API_ENDPOINT + 'Privacy/Review/', JSON.stringify(command), this.options).subscribe(
	        //        data => {
	        //            that.result = data.json();
	        //            if (that.result.length == 0)
	        //                this.msgs.push({ severity: 'info', summary: 'Info Message', detail: "No Policy satisfied" });
	        //            //let jsonObject: any = data.json()[0];
	        //            //for (var property in jsonObject) {
	        //            //    that.result_property_names.push(property);
	        //            //}
	        //        },
	        //        error => {
	        //            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.text() });
	        //        }
	        //    );
	        //}
	    };
	    return PolicyReviewComponent;
	}());
	PolicyReviewComponent = __decorate([
	    core_1.Component({
	        selector: 'policy_review',
	        template: __webpack_require__(41)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], PolicyReviewComponent);
	exports.PolicyReviewComponent = PolicyReviewComponent;


/***/ },
/* 40 */
/***/ function(module, exports) {

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
	    function AccessControl(policyID, description, collectionName, ruleCombining, action) {
	        if (action === void 0) { action = "read"; }
	        this.PolicyID = policyID;
	        this.CollectionName = collectionName;
	        this.Description = description;
	        this.RuleCombining = ruleCombining;
	        this.Action = action;
	    }
	    return AccessControl;
	}());
	exports.AccessControl = AccessControl;


/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Policy Review</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Policy Type :</label>\r\n                <p-dropdown [options]=\"policy_types\" [(ngModel)]=\"selected_policy_type\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:28px\">Subject Field: </label>\r\n                <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_subject_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_subject_field()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"subject_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Resource Field: </label>\r\n                <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_resource_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_resource_field()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"resource_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"\">Environment Field: </label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"environment_field\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-3 form-group\">\r\n                <label style=\"padding-right:13px\">Value: </label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"constant_environment_value\" />\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-1 form-group\" style=\"padding-top:25px\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add\" (click)=\"add_environment_value()\"></button>\r\n            </div>\r\n            <div class=\"col-xs-4 col-lg-5 form-group\">\r\n                <label style=\"padding-right:13px\">Result: </label>\r\n                <textarea style=\"border-color: black\" rows=\"1\" cols=\"60\" pInputTextarea\r\n                          [(ngModel)]=\"environment_result\" [disabled]=\"true\"></textarea>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12 text-center\">\r\n        <div class=\"col-lg-offset-1 col-lg-5\">\r\n            <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Submit</button>\r\n        </div>\r\n        <div class=\"col-lg-offset-0 col-lg-5\">\r\n            <button class=\"btn btn-danger btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"clear()\">Clear</button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" *ngIf=\"access_controls.length > 0\" style=\"padding-top:15px\">\r\n        <p-dataTable [value]=\"access_controls\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"RuleCombining\" header=\"Rule Combining\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Action\" header=\"Action\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" pButton (click)=\"select_access_control(car)\" icon=\"fa-share\"></button>\r\n                </template>\r\n            </p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" class=\"ui-button-danger\" pButton (click)=\"delete_privacy_policy(car)\" icon=\"fa-trash\"></button>\r\n                </template>\r\n            </p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-xs-12\" *ngIf=\"result.length > 0\">\r\n        <table class=\"table table-bordered table-responsive table-striped\">\r\n            <thead>\r\n                <tr>\r\n                    <th>Policy ID</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let row of result\">\r\n                    <td>{{row}}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>"

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

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
	        template: __webpack_require__(43)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], AccessControlPolicyFormCreateComponent);
	exports.AccessControlPolicyFormCreateComponent = AccessControlPolicyFormCreateComponent;


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Access Control Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:3px\">Rule Combining :</label>\r\n                <p-dropdown [options]=\"rules_combining\" [(ngModel)]=\"selected_rule_combining\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target Condition:</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule ID :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label>Rule Effect :</label>\r\n                <p-dropdown [options]=\"rule_effects\" [(ngModel)]=\"selected_rule_effect\"></p-dropdown>\r\n            </div>\r\n            \r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\" *ngIf=\"rules.length > 0\">\r\n            <p-dataTable [value]=\"rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleId\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'320px'}\"></p-column>\r\n                <p-column field=\"Effect\" header=\"Effect\" [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"rule_effects\" [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n        </p-fieldset>\r\n    </div>\r\n    \r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

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
	        template: __webpack_require__(45)
	    }),
	    __metadata("design:paramtypes", [http_1.Http])
	], AccessControlDetailComponent);
	exports.AccessControlDetailComponent = AccessControlDetailComponent;


/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Access Control Policy Detail</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Action :</label>\r\n                <p-dropdown [options]=\"actions\" [(ngModel)]=\"selected_action\"></p-dropdown>\r\n            </div>\r\n\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:3px\">Rule Combining :</label>\r\n                <p-dropdown [options]=\"rules_combining\" [(ngModel)]=\"selected_rule_combining\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target Condition:</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_condition()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule ID :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label>Rule Effect :</label>\r\n                <p-dropdown [options]=\"rule_effects\" [(ngModel)]=\"selected_rule_effect\"></p-dropdown>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\" *ngIf=\"rules.length > 0\">\r\n            <p-dataTable [value]=\"rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleId\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'320px'}\"></p-column>\r\n                <p-column field=\"Effect\" header=\"Effect\" [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"rule_effects\" [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n        </p-fieldset>\r\n    </div>\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Update</button>\r\n    </div>\r\n</div>"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

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
	var privacy_rule_model_1 = __webpack_require__(47);
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


/***/ },
/* 47 */
/***/ function(module, exports) {

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
	    function PrivacyPolicy(policyID, description, collectionName) {
	        this.PolicyID = policyID;
	        this.Description = description;
	        this.CollectionName = collectionName;
	    }
	    return PrivacyPolicy;
	}());
	exports.PrivacyPolicy = PrivacyPolicy;


/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Privacy Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

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
	var privacy_rule_model_1 = __webpack_require__(47);
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


/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Privacy Policy Detail</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Collection Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'150px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Update</button>\r\n    </div>\r\n</div>"

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

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
	        console.log(command);
	        this.http.post(app_setting_1.AppSetting.API_ENDPOINT + 'DomainField', JSON.stringify(command), this.options).subscribe(function (data) {
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


/***/ },
/* 52 */
/***/ function(module, exports) {

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


/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = "<p-growl [value]=\"msgs\"></p-growl>\r\n<h1 style=\"text-align:center\">Privacy Domain</h1>\r\n<div class=\"row\">\r\n    <div class=\"col-lg-12\">\r\n        <h3>New Domain</h3>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:25px\">Name :</label>\r\n            <input type=\"text\" size=\"25\" pInputText [(ngModel)]=\"domain_name\" />\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"addDomain()\" label=\"Add Domain\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <h3>Registered Domain</h3>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:7px\">Domains :</label>\r\n            <p-dropdown [options]=\"configured_domain_names\" [(ngModel)]=\"configured_domain_selected_name\"\r\n                        [style]=\"{'width':'200px'}\" (onChange)=\"onSelectDomainName($event.value)\"></p-dropdown>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Functions :</label>\r\n            <p-dropdown [options]=\"configured_domain_names\" [(ngModel)]=\"configured_domain_selected_name\"\r\n                        [style]=\"{'width':'200px'}\" (onChange)=\"onSelectDomainName($event.value)\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label style=\"padding-right:5px\">Priority :</label>\r\n            <input type=\"number\" size=\"20\" pInputText />\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"addField()\" label=\"Add Function\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:10px;\">\r\n        <label>Functions</label>\r\n        <p-dataTable [value]=\"configured_privacy_domain_functions_view\" [editable]=\"true\">\r\n            <p-column field=\"DomainName\" header=\"Domain Name\"></p-column>\r\n            <p-column field=\"FunctionName\" header=\"Function Name\" [style]=\"{'width':'320px'}\"></p-column>\r\n            <p-column field=\"Priority\" header=\"Priority\" [editable]=\"true\"></p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:10px;\">\r\n        <div class=\"col-lg-4 \">\r\n            <button type=\"button\" pButton icon=\"fa-save\" (click)=\"updatePriorityFunctions()\" label=\"Update Priority\"></button>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-lg-12\" style=\"margin-bottom:20px;\">\r\n        <label>Fields</label>\r\n        <p-dataTable [value]=\"configured_privacy_domain_fields_view\" [editable]=\"true\">\r\n            <p-column field=\"DomainName\" header=\"Domain Name\"></p-column>\r\n            <p-column field=\"FieldName\" header=\"Field Name\"></p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Collection :</label>\r\n            <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                        [style]=\"{'width':'200px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-lg-4 form-group\">\r\n            <label>Fields :</label>\r\n            <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\"\r\n                        [style]=\"{'width':'200px'}\"></p-dropdown>\r\n        </div>\r\n        <div class=\"col-lg-4\">\r\n            <button type=\"button\" pButton icon=\"fa-plus\" (click)=\"addField()\" label=\"Add Field\"></button>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

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
	var privacy_rule_model_1 = __webpack_require__(47);
	var PolicyManagementComponent = (function () {
	    function PolicyManagementComponent(http) {
	        this.http = http;
	        this.access_controls = [];
	        this.privacy_policy = [];
	    }
	    PolicyManagementComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'AccessControlPolicy/').subscribe(function (data) {
	            var jsonObject = data.json();
	            for (var _i = 0, jsonObject_1 = jsonObject; _i < jsonObject_1.length; _i++) {
	                var data_1 = jsonObject_1[_i];
	                _this.access_controls.push(new access_control_rule_model_1.AccessControl(data_1.policyId, data_1.description, data_1.collectionName, data_1.ruleCombining));
	            }
	        });
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'PrivacyPolicy/').subscribe(function (data) {
	            var jsonObject = data.json();
	            console.log(jsonObject);
	            for (var _i = 0, jsonObject_2 = jsonObject; _i < jsonObject_2.length; _i++) {
	                var data_2 = jsonObject_2[_i];
	                _this.privacy_policy.push(new privacy_rule_model_1.PrivacyPolicy(data_2.policyId, data_2.description, data_2.collectionName));
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
	    __metadata("design:paramtypes", [http_1.Http])
	], PolicyManagementComponent);
	exports.PolicyManagementComponent = PolicyManagementComponent;


/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Access Control Management</h3></div>\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"access_controls\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"RuleCombining\" header=\"Rule Combining\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Action\" header=\"Action\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" pButton (click)=\"select_access_control(car)\" icon=\"fa-share\"></button>\r\n                </template>\r\n            </p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" class=\"ui-button-danger\" pButton (click)=\"delete_privacy_policy(car)\" icon=\"fa-trash\"></button>\r\n                </template>\r\n            </p-column>\r\n        </p-dataTable>\r\n    </div>\r\n    <div class=\"col-lg-12\"><h3 style=\"color: blue\">Privacy Management</h3></div>\r\n    <div class=\"col-lg-12\">\r\n        <p-dataTable [value]=\"privacy_policy\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[10,20,50]\" [rows]=\"10\">\r\n            <p-column field=\"PolicyID\" header=\"Policy ID\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"Description\" header=\"Description\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column field=\"CollectionName\" header=\"Collection Name\" [sortable]=\"true\" [filter]=\"true\" filterMatchMode=\"contains\"></p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" pButton (click)=\"select_privacy_policy(car)\" icon=\"fa-share\"></button>\r\n                </template>\r\n            </p-column>\r\n            <p-column styleClass=\"col-button\">\r\n                <template let-car=\"rowData\" pTemplate=\"body\">\r\n                    <button type=\"button\" class=\"ui-button-danger\" pButton (click)=\"delete_privacy_policy(car)\" icon=\"fa-trash\"></button>\r\n                </template>\r\n            </p-column>\r\n        </p-dataTable>\r\n    </div>\r\n</div>"

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

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
	var privacy_rule_model_1 = __webpack_require__(47);
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
	        this.msgs = [];
	        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
	        this.options = new http_1.RequestOptions({ headers: this.headers });
	        this.json_helper = JSON;
	    }
	    SubPrivacyPolicyFormCreateComponent.prototype.ngOnInit = function () {
	        var that = this;
	        //#region call web api for option data
	        this.http.get(app_setting_1.AppSetting.API_ENDPOINT + 'collections/').subscribe(function (data) {
	            var collections = data.json();
	            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
	                var name = collections_1[_i];
	                that.collection_names.push({ label: name, value: name });
	            }
	            that.collection_names.push({ label: 'Department.projects', value: 'Department.projects' });
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
	    SubPrivacyPolicyFormCreateComponent.prototype.onSelectCollectionName = function (collectionSelected) {
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


/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = "<h3 style=\"text-align:center\">Sub Privacy Policy Form</h3>\r\n<p-growl [value]=\"msgs\"></p-growl>\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Policy Identifier :</label>\r\n                <input type=\"text\" size=\"21\" pInputText [(ngModel)]=\"policy_id\" />\r\n            </div>\r\n            <div class=\"col-xs-8 form-group\">\r\n                <label style=\"padding-right:5px\">Description :</label>\r\n                <input type=\"text\" size=\"70\" pInputText [(ngModel)]=\"description\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:35px\">Field Name :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'180px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:35px\">Domain :</label>\r\n                <p-dropdown [options]=\"collection_names\" [(ngModel)]=\"collection_selected_name\"\r\n                            [style]=\"{'width':'180px'}\" (onChange)=\"onSelectCollectionName($event.value)\"></p-dropdown>\r\n            </div>\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label style=\"padding-right:5px\">Priority :</label>\r\n                <input type=\"number\" size=\"20\" pInputText />\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <!-- Target -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Target :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"AND\" (click)=\"and_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"OR\" (click)=\"or_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\",\" (click)=\"comma_click(true)\"></button>\r\n                <button class=\"ui-button-warning\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule(true)\"></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"target_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <!-- Rule -->\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-4 form-group\">\r\n                <label>Current Rule :</label>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"col-xs-12 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"AND\" (click)=\"and_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"OR\" (click)=\"or_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"NOT\" (click)=\"not_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"(\" (click)=\"open_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\")\" (click)=\"close_bracket_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\",\" (click)=\"comma_click()\"></button>\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"CLEAR\" (click)=\"clear_rule()\"></button>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <textarea style=\"border-color: black\" rows=\"2\" cols=\"70\" pInputTextarea\r\n                      [(ngModel)]=\"current_rule_result\" [disabled]=\"true\"></textarea>\r\n        </div>\r\n        <div class=\"col-xs-12\">\r\n            <p-dataTable [value]=\"field_effects\" [editable]=\"true\">\r\n                <p-column field=\"Name\" header=\"Property Name\" [editable]=\"false\"></p-column>\r\n                <p-column field=\"FunctionApply\" header=\"Privacy Function\"\r\n                          [editable]=\"true\" [style]=\"{'overflow':'visible'}\">\r\n                    <template let-col let-car=\"rowData\" pTemplate=\"editor\">\r\n                        <p-dropdown [(ngModel)]=\"car[col.field]\" [options]=\"getPrivacyFunctions(car.Name)\"\r\n                                    [autoWidth]=\"false\" [style]=\"{'width':'100%'}\" required=\"true\"></p-dropdown>\r\n                    </template>\r\n                </p-column>\r\n            </p-dataTable>\r\n        </div>\r\n        <div class=\"col-xs-12\" style=\"padding-top: 5px\">\r\n            <div class=\"col-xs-6 form-group\">\r\n                <label style=\"padding-right:5px\">Rule Id :</label>\r\n                <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"rule_id\" />\r\n            </div>\r\n            <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add Current Rule\" (click)=\"add_current_rule()\"></button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-xs-12\" *ngIf=\"privacy_rules.length > 0\">\r\n            <p-dataTable [value]=\"privacy_rules\" [editable]=\"true\">\r\n                <p-column field=\"RuleID\" header=\"Rule ID\" [editable]=\"true\"></p-column>\r\n                <p-column field=\"Condition\" header=\"Condition\" [editable]=\"true\" [style]=\"{'width':'400px'}\"></p-column>\r\n            </p-dataTable>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n        <p-fieldset legend=\"Utility\" [toggleable]=\"true\">\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Function Name: </label>\r\n                    <p-dropdown [options]=\"function_names\" [(ngModel)]=\"selected_function_name\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_function_name_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_function_name_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Resource Field: </label>\r\n                    <p-dropdown [options]=\"resource_fields\" [(ngModel)]=\"resource_selected_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_resource_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_resource_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-4 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:28px\">Subject Field: </label>\r\n                    <p-dropdown [options]=\"subject_fields\" [(ngModel)]=\"selected_subject_field\" [style]=\"{'width':'150px'}\"></p-dropdown>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_subject_field_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-4 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_subject_field_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"padding-right:13px\">Constant Value: </label>\r\n                    <input type=\"text\" size=\"17\" pInputText [(ngModel)]=\"constant_value\" />\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_constant_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_constant_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-12\">\r\n                <div class=\"col-xs-6 col-lg-4 form-group\">\r\n                    <label style=\"\">Environment Field: </label>\r\n                    <p-autoComplete [(ngModel)]=\"environment_value\" [suggestions]=\"environment_filtered_field\" (completeMethod)=\"filter_environment_field($event)\"\r\n                                    [minLength]=\"1\" [size]=\"17\">\r\n                    </p-autoComplete>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-warning\" pButton type=\"button\" label=\"Add To Target\" (click)=\"add_environment_value_to_target()\"></button>\r\n                </div>\r\n                <div class=\"col-xs-6 col-lg-4 form-group\" style=\"padding-top:25px\">\r\n                    <button class=\"ui-button-info\" pButton type=\"button\" label=\"Add To Rule\" (click)=\"add_environment_value_to_rule()\"></button>\r\n                </div>\r\n            </div>\r\n\r\n        </p-fieldset>\r\n\r\n    </div>\r\n    <div class=\"col-lg-12 text-center\">\r\n        <button class=\"btn btn-success btn-lg\" type=\"button\" style=\"height:90%\" (click)=\"submit()\">Create</button>\r\n    </div>\r\n</div>"

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(3))(87);

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTgyMmM1NGIyM2M1NjBkZjVmYzEiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQuanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vbW9kdWxlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXCIiLCJ3ZWJwYWNrOi8vLy4vfi9xdWVyeXN0cmluZy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0cmlwLWFuc2kvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbnNpLXJlZ2V4L2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LW92ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbnNpLWh0bWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vaHRtbC1lbnRpdGllcy9saWIveG1sLWVudGl0aWVzLmpzIiwid2VicGFjazovLy8uL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDQtZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2xpYi9odG1sNS1lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL3Byb2Nlc3MtdXBkYXRlLmpzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9ib290LWNsaWVudC50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIyLXVuaXZlcnNhbC1wb2x5ZmlsbHMvYnJvd3Nlci5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZS9idW5kbGVzL2NvcmUudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbmd1bGFyMi11bml2ZXJzYWwvYnJvd3Nlci9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvYXBwLm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL3JvdXRlci9idW5kbGVzL3JvdXRlci51bWQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2Zvcm1zL2J1bmRsZXMvZm9ybXMudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC5jc3M/ZGRjMyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQuY3NzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3M/OWY2NCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvbmF2bWVudS9uYXZtZW51LmNvbXBvbmVudC5jc3MiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X2NoZWNraW5nLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2h0dHAvYnVuZGxlcy9odHRwLnVtZC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcHJpbWVuZy9wcmltZW5nLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvYXBwX3NldHRpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9jaGVja2luZy5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsLnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9yZXZpZXcuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2RldGFpbC5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL21vZGVscy9wcml2YWN5X3J1bGUubW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9kZXRhaWwuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvbW9kZWxzL3ByaXZhY3lfZG9tYWluLm1vZGVsLnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfZG9tYWluX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50LnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9zdWJfcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAvZGlzdC9qcy9ucG0uanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtEQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkI7QUFDM0I7QUFDQSxZQUFJO0FBQ0o7QUFDQSxXQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLHFDQUE2Qjs7QUFFN0IsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTixhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1AsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUM3UEEsZ0Q7Ozs7OztBQ0FBLDhDOzs7Ozs7QUNBQTs7QUFFQTtBQUNBOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxRQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0EsOEJBQTZCLFlBQVksSUFBSSxJQUFJLE1BQU0sSUFBSTtBQUMzRDs7Ozs7OztBQ0hBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbURBQWtELFlBQVksaUJBQWlCO0FBQy9FO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDOUVBOztBQUVBOztBQUVBO0FBQ0Esb0RBQW1ELElBQUksU0FBUyxNQUFNLElBQUk7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQztBQUNEO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUEyRDtBQUMzRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtB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QyxDQUFDLFNBQVMsQ0FDdEcsY0FBSTthQUNBLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNiLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxtQ0FBbUMsRUFBRSxDQUFDLENBQUM7U0FDL0csQ0FBQyxFQUNELGVBQUs7YUFDRCxLQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNmLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzFGLENBQUMsQ0FDSixDQUFDO0tBQ04sQ0FBQztLQUNMLDBDQUFDO0FBQUQsRUFBQztBQXpZWSxvQ0FBbUM7S0FKL0MsZ0JBQVMsQ0FBQztTQUNQLFFBQVEsRUFBRSxnQkFBZ0I7U0FDMUIsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBaUQsQ0FBQztNQUN2RSxDQUFDO3NDQXdENEIsV0FBSTtJQXZEckIsbUNBQW1DLENBeVkvQztBQXpZWSxtRkFBbUM7Ozs7Ozs7QUNYaEQsc2dDQUFxZ0MsZ0JBQWdCLHVXQUF1VyxnQkFBZ0IsbW1IQUFtbUgscUJBQXFCLGlSQUFpUixlQUFlLGloQ0FBaWhDLGdCQUFnQiw0ZEFBNGQsZ0JBQWdCLG01QkFBbTVCLGdCQUFnQixrNUJBQWs1QixnQkFBZ0IsNnVGOzs7Ozs7QUNBdG5SLCtDIiwiZmlsZSI6Im1haW4tY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChjYWxsYmFjaykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0dHJ5IHtcclxuIFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSAxMDAwMDtcclxuIFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVycik7XHJcbiBcdFx0fVxyXG4gXHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdGNhbGxiYWNrKCk7XHJcbiBcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRjYWxsYmFjayhlKTtcclxuIFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdXBkYXRlKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHQvLyBDb3BpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9iZWY0NWIwL3NyYy9zaGFyZWQvdXRpbHMvY2FuRGVmaW5lUHJvcGVydHkuanNcclxuIFx0dmFyIGNhbkRlZmluZVByb3BlcnR5ID0gZmFsc2U7XHJcbiBcdHRyeSB7XHJcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCBcInhcIiwge1xyXG4gXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHt9XHJcbiBcdFx0fSk7XHJcbiBcdFx0Y2FuRGVmaW5lUHJvcGVydHkgPSB0cnVlO1xyXG4gXHR9IGNhdGNoKHgpIHtcclxuIFx0XHQvLyBJRSB3aWxsIGZhaWwgb24gZGVmaW5lUHJvcGVydHlcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjk4MjJjNTRiMjNjNTYwZGY1ZmMxXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSkge1xyXG4gXHRcdFx0XHRpZihjYW5EZWZpbmVQcm9wZXJ0eSkge1xyXG4gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgKGZ1bmN0aW9uKG5hbWUpIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9KG5hbWUpKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Zm5bbmFtZV0gPSBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBlbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQsIGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwobnVsbCwgZm4pO1xyXG4gXHRcdFx0XHR9IGZpbmFsbHkge1xyXG4gXHRcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFx0aWYoY2FuRGVmaW5lUHJvcGVydHkpIHtcclxuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgXCJlXCIsIHtcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0dmFsdWU6IGVuc3VyZVxyXG4gXHRcdFx0fSk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGZuLmUgPSBlbnN1cmU7XHJcbiBcdFx0fVxyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjaztcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm51bWJlclwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGlibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90Q2FsbGJhY2s7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSwgY2FsbGJhY2spIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRpZih0eXBlb2YgYXBwbHkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGZhbHNlO1xyXG4gXHRcdFx0Y2FsbGJhY2sgPSBhcHBseTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0aWYoZXJyKSB0aHJvdyBlcnI7XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRob3REb3dubG9hZE1hbmlmZXN0KGZ1bmN0aW9uKGVyciwgdXBkYXRlKSB7XHJcbiBcdFx0XHRpZihlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRjYWxsYmFjayhudWxsLCBudWxsKTtcclxuIFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGlibGVGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdXBkYXRlLmMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdGhvdEF2YWlsaWJsZUZpbGVzTWFwW3VwZGF0ZS5jW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsaWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxpYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGNhbGxiYWNrID0gaG90Q2FsbGJhY2s7XHJcbiBcdFx0aG90Q2FsbGJhY2sgPSBudWxsO1xyXG4gXHRcdGlmKCFjYWxsYmFjaykgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUsIGNhbGxiYWNrKTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRjYWxsYmFjayhudWxsLCBvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucywgY2FsbGJhY2spIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdGlmKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdGNhbGxiYWNrID0gb3B0aW9ucztcclxuIFx0XHRcdG9wdGlvbnMgPSB7fTtcclxuIFx0XHR9IGVsc2UgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJvYmplY3RcIikge1xyXG4gXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0aWYoZXJyKSB0aHJvdyBlcnI7XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRvcHRpb25zID0ge307XHJcbiBcdFx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRpZihlcnIpIHRocm93IGVycjtcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZSkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFttb2R1bGVdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlSWQgPT09IDApIHtcclxuIFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIG1vZHVsZUlkICsgXCIgaW4gXCIgKyBwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiBbb3V0ZGF0ZWRNb2R1bGVzLCBvdXRkYXRlZERlcGVuZGVuY2llc107XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZighcmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhyZXN1bHQpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHRbMF0pO1xyXG4gXHRcdFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIHJlc3VsdFsxXSkge1xyXG4gXHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHRbMV0sIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdFsxXVttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgbW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdHZhciBpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgY2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgY2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHR2YXIgbW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSBpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0Y2FsbGJhY2sobnVsbCwgb3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogaG90Q3VycmVudFBhcmVudHMsXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0L1wiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk4MjJjNTRiMjNjNTYwZGY1ZmMxIiwiLyplc2xpbnQtZW52IGJyb3dzZXIqL1xuLypnbG9iYWwgX19yZXNvdXJjZVF1ZXJ5IF9fd2VicGFja19wdWJsaWNfcGF0aF9fKi9cblxudmFyIG9wdGlvbnMgPSB7XG4gIHBhdGg6IFwiL19fd2VicGFja19obXJcIixcbiAgdGltZW91dDogMjAgKiAxMDAwLFxuICBvdmVybGF5OiB0cnVlLFxuICByZWxvYWQ6IGZhbHNlLFxuICBsb2c6IHRydWUsXG4gIHdhcm46IHRydWUsXG4gIG5hbWU6ICcnXG59O1xuaWYgKF9fcmVzb3VyY2VRdWVyeSkge1xuICB2YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuICB2YXIgb3ZlcnJpZGVzID0gcXVlcnlzdHJpbmcucGFyc2UoX19yZXNvdXJjZVF1ZXJ5LnNsaWNlKDEpKTtcbiAgaWYgKG92ZXJyaWRlcy5wYXRoKSBvcHRpb25zLnBhdGggPSBvdmVycmlkZXMucGF0aDtcbiAgaWYgKG92ZXJyaWRlcy50aW1lb3V0KSBvcHRpb25zLnRpbWVvdXQgPSBvdmVycmlkZXMudGltZW91dDtcbiAgaWYgKG92ZXJyaWRlcy5vdmVybGF5KSBvcHRpb25zLm92ZXJsYXkgPSBvdmVycmlkZXMub3ZlcmxheSAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5yZWxvYWQpIG9wdGlvbnMucmVsb2FkID0gb3ZlcnJpZGVzLnJlbG9hZCAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5ub0luZm8gJiYgb3ZlcnJpZGVzLm5vSW5mbyAhPT0gJ2ZhbHNlJykge1xuICAgIG9wdGlvbnMubG9nID0gZmFsc2U7XG4gIH1cbiAgaWYgKG92ZXJyaWRlcy5uYW1lKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gb3ZlcnJpZGVzLm5hbWU7XG4gIH1cbiAgaWYgKG92ZXJyaWRlcy5xdWlldCAmJiBvdmVycmlkZXMucXVpZXQgIT09ICdmYWxzZScpIHtcbiAgICBvcHRpb25zLmxvZyA9IGZhbHNlO1xuICAgIG9wdGlvbnMud2FybiA9IGZhbHNlO1xuICB9XG4gIGlmIChvdmVycmlkZXMuZHluYW1pY1B1YmxpY1BhdGgpIHtcbiAgICBvcHRpb25zLnBhdGggPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIG9wdGlvbnMucGF0aDtcbiAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gZG8gbm90aGluZ1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93LkV2ZW50U291cmNlID09PSAndW5kZWZpbmVkJykge1xuICBjb25zb2xlLndhcm4oXG4gICAgXCJ3ZWJwYWNrLWhvdC1taWRkbGV3YXJlJ3MgY2xpZW50IHJlcXVpcmVzIEV2ZW50U291cmNlIHRvIHdvcmsuIFwiICtcbiAgICBcIllvdSBzaG91bGQgaW5jbHVkZSBhIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHN1cHBvcnQgdGhpcyBicm93c2VyOiBcIiArXG4gICAgXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmVyLXNlbnRfZXZlbnRzI1Rvb2xzXCJcbiAgKTtcbn0gZWxzZSB7XG4gIGNvbm5lY3QoKTtcbn1cblxuZnVuY3Rpb24gRXZlbnRTb3VyY2VXcmFwcGVyKCkge1xuICB2YXIgc291cmNlO1xuICB2YXIgbGFzdEFjdGl2aXR5ID0gbmV3IERhdGUoKTtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuXG4gIGluaXQoKTtcbiAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgaWYgKChuZXcgRGF0ZSgpIC0gbGFzdEFjdGl2aXR5KSA+IG9wdGlvbnMudGltZW91dCkge1xuICAgICAgaGFuZGxlRGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfSwgb3B0aW9ucy50aW1lb3V0IC8gMik7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzb3VyY2UgPSBuZXcgd2luZG93LkV2ZW50U291cmNlKG9wdGlvbnMucGF0aCk7XG4gICAgc291cmNlLm9ub3BlbiA9IGhhbmRsZU9ubGluZTtcbiAgICBzb3VyY2Uub25lcnJvciA9IGhhbmRsZURpc2Nvbm5lY3Q7XG4gICAgc291cmNlLm9ubWVzc2FnZSA9IGhhbmRsZU1lc3NhZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPbmxpbmUoKSB7XG4gICAgaWYgKG9wdGlvbnMubG9nKSBjb25zb2xlLmxvZyhcIltITVJdIGNvbm5lY3RlZFwiKTtcbiAgICBsYXN0QWN0aXZpdHkgPSBuZXcgRGF0ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgIGxhc3RBY3Rpdml0eSA9IG5ldyBEYXRlKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXShldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRGlzY29ubmVjdCgpIHtcbiAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICBzb3VyY2UuY2xvc2UoKTtcbiAgICBzZXRUaW1lb3V0KGluaXQsIG9wdGlvbnMudGltZW91dCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZE1lc3NhZ2VMaXN0ZW5lcjogZnVuY3Rpb24oZm4pIHtcbiAgICAgIGxpc3RlbmVycy5wdXNoKGZuKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEV2ZW50U291cmNlV3JhcHBlcigpIHtcbiAgaWYgKCF3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXIpIHtcbiAgICB3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXIgPSB7fTtcbiAgfVxuICBpZiAoIXdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdKSB7XG4gICAgLy8gY2FjaGUgdGhlIHdyYXBwZXIgZm9yIG90aGVyIGVudHJpZXMgbG9hZGVkIG9uXG4gICAgLy8gdGhlIHNhbWUgcGFnZSB3aXRoIHRoZSBzYW1lIG9wdGlvbnMucGF0aFxuICAgIHdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdID0gRXZlbnRTb3VyY2VXcmFwcGVyKCk7XG4gIH1cbiAgcmV0dXJuIHdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdO1xufVxuXG5mdW5jdGlvbiBjb25uZWN0KCkge1xuICBnZXRFdmVudFNvdXJjZVdyYXBwZXIoKS5hZGRNZXNzYWdlTGlzdGVuZXIoaGFuZGxlTWVzc2FnZSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgIGlmIChldmVudC5kYXRhID09IFwiXFx1RDgzRFxcdURDOTNcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcHJvY2Vzc01lc3NhZ2UoSlNPTi5wYXJzZShldmVudC5kYXRhKSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBITVIgbWVzc2FnZTogXCIgKyBldmVudC5kYXRhICsgXCJcXG5cIiArIGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gdGhlIHJlcG9ydGVyIG5lZWRzIHRvIGJlIGEgc2luZ2xldG9uIG9uIHRoZSBwYWdlXG4vLyBpbiBjYXNlIHRoZSBjbGllbnQgaXMgYmVpbmcgdXNlZCBieSBtdWx0aXBsZSBidW5kbGVzXG4vLyB3ZSBvbmx5IHdhbnQgdG8gcmVwb3J0IG9uY2UuXG4vLyBhbGwgdGhlIGVycm9ycyB3aWxsIGdvIHRvIGFsbCBjbGllbnRzXG52YXIgc2luZ2xldG9uS2V5ID0gJ19fd2VicGFja19ob3RfbWlkZGxld2FyZV9yZXBvcnRlcl9fJztcbnZhciByZXBvcnRlcjtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBpZiAoIXdpbmRvd1tzaW5nbGV0b25LZXldKSB7XG4gICAgd2luZG93W3NpbmdsZXRvbktleV0gPSBjcmVhdGVSZXBvcnRlcigpO1xuICB9XG4gIHJlcG9ydGVyID0gd2luZG93W3NpbmdsZXRvbktleV07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlcG9ydGVyKCkge1xuICB2YXIgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG5cbiAgdmFyIG92ZXJsYXk7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMub3ZlcmxheSkge1xuICAgIG92ZXJsYXkgPSByZXF1aXJlKCcuL2NsaWVudC1vdmVybGF5Jyk7XG4gIH1cblxuICB2YXIgc3R5bGVzID0ge1xuICAgIGVycm9yczogXCJjb2xvcjogI2ZmMDAwMDtcIixcbiAgICB3YXJuaW5nczogXCJjb2xvcjogIzVjM2IwMDtcIlxuICB9O1xuICB2YXIgcHJldmlvdXNQcm9ibGVtcyA9IG51bGw7XG4gIGZ1bmN0aW9uIGxvZyh0eXBlLCBvYmopIHtcbiAgICB2YXIgbmV3UHJvYmxlbXMgPSBvYmpbdHlwZV0ubWFwKGZ1bmN0aW9uKG1zZykgeyByZXR1cm4gc3RyaXAobXNnKTsgfSkuam9pbignXFxuJyk7XG4gICAgaWYgKHByZXZpb3VzUHJvYmxlbXMgPT0gbmV3UHJvYmxlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNQcm9ibGVtcyA9IG5ld1Byb2JsZW1zO1xuICAgIH1cblxuICAgIHZhciBzdHlsZSA9IHN0eWxlc1t0eXBlXTtcbiAgICB2YXIgbmFtZSA9IG9iai5uYW1lID8gXCInXCIgKyBvYmoubmFtZSArIFwiJyBcIiA6IFwiXCI7XG4gICAgdmFyIHRpdGxlID0gXCJbSE1SXSBidW5kbGUgXCIgKyBuYW1lICsgXCJoYXMgXCIgKyBvYmpbdHlwZV0ubGVuZ3RoICsgXCIgXCIgKyB0eXBlO1xuICAgIC8vIE5PVEU6IGNvbnNvbGUud2FybiBvciBjb25zb2xlLmVycm9yIHdpbGwgcHJpbnQgdGhlIHN0YWNrIHRyYWNlXG4gICAgLy8gd2hpY2ggaXNuJ3QgaGVscGZ1bCBoZXJlLCBzbyB1c2luZyBjb25zb2xlLmxvZyB0byBlc2NhcGUgaXQuXG4gICAgaWYgKGNvbnNvbGUuZ3JvdXAgJiYgY29uc29sZS5ncm91cEVuZCkge1xuICAgICAgY29uc29sZS5ncm91cChcIiVjXCIgKyB0aXRsZSwgc3R5bGUpO1xuICAgICAgY29uc29sZS5sb2coXCIlY1wiICsgbmV3UHJvYmxlbXMsIHN0eWxlKTtcbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiJWNcIiArIHRpdGxlICsgXCJcXG5cXHQlY1wiICsgbmV3UHJvYmxlbXMucmVwbGFjZSgvXFxuL2csIFwiXFxuXFx0XCIpLFxuICAgICAgICBzdHlsZSArIFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCIsXG4gICAgICAgIHN0eWxlICsgXCJmb250LXdlaWdodDogbm9ybWFsO1wiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xlYW5Qcm9ibGVtc0NhY2hlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2aW91c1Byb2JsZW1zID0gbnVsbDtcbiAgICB9LFxuICAgIHByb2JsZW1zOiBmdW5jdGlvbih0eXBlLCBvYmopIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgbG9nKHR5cGUsIG9iaik7XG4gICAgICB9XG4gICAgICBpZiAob3ZlcmxheSAmJiB0eXBlICE9PSAnd2FybmluZ3MnKSBvdmVybGF5LnNob3dQcm9ibGVtcyh0eXBlLCBvYmpbdHlwZV0pO1xuICAgIH0sXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5jbGVhcigpO1xuICAgIH0sXG4gICAgdXNlQ3VzdG9tT3ZlcmxheTogZnVuY3Rpb24oY3VzdG9tT3ZlcmxheSkge1xuICAgICAgb3ZlcmxheSA9IGN1c3RvbU92ZXJsYXk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgcHJvY2Vzc1VwZGF0ZSA9IHJlcXVpcmUoJy4vcHJvY2Vzcy11cGRhdGUnKTtcblxudmFyIGN1c3RvbUhhbmRsZXI7XG52YXIgc3Vic2NyaWJlQWxsSGFuZGxlcjtcbmZ1bmN0aW9uIHByb2Nlc3NNZXNzYWdlKG9iaikge1xuICBzd2l0Y2gob2JqLmFjdGlvbikge1xuICAgIGNhc2UgXCJidWlsZGluZ1wiOlxuICAgICAgaWYgKG9wdGlvbnMubG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiW0hNUl0gYnVuZGxlIFwiICsgKG9iai5uYW1lID8gXCInXCIgKyBvYmoubmFtZSArIFwiJyBcIiA6IFwiXCIpICtcbiAgICAgICAgICBcInJlYnVpbGRpbmdcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJ1aWx0XCI6XG4gICAgICBpZiAob3B0aW9ucy5sb2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJbSE1SXSBidW5kbGUgXCIgKyAob2JqLm5hbWUgPyBcIidcIiArIG9iai5uYW1lICsgXCInIFwiIDogXCJcIikgK1xuICAgICAgICAgIFwicmVidWlsdCBpbiBcIiArIG9iai50aW1lICsgXCJtc1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICBjYXNlIFwic3luY1wiOlxuICAgICAgaWYgKG9iai5uYW1lICYmIG9wdGlvbnMubmFtZSAmJiBvYmoubmFtZSAhPT0gb3B0aW9ucy5uYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHJlcG9ydGVyKSByZXBvcnRlci5wcm9ibGVtcygnZXJyb3JzJywgb2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXBvcnRlcikge1xuICAgICAgICAgIGlmIChvYmoud2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVwb3J0ZXIucHJvYmxlbXMoJ3dhcm5pbmdzJywgb2JqKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVwb3J0ZXIuY2xlYW5Qcm9ibGVtc0NhY2hlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcG9ydGVyLnN1Y2Nlc3MoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzVXBkYXRlKG9iai5oYXNoLCBvYmoubW9kdWxlcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKGN1c3RvbUhhbmRsZXIpIHtcbiAgICAgICAgY3VzdG9tSGFuZGxlcihvYmopO1xuICAgICAgfVxuICB9XG5cbiAgaWYgKHN1YnNjcmliZUFsbEhhbmRsZXIpIHtcbiAgICBzdWJzY3JpYmVBbGxIYW5kbGVyKG9iaik7XG4gIH1cbn1cblxuaWYgKG1vZHVsZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdWJzY3JpYmVBbGw6IGZ1bmN0aW9uIHN1YnNjcmliZUFsbChoYW5kbGVyKSB7XG4gICAgICBzdWJzY3JpYmVBbGxIYW5kbGVyID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gc3Vic2NyaWJlKGhhbmRsZXIpIHtcbiAgICAgIGN1c3RvbUhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgdXNlQ3VzdG9tT3ZlcmxheTogZnVuY3Rpb24gdXNlQ3VzdG9tT3ZlcmxheShjdXN0b21PdmVybGF5KSB7XG4gICAgICBpZiAocmVwb3J0ZXIpIHJlcG9ydGVyLnVzZUN1c3RvbU92ZXJsYXkoY3VzdG9tT3ZlcmxheSk7XG4gICAgfVxuICB9O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC5qcz9wYXRoPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzODY0NSUyRl9fd2VicGFja19obXJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoMjM2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL21vZHVsZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmcvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3F1ZXJ5c3RyaW5nL2RlY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG9ialtrXS5tYXAoZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgYW5zaVJlZ2V4ID0gcmVxdWlyZSgnYW5zaS1yZWdleCcpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBzdHIucmVwbGFjZShhbnNpUmVnZXgsICcnKSA6IHN0cjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3RyaXAtYW5zaS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIC9bXFx1MDAxYlxcdTAwOWJdW1soKSM7P10qKD86WzAtOV17MSw0fSg/OjtbMC05XXswLDR9KSopP1swLTlBLVBSWmNmLW5xcnk9PjxdL2c7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyplc2xpbnQtZW52IGJyb3dzZXIqL1xuXG52YXIgY2xpZW50T3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY2xpZW50T3ZlcmxheS5pZCA9ICd3ZWJwYWNrLWhvdC1taWRkbGV3YXJlLWNsaWVudE92ZXJsYXknO1xudmFyIHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsMC44NSknLFxuICBjb2xvcjogJyNFOEU4RTgnLFxuICBsaW5lSGVpZ2h0OiAnMS4yJyxcbiAgd2hpdGVTcGFjZTogJ3ByZScsXG4gIGZvbnRGYW1pbHk6ICdNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gIGZvbnRTaXplOiAnMTNweCcsXG4gIHBvc2l0aW9uOiAnZml4ZWQnLFxuICB6SW5kZXg6IDk5OTksXG4gIHBhZGRpbmc6ICcxMHB4JyxcbiAgbGVmdDogMCxcbiAgcmlnaHQ6IDAsXG4gIHRvcDogMCxcbiAgYm90dG9tOiAwLFxuICBvdmVyZmxvdzogJ2F1dG8nLFxuICBkaXI6ICdsdHInLFxuICB0ZXh0QWxpZ246ICdsZWZ0J1xufTtcbmZvciAodmFyIGtleSBpbiBzdHlsZXMpIHtcbiAgY2xpZW50T3ZlcmxheS5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG59XG5cbnZhciBhbnNpSFRNTCA9IHJlcXVpcmUoJ2Fuc2ktaHRtbCcpO1xudmFyIGNvbG9ycyA9IHtcbiAgcmVzZXQ6IFsndHJhbnNwYXJlbnQnLCAndHJhbnNwYXJlbnQnXSxcbiAgYmxhY2s6ICcxODE4MTgnLFxuICByZWQ6ICdFMzYwNDknLFxuICBncmVlbjogJ0IzQ0I3NCcsXG4gIHllbGxvdzogJ0ZGRDA4MCcsXG4gIGJsdWU6ICc3Q0FGQzInLFxuICBtYWdlbnRhOiAnN0ZBQ0NBJyxcbiAgY3lhbjogJ0MzQzJFRicsXG4gIGxpZ2h0Z3JleTogJ0VCRTdFMycsXG4gIGRhcmtncmV5OiAnNkQ3ODkxJ1xufTtcbmFuc2lIVE1MLnNldENvbG9ycyhjb2xvcnMpO1xuXG52YXIgRW50aXRpZXMgPSByZXF1aXJlKCdodG1sLWVudGl0aWVzJykuQWxsSHRtbEVudGl0aWVzO1xudmFyIGVudGl0aWVzID0gbmV3IEVudGl0aWVzKCk7XG5cbmV4cG9ydHMuc2hvd1Byb2JsZW1zID1cbmZ1bmN0aW9uIHNob3dQcm9ibGVtcyh0eXBlLCBsaW5lcykge1xuICBjbGllbnRPdmVybGF5LmlubmVySFRNTCA9ICcnO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgIG1zZyA9IGFuc2lIVE1MKGVudGl0aWVzLmVuY29kZShtc2cpKTtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyNnB4JztcbiAgICBkaXYuaW5uZXJIVE1MID0gcHJvYmxlbVR5cGUodHlwZSkgKyAnIGluICcgKyBtc2c7XG4gICAgY2xpZW50T3ZlcmxheS5hcHBlbmRDaGlsZChkaXYpO1xuICB9KTtcbiAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsaWVudE92ZXJsYXkpO1xuICB9XG59O1xuXG5leHBvcnRzLmNsZWFyID1cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBpZiAoZG9jdW1lbnQuYm9keSAmJiBjbGllbnRPdmVybGF5LnBhcmVudE5vZGUpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGNsaWVudE92ZXJsYXkpO1xuICB9XG59O1xuXG52YXIgcHJvYmxlbUNvbG9ycyA9IHtcbiAgZXJyb3JzOiBjb2xvcnMucmVkLFxuICB3YXJuaW5nczogY29sb3JzLnllbGxvd1xufTtcblxuZnVuY3Rpb24gcHJvYmxlbVR5cGUgKHR5cGUpIHtcbiAgdmFyIGNvbG9yID0gcHJvYmxlbUNvbG9yc1t0eXBlXSB8fCBjb2xvcnMucmVkO1xuICByZXR1cm4gKFxuICAgICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IycgKyBjb2xvciArICc7IGNvbG9yOiNmZmY7IHBhZGRpbmc6MnB4IDRweDsgYm9yZGVyLXJhZGl1czogMnB4XCI+JyArXG4gICAgICB0eXBlLnNsaWNlKDAsIC0xKS50b1VwcGVyQ2FzZSgpICtcbiAgICAnPC9zcGFuPidcbiAgKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQtb3ZlcmxheS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBhbnNpSFRNTFxuXG4vLyBSZWZlcmVuY2UgdG8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hbnNpLXJlZ2V4XG52YXIgX3JlZ0FOU0kgPSAvKD86KD86XFx1MDAxYlxcWyl8XFx1MDA5YikoPzooPzpbMC05XXsxLDN9KT8oPzooPzo7WzAtOV17MCwzfSkqKT9bQS1NfGYtbV0pfFxcdTAwMWJbQS1NXS9cblxudmFyIF9kZWZDb2xvcnMgPSB7XG4gIHJlc2V0OiBbJ2ZmZicsICcwMDAnXSwgLy8gW0ZPUkVHUk9VRF9DT0xPUiwgQkFDS0dST1VORF9DT0xPUl1cbiAgYmxhY2s6ICcwMDAnLFxuICByZWQ6ICdmZjAwMDAnLFxuICBncmVlbjogJzIwOTgwNScsXG4gIHllbGxvdzogJ2U4YmYwMycsXG4gIGJsdWU6ICcwMDAwZmYnLFxuICBtYWdlbnRhOiAnZmYwMGZmJyxcbiAgY3lhbjogJzAwZmZlZScsXG4gIGxpZ2h0Z3JleTogJ2YwZjBmMCcsXG4gIGRhcmtncmV5OiAnODg4J1xufVxudmFyIF9zdHlsZXMgPSB7XG4gIDMwOiAnYmxhY2snLFxuICAzMTogJ3JlZCcsXG4gIDMyOiAnZ3JlZW4nLFxuICAzMzogJ3llbGxvdycsXG4gIDM0OiAnYmx1ZScsXG4gIDM1OiAnbWFnZW50YScsXG4gIDM2OiAnY3lhbicsXG4gIDM3OiAnbGlnaHRncmV5J1xufVxudmFyIF9vcGVuVGFncyA9IHtcbiAgJzEnOiAnZm9udC13ZWlnaHQ6Ym9sZCcsIC8vIGJvbGRcbiAgJzInOiAnb3BhY2l0eTowLjUnLCAvLyBkaW1cbiAgJzMnOiAnPGk+JywgLy8gaXRhbGljXG4gICc0JzogJzx1PicsIC8vIHVuZGVyc2NvcmVcbiAgJzgnOiAnZGlzcGxheTpub25lJywgLy8gaGlkZGVuXG4gICc5JzogJzxkZWw+JyAvLyBkZWxldGVcbn1cbnZhciBfY2xvc2VUYWdzID0ge1xuICAnMjMnOiAnPC9pPicsIC8vIHJlc2V0IGl0YWxpY1xuICAnMjQnOiAnPC91PicsIC8vIHJlc2V0IHVuZGVyc2NvcmVcbiAgJzI5JzogJzwvZGVsPicgLy8gcmVzZXQgZGVsZXRlXG59XG5cbjtbMCwgMjEsIDIyLCAyNywgMjgsIDM5LCA0OV0uZm9yRWFjaChmdW5jdGlvbiAobikge1xuICBfY2xvc2VUYWdzW25dID0gJzwvc3Bhbj4nXG59KVxuXG4vKipcbiAqIENvbnZlcnRzIHRleHQgd2l0aCBBTlNJIGNvbG9yIGNvZGVzIHRvIEhUTUwgbWFya3VwLlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBhbnNpSFRNTCAodGV4dCkge1xuICAvLyBSZXR1cm5zIHRoZSB0ZXh0IGlmIHRoZSBzdHJpbmcgaGFzIG5vIEFOU0kgZXNjYXBlIGNvZGUuXG4gIGlmICghX3JlZ0FOU0kudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cblxuICAvLyBDYWNoZSBvcGVuZWQgc2VxdWVuY2UuXG4gIHZhciBhbnNpQ29kZXMgPSBbXVxuICAvLyBSZXBsYWNlIHdpdGggbWFya3VwLlxuICB2YXIgcmV0ID0gdGV4dC5yZXBsYWNlKC9cXDAzM1xcWyhcXGQrKSptL2csIGZ1bmN0aW9uIChtYXRjaCwgc2VxKSB7XG4gICAgdmFyIG90ID0gX29wZW5UYWdzW3NlcV1cbiAgICBpZiAob3QpIHtcbiAgICAgIC8vIElmIGN1cnJlbnQgc2VxdWVuY2UgaGFzIGJlZW4gb3BlbmVkLCBjbG9zZSBpdC5cbiAgICAgIGlmICghIX5hbnNpQ29kZXMuaW5kZXhPZihzZXEpKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XG4gICAgICAgIGFuc2lDb2Rlcy5wb3AoKVxuICAgICAgICByZXR1cm4gJzwvc3Bhbj4nXG4gICAgICB9XG4gICAgICAvLyBPcGVuIHRhZy5cbiAgICAgIGFuc2lDb2Rlcy5wdXNoKHNlcSlcbiAgICAgIHJldHVybiBvdFswXSA9PT0gJzwnID8gb3QgOiAnPHNwYW4gc3R5bGU9XCInICsgb3QgKyAnO1wiPidcbiAgICB9XG5cbiAgICB2YXIgY3QgPSBfY2xvc2VUYWdzW3NlcV1cbiAgICBpZiAoY3QpIHtcbiAgICAgIC8vIFBvcCBzZXF1ZW5jZVxuICAgICAgYW5zaUNvZGVzLnBvcCgpXG4gICAgICByZXR1cm4gY3RcbiAgICB9XG4gICAgcmV0dXJuICcnXG4gIH0pXG5cbiAgLy8gTWFrZSBzdXJlIHRhZ3MgYXJlIGNsb3NlZC5cbiAgdmFyIGwgPSBhbnNpQ29kZXMubGVuZ3RoXG4gIDsobCA+IDApICYmIChyZXQgKz0gQXJyYXkobCArIDEpLmpvaW4oJzwvc3Bhbj4nKSlcblxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogQ3VzdG9taXplIGNvbG9ycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2xvcnMgcmVmZXJlbmNlIHRvIF9kZWZDb2xvcnNcbiAqL1xuYW5zaUhUTUwuc2V0Q29sb3JzID0gZnVuY3Rpb24gKGNvbG9ycykge1xuICBpZiAodHlwZW9mIGNvbG9ycyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bjb2xvcnNgIHBhcmFtZXRlciBtdXN0IGJlIGFuIE9iamVjdC4nKVxuICB9XG5cbiAgdmFyIF9maW5hbENvbG9ycyA9IHt9XG4gIGZvciAodmFyIGtleSBpbiBfZGVmQ29sb3JzKSB7XG4gICAgdmFyIGhleCA9IGNvbG9ycy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gY29sb3JzW2tleV0gOiBudWxsXG4gICAgaWYgKCFoZXgpIHtcbiAgICAgIF9maW5hbENvbG9yc1trZXldID0gX2RlZkNvbG9yc1trZXldXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBpZiAoJ3Jlc2V0JyA9PT0ga2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGhleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaGV4ID0gW2hleF1cbiAgICAgIH1cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShoZXgpIHx8IGhleC5sZW5ndGggPT09IDAgfHwgaGV4LnNvbWUoZnVuY3Rpb24gKGgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBoICE9PSAnc3RyaW5nJ1xuICAgICAgfSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdmFsdWUgb2YgYCcgKyBrZXkgKyAnYCBwcm9wZXJ0eSBtdXN0IGJlIGFuIEFycmF5IGFuZCBlYWNoIGl0ZW0gY291bGQgb25seSBiZSBhIGhleCBzdHJpbmcsIGUuZy46IEZGMDAwMCcpXG4gICAgICB9XG4gICAgICB2YXIgZGVmSGV4Q29sb3IgPSBfZGVmQ29sb3JzW2tleV1cbiAgICAgIGlmICghaGV4WzBdKSB7XG4gICAgICAgIGhleFswXSA9IGRlZkhleENvbG9yWzBdXG4gICAgICB9XG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gMSB8fCAhaGV4WzFdKSB7XG4gICAgICAgIGhleCA9IFtoZXhbMF1dXG4gICAgICAgIGhleC5wdXNoKGRlZkhleENvbG9yWzFdKVxuICAgICAgfVxuXG4gICAgICBoZXggPSBoZXguc2xpY2UoMCwgMilcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBoZXggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB2YWx1ZSBvZiBgJyArIGtleSArICdgIHByb3BlcnR5IG11c3QgYmUgYSBoZXggc3RyaW5nLCBlLmcuOiBGRjAwMDAnKVxuICAgIH1cbiAgICBfZmluYWxDb2xvcnNba2V5XSA9IGhleFxuICB9XG4gIF9zZXRUYWdzKF9maW5hbENvbG9ycylcbn1cblxuLyoqXG4gKiBSZXNldCBjb2xvcnMuXG4gKi9cbmFuc2lIVE1MLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICBfc2V0VGFncyhfZGVmQ29sb3JzKVxufVxuXG4vKipcbiAqIEV4cG9zZSB0YWdzLCBpbmNsdWRpbmcgb3BlbiBhbmQgY2xvc2UuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5hbnNpSFRNTC50YWdzID0ge31cblxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYW5zaUhUTUwudGFncywgJ29wZW4nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfb3BlblRhZ3MgfVxuICB9KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYW5zaUhUTUwudGFncywgJ2Nsb3NlJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX2Nsb3NlVGFncyB9XG4gIH0pXG59IGVsc2Uge1xuICBhbnNpSFRNTC50YWdzLm9wZW4gPSBfb3BlblRhZ3NcbiAgYW5zaUhUTUwudGFncy5jbG9zZSA9IF9jbG9zZVRhZ3Ncbn1cblxuZnVuY3Rpb24gX3NldFRhZ3MgKGNvbG9ycykge1xuICAvLyByZXNldCBhbGxcbiAgX29wZW5UYWdzWycwJ10gPSAnZm9udC13ZWlnaHQ6bm9ybWFsO29wYWNpdHk6MTtjb2xvcjojJyArIGNvbG9ycy5yZXNldFswXSArICc7YmFja2dyb3VuZDojJyArIGNvbG9ycy5yZXNldFsxXVxuICAvLyBpbnZlcnNlXG4gIF9vcGVuVGFnc1snNyddID0gJ2NvbG9yOiMnICsgY29sb3JzLnJlc2V0WzFdICsgJztiYWNrZ3JvdW5kOiMnICsgY29sb3JzLnJlc2V0WzBdXG4gIC8vIGRhcmsgZ3JleVxuICBfb3BlblRhZ3NbJzkwJ10gPSAnY29sb3I6IycgKyBjb2xvcnMuZGFya2dyZXlcblxuICBmb3IgKHZhciBjb2RlIGluIF9zdHlsZXMpIHtcbiAgICB2YXIgY29sb3IgPSBfc3R5bGVzW2NvZGVdXG4gICAgdmFyIG9yaUNvbG9yID0gY29sb3JzW2NvbG9yXSB8fCAnMDAwJ1xuICAgIF9vcGVuVGFnc1tjb2RlXSA9ICdjb2xvcjojJyArIG9yaUNvbG9yXG4gICAgY29kZSA9IHBhcnNlSW50KGNvZGUpXG4gICAgX29wZW5UYWdzWyhjb2RlICsgMTApLnRvU3RyaW5nKCldID0gJ2JhY2tncm91bmQ6IycgKyBvcmlDb2xvclxuICB9XG59XG5cbmFuc2lIVE1MLnJlc2V0KClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnNpLWh0bWwvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBYbWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIveG1sLWVudGl0aWVzLmpzJyksXG4gIEh0bWw0RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw0LWVudGl0aWVzLmpzJyksXG4gIEh0bWw1RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw1LWVudGl0aWVzLmpzJyksXG4gIEFsbEh0bWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIvaHRtbDUtZW50aXRpZXMuanMnKVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgQUxQSEFfSU5ERVggPSB7XG4gICAgJyZsdCc6ICc8JyxcbiAgICAnJmd0JzogJz4nLFxuICAgICcmcXVvdCc6ICdcIicsXG4gICAgJyZhcG9zJzogJ1xcJycsXG4gICAgJyZhbXAnOiAnJicsXG4gICAgJyZsdDsnOiAnPCcsXG4gICAgJyZndDsnOiAnPicsXG4gICAgJyZxdW90Oyc6ICdcIicsXG4gICAgJyZhcG9zOyc6ICdcXCcnLFxuICAgICcmYW1wOyc6ICcmJ1xufTtcblxudmFyIENIQVJfSU5ERVggPSB7XG4gICAgNjA6ICdsdCcsXG4gICAgNjI6ICdndCcsXG4gICAgMzQ6ICdxdW90JyxcbiAgICAzOTogJ2Fwb3MnLFxuICAgIDM4OiAnYW1wJ1xufTtcblxudmFyIENIQVJfU19JTkRFWCA9IHtcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAnXFwnJzogJyZhcG9zOycsXG4gICAgJyYnOiAnJmFtcDsnXG59O1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBYbWxFbnRpdGllcygpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuWG1sRW50aXRpZXMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC88fD58XCJ8J3wmL2csIGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIENIQVJfU19JTkRFWFtzXTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIFhtbEVudGl0aWVzLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgWG1sRW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblhtbEVudGl0aWVzLnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiM/WzAtOWEtekEtWl0rOz8vZywgZnVuY3Rpb24ocykge1xuICAgICAgICBpZiAocy5jaGFyQXQoMSkgPT09ICcjJykge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSBzLmNoYXJBdCgyKS50b0xvd2VyQ2FzZSgpID09PSAneCcgP1xuICAgICAgICAgICAgICAgIHBhcnNlSW50KHMuc3Vic3RyKDMpLCAxNikgOlxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHMuc3Vic3RyKDIpKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOKGNvZGUpIHx8IGNvZGUgPCAtMzI3NjggfHwgY29kZSA+IDY1NTM1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFMUEhBX0lOREVYW3NdIHx8IHM7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBYbWxFbnRpdGllcy5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IFhtbEVudGl0aWVzKCkuZGVjb2RlKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5YbWxFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgaWYgKHN0ckxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgdmFyIGFscGhhID0gQ0hBUl9JTkRFWFtjXTtcbiAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMgPCAzMiB8fCBjID4gMTI2KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBYbWxFbnRpdGllcy5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IFhtbEVudGl0aWVzKCkuZW5jb2RlTm9uVVRGKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5YbWxFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgc3RyTGVuZ2h0ID0gc3RyLmxlbmd0aDtcbiAgICBpZiAoc3RyTGVuZ2h0ID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmdodCkge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8PSAyNTUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHJbaSsrXTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSAnJiMnICsgYyArICc7JztcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gWG1sRW50aXRpZXMuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IFhtbEVudGl0aWVzKCkuZW5jb2RlTm9uQVNDSUkoc3RyKTtcbiB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhtbEVudGl0aWVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2h0bWwtZW50aXRpZXMvbGliL3htbC1lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEhUTUxfQUxQSEEgPSBbJ2Fwb3MnLCAnbmJzcCcsICdpZXhjbCcsICdjZW50JywgJ3BvdW5kJywgJ2N1cnJlbicsICd5ZW4nLCAnYnJ2YmFyJywgJ3NlY3QnLCAndW1sJywgJ2NvcHknLCAnb3JkZicsICdsYXF1bycsICdub3QnLCAnc2h5JywgJ3JlZycsICdtYWNyJywgJ2RlZycsICdwbHVzbW4nLCAnc3VwMicsICdzdXAzJywgJ2FjdXRlJywgJ21pY3JvJywgJ3BhcmEnLCAnbWlkZG90JywgJ2NlZGlsJywgJ3N1cDEnLCAnb3JkbScsICdyYXF1bycsICdmcmFjMTQnLCAnZnJhYzEyJywgJ2ZyYWMzNCcsICdpcXVlc3QnLCAnQWdyYXZlJywgJ0FhY3V0ZScsICdBY2lyYycsICdBdGlsZGUnLCAnQXVtbCcsICdBcmluZycsICdBZWxpZycsICdDY2VkaWwnLCAnRWdyYXZlJywgJ0VhY3V0ZScsICdFY2lyYycsICdFdW1sJywgJ0lncmF2ZScsICdJYWN1dGUnLCAnSWNpcmMnLCAnSXVtbCcsICdFVEgnLCAnTnRpbGRlJywgJ09ncmF2ZScsICdPYWN1dGUnLCAnT2NpcmMnLCAnT3RpbGRlJywgJ091bWwnLCAndGltZXMnLCAnT3NsYXNoJywgJ1VncmF2ZScsICdVYWN1dGUnLCAnVWNpcmMnLCAnVXVtbCcsICdZYWN1dGUnLCAnVEhPUk4nLCAnc3psaWcnLCAnYWdyYXZlJywgJ2FhY3V0ZScsICdhY2lyYycsICdhdGlsZGUnLCAnYXVtbCcsICdhcmluZycsICdhZWxpZycsICdjY2VkaWwnLCAnZWdyYXZlJywgJ2VhY3V0ZScsICdlY2lyYycsICdldW1sJywgJ2lncmF2ZScsICdpYWN1dGUnLCAnaWNpcmMnLCAnaXVtbCcsICdldGgnLCAnbnRpbGRlJywgJ29ncmF2ZScsICdvYWN1dGUnLCAnb2NpcmMnLCAnb3RpbGRlJywgJ291bWwnLCAnZGl2aWRlJywgJ09zbGFzaCcsICd1Z3JhdmUnLCAndWFjdXRlJywgJ3VjaXJjJywgJ3V1bWwnLCAneWFjdXRlJywgJ3Rob3JuJywgJ3l1bWwnLCAncXVvdCcsICdhbXAnLCAnbHQnLCAnZ3QnLCAnb2VsaWcnLCAnb2VsaWcnLCAnc2Nhcm9uJywgJ3NjYXJvbicsICd5dW1sJywgJ2NpcmMnLCAndGlsZGUnLCAnZW5zcCcsICdlbXNwJywgJ3RoaW5zcCcsICd6d25qJywgJ3p3aicsICdscm0nLCAncmxtJywgJ25kYXNoJywgJ21kYXNoJywgJ2xzcXVvJywgJ3JzcXVvJywgJ3NicXVvJywgJ2xkcXVvJywgJ3JkcXVvJywgJ2JkcXVvJywgJ2RhZ2dlcicsICdkYWdnZXInLCAncGVybWlsJywgJ2xzYXF1bycsICdyc2FxdW8nLCAnZXVybycsICdmbm9mJywgJ2FscGhhJywgJ2JldGEnLCAnZ2FtbWEnLCAnZGVsdGEnLCAnZXBzaWxvbicsICd6ZXRhJywgJ2V0YScsICd0aGV0YScsICdpb3RhJywgJ2thcHBhJywgJ2xhbWJkYScsICdtdScsICdudScsICd4aScsICdvbWljcm9uJywgJ3BpJywgJ3JobycsICdzaWdtYScsICd0YXUnLCAndXBzaWxvbicsICdwaGknLCAnY2hpJywgJ3BzaScsICdvbWVnYScsICdhbHBoYScsICdiZXRhJywgJ2dhbW1hJywgJ2RlbHRhJywgJ2Vwc2lsb24nLCAnemV0YScsICdldGEnLCAndGhldGEnLCAnaW90YScsICdrYXBwYScsICdsYW1iZGEnLCAnbXUnLCAnbnUnLCAneGknLCAnb21pY3JvbicsICdwaScsICdyaG8nLCAnc2lnbWFmJywgJ3NpZ21hJywgJ3RhdScsICd1cHNpbG9uJywgJ3BoaScsICdjaGknLCAncHNpJywgJ29tZWdhJywgJ3RoZXRhc3ltJywgJ3Vwc2loJywgJ3BpdicsICdidWxsJywgJ2hlbGxpcCcsICdwcmltZScsICdwcmltZScsICdvbGluZScsICdmcmFzbCcsICd3ZWllcnAnLCAnaW1hZ2UnLCAncmVhbCcsICd0cmFkZScsICdhbGVmc3ltJywgJ2xhcnInLCAndWFycicsICdyYXJyJywgJ2RhcnInLCAnaGFycicsICdjcmFycicsICdsYXJyJywgJ3VhcnInLCAncmFycicsICdkYXJyJywgJ2hhcnInLCAnZm9yYWxsJywgJ3BhcnQnLCAnZXhpc3QnLCAnZW1wdHknLCAnbmFibGEnLCAnaXNpbicsICdub3RpbicsICduaScsICdwcm9kJywgJ3N1bScsICdtaW51cycsICdsb3dhc3QnLCAncmFkaWMnLCAncHJvcCcsICdpbmZpbicsICdhbmcnLCAnYW5kJywgJ29yJywgJ2NhcCcsICdjdXAnLCAnaW50JywgJ3RoZXJlNCcsICdzaW0nLCAnY29uZycsICdhc3ltcCcsICduZScsICdlcXVpdicsICdsZScsICdnZScsICdzdWInLCAnc3VwJywgJ25zdWInLCAnc3ViZScsICdzdXBlJywgJ29wbHVzJywgJ290aW1lcycsICdwZXJwJywgJ3Nkb3QnLCAnbGNlaWwnLCAncmNlaWwnLCAnbGZsb29yJywgJ3JmbG9vcicsICdsYW5nJywgJ3JhbmcnLCAnbG96JywgJ3NwYWRlcycsICdjbHVicycsICdoZWFydHMnLCAnZGlhbXMnXTtcbnZhciBIVE1MX0NPREVTID0gWzM5LCAxNjAsIDE2MSwgMTYyLCAxNjMsIDE2NCwgMTY1LCAxNjYsIDE2NywgMTY4LCAxNjksIDE3MCwgMTcxLCAxNzIsIDE3MywgMTc0LCAxNzUsIDE3NiwgMTc3LCAxNzgsIDE3OSwgMTgwLCAxODEsIDE4MiwgMTgzLCAxODQsIDE4NSwgMTg2LCAxODcsIDE4OCwgMTg5LCAxOTAsIDE5MSwgMTkyLCAxOTMsIDE5NCwgMTk1LCAxOTYsIDE5NywgMTk4LCAxOTksIDIwMCwgMjAxLCAyMDIsIDIwMywgMjA0LCAyMDUsIDIwNiwgMjA3LCAyMDgsIDIwOSwgMjEwLCAyMTEsIDIxMiwgMjEzLCAyMTQsIDIxNSwgMjE2LCAyMTcsIDIxOCwgMjE5LCAyMjAsIDIyMSwgMjIyLCAyMjMsIDIyNCwgMjI1LCAyMjYsIDIyNywgMjI4LCAyMjksIDIzMCwgMjMxLCAyMzIsIDIzMywgMjM0LCAyMzUsIDIzNiwgMjM3LCAyMzgsIDIzOSwgMjQwLCAyNDEsIDI0MiwgMjQzLCAyNDQsIDI0NSwgMjQ2LCAyNDcsIDI0OCwgMjQ5LCAyNTAsIDI1MSwgMjUyLCAyNTMsIDI1NCwgMjU1LCAzNCwgMzgsIDYwLCA2MiwgMzM4LCAzMzksIDM1MiwgMzUzLCAzNzYsIDcxMCwgNzMyLCA4MTk0LCA4MTk1LCA4MjAxLCA4MjA0LCA4MjA1LCA4MjA2LCA4MjA3LCA4MjExLCA4MjEyLCA4MjE2LCA4MjE3LCA4MjE4LCA4MjIwLCA4MjIxLCA4MjIyLCA4MjI0LCA4MjI1LCA4MjQwLCA4MjQ5LCA4MjUwLCA4MzY0LCA0MDIsIDkxMywgOTE0LCA5MTUsIDkxNiwgOTE3LCA5MTgsIDkxOSwgOTIwLCA5MjEsIDkyMiwgOTIzLCA5MjQsIDkyNSwgOTI2LCA5MjcsIDkyOCwgOTI5LCA5MzEsIDkzMiwgOTMzLCA5MzQsIDkzNSwgOTM2LCA5MzcsIDk0NSwgOTQ2LCA5NDcsIDk0OCwgOTQ5LCA5NTAsIDk1MSwgOTUyLCA5NTMsIDk1NCwgOTU1LCA5NTYsIDk1NywgOTU4LCA5NTksIDk2MCwgOTYxLCA5NjIsIDk2MywgOTY0LCA5NjUsIDk2NiwgOTY3LCA5NjgsIDk2OSwgOTc3LCA5NzgsIDk4MiwgODIyNiwgODIzMCwgODI0MiwgODI0MywgODI1NCwgODI2MCwgODQ3MiwgODQ2NSwgODQ3NiwgODQ4MiwgODUwMSwgODU5MiwgODU5MywgODU5NCwgODU5NSwgODU5NiwgODYyOSwgODY1NiwgODY1NywgODY1OCwgODY1OSwgODY2MCwgODcwNCwgODcwNiwgODcwNywgODcwOSwgODcxMSwgODcxMiwgODcxMywgODcxNSwgODcxOSwgODcyMSwgODcyMiwgODcyNywgODczMCwgODczMywgODczNCwgODczNiwgODc0MywgODc0NCwgODc0NSwgODc0NiwgODc0NywgODc1NiwgODc2NCwgODc3MywgODc3NiwgODgwMCwgODgwMSwgODgwNCwgODgwNSwgODgzNCwgODgzNSwgODgzNiwgODgzOCwgODgzOSwgODg1MywgODg1NSwgODg2OSwgODkwMSwgODk2OCwgODk2OSwgODk3MCwgODk3MSwgOTAwMSwgOTAwMiwgOTY3NCwgOTgyNCwgOTgyNywgOTgyOSwgOTgzMF07XG5cbnZhciBhbHBoYUluZGV4ID0ge307XG52YXIgbnVtSW5kZXggPSB7fTtcblxudmFyIGkgPSAwO1xudmFyIGxlbmd0aCA9IEhUTUxfQUxQSEEubGVuZ3RoO1xud2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICB2YXIgYSA9IEhUTUxfQUxQSEFbaV07XG4gICAgdmFyIGMgPSBIVE1MX0NPREVTW2ldO1xuICAgIGFscGhhSW5kZXhbYV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgIG51bUluZGV4W2NdID0gYTtcbiAgICBpKys7XG59XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEh0bWw0RW50aXRpZXMoKSB7fVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mKCM/W1xcd1xcZF0rKTs/L2csIGZ1bmN0aW9uKHMsIGVudGl0eSkge1xuICAgICAgICB2YXIgY2hyO1xuICAgICAgICBpZiAoZW50aXR5LmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgIHZhciBjb2RlID0gZW50aXR5LmNoYXJBdCgxKS50b0xvd2VyQ2FzZSgpID09PSAneCcgP1xuICAgICAgICAgICAgICAgIHBhcnNlSW50KGVudGl0eS5zdWJzdHIoMiksIDE2KSA6XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZW50aXR5LnN1YnN0cigxKSk7XG5cbiAgICAgICAgICAgIGlmICghKGlzTmFOKGNvZGUpIHx8IGNvZGUgPCAtMzI3NjggfHwgY29kZSA+IDY1NTM1KSkge1xuICAgICAgICAgICAgICAgIGNociA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaHIgPSBhbHBoYUluZGV4W2VudGl0eV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNociB8fCBzO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNEVudGl0aWVzLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDRFbnRpdGllcygpLmRlY29kZShzdHIpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNEVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICBpZiAoc3RyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYWxwaGEgPSBudW1JbmRleFtzdHIuY2hhckNvZGVBdChpKV07XG4gICAgICAgIHJlc3VsdCArPSBhbHBoYSA/IFwiJlwiICsgYWxwaGEgKyBcIjtcIiA6IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgaWYgKHN0ckxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIHZhciBhbHBoYSA9IG51bUluZGV4W2NjXTtcbiAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICB9IGVsc2UgaWYgKGNjIDwgMzIgfHwgY2MgPiAxMjYpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIiYjXCIgKyBjYyArIFwiO1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNEVudGl0aWVzLmVuY29kZU5vblVURiA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDRFbnRpdGllcygpLmVuY29kZU5vblVURihzdHIpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNEVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIGlmIChzdHJMZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDw9IDI1NSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0cltpKytdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9ICcmIycgKyBjICsgJzsnO1xuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGVOb25BU0NJSShzdHIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sNEVudGl0aWVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2h0bWwtZW50aXRpZXMvbGliL2h0bWw0LWVudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgRU5USVRJRVMgPSBbWydBYWN1dGUnLCBbMTkzXV0sIFsnYWFjdXRlJywgWzIyNV1dLCBbJ0FicmV2ZScsIFsyNThdXSwgWydhYnJldmUnLCBbMjU5XV0sIFsnYWMnLCBbODc2Nl1dLCBbJ2FjZCcsIFs4NzY3XV0sIFsnYWNFJywgWzg3NjYsIDgxOV1dLCBbJ0FjaXJjJywgWzE5NF1dLCBbJ2FjaXJjJywgWzIyNl1dLCBbJ2FjdXRlJywgWzE4MF1dLCBbJ0FjeScsIFsxMDQwXV0sIFsnYWN5JywgWzEwNzJdXSwgWydBRWxpZycsIFsxOThdXSwgWydhZWxpZycsIFsyMzBdXSwgWydhZicsIFs4Mjg5XV0sIFsnQWZyJywgWzEyMDA2OF1dLCBbJ2FmcicsIFsxMjAwOTRdXSwgWydBZ3JhdmUnLCBbMTkyXV0sIFsnYWdyYXZlJywgWzIyNF1dLCBbJ2FsZWZzeW0nLCBbODUwMV1dLCBbJ2FsZXBoJywgWzg1MDFdXSwgWydBbHBoYScsIFs5MTNdXSwgWydhbHBoYScsIFs5NDVdXSwgWydBbWFjcicsIFsyNTZdXSwgWydhbWFjcicsIFsyNTddXSwgWydhbWFsZycsIFsxMDgxNV1dLCBbJ2FtcCcsIFszOF1dLCBbJ0FNUCcsIFszOF1dLCBbJ2FuZGFuZCcsIFsxMDgzN11dLCBbJ0FuZCcsIFsxMDgzNV1dLCBbJ2FuZCcsIFs4NzQzXV0sIFsnYW5kZCcsIFsxMDg0NF1dLCBbJ2FuZHNsb3BlJywgWzEwODQwXV0sIFsnYW5kdicsIFsxMDg0Ml1dLCBbJ2FuZycsIFs4NzM2XV0sIFsnYW5nZScsIFsxMDY2MF1dLCBbJ2FuZ2xlJywgWzg3MzZdXSwgWydhbmdtc2RhYScsIFsxMDY2NF1dLCBbJ2FuZ21zZGFiJywgWzEwNjY1XV0sIFsnYW5nbXNkYWMnLCBbMTA2NjZdXSwgWydhbmdtc2RhZCcsIFsxMDY2N11dLCBbJ2FuZ21zZGFlJywgWzEwNjY4XV0sIFsnYW5nbXNkYWYnLCBbMTA2NjldXSwgWydhbmdtc2RhZycsIFsxMDY3MF1dLCBbJ2FuZ21zZGFoJywgWzEwNjcxXV0sIFsnYW5nbXNkJywgWzg3MzddXSwgWydhbmdydCcsIFs4NzM1XV0sIFsnYW5ncnR2YicsIFs4ODk0XV0sIFsnYW5ncnR2YmQnLCBbMTA2NTNdXSwgWydhbmdzcGgnLCBbODczOF1dLCBbJ2FuZ3N0JywgWzE5N11dLCBbJ2FuZ3phcnInLCBbOTA4NF1dLCBbJ0FvZ29uJywgWzI2MF1dLCBbJ2FvZ29uJywgWzI2MV1dLCBbJ0FvcGYnLCBbMTIwMTIwXV0sIFsnYW9wZicsIFsxMjAxNDZdXSwgWydhcGFjaXInLCBbMTA4NjNdXSwgWydhcCcsIFs4Nzc2XV0sIFsnYXBFJywgWzEwODY0XV0sIFsnYXBlJywgWzg3NzhdXSwgWydhcGlkJywgWzg3NzldXSwgWydhcG9zJywgWzM5XV0sIFsnQXBwbHlGdW5jdGlvbicsIFs4Mjg5XV0sIFsnYXBwcm94JywgWzg3NzZdXSwgWydhcHByb3hlcScsIFs4Nzc4XV0sIFsnQXJpbmcnLCBbMTk3XV0sIFsnYXJpbmcnLCBbMjI5XV0sIFsnQXNjcicsIFsxMTk5NjRdXSwgWydhc2NyJywgWzExOTk5MF1dLCBbJ0Fzc2lnbicsIFs4Nzg4XV0sIFsnYXN0JywgWzQyXV0sIFsnYXN5bXAnLCBbODc3Nl1dLCBbJ2FzeW1wZXEnLCBbODc4MV1dLCBbJ0F0aWxkZScsIFsxOTVdXSwgWydhdGlsZGUnLCBbMjI3XV0sIFsnQXVtbCcsIFsxOTZdXSwgWydhdW1sJywgWzIyOF1dLCBbJ2F3Y29uaW50JywgWzg3NTVdXSwgWydhd2ludCcsIFsxMDc2OV1dLCBbJ2JhY2tjb25nJywgWzg3ODBdXSwgWydiYWNrZXBzaWxvbicsIFsxMDE0XV0sIFsnYmFja3ByaW1lJywgWzgyNDVdXSwgWydiYWNrc2ltJywgWzg3NjVdXSwgWydiYWNrc2ltZXEnLCBbODkwOV1dLCBbJ0JhY2tzbGFzaCcsIFs4NzI2XV0sIFsnQmFydicsIFsxMDk4M11dLCBbJ2JhcnZlZScsIFs4ODkzXV0sIFsnYmFyd2VkJywgWzg5NjVdXSwgWydCYXJ3ZWQnLCBbODk2Nl1dLCBbJ2JhcndlZGdlJywgWzg5NjVdXSwgWydiYnJrJywgWzkxNDFdXSwgWydiYnJrdGJyaycsIFs5MTQyXV0sIFsnYmNvbmcnLCBbODc4MF1dLCBbJ0JjeScsIFsxMDQxXV0sIFsnYmN5JywgWzEwNzNdXSwgWydiZHF1bycsIFs4MjIyXV0sIFsnYmVjYXVzJywgWzg3NTddXSwgWydiZWNhdXNlJywgWzg3NTddXSwgWydCZWNhdXNlJywgWzg3NTddXSwgWydiZW1wdHl2JywgWzEwNjcyXV0sIFsnYmVwc2knLCBbMTAxNF1dLCBbJ2Jlcm5vdScsIFs4NDkyXV0sIFsnQmVybm91bGxpcycsIFs4NDkyXV0sIFsnQmV0YScsIFs5MTRdXSwgWydiZXRhJywgWzk0Nl1dLCBbJ2JldGgnLCBbODUwMl1dLCBbJ2JldHdlZW4nLCBbODgxMl1dLCBbJ0JmcicsIFsxMjAwNjldXSwgWydiZnInLCBbMTIwMDk1XV0sIFsnYmlnY2FwJywgWzg4OThdXSwgWydiaWdjaXJjJywgWzk3MTFdXSwgWydiaWdjdXAnLCBbODg5OV1dLCBbJ2JpZ29kb3QnLCBbMTA3NTJdXSwgWydiaWdvcGx1cycsIFsxMDc1M11dLCBbJ2JpZ290aW1lcycsIFsxMDc1NF1dLCBbJ2JpZ3NxY3VwJywgWzEwNzU4XV0sIFsnYmlnc3RhcicsIFs5NzMzXV0sIFsnYmlndHJpYW5nbGVkb3duJywgWzk2NjFdXSwgWydiaWd0cmlhbmdsZXVwJywgWzk2NTFdXSwgWydiaWd1cGx1cycsIFsxMDc1Nl1dLCBbJ2JpZ3ZlZScsIFs4ODk3XV0sIFsnYmlnd2VkZ2UnLCBbODg5Nl1dLCBbJ2JrYXJvdycsIFsxMDUwOV1dLCBbJ2JsYWNrbG96ZW5nZScsIFsxMDczMV1dLCBbJ2JsYWNrc3F1YXJlJywgWzk2NDJdXSwgWydibGFja3RyaWFuZ2xlJywgWzk2NTJdXSwgWydibGFja3RyaWFuZ2xlZG93bicsIFs5NjYyXV0sIFsnYmxhY2t0cmlhbmdsZWxlZnQnLCBbOTY2Nl1dLCBbJ2JsYWNrdHJpYW5nbGVyaWdodCcsIFs5NjU2XV0sIFsnYmxhbmsnLCBbOTI1MV1dLCBbJ2JsazEyJywgWzk2MThdXSwgWydibGsxNCcsIFs5NjE3XV0sIFsnYmxrMzQnLCBbOTYxOV1dLCBbJ2Jsb2NrJywgWzk2MDhdXSwgWydibmUnLCBbNjEsIDg0MjFdXSwgWydibmVxdWl2JywgWzg4MDEsIDg0MjFdXSwgWydiTm90JywgWzEwOTg5XV0sIFsnYm5vdCcsIFs4OTc2XV0sIFsnQm9wZicsIFsxMjAxMjFdXSwgWydib3BmJywgWzEyMDE0N11dLCBbJ2JvdCcsIFs4ODY5XV0sIFsnYm90dG9tJywgWzg4NjldXSwgWydib3d0aWUnLCBbODkwNF1dLCBbJ2JveGJveCcsIFsxMDY5N11dLCBbJ2JveGRsJywgWzk0ODhdXSwgWydib3hkTCcsIFs5NTU3XV0sIFsnYm94RGwnLCBbOTU1OF1dLCBbJ2JveERMJywgWzk1NTldXSwgWydib3hkcicsIFs5NDg0XV0sIFsnYm94ZFInLCBbOTU1NF1dLCBbJ2JveERyJywgWzk1NTVdXSwgWydib3hEUicsIFs5NTU2XV0sIFsnYm94aCcsIFs5NDcyXV0sIFsnYm94SCcsIFs5NTUyXV0sIFsnYm94aGQnLCBbOTUxNl1dLCBbJ2JveEhkJywgWzk1NzJdXSwgWydib3hoRCcsIFs5NTczXV0sIFsnYm94SEQnLCBbOTU3NF1dLCBbJ2JveGh1JywgWzk1MjRdXSwgWydib3hIdScsIFs5NTc1XV0sIFsnYm94aFUnLCBbOTU3Nl1dLCBbJ2JveEhVJywgWzk1NzddXSwgWydib3htaW51cycsIFs4ODYzXV0sIFsnYm94cGx1cycsIFs4ODYyXV0sIFsnYm94dGltZXMnLCBbODg2NF1dLCBbJ2JveHVsJywgWzk0OTZdXSwgWydib3h1TCcsIFs5NTYzXV0sIFsnYm94VWwnLCBbOTU2NF1dLCBbJ2JveFVMJywgWzk1NjVdXSwgWydib3h1cicsIFs5NDkyXV0sIFsnYm94dVInLCBbOTU2MF1dLCBbJ2JveFVyJywgWzk1NjFdXSwgWydib3hVUicsIFs5NTYyXV0sIFsnYm94dicsIFs5NDc0XV0sIFsnYm94VicsIFs5NTUzXV0sIFsnYm94dmgnLCBbOTUzMl1dLCBbJ2JveHZIJywgWzk1NzhdXSwgWydib3hWaCcsIFs5NTc5XV0sIFsnYm94VkgnLCBbOTU4MF1dLCBbJ2JveHZsJywgWzk1MDhdXSwgWydib3h2TCcsIFs5NTY5XV0sIFsnYm94VmwnLCBbOTU3MF1dLCBbJ2JveFZMJywgWzk1NzFdXSwgWydib3h2cicsIFs5NTAwXV0sIFsnYm94dlInLCBbOTU2Nl1dLCBbJ2JveFZyJywgWzk1NjddXSwgWydib3hWUicsIFs5NTY4XV0sIFsnYnByaW1lJywgWzgyNDVdXSwgWydicmV2ZScsIFs3MjhdXSwgWydCcmV2ZScsIFs3MjhdXSwgWydicnZiYXInLCBbMTY2XV0sIFsnYnNjcicsIFsxMTk5OTFdXSwgWydCc2NyJywgWzg0OTJdXSwgWydic2VtaScsIFs4MjcxXV0sIFsnYnNpbScsIFs4NzY1XV0sIFsnYnNpbWUnLCBbODkwOV1dLCBbJ2Jzb2xiJywgWzEwNjkzXV0sIFsnYnNvbCcsIFs5Ml1dLCBbJ2Jzb2xoc3ViJywgWzEwMTg0XV0sIFsnYnVsbCcsIFs4MjI2XV0sIFsnYnVsbGV0JywgWzgyMjZdXSwgWydidW1wJywgWzg3ODJdXSwgWydidW1wRScsIFsxMDkyNl1dLCBbJ2J1bXBlJywgWzg3ODNdXSwgWydCdW1wZXEnLCBbODc4Ml1dLCBbJ2J1bXBlcScsIFs4NzgzXV0sIFsnQ2FjdXRlJywgWzI2Ml1dLCBbJ2NhY3V0ZScsIFsyNjNdXSwgWydjYXBhbmQnLCBbMTA4MjBdXSwgWydjYXBicmN1cCcsIFsxMDgyNV1dLCBbJ2NhcGNhcCcsIFsxMDgyN11dLCBbJ2NhcCcsIFs4NzQ1XV0sIFsnQ2FwJywgWzg5MTRdXSwgWydjYXBjdXAnLCBbMTA4MjNdXSwgWydjYXBkb3QnLCBbMTA4MTZdXSwgWydDYXBpdGFsRGlmZmVyZW50aWFsRCcsIFs4NTE3XV0sIFsnY2FwcycsIFs4NzQ1LCA2NTAyNF1dLCBbJ2NhcmV0JywgWzgyNTddXSwgWydjYXJvbicsIFs3MTFdXSwgWydDYXlsZXlzJywgWzg0OTNdXSwgWydjY2FwcycsIFsxMDgyOV1dLCBbJ0NjYXJvbicsIFsyNjhdXSwgWydjY2Fyb24nLCBbMjY5XV0sIFsnQ2NlZGlsJywgWzE5OV1dLCBbJ2NjZWRpbCcsIFsyMzFdXSwgWydDY2lyYycsIFsyNjRdXSwgWydjY2lyYycsIFsyNjVdXSwgWydDY29uaW50JywgWzg3NTJdXSwgWydjY3VwcycsIFsxMDgyOF1dLCBbJ2NjdXBzc20nLCBbMTA4MzJdXSwgWydDZG90JywgWzI2Nl1dLCBbJ2Nkb3QnLCBbMjY3XV0sIFsnY2VkaWwnLCBbMTg0XV0sIFsnQ2VkaWxsYScsIFsxODRdXSwgWydjZW1wdHl2JywgWzEwNjc0XV0sIFsnY2VudCcsIFsxNjJdXSwgWydjZW50ZXJkb3QnLCBbMTgzXV0sIFsnQ2VudGVyRG90JywgWzE4M11dLCBbJ2NmcicsIFsxMjAwOTZdXSwgWydDZnInLCBbODQ5M11dLCBbJ0NIY3knLCBbMTA2M11dLCBbJ2NoY3knLCBbMTA5NV1dLCBbJ2NoZWNrJywgWzEwMDAzXV0sIFsnY2hlY2ttYXJrJywgWzEwMDAzXV0sIFsnQ2hpJywgWzkzNV1dLCBbJ2NoaScsIFs5NjddXSwgWydjaXJjJywgWzcxMF1dLCBbJ2NpcmNlcScsIFs4NzkxXV0sIFsnY2lyY2xlYXJyb3dsZWZ0JywgWzg2MzRdXSwgWydjaXJjbGVhcnJvd3JpZ2h0JywgWzg2MzVdXSwgWydjaXJjbGVkYXN0JywgWzg4NTldXSwgWydjaXJjbGVkY2lyYycsIFs4ODU4XV0sIFsnY2lyY2xlZGRhc2gnLCBbODg2MV1dLCBbJ0NpcmNsZURvdCcsIFs4ODU3XV0sIFsnY2lyY2xlZFInLCBbMTc0XV0sIFsnY2lyY2xlZFMnLCBbOTQxNl1dLCBbJ0NpcmNsZU1pbnVzJywgWzg4NTRdXSwgWydDaXJjbGVQbHVzJywgWzg4NTNdXSwgWydDaXJjbGVUaW1lcycsIFs4ODU1XV0sIFsnY2lyJywgWzk2NzVdXSwgWydjaXJFJywgWzEwNjkxXV0sIFsnY2lyZScsIFs4NzkxXV0sIFsnY2lyZm5pbnQnLCBbMTA3NjhdXSwgWydjaXJtaWQnLCBbMTA5OTFdXSwgWydjaXJzY2lyJywgWzEwNjkwXV0sIFsnQ2xvY2t3aXNlQ29udG91ckludGVncmFsJywgWzg3NTRdXSwgWydDbG9zZUN1cmx5RG91YmxlUXVvdGUnLCBbODIyMV1dLCBbJ0Nsb3NlQ3VybHlRdW90ZScsIFs4MjE3XV0sIFsnY2x1YnMnLCBbOTgyN11dLCBbJ2NsdWJzdWl0JywgWzk4MjddXSwgWydjb2xvbicsIFs1OF1dLCBbJ0NvbG9uJywgWzg3NTldXSwgWydDb2xvbmUnLCBbMTA4NjhdXSwgWydjb2xvbmUnLCBbODc4OF1dLCBbJ2NvbG9uZXEnLCBbODc4OF1dLCBbJ2NvbW1hJywgWzQ0XV0sIFsnY29tbWF0JywgWzY0XV0sIFsnY29tcCcsIFs4NzA1XV0sIFsnY29tcGZuJywgWzg3MjhdXSwgWydjb21wbGVtZW50JywgWzg3MDVdXSwgWydjb21wbGV4ZXMnLCBbODQ1MF1dLCBbJ2NvbmcnLCBbODc3M11dLCBbJ2Nvbmdkb3QnLCBbMTA4NjFdXSwgWydDb25ncnVlbnQnLCBbODgwMV1dLCBbJ2NvbmludCcsIFs4NzUwXV0sIFsnQ29uaW50JywgWzg3NTFdXSwgWydDb250b3VySW50ZWdyYWwnLCBbODc1MF1dLCBbJ2NvcGYnLCBbMTIwMTQ4XV0sIFsnQ29wZicsIFs4NDUwXV0sIFsnY29wcm9kJywgWzg3MjBdXSwgWydDb3Byb2R1Y3QnLCBbODcyMF1dLCBbJ2NvcHknLCBbMTY5XV0sIFsnQ09QWScsIFsxNjldXSwgWydjb3B5c3InLCBbODQ3MV1dLCBbJ0NvdW50ZXJDbG9ja3dpc2VDb250b3VySW50ZWdyYWwnLCBbODc1NV1dLCBbJ2NyYXJyJywgWzg2MjldXSwgWydjcm9zcycsIFsxMDAwN11dLCBbJ0Nyb3NzJywgWzEwNzk5XV0sIFsnQ3NjcicsIFsxMTk5NjZdXSwgWydjc2NyJywgWzExOTk5Ml1dLCBbJ2NzdWInLCBbMTA5NTldXSwgWydjc3ViZScsIFsxMDk2MV1dLCBbJ2NzdXAnLCBbMTA5NjBdXSwgWydjc3VwZScsIFsxMDk2Ml1dLCBbJ2N0ZG90JywgWzg5NDNdXSwgWydjdWRhcnJsJywgWzEwNTUyXV0sIFsnY3VkYXJycicsIFsxMDU0OV1dLCBbJ2N1ZXByJywgWzg5MjZdXSwgWydjdWVzYycsIFs4OTI3XV0sIFsnY3VsYXJyJywgWzg2MzBdXSwgWydjdWxhcnJwJywgWzEwNTU3XV0sIFsnY3VwYnJjYXAnLCBbMTA4MjRdXSwgWydjdXBjYXAnLCBbMTA4MjJdXSwgWydDdXBDYXAnLCBbODc4MV1dLCBbJ2N1cCcsIFs4NzQ2XV0sIFsnQ3VwJywgWzg5MTVdXSwgWydjdXBjdXAnLCBbMTA4MjZdXSwgWydjdXBkb3QnLCBbODg0NV1dLCBbJ2N1cG9yJywgWzEwODIxXV0sIFsnY3VwcycsIFs4NzQ2LCA2NTAyNF1dLCBbJ2N1cmFycicsIFs4NjMxXV0sIFsnY3VyYXJybScsIFsxMDU1Nl1dLCBbJ2N1cmx5ZXFwcmVjJywgWzg5MjZdXSwgWydjdXJseWVxc3VjYycsIFs4OTI3XV0sIFsnY3VybHl2ZWUnLCBbODkxMF1dLCBbJ2N1cmx5d2VkZ2UnLCBbODkxMV1dLCBbJ2N1cnJlbicsIFsxNjRdXSwgWydjdXJ2ZWFycm93bGVmdCcsIFs4NjMwXV0sIFsnY3VydmVhcnJvd3JpZ2h0JywgWzg2MzFdXSwgWydjdXZlZScsIFs4OTEwXV0sIFsnY3V3ZWQnLCBbODkxMV1dLCBbJ2N3Y29uaW50JywgWzg3NTRdXSwgWydjd2ludCcsIFs4NzUzXV0sIFsnY3lsY3R5JywgWzkwMDVdXSwgWydkYWdnZXInLCBbODIyNF1dLCBbJ0RhZ2dlcicsIFs4MjI1XV0sIFsnZGFsZXRoJywgWzg1MDRdXSwgWydkYXJyJywgWzg1OTVdXSwgWydEYXJyJywgWzg2MDldXSwgWydkQXJyJywgWzg2NTldXSwgWydkYXNoJywgWzgyMDhdXSwgWydEYXNodicsIFsxMDk4MF1dLCBbJ2Rhc2h2JywgWzg4NjddXSwgWydkYmthcm93JywgWzEwNTExXV0sIFsnZGJsYWMnLCBbNzMzXV0sIFsnRGNhcm9uJywgWzI3MF1dLCBbJ2RjYXJvbicsIFsyNzFdXSwgWydEY3knLCBbMTA0NF1dLCBbJ2RjeScsIFsxMDc2XV0sIFsnZGRhZ2dlcicsIFs4MjI1XV0sIFsnZGRhcnInLCBbODY1MF1dLCBbJ0REJywgWzg1MTddXSwgWydkZCcsIFs4NTE4XV0sIFsnRERvdHJhaGQnLCBbMTA1MTNdXSwgWydkZG90c2VxJywgWzEwODcxXV0sIFsnZGVnJywgWzE3Nl1dLCBbJ0RlbCcsIFs4NzExXV0sIFsnRGVsdGEnLCBbOTE2XV0sIFsnZGVsdGEnLCBbOTQ4XV0sIFsnZGVtcHR5dicsIFsxMDY3M11dLCBbJ2RmaXNodCcsIFsxMDYyM11dLCBbJ0RmcicsIFsxMjAwNzFdXSwgWydkZnInLCBbMTIwMDk3XV0sIFsnZEhhcicsIFsxMDU5N11dLCBbJ2RoYXJsJywgWzg2NDNdXSwgWydkaGFycicsIFs4NjQyXV0sIFsnRGlhY3JpdGljYWxBY3V0ZScsIFsxODBdXSwgWydEaWFjcml0aWNhbERvdCcsIFs3MjldXSwgWydEaWFjcml0aWNhbERvdWJsZUFjdXRlJywgWzczM11dLCBbJ0RpYWNyaXRpY2FsR3JhdmUnLCBbOTZdXSwgWydEaWFjcml0aWNhbFRpbGRlJywgWzczMl1dLCBbJ2RpYW0nLCBbODkwMF1dLCBbJ2RpYW1vbmQnLCBbODkwMF1dLCBbJ0RpYW1vbmQnLCBbODkwMF1dLCBbJ2RpYW1vbmRzdWl0JywgWzk4MzBdXSwgWydkaWFtcycsIFs5ODMwXV0sIFsnZGllJywgWzE2OF1dLCBbJ0RpZmZlcmVudGlhbEQnLCBbODUxOF1dLCBbJ2RpZ2FtbWEnLCBbOTg5XV0sIFsnZGlzaW4nLCBbODk0Nl1dLCBbJ2RpdicsIFsyNDddXSwgWydkaXZpZGUnLCBbMjQ3XV0sIFsnZGl2aWRlb250aW1lcycsIFs4OTAzXV0sIFsnZGl2b254JywgWzg5MDNdXSwgWydESmN5JywgWzEwMjZdXSwgWydkamN5JywgWzExMDZdXSwgWydkbGNvcm4nLCBbODk5MF1dLCBbJ2RsY3JvcCcsIFs4OTczXV0sIFsnZG9sbGFyJywgWzM2XV0sIFsnRG9wZicsIFsxMjAxMjNdXSwgWydkb3BmJywgWzEyMDE0OV1dLCBbJ0RvdCcsIFsxNjhdXSwgWydkb3QnLCBbNzI5XV0sIFsnRG90RG90JywgWzg0MTJdXSwgWydkb3RlcScsIFs4Nzg0XV0sIFsnZG90ZXFkb3QnLCBbODc4NV1dLCBbJ0RvdEVxdWFsJywgWzg3ODRdXSwgWydkb3RtaW51cycsIFs4NzYwXV0sIFsnZG90cGx1cycsIFs4NzI0XV0sIFsnZG90c3F1YXJlJywgWzg4NjVdXSwgWydkb3VibGViYXJ3ZWRnZScsIFs4OTY2XV0sIFsnRG91YmxlQ29udG91ckludGVncmFsJywgWzg3NTFdXSwgWydEb3VibGVEb3QnLCBbMTY4XV0sIFsnRG91YmxlRG93bkFycm93JywgWzg2NTldXSwgWydEb3VibGVMZWZ0QXJyb3cnLCBbODY1Nl1dLCBbJ0RvdWJsZUxlZnRSaWdodEFycm93JywgWzg2NjBdXSwgWydEb3VibGVMZWZ0VGVlJywgWzEwOTgwXV0sIFsnRG91YmxlTG9uZ0xlZnRBcnJvdycsIFsxMDIzMl1dLCBbJ0RvdWJsZUxvbmdMZWZ0UmlnaHRBcnJvdycsIFsxMDIzNF1dLCBbJ0RvdWJsZUxvbmdSaWdodEFycm93JywgWzEwMjMzXV0sIFsnRG91YmxlUmlnaHRBcnJvdycsIFs4NjU4XV0sIFsnRG91YmxlUmlnaHRUZWUnLCBbODg3Ml1dLCBbJ0RvdWJsZVVwQXJyb3cnLCBbODY1N11dLCBbJ0RvdWJsZVVwRG93bkFycm93JywgWzg2NjFdXSwgWydEb3VibGVWZXJ0aWNhbEJhcicsIFs4NzQxXV0sIFsnRG93bkFycm93QmFyJywgWzEwNTE1XV0sIFsnZG93bmFycm93JywgWzg1OTVdXSwgWydEb3duQXJyb3cnLCBbODU5NV1dLCBbJ0Rvd25hcnJvdycsIFs4NjU5XV0sIFsnRG93bkFycm93VXBBcnJvdycsIFs4NjkzXV0sIFsnRG93bkJyZXZlJywgWzc4NV1dLCBbJ2Rvd25kb3duYXJyb3dzJywgWzg2NTBdXSwgWydkb3duaGFycG9vbmxlZnQnLCBbODY0M11dLCBbJ2Rvd25oYXJwb29ucmlnaHQnLCBbODY0Ml1dLCBbJ0Rvd25MZWZ0UmlnaHRWZWN0b3InLCBbMTA1NzZdXSwgWydEb3duTGVmdFRlZVZlY3RvcicsIFsxMDU5MF1dLCBbJ0Rvd25MZWZ0VmVjdG9yQmFyJywgWzEwNTgyXV0sIFsnRG93bkxlZnRWZWN0b3InLCBbODYzN11dLCBbJ0Rvd25SaWdodFRlZVZlY3RvcicsIFsxMDU5MV1dLCBbJ0Rvd25SaWdodFZlY3RvckJhcicsIFsxMDU4M11dLCBbJ0Rvd25SaWdodFZlY3RvcicsIFs4NjQxXV0sIFsnRG93blRlZUFycm93JywgWzg2MTVdXSwgWydEb3duVGVlJywgWzg4NjhdXSwgWydkcmJrYXJvdycsIFsxMDUxMl1dLCBbJ2RyY29ybicsIFs4OTkxXV0sIFsnZHJjcm9wJywgWzg5NzJdXSwgWydEc2NyJywgWzExOTk2N11dLCBbJ2RzY3InLCBbMTE5OTkzXV0sIFsnRFNjeScsIFsxMDI5XV0sIFsnZHNjeScsIFsxMTA5XV0sIFsnZHNvbCcsIFsxMDc0Ml1dLCBbJ0RzdHJvaycsIFsyNzJdXSwgWydkc3Ryb2snLCBbMjczXV0sIFsnZHRkb3QnLCBbODk0NV1dLCBbJ2R0cmknLCBbOTY2M11dLCBbJ2R0cmlmJywgWzk2NjJdXSwgWydkdWFycicsIFs4NjkzXV0sIFsnZHVoYXInLCBbMTA2MDddXSwgWydkd2FuZ2xlJywgWzEwNjYyXV0sIFsnRFpjeScsIFsxMDM5XV0sIFsnZHpjeScsIFsxMTE5XV0sIFsnZHppZ3JhcnInLCBbMTAyMzldXSwgWydFYWN1dGUnLCBbMjAxXV0sIFsnZWFjdXRlJywgWzIzM11dLCBbJ2Vhc3RlcicsIFsxMDg2Ml1dLCBbJ0VjYXJvbicsIFsyODJdXSwgWydlY2Fyb24nLCBbMjgzXV0sIFsnRWNpcmMnLCBbMjAyXV0sIFsnZWNpcmMnLCBbMjM0XV0sIFsnZWNpcicsIFs4NzkwXV0sIFsnZWNvbG9uJywgWzg3ODldXSwgWydFY3knLCBbMTA2OV1dLCBbJ2VjeScsIFsxMTAxXV0sIFsnZUREb3QnLCBbMTA4NzFdXSwgWydFZG90JywgWzI3OF1dLCBbJ2Vkb3QnLCBbMjc5XV0sIFsnZURvdCcsIFs4Nzg1XV0sIFsnZWUnLCBbODUxOV1dLCBbJ2VmRG90JywgWzg3ODZdXSwgWydFZnInLCBbMTIwMDcyXV0sIFsnZWZyJywgWzEyMDA5OF1dLCBbJ2VnJywgWzEwOTA2XV0sIFsnRWdyYXZlJywgWzIwMF1dLCBbJ2VncmF2ZScsIFsyMzJdXSwgWydlZ3MnLCBbMTA5MDJdXSwgWydlZ3Nkb3QnLCBbMTA5MDRdXSwgWydlbCcsIFsxMDkwNV1dLCBbJ0VsZW1lbnQnLCBbODcxMl1dLCBbJ2VsaW50ZXJzJywgWzkxOTFdXSwgWydlbGwnLCBbODQ2N11dLCBbJ2VscycsIFsxMDkwMV1dLCBbJ2Vsc2RvdCcsIFsxMDkwM11dLCBbJ0VtYWNyJywgWzI3NF1dLCBbJ2VtYWNyJywgWzI3NV1dLCBbJ2VtcHR5JywgWzg3MDldXSwgWydlbXB0eXNldCcsIFs4NzA5XV0sIFsnRW1wdHlTbWFsbFNxdWFyZScsIFs5NzIzXV0sIFsnZW1wdHl2JywgWzg3MDldXSwgWydFbXB0eVZlcnlTbWFsbFNxdWFyZScsIFs5NjQzXV0sIFsnZW1zcDEzJywgWzgxOTZdXSwgWydlbXNwMTQnLCBbODE5N11dLCBbJ2Vtc3AnLCBbODE5NV1dLCBbJ0VORycsIFszMzBdXSwgWydlbmcnLCBbMzMxXV0sIFsnZW5zcCcsIFs4MTk0XV0sIFsnRW9nb24nLCBbMjgwXV0sIFsnZW9nb24nLCBbMjgxXV0sIFsnRW9wZicsIFsxMjAxMjRdXSwgWydlb3BmJywgWzEyMDE1MF1dLCBbJ2VwYXInLCBbODkxN11dLCBbJ2VwYXJzbCcsIFsxMDcyM11dLCBbJ2VwbHVzJywgWzEwODY1XV0sIFsnZXBzaScsIFs5NDldXSwgWydFcHNpbG9uJywgWzkxN11dLCBbJ2Vwc2lsb24nLCBbOTQ5XV0sIFsnZXBzaXYnLCBbMTAxM11dLCBbJ2VxY2lyYycsIFs4NzkwXV0sIFsnZXFjb2xvbicsIFs4Nzg5XV0sIFsnZXFzaW0nLCBbODc3MF1dLCBbJ2Vxc2xhbnRndHInLCBbMTA5MDJdXSwgWydlcXNsYW50bGVzcycsIFsxMDkwMV1dLCBbJ0VxdWFsJywgWzEwODY5XV0sIFsnZXF1YWxzJywgWzYxXV0sIFsnRXF1YWxUaWxkZScsIFs4NzcwXV0sIFsnZXF1ZXN0JywgWzg3OTldXSwgWydFcXVpbGlicml1bScsIFs4NjUyXV0sIFsnZXF1aXYnLCBbODgwMV1dLCBbJ2VxdWl2REQnLCBbMTA4NzJdXSwgWydlcXZwYXJzbCcsIFsxMDcyNV1dLCBbJ2VyYXJyJywgWzEwNjA5XV0sIFsnZXJEb3QnLCBbODc4N11dLCBbJ2VzY3InLCBbODQ5NV1dLCBbJ0VzY3InLCBbODQ5Nl1dLCBbJ2VzZG90JywgWzg3ODRdXSwgWydFc2ltJywgWzEwODY3XV0sIFsnZXNpbScsIFs4NzcwXV0sIFsnRXRhJywgWzkxOV1dLCBbJ2V0YScsIFs5NTFdXSwgWydFVEgnLCBbMjA4XV0sIFsnZXRoJywgWzI0MF1dLCBbJ0V1bWwnLCBbMjAzXV0sIFsnZXVtbCcsIFsyMzVdXSwgWydldXJvJywgWzgzNjRdXSwgWydleGNsJywgWzMzXV0sIFsnZXhpc3QnLCBbODcwN11dLCBbJ0V4aXN0cycsIFs4NzA3XV0sIFsnZXhwZWN0YXRpb24nLCBbODQ5Nl1dLCBbJ2V4cG9uZW50aWFsZScsIFs4NTE5XV0sIFsnRXhwb25lbnRpYWxFJywgWzg1MTldXSwgWydmYWxsaW5nZG90c2VxJywgWzg3ODZdXSwgWydGY3knLCBbMTA2MF1dLCBbJ2ZjeScsIFsxMDkyXV0sIFsnZmVtYWxlJywgWzk3OTJdXSwgWydmZmlsaWcnLCBbNjQyNTldXSwgWydmZmxpZycsIFs2NDI1Nl1dLCBbJ2ZmbGxpZycsIFs2NDI2MF1dLCBbJ0ZmcicsIFsxMjAwNzNdXSwgWydmZnInLCBbMTIwMDk5XV0sIFsnZmlsaWcnLCBbNjQyNTddXSwgWydGaWxsZWRTbWFsbFNxdWFyZScsIFs5NzI0XV0sIFsnRmlsbGVkVmVyeVNtYWxsU3F1YXJlJywgWzk2NDJdXSwgWydmamxpZycsIFsxMDIsIDEwNl1dLCBbJ2ZsYXQnLCBbOTgzN11dLCBbJ2ZsbGlnJywgWzY0MjU4XV0sIFsnZmx0bnMnLCBbOTY0OV1dLCBbJ2Zub2YnLCBbNDAyXV0sIFsnRm9wZicsIFsxMjAxMjVdXSwgWydmb3BmJywgWzEyMDE1MV1dLCBbJ2ZvcmFsbCcsIFs4NzA0XV0sIFsnRm9yQWxsJywgWzg3MDRdXSwgWydmb3JrJywgWzg5MTZdXSwgWydmb3JrdicsIFsxMDk2OV1dLCBbJ0ZvdXJpZXJ0cmYnLCBbODQ5N11dLCBbJ2ZwYXJ0aW50JywgWzEwNzY1XV0sIFsnZnJhYzEyJywgWzE4OV1dLCBbJ2ZyYWMxMycsIFs4NTMxXV0sIFsnZnJhYzE0JywgWzE4OF1dLCBbJ2ZyYWMxNScsIFs4NTMzXV0sIFsnZnJhYzE2JywgWzg1MzddXSwgWydmcmFjMTgnLCBbODUzOV1dLCBbJ2ZyYWMyMycsIFs4NTMyXV0sIFsnZnJhYzI1JywgWzg1MzRdXSwgWydmcmFjMzQnLCBbMTkwXV0sIFsnZnJhYzM1JywgWzg1MzVdXSwgWydmcmFjMzgnLCBbODU0MF1dLCBbJ2ZyYWM0NScsIFs4NTM2XV0sIFsnZnJhYzU2JywgWzg1MzhdXSwgWydmcmFjNTgnLCBbODU0MV1dLCBbJ2ZyYWM3OCcsIFs4NTQyXV0sIFsnZnJhc2wnLCBbODI2MF1dLCBbJ2Zyb3duJywgWzg5OTRdXSwgWydmc2NyJywgWzExOTk5NV1dLCBbJ0ZzY3InLCBbODQ5N11dLCBbJ2dhY3V0ZScsIFs1MDFdXSwgWydHYW1tYScsIFs5MTVdXSwgWydnYW1tYScsIFs5NDddXSwgWydHYW1tYWQnLCBbOTg4XV0sIFsnZ2FtbWFkJywgWzk4OV1dLCBbJ2dhcCcsIFsxMDg4Nl1dLCBbJ0dicmV2ZScsIFsyODZdXSwgWydnYnJldmUnLCBbMjg3XV0sIFsnR2NlZGlsJywgWzI5MF1dLCBbJ0djaXJjJywgWzI4NF1dLCBbJ2djaXJjJywgWzI4NV1dLCBbJ0djeScsIFsxMDQzXV0sIFsnZ2N5JywgWzEwNzVdXSwgWydHZG90JywgWzI4OF1dLCBbJ2dkb3QnLCBbMjg5XV0sIFsnZ2UnLCBbODgwNV1dLCBbJ2dFJywgWzg4MDddXSwgWydnRWwnLCBbMTA4OTJdXSwgWydnZWwnLCBbODkyM11dLCBbJ2dlcScsIFs4ODA1XV0sIFsnZ2VxcScsIFs4ODA3XV0sIFsnZ2Vxc2xhbnQnLCBbMTA4NzhdXSwgWydnZXNjYycsIFsxMDkyMV1dLCBbJ2dlcycsIFsxMDg3OF1dLCBbJ2dlc2RvdCcsIFsxMDg4MF1dLCBbJ2dlc2RvdG8nLCBbMTA4ODJdXSwgWydnZXNkb3RvbCcsIFsxMDg4NF1dLCBbJ2dlc2wnLCBbODkyMywgNjUwMjRdXSwgWydnZXNsZXMnLCBbMTA5MDBdXSwgWydHZnInLCBbMTIwMDc0XV0sIFsnZ2ZyJywgWzEyMDEwMF1dLCBbJ2dnJywgWzg4MTFdXSwgWydHZycsIFs4OTIxXV0sIFsnZ2dnJywgWzg5MjFdXSwgWydnaW1lbCcsIFs4NTAzXV0sIFsnR0pjeScsIFsxMDI3XV0sIFsnZ2pjeScsIFsxMTA3XV0sIFsnZ2xhJywgWzEwOTE3XV0sIFsnZ2wnLCBbODgyM11dLCBbJ2dsRScsIFsxMDg5OF1dLCBbJ2dsaicsIFsxMDkxNl1dLCBbJ2duYXAnLCBbMTA4OTBdXSwgWydnbmFwcHJveCcsIFsxMDg5MF1dLCBbJ2duZScsIFsxMDg4OF1dLCBbJ2duRScsIFs4ODA5XV0sIFsnZ25lcScsIFsxMDg4OF1dLCBbJ2duZXFxJywgWzg4MDldXSwgWydnbnNpbScsIFs4OTM1XV0sIFsnR29wZicsIFsxMjAxMjZdXSwgWydnb3BmJywgWzEyMDE1Ml1dLCBbJ2dyYXZlJywgWzk2XV0sIFsnR3JlYXRlckVxdWFsJywgWzg4MDVdXSwgWydHcmVhdGVyRXF1YWxMZXNzJywgWzg5MjNdXSwgWydHcmVhdGVyRnVsbEVxdWFsJywgWzg4MDddXSwgWydHcmVhdGVyR3JlYXRlcicsIFsxMDkxNF1dLCBbJ0dyZWF0ZXJMZXNzJywgWzg4MjNdXSwgWydHcmVhdGVyU2xhbnRFcXVhbCcsIFsxMDg3OF1dLCBbJ0dyZWF0ZXJUaWxkZScsIFs4ODE5XV0sIFsnR3NjcicsIFsxMTk5NzBdXSwgWydnc2NyJywgWzg0NThdXSwgWydnc2ltJywgWzg4MTldXSwgWydnc2ltZScsIFsxMDg5NF1dLCBbJ2dzaW1sJywgWzEwODk2XV0sIFsnZ3RjYycsIFsxMDkxOV1dLCBbJ2d0Y2lyJywgWzEwODc0XV0sIFsnZ3QnLCBbNjJdXSwgWydHVCcsIFs2Ml1dLCBbJ0d0JywgWzg4MTFdXSwgWydndGRvdCcsIFs4OTE5XV0sIFsnZ3RsUGFyJywgWzEwNjQ1XV0sIFsnZ3RxdWVzdCcsIFsxMDg3Nl1dLCBbJ2d0cmFwcHJveCcsIFsxMDg4Nl1dLCBbJ2d0cmFycicsIFsxMDYxNl1dLCBbJ2d0cmRvdCcsIFs4OTE5XV0sIFsnZ3RyZXFsZXNzJywgWzg5MjNdXSwgWydndHJlcXFsZXNzJywgWzEwODkyXV0sIFsnZ3RybGVzcycsIFs4ODIzXV0sIFsnZ3Ryc2ltJywgWzg4MTldXSwgWydndmVydG5lcXEnLCBbODgwOSwgNjUwMjRdXSwgWydndm5FJywgWzg4MDksIDY1MDI0XV0sIFsnSGFjZWsnLCBbNzExXV0sIFsnaGFpcnNwJywgWzgyMDJdXSwgWydoYWxmJywgWzE4OV1dLCBbJ2hhbWlsdCcsIFs4NDU5XV0sIFsnSEFSRGN5JywgWzEwNjZdXSwgWydoYXJkY3knLCBbMTA5OF1dLCBbJ2hhcnJjaXInLCBbMTA1NjhdXSwgWydoYXJyJywgWzg1OTZdXSwgWydoQXJyJywgWzg2NjBdXSwgWydoYXJydycsIFs4NjIxXV0sIFsnSGF0JywgWzk0XV0sIFsnaGJhcicsIFs4NDYzXV0sIFsnSGNpcmMnLCBbMjkyXV0sIFsnaGNpcmMnLCBbMjkzXV0sIFsnaGVhcnRzJywgWzk4MjldXSwgWydoZWFydHN1aXQnLCBbOTgyOV1dLCBbJ2hlbGxpcCcsIFs4MjMwXV0sIFsnaGVyY29uJywgWzg4ODldXSwgWydoZnInLCBbMTIwMTAxXV0sIFsnSGZyJywgWzg0NjBdXSwgWydIaWxiZXJ0U3BhY2UnLCBbODQ1OV1dLCBbJ2hrc2Vhcm93JywgWzEwNTMzXV0sIFsnaGtzd2Fyb3cnLCBbMTA1MzRdXSwgWydob2FycicsIFs4NzAzXV0sIFsnaG9tdGh0JywgWzg3NjNdXSwgWydob29rbGVmdGFycm93JywgWzg2MTddXSwgWydob29rcmlnaHRhcnJvdycsIFs4NjE4XV0sIFsnaG9wZicsIFsxMjAxNTNdXSwgWydIb3BmJywgWzg0NjFdXSwgWydob3JiYXInLCBbODIxM11dLCBbJ0hvcml6b250YWxMaW5lJywgWzk0NzJdXSwgWydoc2NyJywgWzExOTk5N11dLCBbJ0hzY3InLCBbODQ1OV1dLCBbJ2hzbGFzaCcsIFs4NDYzXV0sIFsnSHN0cm9rJywgWzI5NF1dLCBbJ2hzdHJvaycsIFsyOTVdXSwgWydIdW1wRG93bkh1bXAnLCBbODc4Ml1dLCBbJ0h1bXBFcXVhbCcsIFs4NzgzXV0sIFsnaHlidWxsJywgWzgyNTldXSwgWydoeXBoZW4nLCBbODIwOF1dLCBbJ0lhY3V0ZScsIFsyMDVdXSwgWydpYWN1dGUnLCBbMjM3XV0sIFsnaWMnLCBbODI5MV1dLCBbJ0ljaXJjJywgWzIwNl1dLCBbJ2ljaXJjJywgWzIzOF1dLCBbJ0ljeScsIFsxMDQ4XV0sIFsnaWN5JywgWzEwODBdXSwgWydJZG90JywgWzMwNF1dLCBbJ0lFY3knLCBbMTA0NV1dLCBbJ2llY3knLCBbMTA3N11dLCBbJ2lleGNsJywgWzE2MV1dLCBbJ2lmZicsIFs4NjYwXV0sIFsnaWZyJywgWzEyMDEwMl1dLCBbJ0lmcicsIFs4NDY1XV0sIFsnSWdyYXZlJywgWzIwNF1dLCBbJ2lncmF2ZScsIFsyMzZdXSwgWydpaScsIFs4NTIwXV0sIFsnaWlpaW50JywgWzEwNzY0XV0sIFsnaWlpbnQnLCBbODc0OV1dLCBbJ2lpbmZpbicsIFsxMDcxNl1dLCBbJ2lpb3RhJywgWzg0ODldXSwgWydJSmxpZycsIFszMDZdXSwgWydpamxpZycsIFszMDddXSwgWydJbWFjcicsIFsyOThdXSwgWydpbWFjcicsIFsyOTldXSwgWydpbWFnZScsIFs4NDY1XV0sIFsnSW1hZ2luYXJ5SScsIFs4NTIwXV0sIFsnaW1hZ2xpbmUnLCBbODQ2NF1dLCBbJ2ltYWdwYXJ0JywgWzg0NjVdXSwgWydpbWF0aCcsIFszMDVdXSwgWydJbScsIFs4NDY1XV0sIFsnaW1vZicsIFs4ODg3XV0sIFsnaW1wZWQnLCBbNDM3XV0sIFsnSW1wbGllcycsIFs4NjU4XV0sIFsnaW5jYXJlJywgWzg0NTNdXSwgWydpbicsIFs4NzEyXV0sIFsnaW5maW4nLCBbODczNF1dLCBbJ2luZmludGllJywgWzEwNzE3XV0sIFsnaW5vZG90JywgWzMwNV1dLCBbJ2ludGNhbCcsIFs4ODkwXV0sIFsnaW50JywgWzg3NDddXSwgWydJbnQnLCBbODc0OF1dLCBbJ2ludGVnZXJzJywgWzg0ODRdXSwgWydJbnRlZ3JhbCcsIFs4NzQ3XV0sIFsnaW50ZXJjYWwnLCBbODg5MF1dLCBbJ0ludGVyc2VjdGlvbicsIFs4ODk4XV0sIFsnaW50bGFyaGsnLCBbMTA3NzVdXSwgWydpbnRwcm9kJywgWzEwODEyXV0sIFsnSW52aXNpYmxlQ29tbWEnLCBbODI5MV1dLCBbJ0ludmlzaWJsZVRpbWVzJywgWzgyOTBdXSwgWydJT2N5JywgWzEwMjVdXSwgWydpb2N5JywgWzExMDVdXSwgWydJb2dvbicsIFszMDJdXSwgWydpb2dvbicsIFszMDNdXSwgWydJb3BmJywgWzEyMDEyOF1dLCBbJ2lvcGYnLCBbMTIwMTU0XV0sIFsnSW90YScsIFs5MjFdXSwgWydpb3RhJywgWzk1M11dLCBbJ2lwcm9kJywgWzEwODEyXV0sIFsnaXF1ZXN0JywgWzE5MV1dLCBbJ2lzY3InLCBbMTE5OTk4XV0sIFsnSXNjcicsIFs4NDY0XV0sIFsnaXNpbicsIFs4NzEyXV0sIFsnaXNpbmRvdCcsIFs4OTQ5XV0sIFsnaXNpbkUnLCBbODk1M11dLCBbJ2lzaW5zJywgWzg5NDhdXSwgWydpc2luc3YnLCBbODk0N11dLCBbJ2lzaW52JywgWzg3MTJdXSwgWydpdCcsIFs4MjkwXV0sIFsnSXRpbGRlJywgWzI5Nl1dLCBbJ2l0aWxkZScsIFsyOTddXSwgWydJdWtjeScsIFsxMDMwXV0sIFsnaXVrY3knLCBbMTExMF1dLCBbJ0l1bWwnLCBbMjA3XV0sIFsnaXVtbCcsIFsyMzldXSwgWydKY2lyYycsIFszMDhdXSwgWydqY2lyYycsIFszMDldXSwgWydKY3knLCBbMTA0OV1dLCBbJ2pjeScsIFsxMDgxXV0sIFsnSmZyJywgWzEyMDA3N11dLCBbJ2pmcicsIFsxMjAxMDNdXSwgWydqbWF0aCcsIFs1NjddXSwgWydKb3BmJywgWzEyMDEyOV1dLCBbJ2pvcGYnLCBbMTIwMTU1XV0sIFsnSnNjcicsIFsxMTk5NzNdXSwgWydqc2NyJywgWzExOTk5OV1dLCBbJ0pzZXJjeScsIFsxMDMyXV0sIFsnanNlcmN5JywgWzExMTJdXSwgWydKdWtjeScsIFsxMDI4XV0sIFsnanVrY3knLCBbMTEwOF1dLCBbJ0thcHBhJywgWzkyMl1dLCBbJ2thcHBhJywgWzk1NF1dLCBbJ2thcHBhdicsIFsxMDA4XV0sIFsnS2NlZGlsJywgWzMxMF1dLCBbJ2tjZWRpbCcsIFszMTFdXSwgWydLY3knLCBbMTA1MF1dLCBbJ2tjeScsIFsxMDgyXV0sIFsnS2ZyJywgWzEyMDA3OF1dLCBbJ2tmcicsIFsxMjAxMDRdXSwgWydrZ3JlZW4nLCBbMzEyXV0sIFsnS0hjeScsIFsxMDYxXV0sIFsna2hjeScsIFsxMDkzXV0sIFsnS0pjeScsIFsxMDM2XV0sIFsna2pjeScsIFsxMTE2XV0sIFsnS29wZicsIFsxMjAxMzBdXSwgWydrb3BmJywgWzEyMDE1Nl1dLCBbJ0tzY3InLCBbMTE5OTc0XV0sIFsna3NjcicsIFsxMjAwMDBdXSwgWydsQWFycicsIFs4NjY2XV0sIFsnTGFjdXRlJywgWzMxM11dLCBbJ2xhY3V0ZScsIFszMTRdXSwgWydsYWVtcHR5dicsIFsxMDY3Nl1dLCBbJ2xhZ3JhbicsIFs4NDY2XV0sIFsnTGFtYmRhJywgWzkyM11dLCBbJ2xhbWJkYScsIFs5NTVdXSwgWydsYW5nJywgWzEwMjE2XV0sIFsnTGFuZycsIFsxMDIxOF1dLCBbJ2xhbmdkJywgWzEwNjQxXV0sIFsnbGFuZ2xlJywgWzEwMjE2XV0sIFsnbGFwJywgWzEwODg1XV0sIFsnTGFwbGFjZXRyZicsIFs4NDY2XV0sIFsnbGFxdW8nLCBbMTcxXV0sIFsnbGFycmInLCBbODY3Nl1dLCBbJ2xhcnJiZnMnLCBbMTA1MjddXSwgWydsYXJyJywgWzg1OTJdXSwgWydMYXJyJywgWzg2MDZdXSwgWydsQXJyJywgWzg2NTZdXSwgWydsYXJyZnMnLCBbMTA1MjVdXSwgWydsYXJyaGsnLCBbODYxN11dLCBbJ2xhcnJscCcsIFs4NjE5XV0sIFsnbGFycnBsJywgWzEwNTUzXV0sIFsnbGFycnNpbScsIFsxMDYxMV1dLCBbJ2xhcnJ0bCcsIFs4NjEwXV0sIFsnbGF0YWlsJywgWzEwNTIxXV0sIFsnbEF0YWlsJywgWzEwNTIzXV0sIFsnbGF0JywgWzEwOTIzXV0sIFsnbGF0ZScsIFsxMDkyNV1dLCBbJ2xhdGVzJywgWzEwOTI1LCA2NTAyNF1dLCBbJ2xiYXJyJywgWzEwNTA4XV0sIFsnbEJhcnInLCBbMTA1MTBdXSwgWydsYmJyaycsIFsxMDA5OF1dLCBbJ2xicmFjZScsIFsxMjNdXSwgWydsYnJhY2snLCBbOTFdXSwgWydsYnJrZScsIFsxMDYzNV1dLCBbJ2xicmtzbGQnLCBbMTA2MzldXSwgWydsYnJrc2x1JywgWzEwNjM3XV0sIFsnTGNhcm9uJywgWzMxN11dLCBbJ2xjYXJvbicsIFszMThdXSwgWydMY2VkaWwnLCBbMzE1XV0sIFsnbGNlZGlsJywgWzMxNl1dLCBbJ2xjZWlsJywgWzg5NjhdXSwgWydsY3ViJywgWzEyM11dLCBbJ0xjeScsIFsxMDUxXV0sIFsnbGN5JywgWzEwODNdXSwgWydsZGNhJywgWzEwNTUwXV0sIFsnbGRxdW8nLCBbODIyMF1dLCBbJ2xkcXVvcicsIFs4MjIyXV0sIFsnbGRyZGhhcicsIFsxMDU5OV1dLCBbJ2xkcnVzaGFyJywgWzEwNTcxXV0sIFsnbGRzaCcsIFs4NjI2XV0sIFsnbGUnLCBbODgwNF1dLCBbJ2xFJywgWzg4MDZdXSwgWydMZWZ0QW5nbGVCcmFja2V0JywgWzEwMjE2XV0sIFsnTGVmdEFycm93QmFyJywgWzg2NzZdXSwgWydsZWZ0YXJyb3cnLCBbODU5Ml1dLCBbJ0xlZnRBcnJvdycsIFs4NTkyXV0sIFsnTGVmdGFycm93JywgWzg2NTZdXSwgWydMZWZ0QXJyb3dSaWdodEFycm93JywgWzg2NDZdXSwgWydsZWZ0YXJyb3d0YWlsJywgWzg2MTBdXSwgWydMZWZ0Q2VpbGluZycsIFs4OTY4XV0sIFsnTGVmdERvdWJsZUJyYWNrZXQnLCBbMTAyMTRdXSwgWydMZWZ0RG93blRlZVZlY3RvcicsIFsxMDU5M11dLCBbJ0xlZnREb3duVmVjdG9yQmFyJywgWzEwNTg1XV0sIFsnTGVmdERvd25WZWN0b3InLCBbODY0M11dLCBbJ0xlZnRGbG9vcicsIFs4OTcwXV0sIFsnbGVmdGhhcnBvb25kb3duJywgWzg2MzddXSwgWydsZWZ0aGFycG9vbnVwJywgWzg2MzZdXSwgWydsZWZ0bGVmdGFycm93cycsIFs4NjQ3XV0sIFsnbGVmdHJpZ2h0YXJyb3cnLCBbODU5Nl1dLCBbJ0xlZnRSaWdodEFycm93JywgWzg1OTZdXSwgWydMZWZ0cmlnaHRhcnJvdycsIFs4NjYwXV0sIFsnbGVmdHJpZ2h0YXJyb3dzJywgWzg2NDZdXSwgWydsZWZ0cmlnaHRoYXJwb29ucycsIFs4NjUxXV0sIFsnbGVmdHJpZ2h0c3F1aWdhcnJvdycsIFs4NjIxXV0sIFsnTGVmdFJpZ2h0VmVjdG9yJywgWzEwNTc0XV0sIFsnTGVmdFRlZUFycm93JywgWzg2MTJdXSwgWydMZWZ0VGVlJywgWzg4NjddXSwgWydMZWZ0VGVlVmVjdG9yJywgWzEwNTg2XV0sIFsnbGVmdHRocmVldGltZXMnLCBbODkwN11dLCBbJ0xlZnRUcmlhbmdsZUJhcicsIFsxMDcwM11dLCBbJ0xlZnRUcmlhbmdsZScsIFs4ODgyXV0sIFsnTGVmdFRyaWFuZ2xlRXF1YWwnLCBbODg4NF1dLCBbJ0xlZnRVcERvd25WZWN0b3InLCBbMTA1NzddXSwgWydMZWZ0VXBUZWVWZWN0b3InLCBbMTA1OTJdXSwgWydMZWZ0VXBWZWN0b3JCYXInLCBbMTA1ODRdXSwgWydMZWZ0VXBWZWN0b3InLCBbODYzOV1dLCBbJ0xlZnRWZWN0b3JCYXInLCBbMTA1NzhdXSwgWydMZWZ0VmVjdG9yJywgWzg2MzZdXSwgWydsRWcnLCBbMTA4OTFdXSwgWydsZWcnLCBbODkyMl1dLCBbJ2xlcScsIFs4ODA0XV0sIFsnbGVxcScsIFs4ODA2XV0sIFsnbGVxc2xhbnQnLCBbMTA4NzddXSwgWydsZXNjYycsIFsxMDkyMF1dLCBbJ2xlcycsIFsxMDg3N11dLCBbJ2xlc2RvdCcsIFsxMDg3OV1dLCBbJ2xlc2RvdG8nLCBbMTA4ODFdXSwgWydsZXNkb3RvcicsIFsxMDg4M11dLCBbJ2xlc2cnLCBbODkyMiwgNjUwMjRdXSwgWydsZXNnZXMnLCBbMTA4OTldXSwgWydsZXNzYXBwcm94JywgWzEwODg1XV0sIFsnbGVzc2RvdCcsIFs4OTE4XV0sIFsnbGVzc2VxZ3RyJywgWzg5MjJdXSwgWydsZXNzZXFxZ3RyJywgWzEwODkxXV0sIFsnTGVzc0VxdWFsR3JlYXRlcicsIFs4OTIyXV0sIFsnTGVzc0Z1bGxFcXVhbCcsIFs4ODA2XV0sIFsnTGVzc0dyZWF0ZXInLCBbODgyMl1dLCBbJ2xlc3NndHInLCBbODgyMl1dLCBbJ0xlc3NMZXNzJywgWzEwOTEzXV0sIFsnbGVzc3NpbScsIFs4ODE4XV0sIFsnTGVzc1NsYW50RXF1YWwnLCBbMTA4NzddXSwgWydMZXNzVGlsZGUnLCBbODgxOF1dLCBbJ2xmaXNodCcsIFsxMDYyMF1dLCBbJ2xmbG9vcicsIFs4OTcwXV0sIFsnTGZyJywgWzEyMDA3OV1dLCBbJ2xmcicsIFsxMjAxMDVdXSwgWydsZycsIFs4ODIyXV0sIFsnbGdFJywgWzEwODk3XV0sIFsnbEhhcicsIFsxMDU5NF1dLCBbJ2xoYXJkJywgWzg2MzddXSwgWydsaGFydScsIFs4NjM2XV0sIFsnbGhhcnVsJywgWzEwNjAyXV0sIFsnbGhibGsnLCBbOTYwNF1dLCBbJ0xKY3knLCBbMTAzM11dLCBbJ2xqY3knLCBbMTExM11dLCBbJ2xsYXJyJywgWzg2NDddXSwgWydsbCcsIFs4ODEwXV0sIFsnTGwnLCBbODkyMF1dLCBbJ2xsY29ybmVyJywgWzg5OTBdXSwgWydMbGVmdGFycm93JywgWzg2NjZdXSwgWydsbGhhcmQnLCBbMTA2MDNdXSwgWydsbHRyaScsIFs5NzIyXV0sIFsnTG1pZG90JywgWzMxOV1dLCBbJ2xtaWRvdCcsIFszMjBdXSwgWydsbW91c3RhY2hlJywgWzkxMzZdXSwgWydsbW91c3QnLCBbOTEzNl1dLCBbJ2xuYXAnLCBbMTA4ODldXSwgWydsbmFwcHJveCcsIFsxMDg4OV1dLCBbJ2xuZScsIFsxMDg4N11dLCBbJ2xuRScsIFs4ODA4XV0sIFsnbG5lcScsIFsxMDg4N11dLCBbJ2xuZXFxJywgWzg4MDhdXSwgWydsbnNpbScsIFs4OTM0XV0sIFsnbG9hbmcnLCBbMTAyMjBdXSwgWydsb2FycicsIFs4NzAxXV0sIFsnbG9icmsnLCBbMTAyMTRdXSwgWydsb25nbGVmdGFycm93JywgWzEwMjI5XV0sIFsnTG9uZ0xlZnRBcnJvdycsIFsxMDIyOV1dLCBbJ0xvbmdsZWZ0YXJyb3cnLCBbMTAyMzJdXSwgWydsb25nbGVmdHJpZ2h0YXJyb3cnLCBbMTAyMzFdXSwgWydMb25nTGVmdFJpZ2h0QXJyb3cnLCBbMTAyMzFdXSwgWydMb25nbGVmdHJpZ2h0YXJyb3cnLCBbMTAyMzRdXSwgWydsb25nbWFwc3RvJywgWzEwMjM2XV0sIFsnbG9uZ3JpZ2h0YXJyb3cnLCBbMTAyMzBdXSwgWydMb25nUmlnaHRBcnJvdycsIFsxMDIzMF1dLCBbJ0xvbmdyaWdodGFycm93JywgWzEwMjMzXV0sIFsnbG9vcGFycm93bGVmdCcsIFs4NjE5XV0sIFsnbG9vcGFycm93cmlnaHQnLCBbODYyMF1dLCBbJ2xvcGFyJywgWzEwNjI5XV0sIFsnTG9wZicsIFsxMjAxMzFdXSwgWydsb3BmJywgWzEyMDE1N11dLCBbJ2xvcGx1cycsIFsxMDc5N11dLCBbJ2xvdGltZXMnLCBbMTA4MDRdXSwgWydsb3dhc3QnLCBbODcyN11dLCBbJ2xvd2JhcicsIFs5NV1dLCBbJ0xvd2VyTGVmdEFycm93JywgWzg2MDFdXSwgWydMb3dlclJpZ2h0QXJyb3cnLCBbODYwMF1dLCBbJ2xveicsIFs5Njc0XV0sIFsnbG96ZW5nZScsIFs5Njc0XV0sIFsnbG96ZicsIFsxMDczMV1dLCBbJ2xwYXInLCBbNDBdXSwgWydscGFybHQnLCBbMTA2NDNdXSwgWydscmFycicsIFs4NjQ2XV0sIFsnbHJjb3JuZXInLCBbODk5MV1dLCBbJ2xyaGFyJywgWzg2NTFdXSwgWydscmhhcmQnLCBbMTA2MDVdXSwgWydscm0nLCBbODIwNl1dLCBbJ2xydHJpJywgWzg4OTVdXSwgWydsc2FxdW8nLCBbODI0OV1dLCBbJ2xzY3InLCBbMTIwMDAxXV0sIFsnTHNjcicsIFs4NDY2XV0sIFsnbHNoJywgWzg2MjRdXSwgWydMc2gnLCBbODYyNF1dLCBbJ2xzaW0nLCBbODgxOF1dLCBbJ2xzaW1lJywgWzEwODkzXV0sIFsnbHNpbWcnLCBbMTA4OTVdXSwgWydsc3FiJywgWzkxXV0sIFsnbHNxdW8nLCBbODIxNl1dLCBbJ2xzcXVvcicsIFs4MjE4XV0sIFsnTHN0cm9rJywgWzMyMV1dLCBbJ2xzdHJvaycsIFszMjJdXSwgWydsdGNjJywgWzEwOTE4XV0sIFsnbHRjaXInLCBbMTA4NzNdXSwgWydsdCcsIFs2MF1dLCBbJ0xUJywgWzYwXV0sIFsnTHQnLCBbODgxMF1dLCBbJ2x0ZG90JywgWzg5MThdXSwgWydsdGhyZWUnLCBbODkwN11dLCBbJ2x0aW1lcycsIFs4OTA1XV0sIFsnbHRsYXJyJywgWzEwNjE0XV0sIFsnbHRxdWVzdCcsIFsxMDg3NV1dLCBbJ2x0cmknLCBbOTY2N11dLCBbJ2x0cmllJywgWzg4ODRdXSwgWydsdHJpZicsIFs5NjY2XV0sIFsnbHRyUGFyJywgWzEwNjQ2XV0sIFsnbHVyZHNoYXInLCBbMTA1NzBdXSwgWydsdXJ1aGFyJywgWzEwNTk4XV0sIFsnbHZlcnRuZXFxJywgWzg4MDgsIDY1MDI0XV0sIFsnbHZuRScsIFs4ODA4LCA2NTAyNF1dLCBbJ21hY3InLCBbMTc1XV0sIFsnbWFsZScsIFs5Nzk0XV0sIFsnbWFsdCcsIFsxMDAxNl1dLCBbJ21hbHRlc2UnLCBbMTAwMTZdXSwgWydNYXAnLCBbMTA1MDFdXSwgWydtYXAnLCBbODYxNF1dLCBbJ21hcHN0bycsIFs4NjE0XV0sIFsnbWFwc3RvZG93bicsIFs4NjE1XV0sIFsnbWFwc3RvbGVmdCcsIFs4NjEyXV0sIFsnbWFwc3RvdXAnLCBbODYxM11dLCBbJ21hcmtlcicsIFs5NjQ2XV0sIFsnbWNvbW1hJywgWzEwNzkzXV0sIFsnTWN5JywgWzEwNTJdXSwgWydtY3knLCBbMTA4NF1dLCBbJ21kYXNoJywgWzgyMTJdXSwgWydtRERvdCcsIFs4NzYyXV0sIFsnbWVhc3VyZWRhbmdsZScsIFs4NzM3XV0sIFsnTWVkaXVtU3BhY2UnLCBbODI4N11dLCBbJ01lbGxpbnRyZicsIFs4NDk5XV0sIFsnTWZyJywgWzEyMDA4MF1dLCBbJ21mcicsIFsxMjAxMDZdXSwgWydtaG8nLCBbODQ4N11dLCBbJ21pY3JvJywgWzE4MV1dLCBbJ21pZGFzdCcsIFs0Ml1dLCBbJ21pZGNpcicsIFsxMDk5Ml1dLCBbJ21pZCcsIFs4NzM5XV0sIFsnbWlkZG90JywgWzE4M11dLCBbJ21pbnVzYicsIFs4ODYzXV0sIFsnbWludXMnLCBbODcyMl1dLCBbJ21pbnVzZCcsIFs4NzYwXV0sIFsnbWludXNkdScsIFsxMDc5NF1dLCBbJ01pbnVzUGx1cycsIFs4NzIzXV0sIFsnbWxjcCcsIFsxMDk3MV1dLCBbJ21sZHInLCBbODIzMF1dLCBbJ21ucGx1cycsIFs4NzIzXV0sIFsnbW9kZWxzJywgWzg4NzFdXSwgWydNb3BmJywgWzEyMDEzMl1dLCBbJ21vcGYnLCBbMTIwMTU4XV0sIFsnbXAnLCBbODcyM11dLCBbJ21zY3InLCBbMTIwMDAyXV0sIFsnTXNjcicsIFs4NDk5XV0sIFsnbXN0cG9zJywgWzg3NjZdXSwgWydNdScsIFs5MjRdXSwgWydtdScsIFs5NTZdXSwgWydtdWx0aW1hcCcsIFs4ODg4XV0sIFsnbXVtYXAnLCBbODg4OF1dLCBbJ25hYmxhJywgWzg3MTFdXSwgWydOYWN1dGUnLCBbMzIzXV0sIFsnbmFjdXRlJywgWzMyNF1dLCBbJ25hbmcnLCBbODczNiwgODQwMl1dLCBbJ25hcCcsIFs4Nzc3XV0sIFsnbmFwRScsIFsxMDg2NCwgODI0XV0sIFsnbmFwaWQnLCBbODc3OSwgODI0XV0sIFsnbmFwb3MnLCBbMzI5XV0sIFsnbmFwcHJveCcsIFs4Nzc3XV0sIFsnbmF0dXJhbCcsIFs5ODM4XV0sIFsnbmF0dXJhbHMnLCBbODQ2OV1dLCBbJ25hdHVyJywgWzk4MzhdXSwgWyduYnNwJywgWzE2MF1dLCBbJ25idW1wJywgWzg3ODIsIDgyNF1dLCBbJ25idW1wZScsIFs4NzgzLCA4MjRdXSwgWyduY2FwJywgWzEwODE5XV0sIFsnTmNhcm9uJywgWzMyN11dLCBbJ25jYXJvbicsIFszMjhdXSwgWydOY2VkaWwnLCBbMzI1XV0sIFsnbmNlZGlsJywgWzMyNl1dLCBbJ25jb25nJywgWzg3NzVdXSwgWyduY29uZ2RvdCcsIFsxMDg2MSwgODI0XV0sIFsnbmN1cCcsIFsxMDgxOF1dLCBbJ05jeScsIFsxMDUzXV0sIFsnbmN5JywgWzEwODVdXSwgWyduZGFzaCcsIFs4MjExXV0sIFsnbmVhcmhrJywgWzEwNTMyXV0sIFsnbmVhcnInLCBbODU5OV1dLCBbJ25lQXJyJywgWzg2NjNdXSwgWyduZWFycm93JywgWzg1OTldXSwgWyduZScsIFs4ODAwXV0sIFsnbmVkb3QnLCBbODc4NCwgODI0XV0sIFsnTmVnYXRpdmVNZWRpdW1TcGFjZScsIFs4MjAzXV0sIFsnTmVnYXRpdmVUaGlja1NwYWNlJywgWzgyMDNdXSwgWydOZWdhdGl2ZVRoaW5TcGFjZScsIFs4MjAzXV0sIFsnTmVnYXRpdmVWZXJ5VGhpblNwYWNlJywgWzgyMDNdXSwgWyduZXF1aXYnLCBbODgwMl1dLCBbJ25lc2VhcicsIFsxMDUzNl1dLCBbJ25lc2ltJywgWzg3NzAsIDgyNF1dLCBbJ05lc3RlZEdyZWF0ZXJHcmVhdGVyJywgWzg4MTFdXSwgWydOZXN0ZWRMZXNzTGVzcycsIFs4ODEwXV0sIFsnbmV4aXN0JywgWzg3MDhdXSwgWyduZXhpc3RzJywgWzg3MDhdXSwgWydOZnInLCBbMTIwMDgxXV0sIFsnbmZyJywgWzEyMDEwN11dLCBbJ25nRScsIFs4ODA3LCA4MjRdXSwgWyduZ2UnLCBbODgxN11dLCBbJ25nZXEnLCBbODgxN11dLCBbJ25nZXFxJywgWzg4MDcsIDgyNF1dLCBbJ25nZXFzbGFudCcsIFsxMDg3OCwgODI0XV0sIFsnbmdlcycsIFsxMDg3OCwgODI0XV0sIFsnbkdnJywgWzg5MjEsIDgyNF1dLCBbJ25nc2ltJywgWzg4MjFdXSwgWyduR3QnLCBbODgxMSwgODQwMl1dLCBbJ25ndCcsIFs4ODE1XV0sIFsnbmd0cicsIFs4ODE1XV0sIFsnbkd0dicsIFs4ODExLCA4MjRdXSwgWyduaGFycicsIFs4NjIyXV0sIFsnbmhBcnInLCBbODY1NF1dLCBbJ25ocGFyJywgWzEwOTk0XV0sIFsnbmknLCBbODcxNV1dLCBbJ25pcycsIFs4OTU2XV0sIFsnbmlzZCcsIFs4OTU0XV0sIFsnbml2JywgWzg3MTVdXSwgWydOSmN5JywgWzEwMzRdXSwgWyduamN5JywgWzExMTRdXSwgWydubGFycicsIFs4NjAyXV0sIFsnbmxBcnInLCBbODY1M11dLCBbJ25sZHInLCBbODIyOV1dLCBbJ25sRScsIFs4ODA2LCA4MjRdXSwgWydubGUnLCBbODgxNl1dLCBbJ25sZWZ0YXJyb3cnLCBbODYwMl1dLCBbJ25MZWZ0YXJyb3cnLCBbODY1M11dLCBbJ25sZWZ0cmlnaHRhcnJvdycsIFs4NjIyXV0sIFsnbkxlZnRyaWdodGFycm93JywgWzg2NTRdXSwgWydubGVxJywgWzg4MTZdXSwgWydubGVxcScsIFs4ODA2LCA4MjRdXSwgWydubGVxc2xhbnQnLCBbMTA4NzcsIDgyNF1dLCBbJ25sZXMnLCBbMTA4NzcsIDgyNF1dLCBbJ25sZXNzJywgWzg4MTRdXSwgWyduTGwnLCBbODkyMCwgODI0XV0sIFsnbmxzaW0nLCBbODgyMF1dLCBbJ25MdCcsIFs4ODEwLCA4NDAyXV0sIFsnbmx0JywgWzg4MTRdXSwgWydubHRyaScsIFs4OTM4XV0sIFsnbmx0cmllJywgWzg5NDBdXSwgWyduTHR2JywgWzg4MTAsIDgyNF1dLCBbJ25taWQnLCBbODc0MF1dLCBbJ05vQnJlYWsnLCBbODI4OF1dLCBbJ05vbkJyZWFraW5nU3BhY2UnLCBbMTYwXV0sIFsnbm9wZicsIFsxMjAxNTldXSwgWydOb3BmJywgWzg0NjldXSwgWydOb3QnLCBbMTA5ODhdXSwgWydub3QnLCBbMTcyXV0sIFsnTm90Q29uZ3J1ZW50JywgWzg4MDJdXSwgWydOb3RDdXBDYXAnLCBbODgxM11dLCBbJ05vdERvdWJsZVZlcnRpY2FsQmFyJywgWzg3NDJdXSwgWydOb3RFbGVtZW50JywgWzg3MTNdXSwgWydOb3RFcXVhbCcsIFs4ODAwXV0sIFsnTm90RXF1YWxUaWxkZScsIFs4NzcwLCA4MjRdXSwgWydOb3RFeGlzdHMnLCBbODcwOF1dLCBbJ05vdEdyZWF0ZXInLCBbODgxNV1dLCBbJ05vdEdyZWF0ZXJFcXVhbCcsIFs4ODE3XV0sIFsnTm90R3JlYXRlckZ1bGxFcXVhbCcsIFs4ODA3LCA4MjRdXSwgWydOb3RHcmVhdGVyR3JlYXRlcicsIFs4ODExLCA4MjRdXSwgWydOb3RHcmVhdGVyTGVzcycsIFs4ODI1XV0sIFsnTm90R3JlYXRlclNsYW50RXF1YWwnLCBbMTA4NzgsIDgyNF1dLCBbJ05vdEdyZWF0ZXJUaWxkZScsIFs4ODIxXV0sIFsnTm90SHVtcERvd25IdW1wJywgWzg3ODIsIDgyNF1dLCBbJ05vdEh1bXBFcXVhbCcsIFs4NzgzLCA4MjRdXSwgWydub3RpbicsIFs4NzEzXV0sIFsnbm90aW5kb3QnLCBbODk0OSwgODI0XV0sIFsnbm90aW5FJywgWzg5NTMsIDgyNF1dLCBbJ25vdGludmEnLCBbODcxM11dLCBbJ25vdGludmInLCBbODk1MV1dLCBbJ25vdGludmMnLCBbODk1MF1dLCBbJ05vdExlZnRUcmlhbmdsZUJhcicsIFsxMDcwMywgODI0XV0sIFsnTm90TGVmdFRyaWFuZ2xlJywgWzg5MzhdXSwgWydOb3RMZWZ0VHJpYW5nbGVFcXVhbCcsIFs4OTQwXV0sIFsnTm90TGVzcycsIFs4ODE0XV0sIFsnTm90TGVzc0VxdWFsJywgWzg4MTZdXSwgWydOb3RMZXNzR3JlYXRlcicsIFs4ODI0XV0sIFsnTm90TGVzc0xlc3MnLCBbODgxMCwgODI0XV0sIFsnTm90TGVzc1NsYW50RXF1YWwnLCBbMTA4NzcsIDgyNF1dLCBbJ05vdExlc3NUaWxkZScsIFs4ODIwXV0sIFsnTm90TmVzdGVkR3JlYXRlckdyZWF0ZXInLCBbMTA5MTQsIDgyNF1dLCBbJ05vdE5lc3RlZExlc3NMZXNzJywgWzEwOTEzLCA4MjRdXSwgWydub3RuaScsIFs4NzE2XV0sIFsnbm90bml2YScsIFs4NzE2XV0sIFsnbm90bml2YicsIFs4OTU4XV0sIFsnbm90bml2YycsIFs4OTU3XV0sIFsnTm90UHJlY2VkZXMnLCBbODgzMl1dLCBbJ05vdFByZWNlZGVzRXF1YWwnLCBbMTA5MjcsIDgyNF1dLCBbJ05vdFByZWNlZGVzU2xhbnRFcXVhbCcsIFs4OTI4XV0sIFsnTm90UmV2ZXJzZUVsZW1lbnQnLCBbODcxNl1dLCBbJ05vdFJpZ2h0VHJpYW5nbGVCYXInLCBbMTA3MDQsIDgyNF1dLCBbJ05vdFJpZ2h0VHJpYW5nbGUnLCBbODkzOV1dLCBbJ05vdFJpZ2h0VHJpYW5nbGVFcXVhbCcsIFs4OTQxXV0sIFsnTm90U3F1YXJlU3Vic2V0JywgWzg4NDcsIDgyNF1dLCBbJ05vdFNxdWFyZVN1YnNldEVxdWFsJywgWzg5MzBdXSwgWydOb3RTcXVhcmVTdXBlcnNldCcsIFs4ODQ4LCA4MjRdXSwgWydOb3RTcXVhcmVTdXBlcnNldEVxdWFsJywgWzg5MzFdXSwgWydOb3RTdWJzZXQnLCBbODgzNCwgODQwMl1dLCBbJ05vdFN1YnNldEVxdWFsJywgWzg4NDBdXSwgWydOb3RTdWNjZWVkcycsIFs4ODMzXV0sIFsnTm90U3VjY2VlZHNFcXVhbCcsIFsxMDkyOCwgODI0XV0sIFsnTm90U3VjY2VlZHNTbGFudEVxdWFsJywgWzg5MjldXSwgWydOb3RTdWNjZWVkc1RpbGRlJywgWzg4MzEsIDgyNF1dLCBbJ05vdFN1cGVyc2V0JywgWzg4MzUsIDg0MDJdXSwgWydOb3RTdXBlcnNldEVxdWFsJywgWzg4NDFdXSwgWydOb3RUaWxkZScsIFs4NzY5XV0sIFsnTm90VGlsZGVFcXVhbCcsIFs4NzcyXV0sIFsnTm90VGlsZGVGdWxsRXF1YWwnLCBbODc3NV1dLCBbJ05vdFRpbGRlVGlsZGUnLCBbODc3N11dLCBbJ05vdFZlcnRpY2FsQmFyJywgWzg3NDBdXSwgWyducGFyYWxsZWwnLCBbODc0Ml1dLCBbJ25wYXInLCBbODc0Ml1dLCBbJ25wYXJzbCcsIFsxMTAwNSwgODQyMV1dLCBbJ25wYXJ0JywgWzg3MDYsIDgyNF1dLCBbJ25wb2xpbnQnLCBbMTA3NzJdXSwgWyducHInLCBbODgzMl1dLCBbJ25wcmN1ZScsIFs4OTI4XV0sIFsnbnByZWMnLCBbODgzMl1dLCBbJ25wcmVjZXEnLCBbMTA5MjcsIDgyNF1dLCBbJ25wcmUnLCBbMTA5MjcsIDgyNF1dLCBbJ25yYXJyYycsIFsxMDU0NywgODI0XV0sIFsnbnJhcnInLCBbODYwM11dLCBbJ25yQXJyJywgWzg2NTVdXSwgWyducmFycncnLCBbODYwNSwgODI0XV0sIFsnbnJpZ2h0YXJyb3cnLCBbODYwM11dLCBbJ25SaWdodGFycm93JywgWzg2NTVdXSwgWyducnRyaScsIFs4OTM5XV0sIFsnbnJ0cmllJywgWzg5NDFdXSwgWyduc2MnLCBbODgzM11dLCBbJ25zY2N1ZScsIFs4OTI5XV0sIFsnbnNjZScsIFsxMDkyOCwgODI0XV0sIFsnTnNjcicsIFsxMTk5NzddXSwgWyduc2NyJywgWzEyMDAwM11dLCBbJ25zaG9ydG1pZCcsIFs4NzQwXV0sIFsnbnNob3J0cGFyYWxsZWwnLCBbODc0Ml1dLCBbJ25zaW0nLCBbODc2OV1dLCBbJ25zaW1lJywgWzg3NzJdXSwgWyduc2ltZXEnLCBbODc3Ml1dLCBbJ25zbWlkJywgWzg3NDBdXSwgWyduc3BhcicsIFs4NzQyXV0sIFsnbnNxc3ViZScsIFs4OTMwXV0sIFsnbnNxc3VwZScsIFs4OTMxXV0sIFsnbnN1YicsIFs4ODM2XV0sIFsnbnN1YkUnLCBbMTA5NDksIDgyNF1dLCBbJ25zdWJlJywgWzg4NDBdXSwgWyduc3Vic2V0JywgWzg4MzQsIDg0MDJdXSwgWyduc3Vic2V0ZXEnLCBbODg0MF1dLCBbJ25zdWJzZXRlcXEnLCBbMTA5NDksIDgyNF1dLCBbJ25zdWNjJywgWzg4MzNdXSwgWyduc3VjY2VxJywgWzEwOTI4LCA4MjRdXSwgWyduc3VwJywgWzg4MzddXSwgWyduc3VwRScsIFsxMDk1MCwgODI0XV0sIFsnbnN1cGUnLCBbODg0MV1dLCBbJ25zdXBzZXQnLCBbODgzNSwgODQwMl1dLCBbJ25zdXBzZXRlcScsIFs4ODQxXV0sIFsnbnN1cHNldGVxcScsIFsxMDk1MCwgODI0XV0sIFsnbnRnbCcsIFs4ODI1XV0sIFsnTnRpbGRlJywgWzIwOV1dLCBbJ250aWxkZScsIFsyNDFdXSwgWydudGxnJywgWzg4MjRdXSwgWydudHJpYW5nbGVsZWZ0JywgWzg5MzhdXSwgWydudHJpYW5nbGVsZWZ0ZXEnLCBbODk0MF1dLCBbJ250cmlhbmdsZXJpZ2h0JywgWzg5MzldXSwgWydudHJpYW5nbGVyaWdodGVxJywgWzg5NDFdXSwgWydOdScsIFs5MjVdXSwgWydudScsIFs5NTddXSwgWydudW0nLCBbMzVdXSwgWydudW1lcm8nLCBbODQ3MF1dLCBbJ251bXNwJywgWzgxOTldXSwgWydudmFwJywgWzg3ODEsIDg0MDJdXSwgWydudmRhc2gnLCBbODg3Nl1dLCBbJ252RGFzaCcsIFs4ODc3XV0sIFsnblZkYXNoJywgWzg4NzhdXSwgWyduVkRhc2gnLCBbODg3OV1dLCBbJ252Z2UnLCBbODgwNSwgODQwMl1dLCBbJ252Z3QnLCBbNjIsIDg0MDJdXSwgWydudkhhcnInLCBbMTA1MDBdXSwgWydudmluZmluJywgWzEwNzE4XV0sIFsnbnZsQXJyJywgWzEwNDk4XV0sIFsnbnZsZScsIFs4ODA0LCA4NDAyXV0sIFsnbnZsdCcsIFs2MCwgODQwMl1dLCBbJ252bHRyaWUnLCBbODg4NCwgODQwMl1dLCBbJ252ckFycicsIFsxMDQ5OV1dLCBbJ252cnRyaWUnLCBbODg4NSwgODQwMl1dLCBbJ252c2ltJywgWzg3NjQsIDg0MDJdXSwgWydud2FyaGsnLCBbMTA1MzFdXSwgWydud2FycicsIFs4NTk4XV0sIFsnbndBcnInLCBbODY2Ml1dLCBbJ253YXJyb3cnLCBbODU5OF1dLCBbJ253bmVhcicsIFsxMDUzNV1dLCBbJ09hY3V0ZScsIFsyMTFdXSwgWydvYWN1dGUnLCBbMjQzXV0sIFsnb2FzdCcsIFs4ODU5XV0sIFsnT2NpcmMnLCBbMjEyXV0sIFsnb2NpcmMnLCBbMjQ0XV0sIFsnb2NpcicsIFs4ODU4XV0sIFsnT2N5JywgWzEwNTRdXSwgWydvY3knLCBbMTA4Nl1dLCBbJ29kYXNoJywgWzg4NjFdXSwgWydPZGJsYWMnLCBbMzM2XV0sIFsnb2RibGFjJywgWzMzN11dLCBbJ29kaXYnLCBbMTA4MDhdXSwgWydvZG90JywgWzg4NTddXSwgWydvZHNvbGQnLCBbMTA2ODRdXSwgWydPRWxpZycsIFszMzhdXSwgWydvZWxpZycsIFszMzldXSwgWydvZmNpcicsIFsxMDY4N11dLCBbJ09mcicsIFsxMjAwODJdXSwgWydvZnInLCBbMTIwMTA4XV0sIFsnb2dvbicsIFs3MzFdXSwgWydPZ3JhdmUnLCBbMjEwXV0sIFsnb2dyYXZlJywgWzI0Ml1dLCBbJ29ndCcsIFsxMDY4OV1dLCBbJ29oYmFyJywgWzEwNjc3XV0sIFsnb2htJywgWzkzN11dLCBbJ29pbnQnLCBbODc1MF1dLCBbJ29sYXJyJywgWzg2MzRdXSwgWydvbGNpcicsIFsxMDY4Nl1dLCBbJ29sY3Jvc3MnLCBbMTA2ODNdXSwgWydvbGluZScsIFs4MjU0XV0sIFsnb2x0JywgWzEwNjg4XV0sIFsnT21hY3InLCBbMzMyXV0sIFsnb21hY3InLCBbMzMzXV0sIFsnT21lZ2EnLCBbOTM3XV0sIFsnb21lZ2EnLCBbOTY5XV0sIFsnT21pY3JvbicsIFs5MjddXSwgWydvbWljcm9uJywgWzk1OV1dLCBbJ29taWQnLCBbMTA2NzhdXSwgWydvbWludXMnLCBbODg1NF1dLCBbJ09vcGYnLCBbMTIwMTM0XV0sIFsnb29wZicsIFsxMjAxNjBdXSwgWydvcGFyJywgWzEwNjc5XV0sIFsnT3BlbkN1cmx5RG91YmxlUXVvdGUnLCBbODIyMF1dLCBbJ09wZW5DdXJseVF1b3RlJywgWzgyMTZdXSwgWydvcGVycCcsIFsxMDY4MV1dLCBbJ29wbHVzJywgWzg4NTNdXSwgWydvcmFycicsIFs4NjM1XV0sIFsnT3InLCBbMTA4MzZdXSwgWydvcicsIFs4NzQ0XV0sIFsnb3JkJywgWzEwODQ1XV0sIFsnb3JkZXInLCBbODUwMF1dLCBbJ29yZGVyb2YnLCBbODUwMF1dLCBbJ29yZGYnLCBbMTcwXV0sIFsnb3JkbScsIFsxODZdXSwgWydvcmlnb2YnLCBbODg4Nl1dLCBbJ29yb3InLCBbMTA4MzhdXSwgWydvcnNsb3BlJywgWzEwODM5XV0sIFsnb3J2JywgWzEwODQzXV0sIFsnb1MnLCBbOTQxNl1dLCBbJ09zY3InLCBbMTE5OTc4XV0sIFsnb3NjcicsIFs4NTAwXV0sIFsnT3NsYXNoJywgWzIxNl1dLCBbJ29zbGFzaCcsIFsyNDhdXSwgWydvc29sJywgWzg4NTZdXSwgWydPdGlsZGUnLCBbMjEzXV0sIFsnb3RpbGRlJywgWzI0NV1dLCBbJ290aW1lc2FzJywgWzEwODA2XV0sIFsnT3RpbWVzJywgWzEwODA3XV0sIFsnb3RpbWVzJywgWzg4NTVdXSwgWydPdW1sJywgWzIxNF1dLCBbJ291bWwnLCBbMjQ2XV0sIFsnb3ZiYXInLCBbOTAyMV1dLCBbJ092ZXJCYXInLCBbODI1NF1dLCBbJ092ZXJCcmFjZScsIFs5MTgyXV0sIFsnT3ZlckJyYWNrZXQnLCBbOTE0MF1dLCBbJ092ZXJQYXJlbnRoZXNpcycsIFs5MTgwXV0sIFsncGFyYScsIFsxODJdXSwgWydwYXJhbGxlbCcsIFs4NzQxXV0sIFsncGFyJywgWzg3NDFdXSwgWydwYXJzaW0nLCBbMTA5OTVdXSwgWydwYXJzbCcsIFsxMTAwNV1dLCBbJ3BhcnQnLCBbODcwNl1dLCBbJ1BhcnRpYWxEJywgWzg3MDZdXSwgWydQY3knLCBbMTA1NV1dLCBbJ3BjeScsIFsxMDg3XV0sIFsncGVyY250JywgWzM3XV0sIFsncGVyaW9kJywgWzQ2XV0sIFsncGVybWlsJywgWzgyNDBdXSwgWydwZXJwJywgWzg4NjldXSwgWydwZXJ0ZW5rJywgWzgyNDFdXSwgWydQZnInLCBbMTIwMDgzXV0sIFsncGZyJywgWzEyMDEwOV1dLCBbJ1BoaScsIFs5MzRdXSwgWydwaGknLCBbOTY2XV0sIFsncGhpdicsIFs5ODFdXSwgWydwaG1tYXQnLCBbODQ5OV1dLCBbJ3Bob25lJywgWzk3NDJdXSwgWydQaScsIFs5MjhdXSwgWydwaScsIFs5NjBdXSwgWydwaXRjaGZvcmsnLCBbODkxNl1dLCBbJ3BpdicsIFs5ODJdXSwgWydwbGFuY2snLCBbODQ2M11dLCBbJ3BsYW5ja2gnLCBbODQ2Ml1dLCBbJ3BsYW5rdicsIFs4NDYzXV0sIFsncGx1c2FjaXInLCBbMTA3ODddXSwgWydwbHVzYicsIFs4ODYyXV0sIFsncGx1c2NpcicsIFsxMDc4Nl1dLCBbJ3BsdXMnLCBbNDNdXSwgWydwbHVzZG8nLCBbODcyNF1dLCBbJ3BsdXNkdScsIFsxMDc4OV1dLCBbJ3BsdXNlJywgWzEwODY2XV0sIFsnUGx1c01pbnVzJywgWzE3N11dLCBbJ3BsdXNtbicsIFsxNzddXSwgWydwbHVzc2ltJywgWzEwNzkwXV0sIFsncGx1c3R3bycsIFsxMDc5MV1dLCBbJ3BtJywgWzE3N11dLCBbJ1BvaW5jYXJlcGxhbmUnLCBbODQ2MF1dLCBbJ3BvaW50aW50JywgWzEwNzczXV0sIFsncG9wZicsIFsxMjAxNjFdXSwgWydQb3BmJywgWzg0NzNdXSwgWydwb3VuZCcsIFsxNjNdXSwgWydwcmFwJywgWzEwOTM1XV0sIFsnUHInLCBbMTA5MzldXSwgWydwcicsIFs4ODI2XV0sIFsncHJjdWUnLCBbODgyOF1dLCBbJ3ByZWNhcHByb3gnLCBbMTA5MzVdXSwgWydwcmVjJywgWzg4MjZdXSwgWydwcmVjY3VybHllcScsIFs4ODI4XV0sIFsnUHJlY2VkZXMnLCBbODgyNl1dLCBbJ1ByZWNlZGVzRXF1YWwnLCBbMTA5MjddXSwgWydQcmVjZWRlc1NsYW50RXF1YWwnLCBbODgyOF1dLCBbJ1ByZWNlZGVzVGlsZGUnLCBbODgzMF1dLCBbJ3ByZWNlcScsIFsxMDkyN11dLCBbJ3ByZWNuYXBwcm94JywgWzEwOTM3XV0sIFsncHJlY25lcXEnLCBbMTA5MzNdXSwgWydwcmVjbnNpbScsIFs4OTM2XV0sIFsncHJlJywgWzEwOTI3XV0sIFsncHJFJywgWzEwOTMxXV0sIFsncHJlY3NpbScsIFs4ODMwXV0sIFsncHJpbWUnLCBbODI0Ml1dLCBbJ1ByaW1lJywgWzgyNDNdXSwgWydwcmltZXMnLCBbODQ3M11dLCBbJ3BybmFwJywgWzEwOTM3XV0sIFsncHJuRScsIFsxMDkzM11dLCBbJ3BybnNpbScsIFs4OTM2XV0sIFsncHJvZCcsIFs4NzE5XV0sIFsnUHJvZHVjdCcsIFs4NzE5XV0sIFsncHJvZmFsYXInLCBbOTAwNl1dLCBbJ3Byb2ZsaW5lJywgWzg5NzhdXSwgWydwcm9mc3VyZicsIFs4OTc5XV0sIFsncHJvcCcsIFs4NzMzXV0sIFsnUHJvcG9ydGlvbmFsJywgWzg3MzNdXSwgWydQcm9wb3J0aW9uJywgWzg3NTldXSwgWydwcm9wdG8nLCBbODczM11dLCBbJ3Byc2ltJywgWzg4MzBdXSwgWydwcnVyZWwnLCBbODg4MF1dLCBbJ1BzY3InLCBbMTE5OTc5XV0sIFsncHNjcicsIFsxMjAwMDVdXSwgWydQc2knLCBbOTM2XV0sIFsncHNpJywgWzk2OF1dLCBbJ3B1bmNzcCcsIFs4MjAwXV0sIFsnUWZyJywgWzEyMDA4NF1dLCBbJ3FmcicsIFsxMjAxMTBdXSwgWydxaW50JywgWzEwNzY0XV0sIFsncW9wZicsIFsxMjAxNjJdXSwgWydRb3BmJywgWzg0NzRdXSwgWydxcHJpbWUnLCBbODI3OV1dLCBbJ1FzY3InLCBbMTE5OTgwXV0sIFsncXNjcicsIFsxMjAwMDZdXSwgWydxdWF0ZXJuaW9ucycsIFs4NDYxXV0sIFsncXVhdGludCcsIFsxMDc3NF1dLCBbJ3F1ZXN0JywgWzYzXV0sIFsncXVlc3RlcScsIFs4Nzk5XV0sIFsncXVvdCcsIFszNF1dLCBbJ1FVT1QnLCBbMzRdXSwgWydyQWFycicsIFs4NjY3XV0sIFsncmFjZScsIFs4NzY1LCA4MTddXSwgWydSYWN1dGUnLCBbMzQwXV0sIFsncmFjdXRlJywgWzM0MV1dLCBbJ3JhZGljJywgWzg3MzBdXSwgWydyYWVtcHR5dicsIFsxMDY3NV1dLCBbJ3JhbmcnLCBbMTAyMTddXSwgWydSYW5nJywgWzEwMjE5XV0sIFsncmFuZ2QnLCBbMTA2NDJdXSwgWydyYW5nZScsIFsxMDY2MV1dLCBbJ3JhbmdsZScsIFsxMDIxN11dLCBbJ3JhcXVvJywgWzE4N11dLCBbJ3JhcnJhcCcsIFsxMDYxM11dLCBbJ3JhcnJiJywgWzg2NzddXSwgWydyYXJyYmZzJywgWzEwNTI4XV0sIFsncmFycmMnLCBbMTA1NDddXSwgWydyYXJyJywgWzg1OTRdXSwgWydSYXJyJywgWzg2MDhdXSwgWydyQXJyJywgWzg2NThdXSwgWydyYXJyZnMnLCBbMTA1MjZdXSwgWydyYXJyaGsnLCBbODYxOF1dLCBbJ3JhcnJscCcsIFs4NjIwXV0sIFsncmFycnBsJywgWzEwNTY1XV0sIFsncmFycnNpbScsIFsxMDYxMl1dLCBbJ1JhcnJ0bCcsIFsxMDUxOF1dLCBbJ3JhcnJ0bCcsIFs4NjExXV0sIFsncmFycncnLCBbODYwNV1dLCBbJ3JhdGFpbCcsIFsxMDUyMl1dLCBbJ3JBdGFpbCcsIFsxMDUyNF1dLCBbJ3JhdGlvJywgWzg3NThdXSwgWydyYXRpb25hbHMnLCBbODQ3NF1dLCBbJ3JiYXJyJywgWzEwNTA5XV0sIFsnckJhcnInLCBbMTA1MTFdXSwgWydSQmFycicsIFsxMDUxMl1dLCBbJ3JiYnJrJywgWzEwMDk5XV0sIFsncmJyYWNlJywgWzEyNV1dLCBbJ3JicmFjaycsIFs5M11dLCBbJ3JicmtlJywgWzEwNjM2XV0sIFsncmJya3NsZCcsIFsxMDYzOF1dLCBbJ3JicmtzbHUnLCBbMTA2NDBdXSwgWydSY2Fyb24nLCBbMzQ0XV0sIFsncmNhcm9uJywgWzM0NV1dLCBbJ1JjZWRpbCcsIFszNDJdXSwgWydyY2VkaWwnLCBbMzQzXV0sIFsncmNlaWwnLCBbODk2OV1dLCBbJ3JjdWInLCBbMTI1XV0sIFsnUmN5JywgWzEwNTZdXSwgWydyY3knLCBbMTA4OF1dLCBbJ3JkY2EnLCBbMTA1NTFdXSwgWydyZGxkaGFyJywgWzEwNjAxXV0sIFsncmRxdW8nLCBbODIyMV1dLCBbJ3JkcXVvcicsIFs4MjIxXV0sIFsncmRzaCcsIFs4NjI3XV0sIFsncmVhbCcsIFs4NDc2XV0sIFsncmVhbGluZScsIFs4NDc1XV0sIFsncmVhbHBhcnQnLCBbODQ3Nl1dLCBbJ3JlYWxzJywgWzg0NzddXSwgWydSZScsIFs4NDc2XV0sIFsncmVjdCcsIFs5NjQ1XV0sIFsncmVnJywgWzE3NF1dLCBbJ1JFRycsIFsxNzRdXSwgWydSZXZlcnNlRWxlbWVudCcsIFs4NzE1XV0sIFsnUmV2ZXJzZUVxdWlsaWJyaXVtJywgWzg2NTFdXSwgWydSZXZlcnNlVXBFcXVpbGlicml1bScsIFsxMDYwN11dLCBbJ3JmaXNodCcsIFsxMDYyMV1dLCBbJ3JmbG9vcicsIFs4OTcxXV0sIFsncmZyJywgWzEyMDExMV1dLCBbJ1JmcicsIFs4NDc2XV0sIFsnckhhcicsIFsxMDU5Nl1dLCBbJ3JoYXJkJywgWzg2NDFdXSwgWydyaGFydScsIFs4NjQwXV0sIFsncmhhcnVsJywgWzEwNjA0XV0sIFsnUmhvJywgWzkyOV1dLCBbJ3JobycsIFs5NjFdXSwgWydyaG92JywgWzEwMDldXSwgWydSaWdodEFuZ2xlQnJhY2tldCcsIFsxMDIxN11dLCBbJ1JpZ2h0QXJyb3dCYXInLCBbODY3N11dLCBbJ3JpZ2h0YXJyb3cnLCBbODU5NF1dLCBbJ1JpZ2h0QXJyb3cnLCBbODU5NF1dLCBbJ1JpZ2h0YXJyb3cnLCBbODY1OF1dLCBbJ1JpZ2h0QXJyb3dMZWZ0QXJyb3cnLCBbODY0NF1dLCBbJ3JpZ2h0YXJyb3d0YWlsJywgWzg2MTFdXSwgWydSaWdodENlaWxpbmcnLCBbODk2OV1dLCBbJ1JpZ2h0RG91YmxlQnJhY2tldCcsIFsxMDIxNV1dLCBbJ1JpZ2h0RG93blRlZVZlY3RvcicsIFsxMDU4OV1dLCBbJ1JpZ2h0RG93blZlY3RvckJhcicsIFsxMDU4MV1dLCBbJ1JpZ2h0RG93blZlY3RvcicsIFs4NjQyXV0sIFsnUmlnaHRGbG9vcicsIFs4OTcxXV0sIFsncmlnaHRoYXJwb29uZG93bicsIFs4NjQxXV0sIFsncmlnaHRoYXJwb29udXAnLCBbODY0MF1dLCBbJ3JpZ2h0bGVmdGFycm93cycsIFs4NjQ0XV0sIFsncmlnaHRsZWZ0aGFycG9vbnMnLCBbODY1Ml1dLCBbJ3JpZ2h0cmlnaHRhcnJvd3MnLCBbODY0OV1dLCBbJ3JpZ2h0c3F1aWdhcnJvdycsIFs4NjA1XV0sIFsnUmlnaHRUZWVBcnJvdycsIFs4NjE0XV0sIFsnUmlnaHRUZWUnLCBbODg2Nl1dLCBbJ1JpZ2h0VGVlVmVjdG9yJywgWzEwNTg3XV0sIFsncmlnaHR0aHJlZXRpbWVzJywgWzg5MDhdXSwgWydSaWdodFRyaWFuZ2xlQmFyJywgWzEwNzA0XV0sIFsnUmlnaHRUcmlhbmdsZScsIFs4ODgzXV0sIFsnUmlnaHRUcmlhbmdsZUVxdWFsJywgWzg4ODVdXSwgWydSaWdodFVwRG93blZlY3RvcicsIFsxMDU3NV1dLCBbJ1JpZ2h0VXBUZWVWZWN0b3InLCBbMTA1ODhdXSwgWydSaWdodFVwVmVjdG9yQmFyJywgWzEwNTgwXV0sIFsnUmlnaHRVcFZlY3RvcicsIFs4NjM4XV0sIFsnUmlnaHRWZWN0b3JCYXInLCBbMTA1NzldXSwgWydSaWdodFZlY3RvcicsIFs4NjQwXV0sIFsncmluZycsIFs3MzBdXSwgWydyaXNpbmdkb3RzZXEnLCBbODc4N11dLCBbJ3JsYXJyJywgWzg2NDRdXSwgWydybGhhcicsIFs4NjUyXV0sIFsncmxtJywgWzgyMDddXSwgWydybW91c3RhY2hlJywgWzkxMzddXSwgWydybW91c3QnLCBbOTEzN11dLCBbJ3JubWlkJywgWzEwOTkwXV0sIFsncm9hbmcnLCBbMTAyMjFdXSwgWydyb2FycicsIFs4NzAyXV0sIFsncm9icmsnLCBbMTAyMTVdXSwgWydyb3BhcicsIFsxMDYzMF1dLCBbJ3JvcGYnLCBbMTIwMTYzXV0sIFsnUm9wZicsIFs4NDc3XV0sIFsncm9wbHVzJywgWzEwNzk4XV0sIFsncm90aW1lcycsIFsxMDgwNV1dLCBbJ1JvdW5kSW1wbGllcycsIFsxMDYwOF1dLCBbJ3JwYXInLCBbNDFdXSwgWydycGFyZ3QnLCBbMTA2NDRdXSwgWydycHBvbGludCcsIFsxMDc3MF1dLCBbJ3JyYXJyJywgWzg2NDldXSwgWydScmlnaHRhcnJvdycsIFs4NjY3XV0sIFsncnNhcXVvJywgWzgyNTBdXSwgWydyc2NyJywgWzEyMDAwN11dLCBbJ1JzY3InLCBbODQ3NV1dLCBbJ3JzaCcsIFs4NjI1XV0sIFsnUnNoJywgWzg2MjVdXSwgWydyc3FiJywgWzkzXV0sIFsncnNxdW8nLCBbODIxN11dLCBbJ3JzcXVvcicsIFs4MjE3XV0sIFsncnRocmVlJywgWzg5MDhdXSwgWydydGltZXMnLCBbODkwNl1dLCBbJ3J0cmknLCBbOTY1N11dLCBbJ3J0cmllJywgWzg4ODVdXSwgWydydHJpZicsIFs5NjU2XV0sIFsncnRyaWx0cmknLCBbMTA3MDJdXSwgWydSdWxlRGVsYXllZCcsIFsxMDc0MF1dLCBbJ3J1bHVoYXInLCBbMTA2MDBdXSwgWydyeCcsIFs4NDc4XV0sIFsnU2FjdXRlJywgWzM0Nl1dLCBbJ3NhY3V0ZScsIFszNDddXSwgWydzYnF1bycsIFs4MjE4XV0sIFsnc2NhcCcsIFsxMDkzNl1dLCBbJ1NjYXJvbicsIFszNTJdXSwgWydzY2Fyb24nLCBbMzUzXV0sIFsnU2MnLCBbMTA5NDBdXSwgWydzYycsIFs4ODI3XV0sIFsnc2NjdWUnLCBbODgyOV1dLCBbJ3NjZScsIFsxMDkyOF1dLCBbJ3NjRScsIFsxMDkzMl1dLCBbJ1NjZWRpbCcsIFszNTBdXSwgWydzY2VkaWwnLCBbMzUxXV0sIFsnU2NpcmMnLCBbMzQ4XV0sIFsnc2NpcmMnLCBbMzQ5XV0sIFsnc2NuYXAnLCBbMTA5MzhdXSwgWydzY25FJywgWzEwOTM0XV0sIFsnc2Nuc2ltJywgWzg5MzddXSwgWydzY3BvbGludCcsIFsxMDc3MV1dLCBbJ3Njc2ltJywgWzg4MzFdXSwgWydTY3knLCBbMTA1N11dLCBbJ3NjeScsIFsxMDg5XV0sIFsnc2RvdGInLCBbODg2NV1dLCBbJ3Nkb3QnLCBbODkwMV1dLCBbJ3Nkb3RlJywgWzEwODU0XV0sIFsnc2VhcmhrJywgWzEwNTMzXV0sIFsnc2VhcnInLCBbODYwMF1dLCBbJ3NlQXJyJywgWzg2NjRdXSwgWydzZWFycm93JywgWzg2MDBdXSwgWydzZWN0JywgWzE2N11dLCBbJ3NlbWknLCBbNTldXSwgWydzZXN3YXInLCBbMTA1MzddXSwgWydzZXRtaW51cycsIFs4NzI2XV0sIFsnc2V0bW4nLCBbODcyNl1dLCBbJ3NleHQnLCBbMTAwMzhdXSwgWydTZnInLCBbMTIwMDg2XV0sIFsnc2ZyJywgWzEyMDExMl1dLCBbJ3Nmcm93bicsIFs4OTk0XV0sIFsnc2hhcnAnLCBbOTgzOV1dLCBbJ1NIQ0hjeScsIFsxMDY1XV0sIFsnc2hjaGN5JywgWzEwOTddXSwgWydTSGN5JywgWzEwNjRdXSwgWydzaGN5JywgWzEwOTZdXSwgWydTaG9ydERvd25BcnJvdycsIFs4NTk1XV0sIFsnU2hvcnRMZWZ0QXJyb3cnLCBbODU5Ml1dLCBbJ3Nob3J0bWlkJywgWzg3MzldXSwgWydzaG9ydHBhcmFsbGVsJywgWzg3NDFdXSwgWydTaG9ydFJpZ2h0QXJyb3cnLCBbODU5NF1dLCBbJ1Nob3J0VXBBcnJvdycsIFs4NTkzXV0sIFsnc2h5JywgWzE3M11dLCBbJ1NpZ21hJywgWzkzMV1dLCBbJ3NpZ21hJywgWzk2M11dLCBbJ3NpZ21hZicsIFs5NjJdXSwgWydzaWdtYXYnLCBbOTYyXV0sIFsnc2ltJywgWzg3NjRdXSwgWydzaW1kb3QnLCBbMTA4NThdXSwgWydzaW1lJywgWzg3NzFdXSwgWydzaW1lcScsIFs4NzcxXV0sIFsnc2ltZycsIFsxMDkxMF1dLCBbJ3NpbWdFJywgWzEwOTEyXV0sIFsnc2ltbCcsIFsxMDkwOV1dLCBbJ3NpbWxFJywgWzEwOTExXV0sIFsnc2ltbmUnLCBbODc3NF1dLCBbJ3NpbXBsdXMnLCBbMTA3ODhdXSwgWydzaW1yYXJyJywgWzEwNjEwXV0sIFsnc2xhcnInLCBbODU5Ml1dLCBbJ1NtYWxsQ2lyY2xlJywgWzg3MjhdXSwgWydzbWFsbHNldG1pbnVzJywgWzg3MjZdXSwgWydzbWFzaHAnLCBbMTA4MDNdXSwgWydzbWVwYXJzbCcsIFsxMDcyNF1dLCBbJ3NtaWQnLCBbODczOV1dLCBbJ3NtaWxlJywgWzg5OTVdXSwgWydzbXQnLCBbMTA5MjJdXSwgWydzbXRlJywgWzEwOTI0XV0sIFsnc210ZXMnLCBbMTA5MjQsIDY1MDI0XV0sIFsnU09GVGN5JywgWzEwNjhdXSwgWydzb2Z0Y3knLCBbMTEwMF1dLCBbJ3NvbGJhcicsIFs5MDIzXV0sIFsnc29sYicsIFsxMDY5Ml1dLCBbJ3NvbCcsIFs0N11dLCBbJ1NvcGYnLCBbMTIwMTM4XV0sIFsnc29wZicsIFsxMjAxNjRdXSwgWydzcGFkZXMnLCBbOTgyNF1dLCBbJ3NwYWRlc3VpdCcsIFs5ODI0XV0sIFsnc3BhcicsIFs4NzQxXV0sIFsnc3FjYXAnLCBbODg1MV1dLCBbJ3NxY2FwcycsIFs4ODUxLCA2NTAyNF1dLCBbJ3NxY3VwJywgWzg4NTJdXSwgWydzcWN1cHMnLCBbODg1MiwgNjUwMjRdXSwgWydTcXJ0JywgWzg3MzBdXSwgWydzcXN1YicsIFs4ODQ3XV0sIFsnc3FzdWJlJywgWzg4NDldXSwgWydzcXN1YnNldCcsIFs4ODQ3XV0sIFsnc3FzdWJzZXRlcScsIFs4ODQ5XV0sIFsnc3FzdXAnLCBbODg0OF1dLCBbJ3Nxc3VwZScsIFs4ODUwXV0sIFsnc3FzdXBzZXQnLCBbODg0OF1dLCBbJ3Nxc3Vwc2V0ZXEnLCBbODg1MF1dLCBbJ3NxdWFyZScsIFs5NjMzXV0sIFsnU3F1YXJlJywgWzk2MzNdXSwgWydTcXVhcmVJbnRlcnNlY3Rpb24nLCBbODg1MV1dLCBbJ1NxdWFyZVN1YnNldCcsIFs4ODQ3XV0sIFsnU3F1YXJlU3Vic2V0RXF1YWwnLCBbODg0OV1dLCBbJ1NxdWFyZVN1cGVyc2V0JywgWzg4NDhdXSwgWydTcXVhcmVTdXBlcnNldEVxdWFsJywgWzg4NTBdXSwgWydTcXVhcmVVbmlvbicsIFs4ODUyXV0sIFsnc3F1YXJmJywgWzk2NDJdXSwgWydzcXUnLCBbOTYzM11dLCBbJ3NxdWYnLCBbOTY0Ml1dLCBbJ3NyYXJyJywgWzg1OTRdXSwgWydTc2NyJywgWzExOTk4Ml1dLCBbJ3NzY3InLCBbMTIwMDA4XV0sIFsnc3NldG1uJywgWzg3MjZdXSwgWydzc21pbGUnLCBbODk5NV1dLCBbJ3NzdGFyZicsIFs4OTAyXV0sIFsnU3RhcicsIFs4OTAyXV0sIFsnc3RhcicsIFs5NzM0XV0sIFsnc3RhcmYnLCBbOTczM11dLCBbJ3N0cmFpZ2h0ZXBzaWxvbicsIFsxMDEzXV0sIFsnc3RyYWlnaHRwaGknLCBbOTgxXV0sIFsnc3RybnMnLCBbMTc1XV0sIFsnc3ViJywgWzg4MzRdXSwgWydTdWInLCBbODkxMl1dLCBbJ3N1YmRvdCcsIFsxMDk0MV1dLCBbJ3N1YkUnLCBbMTA5NDldXSwgWydzdWJlJywgWzg4MzhdXSwgWydzdWJlZG90JywgWzEwOTQ3XV0sIFsnc3VibXVsdCcsIFsxMDk0NV1dLCBbJ3N1Ym5FJywgWzEwOTU1XV0sIFsnc3VibmUnLCBbODg0Ml1dLCBbJ3N1YnBsdXMnLCBbMTA5NDNdXSwgWydzdWJyYXJyJywgWzEwNjE3XV0sIFsnc3Vic2V0JywgWzg4MzRdXSwgWydTdWJzZXQnLCBbODkxMl1dLCBbJ3N1YnNldGVxJywgWzg4MzhdXSwgWydzdWJzZXRlcXEnLCBbMTA5NDldXSwgWydTdWJzZXRFcXVhbCcsIFs4ODM4XV0sIFsnc3Vic2V0bmVxJywgWzg4NDJdXSwgWydzdWJzZXRuZXFxJywgWzEwOTU1XV0sIFsnc3Vic2ltJywgWzEwOTUxXV0sIFsnc3Vic3ViJywgWzEwOTY1XV0sIFsnc3Vic3VwJywgWzEwOTYzXV0sIFsnc3VjY2FwcHJveCcsIFsxMDkzNl1dLCBbJ3N1Y2MnLCBbODgyN11dLCBbJ3N1Y2NjdXJseWVxJywgWzg4MjldXSwgWydTdWNjZWVkcycsIFs4ODI3XV0sIFsnU3VjY2VlZHNFcXVhbCcsIFsxMDkyOF1dLCBbJ1N1Y2NlZWRzU2xhbnRFcXVhbCcsIFs4ODI5XV0sIFsnU3VjY2VlZHNUaWxkZScsIFs4ODMxXV0sIFsnc3VjY2VxJywgWzEwOTI4XV0sIFsnc3VjY25hcHByb3gnLCBbMTA5MzhdXSwgWydzdWNjbmVxcScsIFsxMDkzNF1dLCBbJ3N1Y2Nuc2ltJywgWzg5MzddXSwgWydzdWNjc2ltJywgWzg4MzFdXSwgWydTdWNoVGhhdCcsIFs4NzE1XV0sIFsnc3VtJywgWzg3MjFdXSwgWydTdW0nLCBbODcyMV1dLCBbJ3N1bmcnLCBbOTgzNF1dLCBbJ3N1cDEnLCBbMTg1XV0sIFsnc3VwMicsIFsxNzhdXSwgWydzdXAzJywgWzE3OV1dLCBbJ3N1cCcsIFs4ODM1XV0sIFsnU3VwJywgWzg5MTNdXSwgWydzdXBkb3QnLCBbMTA5NDJdXSwgWydzdXBkc3ViJywgWzEwOTY4XV0sIFsnc3VwRScsIFsxMDk1MF1dLCBbJ3N1cGUnLCBbODgzOV1dLCBbJ3N1cGVkb3QnLCBbMTA5NDhdXSwgWydTdXBlcnNldCcsIFs4ODM1XV0sIFsnU3VwZXJzZXRFcXVhbCcsIFs4ODM5XV0sIFsnc3VwaHNvbCcsIFsxMDE4NV1dLCBbJ3N1cGhzdWInLCBbMTA5NjddXSwgWydzdXBsYXJyJywgWzEwNjE5XV0sIFsnc3VwbXVsdCcsIFsxMDk0Nl1dLCBbJ3N1cG5FJywgWzEwOTU2XV0sIFsnc3VwbmUnLCBbODg0M11dLCBbJ3N1cHBsdXMnLCBbMTA5NDRdXSwgWydzdXBzZXQnLCBbODgzNV1dLCBbJ1N1cHNldCcsIFs4OTEzXV0sIFsnc3Vwc2V0ZXEnLCBbODgzOV1dLCBbJ3N1cHNldGVxcScsIFsxMDk1MF1dLCBbJ3N1cHNldG5lcScsIFs4ODQzXV0sIFsnc3Vwc2V0bmVxcScsIFsxMDk1Nl1dLCBbJ3N1cHNpbScsIFsxMDk1Ml1dLCBbJ3N1cHN1YicsIFsxMDk2NF1dLCBbJ3N1cHN1cCcsIFsxMDk2Nl1dLCBbJ3N3YXJoaycsIFsxMDUzNF1dLCBbJ3N3YXJyJywgWzg2MDFdXSwgWydzd0FycicsIFs4NjY1XV0sIFsnc3dhcnJvdycsIFs4NjAxXV0sIFsnc3dud2FyJywgWzEwNTM4XV0sIFsnc3psaWcnLCBbMjIzXV0sIFsnVGFiJywgWzldXSwgWyd0YXJnZXQnLCBbODk4Ml1dLCBbJ1RhdScsIFs5MzJdXSwgWyd0YXUnLCBbOTY0XV0sIFsndGJyaycsIFs5MTQwXV0sIFsnVGNhcm9uJywgWzM1Nl1dLCBbJ3RjYXJvbicsIFszNTddXSwgWydUY2VkaWwnLCBbMzU0XV0sIFsndGNlZGlsJywgWzM1NV1dLCBbJ1RjeScsIFsxMDU4XV0sIFsndGN5JywgWzEwOTBdXSwgWyd0ZG90JywgWzg0MTFdXSwgWyd0ZWxyZWMnLCBbODk4MV1dLCBbJ1RmcicsIFsxMjAwODddXSwgWyd0ZnInLCBbMTIwMTEzXV0sIFsndGhlcmU0JywgWzg3NTZdXSwgWyd0aGVyZWZvcmUnLCBbODc1Nl1dLCBbJ1RoZXJlZm9yZScsIFs4NzU2XV0sIFsnVGhldGEnLCBbOTIwXV0sIFsndGhldGEnLCBbOTUyXV0sIFsndGhldGFzeW0nLCBbOTc3XV0sIFsndGhldGF2JywgWzk3N11dLCBbJ3RoaWNrYXBwcm94JywgWzg3NzZdXSwgWyd0aGlja3NpbScsIFs4NzY0XV0sIFsnVGhpY2tTcGFjZScsIFs4Mjg3LCA4MjAyXV0sIFsnVGhpblNwYWNlJywgWzgyMDFdXSwgWyd0aGluc3AnLCBbODIwMV1dLCBbJ3Roa2FwJywgWzg3NzZdXSwgWyd0aGtzaW0nLCBbODc2NF1dLCBbJ1RIT1JOJywgWzIyMl1dLCBbJ3Rob3JuJywgWzI1NF1dLCBbJ3RpbGRlJywgWzczMl1dLCBbJ1RpbGRlJywgWzg3NjRdXSwgWydUaWxkZUVxdWFsJywgWzg3NzFdXSwgWydUaWxkZUZ1bGxFcXVhbCcsIFs4NzczXV0sIFsnVGlsZGVUaWxkZScsIFs4Nzc2XV0sIFsndGltZXNiYXInLCBbMTA4MDFdXSwgWyd0aW1lc2InLCBbODg2NF1dLCBbJ3RpbWVzJywgWzIxNV1dLCBbJ3RpbWVzZCcsIFsxMDgwMF1dLCBbJ3RpbnQnLCBbODc0OV1dLCBbJ3RvZWEnLCBbMTA1MzZdXSwgWyd0b3Bib3QnLCBbOTAxNF1dLCBbJ3RvcGNpcicsIFsxMDk5M11dLCBbJ3RvcCcsIFs4ODY4XV0sIFsnVG9wZicsIFsxMjAxMzldXSwgWyd0b3BmJywgWzEyMDE2NV1dLCBbJ3RvcGZvcmsnLCBbMTA5NzBdXSwgWyd0b3NhJywgWzEwNTM3XV0sIFsndHByaW1lJywgWzgyNDRdXSwgWyd0cmFkZScsIFs4NDgyXV0sIFsnVFJBREUnLCBbODQ4Ml1dLCBbJ3RyaWFuZ2xlJywgWzk2NTNdXSwgWyd0cmlhbmdsZWRvd24nLCBbOTY2M11dLCBbJ3RyaWFuZ2xlbGVmdCcsIFs5NjY3XV0sIFsndHJpYW5nbGVsZWZ0ZXEnLCBbODg4NF1dLCBbJ3RyaWFuZ2xlcScsIFs4Nzk2XV0sIFsndHJpYW5nbGVyaWdodCcsIFs5NjU3XV0sIFsndHJpYW5nbGVyaWdodGVxJywgWzg4ODVdXSwgWyd0cmlkb3QnLCBbOTcwOF1dLCBbJ3RyaWUnLCBbODc5Nl1dLCBbJ3RyaW1pbnVzJywgWzEwODEwXV0sIFsnVHJpcGxlRG90JywgWzg0MTFdXSwgWyd0cmlwbHVzJywgWzEwODA5XV0sIFsndHJpc2InLCBbMTA3MDFdXSwgWyd0cml0aW1lJywgWzEwODExXV0sIFsndHJwZXppdW0nLCBbOTE4Nl1dLCBbJ1RzY3InLCBbMTE5OTgzXV0sIFsndHNjcicsIFsxMjAwMDldXSwgWydUU2N5JywgWzEwNjJdXSwgWyd0c2N5JywgWzEwOTRdXSwgWydUU0hjeScsIFsxMDM1XV0sIFsndHNoY3knLCBbMTExNV1dLCBbJ1RzdHJvaycsIFszNThdXSwgWyd0c3Ryb2snLCBbMzU5XV0sIFsndHdpeHQnLCBbODgxMl1dLCBbJ3R3b2hlYWRsZWZ0YXJyb3cnLCBbODYwNl1dLCBbJ3R3b2hlYWRyaWdodGFycm93JywgWzg2MDhdXSwgWydVYWN1dGUnLCBbMjE4XV0sIFsndWFjdXRlJywgWzI1MF1dLCBbJ3VhcnInLCBbODU5M11dLCBbJ1VhcnInLCBbODYwN11dLCBbJ3VBcnInLCBbODY1N11dLCBbJ1VhcnJvY2lyJywgWzEwNTY5XV0sIFsnVWJyY3knLCBbMTAzOF1dLCBbJ3VicmN5JywgWzExMThdXSwgWydVYnJldmUnLCBbMzY0XV0sIFsndWJyZXZlJywgWzM2NV1dLCBbJ1VjaXJjJywgWzIxOV1dLCBbJ3VjaXJjJywgWzI1MV1dLCBbJ1VjeScsIFsxMDU5XV0sIFsndWN5JywgWzEwOTFdXSwgWyd1ZGFycicsIFs4NjQ1XV0sIFsnVWRibGFjJywgWzM2OF1dLCBbJ3VkYmxhYycsIFszNjldXSwgWyd1ZGhhcicsIFsxMDYwNl1dLCBbJ3VmaXNodCcsIFsxMDYyMl1dLCBbJ1VmcicsIFsxMjAwODhdXSwgWyd1ZnInLCBbMTIwMTE0XV0sIFsnVWdyYXZlJywgWzIxN11dLCBbJ3VncmF2ZScsIFsyNDldXSwgWyd1SGFyJywgWzEwNTk1XV0sIFsndWhhcmwnLCBbODYzOV1dLCBbJ3VoYXJyJywgWzg2MzhdXSwgWyd1aGJsaycsIFs5NjAwXV0sIFsndWxjb3JuJywgWzg5ODhdXSwgWyd1bGNvcm5lcicsIFs4OTg4XV0sIFsndWxjcm9wJywgWzg5NzVdXSwgWyd1bHRyaScsIFs5NzIwXV0sIFsnVW1hY3InLCBbMzYyXV0sIFsndW1hY3InLCBbMzYzXV0sIFsndW1sJywgWzE2OF1dLCBbJ1VuZGVyQmFyJywgWzk1XV0sIFsnVW5kZXJCcmFjZScsIFs5MTgzXV0sIFsnVW5kZXJCcmFja2V0JywgWzkxNDFdXSwgWydVbmRlclBhcmVudGhlc2lzJywgWzkxODFdXSwgWydVbmlvbicsIFs4ODk5XV0sIFsnVW5pb25QbHVzJywgWzg4NDZdXSwgWydVb2dvbicsIFszNzBdXSwgWyd1b2dvbicsIFszNzFdXSwgWydVb3BmJywgWzEyMDE0MF1dLCBbJ3VvcGYnLCBbMTIwMTY2XV0sIFsnVXBBcnJvd0JhcicsIFsxMDUxNF1dLCBbJ3VwYXJyb3cnLCBbODU5M11dLCBbJ1VwQXJyb3cnLCBbODU5M11dLCBbJ1VwYXJyb3cnLCBbODY1N11dLCBbJ1VwQXJyb3dEb3duQXJyb3cnLCBbODY0NV1dLCBbJ3VwZG93bmFycm93JywgWzg1OTddXSwgWydVcERvd25BcnJvdycsIFs4NTk3XV0sIFsnVXBkb3duYXJyb3cnLCBbODY2MV1dLCBbJ1VwRXF1aWxpYnJpdW0nLCBbMTA2MDZdXSwgWyd1cGhhcnBvb25sZWZ0JywgWzg2MzldXSwgWyd1cGhhcnBvb25yaWdodCcsIFs4NjM4XV0sIFsndXBsdXMnLCBbODg0Nl1dLCBbJ1VwcGVyTGVmdEFycm93JywgWzg1OThdXSwgWydVcHBlclJpZ2h0QXJyb3cnLCBbODU5OV1dLCBbJ3Vwc2knLCBbOTY1XV0sIFsnVXBzaScsIFs5NzhdXSwgWyd1cHNpaCcsIFs5NzhdXSwgWydVcHNpbG9uJywgWzkzM11dLCBbJ3Vwc2lsb24nLCBbOTY1XV0sIFsnVXBUZWVBcnJvdycsIFs4NjEzXV0sIFsnVXBUZWUnLCBbODg2OV1dLCBbJ3VwdXBhcnJvd3MnLCBbODY0OF1dLCBbJ3VyY29ybicsIFs4OTg5XV0sIFsndXJjb3JuZXInLCBbODk4OV1dLCBbJ3VyY3JvcCcsIFs4OTc0XV0sIFsnVXJpbmcnLCBbMzY2XV0sIFsndXJpbmcnLCBbMzY3XV0sIFsndXJ0cmknLCBbOTcyMV1dLCBbJ1VzY3InLCBbMTE5OTg0XV0sIFsndXNjcicsIFsxMjAwMTBdXSwgWyd1dGRvdCcsIFs4OTQ0XV0sIFsnVXRpbGRlJywgWzM2MF1dLCBbJ3V0aWxkZScsIFszNjFdXSwgWyd1dHJpJywgWzk2NTNdXSwgWyd1dHJpZicsIFs5NjUyXV0sIFsndXVhcnInLCBbODY0OF1dLCBbJ1V1bWwnLCBbMjIwXV0sIFsndXVtbCcsIFsyNTJdXSwgWyd1d2FuZ2xlJywgWzEwNjYzXV0sIFsndmFuZ3J0JywgWzEwNjUyXV0sIFsndmFyZXBzaWxvbicsIFsxMDEzXV0sIFsndmFya2FwcGEnLCBbMTAwOF1dLCBbJ3Zhcm5vdGhpbmcnLCBbODcwOV1dLCBbJ3ZhcnBoaScsIFs5ODFdXSwgWyd2YXJwaScsIFs5ODJdXSwgWyd2YXJwcm9wdG8nLCBbODczM11dLCBbJ3ZhcnInLCBbODU5N11dLCBbJ3ZBcnInLCBbODY2MV1dLCBbJ3ZhcnJobycsIFsxMDA5XV0sIFsndmFyc2lnbWEnLCBbOTYyXV0sIFsndmFyc3Vic2V0bmVxJywgWzg4NDIsIDY1MDI0XV0sIFsndmFyc3Vic2V0bmVxcScsIFsxMDk1NSwgNjUwMjRdXSwgWyd2YXJzdXBzZXRuZXEnLCBbODg0MywgNjUwMjRdXSwgWyd2YXJzdXBzZXRuZXFxJywgWzEwOTU2LCA2NTAyNF1dLCBbJ3ZhcnRoZXRhJywgWzk3N11dLCBbJ3ZhcnRyaWFuZ2xlbGVmdCcsIFs4ODgyXV0sIFsndmFydHJpYW5nbGVyaWdodCcsIFs4ODgzXV0sIFsndkJhcicsIFsxMDk4NF1dLCBbJ1ZiYXInLCBbMTA5ODddXSwgWyd2QmFydicsIFsxMDk4NV1dLCBbJ1ZjeScsIFsxMDQyXV0sIFsndmN5JywgWzEwNzRdXSwgWyd2ZGFzaCcsIFs4ODY2XV0sIFsndkRhc2gnLCBbODg3Ml1dLCBbJ1ZkYXNoJywgWzg4NzNdXSwgWydWRGFzaCcsIFs4ODc1XV0sIFsnVmRhc2hsJywgWzEwOTgyXV0sIFsndmVlYmFyJywgWzg4OTFdXSwgWyd2ZWUnLCBbODc0NF1dLCBbJ1ZlZScsIFs4ODk3XV0sIFsndmVlZXEnLCBbODc5NF1dLCBbJ3ZlbGxpcCcsIFs4OTQyXV0sIFsndmVyYmFyJywgWzEyNF1dLCBbJ1ZlcmJhcicsIFs4MjE0XV0sIFsndmVydCcsIFsxMjRdXSwgWydWZXJ0JywgWzgyMTRdXSwgWydWZXJ0aWNhbEJhcicsIFs4NzM5XV0sIFsnVmVydGljYWxMaW5lJywgWzEyNF1dLCBbJ1ZlcnRpY2FsU2VwYXJhdG9yJywgWzEwMDcyXV0sIFsnVmVydGljYWxUaWxkZScsIFs4NzY4XV0sIFsnVmVyeVRoaW5TcGFjZScsIFs4MjAyXV0sIFsnVmZyJywgWzEyMDA4OV1dLCBbJ3ZmcicsIFsxMjAxMTVdXSwgWyd2bHRyaScsIFs4ODgyXV0sIFsndm5zdWInLCBbODgzNCwgODQwMl1dLCBbJ3Zuc3VwJywgWzg4MzUsIDg0MDJdXSwgWydWb3BmJywgWzEyMDE0MV1dLCBbJ3ZvcGYnLCBbMTIwMTY3XV0sIFsndnByb3AnLCBbODczM11dLCBbJ3ZydHJpJywgWzg4ODNdXSwgWydWc2NyJywgWzExOTk4NV1dLCBbJ3ZzY3InLCBbMTIwMDExXV0sIFsndnN1Ym5FJywgWzEwOTU1LCA2NTAyNF1dLCBbJ3ZzdWJuZScsIFs4ODQyLCA2NTAyNF1dLCBbJ3ZzdXBuRScsIFsxMDk1NiwgNjUwMjRdXSwgWyd2c3VwbmUnLCBbODg0MywgNjUwMjRdXSwgWydWdmRhc2gnLCBbODg3NF1dLCBbJ3Z6aWd6YWcnLCBbMTA2NTBdXSwgWydXY2lyYycsIFszNzJdXSwgWyd3Y2lyYycsIFszNzNdXSwgWyd3ZWRiYXInLCBbMTA4NDddXSwgWyd3ZWRnZScsIFs4NzQzXV0sIFsnV2VkZ2UnLCBbODg5Nl1dLCBbJ3dlZGdlcScsIFs4NzkzXV0sIFsnd2VpZXJwJywgWzg0NzJdXSwgWydXZnInLCBbMTIwMDkwXV0sIFsnd2ZyJywgWzEyMDExNl1dLCBbJ1dvcGYnLCBbMTIwMTQyXV0sIFsnd29wZicsIFsxMjAxNjhdXSwgWyd3cCcsIFs4NDcyXV0sIFsnd3InLCBbODc2OF1dLCBbJ3dyZWF0aCcsIFs4NzY4XV0sIFsnV3NjcicsIFsxMTk5ODZdXSwgWyd3c2NyJywgWzEyMDAxMl1dLCBbJ3hjYXAnLCBbODg5OF1dLCBbJ3hjaXJjJywgWzk3MTFdXSwgWyd4Y3VwJywgWzg4OTldXSwgWyd4ZHRyaScsIFs5NjYxXV0sIFsnWGZyJywgWzEyMDA5MV1dLCBbJ3hmcicsIFsxMjAxMTddXSwgWyd4aGFycicsIFsxMDIzMV1dLCBbJ3hoQXJyJywgWzEwMjM0XV0sIFsnWGknLCBbOTI2XV0sIFsneGknLCBbOTU4XV0sIFsneGxhcnInLCBbMTAyMjldXSwgWyd4bEFycicsIFsxMDIzMl1dLCBbJ3htYXAnLCBbMTAyMzZdXSwgWyd4bmlzJywgWzg5NTVdXSwgWyd4b2RvdCcsIFsxMDc1Ml1dLCBbJ1hvcGYnLCBbMTIwMTQzXV0sIFsneG9wZicsIFsxMjAxNjldXSwgWyd4b3BsdXMnLCBbMTA3NTNdXSwgWyd4b3RpbWUnLCBbMTA3NTRdXSwgWyd4cmFycicsIFsxMDIzMF1dLCBbJ3hyQXJyJywgWzEwMjMzXV0sIFsnWHNjcicsIFsxMTk5ODddXSwgWyd4c2NyJywgWzEyMDAxM11dLCBbJ3hzcWN1cCcsIFsxMDc1OF1dLCBbJ3h1cGx1cycsIFsxMDc1Nl1dLCBbJ3h1dHJpJywgWzk2NTFdXSwgWyd4dmVlJywgWzg4OTddXSwgWyd4d2VkZ2UnLCBbODg5Nl1dLCBbJ1lhY3V0ZScsIFsyMjFdXSwgWyd5YWN1dGUnLCBbMjUzXV0sIFsnWUFjeScsIFsxMDcxXV0sIFsneWFjeScsIFsxMTAzXV0sIFsnWWNpcmMnLCBbMzc0XV0sIFsneWNpcmMnLCBbMzc1XV0sIFsnWWN5JywgWzEwNjddXSwgWyd5Y3knLCBbMTA5OV1dLCBbJ3llbicsIFsxNjVdXSwgWydZZnInLCBbMTIwMDkyXV0sIFsneWZyJywgWzEyMDExOF1dLCBbJ1lJY3knLCBbMTAzMV1dLCBbJ3lpY3knLCBbMTExMV1dLCBbJ1lvcGYnLCBbMTIwMTQ0XV0sIFsneW9wZicsIFsxMjAxNzBdXSwgWydZc2NyJywgWzExOTk4OF1dLCBbJ3lzY3InLCBbMTIwMDE0XV0sIFsnWVVjeScsIFsxMDcwXV0sIFsneXVjeScsIFsxMTAyXV0sIFsneXVtbCcsIFsyNTVdXSwgWydZdW1sJywgWzM3Nl1dLCBbJ1phY3V0ZScsIFszNzddXSwgWyd6YWN1dGUnLCBbMzc4XV0sIFsnWmNhcm9uJywgWzM4MV1dLCBbJ3pjYXJvbicsIFszODJdXSwgWydaY3knLCBbMTA0N11dLCBbJ3pjeScsIFsxMDc5XV0sIFsnWmRvdCcsIFszNzldXSwgWyd6ZG90JywgWzM4MF1dLCBbJ3plZXRyZicsIFs4NDg4XV0sIFsnWmVyb1dpZHRoU3BhY2UnLCBbODIwM11dLCBbJ1pldGEnLCBbOTE4XV0sIFsnemV0YScsIFs5NTBdXSwgWyd6ZnInLCBbMTIwMTE5XV0sIFsnWmZyJywgWzg0ODhdXSwgWydaSGN5JywgWzEwNDZdXSwgWyd6aGN5JywgWzEwNzhdXSwgWyd6aWdyYXJyJywgWzg2NjldXSwgWyd6b3BmJywgWzEyMDE3MV1dLCBbJ1pvcGYnLCBbODQ4NF1dLCBbJ1pzY3InLCBbMTE5OTg5XV0sIFsnenNjcicsIFsxMjAwMTVdXSwgWyd6d2onLCBbODIwNV1dLCBbJ3p3bmonLCBbODIwNF1dXTtcblxudmFyIGFscGhhSW5kZXggPSB7fTtcbnZhciBjaGFySW5kZXggPSB7fTtcblxuY3JlYXRlSW5kZXhlcyhhbHBoYUluZGV4LCBjaGFySW5kZXgpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIdG1sNUVudGl0aWVzKCkge31cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvJigjP1tcXHdcXGRdKyk7Py9nLCBmdW5jdGlvbihzLCBlbnRpdHkpIHtcbiAgICAgICAgdmFyIGNocjtcbiAgICAgICAgaWYgKGVudGl0eS5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICB2YXIgY29kZSA9IGVudGl0eS5jaGFyQXQoMSkgPT09ICd4JyA/XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZW50aXR5LnN1YnN0cigyKS50b0xvd2VyQ2FzZSgpLCAxNikgOlxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGVudGl0eS5zdWJzdHIoMSkpO1xuXG4gICAgICAgICAgICBpZiAoIShpc05hTihjb2RlKSB8fCBjb2RlIDwgLTMyNzY4IHx8IGNvZGUgPiA2NTUzNSkpIHtcbiAgICAgICAgICAgICAgICBjaHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hyID0gYWxwaGFJbmRleFtlbnRpdHldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaHIgfHwgcztcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZGVjb2RlKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICBpZiAoc3RyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgY2hhckluZm8gPSBjaGFySW5kZXhbc3RyLmNoYXJDb2RlQXQoaSldO1xuICAgICAgICBpZiAoY2hhckluZm8pIHtcbiAgICAgICAgICAgIHZhciBhbHBoYSA9IGNoYXJJbmZvW3N0ci5jaGFyQ29kZUF0KGkgKyAxKV07XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFscGhhID0gY2hhckluZm9bJyddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZW5jb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZW5jb2RlKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICBpZiAoc3RyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgY2hhckluZm8gPSBjaGFySW5kZXhbY107XG4gICAgICAgIGlmIChjaGFySW5mbykge1xuICAgICAgICAgICAgdmFyIGFscGhhID0gY2hhckluZm9bc3RyLmNoYXJDb2RlQXQoaSArIDEpXTtcbiAgICAgICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxwaGEgPSBjaGFySW5mb1snJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYyA8IDMyIHx8IGMgPiAxMjYpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnJiMnICsgYyArICc7JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZW5jb2RlTm9uVVRGKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIGlmIChzdHJMZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDw9IDI1NSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0cltpKytdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9ICcmIycgKyBjICsgJzsnO1xuICAgICAgICBpKytcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw1RW50aXRpZXMoKS5lbmNvZGVOb25BU0NJSShzdHIpO1xuIH07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGFscGhhSW5kZXggUGFzc2VkIGJ5IHJlZmVyZW5jZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjaGFySW5kZXggUGFzc2VkIGJ5IHJlZmVyZW5jZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5kZXhlcyhhbHBoYUluZGV4LCBjaGFySW5kZXgpIHtcbiAgICB2YXIgaSA9IEVOVElUSUVTLmxlbmd0aDtcbiAgICB2YXIgX3Jlc3VsdHMgPSBbXTtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciBlID0gRU5USVRJRVNbaV07XG4gICAgICAgIHZhciBhbHBoYSA9IGVbMF07XG4gICAgICAgIHZhciBjaGFycyA9IGVbMV07XG4gICAgICAgIHZhciBjaHIgPSBjaGFyc1swXTtcbiAgICAgICAgdmFyIGFkZENoYXIgPSAoY2hyIDwgMzIgfHwgY2hyID4gMTI2KSB8fCBjaHIgPT09IDYyIHx8IGNociA9PT0gNjAgfHwgY2hyID09PSAzOCB8fCBjaHIgPT09IDM0IHx8IGNociA9PT0gMzk7XG4gICAgICAgIHZhciBjaGFySW5mbztcbiAgICAgICAgaWYgKGFkZENoYXIpIHtcbiAgICAgICAgICAgIGNoYXJJbmZvID0gY2hhckluZGV4W2Nocl0gPSBjaGFySW5kZXhbY2hyXSB8fCB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhcnNbMV0pIHtcbiAgICAgICAgICAgIHZhciBjaHIyID0gY2hhcnNbMV07XG4gICAgICAgICAgICBhbHBoYUluZGV4W2FscGhhXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMik7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGFkZENoYXIgJiYgKGNoYXJJbmZvW2NocjJdID0gYWxwaGEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFscGhhSW5kZXhbYWxwaGFdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaHIpO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChhZGRDaGFyICYmIChjaGFySW5mb1snJ10gPSBhbHBoYSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWw1RW50aXRpZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDUtZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQmFzZWQgaGVhdmlseSBvbiBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay93ZWJwYWNrL2Jsb2IvXG4gKiAgYzBhZmRmOWM2YWJjMWRkNzA3MDdjNTk0ZTQ3MzgwMmE1NjZmN2I2ZS9ob3Qvb25seS1kZXYtc2VydmVyLmpzXG4gKiBPcmlnaW5hbCBjb3B5cmlnaHQgVG9iaWFzIEtvcHBlcnMgQHNva3JhIChNSVQgbGljZW5zZSlcbiAqL1xuXG4vKiBnbG9iYWwgd2luZG93IF9fd2VicGFja19oYXNoX18gKi9cblxuaWYgKCFtb2R1bGUuaG90KSB7XG4gIHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuXG52YXIgaG1yRG9jc1VybCA9IFwiaHR0cDovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudC13aXRoLXdlYnBhY2suaHRtbFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cblxudmFyIGxhc3RIYXNoO1xudmFyIGZhaWx1cmVTdGF0dXNlcyA9IHsgYWJvcnQ6IDEsIGZhaWw6IDEgfTtcbnZhciBhcHBseU9wdGlvbnMgPSB7IGlnbm9yZVVuYWNjZXB0ZWQ6IHRydWUgfTtcblxuZnVuY3Rpb24gdXBUb0RhdGUoaGFzaCkge1xuICBpZiAoaGFzaCkgbGFzdEhhc2ggPSBoYXNoO1xuICByZXR1cm4gbGFzdEhhc2ggPT0gX193ZWJwYWNrX2hhc2hfXztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihoYXNoLCBtb2R1bGVNYXAsIG9wdGlvbnMpIHtcbiAgdmFyIHJlbG9hZCA9IG9wdGlvbnMucmVsb2FkO1xuICBpZiAoIXVwVG9EYXRlKGhhc2gpICYmIG1vZHVsZS5ob3Quc3RhdHVzKCkgPT0gXCJpZGxlXCIpIHtcbiAgICBpZiAob3B0aW9ucy5sb2cpIGNvbnNvbGUubG9nKFwiW0hNUl0gQ2hlY2tpbmcgZm9yIHVwZGF0ZXMgb24gdGhlIHNlcnZlci4uLlwiKTtcbiAgICBjaGVjaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgdmFyIGNiID0gZnVuY3Rpb24oZXJyLCB1cGRhdGVkTW9kdWxlcykge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGhhbmRsZUVycm9yKGVycik7XG5cbiAgICAgIGlmKCF1cGRhdGVkTW9kdWxlcykge1xuICAgICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gQ2Fubm90IGZpbmQgdXBkYXRlIChGdWxsIHJlbG9hZCBuZWVkZWQpXCIpO1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIChQcm9iYWJseSBiZWNhdXNlIG9mIHJlc3RhcnRpbmcgdGhlIHNlcnZlcilcIik7XG4gICAgICAgIH1cbiAgICAgICAgcGVyZm9ybVJlbG9hZCgpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGFwcGx5Q2FsbGJhY2sgPSBmdW5jdGlvbihhcHBseUVyciwgcmVuZXdlZE1vZHVsZXMpIHtcbiAgICAgICAgaWYgKGFwcGx5RXJyKSByZXR1cm4gaGFuZGxlRXJyb3IoYXBwbHlFcnIpO1xuXG4gICAgICAgIGlmICghdXBUb0RhdGUoKSkgY2hlY2soKTtcblxuICAgICAgICBsb2dVcGRhdGVzKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcyk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgYXBwbHlSZXN1bHQgPSBtb2R1bGUuaG90LmFwcGx5KGFwcGx5T3B0aW9ucywgYXBwbHlDYWxsYmFjayk7XG4gICAgICAvLyB3ZWJwYWNrIDIgcHJvbWlzZVxuICAgICAgaWYgKGFwcGx5UmVzdWx0ICYmIGFwcGx5UmVzdWx0LnRoZW4pIHtcbiAgICAgICAgLy8gSG90TW9kdWxlUmVwbGFjZW1lbnQucnVudGltZS5qcyByZWZlcnMgdG8gdGhlIHJlc3VsdCBhcyBgb3V0ZGF0ZWRNb2R1bGVzYFxuICAgICAgICBhcHBseVJlc3VsdC50aGVuKGZ1bmN0aW9uKG91dGRhdGVkTW9kdWxlcykge1xuICAgICAgICAgIGFwcGx5Q2FsbGJhY2sobnVsbCwgb3V0ZGF0ZWRNb2R1bGVzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcGx5UmVzdWx0LmNhdGNoKGFwcGx5Q2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciByZXN1bHQgPSBtb2R1bGUuaG90LmNoZWNrKGZhbHNlLCBjYik7XG4gICAgLy8gd2VicGFjayAyIHByb21pc2VcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7XG4gICAgICAgIHJlc3VsdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG4gICAgICAgICAgICBjYihudWxsLCB1cGRhdGVkTW9kdWxlcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXN1bHQuY2F0Y2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZ1VwZGF0ZXModXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG4gICAgdmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4gICAgICByZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuICAgIH0pO1xuXG4gICAgaWYodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IFwiICtcbiAgICAgICAgICBcIihGdWxsIHJlbG9hZCBuZWVkZWQpXFxuXCIgK1xuICAgICAgICAgIFwiVGhpcyBpcyB1c3VhbGx5IGJlY2F1c2UgdGhlIG1vZHVsZXMgd2hpY2ggaGF2ZSBjaGFuZ2VkIFwiICtcbiAgICAgICAgICBcIihhbmQgdGhlaXIgcGFyZW50cykgZG8gbm90IGtub3cgaG93IHRvIGhvdCByZWxvYWQgdGhlbXNlbHZlcy4gXCIgK1xuICAgICAgICAgIFwiU2VlIFwiICsgaG1yRG9jc1VybCArIFwiIGZvciBtb3JlIGRldGFpbHMuXCJcbiAgICAgICAgKTtcbiAgICAgICAgdW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdICAtIFwiICsgbW9kdWxlTWFwW21vZHVsZUlkXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcGVyZm9ybVJlbG9hZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmxvZykge1xuICAgICAgaWYoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuICAgICAgICByZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSAgLSBcIiArIG1vZHVsZU1hcFttb2R1bGVJZF0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVwVG9EYXRlKCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSBBcHAgaXMgdXAgdG8gZGF0ZS5cIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyKSB7XG4gICAgaWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgaW4gZmFpbHVyZVN0YXR1c2VzKSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIENhbm5vdCBjaGVjayBmb3IgdXBkYXRlIChGdWxsIHJlbG9hZCBuZWVkZWQpXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBcIiArIGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBwZXJmb3JtUmVsb2FkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltITVJdIFVwZGF0ZSBjaGVjayBmYWlsZWQ6IFwiICsgZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtUmVsb2FkKCkge1xuICAgIGlmIChyZWxvYWQpIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIGNvbnNvbGUud2FybihcIltITVJdIFJlbG9hZGluZyBwYWdlXCIpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9wcm9jZXNzLXVwZGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICdhbmd1bGFyMi11bml2ZXJzYWwtcG9seWZpbGxzL2Jyb3dzZXInO1xuaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHBsYXRmb3JtVW5pdmVyc2FsRHluYW1pYyB9IGZyb20gJ2FuZ3VsYXIyLXVuaXZlcnNhbCc7XG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuL2FwcC9hcHAubW9kdWxlJztcbmltcG9ydCAnYm9vdHN0cmFwJztcblxuLy8gRW5hYmxlIGVpdGhlciBIb3QgTW9kdWxlIFJlbG9hZGluZyBvciBwcm9kdWN0aW9uIG1vZGVcbmlmIChtb2R1bGVbJ2hvdCddKSB7XG4gICAgbW9kdWxlWydob3QnXS5hY2NlcHQoKTtcbiAgICBtb2R1bGVbJ2hvdCddLmRpc3Bvc2UoKCkgPT4geyBwbGF0Zm9ybS5kZXN0cm95KCk7IH0pO1xufSBlbHNlIHtcbiAgICBlbmFibGVQcm9kTW9kZSgpO1xufVxuXG4vLyBCb290IHRoZSBhcHBsaWNhdGlvbiwgZWl0aGVyIG5vdyBvciB3aGVuIHRoZSBET00gY29udGVudCBpcyBsb2FkZWRcbmNvbnN0IHBsYXRmb3JtID0gcGxhdGZvcm1Vbml2ZXJzYWxEeW5hbWljKCk7XG5jb25zdCBib290QXBwbGljYXRpb24gPSAoKSA9PiB7IHBsYXRmb3JtLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpOyB9O1xuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICBib290QXBwbGljYXRpb24oKTtcbn0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGJvb3RBcHBsaWNhdGlvbik7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYm9vdC1jbGllbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSg4MCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIyLXVuaXZlcnNhbC1wb2x5ZmlsbHMvYnJvd3Nlci5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSgxKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZS9idW5kbGVzL2NvcmUudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGJcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDgzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYW5ndWxhcjItdW5pdmVyc2FsL2Jyb3dzZXIvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YlxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFVuaXZlcnNhbE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLXVuaXZlcnNhbCc7XHJcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudCdcclxuaW1wb3J0IHsgTmF2TWVudUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9uYXZtZW51L25hdm1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9ob21lL2hvbWUuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IFByaXZhY3lDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X2NoZWNraW5nLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvbGljeVJldmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9yZXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNjZXNzQ29udHJvbFBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9hY2Nlc3NfY29udHJvbF9mb3JtX2NyZWF0ZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY2Nlc3NDb250cm9sRGV0YWlsQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJpdmFjeVBvbGljeURldGFpbENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2RldGFpbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcml2YWN5RG9tYWluQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUG9saWN5TWFuYWdlbWVudENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50JztcclxuaW1wb3J0IHsgU3ViUHJpdmFjeVBvbGljeUZvcm1DcmVhdGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9zdWJfcHJpdmFjeV9wb2xpY3lfZm9ybV9jcmVhdGUuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBCdXR0b25Nb2R1bGUsIEdyb3dsTW9kdWxlLCBEcm9wZG93bk1vZHVsZSwgQXV0b0NvbXBsZXRlTW9kdWxlLCBJbnB1dFRleHRNb2R1bGUsIERhdGFUYWJsZU1vZHVsZSxcclxuICAgIFNoYXJlZE1vZHVsZSwgSW5wdXRUZXh0YXJlYU1vZHVsZSwgTWVzc2FnZXNNb2R1bGUsIFBhbmVsTW9kdWxlLCBBY2NvcmRpb25Nb2R1bGUsIEZpZWxkc2V0TW9kdWxlXHJcbn0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBib290c3RyYXA6IFsgQXBwQ29tcG9uZW50IF0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBBcHBDb21wb25lbnQsXHJcbiAgICAgICAgTmF2TWVudUNvbXBvbmVudCxcclxuICAgICAgICBIb21lQ29tcG9uZW50LFxyXG4gICAgICAgIFByaXZhY3lDb21wb25lbnQsXHJcbiAgICAgICAgUG9saWN5UmV2aWV3Q29tcG9uZW50LFxyXG4gICAgICAgIEFjY2Vzc0NvbnRyb2xQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50LFxyXG4gICAgICAgIFByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50LFxyXG4gICAgICAgIFByaXZhY3lEb21haW5Db21wb25lbnQsXHJcbiAgICAgICAgUG9saWN5TWFuYWdlbWVudENvbXBvbmVudCxcclxuICAgICAgICBTdWJQcml2YWN5UG9saWN5Rm9ybUNyZWF0ZUNvbXBvbmVudCxcclxuICAgICAgICBQcml2YWN5UG9saWN5RGV0YWlsQ29tcG9uZW50LFxyXG4gICAgICAgIEFjY2Vzc0NvbnRyb2xEZXRhaWxDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgVW5pdmVyc2FsTW9kdWxlLCAvLyBNdXN0IGJlIGZpcnN0IGltcG9ydC4gVGhpcyBhdXRvbWF0aWNhbGx5IGltcG9ydHMgQnJvd3Nlck1vZHVsZSwgSHR0cE1vZHVsZSwgYW5kIEpzb25wTW9kdWxlIHRvby5cclxuICAgICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXHJcbiAgICAgICAgICAgIHsgcGF0aDogJycsIHJlZGlyZWN0VG86ICdob21lJywgcGF0aE1hdGNoOiAnZnVsbCcgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnaG9tZScsIGNvbXBvbmVudDogSG9tZUNvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdwcml2YWN5X2NoZWNraW5nJywgY29tcG9uZW50OiBQcml2YWN5Q29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3BvbGljeV9yZXZpZXcnLCBjb21wb25lbnQ6IFBvbGljeVJldmlld0NvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdhY2Nlc3NfY29udHJvbF9wb2xpY3knLCBjb21wb25lbnQ6IEFjY2Vzc0NvbnRyb2xQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ2FjY2Vzc19jb250cm9sX2RldGFpbC86aWQnLCBjb21wb25lbnQ6IEFjY2Vzc0NvbnRyb2xEZXRhaWxDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAncHJpdmFjeV9wb2xpY3knLCBjb21wb25lbnQ6IFByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3ByaXZhY3lfcG9saWN5X2RldGFpbC86aWQnLCBjb21wb25lbnQ6IFByaXZhY3lQb2xpY3lEZXRhaWxDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnc3ViX3ByaXZhY3lfcG9saWN5JywgY29tcG9uZW50OiBTdWJQcml2YWN5UG9saWN5Rm9ybUNyZWF0ZUNvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdwcml2YWN5X2RvbWFpbicsIGNvbXBvbmVudDogUHJpdmFjeURvbWFpbkNvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdwb2xpY3lfbWFuYWdlbWVudCcsIGNvbXBvbmVudDogUG9saWN5TWFuYWdlbWVudENvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICcqKicsIHJlZGlyZWN0VG86ICdob21lJyB9LFxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgICAgIEJ1dHRvbk1vZHVsZSxcclxuICAgICAgICBHcm93bE1vZHVsZSxcclxuICAgICAgICBEcm9wZG93bk1vZHVsZSxcclxuICAgICAgICBBdXRvQ29tcGxldGVNb2R1bGUsIElucHV0VGV4dGFyZWFNb2R1bGUsIE1lc3NhZ2VzTW9kdWxlLCBBY2NvcmRpb25Nb2R1bGUsXHJcbiAgICAgICAgSW5wdXRUZXh0TW9kdWxlLCBEYXRhVGFibGVNb2R1bGUsIFNoYXJlZE1vZHVsZSwgUGFuZWxNb2R1bGUsIEZpZWxkc2V0TW9kdWxlXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvYXBwLm1vZHVsZS50cyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9AYW5ndWxhci9yb3V0ZXIvYnVuZGxlcy9yb3V0ZXIudW1kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfMDY1YWE4YmQzZjMzZTUxNmViOGJcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDYpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9AYW5ndWxhci9mb3Jtcy9idW5kbGVzL2Zvcm1zLnVtZC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhcHAnLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2FwcC5jb21wb25lbnQuaHRtbCcpLFxuICAgIHN0eWxlczogW3JlcXVpcmUoJy4vYXBwLmNvbXBvbmVudC5jc3MnKV1cbn0pXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9hcHAvYXBwLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPSdjb250YWluZXItZmx1aWQnPlxcbiAgICA8ZGl2IGNsYXNzPSdyb3cnPlxcbiAgICAgICAgPGRpdiBjbGFzcz0nY29sLXNtLTMnPlxcbiAgICAgICAgICAgIDxuYXYtbWVudT48L25hdi1tZW51PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPSdjb2wtc20tOSBib2R5LWNvbnRlbnQnPlxcbiAgICAgICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuICAgICAgICB2YXIgcmVzdWx0ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY29tcG9uZW50LmNzc1wiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAbWVkaWEgKG1heC13aWR0aDogNzY3cHgpIHtcXG4gICAgLyogT24gc21hbGwgc2NyZWVucywgdGhlIG5hdiBtZW51IHNwYW5zIHRoZSBmdWxsIHdpZHRoIG9mIHRoZSBzY3JlZW4uIExlYXZlIGEgc3BhY2UgZm9yIGl0LiAqL1xcbiAgICAuYm9keS1jb250ZW50IHtcXG4gICAgICAgIHBhZGRpbmctdG9wOiA1MHB4O1xcbiAgICB9XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL2FwcC9hcHAuY29tcG9uZW50LmNzc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmF2LW1lbnUnLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL25hdm1lbnUuY29tcG9uZW50Lmh0bWwnKSxcbiAgICBzdHlsZXM6IFtyZXF1aXJlKCcuL25hdm1lbnUuY29tcG9uZW50LmNzcycpXVxufSlcbmV4cG9ydCBjbGFzcyBOYXZNZW51Q29tcG9uZW50IHtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9uYXZtZW51L25hdm1lbnUuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9J21haW4tbmF2Jz5cXHJcXG4gICAgPGRpdiBjbGFzcz0nbmF2YmFyIG5hdmJhci1pbnZlcnNlJz5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9J25hdmJhci1oZWFkZXInPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nbmF2YmFyLXRvZ2dsZScgZGF0YS10b2dnbGU9J2NvbGxhcHNlJyBkYXRhLXRhcmdldD0nLm5hdmJhci1jb2xsYXBzZSc+XFxyXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdzci1vbmx5Jz5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2ljb24tYmFyJz48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpY29uLWJhcic+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naWNvbi1iYXInPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8YSBjbGFzcz0nbmF2YmFyLWJyYW5kJyBbcm91dGVyTGlua109XFxcIlsnL2hvbWUnXVxcXCI+UHJpdmFjeSBBY2Nlc3MgQ29udHJvbDwvYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz0nY2xlYXJmaXgnPjwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz0nbmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlJz5cXHJcXG4gICAgICAgICAgICA8dWwgY2xhc3M9J25hdiBuYXZiYXItbmF2Jz5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvcHJpdmFjeV9jaGVja2luZyddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi10aC1saXN0Jz48L3NwYW4+IFByaXZhY3kgQ2hlY2tpbmdcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvYWNjZXNzX2NvbnRyb2xfcG9saWN5J11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxpc3QnPjwvc3Bhbj4gQWNjZXNzIENvbnRyb2wgUG9saWN5XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGk+XFxyXFxuICAgICAgICAgICAgICAgIDxsaSBbcm91dGVyTGlua0FjdGl2ZV09XFxcIlsnbGluay1hY3RpdmUnXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YSBbcm91dGVyTGlua109XFxcIlsnL3ByaXZhY3lfcG9saWN5J11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxpc3QnPjwvc3Bhbj4gUHJpdmFjeSBQb2xpY3lcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvc3ViX3ByaXZhY3lfcG9saWN5J11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxpc3QnPjwvc3Bhbj4gU3ViIFByaXZhY3kgUG9saWN5XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGk+XFxyXFxuICAgICAgICAgICAgICAgIDxsaSBbcm91dGVyTGlua0FjdGl2ZV09XFxcIlsnbGluay1hY3RpdmUnXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YSBbcm91dGVyTGlua109XFxcIlsnL3BvbGljeV9yZXZpZXcnXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBQb2xpY3kgUmV2aWV3XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGk+XFxyXFxuICAgICAgICAgICAgICAgIDxsaSBbcm91dGVyTGlua0FjdGl2ZV09XFxcIlsnbGluay1hY3RpdmUnXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YSBbcm91dGVyTGlua109XFxcIlsnL3ByaXZhY3lfZG9tYWluJ11cXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxpc3QnPjwvc3Bhbj4gUHJpdmFjeSBEb21haW5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPGxpIFtyb3V0ZXJMaW5rQWN0aXZlXT1cXFwiWydsaW5rLWFjdGl2ZSddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIFtyb3V0ZXJMaW5rXT1cXFwiWycvcG9saWN5X21hbmFnZW1lbnQnXVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2dseXBoaWNvbiBnbHlwaGljb24tdGgtbGlzdCc+PC9zcGFuPiBQb2xpY3kgTWFuYWdlbWVudFxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgICAgIDwvdWw+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9uYXZtZW51L25hdm1lbnUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuICAgICAgICB2YXIgcmVzdWx0ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9uYXZtZW51LmNvbXBvbmVudC5jc3NcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzID0gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQuY3NzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJsaSAuZ2x5cGhpY29uIHtcXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xcbn1cXG5cXG4vKiBIaWdobGlnaHRpbmcgcnVsZXMgZm9yIG5hdiBtZW51IGl0ZW1zICovXFxubGkubGluay1hY3RpdmUgYSxcXG5saS5saW5rLWFjdGl2ZSBhOmhvdmVyLFxcbmxpLmxpbmstYWN0aXZlIGE6Zm9jdXMge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDE4OUM3O1xcbiAgICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi8qIEtlZXAgdGhlIG5hdiBtZW51IGluZGVwZW5kZW50IG9mIHNjcm9sbGluZyBhbmQgb24gdG9wIG9mIG90aGVyIGl0ZW1zICovXFxuLm1haW4tbmF2IHtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICB0b3A6IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHJpZ2h0OiAwO1xcbiAgICB6LWluZGV4OiAxO1xcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcXG4gICAgLyogT24gc21hbGwgc2NyZWVucywgY29udmVydCB0aGUgbmF2IG1lbnUgdG8gYSB2ZXJ0aWNhbCBzaWRlYmFyICovXFxuICAgIC5tYWluLW5hdiB7XFxuICAgICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgICB3aWR0aDogY2FsYygyNSUgLSAyMHB4KTtcXG4gICAgfVxcbiAgICAubmF2YmFyIHtcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDBweDtcXG4gICAgICAgIGJvcmRlci13aWR0aDogMHB4O1xcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICB9XFxuICAgIC5uYXZiYXItaGVhZGVyIHtcXG4gICAgICAgIGZsb2F0OiBub25lO1xcbiAgICB9XFxuICAgIC5uYXZiYXItY29sbGFwc2Uge1xcbiAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICM0NDQ7XFxuICAgICAgICBwYWRkaW5nOiAwcHg7XFxuICAgIH1cXG4gICAgLm5hdmJhciB1bCB7XFxuICAgICAgICBmbG9hdDogbm9uZTtcXG4gICAgfVxcbiAgICAubmF2YmFyIGxpIHtcXG4gICAgICAgIGZsb2F0OiBub25lO1xcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xcbiAgICAgICAgbWFyZ2luOiA2cHg7XFxuICAgIH1cXG4gICAgLm5hdmJhciBsaSBhIHtcXG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTZweDtcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gICAgfVxcbiAgICAubmF2YmFyIGEge1xcbiAgICAgICAgLyogSWYgYSBtZW51IGl0ZW0ncyB0ZXh0IGlzIHRvbyBsb25nLCB0cnVuY2F0ZSBpdCAqL1xcbiAgICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgICB9XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL25hdm1lbnUvbmF2bWVudS5jb21wb25lbnQuY3NzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdob21lJyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9ob21lLmNvbXBvbmVudC5odG1sJylcbn0pXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCB7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDE+SGVsbG8sIHdvcmxkITwvaDE+XFxuPHA+V2VsY29tZSB0byB5b3VyIG5ldyBzaW5nbGUtcGFnZSBhcHBsaWNhdGlvbiwgYnVpbHQgd2l0aDo8L3A+XFxuPHVsPlxcbiAgICA8bGk+PGEgaHJlZj0naHR0cHM6Ly9nZXQuYXNwLm5ldC8nPkFTUC5ORVQgQ29yZTwvYT4gYW5kIDxhIGhyZWY9J2h0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvNjdlZjhzYmQuYXNweCc+QyM8L2E+IGZvciBjcm9zcy1wbGF0Zm9ybSBzZXJ2ZXItc2lkZSBjb2RlPC9saT5cXG4gICAgPGxpPjxhIGhyZWY9J2h0dHBzOi8vYW5ndWxhci5pby8nPkFuZ3VsYXIgMjwvYT4gYW5kIDxhIGhyZWY9J2h0dHA6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnLyc+VHlwZVNjcmlwdDwvYT4gZm9yIGNsaWVudC1zaWRlIGNvZGU8L2xpPlxcbiAgICA8bGk+PGEgaHJlZj0naHR0cHM6Ly93ZWJwYWNrLmdpdGh1Yi5pby8nPldlYnBhY2s8L2E+IGZvciBidWlsZGluZyBhbmQgYnVuZGxpbmcgY2xpZW50LXNpZGUgcmVzb3VyY2VzPC9saT5cXG4gICAgPGxpPjxhIGhyZWY9J2h0dHA6Ly9nZXRib290c3RyYXAuY29tLyc+Qm9vdHN0cmFwPC9hPiBmb3IgbGF5b3V0IGFuZCBzdHlsaW5nPC9saT5cXG48L3VsPlxcbjxwPlRvIGhlbHAgeW91IGdldCBzdGFydGVkLCB3ZSd2ZSBhbHNvIHNldCB1cDo8L3A+XFxuPHVsPlxcbiAgICA8bGk+PHN0cm9uZz5DbGllbnQtc2lkZSBuYXZpZ2F0aW9uPC9zdHJvbmc+LiBGb3IgZXhhbXBsZSwgY2xpY2sgPGVtPkNvdW50ZXI8L2VtPiB0aGVuIDxlbT5CYWNrPC9lbT4gdG8gcmV0dXJuIGhlcmUuPC9saT5cXG4gICAgPGxpPjxzdHJvbmc+U2VydmVyLXNpZGUgcHJlcmVuZGVyaW5nPC9zdHJvbmc+LiBGb3IgZmFzdGVyIGluaXRpYWwgbG9hZGluZyBhbmQgaW1wcm92ZWQgU0VPLCB5b3VyIEFuZ3VsYXIgMiBhcHAgaXMgcHJlcmVuZGVyZWQgb24gdGhlIHNlcnZlci4gVGhlIHJlc3VsdGluZyBIVE1MIGlzIHRoZW4gdHJhbnNmZXJyZWQgdG8gdGhlIGJyb3dzZXIgd2hlcmUgYSBjbGllbnQtc2lkZSBjb3B5IG9mIHRoZSBhcHAgdGFrZXMgb3Zlci48L2xpPlxcbiAgICA8bGk+PHN0cm9uZz5XZWJwYWNrIGRldiBtaWRkbGV3YXJlPC9zdHJvbmc+LiBJbiBkZXZlbG9wbWVudCBtb2RlLCB0aGVyZSdzIG5vIG5lZWQgdG8gcnVuIHRoZSA8Y29kZT53ZWJwYWNrPC9jb2RlPiBidWlsZCB0b29sLiBZb3VyIGNsaWVudC1zaWRlIHJlc291cmNlcyBhcmUgZHluYW1pY2FsbHkgYnVpbHQgb24gZGVtYW5kLiBVcGRhdGVzIGFyZSBhdmFpbGFibGUgYXMgc29vbiBhcyB5b3UgbW9kaWZ5IGFueSBmaWxlLjwvbGk+XFxuICAgIDxsaT48c3Ryb25nPkhvdCBtb2R1bGUgcmVwbGFjZW1lbnQ8L3N0cm9uZz4uIEluIGRldmVsb3BtZW50IG1vZGUsIHlvdSBkb24ndCBldmVuIG5lZWQgdG8gcmVsb2FkIHRoZSBwYWdlIGFmdGVyIG1ha2luZyBtb3N0IGNoYW5nZXMuIFdpdGhpbiBzZWNvbmRzIG9mIHNhdmluZyBjaGFuZ2VzIHRvIGZpbGVzLCB5b3VyIEFuZ3VsYXIgMiBhcHAgd2lsbCBiZSByZWJ1aWx0IGFuZCBhIG5ldyBpbnN0YW5jZSBpbmplY3RlZCBpcyBpbnRvIHRoZSBwYWdlLjwvbGk+XFxuICAgIDxsaT48c3Ryb25nPkVmZmljaWVudCBwcm9kdWN0aW9uIGJ1aWxkczwvc3Ryb25nPi4gSW4gcHJvZHVjdGlvbiBtb2RlLCBkZXZlbG9wbWVudC10aW1lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCwgYW5kIHRoZSA8Y29kZT53ZWJwYWNrPC9jb2RlPiBidWlsZCB0b29sIHByb2R1Y2VzIG1pbmlmaWVkIHN0YXRpYyBDU1MgYW5kIEphdmFTY3JpcHQgZmlsZXMuPC9saT5cXG48L3VsPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9jaGVja2luZycsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9wcml2YWN5X2NoZWNraW5nLmNvbXBvbmVudC5odG1sJyksXHJcbiAgICBwcm92aWRlcnM6IFtDb25maXJtYXRpb25TZXJ2aWNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUHJpdmFjeUNvbXBvbmVudCB7XHJcblxyXG4gICAgLy8jcmVnaW9uIFN1YmplY3RcclxuICAgIHByaXZhdGUgdXNlcnM6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSB1c2VyX3Byb3BlcnR5X25hbWVzOiBhbnlbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF91c2VyOiBhbnk7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gUmVzb3VyY2VcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgcmVzb3VyY2VfZmllbGRzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2VfdmFsdWVzOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX29wZXJhdG9yczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX29wZXJhdG9yOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25fcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X29iamVjdDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9yZXN1bHQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWVsZF9vcHRpb25zOiBzdHJpbmdbXSA9IFsncHVycG9zZScsICdzdGFydF90aW1lJywgJ2VuZF90aW1lJ107XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkOiBzdHJpbmdbXTtcclxuXHJcbiAgICAvLyNyZWdpb24gcmVzdWx0XHJcbiAgICBwcml2YXRlIHJlc3VsdDogYW55W10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzdWx0X3Byb3BlcnR5X25hbWVzOiBhbnlbXSA9IFtdO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcbiAgICBwcml2YXRlIGpzb25faGVscGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIG1zZ3M6IE1lc3NhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgIHByaXZhdGUgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgICAgICB0aGlzLmpzb25faGVscGVyID0gSlNPTjtcclxuICAgICAgICB0aGlzLnJlc291cmNlX29wZXJhdG9ycy5wdXNoKHsgbGFiZWw6ICdFcXVhbHMnLCB2YWx1ZTogJ0VxdWFscycgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9vcGVyYXRvcnMucHVzaCh7IGxhYmVsOiAnR3JlYXRlclRoYW4nLCB2YWx1ZTogJ0dyZWF0ZXJUaGFuJyB9KTtcclxuICAgICAgICB0aGlzLnJlc291cmNlX29wZXJhdG9ycy5wdXNoKHsgbGFiZWw6ICdMZXNzVGhhbicsIHZhbHVlOiAnTGVzc1RoYW4nIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdhY2NvdW50cy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKVswXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coanNvbk9iamVjdCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkob2JqZWN0KSAmJiB0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudXNlcl9wcm9wZXJ0eV9uYW1lcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnVzZXJzID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSA9IGNvbGxlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25TZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdHJ1Y3R1cmUvP2NvbGxlY3Rpb25OYW1lPScgKyBjb2xsZWN0aW9uU2VsZWN0ZWQpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQucmVzb3VyY2VfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eTogYW55LCBqc29uT2JqZWN0OiBhbnksIHByZWZpeDogc3RyaW5nLCBjb250YWluZXI6IFNlbGVjdEl0ZW1bXSkge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PSBcIl9pZFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgZWxzZSBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBldmVudC5xdWVyeTtcclxuICAgICAgICBsZXQgZmlsdGVyZWQ6IGFueVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoZmllbGQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goZmllbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGQgPSBmaWx0ZXJlZDtcclxuICAgIH1cclxuICAgIGFuZF9jbGljaygpIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgKz0gXCIgQU5EIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIG9yX2NsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uX3Jlc3VsdCArPSBcIiBPUiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBub3RfY2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25fcmVzdWx0ICs9IFwiTk9UKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuX2JyYWNrZXRfY2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25fcmVzdWx0ICs9IFwiKFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xvc2VfYnJhY2tldF9jbGljaygpIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgKz0gXCIgKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkX2NvbmRpdGlvbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQpXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSB0aGlzLnJlc291cmNlX2ZpZWxkc1swXS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJlc291cmNlX3NlbGVjdGVkX29wZXJhdG9yKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlX3NlbGVjdGVkX29wZXJhdG9yID0gdGhpcy5yZXNvdXJjZV9vcGVyYXRvcnNbMF0udmFsdWU7XHJcblxyXG4gICAgICAgIGxldCBleHByZXNzaW9uOiBzdHJpbmcgPSB0aGlzLnJlc291cmNlX3NlbGVjdGVkX29wZXJhdG9yICsgJygnXHJcbiAgICAgICAgICAgICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArICcsICcgKyB0aGlzLnJlc291cmNlX3ZhbHVlcyArICcpJztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZGl0aW9uX3Jlc3VsdClcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25fcmVzdWx0ICs9IGV4cHJlc3Npb247XHJcbiAgICAgICAgZWxzZSB0aGlzLmNvbmRpdGlvbl9yZXN1bHQgPSBleHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJfY29uZGl0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uX3Jlc3VsdCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfZW52aXJvbm1lbnRfZmllbGQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVudmlyb25tZW50X3Jlc3VsdClcclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHQgPSBcIlxcXCJcIiArIHRoaXMuZW52aXJvbm1lbnRfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCJcXFwiXCI7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCArPSBcIiwgXFxcIlwiICsgdGhpcy5lbnZpcm9ubWVudF9maWVsZCArIFwiXFxcIiA6IFxcXCJcIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9vYmplY3QgPSBcInsgXCIgKyB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCArIFwiIH1cIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWVsZCA9IHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJfZW52aXJvbm1lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9vYmplY3QgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0ID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRfdXNlcikge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgdXNlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGVudmlyb25tZW50ID0gXCJ7IFwiICsgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHQgKyBcIiB9XCI7XHJcbiAgICAgICAgY29uc29sZS5sb2codHlwZW9mIHRoaXMuc2VsZWN0ZWRfdXNlci5faWQgPT09ICdvYmplY3QnKTtcclxuICAgICAgICBsZXQgY29tbWFuZCA9IHtcclxuICAgICAgICAgICAgXCJVc2VySURcIjogdHlwZW9mIHRoaXMuc2VsZWN0ZWRfdXNlci5faWQgPT09ICdvYmplY3QnID8gdGhpcy5zZWxlY3RlZF91c2VyLl9pZC4kb2lkIDogdGhpcy5zZWxlY3RlZF91c2VyLl9pZCxcclxuICAgICAgICAgICAgXCJSZXNvdXJjZU5hbWVcIjogdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiUmVzb3VyY2VDb25kaXRpb25cIjogdGhpcy5jb25kaXRpb25fcmVzdWx0LFxyXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IGVudmlyb25tZW50LFxyXG4gICAgICAgICAgICBcIkFjdGlvblwiOiBcInJlYWRcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tbWFuZCk7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSBbXTtcclxuICAgICAgICB0aGlzLnJlc3VsdF9wcm9wZXJ0eV9uYW1lcyA9IFtdO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdwcml2YWN5L2NoZWNrLycsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS50ZXh0KCkgPT0gJ0RlbnknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdEZW5pZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRleHQoKSA9PSAnTm90IEFwcGxpY2FibGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdOb3QgQXBwbGljYWJsZScgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzdWx0ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXN1bHRfcHJvcGVydHlfbmFtZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9jaGVja2luZy5jb21wb25lbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSg0Nik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2h0dHAvYnVuZGxlcy9odHRwLnVtZC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSgxOTEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9wcmltZW5nL3ByaW1lbmcuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl8wNjVhYThiZDNmMzNlNTE2ZWI4YlxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEFwcFNldHRpbmcge1xyXG4gICAgcHVibGljIHN0YXRpYyBBUElfRU5EUE9JTlQgPSAnaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaS8nO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvYXBwX3NldHRpbmcudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjwvZGl2PlxcclxcblxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+U3ViamVjdCBTZWxlY3Rpb248L2gzPjwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInVzZXJzXFxcIiBzZWxlY3Rpb25Nb2RlPVxcXCJzaW5nbGVcXFwiIFsoc2VsZWN0aW9uKV09XFxcInNlbGVjdGVkX3VzZXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgW3BhZ2luYXRvcl09XFxcInRydWVcXFwiIFtwYWdlTGlua3NdPVxcXCIzXFxcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cXFwiWzEwLDIwLDUwXVxcXCIgW3Jvd3NdPVxcXCIxMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uICpuZ0Zvcj1cXFwibGV0IGNvbCBvZiB1c2VyX3Byb3BlcnR5X25hbWVzXFxcIiBmaWVsZD1cXFwie3tjb2x9fVxcXCIgaGVhZGVyPVxcXCJ7e2NvbH19XFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8IS0tPHAtZm9vdGVyPjxkaXYgc3R5bGU9XFxcInRleHQtYWxpZ246IGxlZnRcXFwiPlNlbGVjdGVkIFVzZXI6IHt7anNvbl9oZWxwZXIuc3RyaW5naWZ5KHNlbGVjdGVkX3VzZXIpfX08L2Rpdj48L3AtZm9vdGVyPi0tPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjojZjBhZDRlXFxcIj5SZXNvdXJjZSBDb25kaXRpb248L2gzPjwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5Db2xsZWN0aW9uIE5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIiBcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTIwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5SZXNvdXJjZSBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTIwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+T3BlcmF0b3IgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9vcGVyYXRvcnNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9vcGVyYXRvclxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+VmFsdWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IGlkPVxcXCJpblxcXCIgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3ZhbHVlc1xcXCIgLz5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIiBzdHlsZT1cXFwicGFkZGluZy1ib3R0b206IDEwcHhcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkXFxcIiAoY2xpY2spPVxcXCJhZGRfY29uZGl0aW9uKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ2xlYXJcXFwiIChjbGljayk9XFxcImNsZWFyX2NvbmRpdGlvbigpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjE0MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY29uZGl0aW9uX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk9SXFxcIiAoY2xpY2spPVxcXCJvcl9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKVxcXCIgKGNsaWNrKT1cXFwiY2xvc2VfYnJhY2tldF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjojNWNiODVjXFxcIj5FbnZpcm9ubWVudCBDb25kaXRpb248L2gzPjwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkZpZWxkIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxwLWF1dG9Db21wbGV0ZSBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfZmllbGRcXFwiIFtzdWdnZXN0aW9uc109XFxcImVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkXFxcIiAoY29tcGxldGVNZXRob2QpPVxcXCJmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoJGV2ZW50KVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW21pbkxlbmd0aF09XFxcIjFcXFwiID5cXHJcXG4gICAgICAgICAgICA8L3AtYXV0b0NvbXBsZXRlPlxcclxcbiAgICAgICAgICAgIDwhLS08aW5wdXQgaWQ9XFxcImluXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIyNVxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfZmllbGRcXFwiIC8+LS0+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5WYWx1ZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XFxcImluXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIyNVxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgc3R5bGU9XFxcInBhZGRpbmctYm90dG9tOiAxMHB4XFxcIiA+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24tc3VjY2Vzc1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIFxcclxcbiAgICAgICAgICAgICAgICBsYWJlbD1cXFwiQWRkXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfZmllbGQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24tc3VjY2Vzc1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiXFxyXFxuICAgICAgICAgICAgICAgICBsYWJlbD1cXFwiQ2xlYXJcXFwiIChjbGljayk9XFxcImNsZWFyX2Vudmlyb25tZW50KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDx0ZXh0YXJlYSBzdHlsZT1cXFwiYm9yZGVyLWNvbG9yOiBibGFja1xcXCIgcm93cz1cXFwiMlxcXCIgY29scz1cXFwiMTQwXFxcIiBwSW5wdXRUZXh0YXJlYSBjbGFzcz1cXFwidWktaW5wdXR0ZXh0YXJlYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfb2JqZWN0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyIHRleHQtY2VudGVyXFxcIj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcInN1Ym1pdCgpXFxcIj5TdWJtaXQ8L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgKm5nSWY9XFxcInJlc3VsdC5sZW5ndGggPiAwXFxcIiBzdHlsZT1cXFwibWFyZ2luLXRvcDoyMHB4XFxcIj5cXHJcXG4gICAgICAgIDx0YWJsZSBjbGFzcz1cXFwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1zdHJpcGVkXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGhlYWQ+XFxyXFxuICAgICAgICAgICAgICAgIDx0cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0aCAqbmdGb3I9XFxcImxldCBjb2wgb2YgcmVzdWx0X3Byb3BlcnR5X25hbWVzXFxcIj57e2NvbH19PC90aD5cXHJcXG4gICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICA8L3RoZWFkPlxcclxcbiAgICAgICAgICAgIDx0Ym9keT5cXHJcXG4gICAgICAgICAgICAgICAgPHRyICpuZ0Zvcj1cXFwibGV0IHJvdyBvZiByZXN1bHRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRkICpuZ0Zvcj1cXFwibGV0IGlkeCBvZiByZXN1bHRfcHJvcGVydHlfbmFtZXNcXFwiPnt7anNvbl9oZWxwZXIuc3RyaW5naWZ5KHJvd1tpZHhdKX19PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICA8L3Rib2R5PlxcclxcbiAgICAgICAgPC90YWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfY2hlY2tpbmcuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBBY2Nlc3NDb250cm9sIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjY2Vzc19jb250cm9sX3J1bGUubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3BvbGljeV9yZXZpZXcnLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vcG9saWN5X3Jldmlldy5jb21wb25lbnQuaHRtbCcpXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2xpY3lSZXZpZXdDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIC8vI3JlZ2lvbiByZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBjb25zdGFudF9yZXNvdXJjZV92YWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2VfcmVzdWx0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3Jlc3VsdF90ZW1wOiBzdHJpbmc7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV90eXBlczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3BvbGljeV90eXBlOiBzdHJpbmc7XHJcblxyXG4gICAgLy8jcmVnaW9uIHN1YmplY3RcclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3N1YmplY3RfdmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3ViamVjdF9yZXN1bHQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3ViamVjdF9yZXN1bHRfdGVtcDogc3RyaW5nO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X2Vudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3Jlc3VsdDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9yZXN1bHRfdGVtcDogc3RyaW5nO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHJlc3VsdFxyXG4gICAgcHJpdmF0ZSByZXN1bHQ6IGFueVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc3VsdF9wcm9wZXJ0eV9uYW1lczogYW55W10gPSBbXTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgYWNjZXNzX2NvbnRyb2xzOiBBY2Nlc3NDb250cm9sW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGpzb25faGVscGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIG1zZ3M6IE1lc3NhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgIHByaXZhdGUgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgICAgICB0aGlzLmpzb25faGVscGVyID0gSlNPTjtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdjb2xsZWN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX25hbWVzLnB1c2goeyBsYWJlbDogbmFtZSwgdmFsdWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgPSBjb2xsZWN0aW9uc1swXTtcclxuICAgICAgICAgICAgdGhhdC5vblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25zWzBdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N1YmplY3QvZmllbGRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5zdWJqZWN0X2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3JlYWQnLCB2YWx1ZTogJ3JlYWQnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdjcmVhdGUnLCB2YWx1ZTogJ2NyZWF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3VwZGF0ZScsIHZhbHVlOiAndXBkYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnZGVsZXRlJywgdmFsdWU6ICdkZWxldGUnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnBvbGljeV90eXBlcy5wdXNoKHsgbGFiZWw6ICdBY2Nlc3MgQ29udHJvbCcsIHZhbHVlOiAnQWNjZXNzIENvbnRyb2wnIH0pO1xyXG4gICAgICAgIHRoaXMucG9saWN5X3R5cGVzLnB1c2goeyBsYWJlbDogJ1ByaXZhY3knLCB2YWx1ZTogJ1ByaXZhY3knIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfcG9saWN5X3R5cGUgPSB0aGlzLnBvbGljeV90eXBlc1swXS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25PYmplY3QpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuXHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgZWxzZSBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZF9zdWJqZWN0X2ZpZWxkKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdWJqZWN0X3Jlc3VsdF90ZW1wKVxyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3RfcmVzdWx0X3RlbXAgPSBcIlxcXCJcIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiXFxcIiA6IFxcXCJcIiArIHRoaXMuY29uc3RhbnRfc3ViamVjdF92YWx1ZSArIFwiXFxcIlwiO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0X3Jlc3VsdF90ZW1wICs9IFwiLCBcXFwiXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmNvbnN0YW50X3N1YmplY3RfdmFsdWUgKyBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X3Jlc3VsdCA9IFwieyBcIiArIHRoaXMuc3ViamVjdF9yZXN1bHRfdGVtcCArIFwiIH1cIjtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zdGFudF9zdWJqZWN0X3ZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZF9yZXNvdXJjZV9maWVsZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VfcmVzdWx0X3RlbXApXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VfcmVzdWx0X3RlbXAgPSBcIlxcXCJcIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmNvbnN0YW50X3Jlc291cmNlX3ZhbHVlICsgXCJcXFwiXCI7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlX3Jlc3VsdF90ZW1wICs9IFwiLCBcXFwiXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCJcXFwiIDogXFxcIlwiICsgdGhpcy5jb25zdGFudF9yZXNvdXJjZV92YWx1ZSArIFwiXFxcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLnJlc291cmNlX3Jlc3VsdCA9IFwieyBcIiArIHRoaXMucmVzb3VyY2VfcmVzdWx0X3RlbXAgKyBcIiB9XCI7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc3RhbnRfcmVzb3VyY2VfdmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkX2Vudmlyb25tZW50X3ZhbHVlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5lbnZpcm9ubWVudF9yZXN1bHRfdGVtcClcclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHRfdGVtcCA9IFwiXFxcIlwiICsgdGhpcy5lbnZpcm9ubWVudF9maWVsZCArIFwiXFxcIiA6IFxcXCJcIiArIHRoaXMuY29uc3RhbnRfZW52aXJvbm1lbnRfdmFsdWUgKyBcIlxcXCJcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0X3RlbXAgKz0gXCIsIFxcXCJcIiArIHRoaXMuZW52aXJvbm1lbnRfZmllbGQgKyBcIlxcXCIgOiBcXFwiXCIgKyB0aGlzLmNvbnN0YW50X2Vudmlyb25tZW50X3ZhbHVlICsgXCJcXFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfcmVzdWx0ID0gXCJ7IFwiICsgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHRfdGVtcCArIFwiIH1cIjtcclxuXHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWVsZCA9IHRoaXMuY29uc3RhbnRfZW52aXJvbm1lbnRfdmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHRfdGVtcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9yZXN1bHRfdGVtcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X3Jlc3VsdF90ZW1wID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJlc291cmNlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0X3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIHZhciBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBVc2VySnNvbkRhdGE6IHRoaXMuc3ViamVjdF9yZXN1bHQsXHJcbiAgICAgICAgICAgIFJlc291cmNlSnNvbkRhdGE6IHRoaXMucmVzb3VyY2VfcmVzdWx0LFxyXG4gICAgICAgICAgICBFbnZpcm9ubWVudEpzb25EYXRhOiB0aGlzLmVudmlyb25tZW50X3Jlc3VsdCxcclxuICAgICAgICAgICAgQWN0aW9uOiB0aGlzLnNlbGVjdGVkX2FjdGlvbixcclxuICAgICAgICAgICAgQ29sbGVjdGlvbk5hbWU6IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gW107XHJcbiAgICAgICAgdGhpcy5yZXN1bHRfcHJvcGVydHlfbmFtZXMgPSBbXTtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5hY2Nlc3NfY29udHJvbHMucHVzaChuZXcgQWNjZXNzQ29udHJvbChcIlBvbGljeV8xXCIsIFwicG9saWN5IGZvciBhZG1pblwiLCBcIkRlcGFydG1lbnRcIiwgXCJwZXJtaXQtb3ZlcnJpZGVzXCIpKTtcclxuICAgICAgICB0aGlzLmFjY2Vzc19jb250cm9scy5wdXNoKG5ldyBBY2Nlc3NDb250cm9sKFwiUG9saWN5XzVcIiwgXCJwb2xpY3kgZm9yIGFkbWluXCIsIFwiRW1wbG95ZWVcIiwgXCJwZXJtaXQtb3ZlcnJpZGVzXCIpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy9pZiAodGhpcy5zZWxlY3RlZF9wb2xpY3lfdHlwZSA9PSAnQWNjZXNzIENvbnRyb2wnKSB7XHJcbiAgICAgICAgLy8gICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnQWNjZXNzQ29udHJvbC9SZXZpZXcvJywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgIC8vICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvaycpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgdGhhdC5yZXN1bHQgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoYXQucmVzdWx0KTtcclxuICAgICAgICAvLyAgICAgICAgICAgIC8vbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpWzBdO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgLy9mb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAvLyAgICB0aGF0LnJlc3VsdF9wcm9wZXJ0eV9uYW1lcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAvLyAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIC8vICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAvLyAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgLy8gICAgICAgIH1cclxuICAgICAgICAvLyAgICApO1xyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIC8vZWxzZSB7XHJcbiAgICAgICAgLy8gICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeS9SZXZpZXcvJywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgIC8vICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgIHRoYXQucmVzdWx0ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBpZiAodGhhdC5yZXN1bHQubGVuZ3RoID09IDApXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiBcIk5vIFBvbGljeSBzYXRpc2ZpZWRcIiB9KTtcclxuICAgICAgICAvLyAgICAgICAgICAgIC8vbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpWzBdO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgLy9mb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAvLyAgICB0aGF0LnJlc3VsdF9wcm9wZXJ0eV9uYW1lcy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICAvLyAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIC8vICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IudGV4dCgpIH0pO1xyXG4gICAgICAgIC8vICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgKTtcclxuICAgICAgICAvL31cclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC50cyIsImV4cG9ydCBjbGFzcyBBY2Nlc3NDb250cm9sUnVsZSB7XHJcbiAgICBwdWJsaWMgUnVsZUlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQ29uZGl0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgRWZmZWN0OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocnVsZUlkOiBzdHJpbmcsIGNvbmRpdGlvbjogc3RyaW5nLCBlZmZlY3Q6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuUnVsZUlkID0gcnVsZUlkO1xyXG4gICAgICAgIHRoaXMuQ29uZGl0aW9uID0gY29uZGl0aW9uO1xyXG4gICAgICAgIHRoaXMuRWZmZWN0ID0gZWZmZWN0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQWNjZXNzQ29udHJvbCB7XHJcbiAgICBwdWJsaWMgUG9saWN5SUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIENvbGxlY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgUnVsZUNvbWJpbmluZzogc3RyaW5nO1xyXG4gICAgcHVibGljIEFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvbGljeUlEOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIHJ1bGVDb21iaW5pbmc6IHN0cmluZywgYWN0aW9uOnN0cmluZz1cInJlYWRcIikge1xyXG4gICAgICAgIHRoaXMuUG9saWN5SUQgPSBwb2xpY3lJRDtcclxuICAgICAgICB0aGlzLkNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbk5hbWU7XHJcbiAgICAgICAgdGhpcy5EZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHRoaXMuUnVsZUNvbWJpbmluZyA9IHJ1bGVDb21iaW5pbmc7XHJcbiAgICAgICAgdGhpcy5BY3Rpb24gPSBhY3Rpb247XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPlBvbGljeSBSZXZpZXc8L2gzPlxcclxcbjxwLWdyb3dsIFt2YWx1ZV09XFxcIm1zZ3NcXFwiPjwvcC1ncm93bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5BY3Rpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiYWN0aW9uc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX2FjdGlvblxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+UG9saWN5IFR5cGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicG9saWN5X3R5cGVzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcG9saWN5X3R5cGVcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTMgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoyOHB4XFxcIj5TdWJqZWN0IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMyBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImNvbnN0YW50X3N1YmplY3RfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTEgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy01IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzdWx0OiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjFcXFwiIGNvbHM9XFxcIjYwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInN1YmplY3RfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy0zIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzb3VyY2UgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicmVzb3VyY2VfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwicmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTMgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5WYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF9yZXNvdXJjZV92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMSBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZFxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy01IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzdWx0OiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjFcXFwiIGNvbHM9XFxcIjYwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctMyBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJcXFwiPkVudmlyb25tZW50IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X2ZpZWxkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy0zIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+VmFsdWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIyNVxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfZW52aXJvbm1lbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTEgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGRcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNSBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc3VsdDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIxXFxcIiBjb2xzPVxcXCI2MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJlbnZpcm9ubWVudF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMiB0ZXh0LWNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTVcXFwiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcInN1Ym1pdCgpXFxcIj5TdWJtaXQ8L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLW9mZnNldC0wIGNvbC1sZy01XFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcImNsZWFyKClcXFwiPkNsZWFyPC9idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgKm5nSWY9XFxcImFjY2Vzc19jb250cm9scy5sZW5ndGggPiAwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MTVweFxcXCI+XFxyXFxuICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiYWNjZXNzX2NvbnRyb2xzXFxcIiBbcGFnaW5hdG9yXT1cXFwidHJ1ZVxcXCIgW3BhZ2VMaW5rc109XFxcIjNcXFwiIFtyb3dzUGVyUGFnZU9wdGlvbnNdPVxcXCJbMTAsMjAsNTBdXFxcIiBbcm93c109XFxcIjEwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlBvbGljeUlEXFxcIiBoZWFkZXI9XFxcIlBvbGljeSBJRFxcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJEZXNjcmlwdGlvblxcXCIgaGVhZGVyPVxcXCJEZXNjcmlwdGlvblxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb2xsZWN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJDb2xsZWN0aW9uIE5hbWVcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUNvbWJpbmluZ1xcXCIgaGVhZGVyPVxcXCJSdWxlIENvbWJpbmluZ1xcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJBY3Rpb25cXFwiIGhlYWRlcj1cXFwiQWN0aW9uXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gc3R5bGVDbGFzcz1cXFwiY29sLWJ1dHRvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImJvZHlcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwic2VsZWN0X2FjY2Vzc19jb250cm9sKGNhcilcXFwiIGljb249XFxcImZhLXNoYXJlXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBzdHlsZUNsYXNzPVxcXCJjb2wtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiYm9keVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVpLWJ1dHRvbi1kYW5nZXJcXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwiZGVsZXRlX3ByaXZhY3lfcG9saWN5KGNhcilcXFwiIGljb249XFxcImZhLXRyYXNoXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgKm5nSWY9XFxcInJlc3VsdC5sZW5ndGggPiAwXFxcIj5cXHJcXG4gICAgICAgIDx0YWJsZSBjbGFzcz1cXFwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1zdHJpcGVkXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGhlYWQ+XFxyXFxuICAgICAgICAgICAgICAgIDx0cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0aD5Qb2xpY3kgSUQ8L3RoPlxcclxcbiAgICAgICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgICAgIDwvdGhlYWQ+XFxyXFxuICAgICAgICAgICAgPHRib2R5PlxcclxcbiAgICAgICAgICAgICAgICA8dHIgKm5nRm9yPVxcXCJsZXQgcm93IG9mIHJlc3VsdFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e3tyb3d9fTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgICAgIDwvdGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wb2xpY3lfcmV2aWV3LmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgQWNjZXNzQ29udHJvbFJ1bGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWNjZXNzX2NvbnRyb2xfcnVsZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9ydWxlJyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2FjY2Vzc19jb250cm9sX2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjY2Vzc0NvbnRyb2xQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBydWxlX2VmZmVjdHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9ydWxlX2VmZmVjdDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX2VmZmVjdHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2Z1bmN0aW9uX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHN1YmplY3RfZmllbGRzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfc3ViamVjdF9maWVsZDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudF9ydWxlX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgZmluYWxfcnVsZV9yZXN1bHQ6IHN0cmluZ1tdID0gW107XHJcbiAgICBwcml2YXRlIHJ1bGVzX2NvbWJpbmluZzogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3J1bGVfY29tYmluaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSB0YXJnZXRfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfdmFsdWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBjb25zdGFudF92YWx1ZTogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWVsZF9vcHRpb25zOiBzdHJpbmdbXSA9IFsncHVycG9zZScsICdzdGFydF90aW1lJywgJ2VuZF90aW1lJ107XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkOiBzdHJpbmdbXTtcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGpzb25faGVscGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIG1zZ3M6IE1lc3NhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgcnVsZXM6IEFjY2Vzc0NvbnRyb2xSdWxlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBwcml2YXRlIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgdGhpcy5qc29uX2hlbHBlciA9IEpTT047XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnY29sbGVjdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgY29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdmdW5jdGlvbi8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mdW5jdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSA9IG5hbWVzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3ViamVjdC9maWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnN1YmplY3RfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAncmVhZCcsIHZhbHVlOiAncmVhZCcgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2NyZWF0ZScsIHZhbHVlOiAnY3JlYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAndXBkYXRlJywgdmFsdWU6ICd1cGRhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdkZWxldGUnLCB2YWx1ZTogJ2RlbGV0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF0udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZV9lZmZlY3RzLnB1c2goeyBsYWJlbDogJ1Blcm1pdCcsIHZhbHVlOiAnUGVybWl0JyB9KTtcclxuICAgICAgICB0aGlzLnJ1bGVfZWZmZWN0cy5wdXNoKHsgbGFiZWw6ICdEZW55JywgdmFsdWU6ICdEZW55JyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0ID0gdGhpcy5ydWxlX2VmZmVjdHNbMF0udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZXNfY29tYmluaW5nLnB1c2goeyBsYWJlbDogJ1Blcm1pdCBvdmVycmlkZXMnLCB2YWx1ZTogJ1Blcm1pdCBvdmVycmlkZXMnIH0pO1xyXG4gICAgICAgIHRoaXMucnVsZXNfY29tYmluaW5nLnB1c2goeyBsYWJlbDogJ0Rlbnkgb3ZlcnJpZGVzJywgdmFsdWU6ICdEZW55IG92ZXJyaWRlcycgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9ydWxlX2NvbWJpbmluZyA9IHRoaXMucnVsZXNfY29tYmluaW5nWzBdLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uU2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlc291cmNlX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3RydWN0dXJlLz9jb2xsZWN0aW9uTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQucmVzb3VyY2VfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzID0gW107XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5ydWxlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIGVsc2UgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGRhdGEgZm9ybS5cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSB0aGlzLnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgKyBcIiAoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9mdW5jdGlvbl9uYW1lX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIlJlc291cmNlLlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJTdWJqZWN0LlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUuaW5kZXhPZignXFwnJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGNvbnRhaW4gXFwnIGNoYXJhY3RlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiJ1wiICsgdGhpcy5jb25zdGFudF92YWx1ZSArIFwiJyBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkVudmlyb25tZW50LlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiIFwiO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGxvZ2ljIGZvcm1cclxuXHJcbiAgICBhbmRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiQU5EIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIkFORCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcl9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJPUiBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJPUiBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBub3RfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiTk9UICggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiTk9UICggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbl9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbG9zZV9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIikgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKSBcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWFfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIsIFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyX2NvbmRpdGlvbihpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uIFxyXG5cclxuICAgIHByaXZhdGUgYWRkX2N1cnJlbnRfcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJ1bGVfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJ1bGVfaWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChyID09IHRoaXMucnVsZV9pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIG11c3QgYmUgdW5pcXVlJyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfcmVzdWx0LnB1c2godGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0KTtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzLnB1c2godGhpcy5ydWxlX2lkKTtcclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfZWZmZWN0cy5wdXNoKHRoaXMuc2VsZWN0ZWRfcnVsZV9lZmZlY3QpO1xyXG4gICAgICAgIHRoaXMucnVsZXMucHVzaChuZXcgQWNjZXNzQ29udHJvbFJ1bGUodGhpcy5ydWxlX2lkLCB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQsIHRoaXMuc2VsZWN0ZWRfcnVsZV9lZmZlY3QpKTtcclxuICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6ICdPbmUgcnVsZSBhZGRlZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0gZXZlbnQucXVlcnk7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGZpZWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkID0gZmlsdGVyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9saWN5X2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUG9saWN5IElEIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucnVsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiUG9saWN5SURcIjogdGhpcy5wb2xpY3lfaWQsXHJcbiAgICAgICAgICAgIFwiQ29sbGVjdGlvbk5hbWVcIjogdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogdGhpcy5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgXCJBY3Rpb25cIjogdGhpcy5zZWxlY3RlZF9hY3Rpb24sXHJcbiAgICAgICAgICAgIFwiUnVsZUNvbWJpbmluZ1wiOiB0aGlzLnNlbGVjdGVkX3J1bGVfY29tYmluaW5nLFxyXG4gICAgICAgICAgICBcIlRhcmdldFwiOiB0aGlzLnRhcmdldF9yZXN1bHQsXHJcbiAgICAgICAgICAgIFwiUnVsZXNcIjogdGhpcy5ydWxlc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ0FjY2Vzc0NvbnRyb2xQb2xpY3knLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnQ3JlYXRlIFN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPkFjY2VzcyBDb250cm9sIFBvbGljeSBGb3JtPC9oMz5cXHJcXG48cC1ncm93bCBbdmFsdWVdPVxcXCJtc2dzXFxcIj48L3AtZ3Jvd2w+XFxyXFxuPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlBvbGljeSBJZGVudGlmaWVyIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMjVcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcInBvbGljeV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtOCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+RGVzY3JpcHRpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCI3MFxcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiZGVzY3JpcHRpb25cXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5Db2xsZWN0aW9uIE5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiY29sbGVjdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcImNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiIChvbkNoYW5nZSk9XFxcIm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoJGV2ZW50LnZhbHVlKVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+QWN0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImFjdGlvbnNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9hY3Rpb25cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjNweFxcXCI+UnVsZSBDb21iaW5pbmcgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicnVsZXNfY29tYmluaW5nXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcnVsZV9jb21iaW5pbmdcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDwhLS0gVGFyZ2V0IC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlRhcmdldCBDb25kaXRpb246PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiTk9UXFxcIiAoY2xpY2spPVxcXCJub3RfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiLFxcXCIgKGNsaWNrKT1cXFwiY29tbWFfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfY29uZGl0aW9uKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwidGFyZ2V0X3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLSBSdWxlIC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgUnVsZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfY29uZGl0aW9uKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBzdHlsZT1cXFwiYm9yZGVyLWNvbG9yOiBibGFja1xcXCIgcm93cz1cXFwiMlxcXCIgY29scz1cXFwiNzBcXFwiIHBJbnB1dFRleHRhcmVhXFxyXFxuICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVxcXCJjdXJyZW50X3J1bGVfcmVzdWx0XFxcIiBbZGlzYWJsZWRdPVxcXCJ0cnVlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDogNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UnVsZSBJRCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJydWxlX2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+UnVsZSBFZmZlY3QgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicnVsZV9lZmZlY3RzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfcnVsZV9lZmZlY3RcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICBcXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIEN1cnJlbnQgUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2N1cnJlbnRfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiAqbmdJZj1cXFwicnVsZXMubGVuZ3RoID4gMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcInJ1bGVzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJSdWxlSWRcXFwiIGhlYWRlcj1cXFwiUnVsZSBJRFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb25kaXRpb25cXFwiIGhlYWRlcj1cXFwiQ29uZGl0aW9uXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMzIwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJFZmZlY3RcXFwiIGhlYWRlcj1cXFwiRWZmZWN0XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J292ZXJmbG93JzondmlzaWJsZSd9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY29sIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiZWRpdG9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbKG5nTW9kZWwpXT1cXFwiY2FyW2NvbC5maWVsZF1cXFwiIFtvcHRpb25zXT1cXFwicnVsZV9lZmZlY3RzXFxcIiBbYXV0b1dpZHRoXT1cXFwiZmFsc2VcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxMDAlJ31cXFwiIHJlcXVpcmVkPVxcXCJ0cnVlXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDxwLWZpZWxkc2V0IGxlZ2VuZD1cXFwiVXRpbGl0eVxcXCIgW3RvZ2dsZWFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5GdW5jdGlvbiBOYW1lOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJmdW5jdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX2Z1bmN0aW9uX25hbWVcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+UmVzb3VyY2UgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MjhweFxcXCI+U3ViamVjdCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwic3ViamVjdF9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX3N1YmplY3RfZmllbGRfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkNvbnN0YW50IFZhbHVlOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJjb25zdGFudF92YWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJcXFwiPkVudmlyb25tZW50IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtYXV0b0NvbXBsZXRlIFsobmdNb2RlbCldPVxcXCJlbnZpcm9ubWVudF92YWx1ZVxcXCIgW3N1Z2dlc3Rpb25zXT1cXFwiZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGRcXFwiIChjb21wbGV0ZU1ldGhvZCk9XFxcImZpbHRlcl9lbnZpcm9ubWVudF9maWVsZCgkZXZlbnQpXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttaW5MZW5ndGhdPVxcXCIxXFxcIiBbc2l6ZV09XFxcIjE3XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcC1hdXRvQ29tcGxldGU+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvcC1maWVsZHNldD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIFxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPkNyZWF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBBY2Nlc3NDb250cm9sUnVsZSB9IGZyb20gJy4uLy4uL21vZGVscy9hY2Nlc3NfY29udHJvbF9ydWxlLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdwcml2YWN5X3J1bGUnLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjY2Vzc0NvbnRyb2xEZXRhaWxDb21wb25lbnQge1xyXG4gICAgLy8jcmVnaW9uIFJlc291cmNlXHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlc291cmNlX2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX2ZpZWxkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3ZhbHVlczogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9vcGVyYXRvcnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9vcGVyYXRvcjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uZGl0aW9uX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcG9saWN5X2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgYWN0aW9uczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2FjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgcnVsZV9lZmZlY3RzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfcnVsZV9lZmZlY3Q6IHN0cmluZztcclxuICAgIHByaXZhdGUgZmluYWxfcnVsZV9lZmZlY3RzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZnVuY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9mdW5jdGlvbl9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJqZWN0X2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX3N1YmplY3RfZmllbGQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRfcnVsZV9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbmFsX3J1bGVfcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBydWxlc19jb21iaW5pbmc6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9ydWxlX2NvbWJpbmluZzogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgdGFyZ2V0X3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgY29uc3RhbnRfdmFsdWU6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcblxyXG4gICAgcHJpdmF0ZSBydWxlX2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgcnVsZV9pZHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBqc29uX2hlbHBlcjogYW55O1xyXG4gICAgcHJpdmF0ZSBtc2dzOiBNZXNzYWdlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVzOiBBY2Nlc3NDb250cm9sUnVsZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSA9IGNvbGxlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnZnVuY3Rpb24vJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmFtZXM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuZnVuY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgPSBuYW1lc1swXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N1YmplY3QvZmllbGRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5zdWJqZWN0X2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3JlYWQnLCB2YWx1ZTogJ3JlYWQnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdjcmVhdGUnLCB2YWx1ZTogJ2NyZWF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3VwZGF0ZScsIHZhbHVlOiAndXBkYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnZGVsZXRlJywgdmFsdWU6ICdkZWxldGUnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bGVfZWZmZWN0cy5wdXNoKHsgbGFiZWw6ICdQZXJtaXQnLCB2YWx1ZTogJ1Blcm1pdCcgfSk7XHJcbiAgICAgICAgdGhpcy5ydWxlX2VmZmVjdHMucHVzaCh7IGxhYmVsOiAnRGVueScsIHZhbHVlOiAnRGVueScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9ydWxlX2VmZmVjdCA9IHRoaXMucnVsZV9lZmZlY3RzWzBdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bGVzX2NvbWJpbmluZy5wdXNoKHsgbGFiZWw6ICdQZXJtaXQgb3ZlcnJpZGVzJywgdmFsdWU6ICdQZXJtaXQgb3ZlcnJpZGVzJyB9KTtcclxuICAgICAgICB0aGlzLnJ1bGVzX2NvbWJpbmluZy5wdXNoKHsgbGFiZWw6ICdEZW55IG92ZXJyaWRlcycsIHZhbHVlOiAnRGVueSBvdmVycmlkZXMnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfcnVsZV9jb21iaW5pbmcgPSB0aGlzLnJ1bGVzX2NvbWJpbmluZ1swXS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMucnVsZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBkYXRhIGZvcm0uXHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBsb2dpYyBmb3JtXHJcblxyXG4gICAgYW5kX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkFORCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJBTkQgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiT1IgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiT1IgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk5PVCAoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk5PVCAoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VfYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIpIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIikgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1hX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiwgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhcl9jb25kaXRpb24oaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvbiBcclxuXHJcbiAgICBwcml2YXRlIGFkZF9jdXJyZW50X3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ydWxlX2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJRCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHIgb2YgdGhpcy5ydWxlX2lkcykge1xyXG4gICAgICAgICAgICBpZiAociA9PSB0aGlzLnJ1bGVfaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJRCBtdXN0IGJlIHVuaXF1ZScgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9ydWxlX3Jlc3VsdC5wdXNoKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCk7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcy5wdXNoKHRoaXMucnVsZV9pZCk7XHJcbiAgICAgICAgdGhpcy5maW5hbF9ydWxlX2VmZmVjdHMucHVzaCh0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0KTtcclxuICAgICAgICB0aGlzLnJ1bGVzLnB1c2gobmV3IEFjY2Vzc0NvbnRyb2xSdWxlKHRoaXMucnVsZV9pZCwgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0LCB0aGlzLnNlbGVjdGVkX3J1bGVfZWZmZWN0KSk7XHJcbiAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnT25lIHJ1bGUgYWRkZWQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBvbGljeV9pZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1BvbGljeSBJRCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJ1bGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIlBvbGljeUlEXCI6IHRoaXMucG9saWN5X2lkLFxyXG4gICAgICAgICAgICBcIkNvbGxlY3Rpb25OYW1lXCI6IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IHRoaXMuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIFwiQWN0aW9uXCI6IHRoaXMuc2VsZWN0ZWRfYWN0aW9uLFxyXG4gICAgICAgICAgICBcIlJ1bGVDb21iaW5pbmdcIjogdGhpcy5zZWxlY3RlZF9ydWxlX2NvbWJpbmluZyxcclxuICAgICAgICAgICAgXCJUYXJnZXRcIjogdGhpcy50YXJnZXRfcmVzdWx0LFxyXG4gICAgICAgICAgICBcIlJ1bGVzXCI6IHRoaXMucnVsZXNcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdBY2Nlc3NDb250cm9sUG9saWN5JywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ0NyZWF0ZSBTdWNjZXNzZnVsbHknIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5yZXNldCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL2FjY2Vzc19jb250cm9sX2RldGFpbC5jb21wb25lbnQudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgzIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOmNlbnRlclxcXCI+QWNjZXNzIENvbnRyb2wgUG9saWN5IERldGFpbDwvaDM+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qb2xpY3kgSWRlbnRpZmllciA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJwb2xpY3lfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTggZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPkRlc2NyaXB0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiNzBcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImRlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+Q29sbGVjdGlvbiBOYW1lIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbGxlY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkFjdGlvbiA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJhY3Rpb25zXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfYWN0aW9uXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDozcHhcXFwiPlJ1bGUgQ29tYmluaW5nIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJ1bGVzX2NvbWJpbmluZ1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3J1bGVfY29tYmluaW5nXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8IS0tIFRhcmdldCAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5UYXJnZXQgQ29uZGl0aW9uOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk9SXFxcIiAoY2xpY2spPVxcXCJvcl9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKVxcXCIgKGNsaWNrKT1cXFwiY2xvc2VfYnJhY2tldF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX2NvbmRpdGlvbih0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInRhcmdldF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwhLS0gUnVsZSAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5DdXJyZW50IFJ1bGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX2NvbmRpdGlvbigpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY3VycmVudF9ydWxlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6IDVweFxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlJ1bGUgSUQgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicnVsZV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlJ1bGUgRWZmZWN0IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJ1bGVfZWZmZWN0c1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3J1bGVfZWZmZWN0XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBDdXJyZW50IFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jdXJyZW50X3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCIgKm5nSWY9XFxcInJ1bGVzLmxlbmd0aCA+IDBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJydWxlc1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUlkXFxcIiBoZWFkZXI9XFxcIlJ1bGUgSURcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29uZGl0aW9uXFxcIiBoZWFkZXI9XFxcIkNvbmRpdGlvblxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzMyMHB4J31cXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRWZmZWN0XFxcIiBoZWFkZXI9XFxcIkVmZmVjdFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieydvdmVyZmxvdyc6J3Zpc2libGUnfVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbGV0LWNvbCBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gWyhuZ01vZGVsKV09XFxcImNhcltjb2wuZmllbGRdXFxcIiBbb3B0aW9uc109XFxcInJ1bGVfZWZmZWN0c1xcXCIgW2F1dG9XaWR0aF09XFxcImZhbHNlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTAwJSd9XFxcIiByZXF1aXJlZD1cXFwidHJ1ZVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8cC1maWVsZHNldCBsZWdlbmQ9XFxcIlV0aWxpdHlcXFwiIFt0b2dnbGVhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+RnVuY3Rpb24gTmFtZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiZnVuY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9mdW5jdGlvbl9uYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc291cmNlIEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI4cHhcXFwiPlN1YmplY3QgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5Db25zdGFudCBWYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwiXFxcIj5FbnZpcm9ubWVudCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWF1dG9Db21wbGV0ZSBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfdmFsdWVcXFwiIFtzdWdnZXN0aW9uc109XFxcImVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkXFxcIiAoY29tcGxldGVNZXRob2QpPVxcXCJmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoJGV2ZW50KVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbWluTGVuZ3RoXT1cXFwiMVxcXCIgW3NpemVdPVxcXCIxN1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3AtYXV0b0NvbXBsZXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L3AtZmllbGRzZXQ+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPlVwZGF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvYWNjZXNzX2NvbnRyb2xfZGV0YWlsLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgRmllbGRFZmZlY3QsIEZpZWxkRWZmZWN0T3B0aW9uLCBQcml2YWN5UnVsZSB9IGZyb20gJy4uLy4uL21vZGVscy9wcml2YWN5X3J1bGUubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3ByaXZhY3lfcG9saWN5JyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIFByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50X3J1bGVfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX3Jlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHRhcmdldF9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcbiAgICAvLyNlbmRyZWdpb24gZW52aXJvbm1lbnRcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHByaXZhY3lfZmllbGRfc2VsZWN0ZWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJpdmFjeV9mdW5jdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBmaWVsZF9lZmZlY3RzOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICBwcml2YXRlIGZpbmFsX2ZpZWxkX2VmZmVjdHM6IEZpZWxkRWZmZWN0W11bXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZmllbGRfZWZmZWN0X29wdGlvbnM6IEZpZWxkRWZmZWN0T3B0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgcHJpdmFjeV9ydWxlczogUHJpdmFjeVJ1bGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8jcmVnaW9uIGNhbGwgd2ViIGFwaSBmb3Igb3B0aW9uIGRhdGFcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSA9IGNvbGxlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICB0aGF0Lm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnZnVuY3Rpb24vJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmFtZXM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuZnVuY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgPSBuYW1lc1swXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N1YmplY3QvZmllbGRzLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5zdWJqZWN0X2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lGdW5jdGlvbnMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbWV0aG9kczogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1ldGhvZCBvZiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByaXZhY3lfZnVuY3Rpb25zLnB1c2goeyBsYWJlbDogbWV0aG9kLCB2YWx1ZTogbWV0aG9kIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQucHJpdmFjeV9mdW5jdGlvbnMucHVzaCh7IGxhYmVsOiAnT3B0aW9uYWwnLCB2YWx1ZTogJ09wdGlvbmFsJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgICAgICAvLyNyZWdpb24gaGFyZCBjb2RlIGZvciBvcHRpb25zXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3JlYWQnLCB2YWx1ZTogJ3JlYWQnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdjcmVhdGUnLCB2YWx1ZTogJ2NyZWF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ3VwZGF0ZScsIHZhbHVlOiAndXBkYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnZGVsZXRlJywgdmFsdWU6ICdkZWxldGUnIH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdLnZhbHVlO1xyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uU2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlc291cmNlX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmllbGRfZWZmZWN0X29wdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ3N0cnVjdHVyZS8/Y29sbGVjdGlvbk5hbWU9JyArIGNvbGxlY3Rpb25TZWxlY3RlZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhwcm9wZXJ0eSwganNvbk9iamVjdCwgXCJcIiwgdGhhdC5yZXNvdXJjZV9maWVsZHMpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3RzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoYXQucmVzb3VyY2VfZmllbGRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3RzLnB1c2gobmV3IEZpZWxkRWZmZWN0KGl0ZW0ubGFiZWwsIFwiT3B0aW9uYWxcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcGFyYW1ldGVyID0gdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgKyAnLicgKyBuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lGdW5jdGlvbj9uYW1lPScgKyBwYXJhbWV0ZXIsIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVmZmVjdHMgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0X2l0ZW1zOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBlZmZlY3Qgb2YgZWZmZWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RfaXRlbXMucHVzaCh7IGxhYmVsOiBlZmZlY3QsIHZhbHVlOiBlZmZlY3QgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5maWVsZF9lZmZlY3Rfb3B0aW9ucy5wdXNoKG5ldyBGaWVsZEVmZmVjdE9wdGlvbihuYW1lLCBzZWxlY3RfaXRlbXMpKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkcyhwcm9wZXJ0eTogYW55LCBqc29uT2JqZWN0OiBhbnksIHByZWZpeDogc3RyaW5nLCBjb250YWluZXI6IFNlbGVjdEl0ZW1bXSkge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PSBcIl9pZFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgLy8gICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdFswXSkge1xyXG4gICAgICAgIC8vICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgLy8gICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgZWxzZSBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gZGF0YSBmb3JtLlxyXG5cclxuICAgIGFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSB0aGlzLnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgKyBcIiAoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9yZXNvdXJjZV9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlJlc291cmNlLlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3N1YmplY3RfZmllbGRfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJTdWJqZWN0LlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3N1YmplY3RfZmllbGRfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfY29uc3RhbnRfdmFsdWVfdG9fcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUuaW5kZXhPZignXFwnJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGNvbnRhaW4gXFwnIGNoYXJhY3RlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiJ1wiICsgdGhpcy5jb25zdGFudF92YWx1ZSArIFwiJyBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9lbnZpcm9ubWVudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIkVudmlyb25tZW50LlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9lbnZpcm9ubWVudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gbG9naWMgZm9ybVxyXG5cclxuICAgIGFuZF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJBTkQgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiQU5EIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9yX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk9SIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk9SIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5vdF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJOT1QgKCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJOT1QgKCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuX2JyYWNrZXRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiKCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlX2JyYWNrZXRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiKSBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIpIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1hX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiwgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiLCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyX3J1bGUoaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9ICcnO1xyXG4gICAgICAgIHRoaXMucHJpdmFjeV9ydWxlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkX2N1cnJlbnRfcnVsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5ydWxlX2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJZCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgciBvZiB0aGlzLnJ1bGVfaWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChyID09IHRoaXMucnVsZV9pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElEIG11c3QgYmUgdW5pcXVlJyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX3J1bGVfcmVzdWx0LnB1c2godGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0KTtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzLnB1c2godGhpcy5ydWxlX2lkKTtcclxuICAgICAgICB2YXIgY2xvbmVkOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaXRlbSBvZiB0aGlzLmZpZWxkX2VmZmVjdHMpIHtcclxuICAgICAgICAgICAgY2xvbmVkLnB1c2gobmV3IEZpZWxkRWZmZWN0KGl0ZW0uTmFtZSwgaXRlbS5GdW5jdGlvbkFwcGx5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxfZmllbGRfZWZmZWN0cy5wdXNoKGNsb25lZCk7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3J1bGVzLnB1c2gobmV3IFByaXZhY3lSdWxlKHRoaXMucnVsZV9pZCwgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0LCBjbG9uZWQpKTtcclxuICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6ICdPbmUgUnVsZSBhZGRlZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQcml2YWN5RnVuY3Rpb25zKGZpZWxkTmFtZTogYW55KTogU2VsZWN0SXRlbVtdIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGRfZWZmZWN0X29wdGlvbnMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByaXZhY3lfZnVuY3Rpb25zO1xyXG4gICAgICAgIGVsc2UgcmVzdWx0ID0gdGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucy5maW5kKHggPT4geC5OYW1lID09IGZpZWxkTmFtZSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuRnVuY3Rpb25zO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByaXZhY3lfZnVuY3Rpb25zO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBldmVudC5xdWVyeTtcclxuICAgICAgICBsZXQgZmlsdGVyZWQ6IGFueVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoZmllbGQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goZmllbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGQgPSBmaWx0ZXJlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZpbmFsX2ZpZWxkX2VmZmVjdHMpO1xyXG4gICAgICAgIGlmICh0aGlzLnBvbGljeV9pZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1BvbGljeSBJZCBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnByaXZhY3lfcnVsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlcyBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIlBvbGljeUlEXCI6IHRoaXMucG9saWN5X2lkLFxyXG4gICAgICAgICAgICBcIkNvbGxlY3Rpb25OYW1lXCI6IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IHRoaXMuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIFwiVGFyZ2V0XCI6IHRoaXMudGFyZ2V0X3Jlc3VsdCxcclxuICAgICAgICAgICAgXCJSdWxlc1wiOiB0aGlzLnByaXZhY3lfcnVsZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lQb2xpY3knLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiBcIlByaXZhY3kgUG9saWN5IGFkZGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsImltcG9ydCB7IFNlbGVjdEl0ZW0gfSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRWZmZWN0IHtcclxuICAgIHB1YmxpYyBOYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgRnVuY3Rpb25BcHBseTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcml2YWN5RnVuY3Rpb246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuRnVuY3Rpb25BcHBseSA9IHByaXZhY3lGdW5jdGlvbjtcclxuICAgICAgICB0aGlzLk5hbWUgPSBwcm9wZXJ0eU5hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZEVmZmVjdE9wdGlvbiB7XHJcbiAgICBwdWJsaWMgTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEZ1bmN0aW9uczogU2VsZWN0SXRlbVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcml2YWN5RnVuY3Rpb246IFNlbGVjdEl0ZW1bXSkge1xyXG4gICAgICAgIHRoaXMuRnVuY3Rpb25zID0gcHJpdmFjeUZ1bmN0aW9uO1xyXG4gICAgICAgIHRoaXMuTmFtZSA9IHByb3BlcnR5TmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lSdWxlIHtcclxuICAgIHB1YmxpYyBSdWxlSUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBDb25kaXRpb246IHN0cmluZztcclxuICAgIHB1YmxpYyBGaWVsZEVmZmVjdHM6IEZpZWxkRWZmZWN0W107XHJcblxyXG4gICAgY29uc3RydWN0b3IocnVsZUlEOiBzdHJpbmcsIGNvbmRpdGlvbjogc3RyaW5nLCBmaWVsZEVmZmVjdHM6IEZpZWxkRWZmZWN0W10pIHtcclxuICAgICAgICB0aGlzLlJ1bGVJRCA9IHJ1bGVJRDtcclxuICAgICAgICB0aGlzLkNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcclxuICAgICAgICB0aGlzLkZpZWxkRWZmZWN0cyA9IGZpZWxkRWZmZWN0cztcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUHJpdmFjeVBvbGljeSB7XHJcbiAgICBwdWJsaWMgUG9saWN5SUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIENvbGxlY3Rpb25OYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9saWN5SUQ6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgY29sbGVjdGlvbk5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuUG9saWN5SUQgPSBwb2xpY3lJRDtcclxuICAgICAgICB0aGlzLkRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdGhpcy5Db2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9tb2RlbHMvcHJpdmFjeV9ydWxlLm1vZGVsLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPlByaXZhY3kgUG9saWN5IEZvcm08L2gzPlxcclxcbjxwLWdyb3dsIFt2YWx1ZV09XFxcIm1zZ3NcXFwiPjwvcC1ncm93bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UG9saWN5IElkZW50aWZpZXIgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicG9saWN5X2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy04IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5EZXNjcmlwdGlvbiA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjcwXFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJkZXNjcmlwdGlvblxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02XFxcIj5cXHJcXG4gICAgICAgIDwhLS0gVGFyZ2V0IC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlRhcmdldCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiTk9UXFxcIiAoY2xpY2spPVxcXCJub3RfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiLFxcXCIgKGNsaWNrKT1cXFwiY29tbWFfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfcnVsZSh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcInRhcmdldF9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwhLS0gUnVsZSAtLT5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5DdXJyZW50IFJ1bGUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyIGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBTkRcXFwiIChjbGljayk9XFxcImFuZF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiT1JcXFwiIChjbGljayk9XFxcIm9yX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiKFxcXCIgKGNsaWNrKT1cXFwib3Blbl9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIpXFxcIiAoY2xpY2spPVxcXCJjbG9zZV9icmFja2V0X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljaygpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQ0xFQVJcXFwiIChjbGljayk9XFxcImNsZWFyX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVxcXCJib3JkZXItY29sb3I6IGJsYWNrXFxcIiByb3dzPVxcXCIyXFxcIiBjb2xzPVxcXCI3MFxcXCIgcElucHV0VGV4dGFyZWFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XFxcImN1cnJlbnRfcnVsZV9yZXN1bHRcXFwiIFtkaXNhYmxlZF09XFxcInRydWVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcImZpZWxkX2VmZmVjdHNcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIk5hbWVcXFwiIGhlYWRlcj1cXFwiUHJvcGVydHkgTmFtZVxcXCIgW2VkaXRhYmxlXT1cXFwiZmFsc2VcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRnVuY3Rpb25BcHBseVxcXCIgaGVhZGVyPVxcXCJQcml2YWN5IEZ1bmN0aW9uXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieydvdmVyZmxvdyc6J3Zpc2libGUnfVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbGV0LWNvbCBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gWyhuZ01vZGVsKV09XFxcImNhcltjb2wuZmllbGRdXFxcIiBbb3B0aW9uc109XFxcImdldFByaXZhY3lGdW5jdGlvbnMoY2FyLk5hbWUpXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdXRvV2lkdGhdPVxcXCJmYWxzZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzEwMCUnfVxcXCIgcmVxdWlyZWQ9XFxcInRydWVcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XFxyXFxuICAgICAgICAgICAgICAgIDwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6IDVweFxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlJ1bGUgSWQgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwicnVsZV9pZFxcXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIEN1cnJlbnQgUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2N1cnJlbnRfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIiAqbmdJZj1cXFwicHJpdmFjeV9ydWxlcy5sZW5ndGggPiAwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwicHJpdmFjeV9ydWxlc1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUlEXFxcIiBoZWFkZXI9XFxcIlJ1bGUgSURcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29uZGl0aW9uXFxcIiBoZWFkZXI9XFxcIkNvbmRpdGlvblxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzQwMHB4J31cXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTZcXFwiPlxcclxcbiAgICAgICAgPHAtZmllbGRzZXQgbGVnZW5kPVxcXCJVdGlsaXR5XFxcIiBbdG9nZ2xlYWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPkZ1bmN0aW9uIE5hbWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImZ1bmN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfZnVuY3Rpb25fbmFtZVxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZnVuY3Rpb25fbmFtZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5SZXNvdXJjZSBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwicmVzb3VyY2VfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwicmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfcmVzb3VyY2VfZmllbGRfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoyOHB4XFxcIj5TdWJqZWN0IEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJzdWJqZWN0X2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInNlbGVjdGVkX3N1YmplY3RfZmllbGRcXFwiIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3N1YmplY3RfZmllbGRfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+Q29uc3RhbnQgVmFsdWU6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiMTdcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImNvbnN0YW50X3ZhbHVlXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcIlxcXCI+RW52aXJvbm1lbnQgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1hdXRvQ29tcGxldGUgWyhuZ01vZGVsKV09XFxcImVudmlyb25tZW50X3ZhbHVlXFxcIiBbc3VnZ2VzdGlvbnNdPVxcXCJlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZFxcXCIgKGNvbXBsZXRlTWV0aG9kKT1cXFwiZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKCRldmVudClcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21pbkxlbmd0aF09XFxcIjFcXFwiIFtzaXplXT1cXFwiMTdcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9wLWF1dG9Db21wbGV0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9lbnZpcm9ubWVudF92YWx1ZV90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPC9wLWZpZWxkc2V0PlxcclxcblxcclxcbiAgICA8L2Rpdj5cXHJcXG5cXHJcXG5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyIHRleHQtY2VudGVyXFxcIj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4tbGdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcImhlaWdodDo5MCVcXFwiIChjbGljayk9XFxcInN1Ym1pdCgpXFxcIj5DcmVhdGU8L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgU2VsZWN0SXRlbSwgTWVzc2FnZSwgQ29uZmlybWF0aW9uU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvcHJpbWVuZyc7XHJcblxyXG5pbXBvcnQgeyBBcHBTZXR0aW5nIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FwcF9zZXR0aW5nJztcclxuaW1wb3J0IHsgRmllbGRFZmZlY3QsIEZpZWxkRWZmZWN0T3B0aW9uLCBQcml2YWN5UnVsZSB9IGZyb20gJy4uLy4uL21vZGVscy9wcml2YWN5X3J1bGUubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3ByaXZhY3lfcG9saWN5X2RldGFpbCcsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9wcml2YWN5X3BvbGljeV9kZXRhaWwuY29tcG9uZW50Lmh0bWwnKVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUHJpdmFjeVBvbGljeURldGFpbENvbXBvbmVudCB7XHJcbiAgICAvLyNyZWdpb24gUmVzb3VyY2VcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgcmVzb3VyY2VfZmllbGRzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2VfdmFsdWVzOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc291cmNlX29wZXJhdG9yczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX29wZXJhdG9yOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25fcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBwb2xpY3lfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBkZXNjcmlwdGlvbjogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkX2Z1bmN0aW9uX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHN1YmplY3RfZmllbGRzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfc3ViamVjdF9maWVsZDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudF9ydWxlX3Jlc3VsdDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgZmluYWxfcnVsZV9yZXN1bHQ6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSB0YXJnZXRfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIC8vI3JlZ2lvbiBlbnZpcm9ubWVudFxyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF92YWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBjb25zdGFudF92YWx1ZTogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X2ZpZWxkX29wdGlvbnM6IHN0cmluZ1tdID0gWydwdXJwb3NlJywgJ3N0YXJ0X3RpbWUnLCAnZW5kX3RpbWUnXTtcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmlsdGVyZWRfZmllbGQ6IHN0cmluZ1tdO1xyXG4gICAgLy8jZW5kcmVnaW9uIGVudmlyb25tZW50XHJcblxyXG4gICAgcHJpdmF0ZSBydWxlX2lkOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgcnVsZV9pZHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBwcml2YWN5X2ZpZWxkX3NlbGVjdGVkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHByaXZhY3lfZnVuY3Rpb25zOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgZmllbGRfZWZmZWN0czogRmllbGRFZmZlY3RbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9maWVsZF9lZmZlY3RzOiBGaWVsZEVmZmVjdFtdW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGZpZWxkX2VmZmVjdF9vcHRpb25zOiBGaWVsZEVmZmVjdE9wdGlvbltdID0gW107XHJcbiAgICBwcml2YXRlIHByaXZhY3lfcnVsZXM6IFByaXZhY3lSdWxlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIGpzb25faGVscGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIG1zZ3M6IE1lc3NhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgIHByaXZhdGUgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgICAgICB0aGlzLmpzb25faGVscGVyID0gSlNPTjtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vI3JlZ2lvbiBjYWxsIHdlYiBhcGkgZm9yIG9wdGlvbiBkYXRhXHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdjb2xsZWN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX25hbWVzLnB1c2goeyBsYWJlbDogbmFtZSwgdmFsdWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgPSBjb2xsZWN0aW9uc1swXTtcclxuICAgICAgICAgICAgdGhhdC5vblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25zWzBdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2Z1bmN0aW9uLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5hbWVzOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIG5hbWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZ1bmN0aW9uX25hbWVzLnB1c2goeyBsYWJlbDogbmFtZSwgdmFsdWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lID0gbmFtZXNbMF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdWJqZWN0L2ZpZWxkcy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGF0LnNlbGVjdGVkX3N1YmplY3RfZmllbGQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkX3N1YmplY3RfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQuc3ViamVjdF9maWVsZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcml2YWN5RnVuY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG1ldGhvZHM6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBtZXRob2Qgb2YgbWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5wcml2YWN5X2Z1bmN0aW9ucy5wdXNoKHsgbGFiZWw6IG1ldGhvZCwgdmFsdWU6IG1ldGhvZCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnByaXZhY3lfZnVuY3Rpb25zLnB1c2goeyBsYWJlbDogJ09wdGlvbmFsJywgdmFsdWU6ICdPcHRpb25hbCcgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgLy8jcmVnaW9uIGhhcmQgY29kZSBmb3Igb3B0aW9uc1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdyZWFkJywgdmFsdWU6ICdyZWFkJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAnY3JlYXRlJywgdmFsdWU6ICdjcmVhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICd1cGRhdGUnLCB2YWx1ZTogJ3VwZGF0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2RlbGV0ZScsIHZhbHVlOiAnZGVsZXRlJyB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkX2FjdGlvbiA9IHRoaXMuYWN0aW9uc1swXS52YWx1ZTtcclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoY29sbGVjdGlvblNlbGVjdGVkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZV9maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdzdHJ1Y3R1cmUvP2NvbGxlY3Rpb25OYW1lPScgKyBjb2xsZWN0aW9uU2VsZWN0ZWQpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzb25PYmplY3Q6IGFueSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBqc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ19pZCcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbml0aWFsaXplX3Jlc291cmNlX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhhdC5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHksIGpzb25PYmplY3QsIFwiXCIsIHRoYXQucmVzb3VyY2VfZmllbGRzKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZmllbGRfZWZmZWN0cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGF0LnJlc291cmNlX2ZpZWxkcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZmllbGRfZWZmZWN0cy5wdXNoKG5ldyBGaWVsZEVmZmVjdChpdGVtLmxhYmVsLCBcIk9wdGlvbmFsXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhwcm9wZXJ0eTogYW55LCBqc29uT2JqZWN0OiBhbnksIHByZWZpeDogc3RyaW5nLCBjb250YWluZXI6IFNlbGVjdEl0ZW1bXSkge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PSBcIl9pZFwiKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJvcGVydHksIHZhbHVlOiBwcm9wZXJ0eSB9KTtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHJlZml4ICsgJy4nICsgcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBhcmFtZXRlciA9IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lICsgJy4nICsgbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcml2YWN5RnVuY3Rpb24/bmFtZT0nICsgcGFyYW1ldGVyLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZmZlY3RzID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdF9pdGVtczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZWZmZWN0IG9mIGVmZmVjdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0X2l0ZW1zLnB1c2goeyBsYWJlbDogZWZmZWN0LCB2YWx1ZTogZWZmZWN0IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZmllbGRfZWZmZWN0X29wdGlvbnMucHVzaChuZXcgRmllbGRFZmZlY3RPcHRpb24obmFtZSwgc2VsZWN0X2l0ZW1zKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiBlcnJvci50ZXh0KCkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSBqc29uT2JqZWN0W3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2Vsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xyXG4gICAgICAgIC8vICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3RbMF0pIHtcclxuICAgICAgICAvLyAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAvLyAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgIC8vICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArICcuJyArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIGVsc2UgY29udGFpbmVyLnB1c2goeyBsYWJlbDogcHJlZml4ICsgJy4nICsgcHJvcGVydHksIHZhbHVlOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGRhdGEgZm9ybS5cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSB0aGlzLnNlbGVjdGVkX2Z1bmN0aW9uX25hbWUgKyBcIiAoIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9mdW5jdGlvbl9uYW1lX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfcmVzb3VyY2VfZmllbGRfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIlJlc291cmNlLlwiICsgdGhpcy5yZXNvdXJjZV9zZWxlY3RlZF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJTdWJqZWN0LlwiICsgdGhpcy5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2NvbnN0YW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUuaW5kZXhPZignXFwnJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGNvbnRhaW4gXFwnIGNoYXJhY3RlcicgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiJ1wiICsgdGhpcy5jb25zdGFudF92YWx1ZSArIFwiJyBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fdGFyZ2V0KCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkVudmlyb25tZW50LlwiICsgdGhpcy5lbnZpcm9ubWVudF92YWx1ZSArIFwiIFwiO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGxvZ2ljIGZvcm1cclxuXHJcbiAgICBhbmRfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiQU5EIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIkFORCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcl9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJPUiBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJPUiBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBub3RfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiTk9UICggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiTk9UICggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbl9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIiggXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKCBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbG9zZV9icmFja2V0X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIikgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiKSBcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21tYV9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIsIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiwgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhcl9ydWxlKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMucnVsZV9pZHMgPSBbXTtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSAnJztcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgPSAnJztcclxuICAgICAgICB0aGlzLnByaXZhY3lfcnVsZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZF9jdXJyZW50X3J1bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucnVsZV9pZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgSWQgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHIgb2YgdGhpcy5ydWxlX2lkcykge1xyXG4gICAgICAgICAgICBpZiAociA9PSB0aGlzLnJ1bGVfaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZSBJRCBtdXN0IGJlIHVuaXF1ZScgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9ydWxlX3Jlc3VsdC5wdXNoKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCk7XHJcbiAgICAgICAgdGhpcy5ydWxlX2lkcy5wdXNoKHRoaXMucnVsZV9pZCk7XHJcbiAgICAgICAgdmFyIGNsb25lZDogRmllbGRFZmZlY3RbXSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGl0ZW0gb2YgdGhpcy5maWVsZF9lZmZlY3RzKSB7XHJcbiAgICAgICAgICAgIGNsb25lZC5wdXNoKG5ldyBGaWVsZEVmZmVjdChpdGVtLk5hbWUsIGl0ZW0uRnVuY3Rpb25BcHBseSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX2ZpZWxkX2VmZmVjdHMucHVzaChjbG9uZWQpO1xyXG4gICAgICAgIHRoaXMucHJpdmFjeV9ydWxlcy5wdXNoKG5ldyBQcml2YWN5UnVsZSh0aGlzLnJ1bGVfaWQsIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCwgY2xvbmVkKSk7XHJcbiAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnT25lIFJ1bGUgYWRkZWQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UHJpdmFjeUZ1bmN0aW9ucyhmaWVsZE5hbWU6IGFueSk6IFNlbGVjdEl0ZW1bXSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcml2YWN5X2Z1bmN0aW9ucztcclxuICAgICAgICBlbHNlIHJlc3VsdCA9IHRoaXMuZmllbGRfZWZmZWN0X29wdGlvbnMuZmluZCh4ID0+IHguTmFtZSA9PSBmaWVsZE5hbWUpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkZ1bmN0aW9ucztcclxuICAgICAgICByZXR1cm4gdGhpcy5wcml2YWN5X2Z1bmN0aW9ucztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyX2Vudmlyb25tZW50X2ZpZWxkKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0gZXZlbnQucXVlcnk7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnZpcm9ubWVudF9maWVsZF9vcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGZpZWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkID0gZmlsdGVyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdWJtaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5maW5hbF9maWVsZF9lZmZlY3RzKTtcclxuICAgICAgICBpZiAodGhpcy5wb2xpY3lfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdQb2xpY3kgSWQgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wcml2YWN5X3J1bGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUnVsZXMgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY29tbWFuZCA9IHtcclxuICAgICAgICAgICAgXCJQb2xpY3lJRFwiOiB0aGlzLnBvbGljeV9pZCxcclxuICAgICAgICAgICAgXCJDb2xsZWN0aW9uTmFtZVwiOiB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSxcclxuICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICBcIlRhcmdldFwiOiB0aGlzLnRhcmdldF9yZXN1bHQsXHJcbiAgICAgICAgICAgIFwiUnVsZXNcIjogdGhpcy5wcml2YWN5X3J1bGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmh0dHAucG9zdChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcml2YWN5UG9saWN5JywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogXCJQcml2YWN5IFBvbGljeSBhZGRlZCBzdWNjZXNzZnVsbHlcIiB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IudGV4dCgpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL2NvbXBvbmVudHMvcHJpdmFjeV9hY2Nlc3NfY29udHJvbC9wcml2YWN5X3BvbGljeV9kZXRhaWwuY29tcG9uZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjpjZW50ZXJcXFwiPlByaXZhY3kgUG9saWN5IERldGFpbDwvaDM+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qb2xpY3kgSWRlbnRpZmllciA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJwb2xpY3lfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTggZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPkRlc2NyaXB0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiNzBcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImRlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+Q29sbGVjdGlvbiBOYW1lIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbGxlY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicxNTBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTZcXFwiPlxcclxcbiAgICAgICAgPCEtLSBUYXJnZXQgLS0+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+VGFyZ2V0IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQU5EXFxcIiAoY2xpY2spPVxcXCJhbmRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIihcXFwiIChjbGljayk9XFxcIm9wZW5fYnJhY2tldF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkNMRUFSXFxcIiAoY2xpY2spPVxcXCJjbGVhcl9ydWxlKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwidGFyZ2V0X3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLSBSdWxlIC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgUnVsZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY3VycmVudF9ydWxlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiZmllbGRfZWZmZWN0c1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiTmFtZVxcXCIgaGVhZGVyPVxcXCJQcm9wZXJ0eSBOYW1lXFxcIiBbZWRpdGFibGVdPVxcXCJmYWxzZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJGdW5jdGlvbkFwcGx5XFxcIiBoZWFkZXI9XFxcIlByaXZhY3kgRnVuY3Rpb25cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J292ZXJmbG93JzondmlzaWJsZSd9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY29sIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiZWRpdG9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbKG5nTW9kZWwpXT1cXFwiY2FyW2NvbC5maWVsZF1cXFwiIFtvcHRpb25zXT1cXFwiZ2V0UHJpdmFjeUZ1bmN0aW9ucyhjYXIuTmFtZSlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F1dG9XaWR0aF09XFxcImZhbHNlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTAwJSd9XFxcIiByZXF1aXJlZD1cXFwidHJ1ZVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDogNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UnVsZSBJZCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJydWxlX2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgQ3VycmVudCBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY3VycmVudF9ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiICpuZ0lmPVxcXCJwcml2YWN5X3J1bGVzLmxlbmd0aCA+IDBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJwcml2YWN5X3J1bGVzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJSdWxlSURcXFwiIGhlYWRlcj1cXFwiUnVsZSBJRFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb25kaXRpb25cXFwiIGhlYWRlcj1cXFwiQ29uZGl0aW9uXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonNDAwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8cC1maWVsZHNldCBsZWdlbmQ9XFxcIlV0aWxpdHlcXFwiIFt0b2dnbGVhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+RnVuY3Rpb24gTmFtZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiZnVuY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9mdW5jdGlvbl9uYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc291cmNlIEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI4cHhcXFwiPlN1YmplY3QgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5Db25zdGFudCBWYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwiXFxcIj5FbnZpcm9ubWVudCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWF1dG9Db21wbGV0ZSBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfdmFsdWVcXFwiIFtzdWdnZXN0aW9uc109XFxcImVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkXFxcIiAoY29tcGxldGVNZXRob2QpPVxcXCJmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoJGV2ZW50KVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbWluTGVuZ3RoXT1cXFwiMVxcXCIgW3NpemVdPVxcXCIxN1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3AtYXV0b0NvbXBsZXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L3AtZmllbGRzZXQ+XFxyXFxuXFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPlVwZGF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9wb2xpY3lfZGV0YWlsLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBQcml2YWN5RG9tYWluLCBQcml2YWN5RG9tYWluRnVuY3Rpb24sIFByaXZhY3lEb21haW5GaWVsZCB9IGZyb20gJy4uLy4uL21vZGVscy9wcml2YWN5X2RvbWFpbi5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9kb21haW4nLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWwnKSxcclxuICAgIHByb3ZpZGVyczogW0NvbmZpcm1hdGlvblNlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgUHJpdmFjeURvbWFpbkNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25maWd1cmVkX2RvbWFpbl9uYW1lczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbGxlY3Rpb25fbmFtZXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX3NlbGVjdGVkX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHJlc291cmNlX2ZpZWxkczogU2VsZWN0SXRlbVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlc291cmNlX3NlbGVjdGVkX2ZpZWxkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2Z1bmN0aW9uczogUHJpdmFjeURvbWFpbkZ1bmN0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9mdW5jdGlvbnNfdmlldzogUHJpdmFjeURvbWFpbkZ1bmN0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9maWVsZHM6IFByaXZhY3lEb21haW5GaWVsZFtdID0gW107XHJcbiAgICBwcml2YXRlIGNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZmllbGRzX3ZpZXc6IFByaXZhY3lEb21haW5GaWVsZFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBkb21haW5fbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdjb2xsZWN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX25hbWVzLnB1c2goeyBsYWJlbDogbmFtZSwgdmFsdWU6IG5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUgPSBjb2xsZWN0aW9uc1swXTtcclxuICAgICAgICAgICAgdGhhdC5vblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25zWzBdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdQcml2YWN5RG9tYWluRmllbGQvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbnM6IGFueVtdID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGRvbWFpbiBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb25maWd1cmVkX2RvbWFpbl9uYW1lcy5wdXNoKHsgbGFiZWw6IGRvbWFpbi5kb21haW5OYW1lLCB2YWx1ZTogZG9tYWluLmRvbWFpbk5hbWUgfSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBmdW5jIG9mIGRvbWFpbi5mdW5jdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zLnB1c2gobmV3IFByaXZhY3lEb21haW5GdW5jdGlvbihmdW5jLm5hbWUsIGZ1bmMucHJpb3JpdHksIGRvbWFpbi5kb21haW5OYW1lKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBmaWVsZCBvZiBkb21haW4uZmllbGRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkcy5wdXNoKG5ldyBQcml2YWN5RG9tYWluRmllbGQoZmllbGQsIGRvbWFpbi5kb21haW5OYW1lKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lID0gdGhhdC5jb25maWd1cmVkX2RvbWFpbl9uYW1lc1swXS5sYWJlbDtcclxuICAgICAgICAgICAgdGhhdC5vblNlbGVjdERvbWFpbk5hbWUodGhhdC5jb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9uU2VsZWN0RG9tYWluTmFtZShkb21haW5fc2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9mdW5jdGlvbnNfdmlldyA9IHRoaXMuY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9mdW5jdGlvbnMuZmlsdGVyKHggPT4geC5Eb21haW5OYW1lID09IGRvbWFpbl9zZWxlY3RlZCk7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkc192aWV3ID0gdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkcy5maWx0ZXIoeCA9PiB4LkRvbWFpbk5hbWUgPT0gZG9tYWluX3NlbGVjdGVkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uU2VsZWN0ZWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlc291cmNlX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3RydWN0dXJlLz9jb2xsZWN0aW9uTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHN1Yl9wcm9wZXJ0eSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMoc3ViX3Byb3BlcnR5LCBvYmplY3QsIHByZWZpeCArIHByb3BlcnR5LCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQcmlvcml0eUZ1bmN0aW9ucygpIHtcclxuICAgICAgICBsZXQgcHJpb3JpdHlfZnVuY3Rpb25zOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGZ1bmMgb2YgdGhpcy5jb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2Z1bmN0aW9uc192aWV3KSB7XHJcbiAgICAgICAgICAgIHByaW9yaXR5X2Z1bmN0aW9ucy5wdXNoKHsgXCJOYW1lXCI6IGZ1bmMuRnVuY3Rpb25OYW1lLCBcIlByaW9yaXR5XCI6IGZ1bmMuUHJpb3JpdHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIkRvbWFpbk5hbWVcIjogdGhpcy5jb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIlByaW9yaXR5RnVuY3Rpb25zXCI6IHByaW9yaXR5X2Z1bmN0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpb3JpdHlGdW5jdGlvbnMnLCBKU09OLnN0cmluZ2lmeShjb21tYW5kKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnVXBkYXRlIFByaW9yaXR5IFN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkRmllbGQoKSB7XHJcbiAgICAgICAgbGV0IGZpZWxkTmFtZSA9IHRoaXMuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lICsgXCIuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkO1xyXG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuY29uZmlndXJlZF9wcml2YWN5X2RvbWFpbl9maWVsZHNfdmlldykge1xyXG4gICAgICAgICAgICBpZiAoZmllbGQuRmllbGROYW1lID09IGZpZWxkTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdGaWVsZCBhbHJlYWR5IGV4aXN0ZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21tYW5kID0ge1xyXG4gICAgICAgICAgICBcIkRvbWFpbk5hbWVcIjogdGhpcy5jb25maWd1cmVkX2RvbWFpbl9zZWxlY3RlZF9uYW1lLFxyXG4gICAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBmaWVsZE5hbWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbW1hbmQpO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ0RvbWFpbkZpZWxkJywgSlNPTi5zdHJpbmdpZnkoY29tbWFuZCksIHRoaXMub3B0aW9ucykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ0ZpZWxkIEFkZGVkIFN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkRG9tYWluKCkge1xyXG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRvbWFpbl9uYW1lO1xyXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lEb21haW4nLCBKU09OLnN0cmluZ2lmeShuYW1lKSwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2luZm8nLCBzdW1tYXJ5OiAnSW5mbyBNZXNzYWdlJywgZGV0YWlsOiAnSW5zZXJ0IERvbWFpbiBTdWNjZXNzZnVsbHknIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50LnRzIiwiZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW4ge1xyXG4gICAgcHVibGljIE5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBGaWVsZHNBcHBseTogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBmaWVsZHNBcHBseTogc3RyaW5nW10pIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuRmllbGRzQXBwbHkgPSBmaWVsZHNBcHBseTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW5GdW5jdGlvbiB7XHJcbiAgICBwdWJsaWMgRG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIFByaW9yaXR5OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZnVuY05hbWU6IHN0cmluZywgcHJpb3JpdHk6IG51bWJlciwgZG9tYWluTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5GdW5jdGlvbk5hbWUgPSBmdW5jTmFtZTtcclxuICAgICAgICB0aGlzLlByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5Eb21haW5OYW1lID0gZG9tYWluTmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaXZhY3lEb21haW5GaWVsZCB7XHJcbiAgICBwdWJsaWMgRG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEZpZWxkTmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZpZWxkTmFtZTogc3RyaW5nLCBkb21haW5OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLkZpZWxkTmFtZSA9IGZpZWxkTmFtZTtcclxuICAgICAgICB0aGlzLkRvbWFpbk5hbWUgPSBkb21haW5OYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvYXBwL21vZGVscy9wcml2YWN5X2RvbWFpbi5tb2RlbC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8cC1ncm93bCBbdmFsdWVdPVxcXCJtc2dzXFxcIj48L3AtZ3Jvd2w+XFxyXFxuPGgxIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOmNlbnRlclxcXCI+UHJpdmFjeSBEb21haW48L2gxPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8aDM+TmV3IERvbWFpbjwvaDM+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI1cHhcXFwiPk5hbWUgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjI1XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJkb21haW5fbmFtZVxcXCIgLz5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gaWNvbj1cXFwiZmEtcGx1c1xcXCIgKGNsaWNrKT1cXFwiYWRkRG9tYWluKClcXFwiIGxhYmVsPVxcXCJBZGQgRG9tYWluXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxoMz5SZWdpc3RlcmVkIERvbWFpbjwvaDM+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjdweFxcXCI+RG9tYWlucyA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcImNvbmZpZ3VyZWRfZG9tYWluX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29uZmlndXJlZF9kb21haW5fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMjAwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3REb21haW5OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5GdW5jdGlvbnMgOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb25maWd1cmVkX2RvbWFpbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcImNvbmZpZ3VyZWRfZG9tYWluX3NlbGVjdGVkX25hbWVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzIwMHB4J31cXFwiIChvbkNoYW5nZSk9XFxcIm9uU2VsZWN0RG9tYWluTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPlByaW9yaXR5IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHNpemU9XFxcIjIwXFxcIiBwSW5wdXRUZXh0IC8+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBwQnV0dG9uIGljb249XFxcImZhLXBsdXNcXFwiIChjbGljayk9XFxcImFkZEZpZWxkKClcXFwiIGxhYmVsPVxcXCJBZGQgRnVuY3Rpb25cXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOjEwcHg7XFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5GdW5jdGlvbnM8L2xhYmVsPlxcclxcbiAgICAgICAgPHAtZGF0YVRhYmxlIFt2YWx1ZV09XFxcImNvbmZpZ3VyZWRfcHJpdmFjeV9kb21haW5fZnVuY3Rpb25zX3ZpZXdcXFwiIFtlZGl0YWJsZV09XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRG9tYWluTmFtZVxcXCIgaGVhZGVyPVxcXCJEb21haW4gTmFtZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkZ1bmN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJGdW5jdGlvbiBOYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMzIwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlByaW9yaXR5XFxcIiBoZWFkZXI9XFxcIlByaW9yaXR5XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206MTBweDtcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgXFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgcEJ1dHRvbiBpY29uPVxcXCJmYS1zYXZlXFxcIiAoY2xpY2spPVxcXCJ1cGRhdGVQcmlvcml0eUZ1bmN0aW9ucygpXFxcIiBsYWJlbD1cXFwiVXBkYXRlIFByaW9yaXR5XFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbToyMHB4O1xcXCI+XFxyXFxuICAgICAgICA8bGFiZWw+RmllbGRzPC9sYWJlbD5cXHJcXG4gICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJjb25maWd1cmVkX3ByaXZhY3lfZG9tYWluX2ZpZWxkc192aWV3XFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIkRvbWFpbk5hbWVcXFwiIGhlYWRlcj1cXFwiRG9tYWluIE5hbWVcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJGaWVsZE5hbWVcXFwiIGhlYWRlcj1cXFwiRmllbGQgTmFtZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgIDwvcC1kYXRhVGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkNvbGxlY3Rpb24gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicyMDBweCd9XFxcIiAob25DaGFuZ2UpPVxcXCJvblNlbGVjdENvbGxlY3Rpb25OYW1lKCRldmVudC52YWx1ZSlcXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkZpZWxkcyA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInJlc291cmNlX2ZpZWxkc1xcXCIgWyhuZ01vZGVsKV09XFxcInJlc291cmNlX3NlbGVjdGVkX2ZpZWxkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XFxcInsnd2lkdGgnOicyMDBweCd9XFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy00XFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgcEJ1dHRvbiBpY29uPVxcXCJmYS1wbHVzXFxcIiAoY2xpY2spPVxcXCJhZGRGaWVsZCgpXFxcIiBsYWJlbD1cXFwiQWRkIEZpZWxkXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvcHJpdmFjeV9kb21haW5fZm9ybV9jcmVhdGUuY29tcG9uZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IFNlbGVjdEl0ZW0sIE1lc3NhZ2UsIENvbmZpcm1hdGlvblNlcnZpY2UgfSBmcm9tICdwcmltZW5nL3ByaW1lbmcnO1xyXG5cclxuaW1wb3J0IHsgQXBwU2V0dGluZyB9IGZyb20gJy4uLy4uL21vZGVscy9hcHBfc2V0dGluZyc7XHJcbmltcG9ydCB7IEFjY2Vzc0NvbnRyb2wgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWNjZXNzX2NvbnRyb2xfcnVsZS5tb2RlbCc7XHJcbmltcG9ydCB7IFByaXZhY3lQb2xpY3kgfSBmcm9tICcuLi8uLi9tb2RlbHMvcHJpdmFjeV9ydWxlLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhY2Nlc3NfY29udHJvbF9tYW5hZ2VtZW50JyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWwnKSxcclxuICAgIHByb3ZpZGVyczogW0NvbmZpcm1hdGlvblNlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgUG9saWN5TWFuYWdlbWVudENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIGFjY2Vzc19jb250cm9sczogQWNjZXNzQ29udHJvbFtdID0gW107XHJcbiAgICBwcml2YXRlIHByaXZhY3lfcG9saWN5OiBQcml2YWN5UG9saWN5W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ0FjY2Vzc0NvbnRyb2xQb2xpY3kvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGRhdGEgb2YganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NfY29udHJvbHMucHVzaChuZXcgQWNjZXNzQ29udHJvbChkYXRhLnBvbGljeUlkLCBkYXRhLmRlc2NyaXB0aW9uLCBkYXRhLmNvbGxlY3Rpb25OYW1lLCBkYXRhLnJ1bGVDb21iaW5pbmcpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ1ByaXZhY3lQb2xpY3kvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25PYmplY3QpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkYXRhIG9mIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpdmFjeV9wb2xpY3kucHVzaChuZXcgUHJpdmFjeVBvbGljeShkYXRhLnBvbGljeUlkLCBkYXRhLmRlc2NyaXB0aW9uLCBkYXRhLmNvbGxlY3Rpb25OYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+QWNjZXNzIENvbnRyb2wgTWFuYWdlbWVudDwvaDM+PC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+XFxyXFxuICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiYWNjZXNzX2NvbnRyb2xzXFxcIiBbcGFnaW5hdG9yXT1cXFwidHJ1ZVxcXCIgW3BhZ2VMaW5rc109XFxcIjNcXFwiIFtyb3dzUGVyUGFnZU9wdGlvbnNdPVxcXCJbMTAsMjAsNTBdXFxcIiBbcm93c109XFxcIjEwXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gZmllbGQ9XFxcIlBvbGljeUlEXFxcIiBoZWFkZXI9XFxcIlBvbGljeSBJRFxcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJEZXNjcmlwdGlvblxcXCIgaGVhZGVyPVxcXCJEZXNjcmlwdGlvblxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb2xsZWN0aW9uTmFtZVxcXCIgaGVhZGVyPVxcXCJDb2xsZWN0aW9uIE5hbWVcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiUnVsZUNvbWJpbmluZ1xcXCIgaGVhZGVyPVxcXCJSdWxlIENvbWJpbmluZ1xcXCIgW3NvcnRhYmxlXT1cXFwidHJ1ZVxcXCIgW2ZpbHRlcl09XFxcInRydWVcXFwiIGZpbHRlck1hdGNoTW9kZT1cXFwiY29udGFpbnNcXFwiPjwvcC1jb2x1bW4+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJBY3Rpb25cXFwiIGhlYWRlcj1cXFwiQWN0aW9uXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gc3R5bGVDbGFzcz1cXFwiY29sLWJ1dHRvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImJvZHlcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwic2VsZWN0X2FjY2Vzc19jb250cm9sKGNhcilcXFwiIGljb249XFxcImZhLXNoYXJlXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBzdHlsZUNsYXNzPVxcXCJjb2wtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiYm9keVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVpLWJ1dHRvbi1kYW5nZXJcXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwiZGVsZXRlX3ByaXZhY3lfcG9saWN5KGNhcilcXFwiIGljb249XFxcImZhLXRyYXNoXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy0xMlxcXCI+PGgzIHN0eWxlPVxcXCJjb2xvcjogYmx1ZVxcXCI+UHJpdmFjeSBNYW5hZ2VtZW50PC9oMz48L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJwcml2YWN5X3BvbGljeVxcXCIgW3BhZ2luYXRvcl09XFxcInRydWVcXFwiIFtwYWdlTGlua3NdPVxcXCIzXFxcIiBbcm93c1BlclBhZ2VPcHRpb25zXT1cXFwiWzEwLDIwLDUwXVxcXCIgW3Jvd3NdPVxcXCIxMFxcXCI+XFxyXFxuICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJQb2xpY3lJRFxcXCIgaGVhZGVyPVxcXCJQb2xpY3kgSURcXFwiIFtzb3J0YWJsZV09XFxcInRydWVcXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiRGVzY3JpcHRpb25cXFwiIGhlYWRlcj1cXFwiRGVzY3JpcHRpb25cXFwiIFtmaWx0ZXJdPVxcXCJ0cnVlXFxcIiBmaWx0ZXJNYXRjaE1vZGU9XFxcImNvbnRhaW5zXFxcIj48L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiQ29sbGVjdGlvbk5hbWVcXFwiIGhlYWRlcj1cXFwiQ29sbGVjdGlvbiBOYW1lXFxcIiBbc29ydGFibGVdPVxcXCJ0cnVlXFxcIiBbZmlsdGVyXT1cXFwidHJ1ZVxcXCIgZmlsdGVyTWF0Y2hNb2RlPVxcXCJjb250YWluc1xcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8cC1jb2x1bW4gc3R5bGVDbGFzcz1cXFwiY29sLWJ1dHRvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY2FyPVxcXCJyb3dEYXRhXFxcIiBwVGVtcGxhdGU9XFxcImJvZHlcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwic2VsZWN0X3ByaXZhY3lfcG9saWN5KGNhcilcXFwiIGljb249XFxcImZhLXNoYXJlXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgICAgIDxwLWNvbHVtbiBzdHlsZUNsYXNzPVxcXCJjb2wtYnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiYm9keVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVpLWJ1dHRvbi1kYW5nZXJcXFwiIHBCdXR0b24gKGNsaWNrKT1cXFwiZGVsZXRlX3ByaXZhY3lfcG9saWN5KGNhcilcXFwiIGljb249XFxcImZhLXRyYXNoXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICA8L3AtY29sdW1uPlxcclxcbiAgICAgICAgPC9wLWRhdGFUYWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0NsaWVudEFwcC9hcHAvY29tcG9uZW50cy9wcml2YWN5X2FjY2Vzc19jb250cm9sL3BvbGljeV9tYW5hZ2VtZW50Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBTZWxlY3RJdGVtLCBNZXNzYWdlLCBDb25maXJtYXRpb25TZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9wcmltZW5nJztcclxuXHJcbmltcG9ydCB7IEFwcFNldHRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbHMvYXBwX3NldHRpbmcnO1xyXG5pbXBvcnQgeyBGaWVsZEVmZmVjdCwgRmllbGRFZmZlY3RPcHRpb24sIFByaXZhY3lSdWxlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3ByaXZhY3lfcnVsZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAncHJpdmFjeV9wb2xpY3knLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sJylcclxufSlcclxuZXhwb3J0IGNsYXNzIFN1YlByaXZhY3lQb2xpY3lGb3JtQ3JlYXRlQ29tcG9uZW50IHtcclxuICAgIC8vI3JlZ2lvbiBSZXNvdXJjZVxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV9zZWxlY3RlZF9maWVsZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZV92YWx1ZXM6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfb3BlcmF0b3JzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2Vfc2VsZWN0ZWRfb3BlcmF0b3I6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGNvbmRpdGlvbl9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHBvbGljeV9pZDogc3RyaW5nID0gJyc7XHJcbiAgICBwcml2YXRlIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9hY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uX25hbWVzOiBTZWxlY3RJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgc3ViamVjdF9maWVsZHM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZF9zdWJqZWN0X2ZpZWxkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50X3J1bGVfcmVzdWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaW5hbF9ydWxlX3Jlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHRhcmdldF9yZXN1bHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLy8jcmVnaW9uIGVudmlyb25tZW50XHJcbiAgICBwcml2YXRlIGVudmlyb25tZW50X3ZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbnN0YW50X3ZhbHVlOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgZW52aXJvbm1lbnRfZmllbGRfb3B0aW9uczogc3RyaW5nW10gPSBbJ3B1cnBvc2UnLCAnc3RhcnRfdGltZScsICdlbmRfdGltZSddO1xyXG4gICAgcHJpdmF0ZSBlbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZDogc3RyaW5nW107XHJcbiAgICAvLyNlbmRyZWdpb24gZW52aXJvbm1lbnRcclxuXHJcbiAgICBwcml2YXRlIHJ1bGVfaWQ6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBydWxlX2lkczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHByaXZhY3lfZmllbGRfc2VsZWN0ZWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJpdmFjeV9mdW5jdGlvbnM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBmaWVsZF9lZmZlY3RzOiBGaWVsZEVmZmVjdFtdID0gW107XHJcbiAgICBwcml2YXRlIGZpbmFsX2ZpZWxkX2VmZmVjdHM6IEZpZWxkRWZmZWN0W11bXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZmllbGRfZWZmZWN0X29wdGlvbnM6IEZpZWxkRWZmZWN0T3B0aW9uW10gPSBbXTtcclxuICAgIHByaXZhdGUgcHJpdmFjeV9ydWxlczogUHJpdmFjeVJ1bGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUganNvbl9oZWxwZXI6IGFueTtcclxuICAgIHByaXZhdGUgbXNnczogTWVzc2FnZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgICAgIHRoaXMuanNvbl9oZWxwZXIgPSBKU09OO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8jcmVnaW9uIGNhbGwgd2ViIGFwaSBmb3Igb3B0aW9uIGRhdGFcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0KEFwcFNldHRpbmcuQVBJX0VORFBPSU5UICsgJ2NvbGxlY3Rpb25zLycpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25zOiBhbnlbXSA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiBuYW1lLCB2YWx1ZTogbmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmNvbGxlY3Rpb25fbmFtZXMucHVzaCh7IGxhYmVsOiAnRGVwYXJ0bWVudC5wcm9qZWN0cycsIHZhbHVlOiAnRGVwYXJ0bWVudC5wcm9qZWN0cycgfSk7XHJcbiAgICAgICAgICAgIHRoYXQuY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lID0gY29sbGVjdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHRoYXQub25TZWxlY3RDb2xsZWN0aW9uTmFtZShjb2xsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldChBcHBTZXR0aW5nLkFQSV9FTkRQT0lOVCArICdmdW5jdGlvbi8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lczogYW55W10gPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mdW5jdGlvbl9uYW1lcy5wdXNoKHsgbGFiZWw6IG5hbWUsIHZhbHVlOiBuYW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSA9IG5hbWVzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3ViamVjdC9maWVsZHMvJykuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQganNvbk9iamVjdDogYW55ID0gZGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnX2lkJykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZF9zdWJqZWN0X2ZpZWxkID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnN1YmplY3RfZmllbGRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9ucy8nKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtZXRob2RzOiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQucHJpdmFjeV9mdW5jdGlvbnMucHVzaCh7IGxhYmVsOiBtZXRob2QsIHZhbHVlOiBtZXRob2QgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5wcml2YWN5X2Z1bmN0aW9ucy5wdXNoKHsgbGFiZWw6ICdPcHRpb25hbCcsIHZhbHVlOiAnT3B0aW9uYWwnIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgICAgIC8vI3JlZ2lvbiBoYXJkIGNvZGUgZm9yIG9wdGlvbnNcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAncmVhZCcsIHZhbHVlOiAncmVhZCcgfSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goeyBsYWJlbDogJ2NyZWF0ZScsIHZhbHVlOiAnY3JlYXRlJyB9KTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaCh7IGxhYmVsOiAndXBkYXRlJywgdmFsdWU6ICd1cGRhdGUnIH0pO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdkZWxldGUnLCB2YWx1ZTogJ2RlbGV0ZScgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF0udmFsdWU7XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNlbGVjdENvbGxlY3Rpb25OYW1lKGNvbGxlY3Rpb25TZWxlY3RlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VfZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnc3RydWN0dXJlLz9jb2xsZWN0aW9uTmFtZT0nICsgY29sbGVjdGlvblNlbGVjdGVkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBqc29uT2JqZWN0OiBhbnkgPSBkYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4ganNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdfaWQnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZV9yZXNvdXJjZV9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfcmVzb3VyY2Vfc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHByb3BlcnR5LCBqc29uT2JqZWN0LCBcIlwiLCB0aGF0LnJlc291cmNlX2ZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhhdC5yZXNvdXJjZV9maWVsZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdHMucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5sYWJlbCwgXCJPcHRpb25hbFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplX2ZpZWxkX2VmZmVjdHMocHJvcGVydHk6IGFueSwganNvbk9iamVjdDogYW55LCBwcmVmaXg6IHN0cmluZywgY29udGFpbmVyOiBTZWxlY3RJdGVtW10pIHtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJfaWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRfZWZmZWN0cyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaW5pdGlhbGl6ZV9maWVsZF9lZmZlY3RzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByb3BlcnR5LCB2YWx1ZTogcHJvcGVydHkgfSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgdmFsdWU6IHByZWZpeCArICcuJyArIHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHByZWZpeCArICcuJyArIHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwYXJhbWV0ZXIgPSB0aGlzLmNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZSArICcuJyArIG5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeUZ1bmN0aW9uP25hbWU9JyArIHBhcmFtZXRlciwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0cyA9IGRhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RfaXRlbXM6IFNlbGVjdEl0ZW1bXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGVmZmVjdCBvZiBlZmZlY3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9pdGVtcy5wdXNoKHsgbGFiZWw6IGVmZmVjdCwgdmFsdWU6IGVmZmVjdCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkX2VmZmVjdF9vcHRpb25zLnB1c2gobmV3IEZpZWxkRWZmZWN0T3B0aW9uKG5hbWUsIHNlbGVjdF9pdGVtcykpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogZXJyb3IudGV4dCgpIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVfZmllbGRzKHByb3BlcnR5OiBhbnksIGpzb25PYmplY3Q6IGFueSwgcHJlZml4OiBzdHJpbmcsIGNvbnRhaW5lcjogU2VsZWN0SXRlbVtdKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09IFwiX2lkXCIpIHJldHVybjtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgc3ViX3Byb3BlcnR5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5pbml0aWFsaXplX2ZpZWxkcyhzdWJfcHJvcGVydHksIG9iamVjdCwgcHJlZml4ICsgJy4nICsgcHJvcGVydHksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9lbHNlIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuICAgICAgICAvLyAgICBmb3IgKHZhciBzdWJfcHJvcGVydHkgaW4gb2JqZWN0WzBdKSB7XHJcbiAgICAgICAgLy8gICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICAgICAgZWxzZSB0aGlzLmluaXRpYWxpemVfZmllbGRzKHN1Yl9wcm9wZXJ0eSwgb2JqZWN0LCBwcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7IGxhYmVsOiBwcm9wZXJ0eSwgdmFsdWU6IHByb3BlcnR5IH0pO1xyXG4gICAgICAgICAgICBlbHNlIGNvbnRhaW5lci5wdXNoKHsgbGFiZWw6IHByZWZpeCArICcuJyArIHByb3BlcnR5LCB2YWx1ZTogcHJlZml4ICsgJy4nICsgcHJvcGVydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBkYXRhIGZvcm0uXHJcblxyXG4gICAgYWRkX2Z1bmN0aW9uX25hbWVfdG9fcnVsZSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gdGhpcy5zZWxlY3RlZF9mdW5jdGlvbl9uYW1lICsgXCIgKCBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfZnVuY3Rpb25fbmFtZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IHRoaXMuc2VsZWN0ZWRfZnVuY3Rpb25fbmFtZSArIFwiICggXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiUmVzb3VyY2UuXCIgKyB0aGlzLnJlc291cmNlX3NlbGVjdGVkX2ZpZWxkICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJSZXNvdXJjZS5cIiArIHRoaXMucmVzb3VyY2Vfc2VsZWN0ZWRfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIlN1YmplY3QuXCIgKyB0aGlzLnNlbGVjdGVkX3N1YmplY3RfZmllbGQgKyBcIiBcIjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRfc3ViamVjdF9maWVsZF90b190YXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiU3ViamVjdC5cIiArIHRoaXMuc2VsZWN0ZWRfc3ViamVjdF9maWVsZCArIFwiIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25zdGFudF92YWx1ZS5pbmRleE9mKCdcXCcnKSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ0NvbnN0YW50IHZhbHVlIGNhbiBub3QgY29udGFpbiBcXCcgY2hhcmFjdGVyJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCInXCIgKyB0aGlzLmNvbnN0YW50X3ZhbHVlICsgXCInIFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZF9jb25zdGFudF92YWx1ZV90b190YXJnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uc3RhbnRfdmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdDb25zdGFudCB2YWx1ZSBjYW4gbm90IGJlIG51bGwnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnN0YW50X3ZhbHVlLmluZGV4T2YoJ1xcJycpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnQ29uc3RhbnQgdmFsdWUgY2FuIG5vdCBjb250YWluIFxcJyBjaGFyYWN0ZXInIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIidcIiArIHRoaXMuY29uc3RhbnRfdmFsdWUgKyBcIicgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3J1bGUoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiRW52aXJvbm1lbnQuXCIgKyB0aGlzLmVudmlyb25tZW50X3ZhbHVlICsgXCIgXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpIHtcclxuICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCJFbnZpcm9ubWVudC5cIiArIHRoaXMuZW52aXJvbm1lbnRfdmFsdWUgKyBcIiBcIjtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBsb2dpYyBmb3JtXHJcblxyXG4gICAgYW5kX2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIkFORCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCJBTkQgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3JfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiT1IgXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ICs9IFwiT1IgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90X2NsaWNrKGlzVGFyZ2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGlzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0X3Jlc3VsdCArPSBcIk5PVCAoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIk5PVCAoIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5fYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIoIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIiggXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VfYnJhY2tldF9jbGljayhpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgKz0gXCIpIFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCArPSBcIikgXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWFfY2xpY2soaXNUYXJnZXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ICs9IFwiLCBcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQgKz0gXCIsIFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJfcnVsZShpc1RhcmdldDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldF9yZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnJ1bGVfaWRzID0gW107XHJcbiAgICAgICAgdGhpcy50YXJnZXRfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3J1bGVfcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5wcml2YWN5X3J1bGVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRfY3VycmVudF9ydWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1bGVfaWQgPT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6ICdSdWxlIElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9ydWxlX3Jlc3VsdCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgY2FuIG5vdCBiZSBudWxsJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByIG9mIHRoaXMucnVsZV9pZHMpIHtcclxuICAgICAgICAgICAgaWYgKHIgPT0gdGhpcy5ydWxlX2lkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGUgSUQgbXVzdCBiZSB1bmlxdWUnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxfcnVsZV9yZXN1bHQucHVzaCh0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQpO1xyXG4gICAgICAgIHRoaXMucnVsZV9pZHMucHVzaCh0aGlzLnJ1bGVfaWQpO1xyXG4gICAgICAgIHZhciBjbG9uZWQ6IEZpZWxkRWZmZWN0W10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMuZmllbGRfZWZmZWN0cykge1xyXG4gICAgICAgICAgICBjbG9uZWQucHVzaChuZXcgRmllbGRFZmZlY3QoaXRlbS5OYW1lLCBpdGVtLkZ1bmN0aW9uQXBwbHkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9maWVsZF9lZmZlY3RzLnB1c2goY2xvbmVkKTtcclxuICAgICAgICB0aGlzLnByaXZhY3lfcnVsZXMucHVzaChuZXcgUHJpdmFjeVJ1bGUodGhpcy5ydWxlX2lkLCB0aGlzLmN1cnJlbnRfcnVsZV9yZXN1bHQsIGNsb25lZCkpO1xyXG4gICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdpbmZvJywgc3VtbWFyeTogJ0luZm8gTWVzc2FnZScsIGRldGFpbDogJ09uZSBSdWxlIGFkZGVkJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaXZhY3lGdW5jdGlvbnMoZmllbGROYW1lOiBhbnkpOiBTZWxlY3RJdGVtW10ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgICAgICBpZiAodGhpcy5maWVsZF9lZmZlY3Rfb3B0aW9ucy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcbiAgICAgICAgZWxzZSByZXN1bHQgPSB0aGlzLmZpZWxkX2VmZmVjdF9vcHRpb25zLmZpbmQoeCA9PiB4Lk5hbWUgPT0gZmllbGROYW1lKTtcclxuICAgICAgICBpZiAocmVzdWx0ICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5GdW5jdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpdmFjeV9mdW5jdGlvbnM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcl9lbnZpcm9ubWVudF9maWVsZChldmVudCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnF1ZXJ5O1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZDogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW52aXJvbm1lbnRfZmllbGRfb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmVudmlyb25tZW50X2ZpZWxkX29wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudF9maWx0ZXJlZF9maWVsZCA9IGZpbHRlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmluYWxfZmllbGRfZWZmZWN0cyk7XHJcbiAgICAgICAgaWYgKHRoaXMucG9saWN5X2lkID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHsgc2V2ZXJpdHk6ICdlcnJvcicsIHN1bW1hcnk6ICdFcnJvciBNZXNzYWdlJywgZGV0YWlsOiAnUG9saWN5IElkIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucHJpdmFjeV9ydWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3IgTWVzc2FnZScsIGRldGFpbDogJ1J1bGVzIGNhbiBub3QgYmUgbnVsbCcgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgIFwiUG9saWN5SURcIjogdGhpcy5wb2xpY3lfaWQsXHJcbiAgICAgICAgICAgIFwiQ29sbGVjdGlvbk5hbWVcIjogdGhpcy5jb2xsZWN0aW9uX3NlbGVjdGVkX25hbWUsXHJcbiAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogdGhpcy5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgXCJUYXJnZXRcIjogdGhpcy50YXJnZXRfcmVzdWx0LFxyXG4gICAgICAgICAgICBcIlJ1bGVzXCI6IHRoaXMucHJpdmFjeV9ydWxlc1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5odHRwLnBvc3QoQXBwU2V0dGluZy5BUElfRU5EUE9JTlQgKyAnUHJpdmFjeVBvbGljeScsIEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1zZ3MucHVzaCh7IHNldmVyaXR5OiAnaW5mbycsIHN1bW1hcnk6ICdJbmZvIE1lc3NhZ2UnLCBkZXRhaWw6IFwiUHJpdmFjeSBQb2xpY3kgYWRkZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXNncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tc2dzLnB1c2goeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yIE1lc3NhZ2UnLCBkZXRhaWw6IGVycm9yLnRleHQoKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDMgc3R5bGU9XFxcInRleHQtYWxpZ246Y2VudGVyXFxcIj5TdWIgUHJpdmFjeSBQb2xpY3kgRm9ybTwvaDM+XFxyXFxuPHAtZ3Jvd2wgW3ZhbHVlXT1cXFwibXNnc1xcXCI+PC9wLWdyb3dsPlxcclxcbjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qb2xpY3kgSWRlbnRpZmllciA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjIxXFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJwb2xpY3lfaWRcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTggZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDo1cHhcXFwiPkRlc2NyaXB0aW9uIDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgc2l6ZT1cXFwiNzBcXFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XFxcImRlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MzVweFxcXCI+RmllbGQgTmFtZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJjb2xsZWN0aW9uX25hbWVzXFxcIiBbKG5nTW9kZWwpXT1cXFwiY29sbGVjdGlvbl9zZWxlY3RlZF9uYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTgwcHgnfVxcXCIgKG9uQ2hhbmdlKT1cXFwib25TZWxlY3RDb2xsZWN0aW9uTmFtZSgkZXZlbnQudmFsdWUpXFxcIj48L3AtZHJvcGRvd24+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDozNXB4XFxcIj5Eb21haW4gOjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiY29sbGVjdGlvbl9uYW1lc1xcXCIgWyhuZ01vZGVsKV09XFxcImNvbGxlY3Rpb25fc2VsZWN0ZWRfbmFtZVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE4MHB4J31cXFwiIChvbkNoYW5nZSk9XFxcIm9uU2VsZWN0Q29sbGVjdGlvbk5hbWUoJGV2ZW50LnZhbHVlKVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6NXB4XFxcIj5Qcmlvcml0eSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgc2l6ZT1cXFwiMjBcXFwiIHBJbnB1dFRleHQgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTZcXFwiPlxcclxcbiAgICAgICAgPCEtLSBUYXJnZXQgLS0+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+VGFyZ2V0IDo8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQU5EXFxcIiAoY2xpY2spPVxcXCJhbmRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJOT1RcXFwiIChjbGljayk9XFxcIm5vdF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIihcXFwiIChjbGljayk9XFxcIm9wZW5fYnJhY2tldF9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2sodHJ1ZSlcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIsXFxcIiAoY2xpY2spPVxcXCJjb21tYV9jbGljayh0cnVlKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkNMRUFSXFxcIiAoY2xpY2spPVxcXCJjbGVhcl9ydWxlKHRydWUpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwidGFyZ2V0X3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLSBSdWxlIC0tPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgUnVsZSA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTIgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFORFxcXCIgKGNsaWNrKT1cXFwiYW5kX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJPUlxcXCIgKGNsaWNrKT1cXFwib3JfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIk5PVFxcXCIgKGNsaWNrKT1cXFwibm90X2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCIoXFxcIiAoY2xpY2spPVxcXCJvcGVuX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIilcXFwiIChjbGljayk9XFxcImNsb3NlX2JyYWNrZXRfY2xpY2soKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIixcXFwiIChjbGljayk9XFxcImNvbW1hX2NsaWNrKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJDTEVBUlxcXCIgKGNsaWNrKT1cXFwiY2xlYXJfcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XFxcImJvcmRlci1jb2xvcjogYmxhY2tcXFwiIHJvd3M9XFxcIjJcXFwiIGNvbHM9XFxcIjcwXFxcIiBwSW5wdXRUZXh0YXJlYVxcclxcbiAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiY3VycmVudF9ydWxlX3Jlc3VsdFxcXCIgW2Rpc2FibGVkXT1cXFwidHJ1ZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8cC1kYXRhVGFibGUgW3ZhbHVlXT1cXFwiZmllbGRfZWZmZWN0c1xcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwLWNvbHVtbiBmaWVsZD1cXFwiTmFtZVxcXCIgaGVhZGVyPVxcXCJQcm9wZXJ0eSBOYW1lXFxcIiBbZWRpdGFibGVdPVxcXCJmYWxzZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJGdW5jdGlvbkFwcGx5XFxcIiBoZWFkZXI9XFxcIlByaXZhY3kgRnVuY3Rpb25cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J292ZXJmbG93JzondmlzaWJsZSd9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBsZXQtY29sIGxldC1jYXI9XFxcInJvd0RhdGFcXFwiIHBUZW1wbGF0ZT1cXFwiZWRpdG9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbKG5nTW9kZWwpXT1cXFwiY2FyW2NvbC5maWVsZF1cXFwiIFtvcHRpb25zXT1cXFwiZ2V0UHJpdmFjeUZ1bmN0aW9ucyhjYXIuTmFtZSlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F1dG9XaWR0aF09XFxcImZhbHNlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTAwJSd9XFxcIiByZXF1aXJlZD1cXFwidHJ1ZVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cXHJcXG4gICAgICAgICAgICAgICAgPC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDogNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjVweFxcXCI+UnVsZSBJZCA6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHNpemU9XFxcIjE3XFxcIiBwSW5wdXRUZXh0IFsobmdNb2RlbCldPVxcXCJydWxlX2lkXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgQ3VycmVudCBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfY3VycmVudF9ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiICpuZ0lmPVxcXCJwcml2YWN5X3J1bGVzLmxlbmd0aCA+IDBcXFwiPlxcclxcbiAgICAgICAgICAgIDxwLWRhdGFUYWJsZSBbdmFsdWVdPVxcXCJwcml2YWN5X3J1bGVzXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJSdWxlSURcXFwiIGhlYWRlcj1cXFwiUnVsZSBJRFxcXCIgW2VkaXRhYmxlXT1cXFwidHJ1ZVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICAgICAgPHAtY29sdW1uIGZpZWxkPVxcXCJDb25kaXRpb25cXFwiIGhlYWRlcj1cXFwiQ29uZGl0aW9uXFxcIiBbZWRpdGFibGVdPVxcXCJ0cnVlXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonNDAwcHgnfVxcXCI+PC9wLWNvbHVtbj5cXHJcXG4gICAgICAgICAgICA8L3AtZGF0YVRhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNlxcXCI+XFxyXFxuICAgICAgICA8cC1maWVsZHNldCBsZWdlbmQ9XFxcIlV0aWxpdHlcXFwiIFt0b2dnbGVhYmxlXT1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XFxcInBhZGRpbmctcmlnaHQ6MTNweFxcXCI+RnVuY3Rpb24gTmFtZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cXFwiZnVuY3Rpb25fbmFtZXNcXFwiIFsobmdNb2RlbCldPVxcXCJzZWxlY3RlZF9mdW5jdGlvbl9uYW1lXFxcIiBbc3R5bGVdPVxcXCJ7J3dpZHRoJzonMTUwcHgnfVxcXCI+PC9wLWRyb3Bkb3duPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Z1bmN0aW9uX25hbWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTQgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9mdW5jdGlvbl9uYW1lX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjEzcHhcXFwiPlJlc291cmNlIEZpZWxkOiA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHAtZHJvcGRvd24gW29wdGlvbnNdPVxcXCJyZXNvdXJjZV9maWVsZHNcXFwiIFsobmdNb2RlbCldPVxcXCJyZXNvdXJjZV9zZWxlY3RlZF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9yZXNvdXJjZV9maWVsZF90b190YXJnZXQoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNCBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24taW5mb1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gUnVsZVxcXCIgKGNsaWNrKT1cXFwiYWRkX3Jlc291cmNlX2ZpZWxkX3RvX3J1bGUoKVxcXCI+PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJwYWRkaW5nLXJpZ2h0OjI4cHhcXFwiPlN1YmplY3QgRmllbGQ6IDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XFxcInN1YmplY3RfZmllbGRzXFxcIiBbKG5nTW9kZWwpXT1cXFwic2VsZWN0ZWRfc3ViamVjdF9maWVsZFxcXCIgW3N0eWxlXT1cXFwieyd3aWR0aCc6JzE1MHB4J31cXFwiPjwvcC1kcm9wZG93bj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi13YXJuaW5nXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBUYXJnZXRcXFwiIChjbGljayk9XFxcImFkZF9zdWJqZWN0X2ZpZWxkX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy00IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfc3ViamVjdF9maWVsZF90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwicGFkZGluZy1yaWdodDoxM3B4XFxcIj5Db25zdGFudCBWYWx1ZTogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzaXplPVxcXCIxN1xcXCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cXFwiY29uc3RhbnRfdmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6MjVweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJ1aS1idXR0b24td2FybmluZ1xcXCIgcEJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGxhYmVsPVxcXCJBZGQgVG8gVGFyZ2V0XFxcIiAoY2xpY2spPVxcXCJhZGRfY29uc3RhbnRfdmFsdWVfdG9fdGFyZ2V0KClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLWluZm9cXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFJ1bGVcXFwiIChjbGljayk9XFxcImFkZF9jb25zdGFudF92YWx1ZV90b19ydWxlKClcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtNiBjb2wtbGctNCBmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cXFwiXFxcIj5FbnZpcm9ubWVudCBGaWVsZDogPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwLWF1dG9Db21wbGV0ZSBbKG5nTW9kZWwpXT1cXFwiZW52aXJvbm1lbnRfdmFsdWVcXFwiIFtzdWdnZXN0aW9uc109XFxcImVudmlyb25tZW50X2ZpbHRlcmVkX2ZpZWxkXFxcIiAoY29tcGxldGVNZXRob2QpPVxcXCJmaWx0ZXJfZW52aXJvbm1lbnRfZmllbGQoJGV2ZW50KVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbWluTGVuZ3RoXT1cXFwiMVxcXCIgW3NpemVdPVxcXCIxN1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3AtYXV0b0NvbXBsZXRlPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXhzLTYgY29sLWxnLTQgZm9ybS1ncm91cFxcXCIgc3R5bGU9XFxcInBhZGRpbmctdG9wOjI1cHhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwidWktYnV0dG9uLXdhcm5pbmdcXFwiIHBCdXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBsYWJlbD1cXFwiQWRkIFRvIFRhcmdldFxcXCIgKGNsaWNrKT1cXFwiYWRkX2Vudmlyb25tZW50X3ZhbHVlX3RvX3RhcmdldCgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy02IGNvbC1sZy00IGZvcm0tZ3JvdXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nLXRvcDoyNXB4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcInVpLWJ1dHRvbi1pbmZvXFxcIiBwQnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbGFiZWw9XFxcIkFkZCBUbyBSdWxlXFxcIiAoY2xpY2spPVxcXCJhZGRfZW52aXJvbm1lbnRfdmFsdWVfdG9fcnVsZSgpXFxcIj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L3AtZmllbGRzZXQ+XFxyXFxuXFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMTIgdGV4dC1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjkwJVxcXCIgKGNsaWNrKT1cXFwic3VibWl0KClcXFwiPkNyZWF0ZTwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2FwcC9jb21wb25lbnRzL3ByaXZhY3lfYWNjZXNzX2NvbnRyb2wvc3ViX3ByaXZhY3lfcG9saWN5X2Zvcm1fY3JlYXRlLmNvbXBvbmVudC5odG1sXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSg4Nyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9kaXN0L2pzL25wbS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzA2NWFhOGJkM2YzM2U1MTZlYjhiXG4vLyBtb2R1bGUgaWQgPSA1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9