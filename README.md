BlendUI
==========

关于BlendUI
====

BlendUI是Clouda+中的重要组成部分，他能让webapp的用户界面体验和交互能和Native媲美。操作性能是webapp中体验最薄弱的一环，具体而言，这包括：转场动画不流畅、DOM结构过于复杂导致卡顿，用Javascript实现固定头尾布局性能较差等。

因而，我们用Native技术来扩展Javascript，同时我们选择了最易于理解的方式：让Javascript能像操作DOM那样操作多个webview，以及在webview中嵌入Native组件。

* 多Webview控制能力。让一个Webapp拆到多个webview中运行，并能用Javascript来调度，解决了页面过大导致卡顿的问题，同时，webview的转场动画由Native代码实现，也解决了转场动画不流畅的问题。
* Native组件嵌入能力。能将Native控件嵌入Webview中，这样就能让页面中那些性能较差的部分用Native来实现，以最大化地提高体验和交互。

BlendUI只在最基础的部分使用Native，BlendUI的核心消息机制类似传统的web事件，而所有BlendUI组件都可以采用完完全全的web来编写。总之，我们保持了所有web的风格和灵活性。

文档
====

请前往[Clouda+官网](http://cloudaplus.duapp.com/blendui/introduction/introduction)阅读
