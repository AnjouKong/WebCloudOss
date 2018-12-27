
var peopleData = [];
var intervalTime = 60 * 1000;
var param = JSON.parse(getQueryString('peopleData'));
// console.log(param);

// 飞机图标矢量图
var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

// 迁徙数据改写为地图中的连线形式
var LineCities = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var dataItem = data[i];
    var fromCoord = dataItem.fromCenter.split(',');
    var toCoord = dataItem.toCenter.split(',');
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem.fromName,
        toName: dataItem.toName,
        coords: [fromCoord, toCoord]
      });
    }
  }
  return res;
};

function init() {
  var series = [];
  [['营口', peopleData]].forEach(function (item, i) {
    series.push(
      { // 高亮迁徙动画效果
        name: item[0],
        type: 'lines',
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: '#fff',
          symbolSize: 3
        },
        lineStyle: {
          normal: {
            color: '#46bee9',
            width: 0,
            curveness: 0.2
          }
        },
        data: LineCities(item[1])
      },
      { // 迁徙线飞机效果
        name: item[0],
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          symbol: planePath,
          symbolSize: 15
        },
        lineStyle: {
          normal: {
            color: '#46bee9',
            width: 1,
            opacity: 0.6,
            curveness: 0.2
          }
        },
        data: LineCities(item[1])
      },
      { // 高亮迁入地区  from
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {brushType: 'stroke'},
        label: {
          normal: { show: true, position: 'right', formatter: '{b}' }
        },
        symbolSize: function (val) {
          return (8 + (val[2] / 20)); // 圆圈半径  最小8
        },
        itemStyle: {
          normal: {color: '#46bee9'}
        },
        /* 填装迁徙数据 */
        data: item[1].map(function (dataItem) {
          if (dataItem.fromName) {
            // console.log(dataItem);
            return {
              name: dataItem.fromName,
              value: dataItem.fromCenter.split(',').concat(dataItem.fromValue),
            };
          }
        })
      },
      { // 高亮迁出地区 to
        name: item[0],
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 3,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: { show: true, position: 'right', formatter: '{b}' }
        },
        symbolSize: function (val) {
          // console.log(val);
          // return val[2] / 8;
          return null;
        },
        itemStyle: {
          normal: {
            color: '#e97d18',
          }
        },
        /* 填装迁徙数据 */
        data: item[1].map(function (dataItem) {
          if (dataItem.toName) {
            return {
              name: dataItem.toName,
              value: dataItem.toCenter.split(',').concat(0),
            };
          }
        })
      });
  });

  var myChart = echarts.init(document.getElementById('moveMap'));

  option = {
    // backgroundColor: '#404a59',
    title : {
      text: '酒店入住人员分布',
      x: 'center',
      y: 37,
      textStyle : {
        color: '#fff'
      }
    },
    tooltip : {
      trigger: 'item',
      formatter: function (params) {
        if(params.data.value){
          return params.seriesName +"<br/>"+ params.marker + params.name + "：" + params.data.value[2];
        }
      },
    },
    legend: {
      orient: 'vertical',
      top: 'bottom',
      left: 'right',
      data: '营口',
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    geo: {
      map: 'china',
      label: {
        emphasis: {
          show: true,
          color: '#fff'
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#6495ed',
        },
        emphasis: {
          areaColor: '#1b1b1b'
        }
      }
    },
    series: series
  };
  myChart.setOption(option);

}

