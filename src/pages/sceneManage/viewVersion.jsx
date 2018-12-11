import React, { Component } from 'react';
import { Modal, message, Table, Divider, } from 'antd';
import Utils from '../../common/Utils';

const confirm = Modal.confirm;

class viewVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentId: '',
      current: 1,
      tableData: [],
      tableTotal: '',
    };
    this.columns = [{
      title: '版本号 ',
      dataIndex: 'versionNum',
      key: 'versionNum',
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',

    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a onClick={() => this.$viewScene.showModal(record.key)}>预览信息</a>
          <Divider type="vertical" />
          <a onClick={() => this.restoreVersion(record.sceneId, record.versionNum)}>恢复至此版本</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取发布列表
  getVersionList = (page, size, sceneId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/scene/history`,
      method: 'post',
      data: {
        page,
        size,
        sceneId,
        order: 'desc',
        sort: 'createTime',
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
    this.getVersionList(page, pageSize, this.state.currentId);
  }
  // 恢复版本
  restoreVersion = (sceneId, version) => {
    confirm({
      title: '确认要发布吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/scene/recovery`,
          method: 'post',
          data: {
            sceneId,
            version
          }
        })
        .then(res => {
          if (res && res.success) {
            this.setState({
              modalVisible: false,
            });
            message.success('恢复成功');
            this.props.onOK();
          }
        })
        .catch(() => {
          message.error('恢复失败');
        });
      },
      onCancel: () => {
      },
    });
  }
  // 弹出框处理函数
  showModal = (id) => {
    this.setState({
      modalVisible: true,
      currentId: id,
    });
    this.getVersionList('1', '10', id);
  }
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const { modalVisible, current, tableData, tableTotal } = this.state;

    return (
      <Modal
        title="新建信息"
        visible={modalVisible}
        onCancel={this.modalCancel}
        footer={null}
        width="900px"
      >
        <Table
          columns={this.columns}
          dataSource={tableData}
          pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
        />
      </Modal>
    );
  }
}

export default viewVersion;
