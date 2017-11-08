var BSON = {};
(function() { //namespace BSON
	
var UUID = function()
{
	function UUID(id)
	{
		this._id = new Uint8Array(id);
	}
	UUID.prototype.buffer = function()
	{
		return this._id;
	};
	return UUID;
}();
BSON.UUID = UUID;

var ObjectId = function() {
	function ObjectId(id) {
		this._id = new Uint8Array(id);
	}
	ObjectId.prototype.buffer = function () {
		return this._id;
	};
	return ObjectId;
}();
BSON.ObjectId = ObjectId;

var UTC = function()
{
	function UTC(time)
    {
		this._time = (typeof time !== "string") ? new Uint8Array(time || number2long(Date.now())) : number2long(+new Date(time));
	}
	UTC.prototype.buffer = function ()
    {
		return this._time;
	};

	UTC.prototype.fromString = function (date)
    {
		this._time = number2long(+new Date(date));
	};

	//Returns the milliseconds since the Unix epoch (UTC)
	UTC.prototype.toNumber = function()
    {
		return long2number(this._time);
	};
	UTC.prototype.toDate = function()
    {
		return new Date(long2number(this._time));
	};
	return UTC;
}();
BSON.UTC = UTC;

function getObjectSize(obj)
{
	var len = 4 + 1; // handle the obj.length prefix + terminating '0'
	for (var key in obj) {
	len += getElementSize(key, obj[key]);
	}
	return len;
}

function getElementSize(name, value)
{
	var len = 1; // always starting with 1 for the data type byte
	if (name) len += strlen(name) + 1;
	if (value === undefined || value === null) return len;
	switch (value.constructor) {
	case String: return len + 4 + strlen(value) + 1;
	case Number:
		if (Math.floor(value) === value) {
			if (value <= 2147483647 && value >= -2147483647) return len + 4;
			return len + 8;
		}
		return len + 8;
	case Boolean: return len + 1;
	case Array: case Object: return len + getObjectSize(value);
	case Int8Array: case Uint8Array: return len + 5 + value.byteLength;
	case Date: case UTC: return len + 8;
	case UUID: return len + 5 + 16;
	case ObjectId: return len + 12;
	default: return 0; // unsupported type
	}
}

//return {Uint8Array} An byte array with the BSON representation
function serialize(object)
{
	var buffer = new Uint8Array(getObjectSize(object));
	serializeEx(object, buffer);
	return buffer;
}
BSON.serialize = serialize;

//private
function serializeEx(object, buffer, i)
{
	if (i === void 0) i = 0;
	i += int32(buffer.length, buffer, i);
	if (object.constructor === Array) {
		for (var j = 0, len = object.length; j < len; j++)
			i = packElement(j.toString(), object[j], buffer, i);
	}
	else {
		for (var key in object)
			i = packElement(key, object[key], buffer, i);
	}
	buffer[i++] = 0; // terminating zero
	return i;
}

//private
function cstring(name, buffer, offset)
{
	var cstring = str2bin(name);
	var clen = cstring.length;
	buffer.set(cstring, offset);
	buffer[offset + clen++] = 0;
	return clen;
}
//private
function int32(size, buffer, offset)
{
	buffer[offset++] = (size) & 0xff;
	buffer[offset++] = (size >>> 8) & 0xff;
	buffer[offset++] = (size >>> 16) & 0xff;
	buffer[offset++] = (size >>> 24) & 0xff;
	return 4;
}

//private
function packElement(name, value, buffer, i)
{
	if(value === undefined || value === null)
    {
		buffer[i++] = 0x0A; // BSON type: Null
		i += cstring(name, buffer, i);
		return i;
	}
	switch (value.constructor)
    {
	case String:
		buffer[i++] = 0x02; // BSON type: String
		i += cstring(name, buffer, i);
		var size = cstring(value, buffer, i + 4);
		i += int32(size, buffer, i);
		return i + size;
	case Number:
		if (Math.floor(value) === value)
        {
			if (value <= 2147483647 && value >= -2147483647)
            {
				buffer[i++] = 0x10; // BSON type: int32
				i += cstring(name, buffer, i);
				i += int32(value, buffer, i);
			}
			else
            {
				buffer[i++] = 0x12; // BSON type: int64
				i += cstring(name, buffer, i);
				buffer.set(number2long(value), i);
				i += 8;
			}
		}
		else {
			// it's a float / double
			buffer[i++] = 0x01; // BSON type: 64-bit floating point
			i += cstring(name, buffer, i);
			var f = new Float64Array([value]);
			var d = new Uint8Array(f.buffer);
			buffer.set(d, i);
			i += 8;
		}
		return i;
	case Boolean:
		buffer[i++] = 0x08; // BSON type: Boolean
		i += cstring(name, buffer, i);
		buffer[i++] = value ? 1 : 0;
		return i;
	case Array: case Object:
		buffer[i++] = value.constructor === Array ? 0x04 : 0x03; // BSON type: Array / Document
		i += cstring(name, buffer, i);
		var end = serializeEx(value, buffer, i);
		int32(end - i, buffer, i); // correct size
		return end;
	case Int8Array: case Uint8Array:
		buffer[i++] = 0x05; // BSON type: Binary data
		i += cstring(name, buffer, i);
		i += int32(value.byteLength, buffer, i);
		buffer[i++] = 0; // use generic binary subtype 0
		buffer.set(value, i);
		i += value.byteLength;
		return i;
	case Date:
		buffer[i++] = 0x09; // BSON type: UTC datetime
		i += cstring(name, buffer, i);
		buffer.set(number2long(value.getTime()), i);
		i += 8;
		return i;
	case UTC:
		buffer[i++] = 0x09; // BSON type: UTC datetime
		i += cstring(name, buffer, i);
		buffer.set(value.buffer(), i);
		i += 8;
		return i;
	case UUID:
		buffer[i++] = 0x05; // BSON type: Binary data
		i += cstring(name, buffer, i);
		i += int32(16, buffer, i);
		buffer[i++] = 4; // use UUID subtype
		buffer.set(value.buffer(), i);
		i += 16;
		return i;
	case ObjectId:
		buffer[i++] = 0x07; // BSON type: ObjectId
		i += cstring(name, buffer, i);
		buffer.set(value.buffer(), i);
		i += 12;
		return i;
	case RegExp:
		buffer[i++] = 0x0B; // BSON type: Regular expression
		i += cstring(name, buffer, i);
		i += cstring(value.source, buffer, i);
		if(value.global) buffer[i++] = 0x73; // s = 'g'
		if(value.ignoreCase) buffer[i++] = 0x69; // i
		if(value.multiline) buffer[i++] = 0x6d; // m
			buffer[i++] = 0;
			return i;
	default: return i; // unknown type (ignore element)
	}
}
/**
* Deserialize (parse) BSON data to an object
* @param {Uint8Array} buffer The buffer with BSON data to convert
* @param {Boolean} useUTC Optional, if set an UTC object is created for 'UTC datetime', else an Date object. Defaults to false
* @return {Object} Returns an object or an array
*/
function deserialize(buffer, useUTC, i, returnArray)
{
	if(useUTC === void 0) useUTC = false;
	if(i === void 0) i = 0;
	if(returnArray === void 0) returnArray = false;
	// check size
	if(buffer.length < 5) return undefined; // Document error: Size < 5 bytes
	var size = buffer[i++] | buffer[i++] << 8 | buffer[i++] << 16 | buffer[i++] << 24;
	if (size < 5 || size > buffer.length) return undefined; // Document error: Size mismatch
	if (buffer[buffer.length - 1] !== 0x00) return undefined; // Document error: Missing termination
	var object = returnArray ? [] : {}; // needed for type ARRAY recursion later
	for(;;)
    {
		var elementType = buffer[i++]; // read type
		if(elementType === 0) break; // zero means last byte, exit

		var end = i;
		for(; buffer[end] !== 0x00 && end < buffer.length; end++);
		if(end >= buffer.length - 1) return undefined; // Document error: Illegal key name
		var name = bin2str(buffer.subarray(i, end));
		if(returnArray) name = parseInt(name); // convert to number as array index
		i = ++end; // skip terminating zero
		switch (elementType)
        {
		case 0x01:// BSON type: 64-bit floating point
			object[name] = (new Float64Array(buffer.slice(i, i += 8).buffer))[0]; // use slice() here to get a new array
			break;
		case 0x02:// BSON type: String
			size = buffer[i++] | buffer[i++] << 8 | buffer[i++] << 16 | buffer[i++] << 24;
			object[name] = bin2str(buffer.subarray(i, i += size - 1));
			i++;
			break;
		case 0x03:// BSON type: Document (Object)
			size = buffer[i] | buffer[i + 1] << 8 | buffer[i + 2] << 16 | buffer[i + 3] << 24;
			object[name] = deserialize(buffer, useUTC, i, false); // isArray = false => Object
			i += size;
			break;
		case 0x04:// BSON type: Array
			size = buffer[i] | buffer[i + 1] << 8 | buffer[i + 2] << 16 | buffer[i + 3] << 24; // NO 'i' increment since the size bytes are reread during the recursion
			object[name] = deserialize(buffer, useUTC, i, true); // pass current index & return an array
			i += size;
			break;
		case 0x05:// BSON type: Binary data
			size = buffer[i++] | buffer[i++] << 8 | buffer[i++] << 16 | buffer[i++] << 24;
			if(buffer[i++] === 0x04)
			{
				if (size !== 16) return undefined; // Element error: Wrong UUID length
				object[name] = new UUID(buffer.subarray(i, i += size));
			}
			else
			{
				// all other subtypes
				object[name] = buffer.slice(i, i += size); // use slice() here to get a new array
			}
			break;
		case 0x06:// BSON type: Undefined (deprecated)
			object[name] = null;
			break;
		case 0x07:// BSON type: ObjectId
			object[name] = new ObjectId(buffer.subarray(i, i += 12));
			break;
		case 0x08:// BSON type: Boolean
			object[name] = buffer[i++] === 1;
			break;
		case 0x09:// BSON type: UTC datetime
			object[name] = useUTC ? new UTC(buffer.subarray(i, i += 8)) : new Date(long2number(buffer.subarray(i, i += 8)));
			break;
		case 0x0A:// BSON type: Null
			object[name] = null;
			break;
		case 0x0B:// BSON type: RegExp
			end = i;
			// pattern
			while (end < buffer.length && buffer[end++] !== 0x00);
			if(end >= buffer.length) return undefined; // Document error: Illegal key name
			var pat = bin2str(buffer.subarray(i, end));
			i = end;
			// flags
			while (end < buffer.length && buffer[end++] !== 0x00);
			if(end >= buffer.length) return undefined; // Document error: Illegal key name
			var flags = bin2str(buffer.subarray(i, end));
			i = end;
			object[name] = new RegExp(pat, flags);
			break;
		case 0x10:// BSON type: 32-bit integer
			object[name] = buffer[i++] | buffer[i++] << 8 | buffer[i++] << 16 | buffer[i++] << 24;
			break;
		case 0x12:// BSON type: 64-bit integer
			object[name] = long2number(buffer.subarray(i, i += 8));
			break;
		default:
			// Parsing error: Unknown element
			return undefined;
		}
	}
	return object;
}
BSON.deserialize = deserialize;

function number2long(value)
{
	var buf = new Uint8Array(8);
	if (Math.floor(value) === value) {
	var TWO_PWR_32 = 4294967296;
	var lo = (value % TWO_PWR_32) | 0, hi = (value / TWO_PWR_32) | 0;
	if(value < 0)
	{
		lo = ~(-value % TWO_PWR_32) | 0, hi = ~(-value / TWO_PWR_32) | 0;
		lo = (lo + 1) & 0xffffffff;
		if(!lo) hi++;
	}
	var i = 0;
	buf[i++] = (lo & 0xff);
	buf[i++] = (lo >>> 8) & 0xff;
	buf[i++] = (lo >>> 16) & 0xff;
	buf[i++] = (lo >>> 24) & 0xff;
	buf[i++] = (hi & 0xff);
	buf[i++] = (hi >>> 8) & 0xff;
	buf[i++] = (hi >>> 16) & 0xff;
	buf[i] = (hi >>> 24) & 0xff;
	}
	else
	{
		var f = new Float64Array([value]);
		var d = new Uint8Array(f.buffer);
		buf.set(d);
	}
	return buf;
}

function long2number(buffer, offset)
{
	if(offset === void 0) offset = 0;
	var TWO_PWR_32 = 4294967296;
	var lo = buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
	var hi = buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset] << 24;
		return hi * TWO_PWR_32 + ((lo >= 0) ? lo : TWO_PWR_32 + lo);
}

function str2bin(str)
{
	str = str.replace(/\r\n/g, "\n");
	var bin = [], p = 0;
	for(var i = 0, len = str.length; i < len; i++) {
		var c = str.charCodeAt(i);
		if (c < 128) bin[p++] = c;
		else if(c < 2048) {
			bin[p++] = (c >>> 6) | 192;
			bin[p++] = (c & 63) | 128;
		}
		else
		{
			bin[p++] = (c >>> 12) | 224;
			bin[p++] = ((c >>> 6) & 63) | 128;
			bin[p++] = (c & 63) | 128;
		}
	}
	return new Uint8Array(bin);
}

function bin2str(bin)
{
	var str = "", len = bin.length, i = 0, c, c2, c3;
	while(i < len)
	{
		c = bin[i];
		if(c < 128)
		{
			str += String.fromCharCode(c);
			i++;
		}
		else if((c > 191) && (c < 224))
		{
			c2 = bin[i + 1];
			str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else
		{
			c2 = bin[i + 1];
			c3 = bin[i + 2];
			str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return str;
}

function strlen(str)
{
	return encodeURI(str).split(/%..|./).length - 1;
}

}()); //namespace BSON
