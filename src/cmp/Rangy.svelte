<script>
    export let value = 0,
        min = 0,
        max = 100,
        step = 1,
        outputstyle = '',
        id = '',
        thumbsize = 18,
        output = false

    function onInput() {
        output = true
        const newVal = Number(((value - min) * 100) / (max - min));
        outputstyle = `left: calc(${newVal}% + (${thumbsize/2 - newVal * (thumbsize/100)}px))`;
    }
    $: value && onInput();
    $: value <= min ? (value = min) : value >= max ? (value = max) : (value = value);
</script>

<fieldset style="--thumbsize: {thumbsize}px">
    <label>
        <!-- {#if output} -->
            <output style={outputstyle}>{value}</output>
        <!-- {/if} -->
        <input {id} type="range" {min} {max} {step} bind:value on:change={()=>output = false} on:input={onInput} />
    </label>
</fieldset>

<style>
    fieldset {
        border: 0;
        display: flex;
        justify-content: center;
        flex-flow: column;
        align-items: center;
    }
    label {
        display: flex;
        height: 50px;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    output {
        height: 25px;
        line-height: 15px;
        box-sizing: border-box;
        background: #171d23;
        color: white;
        padding: 5px 10px;
        position: absolute;
        border-radius: 4px;
        left: 50%;
        top: calc((var(--thumbsize) / -2) - 5px);
        transform: translateX(-50%);
    }
    output::after {
        content: '';
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #171d23;
        bottom: -5px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    input[type='range'] {
        background-color: #171d23;
        box-sizing: border-box;
        font-family: inherit;
        height: 3px;
        margin: 0;
        outline: none;
        width: 250px;
        font-size: 1px;
        border: 0;
        -webkit-appearance: none;
        appearance: none;
        padding: 0;
        position: relative;
        overflow: visible;
    }
    input[type='range']::-moz-range-thumb {
        background-color: #eb5757;
        box-sizing: border-box;
        width: var(--thumbsize);
        height: var(--thumbsize);
        border-radius: 100%;
        transform: translateX(calc(var(--value) - 50%));
        border: 0;
        position: relative;
        appearance: none;
        /* border-left: 18px solid transparent; */
        /* border-righ/t: 18px solid transparent; */
        /* border-bottom: 18px solid #eb5757; */
        /* background: transparent; */
    }
    input[type='range']::-webkit-slider-thumb {
        background-color: #eb5757;
        box-sizing: border-box;
        width: var(--thumbsize);
        height: var(--thumbsize);
        border-radius: 100%;
        transform: translateX(calc(var(--value) - 50%));
        border: 0;
        position: relative;
        appearance: none;
        /* border-left: 18px solid transparent; */
        /* border-right: 18px solid transparent; */
        /* border-bottom: 18px solid #eb5757; */
        /* background: transparent; */
    }
    input[type='range']:focus::-moz-range-thumb,
    input[type='range']:focus::-webkit-slider-thumb {
        
        /* background-color: transparent; */
    }
    input[type='range']:active::-moz-range-thumb,
    input[type='range']:active::-webkit-slider-thumb {
        /* --thumbsize: 27px */
    }
    input[type='range']::-moz-range-track,
    input[type='range']::-webkit-slider-runnable-track {
        background: transparent;
        background-size: 100%;
        box-sizing: border-box;
        height: 100%;
    }

    input[type='range'],
    input[type='range']::-webkit-slider-runnable-track,
    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
    }
</style>
