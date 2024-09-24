// TS 맵드 타입
// : 기존 타입의 속성을 새로운 타입으로 만드는 방법
// : 맵드 타입 제안 PR(2016) URL - https://github.com/Microsoft/TypeScript/pull/12114

interface User {
  id: number
  name: string
}

type UserStringMap = {
  [K in keyof User]: string
}

type UserReadonlyMap = {
  [P in keyof User]: Readonly<User[P]>
}

const user: UserReadonlyMap = {
  id: 1,
  name: 'Alice',
}
user.name = 'Bob' // Error! Read only name
