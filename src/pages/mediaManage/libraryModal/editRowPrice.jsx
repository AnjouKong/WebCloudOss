import React, { Component } from 'react';
import { Input, Icon, } from 'antd';
import Utils from '../../../common/Utils';

class editRowPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      index: this.props.index,
      editable: false,
    };
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  edit = () => {
    console.log(this.state.index);
    this.setState({ editable: true });
  }
  editOnBlur = () => {
    console.log(this.state.value);
    this.setState({ editable: false });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/price`,
      method: 'post',
      data: {
        id: this.state.index,
        price: this.state.value,
      }
    })
    .then(res => {
      console.log(res);
      this.props.onOK();
    });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onBlur={this.editOnBlur}
                style={{ width: 70 }}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper" onClick={this.edit}>
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
              />
            </div>
        }
      </div>
    );
  }
}

export default editRowPrice;
