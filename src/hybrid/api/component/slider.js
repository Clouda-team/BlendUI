define(
    function (require) {

        /**
         * @class rutime.component.slider 
         * @singleton
         * @private
         */
        var config = require('../config');
        var event = require('../event');
        var util = require('../util');

        var slider  = {};
        var devPR = config.DEVICE_PR;
        

        var filterOption = util.filterPositionOption;
        var apiFn = util.apiFn;

        /**
         * 增加slider
         */
        slider.add = function(id, options){
            var _options = {
                "left":0,
                "top":0,
                "width":window.innerWidth*devPR,
                "height":window.innerHeight*devPR,
                "fixed":false
            };

            _options = filterOption(options,false,_options);

            _options.top += window.pageYOffset*devPR;
            apiFn("addComponent",[id, 'UIBase', 'com.baidu.lightui.component.slider.Slider', JSON.stringify(_options)]);

            return slider;
        };
        
        /**
         * 增加images数据
         */
        slider.addItems = function(id, images){
            apiFn("componentExecuteNative",[id, 'addItems',  JSON.stringify(images)]);
            return slider;
        };
        /**
         * 设置背景
         */
        slider.setConfig = function(id, options){
            apiFn("componentExecuteNative",[id, 'setSliderConfig',JSON.stringify(options)]);
            return slider;
        };

        /**
         * 设置指示器
         */
        slider.setupIndicator = function(id, options){
            //alert(JSON.stringify(options));
            options.layoutRules=[config.CENTER_HORIZONTAL, config.ALIGN_PARENT_BOTTOM];
            options.verticalMargin= Math.round((options.verticalMargin||5) * devPR);
            options.unitSize=Math.round((options.unitSize||10) * devPR);
            options.unitSpace=Math.round((options.unitSpace||5) * devPR);
            apiFn("componentExecuteNative",[id, 'setupIndicator',JSON.stringify(options)]);
            return slider;
        };

        /**
         * next
         */
        slider.next = function(id){
            apiFn("componentExecuteNative",[id, 'next','']);
            return slider;
        };

        /**
         * prev
         */
        slider.prev = function(id){
            apiFn("componentExecuteNative",[id, 'prev','']);
            return slider;
        };

        /**
         * slider to
         */
        slider.slideTo = function(id, index,hasAnim){
            apiFn("componentExecuteNative",[id, 'slideTo', JSON.stringify({
                index:index,
                isAnim:!!hasAnim
            })]);
            return slider;
        };
        
        
        /**
         *
         * 注册layer事件触发
         * @method {Function} on
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        slider.on = event.on;
        
        /**
         *
         * 移除事件
         * @method {Function} off
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        slider.off = event.off;
        
        /**
         * 移除组件
         */
        slider.remove = function(id){
            apiFn("removeComponent",[id, 'UIBase']);
        };
        return slider;
    }
);