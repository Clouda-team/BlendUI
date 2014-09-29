define(
    function(require) {

        var comp = {};

        //幻灯片组件
        comp.slider = require('./component/slider');
        comp.footbar = require('./component/footbar');

        return comp;
    }
);
