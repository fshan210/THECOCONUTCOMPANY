import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      const base64 = Buffer.from(buffer).toString("base64");
      this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
      this.onloadend?.();
    });
  }
};

function roughenSphere(geometry, amount = 0.035) {
  const position = geometry.attributes.position;
  const normal = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    normal.fromBufferAttribute(position, index).normalize();
    const noise =
      Math.sin(normal.x * 14.7) * 0.45 +
      Math.cos(normal.y * 18.3) * 0.32 +
      Math.sin((normal.x + normal.z) * 24.1) * 0.23;
    position.setXYZ(
      index,
      position.getX(index) + normal.x * noise * amount,
      position.getY(index) + normal.y * noise * amount,
      position.getZ(index) + normal.z * noise * amount
    );
  }

  geometry.computeVertexNormals();
}

const scene = new THREE.Scene();
const coconut = new THREE.Group();

const shellGeometry = new THREE.SphereGeometry(1, 96, 64);
roughenSphere(shellGeometry, 0.04);
shellGeometry.scale(1, 1.18, 0.92);

const shellMaterial = new THREE.MeshStandardMaterial({
  color: "#5b351f",
  roughness: 0.94,
  metalness: 0.02
});

const shell = new THREE.Mesh(shellGeometry, shellMaterial);
shell.castShadow = true;
shell.receiveShadow = true;
coconut.add(shell);

const highlightGeometry = new THREE.SphereGeometry(0.98, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.34);
highlightGeometry.scale(0.82, 0.35, 0.76);
highlightGeometry.rotateX(Math.PI * 0.08);
highlightGeometry.translate(0.04, 0.62, 0.06);

const fleshMaterial = new THREE.MeshStandardMaterial({
  color: "#f4eadb",
  roughness: 0.82,
  metalness: 0
});

const topFlesh = new THREE.Mesh(highlightGeometry, fleshMaterial);
topFlesh.castShadow = true;
coconut.add(topFlesh);

const fiberMaterial = new THREE.MeshStandardMaterial({
  color: "#8b5f3d",
  roughness: 1,
  metalness: 0
});

for (let index = 0; index < 42; index += 1) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.78 + Math.random() * 1.56, -0.9 + Math.random() * 0.35, 0.82),
    new THREE.Vector3(-0.42 + Math.random() * 0.84, -0.1 + Math.random() * 0.8, 0.93),
    new THREE.Vector3(-0.74 + Math.random() * 1.48, 0.92 - Math.random() * 0.32, 0.78)
  ]);
  const tube = new THREE.TubeGeometry(curve, 24, 0.004 + Math.random() * 0.004, 5, false);
  const fiber = new THREE.Mesh(tube, fiberMaterial);
  fiber.rotation.y = -0.38 + Math.random() * 0.76;
  fiber.rotation.z = -0.18 + Math.random() * 0.36;
  coconut.add(fiber);
}

const eyeMaterial = new THREE.MeshStandardMaterial({ color: "#2a1a12", roughness: 1 });
for (const [x, y] of [
  [-0.18, 0.88],
  [0.1, 0.93],
  [0.26, 0.77]
]) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 14), eyeMaterial);
  eye.position.set(x, y, 0.84);
  eye.scale.set(1, 0.65, 0.4);
  coconut.add(eye);
}

coconut.rotation.x = -0.16;
coconut.rotation.z = 0.08;
scene.add(coconut);

const exporter = new GLTFExporter();
const arrayBuffer = await exporter.parseAsync(scene, { binary: true });
const outputPath = path.join(process.cwd(), "public", "3d", "coconut.glb");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, Buffer.from(arrayBuffer));
console.log(`Wrote ${outputPath}`);
