/**
* @file dialog.js
* @path hybrid/api/dialog.js
* @desc native dialog相关api接口;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var util = require('./util');
        var layer = require('./layer');
        var event = require('./event');

        var apiFn = util.apiFn;

        var dialog = {
            alert: function(options, callback) {
                var title = options.title || '';
                var message = options.msg || '';
                var button = options.button || '确定';
                var layerId = options.layerId || layer.getCurrentId();
                var alertId = options.alertId || (1 * new Date() + '');
                if (callback) {
                    event.once('showAlert', callback, layerId);
                }
                apiFn('showAlert', [
                    layerId,
                    alertId,
                    message,
                    title,
                    button
                ]);
            },
            prompt: function(options, callback) {
                var title = options.title || '';
                var message = options.msg || '';
                var buttons = JSON.stringify(options.buttons || [
                    '确定',
                    '取消'
                ]);
                var layerId = options.layerId || layer.getCurrentId();
                var promptId = options.promptId || (1 * new Date() + '');
                var defaultText = options.defaultText || '';
                if (callback) {
                    event.once('showPrompt', callback, layerId);
                }
                apiFn('showPrompt', [
                    layerId,
                    promptId,
                    message,
                    title,
                    buttons,
                    defaultText
                ]);
            },
            confirm: function(options, callback) {
                var title = options.title || '';
                var message = options.msg || '';
                var buttons = JSON.stringify(options.buttons || [
                    '确定',
                    '取消'
                ]);
                var layerId = options.layerId || layer.getCurrentId();
                var promptId = options.promptId || (1 * new Date() + '');
                if (callback) {
                    event.once('showConfirm', callback, layerId);
                }
                apiFn('showConfirmDialog', [
                    layerId,
                    promptId,
                    message,
                    title,
                    buttons
                ]);
            },
            toast: function(options) {
                var message = options.msg || '';
                var layerId = options.layerId || layer.getCurrentId();
                var promptId = options.promptId || (1 * new Date() + '');
                var duration = options.duration || 0;
                apiFn('showToast', [
                    layerId,
                    promptId,
                    message,
                    duration
                ]);
            }

        };

        return dialog;
    }
);
