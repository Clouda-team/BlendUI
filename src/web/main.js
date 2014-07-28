require(['src/web/blend','src/web/dialog/alert','src/web/slider','src/web/Layer.js','src/web/LayerGroup.js'], function (blend, alert,slider,layer,layergroup) {
    "use strict";

    blend = blend||{};
    
    //dialogs
    blend.dialog = {};
    blend.dialog.alert = alert;

    //components
    blend.component = {};
    // blend.component.slider = slider;
    blend.Slider = slider;

	//layer
    blend.Layer = layer;
    blend.LayerGroup = layergroup;
    

    //等到dom ready之后回调
    var e;
    if (typeof CustomEvent !== 'undefined') {
        e = new CustomEvent('blendready', {
          // detail: { slideNumber: Math.abs(slideNumber) },
          bubbles: false,
          cancelable: true
        });
    }else{
        e  = document.createEvent("Event");
        e.initEvent("blendready",false,false);
    }
        
 
    if (/complete|loaded|interactive/.test(document.readyState)) {
        document.dispatchEvent(e);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.dispatchEvent(e);
        }, false);
    }

    // window.Blend = blend;
    window.Blend = window.Blend || {};//初始化window的blend 对象 ， 将 blend 作为模块 绑定到 Blend.ui 上
    window.Blend.ui = blend;

    
},null,true);
