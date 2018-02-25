import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
//shortens the id of the links
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
  Meteor.publish('links', function () {
    return Links.find({userId: this.userId});
  });
}

Meteor.methods({
  'links.insert'(url) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

      new SimpleSchema({
        url: {
          type: String,
          label: 'Your link',
          regEx: SimpleSchema.RegEx.Url
        }
      }).validate({ url });

    Links.insert({
      _id: shortid.generate(),
      url,
      userId: this.userId,
      // set links to visible by default
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null
    });
  },
  'links.setVisibility'(_id, visible) {
    // Check if user is logged in. Throw an error if not.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    // _id is a string with length greather than one.
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
        //visible is a boolean
      visible: {
        type: Boolean
      }
    }).validate({ _id, visible });

    // links.update - where _id and this.userId match the doc
      Links.update({
        _id,
        userId: this.userId
      }, {
        $set: { visible }
      });
    },
    'links.trackVisit'(_id) {
      new SimpleSchema({
        _id: {
          type: String,
          min: 1
        }
      }).validate({ _id });

      Links.update({ _id }, {
        $set: {
          lastVisitedAt: new Date().getTime()
        },
        $inc: {
          visitedCount: 1
        }
      });
    }
  });
