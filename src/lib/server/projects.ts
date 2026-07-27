import { promises as fs } from 'node:fs';
import path from 'node:path';

export type ProjectStatus = 'draft' | 'published' | 'archived';
export type DesignSystemStatus = 'experimental' | 'emerging' | 'living' | 'maintenance';

export interface DesignSystemPrinciple {
	name: string;
	description: string;
}

export interface DesignSystemColor {
	name: string;
	value: string;
	role: string;
}

export interface DesignSystemTypographyRole {
	family: string;
	role: string;
	description: string;
}

export interface DesignSystemComponentEvidence {
	name: string;
	description: string;
	states: string[];
}

export interface DesignSystemComponentSnapshot {
	url: string;
	lightUrl?: string;
	darkUrl?: string;
	alt: string;
	caption?: string;
	width: number;
	height: number;
}

export interface DesignSystemProofPoint {
	title: string;
	description: string;
	image?: ImageObject;
}

export interface DesignSystemShowcase {
	palette: DesignSystemColor[];
	typography: DesignSystemTypographyRole[];
	components: DesignSystemComponentEvidence[];
	componentSnapshot?: DesignSystemComponentSnapshot;
	productProof: DesignSystemProofPoint;
	accessibility: DesignSystemProofPoint;
}

export interface DesignSystemSummary {
	name: string;
	status: DesignSystemStatus;
	contractVersion: string;
	summary: string;
	principles: DesignSystemPrinciple[];
	specimenUrl?: string | null;
	showcase?: DesignSystemShowcase;
}

export interface ImageObject {
	url: string;
	compactUrl?: string;
	compactAlt?: string;
	frame?: 'plain' | 'phone' | 'browser';
	compactFrame?: 'plain' | 'phone' | 'browser';
	compactFrameLabel?: string;
	lightUrl?: string;
	darkUrl?: string;
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

export interface ProjectStartingPoint {
	sectionHeading: string;
	eyebrow: string;
	title: string;
	description: string;
	url: string;
	linkLabel: string;
	image: ImageObject;
	preserved: string[];
	reworked: string[];
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
	designSystem?: DesignSystemSummary;
	startingPoint?: ProjectStartingPoint;
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
	'seo',
	'designSystem',
	'startingPoint'
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
	const shouldUseCache = process.env.NODE_ENV === 'production' && !forceReload;

	if (cachedDataset && shouldUseCache) {
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

	if (raw.designSystem !== undefined) {
		validateDesignSystem(raw.designSystem, folderName);
	}

	if (raw.startingPoint !== undefined) {
		validateStartingPoint(raw.startingPoint, folderName);
	}
}

function validateStartingPoint(value: unknown, folderName: string): void {
	const startingPoint = expectObject(value, `startingPoint in ${folderName}`);
	assertOnlyFields(
		startingPoint,
		[
			'sectionHeading',
			'eyebrow',
			'title',
			'description',
			'url',
			'linkLabel',
			'image',
			'preserved',
			'reworked'
		],
		`startingPoint in ${folderName}`
	);
	assertNonEmptyStrings(
		startingPoint,
		['sectionHeading', 'eyebrow', 'title', 'description', 'url', 'linkLabel'],
		`startingPoint in ${folderName}`
	);

	if (!isValidPublicUrl(startingPoint.url as string)) {
		throw new Error(`startingPoint.url in ${folderName} must be a public URL or root path`);
	}

	const image = expectObject(startingPoint.image, `startingPoint.image in ${folderName}`);
	assertOnlyFields(image, ['url', 'alt', 'caption'], `startingPoint.image in ${folderName}`);
	assertNonEmptyStrings(image, ['url', 'alt', 'caption'], `startingPoint.image in ${folderName}`);
	if (!isValidPublicUrl(image.url as string)) {
		throw new Error(`startingPoint.image.url in ${folderName} must be a public URL or root path`);
	}

	for (const field of ['preserved', 'reworked']) {
		const items = expectArray(
			startingPoint[field],
			1,
			8,
			`startingPoint.${field} in ${folderName}`
		);
		if (items.some((item) => typeof item !== 'string' || !item.trim())) {
			throw new Error(`startingPoint.${field} in ${folderName} must contain non-empty strings`);
		}
	}
}

function validateDesignSystem(value: unknown, folderName: string): void {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`designSystem in ${folderName} must be an object`);
	}

	const system = value as Record<string, unknown>;
	const allowedFields = new Set([
		'name',
		'status',
		'contractVersion',
		'summary',
		'principles',
		'specimenUrl',
		'showcase'
	]);

