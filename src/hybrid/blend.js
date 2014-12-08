/**
 * @file blend.js
 * @path hybrid/blend.js
 * @desc blendui 全局命名空间
 * @author clouda-team(https://github.com/clouda-team)
 */
define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');

        /**
         * @class blend
         * @singleton
         */
        var blend = {};
        var controls = {};

        // 有些android手机只执行一次runtimeready
        document.addEventListener('runtimeready', function() {
            blend.readyState = true;
        },false);

        /**
         * 版本信息
         *
         * @property {string} version info
         */
        blend.version = '0.2';

        /**
         * 开放的Api接口类,后期不对外开发
         *
         * @property {object} Api接口
         */
        blend.api = {};

        /**
         * 注册控件到系统中
         * @param {Control} control 控件实例
         */
        blend.register = function(control) {
            if (controls[control.id]) {
                throw (control.type || '') + 'New Object Already Exists';
            }
            else {
                controls[control.id] = control;
            }
        };

        /**
         * 注销控件
         * @param {Control} control 控件实例
         */
        blend.cancel = function(control) {
            delete controls[control.id];
        };

        /**
         * 根据id获取实例
         *
         * @param {string} id 控件id
         * @return {Control} control类
         */
        blend.get = function(id) {
            return controls[id];
        };

        /**
         * runtime ready事件,是对native runtimeready事件的封装
         * @param {Function} callback ready之后触发函数
         */
        blend.ready = function(callback) {
            var outTimeFun;
            var handler = function() {
                outTimeFun && clearTimeout(outTimeFun);
                if (/complete|loaded|interactive/i.test(document.readyState)) {
                    callback(blend);
                }
                else {
                    document.addEventListener('DOMContentLoaded', function() {
                        callback(blend);
                    }, false);
                }
                document.removeEventListener('runtimeready', handler);
            };
            if (blend.readyState || window.nuwa_runtime || window.lc_bridge) {
                handler();
            }
            else {
                outTimeFun = setTimeout(handler, 200000);
                document.addEventListener('runtimeready', handler, false);
            }
        };

        /**
         * runtime layer接口
         * @todo remove
         * @property {Object}
         */
        blend.api.layer = runtime.layer;

        /**
         * runtime layerGroup接口
         * @todo remove
         * @property {Object} layerGroup
         */
        blend.api.layerGroup = runtime.layerGroup;

        /**
         * runtime core接口
         * @todo remove
         * @property {Object} core
         */
        blend.api.core = runtime.core;

        // 把layer的事件触发绑定到blend上快捷使用
        ['on', 'off', 'fire', 'once', 'postMessage'].forEach(function(n, i) {
            blend[n] = function() {
                runtime.layer[n].apply(runtime.layer,arguments);
            };
        });

        // 把coreapi和layer上可直接操作的接口直接暴露给blend;
        lib.extend(blend,runtime.core);
        lib.extend(blend, {
            'layerStopRefresh': runtime.layer.stopPullRefresh,
            'layerBack': runtime.layer.back,
            'layerStopLoading': runtime.layer.stopLoading,
            'getLayerId': runtime.layer.getCurrentId,
            'layerSetPullRefresh': runtime.layer.setPullRefresh
        });

        // 触发函数
        var mainCall = {};

        blend.layerInit = function(id, callback) {
            mainCall[id] = callback;
        };

        // 私有方法 供其他文件调用;
        blend._lanch = function(id, dom) {
            mainCall[id] && mainCall[id].call(blend, dom);
        };

        // unload的时候注销所有组件,可销毁native相应组件释放内存;
        window.addEventListener('unload', function(e) {
            var i;
            for (i in controls) {
                if (controls.hasOwnProperty(i)) {
                    controls[i].destroy && controls[i].destroy();
                }
            }
        });

        return blend;
    }
);
