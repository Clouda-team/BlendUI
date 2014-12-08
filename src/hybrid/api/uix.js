/**
* @file uix.js
* @path hybrid/api/uix.js
* @desc native uix相关api;@todo remove
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var util = require('./util');
        var event = require('./event');

        var apiFn = util.apiFn;

        var uix = {};

        uix.setData = function(options) {
            apiFn('UIXSetData', arguments);
        };

        uix.exeMethod = function(id, method, args) {
            apiFn('UIXExe', arguments);
        };

        var _clickHandlers = false;
        uix.on = function(name, handler) {
            if (!_clickHandlers) {
                _clickHandlers = {};
                _clickHandlers[name] = handler;
                event.on('UIXClick',function(e) {
                    var originData = JSON.parse(decodeURIComponent(event.data));
                    var _name = originData && originData.name;
                    if (_clickHandlers[_name]) {
                        _clickHandlers[_name](originData.data);
                    }
                });
            }
            else {
                _clickHandlers[name] = handler;
            }
        };

        return uix;
    }
);
