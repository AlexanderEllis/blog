// basic_math_program.c
#include <stdio.h>
#include <stdbool.h>

// Basic prime checker. This uses the 6k+-1 optimization
// (see https://en.wikipedia.org/wiki/Primality_test)
bool is_prime(int number) {
  // Check first for 2 or 3
  if (number == 2 || number == 3) {
    return true;
  }
  // Check for 1 or easy modulos
  if (number == 1 || number % 2 == 0 || number % 3 == 0) {
    return false;
  }
  // Now check all the numbers up to sqrt(number)
  int i = 5;
  while (i * i <= number) {
    // If we've found something (or something + 2) that divides it evenly, it's not
    // prime.
    if (number % i == 0 || number % (i + 2) == 0) {
      return false;
    }
    i += 6;
  }
  return true;
}

int main(void) {
  // Prompt the user to enter a number.
  printf("Please enter a number: ");
  // Read the user's number. Assume they're entering a valid number.
  int input_number;
  scanf("%d", &input_number);

  // Check if it's prime
  if (is_prime(input_number)) {
    printf("%d is prime\n", input_number);
  } else {
    printf("%d is not prime\n", input_number);
  }

  return 0;
}
