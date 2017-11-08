---
layout: post
title: Синтезатор MIDI
styles: table
---

 Маленький по объёму синтезатор MIDI, не требующий для синтеза никаких данных кроме самого MIDI-файла.
 Является частью репозитория библиотеки [Intra](intra-lib).
 
- [Репозиторий](https://github.com/gammaker/Intra/)
- [Онлайн-версия](/midisynth/)

Сам [проект](https://github.com/gammaker/Intra/tree/master/Demos/MusicSynthesizer) состоит только из кода интерфейса и настройки инструментов, а основной код синтезатора находится в Intra/Audio.
Программа под Windows\Linux\FreeBSD консольная, выбор воспроизводимого MIDI-файла производится передачей пути через командную строку (в проводнике Windows - перенести мышью MIDI-файл на бинарник). Если передать два параметра через командную строку, то результат синтеза будет записан в WAV файл по пути, указанному во втором параметре.

В целом синтезатор звучит уже неплохо, но в данный момент присутствуют следующие недоработки:

- Нет некоторых инструментов и вместо них звучат другие. Особенно мало ударников.
- Баланс громкостей различных инструментов ещё не до конца проработан, но со временем улучшается.
- Нет звука на Raspberry Pi.

### Поддерживаемые платформы:

- Windows;
- Linux;
- FreeBSD;
- [Web через Emscripten](/midisynth/);

## Слушать онлайн
<table>
<thead><tr><th>Название</th><th width="100px">Размер</th><th>Добавлен</th></tr></thead>
<tbody class="clickable" id="eMidiTable">
<tr><td>Загрузка списка... <noscript><font color=red>Включите JavaScript в браузере!</font></noscript></td></tr>
</tbody>
</table>

<script>

function BuildMidiFileTable(files)
{
	var strs = [];
	for(var i = 0; i < files.length; i++)
	{
		var f = files[i];
		var dot = f.name.lastIndexOf('.');
		var ext = f.name.substr(dot + 1).toLowerCase();
		if(ext !== "mid" && ext !== "midi") continue;
		var d = new Date(f.created);
		var aref = '<a href="../midisynth/?~./' + encodeURIComponent(f.name) + '">';
		strs.push('<tr><td>', aref, f.name.substr(0, f.name.length-ext.length-1),
			"</a></td><td>", aref, (f.size/1024).toFixed(1), " КБ</a></td><td>",
			aref, ('0' + d.getDate()).slice(-2), '.', ('0' + (d.getMonth() + 1)).slice(-2), '.', d.getFullYear(), "</a></td></tr>");
	}
	eMidiTable.innerHTML = strs.join('');
}

setTimeout(function() {
	var url = "https://cloud-api.yandex.net:443/v1/disk/public/resources?public_key=https%3A%2F%2Fyadi.sk%2Fd%2F-chbqBzK3NLGpU&fields=_embedded.items.name,_embedded.items.size,_embedded.items.created&limit=100";
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != xhr.DONE) return;
		if(xhr.status != 200)
		{
			eMidiTable.innerHTML = "<tr><td><font color=red>Ошибка загрузки списка!</font></td></tr>";
			return;
		}
		var jsonResponse = JSON.parse(xhr.responseText);
		if(jsonResponse._embedded !== undefined && jsonResponse._embedded.items !== undefined)
			BuildMidiFileTable(jsonResponse._embedded.items);
	};
	xhr.open("GET", url, true);
	xhr.send();
}, 1);

</script>

