// TS 고급 타입
// : TS 코드를 줄이는 API성 타입. 유틸리티 타입, 고급 타입, 제네릭 타입으로 불리기도 함
// : 유틸리티 타입은 아래 Omit까지 이외에도 더 많음. 필요 시 다음 사이트 참고할 것 (https://www.typescriptlang.org/docs/handbook/utility-types.html)

// - Partial: 객체의 모든 프로퍼티를 선택적으로 만드는 타입 (모든 속성을 가져오고 선택함)
interface User {
  id: string
  name: string
  email: string
}

const updateUser = (userId: number, userUpdates: Partial<User>) => {
  // userUpdates는 id, name, email 중 일부만 포함되어도 가능
}
updateUser(1, { name: 'wang' })

// - Pick: 객체의 특정 프로퍼티만 선택하여 새로운 타입 (원하는 속성만 뽑아냄)
interface Product {
  id: string
  name: string
  type: string
  price: number
  stock: number
}
// :: displayProductDetail를 위해서 인터페이스에 중복 코드 발생! => TS 유틸리티 API성 타입, Pick 활용하여 해결함
// interface ProductDetail {
//   id: string
//   name: string
// }

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('url')
  if (!response.ok) {
    throw Error('Response was not ok')
  }
  const products = await response.json()
  return products
}

type ShoppingItem = Pick<Product, 'id' | 'name'>
function displayProductDetail(shoppingItem: ShoppingItem) {
  // ...
}

// - Omit: 특정 프로퍼티를 제외한 새로운 타입 (선택한 프로퍼티를 제외하고 나머지)
interface Book {
  id: number
  type: string
  author: string
  description: string
  image: string
  genre: string
}

type BookWithoutGenre = Omit<Book, 'genre'>
