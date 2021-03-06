import React, { Component } from 'react';
import { Modal, message, Switch, Select, Row, Col, Button, Input, } from 'antd';
import Utils from '../../common/Utils';

const Option = Select.Option;
const confirm = Modal.confirm;

class releaseVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      currentId: '',
      groupData: [],
      deviceData: [],
      submitData: [],
      // 保存数据
      tenantId: '',
      tenantName: '',
      groupId: '',
      groupName: '',
      deviceId: '',
      deviceName: '',
      // 清空选项
      groupValue: { key: '', label: '' },
      deviceValue: { key: '', label: '' },
    };
    this.publishSelData = [];
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取发布商户
  getPublicTenantList = (sceneId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/scene/release`,
      method: 'post',
      data: {
        sceneId
      }
    })
    .then(res => {
      const resData = res.data;
      this.setState({
        submitData: resData,
      });
    })
    .catch(() => {
    });
  }
  // 获取分组
  getGroupList = (tenantId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/group/list`,
      method: 'post',
      data: {
        tenantId,
      }
    })
    .then(res => {
      const resData = res.data;
      if (resData) {
        const groupList = [];
        resData.map((item) => {
          return groupList.push(
            <Option
              key={item.id}
              value={item.id}
              title={item.groupName}
            >
              {item.groupName}
            </Option>
          );
        });
        this.setState({
          groupData: groupList,
        });
      } else {
        this.setState({
          groupData: [],
          deviceData: [],
        });
      }
    })
    .catch(() => {
    });
  }
  // 获取终端
  getDeviceList = (groupId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/room/list`,
      method: 'post',
      data: {
        deviceGroupCode: groupId
      }
    })
    .then(res => {
      const resData = res.data;
      if (resData) {
        const deviceList = [];
        resData.map((item) => {
          return deviceList.push(
            <Option
              key={item.deviceId}
              value={`${item.roomId}-${item.deviceId}/////${item.deviceId}`}
              title={item.roomId + '-' + item.deviceId}
            >
              {item.roomId + '-' + item.deviceId}
            </Option>
          );
        });
        this.setState({
          deviceData: deviceList,
        });
      } else {
        this.setState({
          deviceData: [],
        });
      }
    })
    .catch(() => {
    });
  }
  // 弹出框处理函数
  showModal = (record) => {
    // console.log(record);
    this.setState({
      modalVisible: true,
      currentId: record.id,
      tenantId: record.tenantId,
      tenantName: record.tenantName,
      groupValue: { key: '', label: '' },
      deviceValue: { key: '', label: '' },
    });
    this.getPublicTenantList(record.id);
    this.getGroupList(record.tenantId);
    setTimeout(() => {
    }, 200);
  }
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  handleSubmit = () => {
    if (this.state.submitData.length === 0) return message.error('至少有一条数据才可以发布！');
    this.setState({
      confirmLoading: true,
    });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/scene/publish`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: this.state.submitData,
      data: {
        id: this.state.currentId
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.success('发布成功');
        this.props.onOK();
      }
    })
    .catch(() => {
      message.error('发布失败');
    });
  }
  inputOnchange = (e, index) => {
    const { submitData } = this.state;
    submitData[index].view = e;
    this.setState({
      submitData,
    });
  }
  publishData = (value, type) => {
    switch (type) {
      case 'tenant':
        this.setState({
          tenantId: this.state.tenantId,
          tenantName: this.state.tenantName,
          groupId: '',
          groupName: '',
          deviceId: '',
          deviceName: '',
          groupValue: { key: '', label: '' },
          deviceValue: { key: '', label: '' },
        });
        this.getGroupList(value.key.split('/////')[1]);
        break;
      case 'group':
        this.setState({
          groupId: value.key,
          groupName: value.label,
          deviceId: '',
          deviceName: '',
          groupValue: { key: value.key, label: value.label },
          deviceValue: { key: '', label: '' },
        });
        this.getDeviceList(value.key);
        break;
      case 'device':
        this.setState({
          deviceId: value.key.split('/////')[1],
          deviceName: value.label,
          deviceValue: { key: value.key, label: value.label },
        });
        break;
      default:
        break;
    }
  }
  // 删除
  delete = (index) => {
    confirm({
      title: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { submitData } = this.state;
        // console.log('删除：', index, submitData);
        submitData.splice(index, 1);
        this.setState({
          submitData,
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };
  addPublishList = () => {
    const { submitData } = this.state;
    this.publishSelData = [{
      tenantId: this.state.tenantId,
      tenantName: this.state.tenantName,
      groupId: this.state.groupId === '' ? null : this.state.groupId,
      groupName: this.state.groupName,
      deviceId: this.state.deviceId === '' ? null : this.state.deviceId,
      deviceName: this.state.deviceName,
      view: false,
    }];
    if (this.publishSelData[0].tenantId === '') return message.error('不能添加空数据！');
    if (submitData.length === 0) {
      this.setState({
        submitData: this.publishSelData
      });
      return;
    }
    // console.log(this.publishSelData);
    let repeat = false;
    for (let i = 0; i < submitData.length; i += 1) {
      if (submitData[i].tenantId === this.publishSelData[0].tenantId
        && submitData[i].groupId === this.publishSelData[0].groupId
        && submitData[i].deviceId === this.publishSelData[0].deviceId) {
        repeat = true;
      }
    }
    if (!repeat) {
      const listData = submitData.concat(this.publishSelData);
      this.setState({
        submitData: listData
      });
    } else {
      message.error('本条数据已添加！');
    }
  }
  publishList = () => {
    const { submitData } = this.state;
    // console.log(submitData);
    return (
      submitData && submitData.map((item, index) => {
        const list = (
          <Row key={index}>
            <Col span={5} offset={4} style={{ lineHeight: '30px' }}>{this.state.tenantName}</Col>
            <Col span={5} style={{ lineHeight: '30px' }}>{item.groupName}</Col>
            <Col span={5} style={{ lineHeight: '30px' }}>{item.deviceName}</Col>
            <Col span={3}>
              <Switch checked={item.view} onChange={e => this.inputOnchange(e, index)} />
            </Col>
            <Col onClick={() => this.delete(index)} span={2} style={{ color: '#1890ff', cursor: 'pointer' }}>删除</Col>
          </Row>
        );
        return list;
      })
    );
  }

  render() {
    const { modalVisible, groupData, deviceData, groupValue, deviceValue, tenantName } = this.state;

    return (
      <Modal
        title="新建信息"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="900px"
      >
        <Row>
          <Col span={4}></Col>
          <Col span={16}>
            <span style={{ width: '33%', float: 'left', lineHeight: '30px' }}>商户：</span>
            <span style={{ width: '33%', float: 'left', lineHeight: '30px' }}>选择分组：</span>
            <span style={{ width: '33%', float: 'left', lineHeight: '30px' }}>选择终端：</span>
          </Col>
        </Row>
        <Row>
          <Col span={4} style={{ textAlign: 'right', lineHeight: '30px' }}>选择发布对象：</Col>
          <Col span={16}>
            <Input disabled value={tenantName} style={{ width: '33%' }} />
            <Select value={groupValue} labelInValue style={{ width: '33%' }} onChange={e => this.publishData(e, 'group')}>
              { groupData }
            </Select>
            <Select value={deviceValue} labelInValue showSearch style={{ width: '33%' }} onChange={e => this.publishData(e, 'device')}>
              { deviceData }
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={this.addPublishList}>添加</Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col span={4} style={{ textAlign: 'right', lineHeight: '30px' }}>发布数据：</Col>
          <Col span={20}>
            <span style={{ width: '25%', float: 'left', lineHeight: '30px' }}>商户</span>
            <span style={{ width: '25%', float: 'left', lineHeight: '30px' }}>分组</span>
            <span style={{ width: '25%', float: 'left', lineHeight: '30px' }}>终端</span>
            <span style={{ width: '15%', float: 'left', lineHeight: '30px' }}>是否授权</span>
            <span style={{ width: '10%', float: 'left', lineHeight: '30px' }}>操作</span>
          </Col>
        </Row>
        { this.publishList() }
      </Modal>
    );
  }
}

export default releaseVersion;
