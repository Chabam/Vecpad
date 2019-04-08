import * as THREE from 'three';
import Translation from './Transformations/Translation';
import Rotation from './Transformations/Rotation';
import Shear from './Transformations/Shear';
import Scale from './Transformations/Scale';
import VecpadVector from './VecpadVector';
import Triangle from './Triangle';
import Cube from './Cube';
import Quad from './Quad';
import VectorAddition from './VectorAddition';
import VectorSubtraction from './VectorSubtraction';
import VectorCrossProduct from './VectorCrossProduct';

export default class VecpadObjectLoader {
	constructor() {
		this.objectLoader = new THREE.ObjectLoader();
	}

	parse = (json, displayMode, updateSceneFunc) => {
		try {

			let nonOperations = json.filter((object) => object.type !== 'Operation');
			let operations = json.filter((object) => object.type === 'Operation');
			let nonOperationsObjects = nonOperations.reduce(
				(objects, objectJSON) => {
					objects.push(this.parseObject(objectJSON, displayMode, updateSceneFunc));
					return objects;
				},
				[]
			);
			let operationsObjects = operations.reduce(
				(objects, objectJSON) => {
					objects.push(this.parseOperation(objectJSON, nonOperationsObjects, updateSceneFunc));
					return objects;
				},
				[]
			);
			return nonOperationsObjects.concat(operationsObjects);
		} catch (parseError) {
			alert('The saved scene cannot be read!');
			// eslint-disable-next-line no-console
			console.error(parseError);
			return [];
		}
	}

	parseObject = (json, displayMode, updateSceneFunc) => {
		let object;
		switch (json.type) {
		case 'Triangle': {
			let {
				name,
				width,
				color,
				outlineColor,
				originalMatrix,
				originalPosition
			} = json;

			object = new Triangle(width, displayMode, color, outlineColor, name, updateSceneFunc);

			object.originalPosition = originalPosition;
			object.originalMatrix = originalMatrix;
			object.applyMatrix(originalMatrix);

			break;
		}
		case 'Quad': {
			let {
				name,
				width,
				heigth,
				color,
				outlineColor,
				originalMatrix,
				originalPosition
			} = json;

			object = new Quad(width, heigth, displayMode, color, outlineColor, name, updateSceneFunc);

			object.originalPosition = originalPosition;
			object.originalMatrix = originalMatrix;
			object.applyMatrix(originalMatrix);

			break;
		}
		case 'Cube': {
			let {
				name,
				width,
				heigth,
				depth,
				color,
				outlineColor,
				originalMatrix,
				originalPosition
			} = json;

			object = new Cube(width, heigth, depth, displayMode, color, outlineColor, name, updateSceneFunc);

			object.originalPosition = originalPosition;
			object.originalMatrix = originalMatrix;
			object.applyMatrix(originalMatrix);
			break;
		}
		case 'Vector': {
			let {
				name,
				color,
				originalVector,
				normalize
			} = json;

			object = new VecpadVector(
				new THREE.Vector3(originalVector.x, originalVector.y, originalVector.z),
				color,
				name,
				updateSceneFunc
			);
			object.normalize = normalize;
			break;
		}
		default:
			throw new Error(`Unkown Object type: ${json.type}`);
		}
		object.uuid = json.uuid;
		object.transformations = json.transformations.reduce((trans, currentJson) => {
			trans.push(this.parseTransformation(object, currentJson));
			return trans;
		},[]);
		object.computeTransformations();
		return object;
	}

	parseOperation = (json, objects, updateSceneFunc) => {
		let {
			name,
			operation,
			color,
			v1,
			v2,
			transformations
		} = json;
		let object;
		switch (operation) {
		case 'Addition':
			object = new VectorAddition(color, name, updateSceneFunc);
			break;
		case 'Subtraction':
			object = new VectorSubtraction(color, name, updateSceneFunc);
			break;
		case 'Cross Product':
			object = new VectorCrossProduct(color, name, updateSceneFunc);
			break;
		default:
			throw new Error(`Unkown operation: ${operation}`);
		}

		let v1Object = objects.find((object) => object.uuid === v1);
		let v2Object = objects.find((object) => object.uuid === v2);
		object.v1 = v1Object;
		object.v1CbId = object.v1 ? object.v1.registerCallback(object.updateVectors) : null;
		object.v2 = v2Object;
		object.v2CbId = object.v2 ? object.v2.registerCallback(object.updateVectors) : null;

		object.uuid = json.uuid;
		object.transformations = transformations.reduce((trans, currentJson) => {
			trans.push(this.parseTransformation(object, currentJson));
			return trans;
		},[]);

		object.computeTransformations();

		if (object.v1 && object.v2) {
			object.showOperation();
		}
		return object;
	}

	parseTransformation = (object, json) => {
		let trans;
		switch (json.name) {
		case 'Translation':
			trans = new Translation(
				json.x,
				json.y,
				json.z,
				object
			);
			break;
		case 'Rotation':
			trans = new Rotation(new THREE.Vector3(
				json.axis.x,
				json.axis.y,
				json.axis.z
			),
			json.angle,
			object
			);
			break;
		case 'Shear':
			trans = new Shear(
				json.xY,
				json.xZ,
				json.yX,
				json.yZ,
				json.zX,
				json.zY,
				object
			);
			break;
		case 'Scale':
			trans = new Scale(
				json.x,
				json.y,
				json.z,
				object
			);
			break;
		default:
			throw new Error(`Unkown transformation: ${json.name}`);
		}
		return trans;
	}
}