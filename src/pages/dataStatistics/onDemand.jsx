import React, { Component } from 'react';
import { Layout, Breadcrumb, DatePicker, Table, Button, } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Utils from '../../common/Utils';

const { Content } = Layout;
const { RangePicker } = DatePicker;
// const TENANTID = 's4ahKIFujPzYSOQjwb2';
const rankColumns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '点击量',
  dataIndex: 'data',
  key: 'data',
}];
const sortColumns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '分类',
  dataIndex: 'sort',
  key: 'sort',
}, {
  title: '片名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '播放次数',
  dataIndex: 'playNum',
  key: 'playNum',
}];
const detailColumns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '片名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '播放时间',
  dataIndex: 'playTime',
  key: 'playTime',
}, {
  title: '房间号',
  dataIndex: 'room',
  key: 'room',
}, {
  title: '设备类型',
  dataIndex: 'device',
  key: 'device',
}];

class onDemand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIndex: '1',
      barData: [],
      rankTableData: [],
      sortTableData: [],
      sortTableTotal: '',
      detailTableData: [],
      detailTableTotal: '',
    };
    this.variableInfo = {
      startDay: moment().subtract('1', 'days').format('YYYY-MM-DD'),
      endDay: moment().format('YYYY-MM-DD'),
      sortName: '',
      detailName: '',
    };

    this.tenantId = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '';
  }

  // 初始化
  componentWillMount() {
    this.getBarData();
    this.getRankData();
  }

  // 柱状图数据
  getBarData = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/mediaPlayStat/v1/cateStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
    .then(res => {
      this.setState({
        barData: res.data,
      });
      this.getEchartBar();
    })
    .catch(() => {
    });
  }

  // 播放排行榜
  getRankData = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/mediaPlayStat/v1/playNumStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          num: 1 + i,
          name: `${resData[i].mediaName}`,
          data: `${resData[i].num}`,
        };
        dataArray.push(dataObject);
      }
      this.setState({
        rankTableData: dataArray,
      });
    })
    .catch(() => {
    });
  }

  // 柱状图echart
  getEchartBar = () => {
    const { barData } = this.state;
    const titleData = [];
    const data = [];
    for (let i = 0; i < barData.length; i += 1) {
      titleData.push(barData[i].cate);
      data.push(barData[i].num);
    }
    const myChart = echarts.init(document.getElementById('bar'));
    myChart.setOption({
      title: { text: '' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: {
        left: '3%',
        right: '13%',
        bottom: '4%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: titleData,
      },
      series: [{
        name: '',
        type: 'bar',
        barWidth: '50%',
        data
      }]
    });
    myChart.on('click', (param) => {
      this.variableInfo.sortName = `${param.name}`;
      this.getSortTableData('1', '5');
    });
  }

  // 分类影片播放情况
  getSortTableData= (currentPage, pageSize) => {
    const { startDay, endDay, sortName } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/mediaPlayStat/v1/catPlayNumStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay,
        currentPage,
        pageSize,
        cate: sortName
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          num: 1 + i + ((currentPage - 1) * 5),
          sort: `${resData[i].cate}`,
          name: `${resData[i].mediaName}`,
          playNum: `${resData[i].num}`,
        };
        dataArray.push(dataObject);
      }
      this.setState({
        sortTableData: dataArray,
        sortTableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  }

  // 单片播放详情
  getDetailTableData= (currentPage, pageSize) => {
    const { startDay, endDay, detailName } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/mediaPlayStat/v1/playDetail`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay,
        currentPage,
        pageSize,
        mediaName: detailName
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          num: 1 + i + ((currentPage - 1) * 5),
          name: `${resData[i].resourceName}`,
          playTime: `${resData[i].startTime}`,
          room: `${resData[i].roomId}`,
          device: `${resData[i].deviceId}`,
        };
        dataArray.push(dataObject);
      }
      this.setState({
        detailTableData: dataArray,
        detailTableTotal: res.totalRows,
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
    this.getBarData();
    this.getRankData();
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
    this.getBarData();
    this.getRankData();
  }

  // 点击列表行刷新折线图
  rowClick = (e) => {
    this.variableInfo.detailName = `${e.name}`;
    this.getDetailTableData('1', '5');
  }

  // 分类影片播放情况翻页
  sortOnChange = (page, pageSize) => {
    this.getSortTableData(page, pageSize);
  }

  // 单片播放详情翻页
  detailOnChange = (page, pageSize) => {
    this.getDetailTableData(page, pageSize);
  }

  render() {
    const { buttonIndex, rankTableData, sortTableData, sortTableTotal, detailTableData, detailTableTotal } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          <Breadcrumb.Item>点播统计</Breadcrumb.Item>
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
          <div style={{ overflow: 'hidden' }}>
            <div style={{ width: '65%', float: 'left' }}>
              <h3 className="headTitle">影片分类统计</h3>
              <div id="bar" style={{ width: '100%', height: 540 }}></div>
            </div>
            <div style={{ width: '35%', float: 'right' }}>
              <h3 className="headTitle">播放排行榜</h3>
              <Table columns={rankColumns} dataSource={rankTableData} pagination={false} size="middle" />
            </div>
          </div>
          <div style={{ overflow: 'hidden', margin: '45px 0 0' }}>
            <div style={{ width: '35%', float: 'left' }}>
              <h3 className="headTitle">影片播放情况（按分类统计）</h3>
              <Table
                onRow={(record) => ({
                  onClick: () => {
                    this.rowClick(record);
                  }
                })}
                columns={sortColumns} dataSource={sortTableData}
                pagination={{ defaultCurrent: 1, pageSize: 5, total: sortTableTotal, onChange: (this.sortOnChange) }}
              />
            </div>
            <div style={{ width: '55%', float: 'right' }}>
              <h3 className="headTitle">单片播放详情</h3>
              <Table
                columns={detailColumns} dataSource={detailTableData}
                pagination={{ defaultCurrent: 1, pageSize: 5, total: detailTableTotal, onChange: (this.detailOnChange) }}
              />
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default onDemand;
