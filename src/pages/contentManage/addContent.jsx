import React, { Component } from 'react';
import { Modal, Form, Input, Select, Checkbox, message } from 'antd';
import Utils from '../../common/Utils';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

let typeList = [];
const options = [
  { label: '简体中文', value: 'zh-Hans' },
  { label: 'English', value: 'en' },
];

class addContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      type: '',
      typeData: [],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type
    });
  }
  // 获取栏目
  getInfoList = (type) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/column/list`,
      method: 'post',
      data: {
        type,
      }
    })
    .then(res => {
      const resData = res.data;
      this.creatListDom(resData);
      this.setState({
        typeData: typeList,
      });
      // console.log(typeof this.props.id);
      this.props.form.setFieldsValue({
        categoryId: this.props.id,
      });
    })
    .catch(() => {
    });
  };

  // 创建选择列表
  creatListDom = (typeData) => {
    // const { typeData } = this.state;
    typeList = [];
    typeData.map((item) => {
      // console.log(typeof item.id);
      return typeList.push(<Option key={item.id.toString()} value={item.id.toString()}>{item.name}</Option>);
    }
    );
  };
  // 弹出框处理函数
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
    this.getInfoList(this.state.type);
    // setTimeout(() => {
    //
    // }, 200);
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
        // 添加
        const param = {
          ...values,
          type: this.state.type,
        };
        console.log(param);
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/content/add`,
          method: 'post',
          data: param,
        })
        .then(res => {
          if (res && res.success) {
            this.setState({
              modalVisible: false,
              confirmLoading: false,
            });
            message.success('添加成功');
            this.props.onOK();
          }
        })
        .catch(() => {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.error('添加失败');
        });
      }
    });
  }

  render() {
    const { modalVisible, typeData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    // this.creatListDom();

    return (
      <Modal
        title="新建信息"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="700px"
      >
        <div className="userformBox">
          <Form>
            <FormItem
              {...formItemLayout}
              label="所属栏目"
              hasFeedback
            >
              {getFieldDecorator('categoryId', {
                // initialValue: this.props.id,
              })(
                <Select>
                  { typeData }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }],
              })(
                <Input />
              )}
            </FormItem>
            {
              this.props.type === 'theme' &&
                <FormItem
                  {...formItemLayout}
                  label="版本号"
                >
                  {getFieldDecorator('version', {
                  })(
                    <Input />
                  )}
                </FormItem>
            }
            {
              this.props.type === 'theme' &&
                <FormItem
                  {...formItemLayout}
                  label="标识"
                >
                  {getFieldDecorator('flag', {
                  })(
                    <Select>
                      <Option value="launcher">launcher</Option>
                      <Option value="vod">vod</Option>
                    </Select>
                  )}
                </FormItem>
            }
            {
              this.props.type === 'website' &&
                <FormItem
                  {...formItemLayout}
                  label="url"
                >
                  {getFieldDecorator('url', {
                  })(
                    <Input />
                  )}
                </FormItem>
            }
            {
              this.props.type === 'website' &&
                <FormItem
                  {...formItemLayout}
                  label="类型"
                >
                  {getFieldDecorator('websiteType', {
                    initialValue: 'internal',
                  })(
                    <Select>
                      <Option value="internal">内部网站</Option>
                      <Option value="external">外部网站</Option>
                    </Select>
                  )}
                </FormItem>
            }
            {
              this.props.type === 'app' &&
                <FormItem
                  {...formItemLayout}
                  label="包名"
                >
                  {getFieldDecorator('packageName', {
                  })(
                    <Input />
                  )}
                </FormItem>
            }
            {
              this.props.type === 'app' &&
                <FormItem
                  {...formItemLayout}
                  label="动作"
                >
                  {getFieldDecorator('action', {
                  })(
                    <Input />
                  )}
                </FormItem>
            }
            {
              this.props.type === 'app' &&
                <FormItem
                  {...formItemLayout}
                  label="启动参数"
                >
                  {getFieldDecorator('param', {
                  })(
                    <Input />
                  )}
                </FormItem>
            }
            <FormItem
              {...formItemLayout}
              label="语言"
            >
              {getFieldDecorator('languages', {
                // initialValue: ['en'],
                rules: [{ required: true, message: '请选择语言' }],
              })(
                <CheckboxGroup options={options} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {getFieldDecorator('content', {
                rules: [{ message: '请输入名称' }],
              })(
                <TextArea autosize={{ minRows: 4, maxRows: 4 }} />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

const addFile = Form.create()(addContent);
export default addFile;
