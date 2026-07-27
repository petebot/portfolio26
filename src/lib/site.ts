export const SITE = {
	name: 'Pete Nawara',
	title: 'Pete Nawara — Creative Technologist',
	description:
		'Pete Nawara is a creative technologist who designs and builds digital products, interfaces, and durable systems from concept to working form.',
	url: 'https://www.petenawara.com',
	email: 'hello@petenawara.com',
	github: 'https://github.com/petebot',
	locale: 'en_US',
	language: 'en-US',
	socialImage: '/og.png'
} as const;

export function absoluteUrl(pathname = '/') {
	return new URL(pathname, SITE.url).toString();
}
