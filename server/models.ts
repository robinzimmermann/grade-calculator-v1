export interface Hello {
  hello: string
}

export interface Grades {
  [subject: string]: {
    teacher: string
    grade: string
    screenTime: number
  }
}
