function settingFunc(){
	var fcModel,blModel,djyDEM,djyTree,hlModel,djyBuilding;
	var binglayer,tdtlayer,osmlayer,whlayer,djylayer,globelayer,fhlayer;
	var testDSMTree1,testDSMTree2
	var fhDSMTree=new Array();
	var fhDSMTree2=new Array();
	var sdDSMTree=new Array();
	var swjtuDSMTree;
	var suiningDSM=[];
	var TecDSM=[];
	var changdaoDSM=[];
	var csDSMTree=new Array();
	var baoliDSMTree=[];
	var nineDSM1,nineDSM2,whDSM;
	var chinaJson1,chinaJson2,chinaRailway,chinaArea;
	var roam,labels1,labels2,point_start,point_end;
	var sufferModels,changdaoModel;

	var count1=0,count2=0,count3=0,count4=0,count5=0,count6=0,count7=0,count8=0,count9=0,count10=0,count11=0,count12=0,count13=0,count14=0,count15=0,count16=0,count17=0,count18=0,count19=0,count20=0;
	var count21=0;
	
	$('#flood').click(function(){
		var floodCount1=0;
		var floodCount2=0;
		var terrainProvider = new Cesium.CesiumTerrainProvider({
			url : './data/DEM/floodDEM_noZip'
		});
		viewer.terrainProvider = terrainProvider;
		viewer.scene.globe.depthTestAgainstTerrain=true;
		require(['FloodManager'],(FloodManager)=>{
			if(floodCount1==0&&floodCount2==0){
				floodCount1++;
				floodCount2++;
			}
			
			var floodManager=new FloodManager({
				floodDataURL :'data/models/floodTIN',
				centerPos:Cesium.Cartesian3.fromDegrees(104.276107,31.649804, 0)
			});
			floodManager.initial();
			viewer.scene.primitives.add(floodManager);
			$("#pause").click(function(){				
				if(floodCount1==1){
					floodManager.pause();
				}			
			})
			$("#play").click(function(){				
				if(floodCount2==1){
					floodManager.resume();
				}
			})	
			$('#remove').click(function(){
				floodCount1=0;
				floodCount2=0;
			})		
		});
		viewer.scene.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(104.303036,31.632675, 6000)})
	})

	$('#globeDEM').click(function(){
		var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
			url : '//cesiumjs.org/smallterrain',
			requestWaterMask : true,
			requestVertexNormals : true
		});
		viewer.terrainProvider = cesiumTerrainProviderMeshes;
		$('#remove').click(function(){
			viewer.terrainProvider=new Cesium.EllipsoidTerrainProvider();
			treeObj.checkAllNodes(false);
		})
	})
	$('#djyDEM').click(function(){
		var terrainProvider = new Cesium.CesiumTerrainProvider({
			url : './data/DEM/DJYDEM'
		});
		viewer.terrainProvider = terrainProvider;
		viewer.scene.camera.flyTo({
					destination:Cesium.Cartesian3.fromDegrees(103.49615573204005, 30.91337856274802,3000)//(94,30,10000)
				})
		$('#remove').click(function(){
			viewer.terrainProvider=new Cesium.EllipsoidTerrainProvider();
			treeObj.checkAllNodes(false);
		})	
	})
	

	$('#bingDOM').click(function(){
		var bingMap = new Cesium.BingMapsImageryProvider({
			url:'//dev.virtualearth.net',
			key:'RrtMfihZkhPO5yZ7oToT~FpWsSrdQKKlR785PhRAunA~AsteAHRBCGbAimkt8u-n8F_FXnohAU39WqwuVyC7ux5Ei9_ojXWbtX-ycCeU1YD2'
		});
		binglayer=viewer.imageryLayers.addImageryProvider(bingMap);
	})
	$('#tdtDOM').click(function(){
		var tdtProvider=new Cesium.WebMapTileServiceImageryProvider({
			url:'http://t0.tianditu.com/DataServer?T=img_w&y={TileRow}&x={TileCol}&l={TileMatrix}',
			layer:'tdtlayer',
			style:'default',
			format:'image/jpeg',
			tileMatrixSetID:'tdtLayer',
			maximumLevel:15
		})
		tdtlayer=new Cesium.ImageryLayer(tdtProvider);
		viewer.imageryLayers.add(tdtlayer);
	})
	$('#osmDOM').click(function(){
		var osm = new Cesium.createOpenStreetMapImageryProvider({
  	 				url :'https://a.tile.openstreetmap.org/'//'https://b.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/'
  	 			});
		osmlayer=viewer.imageryLayers.addImageryProvider(osm);
	})
	$('#globeDOM').click(function(){
		var tms=new Cesium.createTileMapServiceImageryProvider({
			url:'./data/DOM/NaturalEarthII/'
		})
		globelayer=viewer.imageryLayers.addImageryProvider(tms);
	})
	
	$('#TecDSM').dblclick(function(){
		if($('#TecDSM').css('border-width')=='2px'){	
			if(count20==0){	
				require(['DSMTree_new'],function(DSMTree_new){
					Cesium.loadXML('data/DSM/TecCity/gltf/gltf.xml').then(function(obj){
						var fileName=[];
						fileName=obj.getElementsByTagName("name");
						for(var i=0;i<fileName.length;i++){
							var name=obj.documentElement.childNodes[i].textContent;
							TecDSM[i]=new DSMTree_new({
								url:'data/DSM/TecCity/gltf/'+name,
								name:name,
								modelMatrix:Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(109.59922, 27.95305, 0)),						
								debugShowBoundingVolume:false,
								level:0,
								pixelScale:300,
								visibleRange:1200	
							});
							viewer.scene.primitives.add(TecDSM[i]); 	
						}		
					})
				})
				viewer.scene.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
				})

				var childNodes = [{name:"倾斜摄影测量(科技新城)", checked:true, "nocheck":false}];
				var parentNodes=treeObj.getNodeByParam("id", 4, null); 
				var nodes=treeObj.getNodes();

				treeObj.addNodes(parentNodes,childNodes);
				count20++;
			}else{
				viewer.scene.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
				})
			}

			$('#remove').click(function(){
				viewer.scene.primitives.removeAll();
				treeObj.checkAllNodes(false);
			})
		}
	})
	$('#suiningDSM1').dblclick(function(){
			if($('#suiningDSM1').css('border-width')=='2px'){	
				if(count6==0){	
					require(['DSMTree_new'],function(DSMTree_new){
						Cesium.loadXML('data/DSM/suining1/Data/suining1.xml').then(function(obj){
							var fileName=[];
							fileName=obj.getElementsByTagName("name");
							for(var i=0;i<fileName.length;i++){
								var name=obj.documentElement.childNodes[i].textContent;
								suiningDSM[i]=new DSMTree_new({
									url:'data/DSM/suining1/Data/'+name,
									name:name,
									modelMatrix:Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(109.59922, 27.95305, -50)),						
									debugShowBoundingVolume:false,
									level:0,
									pixelScale:300,
									visibleRange:1200	
								});
								viewer.scene.primitives.add(suiningDSM[i]); 	
							}		
						})
					})
					viewer.scene.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
					})

					var childNodes = [{name:"倾斜摄影测量(遂宁)", checked:true, "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 4, null); 
					var nodes=treeObj.getNodes();

					treeObj.addNodes(parentNodes,childNodes);
					count6++;
				}else{
					viewer.scene.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
					})
				}
				
				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					treeObj.checkAllNodes(false);
				})
			}
	})
	$('#changdaoDSM').dblclick(function(){
		//$('#loadDSM').click(function(){
			if($('#changdaoDSM').css('border-width')=='2px'){	
				if(count7==0){	
					require(['DSMTree_new'],function(DSMTree_new){
						Cesium.loadXML('data/DSM/HuZhou/gltf/changdao.xml').then(function(obj){
							var fileName=[];
							fileName=obj.getElementsByTagName("name");
							for(var i=0;i<fileName.length;i++){
								var name=obj.documentElement.childNodes[i].textContent;
								changdaoDSM[i]=new DSMTree_new({
									url:'data/DSM/HuZhou/gltf/'+name,
									name:name,
									modelMatrix:Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(120.0868,30.8943, 0)),						
									debugShowBoundingVolume:false,
									level:0,
									pixelScale:200,
									visibleRange:1000	
								});
								viewer.scene.primitives.add(changdaoDSM[i]); 	
							}		
						})
					})
					viewer.scene.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(120.0868,30.8943,1000.0)
					})

					var childNodes = [{name:"倾斜摄影测量(湖州)", checked:true, "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 4, null); 
					var nodes=treeObj.getNodes();

					treeObj.addNodes(parentNodes,childNodes);
					count7++;
				}else{
					viewer.scene.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
					})
				}
				
				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					treeObj.checkAllNodes(false);
				})
			}
		//})
	})
	$('#changdaoModel').dblclick(function(){
		//$('#loadModel').click(function(){
			if($('#changdaoModel').css('border-width')=='2px'){
				if(count13==0){
					highLight();
					
					var childNodes = [{"name":"湖州建筑模型", "checked":true, "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 3, null); 
					var nodes=treeObj.getNodes();
					treeObj.addNodes(parentNodes,childNodes);
					count13++;
					
					changdaoModel=new Cesium.Cesium3DTileset({
						url : './data/3DTiles/changdaomoxing/tileset.json',
						debugShowStatistics : true,
						maximumNumberOfLoadedTiles : 0,
						debugShowPickStatistics:true,
						debugShowViewerRequestVolume:true,
						dynamicScreenSpaceError:true,
					})
					tileset = scene.primitives.add(changdaoModel);
					viewer.scene.camera.flyTo({
							destination:Cesium.Cartesian3.fromDegrees(120.0868,30.8943,1000)
						})
					return tileset.readyPromise.then(function(tileset) {
						
						var properties = tileset.properties;
						if (Cesium.defined(properties) && Cesium.defined(properties.Height)) {
							tileset.style = new Cesium.Cesium3DTileStyle({
								"color" : {
									"conditions" : [
									["${Height} >= 83", "color('purple', 0.5)"],
									["${Height} >= 80", "color('red')"],
									["${Height} >= 70", "color('orange')"],
									["${Height} >= 12", "color('yellow')"],
									["${Height} >= 7", "color('lime')"],
									["${Height} >= 1", "color('cyan')"],
									["true", "color('blue')"]
									]
								},
								"meta" : {
									"description" : "'Building id ${id} has height ${Height}.'"
								}
							});
							addStyleUI();
						}

						tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberProcessing) {
							if ((numberOfPendingRequests === 0) && (numberProcessing === 0)) {
								return;
							}
						});	
						
					});
					
				}
				else{
					viewer.scene.camera.flyTo({
						destination:Cesium.Cartesian3.fromDegrees(120.0868,30.8943,1000)
					})
				}	
				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					treeObj.checkAllNodes(false);
				})
			}
			
		//})
	})  

	$('#lkModel').dblclick(function(){
		//$('#loadModel').click(function(){
			if($('#lkModel').css('border-width')=='2px'){
				if(count12==0){
					linkou();
					var childNodes = [{"name":"林口建筑模型", "checked":true, "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 3, null); 
					var nodes=treeObj.getNodes();
					treeObj.addNodes(parentNodes,childNodes);
					viewer.camera.flyTo({
						destination : Cesium.Cartesian3.fromDegrees(119.972961,	30.523991, 200.0000)
					});	

					count12++;
				}else{
					viewer.camera.flyTo({
						destination : Cesium.Cartesian3.fromDegrees(119.972961,	30.523991, 200.0000)
					});	
				}	

				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					treeObj.checkAllNodes(false);
				})

			}
		//})
	})  

	$('#BerlinModel').dblclick(function(){
		//$('#loadModel').click(function(){
			if($('#BerlinModel').css('border-width')=='2px'){
				if(count2==0){
					viewer.camera.moveEnd.addEventListener(()=>{
						require(['osmBuilding'],(osmBuilding)=>{
							blModel=new osmBuilding({
								viewer:viewer
							})	
						})
					})
					viewer.camera.flyTo({
						destination : Cesium.Cartesian3.fromDegrees(13.41088, 52.51191, 670.0),
						orientation : {
							direction : new Cesium.Cartesian3(-0.9418253569257928, -0.3358369835739077, 0.013361044703871578),
							up : new Cesium.Cartesian3(0.040236452860014954, -0.073194304069017, 0.996505705809315)
						}
					})
					var childNodes = [{"name":"柏林建筑模型", "checked":true, "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 3, null); 
					var nodes=treeObj.getNodes();
				//treeObj.removeChildNodes(parentNodes);
					treeObj.addNodes(parentNodes,childNodes);
					count2++;
				}else{
					viewer.camera.flyTo({
						destination : Cesium.Cartesian3.fromDegrees(13.41088, 52.51191, 670.0),
						orientation : {
							direction : new Cesium.Cartesian3(-0.9418253569257928, -0.3358369835739077, 0.013361044703871578),
							up : new Cesium.Cartesian3(0.040236452860014954, -0.073194304069017, 0.996505705809315)
						}
					})
				}
				
				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					//treeObj.removeChildNodes(parentNodes);
					treeObj.checkAllNodes(false);
				})
			}	
		//})
	})
	
	$('#djyModel').dblclick(function(){
		//$('#loadModel').click(function(){
			if($('#djyModel').css('border-width')=='2px'){
				if(count3==0){
					djyDEM=Cesium.Model.fromGltf({
						url:'data/models/duJiangYan/dem.gltf',
						modelMatrix:Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(103.6090, 31.0058,-16)),
						scale:1,
						incrementallyLoadTextures:false
					})
					scene.primitives.add(djyDEM)
					require(['djyModels'],function(djyModels){
						djyBuilding=new djyModels({
							url:'data/models/duJiangYan',
							xmlUrl:'data/models/djyPos.xml',
							scale:1
						})
					})
					scene.camera.flyTo({
						destination:Cesium.Cartesian3.fromDegrees(103.60622, 31.00702,1000)
					})
					var childNodes = [{name:"都江堰建筑模型",checked:true,  "nocheck":false}];
					var parentNodes=treeObj.getNodeByParam("id", 3, null); 
					var nodes=treeObj.getNodes();
					treeObj.addNodes(parentNodes,childNodes);
					count3++;
				}else{
					scene.camera.flyTo({
						destination:Cesium.Cartesian3.fromDegrees(103.60622, 31.00702,1000)
					})
				}
				
				$('#remove').click(function(){
					viewer.scene.primitives.removeAll();
					treeObj.checkAllNodes(false);
				})
			}			
		//})
	})

	//按钮事件
	
	$('#loadFly').click(function(){
		var lon=document.getElementById('lonFly').value
		var lat=document.getElementById('latFly').value
		var height=document.getElementById('heightFly').value
		if((lon=='')||(lat=='')||(height=='')){
			alert('请填写完整位置信息')
		}
		else if((isNaN(lon)==true)||(isNaN(lat)==true)||(isNaN(height)==true)){
			alert('输入的位置信息有误')
		}
		else{
			if(lon>180||lon<-180||lat>90||lat<-90){
				alert('输入的位置信息有误')
			}
			else{
				scene.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(lon,lat,height)})
			}
		}
	})
	//搜索
	$('#loadSearch').click(function(){
		require(['geoCoder'],function(geoCoder){
        	var searchLoad=new geoCoder({
				url:'https://dev.virtualearth.net/',
				key:'vRtPCtWxUSshyH7ehaco~QgJgBt-R9B6Gmzq1j0IGqg~At4WK0hT6dk6Hh92O2cGwhcH0YEVf3Na2w-i--NWyP0N_pAG3lKr_4Z2TRN9aIUl'
			})	
    	});
	})
	$('#remove').click(function(){
		 $("input[name=terrainRadio]").attr("checked",false);
		 $('#flood').removeClass('listlight2')	
		 // $("input[name=mapRadio]").attr("checked",false);
		 //viewer.imageryLayers.removeAll();
		 viewer.terrainProvider=new Cesium.EllipsoidTerrainProvider();
		 scene.primitives.removeAll();
	})
	$('#fullView').click(function(){
		scene.camera.flyHome()
	})
	$('#text').click(function(){
		var status=$('#geoPosition').css('visibility');
		if(status=='hidden'){
			$('#geoPosition').css('visibility','visible')
		}
		else if(status=='visible'){
			$('#geoPosition').css('visibility','hidden')
		}
	})
	$('#location').click(function(){
		navigator.geolocation.getCurrentPosition(function(position){
			scene.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 2000.0),
			})
			var mark = viewer.entities.add({
				position : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude),
				billboard : {
					image : 'bootstrap/images/mark.png',
					width : 24,
					height : 24
				}
			});
		});
	})
	$('#fullScreen').click(function(){
		Cesium.Fullscreen.requestFullscreen(viewer.scene.canvas)
	});
	$('#measure').click(function(){
		var status=$('#toolbar').css('visibility');
		if(status=='hidden'){
			$('#toolbar').css('visibility','visible')
		}
		else if(status=='visible'){
			$('#toolbar').css('visibility','hidden')
		}
	})
	$('#uploadBtn').click(function(){
		document.getElementById('file').click();
	})
	//控制相机
	var lockStatus=0
	$('#lock').click(function(){
		lockStatus=lockStatus+1;
		if(lockStatus%2==1){
			viewer.scene.screenSpaceCameraController.minimumZoomDistance =  20;
			viewer.scene.screenSpaceCameraController.maximumZoomDistance = Number.POSITIVE_INFINITY;
			viewer.camera.zoomIn();
			viewer.camera.zoomOut();	
		}
		else{
			require(['ctrlCamera'],function(ctrlCamera){
				var ctrlCamera=new ctrlCamera({
					viewer:viewer,
					rate:0.5,
					max:3000,
					min:50
				});
			})
		}
	})
	
	$('#effectDiv').click(function(){
		var isShadow=$("#shadow").is(':checked');
		var isLight=$("#light").is(':checked');
		var isSphere=$("#sphere").is(':checked');
		require(['SpEffect'],function(SpEffect){
			new SpEffect({
				viewer:viewer,
				shadow:isShadow,
				light:isLight,
				sphere:isSphere
			})
		})
	})
	$('#2d').click(function(){
		viewer.scene.mode=Cesium.SceneMode.SCENE2D;
	})
	$('#3d').click(function(){
		viewer.scene.mode=Cesium.SceneMode.SCENE3D;
	})
	
	
	
