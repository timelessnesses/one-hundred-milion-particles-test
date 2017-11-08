function EncodeUTF8(str)
{
	try {return new TextEncoder("utf-8").encode(str);} catch(e) {}
	var utf8 = unescape(encodeURIComponent(str));
	var l = utf8.length;
	var res = new Uint8Array(l);
	while(l--) res[l] = utf8.charCodeAt(l);
	return res;
}

function DecodeUTF8(u8arr)
{
	try {return new TextDecoder("utf-8").decode(bin);} catch(e) {}
	var encodedString = "";
	for(var i = 0, l = u8arr.length; i < l; i++)
		encodedString += String.fromCharCode(u8arr[i]);
    return decodeURIComponent(escape(encodedString));
}

function Utf8StrLen(str)
{
	return encodeURI(str).split(/%..|./).length - 1;
}

var BSON = {};
(function() {

var UUID = function()
{
function UUID(id) {this._id = new Uint8Array(id);}
UUID.prototype.buffer = function() {return this._id;};
return UUID;
}();
BSON.UUID = UUID;
	
var ObjectId = function() {
function ObjectId(id) {this._id = new Uint8Array(id);}
ObjectId.prototype.buffer = function () {return this._id;};
return ObjectId;
}();

function getObjectSize(obj)
{
	var len = 5;
	for(var key in obj) len += getElementSize(key, obj[key]);
	return len;
}

function getElementSize(name, value)
{
	var len = 1;
	if(name) len += strlen(name) + 1;
	if(value === undefined || value === null) return len;
	switch(value.constructor) {
	case String: return len + 4 + strlen(value) + 1;
	case Number: return len + 8 - 4*((value|0) === value);
	case Boolean: return len + 1;
	case Array: case Object: return len + getObjectSize(value);
	case Int8Array: case Uint8Array: return len + 5 + value.byteLength;
	case Date: return len + 8;
	}
	return 0;
}

function serialize(object)
{
	var buffer = new Uint8Array(getObjectSize(object));
	serializeEx(object, buffer);
	return buffer;
}
BSON.serialize = serialize;

function serializeEx(object, buffer, i)
{
	if(!i) i = 0;
	i += int32(buffer.length, buffer, i);
	if (object.constructor === Array) {
		for (var j = 0, len = object.length; j < len; j++)
			i = packElement(j.toString(), object[j], buffer, i);
	}
	else {
		for (var key in object)
			i = packElement(key, object[key], buffer, i);
	}
	buffer[i++] = 0;
	return i;
}

function cstring(name, buffer, offset)
{
	var cstring = EncodeUTF8(name);
	var clen = cstring.length;
	buffer.set(cstring, offset);
	buffer[offset + clen++] = 0;
	return clen;
}

function int32(x, buffer, offset)
{
	buffer[offset++] = x & 255;
	buffer[offset++] = (x >>> 8) & 255;
	buffer[offset++] = (x >>> 16) & 255;
	buffer[offset++] = (x >>> 24) & 255;
	return 4;
}

function packElement(name, value, buffer, i)
{
	var ii = i++;
	i += cstring(name, buffer, i);
	if(value == null)
    {
		buffer[ii] = 10;
		return i;
	}
	switch(value.constructor)
    {
	case String:
		buffer[ii] = 2;
		var size = cstring(value, buffer, i + 4);
		i += int32(size, buffer, i) + size;
		break;
	case Number:
		if(value % 1)
		{
			buffer[ii] = 1;
			buffer.set(new Uint8Array(new Float64Array([value]).buffer), i);
			i += 8;
		}
		else if((value | 0) === value)
		{
			buffer[ii] = 16;
			i += int32(value, buffer, i);
		}
		else
		{
			buffer[ii] = 18;
			buffer.set(number2long(value), i);
			i += 8;
		}
		break;
	case Boolean:
		buffer[ii] = 8;
		buffer[i++] = +value;
		break;
	case Array: case Object:
		buffer[ii] = value.constructor === Array? 4: 3;
		var end = serializeEx(value, buffer, i);
		int32(end - i, buffer, i);
		return end;
	case Int8Array: case Uint8Array:
		buffer[ii] = 5;
		i += int32(value.byteLength, buffer, i);
		buffer[i++] = 0;
		buffer.set(value, i);
		return i += value.byteLength;
	case Date:
		buffer[ii] = 9;
		buffer.set(number2long(value.getTime()), i);
		i += 8;
		break;
	case ObjectId:
		buffer[ii] = 7;
		buffer.set(value.buffer(), i);
		i += 12;
		break;
	case RegExp:
		buffer[ii] = 11;
		i += cstring(value.source, buffer, i);
		if(value.global) buffer[i++] = 115;
		if(value.ignoreCase) buffer[i++] = 105;
		if(value.multiline) buffer[i++] = 109;
		buffer[i++] = 0;
	}
	return i;
}

function rint32(buffer, i) {return buffer[i] | buffer[i + 1] << 8 | buffer[i + 2] << 16 | buffer[i + 3] << 24;}

function deserialize(buffer, i, returnArray)
{
	if(!i) i = 0;
	if(buffer.length < 5) return;
	var size = buffer[i++] | buffer[i++] << 8 | buffer[i++] << 16 | buffer[i++] << 24;
	if(size < 5 || size > buffer.length || buffer[buffer.length - 1]) return;
	var object = returnArray? []: {};
	for(;;)
    {
		var elementType = buffer[i++];
		if(!elementType) break;

		var end = i;
		while(buffer[end] && end < buffer.length) end++;
		if(end >= buffer.length - 1) return;
		var name = DecodeUTF8(buffer.subarray(i, end));
		if(returnArray) name = parseInt(name);
		i = ++end;
		var field = (function()
		{
			switch(elementType)
			{
			case 1: return (new Float64Array(buffer.slice(i, i += 8).buffer))[0];
			case 2:
				size = rint32(buffer, i);
				i += 4;
				return DecodeUTF8(buffer.subarray(i, (i += size) - 1));
			case 3: case 4:
				size = rint32(buffer, i);
				return deserialize(buffer, (i += size) - size, elementType == 4);
			case 5:
				size = rint32(buffer, i);
				i += 4;
				if(buffer[i++]-4) return buffer.slice(i, i += size);
				return size-16? void 0: new UUID(buffer.subarray(i, i += size));
			case 6: return null;
			case 7: case 10: return new ObjectId(buffer.subarray(i, i += 12));
			case 8: return buffer[i++] === 1;
			case 9: return new Date(long2number(buffer.subarray(i, i += 8)));
			case 11:
				end = i;
				
				while(end < buffer.length && buffer[end++]);
				if(end >= buffer.length) return;
				var pat = DecodeUTF8(buffer.subarray(i, end));
				i = end;
				
				while(end < buffer.length && buffer[end++]);
				if(end >= buffer.length) return;
				var flags = DecodeUTF8(buffer.subarray(i, end));
				i = end;
				return new RegExp(pat, flags);
			case 16: return rint32(buffer, (i += 4) - 4);
			case 18: return long2number(buffer.subarray(i, i += 8));
			}
		})();
		if(field === void 0) return;
		object[name] = field;
	}
	return object;
}
BSON.deserialize = deserialize;

function number2long(value)
{
	var buf = new Uint8Array(8);
	if(value % 1)
	{
		buf.set(new Uint8Array(new Float64Array([value]).buffer));
		return buf;
	}

	var TWO_PWR_32 = 4294967296;
	var lo = (value % TWO_PWR_32) | 0, hi = (value / TWO_PWR_32) | 0;
	if(value < 0)
	{
		lo = ~(-value % TWO_PWR_32) | 0, hi = ~(-value / TWO_PWR_32) | 0;
		lo = (lo + 1) | 0;
		if(!lo) hi++;
	}
	int32(hi, buf, int32(lo, buf, 0));
	return buf;
}

function long2number(buffer, offset)
{
	if(!offset) offset = 0;
	var TWO_PWR_32 = 4294967296;
	var lo = rint32(buffer, offset);
	var hi = rint32(buffer, offset+4);
	return hi * TWO_PWR_32 + (lo >= 0? lo: TWO_PWR_32 + lo);
}

}()); //namespace BSON
