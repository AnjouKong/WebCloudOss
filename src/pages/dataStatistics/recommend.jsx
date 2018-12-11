import React, { Component } from 'react';
import { Layout, Breadcrumb, DatePicker, Table, Button, } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Utils from '../../common/Utils';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const columns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '点击量',
  dataIndex: 'value',
  key: 'value',
}];

class recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIndex: '1',
      tableData: [],
      tableTotal: '',
    };

    // 请求传参
    this.variableInfo = {
      startDay: moment().subtract('1', 'days').format('YYYY-MM-DD'),
      endDay: moment().format('YYYY-MM-DD'),
      lineName: '',
    };

    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
  }

  // 初始化
  componentWillMount() {
    this.getTableData();
  }

  // 列表数据
  getTableData = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/adPlaceStat/v1/totalStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
    .then(res => {
      const resData = res.data;
      if (resData.length > 0) {
        const dataArray = [];
        for (let i = 0; i < resData.length; i += 1) {
          const dataObject = {
            key: 1 + i,
            num: 1 + i,
            name: `${resData[i].adPlace}`,
            value: `${resData[i].num}`,
          };
          dataArray.push(dataObject);
        }
        this.setState({
          tableData: dataArray,
          tableTotal: res.totalRows,
        });
        this.variableInfo.lineName = `${resData[0].adPlace}`;
      } else {
        this.setState({
          tableData: [],
        });
      }
      this.getEchartPie();
      this.getEchartLine();
    })
    .catch(() => {
    });
  }

  // 饼图echart
  getEchartPie = () => {
    const { tableData } = this.state;
    // const titleData = [];
    // for (let i = 0; i < tableData.length; i += 1) {
    //   titleData.push(tableData[i].name);
    // }
    const myChart = echarts.init(document.getElementById('pie'));
    myChart.setOption({
      title: { text: '' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: titleData,
      // },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '75%',
          center: ['50%', '62%'],
          data: tableData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
    myChart.off('click');
    myChart.on('click', (param) => {
      this.variableInfo.lineName = `${param.name}`;
      this.getEchartLine();
    });
  }

  // 折线echart
  getEchartLine = () => {
    const { startDay, endDay, lineName } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/adPlaceStat/v1/singleStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay,
        axis: lineName
      }
    })
    .then(res => {
      res = res.data;
      const titleData = [];
      const lineData = [];
      for (let i = 0; i < res.length; i += 1) {
        titleData.push(res[i].createDay);
        lineData.push(res[i].num);
      }
      const myChart = echarts.init(document.getElementById('line'));
      myChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
        xAxis: {
          axisTick: { alignWithLabel: true },
          data: titleData,
        },
        yAxis: {},
        series: [{
          name: lineName,
          type: 'line',
          data: lineData
        }]
      });
    })
    .catch(() => {
    });
  }

  // 时间发生变化
  timeOnChange = (value) => {
    this.setState({
      buttonIndex: value
    });
    this.variableInfo.startDay = moment().subtract(value, 'days').format('YYYY-MM-DD');
    this.variableInfo.endDay = moment().format('YYYY-MM-DD');
    this.getTableData();
  }

  // 时间区间选择
  disabledDate = (current) => (
    current && (current.valueOf() > Date.now() || current.valueOf() < moment().subtract('60', 'days').valueOf())
  )

  // 时间区间选择确定
  dateOnOk = (value) => {
    this.setState({
      buttonIndex: ''
    });
    this.variableInfo.startDay = value[0].format('YYYY-MM-DD');
    this.variableInfo.endDay = value[1].format('YYYY-MM-DD');
    this.getTableData();
  }

  // 点击列表行刷新折线图
  rowClick = (e) => {
    this.variableInfo.lineName = `${e.name}`;
    this.getEchartLine();
  }

  render() {
    const { buttonIndex, tableData, tableTotal } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          <Breadcrumb.Item>推荐位统计</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div className="datePublic">
            <span>时间选择：</span>
            <Button className={classNames({ active: buttonIndex === '1' })} onClick={() => this.timeOnChange('1')}>昨天</Button>
            <Button className={classNames({ active: buttonIndex === '3' })} onClick={() => this.timeOnChange('3')}>3天</Button>
            <Button className={classNames({ active: buttonIndex === '7' })} onClick={() => this.timeOnChange('7')}>7天</Button>
            <Button className={classNames({ active: buttonIndex === '30' })} onClick={() => this.timeOnChange('30')}>30天</Button>
            <RangePicker
              format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}
              disabledDate={this.disabledDate} onChange={this.dateOnOk} style={{ marginLeft: 10 }}
            />
          </div>
          <div style={{ overflow: 'hidden', height: 390, marginBottom: 45 }}>
            <div style={{ width: '35%', float: 'left' }}>
              <Table
                onRow={(record) => ({
                  onClick: () => {
                    this.rowClick(record);
                  }
                })}
                columns={columns}
                dataSource={tableData}
                pagination={{ defaultCurrent: 1, pageSize: 5, total: tableTotal }}
              />
            </div>
            <div id="pie" style={{ width: '65%', height: 390, float: 'left' }}></div>
          </div>
          <h3 className="headTitle">推荐位点击趋势</h3>
          <div id="line" style={{ width: '100%', height: 390 }}></div>
        </Content>
      </Layout>
    );
  }
}

export default recommend;
