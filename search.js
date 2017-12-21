

function leftSideBarConf(){
    var scTop = 0,
        //Initial position
        beginH = 0,
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        classN,
        num;
    var hidenBoxCalculatedWidth = 0;
    hidenBoxCalculatedWidth;
    $('.side-li > li').hover(
        function(){
            hidenBoxCalculatedWidth;
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
            hidenBoxCalculatedWidth;
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
}
function mergeHidenBoxes() {
    var hidenBoxesArray = $('.hiden-box');
    for (var i = 1;i < hidenBoxesArray.length;i++) {
        var singleHidenBox = hidenBoxesArray[i];
        for (var j=0; j < singleHidenBox.children.length; j++) {
            hidenBoxesArray[0].append(singleHidenBox.children[j]);
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

};
//List item transform
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

function displayData(data) {
    var stationList = loadServerData(data);
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


        var stationExtraInfo = queryLonLatByStationID(stationData.stationId);
        var lon = stationExtraInfo.lontitude;
        var lat = stationExtraInfo.latitude;


        /*     var extent = Cesium.Rectangle.fromDegrees(100.334056, 3.522957,101.586551, 38.203119);
         Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
         Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
         viewer.camera.setView({
         destination: extent
         });*/
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
        var getRandomBallUrl = function()
        {
            var randFloat =  Math.random()*28+1;
            var randInt = parseInt(randFloat);
            return 'models/balls/'+ randInt+'.glb';
        };
        var stationNode = viewer.entities.add({
            name: stationData.stationName,
            label:stationData.stationName,
            position: heightPosition,
            model:{
                uri:'models/balls/30.glb',
                scale:300
            }
        });
        //Add the entity to the collection.
        // entities.add(entity);
        // stationNode.orientation = new Cesium.ConstantProperty(Cesium.Transforms.headingPitchRollQuaternion(heightPosition, new Cesium.HeadingPitchRoll(heading,pitch,roll)));
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
            var vect3dPosition = getRandPosition(devicePositionArray)
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
            var factorPositionArray = getPointArrayAroundPosition(vect3dPosition.x, vect3dPosition.y, radius);
            for (var k = 0; k < factorList.length; k++) {
                var factorData = factorList[k];
                // var property = computeCircularFlight(start, lon + radius * Math.cos(radians), lat + radius * Math.sin(radians), stationLineHeight + Math.sin(Cesium.Math.toRadians(30)) * machineHeight);
                //  alert(property);1
                var vectFactorPosition = getRandPosition(factorPositionArray);
                var factorPosition = Cesium.Cartesian3.fromDegrees(vectFactorPosition.x, vectFactorPosition.y, deviceHeight+vectFactorPosition.z*111000);

                var factorEntity = viewer.entities.add({
                    name:"factor",

                    //设置entity生存时间与
                    // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    //     start: start,
                    //      stop: stop
                    // })]),

                    //Use our computed positions
                    position: factorPosition,

                    //Automatically compute orientation based on position movement.
                    //  orientation: new Cesium.VelocityOrientationProperty(property),

                    //Load the Cesium plane model to represent the entity
                    model:{
                        uri:getRandomBallUrl(),
                        scale:60
                    }
                    /*
                     ,

                     //Show the path as a pink line sampled in 1 second increments.
                     path : {
                     resolution : 1,
                     material : new Cesium.PolylineGlowMaterialProperty({
                     glowPower : 0.1,
                     color : Cesium.Color.YELLOW
                     }),
                     width : 1
                     }
                     */
                });

                /* factorEntity.position.setInterpolationOptions({
                 interpolationDegree: 2,
                 interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
                 });*/

                /*
                 var Pai = Cesium.Math.PI;
                 var factorNode;

                 var factorSphereRadiusPlus =100;


                 //产生一个在0-2派之间的随机角度，控制高度角
                 var factorSpheres_randomAlpha = Cesium.Math.randomBetween(-1,1)*Pai;



                 //产生一个在0-派之间的随机角度控制平面间的旋转
                 var factorSpheres_randomBeta = Cesium.Math.nextRandomNumber()*Pai*2;
                 var factorSpheres_Lineradius = 0.01;
                 var factorNode_log = log+radius*Math.cos(radians)+factorSpheres_Lineradius*Math.cos(factorSpheres_randomAlpha)*Math.sin(factorSpheres_randomBeta);
                 var factorNode_lat = lat+radius*Math.sin(radians)+factorSpheres_Lineradius*Math.cos(factorSpheres_randomAlpha)*Math.cos(factorSpheres_randomBeta);
                 var factorNode_height = stationLineHeight*(Math.sin(Cesium.Math.toRadians(35))+0.8)+Math.sin(factorSpheres_randomAlpha)*1200;

                 var factorNode_endFactorPosition = Cesium.Cartesian3.fromDegrees( factorNode_log,factorNode_lat,factorNode_height);

                 var startFactorPosition = endPosition;
                 var factorDegreeInterval = Cesium.Math.toRadians(360)/data[i]["list"][j]["machineData"].length;
                 var factorRadians = factorDegreeInterval*k;
                 // var endFactorPosition = Cesium.Cartesian3.fromDegrees(log+radius*Math.cos(radians), lat+radius*Math.sin(radians),baseLineHeight*(2));
                 //var endFactorPosition = Cesium.Cartesian3.fromDegrees(log+radius*Math.cos(radians)+scale*radius*Math.cos(factorRadians), lat+radius*Math.sin(radians)+scale*radius*Math.sin(factorRadians),factorHeight);
                 //var factorPositions = new Cesium.ConstantProperty([startFactorPosition, factorNode_endFactorPosition]);


                 // var factorNodeLine = viewer.entities.add({
                 //  name:"factorPolyline"+data[i]["list"][j]["machineData"][k]["data"][0]["value"],
                 //  polyline:{
                 //     positions:factorPositions,
                 //     width:polylineWith,
                 //     material:new Cesium.ColorMaterialProperty(polylineColor)
                 //  }
                 // });

                 factorNode = viewer.entities.add({
                 name:"factorSphere"+data[i]["list"][j]["machineData"][k]["data"][0]["value"],
                 position: factorNode_endFactorPosition,
                 orientation:orientation,
                 ellipsoid: {
                 radii: new Cesium.Cartesian3(factorSphereRadius,factorSphereRadius, factorSphereRadius),
                 outline: false,
                 material:  Cesium.Color.fromRandom()
                 }

                 });
                 if (data[i]["list"][j]["machineData"][k]["data"][0]["warningGrade"]==="5"){
                 factorNodeWarning = viewer.entities.add({
                 name:"factorSphereWarning"+data[i]["list"][j]["machineData"][k]["data"][0]["value"],
                 position: factorNode_endFactorPosition,
                 orientation:orientation,
                 ellipsoid: {
                 radii: new Cesium.Cartesian3(factorSphereRadius+100,factorSphereRadius+100, factorSphereRadius+100),
                 outline: false,
                 material:Cesium.Color.RED.withAlpha(0.3)
                 }

                 });
                 }
                 */
            }
        }
    }

//var result = squareMatrixMultiply(calculatePositions(), caculateRotationMatrix());

    viewer.zoomTo(viewer.entities);

}

var selectedFactorsInfo;
selectedFactorsInfo = [];

