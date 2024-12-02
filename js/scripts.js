// scripts.js

// Data Structures

// Updated workstations array with the new order
const workstations = [
    "RFS", "1", "2", "3",
    "4", "5",
    "6", "7",
    "8", "9",
    "10", "Hog 1", "Hog 2",   
];

let teamMembers = [];

// Constraints Data Structure
let constraints = [];

// Global Variables
const quarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4", "Quarter 5"];
let schedule = {}; // {quarter: {workstation: [{name: teamMemberName, lockState: 'none'|'locked'|'training'}]}}

// Initialize Schedule
function initSchedule() {
    quarters.forEach(q => {
        schedule[q] = {};
        workstations.forEach(ws => {
            schedule[q][ws] = [];
        });
    });
    // Clear unassigned team members box
    document.getElementById("unassignedContent").innerHTML = "All team members are assigned in all quarters.";
}

// Function to get default team members
function getDefaultTeamMembers() {
    return [
        { name: "Gustavo G", stations: ["RFS", "3", "5", "6", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Yosief M", stations: ["1", "2", "5", "7", "8", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Finan A", stations: ["RFS", "4", "5", "6", "8", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Muhammad A", stations: ["2", "6", "8", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Netnal S", stations: ["RFS", "2", "4", "5", "7", "8", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Raju K", stations: ["3", "4", "5", "6", "8", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Merhawy F", stations: ["RFS", "1", "3", "5", "6", "8", "9", "10"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Abiel H", stations: ["RFS", "1", "2", "7", "8", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Phaudi G", stations: ["RFS", "1", "3", "4", "5", "6", "7", "8", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Mohammad F", stations: ["RFS", "1", "7", "8", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Surinder P", stations: ["RFS", "4", "5", "7", "8", "9", "10"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Juliana J", stations: ["1", "3", "8", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Musie A", stations: ["1", "3", "6", "7", "8", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Hamidreza G", stations: ["RFS", "2", "4", "5", "7", "8", "9", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
        { name: "Daria S", stations: ["2", "3", "5", "8", "10", "Hog 1", "Hog 2"], partialStations: [], active: true, unavailableQuarters: [] },
    ];
}

// Load Data from localStorage
function loadData() {
    let savedTeamMembers = localStorage.getItem("teamMembers");
    if (savedTeamMembers) {
        try {
            teamMembers = JSON.parse(savedTeamMembers);
            // Check if teamMembers is an array with at least one element
            if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
                teamMembers = getDefaultTeamMembers();
            }
        } catch (e) {
            // If JSON parsing fails, use default team members
            teamMembers = getDefaultTeamMembers();
        }
    } else {
        // Default team members if no saved data
        teamMembers = getDefaultTeamMembers();
    }

    // Default constraints
    const defaultConstraints = [
        { id: 'csOncePerDay', description: 'Team member can only work on CS1 or CS2 once per day', enabled: true, type: 'csOncePerDay' },
        { id: 'noBackboardsAfterCS1', description: 'Team member cannot work on Backboards after CS1', enabled: true, type: 'noBackboardsAfterCS1' },
        { id: 'noHogBackToBack', description: 'Cannot work on Hog stations back to back', enabled: true, type: 'noHogBackToBack' },
        { id: 'noSequencingBackToBack', description: 'Cannot work on Sequencing stations back to back', enabled: true, type: 'noSequencingBackToBack' },
        { id: 'backboardsOncePerDay', description: 'Team member can only work on Backboards 1 or Backboards 2 once per day', enabled: true, type: 'backboardsOncePerDay' },
        { id: 'noSameStationTwice', description: 'Team member cannot be assigned to the same station twice', enabled: true, type: 'noSameStationTwice' },
        { id: 'noSequencingKitsBackToBack', description: 'Team member cannot work on Sequencing A, Sequencing B, or Kits 1 back to back', enabled: true, type: 'noSequencingKitsBackToBack' }
    ];

    let savedConstraints = localStorage.getItem("constraints");
    if (savedConstraints) {
        try {
            let savedConstraintsArray = JSON.parse(savedConstraints);
            constraints = [];

            // Merge default constraints with saved constraints
            defaultConstraints.forEach(defaultConstraint => {
                let savedConstraint = savedConstraintsArray.find(c => c.id === defaultConstraint.id);
                if (savedConstraint) {
                    // Use saved enabled status
                    defaultConstraint.enabled = savedConstraint.enabled;
                }
                constraints.push(defaultConstraint);
            });

            // Add any additional saved constraints that are not in defaults
            savedConstraintsArray.forEach(savedConstraint => {
                if (!constraints.some(c => c.id === savedConstraint.id)) {
                    constraints.push(savedConstraint);
                }
            });
        } catch (e) {
            // If JSON parsing fails, use default constraints
            constraints = defaultConstraints;
        }
    } else {
        constraints = defaultConstraints;
    }
}

// Save Data to localStorage
function saveData(showAlert = true) {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    localStorage.setItem("constraints", JSON.stringify(constraints));
    if (showAlert) {
        alert("Changes saved successfully!");
    }
}

// Generate Constraints List
function generateConstraintsList() {
    const constraintsList = document.getElementById("constraintsList");
    constraintsList.innerHTML = "";
    constraints.forEach((constraint, index) => {
        const div = document.createElement("div");
        div.classList.add("constraint-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `constraint-${index}`;
        checkbox.checked = constraint.enabled;
        checkbox.addEventListener("change", (e) => {
            constraint.enabled = e.target.checked;
            saveData(false); // Save changes without alert
        });

        const label = document.createElement("label");
        label.htmlFor = `constraint-${index}`;
        label.textContent = constraint.description;

        div.appendChild(checkbox);
        div.appendChild(label);

        // Delete Button
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("constraint-actions");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteConstraint(constraint.id);
        });

        actionsDiv.appendChild(deleteBtn);
        div.appendChild(actionsDiv);

        constraintsList.appendChild(div);
    });
}

// Delete Constraint
function deleteConstraint(id) {
    constraints = constraints.filter(constraint => constraint.id !== id);
    generateConstraintsList();
    saveData(false); // Save changes without alert
}

// Add New Constraint
function addConstraint() {
    const constraintTypeSelect = document.getElementById("constraintTypeSelect");
    const constraintDescriptionInput = document.getElementById("constraintDescriptionInput");

    const selectedType = constraintTypeSelect.value;
    const description = constraintDescriptionInput.value.trim();

    if (description === "") {
        alert("Please enter a description for the new constraint.");
        return;
    }

    // Check if constraint already exists
    if (constraints.some(constraint => constraint.description === description)) {
        alert("A constraint with this description already exists.");
        return;
    }

    // Add new constraint
    constraints.push({
        id: selectedType + "_" + Date.now(),
        description: description,
        enabled: true,
        type: selectedType
    });

    // Clear input fields
    constraintDescriptionInput.value = "";

    // Regenerate constraints list
    generateConstraintsList();
    saveData(false); // Save changes without alert
}

// Generate Schedule Table
function generateScheduleTable() {
    const table = document.getElementById("scheduleTable");
    table.innerHTML = "";

    // Header Row
    let headerRow = "<tr><th>Workstations</th>";
    quarters.forEach(q => {
        headerRow += `<th>${q} <button onclick="rotateQuarter('${q}')">Rotate</button></th>`;
    });
    headerRow += "</tr>";
    table.innerHTML += headerRow;

    // Data Rows
    workstations.forEach(ws => {
        let row = `<tr><td>${ws}</td>`;
        quarters.forEach(q => {
            let cellContent = schedule[q][ws].map(assignment => {
                let name = assignment.name;
                let lockState = assignment.lockState;
                // Check if team member is active and available in this quarter
                let tm = teamMembers.find(tm => tm.name === name);
                if (tm && tm.active && !tm.unavailableQuarters.includes(q)) {
                    return `<div class="draggable ${lockState}" draggable="true" data-quarter="${q}" data-workstation="${ws}" ondragstart="drag(event)" onclick="event.stopPropagation(); toggleLockState(event, '${name}', '${q}', '${ws}')">
                        ${name}
                        <button class="remove-btn" onclick="removeTeamMemberFromCell(event, '${name}', '${q}', '${ws}')">X</button>
                    </div>`;
                } else {
                    return '';
                }
            }).join('');

            row += `<td class="droppable" onclick="handleCellClick(event)" ondrop="drop(event)" ondragover="allowDrop(event)" data-quarter="${q}" data-workstation="${ws}">
                ${cellContent}
            </td>`;
        });
        row += "</tr>";
        table.innerHTML += row;
    });
    // Update team member pool after generating schedule
    generateTeamMemberPool();
}

// Function to Remove Team Member from Cell
function removeTeamMemberFromCell(event, name, quarter, workstation) {
    event.stopPropagation(); // Prevent cell click event
    // Remove the team member from the schedule
    schedule[quarter][workstation] = schedule[quarter][workstation].filter(a => a.name !== name);
    // Regenerate the schedule table
    generateScheduleTable();
    // Update unassigned box
    updateUnassignedBox();
}

// Handle Cell Clicks to Add Team Member
function handleCellClick(event) {
    let cell = event.currentTarget; // The cell that was clicked
    let quarter = cell.dataset.quarter;
    let workstation = cell.dataset.workstation;

    // Check if cell is empty
    if (cell.innerHTML.trim() === '') {
        // Replace cell content with input field
        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'team-member-input';
        input.placeholder = 'Type team member name';
        cell.appendChild(input);
        input.focus();

        // Attach event listeners to the input field
        input.addEventListener("input", function(e) {
            showTeamMemberSuggestions(e, input, quarter, workstation);
        });

        // Handle when the user presses Enter
        input.addEventListener("keydown", function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const name = input.value.trim();
                if (name !== "") {
                    assignTeamMemberToCell(name, quarter, workstation);
                }
                // Remove input field and restore cell content
                generateScheduleTable();
                updateUnassignedBox();
            }
        });

        // Handle when the user clicks outside the input field
        input.addEventListener("blur", function() {
            // Delay to allow click on suggestion
            setTimeout(function() {
                // Remove input field and restore cell content
                generateScheduleTable();
                updateUnassignedBox();
            }, 200);
        });
    }
}

// Show Autocomplete Suggestions
function showTeamMemberSuggestions(e, input, quarter, workstation) {
    let value = input.value.toLowerCase();

    // Get the cell
    let cell = input.parentElement;

    // Remove any existing suggestion list
    let existingList = cell.querySelector('.suggestions-list');
    if (existingList) {
        cell.removeChild(existingList);
    }

    if (value === '') {
        return;
    }

    // Get list of team members matching the input
    let suggestions = teamMembers.filter(tm => {
        return tm.active &&
            !tm.unavailableQuarters.includes(quarter) &&
            tm.name.toLowerCase().includes(value) &&
            !isTeamMemberAssignedInQuarter(tm.name, quarter);
    });

    if (suggestions.length === 0) {
        return;
    }

    // Create suggestion list
    let list = document.createElement('ul');
    list.className = 'suggestions-list';

    suggestions.forEach(tm => {
        let item = document.createElement('li');
        item.textContent = tm.name;
        item.addEventListener('mousedown', function(e) {
            e.preventDefault(); // Prevent input blur
            assignTeamMemberToCell(tm.name, quarter, workstation);
            // Remove input field and suggestions list
            generateScheduleTable();
            updateUnassignedBox();
        });
        list.appendChild(item);
    });

    cell.appendChild(list);
}

// Check if Team Member is Assigned in Quarter
function isTeamMemberAssignedInQuarter(name, quarter) {
    let assigned = false;
    workstations.forEach(ws => {
        if (schedule[quarter][ws].some(a => a.name === name)) {
            assigned = true;
        }
    });
    return assigned;
}

// Assign Team Member to Cell
function assignTeamMemberToCell(name, quarter, workstation) {
    // Check if team member is active and available in this quarter
    let tm = teamMembers.find(tm => tm.name === name);
    if (!tm || !tm.active || tm.unavailableQuarters.includes(quarter)) {
        alert(`${name} is not available in ${quarter}.`);
        return;
    }

    // Check if team member is already assigned in this quarter
    if (isTeamMemberAssignedInQuarter(name, quarter)) {
        alert(`${name} is already assigned in ${quarter}.`);
        return;
    }

    // Check if team member can work on this workstation
    if (!tm.stations.includes(workstation) && !tm.partialStations.includes(workstation)) {
        alert(`${name} does not have the skill to work on ${workstation}.`);
        return;
    }

    // Assign the team member
    schedule[quarter][workstation].push({ name: name, lockState: 'none' });
}

// Toggle Lock State
function toggleLockState(event, name, quarter, workstation) {
    event.stopPropagation();
    let assignment = schedule[quarter][workstation].find(a => a.name === name);
    if (assignment) {
        if (assignment.lockState === 'none') {
            assignment.lockState = 'locked';
        } else if (assignment.lockState === 'locked') {
            assignment.lockState = 'training';
        } else {
            assignment.lockState = 'none';
        }
        generateScheduleTable();
    }
}

// Generate Team Member Pool
function generateTeamMemberPool() {
    const pool = document.getElementById("teamMemberPool");
    pool.innerHTML = "";
    // Display all active team members
    teamMembers.forEach(tm => {
        if (tm.active) {
            let div = document.createElement("div");
            div.classList.add("draggable");
            div.setAttribute("draggable", "true");
            div.addEventListener("dragstart", dragFromPool);
            div.textContent = tm.name;
            pool.appendChild(div);
        }
    });
}

// Generate Skills Table
function generateSkillsTable() {
    const table = document.getElementById("skillsTable");
    table.innerHTML = "";

    // Header Row
    let headerRow = "<tr><th>Team Member</th>";
    workstations.forEach(ws => {
        headerRow += `<th>${ws}</th>`;
    });
    headerRow += "</tr>";
    table.innerHTML += headerRow;

    // Data Rows
    teamMembers.forEach(tm => {
        let row = `<tr>`;
        // Team member name with quarter availability dots and delete button
        row += `<td>`;
        // Team member name clickable to toggle overall active status
        row += `<div class="team-member-name-container">`;
        row += `<span onclick="toggleTeamMemberActive('${tm.name}', this)" class="${tm.active ? '' : 'inactive'}">${tm.name}</span>`;
        // Delete button
        row += `<button class="delete-team-member-btn" onclick="deleteTeamMember('${tm.name}')">Delete</button>`;
        row += `</div>`;
        // Quarter availability dots
        row += `<div class="dot-container">`;
        quarters.forEach(q => {
            let isActive = !tm.unavailableQuarters.includes(q);
            row += `<span class="quarter-dot ${isActive ? 'active' : 'inactive'}" onclick="toggleQuarterAvailability('${tm.name}', '${q}', this)" title="${q}"></span>`;
        });
        row += `</div>`;
        row += `</td>`;

        workstations.forEach(ws => {
            let canDo = tm.stations.includes(ws);
            let partialCanDo = tm.partialStations.includes(ws);
            row += `<td>
                <span class="dot ${canDo ? 'black-dot' : 'white-dot'}" onclick="toggleSkill('${tm.name}', '${ws}', this)" title="Full Skill"></span>
                <span class="dot ${partialCanDo ? 'yellow-dot' : 'white-dot'}" onclick="togglePartialSkill('${tm.name}', '${ws}', this)" title="Partial Skill"></span>
            </td>`;
        });
        row += "</tr>";
        table.innerHTML += row;
    });
}

// Delete Team Member
function deleteTeamMember(name) {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
        // Remove team member from teamMembers array
        teamMembers = teamMembers.filter(tm => tm.name !== name);

        // Remove team member from the schedule
        quarters.forEach(q => {
            workstations.forEach(ws => {
                schedule[q][ws] = schedule[q][ws].filter(a => a.name !== name);
            });
        });

        // Save data
        saveData(false); // Pass false to prevent alert

        // Regenerate tables and charts
        generateSkillsTable();
        generateScheduleTable();
        updateUnassignedBox();
        renderSnapshotChart(schedule);

        // Update saved rotations (weekly chart)
        let savedRotations = localStorage.getItem("savedRotations");
        if (savedRotations) {
            savedRotations = JSON.parse(savedRotations);
            // Remove the team member from all saved rotations
            savedRotations.forEach(rotation => {
                let rotationSchedule = rotation.schedule;
                quarters.forEach(q => {
                    workstations.forEach(ws => {
                        rotationSchedule[q][ws] = rotationSchedule[q][ws].filter(a => a.name !== name);
                    });
                });
            });
            // Save updated rotations
            localStorage.setItem("savedRotations", JSON.stringify(savedRotations));
            // Re-render weekly chart
            renderWeeklyChart(savedRotations);
        }

        // Update team member pool
        generateTeamMemberPool();
    }
}

// Toggle Quarter Availability
function toggleQuarterAvailability(name, quarter, element) {
    let tm = teamMembers.find(tm => tm.name === name);
    if (tm.unavailableQuarters.includes(quarter)) {
        tm.unavailableQuarters = tm.unavailableQuarters.filter(q => q !== quarter);
        element.classList.remove('inactive');
        element.classList.add('active');
    } else {
        tm.unavailableQuarters.push(quarter);
        element.classList.remove('active');
        element.classList.add('inactive');
    }
    // Remove the team member from the schedule in this quarter
    workstations.forEach(ws => {
        schedule[quarter][ws] = schedule[quarter][ws].filter(a => a.name !== name);
    });
    generateScheduleTable();
    updateUnassignedBox();
}

// Toggle Team Member Active Status
function toggleTeamMemberActive(name, element) {
    let tm = teamMembers.find(tm => tm.name === name);
    tm.active = !tm.active;
    if (!tm.active) {
        element.classList.add('inactive');
    } else {
        element.classList.remove('inactive');
    }
    // Remove the team member from the schedule
    quarters.forEach(quarter => {
        workstations.forEach(ws => {
            schedule[quarter][ws] = schedule[quarter][ws].filter(a => a.name !== name);
        });
    });
    // Regenerate the schedule to reflect changes
    generateScheduleTable();
    updateUnassignedBox();
    generateSkillsTable();
}

// Toggle Skill
function toggleSkill(name, ws, element) {
    let tm = teamMembers.find(tm => tm.name === name);

    if (tm.stations.includes(ws)) {
        tm.stations = tm.stations.filter(s => s !== ws);
        element.classList.remove('black-dot');
        element.classList.add('white-dot');
    } else {
        tm.stations.push(ws);
        element.classList.remove('white-dot');
        element.classList.add('black-dot');
        // Remove from partial stations if exists
        tm.partialStations = tm.partialStations.filter(s => s !== ws);
        // Update the yellow dot
        let sibling = element.nextElementSibling;
        if (sibling && sibling.classList.contains('dot')) {
            sibling.classList.remove('yellow-dot');
            sibling.classList.add('white-dot');
        }
    }
    // Update schedule if necessary
    regenerateScheduleAfterSkillChange();
}

// Toggle Partial Skill (Yellow Dot)
function togglePartialSkill(name, ws, element) {
    let tm = teamMembers.find(tm => tm.name === name);

    if (tm.partialStations.includes(ws)) {
        tm.partialStations = tm.partialStations.filter(s => s !== ws);
        element.classList.remove('yellow-dot');
        element.classList.add('white-dot');
    } else {
        tm.partialStations.push(ws);
        element.classList.remove('white-dot');
        element.classList.add('yellow-dot');
        // Remove from full stations if exists
        tm.stations = tm.stations.filter(s => s !== ws);
        // Update the black dot
        let sibling = element.previousElementSibling;
        if (sibling && sibling.classList.contains('dot')) {
            sibling.classList.remove('black-dot');
            sibling.classList.add('white-dot');
        }
    }
    // Update schedule if necessary
    regenerateScheduleAfterSkillChange();
}

// Function to regenerate schedule after skill changes
function regenerateScheduleAfterSkillChange() {
    // Remove team members from workstations they can no longer work on
    quarters.forEach(quarter => {
        workstations.forEach(ws => {
            schedule[quarter][ws] = schedule[quarter][ws].filter(assignment => {
                let tm = teamMembers.find(tm => tm.name === assignment.name);
                return tm && (tm.stations.includes(ws) || tm.partialStations.includes(ws));
            });
        });
    });
    generateScheduleTable();
    updateUnassignedBox();
}

// Add New Team Member
function addTeamMember() {
    let nameInput = document.getElementById("newTeamMemberName");
    let name = nameInput.value.trim();
    if (name === "") {
        alert("Please enter a valid team member name.");
        return;
    }

    // Check if team member already exists
    if (teamMembers.some(tm => tm.name === name)) {
        alert("A team member with this name already exists.");
        return;
    }

    // Add new team member with all stations set to 'cannot do' by default
    teamMembers.push({
        name: name,
        stations: [],
        partialStations: [],
        active: true,
        unavailableQuarters: []
    });

    // Clear input field
    nameInput.value = "";

    // Regenerate skills table
    generateSkillsTable();
    // Update team member pool
    generateTeamMemberPool();
}

// Function to Show Unassigned Team Members
function showUnassignedTeamMembers(teamMemberAssignments) {
    // Organize unassigned team members by quarter
    let unassignedByQuarter = {};
    quarters.forEach((quarter, qIdx) => {
        unassignedByQuarter[quarter] = [];
        teamMembers.forEach(tm => {
            if (!tm.active) return;
            if (tm.unavailableQuarters.includes(quarter)) {
                unassignedByQuarter[quarter].push(`${tm.name} (Unavailable)`);
            } else if (!teamMemberAssignments[tm.name].assignments[qIdx]) {
                unassignedByQuarter[quarter].push(tm.name);
            }
        });
    });

    // Prepare content
    let contentDiv = document.getElementById("unassignedContent");
    contentDiv.innerHTML = ""; // Clear previous content

    let hasUnassigned = false;
    quarters.forEach(quarter => {
        if (unassignedByQuarter[quarter].length > 0) {
            hasUnassigned = true;
            let quarterHeading = document.createElement("h4");
            quarterHeading.textContent = quarter;
            contentDiv.appendChild(quarterHeading);

            let ul = document.createElement("ul");
            ul.classList.add("unassigned-list");
            unassignedByQuarter[quarter].forEach(name => {
                let li = document.createElement("li");
                li.textContent = name;
                ul.appendChild(li);
            });
            contentDiv.appendChild(ul);
        }
    });

    if (!hasUnassigned) {
        contentDiv.innerHTML = "All team members are assigned in all quarters.";
    }
}

// Function to Update Unassigned Team Members Box after Manual Changes
function updateUnassignedBox() {
    let teamMemberAssignments = {};
    teamMembers.forEach(tm => {
        teamMemberAssignments[tm.name] = {
            assignments: Array(quarters.length).fill(null)
        };
    });

    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarter][ws].forEach(assignment => {
                teamMemberAssignments[assignment.name].assignments[qIdx] = ws;
            });
        });
    }

    showUnassignedTeamMembers(teamMemberAssignments);
}

