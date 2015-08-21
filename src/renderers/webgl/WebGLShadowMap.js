import { THREE$PointCloud } from '../../objects/PointCloud';
import { THREE$Line } from '../../objects/Line';
import { THREE$Mesh } from '../../objects/Mesh';
import { THREE$SkinnedMesh } from '../../objects/SkinnedMesh';
import { THREE$CullFaceFront, THREE$RGBAFormat, THREE$NearestFilter, THREE$PCFSoftShadowMap, THREE$LinearFilter, THREE$PCFShadowMap } from '../../Three';
import { THREE$MeshFaceMaterial } from '../../materials/MultiMaterial';
import { THREE$CameraHelper } from '../../extras/helpers/CameraHelper';
import { THREE$OrthographicCamera } from '../../cameras/OrthographicCamera';
import { THREE$DirectionalLight } from '../../lights/DirectionalLight';
import { THREE$PerspectiveCamera } from '../../cameras/PerspectiveCamera';
import { THREE$SpotLight } from '../../lights/SpotLight';
import { THREE$Matrix4 } from '../../math/Matrix4';
import { THREE$Vector2 } from '../../math/Vector2';
import { THREE$WebGLRenderTarget } from '../WebGLRenderTarget';
import { THREE$ShaderMaterial } from '../../materials/ShaderMaterial';
import { THREE$UniformsUtils } from '../shaders/UniformsUtils';
import { THREE$ShaderLib } from '../shaders/ShaderLib';
import { THREE$Vector3 } from '../../math/Vector3';
import { THREE$Frustum } from '../../math/Frustum';

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

