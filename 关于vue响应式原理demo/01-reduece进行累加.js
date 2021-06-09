const arr = [3,4,5,6,7]


// let total = 0
// arr.forEach( (item) => {
// 	total += item
// })


// 数组的 reduce 方法 会循环当前的数组，侧重于进行‘滚雪球’操作
// 数组.reduce(函数，初始值)
// const 累加的结果 = 数组.reduce(( 上次的结果，当前循环的item项)=> { return 上次的结果+当前循环的item项} ,0)

const total = arr.reduce( (val , item )=> {return val + item } , 0)

console.log(total)