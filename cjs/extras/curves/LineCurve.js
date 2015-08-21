Object.defineProperty(exports, '__esModule', {
	value: true
});

var _coreCurve = require('../core/Curve');

/**************************************************************
 *	Line
 **************************************************************/

function THREE$LineCurve(v1, v2) {
	this.isLineCurve = true;

	this.v1 = v1;
	this.v2 = v2;
};

THREE$LineCurve.prototype = Object.create(_coreCurve.THREE$Curve.prototype);
THREE$LineCurve.prototype.constructor = THREE$LineCurve;

THREE$LineCurve.prototype.getPoint = function (t) {

	var point = this.v2.clone().sub(this.v1);
	point.multiplyScalar(t).add(this.v1);

	return point;
};

// Line curve is linear, so we can overwrite default getPointAt

THREE$LineCurve.prototype.getPointAt = function (u) {

	return this.getPoint(u);
};

THREE$LineCurve.prototype.getTangent = function (t) {

	var tangent = this.v2.clone().sub(this.v1);

	return tangent.normalize();
};

exports.THREE$LineCurve = THREE$LineCurve;