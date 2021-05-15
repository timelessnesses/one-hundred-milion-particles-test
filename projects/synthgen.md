---
layout: post
title: Synthgen, a procedural generation platform
---

[Synthgen](../texgen/)

A procedural texture generation platform in the browser. It is similar to ShaderToy, but designed specifically for support to generate textures by using multi-pass algorithms. The version here is used to be able to share the link like ShaderToy does, but the third-party backend service it relied on have been shut down, hence this feature doesn't work anymore.
 I'm developing a newer version with more features that will use my backend, but it is not ready yet.

 To see what the old version is capable to generate, copy then codes below to JavaScript and GLSL tabs respectively and press Generate.

```javascript
var texHeight = Texture.FromShader("height()");
var texFlat = Texture.FromShader("height_flat()");
var texture = Texture.FromShader("f()", [texHeight, texFlat]);
texture.Export("Texture");
texHeight.Export("Height");
texFlat.Export("Flat");
Texture.FromShader("texture(TexA, TexCoord*2.0)", [texture]).Export("Texture tiled");
```

```glsl
vec2 brick_count = vec2(3.0,8.0);
float brick_pad = 1.0/512.0;
float brick_border = 1.0/73.0;
float brick_center_jitter = 1.0/153.0;
float brick_angle_jitter = 1.0/50.0;
float brick_rough1 = 1.0;
float brick_rough2 = 0.25;
float brick_rough_edges = 17.0;
float brick_pores = 5.0/64.0;
vec3 light = normalize(vec3(-2.5,1.5,3.0));

vec3 color1 = vec3(1.0,0.34375,0.125);
vec3 color2 = vec3(0.875,0.5325,0.1875);

vec3 tex_normal(sampler2D tex,vec2 xy,float a,vec2 texSize)
{
    vec2 dxdy = 1.0/texSize;
    float dx = a*(texture(tex,xy+vec2(+dxdy.x,0.0)).r-texture(tex,xy+vec2(-dxdy.x,0.0)).r)/(2.0*dxdy.x);
    float dy = a*(texture(tex,xy+vec2(0.0,+dxdy.y)).r-texture(tex,xy+vec2(0.0,-dxdy.y)).r)/(2.0*dxdy.y);
    float dz = sqrt(1.0+dx*dx+dy*dy);
    dx *= dz;
    dy *= dz;
    return normalize(vec3(dx,dy,dz));
}

vec2 wrap_dist(vec2 a,vec2 b)
{
    vec2 ret = frac(a-b);
    ret -= floor(2.0*ret);
    return ret;
}

vec2 brick_center(vec2 xy,vec2 size)
{
    vec2 uv = xy*size;
    uv.x += 0.5*floor(uv.y) + 0.1875*frand(vec2(3.7,floor(uv.y)));
    uv = mod(uv,size);
    return (floor(uv)+vec2(0.5 - 0.5*floor(uv.y) - 0.1875*frand(vec2(3.7, floor(uv.y))), 0.5))/size;
}

float brick_value(vec2 c,vec2 xy,vec2 size,float pad,float border)
{
    xy += (1.0/535.0)*vec2(cnoise(37.0*c+8.0*xy),cnoise(73.0*c+8.0*xy+25.0));
    vec2 a = saturate((0.5/size-abs(xy)-pad)/border);
    float ret = a.x*a.y;
    ret = ret*ret*(3.0-2.0*ret);
    return ret;
}

float brick_height(vec2 c,vec2 xy,vec2 size,float pad,float border)
{
    float a = brick_value(c,xy,size,pad,border);
    float ret = a;
    ret *= 1.0+brick_rough1*PerlinOctaves(8.0*xy+37.0*c,vec2(8.0),7,0.875,2.0,vec2(2.5,7.2));
    float v = 1.0;
    float a1 = 2.5,a2=brick_rough2;
    for(int k = 0; k < 3; k++)
    {
        v -= a2*0.5*(1.0+sigma(brick_rough_edges*cnoise(a1*xy+37.0*c)));
        a1 *= 2.0;
        a2 *= 0.875;
    }
    ret *= v;
    ret = sigma(5.0*ret);
    ret *= 1.0-0.125*(1.0+sigma(17.0*(sqr(cnoise(2.5+3.5*xy+12.5*c))-0.375)));
    a1 = 17.0, a2 = brick_pores;
    v = 1.0;
    for(int k = 0; k < 5; k++)
    {
        v -= a2*pow(max(1.25*pow(sqr(cnoise(a1*xy+73.0*c+float(k))),2.0)-0.25,0.0),0.25);
        a1 *= 1.875;
        a2 *= 0.875;
    }
    ret*=v;

    return ret;
}

float height()
{
    vec2 xy = TexCoord;

    float ret;
    vec2 center = brick_center(xy,brick_count);

    vec2 cb = wrap_dist(xy,center);
    cb += brick_center_jitter*(f2rand(center)-0.5);
    float cb_s = brick_angle_jitter*(frand(7.3*center)-0.5);
    float cb_c = sqrt(1.0-cb_s*cb_s);
    cb = vec2(cb_c*cb.x-cb_s*cb.y,cb_s*cb.x+cb_c*cb.y);
    ret = brick_height(center,cb,brick_count,brick_pad,brick_border);

    return ret;
}

float height_flat()
{
    vec2 xy = TexCoord;
    vec2 uv = vec2(PerlinOctaves(16.0*xy,vec2(8.0),2),PerlinOctaves(16.0*xy+3.7,vec2(8.0),2));
    float ret = 0.3125+0.5*PerlinOctaves(4.0*xy+2.0*cnoise(4.0*xy,vec2(4.0))*uv,vec2(4.0),7,0.875,2.0,vec2(2.5,3.7));
    float c = (1.0/17.0)*(1.0+cnoise(vec2(-xy.y,+xy.x),vec2(8.0)));
    ret -= c*abs(cnoise(32.0*xy,vec2(32.0)));
    ret -= (c/2.0)*abs(cnoise(64.0*xy,vec2(64.0)));
    ret -= (c/4.0)*abs(cnoise(128.0*xy,vec2(128.0)));
    ret += 0.375*pow(sqr(cnoise(32.0*xy+2.5,vec2(32.0))),1.25);
    ret += 0.125*pow(sqr(cnoise(128.0*xy+3.7,vec2(128.0))),1.25);
    ret += 0.03125*sigma(2.0*cnoise(256.0*xy,vec2(256.0)));
    ret += c/2.0;
    return ret;
}

vec3 f()
{
    vec2 xy = TexCoord;
    vec2 dxdy = 1.0/TexASize;
    
    vec3 ret = vec3(0.0);
    
    vec2 center = brick_center(xy,brick_count);
    
    vec2 cb = wrap_dist(xy,center);
    cb += brick_center_jitter*(f2rand(center)-0.5);
    float cb_s = brick_angle_jitter*(frand(7.3*center)-0.5);
    float cb_c = sqrt(1.0-cb_s*cb_s);
    cb = vec2(cb_c*cb.x-cb_s*cb.y,cb_s*cb.x+cb_c*cb.y);
    float height = texture(TexA,xy).r;
    vec3 normal = tex_normal(TexA,xy,1.0/32.0,TexASize);
    ret = sqrt(height)*vec3(dot(normal,light));
    ret = ret*mix(color1,color2,frand(center));
    
    float ch = texture(TexB,xy).r;
    vec3 normal_flat = tex_normal(TexB,xy,(1.0/50.0)*(1.0+0.75*cnoise(4.0*xy.yx,vec2(4.0))),TexBSize);
    float d = 0.5*(sigma(12.5*(ch-height))+1.0);
    
    ret = mix(ret,vec3(1.0,1.0,0.875)*vec3((1.0-sqrt(height))*sigma(1.25*(ch-0.03125))*(0.125+0.875*dot(normal_flat,light))),d);
    
    return ret;
}
```
