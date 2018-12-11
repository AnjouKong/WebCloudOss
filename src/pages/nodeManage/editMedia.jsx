import React, { Component } from 'react';
import { Modal, Row, Col, Input, message, } from 'antd';
import Utils from '../../common/Utils';
import './nodeManage.css';

class addPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      id: '',
      mediaId: '',
      mediaName: '',
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 弹出框处理函数
  showEditModal = (record) => {
    console.log(record);
    this.setState({
      modalVisible: true,
      id: record.key,
      mediaId: record.mediaId,
      mediaName: record.mediaName,
    });
  };
  // id
  idOnChange = (e) => {
    this.setState({
      mediaId: e.target.value,
    });
  }
  // 名称
  nameOnChange = (e) => {
    this.setState({
      mediaName: e.target.value,
    });
  }
  // 修改提交
  modalOk = () => {
    if (this.state.mediaId === '' || this.state.mediaName === '') {
      Modal.error({
        title: '请输入名称或id',
      });
      return;
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/media/update`,
      method: 'post',
      data: {
        id: this.state.id,
        mediaId: this.state.mediaId,
        mediaName: this.state.mediaName,
      },
    })
    .then(() => {
      this.setState({
        modalVisible: false,
        mediaId: '',
        mediaName: '',
      });
      message.success('修改成功！');
      this.props.onOK();
    })
    .catch(() => {
      this.setState({
        modalVisible: false,
      });
      message.error('修改失败！');
    });
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { modalVisible, mediaId, mediaName, } = this.state;
    return (
      <Modal title="新建预下载媒资" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="500px" >
        <Row>
          <Col span={24} className="nodeInfo">
            <span>媒资ID：</span>
            <Input value={mediaId} onChange={this.idOnChange} placeholder="媒资ID" />
          </Col>
          <Col span={24} className="nodeInfo">
            <span>媒资名称：</span>
            <Input value={mediaName} onChange={this.nameOnChange} placeholder="媒资名称" />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default addPrice;
