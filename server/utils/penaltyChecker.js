export const checkPenalties = (text) => {
  const penalties = [];

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  if (!hasEmail) {
    penalties.push({ priority: 'high', issue: 'No email address detected', fix: 'Add a professional email address near the top of your resume.' });
  }

  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(text);
  if (!hasPhone) {
    penalties.push({ priority: 'high', issue: 'No phone number detected', fix: 'Add a contact phone number near your email.' });
  }

  const hasDates = /(19|20)\d{2}/.test(text);
  if (!hasDates) {
    penalties.push({ priority: 'medium', issue: 'No employment/education dates detected', fix: 'Add start and end dates (month/year) for each role or degree.' });
  }

  const lowerText = text.toLowerCase();
  const standardSections = ['experience', 'education', 'skills'];
  const missingSections = standardSections.filter((s) => !lowerText.includes(s));
  if (missingSections.length > 0) {
    penalties.push({
      priority: 'medium',
      issue: `Missing standard section header(s): ${missingSections.join(', ')}`,
      fix: 'Use standard section titles (Experience, Education, Skills) so ATS parsers can categorize your content correctly.'
    });
  }

  return penalties;
};