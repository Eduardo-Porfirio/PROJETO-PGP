const debug = (arg1) => {
    if (typeof arg1 === 'string') {
        console.log(arg1);
    } else if (typeof arg1 === 'object') {
        console.log(JSON.stringify(arg1, null, 2));
    } else {
        console.log(arg1);
    }
}