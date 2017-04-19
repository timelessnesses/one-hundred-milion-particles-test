---
layout: post
title: Intra - библиотека контейнеров, алгоритмов, аудио и др.
---

- [Репозиторий](https://github.com/gammaker/Intra/)

Данный репозиторий содержит библиотеку Intra и её модули:
- [Intra Core](https://github.com/gammaker/Intra/tree/master/Core)
- [Intra Audio](https://github.com/gammaker/Intra/tree/master/Audio)
- [Intra Image](https://github.com/gammaker/Intra/tree/master/Image)

Библиотека содержит в себе следующий функционал:
- Контейнеры: Array, BList, HashMap, LinearMap, String и другие. Отличительная черта Array от существующих реализаций динамических массивов - быстрое O(1) добавление элементов в начало массива. При этом массив не теряет никаких преимуществ перед другими контейнерами, имея во всех остальных случаях производительность, схожую с std::vector.
- Диапазоны и алгоритмы для работы с ними. Диапазоны реализованы в стиле стандартной библиотеки Phobos языка D.
 Концепция диапазонов заменяет собой итераторы STL и представляют собой более удобную, функциональную и безопасную абстракцию, чем итераторы STL.
 В отличие от итераторов STL, диапазоны поддерживают декорирование и композицию, образуя сложные диапазоны. Это позволяет легко писать код в функциональном стиле и реализовывать ленивые вычисления.
 Примеры применения диапазонов расположены [здесь](https://github.com/gammaker/Intra/tree/master/Demos/Tests/src/Ranges).
- Автоматическая рекурсивная сериализация структур: бинарная и текстовая. Примеры [здесь](https://github.com/gammaker/Intra/tree/master/Demos/Tests/src/PerfTestSerialization.cpp).
- Математика: FixedPoint, векторы, матрицы, кватернионы, геометрические примитивы
- Загрузка множества форматов изображений.
- Звук и синтез различных музыкальных инструментов.
- Другое: таймер, потоки ввода-вывода, основные классы для многопоточности.

Кроме самой библиотеки в репозитории также находятся 3 демо-проекта:
- [MusicSynthesizer](https://github.com/gammaker/Intra/tree/master/Demos/MusicSynthesizer) - синтезатор MIDI. Этот проект состоит только из одного файла с функцией main, а основной код синтезатора находится в IntraLib/Sound.
- [Tests](https://github.com/gammaker/Intra/tree/master/Demos/Tests) - Тесты производительности контейнеров, алгоритмов и сериализации и сравнение с аналогами из STL.
- [UnitTests](https://github.com/gammaker/Intra/tree/master/Demos/UnitTests) - В исходных кодах этого проекта можно увидеть множество примеров использования библиотеки Intra.
- [Bin2C](https://github.com/gammaker/Intra/tree/master/Demos/Bin2C) - Утилита для преобразования файла в массив байт на C.
 

### Поддерживаемые компиляторы:
- MSVC 2015+;
- g++ 4.8+;
- Clang 3.3+.
 

### Поддерживаемые платформы:
- Windows;
- Linux;
- FreeBSD;
- Emscripten;
- Ожидается в ближайшее время Android.


### Установка и компиляция на Debian-based ОС:
```bash
sudo apt-get install libopenal-dev git cmake
git clone https://github.com/gammaker/Intra
cd Intra
cmake -G"Unix Makefiles"
make -j4
```
