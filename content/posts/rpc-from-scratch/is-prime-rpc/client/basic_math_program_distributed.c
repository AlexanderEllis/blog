// client/basic_math_program_distributed.c
#include <stdio.h>
#include <stdbool.h>

#include "is_prime_rpc_client.h"

int main(void) {
  // Prompt the user to enter a number.
  printf("Please enter a number: ");
  // Read the user's number. Assume they're entering a valid number.
  int input_number;
  scanf("%d", &input_number);

  // Check if it's prime, but now via the RPC library
  if (is_prime_rpc(input_number)) {
    printf("%d is prime\n", input_number);
  } else {
    printf("%d is not prime\n", input_number);
  }

  return 0;
}
