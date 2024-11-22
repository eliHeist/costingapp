export function previewImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const preview = document.getElementById("preview");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e: ProgressEvent<FileReader>) {
            const img = document.createElement("img");
            img.src = e.target?.result as string;
            img.alt = "Preview";
            img.className = "rounded-lg w-full h-48 object-cover";
            if (preview) {
                preview.innerHTML = "";
                preview.appendChild(img);
                preview.classList.remove("hidden");
            }
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        if (preview) {
            preview.innerHTML = "";
            preview.classList.add("hidden");
        }
    }
}

export function datePicker() {
    const date_pickers = document.querySelectorAll('.datePickerInput') as NodeListOf<HTMLInputElement>;

    console.log(date_pickers)

    date_pickers.forEach(date_picker => {
        setDefaultDate(date_picker);
        date_picker.addEventListener('click', function () {
            const datepickerContainer = date_picker.parentElement?.nextElementSibling as HTMLElement;
            datepickerContainer.classList.toggle('datepicker-visible');
            showDatePicker(date_picker, datepickerContainer);

            // document.addEventListener('click', function (event) {
            //     if (!datepickerContainer.contains(event.target as Node)) {
            //         datepickerContainer.classList.remove('datepicker-visible');
            //     }
            // })
        });
    });
}



function setDefaultDate(date_picker: HTMLInputElement) {
    date_picker.value = currentDate();
}

export function currentDate() {
    const today = new Date();
    const day = today.toString().slice(0, 3);
    const date = today.getDate().toString().padStart(2, '0');
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear().toString();
    return `${day} . ${date} . ${month} . ${year}`;
}

// Custom datepicker functionality: Show the datepicker UI for the clicked input.
function showDatePicker(datePickerInput: HTMLInputElement, datepickerContainer: HTMLElement) {
    // Clear the previous datepicker content.
    datepickerContainer.innerHTML = '';

    // Get the selected date (if any).
    const selectedDate = new Date(datePickerInput.value);

    // Create the datepicker UI.
    const datePickerUI = document.createElement('div');
    datePickerUI.classList.add('datepicker-ui');

    // Create the navigation buttons.
    const prevMonthButton = document.createElement('button');
    prevMonthButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevMonthButton.addEventListener('click', function (event) {
        event.stopPropagation()
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        showDatePickerGrid(selectedDate, datePickerInput, datepickerContainer);
    });

    const nextMonthButton = document.createElement('button');
    nextMonthButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextMonthButton.addEventListener('click', function (event) {
        event.stopPropagation()
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        showDatePickerGrid(selectedDate, datePickerInput, datepickerContainer);
    });

    // Create the datepicker content (days of the month in a grid).
    const datePickerContent = document.createElement('div');
    datePickerContent.classList.add('datepicker-content');
    datePickerUI.appendChild(prevMonthButton);
    datePickerUI.appendChild(datePickerContent);
    datePickerUI.appendChild(nextMonthButton);
    datepickerContainer.appendChild(datePickerUI);

    showDatePickerGrid(selectedDate, datePickerInput, datepickerContainer);
}

// Show the datepicker grid (days of the month) in a 7-column table format.
function showDatePickerGrid(selectedDate: Date, datePickerInput: HTMLInputElement, datepickerContainer: HTMLElement) {
    const datePickerContent = datepickerContainer.querySelector('.datepicker-content');
    if (!datePickerContent) return;

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    datePickerContent.innerHTML = '';

    // Create the table header with day names (Sun to Sat).
    const monthHeader = document.createElement('div');
    monthHeader.classList.add('grid', 'gap-4', 'text-center', 'mb-2', 'font-bold', 'uppercase', 'text-primary');
    monthHeader.innerHTML = `<span>${currentMonth}</span><span></span>`
    const tableHeader = document.createElement('div');
    tableHeader.classList.add('grid', 'grid-cols-7', 'text-center', 'mb-2', 'font-bold', 'uppercase');
    dayNames.forEach(dayName => {
        const headerDay = document.createElement('div');
        headerDay.textContent = dayName;
        tableHeader.appendChild(headerDay);
    });
    datePickerContent.appendChild(tableHeader);

    // Create and append days of the month to the table.
    const tableDays = document.createElement('div');
    tableDays.classList.add('grid', 'grid-cols-7', 'gap-2');
    datePickerContent.appendChild(tableDays);

    for (let day = 1; day <= daysInMonth + startingDay; day++) {
        const dayElement = document.createElement('span');
        dayElement.classList.add('datepicker-day', 'text-center', 'cursor-pointer', 'p-2');

        if (day > startingDay) {
            dayElement.textContent = (day - startingDay).toString();
            dayElement.addEventListener('click', function () {
                selectedDate.setDate(day - startingDay);
                updateDatePickerValue(selectedDate, datePickerInput);
            });

            // Highlight the selected date.
            if (selectedDate.getDate() === day - startingDay &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear) {
                dayElement.classList.add('datepicker-selected', 'bg-primary', 'text-white');
            }
        } else {
            // Empty cells for days before the start of the month.
            dayElement.classList.add('text-transparent');
        }

        tableDays.appendChild(dayElement);
    }
}

// Update the input field value when a date is selected in the datepicker.
function updateDatePickerValue(selectedDate: Date, datePickerInput: HTMLInputElement) {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear().toString();
    datePickerInput.value = `${day} . ${month} . ${year}`;
}

