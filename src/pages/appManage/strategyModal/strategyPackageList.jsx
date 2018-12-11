import React, { Component } from 'react';
import { Button, Modal, Input, message, Divider, Table } from 'antd';

import Utils from '../../../common/Utils';
import AddStrategyPackage from './addStrategyPackage';
import EditStrategyPackage from './editStrategyPackage';

const confirm = Modal.confirm;
const style = {
  A_Disible: { pointerEvents: 'none', color: '#aaa' }
};
let tenantList = [];

class StrategyPackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      tablePage: { current: 1, pageSize: 10, totalRows: 0 },
      currentAppUpgradeId: '',
    };

    this.formData = {
      searchTenantName: '',
    };

    this.columns = [{
      title: '策略包',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '升级商户',
      dataIndex: 'tenantId',
      key: 'tenantId',
      width: '50%',
      render: (tenantId) => (
        <span>
          {this.getTenantNames(tenantId)}
        </span>
      )
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '16%',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editUpgradeState(record)}>{record.state === 0 ? '发布' : '取消发布'}</a>
          <Divider type="vertical" />
          <a onClick={() => this.$editStrategyPackage.showModal(record)} style={record.state === 1 ? style.A_Disible : null}>修改</a>
        </span>
      )
    }];
  }

  componentWillMount() {
    this.getTenantList();
  }

  // 获取商户列表
  getTenantList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/page`,
      method: 'post',
      data: {
        page: 1,
        size: 10000,
      }
    })
      .then(res => {
        tenantList = res.data;
        this.getUpgradeList('1', '10');
      })
      .catch(() => {
        this.getUpgradeList('1', '10');
      });
  };
  getTenantNames = (tenantId) => {
    const tenantIdArr = tenantId.split(',');
    const tenantNameArr = [];
    tenantIdArr.forEach((value) => {
      const tenantObj = tenantList.find((v) => {
        return v.id === value;
      });
      if (tenantObj === undefined) {
        tenantNameArr.push(value);
      } else {
        tenantNameArr.push(tenantObj.tenantName);
      }
    });
    return tenantNameArr.join(',');
  };
  // 获取策略包列表
  getUpgradeList = (page, size, title) => {
    const dataTmp = {
      page,
      size,
      sort: 'updateTime',
      order: 'desc',
    };
    if (title) {
      dataTmp.title = title;
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/upgrade/page`,
      method: 'post',
      data: dataTmp,
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
          title: `${resData[i].title}`,
          tenantId: `${resData[i].tenantId}`,
          remark: `${resData[i].remark}`,
          state: resData[i].state,
          operation: '查看',
        });
      }
      this.setState({
        loading: false,
        tableData: dataArray,
        tablePage: { current: res.currentPage, totalRows: res.totalRows, pageSize: res.pageSize },
      });
    })
    .catch(() => {
      message.error('加载数据失败');
    });
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    const { searchUpgradeName } = this.formData;
    this.getUpgradeList(page, pageSize, searchUpgradeName);
  };
  inputOnchange = (e, type) => {
    switch (type) {
      case 'searchUpgradeName':
        this.formData.searchUpgradeName = e.target.value;
        break;
      default:
        break;
    }
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
  };
  // 发布策略包  取消发布策略包
  editUpgradeState = (record) => {
    if (record.state === 0) {
      this.showConfirm(`确认发布【${record.title}】策略包吗？`, () => {
        this.publishInfo({ id: record.id, });
      });
    } else if (record.state === 1) {
      this.showConfirm(`确认取消发布【${record.title}】策略包吗？`, () => {
        this.unPublishInfo({ id: record.id, });
      });
    }
  };
// 发布接口
  publishInfo = (params) => {
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/upgrade/release`,
      method: 'GET',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        this.getUpgradeList('1', '10');
      }
    }).catch(() => {
      message.error('发布失败');
    });
  };
  // 取消发布接口
  unPublishInfo = (params) => {
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/upgrade/cancel`,
      method: 'GET',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        this.getUpgradeList('1', '10');
      }
    }).catch(() => {
      message.error('取消发布失败');
    });
  };

  rowClick = (record, e) => {
    const eles = e.target.parentNode.parentNode.childNodes;
    for (let i = 0; i < eles.length; i += 1) {
      this.removeClass(eles[i], 'selected');
    }
    this.addClass(e.target.parentNode, 'selected');
    this.props.select(record);
  }

  // 判断样式是否存在
  hasClass = (ele, cls) => {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  // 为指定的dom元素添加样式
  addClass = (ele, cls) => {
    if (!this.hasClass(ele, cls)) ele.className += ' ' + cls;
  }
  // 删除指定dom元素的样式
  removeClass = (ele, cls) => {
    if (this.hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  }
  // 如果存在(不存在)，就删除(添加)一个样式
  toggleClass = (ele, cls) => {
    if (this.hasClass(ele, cls)) {
      this.removeClass(ele, cls);
    } else {
      this.addClass(ele, cls);
    }
  }

  // 调用
  toggleClassTest = () => {
    const ele = document.getElementsByTagName('body')[0];
    this.toggleClass(ele, 'night-mode');
  }

  // 查询商户
  searchUpgrade = () => {
    const { searchUpgradeName } = this.formData;
    this.getUpgradeList('1', '10', searchUpgradeName);
  };

  render() {
    const { loading, tableData, tablePage } = this.state;
    return (
      <div className="appListPage">
        <div className="appListBtn">
          <ul className="btnList clear-fix">
            <li><Button type="primary" onClick={() => this.$addStrategyPackage.showModal(this.state)}>新建策略包</Button></li>
          </ul>
          <div className="searchBox">
            <Input placeholder="策略包" onChange={e => this.inputOnchange(e, 'searchUpgradeName')} onPressEnter={this.searchUpgrade} />
            <Button type="primary" onClick={this.searchUpgrade}>查询</Button>
          </div>
        </div>

        <div className="appTable">
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={tableData}
            onRow={(record) => ({
              onClick: (e) => {
                this.rowClick(record, e);
              }
            })}
            // rowSelection={rowSelection}
            pagination={{ current: tablePage.current, pageSize: tablePage.pageSize, total: tablePage.totalRows, onChange: (this.pageOnChange) }}
          />
        </div>
        <AddStrategyPackage type={2} onRef={(ref) => { this.$addStrategyPackage = ref; }} onOK={() => this.getUpgradeList('1', '10')} />
        <EditStrategyPackage type={2} onRef={(ref) => { this.$editStrategyPackage = ref; }} onOK={() => this.getUpgradeList('1', '10')} />
      </div>
    );
  }
}

export default StrategyPackageList;
