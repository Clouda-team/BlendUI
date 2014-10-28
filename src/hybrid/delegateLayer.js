/**
 * 通过插件的形式为blend添加delegate,使其在底层layer上集中创建layer和使用layer方法
 * 通过消息传递在集中创建layer,为JSON.stringify和parse增加filter支持函数传递
 * delegate创建的layer不能直接获取layer属性 如layer.id
 */
define(function(require) {
    var blend = require('./blend');
    var layerClass = require('./Layer');
    var layerId = blend.getLayerId();
    var protos = new layerClass();

    var delegateLayer = function(id){
        this.id = id||layerId;
    };

    var delegateMethod = "delegateMethod";
    var delegateCreate = "delegateCreate";
    blend.ready(function() {
        layerId = blend.getLayerId();
        if(layerId=='0'){
            //触发函数
            blend.on(delegateMethod,function(e){
                var data = e.data;
                var method = data.method;
                var args = data.args;
                var id = data.id;
                blend.get(id)[method].apply(blend.get(id),args);
            });
            //创建layer
            blend.on(delegateCreate,function(e){
                //alert(JSON.stringify(e.data));
                new layerClass(e.data);
            });
        }
    });
    

    for(var i in protos){
        // 方法可以通过delegate进行操作，属性不能直接获取
        delegateLayer.prototype[i] = (function(attr){
            if(typeof protos[attr] =='function'){
                return function(){
                    var me = this;
                    blend.fire(delegateMethod,'0',{
                        id: me.id,
                        args:arguments,
                        method:attr
                    });
                };
            }else{
                return function(){
                    console.log('delegate error');
                };
            }
        })(i);
    }

// new Layer();
// $.layer({}) //new Layer 
//$.layergroup({}) //new LayerGroup
//$("info")  control的实例  > layder
//$("slider") control > slider in.out
// $zepto

    var get = blend.get;
    blend.get = function(id){
        var layer = get(id);
        if(layer){
            return layer;
        }else{
            return new delegateLayer(id);
        }
    };

    blend.createLayer = function(options){
        if(blend.getLayerId()==='0'){
            return new Layer(options);
        }else{
            blend.fire(delegateCreate,'0',options);
            return blend.getLayer(options.id);
        }
    };
});