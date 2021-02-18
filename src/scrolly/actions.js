export function drag(node) {
    const eventHandlerOptions = { passive: false };
    let x = 0, y = 0

    function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

    function handleMousedown(e) {
        // e.stopPropagation();
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
        // e.stopPropagation();
        e.preventDefault();
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
        e.preventDefault();
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

export function wheel(node) {
    let dx = 0, dy = 0

    function handleWheel(e) {
        if ((navigator.platform.indexOf('Win') > -1) && e.shiftKey) {
            dx = e.deltaY;
        } else {
            dx = e.deltaX;
            dy = e.deltaY;
        }
        // if (dx !== 0) {
        //     e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        // }
        node.dispatchEvent(new CustomEvent('wheels', {
            detail: { dx, dy }
        }));
    }

    node.addEventListener('wheel', handleWheel, { passive: false });

    return {
        destroy() {
            node.removeEventListener('wheel', handleWheel);
        }
    };
};

// window.addEventListener("gesturestart", function (e) {
//     e.preventDefault();
//     startX = e.pageX - posX;
//     startY = e.pageY - posY;
//     gestureStartRotation = rotation;
//     gestureStartScale = scale;
// });

// window.addEventListener("gesturechange", function (e) {
//     e.preventDefault();

//     rotation = gestureStartRotation + e.rotation;
//     scale = gestureStartScale * e.scale;

//     posX = e.pageX - startX;
//     posY = e.pageY - startY;

//     render();

// })

// window.addEventListener("gestureend", function (e) {
//     e.preventDefault();
// });

// MIDDLE-CLICK ----------------------------------------------
// document.body.onclick = function (e) {
//     if (e && (e.which == 2 || e.button == 4)) {
//         console.log('middleclicked')
//     }
// }

export function resize(node) {
    let CR
    let ET

    const ro = new ResizeObserver((entries, observer) => {
        for (let entry of entries) {
            CR = entry.contentRect
            ET = entry.target
        }
        node.dispatchEvent(new CustomEvent('resize', {
            detail: { CR, ET }
        }));
    });

    ro.observe(node);

    return {
        destroy() {
            ro.disconnect();
        }
    }
}

export function intersection(node, options) {
    const observer = new IntersectionObserver((entries, observer) => {
        node.dispatchEvent(new CustomEvent('intersection', {
            detail: { entries, observer }
        }));
    }, options);
    // console.log(options)

    observer.observe(node);
    // function update() {
    //     destroy();
    //     observer.observe(node);
    // }

    function destroy() {
        observer.disconnect();
    }
    // init ? update({ init }) : update()

    return { destroy, };
}

// KEYS -------------------------------------------------------
export function keydown(e, i) {
    // e.preventDefault();
    if (e.keyCode === 37 || e.keyCode === 38) {
        // e.preventDefault();
        i--;
    } else if (e.keyCode === 39 || e.keyCode === 40) {
        // e.preventDefault();
        i++;
    }
}

// DIRECTION --------------------------------------------------
let p = 0

export function direct(x) {
    if (x === p) {
        console.log('directSTOP ||')
        return 'stop';
    } else if (x >= p) {
        return 'next';
    } else if (x <= p) {
        return 'prev';
    }
    p = x;
}