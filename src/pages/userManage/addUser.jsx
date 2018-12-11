import React, { Component } from 'react';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, message } from 'antd';
import PropTypes from 'prop-types';
import Utils from '../../common/Utils';

const FormItem = Form.Item;
const Option = Select.Option;

const treeAttr = {
  id: 'id',
  parentId: 'parentId'
};

let tenantList = [];

class addUserComponent extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      confirmDirty: false,
      treeData: [],
      tenantData: [],
      roleList: [],
      orgId: this.props.id,
    };

    console.log(this.props.id);
    this.orgList = [];
    this.initValues = [];
  }

  // componentWillMount() {
  //   if (this.props.type === 1) {
  //     this.getOrgList();
  //   }
  //   if (this.props.type === 2) {
  //     this.getTenantList();
  //   }
  //   this.getRoleList();
  // }

  componentDidMount() {
    this.props.onRef(this);
    if (this.props.type === 1) {
      this.getOrgList();
    }
    if (this.props.type === 2) {
      this.getTenantList();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.initValues = [];
    this.getNodes(this.orgList, parseInt(this.props.id, 10));
    this.setState({ orgId: nextProps.id });
  }

  // 获取组织机构列表
  getOrgList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/org/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      if (res && res.data && res.data.length) {
        for (let i = 0; i < res.data.length; i += 1) {
          res.data[i].value = res.data[i].id;
          res.data[i].label = res.data[i].name;
        }
        // const json = res.data;
        this.orgList = res.data;
        // this.getNodes(json, parseInt(this.props.id, 10));
        const treeData = Utils.toTree(res.data, 0, treeAttr);
        this.setState({ treeData });
      }
    });
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

  // 获取角色列表
  getRoleList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/get`,
      method: 'post',
      data: {
        roleId: JSON.parse(window.sessionStorage.getItem('UV_userInfo')).roleId
      }
    })
    .then(res => {
      const resData = res.data;
      const { roleList } = this.state;
      for (let i = 0; i < resData.length; i += 1) {
        roleList.push(<Option key={resData[i].id} value={resData[i].id} title={resData[i].name}>{resData[i].name}</Option>);
      }
    })
    .catch(() => {
    });
  }

  // 计算当前节点的所有父节点
  getNodes = (json, nodeId) => {
    for (let i = 0; i < json.length; i += 1) {
      if (json[i].id === nodeId) {
        this.initValues.unshift(nodeId);
        this.getNodes(json, json[i].parentId);
        break;
      }
    }
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
      roleList: [],
    });
    this.getRoleList();
  };

  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          confirmLoading: true,
        });
        // 添加用户
        let param = {};
        if (this.props.type === 1) {
          param = {
            ...values,
            orgId: values.orgId[values.orgId.length - 1],
            type: this.props.type,
          };
        } else {
          param = {
            ...values,
            type: this.props.type,
          };
        }
        Utils.request({
          url: `${window.PAY_API_HOST}/op/system/user/add`,
          method: 'post',
          data: param,
        })
        .then(res => {
          if (res && res.success) {
            this.setState({
              modalVisible: false,
              confirmLoading: false,
            });
            message.success('添加用户成功');
            this.props.onOK();
          }
        })
        .catch(() => {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.error('添加用户失败');
        });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  render() {
    const { modalVisible, treeData, roleList, } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    this.creatTenantDom();

    return (
      <Modal
        title="新建用户"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="500px"
      >
        <div className="userformBox">
          <Form>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  用户名&nbsp;
                  <Tooltip title="用户姓名，登录后显示">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登录名"
            >
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('confirmPassword', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            {
              this.props.type === 1 &&
                <FormItem
                  {...formItemLayout}
                  label="组织机构"
                >
                  {getFieldDecorator('orgId', {
                    initialValue: this.initValues,
                    rules: [{ type: 'array', required: true, message: '请选择组织机构' }],
                  })(
                    <Cascader options={treeData} changeOnSelect />
                  )}
                </FormItem>
            }

            {
              this.props.type === 2 &&
                <FormItem
                  {...formItemLayout}
                  label="商户"
                  hasFeedback
                >
                  {getFieldDecorator('tenantId', {
                    initialValue: this.props.id,
                    rules: [
                      { required: true, message: '请选择商户' },
                    ],
                  })(
                    <Select>
                      { tenantList }
                    </Select>
                  )}
                </FormItem>
            }

            <FormItem
              {...formItemLayout}
              label="角色管理"
            >
              {getFieldDecorator('roleId', {
                rules: [{ required: true, message: '请选择角色' }],
              })(
                <Select>
                  { roleList }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: '请输入手机号码' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="E-mail"
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }],
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

const addUser = Form.create()(addUserComponent);
export default addUser;
