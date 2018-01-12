var transform = {
    "park":[{"<>":"div","class":"panel-heading",
        "html":[{"<>":"h4","class":"panel-title",
            "html":[{"<>":"a", "class":"parkToggle", "data-toggle":"collapse","href":"#collapse-${parkID}","html":"${name}"}]
        }]
    },
        {"<>":"div","class":"sidebar-info panel-collapse collapse", "id":"collapse-${parkID}",
            "html": [{"<>":"div", "class":"panel-body", "html":function (){
                    var side_li_content = "<ul class=\"side-li\">";
                    var side_li_html = json2html.transform(this.stations,transform.siteLi);
                    side_li_html += "</ul>";
                    var parkID = this.parkID;
                    var hidenboxIdString = 'hiden-box'+parkID;
                    var hiden_box_content = "<ul class=\"hiden-box\">";
                    var hiden_box_html = json2html.transform(this.stations,transform.siteHiddenBox);
                    hiden_box_html += "</ul>";
                    return (side_li_content+side_li_html+hiden_box_content+hiden_box_html);
                }}]
        }],
    "siteLi":{"<>":"li", "class":"s_${stationID}",
        "html":[{"<>":"h3", "stationID":"${stationID}",
            "html":"${name}<span class=\"rightArrow rightArrow-angle-right rightArrow-loc\"></span>"
        }]
    },
    "siteHiddenBox":[{
        "<>":"li","data-hidden":"li","id":"hiden-${stationID}","html":[
            {"<>":"div", "class":"sub-nav-right","html":function () {
                    return json2html.transform(this.device,transform.sub_nav);
                }}
        ]
    }],
    "sub_nav":[
        {"<>":"div","class":"cell-box","html":function () {
                return json2html.transform(this,transform.cell_box);
            }
        }],
    "cell_box":[{
        "<>":"div", "class":"instrumentLogoDiv", "html":[{"<>":"img","src":"images/intrumentLogo.png", "class":"instrumentLogoImg", "float":"left"},{"<>":"h1","deviceID":"${deviceID}","html":"${name}"}]
    },{
        "<>":"div","class":"a-box","html":function () {
            return json2html.transform(this.factor,transform.a_box);
        }
    }],
    "a_box":[{
        "<>":"button","href":"#1", "class":"factor","factorID":"${factorID}", "html":"${name}"
    },{
        "<>":"span","html":" "
    }]
};
var providerViewModels = [];
var points = [];
var indexOfPointsToFlyTo = 0;
var isRecordingClicks = false;
var roamDuration = 5;


providerViewModels.push(new Cesium.ProviderViewModel({
    name : 'Bing Maps Aerial with Labels',
    iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/bingAerialLabels.png'),
    tooltip : 'Bing Maps aerial imagery with label overlays \nhttp://www.bing.com/maps',
    creationFunction : function() {
        return new Cesium.BingMapsImageryProvider({
            url : '//dev.virtualearth.net',
            mapStyle : Cesium.BingMapsStyle.AERIAL_WITH_LABELS
        });
    }
}));

providerViewModels.push(new Cesium.ProviderViewModel({
    name : 'Open Street Map',
    iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
    tooltip : 'Open StreetMap aerial imagery \nhttps://www.openstreetmap.org',
    creationFunction : function() {
        return Cesium.createOpenStreetMapImageryProvider({
            url : 'https://a.tile.openstreetmap.org/'
        });
    }
}));

var terrainViewModels = [];
// terrainViewModels.push(new Cesium.ProviderViewModel({
//     name : 'WGS84 Ellipsoid',
//     iconUrl : Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
//     tooltip : 'WGS84 standard ellipsoid, also known as EPSG:4326',
//     creationFunction : function() {
//         return new Cesium.EllipsoidTerrainProvider();
//     }
// }));
//
// terrainViewModels.push(new Cesium.ProviderViewModel({
//     name : 'STK World Terrain meshes',
//     iconUrl : Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
//     tooltip : 'High-resolution, mesh-based terrain for the entire globe. Free for use on the Internet. Closed-network options are available.\nhttp://www.agi.com',
//     creationFunction : function() {
//         return new Cesium.CesiumTerrainProvider({
//             url : '//assets.agi.com/stk-terrain/world',
//             requestWaterMask : true,
//             requestVertexNormals : true
//         });
//     }
// }));