// Drag and Drop Functions
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    const data = {
        name: ev.target.innerText.trim(),
        sourceQuarter: ev.target.dataset.quarter,
        sourceWorkstation: ev.target.dataset.workstation,
        fromPool: false
    };
    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
}

function dragFromPool(ev) {
    const data = {
        name: ev.target.innerText.trim(),
        sourceQuarter: null,
        sourceWorkstation: null,
        fromPool: true
    };
    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
}

function drop(ev) {
    ev.preventDefault();
    const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    const name = data.name;
    const fromPool = data.fromPool;
    const sourceQuarter = data.sourceQuarter;
    const sourceWorkstation = data.sourceWorkstation;

    // Get the droppable cell using ev.currentTarget
    let targetCell = ev.currentTarget;
    let targetQuarter = targetCell.dataset.quarter;
    let targetWorkstation = targetCell.dataset.workstation;

    // Ensure target is a droppable cell
    if (!targetQuarter || !targetWorkstation) {
        return;
    }

    // Check if team member is active and available in this quarter
    let tm = teamMembers.find(tm => tm.name === name);
    if (!tm || !tm.active || tm.unavailableQuarters.includes(targetQuarter)) {
        alert(`${name} is not available in ${targetQuarter}.`);
        return;
    }

    // If moving within the same quarter
    if (sourceQuarter === targetQuarter) {
        // If moving to the same workstation, do nothing
        if (sourceWorkstation === targetWorkstation) {
            return;
        }

        // Remove from source workstation
        if (sourceWorkstation && schedule[sourceQuarter] && schedule[sourceQuarter][sourceWorkstation]) {
            schedule[sourceQuarter][sourceWorkstation] = schedule[sourceQuarter][sourceWorkstation].filter(a => a.name !== name);
        }

        // Add to target workstation
        if (schedule[targetQuarter] && schedule[targetQuarter][targetWorkstation]) {
            schedule[targetQuarter][targetWorkstation].push({ name: name, lockState: 'none' });
        }

        generateScheduleTable();
        updateUnassignedBox();
        return;
    }

    // If moving from pool to a quarter or between different quarters

    // Check if team member is already assigned in the target quarter
    let alreadyAssigned = false;
    workstations.forEach(ws => {
        if (schedule[targetQuarter][ws].some(a => a.name === name)) {
            alreadyAssigned = true;
        }
    });
    if (alreadyAssigned) {
        alert(`${name} is already assigned in ${targetQuarter}.`);
        return;
    }

    // Remove from previous assignment if not from pool
    if (!fromPool) {
        if (sourceQuarter && sourceWorkstation && schedule[sourceQuarter] && schedule[sourceQuarter][sourceWorkstation]) {
            schedule[sourceQuarter][sourceWorkstation] = schedule[sourceQuarter][sourceWorkstation].filter(a => a.name !== name);
        }
    }

    // Add to new assignment
    if (schedule[targetQuarter] && schedule[targetQuarter][targetWorkstation]) {
        schedule[targetQuarter][targetWorkstation].push({ name: name, lockState: 'none' });
    }

    generateScheduleTable();
    updateUnassignedBox();
}

