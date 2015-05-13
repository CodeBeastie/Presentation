/*
* TelerikReporting v9.0.15.324 (http://www.telerik.com/products/reporting.aspx)
* Copyright 2015 Telerik AD. All rights reserved.
*
* Telerik Reporting commercial licenses may be obtained at
* http://www.telerik.com/purchase/license-agreement/reporting.aspx
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function(trv, $, window, document, undefined) {
    "use strict";
    var stringFormatRegExp = /{(\w+?)}/g;
    var specialKeys = {
        DELETE: 46,
        BACKSPACE: 8,
        TAB: 9,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        END: 35,
        HOME: 36
    };
    function getCheckSpecialKeyFn() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("firefox") > -1) {
            var specialKeysArray = Object.keys(specialKeys);
            var specialKeysLength = specialKeysArray.length;
            return function(keyCode) {
                for (var i = 0; i < specialKeysLength; i++) {
                    if (specialKeys[specialKeysArray[i]] == keyCode) {
                        return true;
                    }
                }
            };
        }
        return function(keyCode) {
            return false;
        };
    }
    var utils = trv.utils = {
        trim: function(s, charlist) {
            return this.rtrim(this.ltrim(s, charlist), charlist);
        },
        ltrim: function(s, charlist) {
            if (charlist === undefined) {
                charlist = "s";
            }
            return s.replace(new RegExp("^[" + charlist + "]+"), "");
        },
        rtrim: function(s, charlist) {
            if (charlist === undefined) {
                charlist = "s";
            }
            return s.replace(new RegExp("[" + charlist + "]+$"), "");
        },
        stringFormat: function(template, data) {
            var isArray = Array.isArray(data);
            return template.replace(stringFormatRegExp, function($0, $1) {
                return data[isArray ? parseInt($1) : $1];
            });
        },
        isSpecialKey: getCheckSpecialKeyFn(),
        tryParseInt: function(value) {
            if (/^(\-|\+)?([0-9]+)$/.test(value)) {
                return Number(value);
            }
            return NaN;
        },
        tryParseFloat: function(value) {
            if (/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(value)) {
                return Number(value);
            }
            return NaN;
        },
        parseToLocalDate: function(date) {
            if (date instanceof Date) return date;
            var isUtc = /Z|[\+\-]\d\d:?\d\d/i.test(date);
            if (!isUtc) {
                date += "Z";
            }
            return new Date(date);
        },
        adjustTimezone: function(date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        },
        unadjustTimezone: function(date) {
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        },
        areEqual: function(v1, v2) {
            if (v1 instanceof Date && v2 instanceof Date) {
                if (v1.getTime() !== v2.getTime()) {
                    return false;
                }
            } else if (v1 !== v2) {
                return false;
            }
            return true;
        },
        reportSourcesAreEqual: function(rs1, rs2) {
            if (rs1 && rs2 && rs1.report === rs2.report) {
                var params1 = [], params2 = [];
                if (rs1.parameters) params1 = Object.getOwnPropertyNames(rs1.parameters);
                if (rs2.parameters) params2 = Object.getOwnPropertyNames(rs2.parameters);
                if (params1.length === params2.length) {
                    for (var i = params1.length - 1; i >= 0; i--) {
                        var p = params1[i];
                        var v1 = rs1.parameters[p];
                        var v2 = rs2.parameters[p];
                        if (Array.isArray(v1)) {
                            if (!Array.isArray(v2)) return false;
                            if (v1.length !== v2.length) return false;
                            for (var j = v1.length - 1; j >= 0; j--) {
                                if (!utils.areEqual(v1[j], v2[j])) {
                                    return false;
                                }
                            }
                        } else if (!utils.areEqual(v1, v2)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
    };
    trv.domUtils = function() {
        function toPixels(value) {
            return parseInt(value, 10) || 0;
        }
        return {
            getMargins: function(dom) {
                var $target = $(dom);
                return {
                    left: toPixels($target.css("marginLeft")),
                    right: toPixels($target.css("marginRight")),
                    top: toPixels($target.css("marginTop")),
                    bottom: toPixels($target.css("marginBottom"))
                };
            },
            getPadding: function(dom) {
                var $target = $(dom);
                return {
                    left: toPixels($target.css("paddingLeft")),
                    right: toPixels($target.css("paddingRight")),
                    top: toPixels($target.css("paddingTop")),
                    bottom: toPixels($target.css("paddingBottom"))
                };
            },
            getBorderWidth: function(dom) {
                var $target = $(dom);
                return {
                    left: toPixels($target.css("borderLeftWidth")),
                    right: toPixels($target.css("borderRightWidth")),
                    top: toPixels($target.css("borderTopWidth")),
                    bottom: toPixels($target.css("borderBottomWidth"))
                };
            },
            scale: function(dom, scaleX, scaleY, originX, originY) {
                scaleX = scaleX || 1;
                scaleY = scaleY || 1;
                originX = originX || 0;
                originY = originY || 0;
                var scale = utils.stringFormat("scale({0}, {1})", [ scaleX, scaleY ]), origin = utils.stringFormat("{0} {1}", [ originX, originY ]);
                $(dom).css("transform", scale).css("-moz-transform", scale).css("-ms-transform", scale).css("-webkit-transform", scale).css("-o-transform", scale).css("-moz-transform-origin", origin).css("-webkit-transform-origin", origin).css("-o-transform-origin", origin).css("-ms-transform-origin", origin).css("transform-origin", origin);
            }
        };
    }();
})(window.telerikReportViewer = window.telerikReportViewer || {}, window.jQuery, window, document);

(function(trv, $) {
    "use strict";
    var sr = {
        controllerNotInitialized: "Controller is not initialized.",
        noReportInstance: "No report instance.",
        missingTemplate: "ReportViewer template is missing. Please specify the templateUrl in the options.",
        noReport: "No report.",
        noReportDocument: "No report document.",
        invalidParameter: "Please input a valid value.",
        invalidDateTimeValue: "Please input a valid date.",
        parameterIsEmpty: "Parameter value cannot be empty.",
        cannotValidateType: "Cannot validate parameter of type {type}.",
        loadingFormats: "Loading...",
        loadingReport: "Loading report...",
        preparingDownload: "Preparing document to download. Please wait...",
        preparingPrint: "Preparing document to print. Please wait...",
        errorLoadingTemplates: "Error loading the report viewer's templates.",
        loadingReportPagesInProgress: "{0} pages loaded so far ...",
        loadedReportPagesComplete: "Done. Total {0} pages loaded.",
        noPageToDisplay: "No page to display.",
        errorDeletingReportInstance: "Error deleting report instance: {0}",
        errorRegisteringViewer: "Error registering the viewer with the service.",
        noServiceClient: "No serviceClient has been specified for this controller.",
        errorRegisteringClientInstance: "Error registering client instance",
        errorCreatingReportInstance: "Error creating report instance (Report = {0})",
        errorCreatingReportDocument: "Error creating report document (Report = {0}; Format = {1})",
        unableToGetReportParameters: "Unable to get report parameters"
    };
    trv.sr = $.extend(sr, trv.sr);
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery);

(function(trv, $, window, document, undefined) {
    "use strict";
    function IEHelper() {
        function getPdfPlugin() {
            var classIds = [ "AcroPDF.PDF.1", "PDF.PdfCtrl.6", "PDF.PdfCtrl.5" ];
            var plugin = null;
            $.each(classIds, function(index, classId) {
                try {
                    plugin = new ActiveXObject(classId);
                    if (plugin) {
                        return false;
                    }
                } catch (ex) {}
            });
            return plugin;
        }
        return {
            hasPdfPlugin: function() {
                return getPdfPlugin() !== null;
            }
        };
    }
    function FirefoxHelper() {
        function hasPdfPlugin() {
            var matches = /Firefox[\/\s](\d+\.\d+)/.exec(navigator.userAgent);
            if (null !== matches && matches.length > 1) {
                var version = parseFloat(matches[1]);
                if (version >= 19) {
                    return false;
                }
            }
            var pdfPlugins = navigator.mimeTypes["application/pdf"];
            var pdfPlugin = pdfPlugins !== null ? pdfPlugins.enabledPlugin : null;
            if (pdfPlugin) {
                var description = pdfPlugin.description;
                return description.indexOf("Adobe") !== -1 && (description.indexOf("Version") === -1 || parseFloat(description.split("Version")[1]) >= 6);
            }
            return false;
        }
        return {
            hasPdfPlugin: function() {
                return hasPdfPlugin();
            }
        };
    }
    function ChromeHelper() {
        function hasPdfPlugin() {
            var navPlugins = navigator.plugins;
            var found = false;
            $.each(navPlugins, function(key, value) {
                if (navPlugins[key].name === "Chrome PDF Viewer" || navPlugins[key].name === "Adobe Acrobat") {
                    found = true;
                    return false;
                }
            });
            return found;
        }
        return {
            hasPdfPlugin: function() {
                return hasPdfPlugin();
            }
        };
    }
    function OtherBrowserHelper() {
        return {
            hasPdfPlugin: function() {
                return false;
            }
        };
    }
    function selectBrowserHelper() {
        if (window.navigator) {
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("msie") > -1 || userAgent.indexOf("mozilla") > -1 && userAgent.indexOf("trident") > -1) return IEHelper(); else if (userAgent.indexOf("firefox") > -1) return FirefoxHelper(); else if (userAgent.indexOf("chrome") > -1) return ChromeHelper(); else return OtherBrowserHelper();
        }
        return null;
    }
    var helper = selectBrowserHelper();
    var hasPdfPlugin = helper ? helper.hasPdfPlugin() : false;
    trv.printManager = function() {
        var iframe;
        function printDesktop(src) {
            if (!iframe) {
                iframe = document.createElement("IFRAME");
                iframe.style.display = "none";
            }
            iframe.src = src;
            document.body.appendChild(iframe);
        }
        function printMobile(src) {
            window.open(src, "_self");
        }
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var printFunc = isMobile ? printMobile : printDesktop;
        return {
            print: function(src) {
                printFunc(src);
            },
            getDirectPrintState: function() {
                return hasPdfPlugin;
            }
        };
    }();
})(window.telerikReportViewer = window.telerikReportViewer || {}, window.jQuery, window, document);

(function(trv, $, undefined) {
    "use strict";
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    var JSON_MIME_TYPE = "application/json", JSON_CONTENT_TYPE = "application/json; charset=UTF-8", HTTP_GET = "GET", HTTP_POST = "POST", HTTP_PUT = "PUT", HTTP_DELETE = "DELETE";
    var defaultOptions = {};
    trv.ServiceClient = function(options) {
        options = $.extend({}, defaultOptions, options);
        var baseUrl = utils.rtrim(options.address || options.baseUrl, "\\/");
        function validateClientID(clientID) {
            if (!clientID) throw "Invalid cliendID";
        }
        function urlFromTemplate(template, args) {
            args = $.extend({}, {
                baseUrl: baseUrl
            }, args);
            return utils.stringFormat(template, args);
        }
        return {
            _urlFromTemplate: urlFromTemplate,
            registerClient: function(settings) {
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_POST,
                    url: urlFromTemplate("{baseUrl}/clients"),
                    dataType: "json",
                    data: JSON.stringify({
                        timeStamp: Date.now()
                    })
                });
                return $.ajax(ajaxSettings);
            },
            unregisterClient: function(clientID, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_DELETE,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}", {
                        clientID: clientID
                    })
                });
                return $.ajax(ajaxSettings);
            },
            getParameters: function(clientID, report, parameterValues, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_POST,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/parameters", {
                        clientID: clientID
                    }),
                    contentType: JSON_CONTENT_TYPE,
                    dataType: "json",
                    data: JSON.stringify({
                        report: report,
                        parameterValues: parameterValues
                    })
                });
                return $.ajax(ajaxSettings);
            },
            createReportInstance: function(clientID, report, parameterValues, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_POST,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances", {
                        clientID: clientID
                    }),
                    contentType: JSON_CONTENT_TYPE,
                    dataType: "json",
                    data: JSON.stringify({
                        report: report,
                        parameterValues: parameterValues
                    })
                });
                return $.ajax(ajaxSettings);
            },
            deleteReportInstance: function(clientID, instanceID, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_DELETE,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}", {
                        clientID: clientID,
                        instanceID: instanceID
                    })
                });
                return $.ajax(ajaxSettings);
            },
            createReportDocument: function(clientID, instanceID, format, deviceInfo, settings) {
                validateClientID(clientID);
                deviceInfo = deviceInfo || {};
                deviceInfo["BasePath"] = baseUrl;
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_POST,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents", {
                        clientID: clientID,
                        instanceID: instanceID
                    }),
                    contentType: JSON_CONTENT_TYPE,
                    dataType: "json",
                    data: JSON.stringify({
                        format: format,
                        deviceInfo: deviceInfo
                    })
                });
                return $.ajax(ajaxSettings);
            },
            deleteReportDocument: function(clientID, instanceID, documentID, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_DELETE,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents/{documentID}", {
                        clientID: clientID,
                        instanceID: instanceID,
                        documentID: documentID
                    })
                });
                return $.ajax(ajaxSettings);
            },
            getDocumentInfo: function(clientID, instanceID, documentID, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_GET,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents/{documentID}/info", {
                        clientID: clientID,
                        instanceID: instanceID,
                        documentID: documentID
                    }),
                    dataType: "json"
                });
                return $.ajax(ajaxSettings);
            },
            getPage: function(clientID, instanceID, documentID, pageNumber, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_GET,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents/{documentID}/pages/{pageNumber}", {
                        clientID: clientID,
                        instanceID: instanceID,
                        documentID: documentID,
                        pageNumber: pageNumber
                    }),
                    dataType: "json"
                });
                return $.ajax(ajaxSettings);
            },
            execServerAction: function(clientID, instanceID, documentID, actionID, settings) {
                validateClientID(clientID);
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_PUT,
                    url: urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents/{documentID}/actions/{actionID}", {
                        clientID: clientID,
                        instanceID: instanceID,
                        documentID: documentID,
                        actionID: actionID
                    })
                });
                return $.ajax(ajaxSettings);
            },
            formatDocumentUrl: function(clientID, instanceID, documentID, queryString) {
                var url = urlFromTemplate("{baseUrl}/clients/{clientID}/instances/{instanceID}/documents/{documentID}", {
                    clientID: clientID,
                    instanceID: instanceID,
                    documentID: documentID
                });
                if (queryString) {
                    url += "?" + queryString;
                }
                return url;
            },
            getDocumentFormats: function(settings) {
                var ajaxSettings = $.extend({}, settings, {
                    type: HTTP_GET,
                    url: urlFromTemplate("{baseUrl}/formats")
                });
                return $.ajax(ajaxSettings);
            }
        };
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr;
    if (!sr) {
        throw "Missing telerikReportViewer.sr";
    }
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReportViewer.utils";
    }
    var printManager = trv.printManager;
    if (!printManager) {
        throw "Missing telerikReportViewer.printManager";
    }
    trv.ViewModes = {
        INTERACTIVE: "INTERACTIVE",
        PRINT_PREVIEW: "PRINT_PREVIEW"
    };
    trv.PrintModes = {
        AUTO_SELECT: "AUTO_SELECT",
        FORCE_PDF_PLUGIN: "FORCE_PDF_PLUGIN",
        FORCE_PDF_FILE: "FORCE_PDF_FILE"
    };
    var defaultOptions = {
        pagePollIntervalMs: 500,
        documentInfoPollIntervalMs: 2e3
    };
    function ReportViewerController(options) {
        var controller = {}, $controller = $(controller), clientId, reportInstanceId, reportDocumentId, registerClientDfd, reportInstanceDfd, getDocumentFormatsDfd, report, parameterValues, currentPageNumber, pageCount, viewMode = trv.ViewModes.INTERACTIVE, documentFormats, loader, printMode = trv.PrintModes.AUTO_SELECT, bookmarkNodes;
        options = jQuery.extend({}, defaultOptions, options);
        if (options.settings.printMode) {
            printMode = options.settings.printMode();
        }
        var client = options.serviceClient;
        if (!client) {
            throw sr.noServiceClient;
        }
        clientId = options.settings.clientId();
        function setClientId(id) {
            clientId = id;
            options.settings.clientId(clientId);
        }
        function getFormat() {
            if (viewMode === trv.ViewModes.PRINT_PREVIEW) {
                return "HTML5";
            }
            return "HTML5Interactive";
        }
        function isInitialized() {
            return Boolean(clientId);
        }
        function initializeClientAsync() {
            if (clientId) {
                return clientId;
            }
            if (registerClientDfd) {
                return registerClientDfd;
            }
            registerClientDfd = client.registerClient();
            $.when(registerClientDfd).done(function(clientData) {
                setClientId(clientData.clientId);
                registerClientDfd = null;
            }).fail(function(xhr, status, error) {
                raiseError(formatXhrError(xhr, status, sr.errorRegisteringViewer));
                registerClientDfd = null;
            });
            return registerClientDfd;
        }
        function registerInstanceAsync() {
            if (reportInstanceId) {
                return reportInstanceId;
            }
            if (reportInstanceDfd) {
                return reportInstanceDfd;
            }
            reportInstanceDfd = createReportInstanceAsync(report, parameterValues);
            $.when(reportInstanceDfd).done(function(instanceData) {
                setReportInstance(instanceData.instanceId);
                reportInstanceDfd = null;
            }).fail(function() {
                reportInstanceDfd = null;
            });
            return reportInstanceDfd;
        }
        function clearReportState(ignoreCache) {
            var d = $.Deferred();
            if (ignoreCache) {
                deleteReportInstance(d);
            } else {
                d.resolve();
            }
            $.when(d).done(function() {
                reportDocumentId = reportInstanceId = null;
                currentPageNumber = pageCount = 0;
            });
            return d.promise();
        }
        function setReportInstance(id) {
            reportInstanceId = id;
        }
        function deleteReportInstance(d) {
            if (clientId && reportInstanceId) {
                client.deleteReportInstance(clientId, reportInstanceId).fail(function(xhr, status, error) {
                    raiseError(formatXhrError(xhr, status, formatError(sr.errorDeletingReportInstance, reportInstanceId)));
                }).done(function() {
                    d.resolve();
                });
            } else {
                d.resolve();
            }
        }
        function formatError(args) {
            var len = args.length;
            if (len == 1) {
                return args[0];
            }
            if (len > 1) {
                return utils.stringFormat(args[0], Array.prototype.slice.call(args, 1));
            }
            return "";
        }
        function raiseError() {
            controller.error(formatError(arguments));
        }
        function createReportInstanceAsync(report, parameterValues) {
            throwIfNotInitialized();
            return client.createReportInstance(clientId, report, parameterValues);
        }
        function registerDocumentAsync(format, deviceInfo) {
            throwIfNotInitialized();
            throwIfNoReportInstance();
            return client.createReportDocument(clientId, reportInstanceId, format, deviceInfo);
        }
        function getDocumentInfoRecursive(deferred, clientId, instanceId, documentId, options) {
            if (instanceId == reportInstanceId) {
                client.getDocumentInfo(clientId, instanceId, documentId).done(function(info, status, xhr) {
                    if (info && info.documentReady) {
                        deferred.resolve.apply(deferred, arguments);
                    } else {
                        deferred.notify.apply(deferred, arguments);
                        window.setTimeout(function() {
                            getDocumentInfoRecursive(deferred, clientId, instanceId, documentId, options);
                        }, options.documentInfoPollIntervalMs);
                    }
                }).fail(function() {
                    deferred.reject.apply(deferred, arguments);
                });
            }
        }
        function getDocumentReadyAsync(clientId, instanceId, documentId, options) {
            var dfd = $.Deferred();
            getDocumentInfoRecursive(dfd, clientId, instanceId, documentId, options);
            return dfd.promise();
        }
        function ReportLoader(reportHost) {
            var loaderOptions = {};
            function onReportDocumentRegistered(id) {
                if (reportHost) {
                    reportDocumentId = id;
                    onBeginLoadReport();
                    getReportDocumentReady();
                }
            }
            function onBeforeLoadReport() {
                loaderOptions.documentInfoPollIntervalMs = options.pagePollIntervalMs;
                if (reportHost) {
                    reportHost.beforeLoadReport();
                }
            }
            function onBeginLoadReport() {
                if (reportHost) {
                    reportHost.beginLoadReport();
                }
            }
            function onReportLoadComplete(info) {
                if (reportHost) {
                    reportHost.onReportLoadComplete(info);
                }
            }
            function onReportLoadProgress(info) {
                if (reportHost) {
                    pageCount = info.pageCount;
                    reportHost.reportLoadProgress(info);
                }
            }
            function getReportDocumentReady() {
                throwIfNotInitialized();
                throwIfNoReportInstance();
                throwIfNoReportDocument();
                $.when(getDocumentReadyAsync(clientId, reportInstanceId, reportDocumentId, loaderOptions)).done(function(info) {
                    onReportLoadComplete(info);
                }).fail(function(xhr, status, error) {
                    onError(formatXhrError(xhr, status, error));
                }).progress(function(info) {
                    onReportLoadProgress(info);
                });
            }
            function onError() {
                if (reportHost) {
                    reportHost.error(formatError(arguments));
                }
            }
            function getPageRecursive(deferred, pageNo) {
                client.getPage(clientId, reportInstanceId, reportDocumentId, pageNo).done(function(info, status, xhr) {
                    if (info && info.pageReady) {
                        deferred.resolve.apply(deferred, arguments);
                    } else {
                        deferred.notify.apply(deferred, arguments);
                        window.setTimeout(function() {
                            getPageRecursive(deferred, pageNo);
                        }, options.pagePollIntervalMs);
                    }
                }).fail(function() {
                    deferred.reject.apply(deferred, arguments);
                });
            }
            function getPageAsync(pageNo) {
                var d = $.Deferred();
                getPageRecursive(d, pageNo);
                return d.promise();
            }
            function onBeginLoadPage(pageNo) {
                if (reportHost) {
                    reportHost.beginLoadPage(pageNo);
                }
            }
            function onPageLoadComplete(pageNo, pageInfo) {
                loaderOptions.documentInfoPollIntervalMs = options.documentInfoPollIntervalMs;
                if (reportHost) {
                    reportHost.pageReady(pageInfo);
                }
            }
            var loadPromise;
            function loadAsync() {
                if (reportInstanceId) return reportInstanceId;
                if (loadPromise) return loadPromise;
                var dfd = $.Deferred();
                loadPromise = dfd.promise();
                onBeforeLoadReport();
                var format = getFormat(), deviceInfo = {
                    ContentOnly: true
                };
                insertUseSvgSetting(deviceInfo);
                $.when(initializeClientAsync()).then(registerInstanceAsync, function(xhr, status, error) {
                    dfd.reject(formatXhrError(xhr, status, sr.errorRegisteringClientInstance));
                }).then(function() {
                    return registerDocumentAsync(format, deviceInfo);
                }, function(xhr, status, error) {
                    dfd.reject(formatXhrError(xhr, status, utils.stringFormat(sr.errorCreatingReportInstance, [ report ])));
                }).then(function(documentData) {
                    dfd.resolve(documentData.documentId);
                }, function(xhr, status, error) {
                    dfd.reject(formatXhrError(xhr, status, utils.stringFormat(sr.errorCreatingReportDocument, [ report, format ])));
                });
                $.when(loadPromise).done(function(id) {
                    onReportDocumentRegistered(id);
                    loadPromise = null;
                }).fail(function(error) {
                    onError(error);
                    loadPromise = null;
                });
                return loadPromise;
            }
            function insertUseSvgSetting(deviceInfo) {
                if (!isSvgSupported()) {
                    deviceInfo["UseSVG"] = false;
                }
            }
            function isSvgSupported() {
                var matches = /Version\/(\d+.\d+.\d+) Safari/.exec(navigator.userAgent);
                if (matches && matches.length > 1) {
                    var version = parseFloat(matches[1]);
                    return version >= 6;
                }
                return true;
            }
            return {
                beginLoad: function() {
                    loadAsync();
                },
                beginGetPage: function(pageNo) {
                    throwIfNotInitialized();
                    $.when(loadAsync()).then(function() {
                        onBeginLoadPage(pageNo);
                        return getPageAsync(pageNo);
                    }).done(function(info) {
                        onPageLoadComplete(pageNo, info);
                    }).fail(function(xhr, status, error) {
                        onError(formatXhrError(xhr, status, error));
                    }).progress(function() {});
                },
                dispose: function() {
                    reportHost = null;
                }
            };
        }
        function formatXhrError(xhr, status, error) {
            var err;
            if (xhr) {
                try {
                    var msg = JSON.parse(xhr.responseText);
                    if (msg) {
                        err = msg.message;
                        if (msg.exceptionMessage) {
                            if (err) {
                                err += "<br/>";
                            }
                            err += msg.exceptionMessage;
                        }
                    }
                } catch (e) {
                    return xhr.responseText;
                }
            }
            if (error) {
                err = error + ":<br/>" + err;
            }
            return err || error;
        }
        function getReportPage(pageNo) {
            if (loader) {
                loader.beginGetPage(pageNo);
            }
        }
        function loadReportAsync(ignoreCache) {
            if (!report) {
                raiseError(sr.noReport);
                return;
            }
            if (loader) {
                loader.dispose();
                loader = null;
            }
            $.when(clearReportState(ignoreCache)).done(function() {
                loader = new ReportLoader(controller);
                loader.beginLoad();
            });
        }
        function onExportStarted() {
            controller.exportStarted();
        }
        function onExportDocumentReady(args) {
            controller.exportReady(args);
        }
        function onPrintStarted() {
            controller.printStarted();
        }
        function onPrintDocumentReady(args) {
            controller.printReady(args);
        }
        function printReport() {
            throwIfNoReport();
            onPrintStarted();
            var canUsePlugin = getCanUsePlugin();
            var contentDisposition = canUsePlugin ? "inline" : "attachment";
            var queryString = "response-content-disposition=" + contentDisposition;
            exportAsync("PDF", {
                ImmediatePrint: true
            }).then(function(info) {
                var url = client.formatDocumentUrl(info.clientId, info.instanceId, info.documentId, queryString);
                onPrintDocumentReady({
                    url: url
                });
                return url;
            }, function(err) {
                raiseError(err);
            }).then(function(url) {
                printManager.print(url);
            });
        }
        function getCanUsePlugin() {
            switch (printMode) {
              case trv.PrintModes.FORCE_PDF_FILE:
              case false:
                return false;

              case trv.PrintModes.FORCE_PDF_PLUGIN:
              case true:
                return true;

              default:
                return printManager.getDirectPrintState();
            }
        }
        function exportReport(format, deviceInfo) {
            throwIfNoReport();
            onExportStarted();
            var queryString = "response-content-disposition=attachment";
            exportAsync(format, deviceInfo).then(function(info) {
                var url = client.formatDocumentUrl(info.clientId, info.instanceId, info.documentId, queryString);
                onExportDocumentReady({
                    url: url
                });
                return url;
            }, function(err) {
                raiseError(err);
            }).then(function(url) {
                window.open(url, "_self");
            });
        }
        function exportAsync(format, deviceInfo) {
            throwIfNoReport();
            var dfd = $.Deferred();
            var documentID;
            $.when(initializeClientAsync()).then(registerInstanceAsync).then(function() {
                return registerDocumentAsync(format, deviceInfo);
            }, function(xhr, status, error) {
                dfd.reject(formatXhrError(xhr, status, error));
            }).then(function(documentData) {
                documentID = documentData.documentId;
                return getDocumentReadyAsync(clientId, reportInstanceId, documentData.documentId, options);
            }, function(xhr, status, error) {
                dfd.reject(formatXhrError(xhr, status, error));
            }).then(function(info) {
                dfd.resolve({
                    clientId: clientId,
                    instanceId: reportInstanceId,
                    documentId: documentID
                });
            }, function(xhr, status, error) {
                dfd.reject(formatXhrError(xhr, status, error));
            });
            return dfd.promise();
        }
        function execServerAction(actionId) {
            throwIfNoReport();
            throwIfNoReportInstance();
            throwIfNoReportDocument();
            onServerActionStarted();
            $.when(client.execServerAction(clientId, reportInstanceId, reportDocumentId, actionId)).done(function() {
                controller.refreshReport();
            }).fail(function(xhr, status, error) {
                raiseError(formatXhrError(xhr, status, error));
            });
        }
        function throwIfNotInitialized() {
            if (!isInitialized()) {
                throw sr.controllerNotInitialized;
            }
        }
        function throwIfNoReportInstance() {
            if (!reportInstanceId) {
                throw sr.noReportInstance;
            }
        }
        function throwIfNoReportDocument() {
            if (!reportDocumentId) {
                throw sr.noReportDocument;
            }
        }
        function throwIfNoReport() {
            if (!report) {
                throw sr.noReport;
            }
        }
        function getEventHandlerFromArguments(args) {
            var arg0;
            if (args && args.length) {
                arg0 = args[0];
            }
            if (typeof arg0 == "function") {
                return arg0;
            }
            return null;
        }
        function eventFactory(event, args) {
            var h = getEventHandlerFromArguments(args);
            if (h) {
                $controller.on(event, h);
            } else {
                $controller.trigger(event, args);
            }
            return controller;
        }
        function loadParametersAsync(report, paramValues) {
            var d = new $.Deferred();
            $.when(initializeClientAsync()).then(function() {
                return client.getParameters(clientId, report, paramValues || parameterValues || {});
            }, function(xhr, status, error) {
                d.reject(formatXhrError(xhr, status, error));
            }).then(function(args) {
                d.resolve(args);
            }, function(xhr, status, error) {
                d.reject(formatXhrError(xhr, status, sr.unableToGetReportParameters));
            });
            return d.promise();
        }
        function getDocumentFormatsAsync() {
            if (documentFormats) return documentFormats;
            if (getDocumentFormatsDfd) return getDocumentFormatsDfd;
            getDocumentFormatsDfd = client.getDocumentFormats().done(function(formats) {
                documentFormats = formats;
                getDocumentFormatsDfd = null;
            }).fail(function() {
                getDocumentFormatsDfd = null;
            });
            return getDocumentFormatsDfd;
        }
        function getPageForBookmark(nodes, id) {
            if (nodes) {
                for (var i = 0, len = nodes.length; i < len; i++) {
                    var node = nodes[i];
                    if (node.id == id) {
                        return node.page;
                    } else {
                        var page = getPageForBookmark(node.items, id);
                        if (page) {
                            return page;
                        }
                    }
                }
            }
            return null;
        }
        function fixDataContractJsonSerializer(arr) {
            var dict = {};
            if (Array.isArray(arr)) {
                arr.forEach(function(pair) {
                    dict[pair.Key] = pair.Value;
                });
            }
            return dict;
        }
        var actionHandlers = {
            toggleVisibility: function(args) {
                execServerAction(args.actionId);
            },
            navigateToReport: function(args) {
                onServerActionStarted();
                loadParametersAsync(args.Report, fixDataContractJsonSerializer(args.ParameterValues)).done(function(p) {
                    var params = {};
                    $.each(p || [], function() {
                        params[this.name] = this.value;
                    });
                    controller.reportSource({
                        report: args.Report,
                        parameters: params
                    });
                }).fail(function(error) {
                    raiseError(error);
                });
            },
            navigateToUrl: function(args) {
                window.open(args.Url, args.Target);
            },
            navigateToBookmark: function(args) {
                var id = args, page = getPageForBookmark(bookmarkNodes, id);
                controller.navigateToPage(page, id);
            }
        };
        function executeReportAction(actionType, args) {
            var handler = actionHandlers[actionType];
            if (typeof handler === "function") {
                window.setTimeout(function() {
                    handler(args);
                }, 0);
            }
        }
        function onServerActionStarted() {
            controller.serverActionStarted();
        }
        controller.Events = {
            ERROR: "trv.ERROR",
            EXPORT_STARTED: "trv.EXPORT_STARTED",
            EXPORT_DOCUMENT_READY: "trv.EXPORT_DOCUMENT_READY",
            PRINT_STARTED: "trv.PRINT_STARTED",
            PRINT_DOCUMENT_READY: "trv.PRINT_DOCUMENT_READY",
            BEFORE_LOAD_PARAMETERS: "trv.BEFORE_LOAD_PARAMETERS",
            BEFORE_LOAD_REPORT: "trv.BEFORE_LOAD_REPORT",
            BEGIN_LOAD_REPORT: "trv.BEGIN_LOAD_REPORT",
            REPORT_LOAD_COMPLETE: "trv.REPORT_LOAD_COMPLETE",
            REPORT_LOAD_PROGRESS: "trv.REPORT_LOAD_PROGRESS",
            BEGIN_LOAD_PAGE: "trv.BEGIN_LOAD_PAGE",
            PAGE_READY: "trv.PAGE_READY",
            VIEW_MODE_CHANGED: "trv.VIEW_MODE_CHANGED",
            REPORT_SOURCE_CHANGED: "trv.REPORT_SOURCE_CHANGED",
            NAVIGATE_TO_PAGE: "trv.NAVIGATE_TO_PAGE",
            CURRENT_PAGE_CHANGED: "trv.CURRENT_PAGE_CHANGED",
            GET_DOCUMENT_MAP_STATE: "trv.GET_DOCUMENT_MAP_STATE",
            SET_DOCUMENT_MAP_VISIBLE: "trv.SET_DOCUMENT_MAP_VISIBLE",
            GET_PARAMETER_AREA_STATE: "trv.GET_PARAMETER_AREA_STATE",
            SET_PARAMETER_AREA_VISIBLE: "trv.SET_PARAMETER_AREA_VISIBLE",
            PAGE_SCALE: "trv.PAGE_SCALE",
            GET_PAGE_SCALE: "trv.GET_PAGE_SCALE",
            SERVER_ACTION_STARTED: "trv.SERVER_ACTION_STARTED",
            TOGGLE_SIDE_MENU: "trv.TOGGLE_SIDE_MENU",
            UPDATE_UI: "trv.UPDATE_UI"
        };
        $.extend(controller, {
            reportSource: function(rs) {
                if (null === rs) {
                    report = parameterValues = null;
                    clearReportState(false);
                    controller.reportSourceChanged();
                    return this;
                } else if (rs) {
                    report = rs.report;
                    parameterValues = rs.parameters;
                    controller.reportSourceChanged();
                    return this;
                } else {
                    if (report === null) {
                        return null;
                    }
                    return {
                        report: report,
                        parameters: $.extend({}, parameterValues)
                    };
                }
            },
            setParameters: function(paramValues) {
                parameterValues = paramValues;
            },
            pageCount: function() {
                return pageCount;
            },
            currentPageNumber: function(pageNo) {
                if (pageNo === undefined) return currentPageNumber;
                var num = utils.tryParseInt(pageNo);
                if (num != currentPageNumber) {
                    currentPageNumber = num;
                    this.currentPageChanged();
                }
                return this;
            },
            viewMode: function(vm) {
                if (!vm) {
                    return viewMode;
                }
                if (viewMode != vm) {
                    viewMode = vm;
                    controller.viewModeChanged(vm);
                    if (report) {
                        controller.refreshReport();
                    }
                }
                return controller;
            },
            refreshReport: function(ignoreCache) {
                return loadReportAsync(ignoreCache);
            },
            exportReport: function(format, deviceInfo) {
                exportReport(format, deviceInfo);
            },
            printReport: function() {
                printReport();
            },
            getReportPage: function(pageNumber) {
                getReportPage(pageNumber);
            },
            executeReportAction: function(actionType, args) {
                executeReportAction(actionType, args);
            },
            loadParameters: function(paramValues) {
                if (report === null) {
                    return {};
                }
                controller.beforeLoadParameters(paramValues == null);
                return loadParametersAsync(report, paramValues);
            },
            getDocumentFormats: function() {
                return getDocumentFormatsAsync();
            },
            clientId: function() {
                return clientId;
            },
            onReportLoadComplete: function(info) {
                pageCount = info.pageCount;
                bookmarkNodes = info.bookmarkNodes;
                controller.reportLoadComplete(info);
            },
            error: function() {
                return eventFactory(controller.Events.ERROR, arguments);
            },
            exportStarted: function() {
                return eventFactory(controller.Events.EXPORT_STARTED, arguments);
            },
            exportReady: function() {
                return eventFactory(controller.Events.EXPORT_DOCUMENT_READY, arguments);
            },
            printStarted: function() {
                return eventFactory(controller.Events.PRINT_STARTED, arguments);
            },
            printReady: function() {
                return eventFactory(controller.Events.PRINT_DOCUMENT_READY, arguments);
            },
            beforeLoadParameters: function() {
                return eventFactory(controller.Events.BEFORE_LOAD_PARAMETERS, arguments);
            },
            beforeLoadReport: function() {
                return eventFactory(controller.Events.BEFORE_LOAD_REPORT, arguments);
            },
            beginLoadReport: function() {
                return eventFactory(controller.Events.BEGIN_LOAD_REPORT, arguments);
            },
            reportLoadComplete: function() {
                return eventFactory(controller.Events.REPORT_LOAD_COMPLETE, arguments);
            },
            reportLoadProgress: function() {
                return eventFactory(controller.Events.REPORT_LOAD_PROGRESS, arguments);
            },
            beginLoadPage: function() {
                return eventFactory(controller.Events.BEGIN_LOAD_PAGE, arguments);
            },
            pageReady: function() {
                return eventFactory(controller.Events.PAGE_READY, arguments);
            },
            viewModeChanged: function() {
                return eventFactory(controller.Events.VIEW_MODE_CHANGED, arguments);
            },
            reportSourceChanged: function() {
                return eventFactory(controller.Events.REPORT_SOURCE_CHANGED, arguments);
            },
            navigateToPage: function() {
                return eventFactory(controller.Events.NAVIGATE_TO_PAGE, arguments);
            },
            currentPageChanged: function() {
                return eventFactory(controller.Events.CURRENT_PAGE_CHANGED, arguments);
            },
            getDocumentMapState: function() {
                return eventFactory(controller.Events.GET_DOCUMENT_MAP_STATE, arguments);
            },
            setDocumentMapVisible: function() {
                return eventFactory(controller.Events.SET_DOCUMENT_MAP_VISIBLE, arguments);
            },
            getParametersAreaState: function() {
                return eventFactory(controller.Events.GET_PARAMETER_AREA_STATE, arguments);
            },
            setParametersAreaVisible: function() {
                return eventFactory(controller.Events.SET_PARAMETER_AREA_VISIBLE, arguments);
            },
            scale: function() {
                return eventFactory(controller.Events.PAGE_SCALE, arguments);
            },
            getScale: function() {
                return eventFactory(controller.Events.GET_PAGE_SCALE, arguments);
            },
            serverActionStarted: function() {
                return eventFactory(controller.Events.SERVER_ACTION_STARTED, arguments);
            }
        });
        return controller;
    }
    trv.ReportViewerController = ReportViewerController;
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    trv.touchBehavior = function(dom, options) {
        var startDistance, ignoreTouch;
        init(dom);
        function init(element) {
            if (typeof $.fn.kendoTouch === "function") {
                $(element).mousedown(function() {
                    ignoreTouch = true;
                }).mouseup(function() {
                    ignoreTouch = false;
                }).kendoTouch({
                    multiTouch: true,
                    enableSwipe: true,
                    swipe: function(e) {
                        if (!ignoreTouch) {
                            onSwipe(e);
                        }
                    },
                    gesturestart: function(e) {
                        if (!ignoreTouch) {
                            onGestureStart(e);
                        }
                    },
                    gestureend: function(e) {
                        if (!ignoreTouch) {
                            onGestureEnd(e);
                        }
                    },
                    gesturechange: function(e) {
                        if (!ignoreTouch) {
                            onGestureChange(e);
                        }
                    },
                    doubletap: function(e) {
                        if (!ignoreTouch) {
                            onDoubleTap(e);
                        }
                    },
                    touchstart: function(e) {
                        if (!ignoreTouch) {
                            fire("touchstart");
                        }
                    }
                });
            }
        }
        function onDoubleTap(e) {
            fire("doubletap", e);
        }
        function onGestureStart(e) {
            startDistance = kendo.touchDelta(e.touches[0], e.touches[1]).distance;
        }
        function onGestureEnd(e) {}
        function onGestureChange(e) {
            var current = kendo.touchDelta(e.touches[0], e.touches[1]).distance;
            onPinch({
                distance: current,
                lastDistance: startDistance
            });
            startDistance = current;
        }
        function onSwipe(e) {
            fire("swipe", e);
        }
        function onPinch(e) {
            fire("pinch", e);
        }
        function fire(func, args) {
            var handler = options[func];
            if (typeof handler === "function") {
                handler(args);
            }
        }
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr;
    if (!sr) {
        throw "Missing telerikReportViewer.sr";
    }
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReportViewer.utils";
    }
    var domUtils = trv.domUtils;
    var touchBehavior = trv.touchBehavior;
    if (!touchBehavior) {
        throw "Missing telerikReportViewer.touch";
    }
    var defaultOptions = {};
    var scaleModes = trv.ScaleModes = {
        FIT_PAGE_WIDTH: "FIT_PAGE_WIDTH",
        FIT_PAGE: "FIT_PAGE",
        SPECIFIC: "SPECIFIC"
    };
    function PagesArea(placeholder, options) {
        options = $.extend({}, defaultOptions, options);
        var controller = options.controller;
        if (!controller) throw "No controller (telerikReportViewer.reportViewerController) has been specified.";
        var $placeholder = $(placeholder), $pageContainer = $placeholder.find(".trv-page-container"), pageContainer = $pageContainer[0], $errorMessage = $placeholder.find(".trv-error-message"), actions, pendingBookmark, pageScaleMode = scaleModes.SPECIFIC, pageScale = 1, minPageScale = .1, maxPageScale = 8, documentReady = true, navigateToPageOnDocReady, navigateToBookmarkOnDocReady, isNewReportSource, showErrorTimeoutId;
        $(window).on("resize", function(event, args) {
            if (shouldAutosizePage()) {
                updatePageDimensions();
            }
        });
        enableTouch($placeholder);
        function clearPendingTimeoutIds() {
            if (showErrorTimeoutId) {
                window.clearTimeout(showErrorTimeoutId);
            }
        }
        function invalidateCurrentlyLoadedPage() {
            var page = findPage(navigateToPageOnDocReady);
            if (page) {
                pageNo(page, -1);
            }
        }
        function navigateWhenPageAvailable(pageNumber, pageCount) {
            if (pageNumber && pageNumber <= pageCount) {
                navigateToPage(pageNumber, navigateToBookmarkOnDocReady);
            }
        }
        function navigateOnLoadComplete(pageNumber, pageCount) {
            if (pageNumber) {
                var pageNumber = Math.min(pageNumber, pageCount);
                navigateToPage(pageNumber, navigateToBookmarkOnDocReady);
            }
        }
        function clearPage() {
            clear(isNewReportSource);
            isNewReportSource = false;
        }
        controller.reportSourceChanged(function() {
            isNewReportSource = true;
            navigateToPageOnDocReady = null;
            navigateToBookmarkOnDocReady = null;
            documentReady = false;
        }).beforeLoadParameters(function(event, initial) {
            if (initial) {
                showError(sr.loadingReport);
            }
        }).beforeLoadReport(function() {
            documentReady = false;
            if (!navigateToPageOnDocReady) navigateToPageOnDocReady = 1;
            clearPendingTimeoutIds();
            clear();
            disablePagesArea(true);
            showError(sr.loadingReport);
        }).beginLoadReport(function(event, args) {
            documentReady = true;
            invalidateCurrentlyLoadedPage();
        }).reportLoadProgress(function(event, args) {
            navigateWhenPageAvailable(navigateToPageOnDocReady, args.pageCount);
            showError(utils.stringFormat(sr.loadingReportPagesInProgress, [ args.pageCount ]));
        }).reportLoadComplete(function(event, args) {
            if (0 === args.pageCount) {
                clearPage();
                showError(sr.noPageToDisplay);
            } else {
                navigateOnLoadComplete(navigateToPageOnDocReady, args.pageCount);
                showError(utils.stringFormat(sr.loadedReportPagesComplete, [ args.pageCount ]));
                showErrorTimeoutId = window.setTimeout(showError, 2e3);
                enableInteractivity();
            }
        }).navigateToPage(function(event, pageNumber, bookmark) {
            navigateToPage(pageNumber, bookmark);
        }).pageReady(function(event, page) {
            setPageContent(page);
            disablePagesArea(false);
        }).error(function(event, error) {
            disablePagesArea(false);
            clearPage();
            showError(error);
        }).exportStarted(function(event, args) {
            showError(sr.preparingDownload);
        }).exportReady(function(event, args) {
            showError();
        }).printStarted(function(event, args) {
            showError(sr.preparingPrint);
        }).printReady(function(event, args) {
            showError();
        }).scale(function(event, args) {
            setPageScale(args);
        }).getScale(function(event, args) {
            var page = getCurrentPage();
            var scale = $(page).data("pageScale") || pageScale;
            args.scale = scale;
            args.scaleMode = pageScaleMode;
        }).setDocumentMapVisible(function() {
            if (shouldAutosizePage()) {
                updatePageDimensions();
            }
        }).setParametersAreaVisible(function() {
            if (shouldAutosizePage()) {
                updatePageDimensions();
            }
        }).serverActionStarted(function() {
            disablePagesArea(true);
            showError(sr.loadingReport);
        });
        function enableTouch(dom) {
            var allowSwipeLeft, allowSwipeRight;
            touchBehavior(dom, {
                swipe: function(e) {
                    var pageNumber = controller.currentPageNumber();
                    if (allowSwipeLeft && e.direction == "left") {
                        if (pageNumber < controller.pageCount()) {
                            controller.navigateToPage(pageNumber + 1);
                        }
                    } else if (allowSwipeRight && e.direction == "right") {
                        if (pageNumber > 1) {
                            controller.navigateToPage(pageNumber - 1);
                        }
                    }
                },
                pinch: function(e) {
                    var page = getCurrentPage();
                    var scale = $(page).data("pageScale") || pageScale;
                    var f = e.distance / e.lastDistance;
                    setPageScale({
                        scale: scale * f,
                        scaleMode: trv.ScaleModes.SPECIFIC
                    });
                },
                doubletap: function(e) {
                    options.commands.toggleZoomMode.exec();
                },
                touchstart: function(e) {
                    var el = $pageContainer[0];
                    allowSwipeRight = 0 == el.scrollLeft;
                    allowSwipeLeft = el.scrollWidth - el.offsetWidth == el.scrollLeft;
                }
            });
        }
        function shouldAutosizePage() {
            return -1 != [ scaleModes.FIT_PAGE, scaleModes.FIT_PAGE_WIDTH ].indexOf(pageScaleMode);
        }
        function updatePageDimensions() {
            for (var i = 0, children = pageContainer.childNodes, len = children.length; i < len; i++) {
                setPageDimensions(children[i], pageScaleMode, pageScale);
            }
        }
        function setPageScale(options) {
            pageScaleMode = options.scaleMode || pageScaleMode;
            var scale = pageScale;
            if ("scale" in options) {
                scale = options.scale;
            }
            pageScale = Math.max(minPageScale, Math.min(maxPageScale, scale));
            updatePageDimensions();
        }
        function clear(clearPageContainer) {
            disableInteractivity();
            pendingBookmark = undefined;
            if (clearPageContainer) {
                $pageContainer.empty();
            }
            showError();
        }
        function getCurrentPage() {
            return findPage(controller.currentPageNumber());
        }
        function findPage(pageNumber) {
            var page;
            $pageContainer.children().each(function(index, page1) {
                if (pageNo(page1) == pageNumber) {
                    page = page1;
                }
                return !page;
            });
            return page;
        }
        function navigateToPage(pageNumber, bookmark) {
            if (documentReady) {
                navigateToPageCore(pageNumber, bookmark);
            } else {
                navigateToPageOnDocumentReady(pageNumber, bookmark);
            }
        }
        function navigateToPageOnDocumentReady(pageNumber, bookmark) {
            navigateToPageOnDocReady = pageNumber;
            navigateToBookmarkOnDocReady = bookmark;
        }
        function navigateToPageCore(pageNumber, bookmark) {
            var page = findPage(pageNumber);
            if (page) {
                if (bookmark) {
                    navigateToBookmark(bookmark);
                }
            } else {
                pendingBookmark = bookmark;
                beginLoadPage(pageNumber);
            }
        }
        function navigateToBookmark(bookmark) {
            if (bookmark) {
                var el = $pageContainer.find("[data-bookmark-id=" + bookmark + "]")[0];
                if (el) {
                    var container = $pageContainer[0], offsetTop = 0, offsetLeft = 0;
                    while (el != container) {
                        if ($(el).is(".trv-page-wrapper")) {
                            var scale = $(el).data("pageScale");
                            if (typeof scale === "number") {
                                offsetTop *= scale;
                                offsetLeft *= scale;
                            }
                        }
                        offsetTop += el.offsetTop;
                        offsetLeft += el.offsetLeft;
                        el = el.offsetParent;
                    }
                    container.scrollTop = offsetTop;
                    container.scrollLeft = offsetLeft;
                }
            }
        }
        function disablePagesArea(disable) {
            (disable ? $.fn.addClass : $.fn.removeClass).call($placeholder, "loading");
        }
        function showError(error) {
            $errorMessage.html(error);
            (error ? $.fn.addClass : $.fn.removeClass).call($placeholder, "error");
        }
        function pageNo(page, no) {
            var $page = page.$ ? page : $(page), dataKey = "pageNumber";
            if (no === undefined) {
                return $page.data(dataKey);
            }
            $page.data(dataKey, no);
            return page;
        }
        function beginLoadPage(pageNumber) {
            disablePagesArea(true);
            window.setTimeout(controller.getReportPage.bind(controller, pageNumber), 1);
            navigateToPageOnDocReady = null;
        }
        function setPageDimensions(page, scaleMode, scale) {
            var $target = $(page), $page = $target.find("div.trv-report-page"), $pageContent = $target.find("div.sheet"), pageContent = $pageContent[0];
            if (!pageContent) return;
            var pageWidth, pageHeight, box = $target.data("box");
            if (!box) {
                var margins = domUtils.getMargins($target), borders = domUtils.getBorderWidth($page), padding = domUtils.getPadding($page);
                box = {
                    padLeft: margins.left + borders.left + padding.left,
                    padRight: margins.right + borders.right + padding.right,
                    padTop: margins.top + borders.top + padding.top,
                    padBottom: margins.bottom + borders.bottom + padding.bottom
                };
                $target.data("box", box);
            }
            if ($target.data("pageWidth") === undefined) {
                pageWidth = pageContent.offsetWidth;
                pageHeight = pageContent.offsetHeight;
                $target.data("pageWidth", pageWidth);
                $target.data("pageHeight", pageHeight);
            } else {
                pageWidth = $target.data("pageWidth");
                pageHeight = $target.data("pageHeight");
            }
            var scrollBarV = pageHeight > pageWidth && scaleMode == scaleModes.FIT_PAGE_WIDTH ? 20 : 0, scaleW = (pageContainer.clientWidth - scrollBarV - box.padLeft - box.padRight) / pageWidth, scaleH = (pageContainer.clientHeight - 1 - box.padTop - box.padBottom) / pageHeight;
            if (scaleMode == scaleModes.FIT_PAGE_WIDTH) {
                scale = scaleW;
            } else if (!scale || scaleMode == scaleModes.FIT_PAGE) {
                scale = Math.min(scaleW, scaleH);
            }
            $target.data("pageScale", scale);
            domUtils.scale($pageContent, scale, scale);
            $page.css("height", scale * pageHeight).css("width", scale * pageWidth);
        }
        function enableInteractivity() {
            $pageContainer.on("click", "[data-reporting-action]", onInteractiveItemClick);
        }
        function disableInteractivity() {
            $pageContainer.off("click", "[data-reporting-action]", onInteractiveItemClick);
        }
        function onInteractiveItemClick() {
            var $t = $(this);
            var actionId = $t.attr("data-reporting-action");
            var a = getAction(actionId);
            if (a) {
                var args = a.Value || {};
                args.actionId = actionId;
                navigateToPageOnDocReady = controller.currentPageNumber();
                controller.executeReportAction(a.Type, args);
            }
        }
        function getAction(actionId) {
            if (actions) {
                var action;
                $.each(actions, function() {
                    if (this.Id == actionId) {
                        action = this;
                    }
                    return action === undefined;
                });
                return action;
            }
            return null;
        }
        function updatePageStyle(page) {
            var styleId = "trv-" + controller.clientId() + "-styles";
            $("#" + styleId).remove();
            var pageStyles = $("<style id=" + styleId + "></style>");
            pageStyles.append(page.pageStyles);
            pageStyles.appendTo("head");
        }
        function setPageContent(page) {
            $pageContainer.empty();
            actions = JSON.parse(page.pageActions);
            updatePageStyle(page);
            var wrapper = $($.parseHTML(page.pageContent)), $pageContent = wrapper.find("div.sheet"), $page = $('<div class="trv-report-page"></div>');
            $pageContent.css("margin", 0);
            $page.append($pageContent).append($('<div class="trv-page-overlay"></div>'));
            var pageNumber = page.pageNumber;
            var $target = $("<div></div>").addClass("trv-page-wrapper active").data("pageNumber", pageNumber).append($page).appendTo($pageContainer);
            controller.currentPageNumber(pageNumber);
            if (controller.viewMode() == trv.ViewModes.INTERACTIVE) {
                $placeholder.removeClass("printpreview");
                $placeholder.addClass("interactive");
            } else {
                $placeholder.removeClass("interactive");
                $placeholder.addClass("printpreview");
            }
            setPageDimensions($target, pageScaleMode, pageScale);
            navigateToBookmark(pendingBookmark);
        }
    }
    var pluginName = "telerik_ReportViewer_PagesArea";
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new PagesArea(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var defaultOptions = {};
    function DocumentMapArea(placeholder, options) {
        options = $.extend({}, defaultOptions, options);
        var controller = options.controller;
        if (!controller) {
            throw "No controller (telerikReporting.reportViewerController) has been specified.";
        }
        var $placeholder = $(placeholder), $documentMap;
        init();
        function init() {
            $documentMap = $("<div></div>");
            $documentMap.appendTo(placeholder);
            attach();
        }
        function onTreeViewSelectionChanged(e) {
            var documentMapNode = this.dataItem(e.node), page = documentMapNode.page, id = documentMapNode.id;
            controller.navigateToPage(page, id);
        }
        function clearDocumentMap() {
            showDocumentMap([]);
        }
        function showDocumentMap(documentMap) {
            var hasDocumentMap = documentMap && !$.isEmptyObject(documentMap);
            var $treeView = $documentMap.data("kendoTreeView");
            if (!$treeView) {
                $documentMap.kendoTreeView({
                    dataTextField: "text",
                    select: onTreeViewSelectionChanged
                });
                $treeView = $documentMap.data("kendoTreeView");
            }
            $treeView.setDataSource(documentMap);
            setVisibility(hasDocumentMap);
        }
        function setVisibility(visible) {
            controller.setDocumentMapVisible({
                visible: visible
            });
        }
        function isVisible() {
            var args = {};
            controller.getDocumentMapState(args);
            return args.visible;
        }
        function beginLoad() {
            $placeholder.addClass("loading");
        }
        function endLoad() {
            $placeholder.removeClass("loading");
        }
        var currentReport = null;
        function attach() {
            controller.beginLoadReport(function() {
                beginLoad();
                var r = controller.reportSource().report;
                var vis = currentReport == r && isVisible();
                currentReport = r;
                clearDocumentMap();
                setVisibility(vis);
            }).reportLoadComplete(function(event, args) {
                if (args.documentMapAvailable) {
                    showDocumentMap(args.bookmarkNodes);
                } else {
                    setVisibility(false);
                }
                endLoad();
            }).error(function(event, error) {
                endLoad();
                clearDocumentMap();
            }).getDocumentMapState(function(event, args) {
                args.visible = !$placeholder.hasClass("hidden");
                args.enabled = Boolean($placeholder.find("li").length);
            }).setDocumentMapVisible(function(event, args) {
                (args.visible ? $.fn.removeClass : $.fn.addClass).call($placeholder, "hidden");
            });
        }
    }
    var pluginName = "telerik_ReportViewer_DocumentMapArea";
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new DocumentMapArea(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    trv.ParameterTypes = {
        INTEGER: "System.Int64",
        FLOAT: "System.Double",
        STRING: "System.String",
        DATETIME: "System.DateTime",
        BOOLEAN: "System.Boolean"
    };
    var sr = trv.sr, utils = trv.utils;
    var multivalueUtils = function() {
        var lineSeparator = "\n";
        return {
            formatValue: function(value) {
                var text = "";
                if (value) {
                    [].concat(value).forEach(function(val) {
                        if (text.length > 0) {
                            text += lineSeparator;
                        }
                        text += val;
                    });
                }
                return text;
            },
            parseValues: function(text) {
                return ("" + text).split(lineSeparator);
            }
        };
    }();
    function integerInputBehavior(input) {
        function isValid(newValue) {
            return /^(\-|\+)?([0-9]*)$/.test(newValue);
        }
        function onKeyPress(event) {
            if (utils.isSpecialKey(event.keyCode)) {
                return true;
            }
            return isValid($(input).val() + String.fromCharCode(event.charCode));
        }
        function onPaste(event) {}
        function attach(input) {
            $(input).on("keypress", onKeyPress).on("paste", onPaste);
        }
        function detach(input) {
            $(input).off("keypress", onKeyPress).off("paste", onPaste);
        }
        attach(input);
        return {
            dispose: function() {
                detach(input);
            }
        };
    }
    function floatInputBehavior(input) {
        function isValid(newValue) {
            return /^(\-|\+)?([0-9]*(\.[0-9]*)?)$/.test(newValue);
        }
        function onKeyPress(event) {
            if (utils.isSpecialKey(event.keyCode)) {
                return true;
            }
            return isValid($(input).val() + String.fromCharCode(event.charCode));
        }
        function onPaste(event) {}
        function attach(input) {
            $(input).on("keypress", onKeyPress).on("paste", onPaste);
        }
        function detach(input) {
            $(input).off("keypress", onKeyPress).off("paste", onPaste);
        }
        attach(input);
        return {
            dispose: function() {
                detach(input);
            }
        };
    }
    trv.parameterEditors = [ {
        match: function(parameter) {
            return Boolean(parameter.availableValues) && parameter.multivalue;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder);
            $placeholder.html(options.templates["trv-parameter-editor-available-values-multiselect"]);
            var $list = $placeholder.find(".list"), $selectAll = $placeholder.find(".select-all"), $selectNone = $placeholder.find(".select-none"), listView, parameter, updateTimeout, valueChangeCallback = options.parameterChanged, initialized;
            $selectAll.click(function(e) {
                e.preventDefault();
                setSelectedItems(parameter.availableValues.map(function(av) {
                    return av.value;
                }));
            });
            $selectNone.click(function(e) {
                e.preventDefault();
                setSelectedItems([]);
            });
            function onSelectionChanged(selection) {
                if (initialized) {
                    notifyParameterChanged(selection);
                }
                var noSelection = selection.length == 0;
                (noSelection ? $.fn.show : $.fn.hide).call($selectAll);
                (!noSelection ? $.fn.show : $.fn.hide).call($selectNone);
            }
            function notifyParameterChanged(selection) {
                var availableValues = parameter.availableValues, values = $.map(selection, function(item) {
                    return availableValues[$(item).index()].value;
                });
                if (updateTimeout) {
                    window.clearTimeout(updateTimeout);
                }
                var immediateUpdate = !parameter.autoRefresh && !parameter.childParameters;
                updateTimeout = window.setTimeout(function() {
                    valueChangeCallback(parameter, values);
                    updateTimeout = null;
                }, immediateUpdate ? 0 : 1e3);
            }
            function getSelectedItems() {
                return $(listView.element).find(".k-state-selected");
            }
            function onItemClick() {
                $(this).toggleClass("k-state-selected");
                onSelectionChanged(getSelectedItems());
            }
            function init() {
                setSelectedItems(parameter.value);
                $(listView.element).on("click", ".listviewitem", onItemClick);
                initialized = true;
            }
            function clear() {
                initialized = false;
                if (listView) {
                    $(listView.element).off("click", ".listviewitem", onItemClick);
                }
            }
            function setSelectedItems(items) {
                setSelectedItemsCore(items);
                onSelectionChanged(getSelectedItems());
            }
            function setSelectedItemsCore(items) {
                if (!Array.isArray(items)) {
                    items = [ items ];
                }
                var children = listView.element.children();
                $.each(parameter.availableValues, function(i, av) {
                    var selected = false;
                    $.each(items, function(j, v) {
                        var availableValue = av.value;
                        if (v instanceof Date) {
                            availableValue = utils.parseToLocalDate(av.value);
                        }
                        selected = utils.areEqual(v, availableValue);
                        return !selected;
                    });
                    (selected ? $.fn.addClass : $.fn.removeClass).call($(children[i]), "k-state-selected");
                });
            }
            return {
                beginEdit: function(param) {
                    clear();
                    parameter = param;
                    $list.kendoListView({
                        template: '<div class="listviewitem">${name}</div>',
                        dataSource: {
                            data: parameter.availableValues
                        },
                        selectable: false
                    });
                    listView = $list.data("kendoListView");
                    init();
                }
            };
        }
    }, {
        match: function(parameter) {
            return Boolean(parameter.availableValues) && !parameter.multivalue;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder);
            $placeholder.html(options.templates["trv-parameter-editor-available-values"]);
            var $list = $placeholder.find(".list"), $selectNone = $placeholder.find(".select-none"), listView, parameter, valueChangeCallback = options.parameterChanged;
            if ($selectNone) {
                $selectNone.click(function(e) {
                    e.preventDefault();
                    listView.clearSelection();
                });
            }
            function onSelectionChanged(selection) {
                notifyParameterChanged(selection);
            }
            function notifyParameterChanged(selection) {
                var availableValues = parameter.availableValues, values = $.map(selection, function(item) {
                    return availableValues[$(item).index()].value;
                });
                if (Array.isArray(values)) {
                    values = values[0];
                }
                valueChangeCallback(parameter, values);
            }
            function getSelectedItems() {
                return listView.select();
            }
            function onChange() {
                onSelectionChanged(getSelectedItems());
            }
            function init() {
                setSelectedItems(parameter.value);
                listView.bind("change", onChange);
            }
            function reset() {
                if (listView) {
                    listView.unbind("change", onChange);
                }
            }
            function setSelectedItems(value) {
                var items = listView.element.children();
                $.each(parameter.availableValues, function(i, av) {
                    var availableValue = av.value;
                    if (value instanceof Date) {
                        availableValue = utils.parseToLocalDate(av.value);
                    }
                    if (utils.areEqual(value, availableValue)) {
                        listView.select(items[i]);
                        return false;
                    }
                    return true;
                });
            }
            return {
                beginEdit: function(param) {
                    reset();
                    parameter = param;
                    if ($selectNone && !param.allowNull) {
                        $selectNone.hide();
                    }
                    $list.kendoListView({
                        template: '<div class="listviewitem">${name}</div>',
                        dataSource: {
                            data: parameter.availableValues
                        },
                        selectable: true
                    });
                    listView = $list.data("kendoListView");
                    init();
                }
            };
        }
    }, {
        match: function(parameter) {
            return Boolean(parameter.multivalue);
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder), parameter;
            $placeholder.html(options.templates["trv-parameter-editor-multivalue"]);
            var $textArea = $placeholder.find("textarea").on("change", function() {
                if (options.parameterChanged) {
                    options.parameterChanged(parameter, multivalueUtils.parseValues(this.value));
                }
            });
            return {
                beginEdit: function(param) {
                    parameter = param;
                    $textArea.val(multivalueUtils.formatValue(param.value));
                }
            };
        }
    }, {
        match: function(parameter) {
            return parameter.type === trv.ParameterTypes.DATETIME;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder), parameter;
            $placeholder.html(options.templates["trv-parameter-editor-datetime"]);
            var dateTimePicker = $placeholder.find("input[type=datetime]").kendoDatePicker({
                change: function() {
                    var handler = options.parameterChanged;
                    if (handler) {
                        var dtv = this.value();
                        if (null !== dtv) {
                            dtv = utils.adjustTimezone(dtv);
                        }
                        handler(parameter, dtv);
                    }
                }
            }).data("kendoDatePicker");
            return {
                beginEdit: function(param) {
                    parameter = param;
                    var dt = null;
                    try {
                        if (param.value) {
                            dt = utils.unadjustTimezone(param.value);
                        }
                    } catch (e) {
                        dt = null;
                    }
                    dateTimePicker.value(dt);
                }
            };
        }
    }, {
        match: function(parameter) {
            return parameter.type === trv.ParameterTypes.STRING;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder), parameter;
            $placeholder.html(options.templates["trv-parameter-editor-text"]);
            var $input = $placeholder.find('input[type="text"]').change(function() {
                if (options.parameterChanged) {
                    options.parameterChanged(parameter, $input.val());
                }
            });
            return {
                beginEdit: function(param) {
                    parameter = param;
                    $input.val(parameter.value);
                }
            };
        }
    }, {
        match: function(parameter) {
            switch (parameter.type) {
              case trv.ParameterTypes.INTEGER:
              case trv.ParameterTypes.FLOAT:
                return true;

              default:
                return false;
            }
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder), parameter, inputBehavior;
            $placeholder.html(options.templates["trv-parameter-editor-number"]);
            var $input = $placeholder.find("input[type=number]").on("change", function() {
                if (options.parameterChanged) {
                    options.parameterChanged(parameter, $input.val());
                }
            });
            return {
                beginEdit: function(param) {
                    if (inputBehavior) {
                        inputBehavior.dispose();
                    }
                    parameter = param;
                    $input.val(parameter.value);
                    if (parameter.type === trv.ParameterTypes.INTEGER) {
                        inputBehavior = integerInputBehavior($input);
                    } else {
                        inputBehavior = floatInputBehavior($input);
                    }
                }
            };
        }
    }, {
        match: function(parameter) {
            return parameter.type === trv.ParameterTypes.BOOLEAN;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder), parameter;
            $placeholder.html(options.templates["trv-parameter-editor-boolean"]);
            var $input = $placeholder.find("input[type=checkbox]").on("change", function() {
                if (options.parameterChanged) {
                    options.parameterChanged(parameter, this.checked);
                }
            });
            return {
                beginEdit: function(param) {
                    parameter = param;
                    $input[0].checked = parameter.value === true;
                }
            };
        }
    }, {
        match: function(parameter) {
            return true;
        },
        createEditor: function(placeholder, options) {
            var $placeholder = $(placeholder);
            $placeholder.html('<div class="trv-parameter-editor-generic"></div>');
            return {
                beginEdit: function(parameter) {
                    $placeholder.find(".trv-parameter-editor-generic").html(parameter.Error ? "(error)" : parameter.value);
                }
            };
        }
    } ];
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr, utils = trv.utils;
    trv.parameterValidators = function() {
        var validators = {};
        function validateParameter(parameter, value, validatorFunc, compareFunc) {
            var values = [].concat(value).map(function(value1) {
                return checkAvailbaleValues(parameter, validatorFunc(value1), compareFunc);
            });
            if (parameter.multivalue) {
                return values;
            }
            return values[0];
        }
        function isNull(parameter, value) {
            return parameter.allowNull && -1 != [ null, "", undefined ].indexOf(value);
        }
        function checkAvailbaleValues(parameter, value, compareFunc) {
            if (parameter.availableValues) {
                var found = false;
                $.each(parameter.availableValues, function(i, av) {
                    found = compareFunc(value, av.value);
                    return !found;
                });
                if (!found) {
                    if (parameter.allowNull && !value) {
                        return value;
                    }
                    throw sr.invalidParameter;
                }
            }
            return value;
        }
        validators[trv.ParameterTypes.STRING] = {
            validate: function(parameter, value) {
                return validateParameter(parameter, value, function(value) {
                    if (!value) {
                        if (parameter.allowNull) {
                            return null;
                        }
                        if (parameter.allowBlank) {
                            return "";
                        }
                        throw sr.parameterIsEmpty;
                    }
                    return value;
                }, function(s1, s2) {
                    return s1 == s2;
                });
            }
        };
        validators[trv.ParameterTypes.FLOAT] = {
            validate: function(parameter, value) {
                return validateParameter(parameter, value, function(value) {
                    var num = utils.tryParseFloat(value);
                    if (isNaN(num)) {
                        if (isNull(parameter, value)) {
                            return null;
                        }
                        throw sr.parameterIsEmpty;
                    }
                    return num;
                }, function(f1, f2) {
                    return utils.tryParseFloat(f1) == utils.tryParseFloat(f2);
                });
            }
        };
        validators[trv.ParameterTypes.INTEGER] = {
            validate: function(parameter, value) {
                return validateParameter(parameter, value, function(value) {
                    var num = utils.tryParseInt(value);
                    if (isNaN(num)) {
                        if (isNull(parameter, value)) {
                            return null;
                        }
                        throw sr.parameterIsEmpty;
                    }
                    return num;
                }, function(n1, n2) {
                    return utils.tryParseInt(n1) == utils.tryParseFloat(n2);
                });
            }
        };
        validators[trv.ParameterTypes.DATETIME] = {
            validate: function(parameter, value) {
                return validateParameter(parameter, value, function(value) {
                    if (parameter.allowNull && (value === null || value === "" || value === undefined)) {
                        return null;
                    }
                    if (!isNaN(Date.parse(value))) {
                        return utils.parseToLocalDate(value);
                    }
                    throw sr.invalidDateTimeValue;
                }, function(d1, d2) {
                    d1 = utils.parseToLocalDate(d1);
                    d2 = utils.parseToLocalDate(d2);
                    return d1.getTime() == d2.getTime();
                });
            }
        };
        validators[trv.ParameterTypes.BOOLEAN] = {
            validate: function(parameter, value) {
                return validateParameter(parameter, value, function(value) {
                    if (-1 != [ "true", "false" ].indexOf(("" + value).toLowerCase())) {
                        return Boolean(value);
                    }
                    if (isNull(parameter, value)) {
                        return null;
                    }
                    throw sr.parameterIsEmpty;
                }, function(b1, b2) {
                    return Boolean(b1) == Boolean(b2);
                });
            }
        };
        return {
            validate: function(parameter, value) {
                var v = validators[parameter.type];
                if (!v) {
                    throw utils.stringFormat(sr.cannotValidateType, parameter);
                }
                return v.validate(parameter, value);
            }
        };
    }();
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr, utils = trv.utils, parameterValidators = trv.parameterValidators;
    var defaultOptions = {};
    function ParametersArea(placeholder, options, otherOptions) {
        options = $.extend({}, defaultOptions, options, otherOptions);
        var controller = options.controller;
        if (!controller) {
            throw "No controller (telerikReporting.reportViewerController) has been specified.";
        }
        var parameterEditors = [].concat(options.parameterEditors, trv.parameterEditors);
        var recentParameterValues, parameters;
        var $placeholder = $(placeholder), $content = $placeholder.find(".trv-parameters-area-content"), $errorMessage = $placeholder.find(".trv-error-message"), $previewButton = $placeholder.find(".trv-parameters-area-preview-button");
        var isNewReportSource;
        $previewButton.on("click", function(e) {
            e.preventDefault();
            if (allParametersValid()) {
                applyParameters();
            }
        });
        var parameterContainerTemplate = options.templates["trv-parameter"];
        function createParameterContainer() {
            return $(parameterContainerTemplate);
        }
        function createParameterUI(parameter) {
            var $container = createParameterContainer(), $editorPlaceholder = $container.find(".trv-parameter-value"), $title = $container.find(".trv-parameter-title"), $error = $container.find(".trv-parameter-error"), $errorMessage = $container.find(".trv-parameter-error-message"), editorFactory = selectParameterEditorFactory(parameter);
            $title.html(parameter.text).attr("title", parameter.text);
            $errorMessage.html(parameter.Error);
            (parameter.Error ? $.fn.show : $.fn.hide).call($error);
            var editor = editorFactory.createEditor($editorPlaceholder, {
                templates: options.templates,
                parameterChanged: function(parameter, newValue) {
                    try {
                        newValue = parameterValidators.validate(parameter, newValue);
                        $error.hide();
                        onParameterChanged(parameter, newValue);
                    } catch (error) {
                        parameter.Error = error;
                        $errorMessage.html(error);
                        $error.show();
                        enablePreviewButton(false);
                    }
                }
            });
            editor.beginEdit(parameter);
            return $container;
        }
        function enablePreviewButton(enabled) {
            if (enabled) {
                $previewButton.prop("disabled", false);
                $previewButton.removeClass("k-state-disabled");
            } else {
                $previewButton.prop("disabled", true);
                $previewButton.addClass("k-state-disabled");
            }
        }
        function selectParameterEditorFactory(parameter) {
            var factory;
            $.each(parameterEditors, function() {
                if (this && this.match(parameter)) {
                    factory = this;
                }
                return !factory;
            });
            return factory;
        }
        function showError(error) {
            $errorMessage.html(error);
            (error ? $.fn.addClass : $.fn.removeClass).call($placeholder, "error");
        }
        function showPreviewButton() {
            (allParametersAutoRefresh(parameters) ? $.fn.removeClass : $.fn.addClass).call($placeholder, "preview");
        }
        function allParametersAutoRefresh() {
            var allAuto = true;
            $.each(parameters, function() {
                return allAuto = !this.isVisible || this.autoRefresh;
            });
            return allAuto;
        }
        function allParametersValid() {
            var allValid = true;
            $.each(parameters, function() {
                return allValid = !this.Error;
            });
            return allValid;
        }
        function fill(newParameters) {
            recentParameterValues = {};
            parameters = newParameters || [];
            var $parameterContainer, $tempContainer = $("<div></div>");
            $.each(parameters, function() {
                try {
                    this.value = parameterValidators.validate(this, this.value);
                } catch (e) {
                    this.Error = this.Error || e;
                }
                var hasError = Boolean(this.Error), hasValue = !hasError;
                if (hasValue) {
                    recentParameterValues[this.id] = this.value;
                } else {
                    this.Error = sr.invalidParameter;
                }
                if (this.isVisible) {
                    if ($parameterContainer = createParameterUI(this)) {
                        $tempContainer.append($parameterContainer);
                    }
                }
            });
            $content.empty();
            $content.append($tempContainer.children());
            showPreviewButton(parameters);
        }
        function applyParameters() {
            controller.setParameters(recentParameterValues);
            controller.refreshReport();
        }
        function allParametersValidForAutoRefresh() {
            var triggerAutoUpdate = true;
            for (var i = parameters.length - 1; triggerAutoUpdate && i >= 0; i--) {
                var p = parameters[i];
                triggerAutoUpdate = p.id in recentParameterValues && (Boolean(p.autoRefresh) || !p.isVisible);
            }
            return triggerAutoUpdate;
        }
        function tryRefreshReport() {
            if (isNewReportSource || allParametersValidForAutoRefresh()) {
                isNewReportSource = false;
                applyParameters();
            }
        }
        function invalidateChildParameters(parameter) {
            if (parameter.childParameters) {
                $.each(parameter.childParameters, function(index, parameterId) {
                    var childParameter = getParameterById(parameterId);
                    if (childParameter) {
                        invalidateChildParameters(childParameter);
                    }
                    delete recentParameterValues[parameterId];
                });
            }
        }
        function onParameterChanged(parameter, newValue) {
            delete parameter["Error"];
            parameter.value = newValue;
            recentParameterValues[parameter.id] = newValue;
            invalidateChildParameters(parameter);
            if (parameter.childParameters) {
                loadParameters(recentParameterValues);
            } else {
                var allValid = allParametersValid();
                enablePreviewButton(allValid);
                if (allValid) {
                    tryRefreshReport();
                }
            }
        }
        function getParameterById(parameterId) {
            if (parameters) {
                for (var i = 0; i < parameters.length; i++) {
                    var p = parameters[i];
                    if (p.id === parameterId) {
                        return p;
                    }
                }
            }
            return null;
        }
        function setParametersAreaVisibility(visible) {
            controller.setParametersAreaVisible({
                visible: visible
            });
        }
        function hasVisibleParameters(params) {
            if (null === params) {
                return false;
            }
            var result = false;
            $.each(params, function() {
                result = this.isVisible;
                return !result;
            });
            return result;
        }
        var loadingCount = 0;
        function beginLoad() {
            loadingCount++;
            $placeholder.addClass("loading");
        }
        function endLoad() {
            if (loadingCount > 0) {
                if (0 == --loadingCount) {
                    $placeholder.removeClass("loading");
                }
            }
        }
        function loadParameters(parameterValues) {
            beginLoad();
            $.when(controller.loadParameters(parameterValues)).done(function(parameters) {
                var needsParamsArea = hasVisibleParameters(parameters);
                if (!needsParamsArea) {
                    setParametersAreaVisibility(false);
                }
                fill(parameters);
                showError("");
                if (needsParamsArea) {
                    setParametersAreaVisibility(true);
                }
                tryRefreshReport();
                endLoad();
            }).fail(function(error) {
                endLoad();
                fill([]);
                if ($placeholder.hasClass("hidden")) {
                    controller.error(error);
                } else {
                    showError(error);
                }
            });
        }
        controller.reportSourceChanged(function() {
            isNewReportSource = true;
            showError();
            loadParameters(null);
        }).getParametersAreaState(function(event, args) {
            args.visible = !$placeholder.hasClass("hidden");
            args.enabled = Boolean($content.children().length);
        }).setParametersAreaVisible(function(event, args) {
            (args.visible ? $.fn.removeClass : $.fn.addClass).call($placeholder, "hidden");
        }).beforeLoadReport(function() {
            loadingCount = 0;
            beginLoad();
        }).error(function() {
            endLoad();
        }).pageReady(function() {
            endLoad();
        });
    }
    var pluginName = "telerik_ReportViewer_ParametersArea";
    $.fn[pluginName] = function(options, otherOptions) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ParametersArea(this, options, otherOptions));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    function uiController(options) {
        var stateFlags = {
            ExportInProgress: 1 << 0,
            PrintInProgress: 1 << 1
        };
        function getState(flags) {
            return (state & flags) != 0;
        }
        function setState(flags, value) {
            if (value) {
                state |= flags;
            } else {
                state &= ~flags;
            }
        }
        var controller = options.controller, historyManager = options.history, state = 0, refreshUI, commands = options.commands, $controller = $(controller);
        if (!controller) {
            throw "No controller (telerikReporting.ReportViewerController) has been specified.";
        }
        function getDocumentMapState() {
            var args = {};
            controller.getDocumentMapState(args);
            return args;
        }
        function getParametersAreaState() {
            var args = {};
            controller.getParametersAreaState(args);
            return args;
        }
        function updateUI() {
            if (!refreshUI) {
                refreshUI = true;
                window.setTimeout(function() {
                    try {
                        updateUICore();
                    } finally {
                        refreshUI = false;
                    }
                }, 10);
            }
        }
        function updateUICore() {
            var rs = controller.reportSource();
            var pageCount = controller.pageCount();
            var currentPageNumber = controller.currentPageNumber();
            var hasReport = rs && rs.report;
            var hasPages = hasReport && pageCount > 0;
            var nextPage = hasPages && currentPageNumber < pageCount;
            var prevPage = hasPages && currentPageNumber > 1;
            var hasPage = hasPages && currentPageNumber;
            var documentMapState = getDocumentMapState();
            var parametersAreaState = getParametersAreaState();
            commands.goToFirstPage.enabled(prevPage);
            commands.goToPrevPage.enabled(prevPage);
            commands.goToLastPage.enabled(nextPage);
            commands.goToNextPage.enabled(nextPage);
            commands.goToPage.enabled(hasPages);
            commands.print.enabled(hasPages && !getState(stateFlags.PrintInProgress));
            commands.export.enabled(hasPages && !getState(stateFlags.ExportInProgress));
            commands.refresh.enabled(hasReport);
            commands.historyBack.enabled(historyManager && historyManager.canMoveBack());
            commands.historyForward.enabled(historyManager && historyManager.canMoveForward());
            commands.toggleDocumentMap.enabled(hasReport && documentMapState.enabled).checked(documentMapState.visible);
            commands.toggleParametersArea.enabled(hasReport && parametersAreaState.enabled).checked(parametersAreaState.visible);
            commands.togglePrintPreview.enabled(hasPages).checked(controller.viewMode() == trv.ViewModes.PRINT_PREVIEW);
            commands.zoom.enabled(hasPage);
            commands.zoomIn.enabled(hasPage);
            commands.zoomOut.enabled(hasPage);
            commands.toggleZoomMode.enabled(hasPage);
            $controller.trigger(controller.Events.UPDATE_UI, null);
            try {
                $controller.trigger("pageNumber", currentPageNumber).trigger("pageCount", pageCount);
            } finally {}
        }
        function getScaleMode() {
            var args = {};
            controller.getScale(args);
            return args.scaleMode;
        }
        controller.scale(function(event, args) {
            commands.toggleZoomMode.checked(args.scaleMode == trv.ScaleModes.FIT_PAGE);
        });
        controller.currentPageChanged(updateUI);
        controller.beforeLoadReport(updateUI);
        controller.reportLoadProgress(updateUI);
        controller.reportLoadComplete(updateUI);
        controller.reportSourceChanged(updateUI);
        controller.viewModeChanged(updateUI());
        controller.setParametersAreaVisible(updateUI);
        controller.setDocumentMapVisible(updateUI);
        controller.exportStarted(function() {
            setState(stateFlags.ExportInProgress, true);
            updateUI();
        });
        controller.exportReady(function() {
            setState(stateFlags.ExportInProgress, false);
            updateUI();
        });
        controller.printStarted(function() {
            setState(stateFlags.PrintInProgress, true);
            updateUI();
        });
        controller.printReady(function() {
            setState(stateFlags.PrintInProgress, false);
            updateUI();
        });
        controller.error(function() {
            setState(stateFlags.ExportInProgress, false);
            setState(stateFlags.PrintInProgress, false);
            updateUI();
        });
        updateUI();
    }
    trv.uiController = uiController;
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    trv.HistoryManager = function(options) {
        var controller = options.controller;
        if (!controller) {
            throw "No controller (telerikReporting.reportViewerController) has been specified.";
        }
        var settings = options.settings, history = settings.history() || {
            records: [],
            position: -1
        };
        controller.beforeLoadReport(function() {
            addToHistory();
        }).currentPageChanged(function() {
            updatePageInfo();
        }).error(function() {
            var currentRecord = getCurrentRecord();
            if (currentRecord) {
                currentRecord.temp = true;
            }
        });
        function getCurrentRecord() {
            var records = history.records;
            if (records.length > 0) {
                return records[history.position];
            }
            return null;
        }
        function pushRecord(rec) {
            var records = history.records, position = history.position;
            records = Array.prototype.slice.call(records, 0, position + 1);
            records.push(rec);
            history.records = records;
            history.position = records.length - 1;
            saveSettings();
        }
        function saveSettings() {
            settings.history(history);
        }
        function updatePageInfo() {
            var currentRecord = getCurrentRecord();
            if (currentRecord) {
                currentRecord.pageNumber = controller.currentPageNumber();
                currentRecord.viewMode = controller.viewMode();
                saveSettings();
            }
        }
        function addToHistory() {
            var currentRecord = getCurrentRecord();
            var rs = controller.reportSource();
            if (currentRecord && currentRecord.temp) {
                currentRecord.reportSource = rs;
                delete currentRecord["temp"];
            } else if (!currentRecord || !utils.reportSourcesAreEqual(currentRecord.reportSource, rs)) {
                pushRecord({
                    reportSource: rs,
                    viewMode: controller.viewMode(),
                    pageNumber: 1
                });
            }
        }
        function exec(currentRecord) {
            controller.reportSource(currentRecord.reportSource);
            controller.viewMode(currentRecord.viewMode);
            controller.navigateToPage(currentRecord.pageNumber);
        }
        function canMove(step) {
            var position = history.position, length = history.records.length, newPos = position + step;
            return 0 <= newPos && newPos < length;
        }
        function move(step) {
            var position = history.position, length = history.records.length, newPos = position + step;
            if (newPos < 0) {
                newPos = 0;
            } else if (newPos >= length) {
                newPos = length - 1;
            }
            if (newPos != position) {
                history.position = newPos;
                saveSettings();
                exec(getCurrentRecord());
            }
        }
        return {
            back: function() {
                move(-1);
            },
            forward: function() {
                move(+1);
            },
            canMoveBack: function() {
                return canMove(-1);
            },
            canMoveForward: function() {
                return canMove(1);
            },
            loadCurrent: function() {
                var rec = getCurrentRecord();
                if (rec) {
                    exec(rec);
                }
                return Boolean(rec);
            }
        };
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    var scaleTransitionMap = {};
    scaleTransitionMap[trv.ScaleModes.FIT_PAGE] = {
        scaleMode: trv.ScaleModes.FIT_PAGE_WIDTH
    };
    scaleTransitionMap[trv.ScaleModes.FIT_PAGE_WIDTH] = {
        scaleMode: trv.ScaleModes.SPECIFIC,
        scale: 1
    };
    scaleTransitionMap[trv.ScaleModes.SPECIFIC] = {
        scaleMode: trv.ScaleModes.FIT_PAGE
    };
    var scaleValues = [ .1, .25, .5, .75, 1, 1.5, 2, 4, 8 ];
    function CommandSet(options) {
        var controller = options.controller;
        if (!controller) {
            throw "No options.controller.";
        }
        var historyManager = options.history;
        if (!historyManager) {
            throw "No options.history.";
        }
        function getDocumentMapVisible() {
            var args = {};
            controller.getDocumentMapState(args);
            return Boolean(args.visible);
        }
        function getParametersAreaVisible() {
            var args = {};
            controller.getParametersAreaState(args);
            return Boolean(args.visible);
        }
        return {
            historyBack: new command(function() {
                historyManager.back();
            }),
            historyForward: new command(function() {
                historyManager.forward();
            }),
            goToPrevPage: new command(function() {
                controller.navigateToPage(controller.currentPageNumber() - 1);
            }),
            goToNextPage: new command(function() {
                controller.navigateToPage(controller.currentPageNumber() + 1);
            }),
            goToFirstPage: new command(function() {
                controller.navigateToPage(1);
            }),
            goToLastPage: new command(function() {
                controller.navigateToPage(controller.pageCount());
            }),
            goToPage: new command(function(pageNumber) {
                if (!isNaN(pageNumber)) {
                    var pageCount = controller.pageCount();
                    if (pageNumber > pageCount) {
                        pageNumber = pageCount;
                    } else if (pageNumber < 1) {
                        pageNumber = 1;
                    }
                    controller.navigateToPage(pageNumber);
                    return pageNumber;
                }
            }),
            refresh: new command(function() {
                controller.refreshReport(true);
            }),
            "export": new command(function(format) {
                if (format) {
                    controller.exportReport(format);
                }
            }),
            print: new command(function() {
                controller.printReport();
            }),
            togglePrintPreview: new command(function() {
                controller.viewMode(controller.viewMode() == trv.ViewModes.PRINT_PREVIEW ? trv.ViewModes.INTERACTIVE : trv.ViewModes.PRINT_PREVIEW);
            }),
            toggleDocumentMap: new command(function() {
                controller.setDocumentMapVisible({
                    visible: !getDocumentMapVisible()
                });
            }),
            toggleParametersArea: new command(function() {
                controller.setParametersAreaVisible({
                    visible: !getParametersAreaVisible()
                });
            }),
            zoom: new command(function(scale) {
                controller.scale({
                    scale: 1
                });
            }),
            zoomIn: new command(function() {
                zoom(1);
            }),
            zoomOut: new command(function() {
                zoom(-1);
            }),
            toggleSideMenu: new command(function() {
                $(controller).trigger(controller.Events.TOGGLE_SIDE_MENU);
            }),
            toggleZoomMode: new command(function() {
                var args = {};
                controller.getScale(args);
                controller.scale(scaleTransitionMap[args.scaleMode]);
            })
        };
        function zoom(step) {
            var args = {};
            controller.getScale(args);
            args.scale = getZoomScale(args.scale, step);
            args.scaleMode = trv.ScaleModes.SPECIFIC;
            controller.scale(args);
        }
        function getZoomScale(scale, steps) {
            var pos = -1, length = scaleValues.length;
            for (var i = 0; i < length; i++) {
                var value = scaleValues[i];
                if (scale < value) {
                    pos = i - .5;
                    break;
                }
                if (scale == value) {
                    pos = i;
                    break;
                }
            }
            pos = pos + steps;
            if (steps >= 0) {
                pos = Math.round(pos - .49);
            } else {
                pos = Math.round(pos + .49);
            }
            if (pos < 0) {
                pos = 0;
            } else if (pos > length - 1) {
                pos = length - 1;
            }
            return scaleValues[pos];
        }
    }
    trv.CommandSet = CommandSet;
    function command(execCallback) {
        var enabledState = true;
        var checkedState = false;
        var cmd = {
            enabled: function(state) {
                if (arguments.length == 0) {
                    return enabledState;
                }
                var newState = Boolean(state);
                enabledState = newState;
                $(this).trigger("enabledChanged");
                return cmd;
            },
            checked: function(state) {
                if (arguments.length == 0) {
                    return checkedState;
                }
                var newState = Boolean(state);
                checkedState = newState;
                $(this).trigger("checkedChanged");
                return cmd;
            },
            exec: execCallback
        };
        return cmd;
    }
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr;
    if (!sr) {
        throw "Missing telerikReportViewer.sr";
    }
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    function MainMenu(dom, options) {
        var menu = $(dom).data("kendoMenu"), loadingFormats, childrenL1;
        if (!menu) {
            init();
        }
        function init() {
            $(window).resize(function() {
                adjustMenuItemsLevel1();
            });
            menu = $(dom).kendoMenu().data("kendoMenu"), menu.bind("open", onSubmenuOpen);
            window.setTimeout(adjustMenuItemsLevel1, 100);
        }
        function adjustMenuItemsLevel1() {
            if (!childrenL1) childrenL1 = dom.childNodes;
            for (var i = childrenL1.length - 1; i >= 0; i--) {
                var el = childrenL1[i];
                if (el.style) {
                    var style = el.style;
                    var isVisible = style.display !== "none";
                    if (!isVisible) {
                        style.display = "";
                    }
                    var isReportViewerTemplate = $(el).parents(".trv-report-viewer").length > 0;
                    if (isReportViewerTemplate) {
                        if (el.offsetTop > 0) {
                            style.display = "none";
                        } else {
                            if (isVisible) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        function onSubmenuOpen(e) {
            var $item = $(e.item);
            if ($item.children("ul[data-command-list=export-format-list]").length > 0) {
                onOpenFormatsMenu($item);
            }
        }
        function onOpenFormatsMenu($item) {
            if (!loadingFormats) {
                beginLoadFormats($item);
            }
        }
        function fillFormats(formats) {
            $(dom).find("ul[data-command-list=export-format-list]").each(function() {
                var $list = $(this), $parent = $list.parents("li"), itemsToRemove = $list.children("li");
                $.each(formats, function() {
                    var format = this;
                    var li = utils.stringFormat('<li><a href="#" data-command="telerik_ReportViewer_export" data-command-parameter="{name}"><span>{localizedName}</span></a></li>', format);
                    menu.append(li, $parent);
                });
                itemsToRemove.each(function() {
                    menu.remove($(this));
                });
            });
        }
        function beginLoadFormats($item) {
            loadingFormats = true;
            menu.append({
                text: sr.loadingFormats
            }, $item);
            $.when(options.controller.getDocumentFormats()).done(function(formats) {
                loadingFormats = false;
                window.setTimeout(function() {
                    fillFormats(formats);
                }, 0);
                menu.unbind("open", onSubmenuOpen);
            }).fail(function() {
                loadingFormats = false;
            });
        }
    }
    var pluginName = "telerik_ReportViewer_MainMenu";
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new MainMenu(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr;
    if (!sr) {
        throw "Missing telerikReportViewer.sr";
    }
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReporting.utils";
    }
    var loadingFormats, formatsLoaded, panelBar;
    function SideMenu(dom, options) {
        init(dom);
        function init(root) {
            panelBar = $(root).children("ul").kendoPanelBar().data("kendoPanelBar");
            panelBar.bind("expand", onSubmenuOpen);
            enableCloseOnClick(root);
            $(root).click(function(e) {
                if (e.target == root) {
                    $(options.controller).trigger(options.controller.Events.TOGGLE_SIDE_MENU);
                }
            });
        }
        function onSubmenuOpen(e) {
            var $item = $(e.item);
            if ($item.children("ul[data-command-list=export-format-list]").length > 0) {
                onOpenFormatsMenu($item);
            }
        }
        function onOpenFormatsMenu($item) {
            if (!loadingFormats) {
                beginLoadFormats($item);
            }
        }
        function fillFormats(formats) {
            $(dom).find("ul[data-command-list=export-format-list]").each(function() {
                var $list = $(this), $parent = $list.parents("li"), itemsToRemove = $list.children("li");
                $.each(formats, function(i) {
                    var format = this;
                    var li = utils.stringFormat('<li><a href="#" data-command="telerik_ReportViewer_export" data-command-parameter="{name}"><span>{localizedName}</span></a></li>', format);
                    panelBar.append(li, $parent);
                });
                enableCloseOnClick($parent);
                itemsToRemove.each(function() {
                    panelBar.remove($(this));
                });
            });
        }
        function beginLoadFormats($item) {
            loadingFormats = true;
            panelBar.append({
                text: sr.loadingFormats
            }, $item);
            $.when(options.controller.getDocumentFormats()).done(function(formats) {
                formatsLoaded = true;
                loadingFormats = false;
                window.setTimeout(function() {
                    fillFormats(formats);
                }, 0);
                panelBar.unbind("expand", onSubmenuOpen);
            }).fail(function() {
                loadingFormats = false;
            });
        }
        function enableCloseOnClick(root) {
            $(root).find("li").each(function() {
                var isLeaf = $(this).children("ul").length == 0;
                if (isLeaf) {
                    $(this).children("a").click(function() {
                        $(options.controller).trigger(options.controller.Events.TOGGLE_SIDE_MENU);
                    });
                }
            });
        }
    }
    var pluginName = "telerik_ReportViewer_SideMenu";
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new SideMenu(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReportViewer.utils";
    }
    trv.binder = {
        bind: function(element) {
            var args = Array.prototype.slice.call(arguments, 1);
            attachCommands(args);
            $('[data-role^="telerik_ReportViewer_"]').each(function() {
                var $this = $(this), f = $.fn[$this.attr("data-role")];
                if (typeof f === "function") {
                    f.apply($this, args);
                }
            });
        }
    };
    function attachCommands(args) {
        var commands = args[0].commands, viewerOptions = args[1];
        $.each(commands, function(key, command) {
            attachCommand(key, command, viewerOptions);
        });
    }
    function attachCommand(dataCommand, cmd, viewerOptions) {
        var elementSelector = '[data-command="telerik_ReportViewer_' + dataCommand + '"]', defaultElementSelector = viewerOptions.selector + " " + elementSelector, customElementSelector = '[data-target-report-viewer="' + viewerOptions.selector + '"]' + elementSelector + ', [data-target-report-viewer="' + viewerOptions.selector + '"] ' + elementSelector, $defaultElement = $(defaultElementSelector), $customElement = $(customElementSelector);
        if (cmd) {
            $(viewerOptions.selector).on("click", elementSelector, function(e) {
                if (cmd.enabled()) {
                    cmd.exec($(this).attr("data-command-parameter"));
                }
                e.preventDefault();
            });
            $("body").on("click", customElementSelector, function(e) {
                if (cmd.enabled()) {
                    cmd.exec($(this).attr("data-command-parameter"));
                }
                e.preventDefault();
            });
            $(cmd).on("enabledChanged", function(e) {
                (cmd.enabled() ? $.fn.removeClass : $.fn.addClass).call($defaultElement.parent("li"), "k-state-disabled");
                (cmd.enabled() ? $.fn.removeClass : $.fn.addClass).call($customElement, viewerOptions.disabledButtonClass);
            }).on("checkedChanged", function(e) {
                (cmd.checked() ? $.fn.addClass : $.fn.removeClass).call($defaultElement.parent("li"), "k-state-selected");
                (cmd.checked() ? $.fn.addClass : $.fn.removeClass).call($customElement, viewerOptions.checkedButtonClass);
            });
        }
    }
    function LinkButton(dom, options) {
        var cmd, $element = $(dom), dataCommand = $element.attr("data-command");
        if (dataCommand) {
            cmd = options.commands[dataCommand];
        }
        if (cmd) {
            $element.click(function(e) {
                if (cmd.enabled()) {
                    cmd.exec($(this).attr("data-command-parameter"));
                } else {
                    e.preventDefault();
                }
            });
            $(cmd).on("enabledChanged", function(e) {
                (cmd.enabled() ? $.fn.removeClass : $.fn.addClass).call($element, "disabled");
            }).on("checkedChanged", function(e) {
                (cmd.checked() ? $.fn.addClass : $.fn.removeClass).call($element, "checked");
            });
        }
    }
    var linkButton_pluginName = "telerik_ReportViewer_LinkButton";
    $.fn[linkButton_pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, linkButton_pluginName)) {
                $.data(this, linkButton_pluginName, new LinkButton(this, options));
            }
        });
    };
    function PageNumberInput(dom, options) {
        var $element = $(dom), $controller = $(options.controller), cmd = options.commands["goToPage"];
        function setPageNumber(value) {
            $element.val(value);
        }
        $controller.on("pageNumber", function(e, value) {
            setPageNumber(value);
        });
        $element.change(function() {
            var val = $(this).val();
            var num = utils.tryParseInt(val);
            if (num != NaN) {
                var result = cmd.exec(num);
                setPageNumber(result);
            }
        });
        $element.keydown(function(e) {
            if (e.which == 13) {
                $(this).change();
                return e.preventDefault();
            }
        });
        function validateValue(value) {
            return /^([0-9]+)$/.test(value);
        }
        $element.keypress(function(event) {
            if (utils.isSpecialKey(event.keyCode)) {
                return true;
            }
            var newValue = $element.val() + String.fromCharCode(event.charCode);
            return validateValue(newValue);
        }).on("paste", function(event) {});
    }
    var pageNumberInput_pluginName = "telerik_ReportViewer_PageNumberInput";
    $.fn[pageNumberInput_pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pageNumberInput_pluginName)) {
                $.data(this, pageNumberInput_pluginName, new PageNumberInput(this, options));
            }
        });
    };
    function PageCountLabel(dom, options) {
        var $element = $(dom), $controller = $(options.controller);
        $controller.on("pageCount", function(e, value) {
            $element.html(value);
        });
    }
    var pageCountLabel_pluginName = "telerik_ReportViewer_PageCountLabel";
    $.fn[pageCountLabel_pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pageCountLabel_pluginName)) {
                $.data(this, pageCountLabel_pluginName, new PageCountLabel(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    trv.PerspectiveManager = function(dom, controller) {
        var $smallMenu = $(dom).find(".trv-menu-small"), perspectives = {
            small: {
                documentMapVisible: false,
                parametersAreaVisible: false,
                onDocumentMapVisibleChanged: function(e, args) {
                    if (args.visible) {
                        controller.setParametersAreaVisible({
                            visible: false
                        });
                    }
                },
                onParameterAreaVisibleChanged: function(e, args) {
                    if (args.visible) {
                        controller.setDocumentMapVisible({
                            visible: false
                        });
                    }
                },
                onBeforeLoadReport: function() {
                    controller.setParametersAreaVisible({
                        visible: false
                    });
                    controller.setDocumentMapVisible({
                        visible: false
                    });
                },
                onNavigateToPage: function() {
                    controller.setParametersAreaVisible({
                        visible: false
                    });
                    controller.setDocumentMapVisible({
                        visible: false
                    });
                }
            },
            large: {
                documentMapVisible: true,
                parametersAreaVisible: true,
                onReportLoadComplete: function(event, args) {
                    if (args.documentMapAvailable) {
                        controller.setDocumentMapVisible({
                            visible: true
                        });
                    }
                }
            }
        }, currentPerspective;
        function init() {
            currentPerspective = getPerspective();
            getState(perspectives[currentPerspective]);
        }
        function setPerspective(perspective) {
            getState(perspectives[currentPerspective]);
            currentPerspective = perspective;
            if (currentPerspective) {
                setState(perspectives[currentPerspective]);
            }
        }
        function onDocumentMapVisibleChanged(e, args) {
            dispatch("onDocumentMapVisibleChanged", arguments);
        }
        function onParameterAreaVisibleChanged(e, args) {
            dispatch("onParameterAreaVisibleChanged", arguments);
        }
        function onBeforeLoadReport() {
            dispatch("onBeforeLoadReport", arguments);
        }
        function onNavigateToPage() {
            dispatch("onNavigateToPage", arguments);
        }
        function onReportLoadComplete() {
            dispatch("onReportLoadComplete", arguments);
        }
        function onWindowResize() {
            var perspective = getPerspective();
            if (perspective != currentPerspective) {
                setPerspective(perspective);
            }
        }
        function dispatch(func, args) {
            var activePerspective = perspectives[currentPerspective];
            var handler = activePerspective[func];
            if (typeof handler === "function") {
                handler.apply(activePerspective, args);
            }
        }
        function attach() {
            $(window).resize(onWindowResize);
            controller.setDocumentMapVisible(onDocumentMapVisibleChanged);
            controller.setParametersAreaVisible(onParameterAreaVisibleChanged);
            controller.beforeLoadReport(onBeforeLoadReport);
            controller.navigateToPage(onNavigateToPage);
            controller.reportLoadComplete(onReportLoadComplete);
        }
        function getPerspective() {
            return $smallMenu.css("display") != "none" ? "small" : "large";
        }
        function getState(state) {
            state.documentMapVisible = documentMapVisible();
            state.parametersAreaVisible = parametersAreaVisible();
        }
        function setState(state) {
            documentMapVisible(state.documentMapVisible);
            parametersAreaVisible(state.parametersAreaVisible);
        }
        function documentMapVisible() {
            if (arguments.length == 0) {
                var args1 = {};
                controller.getDocumentMapState(args1);
                return args1.visible;
            }
            controller.setDocumentMapVisible({
                visible: Boolean(arguments[0])
            });
            return this;
        }
        function parametersAreaVisible() {
            if (arguments.length == 0) {
                var args1 = {};
                controller.getParametersAreaState(args1);
                return args1.visible;
            }
            controller.setParametersAreaVisible({
                visible: Boolean(arguments[0])
            });
            return this;
        }
        init();
        return {
            attach: attach
        };
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);

(function(trv, $, window, document, undefined) {
    "use strict";
    var sr = trv.sr;
    if (!sr) {
        throw "Missing telerikReportViewer.sr";
    }
    var utils = trv.utils;
    if (!utils) {
        throw "Missing telerikReportViewer.utils";
    }
    if (!trv.ServiceClient) {
        throw "Missing telerikReportViewer.ServiceClient";
    }
    if (!trv.ReportViewerController) {
        throw "Missing telerikReportViewer.ReportViewerController";
    }
    if (!trv.HistoryManager) {
        throw "Missing telerikReportViewer.HistoryManager";
    }
    var binder = trv.binder;
    if (!binder) {
        throw "Missing telerikReportViewer.Binder";
    }
    if (!trv.CommandSet) {
        throw "Missing telerikReportViewer.commandSet";
    }
    if (!trv.uiController) {
        throw "Missing telerikReportViewer.uiController";
    }
    trv.Events = {
        EXPORT_BEGIN: "EXPORT_BEGIN",
        EXPORT_END: "EXPORT_END",
        PRINT_BEGIN: "PRINT_BEGIN",
        PRINT_END: "PRINT_END",
        RENDERING_BEGIN: "RENDERING_BEGIN",
        RENDERING_END: "RENDERING_END",
        PAGE_READY: "PAGE_READY",
        ERROR: "ERROR",
        UPDATE_UI: "UPDATE_UI"
    };
    var templateCache = function() {
        var cache = {};
        var pending = {};
        function loadComplete(url) {
            delete pending[url];
        }
        function beginLoad(url) {
            var p = pending[url];
            if (p) {
                return p;
            }
            var dfd = $.Deferred();
            pending[url] = p = dfd.promise();
            $.when($.get(url)).done(function(html) {
                var templates = {};
                $("<div></div>").html(html).find("template").each(function(index, e) {
                    var $e = $(e);
                    templates[$e.attr("id")] = utils.trim($e.html(), "\n ");
                });
                cache[url] = templates;
                dfd.resolve(templates);
                loadComplete(url);
            }).fail(function() {
                dfd.reject();
                loadComplete(url);
            });
            return p;
        }
        return {
            load: function(url) {
                var t = cache[url];
                if (t) {
                    return t;
                }
                return beginLoad(url);
            }
        };
    }();
    function MemStorage() {
        var data = {};
        return {
            getItem: function(key) {
                return data[key];
            },
            setItem: function(key, value) {
                data[key] = value;
            },
            removeItem: function(key) {
                delete data[key];
            }
        };
    }
    function ReportViewerSettings(id, storage, defaultSettings) {
        var $this = {};
        function getItem(key) {
            var value = storage.getItem(formatKey(key));
            return value != null ? value : defaultSettings[key];
        }
        function setItem(key, value) {
            storage.setItem(formatKey(key), value);
        }
        function formatKey(key) {
            return id + "_" + key;
        }
        function value(key, args) {
            if (args.length) {
                setItem(key, args[0]);
                return $this;
            } else {
                return getItem(key);
            }
        }
        function valueFloat(key, args) {
            if (args.length) {
                setItem(key, args[0]);
                return $this;
            } else {
                return parseFloat(getItem(key));
            }
        }
        function valueObject(key, args) {
            if (args.length) {
                setItem(key, JSON.stringify(args[0]));
                return $this;
            } else {
                var value = getItem(key);
                return typeof value == "string" ? JSON.parse(value) : null;
            }
        }
        $this = $.extend($this, {
            scale: function() {
                return valueFloat("scale", arguments);
            },
            scaleMode: function() {
                return value("scaleMode", arguments);
            },
            history: function() {
                return valueObject("history", arguments);
            },
            clientId: function() {
                return value("clientId", arguments);
            },
            printMode: function() {
                return value("printMode", arguments);
            }
        });
        return $this;
    }
    var defaultOptions = {
        id: null,
        serviceUrl: null,
        templateUrl: null,
        reportSource: null,
        scale: 1,
        scaleMode: trv.ScaleModes.FIT_PAGE,
        viewMode: trv.ViewModes.INTERACTIVE,
        persistSession: false,
        parameterEditors: [],
        disabledButtonClass: null,
        checkedButtonClass: null
    };
    function ReportViewer(dom, options) {
        options = jQuery.extend({}, defaultOptions, options);
        if (!options.templateUrl) {
            throw sr.missingTemplate;
        }
        var $placeholder = $(dom), templates = {}, persistanceKey = options.id || "#" + $placeholder.attr("id");
        var settings = new ReportViewerSettings(persistanceKey, options.persistSession ? window.sessionStorage : new MemStorage(), {
            scale: options.scale,
            scaleMode: options.scaleMode,
            printMode: options.printMode ? options.printMode : options.directPrint
        });
        var client = new trv.ServiceClient({
            address: options.serviceUrl
        });
        var controller = options.controller;
        if (!controller) {
            controller = new trv.ReportViewerController({
                serviceClient: client,
                settings: settings
            });
        }
        var history = new trv.HistoryManager({
            controller: controller,
            settings: settings
        });
        var commands = new trv.CommandSet({
            controller: controller,
            history: history
        });
        new trv.uiController({
            controller: controller,
            history: history,
            commands: commands
        });
        var viewer = {
            refreshReport: function(ignoreCache) {
                if (arguments.length === 0) {
                    ignoreCache = true;
                }
                controller.refreshReport(ignoreCache);
                return viewer;
            },
            reportSource: function(rs) {
                if (rs || rs === null) {
                    controller.reportSource(rs);
                    return viewer;
                }
                return controller.reportSource();
            },
            viewMode: function(vm) {
                if (vm) {
                    controller.viewMode(vm);
                    return viewer;
                }
                return controller.viewMode();
            },
            scale: function(scale) {
                if (scale) {
                    controller.scale(scale);
                    return viewer;
                }
                scale = {};
                controller.getScale(scale);
                return scale;
            },
            currentPage: function() {
                return controller.currentPageNumber();
            },
            pageCount: function() {
                return controller.pageCount();
            },
            bind: function(eventName, eventHandler) {
                eventBinder(eventName, {
                    sender: viewer
                }, eventHandler, true);
            },
            unbind: function(eventName, eventHandler) {
                eventBinder(eventName, null, eventHandler, false);
            },
            commands: commands
        };
        function eventBinder(eventName, eventHandler, bind) {
            if (typeof eventHandler == "function") {
                if (bind) {
                    $(viewer).on(eventName, {
                        sender: viewer
                    }, eventHandler);
                } else {
                    $(viewer).off(eventName, eventHandler);
                }
            } else if (typeof eventHandler == undefined) {
                if (!bind) {
                    $(viewer).off(eventName);
                }
            }
        }
        function attachEvents() {
            var viewerEventsMapping = {
                EXPORT_BEGIN: controller.Events.EXPORT_STARTED,
                EXPORT_END: controller.Events.EXPORT_DOCUMENT_READY,
                PRINT_BEGIN: controller.Events.PRINT_STARTED,
                PRINT_END: controller.Events.PRINT_DOCUMENT_READY,
                RENDERING_BEGIN: controller.Events.BEFORE_LOAD_REPORT,
                RENDERING_END: controller.Events.REPORT_LOAD_COMPLETE,
                PAGE_READY: controller.Events.PAGE_READY,
                ERROR: controller.Events.ERROR,
                UPDATE_UI: controller.Events.UPDATE_UI
            }, $viewer = $(viewer), $controller = $(controller);
            for (var eventName in viewerEventsMapping) {
                var controllerEventName = viewerEventsMapping[eventName];
                var viewerEventName = eventName;
                $controller.on(controllerEventName, function($viewer, eventName) {
                    return function(e, args) {
                        $viewer.trigger({
                            type: eventName,
                            data: e.data
                        }, args);
                    };
                }($viewer, eventName));
            }
        }
        function attachEventHandlers() {
            eventBinder(trv.Events.EXPORT_BEGIN, options.exportBegin, true);
            eventBinder(trv.Events.EXPORT_END, options.exportEnd, true);
            eventBinder(trv.Events.PRINT_BEGIN, options.printBegin, true);
            eventBinder(trv.Events.PRINT_END, options.printEnd, true);
            eventBinder(trv.Events.RENDERING_BEGIN, options.renderingBegin, true);
            eventBinder(trv.Events.RENDERING_END, options.renderingEnd, true);
            eventBinder(trv.Events.PAGE_READY, options.pageReady, true);
            eventBinder(trv.Events.ERROR, options.error, true);
            eventBinder(trv.Events.UPDATE_UI, options.updateUi, true);
            $(controller).on(controller.Events.TOGGLE_SIDE_MENU, function() {
                window.setTimeout(function() {
                    $placeholder.toggleClass("trv-side-menu-visible");
                }, 1);
            });
        }
        function init() {
            $placeholder.html(templates["trv-report-viewer"]);
            binder.bind($placeholder, {
                controller: controller,
                commands: commands,
                templates: templates
            }, options);
            new trv.PerspectiveManager(dom, controller).attach();
            attachEvents();
            attachEventHandlers();
        }
        function start() {
            init();
            controller.scale({
                scale: settings.scale(),
                scaleMode: settings.scaleMode()
            });
            if (!history.loadCurrent()) {
                if (options.viewMode) {
                    controller.viewMode(options.viewMode);
                }
                if (options.reportSource) {
                    controller.reportSource(options.reportSource);
                }
            }
            controller.scale(function() {
                var args = {};
                controller.getScale(args);
                settings.scale(args.scale);
                settings.scaleMode(args.scaleMode);
            });
            if (typeof options.ready == "function") {
                options.ready.call(viewer);
            }
        }
        $.when(templateCache.load(options.templateUrl)).done(function(t) {
            templates = t;
            start();
        }).fail(function() {
            $placeholder.html(sr.errorLoadingTemplates);
        });
        return viewer;
    }
    var pluginName = "telerik_ReportViewer";
    jQuery.fn[pluginName] = function(options) {
        options.selector = this.selector;
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ReportViewer(this, options));
            }
        });
    };
})(window.telerikReportViewer = window.telerikReportViewer || {}, jQuery, window, document);
/* DO NOT MODIFY OR DELETE THIS LINE! UPGRADE WIZARD CHECKSUM E92C0FEC072652431782A3F11A23980D */