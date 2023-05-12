export const randomDigits = (digit: number): string => {
  const randomNum = Math.floor(Math.random() * 9999)

  return ('0'.repeat(digit) + randomNum.toString()).slice(-1 * digit)
}