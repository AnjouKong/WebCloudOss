import React, { Component } from 'react';
import { Button, Modal, Input, message, Table, Cascader, Select } from 'antd';

import Utils from '../../common/Utils';

const confirm = Modal.confirm;
const Option = Select.Option;

// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   type: 'radio',
//   columnWidth: 20
// };
const treeAttr = {
  id: 'id',
  parentId: 'parentId'
};

class TenantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      tableTotal: '',
      modalAddVisible: false,
      confirmLoading: false,
      modalEditVisible: false,
      currentTenantId: '',
      areaTreeData: [],
      vodIndexList: [],
      EditTenantName: '',
      EditTenantPhone: '',
      EditTenantEmail: '',
      EditTenantAreaCenter: '',
      EditTenantAreaCode: [],
      EditTenantVodIndexId: '',
    };

    this.formData = {
      addTenantId: '',
      addTenantName: '',
      addTenantPhone: '',
      addTenantEmail: '',
      addTenantAreaCode: '',
      addTenantAreaCenter: '',
      addTenantVodIndexId: '',
      editTenantName: '',
      editTenantPhone: '',
      editTenantEmail: '',
      editTenantAreaCode: '',
      editTenantAreaCenter: '',
      editTenantVodIndexId: '',
      searchTenantName: '',
    };

    this.columns = [{
      title: '商户',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editTenant(record)}>修改</a>
          {/* <Divider type="vertical" />
          <a onClick={() => this.delTenant(record)}>删除</a> */}
        </span>
      )
    }];
  }

  componentWillMount() {
    this.getTenantList('1', '10');
    this.getAreaList();
    // this.getVodIndexList();
  }

  // 获取商户列表
  getTenantList = (page, size, tenantName) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/page`,
      method: 'post',
      data: {
        page,
        size,
        tenantName: tenantName || '',
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
          tenantName: `${resData[i].tenantName}`,
          operation: '查看',
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

  // 获取区域列表
  getAreaList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/base/area`,
      method: 'get',
      // data: {}
    })
    .then(res => {
      if (res && res.data && res.data.length) {
        for (let i = 0; i < res.data.length; i += 1) {
          res.data[i].value = res.data[i].id;
          res.data[i].label = res.data[i].name;
        }
        // console.log(res.data);
        const areaTreeData = Utils.toTree(res.data, 0, treeAttr);
        // console.log(areaTreeData);
        this.setState({ areaTreeData });
      }
    });
  };


  // 获取Vod首页列表
  getVodIndexList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/media/vod`, // op/system/role/get  op/ui/media/vod
      method: 'get',
      // data: {}
      data: {
        roleId: JSON.parse(window.sessionStorage.getItem('UV_userInfo')).roleId
      }
    })
      .then(res => {
        if (res && res.data && res.data.length) {
          const vodListData = [];
          for (let i = 0; i < res.data.length; i += 1) {
            vodListData.push(
              <Option key={res.data[i].id} value={res.data[i].id} title={res.data[i].homePageName}>{res.data[i].homePageName}</Option>
            );
            // vodListData.push(
            //   <Option key={res.data[i].id} value={res.data[i].id} title={res.data[i].name}>{res.data[i].name}</Option>
            // );
          }
          this.setState({ vodIndexList: vodListData });
        }
      });
  };

  // 列表翻页
  pageOnChange = (page, pageSize) => {
    const { searchTenantName } = this.formData;
    this.getTenantList(page, pageSize, searchTenantName);
  };

  addTenant = () => {
    this.setState({ modalAddVisible: true });
  };

  modalAddOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 新建商户
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/add`,
      method: 'post',
      data: {
        id: this.formData.addTenantId || '',
        tenantName: this.formData.addTenantName,
        phone: this.formData.addTenantPhone || '',
        email: this.formData.addTenantEmail || '',
        areaCode: this.formData.addTenantAreaCode || '',
        areaCenter: this.formData.addTenantAreaCenter || '',
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalAddVisible: false,
          confirmLoading: false,
        });
        message.success('新建成功');
        this.getTenantList('1', '10');
      }
    })
    .catch(() => {
      this.setState({
        modalAddVisible: false,
        confirmLoading: false,
      });
      message.error('新建失败');
    });
  };

  modalAddCancel = () => {
    this.setState({ modalAddVisible: false });
  };

  editTenant = (record) => {
    console.log(record);
    this.setState({ modalEditVisible: true });

    const areaCoadArr = record.areaCode ? record.areaCode.split(',') : [];
    // console.log(areaCoadArr.map(item => parseInt(item)));
    this.setState({
      EditTenantName: record.tenantName,
      EditTenantPhone: record.phone,
      EditTenantEmail: record.email,
      EditTenantAreaCenter: record.areaCenter,
      EditTenantAreaCode: areaCoadArr.map(item => parseInt(item, 10)),
      // EditTenantVodIndexId: record.phone,
      currentTenantId: record.id,
      // editTenantAreaCode: record.parentIds ? record.parentIds.split(',').slice(1) : [],
    });
    this.formData.editTenantName = record.tenantName;
    this.formData.editTenantPhone = record.phone;
    this.formData.editTenantEmail = record.email;
    this.formData.editTenantAreaCode = record.areaCode;
    this.formData.EditTenantAreaCenter = record.areaCenter;
    // this.formData.editTenantVodIndexId = record.phone;
  };

  modalEditOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 编辑商户
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/edit`,
      method: 'post',
      data: {
        tenantName: this.formData.editTenantName,
        id: this.state.currentTenantId,
        phone: this.formData.editTenantPhone,
        email: this.formData.editTenantEmail,
        areaCode: this.formData.editTenantAreaCode || '',
        areaCenter: this.formData.editTenantAreaCenter || '',
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalEditVisible: false,
          confirmLoading: false,
        });
        message.success('编辑成功');
        this.getTenantList('1', '10');
      }
    })
    .catch(() => {
      message.error('编辑失败');
    });
  }

  modalEditCancel = () => {
    this.setState({ modalEditVisible: false });
  };

  inputOnchange = (e, type) => {
    switch (type) {
      case 'addTenantId':
        this.formData.addTenantId = e.target.value;
        break;
      case 'addTenantName':
        this.formData.addTenantName = e.target.value;
        break;
      case 'addTenantPhone':
        this.formData.addTenantPhone = e.target.value;
        break;
      case 'addTenantEmail':
        this.formData.addTenantEmail = e.target.value;
        break;
      case 'addTenantAreaCode':
        // this.formData.addTenantAreaCode = e[e.length - 1];
        this.formData.addTenantAreaCode = e.join(',');
        break;
      case 'addTenantAreaCenter':
        this.formData.addTenantAreaCenter = e.target.value;
        break;
      case 'addTenantVodIndexId':
        console.log(e);
        this.formData.addTenantVodIndexId = e;
        break;
      case 'editTenantName':
        this.setState({ EditTenantName: e.target.value });
        this.formData.editTenantName = e.target.value;
        break;
      case 'editTenantPhone':
        this.setState({ EditTenantPhone: e.target.value });
        this.formData.editTenantPhone = e.target.value;
        break;
      case 'editTenantEmail':
        this.setState({ EditTenantEmail: e.target.value });
        this.formData.editTenantEmail = e.target.value;
        break;
      case 'editTenantAreaCode':
        this.formData.editTenantAreaCode = e.join(',');
        this.setState({ EditTenantAreaCode: e });
        console.log(this.formData.editTenantAreaCode);
        break;
      case 'editTenantAreaCenter':
        this.setState({ EditTenantAreaCenter: e.target.value });
        this.formData.editTenantAreaCenter = e.target.value;
        break;
      case 'editTenantVodIndexId':
        this.formData.addTenantVodIndexId = e;
        break;
      case 'searchTenantName':
        this.formData.searchTenantName = e.target.value;
        break;
      default:
        break;
    }
  }

  delTenant = (record) => {
    confirm({
      title: `确认要删除【${record.tenantName}】吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // console.log('OK');
        this.tenantDel(record.id);
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }

  tenantDel = (ids) => {
    // 删除商户
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/delete`,
      method: 'post',
      data: {
        ids,
      }
    })
    .then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getTenantList('1', '10');
      }
    })
    .catch(() => {
      message.error('删除失败');
    });
  }

  tenantRefresh = () => {
    // 同步商户
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/synchronous`,
      method: 'post',
    })
      .then(res => {
        if (res && res.success) {
          message.success('同步成功');
          this.getTenantList('1', '10');
        }
      })
      .catch(() => {
        message.error('同步失败');
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
  };

  // 查询商户
  searchTenant = () => {
    const { searchTenantName } = this.formData;
    this.getTenantList('1', '10', searchTenantName);
  };

  render() {
    const { loading, tableData, tableTotal, modalAddVisible, modalEditVisible, confirmLoading, areaTreeData,
      EditTenantName, EditTenantPhone, EditTenantEmail, EditTenantAreaCode, EditTenantAreaCenter } = this.state;// EditTenantVodIndexId, vodIndexList
    return (
      <div className="tenantListPage">
        <div className="tenantListBtn">
          <ul className="btnList clear-fix">
            <li>
              <Button type="primary" onClick={this.tenantRefresh}>同步商户</Button>
              <Button type="primary" onClick={this.addTenant} style={{ marginLeft: 15 }}>新建商户</Button>
            </li>
          </ul>
          <div className="searchBox">
            <Input placeholder="商户名" onChange={e => this.inputOnchange(e, 'searchTenantName')} />
            <Button type="primary" onClick={this.searchTenant}>查询</Button>
          </div>
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
            pagination={{ defaultCurrent: 1, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
          />
        </div>

        <Modal
          title="新建商户"
          visible={modalAddVisible}
          onOk={this.modalAddOk}
          onCancel={this.modalAddCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">商户ID：</p>
              <div className="con">
                <Input placeholder="老系统迁移过来的商户需要输入商户ID" onChange={e => this.inputOnchange(e, 'addTenantId')} />
              </div>
            </div>
            <div className="formSection">
              <p className="label">商户名称：</p>
              <div className="con">
                <Input placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'addTenantName')} />
              </div>
            </div>
            {/* <div className="formSection">
              <p className="label">首页：</p>
              <div className="con">
                <Select
                  onChange={value => this.inputOnchange(value, 'addTenantVodIndexId')}
                  style={{ width: '100%', marginRight: 7 }}
                  placeholder="选择首页"
                  allowClear
                >
                  { vodIndexList }
                </Select>
              </div>
            </div> */}
            <div className="formSection">
              <p className="label">手机号：</p>
              <div className="con">
                <Input placeholder="请输入联系电话" onChange={e => this.inputOnchange(e, 'addTenantPhone')} />
              </div>
            </div>
            <div className="formSection">
              <p className="label">邮箱：</p>
              <div className="con">
                <Input placeholder="请输入联系邮箱" onChange={e => this.inputOnchange(e, 'addTenantEmail')} />
              </div>
            </div>
            <div className="formSection">
              <p className="label">地区：</p>
              <div className="con">
                <Cascader options={areaTreeData} onChange={e => this.inputOnchange(e, 'addTenantAreaCode')} changeOnSelect style={{ width: '100%' }} />
              </div>
            </div>
            <div className="formSection">
              <p className="label">经纬度坐标：</p>
              <div className="con">
                <Input placeholder="请输入经纬度坐标 如:120.37946,36.100218" onChange={e => this.inputOnchange(e, 'addTenantAreaCenter')} />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="编辑商户"
          visible={modalEditVisible}
          onOk={this.modalEditOk}
          onCancel={this.modalEditCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">商户名称：</p>
              <div className="con">
                <Input value={EditTenantName} placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'editTenantName')} />
              </div>
            </div>
          </div>
          {/* <div className="userformBox">
            <div className="formSection">
              <p className="label">首页：</p>
              <div className="con">
                <Select
                  value={EditTenantVodIndexId}
                  onChange={value => this.inputOnchange(value, 'editTenantVodIndexId')}
                  style={{ width: '100%', marginRight: 7 }}
                  placeholder="选择首页"
                  allowClear
                >
                  { vodIndexList }
                </Select>
              </div>
            </div>
          </div> */}
          <div className="userformBox">
            <div className="formSection">
              <p className="label">手机号：</p>
              <div className="con">
                <Input value={EditTenantPhone} placeholder="请输入联系电话" onChange={e => this.inputOnchange(e, 'editTenantPhone')} />
              </div>
            </div>
          </div>
          <div className="userformBox">
            <div className="formSection">
              <p className="label">邮箱：</p>
              <div className="con">
                <Input value={EditTenantEmail} placeholder="请输入联系邮箱" onChange={e => this.inputOnchange(e, 'editTenantEmail')} />
              </div>
            </div>
          </div>
          <div className="userformBox">
            <div className="formSection">
              <p className="label">地区：</p>
              <div className="con">
                <Cascader
                  value={EditTenantAreaCode}
                  options={areaTreeData}
                  onChange={e => this.inputOnchange(e, 'editTenantAreaCode')}
                  changeOnSelect
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          <div className="userformBox">
            <div className="formSection">
              <p className="label">经纬度坐标：</p>
              <div className="con">
                <Input value={EditTenantAreaCenter} placeholder="请输入经纬度坐标 如:120.37946,36.100218" onChange={e => this.inputOnchange(e, 'editTenantAreaCenter')} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TenantList;
