<script>
    import { onMount, afterUpdate, tick, bind } from 'svelte/internal';
    import slides from './api/items.js';
    import { getPhotos, randomQ } from '@api/api.js';
    import { Rangy } from '@cmp';
    import { Scrolly } from 'svelte-scrolly';
    let items = [],
        index = 0,
        limit = 9,
        page = randomQ(0, 90),
        init = false,
        scrolly = {
            wrap: {
                id: 'scrolly',
                width: 100,
                height: 55,
            },
            item: {
                width: 55,
                height: 100,
                gap: 20,
                backimg: true,
                srckey: 'src',
            },
            controls: {
                dotsout: false,
            },
            options: {
                loop: false,
                vertical: false,
            },
        };
    async function loadItems(limit, page) {
        items = await getPhotos(limit, page, 1280, 800);
    }
    $: loadItems(limit, page);
    // onMount(async () => (items = await getPhotos(limit, page, 1280, 800)));

    $: init && (index = 4);
    $: console.log(index, init);
</script>

<h1>Scrolly[<b>{index}</b>]</h1>
<nav id="top">
    <button on:click={() => index--}>←</button>
    <button on:click={() => (index = 4)}>[4]</button>
    <button on:click={() => index++}>→</button>
    <button on:click={() => (scrolly.options.vertical = !scrolly.options.vertical)}
        >{scrolly.options.vertical ? '↕' : '↔'}</button
    >
    <button on:click={() => limit--}>-</button>
    <button on:click={() => (page = randomQ(0, 90))}>reload</button>
    <button on:click={() => limit++}>+</button>
</nav>

<div id="scrolly">
    <Scrolly {...scrolly} bind:index bind:init {items} />
</div>

<nav id="bottom">
    <Rangy min="0" max={items.length - 1} step="1" bind:value={index} />
    <Rangy min="10" max="100" step="5" bind:value={scrolly.item.width} />
</nav>

<style lang="scss">
    h1 {
        text-align: center;
        color: var(--color-blue);
        position: fixed;
        width: 100%;
        z-index: 1;
        b {
            font-weight: inherit;
            color: var(--color-red);
            position: relative;
            top: 3px;
        }
    }
    nav {
        display: flex;
        justify-content: center;
        position: fixed;
        width: 100%;
        z-index: 1;
        &#top {
            top: 90px;
        }
        &#bottom {
            flex-flow: column;
            align-items: center;
            bottom: 0;
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
    #scrolly {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        box-sizing: border-box;
    }
</style>
