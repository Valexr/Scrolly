let p = 0,
    next = false,
    prev = false,
    stop = false

export function direction(x) {
    if (x === p) {
        stop = true;
        console.log('| stop |');
        return;
    } else if (x >= p) {
        next = true;
        console.log('next >>');
    } else if (x <= p) {
        prev = true;
        console.log('<< prev');
    }
    p = x;
}