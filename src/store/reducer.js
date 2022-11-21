import Translate from "../services/TranslationService";
import conf from "../services/ConfigService";
import scs from "../services/StoreCookieService";

const initialState = {
  activeGroup: 'default',
  bannerVisible: scs.isUpdateRequired(),
  cookieDocs: conf.get('config.interface.cookieDocs',true),
  defaultLang: conf.get('config.interface.defaultLang','en'),
  denyAllOnLayerClose: conf.get('config.interface.denyAllOnLayerClose',false),
  groupConsent: conf.get('config.interface.groupConsent',true),
  layerOpen: false,
  openSettingsHash: conf.get('config.interface.openSettingsHash','#cookiesjsr'),
  serviceGroups: conf.getServiceGroups(),
  services: scs.getServicesStatus(),
  settingsAsLink: conf.get('config.interface.settingsAsLink',false),
  showDenyAll: conf.get('config.interface.showDenyAll', true),
};

const reducer = (state = initialState, action) => {
  let interim = {...state};
  switch (action.type) {
    case 'INIT_SERVICES':
      interim = {...interim, ...action}
      delete interim.type;
      return interim;
    case 'ACTIVE_GROUP':
      interim.activeGroup = action.activeGroup;
      return interim;
    case 'CLOSE_ALL':
      interim.bannerVisible = false;
      interim.layerOpen = false;
      return interim;
    case 'TOGGLE_SERVICE':
      interim.services = {...state.services};
      interim.services[action.service] = !interim.services[action.service];
      return interim;
    case 'LAYER_OPEN':
      interim.layerOpen = action.layerOpen;
      return interim;
    case 'SET_ALL_SERVICES':
      interim.services = action.services;
      if (typeof action.bannerVisible === 'boolean') {
        interim.bannerVisible = action.bannerVisible;
      }
      if (typeof action.layerOpen === 'boolean') {
        interim.layerOpen = action.layerOpen;
      }
      return interim;
    case 'SET_TRANSLATION':
      interim.lang = new Translate(action.translation);
      return interim;
    default:
      return state;
  }
};

export default reducer;
