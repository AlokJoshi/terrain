const JITTER = 10
const cellWidth = 1
const cellHeight = 1
let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
context.font = '6px sans-serif';

let n = 16
let s = n * n + 1
canvas.width = s*cellWidth
canvas.height = s*cellHeight
let terr = []
//we add an additional column
//so that the satarting matrix is odd on
//each side
for (let index = 0; index < s; index++) {
  terr.push(Array(s).fill(null))
}
terr[0][0] = 10+randomBetween(-1*JITTER, JITTER)
terr[0][s - 1] =20+randomBetween(-1*JITTER, JITTER)
terr[s - 1][0] = 30+randomBetween(-1*JITTER, JITTER)
terr[s - 1][s - 1] = 40+randomBetween(-1*JITTER, JITTER)

// for(let i =0;i<terr.length;i++){
//   console.log(i,terr[i])
// }

function processArray(size, startRow, startCol,jitterStrength) {

  let endRow = startRow + size - 1
  let endCol = startCol + size - 1
  let text
  // console.log(`Startrow:${startRow}, Endrow:${endRow}`)

  //find middle cell
  let row = (startRow + endRow) / 2
  let col = (startCol + endCol) / 2

  terr[startRow][startCol]+=jitter(jitterStrength)
  terr[startRow][endCol]+=jitter(jitterStrength)
  terr[endRow][startCol]+=jitter(jitterStrength)
  terr[endRow][endCol]+=jitter(jitterStrength)

  //let middleValue = (terr[startRow][startCol] + terr[startRow][endCol] + terr[endRow][startCol] + terr[endRow][endCol]) / 4 + jitter(jitterStrength)
  let middleValue = getAverage([terr[startRow][startCol] , terr[startRow][endCol] , terr[endRow][startCol] , 
    terr[endRow][endCol]])+ jitter(jitterStrength)
  if(!terr[row][col]) terr[row][col]= middleValue 
  text = Math.round(terr[row][col])
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = 'rgb(0,0,0)'
  context.fillText(text, col * cellWidth, 10 + row * cellHeight, 30);
  
  //now work out top middle values
  let topMidValue = getAverage([middleValue , terr[startRow][startCol] , terr[startRow][endCol]])+ jitter(jitterStrength)
  if(!terr[startRow][col])  terr[startRow][col] = topMidValue
  text = Math.round(terr[startRow][col])
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = 'rgb(0,0,0)'
  context.fillText(text, col * cellWidth, 10 + startRow * cellHeight, 30);
  
  //now work out top middle values
  let bottomMidValue = getAverage([middleValue , terr[endRow][startCol] , terr[endRow][endCol]])+ jitter(jitterStrength)
  if(!terr[endRow][col]) terr[endRow][col] = bottomMidValue
  text = Math.round(terr[endRow][col])
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = 'rgb(0,0,0)'
  context.fillText(text, col * cellWidth, 10 + endRow * cellHeight, 30);
  
  //now work out left middle values
  let leftMidValue = getAverage([middleValue , terr[startRow][startCol] , terr[endRow][startCol]])+ jitter(jitterStrength)
  if(!terr[row][startCol]) terr[row][startCol] = leftMidValue
  text = Math.round(terr[row][startCol])
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = 'rgb(0,0,0)'
  context.fillText(text, startCol * cellWidth, 10 + row * cellHeight, 30);
  
  //now work out right middle values
  let rightMidValue = getAverage([middleValue , terr[startRow][endCol] , terr[endRow][endCol]])+ jitter(jitterStrength)
  if(!terr[row][endCol]) terr[row][endCol] = rightMidValue
  text = Math.round(terr[row][endCol])
  context.strokeStyle = 'rgb(0,0,0)'
  context.fillStyle = 'rgb(0,0,0)'
  context.fillText(text, endCol * cellWidth, 10 + row * cellHeight, 30);


  if (size >= 5) {
    jitterStrength = jitterStrength*0.4
    //process left top quadrant
    processArray(Math.floor(size / 2 + 1), startRow, startCol,jitterStrength)
    //process left bottom quadrant
    processArray(Math.floor(size / 2 + 1), row, startCol,jitterStrength)
    //process right top quadrant
    processArray(Math.floor(size / 2 + 1), startRow, col,jitterStrength)
    //process left quadrant
    processArray(Math.floor(size / 2 + 1), row, col,jitterStrength)
  }
}
processArray(s, 0, 0, 1)

