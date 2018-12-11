import React, { Component } from 'react';
import { Tree, Button, Modal, Input, message } from 'antd';

import Utils from '../../common/Utils';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

// const orglist = [
//   {
//     "createTime": "2018-08-14 09:42:28",
//     "updateTime": "2018-08-14 09:42:28",
//     "state": 0,
//     "id": 1,
//     "parentId": 0,
//     "name": "哈哈哈",
//     "orgCode": "FBRz"
//   },
//   {
//     "createTime": "2018-08-14 10:37:00",
//     "updateTime": "2018-08-14 10:37:53",
//     "state": 0,
//     "id": 2,
//     "parentId": 0,
//     "name": "联合视界",
//     "orgCode": "ZouD"
//   }
// ];

const treeAttr = {
  id: 'id',
  parentId: 'parentId'
};

class UserOrgList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddVisible: false,
      confirmLoading: false,
      modalEditVisible: false,
      expandedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      EditOrgName: '',
    };

    this.formData = {
      currentOrgId: '',
      addOrgName: '',
      editOrgName: '',
    };
  }

  componentDidMount() {
    this.getOrgList();
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect selectedKeys: ', selectedKeys);
    // console.log('onSelect info: ', info);
    if (selectedKeys.length > 0) {
      this.onSelectData(selectedKeys, info.node.props.title);
    }
  };
  onSelectData = (selectedKeys, title) => {
    console.log('onSelectData selectedKeys: ', selectedKeys);
    console.log('onSelectData info: ', title);
    this.setState({
      selectedKeys,
      EditOrgName: title
    });

    this.props.select({
      id: selectedKeys,
      title
    });
    this.formData.currentOrgId = selectedKeys[0];
    this.formData.editOrgName = title;
  };

  // 获取组织机构列表
  getOrgList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/org/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      if (res && res.data && res.data.length) {
        console.log(res.data);
        let treeDataTmp = [];
        if (res.data.length > 0) {
          treeDataTmp = Utils.toTree(res.data, res.data[0].parentId, treeAttr);
        }
        this.setState({
          treeData: treeDataTmp
        });
        console.log(treeDataTmp);
        if (treeDataTmp.length > 0) {
          this.onSelectData([treeDataTmp[0].id.toString()], treeDataTmp[0].name);
        }
      }
    });
  };

  addOrg = () => {
    console.log('addorg');
    this.setState({ modalAddVisible: true });
  };

  modalAddOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 新建组织机构
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/org/add`,
      method: 'post',
      data: {
        name: this.formData.addOrgName,
        parentId: parseInt(this.formData.currentOrgId, 10) || 0,
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalAddVisible: false,
          confirmLoading: false,
        });
        message.success('新建成功');
        this.getOrgList();
      }
    })
    .catch(() => {
      message.error('新建失败');
    });
  }

  modalAddCancel = () => {
    this.setState({ modalAddVisible: false });
  }

  editOrg = () => {
    if (!this.formData.currentOrgId) {
      message.error('请选择组织机构');
      return;
    }
    this.setState({
      modalEditVisible: true,
    });
  };

  modalEditOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 编辑组织机构
    console.log(this.formData);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/org/edit`,
      method: 'post',
      data: {
        name: this.formData.editOrgName,
        orgId: parseInt(this.formData.currentOrgId, 10),
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalEditVisible: false,
          confirmLoading: false,
        });
        message.success('编辑成功');
        this.getOrgList();
      }
    })
    .catch(() => {
      message.error('编辑失败');
    });
  }

  delOrg = () => {
    if (!this.formData.currentOrgId) {
      message.error('请选择组织机构');
      return;
    }
    confirm({
      title: `确认要删除机构【${this.state.EditOrgName}】吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // console.log('OK');
        this.orgDel();
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }

  orgDel = () => {
    // 删除组织机构
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/org/delete`,
      method: 'post',
      data: {
        orgId: parseInt(this.formData.currentOrgId, 10),
      }
    })
    .then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getOrgList();
      }
    })
    .catch(() => {
      message.error('删除失败');
    });
  }

  modalEditCancel = () => {
    this.setState({ modalEditVisible: false });
  }

  inputOnchange = (e, type) => {
    switch (type) {
      case 'addOrgName':
        this.formData.addOrgName = e.target.value;
        break;
      case 'editOrgName':
        this.setState({ EditOrgName: e.target.value });
        this.formData.editOrgName = e.target.value;
        break;
      default:
        break;
    }
  }

  renderTreeNodes = (data) => (
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} dataRef={item} />;
    })
  );

  render() {
    const { modalAddVisible, modalEditVisible, treeData, confirmLoading, EditOrgName } = this.state;
    return (
      <div className="orgListPage">
        <div className="orgListBtn">
          <ul className="clear-fix">
            <li><Button type="primary" onClick={this.addOrg}>新建</Button></li>
            <li><Button type="primary" onClick={this.editOrg}>编辑</Button></li>
            {/* <li><Button type="primary" onClick={this.delOrg}>删除</Button></li> */}
          </ul>
        </div>

        <div className="orgListTree">
          <Tree
            showLine
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </div>

        <Modal
          title="新建组织机构"
          visible={modalAddVisible}
          onOk={this.modalAddOk}
          onCancel={this.modalAddCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">机构名称：</p>
              <div className="con">
                <Input placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'addOrgName')} />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="编辑组织机构"
          visible={modalEditVisible}
          onOk={this.modalEditOk}
          onCancel={this.modalEditCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">机构名称：</p>
              <div className="con">
                <Input value={EditOrgName} placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'editOrgName')} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UserOrgList;
