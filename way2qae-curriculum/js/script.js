function renderSchedule(data) {
    const container = document.getElementById("schedule-container");
    container.innerHTML = ""; // Clear previous content

    data.forEach(entry => {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("container");

        // Left Panel
        const leftPanel = document.createElement("div");
        leftPanel.classList.add("left-panel");
        leftPanel.innerHTML = `<h1>${document.title} <br><br> > ${entry.week} <br><br> > ${entry.day}</h1>`;

        const goalSection = document.createElement("div");
        goalSection.classList.add("goal");
        goalSection.innerHTML = `<h2>> Goals:</h2>${entry.goals}`;
        leftPanel.appendChild(goalSection);

        // Right Panel
        const rightPanel = document.createElement("div");
        rightPanel.classList.add("right-panel");

        entry.sessions.forEach(session => {
            const section = document.createElement("div");
            section.classList.add("section");
            section.innerHTML = `<h2>${session.hour}</h2><ul>${session.topics.map(topic => `<li>${topic}</li>`).join("")}</ul>`;
            rightPanel.appendChild(section);
        });

        dayContainer.appendChild(leftPanel);
        dayContainer.appendChild(rightPanel);
        container.appendChild(dayContainer);
    });
}

