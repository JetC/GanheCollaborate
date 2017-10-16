//实时显示经纬度与高度信息
function position(viewer){
	//reserved to be edited By Xiao Ling @2017/8/27----------
	document.writeln("<div id=\"geoPosition\" style=\"z-index:10; position:absolute; bottom:35px; right:0px; visibility:visible;\">");
    document.writeln("        <label style=\"color:#fff; font-size:14px; font-family:SimHei;\">经度：</label><input type=\"text\" id=\"longitude\" style=\"width:130px; border:none; font-family:SimHei; background-color:transparent; color:#fff; font-size:0.8em\" readonly>");
    document.writeln("        <label style=\"color:#fff; font-size:14px; font-family:SimHei;\">纬度：</label><input type=\"text\" id=\"latitude\" style=\"width:130px; border:none; font-family:SimHei; background-color:transparent; color:#fff; font-size:0.8em\" readonly>");
    document.writeln("        <label style=\"color:#fff; font-size:14px; font-family:SimHei;\">视野高度：</label><input type=\"text\" id=\"height\" style=\"width:130px; border:none; font-family:SimHei; background-color:transparent; color:#fff; font-size:0.8em\" readonly>");
    document.writeln("    </div>");
	console.log("2333333333");
	//-------------------------------------------------------
	var scene = viewer.scene;

	var ellipsoid = scene.globe.ellipsoid;
 	var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        var foundPosition = false;
        var scene = viewer.scene;
        var pickedObject = scene.pick(movement.endPosition);
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
		var globe=scene.globe;

		if (Cesium.defined(cartesian)) {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            var HeightString=viewer.camera.positionCartographic.height.toFixed(0);
			function lon(lon){
				this.lon=lon
				return(this.lon+'度');
			}
			function lat(lat){
				this.lat=lat
				return(this.lat+'度');
			}
			function height(height){
				this.height=height;
				return(this.height+'米');
			}
			document.getElementById("longitude").value=lon(longitudeString);
			document.getElementById("latitude").value=lat(latitudeString);
			document.getElementById("height").value=height(HeightString);
			foundPosition = true;
		}else{
			document.getElementById("longitude").value="";
			document.getElementById("latitude").value="";		
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

