/**
 * Created by WUYONGXING on 12/15/2017.
 */

var sationPositionArray = [
    {
        "stationID": 5, "stationName": "宜化2号站", "Latitude": 36.89525, "Lontitude": 101.75372
    },
    {
        "stationID": 7, "stationName": "天泰站", "Latitude": 36.51549, "Logitude": 101.52896
    },
    {
        "stationID": 1007, "stationName": "东区污水厂站", "Latitude": 36.58916, "Logitude": 101.52756

    },
    {
        "stationID": 1008, "stationName": "苏锡子站", "Latitude": 36.50519, "Logitude": 101.53191

    },
    {
        "stationID": 1009, "stationName": "西区污水厂站", "Latitude": 36.63168, "Logitude": 101.50297

    },
    {
        "stationID": 4, "stationName": "宜化1号站", "Latitude": 36.89864, "Logitude": 101.75441

    },
    {
        "stationID": 1010, "stationName": "桂鲁站", "Latitude": 36.54012, "Logitude": 101.48518

    },
    {
        "stationID": 1, "stationName": "管委会站", "Latitude": 36.54695, "Logitude": 101.52028
    },
    {
        "stationID": 8, "stationName": "湟中县子站", "Latitude": 36.49424, "Logitude": 101.56043
    },
    {
        "stationID": 2, "stationName": "海纳1号站", "Latitude": 36.55809, "Logitude": 101.49935
    },
    {
        "stationID": 3, "stationName": "信禾站", "Latitude": 36.55657, "Logitude": 101.87368
    },
    {
        "stationID": 6, "stationName": "海纳2号站", "Latitude": 36.55789, "Logitude": 101.49936
    }
];

function queryLonLatByStationID(stationID) {
    for (var i=0;i<sationPositionArray.length;i++) {
        var station = sationPositionArray[i];
        if (station.stationID === stationID) {
            return {
                "latitude": station.Latitude,
                "lontitude": station.Logitude,
                "stationName":station.stationName
            }
        }
    }
    return {};
}

function StationData()
{
    this.stationId =0;
    this.stationName="";
    this.lontitude=0;
    this.latitude=0;
    this.deviceList=[];
}

function DeviceData()
{
    this.deviceId = 0;
    this.deviceName="";
    this.factorList=[];
}

function FactorData()
{
    this.factorId=0;
    this.factorName="";
    this.timeLineData =[];
}

function TimeLineData()
{
    this.time= "";
    this.unit="";
    this.value="";
}

function Vector3D()
{
    this.x = 0;
    this.y = 0;
    this.z = 0;
}


function getWeatherFactorData(unitData)
{
    var factors=[];
    for(var prop in unitData)
    {
        if(unitData.hasOwnProperty(prop))
        {
            if(prop === "averageTemprature")
            {
                var factorData = new FactorData();
                factorData.factorId = -1;
                factorData.factorName="平均温度";
                factorData.value
            }else if(prop ==="")
            {

            }else if(prop === "")
            {

            }
        }
    }
}


function loadServerData(data)
{
    var stationMap = {};
    var i, j, k,prop;
    var deviceInfo,stationData, stationIdStr,deviceData,factorList;
    var factorInfo,factorData,timeLineList,timeLineInfo,timeLineData, stationList;
    var stationTmpData;
   for(i=0;i<data.length;i++)
    {
        deviceInfo = data[i];
        stationData= new StationData();
        stationIdStr = deviceInfo.stationID.toString();
        if(stationMap[stationIdStr]==undefined)
        {
            stationData.stationId = deviceInfo.stationID;
            stationData.stationName = deviceInfo.stationName;
            stationMap[stationIdStr] = stationData;
        }else
        {
            stationData = stationMap[stationIdStr];
        }

        deviceData =  new DeviceData();

        deviceData.deviceId = deviceInfo.deviceID;
        deviceData.deviceName = deviceInfo.deviceName;
        deviceData.factorList = [];

        if(deviceInfo.hasOwnProperty("factors"))
        {
            factorList = deviceInfo["factors"];
            for(j=0;j<factorList.length;j++)
            {
                factorInfo = factorList[j];
                factorData = new FactorData();
                factorData.factorId = factorInfo.factorID;
                factorData.factorName = factorInfo.factorName;
                factorData.timeLineData =[];

                timeLineList = factorInfo.data;
                for(k=0;k<timeLineList.length;k++)
                {
                    timeLineInfo = timeLineList[k];
                    timeLineData = new TimeLineData();
                    timeLineData.time = timeLineInfo.time;
                    timeLineData.unit = timeLineInfo.unit;
                    timeLineData.value = timeLineInfo.value;
                    factorData.timeLineData.push(timeLineData);
                }
                deviceData.factorList.push(factorData);
            }
            stationData.deviceList.push(deviceData);
        }
    }

    stationList=[];
    for(prop in stationMap)
    {
        if(stationMap.hasOwnProperty(prop))
        {
             stationTmpData = stationMap[prop];
             stationList.push(stationTmpData);
        }
    }
    return stationList;
}
