import React, { Component } from 'react';
import { Modal, Input, DatePicker, Radio, } from 'antd';
// import Utils from '../../../common/Utils';
import '../modal.css';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

class libraryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      stateValue: '',
      subscriptValue: '',
      recommendValue: '',
      hotSearchValue: '',
    };
    this.startDay = '';
    this.endDay = '';
    this.$filmName = null;
    this.$filmYear = null;
    this.$area = null;
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  // 弹出框处理函数
  showFilterModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  // 时间区间选择确定
  dateOnChange = (moment, dateString) => {
    console.log(dateString);
    if (dateString[0] === '') {
      this.startDay = '';
      this.endDay = '';
    } else {
      this.startDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.endDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  // 状态  状态：初始化0，上架1，下架2
  stateOnChange = (e) => {
    console.log('状态：', e.target.value);
    this.setState({
      stateValue: e.target.value,
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
    this.paramData = {
      name: this.$filmName.input.value,
      minPrice: '',
      maxPrice: '',
      releaseYear: this.$filmYear.input.value,
      country: this.$area.input.value,
      superscript: this.state.subscriptValue,
      isRecommend: this.state.recommendValue,
      isHot: this.state.hotSearchValue,
      startUpdateTime: this.startDay,
      endUpdateTime: this.endDay,
    };
    // console.log(this.paramData);
    this.props.onOK(this.paramData);
    this.setState({
      modalVisible: false,
    });
  };

  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { modalVisible, stateValue, subscriptValue, recommendValue, hotSearchValue } = this.state;
    return (
      <Modal title="筛选条件" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="720px" >
        <div className="mediaModalRow">
          <span>影片名称：</span>
          <Input ref={ref => { this.$filmName = ref; }} placeholder="请输入影片名称" />
        </div>
        <div className="mediaModalRow">
          <span>价格范围：</span>
          <Input ref={ref => { this.$lowPrice = ref; }} placeholder="低价格" style={{ width: 150 }} />
          <span style={{ width: 40, textAlign: 'center', display: 'inline-block', marginRight: 0 }} >——</span>
          <Input ref={ref => { this.$highPrice = ref; }} placeholder="高价格" style={{ width: 150 }} />
        </div>
        <div className="mediaModalRow">
          <span>年份：</span>
          <Input ref={ref => { this.$filmYear = ref; }} placeholder="请输入年份" />
        </div>
        <div className="mediaModalRow">
          <span>地区：</span>
          <Input ref={ref => { this.$area = ref; }} placeholder="请输入地区" />
        </div>
        <div className="mediaModalRow">
          <span>状态：</span>
          <RadioGroup value={stateValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.stateOnChange}>
            <Radio value="">全部</Radio>
            <Radio value="0">初始化</Radio>
            <Radio value="1">上架</Radio>
            <Radio value="2">下架</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>角标：</span>
          <RadioGroup value={subscriptValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.subscriptOnChange}>
            <Radio value="">全部</Radio>
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
            <Radio value="">全部</Radio>
            <Radio value="是">是</Radio>
            <Radio value="否">否</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>是否热搜：</span>
          <RadioGroup value={hotSearchValue} style={{ width: 'calc(100% - 110px)' }} onChange={this.hotSearchOnChange}>
            <Radio value="">全部</Radio>
            <Radio value="是">是</Radio>
            <Radio value="否">否</Radio>
          </RadioGroup>
        </div>
        <div className="mediaModalRow">
          <span>更新时间：</span>
          <RangePicker
            size="large" showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['更新开始时间', '更新结束时间']}
            onChange={this.dateOnChange} style={{ width: 340, marginRight: 0 }}
          />
        </div>
      </Modal>
    );
  }
}

export default libraryFilter;
