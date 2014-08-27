/**
 * Layer类，内含一个web容器，可以放置在手机屏幕的任何位置，动画可自定义
 * @class Layer
 * @extends Control
 * @static
 * @inheritable
 */
define(['./runtime','./api/layer'],function(runtime,layer) {

    // var layer = require('./api/Layer.js');
    var layerid = layer.getCurrentId();
    // var events = require('./api/event.js');

    //这里判断代理类 负责是 接收事件 还是 发送事件
    //layer 0 是接收事件， 其他layer是发送事件
    var funcs = ['in','out','reload','replace','stopPullRefresh','stopLoading','getUrl'
    ,'canGoBack','clearHistory','isActive','destroy'];

    var delegateLayer = function(id) {
        this.id = id;
        return this;
    };

    if ( layerid === '0' ) { //接收
        console.log("events delegate Layer 0 init..");
        for(var i=0,len=funcs.length;i<len;i++) {
            (function(n){
                runtime.layer.on("delegate"+funcs[n],function(e){
                    console.log("layer 00 recieved...." + JSON.stringify(e.data));
                    // var blend = require('./blend');
                    Blend.ui.get(e.data.id)[funcs[n]].apply(Blend.ui.get(e.data.id),e.data.args);
                });
            })(i)
        }
    }

    //注册发送方法
    for(var i=0,len=funcs.length;i<len;i++) {
        (function(n){
            delegateLayer.prototype[funcs[n]] = function(){
                runtime.layer.fire("delegate"+funcs[n],'0',{id:layerid,args:arguments});
            };
        })(i);
        
    }
    // }
    //TODO 
    // 如何与 layer 进行杂融 new Layer 也能自动注册到 layer 0 上面去...
    

    return delegateLayer;
});