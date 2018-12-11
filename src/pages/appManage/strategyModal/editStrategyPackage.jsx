import React, { Component } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import Utils from '../../../common/Utils';

const FormItem = Form.Item;
const Option = Select.Option;

let tenantList = [];

class editStrategyPackageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      strategyPackageId: null,
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
  // 创建应用选择列表
  creatTenantDom = () => {
    const { tenantData } = this.state;
    tenantList = [];
    tenantData.map((item, index) =>
      tenantList.push(
        <Option key={index} value={item.id}>{item.tenantName}</Option>
      )
    );
  };

  // 弹出框处理函数
  showModal = (record) => {
    console.log(record);
    this.setState({
      modalVisible: true,
      strategyPackageId: record.id,
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({
        title: record.title,
        tenantId: record.tenantId.split(','),
        remark: record.remark,
      });
    }, 200);
  };

  modalOk = () => {
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false,
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
        // 修改策略详情
        const param = {
          ...values,
          id: this.state.strategyPackageId
        };
        this.editStrategyPackageAPI(param);
      }
    });
  };
  editStrategyPackageAPI = (param) => {
    console.log(param);
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/upgrade/update`,
      method: 'post',
      data: param,
    }).then(res => {
      if (res && res.success) {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.success('修改策略包成功');
        this.props.onOK();
      }
    })
      .catch((err) => {
        console.log(err);
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.error('修改策略包失败');
      });
  };
  render() {
    const { modalVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    this.creatTenantDom();
    return (
      <Modal
        title="修改策略包"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="580px"
      >
        <div className="userformBox">
          <Form>
            <FormItem
              {...formItemLayout}
              label="策略包名"
            >
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入策略包名' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="升级商户"
              hasFeedback
            >
              {getFieldDecorator('tenantId', {
                rules: [
                  { required: true, message: '请选择商户' },
                ],
              })(
                <Select mode="multiple" placeholder="请选择" >
                  { tenantList }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                rules: [{ message: '请输入备注信息' }],
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

const editStrategyPackage = Form.create()(editStrategyPackageComponent);
export default editStrategyPackage;
