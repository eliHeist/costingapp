
// request methods

// get csrf from dom
function csrf() {
    const field = document.getElementById('token').firstElementChild
    return field.value;
}
async function GET(url, return_full=false) {
    const response = await fetch(url);
    if (return_full) {
        return response
    }
    return await response.json();
}
async function POST(url, obj, return_full=false) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf(),
        },
        body: JSON.stringify(obj)
    });
    if (return_full) {
        return response
    }
    return await response.json();
}
async function PUT(url, obj, return_full=false) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf(),
        },
        body: JSON.stringify(obj)
    });
    if (return_full) {
        return response
    }
    return await response.json();
}
async function DELETE(url, obj = null, return_full=false) {
    let body = ''
    if (obj) {
        body = JSON.stringify(obj)
    }
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf(),
        },
        body: body
    });
    if (return_full) {
        return response
    }
    return await response.json();
}

// fetch pdf
async function fetchPDF(pdf_url){
    // fetch pdf from the backend
    const response = await fetch(pdf_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        }
    })

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // get the blob file from the request
    const blob = await response.blob()

    // get the content disposition from the backend
    const contentDisposition = response.headers.get('Content-Disposition');
    // Set Default filename if there is none from the backend
    let filename = 'mechbrif_pdf.pdf';

    // Check if the 'Content-Disposition' header is present and contains the substring 'attachment'.
    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        // Define a regular expression to match the filename in the 'Content-Disposition' header.
        // The pattern looks for 'filename' followed by any characters not including ';', '=', or '\n', 
        // and then captures the actual filename which may be enclosed in quotes.
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

        // Execute the regular expression on the 'Content-Disposition' header.
        // This returns an array of matches if the pattern is found, otherwise null.
        const matches = filenameRegex.exec(contentDisposition);

        // Check if the matches array is not null and has at least one capture group.
        // This ensures that a filename was successfully captured by the regex.
        if (matches != null && matches[1]) {
            // Extract the filename from the first capture group (matches[1]).
            // Use the replace method to remove any surrounding quotes (both single and double quotes).
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    // create a url for the pdf
    const url = URL.createObjectURL(blob);

    // download button that downloads with the right filename
    // Create the anchor element
    const downloadLink = document.createElement('a');
    downloadLink.className = 'btn';
    downloadLink.innerHTML = '<i class="fas fa-download"></i> PDF';
    downloadLink.href = url;
    downloadLink.download = filename;

    const context = {
        url: url,
        button: downloadLink,
        filename: filename
    }
    return context
}


// set active links
function setNavLink(selector){
    
    // get link to activate
    const menu = document.querySelector('.nav-menu')
    const link = menu.querySelector(selector)

    // collapse all nav groups
    menu.querySelectorAll('[aria-expanded="true"]').forEach(li => {
        li.setAttribute('aria-expanded', 'false')
    })

    // deactivate nav links
    menu.querySelectorAll('.nav-menu__group__link .active').forEach(link => {
        link.classList.remove('active')
    })

    // add active class
    link.classList.add('active')
    // expand the link group
    link.parentElement.parentElement.setAttribute('aria-expanded', 'true')
}


// dates and time functions
function formatPrice(price) {
    return new Intl.NumberFormat().format(price);
}
function formatDate(date) {
    if (!date) {
        return null
    }
    // Given date string
    var dateString = date;

    // Step 1: Replace month abbreviations with numeric representation
    dateString = dateString.replace('. Jan .', '. 01 .').replace('. Feb .', '. 02 .').replace('. Mar .', '. 03 .')
        .replace('. Apr .', '. 04 .').replace('. May .', '. 05 .').replace('. Jun .', '. 06 .')
        .replace('. Jul .', '. 07 .').replace('. Aug .', '. 08 .').replace('. Sep .', '. 09 .')
        .replace('. Oct .', '. 10 .').replace('. Nov .', '. 11 .').replace('. Dec .', '. 12 .');

    // Step 2: Remove dots and spaces
    dateString = dateString.replace(/[\s.]/g, '');

    // Create JavaScript Date object
    var jsDate = new Date(dateString)
    return jsDate
}
function displayDate(inputDate) {
    if (!inputDate) {
        return 'No date'
    }
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const date = new Date(inputDate);
    const today = new Date()
    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    if (date == today) {
        return `Today`
    }

    return `${month}. ${dayOfMonth}, ${year}`;
}
function displayFullDate(inputDate) {
    console.log(inputDate);
    if (!inputDate) {
        return 'No date'
    }
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const date = new Date(inputDate);
    const today = new Date()
    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    if (date == today) {
        return `Today`
    }

    return `${dayOfWeek} ${dayOfMonth}, ${month}. ${year}`;
}

const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

function removeQuotes(text){
    return text.replace(/['"]/g, '')
}

function inputUpper(event) {
    let transformedValue = event.target.value.toUpperCase()
    event.target.value = transformedValue

    let cursorPos = event.target.selectionStart;

    event.target.setSelectionRange(cursorPos, cursorPos)
}