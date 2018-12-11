import React, { Component } from 'react';
import { Button, Modal, Input, message, Table, Upload, Icon } from 'antd';
import 'whatwg-fetch';

import Utils from '../../common/Utils';


// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   type: 'radio',
//   columnWidth: 20
// };

class AppList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      current: 1,
      tableData: [],
      tableTotal: '',
      modalAddVisible: false,
      confirmLoading: false,
      currentAppPackageName: '',
      fileList: [],
    };

    this.formData = {
      remark: '',
    };

    this.columns = [{
      title: '应用名',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
    }, {
      title: '应用包名',
      dataIndex: 'packageName',
      key: 'packageName',
      width: '50%',
    },
    //   {
    //   title: '批量升级',
    //   dataIndex: 'ss',
    //   key: 'ss',
    //   width: '20%',
    //   render: (record) => (
    //     <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={false} onChange={(checked) => { this.changeAppType(record, checked); }} />
    //   )
    // }
    ];
  }

  componentWillMount() {
    this.getAppList('1', '10');
  }

  // 获取应用列表
  getAppList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/apk/page`,
      method: 'get',
      data: {
        page,
        size,
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: i,
          label: `${resData[i].label}`,
          packageName: `${resData[i].packageName}`,
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

  changeAppType = (record, checked) => {
    console.log(record);
    console.log(checked);
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.getAppList(page, pageSize);
  };

  addApp = () => {
    this.setState({ modalAddVisible: true });
  };

  modalAddOk = () => {
    const { fileList } = this.state;
    const fileFormData = new FormData();
    if (fileList.length === 0) {
      message.error('请选择安卓APK应用!');
      return;
    }
    fileFormData.append('file', fileList[0]);
    fileFormData.append('remark', this.formData.remark);
    this.setState({
      confirmLoading: true,
    });
    // 新建应用
    fetch(`${window.PAY_API_HOST}/op/app/apk/upload`, {
      method: 'post',
      body: fileFormData,
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        if (res && res.success) {
          this.setState({
            modalAddVisible: false,
            confirmLoading: false,
          });
          message.success('新建成功');
          this.getAppList('1', '10');
        }
      })
      .catch((err) => {
        console.log(err);
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
  inputOnchange = (e, type) => {
    switch (type) {
      case 'remark':
        this.formData.remark = e.target.value;
        break;
      default:
        break;
    }
  };

  rowClick = (record, e) => {
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
  };
  // 为指定的dom元素添加样式
  addClass = (ele, cls) => {
    if (!this.hasClass(ele, cls)) ele.className += ' ' + cls;
  };
  // 删除指定dom元素的样式
  removeClass = (ele, cls) => {
    if (this.hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  };
  // 如果存在(不存在)，就删除(添加)一个样式
  toggleClass = (ele, cls) => {
    if (this.hasClass(ele, cls)) {
      this.removeClass(ele, cls);
    } else {
      this.addClass(ele, cls);
    }
  };

  // 调用
  toggleClassTest = () => {
    const ele = document.getElementsByTagName('body')[0];
    this.toggleClass(ele, 'night-mode');
  };

  render() {
    const { loading, current, tableData, tableTotal, modalAddVisible, confirmLoading, } = this.state;
    const props = {
      accept: '.apk',
      action: `${window.PAY_API_HOST}/op/app/apk/upload`,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
        if (!isLt1G) {
          message.error('安卓APK应用必须少于 1GB!');
        }
        if (isLt1G) {
          this.setState(() => ({
            fileList: [file],
          }));
        }
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div className="appListPage">
        <div className="appListBtn">
          <ul className="btnList clear-fix">
            <li><Button type="primary" onClick={this.addApp}>新建应用</Button></li>
          </ul>
        </div>

        <div className="appTable">
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={tableData}
            pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            onRow={(record) => ({
              onClick: (e) => {
                this.rowClick(record, e);
              }
            })}
          />
        </div>

        <Modal
          title="新建应用"
          visible={modalAddVisible}
          onOk={this.modalAddOk}
          onCancel={this.modalAddCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">上传应用：</p>
              <div className="con">
                <Upload {...props}>
                  <Button><Icon type="upload" /> 选择应用</Button>
                </Upload>
              </div>
            </div>
            <div className="formSection">
              <p className="label">备注信息：</p>
              <div className="con">
                <Input placeholder="请输入" onChange={e => this.inputOnchange(e, 'remark')} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AppList;
