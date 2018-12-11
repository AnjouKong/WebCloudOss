import React, { Component } from 'react';
import { Layout, Breadcrumb, } from 'antd';

const { Content } = Layout;

class customPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: '0px'
    };
    this.$iframe = null;
    this.currentId = '';
  }

  componentDidMount() {
    // console.log(this.props.location.query.id);
    this.currentId = '/third/platform/secondaryConfig.html?currentId=' + this.props.location.query.id;
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
          <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          <Breadcrumb.Item>自定义页面</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 600 }}>
          <iframe
            id="SecondaryPageChildFrame"
            style={{ width: '100%', overflow: 'visible' }}
            onLoad={() => this.setIframeHeight()}
            ref={ins => { this.$iframe = ins; }}
            src={this.currentId}
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

export default customPage;
