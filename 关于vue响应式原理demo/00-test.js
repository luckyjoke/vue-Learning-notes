const obj = {
	name:'zs'
}


let val = obj.name
Object.defineProperty( obj , 'name' , {
	get() {
		console.log(`you try get value  ${val}`)
		return val
	},
	set(newVal) {
		if (val === newVal) return
		console.log(`you try set value -> ${newVal}`)
		val = newVal
	}
})	


console.log(obj.name)
obj.name = 'ls'
