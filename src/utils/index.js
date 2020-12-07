const LIST_ANSWERS = ['A', 'B', 'C', 'D']
const ANSWER_COLORS = ['#60ED55', '#FADD66', '#55A2ED', '#CD55FA']
const pairData = (arrData = []) => {
  if (arrData.length > 0) {
    let arr = {}
    LIST_ANSWERS.forEach((ans) => {
      arr[ans] = 0
    })

    arrData?.forEach((ans) => {
      if (LIST_ANSWERS.includes(ans)) {
        arr[ans] = arr[ans] + 1
      }
    })
    return arr
  }
}

const getLocation = () => {
  return ['40%', '30%']
}

const configConfetti = {
  angle: '92',
  spread: 360,
  startVelocity: 20,
  elementCount: '165',
  dragFriction: 0.12,
  duration: '3000',
  stagger: 3,
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}

const countAns = (objData) => {
  let totalCount = 0
  for (const count in objData) {
    totalCount += objData[count]
  }
  return totalCount
}

export {
  pairData,
  getLocation,
  LIST_ANSWERS,
  ANSWER_COLORS,
  configConfetti,
  randomInRange,
  countAns,
}
