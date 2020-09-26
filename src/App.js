import React, { useState } from "react"

const Box = ({ row, col, selectBox, isActive }) => (
  <div
    className={`w-5 h-5 border ${
      isActive ? "bg-blue-400" : "bg-white hover:bg-gray-400"
    }`}
    id={`${row}_${col}`}
    onClick={() => selectBox(row, col)}
  ></div>
)

const Grid = ({ grid, selectBox }) => (
  <div
    style={{ width: `${grid.length * 1.25}rem` }}
    className="flex flex-wrap mx-auto mt-4"
  >
    {grid.map((row, i) =>
      row.map((col, j) => (
        <Box
          key={`${i}_${j}`}
          row={i}
          col={j}
          selectBox={selectBox}
          isActive={col}
        />
      ))
    )}
  </div>
)

const generateEmptyGrid = (rows, cols) => {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill(0))
}

function App() {
  const [intervalId, setIntervalId] = useState(null)
  const [generation, setGeneration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [rows, setRows] = useState(20)
  const [cols, setCols] = useState(20)
  const [grid, setGrid] = useState(generateEmptyGrid(rows, cols))

  const isEmpty = grid => {
    return !grid.some(row => row.includes(1))
  }

  const selectBox = (row, col) => {
    if (generation !== 0) setGeneration(0)
    if (!isRunning) pause()

    let newGrid = [...grid]
    newGrid[row][col] = newGrid[row][col] ? 0 : 1
    setGrid(newGrid)
  }

  const seed = () => {
    pause()
    let newGrid = [...grid]
    newGrid.map((row, i) =>
      row.map(
        (col, j) =>
          (newGrid[i][j] = Math.floor(Math.random() * 4) === 1 ? 1 : 0)
      )
    )
    setGrid(newGrid)
  }

  const clear = () => {
    pause()
    setGeneration(0)
    setGrid(generateEmptyGrid(rows, cols))
  }

  const start = () => {
    if (isEmpty(grid)) return
    setIsRunning(true)
    setIntervalId(clearInterval(intervalId))
    setIntervalId(setInterval(gameoflife, speed))
  }

  const pause = () => {
    setIsRunning(false)
    setIntervalId(clearInterval(intervalId))
  }

  const gameoflife = () => {
    setGrid(g => {
      let g2 = clone(g)
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let count = 0
          if (i > 0) if (g[i - 1][j]) count++
          if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++
          if (i > 0 && j < cols - 1) if (g[i - 1][j + 1]) count++
          if (j < cols - 1) if (g[i][j + 1]) count++
          if (j > 0) if (g[i][j - 1]) count++
          if (i < rows - 1) if (g[i + 1][j]) count++
          if (i < rows - 1 && j > 0) if (g[i + 1][j - 1]) count++
          if (i < rows - 1 && j < cols - 1) if (g[i + 1][j + 1]) count++
          if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = 0
          if (!g[i][j] && count === 3) g2[i][j] = 1
        }
      }
      return g2
    })
    setGeneration(g => g + 1)
  }

  // useEffect(() => {
  //   if (isEmpty(grid)) pause()
  // }, [generation])

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Game of Life</h1>
      <div className="space-x-5 text-blue-500">
        <button onClick={!isRunning ? start : pause}>
          {!isRunning ? "Start" : "Pause"}
        </button>
        <button onClick={clear}>Clear</button>
        <button onClick={seed}>Seed</button>
      </div>
      <Grid grid={grid} selectBox={selectBox} />
      <h2 className="font-bold mt-4">Generations: {generation}</h2>
    </div>
  )
}

function clone(arr) {
  return arr.map(row => (Array.isArray(row) ? clone(row) : row))
}

export default App
