/**
 * Created by jasonxu on 2018/8/22.
 */
async function typeStrict(types, args) {
  for (var i = 0; i < args.length; i++) {
    if (typeof (args[i]) == "undefined") {
      return {
        status: false,
        message: `Invalid argument type with ${i + 1}nd arg : undefined`
      }
    }
    if (args[i].constructor != types[i]) {
      return {
        status: false,
        message: `Invalid argument type. Expected: ${types[i].name}, received: ${args[i].constructor.name} instead.`
      }
    }
  }
  return {status: true, message: '类型检测通过'}
}

module.exports = typeStrict
