// js/quickUpload.js

// Elements
const claimIdSection = document.getElementById('claimIdSection');
const claimIdInput = document.getElementById('claimIdInput');
const claimIdSubmit = document.getElementById('claimIdSubmit');
const claimIdError = document.getElementById('claimIdError');
const showClaimId = document.getElementById('showClaimId');

const otpSection = document.getElementById('otpSection');
const otpInput = document.getElementById('otpInput');
const otpSubmit = document.getElementById('otpSubmit');
const resendOtp = document.getElementById('resendOtp');
const otpError = document.getElementById('otpError');

const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileError = document.getElementById('fileError');
const uploadSuccess = document.getElementById('uploadSuccess');
const docsTable = document.getElementById('docsTable');
const docsTbody = docsTable.querySelector('tbody');
const submitDocsBtn = document.getElementById('submitDocsBtn');
const finalSection = document.getElementById('finalSection');
const finalTbody = document.getElementById('finalTbody');

// State
let uploadedDocs = [];
const STATIC_CLAIM_ID = 'ABC123XYZ';
const STATIC_OTP = '2908';

// Claim ID submit
claimIdSubmit.addEventListener('click', () => {
  const val = claimIdInput.value.trim();
  const valid = /^[a-zA-Z0-9]{6,20}$/.test(val);
  if (!valid) {
    claimIdError.textContent = 'Claim ID must be 6–20 alphanumeric characters.';
    claimIdError.classList.remove('hidden');
    return;
  }
  if (val !== STATIC_CLAIM_ID) {
    claimIdError.textContent = `Use static ID: ${STATIC_CLAIM_ID}`;
    claimIdError.classList.remove('hidden');
    return;
  }
  claimIdError.classList.add('hidden');
  showClaimId.textContent = `Claim ID: ${STATIC_CLAIM_ID}`;
  otpSection.classList.remove('hidden');
});

// OTP flow
otpSubmit.addEventListener('click', () => {
  const code = otpInput.value.trim();
  if (code !== STATIC_OTP) {
    otpError.textContent = 'Invalid OTP.';
    otpError.classList.remove('hidden');
    return;
  }
  otpError.classList.add('hidden');
  uploadSection.classList.remove('hidden');
});
resendOtp.addEventListener('click', () => {
  alert('OTP resent: ' + STATIC_OTP);
});

// File upload
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  fileError.classList.add('hidden');
  uploadSuccess.classList.add('hidden');

  if (!file) {
    fileError.textContent = 'Please select a PDF file.';
    fileError.classList.remove('hidden');
    return;
  }
  if (file.type !== 'application/pdf') {
    fileError.textContent = 'Only PDF files are allowed.';
    fileError.classList.remove('hidden');
    return;
  }
  if (file.size > 1 * 1024 * 1024) {
    fileError.textContent = 'File must be 1MB or smaller.';
    fileError.classList.remove('hidden');
    return;
  }

  // Success
  uploadedDocs.push(file);
  uploadSuccess.classList.remove('hidden');

  // Update table
  docsTable.classList.remove('hidden');
  docsTbody.innerHTML = uploadedDocs.map((f, i) => {
    return `<tr>\n<td class='border p-2'>${i+1}</td>\n<td class='border p-2'>${f.name}</td>\n<td class='border p-2'>${(f.size/1024).toFixed(2)} KB</td>\n</tr>`;
  }).join('');

  submitDocsBtn.classList.remove('hidden');
});

// Submit documents
submitDocsBtn.addEventListener('click', () => {
  // Populate final section
  finalTbody.innerHTML = uploadedDocs.map((f, i) => {
    return `<tr>\n<td class='border p-2'>${i+1}</td>\n<td class='border p-2'>${f.name}</td>\n<td class='border p-2'>${(f.size/1024).toFixed(2)} KB</td>\n<td class='border p-2'><button class='text-blue-600 hover:underline' onclick='downloadDoc(${i})'>Download</button></td>\n</tr>`;
  }).join('');

  finalSection.classList.remove('hidden');
});

// Download mock
window.downloadDoc = function(idx) {
  const file = uploadedDocs[idx];
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
};