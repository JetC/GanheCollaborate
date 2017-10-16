/**
 * Created by Admin on 2017/9/14.
 */
function ButtonControl(cesiumContainer, options) {
    var that = this;

    //判断Cesium是否加载

    if (typeof Cesium !== "object") {
        throw '需要加载Cesium';
    }

    //判断CesiumContainer是否定义
    if (!Cesium.defined(cesiumContainer)) {
        throw new Cesium.DeveloperError('cesiumContainer未定义.');
    }
    alert("Hi");
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);


}