function THREE$WebGLShadowMap ( _renderer, _lights, _objects ) {
	this.isWebGLShadowMap = true;

	var _gl = _renderer.context,
	_state = _renderer.state,
	_frustum = new THREE$Frustum(),
	_projScreenMatrix = new THREE$Matrix4(),

	_min = new THREE$Vector3(),
	_max = new THREE$Vector3(),

	_matrixPosition = new THREE$Vector3(),

	_renderList = [];

	// init

	var depthShader = THREE$ShaderLib[ "depthRGBA" ];
	var depthUniforms = THREE$UniformsUtils.clone( depthShader.uniforms );

	var _depthMaterial = new THREE$ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader
	 } );

	var _depthMaterialMorph = new THREE$ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true
	} );

	var _depthMaterialSkin = new THREE$ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		skinning: true
	} );

	var _depthMaterialMorphSkin = new THREE$ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true,
		skinning: true
	} );

	_depthMaterial._shadowPass = true;
	_depthMaterialMorph._shadowPass = true;
	_depthMaterialSkin._shadowPass = true;
	_depthMaterialMorphSkin._shadowPass = true;

	//

	var scope = this;

	this.enabled = false;

	this.autoUpdate = true;
	this.needsUpdate = false;

	this.type = THREE$PCFShadowMap;
	this.cullFace = THREE$CullFaceFront;

	this.render = function ( scene, camera ) {

		if ( scope.enabled === false ) return;
		if ( scope.autoUpdate === false && scope.needsUpdate === false ) return;

		// set GL state for depth map

		_gl.clearColor( 1, 1, 1, 1 );
		_state.disable( _gl.BLEND );

		_state.enable( _gl.CULL_FACE );
		_gl.frontFace( _gl.CCW );

		if ( scope.cullFace === THREE$CullFaceFront ) {

			_gl.cullFace( _gl.FRONT );

		} else {

			_gl.cullFace( _gl.BACK );

		}

		_state.setDepthTest( true );

		// render depth map

		for ( var i = 0, il = _lights.length; i < il; i ++ ) {

			var light = _lights[ i ];

			if ( ! light.castShadow ) continue;

			if ( ! light.shadowMap ) {

				var shadowFilter = THREE$LinearFilter;

				if ( scope.type === THREE$PCFSoftShadowMap ) {

					shadowFilter = THREE$NearestFilter;

				}

				var pars = { minFilter: shadowFilter, magFilter: shadowFilter, format: THREE$RGBAFormat };

				light.shadowMap = new THREE$WebGLRenderTarget( light.shadowMapWidth, light.shadowMapHeight, pars );
				light.shadowMapSize = new THREE$Vector2( light.shadowMapWidth, light.shadowMapHeight );

				light.shadowMatrix = new THREE$Matrix4();

			}

			if ( ! light.shadowCamera ) {

				if ( (light && light.isSpotLight) ) {

					light.shadowCamera = new THREE$PerspectiveCamera( light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar );

				} else if ( (light && light.isDirectionalLight) ) {

					light.shadowCamera = new THREE$OrthographicCamera( light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar );

				} else {

					console.error( "THREE.ShadowMapPlugin: Unsupported light type for shadow", light );
					continue;

				}

				scene.add( light.shadowCamera );

				if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

			}

			if ( light.shadowCameraVisible && ! light.cameraHelper ) {

				light.cameraHelper = new THREE$CameraHelper( light.shadowCamera );
				scene.add( light.cameraHelper );

			}

			var shadowMap = light.shadowMap;
			var shadowMatrix = light.shadowMatrix;
			var shadowCamera = light.shadowCamera;

			//

			shadowCamera.position.setFromMatrixPosition( light.matrixWorld );
			_matrixPosition.setFromMatrixPosition( light.target.matrixWorld );
			shadowCamera.lookAt( _matrixPosition );
			shadowCamera.updateMatrixWorld();

			shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

			//

			if ( light.cameraHelper ) light.cameraHelper.visible = light.shadowCameraVisible;
			if ( light.shadowCameraVisible ) light.cameraHelper.update();

			// compute shadow matrix

			shadowMatrix.set(
				0.5, 0.0, 0.0, 0.5,
				0.0, 0.5, 0.0, 0.5,
				0.0, 0.0, 0.5, 0.5,
				0.0, 0.0, 0.0, 1.0
			);

			shadowMatrix.multiply( shadowCamera.projectionMatrix );
			shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

			// update camera matrices and frustum

			_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );

			// render shadow map

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// set object matrices & frustum culling

			_renderList.length = 0;

			projectObject( scene, shadowCamera );


			// render regular objects

			for ( var j = 0, jl = _renderList.length; j < jl; j ++ ) {

				var object = _renderList[ j ];
				var geometry = _objects.update( object );
				var material = object.material;

				if ( (material && material.isMeshFaceMaterial) ) {

					var groups = geometry.groups;
					var materials = material.materials;

					for ( var j = 0, jl = groups.length; j < jl; j ++ ) {

						var group = groups[ j ];
						var groupMaterial = materials[ group.materialIndex ];

						if ( groupMaterial !== undefined ) {

							_renderer.renderBufferDirect( shadowCamera, _lights, null, geometry, getDepthMaterial( object, groupMaterial ), object, group );

						}

					}

				} else {

					_renderer.renderBufferDirect( shadowCamera, _lights, null, geometry, getDepthMaterial( object, material ), object );

				}

			}

		}

		// restore GL state

		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );
		_state.enable( _gl.BLEND );

		if ( scope.cullFace === THREE$CullFaceFront ) {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.resetGLState();

		scope.needsUpdate = false;

	};

	function getDepthMaterial( object, material ) {

		var geometry = object.geometry;

		var useMorphing = geometry.morphTargets !== undefined && geometry.morphTargets.length > 0 && material.morphTargets;
		var useSkinning = (object && object.isSkinnedMesh) && material.skinning;

		var depthMaterial;

		if ( object.customDepthMaterial ) {

			depthMaterial = object.customDepthMaterial;

		} else if ( useSkinning ) {

			depthMaterial = useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin;

		} else if ( useMorphing ) {

			depthMaterial = _depthMaterialMorph;

		} else {

			depthMaterial = _depthMaterial;

		}

		depthMaterial.visible = material.visible;
		depthMaterial.wireframe = material.wireframe;
		depthMaterial.wireframeLinewidth = material.wireframeLinewidth;

		return depthMaterial;

	}

	function projectObject( object, camera ) {

		if ( object.visible === false ) return;

		if ( (object && object.isMesh) || (object && object.isLine) || (object && object.isPointCloud) ) {

			if ( object.castShadow && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

				var material = object.material;

				if ( material.visible === true ) {

					object.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
					_renderList.push( object );

				}

			}

		}

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			projectObject( children[ i ], camera );

		}

	}

};


export { THREE$WebGLShadowMap };