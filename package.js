Package.describe({
  name: '3stack:idle-watcher-ui',
  version: '0.1.0',
  summary: 'Waits until a user becomes idle, then displays a "disconnected" modal.',
  git: 'https://github.com/3stack-software/meteor-idle-watcher-ui',
  documentation: 'README.md'
});


Package.onUse(function(api){

  api.versionsFrom('METEOR@0.9.2');
  api.use([
    'spacebars',
    'templating',
    'reactive-var',
    '3stack:idle-watcher@0.1.0',
    '3stack:template-hooks@0.1.0',
    '3stack:remodal@1.0.0'
  ], 'client');

  api.addFiles([
    'modal/inactive.html'
  ], 'client');
  api.addFiles([
    'open-modal-on-idle.js',
    'modal/inactive.js'
  ], 'client')
});
