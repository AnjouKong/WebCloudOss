import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '0px'
    };

    this.$iframe = null;
  }

  setIframeHeight = () => {
    if (this.$iframe) {
      const h = this.$iframe.contentWindow.document.body.scrollHeight;
      this.setState({
        iFrameHeight: `${h}px`
      });
    }
  }

  render() {
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据展示</Breadcrumb.Item>
          <Breadcrumb.Item>酒店房间消防安全信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src="/third/dataShow/fireSafety.html"
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
