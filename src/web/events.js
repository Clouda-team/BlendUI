define(
    function(require) {

        var events = {};
        
        // var white_list = [""];

        var _type = [//原生事件
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


        events.on = function(type, callback, id, context) {
            if (typeof context === 'undefined') {
                if (id || this.id) {
                    context = Blend.ui.get(id || this.id).main;
                }else{
                    if (_type.contains(type)) {
                        context = Blend.ui.activeLayer[0];//只选active layer 的dom
                    }else{
                        context = document;
                    }
                    
                }
                
            }

            //继承父类的on事件 FIXME 父类此方法会引起多重绑定的bug
            //细化 web端 事件的处理
            //事件on

            if (typeof callback === 'function') {
                context.addEventListener(type, callback, false);
            }
      
        };
        //监听一次
        events.once = function(type, callback, id, context) {
            if (typeof context === 'undefined') {
                // context = this.main;
                // context = Blend.ui.get(id || this.id).main;
                if (id || this.id) {
                    context = Blend.ui.get(id || this.id).main;
                }else{
                    context = document;
                }
            }

            //继承父类的on事件 FIXME 父类此方法会引起多重绑定的bug
            // Control.prototype.on(type, callback,(id||this.id) , context);

            //细化 web端 事件的处理
            //事件on

            if (typeof callback === 'function') {
                var cb = function() {
                    callback.apply(context, arguments);
                    context.removeEventListener(type, cb, false);
                };
                context.addEventListener(type, cb, false);
            }

        };
        //@params id for runtime use,useless for web
        events.off = function(type, callback, id, context) {
            if (typeof context === 'undefined') {
                // context = this.main;
                context = Blend.ui.get(id || this.id).main;
            }
            //继承父类的on事件
            // Control.prototype.off(type, callback,(id||this.id) , context);

            //细化 web端 事件的处理
            //事件off

            if (typeof callback === 'function') {
                context.removeEventListener(type, callback, false);
            }
        };

        events.fire = function(type, argAry, message, callback,context) {
            //继承父类的fire 事件
            // Control.prototype.fire(type, argAry, context);

            //细化 web端 事件的处理
            //事件 fire,事件可以冒泡
            try {
                var e;
                if (!argAry)argAry = this.id;

                if (typeof argAry === 'undefined') {
                    console.warn("cant find fire object. ");
                    return ;
                }

                if (typeof context === 'undefined' && typeof argAry !== 'undefined') {
                    // context = this.main;
                    context = Blend.ui.get(argAry).main;
                }
                if (typeof CustomEvent !== 'undefined') {
                    var opt = {
                        bubbles: true,
                        cancelable: true,
                        detail: argAry
                    };
                    e = new CustomEvent(type, opt);
                    console.log(type, opt);
                } else {
                    e = document.createEvent('CustomEvent');
                    e.initCustomEvent(type, true, true, argAry);
                }

                
                
                if (typeof message !== 'undefined') {
                    e.data = message;
                }

                if (typeof callback === 'function') {
                    callback(e);
                }
                //!!注意 这里的fire 可能在webcontrol里面，也可能在blend.fire 直接触发，所以，不一定有this 方法，
                //仅在webcontrol中调用fire时，有这个方法

                // 触发直接挂在对象上的方法，除了需要冒泡的方法需要注册on事件以外，其他事件一律不需要绑定on 方法
                var handler = Blend.ui.get(argAry)[ type];
                if (typeof handler === 'function') {
                    handler.call(this, e);
                }

                if (context) {
                    // e.srcElement = context;//修改无效
                    (context).dispatchEvent(e);
                }


            } catch (ex) {
                console.warn('Events fire errors.please check the runtime environment.', ex.stack);
            }

        };
        return events;
    }
);