	for (const field of Object.keys(system)) {
		if (!allowedFields.has(field)) {
			throw new Error(`Unexpected designSystem field "${field}" in project ${folderName}`);
		}
	}

	for (const field of ['name', 'contractVersion', 'summary']) {
		if (typeof system[field] !== 'string' || !(system[field] as string).trim()) {
			throw new Error(`designSystem.${field} in ${folderName} must be a non-empty string`);
		}
	}

	const allowedStatuses: DesignSystemStatus[] = [
		'experimental',
		'emerging',
		'living',
		'maintenance'
	];
	if (!allowedStatuses.includes(system.status as DesignSystemStatus)) {
		throw new Error(`Invalid designSystem.status "${system.status}" in project ${folderName}`);
	}

	if (
		!Array.isArray(system.principles) ||
		system.principles.length < 3 ||
		system.principles.length > 5
	) {
		throw new Error(`designSystem.principles in ${folderName} must contain three to five items`);
	}

	for (const [index, principleValue] of system.principles.entries()) {
		if (!principleValue || typeof principleValue !== 'object' || Array.isArray(principleValue)) {
			throw new Error(`designSystem.principles[${index}] in ${folderName} must be an object`);
		}

		const principle = principleValue as Record<string, unknown>;
		const fields = Object.keys(principle);
		if (fields.some((field) => field !== 'name' && field !== 'description')) {
			throw new Error(`Unexpected field in designSystem.principles[${index}] for ${folderName}`);
		}

		for (const field of ['name', 'description']) {
			if (typeof principle[field] !== 'string' || !(principle[field] as string).trim()) {
				throw new Error(
					`designSystem.principles[${index}].${field} in ${folderName} must be a non-empty string`
				);
			}
		}
	}

	if (
		system.specimenUrl !== undefined &&
		system.specimenUrl !== null &&
		(typeof system.specimenUrl !== 'string' || !isValidPublicUrl(system.specimenUrl))
	) {
		throw new Error(`designSystem.specimenUrl in ${folderName} must be a public URL or root path`);
	}

	if (system.showcase !== undefined) {
		validateDesignSystemShowcase(system.showcase, folderName);
	}
}

