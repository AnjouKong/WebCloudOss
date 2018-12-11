import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Layout, Breadcrumb, DatePicker, Button, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment/moment';
import Utils from '../../common/Utils';

const { Content } = Layout;
const { RangePicker } = DatePicker;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '700px',
      buttonIndex: '30',
      htmlUrl: '/third/dataShow/videoHit.html',
      videoHitData: [],
    };
    // 请求传参
    this.variableInfo = {
      startDay: moment().subtract('30', 'days').format('YYYY-MM-DD'),
      endDay: moment().format('YYYY-MM-DD'),
    };
    this.$iframe = null;
    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
    // this.tenantId = '4UBbE4nnwGehc4WIqVN';
  }

  componentDidMount() {
    this.getVideoHitData();
  }
  // 数据
  getVideoHitData = () => {
    const { startDay, endDay } = this.variableInfo;
    Utils.request({
      url: `${window.PAY_API_HOST}/stats/mediaPlayStat/v1/keyWordStat`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
        startDay,
        endDay
      }
    })
      .then(res => {
        // console.log(res);
        if (res.success) {
          const dataArray = [];
          res.data.forEach((value) => {
            const dataObject = {
              keyWord: value.keyWord,
              num: value.num,
            };
            dataArray.push(dataObject);
          });
          this.setState({
            videoHitData: dataArray,
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {
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
    this.setState({
      buttonIndex: value
    });
    this.variableInfo.startDay = moment().subtract(value, 'days').format('YYYY-MM-DD');
    this.variableInfo.endDay = moment().format('YYYY-MM-DD');
    this.getVideoHitData();
  };

  // 时间区间选择
  disabledDate = (current) => (
    current && (current.valueOf() > Date.now() || current.valueOf() < moment().subtract('60', 'days').valueOf())
  );

  // 时间区间选择确定
  dateOnOk = (value) => {
    this.setState({
      buttonIndex: ''
    });
    this.variableInfo.startDay = value[0].format('YYYY-MM-DD');
    this.variableInfo.endDay = value[1].format('YYYY-MM-DD');
    this.getVideoHitData();
  };


  render() {
    const { buttonIndex, htmlUrl, videoHitData } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据展示</Breadcrumb.Item>
          <Breadcrumb.Item>酒店影片热播分布</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src={`${htmlUrl}?videoHitData=${JSON.stringify(videoHitData)}`}
            width="100%"
            height={this.state.iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
          <div className="datePublic" style={{ position: 'absolute', top: 132, right: 40 }}>
            <span style={{ color: '#fff' }}>时间选择：</span>
            <Button className={classNames({ active: buttonIndex === '1' })} onClick={() => this.timeOnChange('1')}>昨天</Button>
            <Button className={classNames({ active: buttonIndex === '3' })} onClick={() => this.timeOnChange('3')}>3天</Button>
            <Button className={classNames({ active: buttonIndex === '7' })} onClick={() => this.timeOnChange('7')}>7天</Button>
            <Button className={classNames({ active: buttonIndex === '30' })} onClick={() => this.timeOnChange('30')}>30天</Button>
            <RangePicker
              format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}
              disabledDate={this.disabledDate} onChange={this.dateOnOk} style={{ marginLeft: 10 }}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Page9;