function dropToPool(ev) {
    ev.preventDefault();
    const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    const name = data.name;
    const fromPool = data.fromPool;
    const sourceQuarter = data.sourceQuarter;
    const sourceWorkstation = data.sourceWorkstation;

    // If already from pool, do nothing
    if (fromPool) return;

    // Remove from previous assignment
    if (sourceQuarter && sourceWorkstation && schedule[sourceQuarter][sourceWorkstation]) {
        schedule[sourceQuarter][sourceWorkstation] = schedule[sourceQuarter][sourceWorkstation].filter(a => a.name !== name);
    }

    generateScheduleTable();
    updateUnassignedBox();
}

// Rotate Assignments with Constraints and Lock States
function rotateAssignments() {
    // Prepare data structures for constraints
    let teamMemberAssignments = {};
    teamMembers.forEach(tm => {
        teamMemberAssignments[tm.name] = {
            assignments: Array(quarters.length).fill(null),
            assignedWorkstations: [],
            csAssigned: false,
            backboardsAssigned: false
        };
    });

    // Fill in locked assignments
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarter][ws].forEach(assignment => {
                let name = assignment.name;
                let lockState = assignment.lockState;
                if (lockState === 'locked' || lockState === 'training') {
                    teamMemberAssignments[name].assignments[qIdx] = ws;
                    teamMemberAssignments[name].assignedWorkstations.push(ws);
                    if (wsIsCS(ws)) {
                        teamMemberAssignments[name].csAssigned = true;
                    }
                    if (wsIsBackboards(ws)) {
                        teamMemberAssignments[name].backboardsAssigned = true;
                    }
                }
            });
        });
    }

    // Clear non-locked assignments
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarter][ws] = schedule[quarter][ws].filter(assignment => assignment.lockState === 'locked' || assignment.lockState === 'training');
        });
    }

    // Start recursive assignment
    const maxExecutionTime = 15000; // Maximum time in milliseconds
    const startTime = Date.now();

    if (assignWorkstationsEnhanced(0, teamMemberAssignments, startTime, maxExecutionTime)) {
        generateScheduleTable();
        updateUnassignedBox();
        // Update charts
        renderSnapshotChart(schedule);
    } else {
        alert("No valid schedule could be generated with the current constraints.");
    }
}

