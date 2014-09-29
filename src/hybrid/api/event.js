define(
    function(require) {

        /**
         * @class event
         * @singleton
         * @private
         */
        var event = {};

        //原生事件;
        var _type = [
            'layerCreateSuccess', //layer创建成功
            'layerLoadFinish', //layer 页面载入成功
            'layerPullDown', //下拉刷新loading
            'layerPoped',//layer返回事件
            'sliderTap', //slider点击 sliderTap
            'sliderSlide',//slider 滑动切换 sliderSlide
            'menuPressed',//菜单建事件
            'layerGoBack',//layer中返回键goBack回调
            'backPressedBeforeExit',//返回键退出事件回调
            'toolbarMenuSelected', //footbar点中toolbarMenuSelected
            'softKeyboardShow',
            'softKeyboardHide'
        ];

        var handlers = {};
        var jsonParseFliter = function(key,val){
            if(val&&val.indexOf&&val.indexOf('function')>=0){
                 return new Function("return "+val)();
            }else{
                return val;
            }
        };

        event.on = function(type, handler, id, context, isonce) {
            var me = this;
            id = id || (this.getCurrentId && this.getCurrentId()) || 'empty';
            context = context || this;
            if (handlers[type]) {
                var i = 0,
                    listeners = handlers[type]['listener'],
                    len = listeners.length;
                for (; i < len; i++) {
                    if (listeners[i].id == id && listeners[i].callback == handler && listeners[i].context == context) {
                        break;
                    }
                }
                if (i == len) {
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
            }else {
                //console.log("不支持此事件");
                handlers[type] = {};
                handlers[type]['listener'] = [];
                if (_type.indexOf(type) < 0) {
                    handlers[type]['callback'] = function(event) {
                        var parseData = JSON.parse(decodeURIComponent(event.data),jsonParseFliter);
                        var listeners = handlers[type]['listener'];
                        event.origin = event['sender'] || parseData.origin;
                        event.data = parseData.data;
                        event.detail = event.origin;
                        event.reciever = event.target = parseData.target;
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            if (parseData.callEvent) {
                                event.callback = function(data) {
                                    me.fire(parseData.callEvent, event.origin, data);
                                };
                            }
                            listeners[i].callback.call(listeners[i].context, event, listeners[i].id);
                        }
                        isonce && me.off(type);
                    };
                }else {
                    handlers[type]['callback'] = function(event) {
                       var listeners = handlers[type]['listener'];
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            if (listeners[i].id == event['origin']) {
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
                }else {
                    var i = 0,
                        listeners = handlers[type]['listener'],
                        isAll = handler == 'all',
                        len = listeners.length;

                    for (; i < len; i++) {
                        if (listeners[i].id == id && listeners[i].context == context && (isAll || listeners[i].callback == handler)) {
                            listeners.splice && listeners.splice(i, 1);
                            break;
                        }
                    }
                    if (listeners.length === 0 && handlers[type]['listened']) {
                        document.removeEventListener(type, handlers[type].callback);
                        handlers[type]['listened'] = false;
                    }
                }
            }else {
                console.log('无此事件绑定');
            }
        };

        event.once = function(type, handler, id, context) {
            this.on(type, handler, id, context, 'isonce');
        };

        return event;
    }
);
