if( !navigator.userAgent.match(/BlendUI/i) ){
    document.write('<script src="js/BlendWebUI.js"></script>');
}else{
    document.write('<script src="js/lib/zepto.js"></script>');
    document.write('<script src="js/BlendHybridUI.js"></script>');
}
