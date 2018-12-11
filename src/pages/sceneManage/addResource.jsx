import React, { Component } from 'react';
import { Modal, Layout, Input, Button, Table, Tree, Select, } from 'antd';
import Utils from '../../common/Utils';

const { Sider } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const Option = Select.Option;
const treeAttr = {
  id: 'id',
  parentId: 'parentId'
};

class addResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      type: '',
      sortType: '',
      categoryId: '',
      // 表格
      tableData: [],
      current: 1,
      tableTotal: '',
      selectedRowKeys: [],
      selectedRows: [],
      // 分类列表树
      treeData: [],
      expandedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      selectedKeys: [],
    };
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'remarks',
      key: 'remarks',
    }];
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onSearchChange = (value) => {
    this.name = value;
    this.getContentList('1', '10', this.state.sortType, this.state.categoryId);
  };
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }
  onTotalSelect = (info) => {
    console.log(info);
  }
  onSelect = (selectedKeys) => {
    console.log(selectedKeys);
    this.setState({
      selectedKeys,
      categoryId: selectedKeys,
    });
    this.getContentList('1', '10', this.state.sortType, selectedKeys);
  };
  // 获取分类列表
  getInfoList = (type) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/column/list`,
      method: 'post',
      data: {
        type,
      }
    })
    .then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          treeData: Utils.toTree(res.data, 0, treeAttr),
          sortType: type,
        });
      }
    });
  };
  // 获取信息列表
  getContentList = (page, size, type, categoryId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/content/page`,
      method: 'post',
      data: {
        page,
        size,
        type,
        categoryId,
        name: this.name,
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
    this.getContentList(page, pageSize, this.state.sortType, this.state.categoryId);
  }
  sortSelect = (value) => {
    console.log(value);
    this.getInfoList(value);
    this.getContentList('1', '10', value);
  }
  // 弹出框处理函数
  showModal = (type) => {
    this.setState({
      modalVisible: true,
      type: type !== undefined ? type : 'boot',
    });
    if (type === undefined) {
      this.getInfoList('img');
      this.getContentList('1', '10', 'img');
    } else {
      this.getInfoList(type);
      this.getContentList('1', '10', type);
    }
  };
  // 添加资源
  confirmInfo = () => {
    const resData = this.state.selectedRows;
    const dataArray = [];
    for (let i = 0; i < resData.length; i += 1) {
      switch (this.state.type) {
        case 'boot':
          dataArray.push({
            contentId: `${resData[i].id}`,
            name: `${resData[i].name}`,
            languages: resData[i].uiContentLanguages,
            eventType: 'boot',
            order: '',
            playTime: '',
            carousel: false,
            skipTime: '',
            skip: false,
          });
          break;
        case 'music':
          dataArray.push({
            contentId: `${resData[i].id}`,
            name: `${resData[i].name}`,
            languages: resData[i].uiContentLanguages,
            eventType: 'backgroundMusic',
            bootPlay: false,
            launcherPlay: false,
          });
          break;
        case 'theme':
          dataArray.push({
            contentId: `${resData[i].id}`,
            name: `${resData[i].name}`,
            languages: resData[i].uiContentLanguages,
            eventType: 'themePackage',
          });
          break;
        default:
          break;
      }
    }
    // console.log(dataArray);
    this.props.onOK(dataArray, this.state.type);
    this.setState({
      modalVisible: false,
    });
  }
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
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
    const { modalVisible, tableData, current, tableTotal,
      treeData, expandedKeys, autoExpandParent, checkedKeys, selectedKeys, } = this.state;
    const rowSelection = {
      type: this.state.type === 'music' ? 'radio' : 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
    };

    return (
      <Modal
        title="新建信息"
        visible={modalVisible}
        onCancel={this.modalCancel}
        width="900px"
        footer={null}
      >
        <Layout style={{ background: '#fff', minHeight: '300px' }}>
          <Sider width={250} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
            <div className="orglist">
              {
                this.state.type === 'boot' &&
                <Select defaultValue="img" onSelect={value => this.sortSelect(value)} style={{ width: '90%' }} >
                  <Option value="img">图片</Option>
                  <Option value="imgCollection">图片集</Option>
                  <Option value="video">视频</Option>
                  <Option value="app">APP</Option>
                  <Option value="website">网站</Option>
                  <Option value="theme">主题包</Option>
                  <Option value="music">音乐</Option>
                  <Option value="custom">自定义</Option>
                </Select>
              }
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
          </Sider>
          <div style={{ width: '100%' }}>
            <div style={{ height: 60, backgroundColor: '#fff', padding: '0px 20px' }} >
              <Button type="primary" onClick={this.confirmInfo} style={{ float: 'right' }} >
                确定
              </Button>
              <Search
                style={{ width: 220, marginRight: 20 }}
                placeholder="输入名称"
                onSearch={this.onSearchChange}
                enterButton
              />
            </div>
            <Table
              size="middle"
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
          </div>
        </Layout>
      </Modal>
    );
  }
}

export default addResource;
