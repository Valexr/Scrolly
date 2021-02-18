export function intersection(node, { init, ...options }) {
    const observer = new IntersectionObserver((entries, observer) => {
        node.dispatchEvent(new CustomEvent('intersection', {
            detail: { entries, observer }
        }));
    }, options);
    // console.log(options)

    function update() {
        destroy();
        observer.observe(node);
    }

    function destroy() {
        observer.disconnect();
    }
    init ? update({ init }) : update()

    return { update, destroy, };
}