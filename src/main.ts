import {
  Animation,
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import './style.css';

const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('The canvas was not found');
}

const engine = new Engine(canvas, true);
window.addEventListener('resize', () => engine.resize());

const scene = new Scene(engine);
engine.runRenderLoop(() => scene.render());

const light = new HemisphericLight('ambient', new Vector3(3, 10, 3));
light.intensity = 1;

const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 });
const gMat = new StandardMaterial('g-mat');
gMat.diffuseColor = Color3.Random();
ground.material = gMat;

const woodTexture = new Texture('/wood-texture.webp');

const sphere = MeshBuilder.CreateSphere('famous', {}, scene);
const sphereMaterial = new StandardMaterial('sphere-material');
sphereMaterial.diffuseTexture = woodTexture;
sphere.material = sphereMaterial;
sphere.position.y = 0.5;

const camera = new ArcRotateCamera(
  'camera',
  Math.PI / 4,
  Math.PI / 4,
  4,
  Vector3.Zero(),
  scene
);
camera.attachControl();
camera.keysDown = [];
camera.keysUp = [];

// amount of movement -> sphere circumference perimeter
// amount of rotation -> 2PI

const movementAnimation = new Animation(
  'sphere-movement',
  'position.x',
  20,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT
);

const movementKeys = [
  {
    frame: 0,
    value: sphere.position.x,
  },
  {
    frame: 20,
    value: sphere.position.x + 2 * Math.PI * 0.5,
  },
];

const spinningAnimation = new Animation(
  'sphere-spinning',
  'rotation.z',
  20,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT
);

const spinningKeys = [
  {
    frame: 0,
    value: sphere.rotation.z,
  },
  {
    frame: 20,
    value: sphere.rotation.z - 2 * Math.PI,
  },
];

spinningAnimation.setKeys(spinningKeys);
movementAnimation.setKeys(movementKeys);
sphere.animations.push(movementAnimation, spinningAnimation);

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    scene.beginAnimation(sphere, 0, 20);
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') {
    scene.stopAnimation(sphere);
  }
});
