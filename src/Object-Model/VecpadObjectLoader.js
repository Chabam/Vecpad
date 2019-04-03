import * as THREE from 'three';
import Translation from './Transformations/Translation';
import Rotation from './Transformations/Rotation';
import Shear from './Transformations/Shear';
import Scale from './Transformations/Scale';
import VecpadVector from './VecpadVector';
import Triangle from './Triangle';
import Cube from './Cube';
import Quad from './Quad';

export default class VecpadObjectLoader {
	constructor() {
		this.objectLoader = new THREE.ObjectLoader();
	}

	parse = (json, displayMode, updateSceneFunc) => {
		return json.reduce(
			(objects, objectJSON) => {
				objects.push(this.parseObject(objectJSON, displayMode, updateSceneFunc))
				return objects;
			},
			[]
		);
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
					vector,
					normalize
				} = json;

				object = new VecpadVector(
					new THREE.Vector3(vector.x, vector.y, vector.z),
					color,
					name,
					updateSceneFunc
				);
				if (normalize) {
					object.normalize = normalize;

					object.applyTransformations(1);
				}
				break;
			}
			default:
				console.error(`Could not parse object ${json.uuid}`)
				break;
		}
		object.uuid = json.uuid;
		json.transformations.forEach(trans => {
				switch (trans.name) {
					case 'Translation':
						object.addTranslation(new Translation(
							trans.x,
							trans.y,
							trans.z
						));
						break;
					case 'Rotation':
						object.addRotation(new Rotation(
							new THREE.Vector3(
								trans.axis.x,
								trans.axis.y,
								trans.axis.z
							),
							trans.angle
						));
						break;
					case 'Shear':
						object.addShear(new Shear(
							trans.xY,
							trans.xZ,
							trans.yX,
							trans.yZ,
							trans.zX,
							trans.zY
						));
						break;
					case 'Scale':
						object.addScale(new Scale(
							trans.x,
							trans.y,
							trans.z
						));
						break;
					default:
						console.error('Could not parse transformation');
				}
				return trans;
		});
		return object;
	}
}