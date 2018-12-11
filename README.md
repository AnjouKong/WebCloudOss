# React项目脚手架

本项目主要是为了构造一个react项目的脚手架，方便以后react项目的开发
**但是基本上每个项目都有自己的独特性，所以不可一味拷贝，不同的地方还是需要自己去定制。**

### 目录以及文件说明

1. public目录：存放编译之后生成的文件，每次编译之前该目录都会被清空，所以不要在这个文件夹内存放其他文件。
2. tests目录：存放单元测试文件
3. src目录：存放所有的源代码，其内部目录在下面详细说明
4. .eslintignore：eslint检查忽略配置
5. .eslintrc：eslint检查的一些配置项
6. .gitignore: git提交的忽略配置
7. copy-static-to-cdn.js: 某些项目中存在cdn目录需要开发人员手动拷贝文件的现象，为了解决这种问题可以在webpack中增加该文件的调用来自动拷贝文件过去。
8. package.json: 项目的一些基本配置，**每个项目开始前请在里面修改项目名称**
9. webpack.config.js: 开发环境webpack配置
10. webpack-prod.config.js: 生产环境webpack配置

### src内部目录说明

1. common：存放公共的css、js等文件
2. components: 存放独立的react组件
3. images：存放图片
4. lib：存放项目需要引入的第三方文件，比如swiper等
5. pages：存放react页面组件
6. actions：使用redux的话，用来存放action信息
7. reducers：使用redux的话，存放reducer信息
8. store: 使用redux的话，存放store信息
9. app-entry.jsx: 项目总入口
10. index.ejs: 项目的html文件，采用ejs格式直接放到后台的views中

### 安装

1. npm install -g webpack-dev-server@1.16.2 webpack@1.13.2
2. npm install
3. npm start
4. 在浏览器中访问http://localhost:8081

### 发布命令

npm run build
