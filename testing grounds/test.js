var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.sqlite');
var check;
db.serialize(function() {
  //create DB
  db.run("CREATE TABLE if not exists item_data (itemID TEXT, info TEXT)");
  // cookie cutter SQL query
  var stmt = db.prepare("INSERT INTO item_data VALUES (?, ?)");
  //populate DB with test values
  for (var i = 0; i < 10; i++) {
      stmt.run("item ID" + i, String(["hi", "I like Cheese", i]));
  }
  stmt.finalize();
  //print values in current database
  db.each("SELECT itemID AS id, * FROM item_data", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();