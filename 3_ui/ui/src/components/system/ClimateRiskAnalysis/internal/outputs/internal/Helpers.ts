export function positionToolbarNextToPlaceholder($viewToolbar, placeHolder) {
	if ($viewToolbar.length === 0)
		return;

	let $mainToolbar = $(placeHolder.closest("nav"));
	let offset = (parseInt($mainToolbar.css("borderTopWidth")) || 0) + (parseInt($mainToolbar.css("padding")) || 0);
	let placeholderRect = placeHolder.getBoundingClientRect();
	if ($viewToolbar && $viewToolbar.length === 1) {
		$viewToolbar.css({top: 0});
		let left = placeholderRect.left;
		let top = placeholderRect.top - offset - $viewToolbar.offset().top; // Calculate new top difference while accounting for padding and border
		$viewToolbar.css({left: placeholderRect.left, top: top, width: `calc(100% - ${left}px)`});
	}
}