import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Layout, Breadcrumb, message } from 'antd';
import Utils from '../../common/Utils';

const { Content } = Layout;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '840px',
      paramData: [],
    };

    this.tenantIds = '';
    this.intervalTime = 60 * 1000;
    this.$iframe = null;
  }

  componentDidMount() {
    this.getPt();
  }
  componentWillUnmount() {
    // clearInterval(this.setTimeId);
  }

  getPt = () => {
    console.log(this.tenantId);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/pms/stats/pt`,
      method: 'GET',
      data: {
      },
      type: 'json',
    }).then((res) => {
      if (res.success && res.data) {
        if (res.data.length > 0) {
          console.log(res);
          this.tenantIds = '';
          res.data.forEach((value) => {
            this.tenantIds += value.id + ',';
          });
          // this.getAddress();
          // this.setTimeId = setInterval(() => {
          //   this.getAddress();
          // }, this.intervalTime);
          this.setState({
            paramData: {
              tenantIds: this.tenantIds,
              cutTime: this.intervalTime,
            },
          });
        }
      } else {
        message.error(res.message);
      }
    });
  };
  /*
  // 放在html里面请求
  getAddress = () => {
    console.log(this.tenantIds);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/pms/stats/checkIn`,
      method: 'GET',
      data: {
        tenantIds: this.tenantIds,
        cutTime: this.intervalTime,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        // console.log(res.data.length);
        // res.data.forEach((value) => {
        //   console.log(value.length);
        // });
        const rm = Math.ceil(Math.random() * 3);
        res.data[rm].value2 = Math.ceil(Math.random() * 20);
        console.log(rm);
        this.setState({
          addressData: res.data,
        });
      } else {
        message.error(res.message);
      }
    });
  };
  */

  setIframeHeight = () => {
    if (this.$iframe) {
      const h = this.$iframe.contentWindow.document.body.scrollHeight;
      this.setState({
        iFrameHeight: `${h}px`
      });
    }
  }

  render() {
    const { paramData } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据展示</Breadcrumb.Item>
          <Breadcrumb.Item>酒店即时入住信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src={`/third/dataShow/instantCheckIn.html?addressData=${JSON.stringify(paramData)}`}
            width="100%"
            height={this.state.iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
        </Content>
      </Layout>
    );
  }
}

export default Page9;