var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,//图层控制显示

    geocoder: true,//地名查找显示

    timeline: true,//时间线显示

    sceneModePicker: false, //投影方式显示

    navigationHelpButton: false,//帮助键不显示

    homeButton: false,//Home键不显示
    imageryProviderViewModels : providerViewModels,
    selectedImageryProviderViewModel : providerViewModels[1],
    terrainProviderViewModels : terrainViewModels,
    selectedTerrainProviderViewModel : terrainViewModels[1]

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

var selectedFactorsInfo;
selectedFactorsInfo = [];
var jsonData;

function leftSideBarConf(){
    var scTop = 0,
        //Initial position
        beginH = 0,
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        classN,
        num;
    var hidenBoxCalculatedWidth = 0;
    $('.side-li > li').hover(
        function(){
            // $(this).find('h3').css({border: 'none'})
            //     .end().find('span').css({color: ""});
            classN = $(this).attr('class');
            num = classN.substring(2, classN.length);
            beginH = 50;
            var parkIndex = ($(this).parent().parent().parent().index()-2)/2;
            var siteIndex = $(this).index();
            var liTop = $(this).offset().top;
            console.log("top:"+liTop);
            // var hidenBoxHeight = $(window).height()/2;
            var maxHeight = $(window).height()*0.75;

            $('.hiden-box').show()
                .css({
                    top:"-10000px",
                    left: ($(window).width()/4),
                    width: $(window).width()*0.75,
                    maxHeight: maxHeight
                });
            var actualHeight = $('.hiden-box').height();
            console.log("actualHeight:"+actualHeight);

            var top = function () {
                var calculatedValue = $('.s_'+num).offset().top-20;
                if (calculatedValue < 0) {
                    calculatedValue += 20;
                }
                if(calculatedValue+actualHeight>$(window).height()) {
                    calculatedValue = $(window).height()-actualHeight-10;
                }
                return calculatedValue;
            };

            // if (top + actualHeight > windowHeight) {
            //     top = windowHeight-actualHeight;
            // }
            var scrollHeight = $('.hiden-box')[0].scrollHeight;
            var desiredWidth = $(window).width()/4*3*0.75;
            $('.hiden-box').show()
                .css({
                    left: ($(window).width()/4),
                    top:  top,
                    maxHeight: maxHeight
                }).animate({width: desiredWidth}, 0);
            // $('.hiden-box > ').find('h3').css({border: ''});
            $('.hiden-box > li').hide();
            $('#hiden-'+num).fadeIn(0);
            //Detailed Position
            beginH = 0;
            console.log('side-li > li - hover-enter');
        },
        function(){
            $(this).find('h3').css({border: ''})
                .end().find('span').css({color: ""});
            hidenBoxCalculatedWidth = $('.hiden-box').width();
            $('.hiden-box').hide().css({width: '0'});
            console.log('side-li > li - hover-exit');
        }
    );
    $('.hiden-box').hover(
        function(){
            $('.s_'+num).addClass("sideLiHover");
            // $('.s_'+num).find('h3').css({border: 'none'});
            $(this).show().css({width: hidenBoxCalculatedWidth});
            console.log('hiden-box-hover-enter');
        },

        function(){
            $('.s_'+num).removeClass("sideLiHover");
            $('.s_'+num).css({
                border: '',
                borderRight: ''
            }).find('h3').css({border: ''})
                .end().find('span').css({color: ""});

            $(this).animate({
                width: 0
            }, 0).hide(0);
            console.log('hiden-box-hover-exit');
        }
    );
    setDefaultValueOfRoamWindow();
}
function mergeHidenBoxes() {
    var hidenBoxesArray = $('.hiden-box');
    for (var i = 1;i < hidenBoxesArray.length; i++) {
        var singleHidenBox = hidenBoxesArray[i];
        for (;$($(singleHidenBox).children()).length > 0;) {
            hidenBoxesArray[0].append(singleHidenBox.children[0]);
        }
        singleHidenBox.remove();
    }
}

function writeAttrsToFactors() {
    var allFactorsArr = $('.factor');
    for (var i=0;i<allFactorsArr.length;i++) {
        var singleFactor = allFactorsArr[i];
        var deviceID = $(singleFactor).parent().prev().find("h1").attr("deviceID");
        var stationID = $(singleFactor).parent().parent().parent().parent().attr("id").split("-")[1];
        var parkID = $(singleFactor).parent().parent().parent().parent().parent().parent().parent().attr("id").split("-")[1];
        // console.log(deviceID,stationID,parkID);
        $(singleFactor).attr('deviceID',deviceID);
        $(singleFactor).attr('stationID',stationID);
        $(singleFactor).attr('parkID',parkID);
    }

}
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
/********************************加载实时经纬度坐标********************************/
position(viewer);
/*******************************导入json数据********************************/