function getPeopleData() {
  $.ajax({
    url: '/op/pms/stats/address',
    type: 'GET',
    data: {
      tenantIds: param.tenantIds ,
      minCreateDate: param.startDay,
      maxCreateDate: param.endDay,
    },
    dataType: 'JSON',
    success: function (res) {
      if (res.success && res.data) {
        peopleData = res.data;
        /* 假数据
        peopleData = res.data.map(function (value) {
          value.toCenter = "120.382621,36.067131";
          value.toName = '青岛市';
          return value;
        });
        */
        init();
      } else {
        // alert('网络访问异常，请稍后重试！');
      }
    },
    error: function (error) {
      // alert('网络访问异常，请稍后重试！');
    }
  });

  // 省份数据汇总
  $.ajax({
    url: '/op/pms/stats/address/province',
    type: 'GET',
    data: {
      tenantIds: param.tenantIds ,
      minCreateDate: param.startDay,
      maxCreateDate: param.endDay,
    },
    dataType: 'JSON',
    success: function (res) {
      if (res.success && res.data) {
        var html = '<ul>';
        /* 假数据
        for(var i=0; i<res.data.length; i++){
          res.data[i].value = 1 + Math.round(Math.random() * 30);
          if(res.data[i].name === '山东省') {
            res.data[i].value = 50 + Math.round(Math.random() * 160);
          }
        }
        res.data.sort(function(a,b){
          return b.value-a.value;
        });
        */
        for(var i=0; i<res.data.length; i++){
          switch (res.data[i].name) {
            case "内蒙古自治区":
              res.data[i].name = '内蒙古';
              break;
            case "新疆维吾尔自治区":
              res.data[i].name = '新疆';
              break;
            case "广西壮族自治区":
              res.data[i].name = '广西省';
              break;
            case "宁夏回族自治区":
              res.data[i].name = '宁夏';
              break;
            case "西藏自治区":
              res.data[i].name = '西藏';
              break;
            case "香港特别行政区":
              res.data[i].name = '香港';
              break;
            case "澳门特别行政区":
              res.data[i].name = '澳门';
              break;
          }
          html += '<li><span class="province">'+ res.data[i].name +'</span><span class="num">'+ res.data[i].value +'</span></li>';
        }
        html += '</ul>';
        $('#table').html(html);
      } else {
        // alert('网络访问异常，请稍后重试！');
      }
    },
    error: function (error) {
      // alert('网络访问异常，请稍后重试！');
    }
  });
}

getPeopleData();
setInterval(() => {
  // getPeopleData();
}, intervalTime);

// 获取URL中参数
// 参数 name 链接中的参数名称
// 返回 参数值
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var queryStr = decodeURI(window.location.search.substr(1));
  var matchStr = queryStr.match(reg);
  if (matchStr != null) {
    return (matchStr[2]);
  }
  return null;
}


