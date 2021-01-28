<script>
    export let value = 0,
        min = 0,
        max = 100,
        step = 1,
        outputstyle = '',
        id = '';

    async function onRangeInput() {
        const newVal = Number(((value - min) * 100) / (max - min));
        outputstyle = `left: calc(${newVal}% + (${18 - newVal * 0.36}px))`;
    }
    $: value, onRangeInput();
</script>

<fieldset>
    <label>
        <output style={outputstyle}>{value}</output>
        <input {id} type="range" {min} {max} {step} bind:value on:input={onRangeInput} />
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
        background: #171d23;
        color: white;
        padding: 4px 12px;
        position: absolute;
        border-radius: 4px;
        left: 50%;
        top: 0;
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
        background-color: #da5468;
        box-sizing: border-box;
        width: 27px;
        height: 40px;
        border-radius: 100%;
        transform: translateX(calc(var(--value) - 50%));
        border: 0;
        position: relative;
        appearance: none;
        width: 0;
        /* height: 0; */
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 18px solid #da5468;
        background: transparent;
        margin-bottom: -100px;
        top: -10px;
    }
    input[type='range']::-webkit-slider-thumb {
        background-color: #da5468;
        box-sizing: border-box;
        width: 27px;
        height: 27px;
        border-radius: 100%;
        transform: translateX(calc(var(--value) - 50%));
        border: 0;
        position: relative;
        appearance: none;
        width: 0;
        /* height: 0; */
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 18px solid #da5468;
        background: transparent;
        margin-bottom: -100px;
        top: -10px;
    }
    input[type='range']:focus::-moz-range-thumb,
    input[type='range']:focus::-webkit-slider-thumb {
        background-color: transparent;
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
