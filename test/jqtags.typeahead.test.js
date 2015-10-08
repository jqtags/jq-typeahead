define({
  name : 'jqtags.typeahead.test',
  extend : "spamjs.view",
  using : ["jqtag"]
}).as(function(demo,jqtag){


  jqtag.adapter.bind({
    name: "wings.filter",
    events: {
      //"_adapterfunction_ jq-typeahead" : "somefunction"
    },
    _inbox_ : function(e,target,data){
      console.error("_inbox_",e,target,data)
      e.detail.callback(["Amar","Akbar","Antony"]);
    },
    _search_ : function(e,target,data){
      console.error("_search_",e,target,data)
      e.detail.callback(["Amar","Akbar","Antony"]);
    }

  });

  return{
    src: [
      "test.html"
    ],
    events : {
      "click jq-carousels .crous-handle" : "slide_crous"
    },
    _init_: function () {
      var self = this;
      this.$$.loadTemplate({
        src: this.path("test.html")
      }).done(function(){

      });
    },
    _ready_ : function(){
      console.error("_ready_");

    }
  };

	
});