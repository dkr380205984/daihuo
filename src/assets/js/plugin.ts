const plugin = {
  /************************************
   *data:需要判断类型的数据
   *type:all
   *return:String|Number|Null|Undefined|Object|Array|Function
   ***********************************/
  getDataType(data: any) {
    if (data === null) {
      return 'Null'
    } else if (data === undefined) {
      return 'Undefined'
    }
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  },
  /************************************
   *data:需要深度克隆的数据
  *type:all
  *return:data
  ***********************************/
  clone<T extends any[]>(data: T): T {
    const selfThis = plugin
    const type = selfThis.getDataType(data)
    let newData = null
    if (type === 'Array') {
      newData = [] as any
      data.forEach((item: any, index: any) => {
        newData[index] = selfThis.clone(item)
      })
    } else if (type === 'Object') {
      newData = {} as any
      let index: any
      for (index of Object.keys(data)) {
        newData[index] = selfThis.clone(data[index])
      }
    } else {
      newData = data ? JSON.parse(JSON.stringify(data)) : data
    }
    return newData
  }
}
export default plugin