function getDataForHeatMap() {
    var points = [];
    var maxValue = 0, minValue = 0;
    for (var i = currentData.length - 1; i >= 0; i--) {
        var x = currentData[i].lon;
        var y = currentData[i].lat;
        var value = currentData[i].aqiValue;
        maxValue = Math.max(maxValue, value);
        minValue = Math.min(minValue, value);
        points.push({
            x: x,
            y: y,
            value: value
        });
    }
    var data = {max: maxValue, points: points, min: minValue};
    return data;
}

function getBoundsForHeatMap() {
    var bounds = {
        north: currentRectangle.north * 180.0 / Math.PI,
        west: currentRectangle.west * 180.0 / Math.PI,
        south: currentRectangle.south * 180.0 / Math.PI,
        east: currentRectangle.east * 180.0 / Math.PI
    };
    return bounds;
}

function preToDrawHeatmap() {
    var data = getDataForHeatMap();
    var bounds = getBoundsForHeatMap();

    var provider = createHeatmapImageryProvider(Cesium, {
        data: data,
        bounds: bounds,
        chInstance: CesiumHeatmap
    });
    var layer = viewer.imageryLayers.addImageryProvider(provider);
    viewer.entities.removeAll();
    if (heatLayer != null) {
        viewer.imageryLayers.remove(heatLayer);
        heatLayer = layer;
    } else {
        heatLayer = layer;
    }

};

function drawHeatmap() {
    var heatLayer = null;

}

