function Base64ToBuffer(base64)
{
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function(ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

var DB = {

Insert: function(dbCollection, entry, onSuccess)
{
	var xhr = new XMLHttpRequest();

	var body = {
		"app": "815d6c32a3884ee5b7382faf349138b0",
		"cli": "e95b39465c1a4fcdbcf4da2dd08736e5",
		"coll": dbCollection,
		"doc": entry
	};

	xhr.open("POST", 'https://api.scorocode.ru/api/v1/data/insert', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		if(xhr.status != 200)
		{
			PrintError("Error inserting to DB:\nstatus: " + xhr.status + ': ' + xhr.statusText);
			return;
		}
		var result = JSON.parse(xhr.responseText);
		if(result.error)
		{
			if(result.result && result.result.startsWith("ALREADY_EXISTS_ID:"))
			{
				result.result = {_id: result.result.substr(18), duplicate: true};
				onSuccess(result.result);
			}
			else PrintError("Error inserting to DB:\n" + result.errMsg + "\nresult: " + result.result);
			return;
		}
		result.result.duplicate = false;
		onSuccess(result.result);
	}

	xhr.send(JSON.stringify(body));
},

ReadById: function(dbCollection, id, fields, onSuccess)
{
	DB.Query(dbCollection,
		{"_id": {"$eq": id}},
		function(results) {if(results[0] !== undefined) onSuccess(results[0]);},
		{fields: fields, limit: 1});
},

Query: function(dbCollection, query, onSuccess, params)
{
	var xhr = new XMLHttpRequest();

	var body = {
		app: "815d6c32a3884ee5b7382faf349138b0",
		cli: "e95b39465c1a4fcdbcf4da2dd08736e5",
		coll: dbCollection,
		query: query
	};
	if(params)
	{
		if(params.limit) body.limit = params.limit;
		if(params.limit) body.skip = params.skip;
		if(params.fields) body.fields = params.fields;
	}

	xhr.open("POST", 'https://api.scorocode.ru/api/v1/data/find', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function() {
		if(this.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Error querying from DB:\n" + xhr.status + ': ' + xhr.statusText);
			return;
		}
		var result = JSON.parse(xhr.responseText);
		if(result.error)
		{
			alert("Error querying from DB:\n" + xhr.errMsg);
			return;
		}
		onSuccess(BSON.deserialize(Base64ToBuffer(result.result)));
	}

	xhr.send(JSON.stringify(body));
}

};
