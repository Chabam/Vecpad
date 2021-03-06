import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';

/*
	This object is used to create different type of objects. All the functions are static
	and have no side effects.
*/
export default class ObjectHelper {

	static createGraph = (subdivision) => {
		/*
			The reason we need to have a size divisible by two is because we want the center of the grid
			to be at (0,0,0).
		*/
		if (subdivision % 2 === 1) {
			subdivision = subdivision + 1;
		}

		let halfSubdivision = (subdivision / 2);
		let graph = new THREE.GridHelper(subdivision, subdivision);
		let yAxisGeo = new THREE.Geometry();
		yAxisGeo.vertices.push(
			new THREE.Vector3(0, halfSubdivision, 0),
			new THREE.Vector3(0, -halfSubdivision, 0)
		);
		graph.yAxis = new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({
			color: 0x000000
		}));
		graph.size = subdivision;
		graph.add(graph.yAxis);
		return graph;
	}

	static createTriangleGeometry = (width) => {
		let triangleGeometry = new THREE.Geometry();

		let p1 = new THREE.Vector3(0, 0, 0);
		let p2 = new THREE.Vector3(width, 0, 0);
		let p3 = new THREE.Vector3(0, width, 0);
		triangleGeometry.vertices.push(p1, p2, p3);

		triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
		triangleGeometry.computeFaceNormals();
		triangleGeometry.type = 'TriangleGeometry';
		triangleGeometry.parameters = {
			width: width
		};

		// This line is to set the center of the triangle at (0,0,0)
		triangleGeometry.translate(-(width/3), -(width/3), 0);
		return triangleGeometry;
	}

	// This function create a CSS2DObject containing the text we want.
	static createLabel = (text) => {
		let objectDiv = document.createElement('div');
		objectDiv.className = 'object-label';
		objectDiv.textContent = text;
		return new CSS2DObject(objectDiv);
	}
}