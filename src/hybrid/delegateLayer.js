/**
* @file delegateLayer.js
* @path hybrid/delegateLayer.js
* @desc 通过插件的形式为blend添加delegate,使其在底层layer上集中创建layer和
*    使用layer方法,通过消息传递在集中创建layer,为JSON.stringify和
*    parse增加filter支持函数传递
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {
        var blend = require('./blend');
        var LayerClass = require('./Layer');
        var protos = new LayerClass();
        var delegateMethod = 'delegateMethod';
        var delegateCreate = 'delegateCreate';
        var DelegateLayer = function(id) {
            this.id = id || blend.getLayerId();
        };
        // 必须等ready后触发;
        blend.ready(function() {
            var layerId = blend.getLayerId() + '';
            if (layerId === '0') {
                // 触发函数
                blend.on(delegateMethod, function(e) {
                    var data = e.data;
                    var method = data.method;
                    var args = data.args;
                    var id = data.id;
                    blend.get(id)[method].apply(blend.get(id), args);
                });
                // 创建layer
                blend.on(delegateCreate, function(e) {
                    new LayerClass(e.data);
                });
            }
        });
        // 循环查找各个属性和函数;
        for (var i in protos) {
            // 方法可以通过delegate进行操作，属性不能直接获取
            DelegateLayer.prototype[i] = (function(attr) {
                var fn;
                if (typeof protos[attr] === 'function') {
                    fn = function() {
                        var me = this;
                        blend.fire(delegateMethod, '0', {
                            id: me.id,
                            args: arguments,
                            method: attr

                        });
                    };
                }
                else {
                    fn = function() {
                        console.log('delegate error');
                    };
                }
                return fn;
            })(i);
        }

        blend.getLayer = function(id) {
            var layer = blend.get(id);
            if (layer) {
                return layer;
            }
            return new DelegateLayer(id);
        };

        blend.createLayer = function(options) {
            var layer;
            if (blend.getLayerId() === '0') {
                layer = new LayerClass(options);
            }
            else {
                blend.fire(delegateCreate, '0', options);
                layer = blend.getLayer(options.id);
            }
            return layer;
        };
    }
);
