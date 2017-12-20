/**
 * Created by WUYONGXING on 12/19/2017.
 */
function computeCircularFlight(start,lon, lat, height) {

    var property = new Cesium.SampledPositionProperty();
    //计算标准圆形轨道的9个差值点
    var originalPositionsArray = calculatePositions();

    //对于传进来的仪器位置，随机生成空间旋转圆形轨道的旋转角度
    var randomRotationAngel = generateRandomRotationAngel();

    //返回一个3x3的标准差值点矩阵
    var rotationMatrix = caculateRotationMatrix(randomRotationAngel);

    //计算旋转后的9x3的空间差值点坐标
    var positionsArray = squareMatrixMultiply(originalPositionsArray, rotationMatrix);

    for (var i = 0; i < positionsArray.length; i++) {
        var time = Cesium.JulianDate.addSeconds(start, i * 360 / positionsArray.length, new Cesium.JulianDate());
        var position = Cesium.Cartesian3.fromDegrees(lon + positionsArray[i][0], lat + positionsArray[i][1], height + positionsArray[i][2] * 1115);
        property.addSample(time, position);

        //Also create a point for each sample we generate.
        /*viewer.entities.add({
         position : position,
         point : {
         pixelSize : 8,
         color : Cesium.Color.TRANSPARENT,
         outlineColor : Cesium.Color.YELLOW,
         outlineWidth : 3
         }
         });
         */
    }
    return property;
}

//随机生成一组绕轴旋转的角度值，分别为Log方向：α，lat方向：β，z方向：γ
function generateRandomRotationAngel() {
    var a= Cesium.Math.randomBetween(0, 1) * Cesium.Math.PI;
    var b= Cesium.Math.randomBetween(0, 1) * Cesium.Math.PI;
    var r = Cesium.Math.randomBetween(0, 1) * Cesium.Math.PI;
    var randomRotationAngelArray = new Array(3);
    randomRotationAngelArray[0] = a;
    randomRotationAngelArray[1] = b;
    randomRotationAngelArray[2] = r;

    return randomRotationAngelArray;
}

function create2DArray(rows, cols)
{
    var array = [];
    var i;
    for(i=0;i<rows;i++)
    {
        array.push(new Array(cols));
    }
    return array;
}

/*******************************计算factor围绕小球旋转矩阵********************************/

/*传入随机角度α，β，γ计算其对应旋转矩阵*/
function caculateRotationMatrix(randomRotationAngelArray) {
    var a = randomRotationAngelArray[0];
    var b = randomRotationAngelArray[1];
    var r = randomRotationAngelArray[2];
    var cosa = Math.cos(a);
    var sina = Math.sin(a);
    var cosb= Math.cos(b);
    var sinb = Math.sin(b);
    var cosr = Math.cos(r);
    var sinr = Math.sin(r);

    var a1 = cosa * cosr - cosb * sina * sinr;
    var a2 = sina * cosr + cosb * cosa * sinr;
    var a3 = sinb * sinr;
    var a4 = -cosa * sinr - cosb * sina * cosr;
    var a5 = -sina * sinr + cosb* cosa * cosr;
    var a6 = sinb * cosr;
    var a7 = sinb * sina;
    var a8 = -sinb * cosa;
    var a9 = cosb;

    var rotationMatrix = create2DArray(3,3);

    rotationMatrix[0][0] = a1;
    rotationMatrix[0][1] = a2;
    rotationMatrix[0][2] = a3;
    rotationMatrix[1][0] = a4;
    rotationMatrix[1][1] = a5;
    rotationMatrix[1][2] = a6;
    rotationMatrix[2][0] = a7;
    rotationMatrix[2][1] = a8;
    rotationMatrix[2][2] = a9;

    return rotationMatrix;
}

/*生成在标准坐标系中的9个z轴值为零的均分差值点的坐标，第9个值为起始值，使形成闭合环路*/
function calculatePositions() {

    var arry = create2DArray(9,3);
    var number = 0.006;
    arry[0][0] = number;
    arry[0][1] = 0;
    arry[0][2] = 0;
    arry[1][0] = Math.sqrt(2) / 2 * number;
    arry[1][1] = Math.sqrt(2) / 2 * number;
    arry[1][2] = 0;
    arry[2][0] = 0;
    arry[2][1] = number;
    arry[2][2] = 0;
    arry[3][0] = -Math.sqrt(2) / 2 * number;
    arry[3][1] = Math.sqrt(2) / 2 * number;
    arry[3][2] = 0;
    arry[4][0] = -number;
    arry[4][1] = 0;
    arry[4][2] = 0;
    arry[5][0] = -Math.sqrt(2) / 2 * number;
    arry[5][1] = -Math.sqrt(2) / 2 * number;
    arry[5][2] = 0;
    arry[6][0] = 0;
    arry[6][1] = -number;
    arry[6][2] = 0;
    arry[7][0] = Math.sqrt(2) / 2 * number;
    arry[7][1] = -Math.sqrt(2) / 2 * number;
    arry[7][2] = 0;
    arry[8][0] = number;
    arry[8][1] = 0;
    arry[8][2] = 0;

    return arry;
}


function squareMatrixMultiply(A, B) {
    var n = A.length;
    var C = create2DArray(9,3);

    for (var i = 0; i < n; i++) {

        for (var j = 0; j < A[i].length; j++) {
            C[i][j] = 0;
            for (var k = 0; k < A[i].length; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

//return vector3D
function getRandPosition(positionArray)
{
    var v = Math.random();
    var index = parseInt(v*(positionArray.length-1));
    return positionArray[index];
}

function getPointArrayAroundPosition(lon, lat, radius)
{
    var positionArray = [];
    var count = 9;
    var radiusInter = radius/4;
    var i, j,vect,vect1, o,b1,tmpR;

    for(j=0;j<=4;j++)
    {
        if(j==4)
        {
            vect = new Vector3D();
            vect.x = 0+lon;
            vect.y = 0+lat;
            vect.z = radius;
            positionArray.push(vect);

            vect1 = new Vector3D();
            vect1.x = vect.x;
            vect1.y= vect.y;
            vect1.z = -radius;

            positionArray.push(vect1);
            continue;
        }

        b1 = radiusInter * j;
        tmpR = Math.sqrt(radius * radius - b1 * b1);

        for (i = 0; i < count; i++) {
            vect = new Vector3D();
            o = i * 40 / Math.PI;
            vect.x = tmpR * Math.cos(o) + lon;
            vect.y = tmpR * Math.sin(o) + lat;
            vect.z = b1;
            positionArray.push(vect);

            if(j!==0)
            {
                vect1 = new Vector3D();
                vect1.x = vect.x;
                vect1.y = vect.y;
                vect1.z = -1 * vect.z;
                positionArray.push(vect1);
            }
        }
    }


    return positionArray;
}



