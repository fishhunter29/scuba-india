'use client';

import { useEffect, useRef } from 'react';
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  Vector2,
  Clock,
} from 'three';

/**
 * Sumi-e ink-in-water background.
 * The GLSL fragment shader and the Three.js init below are copied VERBATIM from
 * scubaindia-sumie-full.html (SPEC §4, §12) — do not rewrite. Only the wrapping
 * (React effect + cleanup, importing the three r128 classes used) is new.
 */
export default function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch {
      // No WebGL support (old GPU/driver, hardware acceleration disabled, some
      // locked-down mobile webviews) — fall back to a static background instead
      // of leaving an uncaught exception to take down the whole page.
      canvas.style.background = 'var(--paper)';
      return;
    }
    // A WebGL context can exist with no real GPU behind it — headless/CI
    // browsers (and some sandboxed environments) report a software rasterizer
    // (SwiftShader/llvmpipe) instead of failing outright. Running this shader's
    // 3 layered fbm() calls per pixel, every animation frame, on a CPU
    // rasterizer blocks the main thread for seconds per frame. No real device
    // with hardware-accelerated WebGL hits this branch, so it's the same
    // defensive fallback as the no-WebGL case above, just for a context that
    // technically exists but can't actually render this affordably.
    const dbg = renderer.getContext().getExtension('WEBGL_debug_renderer_info');
    const rendererName = dbg
      ? String(renderer.getContext().getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : '';
    if (/swiftshader|llvmpipe|software/i.test(rendererName)) {
      canvas.style.background = 'var(--paper)';
      renderer.dispose();
      return;
    }
    // Resolution is capped (not tied 1:1 to devicePixelRatio) in resize()
    // below — this is a soft, blurred noise field, not detail that benefits
    // from retina sharpness, and full-res shading is the single biggest cost
    // of this effect on mid-range mobile GPUs since it re-runs every frame.
    renderer.setPixelRatio(1);
    const scene = new Scene();
    const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new Vector2() },
      u_mouse: { value: new Vector2(0.5, 0.5) },
      u_mvel: { value: 0 },
    };

    const frag = `
    precision highp float;
    uniform float u_time; uniform vec2 u_res; uniform vec2 u_mouse; uniform float u_mvel;
    vec3 water=vec3(0.863,0.937,0.937);
    vec3 waterDeep=vec3(0.624,0.824,0.824);
    vec3 inkNavy=vec3(0.071,0.227,0.278);
    vec3 teal=vec3(0.118,0.435,0.482);
    vec3 verm=vec3(0.878,0.322,0.227);
    vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453);}
    float noise(vec2 p){const float K1=0.366025404,K2=0.211324865;vec2 i=floor(p+(p.x+p.y)*K1);vec2 a=p-i+(i.x+i.y)*K2;float m=step(a.y,a.x);vec2 o=vec2(m,1.0-m);vec2 b=a-o+K2;vec2 c=a-1.0+2.0*K2;vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);vec3 n=h*h*h*h*vec3(dot(a,hash(i)),dot(b,hash(i+o)),dot(c,hash(i+1.0)));return dot(n,vec3(70.0));}
    float fbm(vec2 p){float v=0.0,a=0.55;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.02+vec2(1.7,9.2);a*=0.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 p=uv; p.x*=u_res.x/u_res.y;
      float t=u_time*0.04;
      // ink dispersing in water: layered domain-warped fbm, slow bloom
      vec2 w1=vec2(fbm(p*1.2+vec2(0.0,t)),fbm(p*1.2+vec2(3.3,-t)));
      vec2 w2=vec2(fbm(p*2.1+1.4*w1+vec2(t*0.6,1.0)),fbm(p*2.1+1.4*w1+vec2(-t*0.5,4.0)));
      float ink=fbm(p*1.6+2.2*w2);
      // brush-stroke wave bands sweeping slowly
      float band=fbm(vec2(p.x*0.7+t*0.5,p.y*2.2));
      ink+=band*0.25;
      // mouse disturbs the ink (disperses it)
      vec2 m=u_mouse; m.x*=u_res.x/u_res.y;
      float d=distance(p,m);
      ink+=sin(d*10.0-u_time*1.5)*exp(-d*4.5)*(0.16+u_mvel*0.8);
      // density -> warm-blue water washed with teal-navy ink (softer than black for readability)
      float density=smoothstep(0.12,0.95,ink);
      vec3 col=mix(water, inkNavy, density*0.62);          // 0.62 keeps it lighter = more readable
      col=mix(col, teal, smoothstep(0.3,0.75,ink)*0.5);    // teal mid-tones = water feel
      col=mix(col, waterDeep, smoothstep(0.0,0.4,1.0-ink)*0.3); // lighten the clear areas
      // dry-brush light water breaking through
      float dry=fbm(p*9.0);
      col=mix(col, water, smoothstep(0.55,0.82,dry)*density*0.28);
      // single warm coral seal bleed, drifting (accent)
      vec2 sc=vec2(0.82+0.02*sin(t),0.2+0.02*cos(t*0.8)); sc.x*=u_res.x/u_res.y;
      float seal=exp(-distance(p,sc)*9.0);
      col=mix(col, verm, seal*0.4*smoothstep(0.3,0.6,ink+0.2));
      // gentle top light for an airy, warm feel
      col+=0.04*(1.0-uv.y)*vec3(1.0,0.98,0.92);
      gl_FragColor=vec4(clamp(col,0.,1.),1.0);
    }`;
    const mat = new ShaderMaterial({
      uniforms,
      vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader: frag,
    });
    scene.add(new Mesh(new PlaneGeometry(2, 2), mat));
    function resize() {
      const w = innerWidth,
        h = innerHeight;
      // Cap the WebGL framebuffer's longest edge regardless of viewport size
      // or device pixel ratio — pixel count (not octave count) is what makes
      // this shader expensive, and it re-renders every animation frame.
      const dpr = Math.min(window.devicePixelRatio, 2);
      const scale = Math.min(1, 900 / (Math.max(w, h) * dpr));
      const bw = Math.round(w * dpr * scale);
      const bh = Math.round(h * dpr * scale);
      renderer.setSize(bw, bh, false); // false: canvas CSS box stays controlled by #ink{inset:0}
      uniforms.u_res.value.set(bw, bh);
    }
    addEventListener('resize', resize);
    resize();
    let tx = 0.5,
      ty = 0.5,
      lx = 0.5,
      ly = 0.5;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / innerWidth;
      ty = 1 - e.clientY / innerHeight;
    };
    addEventListener('pointermove', onMove);
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const clock = new Clock();
    let raf = 0;

    function loop() {
      const dt = clock.getDelta();
      uniforms.u_time.value += dt;
      const mx = uniforms.u_mouse.value;
      mx.x += (tx - mx.x) * 0.06;
      mx.y += (ty - mx.y) * 0.06;
      const vel = Math.hypot(mx.x - lx, mx.y - ly);
      lx = mx.x;
      ly = mx.y;
      uniforms.u_mvel.value += (Math.min(vel * 30, 1) - uniforms.u_mvel.value) * 0.08;
      renderer.render(scene, cam);
      // Pause the loop while the tab is backgrounded instead of burning
      // GPU/battery on an invisible canvas; onVisibility resumes it.
      raf = document.hidden ? 0 : requestAnimationFrame(loop);
    }
    function onVisibility() {
      if (!document.hidden && !raf) {
        clock.getDelta(); // discard time elapsed while hidden
        raf = requestAnimationFrame(loop);
      }
    }

    if (reduce) {
      renderer.render(scene, cam); // single static frame — no animation loop
    } else {
      addEventListener('visibilitychange', onVisibility);
      raf = requestAnimationFrame(loop);
    }

    // React cleanup (new — prevents leaks on unmount/HMR)
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('visibilitychange', onVisibility);
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="ink" ref={canvasRef} />;
}
