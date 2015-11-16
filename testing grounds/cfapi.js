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
	  db.run("CREATE TABLE if not exists item_data (itemID TEXT, info TEXT)");
	});

	db.close();
}

/*this function adds a column with name column_name to a table with name table_name 
  at a db at path db_path.
*/
function add_column(db_path, table_name, column_name){
	/*connect to db and add column to table*/
	var db = new sqlite3.Database(db_path);
	db.serialize(function(){
		db.run('ALTER TABLE ' +table_name+' ADD '+column_name);
	});
	db.close();
}

function remove_column(db_path, table_name, column_name){
	var db = new sqlite3.Database(db_path);
	//TODO, kind of lengthy and need to figure out a way to do this
	//programattically or switch to SQL instead of SQLite
}

/* @psuedo docstring
	insert item in table table_name at sqlite database at path db_path with column values 
	being the columns in which you want to insert item data for and item_values are the
	corresponding item valuses.
	col_values is formatted as follows: a tuple casted to string with data e.x. (a,b,c)
	item_values is formatted the same way.
	the itemID field is important and is the only required field
*/
function insert_item(db_path, table_name, col_values, item_values){
	var db = new sqlite3.Database(db_path);
	db.serialize(function(){
		db.run('INSERT INTO ' +table_name+ col_values +' VALUES'+item_values);
	});
	db.close();
}

/*
deletes item with itemID from table, itemID is a string surrounded by single qoutes
such as itemID="'itemid'" -in this case the double qoutes suppress the single qoutes,
you can also use \'itemid\'
*/
function remove_item(db_path, table_name, itemID){
	var db = new sqlite3.Database(db_path);
	db.serialize(function(){
		db.run('DELETE FROM ' + table_name +' WHERE itemID = '+itemID);
	});
	db.close();
}
/*commands for testing*/
//add_column('./mydb4.sqlite', 'item_data', 'testcol1 TEXT');
//insert_item('./mydb4.sqlite', 'item_data', "('itemID', 'info')", "('testid1','test2')");
//remove_item('./mydb4.sqlite', 'item_data', "'testid1'");