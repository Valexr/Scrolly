<script>
	import { onMount, tick } from 'svelte/internal';
	import { resize, drag, wheel, intersection } from './actions.js';
	import { polyfill } from 'seamless-scroll-polyfill';
	import smoothscroll from 'smoothscroll-polyfill';

	const CHROME = navigator.userAgent.indexOf('Chrome') != -1;
	const FIREFOX = navigator.userAgent.indexOf('Firefox') != -1;
	const SAFARI = navigator.userAgent.indexOf('Safari') != -1;
	// SAFARI && polyfill();
	// SAFARI && smoothscroll.polyfill();

	export let items = [],
		index = 0,
		init = false,
		wrap = {
			id: 'scrolly',
			width: 100,
			height: 100,
		},
		item = {
			width: 50,
			height: 100,
			gap: 20,
			backimg: true,
			srckey: 'src',
		},
		controls = {
			dotsout: false,
		},
		options = {
			loop: false,
			vertical: false,
		};

	$: init = items.length && nodes.length && items.length === nodes.length;
	$: nodes = nodes.filter(Boolean);

	$: console.log(nodes)

	// SCROLL ---------------------------------------------
	let nodes = [],
		scrollintoview = {
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		};

	function scrollIndex(i) {
		SAFARI && polyfill();
		if (i < 0) {
			index = i = 0;
		} else if (i > nodes.length - 1) {
			index = i = nodes.length - 1;
		}
		nodes[i]?.scrollIntoView(scrollintoview);
		// nodes[i]?.focus();
	}
	$: init && scrollIndex(index);

	let isScroll = false,
		spos = 0,
		timer = null,
		ssalign = 'center',
		sstype = 'both mandatory';

	function onScroll(e) {
		isScroll = true;
		spos = options.vertical ? e.target.scrollTop : e.target.scrollLeft;
		// action.direct(spos)
		// action.direct === 'stop' && console.log('directSTOP ||')
		timer !== null && clearTimeout(timer);
		timer = setTimeout(() => {
			isScroll = false;
			// FIREFOX || CHROME && !isDrag && (sstype = 'both mandatory', behavior = 'smooth');
		}, 60);
	}

	let ul = null,
		behavior = 'smooth';

	$: ul?.scroll({
		// ul !== undefined check
		top: pos,
		left: pos,
		behavior: behavior,
	});

	// DIRECTION -------------------------------------------------
	// let p = 0,
	// 	direction = {
	// 		next: false,
	// 		prev: false,
	// 		stop: false,
	// 	};
	// function directionState() {
	// 	if (x === p) {
	// 		direction.stop = true;
	// 		return;
	// 	} else if (x >= p) {
	// 		direction.next = true;
	// 	} else if (x <= p) {
	// 		direction.prev = true;
	// 	}
	// 	p = x;
	// }

	// DRAG ------------------------------------------------------
	let isDrag = false,
		tracker = null,
		htx = 0,
		speed = 0,
		pos = 0;

	function dragStart() {
		isDrag = true;
		behavior = 'auto';
		pos = spos;
		speed = 0;
		sstype = 'none';
		// FIREFOX || (CHROME && (sstype = 'none'));
	}
	function dragMove(e) {
		let dd = options.vertical ? Math.floor(e.detail.dy) : Math.floor(e.detail.dx);
		pos -= dd * 1.6;
		tracker = setInterval(() => (htx = pos), 60);
		speed = (htx - pos) / 60;
	}

	function dragEnd() {
		SAFARI && polyfill();
		isDrag = false;
		behavior = 'smooth';
		pos -= (pos * speed) / 1.6;
		speed = 0;
		clearInterval(tracker);
	}
	$: console.log(spos, pos);

	// WHEEL -----------------------------------------------
	function onWheel(e) {
		// let dw = options.vertical ? Math.floor(-e.detail.dy): Math.floor(-e.detail.dx);
		// pos = spos
		// pos -= -e.detail.dx * 1.6
		// console.log('dw:', dw)
	}

	// KEYS -------------------------------------------------------
	function onKeydown(e) {
		if (e.keyCode === 37 || e.keyCode === 38) {
			e.preventDefault();
			index--;
		} else if (e.keyCode === 39 || e.keyCode === 40) {
			e.preventDefault();
			index++;
		}
	}

	// RESIZE ------------------------------------------------------
	let wrapwidth, wrapheight;
	function resizeWrap(e) {
		wrapwidth = e.detail.CR.width;
		wrapheight = e.detail.CR.height;
		scrollIndex(index);
	}

	// INTERSECTION ------------------------------------------------
	let section = null,
		intersected = [],
		intoptions = {
			root: section,
			rootMargin: '0px',
			threshold: 1.0,
		};
	function onIntersection(e, i) {
		for (const entry of e.detail.entries) {
			if (entry.isIntersecting) {
				intersected = [...new Set([...intersected, i])];
				// index = i;
			} else {
				intersected = intersected.filter((x) => x !== i);
			}
		}
	}
