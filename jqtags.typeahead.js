_tag_('jqtags.typeahead', function (test) {

  var jQuery = _module_("jQuery");
  var cacheUtils = _module_("jsutils.cache");
  var cacheUtilsInstance = cacheUtils.instance("jqtags.typeahead");
  var SEARCH_KEY = "search";

  var breakQuery = function(q){
    var data = {};
    var dataList = q.split(/\ /).map(function(key){ if(key.indexOf(":")>0){ return "#"+key; }else{ return key; }  }).join(" ").split("#");
    var lastKey, lastItem;
    for(var i in dataList){
      var dataItem = dataList[i].split(":");
      if(is.String(dataItem[1])){
        lastKey =  (dataItem[0] || SEARCH_KEY);
        lastItem = dataItem[1];
      } else {
        lastKey  = SEARCH_KEY;
        lastItem = dataItem[0] || "";
      }
      data[lastKey] = lastItem;
    }
    return { data : data , lastKey : lastKey, lastItem : lastItem, count : dataList.length };
  };

  return {
    tagName: "jq-typeahead",
    events: {

    },
    accessors: {
      value: {
        type: "string",
        default: "",
        onChange: "setValue"
      },
      tokens: {
        type: "string",
        default: ""
      },
      localcache : {
        type: "boolean",
        default: true
      },
      placeholder : {
        type : "string", default : ""
      }
    },
    attachedCallback: function () {
      var self = this;
      this.$.placeholder = this.$.placeholder || "";
      this.$.innerHTML = '<input class="typeahead" type="text" placeholder="'+  this.$.placeholder +'" />';

      console.error("attachedCallback",self.$.localcache)
      this.$typeahead = jQuery(this.$).find("input").typeahead({
        hint: true,
        highlight: true,
        minLength: 0
      },{
        name: 'states',
        source: function(q, cb){
          var data = breakQuery(q);
          var suggestKeyWords = data.lastItem[data.lastItem.length-1] == " " || (data.count === 1 && data.lastItem === "") ;
          if(self.$.localcache){
            var matches = [];
            var options = cacheUtilsInstance.get(data.lastKey) || [];
            var substrRegex = new RegExp(data.lastItem, 'i');
            options.map(function(str) {
              if (substrRegex.test(str) || str.indexOf(data.lastItem)==0) {
                matches.push(q + str.replace(data.lastItem,""));
              }
            });
            if(suggestKeyWords){
              self.$.tokens.split(",").map(function(token){
                if(data[token]===undefined){
                  matches.push(q + token+":");
                }
              })
            }
            cb(matches);
          } else {
            var detail = { method : "_"+data.lastKey+"_", query : data.lastItem, callback : function(resp){
              cb(resp.map(function(item){
                return q + item
              }));
            }};
            self.adapterFunction(detail);
            self.trigger("jq.query:"+data.lastKey,detail);
          }
        }
      }).on("typeahead:select", function(e,q,c){
          return self.registerValue(q);
      }).on("typeahead:change", function(e,q,c){
        return self.registerValue(q);
      });
    },
    registerValue : function(q){
      var data = breakQuery(q);
      console.error("registerValue",data);
      if(this.$.localcache){
        for(var key in data.data){
          var options = cacheUtilsInstance.get(key) || [];
          if(data.data[key]){
            options.push((data.data[key]+"").trim());
            options = options.unique();
            cacheUtilsInstance.set(key,options);
          }
        }
      }
      this.trigger("change");
      this.trigger("input");
    },
    setValue : function(e,oldValue,newValue){
      this.$typeahead.typeahead('val',newValue);
    },
    detachedCallback: function () {
      this.$typeahead.typeahead('destroy');
    }
  };
});
