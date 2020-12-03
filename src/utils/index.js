const LIST_ANSWERS = ['A', 'B', 'C', 'D']
const ANSWER_COLORS = ['rgba(226, 27, 60,0.7)', '#1368ce', '#d89e00', '#26890c']
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

const getLocation = (latestVote) => {
  return ['40%', '30%']
}

export { pairData, getLocation, LIST_ANSWERS, ANSWER_COLORS }
