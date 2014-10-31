define(
    function(require) {

    /**
     * @class blend.loader
     * @singleton
     * @private
     */

    //baidu-async-module,
    //这里实现两个方法
    //A. 加载页面源js
    //B. 页面内嵌js
    
    var loader = {};

    var getScript = function(url,cb){
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.head.appendChild(script);
        script.onload = function(){
                if(cb){cb(script);}
        };
    };


    loader.getScript = function(layerid,jsarr,callback){
        var getscript = 0;
        for(var i = 0,len=jsarr.length;i<len;i++){
             getScript(jsarr[i],function(){
                getscript++;
                if (getscript === len){
                    callback();
                }
            });
        }
    };
    loader.runScript = function(dom){
        if ($("script",dom).length){
            $("script",dom).each(function(){
                eval($(this).html());
            });
        }

    };
    
    return loader;

});