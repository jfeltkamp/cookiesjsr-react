// https://www.npmjs.com/package/buildify
var buildify = require('buildify');
// https://www.npmjs.com/package/ncp
var ncp = require('ncp').ncp;

var assets = require('./build/asset-manifest.json');
var pjson = require('./package.json');
var mapping = require('./libsrc/mapping.json');

// Collect entry points by type.
var combine = {js: [], css: []}
for (var entry of assets.entrypoints) {
  if(entry.match(/^static\/js\//)) {
    combine.js.push('./build/' + entry);
  } else if (entry.match(/^static\/css\//)) {
    combine.css.push('./build/' + entry);
  }
}

// Combine React sources add license and write to library folder.
for (var src in combine) {
  var path = './library/dist/%name.min.%src'
    .replace('%name',pjson.name)
    .replace('%src',src);
  buildify()
    .concat(combine[src])
    .wrap('./libsrc/license.tpl', {
      version: pjson.version,
      file_name: pjson.name +'.min.' + src
    })
    .save(path);
}

// Create library/package.json from template with vars from ./package.json.
buildify()
  .wrap('./libsrc/package.json.tpl', {
    name: pjson.name,
    version: pjson.version,
    author: pjson.author,
    description: pjson.description
  })
  .save('./library/package.json');

// Copy sources to library folder.
for (var item of mapping.maps.copy) {
  ncp(item.src, item.dest, function (err) {
    if (err) { return console.error(err); }
  });
  console.log('Copied: ', item);
}
