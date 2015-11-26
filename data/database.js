/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import http from 'http';

// Model types
class User extends Object {}
class Widget extends Object {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
    var widget = new Widget();
    widget.name = name;
    widget.id = `${i}`;
    return widget;
});

module.exports = {
    // Export methods that your schema can use to interact with your database
    getUser: (id) => id === viewer.id ? viewer : null,
    getViewer: () => viewer,
    getWidget: (id) => {
      //console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
      return widgets.find(w => w.id === id);
    },
    getWidgets: (session) => {
      console.log('-----------');
      console.log(JSON.stringify(session));
      console.log('-----------');
      return widgets;
    },
    User,
    Widget,
};
