/**
 * Created by zyh94 on 2016/7/21.
 */
function draw(bufferPrimitives,visible){
   require(['js/turf.min'],function(turf){
        //var turf=new turf();
       var scene = viewer.scene;
        var drawHelper = new DrawHelper(viewer.cesiumWidget,bufferPrimitives,turf);
        if(!visible){
            var toolbar = drawHelper.addToolbar(document.getElementById("toolbar1"), {
                buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
            });
        }
        else if(visible){
            var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
                buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
            });
        }

        toolbar.addListener('markerCreated', function(event) {

            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show : true,
                position : event.position,
                pixelOffset : new Cesium.Cartesian2(0, 0),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,
                scale : 1.0,
                image: 'images/glyphicons_242_google_maps.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });
        toolbar.addListener('polylineCreated', function(event) {

            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();

        });
        toolbar.addListener('polygonCreated', function(event) {

            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(polygon);
            polygon.setEditable();


        });
        toolbar.addListener('circleCreated', function(event) {

            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();

        });
        toolbar.addListener('extentCreated', function(event) {
            var extent = event.extent;

            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();

        });
   })


}