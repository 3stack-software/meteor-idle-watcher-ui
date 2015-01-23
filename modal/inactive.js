"use strict";

TemplateHooks(Template.idleWatcherUi_InactiveModal, {
  created: function() {
    var retryInterval, retryTimeout;
    this.autorun(function() {
      var f;
      if (Remodal.isModal("idleWatcherUi_InactiveModal") && Meteor.status().status === 'connected') {
        f = function() {
          if (Remodal.isModal("idleWatcherUi_InactiveModal") && Meteor.status().status === 'connected') {
            Remodal.close();
          }
        };
        Meteor.setTimeout(f, 2000);
      }
    });
    retryTimeout = null;
    retryInterval = this.retryInterval = new ReactiveVar(0);
    this.autorun(function(computation) {
      var retryMs, status;
      Meteor.clearTimeout(retryTimeout);
      status = Meteor.status();
      if (status.status === 'waiting') {
        retryMs = status.retryTime - (new Date()).getTime();
        retryInterval.set(Math.round(retryMs / 1000).toFixed(0));
        retryTimeout = Meteor.setTimeout(_.bind(computation.invalidate, computation), 1000);
      } else {
        retryInterval.set(0);
      }
    });
  }
});

Template.idleWatcherUi_InactiveModal.events({
  'click button[data-action="connect"]': function(e) {
    e.preventDefault();
    Meteor.reconnect();
  }
});

Template.idleWatcherUi_InactiveModal.helpers({
  statusMessageTemplate: function() {
    switch (Meteor.status().status) {
      case 'connected':
        return Template.idleWatcherUi_InactiveModal_connected;
      case 'connecting':
      case 'waiting':
        return Template.idleWatcherUi_InactiveModal_connecting;
      case 'failed':
        return Template.idleWatcherUi_InactiveModal_disconnected;
      default:
        return null;
    }
  },
  connectingStatusMessage: function() {
    var retry, retryCount, status, _ref;
    _ref = Meteor.status(), status = _ref.status, retryCount = _ref.retryCount;
    if (status === 'connecting' && retryCount === 0) {
      return {
        message: "Connecting"
      };
    } else if (status === 'connecting') {
      return {
        message: "Connecting... attempt " + retryCount
      };
    } else if (status === 'waiting') {
      retry = Template.instance().retryInterval.get();
      return {
        message: "Connecting.. attempt " + retryCount + " in " + retry + "s"
      };
    } else {
      return {};
    }
  },
  connectionButton: function() {
    var status;
    status = Meteor.status();
    switch (status.status) {
      case 'connected':
        return {
          props: {
            'data-dismiss': 'modal',
            'class': 'btn btn-default'
          },
          text: 'Close'
        };
      case 'connecting':
        return {
          props: {
            'class': 'btn btn-success disabled',
            'disabled': true
          },
          text: 'Connecting'
        };
      case 'waiting':
        return {
          props: {
            'class': 'btn btn-success',
            'data-action': 'connect'
          },
          text: 'Connect Now'
        };
      case 'offline':
      case 'failed':
        return {
          props: {
            'class': 'btn btn-success',
            'data-action': 'connect'
          },
          text: 'Connect'
        };
      default:
        return null;
    }
  }
});
