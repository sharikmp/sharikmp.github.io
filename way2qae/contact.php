<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $whatsapp = $_POST["whatsapp"];
  $contact = $_POST["contact"];
  $query = $_POST["query"];

  // Set up email headers
  $to = "tnasmp2011@gmail.com"; // Change this to your email address
  $subject = "Contact Us Form Submission";
  $message = "Name: " . $name . "\n";
  $message .= "Email: " . $email . "\n";
  $message .= "WhatsApp: " . $whatsapp . "\n";
  $message .= "Contact Number: " . $contact . "\n";
  $message .= "Query: " . $query . "\n";
  $headers = "From: " . $email . "\r\n" .
    "Reply-To: " . $email . "\r\n" .
    "X-Mailer: PHP/" . phpversion();

  // Send email
    if (mail($to, $subject, $message, $headers)) {
    $response = "Thank you for your submission! We will get back to you soon.";
    } else {
    $response = "Failed to send email. Please try again later.";
    }
    
    // Return response to the form
    echo $response;
    }
?>
