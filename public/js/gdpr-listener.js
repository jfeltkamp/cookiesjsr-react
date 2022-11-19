

function attachEvent(element, options) {
  element.addEventListener('click', function (e) {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('cookiesjsrSetService', options))
  });
}

function getLabel(id, status, services) {
  var element = document.getElementById(id);
  element.innerHTML = '';
  var content = document.createElement('a');
  var text = (status) ? 'enabled' : 'disabled';
  content.setAttribute('name', id);
  content.innerHTML = id + ' ' + text;
  let options = (typeof services !== 'object')
    ? {detail: {services: {}, groups: {}}} : services;
  options.detail.services[id] = !status;
  attachEvent(content, options)
  element.appendChild(content)
}

var actionLinks = {
  enableAll: {detail: { all: true }},
  disableAll: {detail: { all: false }},
  enableSocial: {detail: {groups: { social: true }}},
  disableSocial: {detail: {groups: { social: false }}}
}

for (var id in actionLinks) {
  var link = document.getElementById(id);
  if (link) {
    attachEvent(link, actionLinks[id]);
  }
}

var dispatcher = {
  instagram: {
    activate: function() {
      getLabel('instagram', true)
    },
    fallback: function() {
      getLabel('instagram', false)
    },
  },
  analytics: {
    activate: function() {
      getLabel('analytics', true);
    },
    fallback: function() {
      getLabel('analytics', false);
    },
  },
  video: {
    activate: function() {
      getLabel('video', true);
    },
    fallback: function() {
      getLabel('video', false);
    },
  },
  twitter: {
    activate: function() {
      getLabel('twitter', true);
    },
    fallback: function() {
      getLabel('twitter', false);
    },
  },
}


document.addEventListener('cookiesjsrUserConsent', function(event) {
  var services = (typeof event.detail.services === 'object') ? event.detail.services : {};
  for (let sid in services) {
    if(typeof dispatcher[sid] === 'object') {
      if(services[sid] === true && typeof dispatcher[sid].activate === 'function') {
        dispatcher[sid].activate();
      } else if(typeof dispatcher[sid].fallback === 'function') {
        dispatcher[sid].fallback();
      }
    } else {
      console.log('No object for ' + sid);
    }
  }
});


document.cookiesjsr = {
  config: {
    cookie: {
      name: "cookiesjsr",
      expires: 31536000000,
      domain: "",
      sameSite: "Lax",
      secure: false
    },
    library: {
      libPath: "/libraries/cookiesjsr/dist/cookiesjsr.min.js",
      timeoutApp: 5000,
      scrollLimit: 450
    },
    callback: [],
    interface: {
      openSettingsHash: "#editCookieSettings",
      showDenyAll: true,
      settingsAsLink: false,
      availableLangs: [
        "de"
      ],
      defaultLang: "de",
      groupConsent: true,
      cookieDocs: true
    }
  },
  services: {
    default: {
      id: "default",
      services: [
        {
          key: "base",
          type: "default",
          name: "Required cookies",
          uri: "/cookie-info",
          needConsent: false
        }
      ],
      weight: 1
    },
    tracking: {
      id: "tracking",
      services: [
        {
          key: "analytics",
          type: "tracking",
          name: "Google Analytics",
          uri: "https://support.google.com/analytics/answer/6004245",
          needConsent: true
        }
      ],
      weight: 10
    },
    social: {
      id: "social",
      services: [
        {
          key: "instagram",
          type: "social",
          name: "Instagram",
          uri: "https://help.instagram.com/196883487377501",
          needConsent: true
        },
        {
          key: "twitter",
          type: "social",
          name: "Twitter media",
          uri: "https://help.twitter.com/en/rules-and-policies/twitter-cookies",
          needConsent: true
        }
      ],
      weight: 20
    },
    video: {
      id: "video",
      services: [
        {
          key: "video",
          type: "video",
          name: "Video provided by YouTube, Vimeo",
          uri: "https://policies.google.com/privacy",
          needConsent: true
        }
      ],
      weight: 40
    }
  },
  translation: {
    langcode: "de",
    "default_langcode": "en",
    bannerText: "We use a selection of our own and third-party cookies on the pages of this website: Essential cookies, which are required in order to use the website; functional cookies, which provide better easy of use when using the website; performance cookies, which we use to generate aggregated data on website use and statistics; and marketing cookies, which are used to display relevant content and advertising. If you choose \"ACCEPT ALL\", you consent to the use of all cookies. You can accept and reject individual cookie types and  revoke your consent for the future at any time under \"Settings\".",
    privacyPolicy: "Datenschutzbestimmungen",
    privacyUri: "/privacy",
    imprint: "Impressum",
    imprintUri: "/imprint",
    cookieDocs: "Cookie documentation",
    cookieDocsUri: "/cookie_docs",
    denyAll: "Alle ablehnen",
    settings: "Settings",
    acceptAll: "Alle akzeptieren",
    allowAll: "Alle akzeptieren",
    cookieSettings: "Cookie settings",
    close: "Close",
    officialWebsite: "View official website",
    requiredCookies: "Required cookies",
    readMore: "Weiterlesen",
    allowed: "Erlaubt",
    denied: "abgelehnt",
    alwaysActive: "Always active",
    settingsAllServices: "Settings for all services",
    saveSettings: "Save",
    credit: "",
    default: {
      title: "What are Cookies?",
      details: "Cookies are small text files that are placed by your browser on your device in order to store certain information. Using the information that is stored and returned, a website can recognize that you have previously accessed and visited it using the browser on your end device. We use this information to arrange and display the website optimally in accordance with your preferences. Within this process, only the cookie itself is identified on your device. Personal data is only stored following your express consent or where this is absolutely necessary to enable use the service provided by us and accessed by you."
    },
    tracking: {
      title: "Tracking cookies",
      details: "Marketing cookies come from external advertising companies (\"third-party cookies\") and are used to collect information about the websites visited by the user. The purpose of this is to create and display target group-oriented content and advertising for the user."
    },
    social: {
      title: "Social Plugins",
      details: "Kommentar Manager erleichtern die Organisation von Kommentaren und helfen dabei Spam zu verhindern."
    },
    video: {
      title: "Video",
      details: "Videoplattformen erlauben Videoinhalte einzublenden und die Sichtbarkeit der Seite zu erhöhen."
    }
  }
}
