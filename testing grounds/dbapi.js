/*set the sqlite3 var, require its libraries &
  use in verbose mode for debugging purposes
*/
var sqlite3 = require('sqlite3').verbose();

/*makes a new database at the specified path, note the path should include
  the database name and extension. (ex. ~/user/sanic/db.sqlite)
 */
function makedb(path){
	/*create new sqlite db with name, name*/
	var db = new sqlite3.Database(path);

	var check;
    db.serialize(function() {
	  //create DB with default fields itemID and info to store default info
	  db.run("CREATE TABLE if not exists item_data (itemID TEXT, field TEXT, values TEXT)");
	});

	db.close();
}

/*opens custom db at path and displays all of its items*/
function get_items(path){
    /*create new sqlite db with name, name*/
	var db = new sqlite3.Database(path);

    db.serialize(function() {
	  //get items from db
	  db.run("SELECT * FROM item_data")
	});

	db.close();
}

function add_field(path, itemID, field, value='n/a'){
	var db = new sqlite3.Database(path);

	db.serialize( function() {
		db.run("INSERT INTO item_data (itemID, field, values) VALUES ("+
															itemID+','
															+ field +','
															+value + ");" )
	});
	db.close();
}

function remove_field_from_item(path, itemID, field){
	db.serialize( function() {
	db.run()
	});
	db.close();
}

function update_item(path, itemID, fields, values){
	//todo
}

get_items("./mydb4.sqlite")