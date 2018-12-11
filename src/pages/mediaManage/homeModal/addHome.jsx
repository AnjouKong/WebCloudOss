import React, { Component } from 'react';
import { Modal, Input, Button, Table, Popconfirm, } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

const { TextArea } = Input;

class addSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      vodName: '',
      describeInfo: '',
      headTableData: [],
      // 媒资列表
      mediaVisible: false,
      mediaName: '',
      mediaTableData: [],
      mediaTableTotal: '',
      mediaCurrent: 1,
      mediaHasSelected: false,
      mediaSelectedRowKeys: [],
      mediaSelectedRows: [],
      // 专题列表
      topicVisible: false,
      topicName: '',
      topicTableData: [],
      topicTableTotal: '',
      topicCurrent: 1,
    };
    // 首页头部列表项
    this.headColumns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'keyWord',
      key: 'keyWord',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => (
        <Popconfirm title="确认删除？" onConfirm={() => this.deleteInfo(index)}>
          <a>删除</a>
        </Popconfirm>
      )
    }];
    // 首页底部列表项
    this.lastColumns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '影片标签',
      dataIndex: 'keyWord',
      key: 'keyWord',
    }, {
      title: '年份',
      dataIndex: 'filmYear',
      key: 'filmYear',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => (
        <Popconfirm title="确认删除？" onConfirm={() => this.deleteInfo(index)}>
          <a>删除</a>
        </Popconfirm>
      )
    }];
    this.mediaColumns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '影片标签',
      dataIndex: 'keyWord',
      key: 'keyWord',
    }, {
      title: '地区',
      dataIndex: 'area',
      key: 'area',
    }, {
      title: '年份',
      dataIndex: 'filmYear',
      key: 'filmYear',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    }];
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取媒资列表
  getInfoList = (currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/page`,
      method: 'post',
      data: {
        name: this.state.mediaName,
        page: currentPage,
        size: pageSize
      },
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          key: `${resData[i].id}`,
          name: `${resData[i].name}`,
          keyWord: `${resData[i].keyWord}`,
          filmYear: `${resData[i].releaseYear}`,
          area: `${resData[i].country}`,
          price: `${resData[i].originalPrice}` === 'undefined' ? '0' : `${resData[i].originalPrice}`,
          score: `${resData[i].score}` === 'null' ? '无' : `${resData[i].score}`,
        });
      }
      this.setState({
        mediaTableData: dataArray,
        mediaTableTotal: res.totalRows,
      });
    });
  };
  // 弹出框处理函数
  showAddModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  // 专题名称
  vodOnChange = (e) => {
    this.setState({
      vodName: e.target.value,
    });
  }
  // 删除新增媒资
  deleteInfo = (index) => {
    const { headTableData } = this.state;
    headTableData.splice(index, 1);
    this.setState({
      headTableData,
    });
  }
  // 添加媒资modal
  addMedia = (place) => {
    console.log(place);
    this.setState({
      mediaVisible: true,
    });
    this.getInfoList(this.state.mediaCurrent, '10');
  }
  // 媒资列表翻页
  mediaPageOnChange = (page, pageSize) => {
    this.setState({
      mediaCurrent: page,
    });
    this.getInfoList(page, pageSize);
  }
  // 媒资名称
  mediaOnChange = (e) => {
    this.setState({
      mediaName: e.target.value,
    });
  }
  // 添加媒资
  confirmMediaInfo = () => {
    const resData = this.state.mediaSelectedRows;
    const dataArray = [];
    for (let i = 0; i < resData.length; i += 1) {
      dataArray.push({
        key: `${resData[i].key}`,
        name: `${resData[i].name}`,
        keyWord: `${resData[i].keyWord}`,
        filmYear: `${resData[i].filmYear}`,
        area: `${resData[i].country}`,
        price: `${resData[i].originalPrice}` === 'undefined' ? '0' : `${resData[i].originalPrice}`,
        score: `${resData[i].score}` === 'null' ? '无' : `${resData[i].score}`,
      });
    }
    const newArray = dataArray.concat(this.state.mediaTableData);
    // 去重
    const hash = {};
    const headTableDataArray = newArray.reduce((item, next) => {
      // hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      if (!hash[next.name]) {
        hash[next.name] = true;
        item.push(next);
      }
      return item;
    }, []);
    this.setState({
      headTableData: headTableDataArray,
      mediaVisible: false,
    });
  }
  mediaCancel = () => {
    this.setState({
      mediaVisible: false,
    });
  }
  // 添加专题modal
  addTopic = () => {
    this.setState({
      topicVisible: true,
    });
    // this.getInfoList(this.state.topicCurrent, '10');
  }
  // 媒资列表翻页
  topicPageOnChange = (page, pageSize) => {
    console.log(pageSize);
    this.setState({
      topicCurrent: page,
    });
    // this.getInfoList(page, pageSize);
  }
  // 媒资名称
  topicOnChange = (e) => {
    this.setState({
      topicName: e.target.value,
    });
  }
  topicCancel = () => {
    this.setState({
      topicVisible: false,
    });
  }
  // 新增首页
  modalOk = () => {
    console.log(this.state.headTableData);
    if (this.state.vodName === '') {
      Modal.error({
        title: '请输入名称',
      });
      return;
    }
    const resData = this.state.headTableData;
    const ids = [];
    for (let i = 0; i < resData.length; i += 1) {
      ids.push(`${resData[i].key}`);
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/subject/add`,
      method: 'post',
      data: {
        name: this.state.vodName,
        ids,
      },
    })
    .then(() => {
      this.setState({
        modalVisible: false,
        vodName: '',
        headTableData: [],
        mediaCurrent: 1,
        mediaSelectedRowKeys: [],
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
    const { modalVisible, mediaVisible, topicVisible, mediaSelectedRowKeys, mediaHasSelected, vodName, describeInfo, mediaCurrent,
      headTableData, mediaTableTotal, mediaName, mediaTableData, topicName, topicCurrent, topicTableData, topicTableTotal } = this.state;
    const rowSelection = {
      selectedRowKeys: mediaSelectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          mediaHasSelected: true,
          mediaSelectedRowKeys: selectedRowKeys,
          mediaSelectedRows: selectedRows,
        });
      },
    };
    return (
      <Modal title="添加媒资首页" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="820px" >
        <div className="topicModal">
          <span>首页名称：</span>
          <Input value={vodName} onChange={this.vodOnChange} placeholder="vod首页名称" />
        </div>
        <div className="topicModal">
          <span>首页头部信息：</span>
          <Button type="primary" icon="plus" onClick={() => this.addMedia('head')} style={{ marginRight: 7 }}>选择媒资</Button>
          <Button type="primary" icon="plus" onClick={this.addTopic}>选择专题</Button>
        </div>
        <div className="topicModal">
          <span>头部已选择信息：</span>
          <Table
            size="small"
            columns={this.headColumns}
            dataSource={headTableData}
            pagination={false}
            style={{ width: 'calc(100% - 140px)', float: 'right' }}
          />
        </div>
        <div className="topicModal">
          <span>首页底部媒资：</span>
          <Button type="primary" icon="plus" onClick={() => this.addMedia('last')}>选择媒资</Button>
        </div>
        <div className="topicModal">
          <span>底部已选择媒资：</span>
          <Table
            size="small"
            columns={this.lastColumns}
            dataSource={headTableData}
            pagination={false}
            style={{ width: 'calc(100% - 140px)', float: 'right' }}
          />
        </div>
        <div className="topicModal">
          <span>描述：</span>
          <TextArea
            autosize={{ minRows: 3, maxRows: 3 }} style={{ width: 'calc(100% - 140px)', float: 'right' }}
            value={describeInfo} onChange={this.describeOnChange}placeholder="请输入描述信息"
          />
        </div>
        <Modal title="添加媒资" visible={mediaVisible} onCancel={this.mediaCancel} footer={null} width="820px" >
          <div style={{ height: 60, backgroundColor: '#fff', padding: '0px 20px' }} >
            <Button type="primary" disabled={!mediaHasSelected} onClick={this.confirmMediaInfo} >
              确定
            </Button>
            <div style={{ float: 'right' }}>
              <Input value={mediaName} placeholder="影片名称" onChange={this.mediaOnChange} style={{ width: 130, marginRight: 7 }} />
              <Button type="primary" onClick={() => this.getInfoList('1', '10')}>筛选</Button>
            </div>
          </div>
          <Table
            size="middle"
            rowSelection={rowSelection}
            columns={this.mediaColumns}
            dataSource={mediaTableData}
            pagination={{ mediaCurrent, pageSize: 10, total: mediaTableTotal, onChange: (this.mediaPageOnChange) }}
          />
        </Modal>
        <Modal title="添加专题" visible={topicVisible} onCancel={this.topicCancel} footer={null} width="820px" >
          <div style={{ height: 60, backgroundColor: '#fff', padding: '0px 20px' }} >
            <Button type="primary" disabled={!mediaHasSelected} onClick={this.headTopicInfo} >
              确定
            </Button>
            <div style={{ float: 'right' }}>
              <Input value={topicName} placeholder="专题名称" onChange={this.topicOnChange} style={{ width: 130, marginRight: 7 }} />
              <Button type="primary" onClick={() => this.getInfoList('1', '10')}>筛选</Button>
            </div>
          </div>
          <Table
            size="middle"
            rowSelection={rowSelection}
            columns={this.mediaColumns}
            dataSource={topicTableData}
            pagination={{ topicCurrent, pageSize: 10, total: topicTableTotal, onChange: (this.topicPageOnChange) }}
          />
        </Modal>
      </Modal>
    );
  }
}

export default addSort;
