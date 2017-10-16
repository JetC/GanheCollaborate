define('roamManager',[],function(){
	'use strict';
	var roamHeight;
	var flyState={
		start:0,
		pause:1
	}
	var count=0;

	var roamManager=function(options){
		// this._startLon=options.startLon;
		// this._startLat=options.startLat;
		// this._startHeight=options.startHeight;
		// this._endLon=options.endLon;
		// this._endLat=options.endLat;
		// this._endHeight=options.endHeight;
		this.currentPos=undefined;
		this.state=flyState.start;
		this.currentPos_carto=undefined;

		this._roamHeight=options.roamHeight
		this._velocity=options.velocity;
		this._pathheight=options.pathHeight;
		this._mLon=options.mLon;
		this._mLat=options.mLat;
		this._mHeight=options.mHeight;
		roamHeight=parseInt(this._roamHeight)
		// this._startPos=Cesium.Cartesian3.fromDegrees(this._startLon,this._startLat,this._startHeight+roamHeight);
		// this._endPos=Cesium.Cartesian3.fromDegrees(this._endLon,this._endLat,this._endHeight+roamHeight);
		count=0;
		this._allPos=[];
		this._path=[];
		for(var i=0;i<this._mLon.length;i++){
			this._allPos[i]=Cesium.Cartesian3.fromDegrees(parseFloat(this._mLon[i]),parseFloat(this._mLat[i]),this._mHeight[i]+roamHeight)
		}
		// var distance=Cesium.Cartesian3.distance(this._startPos,this._allPos[1]);
		// this._time=distance/this._velocity;
		this.addPath();
	};

	roamManager.prototype.addPath=function(){

		var i=count;
		var newPoint=new Cesium.Cartesian3(this._allPos[i+1].x-this._allPos[i].x,this._allPos[i+1].y-this._allPos[i].y,this._allPos[i+1].z-this._allPos[i].z);
		var a= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2)+Math.pow(newPoint.z,2);
		var b= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2);
		var angle=Math.asin(Math.sqrt(b/a));
		if(this._mLon[i]>0&&this._mLat[i]>0){
			if(this._mLat[i+1]>this._mLat[i]&&this._mLon[i+1]<this._mLon[i]){
				var trueAngle=2*Cesium.Math.PI-angle;
			}
			else if(this._mLat[i+1]<this._mLat[i]&&this._mLon[i+1]>this._mLon[i]){
				var trueAngle=Cesium.Math.PI-angle;
			}
			else if(this._mLat[i+1]<this._mLat[i]&&this._mLon[i+1]<this._mLon[i]){
				var trueAngle=Cesium.Math.PI+angle;
			}
			else{
				var trueAngle=angle;
			}
		}
		else if(this._mLon[i]<0&&this._mLat[i]>0){
			if(this._mLat[i+1]>this._mLat[i]&&this._mLon[i+1]>this._mLon[i]){
				var trueAngle=2*Cesium.Math.PI-angle;
			}
			else if(this._mLat[i+1]<this._mLat[i]&&this._mLon[i+1]<this._mLon[i]){
				var trueAngle=Cesium.Math.PI-angle;
			}
			else if(this._mLat[i+1]<this._mLat[i]&&this._mLon[i+1]>this._mLon[i]){
				var trueAngle=Cesium.Math.PI+angle;
			}
			else{
				var trueAngle=angle;
			}
		}
		viewer.camera.setView({
			destination :this._allPos[i],
			orientation: {
				heading :  trueAngle, 
				pitch : Cesium.Math.toRadians(0),    
				roll : 0.0                             
			}
		})
		fly(i,this._allPos,this._mLon,this._mLat,roamHeight,this._velocity);
		function fly(i,allPos,mLon,mLat,roamHeight,velocity){
			if(i<allPos.length-1){
				var newPoint=new Cesium.Cartesian3(allPos[i+1].x-allPos[i].x,allPos[i+1].y-allPos[i].y,allPos[i+1].z-allPos[i].z);
				var a= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2)+Math.pow(newPoint.z,2);
				var b= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2);
				var angle=Math.asin(Math.sqrt(b/a));
				if(mLon[i]>0&&mLat[i]>0){
					if(mLat[i+1]>mLat[i]&&mLon[i+1]<mLon[i]){
						var trueAngle=2*Cesium.Math.PI-angle;
					}
					else if(mLat[i+1]<mLat[i]&&mLon[i+1]>mLon[i]){
						var trueAngle=Cesium.Math.PI-angle;
					}
					else if(mLat[i+1]<mLat[i]&&mLon[i+1]<mLon[i]){
						var trueAngle=Cesium.Math.PI+angle;
					}
					else{
						var trueAngle=angle;
					}
				}
				else if(mLon[i]<0&&mLat[i]>0){
					if(mLat[i+1]>mLat[i]&&mLon[i+1]>mLon[i]){
						var trueAngle=2*Cesium.Math.PI-angle;
					}
					else if(mLat[i+1]<mLat[i]&&mLon[i+1]<mLon[i]){
						var trueAngle=Cesium.Math.PI-angle;
					}
					else if(mLat[i+1]<mLat[i]&&mLon[i+1]>mLon[i]){
						var trueAngle=Cesium.Math.PI+angle;
					}
					else{
						var trueAngle=angle;
					}
				}
				var nextDistance=Cesium.Cartesian3.distance(allPos[i],allPos[i+1]);
				var nextTime=nextDistance/velocity;

				var carto=viewer.scene.globe.ellipsoid.cartesianToCartographic(allPos[i+1]);
				viewer.camera.flyTo({
					destination : allPos[i+1],
					orientation: {
						heading : trueAngle, 
						pitch : Cesium.Math.toRadians(0),    
						roll : 0.0                             
					},
					maximumHeight:1.01*carto.height,
					duration:nextTime,
					complete:function(){
						fly(i+1,allPos,mLon,mLat,roamHeight,velocity);
						count=count+1;
					},
					easingFunction:Cesium.EasingFunction.LINEAR_NONE 
				})			
			}else{
				alert('漫游完成');
				return;
			}
			//if(this.state==flyState.pause){
				
			//}
		}	
	}
	roamManager.prototype.pause=function(){
		viewer.camera.cancelFlight();
		this.currentPos=viewer.camera.position;
		this.currentPos_carto=viewer.camera.positionCartographic;
		// this.state=flyState.pause;
	}
	roamManager.prototype.start=function(){
		// this.state=flyState.start;
		var mPoint_new=[];
		var mLon_new=[];
		var mLat_new=[];
		mPoint_new=this._allPos.slice(count+1);
		mPoint_new.unshift(this.currentPos);
		mLon_new=this._mLon.slice(count+1);
		mLon_new.unshift(Cesium.Math.toDegrees(this.currentPos_carto.longitude));
		mLat_new=this._mLat.slice(count+1);
		mLat_new.unshift(Cesium.Math.toDegrees(this.currentPos_carto.latitude));

		var i=0;
		fly(i,mPoint_new,mLon_new,mLat_new,roamHeight,this._velocity);
		function fly(i,allPos,mLon,mLat,roamHeight,velocity){
			if(i<allPos.length-1){
				var newPoint=new Cesium.Cartesian3(allPos[i+1].x-allPos[i].x,allPos[i+1].y-allPos[i].y,allPos[i+1].z-allPos[i].z);
				var a= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2)+Math.pow(newPoint.z,2);
				var b= Math.pow(newPoint.x,2)+Math.pow(newPoint.y,2);
				var angle=Math.asin(Math.sqrt(b/a));
				if(parseFloat(mLon[i])>0&&parseFloat(mLat[i])>0){
					if(parseFloat(mLat[i+1])>parseFloat(mLat[i])&&parseFloat(mLon[i+1])<parseFloat(mLon[i])){
						var trueAngle=2*Cesium.Math.PI-angle;
					}
					else if(parseFloat(mLat[i+1])<parseFloat(mLat[i])&&parseFloat(mLon[i+1])>parseFloat(mLon[i])){
						var trueAngle=Cesium.Math.PI-angle;
					}
					else if(parseFloat(mLat[i+1])<parseFloat(mLat[i])&&parseFloat(mLon[i+1])<parseFloat(mLon[i])){
						var trueAngle=Cesium.Math.PI+angle;
					}
					else{
						var trueAngle=angle;
					}
				}
				else if(parseFloat(mLon[i])<0&&parseFloat(mLat[i]>0)){
					if(parseFloat(mLat[i+1])>parseFloat(mLat[i])&&parseFloat(mLon[i+1])>parseFloat(mLon[i])){
						var trueAngle=2*Cesium.Math.PI-angle;
					}
					else if(parseFloat(mLat[i+1])<parseFloat(mLat[i])&&parseFloat(mLon[i+1])<parseFloat(mLon[i])){
						var trueAngle=Cesium.Math.PI-angle;
					}
					else if(parseFloat(mLat[i+1])<parseFloat(mLat[i])&&parseFloat(mLon[i+1])>parseFloat(mLon[i])){
						var trueAngle=Cesium.Math.PI+angle;
					}
					else{
						var trueAngle=angle;
					}
				}
				var nextDistance=Cesium.Cartesian3.distance(allPos[i],allPos[i+1]);
				var nextTime=nextDistance/velocity;

				var carto=viewer.scene.globe.ellipsoid.cartesianToCartographic(allPos[i+1]);
				viewer.camera.flyTo({
					destination : allPos[i+1],
					orientation: {
						heading : trueAngle, 
						pitch : Cesium.Math.toRadians(0),    
						roll : 0.0                             
					},
					maximumHeight:1.01*carto.height,
					duration:nextTime,
					complete:function(){
						fly(i+1,allPos,mLon,mLat,roamHeight,velocity);
						count=count+1;	
					},
					easingFunction:Cesium.EasingFunction.LINEAR_NONE 
				})
				
			}else{
				alert('漫游完成');
				return;
			}
		}
	}
	return roamManager;
})