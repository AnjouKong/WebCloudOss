import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Layout, Breadcrumb, message } from 'antd';
import Utils from '../../common/Utils';

const { Content } = Layout;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '0px',
      roomData: [],
    };

    this.$iframe = null;

    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
    // this.tenantId = '4UBbE4nnwGehc4WIqVN';
  }

  /*
  componentDidMount() {
    this.getRoomData();
    this.setTimeId = setInterval(() => {
      this.getRoomData();
    }, 60 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.setTimeId);
  }
  */

  getRoomData = () => {
    console.log(this.tenantId);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/pms/stats/room`,
      method: 'GET',
      data: {
        tenantId: this.tenantId,
      },
      type: 'json',
    }).then((res) => {
      // console.log(res);
      if (res.success) {
        // console.log(res.data.length);
        // res.data.forEach((value) => {
        //   console.log(value.length);
        // });
        this.setState({
          roomData: res.data,
        });
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

  render() {
    // const { roomData } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据展示</Breadcrumb.Item>
          <Breadcrumb.Item>酒店房间入住信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src={`/third/dataShow/checkIn.html?roomData=${JSON.stringify(this.tenantId)}`}
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
