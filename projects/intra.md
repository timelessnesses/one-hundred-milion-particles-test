---
layout: post
title: Intra, generic programming library
styles: highlights
---

- [GitHub](https://github.com/devoln/Intra/)

## History

This library was initially produced from my [game engine's](intra-engine) codebase. My engine didn't use STL and had its own containers and other things that can be found in STL. When I abandoned my engine I moved to Intra some parts that weren't tied to it much. This includes custom containers, image loading, audio and platform abstraction classes. Since then, I've been developing Intra independently of the engine and turned it into a testing ground for my ideas related to generic programming and a way to learn how to write more expressive code while achieving the best performance.
The major part of Intra that I developed later are D-style ranges. I emulated the concepts via SFINAE to make their creation as easy as in D language - just by defining methods `PopFirst()/First()/Empty()`. No `value_type` or similar auxiliary types are needed and no inheritance is necessary. I tried to use ranges everywhere and found that they could easily replace IO streams by treating a file, socket, etc. as a range of bytes. It makes any range algorithm to work with streams which makes code more generic and consise.
By default, Intra doesn't depend on any libraries. It doesn't use STL, it is fast and produces tiny binaries. However, you can enable libraries to support loading more file formats.

## Features:

- Containers: `Array`, `BList`, `HashMap`, `LinearMap`, `String`, etc. Nothing special, just cleaner syntax and they have some utility methods like `Contains`, `FindAndRemove`, `RemoveUnordered`, etc. Performance is close to STL: in some tests it is faster, in some slower. However, the containers doesn't depend on exceptions and STL, so they can be used even without full C Runtime. This is useful to develop 64k or even 4k intros for demoscene
- Ranges in the style of D Phobos library: `Iota`, `Sequence`, `Recurrence`, `Retro`, etc. Custom ranges are way easier to create than in C++20 ranges (or Range v3). `Intra` ranges replace C++ iterators, most C++20 ranges and IO streams
 See examples [here](https://github.com/devoln/Intra/tree/master/Demos/UnitTests/src/Range)
- Automatic recursive binary and text serialization
 See examples [here](https://github.com/devoln/Intra/tree/master/Demos/Tests/src/PerfTestSerialization.cpp)
- 2D/3D Math: fixed point, vectors 2D-4D, matrices, quaternions, geometry primitives
- Image loading support (BMP, TGA, DDS, KTX, PNG, JPG)
- Audio (WAV, OGG Vorbis, streaming, custom audio data sources)
- Platform-specific: Timer, file/console/socket IO streams, threading

You can see more usage examples in [UnitTests](https://github.com/devoln/Intra/tree/master/Demos/UnitTests)
 
### Supported compilers:
- MSVC 2015+;
- g++ 4.8+;
- Clang 3.3+.
 
### Supported platforms:
- Windows;
- Linux;
- FreeBSD;
- Web (Emscripten).

## Next version

The version described above is the version in the GitHub repository `master` branch. It hasn't been updated since 2018. But I didn't stop the project. All that time I've been experimenting with Intra code and refactoring it to make it more generic. You can see the most current version in `dev-next` branch which uses C++20 and is written for newest compilers. However, it is broken now and fails to build. As soon as it builds and passes all the tests, I'm going to merge it into `master` branch.

I'm going to split the next version of `Intra` into two libraries: `Intra` and `IntraX`.
`Intra` is the core library. It is going to be the most generic and header-only part.
It will include the following features:
- Ranges and streams
- Containers (more generic than before)
- Numeric algorithms and math
- A generic composable log system
- Integer and float <-> string conversions
- String formatting
- SIMD
- Everything is constexpr (even float to string conversions)
- No non-`Intra` `#include`s at all
- Generic reflection and serialization
- Type erasure to turn compile-time templates to runtime
- Smart pointers
- (possibly) Executor-like abstractions for multithreading
- (possibly) Tensor math to generalize vectors and matrices

Many `Intra` parts are inter-connected because they use each other to achieve as much code reuse as possible. This means that it will be a single large module that you will include at once via an aggregating header `Intra.hh`. I expect all this functionality to take about 25000-30000 lines of code which is much less than the size of STL headers it can replace or `Windows.h`.

`IntraX` will take most platform-specific or less generic features:
- Geometry math
- Image loading
- Audio loading
- Audio platform abstraction

After [my engine's](intra-engine) refactoring is finished, I will probably merge it into `IntraX`. It will add the following features:
- Window system abstraction layer (GLFW/SDL-like functionality)
- Graphics API abstraction layer (a wrapper around OpenGL/Vulkan/DirectX 11-12 that hides most differences between them behind a common interface)
- Mesh builder and batcher
- The engine itself
- (possibly) Entity Component System
