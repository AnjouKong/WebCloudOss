import React, { Component } from 'react';
import { Modal, Input, Button, Radio, Upload, message, Icon, } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group; // Checkbox,
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

class editInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      rowId: '',
      filmName: '',
      filmYear: '',
      area: '',
      filmTag: '',
      price: '',
      score: '',
      superscriptValue: '',
      recommendValue: '',
      hotSearchValue: '',
      typeValue: '',
      // categoryValue: [],
      // options: [],
    };
    // this.categoryId = [];
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取分类列表
  // getCategoryList = () => {
  //   Utils.request({
  //     url: `${window.PAY_API_HOST}/op/category/list`,
  //     method: 'post',
  //     data: {}
  //   })
  //   .then(res => {
  //     res = res.data;
  //     // console.log(res);
  //     const dataArray = [];
  //     for (let i = 0; i < res.length; i += 1) {
  //       dataArray.push({
  //         label: `${res[i].name}`,
  //         value: `${res[i].id}`,
  //       });
  //     }
  //     this.setState({
  //       options: dataArray,
  //       categoryValue: this.categoryId,
  //     });
  //   });
  // };
  // 弹出框处理函数
  showEditModal = (record) => {
    console.log('选中行', record);
    // this.categoryId = record.categoryId; // ###
    this.setState({
      modalVisible: true,
      rowId: record.key,
      filmName: record.name,
      filmYear: record.filmYear,
      area: record.area,
      filmTag: record.keyWord,
      price: record.price,
      score: record.score,
      superscriptValue: record.superscript,
      recommendValue: record.recommend === '推荐' ? '1' : '0',
      hotSearchValue: record.hotSearch === '热搜' ? '1' : '0',
      typeValue: record.type,
      options: [],
    });
    // this.getCategoryList();
  };
  // input输入框
  nameOnChange = (e) => {
    console.log('点击：', e.target.value);
    this.setState({
      filmName: e.target.value,
    });
  }
  yearOnChange = (e) => {
    this.setState({
      filmYear: e.target.value,
    });
  }
  areaOnChange = (e) => {
    this.setState({
      area: e.target.value,
    });
  }
  tagOnChange = (e) => {
    this.setState({
      filmTag: e.target.value,
    });
  }
  priceOnChange = (e) => {
    this.setState({
      price: e.target.value,
    });
  }
  scoreOnChange = (e) => {
    this.setState({
      score: e.target.value,
    });
  }
  // 获取标签
  filmGetTag = () => {
    console.log('获取标签');
    this.setState({
      filmTag: '哈哈',
    });
  }
  // 角标
  superscriptOnChange = (e) => {
    this.setState({
      superscriptValue: e.target.value,
    });
  }
  // 推荐
  recommendOnChange = (e) => {
    this.setState({
      recommendValue: e.target.value,
    });
  }
  // 热搜
  hotSearchOnChange = (e) => {
    this.setState({
      hotSearchValue: e.target.value,
    });
  }
  // 影片类型
  typeOnChange = (e) => {
    this.setState({
      typeValue: e.target.value,
    });
  }
  // 影片分类多选
  // categoryOnChange = (checkedValues) => {
  //   console.log('多选', checkedValues);
  //   this.setState({
  //     categoryValue: checkedValues,
  //   });
  // }
  modalOk = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/edit`,
      method: 'post',
      data: {
        id: this.state.rowId,
        seriesName: this.state.filmName,
        releaseYear: this.state.filmYear,
        originalCountry: this.state.area,
        seriesKeyword: this.state.filmTag,
        originalPrice: this.state.price,
        score: this.state.score === '无' ? '' : this.state.score,
        superscript: this.state.superscriptValue,
        isRecommend: this.state.recommendValue,
        hot: this.state.hotSearchValue,
        type: this.state.typeValue,
        pictureUrl: '',
      },
    }).then((res) => {
      console.log(res);
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
    const { modalVisible, filmName, filmYear, area, filmTag, price, score, superscriptValue, recommendValue,
      hotSearchValue, typeValue, } = this.state;
    return (
      <Modal title="修改信息" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="720px" >
        <div className="editModalRow">
          <span>影片名称：</span>
          <Input value={filmName} placeholder="请输入名称" onChange={this.nameOnChange} />
        </div>
        <div className="editModalRow">
          <span>年份：</span>
          <Input value={filmYear} placeholder="请输入年份" onChange={this.yearOnChange} />
        </div>
        <div className="editModalRow">
          <span>地区：</span>
          <Input value={area} placeholder="请输入地区" onChange={this.areaOnChange} />
        </div>
        <div className="editModalRow">
          <span>影片标签：</span>
          <Input
            value={filmTag} onChange={this.tagOnChange}
            placeholder="请输入标签，用逗号“，”隔开" style={{ width: 'calc(100% - 220px)' }}
          />
          <Button type="primary" size="large" onClick={this.filmGetTag} style={{ width: 100, marginLeft: 10, marginTop: '-1px' }}>获取标签</Button>
        </div>
        <div className="editModalRow">
          <span>价格：</span>
          <Input value={price} placeholder="请输入价格" onChange={this.priceOnChange} />
        </div>
        <div className="editModalRow">
          <span>评分：</span>
          <Input value={score} placeholder="请输入评分" onChange={this.scoreOnChange} />
        </div>
        <div className="editModalRow">
          <span>角标：</span>
          <RadioGroup value={superscriptValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.superscriptOnChange}>
            <Radio value="无">无</Radio>
            <Radio value="热播">热播</Radio>
            <Radio value="VIP">VIP</Radio>
            <Radio value="特惠">特惠</Radio>
            <Radio value="付费">付费</Radio>
          </RadioGroup>
        </div>
        <div className="editModalRow">
          <span>是否推荐：</span>
          <RadioGroup value={recommendValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.recommendOnChange}>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        </div>
        <div className="editModalRow">
          <span>是否热搜：</span>
          <RadioGroup value={hotSearchValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.hotSearchOnChange}>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        </div>
        <div className="editModalRow">
          <span>影片类型：</span>
          <RadioGroup value={typeValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.typeOnChange}>
            <Radio value="1">电影</Radio>
            <Radio value="2">电视剧</Radio>
            <Radio value="3">综艺</Radio>
            <Radio value="4">动漫</Radio>
            <Radio value="5">教育</Radio>
            <Radio value="6">其他栏目</Radio>
          </RadioGroup>
        </div>
        {/* <div className="editModalRow">
          <span>影片分类：</span>
          <CheckboxGroup
            style={{ width: 'calc(100% - 110px)' }}
            options={options} value={categoryValue} onChange={this.categoryOnChange}
          />
        </div> */}
        <div className="editModalRow">
          <span>上传海报：</span>
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

export default editInfo;
