import Translate from "../services/TranslationService";
const currentLang = document.documentElement.lang || navigator.language.substring(0, 2)
  || navigator.userLanguage.substring(0, 2) || 'en';

const initialState = {
  currentLang: currentLang,
  activeGroup: 'default',

  translationQuery: '/cookiesjsr/lang/%lang_id/translation.json',
  availableLangs: ['en', 'de', 'es', 'fr', 'it', 'nl', 'pl', 'ru'],
  defaultLang: 'en',
  lang: new Translate({}),
  cookieName: 'cookiesjsr',
  openSettingsHash: '#cookiesjsr',
  layerOpen: false,
  denyAllOnLayerClose: true,
  showDenyAll: false,
  bannerVisible: false,
  settingsAsLink: false,
  services: [],
  serviceGroups: {},
  groupConsent: false,
  cookieService: null,
  cookieDocs: true
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
