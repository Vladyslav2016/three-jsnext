'use strict';

exports.THREE$VertexTangentsHelper = THREE$VertexTangentsHelper;

var BufferGeometry = require('../../core/BufferGeometry');
var Geometry = require('../../core/Geometry');
var Vector3 = require('../../math/Vector3');
var LineSegments = require('../../objects/LineSegments');
var LineBasicMaterial = require('../../materials/LineBasicMaterial');
var BufferAttribute = require('../../core/BufferAttribute');

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

function THREE$VertexTangentsHelper ( object, size, hex, linewidth ) {
	this.isVertexTangentsHelper = true;

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0x0000ff;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	//

	var nTangents = 0;

	var objGeometry = this.object.geometry;

	if ( (objGeometry && objGeometry.isGeometry) ) {

		nTangents = objGeometry.faces.length * 3;

	} else if ( (objGeometry && objGeometry.isBufferGeometry) ) {

		nTangents = objGeometry.attributes.tangent.count

	}

	//

	var geometry = new BufferGeometry.THREE$BufferGeometry();

	var positions = new BufferAttribute.THREE$Float32Attribute( nTangents * 2 * 3, 3 );

	geometry.addAttribute( 'position', positions );

	LineSegments.THREE$LineSegments.call( this, geometry, new LineBasicMaterial.THREE$LineBasicMaterial( { color: color, linewidth: width } ) );

	//

	this.matrixAutoUpdate = false;

	this.update();

};

THREE$VertexTangentsHelper.prototype = Object.create( LineSegments.THREE$LineSegments.prototype );
THREE$VertexTangentsHelper.prototype.constructor = THREE$VertexTangentsHelper;

THREE$VertexTangentsHelper.prototype.update = ( function ( object ) {

	var v1 = new Vector3.THREE$Vector3();
	var v2 = new Vector3.THREE$Vector3();

	return function() {

		var keys = [ 'a', 'b', 'c' ];

		this.object.updateMatrixWorld( true );

		var matrixWorld = this.object.matrixWorld;

		var position = this.geometry.attributes.position;

		//

		var objGeometry = this.object.geometry;

		if ( (objGeometry && objGeometry.isGeometry) ) {

			var vertices = objGeometry.vertices;

			var faces = objGeometry.faces;

			var idx = 0;

			for ( var i = 0, l = faces.length; i < l; i ++ ) {

				var face = faces[ i ];

				for ( var j = 0, jl = face.vertexTangents.length; j < jl; j ++ ) {

					var vertex = vertices[ face[ keys[ j ] ] ];

					var tangent = face.vertexTangents[ j ];

					v1.copy( vertex ).applyMatrix4( matrixWorld );

					v2.set( tangent.x, tangent.y, tangent.z ); // tangent.w used for bitangents only

					v2.transformDirection( matrixWorld ).multiplyScalar( this.size ).add( v1 );

					position.setXYZ( idx, v1.x, v1.y, v1.z );

					idx = idx + 1;

					position.setXYZ( idx, v2.x, v2.y, v2.z );

					idx = idx + 1;

				}

			}

		} else if ( (objGeometry && objGeometry.isBufferGeometry) ) {

			var objPos = objGeometry.attributes.position;

			var objTan = objGeometry.attributes.tangent;

			var idx = 0;

			// for simplicity, ignore index and drawcalls, and render every tangent

			for ( var j = 0, jl = objPos.count; j < jl; j ++ ) {

				v1.set( objPos.getX( j ), objPos.getY( j ), objPos.getZ( j ) ).applyMatrix4( matrixWorld );

				v2.set( objTan.getX( j ), objTan.getY( j ), objTan.getZ( j ) ); // tangent.w used for bitangents only

				v2.transformDirection( matrixWorld ).multiplyScalar( this.size ).add( v1 );

				position.setXYZ( idx, v1.x, v1.y, v1.z );

				idx = idx + 1;

				position.setXYZ( idx, v2.x, v2.y, v2.z );

				idx = idx + 1;

			}

		}

		position.needsUpdate = true;

		return this;

	}

}() );