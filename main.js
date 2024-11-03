"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./style.css");

import * as THREE from 'three'

import { getProject, types } from '@theatre/core'
import projectState from './state.json'


var scene = new THREE.Scene();
var project = (0, core_1.getProject)('THREE.js x Theatre.js', { state: state_json_1.default });
var sheet = project.sheet('Animated scene');
var geometry = new THREE.TorusKnotGeometry(10, 3, 300, 16);
var material = new THREE.MeshStandardMaterial({ color: '#f00' });
material.color = new THREE.Color('#049ef4');
material.roughness = 0.5;
var mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);
var torusKnotObj = sheet.object('Torus Knot', {
    // Note that the rotation is in radians
    // (full rotation: 2 * Math.PI)
    rotation: core_1.types.compound({
        x: core_1.types.number(mesh.rotation.x, { range: [-2, 2] }),
        y: core_1.types.number(mesh.rotation.y, { range: [-2, 2] }),
        z: core_1.types.number(mesh.rotation.z, { range: [-2, 2] }),
    }),
});
torusKnotObj.onValuesChange(function (values) {
    var _a = values.rotation, x = _a.x, y = _a.y, z = _a.z;
    mesh.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI);
});
project.ready.then(function () { return sheet.sequence.play({ iterationCount: Infinity }); });
/**
 * Camera
 */
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 200);
camera.position.z = 50;
/**
 * Scene
 */
/*
 * TorusKnot
 */
/*
 * Lights
 */
// Ambient Light
var ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);
// Point light
var directionalLight = new THREE.DirectionalLight('#ff0000', 30 /* , 0, 1 */);
directionalLight.position.y = 20;
directionalLight.position.z = 20;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.left = -20;
scene.add(directionalLight);
// RectAreaLight
var rectAreaLight = new THREE.RectAreaLight('#ff0', 1, 50, 50);
rectAreaLight.position.z = 10;
rectAreaLight.position.y = -40;
rectAreaLight.position.x = -20;
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(rectAreaLight);
/**
 * Renderer
 */
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
/**
 * Update the screen
 */
function tick() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();
/**
 * Handle `resize` events
 */
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}, false);
