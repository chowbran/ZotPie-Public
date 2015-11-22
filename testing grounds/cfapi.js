/*set the sqlite3 var, require its libraries &
  use in verbose mode for debugging purposes
*/
var sqlite3 = require('sqlite3').verbose();
//data=[];
/*makes a new database at the specified path, note the path should include
  the database name and extension. (ex. ~/user/sanic/db.sqlite)
 */
customDB= {
	init:function(){
        this.data=[];
    },
	makedb: function (path){
		/*create new sqlite db with name, name*/
		var db = new sqlite3.Database(path);

		var check;
	    db.serialize(function() {
		  //create DB with default fields itemID and info to store default info
		  db.run("CREATE TABLE if not exists item_data (itemID TEXT, field TEXT, value TEXT)");
		});

		db.close();
	},


	insert: function (db_path, itemID, field, value){
		var db = new sqlite3.Database(db_path);
		db.serialize(function(){
			db.run('INSERT INTO item_data(itemID, field, value)' +" VALUES('"+itemID+"','"
																 +field+"','"+ value + "');");
		});
		db.close();
	},

	get_item: function (db_path, itemID){
		var db = new sqlite3.Database(db_path);
		//var data;
		var fk=false;
		db.serialize(function() {
			db.all("SELECT * FROM item_data WHERE itemID="+itemID, function(err, row){
				//console.log(row);
				//data.push(row);
		}, function (err, rows) {
				//console.log(rows + "ROWS");
				//data.concat(rows);
				this.save(rows);
				//customDB.save(rows);
				//console.log(rows);
			});
		});
		db.close();
		//return data;
	},

	save: function (rows) {
		//console.log(rows);
		//data.push(rows);
		this.data = rows;
		//this.data.push(rows);
	},
	/*
	deletes item with itemID from table, itemID is a string surrounded by single qoutes
	such as itemID="'itemid'" -in this case the double qoutes suppress the single qoutes,
	you can also use \'itemid\'
	*/
	remove_item: function (db_path, table_name, itemID) {
		var db = new sqlite3.Database(db_path);
	},

	getdata: function (){
		return this.data;
	}
}
/*commands for testing*/
//makedb("./my22.sqlite//add_column('./mydb4.sqlite', 'item_data', 'testcol1 TEXT');
//insert_item('./my22.sqlite', '654', "custom2", "vsef2");
customDB.init();
customDB.get_item("./my22.sqlite", "654");
		console.log(customDB.getdata() + "s");
//console.log(data);
//remove_item('./mydb4.sqlite', 'item_data', "'testid1'");");
