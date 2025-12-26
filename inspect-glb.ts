// Quick script to inspect GLB bone structure
import { Document, NodeIO } from '@gltf-transform/core';

async function inspectGLB(path: string) {
	const io = new NodeIO();
	const doc = await io.read(path);

	console.log('=== Inspecting:', path, '===\n');

	// Get all nodes (which include bones)
	const nodes = doc.getRoot().listNodes();

	console.log('All nodes with transforms:');
	nodes.forEach((node, i) => {
		const name = node.getName();
		const translation = node.getTranslation();
		const scale = node.getScale();
		if (name) {
			console.log(`  ${i}: ${name} - pos: [${translation.map(v => v.toFixed(3)).join(', ')}] scale: [${scale.map(v => v.toFixed(3)).join(', ')}]`);
		}
	});

	// Get meshes to understand bounding boxes
	const meshes = doc.getRoot().listMeshes();
	console.log('\nMeshes:');
	meshes.forEach((mesh, i) => {
		console.log(`  ${i}: ${mesh.getName() || 'unnamed'}`);
		const primitives = mesh.listPrimitives();
		primitives.forEach((prim, j) => {
			const posAccessor = prim.getAttribute('POSITION');
			if (posAccessor) {
				const min = posAccessor.getMin([]);
				const max = posAccessor.getMax([]);
				console.log(`    Prim ${j}: bounds min=[${min.map(v => v.toFixed(3)).join(', ')}] max=[${max.map(v => v.toFixed(3)).join(', ')}]`);
			}
		});
	});
}

const avatarPath = './static/assets/Ultimate Modular Men Pack-glb/Adventurer.glb';
const itemPath = './static/assets/Ultimate RPG Items Bundle-glb/Sword.glb';

console.log('\n\n========== AVATAR ==========');
await inspectGLB(avatarPath);
console.log('\n\n========== SWORD ==========');
await inspectGLB(itemPath);
