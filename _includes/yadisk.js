var YandexDisk = {
BuildRequestURI: function(action, params)
{
	var url = "https://cloud-api.yandex.net/v1/disk/" + action + "?";
	var firstIteration = true;
	for(var key in params)
	{
		if(!params.hasOwnProperty(key)) continue;
		if(!firstIteration) url += '&';
		firstIteration = false;
		url += key + "=" + encodeURIComponent(params[key]);
	}
	return url;
},

Request: function(method, action, params, onReady)
{
	var url = YandexDisk.BuildRequestURI(action, params);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == xhr.DONE) onReady(xhr);
	};
	xhr.open(method, url, true);
	xhr.send();
},

RequestJson: function(method, action, params, onSuccess)
{
	YandexDisk.Request(method, action, params, function(xhr) {
		if(xhr.status == 200) onSuccess(JSON.parse(xhr.responseText));
		else if(PrintLineError) PrintLineError("Не удалось выполнить запрос к Яндекс.Диску. Статус: " + xhr.status + ", " + xhr.statusText);
	});
},

GetDownloadLink: function(publicLink, path, onSuccess)
{
	if(path.charAt(0) != '/') path = "/" + path;
	var params = {
		public_key: publicLink,
		fields: "href"
	};
	if(path) params.path = path;
	YandexDisk.RequestJson("GET", "public/resources/download", params,
		function(response) {onSuccess(response.href);});
}

};
