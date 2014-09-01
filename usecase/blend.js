if( 0 && !navigator.userAgent.match(/BlendUI/i) ){
    document.write('<script src="../dist/BlendWebUI.js"></script>');
}else{
    document.write('<script src="./lib/zepto.js"></script>');
    document.write('<script src="../dist/BlendHybridUI-0.0.2.js"></script>');
}
