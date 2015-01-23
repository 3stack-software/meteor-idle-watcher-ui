Meteor.startup(function() {
  Tracker.autorun(function() {
    if (IdleWatcher.isInactive()) {
      Remodal.open('idleWatcherUi_InactiveModal');
    } else if (IdleWatcher.isActive() && Remodal.isModal("idleWatcherUi_InactiveModal") && Meteor.status().status === 'offline') {
      Meteor.reconnect();
    }
  });
});
