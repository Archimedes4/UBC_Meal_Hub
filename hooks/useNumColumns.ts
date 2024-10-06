import { useMemo } from "react"
import { useWindowDimensions } from "react-native"

export default function useNumColumns() {
  const {width} = useWindowDimensions()
  return useMemo(() => {
    const num = Math.floor(width/220)
    if (num === 1 && width >= 265) {
      return 2
    }
    if (num === 0) {
      return num
    }
    return num
  }, [width])
}