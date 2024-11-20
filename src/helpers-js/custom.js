var swiper = new Swiper(".mySwiper", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
  });

  var swiper = new Swiper(".sleepSwiper", {
    loop: true,
    spaceBetween: 6,
    breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.1
        },
        // when window width is >= 480px
        375: {
          slidesPerView: 2.1,
        },
      }
  });


  var swiper = new Swiper(".mainSwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  var swiper = new Swiper(".placeSwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  var swiper = new Swiper(".reviewsSwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  }); 
   var swiper = new Swiper(".selenareviewsSwiper", {
    spaceBetween: 8,
    slidesPerView: 1.2,
    loop: true,
  });  
   var swiper = new Swiper(".deboraheviewsSwiper", {
    spaceBetween: 16,
    slidesPerView: 1.6,
    loop: true,
  });

  document.addEventListener("DOMContentLoaded", function() {
    const countrySelect = document.getElementById("country");
    
    // Set default selection if needed
    countrySelect.value = "+46"; // Set Sweden as default
});

const daysGrid = document.getElementById('daysGrid');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
  daysGrid.innerHTML = '';  // Clear previous days

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  monthYear.innerText = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Add empty slots for days before the first day
  for (let i = 0; i < firstDay; i++) {
    daysGrid.innerHTML += `<div></div>`;
  }

  // Add each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date().toDateString() === new Date(year, month, day).toDateString();
    daysGrid.innerHTML += `<div class="p-2 ${today ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'} rounded-lg">${day}</div>`;
  }
}

// Change month functions
prevMonth.addEventListener('click', () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonth.addEventListener('click', () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
});

// Initialize calendar
renderCalendar(currentMonth, currentYear);