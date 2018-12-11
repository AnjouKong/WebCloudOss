import React, { Component } from 'react';
import { Modal, Table, Button, Icon, Row, Col, Input } from 'antd';
import Utils from '../../../common/Utils';
import '../modal.css';

// 列表项
const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  width: '40%',
}, {
  title: '年份',
  dataIndex: 'filmYear',
  key: 'filmYear',
  width: '20%',
}, {
  title: '类型',
  dataIndex: 'sortType',
  key: 'sortType',
  width: '40%',
}];

class addMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filmId: '',
      selectedRowKeysLeft: [],
      selectedRowKeysRight: [],
      tableData: [],
      tableTotal: '',
      filmName: '',
      mediaTableData: [],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取信息列表接口
  getInfoList = (currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/page`,
      method: 'POST',
      data: {
        seriesName: this.state.filmName,
        page: currentPage,
        size: pageSize
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          key: `${resData[i].id}`,
          name: `${resData[i].seriesName}`,
          filmYear: `${resData[i].releaseYear}`,
          sortType: `${resData[i].seriesKeyword}`,
        });
      }
      this.setState({
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    });
  };
  // 列表翻页
  pageOnChangeLeft = (page, pageSize) => {
    this.setState({
      selectedRowKeysLeft: [],
    });
    this.getInfoList(page, pageSize);
  }
  // 名称
  nameOnChange= (e) => {
    this.setState({
      filmName: e.target.value,
    });
  }
  // 左侧选择行
  selectOnChangeLeft = (selectedRowKeysLeft) => {
    this.setState({
      selectedRowKeysLeft,
    });
  }
  // 分类添加媒资
  sortAddMedia = () => {
    console.log(this.state.selectedRowKeysLeft);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/category`,
      method: 'POST',
      data: {
        categoryId: this.state.filmId,
        ids: this.state.selectedRowKeysLeft,
      }
    })
    .then(res => {
      console.log(res);
    });
  };
  // 右侧选择行
  selectOnChangeRight = (selectedRowKeysRight) => {
    this.setState({
      selectedRowKeysRight,
    });
  }
  // 弹出框处理函数
  showAddMediaModal = (record) => {
    console.log(record);
    this.setState({
      modalVisible: true,
      filmId: record.key,
    });
    this.getInfoList('1', '10');
  };
  modalOk = () => {
    this.setState({
      modalVisible: false,
    });
    this.props.onOK();
  };

  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { modalVisible, selectedRowKeysLeft, selectedRowKeysRight, tableData, tableTotal, filmName, mediaTableData, } = this.state;
    const rowSelectionLeft = {
      selectedRowKeysLeft,
      onChange: this.selectOnChangeLeft,
    };
    const rowSelectionRight = {
      selectedRowKeysRight,
      onChange: this.selectOnChangeRight,
    };
    const hasSelectedLeft = selectedRowKeysLeft.length > 0;
    const hasSelectedRight = selectedRowKeysRight.length > 0;
    return (
      <Modal title="添加媒资" visible={modalVisible} onOk={this.modalOk} onCancel={this.modalCancel} width="70%" >
        <Row>
          <Col span={10} className="addMediaSide">
            <div>
              <Input value={filmName} onChange={this.nameOnChange} placeholder="影片名称" style={{ width: 130 }} />
              <Button type="primary" onClick={() => this.getInfoList('1', '10')}>筛选</Button>
            </div>
            <Table
              rowSelection={rowSelectionLeft}
              columns={columns}
              dataSource={tableData}
              scroll={{ y: 475 }}
              pagination={{ defaultCurrent: 1, pageSize: 10, total: tableTotal, onChange: (this.pageOnChangeLeft) }}
            />
          </Col>
          <Col span={4} className="addMediaCenter">
            <Button type="primary" onClick={() => this.sortAddMedia()} disabled={!hasSelectedLeft}>
              加入<Icon type="right" />
            </Button>
            <Button type="primary" onClick={() => this.sortAddMedia()} disabled={!hasSelectedLeft}>
              加入置顶<Icon type="right" />
            </Button>
          </Col>
          <Col span={10} className="addMediaSide">
            <Button type="primary" disabled={!hasSelectedRight}>
              置顶
            </Button>
            <Button type="primary" disabled={!hasSelectedRight}>
              置底
            </Button>
            <Button type="primary" disabled={!hasSelectedRight}>
              删除
            </Button>
            <Table
              rowSelection={rowSelectionRight}
              columns={columns}
              dataSource={mediaTableData}
              pagination={false}
              scroll={{ y: 525 }}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default addMedia;
