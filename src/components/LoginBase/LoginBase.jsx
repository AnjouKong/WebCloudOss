import React, { Component } from 'react';
import { Icon, Form, Input, Button, Row, Col, Tag } from 'antd';
import { ROUTE_NAMES } from '../../common/RouteNames';
import Utils from '../../common/Utils';

import './login-base.css';

const FormItem = Form.Item;

class LoginForm extends Component {

  constructor(props) {
    super(props);
    let tenantName = '智慧酒店管理系统';
    if (this.props.tenant) {
      window.loginUrlPram = this.props.tenant;
      switch (this.props.tenant) {
        case 'hongyun' :
          tenantName = '葡萄酒店智慧监控';
          break;
        default:
      }
    }
    this.state = {
      getFieldDecorator: '',
      verifyCodeSrc: `${window.PAY_API_HOST}/op/system/user/verifyCode?random=${Math.random()}`,
      tagVisible: false,
      tagText: '提示信息',
      tableTitle: tenantName,
    };
    // console.log(this.props.tenant);
  }

  onClickVerifyCode = () => {
    this.setState({
      verifyCodeSrc: `${window.PAY_API_HOST}/op/system/user/verifyCode?random=${Math.random()}`,
    });
  };

  onClickTageClose = (e) => {
    e.preventDefault();
    this.setState({ tagVisible: false });
  };
  // 设置local
  setLocalStorage = (params) => {
    let usernameLocalArr = JSON.parse(window.localStorage.getItem('UnitedView_tenant'));
    if (usernameLocalArr && usernameLocalArr.includes(params.username)) return;
    if (!usernameLocalArr) {
      usernameLocalArr = [];
    }
    usernameLocalArr.push(params.username);
    window.localStorage.setItem('UnitedView_tenant', JSON.stringify(usernameLocalArr));
  };
  handlesubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.login({ ...values });
      }
    });
  };
  // 登录接口
  login = (params) => {
    console.log('params:', params);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/user/login`,
      method: 'post',
      data: {
        ...params,
      },
      type: 'json',
    }).then((res) => {
      if (res.success) {
        window.sessionStorage.setItem('UV_userInfo', JSON.stringify(res.data));

        console.log(JSON.stringify(res.data));
        // this.setLocalStorage(params);
        Utils.router.go(`${ROUTE_NAMES.HOME}`);
      } else {
        this.setState({
          tagVisible: true,
          tagText: res.message,
        });
      }
    }).catch(err => {
      console.log(err);
      if (!err.success) {
        this.setState({
          tagVisible: true,
          tagText: err.message,
        });
      }
    });
  };

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const { tableTitle } = this.state;
    /*
   const usernameLocalArr = JSON.parse(window.localStorage.getItem('UnitedView_tenant'));
   let usernameLocal = '';
   if (usernameLocalArr && usernameLocalArr.length > 0) {
     usernameLocal = usernameLocalArr[usernameLocalArr.length - 1];
   }
   */
    return (
      <div className="login-body">
        <header className="login-header">{tableTitle}</header>
        <section className="login-form">
          <Form onSubmit={this.handlesubmit} >
            <FormItem className="login-FormItem">
              <Row>
                <Col>
                  {getFieldDecorator('username', {
                    // initialValue: usernameLocal,
                    rules: [
                      { required: true, type: 'string', message: '登录账号不能为空' }
                    ]
                  })(
                    <Input id="username" type="text" className="login-input" placeholder="登录名" addonBefore={<Icon type="user" />} />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem className="login-FormItem">
              <Row>
                <Col>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, type: 'string', message: '密码不能为空' },
                      { validator: this.compareToFirstPassword, }
                    ]
                  })(
                    <Input id="password" type="password" placeholder="密码" className="login-input" addonBefore={<Icon type="lock" />} />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem className="login-FormItem">
              <Row type="flex" justify="space-between">
                <Col span={14}>
                  {getFieldDecorator('code', {
                    rules: [
                      { required: true, type: 'string', message: '验证码不能为空' }
                    ]
                  })(
                    <Input id="code" type="text" placeholder="验证码" className="login-input" addonBefore={<Icon type="form" />} />
                  )}
                </Col>
                <Col span={8}>
                  <img src={this.state.verifyCodeSrc} onClick={this.onClickVerifyCode} />
                </Col>
              </Row>
            </FormItem>
            <FormItem className="login-FormItem" style={this.state.tagVisible ? { display: 'block' } : { display: 'none' }}>
              <Tag
                className="login-tag"
                closable
                color="#ff0000"
                // visible={this.state.tagVisible.toString()}
                onClose={this.onClickTageClose}
              >
                {this.state.tagText}
              </Tag>
            </FormItem>
            <FormItem className="login-FormItem">
              <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
            </FormItem>
          </Form>
        </section>
      </div>
    );
  }
}

const LoginBase = Form.create()(LoginForm);
export default LoginBase;

