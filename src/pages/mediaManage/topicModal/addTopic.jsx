import React, { Component } from 'react';
import { Modal, Input, Radio, Button, Upload, message, Icon, Table, Popconfirm, } from 'antd';
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
      mediaVisible: false,
      showBuy: '1',
      mediaTableData: [],
      tableTotal: '',
      tableData: [],
      current: 1,
      mediaName: '',
      topicName: '',
      buyName: '',
      mediaSelectedRowKeys: [],
      mediaSelectedRows: [],
      hasSelected: false,
    };
    // 列表项
    this.addColumns = [{
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
  // 获取信息列表
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
        console.log(resData[i].score);
        dataArray.push({
          key: `${resData[i].id}`,
          name: `${resData[i].seriesName}`,
          keyWord: `${resData[i].seriesKeyword}`,
          filmYear: `${resData[i].releaseYear}`,
          area: `${resData[i].originalCountry}`,
          price: `${resData[i].originalPrice}` === 'undefined' ? '0' : `${resData[i].originalPrice}`,
          score: `${resData[i].score}` === null ? '无' : `${resData[i].score}`,
        });
      }
      this.setState({
        mediaTableData: dataArray,
        tableTotal: res.totalRows,
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
  topicOnChange = (e) => {
    this.setState({
      topicName: e.target.value,
    });
  }
  // 是否显示购买模块
  buyOnChange = (e) => {
    console.log('显示购买：', e.target.value);
    this.setState({
      showBuy: e.target.value,
    });
  }
  // 购买模块名称
  buyNameOnChange = (e) => {
    this.setState({
      buyName: e.target.value,
    });
  }
  // 删除新增媒资
  deleteInfo = (index) => {
    const { tableData } = this.state;
    tableData.splice(index, 1);
    this.setState({
      tableData,
    });
  }
  // 添加媒资modal
  addMedia = () => {
    this.setState({
      mediaVisible: true,
    });
    this.getInfoList(this.state.current, '10');
  }
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    this.getInfoList(page, pageSize);
  }
  // 影片名称
  mediaOnChange = (e) => {
    this.setState({
      mediaName: e.target.value,
    });
  }
  // 数组合并去重
  mergeArray = (arr1, arr2) => {
    const array = [];
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i].key !== '') {
        array.push(arr1[i]);
      }
    }
    for (let i = 0; i < arr2.length; i += 1) {
      let flag = true;
      for (let j = 0; j < arr1.length; j += 1) {
        if (arr2[i].key === arr1[j].key) {
          flag = false;
          break;
        }
      }
      if (flag && arr2[i] !== '') {
        array.push(arr2[i]);
      }
    }
    console.log('结果', array);
    this.setState({
      tableData: array,
      mediaVisible: false,
    });
  }
  // 向专题添加媒资
  confirmInfo = () => {
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
    const newArray = dataArray.concat(this.state.tableData);
    const hash = {};
    const tableDataArray = newArray.reduce((item, next) => {
      // hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      if (!hash[next.name]) {
        hash[next.name] = true;
        item.push(next);
      }
      return item;
    }, []);
    this.setState({
      tableData: tableDataArray,
      mediaVisible: false,
    });
    // this.mergeArray(dataArray, this.state.tableData);
  }
  mediaCancel = () => {
    this.setState({
      mediaVisible: false,
    });
  }
  // 新增专题
  modalOk = () => {
    console.log(this.state.tableData);
    if (this.state.topicName === '') {
      Modal.error({
        title: '请输入名称',
      });
      return;
    }
    const resData = this.state.tableData;
    const ids = [];
    for (let i = 0; i < resData.length; i += 1) {
      ids.push(`${resData[i].key}`);
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/subject/add`,
      method: 'post',
      data: {
        name: this.state.topicName,
        buyButtonName: this.state.buyName,
        showBuyButton: this.state.showBuy,
        ids,
      },
    })
    .then(() => {
      this.setState({
        modalVisible: false,
        showBuy: '1',
        tableData: [],
        current: 1,
        mediaSelectedRowKeys: [],
        topicName: '',
        buyName: '',
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
    const { modalVisible, mediaVisible, mediaSelectedRowKeys, hasSelected, topicName, showBuy, buyName, current,
      mediaTableData, tableTotal, mediaName, tableData, } = this.state;
    const rowSelection = {
      selectedRowKeys: mediaSelectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          hasSelected: true,
          mediaSelectedRowKeys: selectedRowKeys,
          mediaSelectedRows: selectedRows,
        });
      },
    };
    return (
      <Modal title="添加专题" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="820px" >
        <div className="topicModal">
          <span>专题名称：</span>
          <Input value={topicName} onChange={this.topicOnChange} placeholder="请输入专题名称" />
        </div>
        <div className="topicModal">
          <span>是否显示购买模块：</span>
          <RadioGroup value={showBuy} style={{ width: 'calc(100% - 150px)' }} onChange={this.buyOnChange}>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        </div>
        <div className="topicModal">
          <span>购买模块名称：</span>
          <Input value={buyName} onChange={this.buyNameOnChange} placeholder="购买模块名称" />
        </div>
        <div className="topicModal">
          <span>购买模块背景图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
        <div className="topicModal">
          <span>背景图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
        <div className="topicModal">
          <span>封面图片：</span>
          <Upload {...upload}>
            <Button>
              <Icon type="upload" />上传海报
            </Button>
          </Upload>
        </div>
        <div className="topicModal">
          <span>专题下媒资：</span>
          <Button type="primary" icon="plus" onClick={this.addMedia}>选择媒资</Button>
          <Modal title="添加媒资" visible={mediaVisible} onCancel={this.mediaCancel} footer={null} width="820px" >
            <div style={{ height: 60, backgroundColor: '#fff', padding: '0px 20px' }} >
              <Button type="primary" disabled={!hasSelected} onClick={this.confirmInfo} >
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
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
          </Modal>
        </div>
        <div className="topicModal">
          <span>已选择媒资：</span>
          <Table
            size="small"
            columns={this.addColumns}
            dataSource={tableData}
            pagination={false}
            style={{ width: 'calc(100% - 140px)', float: 'right' }}
          />
        </div>
      </Modal>
    );
  }
}

export default addSort;
