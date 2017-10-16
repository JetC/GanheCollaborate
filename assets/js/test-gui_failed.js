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
        Sensor_Observations: 'combo1',
        HumanImpact: 'combol',

    };

    var air_param = {
        switch: true,
        3D_Scene: 'combo1',
        Simulations: 'combol',
        Real-time_Observations: 'combol',
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
    var ds = gui.addFolder('Data Access');
    var people = ds.addFolder('Extreme Air Pollution Event');
    people.add(people_param, 'Strength').step(5);
    people.add(people_param, 'growthSpeed', 0, 20);
    people.add(people_param, 'maxSize').min(0).step(0.25);
    people.add(people_param, 'Energy', [ 'Carbon Dioxide Concentration', 'Fossil Fuel', 'Carbon Tracker' ] );
    people.add(people_param,'Human_Statistics',['Population growth rate','Population Density','energy use']);
    people.add(people_param, "switch").onChange(function(val){
        alert(val);
    });

    var Land = ds.addFolder('Data Downloads');
    Land.add(land_param, 'Sensor_Observations', ['Agriculture',  'Land Vegetation', 'Land Surface Temperature' ] );
    Land.add(land_param, "switch").onChange(function(val){
        alert(val);
    });

    var Air = ds.addFolder('Data Visualization');
    Air.add(air_param, '3D_Scene', [ 'GEOS-5 Model-Carbon Dioxide Concentration', 'FIM Chem Model-Aerosols', '	Carbon Flux' ] )
    Air.add(air_param, 'Simulations', ['CCSM-Temperature Change',  'GFDL-Temperature Change' ] );
    Air.add(air_param, 'Real-time_Observations', ['Real-time Weather Models','Cloud',  'Wind', 'Precipitation'] );
    Air.add(air_param, "switch").onChange(function(val){
        alert(val);
    });

    var Water = ds.addFolder('Analysis');
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