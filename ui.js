/*$(document).ready(function(){

           $("#header-left-container").classList.toggle("changeButtonBackground");


       });
       */

var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,//图层控制显示

    geocoder: true,//地名查找显示

    timeline: true,//时间线显示

    sceneModePicker: false, //投影方式显示

    navigationHelpButton: false,//帮助键不显示

    homeButton: false//Home键不显示
});
//去掉Cesium下角的商标

viewer._cesiumWidget._creditContainer.style.display = "none";
//buttonControl = new ButtonControl('cesiumContainer', options);
viewer.scene.globe.enableLighting = true;
/*选择控件按钮

that.useNavigationMixin = Cesium.defaultValue(options.useNavigationMixin, true);
if (that.useNavigationMixin) {
viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
}*/
viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

$(function(){
    $('<i />',{
        id:'home',
        "class":"fa fa-home",
        "aria-hidden":"true",
        "color":'#08ABD5',
        'background':'#888',
        "title":"首页",
        click:function(){

            viewer.zoomTo(viewer.entities);
        }
    }).appendTo("#test");
});

$(function(){
    $('<i />',{
        id:'3D_2D',
        "class":"fa fa-globe",
        "aria-hidden":"true",
        "color":'#08ABD5',
        'background':'#888',
        "title":"2D/3D",
        click:function(){

            if($(this).hasClass("fa-globe")){
                $(this).removeClass("fa-globe");
                $(this).addClass("fa-map-o");
                alert("切换Cesium为2D");
            }else{
                $(this).removeClass("fa-map-o");
                $(this).addClass("fa-globe");
                alert("切换Cesium为3D");
            }
        }
    }).appendTo("#test");

});


$(function() {
    // viewer.dataSources.add(Cesium.KmlDataSource.load('./json/dataLayer.json'));
    //  var promise = Cesium.GeoJsonDataSource.load(top_src);
    //promise.then(function(dataSource) {});
    $.getJSON("json/dataLayer.json", function (data) {
        var items = [];
        $.each(data.categories, function (key, val) {
            items.push("<li class=\"modalLi\" style=\"position: relative; display:inline-block\">" +
                "<div class=\"checkBocContainer\"><input id=\"permitted" + key + "\"" + " type=\"checkbox\"><label for=\"permitted" + key + "\"" + " class=\"side-label\"></label>" +
                "</div>" +
                "<div id=\"dataTable-content1\" class=\"modalContent\">" + val + "</div></li></br>\n");
        });

        //数据头
        var html = "<li style=\"position: relative\">" +
            "<div id=\"dataTable-title\" class=\"modalTitle\">矢量与栅格数据集</div><div class=\"errorButton\">&times;</div>" +
            "</li>\n" + items.join("");
        $("<ul/>", {
            html: html
        }).appendTo("#dataTable");
        //checkbox选择加载数据事件

        var layerMapper ={};
        var $checkbox =$("li input[type=\"checkbox\"]");
        $checkbox.click(function(){
            var layers = viewer.scene.imageryLayers;
            var id = this.id;
            var index = parseInt(id.substr(id.length-1,1));
            var key = data.categories[index];
            var contentArr = data[key];
            var url,type,method,suffix;
            var i;

            if(($(this).prop('checked')))
            {
                $(this).prop('checked',true);

                for(i=0; i<contentArr.length; i++)
                {
                    loadDataLayer(contentArr[i]);
                }
            }else {
                $(this).prop('checked', false);
                for(i=0;i<contentArr.length;i++)
                {
                    removeDataLayer(contentArr[i]);
                }
            }
            function loadDataLayer(content){
                var currLayer,options,extent;
                //加载不同格式数据
                if ((content.type === "png") && (content.method === "tms")) {
                    alert("影像数据数据加载");
                }
                else if (content.type === "kml") {
                     options = {
                        camera : viewer.scene.camera,
                        canvas : viewer.scene.canvas
                    };
                     extent = Cesium.Rectangle.fromDegrees(101.432053, 36.403152,102.101701, 36.96018);
                    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
                    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
                    viewer.dataSources.add(Cesium.KmlDataSource.load(content.url, options));
                    viewer.camera.setView({destination: extent});

                } else if (content.type === "png") {
                }else if(content.type==="osm")
                {
                    currLayer =  layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                       'url' : content.url,
                        'fileExtension':content.suffix
                    }));
                    layerMapper[content.url] = currLayer;
                }
            }
            function removeDataLayer(content){
                if ((content.type === "png") && (content.method === "tms")) {

                    alert("影像数据数据加载");
                }
                else if (content.type === "kml") {
                    viewer.dataSources.removeAll();
                } else if (content.type === "png") {
                }else if(content.type==="osm")
                {
                   var layer =  layerMapper[content.url];
                    layers.remove(layer, false);
                }
            }
        });
    });


    $('<i />', {
        id: 'dataPicker',
        "class": "fa fa-database",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "数据加载",
        click: function () {

            $("#dataTable").removeClass("modalHide");
            $(".errorButton").click(function () {
                $("#dataTable").addClass("modalHide");
            });
        }
    }).appendTo("#test");
});

