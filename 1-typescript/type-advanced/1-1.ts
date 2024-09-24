// TS 고급 타입
// : TS 코드를 줄이는 API성 타입. 유틸리티 타입, 고급 타입, 제네릭 타입으로 불리기도 함

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
