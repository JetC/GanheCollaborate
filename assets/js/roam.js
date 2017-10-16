function roam(){
	console.log("roam could run");
	//漫游
	var ptCount=1;
	var mPoint=[];
	var mlabels;
	var mLon=[];
	var mLat=[];
	var mHeight=[];
	var roam,labels1,labels2,point_start,point_end;
	var startHeight;
	var endHeight;
	var clkCount;
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
	$('#pointRoam').click(function(){
		alert('鼠标左键选择漫游点，右键选择漫游终点')
		clkCount=0;
		document.getElementById('cesiumContainer').style.cursor='pointer'; 
		var scene = viewer.scene;
		var ellipsoid = scene.globe.ellipsoid;
		
		handler.setInputAction(function(movement) {
			var adaptiveCar=viewer.scene.pickPosition(movement.position);
			if(ptCount==1){
				if (scene.pickPositionSupported && Cesium.defined(adaptiveCar)) {
					var adaptiveCarto = Cesium.Cartograph.0ic.fromCartesian(adaptiveCar);
					var longitudeString = Cesium.Math.toDegrees(adaptiveCarto.longitude).toFixed(8);
					var latitudeString = Cesium.Math.toDegrees(adaptiveCarto.latitude).toFixed(8);
					var adaptiveHeight= adaptiveCarto.height;
					var pointHeight1=adaptiveHeight;					
					// point_start = scene.primitives.add(new Cesium.BillboardCollection());
					// point_start.add({
					// 	heightReference : 1,
					// 	position :Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString,pointHeight1+10),
					// 	image : 'bootstrap/images/marker.png',
					// 	scale:0.3
					// });
					point_start={
						position : Cesium.Cartesian3.fromDegrees(parseFloat(longitudeString),parseFloat(latitudeString),parseFloat(pointHeight1)+2),
						billboard : {
							image : 'assets/i/marker.png',
							scale : 0.3,
							verticalOrigin : Cesium.VerticalOrigin.BOTTOM
						}
					}
					viewer.entities.add(point_start);

					document.getElementById('startLon').value=longitudeString;
					document.getElementById('startLat').value=latitudeString;
					startHeight=pointHeight1;
					mLon[ptCount-1]=longitudeString;
					mLat[ptCount-1]=latitudeString;
					mHeight[ptCount-1]=pointHeight1;
				}
				ptCount++;
				//drawRoute();
			}else{
				if (scene.pickPositionSupported && Cesium.defined(adaptiveCar)) {
					var adaptiveCarto = Cesium.Cartographic.fromCartesian(adaptiveCar);	
					lon_m = Cesium.Math.toDegrees(adaptiveCarto.longitude).toFixed(8);
					lat_m = Cesium.Math.toDegrees(adaptiveCarto.latitude).toFixed(8);
					
					var adaptiveHeight= adaptiveCarto.height;
					var pointHeight2=adaptiveHeight;

					// mPoint[ptCount-2] = scene.primitives.add(new Cesium.BillboardCollection());
					// mPoint[ptCount-2].add({
					// 	heightReference : 1,
					// 	position :Cesium.Cartesian3.fromDegrees(lon_m,lat_m,pointHeight2+10),
					// 	image : 'bootstrap/images/marker-stroked.png',
					// 	scale:0.3
					// });

					mPoint[ptCount-2]={
						position : Cesium.Cartesian3.fromDegrees(parseFloat(lon_m),parseFloat(lat_m),parseFloat(pointHeight2)+2),
						billboard : {
							image : 'assets/i/marker-stroked.png',
							scale : 0.3,
							verticalOrigin : Cesium.VerticalOrigin.BOTTOM
						}
					}
					viewer.entities.add(mPoint[ptCount-2]);

					mLon[ptCount-1]=lon_m;
					mLat[ptCount-1]=lat_m;
					mHeight[ptCount-1]=pointHeight2;
				}
				ptCount++;			
			}	
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		
		handler.setInputAction(function(movement) {
			var adaptiveCar=viewer.scene.pickPosition(movement.position);
			if(ptCount>1){
				if (scene.pickPositionSupported && Cesium.defined(adaptiveCar)) {
					document.getElementById('cesiumContainer').style.cursor='auto'; 
					var adaptiveCarto = Cesium.Cartographic.fromCartesian(adaptiveCar);	
					var longitudeString_end = Cesium.Math.toDegrees(adaptiveCarto.longitude).toFixed(8);
					var latitudeString_end = Cesium.Math.toDegrees(adaptiveCarto.latitude).toFixed(8);
					var adaptiveHeight= adaptiveCarto.height;
					var pointHeight3=adaptiveHeight;

					point_end={
						position : Cesium.Cartesian3.fromDegrees(parseFloat(longitudeString_end),parseFloat(latitudeString_end),parseFloat(pointHeight3)+2),
						billboard : {
							image : 'assets/i/marker.png',
							scale : 0.3,
							verticalOrigin : Cesium.VerticalOrigin.BOTTOM
						}
					}
					viewer.entities.add(point_end);

					document.getElementById('endLon').value=longitudeString_end;
					document.getElementById('endLat').value=latitudeString_end;
					endHeight=pointHeight3;
					mLon[ptCount-1]=longitudeString_end;
					mLat[ptCount-1]=latitudeString_end;
					mHeight[ptCount-1]=pointHeight3;
				}
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);	
				handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			}else{
				alert('请点击鼠标左键选择漫游初始点')
			}
						
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	})
	var roamCount1=0;
	var roamCount2=0;
	$('#loadRoam').click(function(){
		var roamTime=document.getElementById('roamTime').value;
		var roamHeight=document.getElementById('roamHeight').value;
		var startLon=document.getElementById('startLon').value;
		var startLat=document.getElementById('startLat').value;
		var endLon=document.getElementById('endLon').value;
		var endLat=document.getElementById('endLat').value;
		if(roamHeight==''||startLon==''||startLat==''||endLon==''||endLat==''){
			alert('请填写完整信息');
		}
		else if(isNaN(roamHeight)||isNaN(startLon)||isNaN(startLat)||isNaN(endLon)||isNaN(endLat)){
			alert('请填写正确信息');
		}
		else{
			if(roamCount1==0&&roamCount2==0){
				roamCount1++;
				roamCount2++;
			}
			// require(['roamManager'],function(roamManager){
			// 	roam=new roamManager({
			// 		roamHeight:roamHeight,
			// 		velocity:roamTime,
			// 		pathHeight:0,
			// 		mLon:mLon,
			// 		mLat:mLat,
			// 		mHeight:mHeight
			// 		// startLon:startLon,
			// 		// startLat:startLat,
			// 		// startHeight:startHeight,
			// 		// endLon:endLon,
			// 		// endLat:endLat,
			// 		// endHeight:endHeight,
			// 	})
			// });
			
			viewer.scene.screenSpaceCameraController.minimumZoomDistance =  20;
			viewer.scene.screenSpaceCameraController.maximumZoomDistance = Number.POSITIVE_INFINITY;
			viewer.camera.zoomIn();
			viewer.camera.zoomOut();		
		}		
	})
	$('#cancelRoam').click(function(){
		viewer.camera.cancelFlight();
		alert('漫游已取消，请重新开始');
	})
	$('#play').click(function(){
		if(roamCount1==1){
			roam.start();
		}
	})
	$('#pause').click(function(){
		if(roamCount2==1){
			roam.pause();
		}
	})
	$('#clearRoam').click(function(){
		clkCount=1;
		document.getElementById('roamTime').value='';
		document.getElementById('roamHeight').value='';
		document.getElementById('startLon').value='';
		document.getElementById('startLat').value='';
		document.getElementById('endLon').value='';
		document.getElementById('endLat').value='';
		viewer.scene.primitives.remove(point_start);
		viewer.scene.primitives.remove(point_end);
		viewer.entities.removeAll();
		for(var i=0;i<ptCount-1;i++){
			viewer.scene.primitives.remove(mPoint[i]);
		}
	
		ptCount=1;
		mPoint=[];
		mlabels=undefined;
		mLon=[];
		mLat=[];
		mHeight=[];
		roam=undefined;
		labels1=undefined;
		labels2=undefined;
		point_start=undefined;
		point_end=undefined;
		handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);	
		handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);	
		roamCount1=0;
		roamCount2=0;
		//roam.removePath();
	})	

	$('#remove').click(function(){
		document.getElementById('startLon').value='';
		document.getElementById('startLat').value='';
		document.getElementById('endLon').value='';
		document.getElementById('endLat').value='';
		viewer.scene.primitives.remove(point_start);
		viewer.scene.primitives.remove(point_end);
		viewer.entities.removeAll();
		for(var i=0;i<ptCount-1;i++){
			viewer.scene.primitives.remove(mPoint[i]);
		}
		ptCount=1;
		mPoint=[];
		mlabels=undefined;
		mLon=[];
		mLat=[];
		mHeight=[];
		roam=undefined;
		labels1=undefined;
		labels2=undefined;
		point_start=undefined;
		point_end=undefined;
		roamCount1=0;
		roamCount2=0;
	})
}

