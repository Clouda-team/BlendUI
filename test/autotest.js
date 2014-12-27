require([
    'autotest/Layer.js',
    'autotest/uatest.js',
    'autotest/native-api.js'
],function(){
    if(window.lc_bridge){
        mocha.run();
    }else if(navigator.userAgent.match(/BaiduLightAppRuntime/)){
        document.addEventListener('runtimeready', function(){
            mocha.run();
        }, false);
    }else if(window.mochaPhantomJS){
        mochaPhantomJS.run();
    }else{
         mocha.run();
    }
});