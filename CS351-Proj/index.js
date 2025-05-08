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

function loadUserProfile() {
  const data = JSON.parse(localStorage.getItem('userProfile'));
  if (!data) return;

  const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
  };

  setValue('username', data.username);
  setValue('weight', data.weight);
  setValue('weightUnit', data.weightUnit);
  setValue('height1', data.height1);
  setValue('heightUnit1', data.heightUnit1);
  setValue('height2', data.height2);
  setValue('heightUnit2', data.heightUnit2);
  setValue('goal', data.goal);
  setValue('goalUnit', data.goalUnit);
}

window.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();

  const saveBtn = document.querySelector('.saveButton');
  if (saveBtn) {
      saveBtn.addEventListener('click', saveUserProfile);
  }

  //Exercise tracker logic 
  const dateInput = document.getElementById('date');
  const form = document.getElementById('exerciseForm');
  const addBtn = document.querySelector('#addEx');
  const exerciseCard = document.querySelector('.exerciseCard');
  let exerciseTable = null;

  if (dateInput) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      dateInput.value = formattedDate;

     forwardButton.addEventListener('click', () => {
      const currentDate = new Date(dateInput.value);
      currentDate.setDate(currentDate.getDate() + 1);  
      dateInput.value = currentDate.toISOString().split('T')[0];  
      renderExerciseTable(dateInput.value);  
  });

   backButton.addEventListener('click', () => {
      const currentDate = new Date(dateInput.value);
      currentDate.setDate(currentDate.getDate() - 1);  
      dateInput.value = currentDate.toISOString().split('T')[0];  
      renderExerciseTable(dateInput.value); 
  });

      renderExerciseTable(formattedDate);

      dateInput.addEventListener('input', () => {
          if (!dateInput.value) {
              dateInput.value = formattedDate;
          }
          renderExerciseTable(dateInput.value);
      });

      dateInput.addEventListener('change', (e) => {
          renderExerciseTable(e.target.value);
      });
  }

  if (addBtn && form) {
      addBtn.addEventListener('click', () => {
          form.classList.toggle('hidden');
      });

      form.addEventListener('submit', function (e) {
          e.preventDefault();

          const name = document.getElementById('exerciseName').value;
          const duration = document.getElementById('duration').value;
          const selectedDate = dateInput.value;

          const newExercise = { name, duration };

          let storedData = JSON.parse(localStorage.getItem('exercises')) || {};
          if (!storedData[selectedDate]) {
              storedData[selectedDate] = [];
          }

          storedData[selectedDate].push(newExercise);
          localStorage.setItem('exercises', JSON.stringify(storedData));

          form.reset();
          form.classList.add('hidden');

          renderExerciseTable(selectedDate);
      });
  }

  function renderExerciseTable(date) {
    if (!exerciseCard) return;

    if (exerciseTable) {
        exerciseTable.remove();
        exerciseTable = null;
    }

    const storedData = JSON.parse(localStorage.getItem('exercises')) || {};
    const exercises = storedData[date] || [];

    if (exercises.length === 0) return;

    exerciseTable = document.createElement('table');
    exerciseTable.classList.add('exerciseTable');

    const header = exerciseTable.insertRow();
    header.innerHTML = '<th>Exercise</th><th>Duration (mins)</th>';

     let totalDuration = 0;
    exercises.forEach(ex => {
        const row = exerciseTable.insertRow();
        row.insertCell().textContent = ex.name;
        row.insertCell().textContent = ex.duration;

        totalDuration += parseFloat(ex.duration);  
    });

     const averageDuration = totalDuration / exercises.length;
    const timeAvgElement = document.getElementById('timeAvg');
    if (timeAvgElement) {
        timeAvgElement.textContent = `${averageDuration.toFixed(1)} mins`; 
    }

    exerciseCard.appendChild(exerciseTable);
}


 const weightUpdateDiv = document.querySelector('.weightUpdate');
if (weightUpdateDiv) {
  weightUpdateDiv.addEventListener('click', () => {
    const newWeight = prompt("Enter your current weight in lbs:");
    if (newWeight && !isNaN(newWeight)) {
      const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
      const prevWeight = parseFloat(profile.weight);
      const parsedNewWeight = parseFloat(newWeight);

       let percentChange = null;
      if (!isNaN(prevWeight) && prevWeight > 0) {
           percentChange = ((parsedNewWeight - prevWeight) / prevWeight) * 100;
      }

       const weightLog = JSON.parse(localStorage.getItem('weightHistory')) || [];
      weightLog.push({
          weight: parsedNewWeight,
                      date: new Date().toISOString()
      });
      localStorage.setItem('weightHistory', JSON.stringify(weightLog));

       profile.weight = parsedNewWeight;
      localStorage.setItem('userProfile', JSON.stringify(profile));

       let message = ` `;        
      if (percentChange !== null) {
          const change = percentChange.toFixed(2);
          const direction = change > 0 ? "increase" : "decrease";
          message = ` (${Math.abs(change)}% ${direction} from last entry)`;
      }

       const progressDisplay = document.getElementById('usersProgress');
      if (progressDisplay) {
          progressDisplay.textContent = message;
      }
             renderWeightChart();  
    } else {
        alert("Invalid weight. Please enter a number.");
    }
});
}
  
  

// Show goal weight on dashboard
const userWeightDisplay = document.getElementById('userWeight');
const profile = JSON.parse(localStorage.getItem('userProfile'));

if (profile && profile.goal) {
    const goalUnit = profile.goalUnit || '';
    userWeightDisplay.textContent = `${profile.goal} ${goalUnit}`;
}
});

function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

window.addEventListener('DOMContentLoaded', () => {
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  const bmiElement = document.querySelector('.cardDetail2');

  if (profile && profile.weight && profile.height1) {
      let weight = parseFloat(profile.weight);
      let heightCm;

      // Convert height to cm
      if (profile.heightUnit1 === "cm") {
          heightCm = parseFloat(profile.height1);
      } else if (profile.heightUnit1 === "ft" && profile.heightUnit2 === "in") {
          const feet = parseFloat(profile.height1);
          const inches = parseFloat(profile.height2 || 0);
          heightCm = (feet * 30.48) + (inches * 2.54);
      }

      const bmi = calculateBMI(weight, heightCm);
      if (bmi && bmiElement) {
          bmiElement.textContent = bmi;
      }
  }
});


function renderWeightChart() {
  const rawData = JSON.parse(localStorage.getItem('weightHistory')) || [];

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const filteredData = rawData.filter(entry => new Date(entry.date) >= threeMonthsAgo);

  const labels = filteredData.map(entry => new Date(entry.date).toLocaleDateString());
  const dataPoints = filteredData.map(entry => entry.weight);

  const ctx = document.getElementById('weightChart');
  if (!ctx) return;

  if (window.weightChartInstance) {
      window.weightChartInstance.destroy();
  }

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

// Run on initial load
window.addEventListener('DOMContentLoaded', () => {
  renderWeightChart();
});

document.addEventListener('DOMContentLoaded', () => {
  updateExerciseAverage();
});


