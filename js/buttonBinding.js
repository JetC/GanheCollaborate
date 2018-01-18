function settingFunc() {
    $('#fly').click(function(){
        $('#flyModal').modal('show')
    });
    $('#search').click(function(){
        $('#searchModal').modal('show');
    });
    $('#roam').click(function(){
        $('#roamModal').modal('show')
    });

    $('#measure').click(function () {
        var status = $('#toolbar').css('visibility');
        if (status == 'hidden') {
            $('#toolbar').css('visibility', 'visible')
        }
        else if (status == 'visible') {
            $('#toolbar').css('visibility', 'hidden')
        }
    });

    $('#loadFly').click(function () {
        var lon = parseFloat(document.getElementById('lonFly').value)
        var lat = parseFloat(document.getElementById('latFly').value)
        var height = parseFloat(document.getElementById('heightFly').value)
        var scene = viewer.scene;
        if ((lon == '') || (lat == '') || (height == '')) {
            alert('请填写完整位置信息')
        }
        else if ((isNaN(lon) == true) || (isNaN(lat) == true) || (isNaN(height) == true)) {
            alert('输入的位置信息有误')
        }
        else {
            if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
                alert('输入的位置信息有误')
            }
            else {
                scene.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)})
            }
        }
        $('#flyModal').modal('hide');
    });
}