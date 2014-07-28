define(

    /**
     * @class Preloader
     * @extends Dialog
     * @inheritable
     */

    function(require) {

        var blend = require('../blend');
        var lib = require('../../common/lib');
        var Dialog = require('../Dialog');
        // var Control = require('../Control');


        var Preloader = function(title) {

            Dialog.prototype.setProperties.call(this, {
                title: title
            });

            Dialog.call(this, {
                content: this.content,
                title: this.title
            });
            return this;
        };

        lib.inherits(Preloader, Dialog);

        Preloader.prototype.title = '载入中...';
        Preloader.prototype.content = '<div class="preloader"></div>';


        Preloader.prototype.open = function() {
            if (!$(this.main).children().length) {//由于loader一直需要，所以open会自动加载被关闭的元素
                Dialog.call(this, {
                    content: this.content,
                    title: this.title
                });
            }else {
                Dialog.prototype.open.call(this);
            }
        };

        return Preloader;
    }
);
