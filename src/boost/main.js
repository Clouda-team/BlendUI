require(["src/boost/layer"], function (layer) {
    document.addEventListener("blendready",
        //Blend.ui.ready(
        function () {
            layer.init();
        });
}, null, true);
