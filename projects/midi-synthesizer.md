---
layout: post
title: MIDI synthesizer
styles: table
---

 A very small MIDI synthesizer. It is procedural, so it doesn't require any data other than MIDI files to play. There are two versions and you can listen to both of them running in your browser.
 The first one is written in C++ and supports many platforms.
 The second one is written in JavaScript specifically for Web.

 Currently, the JavaScript version is newer and has better sound quality. Especially, its guitars and violins are way better. JavaScript version also supports MIDI keyboards.
 However, the C++ version implements reverberation, has better instrument volume balance and has a couple of drums implemented by using physical modelling. Its compiled (Windows or Linux) version can also save the result to a WAV file. It doesn't support MIDI keyboards, because its current architecture is not optimized for real-time input.

 You can find more details about how both synthesizers work on the JavaScript version's [GitHub page](https://github.com/devoln/web-midisynth).

## JavaScript version

- [GitHub](https://github.com/devoln/web-midisynth)

You can listen to some samples [here](https://codepen.io/devoln/pen/jOqXOBR). There you can also see how to embed it on your site or on a forum that supports HTML and iframes.
And [here](../web-midisynth) you can try all the features:
- play with a MIDI keyboard:
  - use Chrome-based browser
  - connect your MIDI device
  - then open/refresh the page
  - then press any key or click anywhere to unmute
- play with the computer keyboard
- play any MIDI file you have
 

## C++ version

- [GitHub](https://github.com/devoln/Intra) - is currently part of Intra but I'm going to move it to its own repository soon. Just build Intra CMake project and you will find MusicSynthesizer binary inside your build directory. Or you can listen to the web version.

### Tested to build and run on:

- Windows
- Linux
- FreeBSD
- [Web via Emscripten](../midisynth/), you can listen to the MIDIs from the table below or open your own MIDI

### Listen to the C++ version online

<div id="eMidiTable">
<table>
<thead><tr><th>Name</th><th width="100px">Size</th></tr></thead>
<tbody class="clickable">
<noscript><tr><td><font color=red>Enable JavaScript to see the table.</font></td></tr></noscript>
</tbody>
</table>
</div>

<script>

var SetMidiTableContent = (function() {
var gMidiTableTemplate = eMidiTable.innerHTML;
return function(content) {
	eMidiTable.innerHTML = gMidiTableTemplate
		.replace("</tbody>", content + "</tbody>")
		.replace("</TBODY>", content + "</TBODY>");
}})();

function BuildMidiFileTable(files)
{
	var strs = [];
	for(var i = 0; i < files.length; i++)
	{
		var f = files[i];
		var dot = f.name.lastIndexOf('.');
		var ext = f.name.substr(dot + 1).toLowerCase();
		var name = f.name.substr(0, f.name.length-ext.length-1);
		if(ext !== "mid" && ext !== "midi") continue;
		var aref = '<a href="../midisynth/?~./' + encodeURIComponent(name) + '">';
		strs.push('<tr><td>', aref, name,
			"</a></td><td>", aref, (f.size/1024).toFixed(1), " KB</a></td></tr>");
	}
	SetMidiTableContent(strs.join(''));
}

setTimeout(function() {
	var url = "https://api.github.com/repos/devoln/devoln.github.io/contents/midi"
	var xhr = new XMLHttpRequest();
	function onerror()
	{
		SetMidiTableContent("<tr><td><font color=red>Midi list loading error: " + xhr.status + ", " + xhr.statusText + ". Try again by reloading the page</font></td></tr>");
	}
	function onload()
	{
		var jsonResponse = JSON.parse(xhr.responseText);
		if(jsonResponse.length) BuildMidiFileTable(jsonResponse);
	}
	if(!('withCredentials' in xhr))
	{
		xhr = new XDomainRequest;
		xhr.onerror = onerror;
		xhr.onload = onload;
	}
	else xhr.onreadystatechange = function()
	{
		if(xhr.readyState != xhr.DONE) return;
		if(xhr.status != 200) onerror();
		else onload();
	};
	xhr.open("GET", url, true);
	xhr.send();
}, 1);

</script>