function displayTerrain(context, cw, ch, s, terr) {

  let max = -1 * Infinity
  let min = Infinity
  for (let row = 0; row < s; row++) {
    for (let col = 0; col < s; col++) {
      if (terr[row][col] > max) max = terr[row][col]
      if (terr[row][col] < min) min = terr[row][col]
    }
  }
  console.log(`Min:${min}, Max:${max}`)
  let cellWidth = cw/s
  let cellHeight = ch/s
  console.log(`cellWidth: ${cellWidth},cellHeight: ${cellHeight}`)
  for (let row = 0; row < s; row++) {
    for (let col = 0; col < s; col++) {
      let text = Math.round(terr[row][col])
      // terr[row][col] has numbers
      //context.fillStyle = getHSL(terr[row][col] * 360 / (max - min))
      context.fillStyle = getHSL(terr[row][col], min, max)
      context.moveTo(col * cellWidth, row * cellHeight)
      context.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      // context.beginPath();
      // context.arc(col * cellWidth, row * cellHeight, cellWidth, 0, 2*Math.PI);
      // context.fill()

      // console.log(`hsl(${terr[row][col]*360/(max-min)},90%,10%)`)
      // context.strokeStyle = 'rgb(0,0,0)'
      // context.fillStyle = 'rgb(0,0,0)'
      // context.fillText(text, col * cellWidth, 10 + row * cellHeight, 30);

    }
    // const element = array[row];

  }
}

displayTerrain(context, canvas.width, canvas.height, s, terr)
logTerrainSummary(s,terr)

function logTerrainSummary(s,terr){
  let numslices=10
  let values=Array(numslices).fill(0)
  
  for (let row = 0; row < s; row++) {
    for (let col = 0; col < s; col++) {
      // if (terr[row][col] > max) max = terr[row][col]
      // if (terr[row][col] < min) min = terr[row][col]
      switch (true) {
        case terr[row][col] < -JITTER+1*2*JITTER/numslices:
          values[0]++
          break;
        case terr[row][col] < -JITTER+2*2*JITTER/numslices:
          values[1]++
          break;
        case terr[row][col] < -JITTER+3*2*JITTER/numslices:
          values[2]++
          break;
        case terr[row][col] < -JITTER+4*2*JITTER/numslices:
          values[3]++
          break;
        case terr[row][col] < -JITTER+5*2*JITTER/numslices:
          values[4]++
          break;
        case terr[row][col] < -JITTER+6*2*JITTER/numslices:
          values[5]++
          break;
        case terr[row][col] < -JITTER+7*2*JITTER/numslices:
          values[6]++
          break;
        case terr[row][col] < -JITTER+8*2*JITTER/numslices:
          values[7]++
          break;
        case terr[row][col] < -JITTER+9*2*JITTER/numslices:
          values[8]++
          break;
        case terr[row][col] < -JITTER+10*2*JITTER/numslices:
          values[9]++
          break;
        default:
          break;
      }
    }
  }  
  for (let i = 0; i < numslices; i++) {
    console.log(`Below ${MIN_JITTER+(i+1)*(MAX_JITTER-MIN_JITTER)/numslices}:${values[i]}`)
  }
}
// console.log(`${terr}`)
// for(let i = 0; i<=n*n;i++){
//   console.log(`${i}:   ${terr[i]}`)
// }

// window.addEventListener('resize', () => {
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
//   displayTerrain(context, canvas.width, canvas.height, s, terr)
// })
function randomBetween(from, to) {
  return from + Math.random() * (to - from)
}
function jitter(jitterStrength) {
  return randomBetween(-JITTER, JITTER)*jitterStrength
}
function getHSL(value,min,max) {
  return `hsl(${Math.floor(value/5)*5*360/(max-min)},100%,50%)`
  //return `hsl(${value*360/(max-min)},100%,50%)`
}
function getAverage(arr){
  let average = arr.reduce((prevValue,currValue)=>{
      if(currValue){
        prevValue.sum+=currValue
        prevValue.count++
        prevValue.average=prevValue.sum/prevValue.count 
      }
      return prevValue
  },{sum:0,count:0,average:0}).average  
  return average
}
