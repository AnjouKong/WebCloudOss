import React, { Component } from 'react';
import { LocaleProvider, Layout, Breadcrumb, Table, Button, Input, Modal, DatePicker, Select, } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Utils from '../../common/Utils';

const { Content } = Layout;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const Option = Select.Option;
// 列表项
const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '状态',
  dataIndex: 'state',
  key: 'state',
}, {
  title: '影片标签',
  dataIndex: 'keyWord',
  key: 'keyWord',
}, {
  title: '影片年份',
  dataIndex: 'filmYear',
  key: 'filmYear',
}, {
  title: '地区',
  dataIndex: 'area',
  key: 'area',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  key: 'updateTime',
}];

class cibnMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      current: 1,
      tableData: [],
      tableTotal: '',
    };
    // 请求传参
    this.variableInfo = {
      startDay: '',
      endDay: '',
      mediaState: 0,
      mediaType: '00050000000000000000000000019596',
    };
    this.$filmName = '';
    this.$filmYear = '';
  }
  componentDidMount() {
    this.getInfoList('1', '10');
  }
  // 获取信息列表
  getInfoList = (currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/cibn/page`,
      method: 'post',
      data: {
        seriesName: this.$filmName.input.value,
        releaseYear: this.$filmYear.input.value,
        startUpdateTime: this.variableInfo.startDay,
        endUpdateTime: this.variableInfo.endDay,
        seriesCategorCode: this.variableInfo.mediaType,
        state: this.variableInfo.mediaState,
        sort: 'releaseYear',
        order: 'desc',
        page: currentPage,
        size: pageSize
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          key: `${resData[i].seriesId}`,
          name: `${resData[i].seriesName}`,
          state: `${resData[i].state}` === '1' ? '已转换' : '未转换',
          keyWord: `${resData[i].seriesKeyword}`,
          filmYear: `${resData[i].releaseYear}`,
          area: `${resData[i].originalCountry}`,
          updateTime: `${resData[i].updateTime}`,
        });
      }
      this.setState({
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    });
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
      selectedRowKeys: [],
    });
    this.getInfoList(page, pageSize);
  }
  // 选择行
  selectOnChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }
  // 媒资转换
  mediaChange = () => {
    console.log(this.state.selectedRowKeys);
    confirm({
      title: '确认转换当前媒资吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/cibn/exchange`,
          method: 'post',
          data: {
            cibnIds: this.state.selectedRowKeys
          }
        })
        .then(() => {
          this.getInfoList(this.state.current, '10');
        })
        .catch(() => {
          Modal.error({
            title: '媒资转换失败',
          });
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  // 时间区间选择确定
  dateOnChange = (moment, dateString) => {
    console.log(dateString);
    if (dateString[0] === '') {
      this.variableInfo.startDay = '';
      this.variableInfo.endDay = '';
    } else {
      this.variableInfo.startDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.variableInfo.endDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  // select改变时
  stateChange = (value) => {
    this.variableInfo.mediaState = value;
  }
  typeChange = (value) => {
    this.variableInfo.mediaType = value;
  }
  render() {
    const { selectedRowKeys, tableData, tableTotal, current, } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectOnChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>媒资管理</Breadcrumb.Item>
          <Breadcrumb.Item>CIBN媒资</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
          <Button type="primary" disabled={!hasSelected} onClick={this.mediaChange} >
            媒资转换
          </Button>
          <div style={{ float: 'right' }}>
            <Input ref={ref => { this.$filmName = ref; }} placeholder="影片名称" style={{ width: 130, marginRight: 7 }} />
            <Input ref={ref => { this.$filmYear = ref; }} placeholder="年份" style={{ width: 70, marginRight: 7 }} />
            <LocaleProvider locale={zhCN}>
              <RangePicker
                showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['更新开始时间', '更新结束时间']}
                onChange={this.dateOnChange} style={{ marginRight: 7 }}
              />
            </LocaleProvider>
            <Select defaultValue="0" style={{ width: 90, marginRight: 7 }} onChange={this.stateChange}>
              <Option value="0">未转换</Option>
              <Option value="1">已转换</Option>
            </Select>
            <Select defaultValue="00050000000000000000000000019596" style={{ width: 90, marginRight: 7 }} onChange={this.typeChange}>
              <Option value="00050000000000000000000000019596">电影</Option>
              <Option value="00050000000000000000000000019614">电视剧</Option>
              <Option value="00050000000000000000000000019627">综艺</Option>
              <Option value="00050000000000000000000000019633">动漫</Option>
              <Option value="000508636583460618674">教育</Option>
              <Option value="00050000000000000000000000019590">其他栏目</Option>
            </Select>
            <Button type="primary" onClick={() => this.getInfoList('1', '10')}>筛选</Button>
          </div>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default cibnMedia;
