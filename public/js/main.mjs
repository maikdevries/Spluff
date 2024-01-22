document.getElementById('userData')?.addEventListener('click', showUserDropdown, {
	'capture': true,
	'once': false,
	'passive': true,
});

function showUserDropdown (event) {
	return event.currentTarget.nextElementSibling.classList.toggle('hidden');
}
