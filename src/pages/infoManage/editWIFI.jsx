import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import Utils from '../../common/Utils';

const FormItem = Form.Item;

class editWIFIComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      roomId: '',
      tenantName: '',
    };
    this.id = '';
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  // 弹出框处理函数
  showModal = (record) => {
    console.log(record);

    this.id = record.key;
    this.setState({
      modalVisible: true,
      roomId: record.roomId,
      tenantName: record.tenantName,
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({
        wifiName: record.wifiName ? record.wifiName : '',
        wifiPassword: record.wifiPassword ? record.wifiPassword : '',
      });
    }, 200);
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
        // 添加策略详情
        const param = {
          ids: [this.id],
          wifiName: values.wifiName === undefined ? '' : values.wifiName,
          wifiPassword: values.wifiPassword === undefined ? '' : values.wifiPassword,
        };
        console.log(param);
        this.editWIFIAPI(param);
      }
    });
  };
  editWIFIAPI = (param) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/room/edit`,
      method: 'post',
      data: param,
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.success('修改WIFI信息成功');
          this.props.onOK();
        }
      })
      .catch(() => {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
        });
        message.error('修改策略失败');
      });
  };

  render() {
    const { modalVisible, roomId, tenantName } = this.state;
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
        title="编辑WIFI信息"
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
              <span className="ant-form-text">{tenantName}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="房间号"
            >
              <span className="ant-form-text">{roomId}</span>
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

const editWIFI = Form.create()(editWIFIComponent);
export default editWIFI;
