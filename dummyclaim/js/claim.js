    const steps = document.querySelectorAll('.step');
    const stepLabels = ["stepLabel1", "stepLabel2", "stepLabel3", "stepLabel4"];
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const form = document.getElementById('claimForm');
    let currentStep = 0;

    function showStep(index) {
      steps.forEach((step, i) => {
        step.classList.toggle('hidden', i !== index);
        document.getElementById(stepLabels[i]).classList.toggle('text-blue-600', i === index);
        document.getElementById(stepLabels[i]).classList.toggle('text-gray-400', i !== index);
      });

      prevBtn.classList.toggle('hidden', index === 0);
      nextBtn.innerText = index === steps.length - 1 ? 'Submit' : 'Next';
    }

    function validateStep() {
      const inputs = steps[currentStep].querySelectorAll('input, textarea');
      for (let input of inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          return false;
        }
      }
      return true;
    }

    function gatherFormData() {
      const formData = new FormData(form);
      let output = "<ul class='list-disc ml-6'>";
      formData.forEach((value, key) => {
        output += `<li><strong>${key}</strong>: ${value}</li>`;
      });
      output += "</ul>";
      document.getElementById('reviewData').innerHTML = output;
    }

    nextBtn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        if (!validateStep()) return;
        currentStep++;
        if (currentStep === steps.length - 1) gatherFormData();
        showStep(currentStep);
      } else {
        alert("Claim submitted successfully!");
        form.reset();
        window.location.href = 'dashboard.html';
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });

    showStep(currentStep);