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
            'tap', //slider点击
            'slide',//slider 滑动切换
            'menuPressed',//菜单建事件
            'layerGoBack',//layer中返回键goBack回调
            'backPressedBeforeExit'//返回键退出事件回调
        ];


        //todo: 这个变量换一个名字吧，和event很容易混淆
        var events = {};
        var callCount = 0;

        //todo: 这两个函数放在这里，然后连入到 layer里面，看着很诡异；
        //todo: 考虑放到control里面，并且改一个名字？比如叫 bind/unbind/trigger之类的？或者干脆和control里面的合并

        event.on = function(type, handler, id, context, isonce) {
            var me = this;
            id = id || (this.getCurrentId && this.getCurrentId()) || 'empty';
            context = context || this;
            if (events[type]) {
                var i = 0,
                    listeners = events[type]['listener'],
                    len = listeners.length;
                for (; i < len; i++) {
                    if (listeners[i].id == id && listeners[i].callback == handler && listeners[i].context == context) {
                        break;
                    }
                }
                if (i == len) {
                   events[type]['listener'].push({
                     id: id,
                     context: context,
                     callback: handler
                   });
                }
                if (!events[type]['listened']) {
                    document.addEventListener(type, events[type].callback, false);
                    events[type]['listened'] = true;
                }
            }else {
                //console.log("不支持此事件");
                events[type] = {};
                events[type]['listener'] = [];
                if (_type.indexOf(type) < 0) {
                    events[type]['callback'] = function(event) {
                        var parseData = JSON.parse(decodeURIComponent(event.data));
                        var listeners = events[type]['listener'];
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
                    events[type]['callback'] = function(event) {
                       var listeners = events[type]['listener'];
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
            if (events[type]) {
                if (!handler) {
                    document.removeEventListener(type, events[type].callback);
                    events[type]['listened'] = false;
                    events[type]['listener'] = [];
                }else {
                    var i = 0,
                        listeners = events[type]['listener'],
                        isAll = handler == 'all',
                        len = listeners.length;

                    for (; i < len; i++) {
                        if (listeners[i].id == id && listeners[i].context == context && (isAll || listeners[i].callback == handler)) {
                            listeners.splice && listeners.splice(i, 1);
                            break;
                        }
                    }
                    if (listeners.length == 0 && events[type]['listened']) {
                        document.removeEventListener(type, events[type].callback);
                        events[type]['listened'] = false;
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
