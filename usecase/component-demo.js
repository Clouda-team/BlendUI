$(function(){//ready 后
    window.Blend= {};

    require(['../src/web/blend','../src/web/dialog/alert','../src/web/slider'], function (blend, alert, Slider) {
        Blend.ui = blend;
        var bullets = $("#myslider").find(".slide-position li");

        window.s = new Slider({
            id:"test",
            main : $("#myslider")[0],
            auto: 3000,
            continuous: true,
            tap:function(event){
                console.log(event);
                // s.destroy();
            },
            callback: function(pos) {
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                bullets[pos].className = 'on';
            }
        });
    },null,true);


});