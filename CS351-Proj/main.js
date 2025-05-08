const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

document.querySelector('#date').value = formattedDate;

document.querySelector('#date').addEventListener('change', (e) => {
    console.log('New date selected:', e.target.value);
}); 

document.querySelector('#addEx').addEventListener('click', function () {
    const form = document.getElementById('exerciseForm');
    form.classList.toggle('hidden');
  });

  const dateInput = document.getElementById('date');
  const thisIsToday = new Date().toISOString().split('T')[0];
  
  dateInput.addEventListener('input', () => {
    if (!dateInput.value) {
      dateInput.value = thisIsToday;  
    }
  });
  

  
