---
layout: post
title: Synthgen Particles - stateless GPU particle system
redirect_from:
  - /projects/flying-particles
---

- Windows Demo: [Review by The Cherno](https://youtu.be/kdJhCv7lCD4?t=55) [GitHub](https://github.com/devoln/synthgen-particles-win/) [4K Intro](https://github.com/devoln/synthgen-particles-win/blob/master/bin/SynthgenParticles-4kintro.exe?raw=true)
- [Web-version](../particles/) - almost the same as the Windows version, no music

Android-version is the most advanced version (better optimization, camera control, live wallpaper, no music).
<a href='https://play.google.com/store/apps/details?id=com.gammaker.synthgenparticles'><img alt='Google Play' src='https://play.google.com/intl/en_gb/badges/images/generic/en_badge_web_generic.png'/></a>

![Screenshot 1]({{ site.baseurl }}/images/synthgen-particles.jpg)
![Screenshot 2](https://raw.githubusercontent.com/devoln/synthgen-particles-win/master/Screenshot.jpg)


## Synthgen Particles

 This is a demo of my own GPU particle system technique.
 The Windows version is written in C++ and OpenGL 3.0 (can easily be ported to 2.0).
 The Web version is written in HTML/JS with WebGL.
 The Android version is written in Java and unextended (!) OpenGL ES 2.0.

## Controls (Windows and WebGL versions)

- Keys **1-9**: number of particles
- **Shift & Ctrl**: time speed
- **Left & Right** arrows: change the time direction
- **Up & Down** arrows: when pressed speeds up (x5) the animation in forward or backward direction respectively
- **P** - pause or resume
- **I** - restart the particle system
- **Esc** - exit

## How it works

Unlike most existing methods, my technique doesn't do any step by step simulation. Instead, particle trajectory, size, color and other parameters are defined as functions of time. The absolute time is also used to figure out which particles are alive and when they were born. So this implementation allows for time travel or controlling its speed by changing the absolute time variable accordingly. Most of the work is done in a vertex shader on the fly.

## How is it different

All the GPU particle rendering techniques I know use at least one of the following OpenGL features or their equivalents in other graphics APIs:

1. Vertex Texture Fetch
2. Pixel Buffer Object
3. Transform Feedback
4. Compute Shaders
5. Rendering to floating point textures
6. High precision in fragment shaders

Most OpenGL ES 2.0 mobile devices use Mali 4xx GPU which doesn't support any of them. This usually means that they can't be used to simulate particles. Without my technique, the only way to simulate particles on these devices is to compute them on CPU. This limits the number of particles you can have and increases power consumption. My way to render particles is the only GPU particle technique I know that doesn't require any of these features and works on the GPU.

As any other technique, my method has its downsides. There are many things that cannot be done, including n-body simulation and other things available only with step-by-step simulation. But even for these things it can be combined with other techniques to reduce GPU memory bandwidth.
