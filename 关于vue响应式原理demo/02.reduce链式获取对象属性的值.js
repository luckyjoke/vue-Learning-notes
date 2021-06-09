const obj = {
	name: 'zs',
	info: {
		address:{
			location : '北京顺义'
		}
	}
}


const attrs = ['info' , 'address' , 'location']

// obj.info.address.location
const res = attrs.reduce( (newObj , key ) =>  newObj[key] , obj )
console.log(res)