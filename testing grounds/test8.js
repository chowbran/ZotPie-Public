var TAFFY = require('node-taffydb').TAFFY;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//localStorage = new LocalStorage('./scratch');
function makedb(name){
    var db = TAFFY({record:1,text:"example"});
    db.store("customD");
    //console.log(db().get());
}

function insert(item){
    db = TAFFY(localStorage.getItem("taffy_p"));
    db.insert(item, false);
    db.store("p");
}

function get_items(){
    db = TAFFY(localStorage.getItem("taffy_p"));
    return db().get();
}

function get(param){
    db = TAFFY(localStorage.getItem("taffy_p"));
    return db().filter({item:1}).get();
}
//makedb("f");
// insert('[{"item":1,"name":"example", "price":"test"}]'); //name:"custom", price:"custom"});
// console.log(get_items());
console.log(get("dfs"));