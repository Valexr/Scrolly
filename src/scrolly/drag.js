export function drag(node) {
	const eventHandlerOptions = { passive: false };
	let x = 0, y = 0

	function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

	function handleMousedown(e) {
		e.stopPropagation();
		e.preventDefault();
		x = e.clientX;
		y = e.clientY;

		node.dispatchEvent(new CustomEvent('dragstart', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove, eventHandlerOptions);
		window.addEventListener('mouseup', handleMouseup, eventHandlerOptions);
	}

	function handleMousemove(e) {
		// e.preventDefault();
		const dx = e.clientX - x;
		const dy = e.clientY - y;
		x = e.clientX;
		y = e.clientY;

		node.dispatchEvent(new CustomEvent('dragmove', {
			detail: { x, y, dx, dy }
		}));
	}

	function handleMouseup(e) {
		// e.stopPropagation();
		// e.preventDefault();
		x = e.clientX;
		y = e.clientY;

		node.dispatchEvent(new CustomEvent('dragend', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove, eventHandlerOptions);
		window.removeEventListener('mouseup', handleMouseup, eventHandlerOptions);
	}

	node.addEventListener('mousedown', handleMousedown, eventHandlerOptions);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown, eventHandlerOptions);
		}
	};
}