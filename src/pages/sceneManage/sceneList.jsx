import React, { Component } from 'react';
import { Tree, Button, Modal, Select, Input, message } from 'antd';

import Utils from '../../common/Utils';
import { ROLE_PERMISSIONS_VALUE } from '../../common/Constant';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const Option = Select.Option;

let typeList = [];
const treeAttr = {
  id: 'id',
  parentId: 'parentId'
};

class contentList extends Component {
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
      editName: '',
      typeData: [],
      typeValue: '',
    };

    this.formData = {
      currentId: '',
      parentId: '',
      addName: '',
      editName: '',
    };
  }
  componentWillMount() {
    this.getContentList();
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info.node.props);
    this.setState({
      selectedKeys,
      editName: info.node.props.title
    });

    this.props.select(info.node.props);
    this.formData.currentId = info.node.props.eventKey;
    this.formData.parentId = info.node.props.dataRef.parentId;
    this.formData.editName = info.node.props.title;
  }

  // 获取列表
  getContentList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/category/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          treeData: Utils.toTree(res.data, 0, treeAttr),
          typeData: res.data,
        });
      }
    });
  }

  add = () => {
    this.setState({ modalAddVisible: true });
  }

  modalAddOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 新建
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/category/add`,
      method: 'post',
      data: {
        name: this.formData.addName,
        parentId: parseInt(this.formData.currentId, 10) || 0,
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalAddVisible: false,
          confirmLoading: false,
        });
        message.success('新建成功');
        this.getContentList();
      }
    })
    .catch(() => {
      message.error('新建失败');
    });
  }

  modalAddCancel = () => {
    this.setState({ modalAddVisible: false });
  }

  // 创建选择列表
  creatListDom = () => {
    const { typeData } = this.state;
    typeList = [];
    typeData.map((item, index) =>
      typeList.push(
        <Option key={index} value={item.id}>{item.name}</Option>
      )
    );
  };

  edit = () => {
    if (!this.formData.currentId) {
      message.error('请选择修改项');
      return;
    }
    this.setState({
      modalEditVisible: true,
      typeValue: this.formData.parentId
    });
    this.creatListDom();
  }

  modalEditOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 编辑
    console.log(this.formData);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/category/edit`,
      method: 'post',
      data: {
        name: this.formData.editName,
        parentId: parseInt(this.formData.parentId, 10) || 0,
        id: parseInt(this.formData.currentId, 10),
      }
    })
    .then(res => {
      if (res && res.success) {
        this.setState({
          modalEditVisible: false,
          confirmLoading: false,
        });
        message.success('编辑成功');
        this.getContentList();
      }
    })
    .catch(() => {
      message.error('编辑失败');
    });
  }
  // 删除
  del = () => {
    if (!this.formData.currentId) {
      message.error('请选择删除项');
      return;
    }
    confirm({
      title: `确认要删除【${this.state.editName}】吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/category/delete`,
          method: 'post',
          data: {
            id: parseInt(this.formData.currentId, 10),
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('删除成功');
            this.getContentList();
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
  }

  modalEditCancel = () => {
    this.setState({
      modalEditVisible: false,
      typeValue: '',
    });
  }

  inputOnchange = (e, type) => {
    switch (type) {
      case 'addName':
        this.formData.addName = e.target.value;
        break;
      case 'editName':
        this.setState({ editName: e.target.value });
        this.formData.editName = e.target.value;
        break;
      case 'typeId':
        this.formData.parentId = e;
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
    const { modalAddVisible, modalEditVisible, treeData, confirmLoading, editName, typeValue,
      expandedKeys, autoExpandParent, checkedKeys, selectedKeys, } = this.state;

    let privileges = [];
    const userInfo = JSON.parse(window.sessionStorage.getItem('UV_userInfo'));
    if (userInfo && userInfo.privileges) {
      privileges = userInfo.privileges;
    }
    return (
      <div className="orgListPage">
        <div className="orgListBtn">
          <ul className="clear-fix">
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[0]) > -1 &&
              <li><Button type="primary" onClick={this.add}>新建</Button></li>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[1]) > -1 &&
              <li><Button type="primary" onClick={this.edit}>编辑</Button></li>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.btn[2]) > -1 &&
              <li><Button type="primary" onClick={this.del}>删除</Button></li>
            }
          </ul>
        </div>

        <div className="orgListTree">
          <Tree
            showLine
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </div>

        <Modal
          title="新建"
          visible={modalAddVisible}
          onOk={this.modalAddOk}
          onCancel={this.modalAddCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">名称：</p>
              <div className="con">
                <Input placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'addName')} />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="编辑"
          visible={modalEditVisible}
          onOk={this.modalEditOk}
          onCancel={this.modalEditCancel}
          confirmLoading={confirmLoading}
          width="500px"
        >
          <div className="userformBox">
            <div className="formSection">
              <p className="label">分类：</p>
              <div className="con">
                <Select
                  defaultValue={typeValue}
                  style={{ width: '100%' }}
                  onSelect={value => this.inputOnchange(value, 'typeId')}
                >
                  { typeList }
                </Select>
              </div>
            </div>
            <div className="formSection">
              <p className="label">名称：</p>
              <div className="con">
                <Input value={editName} placeholder="请输入名称" onChange={e => this.inputOnchange(e, 'editName')} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default contentList;
