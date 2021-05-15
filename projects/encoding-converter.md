---
layout: post
title: Encoding Converter
---

- [Download application](https://github.com/gammaker/encoding-converter/blob/master/bin/Release/EncodingConverter.exe?raw=true)
- [Github project](https://github.com/gammaker/encoding-converter/)

The application binary requires .NET Framework 3.5.

![Screenshot]({{ site.baseurl }}/images/encoding-converter.png)

## Description
 This is a GUI application to convert all the files in the selected directory with names matching the filter to Unicode. It was developed long before I started to use English in all my projects, so it is in Russian.

## Usage
1. Specify:
  - The directory containing the files you want to convert;
  - Target encoding (UTF-8/16/32 with or without BOM, LE/BE, CP1251);
  - Target line endings:
    - Windows (CRLF - \r\n)
    - Linux (LF - \n)
    - (CR - \r)
    - Don't change (by default)
  - Filter - masks for file names that should be converted. Add the extensions of your files if they are not present by default. Make sure to exclude any binary files to avoid their corruption;
  - Recursive search or not
2. Analysis:
  - Press the button "Анализ" on the left
  - Review what modifications the app is going to do
  - WARNING: make sure, you have made a backup for your files!
3. Conversion:
  - Press the button "Конвертировать" on the right
  - Review the conversion results in the window
 


## Why another encoding converter?

Back then, I was porting my game engine to Linux. The engine contained a lot of Russian strings and comments and most source files were saved by MSVC in CP1251. Some files were ASCII and a few files were UTF8 with BOM. GCC refused to accept CP1251. I didn't want to convert all my sources manually file by file, so started to look for a tool. I couldn't find a free tool that could convert my mixed code base to UTF-8 with BOM, so I decided to write such a tool myself.
