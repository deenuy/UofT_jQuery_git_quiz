# Interactive Github Quiz using jQuery and JavaScript 
This is a timer-based multiple choice quiz application designed to test the user knowledge on Git commands. The Front end is desiged in HTML with styling in CSS and Bootstrap. The algorithm or logic is implemented in JavaScript and jQuery for user interaction, client storage for scores and user attempt history.

Hosted Url: https://deenuy.github.io/UofT_jQuery_git_quiz/

## This repo contains:
* README.md 
* Index.html
* CSS/style.css for custom styling
* scripts/javascript.js for implementaiton logic
* scripts/quiz-dict.js for multiple-choice questions and answers

## Usage:
The user will be prompted to "Start Quiz" button. Once clicked, timer countdown immediately begins and User will be presented with series of quesionnaire with multiple choice options.

Score is calculated by time remaining. Answering quickly and correctly results in a higher score. Answering incorrectly results in a time penalty (for example, 15 seconds are subtracted from time remaining).

When time runs out and/or all questions are answered, the user is presented with their final score and asked to enter their initials. Their final score and initials are then stored in `localStorage`.