// Enhanced Assign Workstations Function with Heuristics
function assignWorkstationsEnhanced(index, teamMemberAssignments, startTime, maxExecutionTime) {
    if (Date.now() - startTime > maxExecutionTime) {
        return false; // Timeout
    }

    // Check if all workstations are assigned in all quarters
    let allAssigned = true;
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        for (let wsIdx = 0; wsIdx < workstations.length; wsIdx++) {
            let workstation = workstations[wsIdx];
            let existingAssignments = schedule[quarter][workstation];
            let isLocked = existingAssignments.some(a => a.lockState === 'locked');
            let isTraining = existingAssignments.some(a => a.lockState === 'training');

            // Determine required assignments for the workstation
            let requiredAssignments = isTraining ? 2 : 1;

            if (existingAssignments.length < requiredAssignments) {
                allAssigned = false;
                break;
            }
        }
        if (!allAssigned) break;
    }
    if (allAssigned) {
        return true;
    }

    // Select the unassigned workstation with the least possible candidates
    let minCandidates = Infinity;
    let selectedQuarterIndex = -1;
    let selectedWorkstationIndex = -1;
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        for (let wsIdx = 0; wsIdx < workstations.length; wsIdx++) {
            let workstation = workstations[wsIdx];
            let existingAssignments = schedule[quarter][workstation];
            let isLocked = existingAssignments.some(a => a.lockState === 'locked');
            let isTraining = existingAssignments.some(a => a.lockState === 'training');

            // Determine required assignments for the workstation
            let requiredAssignments = isTraining ? 2 : 1;

            if (existingAssignments.length >= requiredAssignments) continue; // Already assigned

            // Find possible candidates
            let candidates = teamMembers.filter(tm => {
                return tm.active &&
                    !tm.unavailableQuarters.includes(quarter) &&
                    (tm.stations.includes(workstation) || tm.partialStations.includes(workstation)) &&
                    !teamMemberAssignments[tm.name].assignments[qIdx]; // Not already assigned in this quarter
            });

            if (candidates.length < minCandidates) {
                minCandidates = candidates.length;
                selectedQuarterIndex = qIdx;
                selectedWorkstationIndex = wsIdx;
            }
        }
    }

    if (selectedQuarterIndex === -1) {
        return false; // No unassigned workstations found
    }

    let quarter = quarters[selectedQuarterIndex];
    let workstation = workstations[selectedWorkstationIndex];
    let existingAssignments = schedule[quarter][workstation];
    let isLocked = existingAssignments.some(a => a.lockState === 'locked');
    let isTraining = existingAssignments.some(a => a.lockState === 'training');

    // Determine required assignments for the workstation
    let requiredAssignments = isTraining ? 2 : 1;

    // Find possible candidates for this workstation
    let candidates = teamMembers.filter(tm => {
        return tm.active &&
            !tm.unavailableQuarters.includes(quarter) &&
            (tm.stations.includes(workstation) || tm.partialStations.includes(workstation)) &&
            !teamMemberAssignments[tm.name].assignments[selectedQuarterIndex]; // Not already assigned in this quarter
    });

    // Prioritize candidates who did not work on this workstation yesterday
    candidates = candidates.sort((a, b) => {
        let aWorkedYesterday = a.previousStations && a.previousStations.includes(workstation);
        let bWorkedYesterday = b.previousStations && b.previousStations.includes(workstation);
        if (aWorkedYesterday && !bWorkedYesterday) return 1;
        if (!aWorkedYesterday && bWorkedYesterday) return -1;
        return 0;
    });

    // Shuffle candidates to introduce randomness among equally prioritized candidates
    candidates = shuffleArray(candidates);

    for (let tm of candidates) {
        // Check if assignment is valid
        if (!isValidAssignment(tm, selectedQuarterIndex, workstation, teamMemberAssignments)) {
            continue;
        }

        // Assign team member
        schedule[quarter][workstation].push({ name: tm.name, lockState: 'none' });
        teamMemberAssignments[tm.name].assignments[selectedQuarterIndex] = workstation;

        // Save previous states to restore on backtrack
        let csAssignedBefore = teamMemberAssignments[tm.name].csAssigned;
        let backboardsAssignedBefore = teamMemberAssignments[tm.name].backboardsAssigned;

        if (wsIsCS(workstation)) {
            teamMemberAssignments[tm.name].csAssigned = true;
        }

        if (wsIsBackboards(workstation)) {
            teamMemberAssignments[tm.name].backboardsAssigned = true;
        }

        // Add workstation to assignedWorkstations for same station constraint
        teamMemberAssignments[tm.name].assignedWorkstations.push(workstation);

        // Recurse
        if (assignWorkstationsEnhanced(index + 1, teamMemberAssignments, startTime, maxExecutionTime)) {
            return true;
        }

        // Backtrack
        schedule[quarter][workstation] = schedule[quarter][workstation].filter(a => a.name !== tm.name);
        teamMemberAssignments[tm.name].assignments[selectedQuarterIndex] = null;
        teamMemberAssignments[tm.name].csAssigned = csAssignedBefore;
        teamMemberAssignments[tm.name].backboardsAssigned = backboardsAssignedBefore;
        teamMemberAssignments[tm.name].assignedWorkstations.pop();
    }

    // If no assignment could be made, backtrack
    return false;
}

