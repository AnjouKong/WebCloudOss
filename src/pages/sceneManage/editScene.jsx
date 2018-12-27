import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, Checkbox, message, Tabs, Row, Col, Button, Icon, } from 'antd';
import Utils from '../../common/Utils';
import AddResource from './addResource';

const FormItem = Form.Item;
const confirm = Modal.confirm;
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
      contentId: '',
      tenantId: '',
      typeData: [],
      bootEventData: [],
      musicEventData: [],
      themeEventData: [],
      tenantData: [],
      vodData: [],
    };
    this.tenantName = '';
  }
  componentDidMount() {
    this.props.onRef(this);
    this.getInfoList();
    this.getTenantList();
    this.getVodList();
  }
  // 获取商户
  getTenantList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/tenants`,
      method: 'get',
      data: {}
    })
    .then(res => {
      const resData = res.data;
      const tenantList = [];
      resData.map((item) => { // "/////"为了搜索名字然后取id
        return tenantList.push(
          <Option
            key={item.id}
            value={`${item.tenantName}/////${item.id}`}
            title={item.tenantName}
          >
            {item.tenantName}
          </Option>
        );
      });
      this.setState({
        tenantData: tenantList,
      });
    })
    .catch(() => {
    });
  }
  // 获取Vod
  getVodList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/media/vod`,
      method: 'get',
      data: {}
    })
      .then(res => {
        const resData = res.data;
        const vodList = [];
        resData.map((item) => {
          return vodList.push(
            <Option
              key={item.id}
              value={item.id}
              title={item.homePageName}
            >
              {item.homePageName}
            </Option>
          );
        });
        this.setState({
          vodData: vodList,
        });
      })
      .catch(() => {
      });
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
      // this.props.form.setFieldsValue({
      //   categoryId: this.props.id,
      // });
    })
    .catch(() => {
    });
  }
  // 创建选择列表
  creatListDom = (typeData) => {
    typeList = [];
    typeData.map((item) => {
      return typeList.push(<Option key={item.id} value={item.id}>{item.name}</Option>);
    }
    );
  };
  // 弹出框处理函数
  showModal = (record) => {
    console.log(record);
    const uiSceneList = record.uiSceneContents;
    const languageList = record.uiSceneLanguages;
    const bootData = [];
    const musicData = [];
    const themeData = [];
    const languageData = [];
    for (let i = 0; i < uiSceneList.length; i += 1) {
      switch (uiSceneList[i].eventType) {
        case 'boot':
          bootData.push(uiSceneList[i]);
          break;
        case 'backgroundMusic':
          musicData.push(uiSceneList[i]);
          break;
        case 'themePackage':
          themeData.push(uiSceneList[i]);
          break;
        default:
          break;
      }
    }
    for (let i = 0; i < languageList.length; i += 1) {
      languageData.push(languageList[i].language);
    }
    this.tenantName = record.tenantName;
    this.setState({
      modalVisible: true,
      contentId: record.id,
      tenantId: record.tenantId,
      bootEventData: bootData,
      musicEventData: musicData,
      themeEventData: themeData,
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({
        categoryId: record.categoryId,
        name: record.name,
        uiSceneLanguages: languageData,
        mediaHomePageId: record.mediaHomePageId,
        // tenantId: record.tenantId
      });
    }, 200);
  }
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
    this.props.onOK();
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
        console.log(uiSceneList);
        // 添加
        const param = {
          ...values,
          id: this.state.contentId,
          tenantId: this.state.tenantId,
          uiSceneContents: uiSceneList,
        };
        // console.log(JSON.stringify(param));
        console.log(param);
        Utils.request({
          url: `${window.PAY_API_HOST}/op/ui/scene/edit`,
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
      case 'skip': // 禁止强制跳过
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
        // console.log(paramData);
        const bootArray = this.state.bootEventData.concat(paramData);
        // console.log(bootArray);
        const hash = {};
        const bootData = bootArray.reduce((item, next) => {
          if (!hash[next.contentId]) {
            hash[next.contentId] = true;
            item.push(next);
          }
          return item;
        }, []);

        // console.log(bootData.toString());
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
        // console.log(themeArray);
        const hash = {};
        const hashFlag = {}; //  主题包 同一个标识只能添加一个
        const themeData = themeArray.reduce((item, next) => {
          if (!hash[next.contentId] && !hashFlag[next.flag]) {
            hash[next.contentId] = true;
            hashFlag[next.flag] = true;
            item.push(next);
          }
          return item;
        }, []);

        // console.log(themeData);
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
        const languagesData = item.uiContentLanguages || item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: '10px 15px', border: '1px solid #ccc', position: 'relative' }}>
            <Button
              style={{ position: 'absolute', right: 0, top: 0, border: 0, zIndex: 99 }}
              onClick={() => this.bootEventItemDelete(index, item.id)}
            >
              <Icon type="close" />
            </Button>
            <Row style={{ marginBottom: 10 }}>
              <Col span={7}><Input value={item.name} disabled /></Col>
              <Col span={7} offset={1}><Input value={languages} disabled /></Col>
              <Col span={7} offset={1}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  defaultValue={item.seq}
                  formatter={value => `显示顺序： ${value}`}
                  onChange={e => this.inputOnchange(e, 'order', index)}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={7}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  defaultValue={item.playTime}
                  formatter={value => `单个图片持续时间(秒)： ${value}`}
                  onChange={e => this.inputOnchange(e, 'playTime', index)}
                />
              </Col>
              <Col span={7} offset={1}>
                是否轮播：
                <Switch defaultChecked={item.carousel} onChange={e => this.inputOnchange(e, 'carousel', index)} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={7}>
                <InputNumber
                  style={{ width: '100%' }} min={1} max={10}
                  defaultValue={item.skipTime}
                  formatter={value => `跳过时间(秒)： ${value}`}
                  onChange={e => this.inputOnchange(e, 'skipTime', index)}
                />
              </Col>
              <Col span={7} offset={1}>
                禁止强制跳过：
                <Switch defaultChecked={item.skip} onChange={e => this.inputOnchange(e, 'skip', index)} />
              </Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }
  // 删除开机事件资源
  bootEventItemDelete = (index, id) => {
    console.log(index, id);
    const { bootEventData } = this.state;
    console.log(bootEventData);
    bootEventData.splice(index, 1);
    const titleText = id ? '删除后不可还原，确认要删除吗?' : '未保存资源，确认要删除吗?';
    confirm({
      title: titleText,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除资源
        if (id) {
          Utils.request({
            url: `${window.PAY_API_HOST}/op/ui/scene/deleteSceneContent`,
            method: 'post',
            data: {
              id,
            }
          })
            .then(res => {
              if (res && res.success) {
                message.success('删除成功');
                this.setState({
                  bootEventData
                });
              }
            })
            .catch(() => {
              message.error('删除失败');
            });
        } else {
          this.setState({
            bootEventData
          });
        }
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };


  // 背景音乐事件列表
  musicEventList = () => {
    const { musicEventData } = this.state;
    return (
      musicEventData && musicEventData.map((item, index) => {
        const languages = [];
        const languagesData = item.uiContentLanguages || item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: 10, border: '1px solid #ccc', position: 'relative' }}>
            <Button
              style={{ position: 'absolute', right: 0, top: 0, border: 0, zIndex: 99 }}
              onClick={() => this.musicEventItemDelete(index, item.id)}
            >
              <Icon type="close" />
            </Button>
            <Row style={{ marginBottom: 10 }}>
              <Col span={8}><Input value={item.name} disabled /></Col>
              <Col span={8} offset={1}><Input value={languages} disabled /></Col>
            </Row>
            <Row style={{ marginBottom: 10, lineHeight: '32px' }}>
              <Col span={8}>
                是否在开机页播放：
                <Switch defaultChecked={item.bootPlay} onChange={e => this.inputOnchange(e, 'bootPlay', index)} />
              </Col>
              <Col span={8} offset={1}>
                是否在launcher播放：
                <Switch defaultChecked={item.launcherPlay} onChange={e => this.inputOnchange(e, 'launcherPlay', index)} />
              </Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }
// 删除背景音乐资源
  musicEventItemDelete = (index, id) => {
    console.log(index, id);
    const { musicEventData } = this.state;
    console.log(musicEventData);
    musicEventData.splice(index, 1);
    const titleText = id ? '删除后不可还原，确认要删除吗?' : '未保存资源，确认要删除吗?';
    confirm({
      title: titleText,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除资源
        if (id) {
          Utils.request({
            url: `${window.PAY_API_HOST}/op/ui/scene/deleteSceneContent`,
            method: 'post',
            data: {
              id,
            }
          })
            .then(res => {
              if (res && res.success) {
                message.success('删除成功');
                this.setState({
                  musicEventData
                });
              }
            })
            .catch(() => {
              message.error('删除失败');
            });
        } else {
          this.setState({
            musicEventData
          });
        }
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  // 主题包事件列表
  themeEventList = () => {
    const { themeEventData } = this.state;
    return (
      themeEventData && themeEventData.map((item, index) => {
        const languages = [];
        const languagesData = item.uiContentLanguages || item.languages;
        languagesData.map((languagesItem) =>
          languages.push(languagesItem.language)
        );
        const list = (
          <div key={index} style={{ padding: 10, border: '1px solid #ccc', position: 'relative' }}>
            <Button
              style={{ position: 'absolute', right: 0, top: 0, border: 0, zIndex: 99 }}
              onClick={() => this.themeEventItemDelete(index, item.id)}
            >
              <Icon type="close" />
            </Button>
            <Row style={{ marginBottom: 10 }}>
              <Col span={7}><Input value={item.name} disabled /></Col>
              <Col span={7} offset={1}><Input value={languages} disabled /></Col>
              <Col span={7} offset={1}><Input value={item.flag} disabled /></Col>
            </Row>
          </div>
        );
        return list;
      })
    );
  }
  // 删除主题包事件资源
  themeEventItemDelete = (index, id) => {
    console.log(index, id);
    const { themeEventData } = this.state;
    console.log(themeEventData);
    themeEventData.splice(index, 1);
    const titleText = id ? '删除后不可还原，确认要删除吗?' : '未保存资源，确认要删除吗?';
    confirm({
      title: titleText,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除资源
        if (id) {
          Utils.request({
            url: `${window.PAY_API_HOST}/op/ui/scene/deleteSceneContent`,
            method: 'post',
            data: {
              id,
            }
          })
            .then(res => {
              if (res && res.success) {
                message.success('删除成功');
                this.setState({
                  themeEventData
                });
              }
            })
            .catch(() => {
              message.error('删除失败');
            });
        } else {
          this.setState({
            themeEventData
          });
        }
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  render() {
    const { modalVisible, typeData, vodData } = this.state; // tenantData
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
        title="修改信息"
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
                // initialValue: ['en','zh-Hans'],
                rules: [{ required: true, message: '请选择语言' }],
              })(
                <CheckboxGroup options={options} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商户"
            >
              {/* getFieldDecorator('tenantId', {
                rules: [{ required: true, message: '请选择商户' }],
              })(
                <Select showSearch>
                  { tenantData }
                </Select>
              ) */}
              <span className="ant-form-text">{this.tenantName}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择VOD首页"
            >
              {getFieldDecorator('mediaHomePageId', {
              })(
                <Select>
                  { vodData }
                </Select>
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
