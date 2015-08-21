Object.defineProperty(exports, '__esModule', {
	value: true
});

var _coreGeometry = require('../../core/Geometry');

var _mathVector3 = require('../../math/Vector3');

var _mathSphere = require('../../math/Sphere');

var _coreFace3 = require('../../core/Face3');

var _mathVector2 = require('../../math/Vector2');

/**
 * @author mrdoob / http://mrdoob.com/
 */

function THREE$SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
	this.isSphereGeometry = true;

	console.log('THREE.SphereGeometry: Consider using THREE.SphereBufferGeometry for lower memory footprint.');

	_coreGeometry.THREE$Geometry.call(this);

	this.type = 'SphereGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;

	widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
	heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x,
	    y,
	    vertices = [],
	    uvs = [];

	for (y = 0; y <= heightSegments; y++) {

		var verticesRow = [];
		var uvsRow = [];

		for (x = 0; x <= widthSegments; x++) {

			var u = x / widthSegments;
			var v = y / heightSegments;

			var vertex = new _mathVector3.THREE$Vector3();
			vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
			vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
			vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

			this.vertices.push(vertex);

			verticesRow.push(this.vertices.length - 1);
			uvsRow.push(new _mathVector2.THREE$Vector2(u, 1 - v));
		}

		vertices.push(verticesRow);
		uvs.push(uvsRow);
	}

	for (y = 0; y < heightSegments; y++) {

		for (x = 0; x < widthSegments; x++) {

			var v1 = vertices[y][x + 1];
			var v2 = vertices[y][x];
			var v3 = vertices[y + 1][x];
			var v4 = vertices[y + 1][x + 1];

			var n1 = this.vertices[v1].clone().normalize();
			var n2 = this.vertices[v2].clone().normalize();
			var n3 = this.vertices[v3].clone().normalize();
			var n4 = this.vertices[v4].clone().normalize();

			var uv1 = uvs[y][x + 1].clone();
			var uv2 = uvs[y][x].clone();
			var uv3 = uvs[y + 1][x].clone();
			var uv4 = uvs[y + 1][x + 1].clone();

			if (Math.abs(this.vertices[v1].y) === radius) {

				uv1.x = (uv1.x + uv2.x) / 2;
				this.faces.push(new _coreFace3.THREE$Face3(v1, v3, v4, [n1, n3, n4]));
				this.faceVertexUvs[0].push([uv1, uv3, uv4]);
			} else if (Math.abs(this.vertices[v3].y) === radius) {

				uv3.x = (uv3.x + uv4.x) / 2;
				this.faces.push(new _coreFace3.THREE$Face3(v1, v2, v3, [n1, n2, n3]));
				this.faceVertexUvs[0].push([uv1, uv2, uv3]);
			} else {

				this.faces.push(new _coreFace3.THREE$Face3(v1, v2, v4, [n1, n2, n4]));
				this.faceVertexUvs[0].push([uv1, uv2, uv4]);

				this.faces.push(new _coreFace3.THREE$Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
				this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
			}
		}
	}

	this.computeFaceNormals();

	this.boundingSphere = new _mathSphere.THREE$Sphere(new _mathVector3.THREE$Vector3(), radius);
};

THREE$SphereGeometry.prototype = Object.create(_coreGeometry.THREE$Geometry.prototype);
THREE$SphereGeometry.prototype.constructor = THREE$SphereGeometry;

THREE$SphereGeometry.prototype.clone = function () {

	var geometry = new THREE$SphereGeometry(this.parameters.radius, this.parameters.widthSegments, this.parameters.heightSegments, this.parameters.phiStart, this.parameters.phiLength, this.parameters.thetaStart, this.parameters.thetaLength);

	return geometry;
};

exports.THREE$SphereGeometry = THREE$SphereGeometry;