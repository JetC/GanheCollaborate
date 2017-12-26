/**
 * Created by WUYONGXING on 12/15/2017.
 */

var sationPositionArray = [
    {
        "stationID": 5, "stationName": "宜化2号站", "Latitude": 36.89525, "Longitude": 101.75372,
        "radarLine":
         {
            "point1":
            {
                "Latitude":36.89511380542349,
                "Longitude":101.751649436784
            },
             "point2":
             {
                 "Latitude":36.89512672031643,
                 "Longitude":101.7483930089123
             }
         }
    },
    {
        "stationID": 7, "stationName": "天泰站", "Latitude": 36.51549, "Longitude": 101.52896,
        "radarLine":
        {
            "point1":
             {
                 "Latitude":36.51568816920489,
                 "Longitude":101.5271080209351
             },
            "point2":
             {
                 "Latitude":36.51326183648346,
                 "Longitude":101.528789001225
             }
        }
    },
    {
        "stationID": 1007, "stationName": "东区污水厂站", "Latitude": 36.58916, "Longitude": 101.52756
    },
    {
        "stationID": 1008, "stationName": "苏锡子站", "Latitude": 36.50519, "Longitude": 101.53191
    },
    {
        "stationID": 1009, "stationName": "西区污水厂站", "Latitude": 36.63168, "Longitude": 101.50297
    },
    {
        "stationID": 4, "stationName": "宜化1号站", "Latitude": 36.89864, "Longitude": 101.75441
    },
    {
        "stationID": 1010, "stationName": "桂鲁站", "Latitude": 36.54012, "Longitude": 101.48518
    },
    {
        "stationID": 1, "stationName": "管委会站", "Latitude": 36.54695, "Longitude": 101.52028,
        "radarLine":
            {
                "point1":
                    {
                        "Latitude":36.54709711668374,
                        "Longitude":101.5183848307927
                    },
                "point2":
                    {
                        "Latitude":36.54612924006248,
                        "Longitude":101.5198337010421
                    }
            }
    },
    {
        "stationID": 8, "stationName": "湟中县子站", "Latitude": 36.49424, "Longitude": 101.56043
    },
    {
        "stationID": 2, "stationName": "海纳1号站", "Latitude": 36.55809, "Longitude": 101.49935,
        "radarLine":
            {
                "point1":
                    {
                        "Latitude":36.55816458035207,
                        "Longitude":101.4973528426355
                    },
                "point2":
                    {
                        "Latitude":36.55864660900222,
                        "Longitude":101.4944625959304
                    }
            }
    },
    {
        "stationID": 3, "stationName": "信禾站", "Latitude": 36.55657, "Longitude": 101.87368,
        "radarLine":
            {
                "point1":
                    {
                        "Latitude":36.55688106998903,
                        "Longitude":101.871921362764
                    },
                "point2":
                    {
                        "Latitude":36.55941805542078,
                        "Longitude":101.874765693914
                    }
            }
    },
    {
        "stationID": 6, "stationName": "海纳2号站", "Latitude": 36.55789, "Longitude": 101.49936,
        "radarLine":
            {
                "point1":
                    {
                        "Latitude":36.55795226468761,
                        "Longitude":101.4974003640356
                    },
                "point2":
                    {
                        "Latitude":36.55716615191464,
                        "Longitude":101.50085873911
                    }
            }
    }
];

function queryLonLatByStationID(stationID) {
    for (var i=0;i<sationPositionArray.length;i++) {
        var station = sationPositionArray[i];
        if (station.stationID === stationID) {
            return station;
        }
    }
    return {};
}

function StationData()
{
    this.stationId =0;
    this.stationName="";
    this.longitude=0;
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
                factorData.value
            }else if(prop ==="")
            {

            }else if(prop === "")
            {

            }
        }
    }
}


function transformServer(data)
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
function getFactorMinMaxMap(formatedData) {
    var factorMap={};
    var minMaxMap={};
    var i, j, k,l;
    var stationData, deviceData, factorData,timeLineData;
    var minMax;
    for(i=0;i<formatedData.length;i++)
    {
        stationData = formatedData[i];
        for(j=0;j<stationData.deviceList.length;j++)
        {
            deviceData = stationData.deviceList[j];
            for(k=0;k<deviceData.factorList.length;k++)
            {
                factorData = deviceData.factorList[k];
                if(minMaxMap[factorData.factorName]===undefined)
                {
                    minMax ={};
                    minMax.min = Number.MAX_VALUE;
                    minMax.max = Number.MIN_VALUE;
                    minMaxMap[factorData.factorName] = minMax;
                }else minMax =  minMaxMap[factorData.factorName];
                for(l=0;l<factorData.timeLineData.length;l++)
                {
                    timeLineData = factorData.timeLineData[l];
                    minMax.min = Math.min(timeLineData.value, minMax.min);
                    minMax.max = Math.max(timeLineData.value, minMax.max);
                }
            }
        }
    }
    return minMaxMap;
}