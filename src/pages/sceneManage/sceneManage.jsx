import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, Input, Modal, message, } from 'antd';
import { Link } from 'react-router';
import Utils from '../../common/Utils';
import { ROLE_PERMISSIONS_VALUE } from '../../common/Constant';
import SceneList from './SceneList';
import AddScene from './addScene';
import EditScene from './editScene';
import ReleaseVersion from './releaseVersion';
import ViewVersion from './viewVersion';

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
    this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
    this.name = '';
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',

    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[6]) > -1 &&
            <Link to={{ pathname: '/sceneManage/layout', query: { id: record.key } }}>配置场景</Link>
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[7]) > -1 &&
            <Divider type="vertical" />
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[7]) > -1 &&
            !this.tenantId
            ? <a onClick={() => this.$releaseVersion.showModal(record.key)}>发布新版本</a>
            : <a onClick={() => this.releaseVersion(record.key)}>发布新版本</a>
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[8]) > -1 &&
            !this.tenantId
            ? <Divider type="vertical" />
            : ''
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[8]) > -1 &&
            !this.tenantId
            ? <a onClick={() => this.$viewVersion.showModal(record.key)}>查看发布版本</a>
            : ''
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[4]) > -1 &&
            <Divider type="vertical" />
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[4]) > -1 &&
            <a onClick={() => this.$editScene.showModal(record)}>修改</a>
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[5]) > -1 &&
            <Divider type="vertical" />
          }
          {
            privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[5]) > -1 &&
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
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/scene/page`,
      method: 'post',
      data: {
        page,
        size,
        name: this.name,
        categoryId,
        tenantId: this.tenantId,
        sort: 'createTime',
        order: 'desc',
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
        loading: false,
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
  // 商户发布
  releaseVersion = (sceneId) => {
    confirm({
      title: '确认要发布吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/scene/tenantPublish`,
          method: 'post',
          data: {
            sceneId,
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('发布成功');
            this.getInfoList('1', '10', this.state.categoryId);
          }
        })
        .catch(() => {
          message.error('发布失败');
        });
      },
      onCancel: () => {
      },
    });
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
          url: `${window.PAY_API_HOST}/op/ui/scene/delete`,
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
    console.log(!this.tenantId);
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          <Breadcrumb.Item>图片管理</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Layout style={{ background: '#fff' }}>
            {
              !this.tenantId &&
              <Sider width={250} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
                <div className="orglist">
                  <SceneList type="img" select={this.selectImgList} />
                </div>
              </Sider>
            }
            <div style={{ width: '100%', padding: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[3]) > -1 &&
                  <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.$addScene.showModal()}>新建</Button>
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
              <AddScene id={categoryId} onRef={ref => { this.$addScene = ref; }} onOK={() => this.getInfoList('1', '10', categoryId)} />
              <EditScene id={categoryId} onRef={ref => { this.$editScene = ref; }} onOK={() => this.getInfoList(current, '10', categoryId)} />
              <ReleaseVersion onRef={ref => { this.$releaseVersion = ref; }} onOK={() => this.getInfoList(current, '10', categoryId)} />
              <ViewVersion onRef={ref => { this.$viewVersion = ref; }} onOK={() => this.getInfoList(current, '10', categoryId)} />
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default imgManage;
