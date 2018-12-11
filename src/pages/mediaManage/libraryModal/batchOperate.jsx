import React, { Component } from 'react';
import { Modal, Input, Radio, } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

const RadioGroup = Radio.Group;

class batchOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      price: '',
      subscriptValue: '',
      recommendValue: '',
      hotSearchValue: '',
    };
    this.selectedRowKeys = [];
    this.$price = '';
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  // 弹出框处理函数
  showBatchModal = (selectedRowKeys) => {
    console.log('选中行', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
    this.setState({
      modalVisible: true,
    });
  };
  priceOnChange = (e) => {
    this.setState({
      price: e.target.value,
    });
  }
  // 角标
  subscriptOnChange = (e) => {
    console.log('角标：', e.target.value);
    this.setState({
      subscriptValue: e.target.value,
    });
  }
  // 推荐
  recommendOnChange = (e) => {
    console.log('角标：', e.target.value);
    this.setState({
      recommendValue: e.target.value,
    });
  }
  // 热搜
  hotSearchOnChange = (e) => {
    console.log('角标：', e.target.value);
    this.setState({
      hotSearchValue: e.target.value,
    });
  }
  modalOk = () => {
    console.log(`选中行：${this.selectedRowKeys}`);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/editMedias`,
      method: 'post',
      data: {
        Ids: this.selectedRowKeys,
        originalPrice: this.state.price,
        superscript: this.state.subscriptValue,
        isRecommend: this.state.recommendValue,
        isHot: this.state.hotSearchValue,
      },
    })
    .then(() => {
      this.props.onOK();
      this.setState({
        modalVisible: false,
        price: '',
        subscriptValue: '',
        recommendValue: '',
        hotSearchValue: '',
      });
    });
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  render() {
    const { modalVisible, price, subscriptValue, recommendValue, hotSearchValue } = this.state;
    return (
      <Modal title="批量操作" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="720px" >
        <div className="mediaModalRow">
          <span>价格：</span>
          <Input value={price} onChange={this.priceOnChange} placeholder="请输入价格" />
        </div>
        <div className="mediaModalRow">
          <span>角标：</span>
          <RadioGroup value={subscriptValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.subscriptOnChange}>
            <Radio value="">不操作</Radio>
            <Radio value="无">无</Radio>
            <Radio value="热播">热播</Radio>
            <Radio value="VIP">VIP</Radio>
            <Radio value="特惠">特惠</Radio>
            <Radio value="付费">付费</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>是否推荐：</span>
          <RadioGroup value={recommendValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.recommendOnChange}>
            <Radio value="">不操作</Radio>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>是否热搜：</span>
          <RadioGroup value={hotSearchValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.hotSearchOnChange}>
            <Radio value="">不操作</Radio>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        </div>
      </Modal>
    );
  }
}

export default batchOperate;
