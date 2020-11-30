let customers = [1, 0, 1, 2, 1, 1, 7, 5];
let grumpy = [0, 1, 0, 1, 0, 1, 0, 1];
grumpy = customers.map((c, i) => c * grumpy[i]);
console.log(grumpy);