// Check if the assignment is valid based on constraints
function isValidAssignment(tm, quarterIndex, workstation, teamMemberAssignments) {
    // Iterate over constraints
    for (let constraint of constraints) {
        if (constraint.enabled) {
            switch (constraint.type) {
                case 'csOncePerDay':
                    if (wsIsCS(workstation) && teamMemberAssignments[tm.name].csAssigned) {
                        return false;
                    }
                    break;
                case 'noBackboardsAfterCS1':
                    let prevWorkstation = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWorkstation === "CS1" && wsIsBackboards(workstation)) {
                        return false;
                    }
                    break;
                case 'noHogBackToBack':
                    let prevWsHog = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWsHog && wsIsHog(prevWsHog) && wsIsHog(workstation)) {
                        return false;
                    }
                    break;
                case 'noSequencingBackToBack':
                    let prevWsSeq = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWsSeq && wsIsSequencing(prevWsSeq) && wsIsSequencing(workstation)) {
                        return false;
                    }
                    break;
                case 'noSameStationTwice':
                    if (teamMemberAssignments[tm.name].assignedWorkstations.includes(workstation)) {
                        return false;
                    }
                    break;
                case 'backboardsOncePerDay':
                    if (wsIsBackboards(workstation) && teamMemberAssignments[tm.name].backboardsAssigned) {
                        return false;
                    }
                    break;
                case 'noSequencingKitsBackToBack':
                    let prevWsSeqKit = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (
                        prevWsSeqKit &&
                        ['Sequencing A', 'Sequencing B', 'Kits 1'].includes(prevWsSeqKit) &&
                        ['Sequencing A', 'Sequencing B', 'Kits 1'].includes(workstation)
                    ) {
                        return false;
                    }
                    break;
                default:
                    // Handle unknown constraint types if necessary
                    break;
            }
        }
    }

    // All constraints satisfied
    return true;
}

// Helper functions to check workstation types
function wsIsCS(ws) {
    return ws === "CS1" || ws === "CS2";
}

function wsIsBackboards(ws) {
    return ws === "Backboards 1" || ws === "Backboards 2";
}

function wsIsHog(ws) {
    return ["Hog 3", "Hog 4", "Hog 5"].includes(ws);
}

function wsIsSequencing(ws) {
    return ["Sequencing A", "Sequencing B"].includes(ws);
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to handle Export & Save Schedule
function exportAndSaveSchedule() {
    const today = new Date().toLocaleDateString();
    const currentSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy

    // Retrieve existing saved rotations from localStorage
    let savedRotations = localStorage.getItem("savedRotations");
    if (savedRotations) {
        savedRotations = JSON.parse(savedRotations);
    } else {
        savedRotations = [];
    }

    // Save the current schedule with the date
    savedRotations.push({
        date: today,
        schedule: currentSchedule
    });

    // Update localStorage
    localStorage.setItem("savedRotations", JSON.stringify(savedRotations));

    alert("Schedule exported and saved successfully!");

    // Render the latest snapshot chart
    renderSnapshotChart(currentSchedule);

    // Render the weekly stations graph
    renderWeeklyChart(savedRotations);
}

// Function to render Snapshot Chart using Chart.js
function renderSnapshotChart(currentSchedule) {
    const ctx = document.getElementById('snapshotChart').getContext('2d');

    // Prepare data
    const workstationsLabels = workstations;
    const teamMemberColors = generateColorArray(teamMembers.length);
    const datasets = teamMembers.map((tm, index) => {
        const data = workstations.map(ws => {
            // Check if the team member is assigned to this workstation in any quarter today
            let assigned = false;
            quarters.forEach(q => {
                if (currentSchedule[q][ws].some(a => a.name === tm.name)) {
                    assigned = true;
                }
            });
            return assigned ? 1 : 0;
        });
        return {
            label: tm.name,
            data: data,
            backgroundColor: teamMemberColors[index],
            hidden: false // Initialize as visible
        };
    });

    // Destroy existing chart if exists to avoid duplication
    if (window.snapshotChartInstance) {
        window.snapshotChartInstance.destroy();
    }

    window.snapshotChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: workstationsLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        display: false // Hide y-axis ticks
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return value === 1 ? label : null;
                        }
                    }
                }
            }
        }
    });
}

// Function to render Weekly Stations Graph using Chart.js
function renderWeeklyChart(savedRotations) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    const datesDiv = document.getElementById('weeklyDates'); // New line

    // Handle empty data
    if (savedRotations.length === 0) {
        if (window.weeklyChartInstance) {
            window.weeklyChartInstance.destroy();
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No data available for the weekly chart.", ctx.canvas.width / 2, ctx.canvas.height / 2);

        // Clear the dates display
        datesDiv.innerHTML = ""; // New line

        return;
    }

    // Get the last 7 days' rotations
    const last7Rotations = savedRotations.slice(-7);

    // New code: Collect dates of the rotations
    const rotationDates = last7Rotations.map(rotation => rotation.date);

    // Aggregate data: team member -> station -> count
    let dataMap = {};
    teamMembers.forEach(tm => {
        dataMap[tm.name] = {};
        workstations.forEach(ws => {
            dataMap[tm.name][ws] = 0;
        });
    });

    last7Rotations.forEach(rotation => {
        const rotationSchedule = rotation.schedule;
        quarters.forEach(q => {
            workstations.forEach(ws => {
                rotationSchedule[q][ws].forEach(assignment => {
                    if (dataMap[assignment.name] && dataMap[assignment.name][ws] !== undefined) {
                        dataMap[assignment.name][ws]++;
                    }
                });
            });
        });
    });

    // Prepare data for Chart.js
    const workstationsLabels = workstations;
    const teamMemberColors = generateColorArray(teamMembers.length);
    const datasets = teamMembers.map((tm, index) => {
        const data = workstationsLabels.map(ws => dataMap[tm.name][ws]);
        return {
            label: tm.name,
            data: data,
            backgroundColor: teamMemberColors[index],
            hidden: false // Initialize as visible
        };
    });

    // Destroy existing chart if exists to avoid duplication
    if (window.weeklyChartInstance) {
        window.weeklyChartInstance.destroy();
    }

    window.weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: workstationsLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // New code: Display the dates below the chart
    datesDiv.innerHTML = `<p>Dates included in this chart: ${rotationDates.join(', ')}</p>`;
}

// Function to reset the weekly data
function resetWeeklyData() {
    // Clear the saved rotations from localStorage
    localStorage.removeItem("savedRotations");
    alert("Weekly data has been reset.");
    // Re-render the weekly chart with empty data
    renderWeeklyChart([]);
}

// Utility Function to Generate an Array of Distinct Colors
function generateColorArray(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = i * (360 / numColors);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
}

// Function to display the current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Event Listener for Export & Save Schedule Button
document.getElementById("exportScheduleBtn").addEventListener("click", exportAndSaveSchedule);

// Event Listeners
document.getElementById("rotateAllBtn").addEventListener("click", rotateAssignments);
document.getElementById("prioritizeNewStationBtn").addEventListener("click", rotateAssignmentsPrioritizeNewStation);
document.getElementById("addConstraintBtn").addEventListener("click", addConstraint);
document.getElementById("addTeamMemberBtn").addEventListener("click", addTeamMember);
document.getElementById("saveChangesBtn").addEventListener("click", saveData);

// Updated Event Listeners for Chart Buttons
// Snapshot Chart Buttons
document.getElementById("snapshotHideAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.snapshotChartInstance, false);
});
document.getElementById("snapshotShowAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.snapshotChartInstance, true);
});

// Weekly Chart Buttons
document.getElementById("weeklyHideAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.weeklyChartInstance, false);
});
document.getElementById("weeklyShowAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.weeklyChartInstance, true);
});

// Event Listener for Reset Week Button
document.getElementById("resetWeekBtn").addEventListener("click", resetWeeklyData);

// Function to toggle all datasets in a chart
function toggleAllDatasets(chartInstance, show) {
    chartInstance.data.datasets.forEach(function(dataset, index) {
        // Set the hidden property in the dataset's meta
        chartInstance.getDatasetMeta(index).hidden = !show;
    });
    chartInstance.update();
}

// On Page Load, initialize data and generate the schedule and charts
window.onload = function() {
    // Load data
    loadData();

    // Initialize schedule
    initSchedule();

    // Generate constraints list
    generateConstraintsList();

    // Generate skills table
    generateSkillsTable();

    // Generate schedule (call rotateAssignments)
    rotateAssignments();

    // Generate schedule table
    generateScheduleTable();

    // Update unassigned team members box
    updateUnassignedBox();

    // Render charts with current schedule
    renderSnapshotChart(schedule);

    // Load saved rotations from localStorage
    let savedRotations = localStorage.getItem("savedRotations");
    if (savedRotations) {
        savedRotations = JSON.parse(savedRotations);
    } else {
        savedRotations = [];
    }

    // Render the weekly chart with the saved rotations
    renderWeeklyChart(savedRotations);

    // Display the current date
    displayCurrentDate();
};

