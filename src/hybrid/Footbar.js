/**
 * Layer类，内含一个web容器，可以放置在手机屏幕的任何位置，动画可自定义
 * @class Layer
 * @extends Control
 * @static
 * @inheritable
 */
define(function(require) {

    var blend = require('./blend');
    var lib = require('../common/lib');
    var runtime = require('./runtime');
    var Control = require('./Control');
    //是否是runtime运行环境
    var isRuntimeEnv = true;//main.inRuntime();//runtime.isRuntimeEnv&&runtime.isRuntimeEnv();
    var footbarApi = runtime.component.footbar;


    /**
     * @constructor
     *
     * footbar 初始化参数;
     * @param {Object} options 有创建独立Footbar所需要的条件
     *
     * @param {String} [options.id] Footbar实例id

     * @param {Obeject} [options.menus] 菜单json数据 {}

     * @return this
     */
    var Footbar = function(options) {
        Control.call(this, options);
        this._init(options);
        return this;
    };

    //继承control类;
    lib.inherits(Footbar, Control);

    Footbar.prototype.constructor = Footbar;

    /**
     * @private
     * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
     * @param {Object} options 创建layer的初始化参数
     */
    Footbar.prototype._init = function(options) {

        this._initEvent();

        this.render();

        return this;
    };

    //默认属性
    Footbar.prototype.type = 'footbar';

    /**
     * @private
     * 事件初始化
     * @return this
     */
    Footbar.prototype._initEvent = function() {
        var me = this;
        
        footbarApi.on('toolbarMenuSelected', function(event) {
            me.selected && me.selected.apply(me, arguments);
            me.fire('selected', arguments, me);
        },me.id, me);


        //销毁之后撤销绑定
        me.on('afterdistory', function() {
            footbarApi.off('toolbarMenuSelected', 'all', me.id, me);
        });

        window.addEventListener('unload', function(e) {
            me.destroy();
        });

        return me;
    };

    /**
     * 创建渲染页面
     * @return this 当前实例
     */
    Footbar.prototype.paint = function() {
        var me = this;
        if (isRuntimeEnv) {
            footbarApi.add(me.id, {
                top: me.top,
                left: me.left,
                width: me.width,
                height: me.height,
                fixed: me.fixed
            });

            footbarApi.setMenu(me.id, {
                menus: me.menus
            });
        }
        return this;
    };

    //show
    Footbar.prototype.show = function() {
        footbarApi.show(this.id);
    };

    //hide
    Footbar.prototype.hide = function() {
        footbarApi.hide(this.id);
    };

 
    /**
     * 销毁
     * @return this
     */
    Footbar.prototype.destroy = function() {
        footbarApi.remove(this.id);
        Control.prototype.destroy.apply(this, arguments);
    };

    return Footbar;
});
