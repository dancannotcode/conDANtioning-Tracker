# ConDantioning Tracker
> Track each exercise, and have the ability to capture your journey

## Table of Contents
* [Overview](#overview)
* [Demo](#demo)
* [Screenshots](#screenshots)
* [Technologies Used](#technologies-used)
* [Setup Instructions](#setup-instructions)
* [How It Works](#how-it-works)
* [Code Snippets](#code-snippets)
* [Features](#features)
* [Status](#status)
* [Contributors](#contributors)
* [Contact](#contact)

## Overview
This program is mean to allow users to track exercises they performed in a daily journal in which is paired with the date the entry was tracked in. Users are allowed to update their weight and are provided visuals as to how their overall health has progressed with graphs and a calcualted BMI.
## Demo
[Video Link]()

## Screenshots
THis shows what the users data would look like as it visualizes the weight progress the user has made. and by clicking on update weight it can add a data point to the graph, and update the BMI
<br>
<img width="1440" alt="The Home page of the website shows the user adding an exercise" src="https://github.com/user-attachments/assets/05073176-9e06-4658-b4a5-5db9dbdf6e8d" />
<br>
Shows what an added data for the user is of and it changes what the average exercise is for the user as well as displays what exercises have been done
<img width="1440" alt="shows what an entry for the date of 06/05/2025 looks like" src="https://github.com/user-attachments/assets/0919e5fe-39ee-44da-b251-2c48285fb51b" />
<br>
This is where users in0put data for the main page to then calculate visuals for the user
 <img width="1440" alt="shows the users progile in w;hich than can input  personal data" src="https://github.com/user-attachments/assets/89de74f6-16d0-42dc-9e70-723552d5c554" />
<br>

## Technologies Used
* HTML
* CSS
* JavaScript 

## Setup Instructions 
2. Install [VS Studio](https://code.visualstudio.com/Download)
3. Run the application
4. click on `Extensions` >> search for `live Server` and install it
5. click on `terminal` tab >> `new terminal` >> copy&paste `git clone https://github.com/dancannotcode/conDANtioning-Tracker.git `
6. open the ConDANtioning-Tracker folder in VS code
7. right click `index.html` >> `open with live server`


## How It Works
1. DashBoard
   * users start on the `DashBoard`, where today's progress is shown(goal,BMI, recent exercises, etc)
   * Navigation tabs on the sidebar allow switching to other pages life profile (other tabs are currently commented out)
   * a profile image links to the user's profile page
2. Profile Setup
   * User data like weight, height, and goal weight is entered and saved via `saveUserProfile()`
   * data is stored in `localStorage` under `userProfile`
   * on page load, `loadUserProfile()` pulls that data and fills in the profile form input, or user opens it for the first time and can input data
3. Exercise Tracker
   * User selects a date using a calender input. The default is always todays date
   * a `plus icon` toggles input form to add an exercises name and duration
   * Exercise data is saved to `localStorage` under the selction date. The table is updated with exercises and the daily average duration is recalculated and displayed.
   * Navigation buttons allow switching between dates to see past/future logs
4. Weight Tracking
   * User can click `Update Weight` to unput a new weight
   * When updating it calculates the percent change form the previous weight
   * Saves to `weightHistory` in `localStorage`
   * display change percentage on the dashboard and automatically updates goal weight display from `userProfile`
5. Chart Visualization
   * a `chart.js` line graph is used to show weight progress over the past 3 months
   * `renderWeightChart()` filters and formats data from `weightHistory` and plots it
   * chart updates automatically when new weights are added
6. BMI Calculation
   * On load, BMI is calcluated using saved weight and height values
   * convers height to cm since on profile page it supports metric system as well
   * displays BMI on the dashbaord
7. State Management and Storage
   * All user-generated data is stored in `localStorage`:
     * `userProfile` -> profile info
     * `exercises` -> daily logs of exercises
     * `weightHistory` -> list of weight entries over time
   * Data is persistent across sessions

## Code Snippets
This code demonstrates as the building block for the rest of the program since the users data is used to create the BMI cards as well as the weight graph card
````javascript
function saveUserProfile() {
  const userData = {
      username: document.getElementById('username').value,
      weight: document.getElementById('weight').value,
      weightUnit: document.getElementById('weightUnit').value,
      height1: document.getElementById('height1').value,
      heightUnit1: document.getElementById('heightUnit1').value,
      height2: document.getElementById('height2').value,
      heightUnit2: document.getElementById('heightUnit2').value,
      goal: document.getElementById('goal').value,
      goalUnit: document.getElementById('goalUnit').value,
  };

  localStorage.setItem('userProfile', JSON.stringify(userData));
}
````
<br>
<br>
This code allows us to display the weight chart for the user to visualize how they progressed and if they reached their goal weight.

````javascript
function renderWeightChart() {
  //Retrive weight history from localStorage, or use an empty array
  const rawData = JSON.parse(localStorage.getItem('weightHistory')) || [];

  //get the date for 3 monts ago from today
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  //fliter entries to include only those within the last 3 months
  const filteredData = rawData.filter(entry => new Date(entry.date) >= threeMonthsAgo);

  //extracts dates and weight for x and y labels
  const labels = filteredData.map(entry => new Date(entry.date).toLocaleDateString());
  const dataPoints = filteredData.map(entry => entry.weight);

  //get the canbas elemet where the chart is renderd and exit if it doesnt exist
  const ctx = document.getElementById('weightChart');
  if (!ctx) return;

  //destroy the prev chart
  if (window.weightChartInstance) {
      window.weightChartInstance.destroy();
  }

  //creates line chart with dataset and css styiling
  window.weightChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Weight (lbs)',
              data: dataPoints,
              borderColor: 'hsl(94, 89%, 40%)',
              color: 'hsl(0, 20%, 84%)', 
              tension: 0.3,
              fill: false
          }]
      },
      options: {
        plugins: {
          legend: {
              labels: {
                  color: 'white'  
              }
          },
          tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
          }
      },
          scales: {
              x: {
                ticks: {
                  color: 'hsl(0, 20%, 84%)'
                },
                  title: {
                      display: true,
                      text: 'Date',
                      color: 'hsl(0, 20%, 84%)'
                  }
              },
              y: {

                ticks: {
                  color: 'hsl(0, 20%, 84%)'
                },
                  title: {
                      display: true,
                      text: 'Weight (lbs)',
                      color: 'hsl(0, 20%, 84%)'
                  }
              }
          }
      }
  });
}
````

## Features
* localStorage 
* easy to use 
* 

### Future Enhancements
* Add more tabs (settings, about page, etc.)
* add more data sets (top exercises, food tracking, etc)
* Improve visuals

## Status
* _Completed_: No further updates planned, but open to feedback and collaboration.

## Challenges
* Creating the visual cards 
* saving data
* deaking with css styling of hidding exercise table until user adds some

## Learnings
* Improve understanding of chart.js.
* Improved skills in debugging.
* Improved skill in Json.
* More practice with CSS.

## Contributors
List all contributors involved in the project:
* [Daniel Ortega Jr](https://github.com/dancannotcode) - Responsible for getting various bits of data to save to the firebase as well as make the enemies spawn on the clicking tab.  

## Contact
Feel free to reach out for collaboration, feedback, or questions.  
**Created by:** Daniel Ortega Jr  

Connect with me:  
* **Email:** [dancannotcode@gmail.com](mailto:dancannotcode@gmail.com)  
* **GitHub:** [dancannotcode](https://github.com/dancannotcode)  
* **LinkedIn:** [Daniel Ortega Jr](https://www.linkedin.com/in/daniel-ortega-jr-4b79b1336/)