// Rotate Quarter with Constraints
function rotateQuarter(q) {
    let quarterIndex = quarters.indexOf(q);

    // Prepare data structures for constraints
    let teamMemberAssignments = {};
    teamMembers.forEach(tm => {
        teamMemberAssignments[tm.name] = {
            assignments: Array(quarters.length).fill(null),
            assignedWorkstations: [],
            csAssigned: false,
            backboardsAssigned: false
        };
    });

    // Fill in existing assignments, excluding non-locked in the quarter being rotated
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarterName = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarterName][ws].forEach(assignment => {
                let name = assignment.name;
                let lockState = assignment.lockState;
                // Exclude non-locked assignments in the quarter being rotated
                if (quarterName !== q || lockState === 'locked' || lockState === 'training') {
                    teamMemberAssignments[name].assignments[qIdx] = ws;
                    teamMemberAssignments[name].assignedWorkstations.push(ws);
                    if (wsIsCS(ws)) {
                        teamMemberAssignments[name].csAssigned = true;
                    }
                    if (wsIsBackboards(ws)) {
                        teamMemberAssignments[name].backboardsAssigned = true;
                    }
                }
            });
        });
    }

    // Clear non-locked assignments only in 'schedule' for the quarter being rotated
    workstations.forEach(ws => {
        schedule[q][ws] = schedule[q][ws].filter(assignment => assignment.lockState === 'locked' || assignment.lockState === 'training');
    });

    // Start recursive assignment for this quarter
    const maxExecutionTime = 10000; // Maximum time in milliseconds
    const startTime = Date.now();

    if (assignWorkstationsForQuarterEnhanced(0, quarterIndex, teamMemberAssignments, startTime, maxExecutionTime)) {
        generateScheduleTable();
        updateUnassignedBox();
        // Update charts
        renderSnapshotChart(schedule);
    } else {
        alert(`No valid schedule could be generated for ${q} with the current constraints.`);
    }
}

// Enhanced Assign Workstations for a Specific Quarter
function assignWorkstationsForQuarterEnhanced(wsIndex, quarterIndex, teamMemberAssignments, startTime, maxExecutionTime) {
    if (Date.now() - startTime > maxExecutionTime) {
        return false; // Timeout
    }

    let quarter = quarters[quarterIndex];
    if (wsIndex >= workstations.length) {
        return true; // All assignments made for this quarter
    }

    let workstation = workstations[wsIndex];

    let existingAssignments = schedule[quarter][workstation];
    let isLocked = existingAssignments.some(a => a.lockState === 'locked');
    let isTraining = existingAssignments.some(a => a.lockState === 'training');

    // If someone is training, we need to assign an additional team member
    let requiredAssignments = isTraining ? 2 : 1;

    if (existingAssignments.length >= requiredAssignments) {
        return assignWorkstationsForQuarterEnhanced(wsIndex + 1, quarterIndex, teamMemberAssignments, startTime, maxExecutionTime);
    }

    // Find candidates for this workstation
    let candidates = teamMembers.filter(tm => {
        return tm.active &&
            !tm.unavailableQuarters.includes(quarter) &&
            (tm.stations.includes(workstation) || tm.partialStations.includes(workstation)) &&
            !teamMemberAssignments[tm.name].assignments[quarterIndex]; // Not already assigned in this quarter
    });

    // Prioritize candidates who did not work on this workstation yesterday
    candidates = candidates.sort((a, b) => {
        let aWorkedYesterday = a.previousStations && a.previousStations.includes(workstation);
        let bWorkedYesterday = b.previousStations && b.previousStations.includes(workstation);
        if (aWorkedYesterday && !bWorkedYesterday) return 1;
        if (!aWorkedYesterday && bWorkedYesterday) return -1;
        return 0;
    });

    // Shuffle candidates to introduce randomness among equally prioritized candidates
    candidates = shuffleArray(candidates);

    for (let tm of candidates) {
        // Check if assignment is valid
        if (!isValidAssignment(tm, quarterIndex, workstation, teamMemberAssignments)) {
            continue;
        }

        // Assign team member
        schedule[quarter][workstation].push({ name: tm.name, lockState: 'none' });
        teamMemberAssignments[tm.name].assignments[quarterIndex] = workstation;

        // Save previous states to restore on backtrack
        let csAssignedBefore = teamMemberAssignments[tm.name].csAssigned;
        let backboardsAssignedBefore = teamMemberAssignments[tm.name].backboardsAssigned;

        if (wsIsCS(workstation)) {
            teamMemberAssignments[tm.name].csAssigned = true;
        }

        if (wsIsBackboards(workstation)) {
            teamMemberAssignments[tm.name].backboardsAssigned = true;
        }

        // Add workstation to assignedWorkstations for same station constraint
        teamMemberAssignments[tm.name].assignedWorkstations.push(workstation);

        // Recurse
        if (assignWorkstationsForQuarterEnhanced(wsIndex + 1, quarterIndex, teamMemberAssignments, startTime, maxExecutionTime)) {
            return true;
        }

        // Backtrack
        schedule[quarter][workstation] = schedule[quarter][workstation].filter(a => a.name !== tm.name);
        teamMemberAssignments[tm.name].assignments[quarterIndex] = null;
        teamMemberAssignments[tm.name].csAssigned = csAssignedBefore;
        teamMemberAssignments[tm.name].backboardsAssigned = backboardsAssignedBefore;
        teamMemberAssignments[tm.name].assignedWorkstations.pop();
    }

    // If no candidate could be assigned to this workstation, backtrack
    return false;
}

// Functions for Prioritize New Station Feature

// Function to get the previous day's schedule
function getPreviousDaySchedule() {
    let savedRotations = localStorage.getItem("savedRotations");
    if (savedRotations) {
        savedRotations = JSON.parse(savedRotations);
        if (savedRotations.length >= 1) {
            // Get the last saved rotation (previous day)
            return savedRotations[savedRotations.length - 1].schedule;
        }
    }
    // If no saved rotations, return null
    return null;
}

// Check if there are enough active team members to cover all workstations
function checkTeamMemberAvailability() {
    // Count active team members
    let activeTeamMembers = teamMembers.filter(tm => tm.active);
    // Count total required assignments
    let totalAssignments = quarters.length * workstations.length;

    if (activeTeamMembers.length * quarters.length < totalAssignments) {
        alert("Not enough active team members to fill all workstations. Please add more team members or adjust constraints.");
        return false;
    }
    return true;
}

// Function to rotate assignments prioritizing new stations with quarter adjustments
function rotateAssignmentsPrioritizeNewStation() {
    if (!checkTeamMemberAvailability()) {
        return;
    }

    let previousSchedule = getPreviousDaySchedule();
    if (!previousSchedule) {
        alert("No previous schedule found. Please ensure you have saved at least one schedule.");
        return;
    }

    // Prepare data structures for constraints, including previous day's assignments
    let teamMemberAssignments = {};
    teamMembers.forEach(tm => {
        teamMemberAssignments[tm.name] = {
            assignments: Array(quarters.length).fill(null),
            assignedWorkstations: [],
            csAssigned: false,
            backboardsAssigned: false,
            previousStations: [],
        };
        // Collect previous day's assignments for each team member
        quarters.forEach(q => {
            workstations.forEach(ws => {
                if (previousSchedule[q][ws].some(a => a.name === tm.name)) {
                    teamMemberAssignments[tm.name].previousStations.push(ws);
                }
            });
        });
    });

    // Fill in locked assignments
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarter][ws].forEach(assignment => {
                let name = assignment.name;
                let lockState = assignment.lockState;
                if (lockState === 'locked' || lockState === 'training') {
                    teamMemberAssignments[name].assignments[qIdx] = ws;
                    teamMemberAssignments[name].assignedWorkstations.push(ws);
                    if (wsIsCS(ws)) {
                        teamMemberAssignments[name].csAssigned = true;
                    }
                    if (wsIsBackboards(ws)) {
                        teamMemberAssignments[name].backboardsAssigned = true;
                    }
                }
            });
        });
    }

    // Clear non-locked assignments
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarter][ws] = schedule[quarter][ws].filter(assignment => assignment.lockState === 'locked' || assignment.lockState === 'training');
        });
    }

    // Start recursive assignment with prioritization and quarter adjustments
    const maxExecutionTime = 20000; // Increased maximum time to allow more complex computations
    const startTime = Date.now();

    const result = assignWorkstationsPrioritizeNewStationEnhanced(teamMemberAssignments, startTime, maxExecutionTime);

    if (result) {
        generateScheduleTable();
        updateUnassignedBox();
        // Update charts
        renderSnapshotChart(schedule);
    } else {
        alert("No valid schedule could be generated with the current constraints and prioritization. Please adjust constraints or add more team members.");
    }
}

