Sample Code: 
```html

<jq-typeahead jq-adapter="wings.filter" tokens="inbox,sent,from" localcache="true">
</jq-typeahead>

```

```javascript

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
  
```

# Install


```console
composer require jqtags/jq-typeahead

bower install jqtags-jq-typeahead

```