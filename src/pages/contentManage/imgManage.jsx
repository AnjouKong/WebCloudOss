import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, Input, Modal, message, } from 'antd';
import Utils from '../../common/Utils';
import ContentList from './contentList';
import AddContent from './addContent';
import EditContent from './editContent';
import EditResource from './editResource';
import { ROLE_PERMISSIONS_VALUE } from '../../common/Constant';

const { Content, Sider } = Layout;
const confirm = Modal.confirm;
const Search = Input.Search;

let privileges = [];

class imgManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      current: 1,
      tableData: [],
      tableTotal: '',
      categoryId: '',
    };
    this.name = '';
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'content',
      key: 'content',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',

    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[6]) > -1 &&
            <a onClick={() => this.$editResource.showModal(record)}>配置资源</a>
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[4]) > -1 &&
            <Divider type="vertical" />
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[4]) > -1 &&
            <a onClick={() => this.$editContent.showModal(record)}>修改</a>
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[5]) > -1 &&
            <Divider type="vertical" />
           }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[5]) > -1 &&
            <a onClick={() => this.delete(record.key)}>删除</a>
          }
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getInfoList('1', '10');
  }
  onSearchChange = (value) => {
    console.log(value);
    this.name = value;
    this.getInfoList('1', '10');
  };
  // 获取信息列表接口
  getInfoList = (page, size, categoryId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/content/page`,
      method: 'post',
      data: {
        page,
        size,
        sort: 'updateTime',
        order: 'desc',
        type: 'img',
        name: this.name,
        categoryId,
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
        });
      }
      this.setState({
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    this.getInfoList(page, pageSize, this.state.categoryId);
  }
  // 删除
  delete = (id) => {
    confirm({
      title: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除用户
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/content/delete`,
          method: 'post',
          data: {
            ids: id,
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('删除成功');
            this.getInfoList('1', '10', this.state.categoryId);
          }
        })
        .catch(() => {
          message.error('删除失败');
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };
  // 点击左侧列表获取内容
  selectImgList = (param) => {
    this.setState({
      categoryId: param.eventKey
    });
    // 获取用户列表
    this.getInfoList('1', '10', param.eventKey);
  }

  render() {
    const { current, tableData, tableTotal, categoryId, } = this.state;
    const userInfo = JSON.parse(window.sessionStorage.getItem('UV_userInfo'));
    if (userInfo && userInfo.privileges) {
      privileges = userInfo.privileges;
    }

    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          <Breadcrumb.Item>图片管理</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={250} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
              <div className="orglist">
                <ContentList type="img" select={this.selectImgList} />
              </div>
            </Sider>
            <div style={{ width: '100%', padding: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.btn[3]) > -1 &&
                  <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.$addContent.showModal()}>新建</Button>
                }
                <Search
                  style={{ width: 220, marginRight: 20, float: 'right' }}
                  placeholder="输入名称"
                  onSearch={this.onSearchChange}
                  enterButton
                />
              </div>
              <Table
                columns={this.columns}
                dataSource={tableData}
                pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
              />
              <AddContent type="img" id={categoryId} onRef={ref => { this.$addContent = ref; }} onOK={() => this.getInfoList('1', '10', categoryId)} />
              <EditContent type="img" id={categoryId} onRef={ref => { this.$editContent = ref; }} onOK={() => this.getInfoList(current, '10', categoryId)} />
              <EditResource type="img" onRef={ref => { this.$editResource = ref; }} onOK={() => this.getInfoList(current, '10', categoryId)} />
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default imgManage;
