#BlendUI参考文档

问题反馈： [clouda-support@baidu.com](mailto:clouda-support@baidu.com)


##概述

BlendUI是一个使用了JavaScript语言混合了native和css3能力，具备页面切换能力的开发框架。

BlendUI包括三种开放接口：

- webview层： **Blend.Layer**
- webview组： **Blend.LayerGroup**
- 小组件： **Blend.component.xxx**


##命名空间

百度轻应用API统一使用的命名空间为：

    Blend

##使用规范

    <script type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>
    clouda.lightInit({
        ak:'',//轻应用id，可为''
        module:["BlendUI"]//根据勾选的模块生成
    });

###html规范

- 页面组的容器 .pages
- 页面的容器 .page
- 页面带滚动栏内部 .page-content
- 页面带导航，需要在.page或者.pages添加 .navbar-through

###js规范

- 所有页面共用同一份js，且放置在入口页中
- 通过监听layer.onshow 事件，确定所属页面的逻辑
- Control具备on，off，fire等事件能力，当onshow,onhide,pulltoRefresh等操作时启用



##接口列表
TODO




##事件说明
TODO

