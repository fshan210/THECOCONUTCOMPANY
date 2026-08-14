"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

type DayCelestialSceneProps = {
  progress: MotionValue<number>;
};

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const noise = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * .3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float valueNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0., 0., 0.)), hash(i + vec3(1., 0., 0.)), f.x),
                   mix(hash(i + vec3(0., 1., 0.)), hash(i + vec3(1., 1., 0.)), f.x), f.y),
               mix(mix(hash(i + vec3(0., 0., 1.)), hash(i + vec3(1., 0., 1.)), f.x),
                   mix(hash(i + vec3(0., 1., 1.)), hash(i + vec3(1., 1., 1.)), f.x), f.y), f.z);
  }

  float fbm(vec3 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      total += amplitude * valueNoise(p);
      p = p * 2.07 + vec3(13.1, 7.7, 3.9);
      amplitude *= 0.5;
    }
    return total;
  }
`;

const sunFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;
  uniform vec3 uTint;
  varying vec3 vNormal;
  varying vec3 vPosition;
  ${noise}

  void main() {
    vec3 surface = normalize(vPosition);
    float macro = fbm(surface * 2.3 + vec3(0.0, uTime * .006, 0.0));
    float cellular = fbm(surface * 15.0 + vec3(uTime * .018, 0.0, 0.0));
    float granulation = fbm(surface * 34.0 - vec3(0.0, uTime * .028, 0.0));
    float cells = smoothstep(.34, .74, cellular + (granulation - .5) * .32);
    float luminance = clamp(.46 + macro * .24 + cells * .22 + (granulation - .5) * .30, .18, .88);
    float limb = smoothstep(.06, .92, max(vNormal.z, 0.0));
    luminance *= mix(.67, 1.08, limb);
    vec3 core = mix(vec3(.72, .40, .12), vec3(1.0, .84, .42), luminance);
    vec3 colour = mix(core, vec3(1.0, .95, .75), .08) * uTint;
    gl_FragColor = vec4(colour * (.9 + uIntensity * .28), uOpacity);
  }
`;

const coronaVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uStrength;
  uniform float uFalloff;
  uniform vec3 uTint;
  varying vec2 vUv;
  ${noise}

  void main() {
    vec2 p = vUv - .5;
    float radius = length(p) * 2.0;
    float angle = atan(p.y, p.x);
    float uneven = valueNoise(vec3(angle * 3.8, uTime * .012, radius * 5.0));
    float innerEdge = smoothstep(.42, .64, radius);
    float outerEdge = 1.0 - smoothstep(.76, 1.0, radius);
    float feather = exp(-max(radius - .52, 0.0) * uFalloff) * innerEdge * outerEdge;
    float rays = .84 + uneven * .24 + sin(angle * 10.0 + uTime * .004) * .045;
    vec3 heat = mix(uTint, vec3(1.0, .98, .86), clamp(1.0 - radius, 0.0, 1.0));
    gl_FragColor = vec4(heat * 3.4, feather * rays * uOpacity * uStrength);
  }
`;

const moonFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  ${noise}

  void main() {
    vec3 surface = normalize(vPosition);
    float relief = fbm(surface * 11.0);
    float fine = fbm(surface * 31.0);
    float terminator = smoothstep(-.32, .62, dot(normalize(vNormal), normalize(vec3(-.38, .46, .82))));
    float limb = smoothstep(.04, .9, max(vNormal.z, 0.0));
    float craters = smoothstep(.54, .82, relief) * .16 + (fine - .5) * .1;
    vec3 moon = vec3(.72, .69, .62) + relief * .18 - craters;
    moon *= mix(.32, 1.0, terminator) * mix(.72, 1.0, limb);
    gl_FragColor = vec4(moon, uOpacity);
  }
`;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const point = clamp((value - edge0) / (edge1 - edge0));
  return point * point * (3 - 2 * point);
}

