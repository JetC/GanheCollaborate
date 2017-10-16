//developMode的值为true决定以source形式加载
//developMode的值为false决定以release格式加载
alert("mainjs");
var developMode = false;

if(developMode){
	require.config({
		waitSeconds : 600,
		baseUrl : './Cesium/Source',
		paths: {


    },
		shim: {
            'Cesium': {
                exports: 'Cesium'
            }//,
            //'jquery':{
               // exports: 'jquery'
           // }
    }
	});
} else{
	require.config({
        waitSeconds : 600,
        paths: {
				Cesium: '../Cesium/Release/CesiumUnminified/Cesium.js'//,
                //jQuery:'/js/libs/jquery.js'

		  },
		  shim: {
             
			  Cesium: {
				  exports:'Cesium'
			  },
              //jQuery:{
             //     exports:'jQuery'
            //  }
			 }

	});
}

/*
if (typeof Cesium !== "undefined" && typeof echarts !== "undefined" && typeof CesiumHeatmap !== "undefined") {
    onload(Cesium,CesiumHeatmap,echarts);
} else if (typeof require === "function") {
    require(["Cesium","CesiumHeatmap","echarts"], onload);
}
*/
if (typeof Cesium !== "undefined" ) {
    alert("mainjs1");
    onload(Cesium,jQuery);

} else if (typeof require === "function") {
    alert("mainjs2");
    require([Cesium], onload);

}