import React, { Component } from 'react';
import { Layout, Breadcrumb, DatePicker, Table, Modal, Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Utils from '../../common/Utils';
import './flow.css';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const loginColumns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '房间号',
  dataIndex: 'room',
  key: 'room',
}, {
  title: '设备号',
  dataIndex: 'device',
  key: 'device',
}, {
  title: '开机时间',
  dataIndex: 'startTime',
  key: 'startTime',
}];
const playColumns = [{
  title: '序号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '房间号',
  dataIndex: 'room',
  key: 'room',
}, {
  title: '设备号',
  dataIndex: 'device',
  key: 'device',
}, {
  title: '影片名称',
  dataIndex: 'filmName',
  key: 'filmName',
}, {
  title: '播放时间',
  dataIndex: 'startTime',
  key: 'startTime',
}];
class flow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      buttonIndex: '1',
      // 数据均值
      dataTotal: [],
      lineName: '房间数',
      // 折线数据
      lineData: [],
      // 列表
      columns: [],
      tableData: [],
      tableTotal: '',
      // 开机数
      loginShow: false,
      loginTableData: [],
      loginTableTotal: '',
      // 播放数
      playShow: false,
      playTableData: [],
      playTableTotal: '',
      // modal页码
      current: 1,
    };

    // 请求传参
    this.variableInfo = {
      startDay: moment().subtract('1', 'days').format('YYYY-MM-DD'),
      endDay: moment().format('YYYY-MM-DD'),
      loginDate: '',
      playDate: '',
    };

    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
  }

  // 初始化
  componentWillMount() {
    this.getDataTotal();
    this.getLineData();
    this.getTableData('1', '5');
  }

  // 数据均值
  getDataTotal = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/indexstat/v1/totalIndex`,
      // headers: { token: Utils.query.token },
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
    .then(res => {
      res = res.data;
      this.setState({
        dataTotal: [{
          name: '房间数',
          mark: 'roomNum',
          value: `${res.roomNum}`,
        }, {
          name: '设备数',
          mark: 'deviceNum',
          value: `${res.deviceNum}`,
        }, {
          name: '开机数',
          mark: 'loginNum',
          value: `${res.loginNum}`,
        }, {
          name: '开机率',
          mark: 'loginRate',
          value: `${Utils.calc.multiply(res.loginRate, 100).value()}%`,
        }, {
          name: '活跃率',
          mark: 'activeRate',
          value: `${Utils.calc.multiply(res.activeRate, 100).value()}%`,
        }, {
          name: '点播率',
          mark: 'palyRate',
          value: `${Utils.calc.multiply(res.palyRate, 100).value()}%`,
        }, {
          name: '播放数（汇总）',
          mark: 'playNum',
          value: `${res.playNum}`,
        }]
      });
    })
    .catch(() => {
    });
  }

  // 折线趋势图
  getLineData = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/indexstat/v1/singleIndex`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
    .then(res => {
      this.setState({
        lineData: res.data
      });
      this.getEchart(this.state.lineName);
    })
    .catch(() => {
    });
  }

  // 列表数据
  getTableData = (currentPage, pageSize) => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/indexstat/v1/indexSet`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay,
        currentPage,
        pageSize
      }
    })
    .then(res => {
      const columns = [{
        title: '时间',
        dataIndex: 'date',
        key: 'date',
      }, {
        title: '房间数',
        dataIndex: 'room',
        key: 'room',
      }, {
        title: '设备数',
        dataIndex: 'device',
        key: 'device',
      }, {
        title: '开机数',
        dataIndex: 'login',
        key: 'login',
        onCell: (record) => ({
          onClick: () => {
            this.loginModal(record.date);
          }
        }),
        render: text => <span style={{ color: '#108ee9', cursor: 'pointer' }}>{text}</span>,
      }, {
        title: '开机率',
        dataIndex: 'loginRate',
        key: 'loginRate',
      }, {
        title: '活跃率',
        dataIndex: 'activeRate',
        key: 'activeRate',
      }, {
        title: '点播率',
        dataIndex: 'palyRate',
        key: 'palyRate',
      }, {
        title: '播放数',
        dataIndex: 'play',
        key: 'play',
        onCell: (record) => ({
          onClick: () => {
            this.playModal(record.date);
          }
        }),
        render: text => <span style={{ color: '#108ee9', cursor: 'pointer' }}>{text}</span>,
      }];
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          date: `${resData[i].createDay}`,
          room: `${resData[i].roomNum}`,
          device: `${resData[i].deviceNum}`,
          login: `${resData[i].loginNum}`,
          loginRate: `${Utils.calc.multiply(resData[i].loginRate, 100).value()}%`,
          activeRate: `${Utils.calc.multiply(resData[i].activeRate, 100).value()}%`,
          palyRate: `${Utils.calc.multiply(resData[i].palyRate, 100).value()}%`,
          play: `${resData[i].playNum}`,
          operate: '查看',
        };
        dataArray.push(dataObject);
      }
      this.setState({
        columns,
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  }

  // 开机数列表数据
  getLoginTableData = (date, currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/indexstat/v1/loginDetail`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        currentPage,
        pageSize,
        createDay: date
      }
    })
    .then(res => {
      const loginData = res.data;
      const dataArray = [];
      for (let i = 0; i < loginData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          num: 1 + i + ((currentPage - 1) * 5),
          room: `${loginData[i].roomId}`,
          device: `${loginData[i].deviceId}`,
          startTime: `${loginData[i].startTime}`
        };
        dataArray.push(dataObject);
      }
      this.setState({
        loginTableData: dataArray,
        loginTableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  }

  // 播放数列表数据
  getPlayTableData = (date, currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/indexstat/v1/mediaPalyDetail`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        currentPage,
        pageSize,
        createDay: date
      }
    })
    .then(res => {
      const loginData = res.data;
      const dataArray = [];
      for (let i = 0; i < loginData.length; i += 1) {
        const dataObject = {
          key: 1 + i,
          num: 1 + i + ((currentPage - 1) * 5),
          room: `${loginData[i].roomId}`,
          device: `${loginData[i].deviceId}`,
          filmName: `${loginData[i].resourceName}`,
          startTime: `${loginData[i].startTime}`
        };
        dataArray.push(dataObject);
      }
      this.setState({
        playTableData: dataArray,
        playTableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  }

  // 折线echart
  getEchart = (name) => {
    const { lineData } = this.state;
    const titleData = [];
    const data = [];
    for (let i = 0; i < lineData.length; i += 1) {
      titleData.push(lineData[i].createDay);
      switch (name) {
        case '房间数':
          data.push(lineData[i].roomNum);
          break;
        case '设备数':
          data.push(lineData[i].deviceNum);
          break;
        case '开机数':
          data.push(lineData[i].loginNum);
          break;
        case '开机率':
          data.push((lineData[i].loginRate) * 100);
          break;
        case '活跃率':
          data.push((lineData[i].activeRate) * 100);
          break;
        case '点播率':
          data.push((lineData[i].palyRate) * 100);
          break;
        case '播放数（汇总）':
          data.push(lineData[i].playNum);
          break;
        default:
          data.push(lineData[i].roomNum);
          break;
      }
    }
    const myChart = echarts.init(document.getElementById('timeLine'));
    myChart.setOption({
      title: {
        text: `${name}的近期趋势`,
        x: '7%',
        y: 17,
        textStyle: { fontStyle: 'normal', fontWeight: '300', fontSize: 16 }
      },
      tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
      grid: { left: '7%', right: '7%', bottom: '9%', top: '17%', containLabel: true },
      xAxis: {
        axisTick: { alignWithLabel: true },
        data: titleData,
      },
      yAxis: {},
      series: [{
        name,
        type: 'line',
        data
      }]
    });
  }

  // 数据均值列表
  getTotalList = () => {
    const { activeIndex, dataTotal } = this.state;
    return (
      dataTotal.map((item, index) => (
        <div
          className={classNames('data-item', { active: activeIndex === index })}
          value={item.mark}
          key={index}
          onClick={() => this.itemClick(index, item.mark, item.name)}
        >
          <div className="item-title">{item.name}</div>
          <p className="item-text">{item.value}</p>
        </div>
      ))
    );
  }

  itemClick = (index, mark, name) => {
    this.setState({
      activeIndex: index,
      lineName: name,
    });
    this.getEchart(name);
  }

  // 时间发生变化
  timeOnChange = (value) => {
    this.setState({
      buttonIndex: value
    });
    this.variableInfo.startDay = moment().subtract(value, 'days').format('YYYY-MM-DD');
    this.variableInfo.endDay = moment().format('YYYY-MM-DD');
    this.getDataTotal();
    this.getLineData();
    this.getTableData('1', '5');
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
    this.getDataTotal();
    this.getLineData();
    this.getTableData('1', '5');
  }

  // 列表翻页
  tableOnChange = (page, pageSize) => {
    this.getTableData(page, pageSize);
  }

  // 开机数modal
  loginModal = (date) => {
    this.setState({
      loginShow: true,
    });
    this.variableInfo.loginDate = date;
    this.getLoginTableData(date, '1', '5');
  }

  // 开机数列表翻页
  loginOnChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    const { loginDate } = this.variableInfo;
    this.getLoginTableData(loginDate, page, pageSize);
  }

  // 播放数modal
  playModal = (date) => {
    this.setState({
      playShow: true,
    });
    this.variableInfo.playDate = date;
    this.getPlayTableData(date, '1', '5');
  }

  // 播放数列表翻页
  playOnChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    const { playDate } = this.variableInfo;
    this.getPlayTableData(playDate, page, pageSize);
  }

  // modal关闭
  modalCancel = () => {
    this.setState({
      loginShow: false,
      playShow: false,
      current: 1,
    });
  }

  render() {
    const { buttonIndex, columns, tableData, tableTotal, loginShow, loginTableData, loginTableTotal,
      playShow, playTableData, playTableTotal, current, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          <Breadcrumb.Item>流量统计</Breadcrumb.Item>
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
          <div className="data-total">
            <div className="data-title">数据均值</div>
            <div className="data-info">
              {this.getTotalList()}
            </div>
          </div>
          <div id="timeLine" style={{ width: '100%', height: 450 }}></div>
          <h3 className="headTitle">每日数据统计</h3>
          <Table
            columns={columns} dataSource={tableData}
            pagination={{ defaultCurrent: 1, pageSize: 5, total: tableTotal, onChange: (this.tableOnChange) }}
          />
          <Modal title="影片播放详情" visible={loginShow} onCancel={this.modalCancel} footer={null} width="70%" >
            <Table
              columns={loginColumns} dataSource={loginTableData}
              pagination={{ current, pageSize: 5, total: loginTableTotal, onChange: (this.loginOnChange) }}
            />
          </Modal>
          <Modal title="影片播放详情" visible={playShow} onCancel={this.modalCancel} footer={null} width="70%" >
            <Table
              columns={playColumns} dataSource={playTableData}
              pagination={{ current, pageSize: 5, total: playTableTotal, onChange: (this.playOnChange) }}
            />
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default flow;
