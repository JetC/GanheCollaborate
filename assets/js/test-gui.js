$(document).ready(function(){

    var viewer = new Cesium.Viewer('cesiumContainer');
    var people_param = {
        switch: true,
        Strength: 0,
        growthSpeed: 0.0,
        maxSize: 1.0,
        Energy: 'combo1',
        Human_Statistics: 'combol'
    };

    var land_param = {
        switch: true,
        传感器数据: 'combo1',
        HumanImpact: 'combol'
    };

    var air_param = {
        switch: true,
        三维场景展示: 'combo1',
        数据模型模拟: 'combol',
        实时监测结果:'combol'
    };

    var water_param = {
        switch: true,
        Sea: 'combo1'
    };

    var Extras_param = {
        switch: true,
        Overlays : 'combo1'
    };

    var gui = new dat.GUI({autoPlace: false});
    //var gui = new dat.GUI();
    //gui.domElement.id = 'gui';
    var obj = { add:function(){ console.log("clicked") }};
    gui.add(obj,'add');
    
    var ds = gui.addFolder('数据集');
    var people = ds.addFolder('污染事件');
    people.add(people_param, 'Strength').step(5);
    people.add(people_param, 'growthSpeed', 0, 20);
    people.add(people_param, 'maxSize').min(0).step(0.25);
    people.add(people_param, 'Energy', [ 'Carbon Dioxide Concentration', 'Fossil Fuel', 'Carbon Tracker' ] );
    people.add(people_param,'Human_Statistics',['Population growth rate','Population Density','energy use']);
    people.add(people_param, "switch").onChange(function(val){
        alert(val);
    });

    var Land = ds.addFolder('数据加载');
    Land.add(land_param, '传感器数据', ['Agriculture',  'Land Vegetation', 'Land Surface Temperature' ] );
    Land.add(land_param, "switch").onChange(function(val){
        alert(val);
    });

    var Air = ds.addFolder('数据可视化');
    Air.add(air_param, '三维场景展示', [ 'GEOS-5 Model-Carbon Dioxide Concentration', 'FIM Chem Model-Aerosols', '	Carbon Flux' ] )
    Air.add(air_param, '数据模型模拟', ['CCSM-Temperature Change',  'GFDL-Temperature Change' ] );
    Air.add(air_param, '实时监测结果', ['Real-time Weather Models','Cloud',  'Wind', 'Precipitation'] );
    Air.add(air_param, "switch").onChange(function(val){
        alert(val);
    });

    var Water = ds.addFolder('Water');
    Water.add(water_param, 'Sea', ['Sea Surface Temperature Model',  'Sea Surface Height', 'Sea Surface Temperature' ] );
    Water.add(water_param, "switch").onChange(function(val){
        alert(val);
    });

    var Extras = ds.addFolder('Extras');
    Extras.add(Extras_param, 'Overlays', ['Terrain' ] );
    Extras.add(Extras_param, "switch").onChange(function(val){
        alert(val);
    });


    $('#gui').append(gui.domElement)
});