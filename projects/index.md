---
layout: post
title: Projects
---

This page includes most of my personal projects. If you are looking for the projects I develop for my job, check out my [LinkedIn](https://www.linkedin.com/in/devoln/) profile.

## [IntraEngine](intra-engine)
 My 3D game engine that I was developing in 2009-2016.

## [Intra](intra)
 A testing ground for my ideas related to generic programming, very unstable. When it gets more stable I will merge most my C++ projects into it. It want it to eventually become something similar to Qt but much more generic and small.

## [Синтезатор MIDI](midi-synthesizer)
 A very small MIDI synthesizer. It is procedural and doesn't use any prerecorded samples or sound fonts to produce sound from MIDI events. There are two versions. The older one is written in C++, supports many platforms but doesn't support MIDI keyboards. The newer one is written in JavaScript for Web and supports MIDI keyboards. You can listen to both of them on this website.

## [Synthgen Particles](synthgen-particles)
 A beautiful GPU particle system based on my own technology. There are 3 versions: a Windows demo (4K intro), a WebGL demo and an Android application. The latter has the most features.

## [Synthgen](synthgen)
 A procedural texture generation platform in the browser. It is similar to ShaderToy, but designed specifically to support multi-pass algorithms to generate textures. The version here is old. The backend service it relies on to share links doesn't work anymore. I'm developing a newer version with even more features and my own backend, but realising it will take some time.

## [Encoding Converter](encoding-converter)
 A simple and small encoding converter to convert entire directories.

## DataVoln (early stage, on paper)
 A language to define data for storage, transformation and transfer. Imagine something like JSON/BSON but with the following additional features:
 1. A type system integrated into the language itself: no separate schemas as in protobuf and no key duplication as in BSON object arrays. You can define a structure first (like `struct` in C language) then refer to it to create many instances of it without repeating the names of its fields. You can create tightly packed arrays in binary representation not only for basic types but for any structure. You can also store types inside your data and even have types of types which is very powerful combined with the other features described below.
 2. Types can use any number of bits for their storage in binary representation. You can easily create a tighly packed array of 3-bit integers. I don't know any existing serialization format that allows this.
 3. Computed fields. Structs can have fields that are always equal to a constant or to an expression of other fields. Such fields don't cost anything per instance in binary representation.
 4. Automatic type conversion based on field names. Different types may have completely different internal representations but with a compatible field structure allowing to automatically convert odata between them. This automatically gives you versioning. You can change field type anytime and as long as there is no data loss, any version of your application will be able to parse both old and new file formats by converting fields automatically on deserialization. You can also add new fields anytime or even rename or delete fields by replacing them with computed fields for compatibility with older versions.
 
 Such a language can make creating custom binary file formats or server exchange protocols extremely easy. It allows to customize the format trade-offs exactly for a specific task instead of choosing one of the existing technologies with a fixed set of trade-offs. Unlike manual serializing and deserializing code, it doesn't require spending much time on debugging or supporting forward and backward compatibility.
 This project is currently on the very early stage, so I have nothing to show at the moment. I am still developing its syntax on paper that still looks like a braindump. I already have a plan of its implementation. But before I start writing actual code, I want to make sure that I tried everything to maximize its simplicity, conciseness and extensibility. My estimation of the time needed to make an MVP implementation of DataVoln is about 6-12 months of full-time work or several times more if I work on it while having a full-time job.
 The project also relies on the most of the features developed in Intra's `dev-next` branch, so I will be able to actually start implementing it only when Intra is ready.
 It is probably difficult to understand all the benefits without an example. Later I will create a project page with DataVoln code examples and better explanation.

## My old games
 Before I started programming in C++ in 2009, I had been developing games with Game Maker game constructor. These are some of the games that I developed within 2006-2009:

- [An Arkanoid-like game](old-games/arkanoid)
- [Ghost Planet](old-games/ghost-planet)
- [A sonic-like platformer](old-games/platformer)
