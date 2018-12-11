// 存放项目中使用的常量
export const TOAST_TYPE = {
  BLACK: 'black',
  BLUE: 'blue',
  // 多行文字
  BLUE_MULTI_ROWS: 'blue_multi_rows',
};

// 角色权限 对应value
export const ROLE_PERMISSIONS_VALUE = {
  DataMenu: { main: 'dataMenu', sub: ['dataMenu100', 'dataMenu200', 'dataMenu300'] },
  InfoMenu: { main: 'infoMenu', sub: ['infoMenu100'] },
  MediaMenu: { main: 'mediaMenu', sub: ['mediaMenu100', 'mediaMenu200', 'mediaMenu300', 'mediaMenu400', 'mediaMenu500', 'mediaMenu600'] },
  UserMenu: { main: 'userMenu', sub: ['userMenu100', 'userMenu200', 'userMenu300'] },
  AppMenu: { main: 'appMenu', sub: ['appMenu100', 'appMenu200', 'appMenu300', 'appMenu400', 'appMenu500', 'appMenu600', 'appMenu700', 'appMenu800', 'appMenu900'] },
  NodeMenu: { main: 'nodeMenu', sub: ['nodeMenu100', 'nodeMenu200', 'nodeMenu300'] },
  InfoManage: { main: 'infoManage', sub: ['infoManage100'] },
  dataShow: { main: 'dataShow', sub: ['dataShow100', 'dataShow200', 'dataShow300', 'dataShow400', 'dataShow500'] },
  contentManage: {
    main: 'contentManage',
    sub: ['contentManage100', 'contentManage200', 'contentManage300', 'contentManage400', 'contentManage500', 'contentManage600', 'contentManage700', 'contentManage800', 'contentManage900', 'contentManage1000', 'contentManage1100', 'contentManage1200'],
    btn: ['contentManageBtn001', 'contentManageBtn002', 'contentManageBtn003', 'contentManageBtn004', 'contentManageBtn005', 'contentManageBtn006', 'contentManageBtn007'],
  },
  SceneManage: {
    main: 'sceneManage',
    sub: ['sceneManage100'],
    btn: ['sceneManageBtn101', 'sceneManageBtn102', 'sceneManageBtn103', 'sceneManageBtn104', 'sceneManageBtn105', 'sceneManageBtn106', 'sceneManageBtn107', 'sceneManageBtn108', 'sceneManageBtn109'],
  },
};

export const DEFAULT_ERROR_MSG = '应用遇到问题，请稍后再试';
