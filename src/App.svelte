<script>
	import { onMount, afterUpdate, tick } from 'svelte/internal';
	import items from '@api/items.json';
	import { Rangy } from '@cmp';
	import { Scrolly } from 'svelte-scrolly';
	let index = 0,
		width = 55,
		left = 0;
</script>

<h1>Scrolly [<b>{index}</b>]</h1>
<nav>
	<button on:click={() => (index > 0 ? index-- : null)}>← Prev</button>
	<button on:click={() => (index = 7)}> [7] </button>
	<button on:click={() => (index < items.length - 1 ? index++ : null)}>Next →</button>
</nav>

<Scrolly {items} bind:index bind:width bind:left />

<nav id="bottom">
	<Rangy min="0" max={items.length - 1} step="1" bind:value={index} />
	<Rangy min="10" max="100" step="5" bind:value={width} />
</nav>

<style lang="scss">
	h1 {
		text-align: center;
		color: var(--color-blue);
		b {
			font-weight: inherit;
			color: var(--color-red);
		}
	}
	nav {
		display: flex;
		justify-content: center;
		&#bottom {
			flex-flow: column;
			align-items: center;
		}
		button {
			color: #6f889d;
			background-color: #171d23;
			border: 0;
			margin: 0 5px;
			&:hover,
			&:active {
				color: #da5468;
			}
		}
	}
</style>
