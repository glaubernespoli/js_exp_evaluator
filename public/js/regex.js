/**
 * below regex doesn't work well on expressions with two or more parenthesis group, 
 * like: true && (false || (true && true) && false || (true && false)) && true || (true && false)
 * as it's a greedy expression and it evaluates all the way to the last ')'. How to fix?
 */
const pattern = '\(([^)].*)\)';