$(function () {

  var App = new Backbone.Marionette.Application();

  App.addRegions({
    headerRegion: '#headerRegion',
    tableRegion: '#tableRegion',
    modalRegion: '#modalRegion'
  });
  App.body = $("body");

  var Item = Backbone.Model.extend({
    defaults: {
      author: "",
      date: "",
      description: "",
      img: "",
      name: "",
      number: ""
    }
  });

  var Items = Backbone.Collection.extend({
    model: Item,
    url: "http://cm.mmi.macc.com.ua/tests/sample.php"
  });

  var items = new Items();

  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: '#headerTemplate',
    className: "headerWrapper"
  });

  var headerView = new HeaderView();

  var ModalView = Backbone.Marionette.ItemView.extend({

    template: '#modalTemplate',
    id: "modalWrapper",
    events: {
      'click .close': 'closeModal'
    },

    closeModal: function () {
      App.body.removeClass("modalOpen");
      this.remove();
    }
  });

  modalView = new ModalView();

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "tr",
    template: '#itemTemplate',
    events: {
      'click': 'showModal'
    },
    showModal: function () {
      console.log(this);
      var modal = new ModalView({
        model: this.model
      });
      console.log(modal)

      App.modalRegion.show(modal);

      App.body.addClass("modalOpen");
    }
  });

  var TableView = Backbone.Marionette.CompositeView.extend({
    collection: items,
    tagName: 'table',
    itemView: ItemView,
    template: "#tableTemplate",
    itemViewContainer: "tbody"
  });
  
  tableView = new TableView();

  var Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      '*route': 'showItems'
    },

    controller: {
      showItems: function (route) {
        App.headerRegion.show(headerView);
        App.tableRegion.show(tableView);
      }
    }
  });

  App.addInitializer(function () {
    items.fetch();
    new Router();
    Backbone.history.start({
      pushState: true
    });
  });

  App.start();
}); 