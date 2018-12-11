import React, { Component } from 'react';
import { Select } from 'antd';
import Utils from '../../../common/Utils';

const Option = Select.Option;

class editRowSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      index: this.props.index,
    };
  }
  // 表格行select改变时
  superscriptOnChange = (value) => {
    console.log(this.state.index, value);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/price`,
      method: 'post',
      data: {
        id: this.state.index,
        superscript: value,
      }
    })
    .then(res => {
      console.log(res);
      this.props.onOK();
    });
  }
  render() {
    return (
      <Select defaultValue={this.state.value} onChange={this.superscriptOnChange} style={{ width: 72 }}>
        <Option value="无">无</Option>
        <Option value="热播">热播</Option>
        <Option value="VIP">VIP</Option>
        <Option value="特惠">特惠</Option>
        <Option value="付费">付费</Option>
      </Select>
    );
  }
}

export default editRowSelect;
