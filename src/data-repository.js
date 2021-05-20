export default async function useDataRepository() {
	const response = await fetch('/rooftops.json');
	const rooftops = await response.json();

	return { rooftops };
}
