import React, { Component } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import Utils from '../../../common/Utils';

const FormItem = Form.Item;
const Option = Select.Option;

let appList = [];
let appVersionList = [];
let tenantList = [];

class addStrategyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      appData: [],
      appVersionData: [],
      label: '',
      versionName: '',
      tenantData: [],
    };
  }

  componentWillMount() {
    this.getTenantList();
  }

  componentDidMount() {
    this.props.onRef(this);
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
      const resData = res.data;
      this.setState({
        tenantData: resData,
      });
    })
    .catch(() => {
    });
  }
  // 获取应用列表
  getAppList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/apk/list`,
      method: 'get',
    })
    .then(res => {
      const resData = res.data;
      this.setState({
        appData: resData,
      });
    })
    .catch(() => {
    });
  };
  // 获取应用版本列表接口
  getAppVersionList = (packageName) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/apk/file/list`,
      method: 'get',
      data: {
        packageName,
      }
    })
    .then(res => {
      const resData = res.data;
      this.setState({
        appVersionData: resData,
      });
    })
    .catch(() => {
    });
  };
  // 创建应用选择列表
  creatAppDom = () => {
    const { appData } = this.state;
    appList = [];
    appData.map((item, index) =>
      appList.push(
        <Option key={index} value={item.packageName}>{`${item.label}/${item.packageName}`}</Option>
      )
    );
  };
  // 创建应用选择列表
  creatAppVersionDom = () => {
    const { appVersionData } = this.state;
    appVersionList = [];
    appVersionData.map((item, index) =>
      appVersionList.push(
        <Option key={index} value={item.versionCode}>{`${item.versionName}/${item.versionCode}`}</Option>
      )
    );
  };
  // 创建商户列表
  creatTenantDom = () => {
    const { tenantData } = this.state;
    tenantList = [];
    tenantData.map((item, index) =>
      tenantList.push(
        <Option key={index} value={item.id} title={item.tenantName}>{item.tenantName}</Option>
      )
    );
  }
  // 弹出框处理函数
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
    this.getAppList();
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false,
      appVersionData: [],
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        this.setState({
          confirmLoading: true,
        });
        // 添加策略详情
        const param = {
          ...values,
          label: this.state.label,
          versionName: this.state.versionName,
          // appUpgradeId: this.props.id,
          // tenantId: this.props.tenantIds,
        };
        console.log(param);
        this.addStrategyAPI(param);
      }
    });
  };
  addStrategyAPI = (param) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/version/save`,
      method: 'post',
      data: param,
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.success('添加策略成功');
          this.props.onOK();
        }
      })
      .catch(() => {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.error('添加策略失败');
      });
  };
  // 选择应用 获取应用版本
  handleAppSelectChange = (value, option) => {
    this.setState({
      label: option.props.children.split('/')[0],
      appVersionData: [],
    });
    this.props.form.setFieldsValue({
      versionCode: '',
    });
    appVersionList = [];
    this.getAppVersionList(value);
  };
  // 获取应用版本名称code
  handleVersionChange = (value, option) => {
    console.log(value);
    console.log(option.props.children.split('/')[0]);
    let code = '';
    if (value && option) {
      code = option.props.children.split('/')[0];
    }
    this.setState({
      versionName: code,
    });
  };

  render() {
    const { modalVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    this.creatAppDom();
    this.creatAppVersionDom();
    this.creatTenantDom();

    return (
      <Modal
        title="新建策略"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="600px"
      >
        <div className="userformBox">
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称"
              hasFeedback
            >
              {getFieldDecorator('title', {
                rules: [
                  { required: true, message: '请填写名称' },
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商户"
              hasFeedback
            >
              {getFieldDecorator('tenantId', {
                rules: [
                  { required: true, message: '请选择商户' },
                ],
              })(
                <Select showSearch optionFilterProp="children">
                  { tenantList }
                </Select>
              )}
            </FormItem>
            <FormItem label="安装/卸载" {...formItemLayout} >
              {getFieldDecorator('appAction', {
                initialValue: 'install',
                rules: [
                  { required: true, message: '请选择策略行为' },
                ],
              })(
                <Select id="appAction" >
                  <Option value="install">安装</Option>
                  <Option value="remove">卸载</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="应用"
              hasFeedback
            >
              {getFieldDecorator('packageName', {
                rules: [
                  { required: true, message: '请选择应用' },
                ],
              })(
                <Select onChange={this.handleAppSelectChange}>
                  { appList }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="应用版本"
              hasFeedback
            >
              {getFieldDecorator('versionCode', {
              })(
                <Select onChange={this.handleVersionChange} allowClear >
                  { appVersionList }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="最小版本号"
            >
              {getFieldDecorator('minVersionCode', {
                rules: [{ message: '请输入最小版本号!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="最大版本号"
            >
              {getFieldDecorator('maxVersionCode', {
                rules: [{ message: '请输入最大版本号!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分组ID"
            >
              {getFieldDecorator('groupId', {
                rules: [{ message: '请输入分组ID' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="房间号"
            >
              {getFieldDecorator('room', {
                rules: [{ message: '请输入房间号' }],
              })(
                <Input placeholder="格式为：1501,1501-2000,1501-,-2000" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="设备ID"
            >
              {getFieldDecorator('deviceId', {
                rules: [{ message: '请输入设备ID' }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

const addStrategy = Form.create()(addStrategyComponent);
export default addStrategy;
