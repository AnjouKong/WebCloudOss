import React, { Component } from 'react';
import { Modal, Row, Col, Input, Select, Radio, message, } from 'antd';
import Utils from '../../common/Utils';
import './nodeManage.css';

const Option = Select.Option;
const RadioGroup = Radio.Group;
let selectChildren = [];

class addPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      id: '',
      nodeName: '', // 名称
      tenantId: '', // 商户
      memory: '', // 内存大小*
      disk: '', // 硬盘大小
      bandWidth: '', // 带宽大小*
      cachePath: '', // 缓存区地址*
      cacheSize: '', // 缓存区大小
      mediaScheduledClose: '', // 预下载停止策略*
      monitorSwitch: '0', // 监控开关*
      monitorScheduled: '', // 监控策略*
      downloadSwitch: '0', // 预下载开关*
      mediaScheduled: '', // 预下载策略*
      rateLimit: '', // 性能比率限制*
      maxTaskSize: '', // 并发任务数量限制*
      downloadSpeed: '', // 任务下载限速/秒*
      tsSize: '', // 默认下载ts片段个数
      proxyUrl: '', // 代理地址
      mediaTime: '', // 媒资缓存有效时间，比nginx配置小*
    };
  }
  componentWillMount() {
    this.getTenantList();
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取商户
  getTenantList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/page`,
      method: 'post',
      data: {
        page: 1,
        size: 999,
      }
    })
    .then(res => {
      res = res.data;
      console.log(res);
      selectChildren = [];
      for (let i = 0; i < res.length; i += 1) {
        selectChildren.push(<Option key={res[i].id} value={res[i].id} title={res[i].tenantName}>{res[i].tenantName}</Option>);
      }
    });
  };
  // 弹出框处理函数
  showEditModal = (record) => {
    console.log(record);
    this.setState({
      modalVisible: true,
      id: record.key,
      nodeName: record.nodeName,
      tenantId: record.tenantId,
      memory: record.memory,
      disk: record.disk,
      bandWidth: record.bandWidth,
      cachePath: record.cachePath,
      cacheSize: record.cacheSize,
      monitorSwitch: `${record.monitorSwitch}`,
      monitorScheduled: record.monitorScheduled,
      mediaScheduledClose: record.mediaScheduledClose,
      downloadSwitch: `${record.downloadSwitch}`,
      mediaScheduled: record.mediaScheduled,
      rateLimit: record.rateLimit,
      maxTaskSize: record.maxTaskSize,
      downloadSpeed: record.downloadSpeed,
      tsSize: record.tsSize,
      proxyUrl: record.proxyUrl,
      mediaTime: record.mediaTime,
    });
  };
  // 名称
  nameOnChange = (e) => {
    this.setState({
      nodeName: e.target.value,
    });
  }
  // 商户select改变时
  tenantOnChange = (value) => {
    console.log(value);
    this.setState({
      tenantId: value
    });
  }
  memoryOnChange = (e) => {
    this.setState({
      memory: e.target.value,
    });
  }
  diskOnChange = (e) => {
    this.setState({
      disk: e.target.value,
    });
  }
  bandWidthOnChange = (e) => {
    this.setState({
      bandWidth: e.target.value,
    });
  }
  cachePathOnChange = (e) => {
    this.setState({
      cachePath: e.target.value,
    });
  }
  cacheSizeOnChange = (e) => {
    this.setState({
      cacheSize: e.target.value,
    });
  }
  mediaScheduledCloseOnChange = (e) => {
    this.setState({
      mediaScheduledClose: e.target.value,
    });
  }
  monitorSwitchOnChange = (e) => {
    this.setState({
      monitorSwitch: e.target.value,
    });
  }
  monitorScheduledOnChange = (e) => {
    this.setState({
      monitorScheduled: e.target.value,
    });
  }
  downloadSwitchOnChange = (e) => {
    this.setState({
      downloadSwitch: e.target.value,
    });
  }
  mediaScheduledOnChange = (e) => {
    this.setState({
      mediaScheduled: e.target.value,
    });
  }
  rateLimitOnChange = (e) => {
    this.setState({
      rateLimit: e.target.value,
    });
  }
  maxTaskSizeOnChange = (e) => {
    this.setState({
      maxTaskSize: e.target.value,
    });
  }
  downloadSpeedOnChange = (e) => {
    this.setState({
      downloadSpeed: e.target.value,
    });
  }
  tsSizeOnChange = (e) => {
    this.setState({
      tsSize: e.target.value,
    });
  }
  proxyUrlOnChange = (e) => {
    this.setState({
      proxyUrl: e.target.value,
    });
  }
  mediaTimeOnChange = (e) => {
    this.setState({
      mediaTime: e.target.value,
    });
  }
  // 修改提交
  modalOk = () => {
    if (this.state.nodeName === '' || this.state.memory === '' || this.state.bandWidth === ''
      || this.state.rateLimit === '' || this.state.cachePath === '' || this.state.monitorScheduled === ''
      || this.state.mediaScheduled === '' || this.state.mediaScheduledClose === '' || this.state.maxTaskSize === ''
      || this.state.downloadSpeed === '' || this.state.mediaTime === '') {
      Modal.error({
        title: ' * 为必填项，请填写！',
      });
      return;
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/update`,
      method: 'post',
      data: {
        id: this.state.id,
        name: this.state.nodeName,
        tenantId: this.state.tenantId,
        memory: this.state.memory,
        disk: this.state.disk,
        bandWidth: this.state.bandWidth,
        cachePath: this.state.cachePath,
        cacheSize: this.state.cacheSize,
        mediaScheduledClose: this.state.mediaScheduledClose,
        monitorSwitch: this.state.monitorSwitch,
        monitorScheduled: this.state.monitorScheduled,
        downloadSwitch: this.state.downloadSwitch,
        mediaScheduled: this.state.mediaScheduled,
        rateLimit: this.state.rateLimit,
        maxTaskSize: this.state.maxTaskSize,
        downloadSpeed: this.state.downloadSpeed,
        tsSize: this.state.tsSize,
        proxyUrl: this.state.proxyUrl,
        mediaTime: this.state.mediaTime,
      },
    })
    .then(() => {
      this.setState({
        modalVisible: false,
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
    const { modalVisible, nodeName, tenantId, memory, disk, bandWidth, cachePath, cacheSize, mediaScheduledClose, monitorSwitch,
      monitorScheduled, downloadSwitch, mediaScheduled, rateLimit, maxTaskSize, downloadSpeed, tsSize, proxyUrl, mediaTime } = this.state;
    return (
      <Modal title="修改节点" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="1080px" >
        <Row>
          <Col span={12} className="nodeInfo">
            <span className="required">名称：</span>
            <Input value={nodeName} onChange={this.nameOnChange} placeholder="请输入名称" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>商户：</span>
            <Select value={tenantId} style={{ width: 'calc(100% - 170px)' }} onChange={this.tenantOnChange}>
              {selectChildren}
            </Select>
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">内存大小：</span>
            <Input value={memory} onChange={this.memoryOnChange} placeholder="请输入内存大小/G" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>硬盘大小：</span>
            <Input value={disk} onChange={this.diskOnChange} placeholder="请输入硬盘大小/G" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">带宽大小：</span>
            <Input value={bandWidth} onChange={this.bandWidthOnChange} placeholder="请输入带宽大小/M" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">缓存区地址：</span>
            <Input value={cachePath} onChange={this.cachePathOnChange} placeholder="请输入缓存区地址" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>缓存区大小：</span>
            <Input value={cacheSize} onChange={this.cacheSizeOnChange} placeholder="请输入缓存区大小/G" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">预下载策略：</span>
            <Input value={mediaScheduled} onChange={this.mediaScheduledOnChange} placeholder="预下载策略" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>监控开关：</span>
            <RadioGroup value={monitorSwitch} style={{ width: 'calc(100% - 170px)' }} onChange={this.monitorSwitchOnChange}>
              <Radio value="0">关闭</Radio>
              <Radio value="1">开启</Radio>
            </RadioGroup>
          </Col>
          <Col span={12} className="nodeInfo">
            <span>预下载开关：</span>
            <RadioGroup value={downloadSwitch} style={{ width: 'calc(100% - 170px)' }} onChange={this.downloadSwitchOnChange}>
              <Radio value="0">关闭</Radio>
              <Radio value="1">开启</Radio>
            </RadioGroup>
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">监控策略：</span>
            <Input value={monitorScheduled} onChange={this.monitorScheduledOnChange} placeholder="监控策略" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">预下载停止策略：</span>
            <Input value={mediaScheduledClose} onChange={this.mediaScheduledCloseOnChange} placeholder="预下载停止策略" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">性能比率限制：</span>
            <Input value={rateLimit} onChange={this.rateLimitOnChange} placeholder="性能比率限制" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">并发任务数量限制：</span>
            <Input value={maxTaskSize} onChange={this.maxTaskSizeOnChange} placeholder="并发任务数量限制" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">下载限速/秒：</span>
            <Input value={downloadSpeed} onChange={this.downloadSpeedOnChange} placeholder="任务下载限速/秒" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>默认下载ts片段个数：</span>
            <Input value={tsSize} onChange={this.tsSizeOnChange} placeholder="默认下载ts片段个数" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span>代理地址：</span>
            <Input value={proxyUrl} onChange={this.proxyUrlOnChange} placeholder="代理地址" />
          </Col>
          <Col span={12} className="nodeInfo">
            <span className="required">媒资缓存有效时间：</span>
            <Input value={mediaTime} onChange={this.mediaTimeOnChange} placeholder="时间戳，比nginx配置小" />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default addPrice;
