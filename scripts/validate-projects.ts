import { loadProjectDataset } from '../src/lib/server/projects';

async function main(): Promise<void> {
	const dataset = await loadProjectDataset(true);
	const published = dataset.published.length;
	const archived = dataset.archived.length;
	const drafts = dataset.drafts.length;
	const redirects = Object.keys(dataset.redirects).length;

	console.log(
		`Validated ${dataset.projects.length} project(s): ${published} published, ${archived} archived, ${drafts} draft, ${redirects} redirect(s).`
	);
}

main().catch((error) => {
	console.error('Project content validation failed:');
	console.error(error instanceof Error ? (error.stack ?? error.message) : error);
	process.exit(1);
});
