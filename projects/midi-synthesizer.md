---
layout: post
title: Синтезатор MIDI
---

 Маленький по объёму синтезатор MIDI, не требующий для синтеза никаких данных кроме самого MIDI-файла.
 Является частью репозитория библиотеки [Intra](../intra-lib).
 
- [Репозиторий](https://github.com/gammaker/Intra/)
- [Онлайн-версия](/midisynth/)

Сам [проект](https://github.com/gammaker/Intra/tree/master/MusicSynthesizer) состоит только из кода интерфейса и настройки инструментов, а основной код синтезатора находится в Intra/Audio.
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


### Слушать онлайн:

- [Losing Religion](/midisynth/?~./Losing%20religion.mid)
- [Pink Panther](/midisynth/?~./PinkPanther.mid)
- [Merry Christmas](/midisynth/?~./Merry%20Christmas.mid)
- [Mortal Kombat](/midisynth/?~./Mortal%20Kombat.mid)
- [Sonic 3](/midisynth/?~./sonic3.mid)
- [Wavin Flag](/midisynth/?~./knaan-wavin_flag.mid)
- [Its My Life](/midisynth/?~./ItsMyLife1.mid)
- [Hallelujah](/midisynth/?~./Hallelujah1.mid)
- [Hesa Pirate](/midisynth/?~./HesaPirate.mid)
- [Final Countdown](/midisynth/?~./FinalCountdown.mid)
- [Da Be Dee](/midisynth/?~./Eifel 65 - Da Be Dee.mid)
- [Mamma Mia](/midisynth/?~./ABBA-Mamma_Mia.mid)
- [Happy New Year](/midisynth/?~./ABBA-Happy_New_Year.mid)
- [Dancing Queen](/midisynth/?~./ABBA-Dancing_Queen1.mid)
- [Turkish March](/midisynth/?~./TurkishMarch.mid)
- [X-files](/midisynth/?~./X-files.mid)
- [Bad Romance](/midisynth/?~./lady-gaga-BadRomance.mid)
- [Just Dance](/midisynth/?~./lady_gaga_JustDance.mid)
- [Paparazzi](/midisynth/?~./lady_gaga-paparazzi.mid)
- [Wrecking Ball](/midisynth/?~./miley_cyrus-wrecking_ball.mid)
- [Pink Perfect](/midisynth/?~./pink-perfect.mid)
- [Piano Test](/midisynth/?~./test_piano.mid)
- [Пусть бегут неуклюже пешеходы по лужам](/midisynth/?~./Крокодил Гена - Пусть Бегут Неуклюже Пешеходы По Лужам (День Рождения).mid)
- [My Way](/midisynth/?~./MyWay1.mid)
- [Smackthat](/midisynth/?~./Smackthat.mid)
- [Harry Potter](/midisynth/?~./HarryPotter.mid)
- [Green Sleeves](/midisynth/?~./Greensleeves.mid)
- [Santa Lucia](/midisynth/?~./SantaLucia.mid)
- [Skater Waltz](/midisynth/?~./skaterswaltz.mid)
- [ThemeB](/midisynth/?~./ThemeB.mid)
- [Resident Evil](/midisynth/?~./Resident_Evil_Main_Theme-guitar.mid)
- [Cheri Lady](/midisynth/?~./cherilady.mid)
- [Sia - Chandelier](/midisynth/?~./sia-chandelier.mid)
- [Gangnam Style](/midisynth/?~./GangnamStyle.mid)
- [Как упоительны России вечера](/midisynth/?~./Godfather.mid)
- [Потому что нельзя](/midisynth/?~./potomu_chto_nelzya.mid)
- [Smokie - Living Next Door to Alice](/midisynth/?~./Smokie_-_Living_Next_Door_to_Alice.mid)
- [RE3 - The beginning of the nightmare](/midisynth/?~./the-beginning-of-the-nightmare.mid)
- [Чайковский - Щелкунчик](/midisynth/?~./Чайковский - Щелкунчик.mid)
- [Battle Game](/midisynth/?~./battle-game.mid)
- [Morrowind Theme](/midisynth/?~./Morrowind Theme.mid)
- [Прекрасное далёко](/midisynth/?~./Guest11.mid)
- [My heart will go on](/midisynth/?~./celine_dion-my_heart_will_go_on.mid)
