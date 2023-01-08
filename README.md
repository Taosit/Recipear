# Recipear

Search, follow, create and save recipes.

Live on [https://recipear.netlify.app/](https://recipear.netlify.app/).

## Features

- Search recipes: Whether you are craving for a specific recipe, a regional taste or a sweet flavor, or you just want a new way to use that ingredient sitting in your fridge, it's a good idea to check out the app with its search functionality. You can also choose to see the top or the newest recipes.
- Follow recipes: You probably hate moving your mouse or scrolling you phone in the middle of a meal prep. This app solves the problem with speech recognition. You can ask it to navigate through the steps and set or remove timers. The app will understand and respond to you.
- Create Recipes: Time to share your recipes! Create an account and you're good to go. Creating a recipe is easy with the template, which helps you build your own recipe page. Feel free to edit or add pictures later.
- Save Recipes: Save interesting recipes and come back to cook whenever you feel like it.

## Technologies

- React with JavaScript for writing code.
- Context API for state passing.
- React-router-dom for routing.
- Firebase for authentication, databases and image storage.
- React-speech-recognition for Speech Recognition.
- React-speech-kit for text-to-speech.

## Challenges I had

I expected the most difficult part to be Speech Recognition and that's the reason why I built this app. But I was wrong. Implementing Speech Recognition was fairly easy with the package react-speech-recognition, but I struggled with setting up multiple timers across different pages. I first went ahead with the most straight-forward solution setInterval, which doesn't work properly when after a component unmounts. I then tried a library, but for some reason, new timers would override the existing ones. I finally decided to just rely on the Date object and update each timer every minute sinve it has started.
