import React, { useEffect, useState } from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import blockedMicrophoneIcon from "../../assets/microphone-block.svg";
import microphoneIcon from "../../assets/microphone.svg";
import sadFace from "../../assets/sad-face.svg";
import { useNavigate, useParams } from "react-router-dom";

export default function VoiceCommand({
	voiceCommandActive,
	setVoiceCommandActive,
	recipe,
	startTimer,
	timers,
	setTimers,
	stepIndex,
	previousStep,
	nextStep,
}) {
	const commands = [
		{
			command: ["Timer * minutes", "Timer * minute"],
			callback: time => setTimer(time),
		},
		{
			command: ["Timer * minutes for *", "Timer * minute for *"],
			callback: (time, task) => setTimer(time, task),
		},
		{
			command: ["Remove timer", "Turn off timer"],
			callback: () => removeTimer(),
		},
		{
			command: ["Previous", "Previous step", "Previous page"],
			callback: () => goToPreviousPage(),
		},
		{
			command: ["Next", "Next step", "Next page"],
			callback: () => goToNextPage(),
		},
		{
			command: [
				"Stop listening",
				"Disable voice command",
				"Disable speech recognition",
			],
			callback: () => disableVoiceCommand(),
		},
		{
			command: ["Finish cooking"],
			callback: () => cancelCooking(),
		},
	];
	const {
		listening,
		transcript,
		browserSupportsSpeechRecognition,
		browserSupportsContinuousListening,
	} = useSpeechRecognition({ commands });

	const navigate = useNavigate();
	const { id } = useParams();

	const speak = text => {
		SpeechRecognition.stopListening();
		var msg = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(msg);
		msg.onend = function () {
			SpeechRecognition.startListening();
		};
	};

	const initialTimers = new Array(recipe.steps.length).fill({
		timer: null,
		timerHasStarted: false,
		endTime: null,
		task: "",
	});

	useEffect(() => {
		if (!voiceCommandActive) return;
		SpeechRecognition.startListening({ continuous: true });

		return SpeechRecognition.stopListening;
	}, [voiceCommandActive]);

	useEffect(() => {
		if (!listening && voiceCommandActive) {
			SpeechRecognition.startListening({ continuous: true });
		}
	}, [listening]);

	if (
		!browserSupportsSpeechRecognition
	) {
		return (
			<div className="no-support">
				<img src={sadFace} alt="sad face" />
				<p>No Browser Support</p>
			</div>
		);
	}

	// if (!isMicrophoneAvailable) {
	//   // Render some fallback content
	// }

	console.log(transcript);

	const setTimer = (time, task = "") => {
		if (timers === undefined) {
			speak("You can't set a timer on this page");
			return;
		}
		if (isNaN(parseInt(time))) {
			speak("please say it again");
			return;
		}
		if (timers[stepIndex].timerInUse) {
			speak(`There is already a timer for this step`);
			return;
		}
		if (time === "one") speak(`Timer set to one minute`);
		else speak(`Timer set to ${time} minutes`);
		startTimer(time, task);
		const timer = setTimeout(() => {
			speak(`Time is up ${task === "" ? "" : `for ${task}`}`);
			setTimers(prev =>
				prev.map((t, i) =>
					i === stepIndex ? { ...t, timer: null, timerInUse: false } : t
				)
			);
		}, time * 1000 * 60);
		setTimers(prev =>
			prev.map((t, i) => (i === stepIndex ? { ...t, timer } : t))
		);
	};

	const removeTimer = () => {
		clearTimeout(timers[stepIndex].timer);
		setTimers(prev =>
			prev.map((t, i) =>
				i === stepIndex ? { ...t, timer: null, timerInUse: false } : t
			)
		);
		speak("Timer is turned off");
	};

	const goToPreviousPage = () => {
		if (!timers) {
			speak("You are on the first page");
			return;
		}
		if (stepIndex > 0) {
			const instruction = recipe.steps[stepIndex - 1].instruction;
			speak(instruction);
		}
		previousStep();
	};

	const goToNextPage = () => {
		if (timers && stepIndex === timers.length - 1) {
			speak("You are on the last page");
			return;
		}
		if (!timers) {
			const instruction = recipe.steps[0].instruction;
			speak(instruction);
			nextStep();
			return;
		}
		const instruction = recipe.steps[stepIndex + 1].instruction;
		speak(instruction);
		nextStep();
	};

	const cancelCooking = () => {
		timers.forEach(t => t.timer && clearTimeout(t.timer));
		disableVoiceCommand();
		setTimers(initialTimers);
		navigate(`/recipes/${id}`);
	};

	const activateVoiceCommand = () => {
		setVoiceCommandActive(true);
		speak("Voice command is active");
	};

	const disableVoiceCommand = () => {
		setVoiceCommandActive(false);
		speak("Voice command is disabled");
		SpeechRecognition.stopListening();
	};

	const controlVoiceCommandWithKeyboard = e => {
		if (e.key === "Enter") {
			if (voiceCommandActive) disableVoiceCommand();
			else activateVoiceCommand();
		}
	};

	return (
		<>
			{voiceCommandActive ? (
				<span className="voice-command-control" 
				role="button" 
				tabIndex="0" 
				onKeyDown={controlVoiceCommandWithKeyboard}
				onClick={disableVoiceCommand}>
					<span className="microphone">
						<img src={microphoneIcon} alt="deactivate voice command" />
					</span>
					<span>Click to deactivate</span>
				</span>
			) : (
				<span className="voice-command-control" 
				role="button" 
				tabIndex="0" 
				onKeyDown={controlVoiceCommandWithKeyboard}
				onClick={activateVoiceCommand}>
					<span className="microphone">
						<img src={blockedMicrophoneIcon} alt="activate voice command" />
					</span>
					<span>Click to activate</span>
				</span>
			)}
		</>
	);
}
