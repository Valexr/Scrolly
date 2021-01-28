<script>
	import { onMount, tick } from 'svelte/internal';
	import { drag } from './drag.js';
	import { resize } from './resize.js';
	import { browser } from './browser.js';
	import { intersection } from './intersection.js';
	import { polyfill } from 'seamless-scroll-polyfill';
	if (browser() === 'safari') polyfill();

	export let items = [],
		top = 0,
		left = 0,
		behavior = 'smooth',
		index = 0,
		width = 50,
		scrollIntoViewOptions = {
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		};

	onMount(() => {
		items.length && (index = 7);
		// behavior = 'smooth';
		browser();
		dots = nodes;
	});

	function scrollIndex(i) {
		nodes.length && nodes[i].scrollIntoView(scrollIntoViewOptions);
		// iscroll = true;
	}
	$: scrollIndex(index);

	let wrap,
		ul,
		nodes = [],
		dots = [],
		x = 0,
		ssalign = 'center',
		sstype = 'both mandatory',
		timer = null,
		isdrag = false,
		tracker = null,
		htx = 0,
		speed = 0,
		isscroll = false;

	function onScroll(e) {
		directionState();
		x = e.target.scrollLeft;
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			// console.log('scrollStop');
			// left = x;
			// isscroll = false;
		}, 100);
	}

	async function scrollto(top, left, behavior) {
		ul &&
			ul.scrollTo({
				top: top,
				left: left,
				behavior: behavior,
			});
		// console.log('scrollto');
	}
	$: scrollto(top, left, behavior);

	let p = 0,
		direction = {
			next: false,
			prev: false,
			stop: false,
		};
	function directionState() {
		if (x === p) {
			direction.stop = true;
			console.log('| stop |');
			return;
		} else if (x >= p) {
			direction.next = true;
			console.log('next >>');
		} else if (x <= p) {
			direction.prev = true;
			console.log('<< prev');
		}
		p = x;
	}

	function dragStart() {
		isdrag = true;
		left = x;
		behavior = 'auto';
		sstype = null;
		// browser() === 'firefox' || browser() === 'chrome' ? (sstype = null) : null;
	}

	function dragMove(e) {
		left -= e.detail.dx * 1.6;
		tracker = setInterval(() => (htx = left), 60);
		speed = (x - left) / 60;
	}

	function dragEnd() {
		clearInterval(tracker);
		left -= x * (speed / 6);
		behavior = 'smooth';
		speed = 0;
		tick().then(() => {
			// top = 0;
			// left += x * direction.prev ? -speed : speed;
			// direction.stop && (sstype = 'both mandatory');
			// clearInterval(tracker);
			// speed = 0;
			// left = x;
		});
	}

	let wrapwidth, wrapheight;
	function resizeWrap(e) {
		wrapwidth = e.detail.CR.width;
		wrapheight = e.detail.CR.height;
		scrollIndex(index);
	}

	let intersected = [],
		intoptions = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0,
		},
		intinit = true;
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

	// $: console.log(left, x, ssalign, browser(), speed, index);
	// $: console.log(nodes, dots);
</script>

<!-- <svelte:window on:scroll|preventDefault /> -->
<section
	style="--ssalign: {ssalign}; --sstype: {sstype}; --ligap: 20px"
	bind:this={wrap}
	use:resize
	on:resize={resizeWrap}
>
	<ul
		class="gallery"
		bind:this={ul}
		on:scroll={onScroll}
		use:drag
		on:dragstart={dragStart}
		on:dragmove={dragMove}
		on:dragend={dragEnd}
	>
		{#if items}
			{#each items as item, i}
				<li
					bind:this={nodes[i]}
					use:intersection={{ ...intoptions }}
					on:intersection={(e) => onIntersection(e, i)}
					class:active={i === index}
					style="background-image: url({item.src}); --width: {width}%"
				>
					<b>{i}</b>
					<!-- <img alt={item.id} src={item.src} /> -->
					<!-- use:intersection={{ ...intoptions }}
					on:intersection={(e) => onIntersection(e, i)} -->
				</li>
			{/each}
			<li>&nbsp;</li>
		{/if}
	</ul>
</section>
<nav>
	<ul class="dots">
		{#each dots as dot, i}
			<li class:active={i === index}>
				<button on:click={() => (index = i)}>
					{i}
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	:global(body) {
		overflow: hidden;
	}
	section {
		width: 100%;
		height: 50%;
		margin: var(--ligap) 0;
		box-sizing: border-box;
	}
	ul {
		height: 100%;
		margin: 0;
		padding: 0 var(--ligap);
		display: flex;
		width: 100%;
		user-select: none;
		-webkit-user-select: none;
		list-style: none;
		box-sizing: border-box;
	}
	ul > * + * {
		margin: 0 0 0 var(--ligap);
	}
	ul.gallery {
		overscroll-behavior: auto;
		overflow-x: scroll;
		scroll-behavior: auto;
		scroll-padding: 0 var(--ligap);
		scroll-snap-stop: always;
		scroll-snap-type: var(--sstype);
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: none;
		scrollbar-width: none;
		/* transform: translateZ(-1px); */
	}
	ul.gallery::-webkit-scrollbar {
		display: none;
	}
	ul.gallery li:last-child {
		flex: 1 0 auto;
		margin: 0 0 0 calc(var(--ligap) - 4px);
		overflow: visible;
		opacity: 0;
		box-sizing: content-box;
	}
	ul.gallery li {
		flex: 1 0 var(--width);
		max-width: 100%;
		position: relative;
		background-color: hsla(0, 0%, 0%, 0.081);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		scroll-snap-align: var(--ssalign);
		box-sizing: content-box;
		border-radius: 1rem;
		overflow: hidden;
		/* transform: translateZ(-1px); */
		/* will-change: auto; */
	}
	ul.gallery li b {
		position: absolute;
		padding: 1rem;
		margin: 0;
		background-color: rgb(23, 29, 35);
		border-bottom-right-radius: 1rem;
	}
	/* ul.gallery li img {
		object-fit: cover;
		max-width: 100%;
		height: 100%;
		width: 100%;
	} */
	ul.gallery li.active {
		color: rgb(218, 84, 104);
	}
	nav {
		overflow-x: scroll;
		text-align: center;
		scrollbar-width: none;
	}
	ul.dots {
		width: auto;
		height: 50px;
		display: inline-flex;
		align-items: center;
	}
	ul.dots li {
		margin: 0 5px;
		/* display: inline-block; */
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
		color: rgb(218, 84, 104);
	}
	ul.dots li.active button {
		color: rgb(218, 84, 104);
	}
</style>
