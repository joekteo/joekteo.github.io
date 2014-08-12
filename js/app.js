$(function() {
  var User = Backbone.Model.extend({
    url: '/user',
    idAttribute: '_id',
      defaults: {
        firstname: '',
        lastname: '',
        email: ''
      }
  });

  var UserItemView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#userItemTemplate').html()),
    events: {
      'click .edit': 'editUser',
      'click .delete': 'deleteUser'
    },

    editUser: function () {
      var user = prompt('Enter new name', this.model.get('user'));
      if (!user) return;
      this.model.set('user', user);
    },
    
    initialize: function(){
          this.model.on('change', this.render, this);
    },

    deleteUser: function () {
      this.model.destroy();
    },

    remove: function () {
      this.$el.remove();
    },

    initialize: function () {
      var that = this;
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
        this.render();
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
    }
  });

  var UserCollection = Backbone.Collection.extend({
      model: User,
  });

  var NewUserView = Backbone.View.extend({
    el: '#newUser',
    events: {
      'submit': 'newUser'
    },

    newUser: function (event) {
      event.preventDefault();
      var users = new User({
          'firstname': this.$el.find('.firstname').val(),
          'lastname': this.$el.find('.lastname').val(),
          'email': this.$el.find('.email').val(),
      });

      this.collection.add(users);
    }
  });

  var InpuBoxView = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
      this.collection.on('add', this.addOne, this);
    },
    addOne: function (user) {
      var userView = new UserItemView({ model: user });
      console.log(userView);
      this.$el.append(userView.el);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'view/:id': 'view',
      'edit': 'edit',
      'tweet': 'showTweet',
      '*default': 'index'
    },

    showTweet: function () {
      console.log('Showing tweets');
        var customerCol = new CustomerCollection();
        customerCol.fetch();
        new CustomerView({ collection: customerCol });
        console.log(customerCol);
      },

      view: function (id) {
        console.log('Viewin item ', id);
        var m1 = new User();
        m1.save();
        m1.sync(function (method, model) {
            console.log('Synced', method, model);
        });
      },

      edit: function () {
        console.log('Edit route added');
      },

      index: function () {
        console.log('Index route added');
        var user = new UserCollection([
          { firstname: 'Paul', lastname: ' George', email: 'paulgeorge@demo.com' },
        ]);
        
        new NewUserView({ collection: user });
        var inputBox = new InpuBoxView({ collection: user });
        $('#page').html(inputBox.render().el);
      }
  });
 
    new AppRouter();
    Backbone.history.start(); 
});