function taiShiLegendDraw() {

    var data = [
        {
            'stationID': '1',
            'stationName': '管委会子站',
            "Latitude": 36.54695,
            "Logitude": 101.52028,
            'warning-level': '高报值',
            'color': '#f56048',
            'WsNum': '4',
            'wfactor': [{'factor-name': '氨气', 'overValue': '0.98mg'}]
        },
        {
            'stationID': '2',
            'stationName': '海纳1号站',
            "Latitude": 36.55809,
            "Logitude": 101.49935,
            'warning-level': '预警值',
            'color': "#60bdfa",
            'WsNum': '1',
            'wfactor': [{'factor-name': '甲烷', 'overValue': '0.11mg'}]
        },
        {
            'stationID': '3',
            'stationName': '信禾站',
            "Latitude": 36.55657,
            "Logitude": 101.87368,
            'warning-level': '预警值',
            'color': '#fbaa1b',
            'WsNum': '2',
            'wfactor': [{'factor-name': '氯气', 'overValue': '0.32mg'}]
        },
        {
            'stationID': '4',
            'stationName': '宜化1号站',
            "Latitude": 36.89864,
            "Logitude": 101.75441,
            'warning-level': '高报值',
            'color': '#E8D024',
            'WsNum': '4',
            'wfactor': [{'factor-name': '氨气', 'overValue': '0.98mg'}]
        },
        {
            'stationID': '5',
            'stationName': '宜化2号站',
            "Latitude": 36.89525,
            "Logitude": 101.75372,
            'warning-level': '预警值',
            'color': "#1c71f2",
            'WsNum': '1',
            'wfactor': [{'factor-name': '甲烷', 'overValue': '0.11mg'}]
        },
        {
            'stationID': '6',
            'stationName': '海纳2号站',
            "Latitude": 36.55789,
            "Logitude": 101.49936,
            'warning-level': '预警值',
            'color': '#00A67C',
            'WsNum': '2',
            'wfactor': [{'factor-name': '氯气', 'overValue': '0.32mg'}]
        },
        {
            'stationID': '7',
            'stationName': '天泰站',
            "Latitude": 36.51549,
            "Logitude": 101.52896,
            'warning-level': '高报值',
            'color': '#f56048',
            'WsNum': '4',
            'wfactor': [{'factor-name': '氨气', 'overValue': '0.98mg'}]
        },
        {
            'stationID': '8',
            'stationName': '湟中县子站',
            "Latitude": 36.49424,
            "Logitude": 101.56043,
            'warning-level': '预警值',
            'color': "#60bdfa",
            'WsNum': '1',
            'wfactor': [{'factor-name': '甲烷', 'overValue': '0.11mg'}]
        },
        {
            'stationID': '9',
            'stationName': '东区污水厂站',
            "Latitude": 36.58916,
            "Logitude": 101.52756,
            'warning-level': '预警值',
            'color': '#fbaa1b',
            'WsNum': '2',
            'wfactor': [{'factor-name': '氯气', 'overValue': '0.32mg'}]
        },
        {
            'stationID': '10',
            'stationName': '苏锡子站',
            "Latitude": 36.50519,
            "Logitude": 101.53191,
            'warning-level': '高报值',
            'color': '#f56048',
            'WsNum': '4',
            'wfactor': [{'factor-name': '氨气', 'overValue': '0.98mg'}]
        },
        {
            'stationID': '11',
            'stationName': '西区污水厂站',
            "Latitude": 36.63168,
            "Logitude": 101.50297,
            'warning-level': '预警值',
            'color': "#1c71f2",
            'WsNum': '1',
            'wfactor': [{'factor-name': '甲烷', 'overValue': '0.11mg'}]
        },
        {
            'stationID': '12',
            'stationName': '桂鲁站',
            "Latitude": 36.54012,
            "Logitude": 101.48518,
            'warning-level': '预警值',
            'color': '#00A67C',
            'WsNum': '2',
            'wfactor': [{'factor-name': '氯气', 'overValue': '0.32mg'}]
        }


    ];
    var markers = [];

    for (var i = 0; i < data.length; i++) {
        var canvas = document.getElementById("cesiumContainer");
        var marker = document.createElement("div");
        marker.className = "station-warning-info";
        marker.id = data[i].stationID + "station";
        marker.style.zIndex = 0;
        //marker.lat = data[i].Latitude;
        // marker.log = data[i].Logitude;

        var dot = document.createElement("div");
        dot.className = "warning-position-dot";
        dot.innerHTML = "●";
        var factorNum = document.createElement("div");
        factorNum.className = "warning-factor-number";
        factorNum.innerHTML = data[i].WsNum;
        var stationName = document.createElement("div");
        stationName.className = "station-name";
        stationName.innerHTML = data[i].stationName;
        stationName.style.backgroundColor = data[i].color;
        canvas.appendChild(marker);

        marker.appendChild(dot);
        marker.appendChild(factorNum);
        marker.appendChild(stationName);
        var table = document.createElement("table");
        table.className = "station-warning-table";
        table.cellSpacing = 1;
        //table.border-collapse = "collapse";
        var thead = document.createElement("thead");
        var trhead = document.createElement("tr");
        var th = document.createElement("th");
        th.className = "station-name-head";
        th.innerHTML = data[i].stationName;
        th.style.backgroundColor = data[i].color;
        th.colspan = 2;
        thead.appendChild(trhead);
        trhead.appendChild(th);
        var tbody = document.createElement("tbody");
        tbody.className = "warning-info-title";

        for (var p in data[i]) {
            if (p !== "color") {
                if (p !== "wfactor") {

                    var trbody = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.innerHTML = p;

                    var td2 = document.createElement("td");
                    td2.innerHTML = data[i][p];
                    trbody.appendChild(td1);
                    trbody.appendChild(td2);
                    tbody.appendChild(trbody);
                } else {
                    var trFactor = document.createElement("tr");
                    var tdFactor = document.createElement("td");
                    tdFactor.colspan = 2;
                    tdFactor.style.width = '190px';
                    tdFactor.style.textAlign = "center";
                    tdFactor.innerHTML = "预警因子";

                    trFactor.appendChild(tdFactor);
                    tbody.appendChild(trFactor);

                    for (var f in data[i][p]) {
                        trFacBody = document.createElement("tr");
                        tdFacBody1 = document.createElement("td");
                        tdFacBody1.innerHTML = data[i][p][f]['factor-name'];
                        tdFacBody2 = document.createElement("td");
                        tdFacBody2.innerHTML = data[i][p][f]['overValue'];

                        trFacBody.appendChild(tdFacBody1);
                        trFacBody.appendChild(tdFacBody2);

                        trFactor.appendChild(trFacBody);
                        tbody.appendChild(trFactor);
                    }

                }
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            marker.appendChild(table);
        }
        markers.push(marker);
    }

    var htmlOverlay = [];
    var htmlLogitude = [];
    var htmlLatitude = [];
    var scratch = [];
    var position = [];
    var canvasPosition = [];
    var avalibleWidth = document.body.clientWidth;
    var canvasXBias = avalibleWidth * 0.25;
    viewer.scene.preRender.addEventListener(function () {
        for (var i = 0; i < data.length; i++) {
            htmlOverlay[i] = markers[i];
            htmlLogitude[i] = data[i].Logitude;
            htmlLatitude[i] = data[i].Latitude;
            scratch[i] = new Cesium.Cartesian2();
            position[i] = Cesium.Cartesian3.fromDegrees(htmlLogitude[i], htmlLatitude[i]);
            canvasPosition[i] = viewer.scene.cartesianToCanvasCoordinates(position[i], scratch[i]);
            if (Cesium.defined(canvasPosition[i])) {
                htmlOverlay[i].style.top = canvasPosition[i].y + 'px';
                htmlOverlay[i].style.left = (canvasPosition[i].x + canvasXBias) + 'px';
            }

        }

    });


    $(".station-warning-info").click(function () {
        var selected = $(this);
        $(this).find(".warning-factor-number,.station-name").hide("fast", function () {
            selected.find(".station-warning-table,.station-name-head,td").show();

        });
    });
    $(".station-name-head").click(function () {
        var selected = $(this);
        $(this).parents("table").hide("fast", function () {
            selected.parents("table").siblings("div").show();
        });
    });
}


function taiShiLayerClick() {

}
//List item transform


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
            $('#flyModal').modal('show')
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
        $('#clearDraws').trigger('click');
    }
}).appendTo("#drawToolsContainer");

