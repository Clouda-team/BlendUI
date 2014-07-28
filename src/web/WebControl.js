define(


        function(require) {
            var blend = require('./blend');
            var lib = require('./../common/lib');
            var Control = require('./Control');
            var events = require('./events');


        /**
         * todo:这个WebControl不能合并到Control中么？
         * @class blend.webControl
         * @extends Control
         * @static
         */

        function WebControl(options) {

            Control.apply(this, arguments);
        }


        //重新实现

        WebControl.prototype.type = 'layout';

        // var myevents = [];

        //覆盖control的方法
        //js事件
        //处理内部事宜,也可用来指定dom事件
        //@params id for runtime use,useless for web
        WebControl.prototype.on = events.on;
        // function(type, callback, id, context) {
        //     if (typeof context === 'undefined') {
        //         context = blend.get(id || this.id).main;
        //     }

        //     //继承父类的on事件 FIXME 父类此方法会引起多重绑定的bug
        //     // Control.prototype.on(type, callback,(id||this.id) , context);

        //     //细化 web端 事件的处理
        //     //事件on

        //     if (typeof callback === 'function') {
        //         context.addEventListener(type, callback, false);
        //     }
        //     // myevents.push([type, callback]);

        // };
        //监听一次
        WebControl.prototype.once = events.once;
        //  function(type, callback, id, context) {
        //     if (typeof context === 'undefined') {
        //         // context = this.main;
        //         context = blend.get(id || this.id).main;
        //     }

        //     //继承父类的on事件 FIXME 父类此方法会引起多重绑定的bug
        //     // Control.prototype.on(type, callback,(id||this.id) , context);

        //     //细化 web端 事件的处理
        //     //事件on

        //     if (typeof callback === 'function') {
        //         var cb = function() {
        //             callback.apply(context, arguments);
        //             context.removeEventListener(type, cb, false);
        //         };
        //         context.addEventListener(type, cb, false);
        //     }

        // };
        //@params id for runtime use,useless for web
        WebControl.prototype.off = events.off;
        // function(type, callback, id, context) {
        //     if (typeof context === 'undefined') {
        //         // context = this.main;
        //         context = blend.get(id || this.id).main;
        //     }
        //     //继承父类的on事件
        //     // Control.prototype.off(type, callback,(id||this.id) , context);

        //     //细化 web端 事件的处理
        //     //事件off

        //     if (typeof callback === 'function') {
        //         context.removeEventListener(type, callback, false);
        //     }
        // };

        WebControl.prototype.fire = events.fire;
        // function(type, argAry, context) {
        //     //继承父类的fire 事件
        //     // Control.prototype.fire(type, argAry, context);

        //     //细化 web端 事件的处理
        //     //事件 fire,事件可以冒泡
        //     try {
        //         var e;
        //         if (!argAry)argAry = this.id;

        //         if (typeof context === 'undefined') {
        //             // context = this.main;
        //             context = blend.get(argAry).main;
        //         }
        //         if (typeof CustomEvent !== 'undefined') {
        //             var opt = {
        //                 bubbles: true,
        //                 cancelable: true,
        //                 detail: argAry
        //             };
        //             e = new CustomEvent(type, opt);
        //             console.log(type, opt);
        //         } else {
        //             e = document.createEvent('CustomEvent');
        //             e.initCustomEvent(type, true, true, argAry);
        //         }
        //         if (context) {
        //             (context).dispatchEvent(e);
        //         }


        //     } catch (ex) {
        //         console.warn('Touch.js is not supported by environment.', ex.stack);
        //     }

        // };

        WebControl.prototype.animationEnd = function(callback) {
            var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
                i, j, me = this;
            function fireCallBack(e) {
                callback(e);
                for (i = 0; i < events.length; i++) {
                    me.off(events[i], fireCallBack);
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    me.on(events[i], fireCallBack);
                }
            }
            return this;
        };
        WebControl.prototype.transitionEnd = function(callback) {
            var events = ['webkitTransitionEnd'],
                i, j, me = this;
            function fireCallBack(e) {
                callback(e);
                for (i = 0; i < events.length; i++) {
                    me.off(events[i], fireCallBack);
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    me.on(events[i], fireCallBack);
                }
            }
            return this;
        };

        lib.inherits(WebControl, Control);

        return WebControl;
    }
);