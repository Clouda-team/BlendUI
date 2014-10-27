/**
 * LayerGruop类，内含多个Layer，可以放置在手机屏幕的任何位置，系统会自动管理多个Layer之间的滑动关系
 * @class Layer
 * @extends Control
 * @static
 * @inheritable
 */
define(function(require) {

    var blend = require('./blend');
    var lib = require('../common/lib');
    // var Control = require('./Control');
    var Control = require('./WebControl');
    //是否是runtime运行环境
    var isRuntimeEnv = false;//main.inRuntime();//runtime.isRuntimeEnv&&runtime.isRuntimeEnv();
    // var groupApi = runtime.layerGroup;

    var groupApi = require('./layer/layerGroupApi');
    var layerApi = require('./layer/layerapi');

    var layer = require('./Layer.js');
    var lowerAnimate = $("html").hasClass("android");


    /**
     * @constructor;
     *
     * LayerGroup结构化函数;
     * @extends Control
     *
     * @param {Object} options 有创建独立layer所需要的条件
     * @param {Array} options.layers LayerGroup中的Layer参数options
     * @param {String} options.layers.url layer的link
     * @param {Boolean} [options.layers.active=false] layer默认展示
     * @param {Boolean} [options.layers.autoload=false] 是否自动加载
     * @param {String} [options.layers.id] layer的id
     * @param {Function} [options.layers.onrender] webview容器render成功的回调
     * @param {Function} [options.layers.renderfail] webview容器render失败的回调
     * @param {Function} [options.layers.onload] webview页面onload的回调
     * @param {Function} [options.layers.onshow] layer被唤起时会触发此事件
     * @param {Function} [options.layers.onhide] layer被隐藏时会触发此事件
     *
     * @param {boolean} [options.layers.pullToRefresh] 是否支持下拉刷新
     * @param {Array|String} [options.layers.ptrIcon] 下拉时显示的图标。可以传入Array，下标0、1、2分别表示下拉时显示的图标、提示释放的图标、加载中的图标
     * @param {Array|String} [options.layers.ptrText] 下拉时显示的文字。可以传入Array，下标0、1、2分别表示下拉时显示的文字、提示释放的文字、加载中的文字
     * @param {String} [options.layers.ptrColor] 文字颜色
     * @param {Function} [options.layers.ptrOnsuccess] 成功后的回调
     * @param {Function} [options.layers.ptrOnfail] 失败后的回调
     *
     * @param {string} [options.id] layerGroup实例id
     * @param {string} [options.top=0] layerGroup距离屏幕top的坐标
     * @param {string} [options.left=0] layerGroup距离屏幕left的坐标
     * @param {string} [options.width] layer像素宽度，默认全屏
     * @param {string} [options.height] layer像素高度，默认全屏
     *
     * @param {Function} [options.beforerender] webview容器render开始前的回调
     * @param {Function} [options.onrender] webview容器render成功的回调
     * @param {Function} [options.renderfail] webview容器render失败的回调
     * @return this
     */
    var LayerGroup = function(options) {
        /*if(!(this instanceof LayerGroup)){
            return new LayerGroup(options);
        }*/
        Control.call(this, options);
        this._init(options);
    };

    //继承于control
    lib.inherits(LayerGroup, Control);

    LayerGroup.prototype.constructor = LayerGroup;

    /**
     * 组件的类型
     *
     * @cfg {String} type
     */

    LayerGroup.prototype.type = 'layerGroup';

    LayerGroup.prototype.top = 0;
    LayerGroup.prototype.bottom = 0;
    LayerGroup.prototype.left = 0;
    LayerGroup.prototype.right = 0;

    /**
     * 当前的active顺序
     *
     * @cfg {number} index
     */
    LayerGroup.prototype.index = 0;//TODO 优化：与 blend.activeLayer 与 本函数内部的 this.activeId  重复

    /**
     * @private
     * 对象初始化, 私有方法;
     * @param {Object} options 创建group的初始化参数,
     * @return this
     */
    LayerGroup.prototype._init = function(options) {
        var me = this;
        var layers = {};
        var activeId = null;
        //结构化layers为object
        if (!me.layers || !me.layers.length) {
            return;
        }

        for (var i = 0, len = me.layers.length; i < len; i++) {
            if (!me.layers[i].id) {
                me.layers[i].id = lib.getUniqueID();
            }
            if (me.layers[i].active) {
                activeId = me.layers[i].id;
            }

            me.layers[i].index = i;//

            layers[me.layers[i].id] = me.layers[i];
        }

        me._layers = layers;

        me.__layers = {};//

        me.activeId = activeId || me.layers[0].id;


        /* alert(me.get('activeId')); */



        // me.render();

        me.render();

        me.once("onrender",function(){
            //监听事件
            me._initEvent();

            options.active && me.in();
        });
        me.once("renderfail",function(){
            //提示用户加载失败
            console.error("render fail");
        });

        //todo;
        return this;
    };

    /**
     * @private
     * 事件初始化
     * @return this
     */
    var eventsFunction = {};
    LayerGroup.prototype._initEvent = function() {
        
        this.initSwipe();

        return null;

    };

    /**
     * 创建渲染页面
     * @return this
     */
    LayerGroup.prototype.paint = function() {
        var me = this;
        
        //使用layer类处理 layers

        //pages...
        var tmp, tmp2;
        $(this.main).addClass('layerGroup page page-on-center').appendTo('.pages');
        //处理定位
        
        $(this.main).css({top:me.top, left: me.left, right: me.right, bottom: me.bottom});
        $(this.main).css({"height":'calc(100% - '+(me.top + me.bottom) +'px)',"width":'calc(100% - '+(me.left + me.right) +'px)'});
        //top的处理，由于渲染有bug，top的

        // var me.__layers = [];
        var showfunction = function(event) {
            var layerid = event.detail;
            // me.fire("groupSelected",layerid);
            //同时，需要判断当前的active 

            // me.activeId = layerid;

            // console.log("group me.activeId active id"+me.activeId);


            // console.log(layerid);
            me._layers[layerid].beforeshow2 && me._layers[layerid].beforeshow2(event);

        };
        for (var id in this._layers) {

            // me._layers[id].top = me.top;
            // me._layers[id].left = me.left;
            // me._layers[id].right = me.right;
            // me._layers[id].bottom = me.bottom;

            this._layers[id].myGroup = this;


            //after render should fire
            // tmp = me._layers[id].onrender;
            // me._layers[id].onrender = function(event){
            //     // console.log("after render" + data);
            //     // me.fire()
            //     //fill with data
            //     var layerid = event.detail;
            //     // console.log(me.main);
            //     // me.__layers[id].main;

            //     $("#"+me.__layers[layerid].main.id,me.main).html(me.__layers[layerid].main.innerHTML);

            //     tmp && tmp(event);
            // };
            me._layers[id].beforeshow2 = me._layers[id].beforeshow;
            me._layers[id].beforeshow = showfunction;

            if (me.onshow) {

                me._layers[id].onshow = me.onshow;
            }
            if (me.onrender) {

                me._layers[id].onrender = me.onrender;
            }


            console.log('start new layer', id, this._layers[id]);

            this.__layers[this._layers[id].id] = new layer(this._layers[id]);

            //安装好容器
            this.main.appendChild(this.__layers[this._layers[id].id].main);
        }

        // groupApi.create(me.id,me.layers,options,me);


        return this;
    };

    /**
     * 激活相应layer
     *
     * @param {String} layerId layer id
     * @return this
     */
    LayerGroup.prototype.active = function(layerId ) {

        // console.log("in active");

        
        groupApi.showLayer(this.id, layerId, this);
        return this;
    };

    //todo: 这个方法是private的吗，包括下面这个
    //todo: 命名不规范
    LayerGroup.prototype.idtoindex = function(id) {
        return this._layers[id].index || 0;
    };
    LayerGroup.prototype.indextoid = function(index) {//可以循环不？ 我认为是不可以循环的
        if (index >= this.layers.length) {
            // index = index - this.layers.length

            index = this.layers.length - 1;

        }else if (index < 0) {
            // index = index + this.layers.length;

            index = 0;
        }
        // index = index % this.layers.length;
        this.index = index;
        return this.layers[index].id;
    };

    LayerGroup.prototype.getIdByStep = function(step) {//startid
        this.index = this.idtoindex(this.activeId);
        // console.log('next ' + this.index);
        // if (this.index + step > this.layers.length || this.index + step < 0) {
        //     return this.activeId;//定义边界
        // }

        return this.indextoid(this.index + step);
    };

    LayerGroup.prototype.next = function() {

        this.index = this.idtoindex(this.activeId);
        // console.log('next ' + this.index);

        var layerId = this.indextoid(++this.index);

        groupApi.showLayer(this.id, layerId, this);
        return this;
    };

    LayerGroup.prototype.prev = function() {
        this.index = this.idtoindex(this.activeId);

        var layerId = this.indextoid(--this.index);
        groupApi.showLayer(this.id, layerId, this);
        return this;
    };

    /**
     * 删除layer
     * @param {string} layerId group中layer id
     * @return this
     */
    LayerGroup.prototype.remove = function(layerId ) {
        groupApi.removeLayer(this.id, layerId);
        delete this._layers[layerId];
        return this;
    };

    /**
     * 增加layer
     * @param {Object} layerOptions layer Options
     * @param {Number} [index=last] 插入到第index个下标之后
     * @return {Layer}
     */
    LayerGroup.prototype.add = function(layerOptions, index ) {

        if (!layerOptions.id){
            layerOptions.id = lib.getUniqueID();
        }

        groupApi.addLayer(this.id, layerOptions, index);

        this._layers[layerOptions.id] = layerOptions;

        return this;
    };

    /**
     * 更新layer url
     * @param {Object} layer Options
     * @param {Number} [index=last] 插入到第index个下标之后
     * @return {Layer}
     */
    LayerGroup.prototype.update = function(layerId, layerOptions) {

        groupApi.updateLayer(this.id, layerId, layerOptions);

        lib.extend(this._layers[layerOptions.id], layerOptions);
        return this;
    };

    /**
     * 激活页面组
     * @return this 当前实例
     */
    LayerGroup.prototype.in = function() {
        
        this.__layers[this.activeId].in();
    };

    /**
     * 转出
     * @return this 当前实例
     */
    LayerGroup.prototype.out = function() {
        var me = this;

        if ( !this.isActive() ) {
            console.log('layer group is already inactivity ');
            return ;
        }

        var parentlayer = blend.layerStack.length>1?blend.layerStack[blend.layerStack.length-2]:$(".page-on-left:first");//FIXME should be better to select only one!

        if (lowerAnimate){
            parentlayer.removeClass('page-on-left').addClass('page-on-center');
            $(me.main).removeClass('page-on-center').addClass('page-on-right');
        }else{
            parentlayer.removeClass('page-on-left').addClass('page-from-left-to-center');
            $(me.main).removeClass('page-on-center').addClass('page-from-center-to-right');
        }
        

        blend.layerStack.pop();

        var afteranimate = function(){
            // me.dispose();
            me.fire('onhide');
            //TODO add layer onhide events
      
            blend.activeLayer = parentlayer;

        };
        //出场动画结束
        if (lowerAnimate){ 
            afteranimate();
        }else{
            this.animationEnd(function() {
                afteranimate();
                parentlayer.removeClass('page-from-left-to-center').addClass('page-on-center');
                $(me.main).removeClass('page-from-center-to-right').addClass('page-on-right');
            });
        }

        return this;
    };

    /**
     * 销毁此layerGroup
     * @return this
     */
    LayerGroup.prototype.destroy = function(options ) {

        // this.off('groupSelected', eventsFunction.selectedFn);
        // this.off('groupScrolled', eventsFunction.scrollFn);

        Control.prototype.destroy.apply(this, arguments);

    };

    LayerGroup.prototype.initSwipe = function() {
        for (var index in this._layers) {

            layerApi.startSwipe(this.__layers[index], $(this.main));
            // break;
        }

    };

    //添加函数判断是否active

    LayerGroup.prototype.isActive = function() {
        return $(this.main).hasClass('page-on-center');
    };




    return LayerGroup;
});
