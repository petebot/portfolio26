import { promises as fs } from 'node:fs';
import path from 'node:path';

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ImageObject {
	url: string;
	alt?: string;
	caption?: string;
}

export interface Collaborator {
	name: string;
	role?: string;
	url?: string;
}

export interface Timeframe {
	start?: string;
	end?: string;
	label?: string;
}

export interface ProjectPublic {
	slug: string;
	title: string;
	summary: string;
	intro?: string;
	body?: string;
	heroImage?: ImageObject;
	gallery?: ImageObject[];
	tags?: string[];
	category?: string;
	tech?: string[];
	featured?: boolean;
	weight?: number;
	sortDate?: string;
	timeframe?: Timeframe;
	role?: string;
	collaborators?: Collaborator[];
	clientPublicName?: string;
	liveUrl?: string;
	repoUrl?: string;
	canonical?: string;
	seo?: Record<string, unknown>;
}

export interface ProjectInternal {
	id: string;
	status: ProjectStatus;
	createdAt: string;
	updatedAt: string;
	contentUri: string;
	aliases: string[];
	internalNotes?: string;
	metadata?: Record<string, unknown>;
}

export interface ProjectBundle {
	slug: string;
	status: ProjectStatus;
	public: ProjectPublic;
	internal: ProjectInternal;
}

export interface ProjectDataset {
	projects: ProjectBundle[];
	published: ProjectPublic[];
	archived: ProjectPublic[];
	drafts: ProjectBundle[];
	redirects: Record<string, string>;
}

interface RawProjectRecord {
	[key: string]: unknown;
}

const REQUIRED_FIELDS = [
	'id',
	'slug',
	'title',
	'summary',
	'status',
	'createdAt',
	'updatedAt',
	'contentUri'
] as const;

const PUBLIC_FIELDS = [
	'slug',
	'title',
	'summary',
	'intro',
	'body',
	'heroImage',
	'gallery',
	'tags',
	'category',
	'tech',
	'featured',
	'weight',
	'sortDate',
	'timeframe',
	'role',
	'collaborators',
	'clientPublicName',
	'liveUrl',
	'repoUrl',
	'canonical',
	'seo'
] as const;

const INTERNAL_FIELDS = [
	'id',
	'status',
	'createdAt',
	'updatedAt',
	'contentUri',
	'aliases',
	'internalNotes',
	'metadata'
] as const;

const ALLOWED_FIELDS = new Set<string>([...PUBLIC_FIELDS, ...INTERNAL_FIELDS]);

const PROJECTS_DIR = path.resolve(process.cwd(), 'content', 'projects');

let cachedDataset: ProjectDataset | null = null;

export async function loadProjectDataset(forceReload = false): Promise<ProjectDataset> {
	if (cachedDataset && !forceReload) {
		return cachedDataset;
	}

	const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
	const aliasMap = new Map<string, string>();
	const seenSlugs = new Set<string>();
	const bundles: ProjectBundle[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const slugFolder = entry.name;
		const projectDir = path.join(PROJECTS_DIR, slugFolder);
		const jsonPath = path.join(projectDir, 'project.json');
		const markdownPath = path.join(projectDir, 'content.md');

		const [jsonContent, markdownContent] = await Promise.all([
			fs.readFile(jsonPath, 'utf-8'),
			fs.readFile(markdownPath, 'utf-8')
		]);

		const raw = JSON.parse(jsonContent) as RawProjectRecord;
		validateRecord(raw, slugFolder);

		const slug = raw.slug as string;

		if (seenSlugs.has(slug)) {
			throw new Error(`Duplicate project slug detected: ${slug}`);
		}
		seenSlugs.add(slug);

		const status = raw.status as ProjectStatus;
		const aliases = normaliseAliases(raw.aliases);

		for (const alias of aliases) {
			if (alias === slug) {
				throw new Error(`Alias \"${alias}\" duplicates canonical slug for ${slug}`);
			}

			const existing = aliasMap.get(alias);
			if (existing && existing !== slug) {
				throw new Error(`Alias \"${alias}\" already assigned to ${existing}`);
			}

			aliasMap.set(alias, slug);
		}

		const publicData = derivePublicData(raw, markdownContent);
		const internalData: ProjectInternal = {
			id: raw.id as string,
			status,
			createdAt: raw.createdAt as string,
			updatedAt: raw.updatedAt as string,
			contentUri: raw.contentUri as string,
			aliases,
			internalNotes: raw.internalNotes as string | undefined,
			metadata: (raw.metadata as Record<string, unknown>) ?? undefined
		};

		bundles.push({
			slug,
			status,
			public: publicData,
			internal: internalData
		});
	}

	const published = bundles
		.filter((bundle) => bundle.status === 'published')
		.map((bundle) => bundle.public);

	const archived = bundles
		.filter((bundle) => bundle.status === 'archived')
		.map((bundle) => bundle.public);

	const drafts = bundles.filter((bundle) => bundle.status === 'draft');

	cachedDataset = {
		projects: bundles,
		published,
		archived,
		drafts,
		redirects: Object.fromEntries(aliasMap.entries())
	};

	return cachedDataset;
}