// Enhanced Function to assign workstations with prioritization and quarter adjustments
function assignWorkstationsPrioritizeNewStationEnhanced(teamMemberAssignments, startTime, maxExecutionTime) {
    if (Date.now() - startTime > maxExecutionTime) {
        return false; // Timeout to prevent infinite loops
    }

    // Check if all workstations are assigned in all quarters
    let allAssigned = true;
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        for (let wsIdx = 0; wsIdx < workstations.length; wsIdx++) {
            let workstation = workstations[wsIdx];
            let existingAssignments = schedule[quarter][workstation];
            let isLocked = existingAssignments.some(a => a.lockState === 'locked');
            let isTraining = existingAssignments.some(a => a.lockState === 'training');

            // Determine required assignments for the workstation
            let requiredAssignments = isTraining ? 2 : 1;

            if (existingAssignments.length < requiredAssignments) {
                allAssigned = false;
                break;
            }
        }
        if (!allAssigned) break;
    }
    if (allAssigned) {
        return true;
    }

    // Select the unassigned workstation with the least possible candidates
    let minCandidates = Infinity;
    let selectedQuarterIndex = -1;
    let selectedWorkstationIndex = -1;
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarter = quarters[qIdx];
        for (let wsIdx = 0; wsIdx < workstations.length; wsIdx++) {
            let workstation = workstations[wsIdx];
            let existingAssignments = schedule[quarter][workstation];
            let isLocked = existingAssignments.some(a => a.lockState === 'locked');
            let isTraining = existingAssignments.some(a => a.lockState === 'training');

            // Determine required assignments for the workstation
            let requiredAssignments = isTraining ? 2 : 1;

            if (existingAssignments.length >= requiredAssignments) continue; // Already assigned

            // Find possible candidates
            let candidates = teamMembers.filter(tm => {
                return tm.active &&
                    !tm.unavailableQuarters.includes(quarter) &&
                    (tm.stations.includes(workstation) || tm.partialStations.includes(workstation)) &&
                    !teamMemberAssignments[tm.name].assignments[qIdx]; // Not already assigned in this quarter
            });

            if (candidates.length < minCandidates) {
                minCandidates = candidates.length;
                selectedQuarterIndex = qIdx;
                selectedWorkstationIndex = wsIdx;
            }
        }
    }

    if (selectedQuarterIndex === -1) {
        return false; // No unassigned workstations found
    }

    let quarter = quarters[selectedQuarterIndex];
    let workstation = workstations[selectedWorkstationIndex];
    let existingAssignments = schedule[quarter][workstation];
    let isLocked = existingAssignments.some(a => a.lockState === 'locked');
    let isTraining = existingAssignments.some(a => a.lockState === 'training');

    // Determine required assignments for the workstation
    let requiredAssignments = isTraining ? 2 : 1;

    // Find possible candidates for this workstation
    let candidates = teamMembers.filter(tm => {
        return tm.active &&
            !tm.unavailableQuarters.includes(quarter) &&
            (tm.stations.includes(workstation) || tm.partialStations.includes(workstation)) &&
            !teamMemberAssignments[tm.name].assignments[selectedQuarterIndex]; // Not already assigned in this quarter
    });

    // Prioritize candidates who did not work on this workstation yesterday
    candidates = candidates.sort((a, b) => {
        let aWorkedYesterday = teamMemberAssignments[a.name].previousStations.includes(workstation);
        let bWorkedYesterday = teamMemberAssignments[b.name].previousStations.includes(workstation);
        if (aWorkedYesterday && !bWorkedYesterday) return 1;
        if (!aWorkedYesterday && bWorkedYesterday) return -1;
        return 0;
    });

    // Shuffle candidates to introduce randomness among equally prioritized candidates
    candidates = shuffleArray(candidates);

    for (let tm of candidates) {
        // Check if assignment is valid
        if (!isValidAssignmentPrioritizeNewStation(tm, selectedQuarterIndex, workstation, teamMemberAssignments)) {
            continue;
        }

        // Assign team member
        schedule[quarter][workstation].push({ name: tm.name, lockState: 'none' });
        teamMemberAssignments[tm.name].assignments[selectedQuarterIndex] = workstation;

        // Save previous states to restore on backtrack
        let csAssignedBefore = teamMemberAssignments[tm.name].csAssigned;
        let backboardsAssignedBefore = teamMemberAssignments[tm.name].backboardsAssigned;

        if (wsIsCS(workstation)) {
            teamMemberAssignments[tm.name].csAssigned = true;
        }

        if (wsIsBackboards(workstation)) {
            teamMemberAssignments[tm.name].backboardsAssigned = true;
        }

        // Add workstation to assignedWorkstations for same station constraint
        teamMemberAssignments[tm.name].assignedWorkstations.push(workstation);

        // Recurse
        if (assignWorkstationsPrioritizeNewStationEnhanced(teamMemberAssignments, startTime, maxExecutionTime)) {
            return true;
        }

        // Backtrack
        schedule[quarter][workstation] = schedule[quarter][workstation].filter(a => a.name !== tm.name);
        teamMemberAssignments[tm.name].assignments[selectedQuarterIndex] = null;
        teamMemberAssignments[tm.name].csAssigned = csAssignedBefore;
        teamMemberAssignments[tm.name].backboardsAssigned = backboardsAssignedBefore;
        teamMemberAssignments[tm.name].assignedWorkstations.pop();
    }

    // If no assignment could be made, backtrack
    return false;
}

// Function to check validity with prioritization and avoid same station assignments
function isValidAssignmentPrioritizeNewStation(tm, quarterIndex, workstation, teamMemberAssignments) {
    // Check if the team member has already been assigned to this workstation
    if (teamMemberAssignments[tm.name].assignedWorkstations.includes(workstation)) {
        return false; // Constraint: no same station twice
    }

    // Iterate over constraints
    for (let constraint of constraints) {
        if (constraint.enabled) {
            switch (constraint.type) {
                case 'csOncePerDay':
                    if (wsIsCS(workstation) && teamMemberAssignments[tm.name].csAssigned) {
                        return false;
                    }
                    break;
                case 'noBackboardsAfterCS1':
                    let prevWorkstation = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWorkstation === "CS1" && wsIsBackboards(workstation)) {
                        return false;
                    }
                    break;
                case 'noHogBackToBack':
                    let prevWsHog = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWsHog && wsIsHog(prevWsHog) && wsIsHog(workstation)) {
                        return false;
                    }
                    break;
                case 'noSequencingBackToBack':
                    let prevWsSeq = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (prevWsSeq && wsIsSequencing(prevWsSeq) && wsIsSequencing(workstation)) {
                        return false;
                    }
                    break;
                case 'backboardsOncePerDay':
                    if (wsIsBackboards(workstation) && teamMemberAssignments[tm.name].backboardsAssigned) {
                        return false;
                    }
                    break;
                case 'noSequencingKitsBackToBack':
                    let prevWsSeqKit = quarterIndex > 0 ? teamMemberAssignments[tm.name].assignments[quarterIndex - 1] : null;
                    if (
                        prevWsSeqKit &&
                        ['Sequencing A', 'Sequencing B', 'Kits 1'].includes(prevWsSeqKit) &&
                        ['Sequencing A', 'Sequencing B', 'Kits 1'].includes(workstation)
                    ) {
                        return false;
                    }
                    break;
                default:
                    // Handle unknown constraint types if necessary
                    break;
            }
        }
    }

    // All constraints satisfied
    return true;
}