$(function () {
    $("<input />", {
        id: 'toolbarsCheckbox',
        "class": "toolbarsDis",
        "type": "checkbox",
        "z-index": "3000"
    }).appendTo("#test");
});
$(function () {
    $("<label />", {
        id: 'toolbarsLabel',
        "for": "toolbarsCheckbox",
        "class": "fa fa-wrench",
        "display": "block",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "工具集",
        "z-index": "2000"
    }).appendTo("#test");
});


$(function () {

    $('<i />', {
        id: 'roamHelper',
        "class": "fa fa-plane buttonMove roamAnimation",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "三维巡航",
        click: function () {

            alert("ok");
        }
    }).appendTo("#test");
});
/*********************************绘图工具********************************/
$(function () {
    $('<i />', {
        id: 'drawHelper',
        "class": "fa fa-pencil buttonMove drawAnimation",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "绘图工具",
        click: function () {
            if ($(this).hasClass("active")) {
                $("#drawToolsContainer").hide();
                $(this).removeClass("active");

            } else {
                $("#drawToolsContainer").show();
                $(this).addClass("active");
            }


        }
    }).appendTo("#test");
});
$('<div />', {
    id: 'drawToolsContainer',
    "class": "drawToolsContainer toolsContainerDis"
}).appendTo("#cesiumContainer");

$('<i />', {
    id: 'delectPoly',
    "class": "fa fa-trash toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "删除",
    click: function () {
        alert("删除");
    }
}).appendTo("#drawToolsContainer");

$('<i />', {
    id: 'drawPolygon',
    "class": "fa fa-marker toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "绘制多边形",
    click: function () {
        alert("绘制多边形");
    }
}).appendTo("#drawToolsContainer");

$('<i />', {
    id: 'drawExtent',
    "class": "fa fa-marker toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "绘制多方形",
    click: function () {
        alert("绘制方形");
    }
}).appendTo("#drawToolsContainer");


$('<i />', {
    id: 'drawPolyline',
    "class": "fa fa-marker toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "绘制线",
    click: function () {
        alert("绘制线");
    }
}).appendTo("#drawToolsContainer");

$('<i />', {
    id: 'drawPin',
    "class": "fa fa-map-marker toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "图标",
    click: function () {
        alert("创建图标");
    }
}).appendTo("#drawToolsContainer");


/*******************************测量工具********************************/
$(function () {
    $('<div />', {
        id: 'measureHelper',
        "class": "fa fa-pencil buttonMove measureAnimation",
        "background-image": "url(images/measure.png)",
        "color": '#08ABD5',
        'background-color': '#888',
        "title": "测量工具",
        click: function () {

            alert("ok");
        }
    }).appendTo("#test");
});
$(function () {

    $('<i />', {
        id: 'statisticsHelper',
        "class": "fa fa-bar-chart buttonMove statAnimation",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "统计工具",
        click: function () {

            alert("ok");
        }
    }).appendTo("#test");
});
$(function () {
    $('<i />', {
        id: 'situationMap',
        "class": "fa fa-cubes",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "实时可视化层",
        click: function () {
            if ($(this).hasClass("fa-cubes")) {
                $(this).removeClass("fa-cubes");
                $(this).addClass("fa-tasks");
                $(this).attr("title", "态势分析层");
                alert("切换为态势分析层，执行heatMap以及态势标签显示");
                viewer.entities.removeAll();
                taiShiLegendDraw();
                alert("OK");
                //drawHeatMap();
            } else if ($(this).hasClass("fa-tasks")) {
                $(this).removeClass("fa-tasks");
                $(this).addClass("fa-exclamation-triangle");
                $(this).attr("title", "诊断分析层");
                alert("切换为诊断分析层");
            } else {
                $(this).removeClass("fa-exclamation-triangle");
                $(this).addClass("fa-cubes");
                $(this).attr("title", "实时可视化层");

            }
        }
    }).appendTo("#test");
});

$(function () {
    $('<i />', {
        id: 'situationMap',
        "class": "fa fa-question",
        "aria-hidden": "true",
        "color": '#08ABD5',
        'background': '#888',
        "title": "帮助",
        click: function () {

            alert("ok");
        }
    }).appendTo("#test");
});

var jsonData;
loadJSON(function (response) {
    // Parse JSON string into object
    jsonData = JSON.parse(response);
    var park, site, instrument, factor;
    for (park in jsonData) {
        for (site in jsonData[park]["stations"]) {
            for (instrument in jsonData[park]["stations"][site]["device"]) {
                for (factor in jsonData[park]["stations"][site]["device"][instrument]["factor"]) {
                    jsonData[park]["stations"][site]["device"][instrument]["factor"].sort(function(a,b){
                        return a["name"].localeCompare(b["name"], 'zh-Hans-CN', {sensitivity: 'accent'});
                    });
                }
            }
        }
    }
});

