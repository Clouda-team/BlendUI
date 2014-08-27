if( !navigator.userAgent.match(/BlendUI/i) ){
    document.write('<script src="../dist/BlendWebUI.js"></script>');
}else{
    document.write('<script src="../third_party/zepto.js"></script>');
    document.write('<script src="../dist/BlendHybridUI-0.0.1.js"></script>');
}
