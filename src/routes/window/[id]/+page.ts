/** @type {import('./$types').PageLoad} */
export function load({ params, url }) {
	return {
		img: params.id,
		imgNum: url.searchParams.get('img')
	};
}
