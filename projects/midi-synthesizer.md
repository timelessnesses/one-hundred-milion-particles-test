---
layout: post
title: Синтезатор MIDI
---

 Маленький по объёму синтезатор MIDI, не требующий для синтеза никаких данных кроме самого MIDI-файла.
 Является частью библиотеки [IntraLib](../intra-lib).
 
- [Репозиторий](https://github.com/gammaker/Intra/)
- [Бинарный файл Windows](https://github.com/gammaker/Intra/tree/master/Build/Release/MusicSynthesizer.exe?raw=true))
- [Онлайн-версия](../midisynth)

Сам [проект](https://github.com/gammaker/Intra/tree/master/MusicSynthesizer) состоит только из управляющего кода, а основной код синтезатора находится в IntraLib/Sound.
Программа консольная, выбор воспроизводимого MIDI-файла производится передачей пути через командную строку (в проводнике Windows - перенести мышью MIDI-файл на бинарник).

В целом синтезатор звучит уже неплохо, но в данный момент присутствуют следующие недоработки:

- Нет поддержки изгиба ноты.
- Midi файлы формата 0 не поддерживаются. Я конвертирую 0 в 1 пересохранением в Anvil Studio. В архивы здесь я кладу только работающие midi формата 1. В интернете оба формата примерно одинаково распространены.
- Нет многих инструментов и вместо них звучат другие. Особенно мало ударников.
- Баланс громкостей различных инструментов ещё не до конца проработан, но со временем улучшается.
- Нет звука на Raspberry Pi
- Щелчки в начале при потоковом воспроизведении в браузере через Web Audio
 

### Поддерживаемые компиляторы:

- MSVC 2013+;
- GCC 4.8+;
- Clang 3.3+.
 

### Поддерживаемые платформы:

- Windows;
- Linux;
- FreeBSD;
- [Web через Emscripten](../../midisynth);
- Планируется Android.


Слушать онлайн:

<span>
<table>
<tr> 
<td>

- [Losing Religion](../../midisynth/?~./Losing%20religion.mid)
- [Pink Panther](../../midisynth/?~./PinkPanther.mid)
- [Merry Christmas](../../midisynth/?~./Merry%20Christmas.mid)
- [Mortal Kombat](../../midisynth/?~./Mortal%20Kombat.mid)
- [Sonic 3](../../midisynth/?~./sonic3.mid)
- [Wavin Flag](../../midisynth/?~./knaan-wavin_flag.mid)
- [Its My Life](../../midisynth/?~./ItsMyLife1.mid)
- [Hallelujah](../../midisynth/?~./Hallelujah1.mid)
- [Hesa Pirate](../../midisynth/?~./HesaPirate.mid)
- [Final Countdown](../../midisynth/?~./FinalCountdown.mid)
- [Da Be Dee](../../midisynth/?~./Eifel 65 - Da Be Dee.mid)
- [Mamma Mia](../../midisynth/?~./ABBA-Mamma_Mia.mid)
- [Happy New Year](../../midisynth/?~./ABBA-Happy_New_Year.mid)

</td>
  
<td>
  
- [Dancing Queen](../../midisynth/?~./ABBA-Dancing_Queen1.mid)
- [Turkish March](../../midisynth/?~./TurkishMarch.mid)
- [X-files](../../midisynth/?~./X-files.mid)
- [Bad Romance](../../midisynth/?~./lady-gaga-BadRomance.mid)
- [Just Dance](../../midisynth/?~./lady_gaga_JustDance.mid)
- [Paparazzi](../../midisynth/?~./lady_gaga-paparazzi.mid)
- [Wrecking Ball](../../midisynth/?~./miley_cyrus-wrecking_ball.mid)
- [Pink Perfect](../../midisynth/?~./pink-perfect.mid)
- [Piano Test](../../midisynth/?~./test_piano.mid)
- [Пусть бегут неуклюже пешеходы по лужам](../../midisynth/?~./Крокодил Гена - Пусть Бегут Неуклюже Пешеходы По Лужам (День Рождения).mid)
- [My Way](../../midisynth/?~./MyWay1.mid)
- [Smackthat](../../midisynth/?~./Smackthat.mid)

</td>

</tr>
</table>
</span>
