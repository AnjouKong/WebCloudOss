import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, Checkbox, message, Tabs, Row, Col, Button, } from 'antd';
import Utils from '../../common/Utils';
import AddResource from './addResource';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

let typeList = [];
const options = [
  { label: '简体中文', value: 'zh-Hans' },
  { label: 'English', value: 'en' },
];

class addScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      typeData: [],
      bootEventData: [],
      musicEventData: [],
      themeEventData: [],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  // 获取分类
  getInfoList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/category/list`,
      method: 'post',
      data: {}
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
  }
  // 创建选择列表
  creatListDom = (typeData) => {
    typeList = [];
    typeData.map((item) => {
      return typeList.push(<Option key={item.id.toString()} value={item.id.toString()}>{item.name}</Option>);
    }
    );
  }
  // 弹出框处理函数
  showModal = () => {
    this.setState({
      modalVisible: true,
      bootEventData: [],
      musicEventData: [],
      themeEventData: [],
    });
    this.getInfoList();
  }
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          confirmLoading: true,
        });
        const uiSceneList = this.state.bootEventData.concat(this.state.musicEventData, this.state.themeEventData);
        // 添加
        const param = {
          ...values,
          uiSceneContents: uiSceneList,
        };
        console.log(JSON.stringify(param));
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/scene/add`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: param,
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
          message.error('添加失败');
        });
      }
    });
  }
  inputOnchange = (e, type, index) => {
    console.log(e);
    const { bootEventData, musicEventData } = this.state;
    switch (type) {
      case 'order': // 排序
        bootEventData[index].seq = e;
        break;
      case 'playTime': // 播放时间
        bootEventData[index].playTime = e;
        break;
      case 'carousel': // 是否轮播
        bootEventData[index].carousel = e;
        break;
      case 'skipTime': // 跳过时间
        bootEventData[index].skipTime = e;
        break;
      case 'skip': // 是否强制跳过
        bootEventData[index].skip = e;
        break;
      case 'bootPlay': // 是否在开机页播放
        musicEventData[index].bootPlay = e;
        break;
      case 'launcherPlay': // 是否在launcher播放
        musicEventData[index].launcherPlay = e;
        break;
      default:
        break;
    }
  }
  // 处理子函数传回来数据
  handleChildChange = (paramData, type) => {
    switch (type) {
      case 'boot': {
        const bootArray = this.state.bootEventData.concat(paramData);
        const hash = {};
        const bootData = bootArray.reduce((item, next) => {
          if (!hash[next.contentId]) {
            hash[next.contentId] = true;
            item.push(next);
          }
          return item;
        }, []);
        this.setState({
          bootEventData: bootData,
        });
        break;
      }
      case 'music': {
        this.setState({
          musicEventData: paramData,
        });
        break;
      }
      case 'theme': {
        const themeArray = this.state.themeEventData.concat(paramData);
        const hash = {};
        const themeData = themeArray.reduce((item, next) => {
          if (!hash[next.contentId]) {
            hash[next.contentId] = true;
            item.push(next);
          }
          return item;
        }, []);
        this.setState({
          themeEventData: themeData,
        });
        break;
      }
      default:
        break;
    }
  }
  // 开机事件列表
  bootEventList = () => {
    const { bootEventData } = this.state;
    return (
      bootEventData && bootEventData.map((item, index) => {
        const languages = [];
        const languagesData = item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: '10px 15px', border: '1px solid #ccc', position: 'relative' }}>
            <Button style={{ padding: '10px 15px', position: 'absolute' }}>X</Button>
            <Row style={{ marginBottom: 10 }}>
              <Col span={7}><Input value={item.name} disabled /></Col>
              <Col span={7} offset={1}><Input value={languages} disabled /></Col>
              <Col span={7} offset={1}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  formatter={value => `显示顺序： ${value}`}
                  onChange={e => this.inputOnchange(e, 'order', index)}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={7}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  formatter={value => `单个图片持续时间(秒)： ${value}`}
                  onChange={e => this.inputOnchange(e, 'playTime', index)}
                />
              </Col>
              <Col span={7} offset={1}>
                是否轮播：
                <Switch defaultChecked={false} onChange={e => this.inputOnchange(e, 'carousel', index)} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={7}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  formatter={value => `跳过时间(秒)： ${value}`}
                  onChange={e => this.inputOnchange(e, 'skipTime', index)}
                />
              </Col>
              <Col span={7} offset={1}>
                是否强制跳过：
                <Switch defaultChecked={false} onChange={e => this.inputOnchange(e, 'skip', index)} />
              </Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }
  // 背景音乐事件列表
  musicEventList = () => {
    const { musicEventData } = this.state;
    return (
      musicEventData && musicEventData.map((item, index) => {
        const languages = [];
        const languagesData = item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: 10, border: '1px solid #ccc', position: 'relative' }}>
            <Row style={{ marginBottom: 10 }}>
              <Col span={8}><Input value={item.name} disabled /></Col>
              <Col span={8} offset={1}><Input value={languages} disabled /></Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={8}>
                是否在开机页播放：
                <Switch defaultChecked={false} onChange={e => this.inputOnchange(e, 'bootPlay', index)} />
              </Col>
              <Col span={8} offset={1}>
                是否在launcher播放：
                <Switch defaultChecked={false} onChange={e => this.inputOnchange(e, 'launcherPlay', index)} />
              </Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }
  // 主题包事件列表
  themeEventList = () => {
    const { themeEventData } = this.state;
    return (
      themeEventData && themeEventData.map((item, index) => {
        const languages = [];
        const languagesData = item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: 10, border: '1px solid #ccc', position: 'relative' }}>
            <Row style={{ marginBottom: 10 }}>
              <Col span={7}><Input value={item.name} disabled /></Col>
              <Col span={7} offset={1}><Input value={languages} disabled /></Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }

  render() {
    const { modalVisible, typeData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="新建信息"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.modalCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
        width="900px"
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
            <FormItem
              {...formItemLayout}
              label="语言"
            >
              {getFieldDecorator('uiSceneLanguages', {
                // initialValue: ['en'],
                rules: [{ required: true, message: '请选择语言' }],
              })(
                <CheckboxGroup options={options} />
              )}
            </FormItem>
          </Form>
          <Tabs defaultActiveKey="boot">
            <TabPane tab="开机事件" key="boot">
              <Row style={{ marginBottom: 10 }}>
                <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>选择资源：</Col>
                <Col span={16}>
                  <Button type="primary" icon="plus" onClick={() => this.$boot.showModal()}>选择资源</Button>
                </Col>
              </Row>
              { this.bootEventList() }
              <AddResource onRef={ref => { this.$boot = ref; }} onOK={this.handleChildChange} />
            </TabPane>
            <TabPane tab="背景音乐" key="backgroundMusic">
              <Row style={{ marginBottom: 10 }}>
                <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>选择资源：</Col>
                <Col span={16}>
                  <Button type="primary" icon="plus" onClick={() => this.$backgroundMusic.showModal('music')}>选择资源</Button>
                </Col>
              </Row>
              { this.musicEventList() }
              <AddResource onRef={ref => { this.$backgroundMusic = ref; }} onOK={this.handleChildChange} />
            </TabPane>
            <TabPane tab="主题包事件" key="themePackage">
              <Row style={{ marginBottom: 10 }}>
                <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>选择资源：</Col>
                <Col span={16}>
                  <Button type="primary" icon="plus" onClick={() => this.$theme.showModal('theme')}>选择资源</Button>
                </Col>
              </Row>
              { this.themeEventList() }
              <AddResource onRef={ref => { this.$theme = ref; }} onOK={this.handleChildChange} />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

const addFile = Form.create()(addScene);
export default addFile;
