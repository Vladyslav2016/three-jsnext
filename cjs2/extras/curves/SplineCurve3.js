'use strict';

var Curve = require('../core/Curve');
var Vector3 = require('../../math/Vector3');

var THREE$SplineCurve3;

/**************************************************************
 *	Spline 3D curve
 **************************************************************/


THREE$SplineCurve3 = Curve.THREE$Curve.create(

	function ( points /* array of Vector3 */ ) {

		console.warn( 'THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3' );
		this.points = ( points == undefined ) ? [] : points;

	},

	function ( t ) {

		var points = this.points;
		var point = ( points.length - 1 ) * t;

		var intPoint = Math.floor( point );
		var weight = point - intPoint;

		var point0 = points[ intPoint == 0 ? intPoint : intPoint - 1 ];
		var point1 = points[ intPoint ];
		var point2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
		var point3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

		var vector = new Vector3.THREE$Vector3();

		vector.x = Curve.THREE$Curve.Utils.interpolate( point0.x, point1.x, point2.x, point3.x, weight );
		vector.y = Curve.THREE$Curve.Utils.interpolate( point0.y, point1.y, point2.y, point3.y, weight );
		vector.z = Curve.THREE$Curve.Utils.interpolate( point0.z, point1.z, point2.z, point3.z, weight );

		return vector;

	}

);

exports.THREE$SplineCurve3 = THREE$SplineCurve3;