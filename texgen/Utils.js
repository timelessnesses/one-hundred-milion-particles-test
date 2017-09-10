if(!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}

if(typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function ReplaceTextAreaWithAce(textarea, lang, wordList)
{
	var editDiv = document.createElement("div");
	editDiv.style.position = "relative";
	editDiv.style.width = parseFloat(getComputedStyle(textarea).getPropertyValue("width"));
	editDiv.style.height = parseFloat(getComputedStyle(textarea).getPropertyValue("height"));
	textarea.parentNode.insertBefore(editDiv, textarea);
    var editor = ace.edit(editDiv);
	editor.$blockScrolling = Infinity;
	editor.setShowPrintMargin(false);
    editor.getSession().setValue(textarea.value);
    editor.getSession().setMode("ace/mode/" + lang);
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});
	var staticWordCompleter = {
		getCompletions: function(editor1, session, pos, prefix, callback) {
			if(editor == editor1) callback(null, wordList.map(function(word) {
				var caption = word[0];
				if(word[1] != null) caption += "(" + word[1].join(", ") + ")";
				return {
					caption: caption,
					value: word[0] + ((word[1] != null)? "(": ""),
					meta: word[1] == null? "parameter": "function"
				};
			}));
		}
	}
	editor.completers.unshift(staticWordCompleter);
	if(!editor.completer) {
		// make sure completer is initialized
		editor.execCommand("startAutocomplete")
		editor.completer.detach()
	}
	editor.completer.popup.container.style.width = "60%";
	textarea.parentNode.removeChild(textarea);
	return editor;
}

function DBInsert(dbCollection, entry, onSuccess)
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
		if(this.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Error inserting to DB:\nstatus: " + xhr.status + ': ' + xhr.statusText);
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
			else alert("Error inserting to DB:\n" + result.errMsg + "\nresult: " + result.result);
			return;
		}
		result.result.duplicate = false;
		onSuccess(result.result);
	}

	xhr.send(JSON.stringify(body));
}


function Base64ToBuffer(base64) {
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function(ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

function DBReadById(dbCollection, id, fields, onSuccess)
{
	DBQuery(dbCollection,
		{"_id": {"$eq": id}},
		function(results) {onSuccess(results[0]);},
		{fields: fields, limit: 1});
}

function DBQuery(dbCollection, query, onSuccess, params)
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

function IsEmptyString(str)
{
	return !str || str.trim() === "";
}

function EscapeHTML(str)
{
	return str.replace(/&/g,'&amp;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/\n/g, '<br/>');
}

function LoadShaderAsync(path)
{
	var loader = {};
	var notIE = !navigator.userAgent.match(/Trident/g) && !navigator.userAgent.match(/MSIE/g);
	if(notIE) //IE не поддерживает template string, поэтому придётся скачивать шейдер запросом
	{
		var head = document.getElementsByTagName('head')[0];
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.async = true;
		js.src = path;
		loader = js;
		head.appendChild(js);
		return loader;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.send();
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != 4) return;
		if(xhr.status != 200)
		{
			alert("Couldn't load shader library:\n" + xhr.status + ': ' + xhr.statusText);
			return;
		}

		loader.code = xhr.responseText;
		var leftQuote = loader.code.indexOf("`", 0);
		if(leftQuote !== -1)
		{
			var rightQuote = loader.code.indexOf("`", leftQuote+1);
			loader.code = loader.code.substring(leftQuote+1, rightQuote);
		}
		if(loader.onload) loader.onload();
	}
	return loader;
}


function CreateBMPInMemory(pixelsRGBA8, width, height)
{
	var w4 = width * 4;
	var data32 = new Uint32Array(pixelsRGBA8.buffer);

	var stride = width * 4; // row length incl. padding
	var pixelArraySize = stride * height;            // total bitmap size
	var fileLength = 122 + pixelArraySize;           // header size is known + bitmap

	var file = new ArrayBuffer(fileLength);          // raw byte buffer (returned)
	var view = new DataView(file);                   // handle endian, reg. width etc.
	var pos = 0, x, y = 0, p, s = 0, a, v;

	// write file header
	setU16(0x4d42);          // BM
	setU32(fileLength);      // total length
	pos += 4;                // skip unused fields
	setU32(0x7a);            // offset to pixels

	// DIB header
	setU32(108);             // header size
	setU32(width);
	setU32(-height >>> 0);   // negative = top-to-bottom
	setU16(1);               // 1 plane
	setU16(32);              // 32-bits (RGBA)
	setU32(3);               // no compression (BI_BITFIELDS, 3)
	setU32(pixelArraySize);  // bitmap size incl. padding (stride x height)
	setU32(2835);            // pixels/meter h (~72 DPI x 39.3701 inch/m)
	setU32(2835);            // pixels/meter v
	pos += 8;                // skip color/important colors
	setU32(0x000000ff);        // red channel mask
	setU32(0xff00);          // green channel mask
	setU32(0xff0000);            // blue channel mask
	setU32(0xff000000);      // alpha channel mask
	setU32(0x57696e20);      // " win" color space
	
	new Uint8Array(file, 122).set(pixelsRGBA8);

	return file;

	// helper method to move current buffer position
	function setU16(data) {view.setUint16(pos, data, true); pos += 2}
	function setU32(data) {view.setUint32(pos, data, true); pos += 4}
}

function CreateBMPBlob(pixelsRGBA8, width, height)
{
	return new Blob([CreateBMPInMemory(pixelsRGBA8, width, height)], {type: "image/bmp"});
}

function CreateImageFromPixels(pixelsRGBA8, width, height)
{
	var img = new Image();
	var blob = CreateBMPBlob(pixelsRGBA8, width, height);
	var blobUrl = URL.createObjectURL(blob);
	img.onload = function() {URL.revokeObjectURL(blobUrl);};
	img.src = blobUrl;
	return img;
}
