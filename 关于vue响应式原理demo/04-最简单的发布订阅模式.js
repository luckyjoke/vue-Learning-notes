
class Dep{
	constructor(){
		// 这个 subs 数组,用来存放所有订阅者的信息
		this.subs = []
	}

	// 向 subs 数组中, 添加订阅者的信息 
	addSub(watcher){
		this.subs.push(watcher)
	}

	// 发布通知的方法 
	notify(){
		this.subs.forEach( watcher => {
			watcher.update()
		})
	}
}



// 订阅者的类
class Watcher {
	constructor(cb){
		this.cb = cb
	}

	// 触发回调的方法
	update() {
		this.cb()
	}
}

const w1 = new Watcher(() => {
	console.log('我是第一个订阅者')
})

const w2 = new Watcher(() => {
	console.log('我是第二个订阅者')
})

const dep = new Dep()

dep.addSub(w1)
dep.addSub(w2)

dep.notify()