// //设置场景树
// 	jQuery.browser={};(function(){jQuery.browser.msie=false; jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)./)){ jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();
// 	var setting = {
// 		view: {
// 			selectedMulti: false,
// 			fontCss:{'font-weight':'bold'}
// 		},
// 		check: {
// 			enable: true,
// 			chkboxType: { "Y": "ps", "N": "ps" }
// 		},
// 		data: {
// 			simpleData: {
// 				enable: true
// 			},
// 			keep: {
// 				parent: true
// 			}
// 		},
// 		edit: {
// 			enable:true,
// 			showRenameBtn: false,
// 			showRemoveBtn: false
// 		},
// 		callback: {
// 			onCheck: treeFunc,
// 			onDblClick: treeDBClick,
// 			onAsyncSuccess: zTreeOnAsyncSuccess,
// 			onRemove: false
// 		},
// 	};
//
// 	var zNodes = [
// 		{ id: 3, pId: 0, name: "三维建筑模型", isParent: true, "nocheck":true},
// 		{ id: 4, pId: 0, name: "三维表面模型", isParent: true , "nocheck":true},
// 	];
//
// 	var treeObj=$.fn.zTree.init($("#treeDemo"), setting, zNodes);
//
// 	function treeDBClick(event, treeId, treeNode){
//
// 		if(treeNode.name==='都江堰建筑模型'){
// 			viewer.scene.camera.flyTo({
// 				destination:Cesium.Cartesian3.fromDegrees(103.60622, 31.00702,1500)
// 			})
// 		}
// 		if(treeNode.name==='柏林建筑模型'){
// 			viewer.camera.flyTo({
//    				destination : Cesium.Cartesian3.fromDegrees(13.41088, 52.51191, 670.0),
//     			orientation : {
//         			direction : new Cesium.Cartesian3(-0.9418253569257928, -0.3358369835739077, 0.013361044703871578),
//         			up : new Cesium.Cartesian3(0.040236452860014954, -0.073194304069017, 0.996505705809315)
//    		 		}
// 			})
// 		}
// 		if(treeNode.name==='倾斜摄影测量(科技新城)'){
// 			viewer.scene.camera.flyTo({
// 				destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
// 			})
// 		}
// 		if(treeNode.name==='倾斜摄影测量(湖州)'){
// 			viewer.scene.camera.flyTo({
// 				destination: Cesium.Cartesian3.fromDegrees(120.0868,30.8943,1000.0)
// 			})
// 		}
// 		if(treeNode.name==='倾斜摄影测量(遂宁)'){
// 			viewer.scene.camera.flyTo({
// 				destination: Cesium.Cartesian3.fromDegrees(109.59922, 27.95305,2000.0)
// 			})
// 		}
// 		if(treeNode.name==='湖州建筑模型'){
// 			viewer.scene.camera.flyTo({
// 				destination: Cesium.Cartesian3.fromDegrees(120.0868,30.8943,1000.0)
// 			})
//
// 		}
// 	}
// 	function treeFunc(event, treeId, treeNode){
// 		if(treeNode.name==='林口建筑模型'){
// 			if(!treeNode.checked){
// 				viewer.scene.primitives.removeAll();
// 			}
// 			else{
// 				linkou();
// 			}
// 		}
//
// 		if(treeNode.name==='柏林建筑模型'){
// 			if(!treeNode.checked){
// 				blModel.removePrimitive();
// 			}
// 			else{
// 				require(['osmBuilding'],function(osmBuilding){
// 					blModel=new osmBuilding({
// 						viewer:viewer
// 					})
// 				})
// 			}
// 		}
//
// 		if(treeNode.name==='费城白模建筑模型'){
// 			if(!treeNode.checked){
// 				hlModel.removePrimitive();
// 			}
// 			else{
// 				require(['highLightModels'],(highLightModels)=>{
// 					hlModel=new highLightModels({
// 						url:'data/models/Philadelphiabuilding.kml-files',
// 						xmlUrl:'data/models/Philadelphiabuilding-images.xml',
// 						scale:1,
// 						materialName:'MATERIAL_NAME_NOT_FOUND'
// 					})
// 				})
// 			}
// 		}
// 		if(treeNode.name==='都江堰建筑模型'){
// 			if(!treeNode.checked){
// 				viewer.scene.primitives.remove(djyDEM);
// 				djyBuilding.removePrimitive();
// 			}
// 			else{
// 				djyDEM=Cesium.Model.fromGltf({
// 					url:'data/models/duJiangYan/dem.gltf',
// 					modelMatrix:Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(103.6090, 31.0058,-16)),
// 					scale:1,
// 					incrementallyLoadTextures:false
// 				})
// 				scene.primitives.add(djyDEM)
// 				require(['djyModels'],function(djyModels){
// 					djyBuilding=new djyModels({
// 						url:'data/models/duJiangYan',
// 						xmlUrl:'data/models/djyPos.xml',
// 						scale:1
// 					})
// 				})
// 			}
// 		}
//
// 		if(treeNode.name==='倾斜摄影测量(科技新城)'){
// 			if(!treeNode.checked){
// 				Cesium.loadXML('data/DSM/TecCity/gltf/gltf.xml').then(function(obj){
// 					var fileName=[];
// 					fileName=obj.getElementsByTagName("name");
// 					for(var i=0;i<fileName.length;i++){
// 						viewer.scene.primitives.remove(TecDSM[i])
// 					}
// 				})
// 			}
// 			else{
// 				require(['DSMTree_new'],function(DSMTree_new){
// 					Cesium.loadXML('data/DSM/TecCity/gltf/gltf.xml').then(function(obj){
// 						var fileName=[];
// 						fileName=obj.getElementsByTagName("name");
// 						for(var i=0;i<fileName.length;i++){
// 							var name=obj.documentElement.childNodes[i].textContent;
// 							TecDSM[i]=new DSMTree_new({
// 								url:'data/DSM/TecCity/gltf/'+name,
// 								name:name,
// 								modelMatrix:Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(109.59922, 27.95305, 0),0,0, Cesium.Math.toRadians(0)),
// 								debugShowBoundingVolume:false,
// 								level:0,
// 								pixelScale:300,
// 								visibleRange:1200
// 							});
// 							viewer.scene.primitives.add(TecDSM[i]);
// 						}
// 					})
// 				})
// 			}
// 		}
// 		if(treeNode.name==='倾斜摄影测量(遂宁)'){
// 			if(!treeNode.checked){
// 				Cesium.loadXML('data/DSM/suining1/Data/suining1.xml').then(function(obj){
// 					var fileName=[];
// 					fileName=obj.getElementsByTagName("name");
// 					for(var i=0;i<fileName.length;i++){
// 						viewer.scene.primitives.remove(suiningDSM[i])
// 					}
// 				})
// 			}
// 			else{
// 				require(['DSMTree_new'],function(DSMTree_new){
// 					Cesium.loadXML('data/DSM/suining1/Data/suining1.xml').then(function(obj){
// 						var fileName=[];
// 						fileName=obj.getElementsByTagName("name");
// 						for(var i=0;i<fileName.length;i++){
// 							var name=obj.documentElement.childNodes[i].textContent;
// 							suiningDSM[i]=new DSMTree_new({
// 								url:'data/DSM/suining1/Data/'+name,
// 								name:name,
// 								modelMatrix:Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(109.59922, 27.95305, 0),0,0, Cesium.Math.toRadians(0)),
// 								debugShowBoundingVolume:false,
// 								level:0,
// 								pixelScale:300,
// 								visibleRange:1200
// 							});
// 							viewer.scene.primitives.add(suiningDSM[i]);
// 						}
// 					})
// 				})
// 			}
// 		}
// 		if(treeNode.name==='倾斜摄影测量(湖州)'){
// 			if(!treeNode.checked){
// 				Cesium.loadXML('data/DSM/changdao/gltf/changdao.xml').then(function(obj){
// 					var fileName=[];
// 					fileName=obj.getElementsByTagName("name");
// 					for(var i=0;i<fileName.length;i++){
// 						viewer.scene.primitives.remove(changdaoDSM[i])
// 					}
// 				})
// 			}
// 			else{
// 				require(['DSMTree_new'],function(DSMTree_new){
// 					Cesium.loadXML('data/DSM/changdao/gltf/changdao.xml').then(function(obj){
// 						var fileName=[];
// 						fileName=obj.getElementsByTagName("name");
// 						for(var i=0;i<fileName.length;i++){
// 							var name=obj.documentElement.childNodes[i].textContent;
// 							changdaoDSM[i]=new DSMTree_new({
// 								url:'data/DSM/changdao/gltf/'+name,
// 								name:name,
// 								modelMatrix:Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(109.59922, 27.95305, 0),0,0, Cesium.Math.toRadians(0)),
// 								debugShowBoundingVolume:false,
// 								level:0,
// 								pixelScale:300,
// 								visibleRange:1200
// 							});
// 							viewer.scene.primitives.add(changdaoDSM[i]);
// 						}
// 					})
// 				})
// 			}
// 		}
// 	}
//
// 	function addHoverDom(treeId, treeNode) {
// 		var sObj = $("#" + treeNode.tId + "_span");
// 		if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
// 		var addStr = "<span class='button add' id='addBtn_" + treeNode.tIdv
// 			+ "' title='add node' onfocus='this.blur();'></span>";
// 		sObj.after(addStr);
// 		var btn = $("#addBtn_" + treeNode.tId);
// 		if (btn) btn.bind("click", function () {
// 			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
// 			zTree.addNodes(treeNode, { id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++) });
// 			return false;
// 		});
// 	};
// 	function setRemoveBtn(treeId, treeNode) {
// 		return !treeNode.isParent;
// 	}
// 	function removeHoverDom(treeId, treeNode) {
// 		$("#addBtn_" + treeNode.tId).unbind().remove();
// 	};
// 	function zTreeOnAsyncSuccess(event, treeId, treeNode, msg){
// 		var treeObj=$.fn.zTree.init($("#treeDemo"), setting, zNodes);
// 		treeObj.removeChildNodes(treeNode);
// 	}
}

