import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';

/*
	This object is used to create different type of objects. All the functions are static
	and have no side effects.
*/
export default class ObjectHelper {

	static createGround = (subdivision) => {
		/*
			The reason we need to have a size divisible by two is because we want the center of the grid
			to be at (0,0,0).
		*/
		if (subdivision % 2 === 1) {
			console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
			subdivision = subdivision + 1;
		}

		let halfSubdivision = (subdivision / 2);
		let labelDistance = (subdivision / 2) + ((subdivision / 2) * 0.05);
		let ground = new THREE.GridHelper(subdivision, subdivision);
		ground.xLabel = ObjectHelper.createLabel('X');
		ground.xMinusLabel = ObjectHelper.createLabel('-X');
		ground.yLabel = ObjectHelper.createLabel('Y');
		ground.yMinusLabel = ObjectHelper.createLabel('-Y');
		ground.zLabel = ObjectHelper.createLabel('Z');
		ground.zMinusLabel = ObjectHelper.createLabel('-Z');
		let yAxisGeo = new THREE.Geometry();
		yAxisGeo.vertices.push(
			new THREE.Vector3(0, halfSubdivision, 0),
			new THREE.Vector3(0, -halfSubdivision, 0)
		);
		ground.yAxis = new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({
			color: 0x000000
		}))
		ground.size = subdivision;
		ground.xLabel.position.set(labelDistance, 0, 0);
		ground.xMinusLabel.position.set(-labelDistance, 0, 0);
		ground.yLabel.position.set(0, labelDistance, 0);
		ground.yMinusLabel.position.set(0, -labelDistance, 0);
		ground.zLabel.position.set(0, 0, labelDistance);
		ground.zMinusLabel.position.set(0, 0, -labelDistance);
		ground.add(
			ground.yAxis,
			ground.xLabel,
			ground.xMinusLabel,
			ground.yLabel,
			ground.yMinusLabel,
			ground.zLabel,
			ground.zMinusLabel,
			ground.yAxisGeo)
		return ground;
	}

	static createTriangleGeometry = (width) => {
		let p1 = new THREE.Vector3(0, 0, 0);
		let p2 = new THREE.Vector3(width, 0, 0);
		let p3 = new THREE.Vector3(0, width, 0);
		let triangleGeometry = new THREE.Geometry();
		triangleGeometry.vertices.push(p1, p2, p3);
		triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
		triangleGeometry.computeFaceNormals();

		// This line is to set the center of the triangle at (0,0,0)
		triangleGeometry.translate(-(width/3), -(width/3), 0);
		return triangleGeometry
	}

	// This function create a CSS2DObject containing the text we want.
	static createLabel = (text) => {
		let objectDiv = document.createElement('div');
		objectDiv.className = 'object-label';
		objectDiv.textContent = text;
		return new CSS2DObject(objectDiv);
	}
}