$(function(){
    //Create the list
    $('#sidebar').json2html(jsonData,transform.park);

    $('<div class="pageHeader"><h4 class="panel-title"><a class="parkToggle">青海省甘河工业园区污染监测系统</a></h4></div>').prependTo('#sidebar');
    $('<div style="position: fixed;bottom: 0; width: 25%; height:25%; background-color:#0D1C32; z-index: 9999;"><div class="datetimePickerDiv"><label>起始时间：</label><input id="startDateTimepicker" class="datetimepicker" type="text"><label>截止时间：</label><input id="endDateTimepicker" class="datetimepicker" type="text"></div><div class="submitAndFavButton"><button class="submitButton">查询</button></div></div>').appendTo('#left-side-nav-panel');

    jQuery(function(){
        var today = new Date();
        today.setHours(today.getHours()-1);
        var startDate = today;
        today = new Date();
        jQuery('#startDateTimepicker').datetimepicker({
            format:'Y-m-d H:i:s',
            lang: 'ch',
            onShow:function( ct ){
                this.setOptions({
                    maxDate: jQuery('#endDateTimepicker').val() ? jQuery('#endDateTimepicker').val() : false
                })
            },
            timePicker: true,
            value: startDate
        });

        jQuery('#endDateTimepicker').datetimepicker({
            format: 'Y-m-d H:i:s',
            locale: 'ch',
            onShow: function (ct) {
                this.setOptions({
                    minDate: jQuery('#startDateTimepicker').val() ? jQuery('#startDateTimepicker').val() : false
                })
            },
            timePicker: true,
            value: today
        });
    });

    leftSideBarConf();
    writeAttrsToFactors();
    mergeHidenBoxes();
    $($('.parkToggle').first()).trigger('click');
    $('.panel-heading').click(function () {
        console.log('dsdf:'+ (($(this).index()-1)/2+1));
    });
    $('.factor').click( function(e) {

        var factorID = $(this).attr("factorID");
        var deviceID = $(this).attr("deviceID");
        var stationID = $(this).attr("stationID");
        var parkID = $(this).attr("parkID");

        if ($(this).hasClass("selectedFactor")){
            $(this).removeClass("selectedFactor");
            var afterFilter = [];
            afterFilter = $.grep(selectedFactorsInfo,function (obj) {
                console.log(obj.deviceID);
                if ((obj.deviceID === deviceID) && (obj.factorID === factorID) && (obj.stationID === stationID) && (obj.parkID === parkID)) {
                    //Old factor, Remove
                    return false;
                } else {
                    //New facotor, add
                    return true;
                }
            });
            selectedFactorsInfo = afterFilter;
        } else {
            $(this).addClass("selectedFactor");
            var factorInfo = {"parkID":parkID,"stationID":stationID,"deviceID":deviceID,"factorID":factorID};
            selectedFactorsInfo.push(factorInfo);
        }
        console.log("selectedFactorsInfo: "+selectedFactorsInfo);

    });
    $(".submitButton").click( function () {
        console.log("succvvvv");
        var startDate = document.getElementById('startDateTimepicker').value;
        var endDate = document.getElementById('endDateTimepicker').value;
        var stringToPost = generateDataToPost(startDate, endDate);
        jQuery.ajax ({
            url: "http://192.168.20.59:80/postjson",
            type: "POST",
            data: stringToPost,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                displayData(data);
            }
        });
    });
    function generateDataToPost(startDate, endDate){
        var queryObj = {"factorsQuery":selectedFactorsInfo,"startDate":startDate,"endDate":endDate};
        var tempObj = {};
        var outputObj = {"factorsQuery":[],"startTime":startDate,"endTime":endDate};
        for (var i = 0; i<selectedFactorsInfo.length; i++) {
            var singleFactor = selectedFactorsInfo[i];
            singleFactor["key"] = singleFactor.parkID + singleFactor.stationID + singleFactor.deviceID;
            var keyString = singleFactor["key"];
            if (tempObj[keyString] === undefined) {
                tempObj[keyString] = [];
            }
            tempObj[keyString].push(singleFactor);
        }
        for (var i = 0; i<Object.keys(tempObj).length; i++) {
            var factorKey = Object.keys(tempObj)[i];
            var factorsInSameDevice = tempObj[factorKey];
            var factorIDs = [];
            for (var j=0; j<factorsInSameDevice.length; j++) {
                factorIDs.push(factorsInSameDevice[j].factorID);
            }
            var parkID = tempObj[factorKey][0].parkID;
            var stationID = tempObj[factorKey][0].stationID;
            var deviceID = tempObj[factorKey][0].deviceID;
            outputObj["factorsQuery"].push({"parkID":parkID,"stationID":stationID,"deviceID":deviceID,"factorID":factorIDs});
        }
        var string = JSON.stringify(outputObj);
        console.log("jsonData:" + string);
        return string;
    }
});