export default interface IZid {
  bricks: {
    question: string,
    answers: string[],
    correctAnswer: string
  }[],
  famousPerson: string,
  imagePath: string
}