</script>

<section
	id={wrap.id}
	bind:this={section}
	class:vertical={options.vertical}
	class:dotsout={controls.dotsout}
	style="
		--ssalign: {ssalign};
		--sstype: {sstype};
		--ww: {wrap.width}%;
		--wh: {wrap.height}%;
		--liw: {item.width}%;
		--lih: {item.height}%;
		--lig: {item.gap}px;
		--lim: {options.vertical ? 'var(--lig) 0 0 0' : '0 0 0 var(--lig)'};
	"
	use:resize
	on:resize={resizeWrap}
>
	<ul
		id="ul"
		tabindex="0"
		bind:this={ul}
		class="gallery"
		on:scroll={onScroll}
		on:keydown={onKeydown}
		on:click={ul.focus()}
		use:drag
		on:dragstart={dragStart}
		on:dragmove={dragMove}
		on:dragend={dragEnd}
		use:wheel
		on:wheels={onWheel}
	>
		{#if items.length}
			{#each items as itm, i}
				<li
					bind:this={nodes[i]}
					use:intersection={intoptions}
					on:intersection={(e) => onIntersection(e, i)}
					class:active={i === index}
					id={`li${i}`}
					tabindex="-1"
					style={item.backimg === true ? `background-image: url(${itm[item.srckey]})` : null}
				>
					<b>{i}</b>
					{#if item.backimg === false}
						<img alt={itm.id} src={itm.src} />
					{/if}
				</li>
			{/each}
			<li>&nbsp;</li>
		{/if}
	</ul>
	<ul class="dots">
		{#each nodes as dot, i}
			<li class:active={i === index}>
				<button on:click|stopPropagation={() => (index = i)}>
					{i}
				</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	section {
		width: var(--ww);
		height: var(--wh);
		box-sizing: border-box;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	ul {
		margin: 0;
		padding: 0 var(--lig);
		display: flex;
		user-select: none;
		-webkit-user-select: none;
		list-style: none;
		box-sizing: border-box;
	}
	ul > * + * {
		margin: var(--lim);
	}
	ul.gallery {
		width: 100%;
		height: 100%;
		outline: none;
		overscroll-behavior: auto;
		overflow-x: scroll;
		scroll-behavior: auto;
		scroll-padding: 0 var(--lig);
		scroll-snap-stop: always;
		scroll-snap-type: var(--sstype);
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	ul.gallery::-webkit-scrollbar {
		display: none;
	}
	.dotsout ul.gallery {
		height: calc(100% - 50px);
	}
	.vertical ul.gallery {
		flex-direction: column;
	}
	ul.gallery li {
		flex: 1 0 var(--liw);
		width: var(--liw);
		height: var(--lih);
		max-width: 100%;
		position: relative;
		background-color: hsla(0, 0%, 0%, 0.081);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		scroll-snap-align: var(--ssalign);
		box-sizing: border-box;
		border-radius: 1rem;
		overflow: hidden;
	}
	ul.gallery li:focus {
		outline: 3px solid red;
		outline-offset: -3px;
	}
	ul.gallery li:last-child {
		flex: 1 0 var(--lig);
		margin: 0;
		opacity: 0;
		overflow: visible;
		box-sizing: content-box;
	}
	ul.gallery li b {
		position: absolute;
		padding: 1rem;
		margin: 0;
		background-color: rgb(23, 29, 35);
		border-bottom-right-radius: 1rem;
	}
	ul.gallery li img {
		object-fit: cover;
		max-width: 100%;
		height: 100%;
		width: 100%;
	}
	ul.gallery li.active {
		color: rgb(218, 84, 104);
	}
	/* nav {
		overflow-x: scroll;
		text-align: center;
		scrollbar-width: none;
	} */
	ul.dots {
		width: 100%;
		height: 50px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 0;
	}
	ul.dots li {
		margin: 0 5px;
	}
	ul.dots li button {
		color: rgb(235, 191, 131);
		color: rgb(111, 136, 157);
		background-color: transparent;
		background-color: rgb(23, 29, 35);
		border: 0;
		margin: 0;
		padding: 0;
		width: 27px;
		height: 27px;
	}
	ul.dots li button:active {
		color: #eb5757;
	}
	ul.dots li.active button {
		color: #eb5757;
	}
</style>