// 静态页面数据
var geoCoordMap = {
  '上海': [121.4648,31.2891],
  '东莞': [113.8953,22.901],
  '东营': [118.7073,37.5513],
  '中山': [113.4229,22.478],
  '临汾': [111.4783,36.1615],
  '临沂': [118.3118,35.2936],
  '丹东': [124.541,40.4242],
  '丽水': [119.5642,28.1854],
  '乌鲁木齐': [87.9236,43.5883],
  '佛山': [112.8955,23.1097],
  '保定': [115.0488,39.0948],
  '兰州': [103.5901,36.3043],
  '包头': [110.3467,41.4899],
  '北京': [116.4551,40.2539],
  '北海': [109.314,21.6211],
  '南京': [118.8062,31.9208],
  '南宁': [108.479,23.1152],
  '南昌': [116.0046,28.6633],
  '南通': [121.1023,32.1625],
  '厦门': [118.1689,24.6478],
  '台州': [121.1353,28.6688],
  '合肥': [117.29,32.0581],
  '呼和浩特': [111.4124,40.4901],
  '咸阳': [108.4131,34.8706],
  '哈尔滨': [127.9688,45.368],
  '唐山': [118.4766,39.6826],
  '嘉兴': [120.9155,30.6354],
  '大同': [113.7854,39.8035],
  '大连': [122.2229,39.4409],
  '天津': [117.4219,39.4189],
  '太原': [112.3352,37.9413],
  '威海': [121.9482,37.1393],
  '宁波': [121.5967,29.6466],
  '宝鸡': [107.1826,34.3433],
  '宿迁': [118.5535,33.7775],
  '常州': [119.4543,31.5582],
  '广州': [113.5107,23.2196],
  '廊坊': [116.521,39.0509],
  '延安': [109.1052,36.4252],
  '张家口': [115.1477,40.8527],
  '徐州': [117.5208,34.3268],
  '德州': [116.6858,37.2107],
  '惠州': [114.6204,23.1647],
  '成都': [103.9526,30.7617],
  '扬州': [119.4653,32.8162],
  '承德': [117.5757,41.4075],
  '拉萨': [91.1865,30.1465],
  '无锡': [120.3442,31.5527],
  '日照': [119.2786,35.5023],
  '昆明': [102.9199,25.4663],
  '杭州': [119.5313,29.8773],
  '枣庄': [117.323,34.8926],
  '柳州': [109.3799,24.9774],
  '株洲': [113.5327,27.0319],
  '武汉': [114.3896,30.6628],
  '汕头': [117.1692,23.3405],
  '江门': [112.6318,22.1484],
  '沈阳': [123.1238,42.1216],
  '沧州': [116.8286,38.2104],
  '河源': [114.917,23.9722],
  '泉州': [118.3228,25.1147],
  '泰安': [117.0264,36.0516],
  '泰州': [120.0586,32.5525],
  '济南': [117.1582,36.8701],
  '济宁': [116.8286,35.3375],
  '海口': [110.3893,19.8516],
  '淄博': [118.0371,36.6064],
  '淮安': [118.927,33.4039],
  '深圳': [114.5435,22.5439],
  '清远': [112.9175,24.3292],
  '温州': [120.498,27.8119],
  '渭南': [109.7864,35.0299],
  '湖州': [119.8608,30.7782],
  '湘潭': [112.5439,27.7075],
  '滨州': [117.8174,37.4963],
  '潍坊': [119.0918,36.524],
  '烟台': [120.7397,37.5128],
  '玉溪': [101.9312,23.8898],
  '珠海': [113.7305,22.1155],
  '盐城': [120.2234,33.5577],
  '盘锦': [121.9482,41.0449],
  '石家庄': [114.4995,38.1006],
  '福州': [119.4543,25.9222],
  '秦皇岛': [119.2126,40.0232],
  '绍兴': [120.564,29.7565],
  '聊城': [115.9167,36.4032],
  '肇庆': [112.1265,23.5822],
  '舟山': [122.2559,30.2234],
  '苏州': [120.6519,31.3989],
  '莱芜': [117.6526,36.2714],
  '菏泽': [115.6201,35.2057],
  '营口': [122.4316,40.4297],
  '葫芦岛': [120.1575,40.578],
  '衡水': [115.8838,37.7161],
  '衢州': [118.6853,28.8666],
  '西宁': [101.4038,36.8207],
  '西安': [109.1162,34.2004],
  '贵阳': [106.6992,26.7682],
  '连云港': [119.1248,34.552],
  '邢台': [114.8071,37.2821],
  '邯郸': [114.4775,36.535],
  '郑州': [113.4668,34.6234],
  '鄂尔多斯': [108.9734,39.2487],
  '重庆': [107.7539,30.1904],
  '金华': [120.0037,29.1028],
  '铜川': [109.0393,35.1947],
  '银川': [106.3586,38.1775],
  '镇江': [119.4763,31.9702],
  '长春': [125.8154,44.2584],
  '长沙': [113.0823,28.2568],
  '长治': [112.8625,36.4746],
  '阳泉': [113.4778,38.0951],
  '青岛': [120.4651,36.3373],
  '韶关': [113.7964,24.7028]
};
// 迁入
var YKData = [
  [{name:'上海',value:95}, {name:'营口'}],
  [{name:'广州',value:90}, {name:'营口'}],
  [{name:'青岛',value:80}, {name:'营口'}],
  [{name:'南宁',value:70}, {name:'营口'}],
  [{name:'南昌',value:60}, {name:'营口'}],
  [{name:'拉萨',value:50}, {name:'营口'}],
  [{name:'长春',value:40}, {name:'营口'}],
  [{name:'包头',value:30}, {name:'营口'}],
  [{name:'重庆',value:360}, {name:'包头'}],
  [{name:'重庆',value:360}, {name:'营口'}],
  [{name:'常州',value:10}, {name:'营口'}]
];
