function disableAutocomplete() {
	function select(query) {
		return Array.prototype.slice.call(document.querySelectorAll(query), 0);
	}

	select('form').concat(select('input')).forEach(function(tag) {
		tag.autocomplete = 'off';
	});
		
};