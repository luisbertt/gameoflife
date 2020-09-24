import React, { useState, useEffect } from "react"

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

function App() {
  const [intervalId, setIntervalId] = useState(null)
  const [generation, setGeneration] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(100)
  const [rows, setRows] = useState(20)
  const [cols, setCols] = useState(20)
  const [grid, setGrid] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(false))
  )

  const isEmpty = grid => {
    return !grid.some(row => row.includes(true))
  }

  const selectBox = (row, col) => {
    if (generation !== 0) setGeneration(0)
    if (!isPaused) setIsPaused(true)

    let newGrid = [...grid]
    newGrid[row][col] = !newGrid[row][col]
    setGrid(newGrid)
  }

  const seed = () => {
    pause()
    let newGrid = [...grid]
    newGrid.map((row, i) =>
      row.map((col, j) => (newGrid[i][j] = Math.floor(Math.random() * 4) === 1))
    )
    setGrid(newGrid)
  }

  const clear = () => {
    if (!isPaused) pause()
    setGeneration(0)
    setGrid(
      Array(rows)
        .fill()
        .map(() => Array(cols).fill(false))
    )
  }

  const gameoflife = () => {
    let g = grid
    let g2 = [...grid]

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
        if (i < rows - 1 && j < rows - 1) if (g[i + 1][j + 1]) count++
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false
        if (!g[i][j] && count === 3) g2[i][j] = true
      }
    }
    setGrid(g2)
    setGeneration(g => g + 1)
  }

  const start = () => {
    if (isEmpty(grid)) return

    setIsPaused(false)
    setIntervalId(clearInterval(intervalId))
    setIntervalId(setInterval(gameoflife, speed))
  }

  const pause = () => {
    setIsPaused(true)
    setIntervalId(clearInterval(intervalId))
  }

  useEffect(() => {
    if (isEmpty(grid)) pause()
  }, [generation])

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Game of Life</h1>
      <div className="space-x-5 text-blue-500">
        <button onClick={isPaused ? start : pause}>
          {isPaused ? "Start" : "Pause"}
        </button>
        <button onClick={clear}>Clear</button>
        <button onClick={seed}>Seed</button>
      </div>
      <Grid grid={grid} selectBox={selectBox} />
      <h2 className="font-bold mt-4">Generations: {generation}</h2>
    </div>
  )
}

export default App
