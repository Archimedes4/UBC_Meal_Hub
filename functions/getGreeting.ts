/*
  UBC_Menu_Hub
  Andrew Mainella
*/
/**
 * This function is for the game directory header.
 * @returns A string that represents the time of day.
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour <= 11) {
    // The time is eariler than eleven am
    return "Good Morning,"
  }
  if (hour <= 13) {
    // The time is eariler than one pm
    return "Good Day,"
  }
  if (hour <= 17) {
    // The time is eailer than five pm
    return "Good Afternoon,"
  }
  if (hour <= 21) {
    return "Good Evening,"
  }
  return "Good Night,"
}