import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Layout, Breadcrumb, Select, DatePicker, Button, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment/moment';
import Utils from '../../common/Utils';

const { Content } = Layout;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '800px',
      ptTenantIds: [],
      peopleData: [],
      tenantIds: '',
      buttonIndex: '30',
    };
    // 请求传参
    this.variableInfo = {
      startDay: moment().subtract('30', 'days').format('YYYY-MM-DD'),
      endDay: moment().format('YYYY-MM-DD'),
    };
    this.intervalTime = 60 * 1000;
    this.$iframe = null;

    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
    // this.tenantId = '4UBbE4nnwGehc4WIqVN';
  }

  componentDidMount() {
    this.getPt();
  }
  componentWillUnmount() {
    clearInterval(this.setTimeId);
  }

  onChange = (value) => {
    // console.log(value);
    this.setState({
      tenantIds: value,
    });
  };
  getPt = () => {
    // console.log(this.tenantId);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/pms/stats/pt`,
      method: 'GET',
      data: {},
      type: 'json',
    }).then((res) => {
      if (res.success && res.data) {
        if (res.data.length > 0) {
          const tmpData = [];
          // console.log(res);
          let tenantIdsItem = '';
          let nowId = null;
          res.data.forEach((value) => {
            tenantIdsItem += value.id + ',';
            if (this.tenantId === value.id) {
              nowId = this.tenantId;
            }
          });
          tmpData.push({
            tenantName: '全部',
            id: tenantIdsItem,
          });
          this.setState({
            ptTenantIds: tmpData.concat(res.data),
            tenantIds: nowId || tenantIdsItem,
          });
          // this.getDataByTime();
        }
      } else {
        message.error(res.message);
      }
    });
  };

  setIframeHeight = () => {
    if (this.$iframe) {
      const h = this.$iframe.contentWindow.document.body.scrollHeight;
      this.setState({
        iFrameHeight: `${h}px`
      });
    }
  };

  // 时间发生变化
  timeOnChange = (value) => {
    this.variableInfo.startDay = moment().subtract(value, 'days').format('YYYY-MM-DD');
    this.variableInfo.endDay = moment().format('YYYY-MM-DD');
    this.setState({
      buttonIndex: value
    });
  };

  // 时间区间选择
  disabledDate = (current) => (
    current && (current.valueOf() > Date.now() || current.valueOf() < moment().subtract('60', 'days').valueOf())
  );

  // 时间区间选择确定
  dateOnOk = (value) => {
    this.variableInfo.startDay = value[0].format('YYYY-MM-DD');
    this.variableInfo.endDay = value[1].format('YYYY-MM-DD');
    this.setState({
      buttonIndex: ''
    });
  };

  render() {
    const { ptTenantIds, tenantIds, buttonIndex } = this.state; // peopleData
    const { startDay, endDay } = this.variableInfo;
    const param = {
      tenantIds,
      startDay,
      endDay
    };
    const ptTenantIdsList = [];
    ptTenantIds.forEach((item) => {
      // console.log((item.id === tenantIds));
      ptTenantIdsList.push(
        <Option key={item.id} value={item.id}>{item.tenantName}</Option>
      );
    });
    // console.log(ptTenantIds);
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据展示</Breadcrumb.Item>
          <Breadcrumb.Item>酒店入住人员分布</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src={`/third/dataShow/peopleSource.html?peopleData=${JSON.stringify(param)}`}
            width="100%"
            height={this.state.iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
          <div className="datePublic" style={{ position: 'absolute', top: 132, right: 40 }}>
            <span style={{ color: '#fff' }}>时间选择：</span>
            <Button className={classNames({ active: buttonIndex === '0' })} onClick={() => this.timeOnChange('0')}>今天</Button>
            <Button className={classNames({ active: buttonIndex === '1' })} onClick={() => this.timeOnChange('1')}>昨天</Button>
            <Button className={classNames({ active: buttonIndex === '3' })} onClick={() => this.timeOnChange('3')}>3天</Button>
            <Button className={classNames({ active: buttonIndex === '7' })} onClick={() => this.timeOnChange('7')}>7天</Button>
            <Button className={classNames({ active: buttonIndex === '30' })} onClick={() => this.timeOnChange('30')}>30天</Button>
            <RangePicker
              format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}
              disabledDate={this.disabledDate} onChange={this.dateOnOk} style={{ marginLeft: 10 }}
            />
            <Select
              value={tenantIds}
              onSelect={value => this.onChange(value)}
              style={{ width: 200, marginRight: 7, marginLeft: 10 }}
              placeholder="选择状态"
            >
              {ptTenantIdsList}
            </Select>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Page9;
