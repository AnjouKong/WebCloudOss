import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import Utils from '../../common/Utils';

const FormItem = Form.Item;

class addWIFIComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
    };
    this.tenantId = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '';
    this.tenantName = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantName : '';
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 弹出框处理函数
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
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
      console.log('Received values of form: ', values);
      if (!err) {
        this.setState({
          confirmLoading: true,
        });
        // 批量编辑WIFI信息详情
        const param = {
          ...values,
          tenantId: this.tenantId,
        };
        console.log(param);
        this.addWIFIAPI(param);
      }
    });
  };
  addWIFIAPI = (param) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/room/batchEdit`,
      method: 'post',
      data: param,
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.success('批量编辑WIFI信息成功');
          this.props.onOK();
        }
      })
      .catch(() => {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.error('批量编辑WIFI信息失败');
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

    return (
      <Modal
        title="批量编辑WIFI信息"
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
              label="商户"
            >
              <span className="ant-form-text">{this.tenantName}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="房间号"
            >
              {getFieldDecorator('range', {
                rules: [{ required: true, message: '请输入房间号' }],
              })(
                <Input placeholder="格式为：1501,1501-2000,1501-,-2000" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="WIFI名"
            >
              {getFieldDecorator('wifiName', {
                rules: [{ required: true, message: '请输入新的WIFI名!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="WIFI密码"
            >
              {getFieldDecorator('wifiPassword', {
                rules: [{ required: true, message: '请输入新的WIFI密码!' }],
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

const addWIFI = Form.create()(addWIFIComponent);
export default addWIFI;
