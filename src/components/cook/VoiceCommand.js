import React, {useEffect} from "react";
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import blockedMicrophoneIcon from "../../assets/block-microphone.png";
import microphoneIcon from "../../assets/microphone.png";
import {useNavigate, useParams} from "react-router-dom";

export default function VoiceCommand({voiceCommandActive, setVoiceCommandActive, recipe,
                                       startTimer, timers, setTimers, stepIndex, previousStep, nextStep}) {
  const { speak } = useSpeechSynthesis();
  const commands = [
    {
      command: ["Set timer * minutes", "Set timer * minute"],
      callback: (time) => setTimer(time)
    },
    {
      command: ["Set timer * minutes for *", "Set timer * minute for *"],
      callback: (time, task) => setTimer(time, task)
    },
    {
      command: ["Remove timer"],
      callback: () => removeTimer()
    },
    {
      command: ["Previous", "Previous step", "Previous page"],
      callback: () => goToPreviousPage()
    },
    {
      command: ["Next", "Next step", "Next page"],
      callback: () => goToNextPage()
    },
    {
      command: ["Stop listening", "Disable voice command", "Disable speech recognition"],
      callback: () => disableVoiceCommand()
    },
    {
      command: ["Finish cooking"],
      callback: () => cancelCooking()
    },
  ]
  const {
    listening,
    transcript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening
  } = useSpeechRecognition({ commands });

  const navigate = useNavigate()
  const {id} = useParams()

  const initialTimers = new Array(recipe.steps.length).fill({
    timer: null,
    timerHasStarted: false,
    endTime: null,
    task: ""
  });

  useEffect(() => {
    if (!voiceCommandActive) return;
    SpeechRecognition.startListening({ continuous: true });

    return SpeechRecognition.stopListening
  }, [voiceCommandActive])

  useEffect(() => {
    if (!listening && voiceCommandActive) {
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening])

  if (!browserSupportsSpeechRecognition || !browserSupportsContinuousListening) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // if (!isMicrophoneAvailable) {
  //   // Render some fallback content
  // }

  console.log(transcript)

  const setTimer = (time, task = "") => {
    if (isNaN(parseInt(time))) {
      speak({text: `Please say it again`})
      return;
    }
    if (timers[stepIndex].timerInUse) {
      speak({text: `There is already a timer for this step`})
      return;
    }
    if (time === "one") speak({text: `Timer set to one minute`})
    else speak({text: `Timer set to ${time} minutes`})
    startTimer(time, task)
    const timer = setTimeout(() => {
      speak({text: `Time is up ${task === "" ? "" : `for ${task}`}`})
      setTimers(prev => prev.map((t, i) => i === stepIndex ? {...t, timer: null, timerInUse: false} : t))
    }, time * 1000 * 60)
    setTimers(prev => prev.map((t, i) => i === stepIndex ? {...t, timer} : t))
  }

  const removeTimer = () => {
    clearTimeout(timers[stepIndex].timer)
    setTimers(prev => prev.map((t, i) => i === stepIndex ? {...t, timer: null, timerInUse: false} : t))
  }

  const goToPreviousPage = () => {
    if (!timers) {
      speak({text: "You are on the first page"})
      return;
    }
    if (stepIndex > 0) {
      const instruction = recipe.steps[stepIndex - 1].instruction;
      speak({text: instruction})
    }
    previousStep()
  }

  const goToNextPage = () => {
    if (timers && stepIndex === timers.length - 1) {
      speak({text: "You are on the last page"})
      return;
    }
    if (!timers) {
      const instruction = recipe.steps[0].instruction;
      speak({text: instruction})
      nextStep()
      return;
    }
    const instruction = recipe.steps[stepIndex + 1].instruction
    speak({text: instruction})
    nextStep()
  }

  const cancelCooking = () => {
    timers.forEach(t => t.timer && clearTimeout(t.timer))
    disableVoiceCommand()
    setTimers(initialTimers)
    navigate(`/recipes/${id}`)
  }

  const activateVoiceCommand = () => {
    setVoiceCommandActive(true)
    speak({text: "Voice command is active"})
  }

  const disableVoiceCommand = () => {
    setVoiceCommandActive(false)
    speak({text: "Voice command is disabled"})
    SpeechRecognition.stopListening();
  }

  return (
    <>
      {voiceCommandActive?
        <span className="voice-command-control" onClick={disableVoiceCommand}>
              <span className="microphone">
                <img src={microphoneIcon} alt="deactivate voice command"/>
              </span>
              <span>Click to deactivate</span>
            </span>
        :
        <span className="voice-command-control" onClick={activateVoiceCommand}>
              <span className="microphone">
                <img src={blockedMicrophoneIcon} alt="activate voice command"/>
              </span>
              <span>Click to activate</span>
            </span>
      }
    </>
  )
}