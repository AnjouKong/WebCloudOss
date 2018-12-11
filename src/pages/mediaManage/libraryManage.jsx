import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Button, Select, Modal, } from 'antd';
import Utils from '../../common/Utils';
import MediaFilter from './libraryModal/mediaFilter';
import BatchOperate from './libraryModal/batchOperate';
import EditInfo from './libraryModal/editInfo';
import EditRowPrice from './libraryModal/editRowPrice';
import EditRowSelect from './libraryModal/editRowSelect';

const { Content } = Layout;
const confirm = Modal.confirm;
const Option = Select.Option;

class libraryManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      current: 1,
      tableData: [],
      tableTotal: '',
      selectChildren: [],
    };
    this.mediaType = '';
    this.mediaBelong = '1';
    this.filmState = '';
    this.param = {};
    this.handleChildChange = this.handleChildChange.bind(this); // 监听子组件变化
    // 列表项
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '120px',
    }, {
      title: '影片标签',
      dataIndex: 'keyWord',
      key: 'keyWord',
    }, {
      title: '年份',
      dataIndex: 'filmYear',
      key: 'filmYear',
    }, {
      title: '地区',
      dataIndex: 'area',
      key: 'area',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <EditRowPrice
          value={text}
          index={record.key}
          onOK={() => this.getInfoList(this.state.current, '10')}
        />
      ),
    }, {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
    }, {
      title: '角标',
      dataIndex: 'superscript',
      key: 'superscript',
      render: (text, record) => (
        <EditRowSelect
          value={text}
          index={record.key}
          onOK={() => this.getInfoList(this.state.current, '10')}
        />
      ),
    }, {
      title: '推荐',
      dataIndex: 'recommend',
      key: 'recommend',
    }, {
      title: '热搜',
      dataIndex: 'hotSearch',
      key: 'hotSearch',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editModal.showEditModal(record)}>修改</a>
          {/* <Divider type="vertical" />
          <a onClick={() => this.deleteInfo(record.key)}>删除</a> */}
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getCategoryList();
    this.getInfoList('1', '10', 'belong');
  }
  // 获取分类列表
  getCategoryList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/category/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      res = res.data;
      const { selectChildren } = this.state;
      for (let i = 0; i < res.length; i += 1) {
        selectChildren.push(<Option key={res[i].categoryId} value={res[i].categoryId}>{res[i].categoryName}</Option>);
      }
    });
  };
  // 获取信息列表
  getInfoList = (currentPage, pageSize, type) => { // type: belong类型 sort分类 filter筛选
    // console.log(type);
    if (type !== 'filter') {
      this.param = {
        type: this.mediaBelong,
        categoryId: this.mediaType,
        page: currentPage,
        size: pageSize
      };
    }
    console.log('列表参数：', this.param);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/media/page`,
      method: 'post',
      data: this.param,
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        if (`${resData[i].state}` === '0') { // 状态state：初始化0，上架1，下架2
          this.filmState = '初始化';
        }
        if (`${resData[i].state}` === '1') {
          this.filmState = '上架';
        }
        if (`${resData[i].state}` === '2') {
          this.filmState = '下架';
        }
        dataArray.push({
          key: `${resData[i].id}`,
          name: `${resData[i].seriesName}`,
          keyWord: `${resData[i].seriesKeyword}`,
          filmYear: `${resData[i].releaseYear}`,
          area: `${resData[i].originalCountry}`,
          state: this.filmState,
          price: resData[i].originalPrice ? `${resData[i].originalPrice}` : '0',
          score: resData[i].score ? `${resData[i].score}` : '无',
          superscript: resData[i].superscript ? `${resData[i].superscript}` : '无',
          recommend: `${resData[i].isRecommend}` === '1' ? '推荐' : '',
          hotSearch: `${resData[i].hot}` === '1' ? '热搜' : '',
          updateTime: `${resData[i].updateTime}`,
          // categoryId: ['1', '3'],  // ###
          type: `${resData[i].type}`,
        });
      }
      this.setState({
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    });
  };
  // 处理子函数传回来数据
  handleChildChange = (paramData) => {
    this.param = Object.assign(paramData, this.param);
    this.getInfoList('1', '10', 'filter');
  }
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
      selectedRowKeys: [],
    });
    this.getInfoList(page, pageSize);
  }
  // 选择行
  selectOnChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }
  // 删除
  // deleteInfo = (id) => {
  //   console.log(id);
  //   confirm({
  //     title: '确认删除吗？',
  //     okText: '确认',
  //     cancelText: '取消',
  //     onOk: () => {
  //       Utils.request({
  //         url: `${window.PAY_API_HOST}/op/media/delete`,
  //         method: 'post',
  //         data: {
  //           ids: id
  //         }
  //       })
  //       .then(res => {
  //         this.getInfoList(this.state.current, '10');
  //       });
  //     },
  //     onCancel() {
  //       // console.log('Cancel');
  //     },
  //   });
  // };
  // 上架，下架
  publishStateInfo = (status) => {
    console.log('选中：', this.state.selectedRowKeys);
    const text = status === '1' ? '上架' : '下架';
    console.log('状态：', status);
    confirm({
      title: `确认${text}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/media/operation`,
          method: 'post',
          data: {
            seriesId: this.state.selectedRowKeys,
            state: status
          }
        })
        .then(() => {
          this.getInfoList(this.state.current, '10');
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  // 分类select改变时
  sortOnChange = (value) => {
    console.log(value);
    this.mediaType = value;
    this.getInfoList('1', '10');
  }
  belongChange = (value) => {
    console.log(value);
    this.mediaBelong = value;
    this.getInfoList('1', '10');
  }
  render() {
    const { selectedRowKeys, tableData, tableTotal, current, selectChildren, } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectOnChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>媒资管理</Breadcrumb.Item>
          <Breadcrumb.Item>媒资库管理</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
          <Select defaultValue="1" style={{ width: 90, marginRight: 7 }} onChange={this.belongChange}>
            <Option value="1">电影</Option>
            <Option value="2">电视剧</Option>
            <Option value="3">综艺</Option>
            <Option value="4">动漫</Option>
            <Option value="5">教育</Option>
            <Option value="6">其他栏目</Option>
          </Select>
          <Select defaultValue="所有分类" style={{ width: 110, marginRight: 7 }} onChange={this.sortOnChange}>
            <Option value="">所有分类</Option>
            {selectChildren}
          </Select>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.batchModal.showBatchModal(selectedRowKeys)} >
            批量操作
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.publishStateInfo('1')} >
            上架
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.publishStateInfo('2')} >
            下架
          </Button>
          <Button type="primary" style={{ float: 'right' }} onClick={() => this.filterModal.showFilterModal()} >
            筛选
          </Button>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <MediaFilter onRef={ref => { this.filterModal = ref; }} onOK={this.handleChildChange} />
            <BatchOperate onRef={ref => { this.batchModal = ref; }} onOK={() => this.getInfoList(current, '10')} />
            <EditInfo onRef={ref => { this.editModal = ref; }} onOK={() => this.getInfoList(current, '10')} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default libraryManage;
