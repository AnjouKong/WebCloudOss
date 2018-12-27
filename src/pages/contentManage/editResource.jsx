import React, { Component } from 'react';
import { Modal, message, Button, Upload, Icon, Row, Col, } from 'antd';
import Utils from '../../common/Utils';


class editResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      confirmLoading: false,
      type: '',
      contentId: '',
      fileData: [],
      uploadUIDataList: [],
      filesList_Data: [],
    };
    this.language = [];
  }
  componentWillMount() {
    this.setState({
      type: this.props.type
    });
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  // 加载已有图片内容
  getInfoList = (id) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/content/load`,
      method: 'post',
      data: {
        id,
      }
    })
      .then(res => {
        const resData = res.data;
        console.log(resData);
        const dataTmp = [];
        if (resData.length > 0) {
          for (let i = 0; i < resData.length; i += 1) {
            for (let j = 0; j < this.language.length; j += 1) {
              if (!dataTmp[j]) {
                dataTmp[j] = [];
              }
              if (this.language[j] === resData[i].fdKey) {
                resData[i].uid = resData[i].id;
                delete resData[i].id;
                dataTmp[j].push(resData[i]);
                break;
              }
            }
          }
        }
        console.log(dataTmp);
        this.uploadLanguage(this.language, dataTmp);
      })
      .catch(() => {
      });
  };

  // 弹出框处理函数
  showModal = (record) => {
    console.log(record);

    console.log(this.state.type);
    this.setState({
      modalVisible: true,
      contentId: record.id,
    });
    const uiContentLanguages = [];
    const languages = record.uiContentLanguages;
    languages.map((item) =>
      uiContentLanguages.push(item.language)
    );
    this.language = uiContentLanguages;
    this.getInfoList(record.id);
  };
  modalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  // 组装数据 并去重 去空
  createBody = (data) => {
    console.log(data);
    const hash = {};
    const dataArray = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i]) {
        data[i].reduce((item, next) => {
          if (!hash[next.fileId]) {
            hash[next.fileId] = true;
            item.push(next);
            dataArray.push(next);
          }
          return item;
        }, []);
      }
    }
    return dataArray;
    // console.log(dataArray);
  };

  handleSubmit = () => {
    const uiContentFiles = this.createBody(this.state.filesList_Data);
    // console.log(JSON.stringify(uiContentFiles));
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/content/saveUpload`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: uiContentFiles,
      data: {
        contentId: this.state.contentId,
      },
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

  // 上传配置图片
  uploadLanguage = (data, fileListGet) => {
    const uploadUIDataListTmp = [];
    let acceptType = '';
    let isSingle = false; // 是否是单个文件
    switch (this.props.type) {
      case 'img' || 'imgCollection':
        acceptType = '.jpg,.jpeg,.gif,.png,.bmp'; // 图片、图片集文件格式
        if (this.props.type === 'img') {
          isSingle = true;
        }
        break;
      case 'app':
        acceptType = '.apk'; // 应用文件格式
        isSingle = true;
        break;
      case 'music':
        acceptType = '.mp3'; // 音乐文件格式
        isSingle = true;
        break;
      case 'video':
        acceptType = '.rm,.rmvb,.wmv,.avi,.mp4,.3gp,.mkv,.ts'; // 视频文件格式
        break;
      case 'theme':
        acceptType = '.skin'; // 主題包文件格式
        isSingle = true;
        break;
      default:
        break;
    }
    for (let i = 0; i < data.length; i += 1) {
      uploadUIDataListTmp.push(
        {
          name: 'file',
          accept: acceptType,
          action: `${window.PAY_API_HOST}/op/ui/content/upload`,
          listType: 'picture',
          multiple: !isSingle,
          // fileList: this.filesList_Data[i] ? this.filesList_Data[i] : [],
          // defaultFileList: this.createBody(defaultData),
          onChange: (info) => {
            const fileList = info.fileList;
            let filesDataUploadTmp = [];
            if (info.file.status === 'done') {
              console.log(info);
              fileList.map((file) => {
                let dataTmp;
                if (file.response && file.response.data) {
                  dataTmp = file.response.data;
                  dataTmp.fdKey = data[i]; // 语言
                  dataTmp.contentId = this.state.contentId;
                  dataTmp.uid = file.uid;
                  dataTmp.thumbUrl = file.thumbUrl;
                  dataTmp.url = file.url;
                  dataTmp.name = file.name;
                  // console.log(this.uploadFile[index]);
                  filesDataUploadTmp.push(dataTmp);
                  // fileData = fileData.concat(this.uploadFile[index]);
                } else if (!file.response) {
                  filesDataUploadTmp.push(file);
                }
                return dataTmp;
              });
              // console.log(filesDataUploadTmp);
              message.success(`${info.file.name} 上传成功。`);
            } else if (info.file.status === 'error') {
              filesDataUploadTmp = fileList;
              message.error(`${info.file.name} 上传失败。`);
            } else {
              // info.file.status === 'uploading' remove
              filesDataUploadTmp = fileList;
            }

            // state更新
            const filesListDataTmp = this.state.filesList_Data;
            if (isSingle && filesDataUploadTmp.length > 1) {
              filesListDataTmp[i] = [filesDataUploadTmp[filesDataUploadTmp.length - 1]];
            } else {
              filesListDataTmp[i] = filesDataUploadTmp;
            }
            this.setState({
              filesList_Data: filesListDataTmp,
            });
          },
        }
      );
    }


    // state更新
    console.log(fileListGet);
    console.log(uploadUIDataListTmp);
    this.setState({
      uploadUIDataList: uploadUIDataListTmp,
      filesList_Data: fileListGet,
    });
  };
  render() {
    const { modalVisible, uploadUIDataList, filesList_Data } = this.state;

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
        { (
          this.language.map((item, index) => (
            <Row key={index} style={{ marginBottom: 7 }}>
              <Col span={6} style={{ textAlign: 'right' }}>上传文件{item}：</Col>
              <Col span={16}>
                <Upload {...uploadUIDataList[index]} fileList={filesList_Data[index] ? filesList_Data[index] : []}>
                  <Button>
                    <Icon type="upload" />上传
                  </Button>
                </Upload>
              </Col>
            </Row>
          ))
        ) }
      </Modal>
    );
  }
}

export default editResource;
