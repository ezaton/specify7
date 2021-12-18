"use strict";

var router = require('./router.js');
const treeview = require('./treeview.js');
const app = require('./specifyapp.js');
const domain = require('./domain.js');
const NotFoundView = require('./notfoundview.js');

module.exports =  function() {
    router.route('tree/:table/', 'tree', function(table) {
        require.ensure(['./treeview.js'], function(require) {
            var treeview = require('./treeview.js');
            treeview(table);
        }, 'treeview');
    });
    router.route('newTree/:table/', 'tree', function(table) {
        require.ensure(['./components/treeview'], function(require) {
            const {default:TreeView} = require('./components/treeview');
            var getTreeDef = domain.getTreeDef(table);
            if (!getTreeDef) {
                app.setCurrentView(new NotFoundView());
                return;
            }
            getTreeDef.done(function(treeDef) {
                treeDef.rget('treedefitems').pipe(function (treeDefItems) {
                    return treeDefItems.fetch({limit: 0}).pipe(function() { return treeDefItems; });
                }).done(function(treeDefItems) {
                    app.setCurrentView(new TreeView({
                        table: table,
                        treeDef: treeDef,
                        treeDefItems: treeDefItems.models,
                    }));
                });
            });
        }, 'treeView');
    });
};