$('<i />', {
    id: 'drawPolygon',
    "class": "toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "绘制圆形",
    "html":"<img src='images/glyphicons_095_vector_path_circle.png' class='fa'>",
    click: function () {
        $('#addCircle').trigger('click');
    }
}).appendTo("#drawToolsContainer");

$('<i />', {
    id: 'drawExtent',
    "class": "toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "title": "绘制多方形",
    "html":"<img src='images/glyphicons_096_vector_path_polygon.png' class='fa'>",
    click: function () {
        $('#addPolygon').trigger('click');
    }
}).appendTo("#drawToolsContainer");


$('<i />', {
    id: 'drawPolyline',
    "class": "toolsContainer",
    "aria-hidden": "true",
    "color": '#08ABD5',
    'background': '#888',
    "img": "url(images/glyphicons_097_vector_path_line.png)",
    "title": "绘制线",
    "html":"<img src='images/glyphicons_097_vector_path_line.png' class='fa'>",
    click: function () {
        $('#addPolyline').trigger('click');
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
        $('#addMarker').trigger('click');
    }
}).appendTo("#drawToolsContainer");

/*******************************测量工具********************************/
$(function () {
    $('<div />', {
        id: 'measureHelper',
        "class": "fa fa-road buttonMove measureAnimation",
        "background-image": "url(images/measure.png)",
        "color": '#08ABD5',
        'background-color': '#888',
        "title": "三维漫游",
        click: function () {
            $('#roamModal').modal('show');
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

loadJSON(function (response) {
    // Parse JSON string into object
    leftSideBarHeaderFooter();
    jsonData = JSON.parse(response);
    $('#sidebar').json2html(jsonData,transform.park);
    afterLeftSidebarCreation();
    // var park, site, instrument, factor;
    // for (park in jsonData) {
    //     for (site in jsonData[park]["stations"]) {
    //         for (instrument in jsonData[park]["stations"][site]["device"]) {
    //             for (factor in jsonData[park]["stations"][site]["device"][instrument]["factor"]) {
    //                 jsonData[park]["stations"][site]["device"][instrument]["factor"].sort(function(a,b){
    //                     return a["name"].localeCompare(b["name"], 'zh-Hans-CN', {sensitivity: 'accent'});
    //                 });
    //             }
    //         }
    //     }
    // }
});


    function leftSideBarHeaderFooter() {
        //Create the list
        $('<div class="pageHeader"><h4 class="panel-title"><a class="parkToggle">青海省甘河工业园区污染监测系统</a></h4></div>').prependTo('#sidebar');
        $('<div style="position: fixed;bottom: 0; width: 25%; height:25%; background-color:#0D1C32; z-index: 9999;"><div class="datetimePickerDiv"><label>起始时间：</label><input id="startDateTimepicker" class="datetimepicker" type="text"><label>截止时间：</label><input id="endDateTimepicker" class="datetimepicker" type="text"></div><div class="submitAndFavButton"><button class="submitButton">查询</button></div></div>').appendTo('#left-side-nav-panel');

        jQuery(function () {
            var today = new Date();
            today.setHours(today.getHours() - 1);
            var startDate = today;
            today = new Date();
            jQuery('#startDateTimepicker').datetimepicker({
                format: 'Y-m-d H:i:s',
                lang: 'ch',
                onShow: function (ct) {
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
    }

function startRecordingClicks() {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function(movement) {
        if (isRecordingClicks){
            var ellipsoid = Cesium.Ellipsoid.WGS84;
            var cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var point = [longitude, latitude];
                points.push(point);
                console.log(longitude + ', ' + latitude);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function setDefaultValueOfRoamWindow() {
    document.getElementById("pointsCount").value = "0";
    document.getElementById("roamTime").value = "5";
    document.getElementById("roamHeight").value = "1000";
}

function stopRecordingClicks() {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function afterLeftSidebarCreation() {
    leftSideBarConf();
    writeAttrsToFactors();
    mergeHidenBoxes();
    $($('.parkToggle')[1]).trigger('click');
        $('.panel-heading').click(function () {
            console.log('dsdf:' + (($(this).index() - 1) / 2 + 1));
        });
        $('.factor').click(function (e) {

            var factorID = $(this).attr("factorID");
            var deviceID = $(this).attr("deviceID");
            var stationID = $(this).attr("stationID");
            var parkID = $(this).attr("parkID");

            if ($(this).hasClass("selectedFactor")) {
                $(this).removeClass("selectedFactor");
                var afterFilter = [];
                afterFilter = $.grep(selectedFactorsInfo, function (obj) {
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
                var factorInfo = {"parkID": parkID, "stationID": stationID, "deviceID": deviceID, "factorID": factorID};
                selectedFactorsInfo.push(factorInfo);
            }
            console.log("selectedFactorsInfo: " + selectedFactorsInfo);
        });

        $(".submitButton").click(function () {
            console.log("succvvvv");
            var startDate = document.getElementById('startDateTimepicker').value;
            var endDate = document.getElementById('endDateTimepicker').value;
            var stringToPost = generateDataToPost(startDate, endDate);
            jQuery.ajax({
                url: "http://192.168.20.59:80/postjson",
                type: "POST",
                data: stringToPost,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    displayData(data);
                }
            });
        });

        $('#pointRoam').click(function () {
            isRecordingClicks = true;
            points = [];
            indexOfPointsToFlyTo = 0;
            startRecordingClicks();
        });
        // $('#clearRoam').click(function () {
        //     isRecordingClicks = false;
        // });
        $('#cancelRoam').click(function () {
            var camera=viewer.scene.camera;
            camera.cancelFlight();
            points = [];
            indexOfPointsToFlyTo = 0;
            setDefaultValueOfRoamWindow();
            stopRecordingClicks();
        });

        $('#loadRoam').click(function () {
            roamDuration = $('#roamTime').val();
            roam();
            stopRecordingClicks();
        });
        $('#measureHelper').click(function () {
            document.getElementById("pointsCount").value = points.length.toString();
        })

    }

    function fly(point) {
        var camera=viewer.scene.camera;
        var heightOfDestnition;
        if ($('#roamHeight').val() != 0 && $('#roamHeight').val() != null) {
            heightOfDestnition = parseFloat($('#roamHeight').val());
        } else {
            heightOfDestnition = viewer.camera.positionCartographic.height;
        }
        point = Cesium.Cartesian3.fromDegrees(point[0], point[1], heightOfDestnition);
        camera.flyTo({
            destination: point,
            complete: function () {
                // 到达位置后执行的回调函数
                console.log('到达目的地,next!');
                roam();
            },
            cancel: function () {
                // 如果取消飞行则会调用此函数
                console.log('飞行取消')
            },
            duration: roamDuration
        });
    }
    function roam() {
        if (indexOfPointsToFlyTo<points.length) {
            fly(points[indexOfPointsToFlyTo]);
            indexOfPointsToFlyTo++;
        } else if (indexOfPointsToFlyTo===points.length){
            indexOfPointsToFlyTo = 0;
            points = [];
            isRecordingClicks = false;
        }
    }
// //定义一些常量
// var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
// var PI = 3.1415926535897932384626;
// var a = 6378245.0;
// var ee = 0.00669342162296594323;
// function transformlat(lng, lat) {
//     var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
//     ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
//     return ret
// }
//
// function transformlng(lng, lat) {
//     var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
//     ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
//     return ret
// }
// function gcj02towgs84(lng, lat) {
//
//         var dlat = transformlat(lng - 105.0, lat - 35.0);
//         var dlng = transformlng(lng - 105.0, lat - 35.0);
//         var radlat = lat / 180.0 * PI;
//         var magic = Math.sin(radlat);
//         magic = 1 - ee * magic * magic;
//         var sqrtmagic = Math.sqrt(magic);
//         dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
//         dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
//         mglat = lat + dlat;
//         mglng = lng + dlng;
//         return [lng * 2 - mglng, lat * 2 - mglat]
// }

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

Cesium.loadJson('./json/exampleData.json').then(function (data) {
    displayData(data);
});

function displayData(data) {
    var stationList = data;//loadServerData(data);
    var minMaxMap = getFactorMinMaxMap(data);
    //var stationList = data;
    var baseLineHeight = 10000.0;
    var scene = viewer.scene;
    var entities = viewer.entities;
    var polylineWith = 1;
    var polylineColor = Cesium.Color.GRAY;
    var stationSphereRadius = 700;
    var machineSphereRadius = 350;
    var factorSphereRadius = 50;
    var stationSphereColor = Cesium.Color.BLUE.withAlpha(0.8);
    var machineSphereColor = Cesium.Color.YELLOW.withAlpha(0.8);
    //  var factorSphereColor = Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5);
    var factorSphereColor = Cesium.Color.fromRandom();
    var heightScaleForNearStation = 2;

    //计算每一个factor的运动轨迹的点
//2017-4-30 12:01:00
    var start = Cesium.JulianDate.fromDate(new Date(2017, 9, 30, 12));

    var stop = Cesium.JulianDate.addHours(start, 360, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.mutiplier = 60;
    viewer.timeline.zoomTo(start, stop);

    for (var i = 0; i < stationList.length; i++) {//device Node
        var stationData = stationList[i];
        if (stationData.stationId === 2 || stationData.stationId === 2) {
            stationLineHeight = (i + 5) * baseLineHeight / 20 + 1800;

        } else {
            stationLineHeight = (i + 5) * baseLineHeight / 20;
        }

        var stationInfo = queryLonLatByStationID(stationData.stationId);
        var lon = stationInfo.Longitude;
        var lat = stationInfo.Latitude;
        if(lon === undefined||lat === undefined)
        {
            console.log("undefined lon lat");
        }

        var surfacePosition = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
        var heightPosition = Cesium.Cartesian3.fromDegrees(lon, lat, stationLineHeight);

        var positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);

        var stationNodeLine = viewer.entities.add({
            name: "stationPolyline",
            polyline: {
                positions: positions,
                width: polylineWith,
                material: new Cesium.ColorMaterialProperty(polylineColor)
            }
        });
        // stationNodeLine.orientation = new Cesium.ConstantProperty(Cesium.Transforms.headingPitchRollQuaternion(heightPosition, new Cesium.HeadingPitchRoll(heading,pitch,roll)));

        var stationNode = viewer.entities.add({
            name: stationData.stationName,
            label:stationData.stationName,
            position: heightPosition,
            model:{
                uri:'models/balls/30.glb',
                scale:300
            }
        });

        var deviceList = stationData.deviceList;
        var radius = 0.01;
        var devicePositionArray = getPointArrayAroundPosition(lon,lat,radius);
        for (var j = 0; j < deviceList.length; j++) {
            //device node
            var deviceData  = deviceList[j];
            var degreeInterval = Cesium.Math.toRadians(360) / deviceData.factorList.length;

            var radians = degreeInterval * j;

            var startPosition = heightPosition;
            var machineHeight = 1000;

            //var endPosition = Cesium.Cartesian3.fromDegrees(log+, lat, 2*baseLineHeight);
            var vect3dPosition = getRandPosition(devicePositionArray);
            var deviceHeight = stationLineHeight+vect3dPosition.z*111000;
            var endPosition = Cesium.Cartesian3.fromDegrees(vect3dPosition.x, vect3dPosition.y, deviceHeight);

            var machinePositions = new Cesium.ConstantProperty([startPosition, endPosition]);
            var heading = Cesium.Math.PI_OVER_TWO;
            var pitch = Cesium.Math.PI_OVER_FOUR;
            var roll = 0.0;
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);


            var orientation = new Cesium.ConstantProperty(Cesium.Transforms.headingPitchRollQuaternion(startPosition, hpr));
            //var machinePosition =  Cesium.Cartesian3.fromDegrees(log,lat,750);
            var machineNodeLine = viewer.entities.add({
                name: "machinePolyline" + deviceData.deviceName,
                polyline: {
                    positions: machinePositions,
                    width: polylineWith,
                    material: new Cesium.ColorMaterialProperty(polylineColor)
                }
            });

            machineNodeLine.orientation = new Cesium.ConstantProperty(Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(lon, lat, 500), hpr));
            var scale = 0.5;
            var machineNode = viewer.entities.add({
                name: deviceData.deviceName,
                label:deviceData.deviceName,
                position: endPosition,
                model:{
                    uri:getRandomBallUrl(),
                    scale:150
                }

            });

            var factorList = deviceData.factorList;
         //   var factorPositionArray = getPointArrayAroundPosition(vect3dPosition.x, vect3dPosition.y, radius);
            if(!stationInfo.hasOwnProperty("radarLine"))
                continue;

            /*使得直线侧移一段距离*/
            var factorLineStartPoint = convertGeo2Vector3D(stationInfo.radarLine.point1);
            var factorLineEndPoint = convertGeo2Vector3D(stationInfo.radarLine.point2);
            var factorLineK = -1/getLineK(factorLineStartPoint,factorLineEndPoint);
            var verticalLineRadius = getVerticalLineRadius(j);

            var solutionFlag = getSolutionFlag(j);
            var factorShiftLineStartPoint = getVerticalShiftPosition(factorLineStartPoint, factorLineK, j, verticalLineRadius, solutionFlag);
            var factorShiftLineEndPoint = getVerticalShiftPosition(factorLineEndPoint, factorLineK, j, verticalLineRadius, solutionFlag);

            for (var k = 0; k < factorList.length; k++) {
                var factorData = factorList[k];
                var linePoint1 = new Vector3D();
                linePoint1.x = stationInfo.radarLine.point1.x;
                linePoint1.y = stationInfo.radarLine.point1.y;

                var linePoint2 = new Vector3D();
                linePoint2.x = stationInfo.radarLine.point2.x;
                linePoint2.y = stationInfo.radarLine.point2.y;

                var xyPosition = getCylinderPosition(factorShiftLineStartPoint,
                    factorShiftLineEndPoint,
                    k,
                    radius*0.1);

                var vectorFactorPosition = new Vector3D();
                vectorFactorPosition.x = xyPosition.x;
                vectorFactorPosition.y = xyPosition.y;
                vectorFactorPosition.z = 20;

                var minMax = minMaxMap[factorData.factorName];
                var randomTimeLineIndex = Math.floor(Math.random()*(factorData.timeLineData.length-1));
                var examData= factorData.timeLineData[randomTimeLineIndex];
                var scaleFactor = (examData.value-minMax.min)/(minMax.max- minMax.min);
                var cylinderHeight = scaleFactor*10000;

                var factorPosition = Cesium.Cartesian3.fromDegrees(vectorFactorPosition.x, vectorFactorPosition.y, vectorFactorPosition.z+cylinderHeight/2);

                var colorValue = 1*scaleFactor;
                console.log(minMax);
                console.log("scaleFactor: "+scaleFactor);

                var factorEntity = viewer.entities.add({
                    name:"factor",
                    position: factorPosition,
                    cylinder:{
                        topRadius:80,
                        bottomRadius:80,
                        length:cylinderHeight,
                        material : new Cesium.Color(1,1-colorValue,1-colorValue),
                        outline : false
                    }
                });

                var labelPosition = Cesium.Cartesian3.fromDegrees(vectorFactorPosition.x, vectorFactorPosition.y, vectorFactorPosition.z + cylinderHeight/2 + cylinderHeight*0.5+20);

                var labelEntity = viewer.entities.add({
                    position:labelPosition,
                    label:{
                        id: factorData.factorName,
                        text:factorData.factorName,
                        font:'30px YaHei',
                        fillColor:Cesium.Color.AQUA,
                        scaleByDistance:new Cesium.NearFarScalar(1.5e2, 1.5,20000, 0.0)
                    }
                });
            }
        }
    }
    viewer.zoomTo(viewer.entities);
}
