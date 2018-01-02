function startUpCesium(Cesium){
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE=new Cesium.Rectangle.fromDegrees(90.0, -25.0, 115.0, 85.0);
	var viewer = new Cesium.Viewer('cesiumContainer',{
		animation:false,
		timeline:false,
		navigationHelpButton:false,
		baseLayerPicker : false,
		geocoder:false,
		sceneModePicker:false,
		fullscreenButton:false,
		homeButton:false,
		selectionIndicator:false,
		//infoBox:false,
		scene3DOnly:true
	});
	var scene=viewer.scene;
	//viewer.scene.debugShowFramesPerSecond = true;
	viewer.bottomContainer.innerHTML="";
	viewer.imageryLayers.removeAll();	
	 var bingMap = new Cesium.BingMapsImageryProvider({
 	  	url:'//dev.virtualearth.net',
 	key:'RrtMfihZkhPO5yZ7oToT~FpWsSrdQKKlR785PhRAunA~AsteAHRBCGbAimkt8u-n8F_FXnohAU39WqwuVyC7ux5Ei9_ojXWbtX-ycCeU1YD2'
 });
 viewer.imageryLayers.addImageryProvider(bingMap);	
	/*var osm = new Cesium.createOpenStreetMapImageryProvider({
  	  url :'https://b.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/'
	});
	viewer.imageryLayers.addImageryProvider(osm);*/
	// if(!bingMap.ready){
	 	//viewer.imageryLayers.removeAll();
	// }
	
	return viewer;
}
