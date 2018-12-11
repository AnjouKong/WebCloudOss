import React, { Component } from 'react';
import { Modal, Input, Radio, Button, Upload, message, Icon, } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

const RadioGroup = Radio.Group;
const upload = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    console.log(info.file.status);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class addSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filmName: '',
      mediaSort: 'media',
      priceStrategy: '',
      radioList: [],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    this.getPriceList();
  }
  // 获取分类列表
  getPriceList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/price/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      res = res.data;
      const { radioList } = this.state;
      for (let i = 0; i < res.length; i += 1) {
        radioList.push(<Radio key={res[i].id} value={res[i].id}>{res[i].name}</Radio>);
      }
      this.setState({
        priceStrategy: res[0].id
      });
    });
  };
  // 弹出框处理函数
  showAddModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  // 名称
  nameOnChange= (e) => {
    this.setState({
      filmName: e.target.value,
    });
  }
  // 类型
  sortOnChange = (e) => {
    console.log('类型：', e.target.value);
    this.setState({
      mediaSort: e.target.value,
    });
  }
  // 价格策略
  priceOnChange = (e) => {
    console.log('价格策略：', e.target.value);
    this.setState({
      priceStrategy: e.target.value,
    });
  }
  modalOk = () => {
    if (this.state.filmName === '') {
      Modal.error({
        title: '请输入名称',
      });
      return;
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/category/add`,
      method: 'post',
      data: {
        categoryName: this.state.filmName,
        type: this.state.mediaSort,
        priceStrategyId: this.state.priceStrategy,
      },
    }).then(() => {
      this.setState({
        modalVisible: false,
        filmName: '',
        mediaSort: 'media',
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
    const { modalVisible, filmName, mediaSort, priceStrategy, radioList, } = this.state;
    return (
      <Modal title="添加分类" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="720px" >
        <div className="mediaModalRow">
          <span>分类名称：</span>
          <Input value={filmName} onChange={this.nameOnChange} placeholder="请输入影片名称" />
        </div>
        <div className="mediaModalRow">
          <span>类型：</span>
          <RadioGroup value={mediaSort} style={{ width: 'calc(100% - 110px)' }} onChange={this.sortOnChange}>
            <Radio value="media">媒资分类</Radio>
            <Radio value="subject">专题分类</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>价格策略：</span>
          <RadioGroup value={priceStrategy} style={{ width: 'calc(100% - 110px)' }} onChange={this.priceOnChange}>
            {radioList}
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>静态图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
        <div className="mediaModalRow">
          <span>焦点图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
        <div className="mediaModalRow">
          <span>选中图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
      </Modal>
    );
  }
}

export default addSort;
