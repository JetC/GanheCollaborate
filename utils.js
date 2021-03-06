/**
 * Created by WUYONGXING on 12/19/2017.
 */
function computeCircularFlight(start,lon, lat, height) {

    var property = new Cesium.SampledPositionProperty();

    var originalPositionsArray = calculatePositions();


    var randomRotationAngel = generateRandomRotationAngel();


    var rotationMatrix = caculateRotationMatrix(randomRotationAngel);


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
        if(j===4)
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

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'ParkStructure.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/*
*
* index number
* */
function getVerticalLineRadius(index) {
    return Math.floor((index+1)/2)*0.003;
}

/*
* index number
**/
function getSolutionFlag(index) {
    return Math.pow(-1,Math.floor(index+1));
}

/*
*
* startPointVect Vector3D
* endPointVect Vector3D
* index number
* radius number
* */
function  getLineK(startPointVector, endPointVector)
{
    return (endPointVector.y - startPointVector.y)/(endPointVector.x - startPointVector.x);
}

/*
*
* startPoint3D Vector3D
* k number
* index number
* radius number
* solutionFlag number
* */
function getVerticalShiftPosition(startPoint3D, k, index, radius, solutionFlag) {
    var x1,y1,b,r;
    x1 = startPoint3D.x;
    y1 = startPoint3D.y;
    b = y1-x1*k;
    var calIndex = Math.floor((index+1)/2);
    r = (calIndex-1)*2*radius+radius;
    if(r===0)
        return startPoint3D;

    var A,B,C;
    A = 1+k*k;
    B = -2*x1+2*k*b-2*y1*k;
    C = x1*x1+b*b-2*y1*b+y1*y1-r*r;

    var solve1=new Vector3D(),solve2=new Vector3D();
    solve1.x = (-B+Math.sqrt(B*B - 4*A*C))/(2*A);
    solve1.y = k*solve1.x+b;

    solve2.x = (-B-Math.sqrt(B*B - 4*A*C))/(2*A);
    solve2.y = k*solve2.x+b;

    if(solutionFlag<0)
        return solve1;
    else return solve2;
}


/*
*
* startPointVector Vector3D
* endPointVector Vector3D
* index number
* radius number
* */
function getCylinderPosition(startPoint3D,endPoint3D,index,radius)
{
    var startPoint = new Vector3D();
    startPoint.x = startPoint3D.x;
    startPoint.y = startPoint3D.y;
    radius*=1;
    var endPoint = new Vector3D();
    endPoint.x = endPoint3D.x;
    endPoint.y = endPoint3D.y;

    var x1,y1,x2,y2,k,b,r;
    x1 = startPoint.x;
    y1 = startPoint.y;
    x2 = endPoint.x;
    y2 = endPoint.y;
    k = (y2-y1)/(x2-x1);
    b = y1-x1*k;
    var calIndex = index+1;//start at 1.
    r = (calIndex-1)*2*radius+radius;
    console.log("r:"+r);
    var A,B,C;
    A = 1+k*k;
    B = -2*x1+2*k*b-2*y1*k;
    C = x1*x1+b*b-2*y1*b+y1*y1-r*r;

    var solve1={},solve2={};
    solve1.x = (-B+Math.sqrt(B*B - 4*A*C))/(2*A);
    solve1.y = k*solve1.x+b;

    solve2.x = (-B-Math.sqrt(B*B - 4*A*C))/(2*A);
    solve2.y = k*solve2.x+b;

    var vector1={},vector2={};
    vector1.x = x2 - x1;
    vector1.y = y2 - y1;
    vector2.x = solve1.x - x1;
    vector2.y = solve1.y - y1;
    var realSolve={};

    if(vector1.x*vector2.x+vector1.y*vector2.y>0)//is the solve x,y
    {
        realSolve.x = solve1.x;
        realSolve.y = solve1.y;
    }else
    {
        realSolve.x = solve2.x;
        realSolve.y = solve2.y;
    }

    return realSolve;
}

function getRandomBallUrl ()
{
    var randFloat =  Math.random()*28+1;
    var randInt = Math.floor(randFloat);
    return 'models/balls/'+ randInt+'.glb';
}


