const obj = {
	name: 'zs',
	info: {
		address:{
			location : '北京顺义'
		}
	}
}


const attrStr = 'info.address.location'

const location = attrStr.split('.').reduce( (newObj , key) => newObj[key], obj)
console.log(location)