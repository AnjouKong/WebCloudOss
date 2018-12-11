import React, { Component } from 'react';
import { Button, Modal, Input, message, Divider, Table } from 'antd';

import Utils from '../../common/Utils';

const confirm = Modal.confirm;

// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   type: 'radio',
//   columnWidth: 20
// };

class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      tableTotal: '',
      modalAddVisible: false,
      confirmLoading: false,
      modalEditVisible: false,
      EditRoleName: '',
      currentRoleId: '',
    };

    this.formData = {
      addRoleName: '',
      editRoleName: '',
      searchRoleName: '',
      addDescription: '',
      editDescription: '',
    };

    this.columns = [{
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editRole(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delRole(record)}>删除</a>
        </span>
      )
    }];
  }

  componentDidMount() {
    this.mounted = true;
    this.getRoleList();
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  // 获取角色列表
  getRoleList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/list`,
      method: 'post',
      data: {
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
          roleName: `${resData[i].name}`,
          description: `${resData[i].description}`,
          operation: '操作',
        });
      }
      if (this.mounted) {
        this.setState({
          loading: false,
          tableData: dataArray,
          tableTotal: res.totalRows,
        });
        this.props.onGetListSuccess(resData);
      }
    })
    .catch(() => {
    });
  };

  addRole = () => {
    this.clearFrom();
    this.setState({ modalAddVisible: true });
  };
  modalAddOk = () => {
    if (!this.formData.addRoleName) {
      message.success('角色名不能为空！');
      return;
    }
    if (!this.formData.addDescription) {
      message.success('角色描述能为空！');
      return;
    }

    this.setState({
      confirmLoading: true,
    });
    // 新建角色
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/add`,
      method: 'post',
      data: {
        name: this.formData.addRoleName,
        description: this.formData.addDescription,
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalAddVisible: false,
          confirmLoading: false,
        });
        message.success('新建成功');
        this.getRoleList();
      }
    })
    .catch(() => {
      this.setState({
        modalAddVisible: false,
        confirmLoading: false,
      });
      message.error('新建失败');
    });
  }
  modalAddCancel = () => {
    this.setState({ modalAddVisible: false });
  };
  clearFrom = () => {
    this.formData = {
      addRoleName: '',
      editRoleName: '',
      addDescription: '',
    };
  };
  editRole = (record) => {
    this.clearFrom();
    this.setState({ modalEditVisible: true });
    this.setState({
      EditRoleName: record.name,
      currentRoleId: record.id,
      editDescription: record.description,
    });
    this.formData.editRoleName = record.name;
  };
  modalEditOk = () => {
    if (!this.formData.editRoleName) {
      message.success('角色名不能为空！');
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    // 编辑角色
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/edit`,
      method: 'post',
      data: {
        name: this.formData.editRoleName,
        roleId: this.state.currentRoleId,
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalEditVisible: false,
          confirmLoading: false,
        });
        message.success('编辑成功');
        this.getRoleList();
      }
    })
    .catch(() => {
    });
  }
  modalEditCancel = () => {
    this.setState({ modalEditVisible: false });
  }


  inputOnchange = (e, type) => {
    switch (type) {
      case 'addRoleName':
        this.formData.addRoleName = e.target.value;
        break;
      case 'addDescription':
        this.formData.addDescription = e.target.value;
        break;
      case 'editRoleName':
        this.setState({ EditRoleName: e.target.value });
        this.formData.editRoleName = e.target.value;
        break;
      default:
        break;
    }
  }

  delRole = (record) => {
    confirm({
      title: `确认要删除【${record.name}】吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // console.log('OK');
        this.roleDel(record.id);
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }

  roleDel = (ids) => {
    // 删除角色
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/delete`,
      method: 'post',
      data: {
        ids,
      }
    })
    .then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getRoleList();
      }
    })
    .catch(() => {
    });
  }

  rowClick = (record, e) => {
    console.log(e.target.parentNode);
    const eles = e.target.parentNode.parentNode.childNodes;
    for (let i = 0; i < eles.length; i += 1) {
      this.removeClass(eles[i], 'selected');
    }
    this.addClass(e.target.parentNode, 'selected');
    this.props.select(record);
  };

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

  render() {
    const { loading, tableData, modalAddVisible, modalEditVisible, confirmLoading,
     EditRoleName } = this.state;
    return (
      <div className="tenantListPage">
        <div className="tenantListBtn">
          <ul className="btnList clear-fix">
            <li><Button type="primary" onClick={this.addRole}>新建角色</Button></li>
          </ul>
        </div>

        <div className="tenantTable">
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
            pagination={false}
          />
        </div>

        <Modal
          title="新建角色"
          destroyOnClose
          visible={modalAddVisible}
          onOk={this.modalAddOk}
          onCancel={this.modalAddCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">角色名称：</p>
              <div className="con">
                <Input placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'addRoleName')} />
              </div>
            </div>
            <div className="formSection">
              <p className="label">角色描述：</p>
              <div className="con">
                <Input placeholder="请输入描述内容" onChange={e => this.inputOnchange(e, 'addDescription')} />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="编辑角色"
          destroyOnClose
          visible={modalEditVisible}
          onOk={this.modalEditOk}
          onCancel={this.modalEditCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">角色名称：</p>
              <div className="con">
                <Input value={EditRoleName} placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'editRoleName')} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RoleList;
