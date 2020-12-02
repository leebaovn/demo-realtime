const LIST_ANSWERS = ['A', 'B', 'C', 'D']
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

export { pairData, getLocation, LIST_ANSWERS }
