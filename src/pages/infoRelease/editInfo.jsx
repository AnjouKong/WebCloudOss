import React, { Component } from 'react';
import { Form, Input, Row, Col, Slider, InputNumber, DatePicker, Modal, Select, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { PhotoshopPicker } from 'react-color';
import moment from 'moment';
import Utils from '../../common/Utils';

import './list.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;

class EditInfoComponent extends Component {
  constructor(props) {
    super(props);
    this.contentLenInit = 200;
    this.state = {
      // 修改窗口内部参数
      contentLen: this.contentLenInit,
      contentLenB: 0,
      fontColorValue: '#ffffff',
      fontColorVisible: false,
      bgColorValue: '#ffffff',
      bgColorVisible: false,
      timeValue: [moment(), moment().add(3, 'day')],
      // 弹出框状态参数
      editVisible: false,
      editConfirmLoading: false,
    };
    this.fontColorTmpValue = this.state.fontColorValue;
    this.bgColorTmpValue = this.state.bgColorValue;
    this.timeValue = [`${this.state.timeValue[0]}`, `${this.state.timeValue[1]}`];
    this.bodyHeight = document.documentElement.clientHeight;
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onTextAreaChange = (value) => {
    const len = Utils.getBLen(value);
    const lenB = Utils.getBLen(value, true);
    if (lenB > this.contentLenInit / 2 && (lenB - len) > 0) {
      const tmp = (lenB > this.contentLenInit ? 1 : 0);
      this.setState({
        contentLen: this.contentLenInit - (lenB - len) - tmp,
        contentLenB: lenB - tmp,
      });
    } else {
      this.setState({
        contentLen: this.contentLenInit,
        contentLenB: lenB,
      });
    }
  };
  onFontSizeChange = (value) => {
    this.props.form.setFieldsValue({
      fontSize: value
    });
  };
  onFontColorChange = () => {
    this.setState({
      fontColorValue: this.fontColorTmpValue,
      fontColorVisible: false,
    });
    this.props.form.setFieldsValue({
      fontColor: this.fontColorTmpValue
    });
  };
  onBgColorChange = () => {
    this.setState({
      bgColorValue: this.bgColorTmpValue,
      bgColorVisible: false,
    });
    this.props.form.setFieldsValue({
      bgColor: this.bgColorTmpValue
    });
  };
  onRangePickerOk= (values) => {
    console.log('Selected onOk: ', values);
    // this.timeValue = [values[0].format('YYYY-MM-DD HH:mm:ss'), values[0].format('YYYY-MM-DD HH:mm:ss')];
    this.timeValue = [`${values[0]}`, `${values[1]}`];
  };

  // 弹出框处理函数
  showEditModal = (record) => {
    // console.log(record);
    this.infoId = record.id;
    const timeTmp = [moment(record.startTime), moment(record.endTime)];
    this.setState({
      editVisible: true,
      timeValue: timeTmp,
      fontColorValue: record.fontColor,
      bgColorValue: record.bgColor,
    });
    this.fontColorTmpValue = this.state.fontColorValue;
    this.bgColorTmpValue = this.state.bgColorValue;
    this.timeValue = [`${timeTmp[0]}`, `${timeTmp[1]}`];
    this.onTextAreaChange(record.content);
    setTimeout(() => {
      this.props.form.setFieldsValue({
        title: record.title,
        content: record.content,
        fontSize: record.fontSize,
        fontColor: record.fontColor,
        bgColor: record.bgColor,
        bgAlpha: record.bgAlpha,
        place: record.place,
        playCount: record.playCount,
      });
    }, 200);
  };
  handleEditOk = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.updateInfo({
          tenantId: JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId,
          userId: JSON.parse(window.sessionStorage.getItem('UV_userInfo')).id,
          id: this.infoId,
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
          ...values,
        });
        // 提交code
      }
    });
  };
  handleEditCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      editVisible: false,
      fontColorVisible: false,
      bgColorVisible: false,
      contentLen: this.contentLenInit,
      contentLenB: 0,
    });
  };

  // update接口函数 by Liser
  updateInfo = (params) => {
    console.log('params:', params);
    this.setState({
      editConfirmLoading: true,
    });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/message/update`,
      method: 'post',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      console.log(res);
      this.setState({
        editVisible: false,
        editConfirmLoading: false,
        contentLen: this.contentLenInit,
        contentLenB: 0,
      });
      this.props.onOK();
    });
  };

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    // const verifyCode = 'http://localhost:8080/Page/login!verifyCode.action?time=1528598393864';
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    return (
      <Modal
        title="修改信息" visible={this.state.editVisible}
        style={{ height: 530 }} width="720px" destroyOnClose="true"
        onOk={this.handleEditOk} confirmLoading={this.state.editConfirmLoading} onCancel={this.handleEditCancel}
      >
        <div style={{ marginTop: 20 }}>
          <div >
            <Form layout="horizontal" >
              <FormItem label="信息名称" {...formItemLayout} >
                <Row>
                  <Col>
                    {getFieldDecorator('title', {
                      rules: [
                        { required: true, type: 'string', message: '请输入信息名称' }
                      ]
                    })(
                      <Input id="title" type="text" size="large" maxLength="30" />
                    )}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="信息内容" {...formItemLayout} >
                <Row>
                  <Col>
                    {getFieldDecorator('content', {
                      rules: [
                        { required: true, type: 'string', message: '请输入信息内容' }
                      ]
                    })(
                      <TextArea
                        id="content" autosize={{ minRows: 4, maxRows: 4 }}
                        maxLength={this.state.contentLen}
                        onChange={e => this.onTextAreaChange(e.target.value)}
                      />
                    )}
                    <span className="listInfo-tip-span" >{`${this.state.contentLenB}/${this.contentLenInit}字符`}</span>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="字体大小" {...formItemLayout} >
                <Row type="flex" justify="start">
                  <Col span={16}>
                    {getFieldDecorator('fontSize', {
                      initialValue: 26
                    })(
                      <Slider min={10} max={60} onChange={this.onFontSizeChange} />
                    )}
                  </Col>
                  <Col span={4} offset={2}>
                    {getFieldDecorator('fontSize', {
                      initialValue: 26
                    })(
                      <InputNumber
                        id="fontSize" min={10} max={60} style={{ marginLeft: 6 }}
                        onChange={this.onFontSizeChange} size="large"
                      />
                    )}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="字体颜色" {...formItemLayout} >
                <Row type="flex" justify="start">
                  <Col span={6}>
                    {getFieldDecorator('fontColor', {
                      initialValue: this.state.fontColorValue
                    })(
                      <Input
                        id="fontColor" type="text" size="large" readOnly
                        style={{ backgroundColor: this.state.fontColorValue }}
                        onClick={() => this.setState({ fontColorVisible: true })}
                      />
                    )}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="背景颜色" {...formItemLayout} >
                <Row type="flex" justify="start">
                  <Col span={6}>
                    {getFieldDecorator('bgColor', {
                      initialValue: this.state.bgColorValue
                    })(
                      <Input
                        id="bgColor" type="text" size="large" readOnly
                        style={{ backgroundColor: this.state.bgColorValue }}
                        onClick={() => this.setState({ bgColorVisible: true })}
                      />
                    )}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="背景透明度" {...formItemLayout}>
                <Row type="flex" justify="start">
                  <Col span={10}>
                    {getFieldDecorator('bgAlpha', {
                      initialValue: 100
                    })(
                      <InputNumber id="bgAlpha" size="large" min={0} max={100} />
                    )}
                    <span> (0透明，100不透明)</span>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="生效时间" {...formItemLayout} >
                <LocaleProvider locale={zhCN}>
                  <RangePicker
                    id="time"
                    size="large"
                    allowClear="true"
                    defaultValue={this.state.timeValue}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    // onChange={this.onRangePickerChange}
                    onOk={this.onRangePickerOk}
                  />
                </LocaleProvider>
              </FormItem>
              <FormItem label="次数" {...formItemLayout} >
                <Row type="flex" justify="start">
                  <Col span={6}>
                    {getFieldDecorator('playCount', {
                      initialValue: 1
                    })(
                      <InputNumber id="playCount" size="large" min={1} max={100} />
                    )}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="位置" {...formItemLayout} >
                <Row type="flex" justify="start">
                  <Col span={4}>
                    {getFieldDecorator('place', {
                      initialValue: 'up'
                    })(
                      <Select id="place" size="large" style={{ width: 90 }}>
                        <Option value="up">上</Option>
                        <Option value="down">下</Option>
                      </Select>
                    )}
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
          { this.state.fontColorVisible ? <PhotoshopPicker
            header="字体颜色" className="photoshopPicker-css"
            color={this.state.fontColorValue} onAccept={this.onFontColorChange}
            onChange={(color) => { this.fontColorTmpValue = color.hex; }}
            onCancel={() => this.setState({ fontColorVisible: false })}
          /> : null }
          { this.state.bgColorVisible ? <PhotoshopPicker
            header="背景颜色" className="photoshopPicker-css"
            color={this.state.bgColorValue} onAccept={this.onBgColorChange}
            onChange={(color) => { this.bgColorTmpValue = color.hex; }}
            onCancel={() => this.setState({ bgColorVisible: false })}
          /> : null }
        </div>
      </Modal>
    );
  }
}

const EditInfo = Form.create()(EditInfoComponent);
export default EditInfo;

