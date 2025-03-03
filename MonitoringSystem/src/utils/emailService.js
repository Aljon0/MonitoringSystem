import emailjs from "emailjs-com";

// Initialize EmailJS with your user ID
emailjs.init("2Y84FbSDMj-oe5Ujt"); // Replace with your EmailJS user ID

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sends an email notification to the person in charge about an expiring requirement.
 * @param {string} toEmail - The email address of the person in charge.
 * @param {string} complianceName - The name of the compliance requirement.
 * @param {string} expirationDate - The expiration date of the requirement.
 */
export const sendExpirationNotificationEmail = async (toEmail, complianceName, expirationDate) => {
  try {
    // Validate the email address
    if (!validateEmail(toEmail)) {
      console.error("Invalid email address:", toEmail);
      return;
    }

    const templateParams = {
      to_email: toEmail,
      compliance_name: complianceName,
      expiration_date: expirationDate,
    };

    // Send the email using EmailJS
    const response = await emailjs.send(
      "service_xssvxlk", // Replace with your EmailJS service ID
      "template_nkclvfl", // Replace with your EmailJS template ID
      templateParams
    );

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};