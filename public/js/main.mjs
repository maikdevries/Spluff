document.getElementById('userData')?.addEventListener('click', toggleUserDropdown, {
	'capture': true,
	'once': false,
	'passive': true,
});

function toggleUserDropdown (event) {
	event.stopPropagation();

	const userDropdown = document.getElementById('userDropdown');

	if (userDropdown.contains(event.target) || !userDropdown.classList.toggle('hidden')) {
		return document.addEventListener('click', toggleUserDropdown, {
			'capture': true,
			'once': true,
			'passive': true,
		});
	}
}
