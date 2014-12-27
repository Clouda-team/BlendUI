/**
* @file event.js
* @path hybrid/api/event.js
* @desc native所有组件传递事件通过此封装成on off fire;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {
        /**
         * @class event
         * @singleton
         * @private
         */
        var event = {};

        // 原生事件;
        var _type = [
            // layer创建成功
            'layerCreateSuccess',
            // layer 页面载入成功
            'layerLoadFinish',
            // 下拉刷新loading
            'layerPullDown',
            // layer返回事件
            'layerPoped',
            // slider点击 sliderTap
            'sliderTap',
            // slider 滑动切换 sliderSlide
            'sliderSlide',
            // 菜单建事件
            'menuPressed',
            // layer中返回键goBack回调
            'layerGoBack',
            // 返回键退出事件
            'backPressedBeforeExit',
            // footbar点中toolbarMenuSelected
            'toolbarMenuSelected',
            'softKeyboardShow',
            'softKeyboardHide',
            'showAlert',
            'showPrompt',
            'showConfirm',
            'cascadingMenuSelected'
        ];

        var handlers = {};
        var jsonParseFliter = function(key, val) {
            if (val && val.indexOf && val.indexOf('function') >= 0) {
                return new Function('return ' + val)();
            }
            return val;
        };

        event.on = function(type, handler, id, context, isonce) {
            var me = this;
            id = id || (this.getCurrentId && this.getCurrentId()) || 'empty';
            context = context || this;
            if (handlers[type]) {
                var i = 0;
                var listeners = handlers[type]['listener'];
                var len = listeners.length;
                for (; i < len; i++) {
                    if (listeners[i].id === id
                        && listeners[i].callback === handler
                        && listeners[i].context === context) {
                        break;
                    }
                }
                if (i === len) {
                    handlers[type]['listener'].push({
                        id: id,
                        context: context,
                        callback: handler

                    });
                }
                if (!handlers[type]['listened']) {
                    document.addEventListener(type, handlers[type].callback, false);
                    handlers[type]['listened'] = true;
                }
            }
            else {
                // console.log('不支持此事件');
                handlers[type] = {};
                handlers[type]['listener'] = [];
                if (_type.indexOf(type) < 0) {
                    handlers[type]['callback'] = function(event) {
                        var parseData = JSON.parse(decodeURIComponent(event.data), jsonParseFliter);
                        var callback;
                        var listeners = handlers[type]['listener'];
                        event.origin = event['sender'] || parseData.origin;
                        event.data = parseData.data;
                        event.detail = event.origin;
                        event.reciever = event.target = parseData.target;
                        callback = function(data) {
                            me.fire(parseData.callEvent, event.origin, data);
                        };
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            if (parseData.callEvent) {
                                event.callback = callback;
                            }
                            listeners[i].callback.call(listeners[i].context, event, listeners[i].id);
                        }
                        isonce && me.off(type);
                    };
                }
                else {
                    handlers[type]['callback'] = function(event) {
                        var listeners = handlers[type]['listener'];
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            if (listeners[i].id === event['origin']) {
                                event.detail = event.origin;
                                listeners[i].callback.call(listeners[i].context, event, listeners[i].id);
                            }
                        }
                        isonce && me.off(type);
                    };
                }
                this.on(type, handler, id, context);
            }
        };
        event.off = function(type, handler, id, context) {
            id = id || (this.getCurrentId && this.getCurrentId()) || 'empty';
            context = context || this;
            if (handlers[type]) {
                if (!handler) {
                    document.removeEventListener(type, handlers[type].callback);
                    handlers[type]['listened'] = false;
                    handlers[type]['listener'] = [];
                }
                else {
                    var i = 0;
                    var listeners = handlers[type]['listener'];
                    var isAll = handler === 'all';
                    var len = listeners.length;

                    for (; i < len; i++) {
                        if (listeners[i].id === id
                            && listeners[i].context === context
                            && (isAll || listeners[i].callback === handler)) {
                            listeners.splice && listeners.splice(i, 1);
                            break;
                        }
                    }
                    if (listeners.length === 0 && handlers[type]['listened']) {
                        document.removeEventListener(type, handlers[type].callback);
                        handlers[type]['listened'] = false;
                    }
                }
            }
            else {
                window.console && window.console.log('无此事件绑定');
            }
        };

        event.once = function(type, handler, id, context) {
            this.on(type, handler, id, context, 'isonce');
        };

        return event;
    }
);
