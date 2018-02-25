import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import moment from 'moment';

import './../imports/api/users';
import { Links } from './../imports/api/links';
import './../imports/startup/simple-schema-configuration.js';
// Callback is used to do something after method is called.
Meteor.startup(() => {
  // Middleware to check if url contains link id.
  WebApp.connectHandlers.use((req, res, next) => {
    //grab url minus the first forward slash
    const _id = req.url.slice(1);
    // check if any links matching link id
    const link = Links.findOne({ _id });
    // if match then redirect to link
    if (link) {
      res.statusCode = 302;
      res.setHeader('Location', link.url);
      res.end();
      // update the visited count and set lastvisitedat
      Meteor.call('links.trackVisit', _id);
    // else move on
    } else {
      next();
    }
  });
});