function validateDesignSystemShowcase(value: unknown, folderName: string): void {
	const showcase = expectObject(value, `designSystem.showcase in ${folderName}`);
	assertOnlyFields(
		showcase,
		['palette', 'typography', 'components', 'componentSnapshot', 'productProof', 'accessibility'],
		`designSystem.showcase in ${folderName}`
	);

	const palette = expectArray(
		showcase.palette,
		4,
		8,
		`designSystem.showcase.palette in ${folderName}`
	);
	for (const [index, item] of palette.entries()) {
		const color = expectObject(item, `designSystem.showcase.palette[${index}] in ${folderName}`);
		assertOnlyFields(color, ['name', 'value', 'role'], `palette item ${index} in ${folderName}`);
		assertNonEmptyStrings(
			color,
			['name', 'value', 'role'],
			`palette item ${index} in ${folderName}`
		);
		if (!/^#[\da-f]{6}$/i.test(color.value as string)) {
			throw new Error(
				`designSystem.showcase.palette[${index}].value in ${folderName} must be a six-digit hex color`
			);
		}
	}

	const typography = expectArray(
		showcase.typography,
		2,
		4,
		`designSystem.showcase.typography in ${folderName}`
	);
	for (const [index, item] of typography.entries()) {
		const role = expectObject(item, `designSystem.showcase.typography[${index}] in ${folderName}`);
		assertOnlyFields(
			role,
			['family', 'role', 'description'],
			`typography item ${index} in ${folderName}`
		);
		assertNonEmptyStrings(
			role,
			['family', 'role', 'description'],
			`typography item ${index} in ${folderName}`
		);
	}

	const components = expectArray(
		showcase.components,
		2,
		4,
		`designSystem.showcase.components in ${folderName}`
	);
	for (const [index, item] of components.entries()) {
		const component = expectObject(
			item,
			`designSystem.showcase.components[${index}] in ${folderName}`
		);
		assertOnlyFields(
			component,
			['name', 'description', 'states'],
			`component item ${index} in ${folderName}`
		);
		assertNonEmptyStrings(
			component,
			['name', 'description'],
			`component item ${index} in ${folderName}`
		);
		const states = expectArray(
			component.states,
			1,
			8,
			`component states ${index} in ${folderName}`
		);
		if (states.some((state) => typeof state !== 'string' || !state.trim())) {
			throw new Error(
				`designSystem.showcase.components[${index}].states in ${folderName} must contain non-empty strings`
			);
		}
	}

	if (showcase.componentSnapshot !== undefined) {
		const image = expectObject(
			showcase.componentSnapshot,
			`designSystem.showcase.componentSnapshot in ${folderName}`
		);
		assertOnlyFields(
			image,
			['url', 'lightUrl', 'darkUrl', 'alt', 'caption', 'width', 'height'],
			`component snapshot in ${folderName}`
		);
		assertNonEmptyStrings(image, ['url', 'alt'], `component snapshot in ${folderName}`);
		for (const source of ['url', 'lightUrl', 'darkUrl']) {
			if (image[source] === undefined) continue;
			if (typeof image[source] !== 'string' || !(image[source] as string).trim()) {
				throw new Error(
					`designSystem.showcase.componentSnapshot.${source} in ${folderName} must be a non-empty string when provided`
				);
			}
			if (!isValidPublicUrl(image[source] as string)) {
				throw new Error(
					`designSystem.showcase.componentSnapshot.${source} in ${folderName} must be a public URL or root path`
				);
			}
		}
		if (
			image.caption !== undefined &&
			(typeof image.caption !== 'string' || !(image.caption as string).trim())
		) {
			throw new Error(
				`designSystem.showcase.componentSnapshot.caption in ${folderName} must be a non-empty string when provided`
			);
		}
		for (const dimension of ['width', 'height']) {
			if (
				typeof image[dimension] !== 'number' ||
				!Number.isInteger(image[dimension]) ||
				(image[dimension] as number) <= 0
			) {
				throw new Error(
					`designSystem.showcase.componentSnapshot.${dimension} in ${folderName} must be a positive integer`
				);
			}
		}
	}

	for (const field of ['productProof', 'accessibility']) {
		const proof = expectObject(showcase[field], `designSystem.showcase.${field} in ${folderName}`);
		assertOnlyFields(
			proof,
			field === 'productProof' ? ['title', 'description', 'image'] : ['title', 'description'],
			`designSystem.showcase.${field} in ${folderName}`
		);
		assertNonEmptyStrings(
			proof,
			['title', 'description'],
			`designSystem.showcase.${field} in ${folderName}`
		);

		if (field === 'productProof' && proof.image !== undefined) {
			const image = expectObject(
				proof.image,
				`designSystem.showcase.productProof.image in ${folderName}`
			);
			assertOnlyFields(
				image,
				['url', 'lightUrl', 'darkUrl', 'alt', 'caption'],
				`product proof image in ${folderName}`
			);
			assertNonEmptyStrings(image, ['url'], `product proof image in ${folderName}`);
			for (const urlField of ['url', 'lightUrl', 'darkUrl']) {
				if (
					image[urlField] !== undefined &&
					(typeof image[urlField] !== 'string' || !isValidPublicUrl(image[urlField] as string))
				) {
					throw new Error(
						`designSystem.showcase.productProof.image.${urlField} in ${folderName} must be a public URL or root path`
					);
				}
			}
			for (const optionalField of ['alt', 'caption']) {
				if (
					image[optionalField] !== undefined &&
					(typeof image[optionalField] !== 'string' || !(image[optionalField] as string).trim())
				) {
					throw new Error(
						`designSystem.showcase.productProof.image.${optionalField} in ${folderName} must be a non-empty string when provided`
					);
				}
			}
		}
	}
}

function expectObject(value: unknown, label: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`${label} must be an object`);
	}
	return value as Record<string, unknown>;
}

function expectArray(value: unknown, min: number, max: number, label: string): unknown[] {
	if (!Array.isArray(value) || value.length < min || value.length > max) {
		throw new Error(`${label} must contain ${min} to ${max} items`);
	}
	return value;
}

function assertOnlyFields(value: Record<string, unknown>, fields: string[], label: string): void {
	const allowed = new Set(fields);
	const unexpected = Object.keys(value).find((field) => !allowed.has(field));
	if (unexpected) throw new Error(`Unexpected field "${unexpected}" in ${label}`);
}

function assertNonEmptyStrings(
	value: Record<string, unknown>,
	fields: string[],
	label: string
): void {
	for (const field of fields) {
		if (typeof value[field] !== 'string' || !value[field].trim()) {
			throw new Error(`${label}.${field} must be a non-empty string`);
		}
	}
}

function isValidPublicUrl(value: string): boolean {
	if (value.startsWith('/')) return true;

	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
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
