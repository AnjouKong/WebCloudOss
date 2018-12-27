import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, Input, Modal } from 'antd';
import AddInfo from './addInfo';
import EditInfo from './editInfo';
import Utils from '../../common/Utils';

const { Content } = Layout;
const Search = Input.Search;
const confirm = Modal.confirm;
const style = {
  A_Disible: { pointerEvents: 'none', color: '#aaa' }
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表状态参数 Liser
      data: [],
      pagination: { pageSize: 10, current: 1 },
      loading: false,
      // selectedRowKeys: [], // Check here to configure the default column
    };
    this.pager = { ...this.state.pagination };
    this.sorterValue = { sort: 'createTime', order: 'desc', };
    this.searchValue = {};
    this.tableFilters = {};
    // 列表项
    this.columns = [{
      title: '名称',
      dataIndex: 'title',
      // sorter: true,
      // defaultSortOrder: 'asc',
      // sortOrder: 'desc',
      width: '12%',
    }, {
      title: '内容',
      dataIndex: 'content',
      width: '35%',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '12%',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '12%',
    }, {
      title: '状态',
      dataIndex: 'state',
      // filters: [
      //   { text: '发布', value: '1' },
      //   { text: '未发布', value: '0' },
      // ],
      width: '8%',
      render: state => (state === 0 ? '未发布' : '发布')
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'action',
      width: '20%',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editState(record)}>{record.state === 0 ? '发布' : '取消发布'}</a>
          <Divider type="vertical" />
          <a onClick={() => this.editChild.showEditModal(record)} style={record.state === 1 ? style.A_Disible : null}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteInfo({ id: record.id }, record.title)} style={record.state === 1 ? style.A_Disible : null}>删除</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getInfoList();
  }

  /**
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
   */

  onSearchChange = (value) => {
    console.log(value);
    this.searchValue = {};
    if (value) {
      this.searchValue = { title: value };
    }
    this.getInfoList();
  };

  // 获取信息列表接口
  getInfoList = () => {
    console.log(this.pager);
    const params = {
      tenantId: window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '',
      userId: window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).id : '',
      size: this.pager.pageSize,
      page: this.pager.current,
      ...this.tableFilters,
      ...this.searchValue,
      ...this.sorterValue,
    };
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/message/page`,
      method: 'get',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      // const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      this.pager.total = res.totalRows;
      this.setState({
        loading: false,
        data: res.data,
        pagination: this.pager,
      });
    });
  };

  // 确认对话框
  showConfirm = (titleText, okFun) => {
    confirm({
      title: titleText,
      // content: 'Some descriptions',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // console.log('OK');
        okFun();
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  // 更改状态
  editState = (record) => {
    if (record.state === 0) {
      this.showConfirm(`确认发布【${record.title}】信息吗？`, () => {
        this.publishInfo({ id: record.id, });
      });
    } else if (record.state === 1) {
      this.showConfirm(`确认取消发布【${record.title}】信息吗？`, () => {
        this.unPublishInfo({ id: record.id, });
      });
    }
  };
  // 发布接口
  publishInfo = (params) => {
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/message/publish`,
      method: 'post',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        this.getInfoList();
      }
    });
  };
  // 取消发布接口
  unPublishInfo = (params) => {
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/message/unPublish`,
      method: 'post',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        this.getInfoList();
      }
    });
  };
  // 删除接口
  deleteInfo = (params, infoName) => {
    console.log('params:', params);
    this.showConfirm(`确认删除【${infoName}】信息吗？`, () => {
      // 删除
      this.setState({ loading: true });
      Utils.request({
        url: `${window.PAY_API_HOST}/op/app/message/delete`,
        method: 'post',
        data: {
          ...params,
        },
        type: 'json',
      }).then((res) => {
        console.log(res);
        if (res.success) {
          this.getInfoList();
        }
      });
      // over
    });
  };

  handleTableChange = (pagination, filters) => {
    this.pager.current = pagination.current;
    this.tableFilters = filters;
    /**
    this.sorterValue = {};
    if (sorter.field && sorter.order) {
      this.sorterValue = {
        sort: sorter.field,
        order: sorter.order,
      };
    }
     */

    this.setState({
      pagination: this.pager,
    });
    console.log(this.pager);
    console.log(this.state.pagination);
    this.getInfoList();
  };
  render() {
    /**
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    */
    // style={{ marginTop: -38, marginLeft: 160, height: 40 }
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>信息发布</Breadcrumb.Item>
          <Breadcrumb.Item>信息列表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 40, backgroundColor: '#fff', paddingTop: 20 }} >
          <Search
            style={{ width: 220, marginRight: 20, float: 'right' }}
            placeholder="搜索"
            onSearch={this.onSearchChange}
            enterButton
          />
          <Button type="primary" style={{ marginLeft: 20 }} onClick={() => this.addChild.showAddModal()} >
            新建
          </Button>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              columns={this.columns}
              // rowSelection={rowSelection}
              rowKey={record => record.id}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
            <AddInfo onRef={(ref) => { this.addChild = ref; }} onOK={() => this.getInfoList({ size: 10, page: 1, })} />
            <EditInfo onRef={(ref) => { this.editChild = ref; }} onOK={() => this.getInfoList({ size: 10, page: 1, })} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default List;
