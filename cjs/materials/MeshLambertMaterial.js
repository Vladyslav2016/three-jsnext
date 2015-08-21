Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Material = require('./Material');

var _Three = require('../Three');

var _mathColor = require('../math/Color');

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  emissive: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

function THREE$MeshLambertMaterial(parameters) {
	this.isMeshLambertMaterial = true;

	_Material.THREE$Material.call(this);

	this.type = 'MeshLambertMaterial';

	this.color = new _mathColor.THREE$Color(0xffffff); // diffuse
	this.emissive = new _mathColor.THREE$Color(0x000000);

	this.map = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = _Three.THREE$MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = _Three.THREE$SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = _Three.THREE$NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues(parameters);
};

THREE$MeshLambertMaterial.prototype = Object.create(_Material.THREE$Material.prototype);
THREE$MeshLambertMaterial.prototype.constructor = THREE$MeshLambertMaterial;

THREE$MeshLambertMaterial.prototype.copy = function (source) {

	_Material.THREE$Material.prototype.copy.call(this, source);

	this.color.copy(source.color);
	this.emissive.copy(source.emissive);

	this.map = source.map;

	this.specularMap = source.specularMap;

	this.alphaMap = source.alphaMap;

	this.envMap = source.envMap;
	this.combine = source.combine;
	this.reflectivity = source.reflectivity;
	this.refractionRatio = source.refractionRatio;

	this.fog = source.fog;

	this.shading = source.shading;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;
	this.wireframeLinecap = source.wireframeLinecap;
	this.wireframeLinejoin = source.wireframeLinejoin;

	this.vertexColors = source.vertexColors;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	return this;
};

exports.THREE$MeshLambertMaterial = THREE$MeshLambertMaterial;