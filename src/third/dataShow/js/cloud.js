
// fontColor,fontSize,fontFamily,fontWeight,fontStyle,fontStretch都可以设置
var number1 = 945;
var number2 = 345;
var number3 = 299;
var size1 = 28;
var size2 = 24;
var size3 = 20;
var color1 = '#a6c84c';
var color2 = '#ffa022';
var color3 = '#46bee9';

var fontSetting = [
  { fontColor: '#a6c84c', fontSize: 16, },
  { fontColor: '#46bee9', fontSize: 20, },
  { fontColor: '#ffa022', fontSize: 24, },
  { fontColor: '#003fe9', fontSize: 28, },
  { fontColor: '#e921e1', fontSize: 32, },
  { fontColor: '#e90a0a', fontSize: 36, },
];

var entries = [
  { label: '动作', tooltip: '总数'+ number1, fontColor: color1, fontSize: size1, url: '#', target: '_top' },
  { label: '冒险', tooltip: '总数'+ number2, fontColor: color2, fontSize: size2, url: '#', target: '_top' },
  { label: '喜剧', tooltip: '总数'+number3, fontColor: color3, fontSize: size3, url: '#', target: '_top' },
  { label: '爱情', tooltip: '总数'+number1, fontColor: color1, fontSize: size1, url: '#', target: '_top' },
  { label: '战争', tooltip: '总数'+number2, fontColor: color2, fontSize: size2, url: '#', target: '_top' },
  { label: '恐怖', tooltip: '总数'+number3, fontColor: color3, fontSize: size3, url: '#', target: '_top' },
];

var videoHitData = JSON.parse(getQueryString('videoHitData'));
// console.log(videoHitData);
entries = [];
videoHitData.forEach(function (obj) {
  var fontS = getFontSetting(obj.num);
  entries.push({
    label: obj.keyWord,
    tooltip: '总数: ' + obj.num,
    fontColor: fontS.fontColor,
    fontSize: fontS.fontSize,
    url: 'javascript:void(0);',
    target: '_top',
  });
});


var settings = {
  entries: entries, // 数据
  width: 770, // 宽度
  height: 770, // 高度
  radius: '55%',
  radiusMin: 75,
  bgDraw: true, // 是否显示背景
  bgColor: 'rgba(0,0,0,0)', // 背景颜色
  opacityOver: 1.00,
  opacityOut: 0.05,
  opacitySpeed: 6,
  fov: 800,
  speed: 0.1, // 旋转的速度
  fontFamily: 'Oswald, Arial, sans-serif',
  fontSize: '16', // 默认字体大小
  fontColor: '#fff', // 默认字体颜色
  fontWeight: 'normal', // bold
  fontStyle: 'normal', // italic
  fontStretch: 'normal', // wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
  fontToUpperCase: true,
  tooltipDiffY: 30
};

// $('#tag-cloud').svg3DTagCloud(settings);
var svg3DTagCloud = new SVG3DTagCloud( document.getElementById("cloud"), settings);

function getFontSetting(num) {
  var fontS = fontSetting[0];
  if (num <= 30) {
    fontS = fontSetting[0];
  } else if (num > 30 && num <= 100) {
    fontS = fontSetting[1];
  } else if (num > 100 && num <= 200) {
    fontS = fontSetting[2];
  } else if (num > 200 && num <= 500) {
    fontS = fontSetting[3];
  } else if (num > 500 && num <= 1000) {
    fontS = fontSetting[4];
  } else {
    fontS = fontSetting[5];
  }
  return fontS;
}
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
