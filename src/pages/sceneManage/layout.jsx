import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

class Page9 extends Component {
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
    this.currentId = '/third/platform/layout.html?currentId=' + this.props.location.query.id;
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
          <Breadcrumb.Item>场景管理</Breadcrumb.Item>
          <Breadcrumb.Item>场景列表</Breadcrumb.Item>
          <Breadcrumb.Item>场景布局</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          {/* <Link to="/sceneManage/sceneManage" style={{ marginLeft: 850, position: 'absolute', marginTop: 15 }}>
            <Button type="primary" id="sss">返回</Button>
          </Link> */}
          <iframe
            style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
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

export default Page9;