export function DayCelestialScene({ progress }: DayCelestialSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactScene = window.matchMedia("(max-width: 899px)").matches;
    let localProgress = progress.get();
    let isVisible = false;
    let isDocumentVisible = !document.hidden;
    let animationFrame: number | null = null;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.z = 10;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compactScene, powerPreference: "high-performance" });
    } catch {
      mount.dataset.celestialFallback = "true";
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactScene ? 1.2 : 1.65));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);


    const sunGroup = new THREE.Group();
    const sunGeometry = new THREE.SphereGeometry(1, compactScene ? 56 : 112, compactScene ? 40 : 80);
    const sunMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: sunFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 1 },
        uTint: { value: new THREE.Color(1, .98, .82) }
      }
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    const createCorona = (size: number, strength: number, falloff: number, renderOrder: number) => {
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.ShaderMaterial({
        vertexShader: coronaVertexShader,
        fragmentShader: coronaFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 }, uOpacity: { value: 0 }, uStrength: { value: strength },
          uFalloff: { value: falloff }, uTint: { value: new THREE.Color(1, .86, .56) }
        }
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -.14;
      mesh.renderOrder = renderOrder;
      sunGroup.add(mesh);
      return { geometry, material, mesh };
    };
    const tightCorona = createCorona(compactScene ? 3.15 : 3.5, 1.45, 5.8, 0);
    const mediumCorona = createCorona(compactScene ? 5.4 : 6.1, .88, 3.25, 1);
    const broadCorona = createCorona(compactScene ? 10.6 : 12.6, .44, 2.15, 2);
    sun.renderOrder = 3;
    scene.add(sunGroup);

    const moonGeometry = new THREE.SphereGeometry(.32, compactScene ? 36 : 64, compactScene ? 26 : 48);
    const moonMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: moonFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: { uOpacity: { value: 0 } }
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    const warmTint = new THREE.Color(1, .98, .82);
    const duskTint = new THREE.Color(.96, .79, .55);
    const noonCoronaTint = new THREE.Color(1, .92, .68);
    const duskCoronaTint = new THREE.Color(1, .69, .34);
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const render = (time: number) => {
      if (disposed) return;
      const p = clamp(localProgress);
      const sunProgress = clamp(p / .84);
      const theta = Math.PI * sunProgress;
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;
      const sunX = -Math.cos(theta) * visibleWidth * .56;
      const sunY = -visibleHeight * .40 + Math.sin(theta) * visibleHeight * .80;
      const sunrise = smoothstep(.012, .095, p);
      const sunset = 1 - smoothstep(.79, .88, p);
      const sunOpacity = sunrise * sunset;
      const eveningMix = smoothstep(.54, .78, p);
      const moonOpacity = smoothstep(.80, .91, p) * (1 - smoothstep(.82, .94, p));

      sunGroup.position.set(sunX, sunY, 0);
      sunGroup.scale.setScalar(compactScene ? .46 : .68);
      sunGroup.rotation.y = time * .000028;
      sunMaterial.uniforms.uTime.value = reducedMotion ? 0 : time * .001;
      sunMaterial.uniforms.uOpacity.value = sunOpacity;
      sunMaterial.uniforms.uIntensity.value = 1.1 - eveningMix * .12;
      sunMaterial.uniforms.uTint.value.lerpColors(warmTint, duskTint, eveningMix);
      const solarTint = new THREE.Color().lerpColors(noonCoronaTint, duskCoronaTint, eveningMix);
      [tightCorona, mediumCorona, broadCorona].forEach(({ material, mesh }, index) => {
        material.uniforms.uTime.value = reducedMotion ? 0 : time * .001;
        material.uniforms.uOpacity.value = sunOpacity;
        material.uniforms.uTint.value.copy(solarTint);
        mesh.scale.setScalar(1 + Math.sin(time * (.00048 - index * .00007)) * (reducedMotion ? 0 : .018));
      });

      moon.position.set(visibleWidth * .13, visibleHeight * .34 - moonOpacity * .08, -.02);
      moon.rotation.y = time * .000018;
      moonMaterial.uniforms.uOpacity.value = moonOpacity;

      mount.dataset.dayProgress = p.toFixed(3);
      mount.dataset.sunX = sunX.toFixed(2);
      mount.dataset.sunY = sunY.toFixed(2);
      mount.dataset.sunVisibility = sunOpacity.toFixed(3);
      mount.dataset.solarIntensity = sunMaterial.uniforms.uIntensity.value.toFixed(3);
      mount.dataset.moonOpacity = moonOpacity.toFixed(3);
      renderer.render(scene, camera);
    };

    const frame = (time: number) => {
      animationFrame = null;
      if (!isVisible || !isDocumentVisible || reducedMotion) return;
      render(time);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (reducedMotion || !isVisible || !isDocumentVisible || animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(frame);
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        render(performance.now());
        schedule();
      } else if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }, { rootMargin: "160px 0px" });
    intersectionObserver.observe(mount);

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) schedule();
      else if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const unsubscribe = progress.on("change", (value) => {
      localProgress = value;
      if (isVisible) {
        render(performance.now());
        schedule();
      }
    });

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      unsubscribe();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      sunGeometry.dispose();
      tightCorona.geometry.dispose();
      mediumCorona.geometry.dispose();
      broadCorona.geometry.dispose();
      moonGeometry.dispose();
      sunMaterial.dispose();
      tightCorona.material.dispose();
      mediumCorona.material.dispose();
      broadCorona.material.dispose();
      moonMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  return <div ref={mountRef} className="co-day-celestial" aria-hidden="true" data-day-celestial />;
}
