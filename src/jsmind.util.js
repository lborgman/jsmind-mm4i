/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';
import { logger } from './jsmind.common.js';

export const util = {
    ajax: {
        request: function (url, param, method, callback, fail_callback) {
            var p = Object.keys(param)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(param[k]))
                .join('&');
            var xhr = new XMLHttpRequest();
            if (!xhr) {
                return;
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 0) {
                        if (typeof callback === 'function') {
                            var data = util.json.string2json(xhr.responseText);
                            if (data != null) {
                                callback(data);
                            } else {
                                callback(xhr.responseText);
                            }
                        }
                    } else {
                        if (typeof fail_callback === 'function') {
                            fail_callback(xhr);
                        } else {
                            logger.error('xhr request failed.', xhr);
                        }
                    }
                }
            };
            method = method || 'GET';
            xhr.open(method, url, true);
            xhr.setRequestHeader('If-Modified-Since', '0');
            if (method == 'POST') {
                xhr.setRequestHeader(
                    'Content-Type',
                    'application/x-www-form-urlencoded;charset=utf-8'
                );
                xhr.send(p);
            } else {
                xhr.send();
            }
        },
        get: function (url, callback) {
            return util.ajax.request(url, {}, 'GET', callback);
        },
        post: function (url, param, callback) {
            return util.ajax.request(url, param, 'POST', callback);
        },
    },

    file: {
        read: function (file_data, fn_callback) {
            var reader = new FileReader();
            reader.onload = function () {
                if (typeof fn_callback === 'function') {
                    fn_callback(this.result, file_data.name);
                }
            };
            reader.readAsText(file_data);
        },

        save: function (file_data, type, name) {
            var blob;
            if (typeof $.w.Blob === 'function') {
                blob = new Blob([file_data], { type: type });
            } else {
                var BlobBuilder =
                    $.w.BlobBuilder ||
                    $.w.MozBlobBuilder ||
                    $.w.WebKitBlobBuilder ||
                    $.w.MSBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(file_data);
                blob = bb.getBlob(type);
            }
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, name);
            } else {
                var URL = $.w.URL || $.w.webkitURL;
                var blob_url = URL.createObjectURL(blob);
                var anchor = $.c('a');
                if ('download' in anchor) {
                    anchor.style.visibility = 'hidden';
                    anchor.href = blob_url;
                    anchor.download = name;
                    $.d.body.appendChild(anchor);
                    var evt = $.d.createEvent('MouseEvents');
                    evt.initEvent('click', true, true);
                    anchor.dispatchEvent(evt);
                    $.d.body.removeChild(anchor);
                } else {
                    location.href = blob_url;
                }
            }
        },
    },

    json: {
        json2string: function (json) {
            return JSON.stringify(json);
        },
        string2json: function (json_str) {
            return JSON.parse(json_str);
        },
        merge: function (b, a) {
            for (var o in a) {
                if (o in b) {
                    if (
                        typeof b[o] === 'object' &&
                        Object.prototype.toString.call(b[o]).toLowerCase() == '[object object]' &&
                        !b[o].length
                    ) {
                        util.json.merge(b[o], a[o]);
                    } else {
                        b[o] = a[o];
                    }
                } else {
                    b[o] = a[o];
                }
            }
            return b;
        },
    },

    uuid: {
        newid: function () {
            return (
                new Date().getTime().toString(16) + Math.random().toString(16).substring(2)
            ).substring(2, 18);
        },
    },

    text: {
        is_empty: function (s) {
            if (!s) {
                return true;
            }
            return s.replace(/\s*/, '').length == 0;
        },
    },

    timing: {

        // Quick fix for waiting for screen render!
        // javascript - Performance of MutationObserver to detect nodes in entire DOM - Stack Overflow
        // https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340
        // FIX-ME: Is not this just a version of debounce?
        wait4mutations: (elt, ms, observeWhat, msMaxWait) => {
            observeWhat = observeWhat || { attributes: true, characterData: true, childList: true, subtree: true, };
            return new Promise(resolve => {
                let tmr;
                let mu;
                let nMu = 0;
                const now = Date.now();
                function fin(val) { resolve(val); mu?.disconnect(); }
                function restartTimer() {
                    clearTimeout(tmr);
                    nMu++;
                    const newNow = Date.now();
                    console.log({ nMu }, mu == undefined, newNow - now);
                    if (msMaxWait && (newNow - now > msMaxWait)) {
                        fin("max wait");
                        return;
                    }
                    if (mu) {
                        mu.disconnect();
                        mu = undefined;
                    } else {
                        mu = new MutationObserver(mutations => {
                            console.log("mutations!");
                            restartTimer();
                        });
                    }
                    setTimeout(fin, ms);
                    mu?.observe(elt, observeWhat);
                }
                // const mu = new MutationObserver(mutations => { restartTimer(); });
                restartTimer();
                // mu.observe(elt, observeWhat);
                // { attributes: true, characterData: true, childList: true, subtree: true, }
            });
        },


    },

    // From https://garden.bradwoods.io/notes/javascript/performance/debounce-throttle
    debounce: function (callback, waitMS = 200) {
        let timeoutId;

        return function (...args) {
            const context = this
            clearTimeout(timeoutId);

            timeoutId = setTimeout(function () {
                timeoutId = null
                callback.call(context, ...args)
            }, waitMS);
        };
    },

    throttle: function (func, waitMS = 200) {
        let isWait = false;

        return function (...args) {
            if (!isWait) {
                func.call(this, ...args);
                isWait = true;

                setTimeout(() => {
                    isWait = false;
                }, waitMS);
            }
        }
    }

};