export async function loadPublishedProjects(forceReload = false): Promise<ProjectPublic[]> {
	const dataset = await loadProjectDataset(forceReload);
	return dataset.published.slice();
}

export function invalidateProjectDatasetCache(): void {
	cachedDataset = null;
}

function validateRecord(raw: RawProjectRecord, folderName: string): void {
	const keys = Object.keys(raw);
	for (const key of keys) {
		if (!ALLOWED_FIELDS.has(key)) {
			throw new Error(`Unexpected field \"${key}\" in project record ${folderName}`);
		}
	}

	for (const field of REQUIRED_FIELDS) {
		if (raw[field] === undefined || raw[field] === null) {
			throw new Error(`Missing required field \"${field}\" in project record ${folderName}`);
		}
	}

	if (typeof raw.id !== 'string' || !raw.id.trim()) {
		throw new Error(`Project ${folderName} must provide a non-empty string id`);
	}

	if (typeof raw.slug !== 'string' || !raw.slug.trim()) {
		throw new Error(`Project ${folderName} must provide a non-empty string slug`);
	}

	if (raw.slug !== folderName) {
		throw new Error(`Slug mismatch: record slug ${raw.slug} does not match folder ${folderName}`);
	}

	const allowedStatuses: ProjectStatus[] = ['draft', 'published', 'archived'];
	if (!allowedStatuses.includes(raw.status as ProjectStatus)) {
		throw new Error(`Invalid status \"${raw.status}\" in project ${folderName}`);
	}

	if (typeof raw.contentUri !== 'string' || !raw.contentUri.trim()) {
		throw new Error(`Project ${folderName} must specify a contentUri string`);
	}

	for (const dateField of ['createdAt', 'updatedAt']) {
		if (typeof raw[dateField] !== 'string' || !(raw[dateField] as string).trim()) {
			throw new Error(`Project ${folderName} must provide a string ${dateField}`);
		}
	}

	const expectedContentUri = path.posix.join('content', 'projects', folderName, 'content.md');
	if (raw.contentUri !== expectedContentUri) {
		throw new Error(
			`contentUri mismatch in ${folderName}: expected ${expectedContentUri}, received ${raw.contentUri}`
		);
	}
}

function normaliseAliases(value: unknown): string[] {
	if (!value) {
		return [];
	}

	if (!Array.isArray(value)) {
		throw new Error('aliases must be an array of strings');
	}

	const aliases = value.map((item) => {
		if (typeof item !== 'string' || !item.trim()) {
			throw new Error('aliases must contain non-empty strings');
		}

		return item.trim();
	});

	return [...new Set(aliases)];
}

function derivePublicData(raw: RawProjectRecord, markdown: string): ProjectPublic {
	const result: Partial<ProjectPublic> = {};

	for (const field of PUBLIC_FIELDS) {
		if (raw[field] !== undefined) {
			(result as Record<string, unknown>)[field] = raw[field];
		}
	}

	if (!result.body && markdown.trim().length > 0) {
		result.body = markdown;
	}

	if (typeof result.heroImage === 'string') {
		result.heroImage = { url: result.heroImage };
	}

	if (Array.isArray(result.gallery)) {
		result.gallery = result.gallery.map((item) =>
			typeof item === 'string' ? { url: item } : (item as ImageObject)
		);
	}

	return result as ProjectPublic;
}
