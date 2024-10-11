/**
 * Service用来处理逻辑，返回结果给Controller
 */
class HomeService {
  hello() {
    return new Promise((resolve) => resolve('hello world'))
  }

  helloName(name: string) {
    return Promise.resolve({
      data: `你好，${name}!`,
    })
  }
}

export default new HomeService()
