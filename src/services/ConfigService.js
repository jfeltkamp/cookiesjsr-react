class ConfigService {
  // Set initial configuration
  constructor(config) {
    config = (typeof config === 'object') ? config : {};
    document.cookiesjsr = config;
    this.config = config;
  }

  /**
   * Getter for all config items.
   *
   * @param name {string}
   *   Name or object query path of config.
   *
   * @param fallback {*}
   *   Fallback to return if no config found.
   *
   * @returns {*}
   *   Returns config[name], false or fallback if fallback is set as param.
   */
  get(name, fallback) {
    switch (typeof this.config[name]) {
      case 'string':
      case 'object':
        return this.config[name];
      default:
        fallback = (typeof fallback !== 'undefined') ? fallback : false;
        let frag = this.resolve(name);
        return (typeof frag !== 'undefined') ? frag : fallback;
    }
  }

  /**
   * Resolves nested properties in config object.
   *
   * @param path {string}
   * @param separator {string}
   *
   * @returns {*}
   *   Resolved content of string query.
   */
  resolve(path, separator) {
    separator = (typeof separator === 'string' && separator) ? separator : '.';
    let properties = path.split(separator);
    return properties.reduce(function (prev, curr) {
      return prev && prev[curr];
    }, this.config);
  }


  /**
   * Extract service ids from raw config data as prepared param for serviceActivationStatus.
   *
   * @returns {[]}
   */
  getServiceIds() {
    const serviceGroups = this.get('services', {});
    // Prepare group configuration.
    let services = []; // Services list for user decisions.
    for (let groupId in serviceGroups) {
      let group = serviceGroups[groupId];
      if (typeof group.services === 'object') {
        // Hang services into the list for user decisions.
        for (let srvcId in group.services) {
          let srvc = group.services[srvcId];
          if (typeof srvc.key === 'string') {
            services.push(srvc.key);
          }
        }
      }
    }
    return services;
  }

  /**
   * Return Service groups.
   *
   * @returns {{}}
   */
  getServiceGroups() {
    const groups = this.get('services', {});
    let serviceGroups = {};
    for (let groupId in groups) {
      let group = groups[groupId];
      if (typeof group.services === 'object') {
        serviceGroups[groupId] = group;
      }
    }
    return serviceGroups;
  }
}

export default ConfigService;