// Function to handle Export & Save Schedule
function exportAndSaveSchedule() {
    const today = new Date().toLocaleDateString();
    const currentSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy

    // Retrieve existing saved rotations from localStorage
    let savedRotations = localStorage.getItem("savedRotations");
    if (savedRotations) {
        savedRotations = JSON.parse(savedRotations);
    } else {
        savedRotations = [];
    }

    // Save the current schedule with the date
    savedRotations.push({
        date: today,
        schedule: currentSchedule
    });

    // Update localStorage
    localStorage.setItem("savedRotations", JSON.stringify(savedRotations));

    alert("Schedule exported and saved successfully!");

    // Render the latest snapshot chart
    renderSnapshotChart(currentSchedule);

    // Render the weekly stations graph
    renderWeeklyChart(savedRotations);
}

// Function to render Snapshot Chart using Chart.js
function renderSnapshotChart(currentSchedule) {
    const ctx = document.getElementById('snapshotChart').getContext('2d');

    // Prepare data
    const workstationsLabels = workstations;
    const teamMemberColors = generateColorArray(teamMembers.length);
    const datasets = teamMembers.map((tm, index) => {
        const data = workstations.map(ws => {
            // Check if the team member is assigned to this workstation in any quarter today
            let assigned = false;
            quarters.forEach(q => {
                if (currentSchedule[q][ws].some(a => a.name === tm.name)) {
                    assigned = true;
                }
            });
            return assigned ? 1 : 0;
        });
        return {
            label: tm.name,
            data: data,
            backgroundColor: teamMemberColors[index],
            hidden: false // Initialize as visible
        };
    });

    // Destroy existing chart if exists to avoid duplication
    if (window.snapshotChartInstance) {
        window.snapshotChartInstance.destroy();
    }

    window.snapshotChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: workstationsLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        display: false // Hide y-axis ticks
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return value === 1 ? label : null;
                        }
                    }
                }
            }
        }
    });
}

// Function to render Weekly Stations Graph using Chart.js
function renderWeeklyChart(savedRotations) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    const datesDiv = document.getElementById('weeklyDates'); // New line

    // Handle empty data
    if (savedRotations.length === 0) {
        if (window.weeklyChartInstance) {
            window.weeklyChartInstance.destroy();
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No data available for the weekly chart.", ctx.canvas.width / 2, ctx.canvas.height / 2);

        // Clear the dates display
        datesDiv.innerHTML = ""; // New line

        return;
    }

    // Get the last 7 days' rotations
    const last7Rotations = savedRotations.slice(-7);

    // New code: Collect dates of the rotations
    const rotationDates = last7Rotations.map(rotation => rotation.date);

    // Aggregate data: team member -> station -> count
    let dataMap = {};
    teamMembers.forEach(tm => {
        dataMap[tm.name] = {};
        workstations.forEach(ws => {
            dataMap[tm.name][ws] = 0;
        });
    });

    last7Rotations.forEach(rotation => {
        const rotationSchedule = rotation.schedule;
        quarters.forEach(q => {
            workstations.forEach(ws => {
                rotationSchedule[q][ws].forEach(assignment => {
                    if (dataMap[assignment.name] && dataMap[assignment.name][ws] !== undefined) {
                        dataMap[assignment.name][ws]++;
                    }
                });
            });
        });
    });

    // Prepare data for Chart.js
    const workstationsLabels = workstations;
    const teamMemberColors = generateColorArray(teamMembers.length);
    const datasets = teamMembers.map((tm, index) => {
        const data = workstationsLabels.map(ws => dataMap[tm.name][ws]);
        return {
            label: tm.name,
            data: data,
            backgroundColor: teamMemberColors[index],
            hidden: false // Initialize as visible
        };
    });

    // Destroy existing chart if exists to avoid duplication
    if (window.weeklyChartInstance) {
        window.weeklyChartInstance.destroy();
    }

    window.weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: workstationsLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // New code: Display the dates below the chart
    datesDiv.innerHTML = `<p>Dates included in this chart: ${rotationDates.join(', ')}</p>`;
}

// Function to reset the weekly data
function resetWeeklyData() {
    // Clear the saved rotations from localStorage
    localStorage.removeItem("savedRotations");
    alert("Weekly data has been reset.");
    // Re-render the weekly chart with empty data
    renderWeeklyChart([]);
}

// Utility Function to Generate an Array of Distinct Colors
function generateColorArray(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = i * (360 / numColors);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
}

// Function to toggle all datasets in a chart
function toggleAllDatasets(chartInstance, show) {
    chartInstance.data.datasets.forEach(function(dataset, index) {
        // Set the hidden property in the dataset's meta
        chartInstance.getDatasetMeta(index).hidden = !show;
    });
    chartInstance.update();
}

// Function to display the current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Event Listener for Export & Save Schedule Button
document.getElementById("exportScheduleBtn").addEventListener("click", exportAndSaveSchedule);

// Event Listeners
document.getElementById("rotateAllBtn").addEventListener("click", rotateAssignments);
document.getElementById("prioritizeNewStationBtn").addEventListener("click", rotateAssignmentsPrioritizeNewStation);
document.getElementById("addConstraintBtn").addEventListener("click", addConstraint);
document.getElementById("addTeamMemberBtn").addEventListener("click", addTeamMember);
document.getElementById("saveChangesBtn").addEventListener("click", saveData);

// Updated Event Listeners for Chart Buttons
// Snapshot Chart Buttons
document.getElementById("snapshotHideAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.snapshotChartInstance, false);
});
document.getElementById("snapshotShowAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.snapshotChartInstance, true);
});

// Weekly Chart Buttons
document.getElementById("weeklyHideAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.weeklyChartInstance, false);
});
document.getElementById("weeklyShowAllBtn").addEventListener("click", function() {
    toggleAllDatasets(window.weeklyChartInstance, true);
});

// Event Listener for Reset Week Button
document.getElementById("resetWeekBtn").addEventListener("click", resetWeeklyData);

// On Page Load, initialize data and generate the schedule and charts
window.onload = function() {
    // Load data
    loadData();

    // Initialize schedule
    initSchedule();

    // Generate constraints list
    generateConstraintsList();

    // Generate skills table
    generateSkillsTable();

    // Generate schedule (call rotateAssignments)
    rotateAssignments();

    // Generate schedule table
    generateScheduleTable();

    // Update unassigned team members box
    updateUnassignedBox();

    // Render charts with current schedule
    renderSnapshotChart(schedule);

    // Load saved rotations from localStorage
    let savedRotations = localStorage.getItem("savedRotations");
    if (savedRotations) {
        savedRotations = JSON.parse(savedRotations);
    } else {
        savedRotations = [];
    }

    // Render the weekly chart with the saved rotations
    renderWeeklyChart(savedRotations);

    // Display the current date
    displayCurrentDate();
}

// Rotate Quarter with Constraints
function rotateQuarter(q) {
    let quarterIndex = quarters.indexOf(q);

    // Prepare data structures for constraints
    let teamMemberAssignments = {};
    teamMembers.forEach(tm => {
        teamMemberAssignments[tm.name] = {
            assignments: Array(quarters.length).fill(null),
            assignedWorkstations: [],
            csAssigned: false,
            backboardsAssigned: false
        };
    });

    // Fill in existing assignments, excluding non-locked in the quarter being rotated
    for (let qIdx = 0; qIdx < quarters.length; qIdx++) {
        let quarterName = quarters[qIdx];
        workstations.forEach(ws => {
            schedule[quarterName][ws].forEach(assignment => {
                let name = assignment.name;
                let lockState = assignment.lockState;
                // Exclude non-locked assignments in the quarter being rotated
                if (quarterName !== q || lockState === 'locked' || lockState === 'training') {
                    teamMemberAssignments[name].assignments[qIdx] = ws;
                    teamMemberAssignments[name].assignedWorkstations.push(ws);
                    if (wsIsCS(ws)) {
                        teamMemberAssignments[name].csAssigned = true;
                    }
                    if (wsIsBackboards(ws)) {
                        teamMemberAssignments[name].backboardsAssigned = true;
                    }
                }
            });
        });
    }

    // Clear non-locked assignments only in 'schedule' for the quarter being rotated
    workstations.forEach(ws => {
        schedule[q][ws] = schedule[q][ws].filter(assignment => assignment.lockState === 'locked' || assignment.lockState === 'training');
    });

    // Start recursive assignment for this quarter
    const maxExecutionTime = 10000; // Maximum time in milliseconds
    const startTime = Date.now();

    if (assignWorkstationsForQuarterEnhanced(0, quarterIndex, teamMemberAssignments, startTime, maxExecutionTime)) {
        generateScheduleTable();
        updateUnassignedBox();
        // Update charts
        renderSnapshotChart(schedule);
    } else {
        alert(`No valid schedule could be generated for ${q} with the current constraints.`);
    }
}
