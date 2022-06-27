import React from "react";
import {useState, useEffect} from "react";
import alarm from "../../assets/alarm.mp3"

export default function Timer({timers, setTimers, stepIndex, voiceCommandActive}) {
  const [timer, setTimer] = useState(null)
  const [audio] = useState(new Audio(alarm));

  useEffect(() => {
    setTimer(timers[stepIndex])
  }, [stepIndex])

  const initialTime = Math.max(0, Math.round((timers[stepIndex].endTime - new Date().getTime()) / (1000 * 60)))

  const [timeInMinutes, setTimeInMinutes] = useState(initialTime)

  useEffect(() => {
    setTimeInMinutes(Math.max(0, Math.round((timers[stepIndex].endTime - new Date().getTime()) / (1000 * 60))))
  }, [timer])

  const interval = setInterval(() => {
    setTimeInMinutes(Math.max(0, Math.round((timers[stepIndex].endTime - new Date().getTime()) / (1000 * 60))))
  }, 1000 * 60)

  useEffect(() => {
    if (timeInMinutes) return;
    if (!voiceCommandActive) audio.play();
    clearInterval(interval)
    return clearInterval(interval)
  }, [timeInMinutes])

  return (

      <span className="remaining-time">
          <span className="remaining-time-value">{timeInMinutes} mins</span> remaining
      </span>
  )
}