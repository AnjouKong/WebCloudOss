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

class editContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      type: '',
      typeData: [],
    };
  }
  componentWillMount() {
    this.setState({
      type: this.props.type
    });
    this.getInfoList(this.props.type);
  }
  componentDidMount() {
    this.props.onRef(this);
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
      this.setState({
        typeData: resData,
      });
    })
    .catch(() => {
    });
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
  // 弹出框处理函数
  showModal = (record) => {
    console.log(record);
    this.setState({
      modalVisible: true,
      contentId: record.id,
    });
    this.getInfoList(this.state.type);
    const uiContentLanguages = [];
    const languages = record.uiContentLanguages;
    languages.map((item) =>
      uiContentLanguages.push(item.language)
    );
    // console.log(uiContentLanguages);
    const tmp = {
      categoryId: record.categoryId,
      name: record.name,
      languages: uiContentLanguages,
      content: record.content,
    };
    switch (this.props.type) {
      case 'app':
        tmp.packageName = record.packageName;
        tmp.action = record.action;
        tmp.param = record.param;
        break;
      case 'website':
        tmp.url = record.url;
        tmp.websiteType = record.websiteType;
        break;
      case 'theme':
        tmp.version = record.version;
        tmp.flag = record.flag;
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.props.form.setFieldsValue(tmp);
    }, 200);
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  languageonChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
    // this.setState({
    //   rolesValuse: checkedValues,
    // });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          confirmLoading: true,
        });
        // 修改
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/content/edit`,
          method: 'post',
          data: {
            ...values,
            id: this.state.contentId,
            type: this.state.type,
          }
        })
        .then(res => {
          if (res && res.success) {
            this.setState({
              modalVisible: false,
              confirmLoading: false,
            });
            message.success('修改成功');
            this.props.onOK();
          }
        })
        .catch(() => {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          message.error('修改失败');
        });
      }
    });
  }

  render() {
    const { modalVisible, } = this.state;
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

    this.creatListDom();

    return (
      <Modal
        title="修改信息"
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
              })(
                <Select>
                  { typeList }
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
                    <Input />
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
                    // initialValue: 'internal',
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
                <CheckboxGroup options={options} onChange={this.languageonChange} />
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

const editFile = Form.create()(editContent);
export default editFile;
