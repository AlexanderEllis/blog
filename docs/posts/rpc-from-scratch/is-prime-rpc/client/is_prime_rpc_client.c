// client/is_prime_rpc_client.c

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define SERVERPORT "5005"  // The port the server will be listening on.
#define SERVER "localhost"  // Assume localhost for now

#include "is_prime_rpc_client.h"

// Packs an int. We need to convert it from host order to network order.
int pack(int input) {
  return htons(input);
}

// Gets the IPv4 or IPv6 sockaddr.
void *get_in_addr(struct sockaddr *sa) {
  if (sa->sa_family == AF_INET) {
    return &(((struct sockaddr_in*)sa)->sin_addr);
  } else {
    return &(((struct sockaddr_in6*)sa)->sin6_addr);
  }
}

// Gets a socket to connect with.
int get_socket() {
  int sockfd;
  struct addrinfo hints, *server_info, *p;
  int number_of_bytes;

  memset(&hints, 0, sizeof hints);
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;  // We want to use TCP to ensure it gets there
  int return_value = getaddrinfo(SERVER, SERVERPORT, &hints, &server_info);
  if (return_value != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(return_value));
    exit(1);
  }

  // We end up with a linked-list of addresses, and we want to connect to the
  // first one we can
  for (p = server_info; p != NULL; p = p->ai_next) {
    // Try to make a socket with this one.
    if ((sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
      // Something went wrong getting this socket, so we can try the next one.
      perror("client: socket");
      continue;
    }
    // Try to connect to that socket.
    if (connect(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
      // If something went wrong connecting to this socket, we can close it and
      // move on to the next one.
      close(sockfd);
      perror("client: connect");
      continue;
    }

    // If we've made it this far, we have a valid socket and can stop iterating
    // through.
    break;
  }

  // If we haven't gotten a valid sockaddr here, that means we can't connect.
  if (p == NULL) {
    fprintf(stderr, "client: failed to connect\n");
    exit(2);
  }

  // Otherwise, we're good.
  return sockfd;
}

// Client side library for the is_prime RPC.
bool is_prime_rpc(int number) {

  // First, we need to pack the data, ensuring that it's sent across the
  // network in the right format.
  int packed_number = pack(number);

  // Now, we can grab a socket we can use to connect see how we can connect
  int sockfd = get_socket();

  // Send just the packed number.
  if (send(sockfd, &packed_number, sizeof packed_number, 0) == -1) {
    perror("send");
    close(sockfd);
    exit(0);
  }

  // Now, wait to receive the answer.
  int buf[1];  // Just receiving a single byte back that represents a boolean.
  int bytes_received = recv(sockfd, &buf, 1, 0);
  if (bytes_received == -1) {
    perror("recv");
    exit(1);
  }

  // Since we just have the one byte, we don't really need to do anything while
  // unpacking it, since one byte in reverse order is still just a byte.
  bool result = buf[0];

  // All done! Close the socket and return the result.
  close(sockfd);
  return result;
}
