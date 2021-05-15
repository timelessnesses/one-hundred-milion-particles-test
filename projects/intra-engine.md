---
layout: post
title: IntraEngine - 3D game engine
---

- [Download Demo](https://1drv.ms/u/s!Am0pg1pnApO2h26q22JGvTJ-dp7L)

![Demo screenshot]({{ site.baseurl }}/images/intra-engine-screenshot.jpg)
![Demo screenshot]({{ site.baseurl }}/images/intra-engine-screenshot2.jpg)
![Demo screenshot]({{ site.baseurl }}/images/intra-engine-screenshot3.jpg)

**Language:** C++11

**Graphics API:** OpenGL 3.3+ (has an abstraction to add more APIs)

**Supported platforms:** Windows (has a platform abstraction class to add more platforms, also supported Linux before)

## Features:

- Procedural texture generation (different noise types, color spaces, basic operations)
- Dynamic lighting with multiple lights + normal mapping, parallax (no shadows yet)
- Modular shader system (as an alternative to ubershaders)
- Declarative text language to define effects, posteffects, shaders with their parameters, and shader modules.
- GPU particle system based on my own technology (no sorting yet). For for details see [this project](synthgen-particles)
- Posteffects: HDR, sun shafts, FXAA, SSAA, DOF
- Flexibility to create user-defined vertex formats including compression and multiple vertex streams
- Texture compression DXT1, DXT3, DXT5, RGTC_Red, RGTC_RG even for procedural textures by compression
- Audio sources with or without streaming. WAV, OGG Vorbis
- Procedural MIDI synthesizer (the quality isn't great, but works the same on every platform)
- Own containers instead of using STL
- Most resources are copy-on-write, no raw or smart pointers in their interfaces
- 3D model formats: MD5 (without skeletal animation), 3DS, OBJ
- Supported image formats: BMP, TGA, DDS, KTX, PNG, JPG
- Text rendering (binary BMFont and TrueType fonts)

 I abandoned this engine in 2016. After Vulkan had been released, I realized that I want to organize my architecture to reduce CPU overhead and to be able to add Vulkan support. This required large-scale architecture refactoring that could take about a year to do. At that time I was a student and I had to do my research work that was taking a lot of my energy and time. This is why I decided to stop developing the engine and move some parts of it into separate projects:
 - [Intra](intra)
 - [Music Synthesizer](midi-synthesizer)
 - [Synthgen Particles](synthgen-particles)
 - [Synthgen](synthgen)

 Unfortunately, I don't publish its sources because they are difficult to build.
 At that time, I didn't use VCS or build systems. I kept all my source files in my Dropbox folder that was separate from the Visual Studio project, so the project contains absolute paths pointing to the disk structure I had at that time.
 In February 2021, I decided to set aside a day to sort out all this mess, move it to CMake and upload to Github. But when I tried to build the project with MSVC 2019, I bumped into a lot of other issues that caused errors. When I fixed all the compilation errors and ran the engine, it just crashed. The reason was probably a bug in my old ref-counted string class or in its users. Since I don't want to support that old class anyway, I decided, that it wasn't worth to debug and fix. It was not STL compatible, so replacing it required a large-scale refactoring and means continuing the development and doing what caused me to abandon the engine at the first place 5 years ago.
 I hope that someday I will find time to continue its development, do all these things and then publish the sources. However, it is not going to happen soon because I want to fix other broken projects first.
