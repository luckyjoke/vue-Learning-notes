class Vue{
	constructor(option){
		this.$data = option.data

		// 调用数据劫持的方法
		Observe(this.$data)


		// 属性代理
		Object.keys(this.$data).forEach( key => {
			Object.defineProperty( this , key , {
				enumerable: true,
				configurable: true,
				get() {
					return this.$data[key]
				},
				set(newVal){
					this.$data[key] = newVal
				}
			})
		})


		// 调用模版编译的函数
		Compile(option.el , this)
	}

}


// 定义一个数据劫持的方法
function Observe(obj){
	if (!obj || typeof obj !== 'object') return
	const dep = new Dep()

	 Object.keys(obj).forEach( key => {
	 	let value = obj[key]

	 	Observe(value)

	 	Object.defineProperty( obj , key , {
	 		enumerable: true,
	 		configurable: true,
	 		get() {
	 			// 只要执行了下面这一行 ，那么刚才 new 的 Watcher实例
	 			// 就被放到 dep.subs 数组中去了
	 			Dep.target && dep.addSub(Dep.target)
	 			return value	
	 		},
	 		set(newVal){
	 			value = newVal
	 			// 新的值也要进行数据劫持绑定
	 			Observe(newVal)
	 			// 通知每一个订阅者更新自己的文本
	 			dep.notify()
	 		}
	 	})
	 })
}


// 对 HTML 结构进行模版编译的方法
function Compile(el , vm){
	// 获取el对应的 DOM 元素
	 vm.$el = document.querySelector(el)

	// 创建文档碎片 ， 提高 DOM 操作的性能
	const fragment = document.createDocumentFragment()


	while(childNode = vm.$el.firstChild){
		fragment.appendChild(childNode)
	}

	// 进行模版的编译
	replace(fragment)


	vm.$el.appendChild(fragment)

	// 负责对DOM模版进行编译的方法
	function replace(node){
		// 定义匹配插值表达式
		const regMustache = /\{\{\s*(\S+)\s*\}\}/


		// 证明当前的 node 节点是一个文本子节点，需要进行正则的替换
		if (node.nodeType === 3) {
			// 文本子节点，也是一个DOM对象，如果要获取文本子节点的字符串内容，需要调用 textContent 属性获取
			const text = node.textContent
			// 进行字符串的正则匹配与提取
			const execResult = regMustache.exec(text)
			if (execResult) {
				// reduce 链式获取对象中的值
				const  value = execResult[1].split('.').reduce( (newObj , key) => { return newObj[key] } , vm)
				node.textContent = text.replace(regMustache , value)
				// 在这个时候，创建 Watcher 类的实例
				new Watcher(vm , execResult[1] , (newVal)=> {
					node.textContent = text.replace(regMustache , newVal)	
				})
			}
			// 终止递归的条件
			return
		}

		// 判断当前的node 节点是否为 input 输入框
		if (node.nodeType === 1 && node.tagName.toUpperCase() === 'INPUT') {
			// 得到当前元素的所有属性节点
			const attrs = Array.from(node.attributes) 
			const findResult = attrs.find( x=> x.name === 'v-model')
			if (findResult) {
				// 获取到当前 v-model 属性的值 
				const expStr = findResult.value.trim()
				console.log(expStr)
				const value = expStr.split('.').reduce((newObj , k )=> newObj[k] , vm)
				node.value = value

				// 创建 Wathcer 的实例
				new Watcher(vm , expStr , (newVal) => {
					node.value = newVal
				})



				// 监听文本框的 input 输入事件，拿到文本框最新的值，把最新的值 ，更新到vm 上即可
				node.addEventListener('input' , (e)=>{
					const keyArr = expStr.split('.')
					const obj = keyArr.slice(0, keyArr.length -1 ).reduce((newObj , k) => newObj[k] , vm)
					obj[keyArr[keyArr.length-1]] = e.target.value
				})
			}


		}



		// 证明不是文本节点， 可能是一个dom元素，需要进行递归处理
		node.childNodes.forEach((child) => replace(child))
	}

}


class Dep{
	constructor(){
		// 今后，所有的watcher 都要存到这个数组中
		this.subs = []
	}

	addSub(watcher){
		this.subs.push(watcher)
	}


	// 负责通知每个 watcher 的方法
	notify(){
		this.subs.forEach( watcher => watcher.update() )
	}

}


// 订阅者的类
class Watcher{
	// cd 回调函数中，记录着当前 Watcher 如何更新自己的文本内容
	// 但是，只是知道如何更新自己还不行，还必须拿到最新的数据，
	// 因此，还需要在 new Watcher 期间，把 vm 也传递进来 （因为 vm 中保存着最新的数据）
	// 除此之外，还需要知道，在vm 身上众多的数据中，哪个数据，才是当前自己所需要的数据，
	// 因此，必须在 new Watcher 期间，指定 watcher 对应的数据的名字
	constructor(vm , key ,cd){
		this.vm = vm
		this.key = key
		this.cd = cd


		// this指向watcher实例
		Dep.target = this
		// reduce从vm中取值, 触发 get
		key.split('.').reduce( (newObj , k)=> newObj[k] , vm)
		Dep.target = null
	}

	// watcher 的实例 ，需要有 update 函数，从而让发布者能够通知我们进行更新
	update(){
		const newVal = 	this.key.split('.').reduce( (newObj , k)=> newObj[k] , this.vm)
		this.cd(newVal)
	}
}