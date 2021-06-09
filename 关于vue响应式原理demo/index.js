const obj = {
	a: 1,
	b: {
		c: 2
	}
}


function observe( data ){
	if ( typeof data !== 'object') return
	new Observer(data)
}

// 创建Observer类遍历 对象
class Observer {
	constructor( value ){
		this.value = value
		this.walk()
	}
	walk(){
		for( let key in this.value) {
			defineReactive( this.value , key )
		}
	}
}

// 变成响应式
function defineReactive( data , key , val = data[key]) {
	observe(val)
	Object.defineProperty( obj , key , {
		get() {
			console.log(`you try get value  ${val}`)
			return val
		},
		set(newVal) {
			if ( newVal == val ) return 
			console.log(`you set value  ${newVal}`)
			val = newVal
		}
	})	
}


observe(obj)
console.log(obj.a)
obj.a = 2
console.log(obj.a)
console.log(obj.b.c)
obj.b.c = 3
console.log(obj.b.c)






