function filterDuplicates(array) {
  let tempSet = new Set(array)
  let filtered = Array.from(tempSet)    

  return filtered
}


export default filterDuplicates