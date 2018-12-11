import React, { Component } from 'react';
import { Modal, Input, } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

class editPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      priceId: '',
      priceName: '',
      formula: '',
      defaultPrice: '',
      maxPrice: '',
      minPrice: '',
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
      priceId: record.key,
      priceName: record.name,
      formula: record.formula,
      defaultPrice: record.defaultPrice,
      maxPrice: record.maxPrice,
      minPrice: record.minPrice,
    });
  };
  // 名称
  priceOnChange = (e) => {
    this.setState({
      priceName: e.target.value,
    });
  }
  // 策略
  formulaOnChange = (e) => {
    this.setState({
      formula: e.target.value,
    });
  }
  // 默认值
  defaultOnChange = (e) => {
    this.setState({
      defaultPrice: e.target.value,
    });
  }
  // 最大值
  maxOnChange = (e) => {
    this.setState({
      maxPrice: e.target.value,
    });
  }
  // 最小值
  minOnChange = (e) => {
    this.setState({
      minPrice: e.target.value,
    });
  }
  // 新增专题
  modalOk = () => {
    if (this.state.priceName === '') {
      Modal.error({
        title: '请输入名称',
      });
      return;
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/price/modify`,
      method: 'post',
      data: {
        id: this.state.priceId,
        name: this.state.priceName,
        exp: this.state.formula,
        defaultprice: this.state.defaultPrice,
        maxPrice: this.state.maxPrice,
        minPrice: this.state.minPrice,
      },
    })
    .then(() => {
      this.setState({
        modalVisible: false,
      });
      this.props.onOK();
    });
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { modalVisible, priceName, formula, defaultPrice, maxPrice, minPrice, } = this.state;
    return (
      <Modal title="添加价格策略" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="820px" >
        <div className="mediaModalRow">
          <span>名称：</span>
          <Input value={priceName} onChange={this.priceOnChange} placeholder="请输入名称" />
        </div>
        <div className="mediaModalRow">
          <span>策略：</span>
          <Input value={formula} onChange={this.formulaOnChange} placeholder="请输入策略" />
        </div>
        <div className="mediaModalRow">
          <span>默认值：</span>
          <Input value={defaultPrice} onChange={this.defaultOnChange} placeholder="请输入默认值" />
        </div>
        <div className="mediaModalRow">
          <span>最大值：</span>
          <Input value={maxPrice} onChange={this.maxOnChange} placeholder="请输入最大值" />
        </div>
        <div className="mediaModalRow">
          <span>最小值：</span>
          <Input value={minPrice} onChange={this.minOnChange} placeholder="请输入最小值" />
        </div>
      </Modal>
    );
  }
}

export default editPrice;
