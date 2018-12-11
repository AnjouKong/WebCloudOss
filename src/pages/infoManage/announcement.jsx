import React, { Component } from 'react';
import { Layout, Breadcrumb, Row, Col, Button, Input, Radio, message, } from 'antd';
import Utils from '../../common/Utils';

const { Content } = Layout;
const RadioGroup = Radio.Group;

class Page9 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      rollSwitch: 'false',
    };
    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
  }
  componentWillMount() {
    this.getContent();
  }
  // 获取节点列表
  getContent = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/param/announcement`,
      method: 'get',
      data: {
        tenantId: this.tenantId,
      }
    })
    .then(res => {
      console.log(res.data);
      this.setState({
        content: res.data.content,
        rollSwitch: `${res.data.roll}`
      });
    })
    .catch(() => {
    });
  };
  // 内容
  contentOnchange = (e) => {
    this.setState({
      content: e.target.value,
    });
  }
  // 是否滚动
  rollSwitchOnChange = (e) => {
    this.setState({
      rollSwitch: e.target.value,
    });
  }
  // 保存信息
  saveInfo = () => {
    if (this.state.content === '') {
      return message.warning('请填写内容！');
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/param/announcement`,
      method: 'post',
      data: {
        tenantId: this.tenantId,
        content: this.state.content,
        roll: this.state.rollSwitch,
      }
    })
    .then(() => {
      message.success('保存成功！');
    })
    .catch(() => {
    });
  }

  render() {
    const { content, rollSwitch, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>信息管理</Breadcrumb.Item>
          <Breadcrumb.Item>公告信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Row>
              <Col span={24} className="nodeInfo">
                <span className="required">公告信息：</span>
                <Input value={content} onChange={this.contentOnchange} placeholder="公告信息" />
              </Col>
              <Col span={24} className="nodeInfo">
                <span>是否滚动：</span>
                <RadioGroup className="con" value={rollSwitch} onChange={this.rollSwitchOnChange}>
                  <Radio value="true">是</Radio>
                  <Radio value="false">否</Radio>
                </RadioGroup>
              </Col>
              <Col span={12} offset={11} className="nodeInfo">
                <Button type="primary" onClick={this.saveInfo} >保存</Button>
              </Col>
            </Row>

          </div>
        </Content>
      </Layout>
    );
  }
}

export default Page9;
